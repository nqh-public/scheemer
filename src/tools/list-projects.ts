/**
 * @what MCP tool handler for listing Framer project modules and components
 * @why Implements tool interface for project discovery and component enumeration
 * @exports listFramerProjects async function with ListProjectsSchema validation
 * @depends FramerAPIClient (project metadata retrieval), zod (input validation)
 * @date 2025-10-30
 */

import { z } from 'zod'
import { FramerAPIClient } from '@/framer-export/src/framer-cdn/api-client.js'

export const ListProjectsSchema = z.object({
  projectUrl: z.string().describe(
    'Specific Framer project URL to fetch details for. ' +
    'Example: https://framer.com/projects/Project-Name--ABC123 or https://nailsbystella.hu'
  ),
  projectId: z.string().optional().describe(
    'Project ID (required for published sites if not extractable from URL). ' +
    'Example: "Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w"'
  ),
  accessToken: z.string().optional().describe(
    'Framer access token (optional if FRAMER_ACCESS_TOKEN env var is set)'
  ),
})

export type ListProjectsInput = z.infer<typeof ListProjectsSchema>

export interface ListProjectsResult {
  project: {
    id: string
    name: string
    url: string
    componentCount: number
    moduleCount: number
  }
  modules: Array<{
    id: string
    name: string
    componentCount: number
  }>
  components: Array<{
    name: string
    type: 'component' | 'override'
    url: string
  }>
}

export async function listFramerProjects(
  input: ListProjectsInput
): Promise<ListProjectsResult> {
  // Initialize client
  const client = new FramerAPIClient(input.accessToken)

  // Extract or use provided project ID
  let projectId = input.projectId || client.extractProjectId(input.projectUrl)

  if (!projectId) {
    throw new Error(
      'Could not extract project ID from URL. ' +
      'Please provide projectId parameter for published sites. ' +
      'Example: "Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w"'
    )
  }

  // Fetch project metadata
  const project = await client.getProjectMetadata(projectId)

  // Count components
  const totalComponents = project.modules.reduce(
    (sum, mod) => sum + mod.components.length,
    0
  )

  // Format modules
  const modules = project.modules.map((mod) => ({
    id: mod.id,
    name: mod.name,
    componentCount: mod.components.length,
  }))

  // Format components
  const components = project.modules.flatMap((mod) =>
    mod.components.map((comp) => ({
      name: comp.name,
      type: comp.type,
      url: comp.url,
    }))
  )

  return {
    project: {
      id: project.id,
      name: project.name,
      url: project.url,
      componentCount: totalComponents,
      moduleCount: project.modules.length,
    },
    modules,
    components,
  }
}
