/**
 * @what Component downloader for fetching and persisting Framer components to disk
 * @why Orchestrates API calls, file system operations, and dependency extraction for export workflow
 * @exports ComponentDownloader class with methods to download components and extract dependencies
 * @depends fs/promises (file system), path (file path utilities), FramerAPIClient (API access)
 * @date 2025-10-30
 */

import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { FramerAPIClient } from './api-client.js'
import type { FramerComponent, ExportedComponent } from './types.js'

const MINIFIED_SIZE_RATIO = 0.4
const BYTES_PER_KB = 1024

export class ComponentDownloader {
  constructor(private client: FramerAPIClient) {}

  /**
   * Download all components from a project
   *
   * @param components List of components to download
   * @param outputPath Base output directory
   * @returns List of exported components with paths
   */
  async downloadComponents(
    components: FramerComponent[],
    outputPath: string
  ): Promise<ExportedComponent[]> {
    const exported: ExportedComponent[] = []

    for (const component of components) {
      try {
        const result = await this.downloadComponent(component, outputPath)
        exported.push(result)
      } catch (error) {
        console.error(
          `Failed to download ${component.name}:`,
          error instanceof Error ? error.message : 'Unknown error'
        )
        // Continue with other components even if one fails
      }
    }

    return exported
  }

  /**
   * Download a single component
   *
   * @param component Component metadata
   * @param outputPath Base output directory
   * @returns Exported component info
   */
  async downloadComponent(
    component: FramerComponent,
    outputPath: string
  ): Promise<ExportedComponent> {
    // Fetch component code
    const code = await this.client.getComponentCode(
      component.moduleId,
      component.versionId,
      component.path
    )

    // Fetch dependencies
    const dependencies = await this.client.getComponentDependencies(
      component.moduleId,
      component.versionId
    )

    // Determine output file path
    const fileName = component.path.endsWith('.tsx')
      ? component.path
      : `${component.path}.tsx`

    const filePath = join(outputPath, 'original', fileName)

    // Ensure directory exists
    await mkdir(dirname(filePath), { recursive: true })

    // Write component code
    await writeFile(filePath, code, 'utf-8')

    return {
      name: component.name,
      originalPath: component.url,
      exportedPath: filePath,
      dependencies: Object.keys(dependencies),
      type: component.type,
    }
  }

  /**
   * Extract npm dependencies from component code
   *
   * Parses import statements to find external dependencies.
   *
   * @param code Component source code
   * @returns List of npm package names
   */
  extractDependencies(code: string): string[] {
    const dependencies = new Set<string>()

    // Match import statements
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

  /**
   * Count lines of code
   *
   * @param code Source code
   * @returns Number of lines
   */
  countLines(code: string): number {
    return code.split('\n').length
  }

  /**
   * Estimate bundle size
   *
   * Rough estimate based on minified size.
   *
   * @param code Source code
   * @returns Estimated size string (e.g., "12KB")
   */
  estimateBundleSize(code: string): string {
    // Rough estimate: minified size is ~40% of original
    const bytes = code.length * MINIFIED_SIZE_RATIO
    const kb = Math.round(bytes / BYTES_PER_KB)
    return `${kb}KB`
  }
}
