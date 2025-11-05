/**
 * @what TypeScript type definitions for Framer plugin data structures
 * @why Provides type safety for Framer node properties and export data format
 * @exports FramerNode (Framer Canvas API node interface), ExportItem (JSON export structure)
 */

// Simple types for Framer nodes
export interface FramerNode {
  id: string
  name: string | null
  __class: string
  visible: boolean
  locked: boolean
  rotation: number
  opacity: number
  x?: number
  y?: number
  width?: number
  height?: number
  backgroundColor?: string
  backgroundImage?: string
  backgroundGradient?: unknown
  borderRadius?: number
  borderColor?: string
  borderWidth?: number
  borderStyle?: string
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: number
  textAlign?: string
  color?: string
  lineHeight?: number
  letterSpacing?: number
  layoutType?: string
  gap?: number
  padding?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  alignItems?: string
  justifyContent?: string
  flexDirection?: string
  flexWrap?: string
  shadow?: unknown
  blur?: unknown
  link?: string
  aspectRatio?: number
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  top?: number
  right?: number
  bottom?: number
  left?: number
  centerX?: number
  centerY?: number
  componentIdentifier?: string
  insertURL?: string | null
  componentName?: string | null
  getChildren(): Promise<FramerNode[]>
}

export interface ExportItem {
  id: string
  name: string | null
  type: "frame" | "component-instance" | "component-master"
  nodeType: string
  structure: Record<string, unknown>
  properties: Record<string, unknown>
  componentInfo?: Record<string, unknown>
}
