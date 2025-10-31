/**
 * Type definitions for Framer CDN API responses
 *
 * Based on network captures from published Framer sites.
 * API endpoints:
 * - GET https://api.framer.com/web/projects/{projectId}
 * - GET https://framerusercontent.com/modules/{moduleId}/{versionId}/{file}
 */

export interface FramerProject {
  id: string
  name: string
  url: string
  modules: FramerModule[]
  styles?: FramerStyles
}

export interface FramerModule {
  id: string
  versionId: string
  name: string
  components: FramerComponent[]
}

export interface FramerComponent {
  name: string
  path: string
  moduleId: string
  versionId: string
  url: string
  type: 'component' | 'override'
}

export interface FramerStyles {
  fonts?: FramerFont[]
  colors?: Record<string, string>
  breakpoints?: Record<string, number>
}

export interface FramerFont {
  family: string
  url: string
  weight?: number
  style?: string
}

export interface ExportResult {
  projectId: string
  projectName: string
  outputPath: string
  components: ExportedComponent[]
  styles: ExportedStyles
  summary: ExportSummary
  transformReport: TransformReport
}

export interface ExportedComponent {
  name: string
  originalPath: string
  exportedPath: string
  dependencies: string[]
  type: 'component' | 'override'
}

export interface ExportedStyles {
  tokensGenerated: number
  fontsExported: number
  breakpointsCreated: number
  cssPath: string
}

export interface ExportSummary {
  totalComponents: number
  totalLines: number
  dependencies: string[]
  bundleSizeEstimate?: string
}

export interface TransformReport {
  componentsExported: number
  tokensGenerated: string[]
  componentsKeptOriginal: number
  cmsPlaceholders: number
}
