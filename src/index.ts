#!/usr/bin/env node

/**
 * Framer Export MCP Server
 *
 * Model Context Protocol server for exporting Framer components from published sites.
 *
 * Usage:
 *   node dist/index.js
 *
 * Environment Variables:
 *   FRAMER_ACCESS_TOKEN - Framer API access token (required)
 *
 * MCP Tools:
 *   - list_framer_projects: List components in a Framer project
 *   - export_framer_components: Export all components to local directory
 *   - get_component_code: Fetch single component source code
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

// Import tools
import { toolDefinitions } from './tool-definitions.js'
import {
  ExportComponentsSchema,
  exportFramerComponents,
} from './tools/export-components.js'
import {
  GetComponentSchema,
  getComponentCode,
} from './tools/get-component.js'
import {
  ListProjectsSchema,
  listFramerProjects,
} from './tools/list-projects.js'

// Import tool definitions

// Create MCP server
const server = new Server(
  {
    name: 'framer-export',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// Register tool: list_framer_projects
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolDefinitions,
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case 'list_framer_projects': {
        const input = ListProjectsSchema.parse(request.params.arguments)
        const result = await listFramerProjects(input)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      }

      case 'export_framer_components': {
        const input = ExportComponentsSchema.parse(request.params.arguments)
        const result = await exportFramerComponents(input)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      }

      case 'get_component_code': {
        const input = GetComponentSchema.parse(request.params.arguments)
        const result = await getComponentCode(input)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      }
    }
    throw error
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Framer Export MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Server error:', error)
  process.exit(1)
})
