/**
 * @what Framer plugin for extracting component metadata and exporting as JSON
 * @why Enable structured data export from Framer designs for analysis and documentation
 * @props None - root component manages internal state
 */
import { framer } from "framer-plugin"
import { useState, useEffect } from "react"
import { Button } from "./components/Button"
import { Checkbox } from "./components/Checkbox"
import { ScrollArea } from "./components/ScrollArea"
import type { FramerNode, ExportItem } from "./types"

// Inline SVG icons (from Lucide)
const Icon = ({ children, size = 16 }: { children: React.ReactNode, size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {children}
    </svg>
)

const BoxIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
    </Icon>
)

const CopyIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Icon>
)

const FileTextIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </Icon>
)

const TypeIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
    </Icon>
)

const ImageIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </Icon>
)

const RefreshIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Icon>
)

// Icon mapping for node types
const getNodeIcon = (nodeType: string, itemType: ExportItem["type"]) => {
    if (itemType === "component-master") return <BoxIcon size={16} />
    if (itemType === "component-instance") return <CopyIcon size={16} />
    if (nodeType === "TextNode") return <TypeIcon size={16} />
    if (nodeType === "SVGNode") return <ImageIcon size={16} />
    return <FileTextIcon size={16} />
}

export function App() {
    const [items, setItems] = useState<ExportItem[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        framer.showUI({
            position: "center",
            width: 400,
            height: 500,
        })

        // Subscribe to selection changes
        const unsubscribe = framer.subscribeToSelection(async (selection) => {
            await updateItemsFromSelection(selection)
        })

        // Initial load
        updateItemsFromSelection([])

        return () => {
            unsubscribe()
        }
    }, [])

    const updateItemsFromSelection = async (selection: unknown[]) => {
        try {
            setError(null)
            const allItems: ExportItem[] = []

            // Check if we're inside a component editing mode
            const canvasRoot = await framer.getCanvasRoot()
            const isInComponentMode = canvasRoot.__class === "ComponentNode"

            // Helper to serialize gradient
            const serializeGradient = (gradient: unknown) => {
                if (!gradient) return null
                const g = gradient as Record<string, unknown>
                return {
                    type: g.__class,
                    angle: g.angle,
                    x: g.x,
                    y: g.y,
                    width: g.width,
                    height: g.height,
                    stops: (g.stops as Array<Record<string, unknown>>)?.map((stop) => ({
                        color: stop.color,
                        position: stop.position,
                    })) || [],
                }
            }

            // Recursively extract children
            const extractChildren = async (nodes: unknown[]): Promise<unknown[]> => {
                return await Promise.all(
                    nodes.map(async (rawChild) => {
                        const child = rawChild as FramerNode
                        const childChildren = await child.getChildren()
                        return {
                            id: child.id,
                            name: child.name,
                            type: child.__class,
                            visible: child.visible,
                            locked: child.locked,
                            x: child.x,
                            y: child.y,
                            width: child.width,
                            height: child.height,
                            rotation: child.rotation,
                            opacity: child.opacity,
                            backgroundColor: child.backgroundColor,
                            backgroundImage: child.backgroundImage,
                            backgroundGradient: serializeGradient(child.backgroundGradient),
                            borderRadius: child.borderRadius,
                            text: child.text,
                            fontSize: child.fontSize,
                            fontFamily: child.fontFamily,
                            fontWeight: child.fontWeight,
                            textAlign: child.textAlign,
                            color: child.color,
                            children: childChildren.length > 0 ? await extractChildren(childChildren) : [],
                        }
                    })
                )
            }

            // If we're in component editing mode, add the ComponentNode itself
            if (isInComponentMode) {
                const componentChildren = await canvasRoot.getChildren()
                const componentChildrenData = componentChildren.length > 0 ? await extractChildren(componentChildren) : []

                const root = canvasRoot as unknown as FramerNode
                allItems.push({
                    id: `component-master-${root.id}`,
                    name: root.name || "Unnamed Component",
                    type: "component-master" as const,
                    nodeType: "ComponentNode",
                    structure: {
                        id: root.id,
                        name: root.name,
                        type: "ComponentNode",
                        visible: root.visible,
                        locked: root.locked,
                        childrenCount: componentChildren.length,
                        children: componentChildrenData,
                    },
                    properties: {},
                    componentInfo: {
                        identifier: root.componentIdentifier,
                        insertURL: root.insertURL,
                        componentName: root.componentName,
                    },
                })
            }

            // Only add selected frames/components (exclude code components)
            if (selection.length > 0) {
                const items: ExportItem[] = await Promise.all(
                    selection.map(async (rawNode) => {
                        const node = rawNode as unknown as FramerNode
                        const nodeClass = node.__class
                        const children = await node.getChildren()
                        const childrenData = children.length > 0 ? await extractChildren(children) : []

                        // Base properties common to all nodes
                        const baseProperties = {
                            // Position & Size
                            x: node.x,
                            y: node.y,
                            width: node.width,
                            height: node.height,
                            rotation: node.rotation,

                            // Visual
                            opacity: node.opacity,
                            backgroundColor: node.backgroundColor,
                            backgroundImage: node.backgroundImage,
                            backgroundGradient: serializeGradient(node.backgroundGradient),

                            // Border
                            borderRadius: node.borderRadius,
                            borderColor: node.borderColor,
                            borderWidth: node.borderWidth,
                            borderStyle: node.borderStyle,

                            // Layout
                            layoutType: node.layoutType,
                            gap: node.gap,
                            padding: node.padding,
                            paddingTop: node.paddingTop,
                            paddingRight: node.paddingRight,
                            paddingBottom: node.paddingBottom,
                            paddingLeft: node.paddingLeft,
                            alignItems: node.alignItems,
                            justifyContent: node.justifyContent,
                            flexDirection: node.flexDirection,
                            flexWrap: node.flexWrap,

                            // Text (if TextNode)
                            text: node.text,
                            fontSize: node.fontSize,
                            fontFamily: node.fontFamily,
                            fontWeight: node.fontWeight,
                            textAlign: node.textAlign,
                            color: node.color,
                            lineHeight: node.lineHeight,
                            letterSpacing: node.letterSpacing,

                            // Effects
                            shadow: node.shadow,
                            blur: node.blur,

                            // Link
                            link: node.link,

                            // Constraints
                            aspectRatio: node.aspectRatio,
                            minWidth: node.minWidth,
                            maxWidth: node.maxWidth,
                            minHeight: node.minHeight,
                            maxHeight: node.maxHeight,

                            // Pins (positioning constraints)
                            top: node.top,
                            right: node.right,
                            bottom: node.bottom,
                            left: node.left,
                            centerX: node.centerX,
                            centerY: node.centerY,
                        }

                        // Check if this is a ComponentNode (master definition)
                        if (nodeClass === "ComponentNode") {
                            return {
                                id: `component-master-${node.id}`,
                                name: node.name || "Unnamed Component",
                                type: "component-master" as const,
                                nodeType: nodeClass,
                                structure: {
                                    id: node.id,
                                    name: node.name,
                                    type: nodeClass,
                                    visible: node.visible,
                                    locked: node.locked,
                                    childrenCount: children.length,
                                    children: childrenData,
                                },
                                properties: {
                                    // ComponentNode doesn't have visual properties, only structure
                                },
                                componentInfo: {
                                    identifier: node.componentIdentifier,
                                    insertURL: node.insertURL,
                                    componentName: node.componentName,
                                },
                            }
                        }

                        // Check if this is a ComponentInstanceNode
                        if (nodeClass === "ComponentInstanceNode") {
                            return {
                                id: `component-instance-${node.id}`,
                                name: node.name || "Unnamed Component",
                                type: "component-instance" as const,
                                nodeType: nodeClass,
                                structure: {
                                    id: node.id,
                                    name: node.name,
                                    type: nodeClass,
                                    visible: node.visible,
                                    locked: node.locked,
                                    childrenCount: children.length,
                                    children: childrenData,
                                },
                                properties: baseProperties,
                                componentInfo: {
                                    identifier: node.componentIdentifier,
                                    insertURL: node.insertURL,
                                    componentName: node.componentName,
                                    controls: {},
                                },
                            }
                        }

                        // Regular frame
                        return {
                            id: `frame-${node.id}`,
                            name: node.name,
                            type: "frame" as const,
                            nodeType: nodeClass,
                            structure: {
                                id: node.id,
                                name: node.name,
                                type: nodeClass,
                                visible: node.visible,
                                locked: node.locked,
                                childrenCount: children.length,
                                children: childrenData,
                            },
                            properties: baseProperties,
                        }
                    })
                )
                allItems.push(...items)
            }

            setItems(allItems)

            // Update message based on context
            if (isInComponentMode) {
                const root = canvasRoot as unknown as FramerNode
                const componentName = root.componentName || "Component"
                if (selection.length === 0) {
                    setMessage(`${componentName} master + select variants/frames`)
                } else {
                    setMessage(`${componentName} master + ${selection.length} selected`)
                }
            } else if (selection.length === 0) {
                setMessage("Select frames on canvas to export")
            } else {
                setMessage(`${selection.length} item(s) selected`)
            }
        } catch (err) {
            console.error("Error updating items:", err)
            setError(err instanceof Error ? err.message : "Failed to load items")
        }
    }


    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const selectAll = () => {
        setSelectedIds(new Set(items.map(c => c.id)))
    }

    const deselectAll = () => {
        setSelectedIds(new Set())
    }

    const handleRefresh = async () => {
        setLoading(true)
        const selection = await framer.getSelection()
        await updateItemsFromSelection(selection)
        setLoading(false)
    }

    const handleDownload = () => {
        const selectedItems = items.filter(c => selectedIds.has(c.id))

        if (selectedItems.length === 0) {
            setMessage("⚠️ No files selected")
            return
        }

        selectedItems.forEach(item => {
            const exportData: Record<string, unknown> = {
                name: item.name,
                type: item.type,
                nodeType: item.nodeType,
                structure: item.structure,
                properties: item.properties,
            }

            // Add component info if it's a component instance
            if (item.type === "component-instance" && item.componentInfo) {
                exportData.componentInfo = item.componentInfo
            }

            const content = JSON.stringify(exportData, null, 2)
            const sanitizedName = (item.name ?? 'unnamed').replace(/[^a-z0-9_-]/gi, '_')
            const filename = `${sanitizedName}.json`

            const blob = new Blob([content], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        })

        setMessage(`📥 Downloaded ${selectedItems.length} file(s)!`)
    }


    return (
        <main className="flex flex-col h-full w-full max-w-[400px] text-framer-text overflow-hidden box-border">
            {/* Header */}
            <header className="flex items-center justify-between p-3 border-b border-framer-divider flex-shrink-0">
                <h1 className="m-0 text-base font-semibold">Component Exporter</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={loading}
                    title="Refresh"
                    aria-label="Refresh"
                >
                    <div className={loading ? "animate-spin" : ""}>
                        <RefreshIcon size={14} />
                    </div>
                </Button>
            </header>

            {/* Error bar */}
            {error && (
                <div className="px-3 py-2 text-xs text-red-600 bg-red-50 border-b border-red-200 flex-shrink-0 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">✕</button>
                </div>
            )}

            {/* Message bar */}
            {message && !error && (
                <div className="px-3 py-2 text-xs text-framer-text-secondary bg-framer-bg-secondary border-b border-framer-divider flex-shrink-0">
                    {message}
                </div>
            )}

            {/* Items list */}
            <ScrollArea className="flex-1 p-2">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-framer-text-tertiary">
                        <FileTextIcon size={32} />
                        <p className="text-sm">Select frames or components on canvas</p>
                        <p className="text-xs">They will appear here for export</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`
                                    relative flex items-start gap-2 p-2 rounded-md cursor-pointer border transition-all
                                    ${selectedIds.has(item.id)
                                        ? "border-framer-tint-border bg-framer-tint shadow-sm"
                                        : "border-transparent bg-framer-bg-secondary hover:bg-framer-bg"
                                    }
                                `}
                                onClick={() => toggleSelection(item.id)}
                            >
                                <Checkbox
                                    checked={selectedIds.has(item.id)}
                                    onCheckedChange={() => toggleSelection(item.id)}
                                    className="mt-0.5 shrink-0"
                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                />

                                <div className="flex items-center justify-center w-8 h-8 rounded bg-framer-bg shrink-0 text-framer-text">
                                    {getNodeIcon(item.nodeType, item.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <strong className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                                            {item.name ?? "Unnamed"}
                                        </strong>
                                        {item.type !== "frame" && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-framer-tint text-white font-semibold uppercase shrink-0">
                                                {item.type === "component-master" ? "MASTER" : "INSTANCE"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-framer-text-tertiary">
                                        {typeof item.componentInfo?.componentName === 'string' && (
                                            <span>{item.componentInfo.componentName} • </span>
                                        )}
                                        <span>{typeof item.structure.childrenCount === 'number' ? item.structure.childrenCount : 0} children</span>
                                        {item.type !== "component-master" && typeof item.properties?.width === 'number' && typeof item.properties?.height === 'number' && (
                                            <span> • {Math.round(item.properties.width)}×{Math.round(item.properties.height)}px</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Info bar */}
            {items.length > 0 && (
                <div className="flex items-center justify-between px-3 py-2 border-t border-framer-divider flex-shrink-0">
                    <span className="text-xs text-framer-text-secondary">
                        ({selectedIds.size}/{items.length})
                    </span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={selectAll}>
                            All
                        </Button>
                        <Button variant="outline" size="sm" onClick={deselectAll}>
                            None
                        </Button>
                    </div>
                </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
                <div className="p-3 border-t border-framer-divider flex-shrink-0 flex justify-end">
                    <Button
                        variant="default"
                        onClick={handleDownload}
                        disabled={selectedIds.size === 0}
                    >
                        Download {selectedIds.size > 0 ? `${selectedIds.size} File${selectedIds.size > 1 ? 's' : ''}` : 'Files'}
                    </Button>
                </div>
            )}
        </main>
    )
}
