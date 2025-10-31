/**
 * @what Framer CDN API client for fetching project metadata and component code
 * @why Abstracts Framer API authentication and provides typed responses for component export workflow
 * @exports FramerAPIClient class with methods to fetch projects, components, and dependencies
 * @depends Framer public API (https://api.framer.com/web), Framer CDN (framerusercontent.com)
 * @date 2025-10-30
 */

import type {
  FramerProject,
  FramerModule,
} from './types.js'

const FRAMER_API_BASE = 'https://api.framer.com/web'
const FRAMER_CDN_BASE = 'https://framerusercontent.com'
const HTTP_STATUS_UNAUTHORIZED = 401
const HTTP_STATUS_NOT_FOUND = 404

export class FramerAPIClient {
  private accessToken: string

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.FRAMER_ACCESS_TOKEN || ''

    if (!this.accessToken) {
      throw new Error(
        'FRAMER_ACCESS_TOKEN environment variable is required. ' +
        'Get your token from Framer project settings.'
      )
    }
  }

  /**
   * Extract project ID from Framer URL
   *
   * Examples:
   * - https://framer.com/projects/Project-Name--ABC123
   * - https://example.com (published site - requires manual ID)
   *
   * @param url Framer project URL or published site URL
   * @returns Project ID or null if can't extract
   */
  extractProjectId(url: string): string | null {
    // Try to extract from framer.com URL
    const framerMatch = url.match(/projects\/([^/?]+)/)
    if (framerMatch) {
      return framerMatch[1]
    }

    // For published sites, user must provide project ID separately
    return null
  }

  /**
   * Fetch project metadata from Framer API
   *
   * @param projectId Framer project ID
   * @returns Project metadata including component list
   */
  async getProjectMetadata(projectId: string): Promise<FramerProject> {
    const url = `${FRAMER_API_BASE}/projects/${projectId}?accessToken=${this.accessToken}&includeUsageData=true`

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === HTTP_STATUS_UNAUTHORIZED) {
        throw new Error(
          'Authentication failed. Check your FRAMER_ACCESS_TOKEN. ' +
          'Get a token from your Framer project settings.'
        )
      }

      if (response.status === HTTP_STATUS_NOT_FOUND) {
        throw new Error(
          `Project not found: ${projectId}. ` +
          'Verify the project ID is correct and the site is published.'
        )
      }

      throw new Error(
        `Failed to fetch project metadata: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    return this.normalizeProjectData(data)
  }

  /**
   * Fetch component code from Framer CDN
   *
   * @param moduleId Module ID
   * @param versionId Version ID
   * @param fileName Component file name (e.g., 'Button.tsx')
   * @returns Component source code
   */
  async getComponentCode(
    moduleId: string,
    versionId: string,
    fileName: string
  ): Promise<string> {
    const url = `${FRAMER_CDN_BASE}/modules/${moduleId}/${versionId}/${fileName}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch component ${fileName}: ${response.status} ${response.statusText}`
      )
    }

    return response.text()
  }

  /**
   * Fetch component dependencies manifest
   *
   * @param moduleId Module ID
   * @param versionId Version ID
   * @returns Dependencies JSON
   */
  async getComponentDependencies(
    moduleId: string,
    versionId: string
  ): Promise<Record<string, string>> {
    try {
      const url = `${FRAMER_CDN_BASE}/modules/${moduleId}/${versionId}/dependencies.json`

      const response = await fetch(url)

      if (!response.ok) {
        // Dependencies file may not exist for all modules
        return {}
      }

      const data = await response.json()
      return data as Record<string, string>
    } catch {
      // Return empty if dependencies file doesn't exist
      return {}
    }
  }

  /**
   * Normalize API response to internal types
   *
   * @param data Raw API response (Framer API project object)
   * @returns Normalized project data
   */
  private normalizeProjectData(
    data: Record<string, unknown> & {
      id?: string
      projectId?: string
      name?: string
      url?: string
      modules?: Array<Record<string, unknown> & {
        id: string
        versionId: string
        name: string
        components?: Array<Record<string, unknown> & {
          name: string
          path: string
          type?: string
        }>
      }>
      styles?: unknown
    }
  ): FramerProject {
    // TODO: Implement actual normalization based on real API response
    // This is a placeholder - will be updated after testing with real API

    const modules: FramerModule[] = (data.modules || []).map((mod) => ({
      id: mod.id,
      versionId: mod.versionId,
      name: mod.name,
      components: (mod.components || []).map((comp) => ({
        name: comp.name,
        path: comp.path,
        moduleId: mod.id,
        versionId: mod.versionId,
        url: `${FRAMER_CDN_BASE}/modules/${mod.id}/${mod.versionId}/${comp.path}`,
        type: (comp.type as string) || 'component',
      })),
    }))

    return {
      id: data.id || data.projectId || '',
      name: (data.name as string) || 'Untitled Project',
      url: (data.url as string) || '',
      modules,
      styles: data.styles,
    }
  }
}
