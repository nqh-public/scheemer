/**
 * @what MCP tool handler for exporting all Framer project components
 * @why Implements tool interface for download orchestration, file writing, and report generation
 * @exports exportFramerComponents async function with ExportComponentsSchema validation
 * @depends FramerAPIClient (project metadata), ComponentDownloader (file operations), zod (validation)
 * @date 2025-10-30
 */

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'
import { FramerAPIClient } from '@/framer-export/src/framer-cdn/api-client.js'
import { ComponentDownloader } from '@/framer-export/src/framer-cdn/download.js'
import type { ExportResult } from '@/framer-export/src/framer-cdn/types.js'

const JSON_INDENT = 2

export const ExportComponentsSchema = z.object({
  projectUrl: z.string().describe(
    'Framer project URL (e.g., https://framer.com/projects/Project-Name--ABC123) ' +
    'or published site URL (e.g., https://nailsbystella.hu). ' +
    'For published sites, also provide projectId parameter.'
  ),
  projectId: z.string().optional().describe(
    'Framer project ID (required for published sites). ' +
    'Example: "Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w"'
  ),
  outputPath: z.string().describe(
    'Local directory path where components will be exported. ' +
    'Example: "/tmp/framer-export/my-project"'
  ),
  accessToken: z.string().optional().describe(
    'Framer access token (optional if FRAMER_ACCESS_TOKEN env var is set). ' +
    'Get from Framer project settings.'
  ),
})

export type ExportComponentsInput = z.infer<typeof ExportComponentsSchema>

export async function exportFramerComponents(
  input: ExportComponentsInput
): Promise<ExportResult> {
  // Initialize clients
  const client = new FramerAPIClient(input.accessToken)
  const downloader = new ComponentDownloader(client)

  // Extract or use provided project ID
  let projectId = input.projectId || client.extractProjectId(input.projectUrl)

  if (!projectId) {
    throw new Error(
      'Could not extract project ID from URL. ' +
      'Please provide projectId parameter for published sites.'
    )
  }

  // Fetch project metadata
  const project = await client.getProjectMetadata(projectId)

  // Collect all components from all modules
  const allComponents = project.modules.flatMap((mod) => mod.components)

  if (allComponents.length === 0) {
    throw new Error(
      `No components found in project ${project.name}. ` +
      'Verify the project has published components.'
    )
  }

  // Download components
  const exportedComponents = await downloader.downloadComponents(
    allComponents,
    input.outputPath
  )

  // Calculate summary statistics
  const allDependencies = new Set<string>()
  let totalLines = 0

  for (const component of exportedComponents) {
    component.dependencies.forEach((dep) => allDependencies.add(dep))

    // Count lines from exported file
    try {
      const fs = await import('fs/promises')
      const code = await fs.readFile(component.exportedPath, 'utf-8')
      totalLines += downloader.countLines(code)
    } catch {
      // Skip if can't read file
    }
  }

  const summary = {
    totalComponents: exportedComponents.length,
    totalLines,
    dependencies: Array.from(allDependencies).sort(),
  }

  // Create transform report
  const transformReport = {
    componentsExported: exportedComponents.length,
    tokensGenerated: [], // Will be populated by transform plugin
    componentsKeptOriginal: exportedComponents.length, // All kept original (no transform yet)
    cmsPlaceholders: 0, // Will be detected by transform plugin
  }

  // Write summary report
  const reportPath = join(input.outputPath, 'export-summary.json')
  await mkdir(input.outputPath, { recursive: true })
  await writeFile(
    reportPath,
    JSON.stringify(
      {
        project: {
          id: project.id,
          name: project.name,
          url: project.url,
        },
        summary,
        components: exportedComponents,
        transformReport,
      },
      null,
      JSON_INDENT
    ),
    'utf-8'
  )

  return {
    projectId: project.id,
    projectName: project.name,
    outputPath: input.outputPath,
    components: exportedComponents,
    styles: {
      tokensGenerated: 0,
      fontsExported: 0,
      breakpointsCreated: 0,
      cssPath: '',
    },
    summary,
    transformReport,
  }
}
