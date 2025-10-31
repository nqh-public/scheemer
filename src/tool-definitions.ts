/**
 * @what MCP tool definition schemas for Framer export operations
 * @why Declares tool interfaces for MCP server registration with input/output schemas
 * @exports toolDefinitions array with list_framer_projects, export_framer_components, get_component_code tool specs
 * @date 2025-10-30
 */

export const toolDefinitions = [
  {
    name: 'list_framer_projects',
    description:
      'List components and modules in a specific Framer project. ' +
      'Requires a project URL (framer.com/projects/...) or published site URL with projectId. ' +
      'Returns project metadata, modules, and available components.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectUrl: {
          type: 'string',
          description:
            'Framer project URL (e.g., https://framer.com/projects/Project-Name--ABC123) ' +
            'or published site URL (e.g., https://nailsbystella.hu)',
        },
        projectId: {
          type: 'string',
          description:
            'Project ID (required for published sites if not extractable from URL). ' +
            'Example: "Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w"',
        },
        accessToken: {
          type: 'string',
          description:
            'Framer access token (optional if FRAMER_ACCESS_TOKEN env var is set)',
        },
      },
      required: ['projectUrl'],
    },
  },
  {
    name: 'export_framer_components',
    description:
      'Export all components from a Framer project to a local directory. ' +
      'Downloads component source code (.tsx files) and generates a summary report. ' +
      'Components are saved in their original form (no transformation applied). ' +
      'Requires write access to the specified output path.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectUrl: {
          type: 'string',
          description:
            'Framer project URL or published site URL. ' +
            'For published sites, also provide projectId parameter.',
        },
        projectId: {
          type: 'string',
          description:
            'Framer project ID (required for published sites). ' +
            'Example: "Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w"',
        },
        outputPath: {
          type: 'string',
          description:
            'Local directory path where components will be exported. ' +
            'Example: "/tmp/framer-export/my-project"',
        },
        accessToken: {
          type: 'string',
          description:
            'Framer access token (optional if FRAMER_ACCESS_TOKEN env var is set)',
        },
      },
      required: ['projectUrl', 'outputPath'],
    },
  },
  {
    name: 'get_component_code',
    description:
      'Fetch source code for a single Framer component from CDN. ' +
      'Requires a direct CDN URL (framerusercontent.com/modules/...). ' +
      'Returns component code, line count, and extracted dependencies. ' +
      'Useful for inspecting individual components before full export.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        componentUrl: {
          type: 'string',
          description:
            'Direct URL to Framer component on CDN. ' +
            'Example: https://framerusercontent.com/modules/{moduleId}/{versionId}/Button.tsx',
        },
        accessToken: {
          type: 'string',
          description:
            'Framer access token (optional if FRAMER_ACCESS_TOKEN env var is set)',
        },
      },
      required: ['componentUrl'],
    },
  },
]
