/**
 * @what MCP tool handler for fetching single component source code
 * @why Implements tool interface for CDN URL parsing and component code retrieval
 * @exports getComponentCode async function with GetComponentSchema validation
 * @depends FramerAPIClient (component fetching), zod (validation), URL parsing (regex)
 * @date 2025-10-30
 */

import { z } from 'zod'
import { FramerAPIClient } from '@/framer-export/src/framer-cdn/api-client.js'

export const GetComponentSchema = z.object({
  componentUrl: z.string().describe(
    'Direct URL to Framer component on CDN. ' +
    'Example: https://framerusercontent.com/modules/{moduleId}/{versionId}/Button.tsx'
  ),
  accessToken: z.string().optional().describe(
    'Framer access token (optional if FRAMER_ACCESS_TOKEN env var is set)'
  ),
})

export type GetComponentInput = z.infer<typeof GetComponentSchema>

export interface GetComponentResult {
  url: string
  fileName: string
  code: string
  lines: number
  dependencies: string[]
}

export async function getComponentCode(
  input: GetComponentInput
): Promise<GetComponentResult> {
  // Parse URL to extract module ID, version ID, and file name
  const urlPattern = /framerusercontent\.com\/modules\/([^/]+)\/([^/]+)\/(.+)$/
  const match = input.componentUrl.match(urlPattern)

  if (!match) {
    throw new Error(
      'Invalid component URL format. Expected: ' +
      'https://framerusercontent.com/modules/{moduleId}/{versionId}/{fileName}'
    )
  }

  const [, moduleId, versionId, fileName] = match

  // Initialize client
  const client = new FramerAPIClient(input.accessToken)

  // Fetch component code
  const code = await client.getComponentCode(moduleId, versionId, fileName)

  // Extract dependencies from imports
  const dependencies = extractDependencies(code)

  return {
    url: input.componentUrl,
    fileName,
    code,
    lines: code.split('\n').length,
    dependencies,
  }
}

/**
 * Extract npm dependencies from import statements
 */
function extractDependencies(code: string): string[] {
  const dependencies = new Set<string>()

  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g
  let match

  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1]

    // Skip relative imports
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      continue
    }

    // Extract package name (handle scoped packages)
    const packageName = importPath.startsWith('@')
      ? importPath.split('/').slice(0, 2).join('/')
      : importPath.split('/')[0]

    dependencies.add(packageName)
  }

  return Array.from(dependencies).sort()
}
