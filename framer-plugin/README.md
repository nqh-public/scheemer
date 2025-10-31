# Framer Component Exporter Plugin

Framer Plugin for extracting component metadata and structure as JSON files.

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Starts plugin at `https://localhost:5173` (or next available port).

### 3. Load Plugin in Framer

**Method 1: Plugin URL**
1. Open Framer Desktop App
2. Open your project
3. Click **Plugins** in toolbar
4. Select **Development** → **Open Plugin URL**
5. Enter: `https://localhost:5173`
6. Accept SSL certificate warning

**Method 2: Direct Link**
```
https://framer.com/plugins/open/
```

## Usage

### Basic Workflow

**Step 1: Select Components**
- Select frames or components on canvas
- Or edit a component to include the component master
- Plugin auto-refreshes when selection changes

**Step 2: Review Items**
- Plugin lists all exportable items
- Shows component name, type (Frame/Instance/Master), children count
- Component instances show original component name

**Step 3: Export**
1. Check items to export (use All/None buttons)
2. Click **Download** button
3. JSON files download to browser's default download folder

### Component Modes

**Regular Canvas**:
- Exports selected frames and component instances
- Message: "X item(s) selected"

**Component Editing Mode**:
- Auto-includes the component master (ComponentNode)
- Plus any selected variants/frames inside
- Message: "ComponentName master + X selected"

## Output Structure

### Export Data Format

Each JSON file contains:

```typescript
{
  name: string                    // Component/frame name
  type: "frame" | "component-instance" | "component-master"
  nodeType: string                // Framer node class (e.g., "ComponentInstanceNode")
  structure: {
    id: string
    name: string
    type: string
    visible: boolean
    locked: boolean
    childrenCount: number
    children: Array<{...}>        // Recursively nested children
  }
  properties: {
    // Position & Size
    x: number
    y: number
    width: number
    height: number
    rotation: number

    // Visual
    opacity: number
    backgroundColor: string
    backgroundImage: string
    backgroundGradient: {
      type: string
      angle: number
      stops: Array<{color: string, position: number}>
    }

    // Border
    borderRadius: number
    borderColor: string
    borderWidth: number
    borderStyle: string

    // Layout
    layoutType: string
    gap: number
    padding: number
    paddingTop: number
    paddingRight: number
    paddingBottom: number
    paddingLeft: number
    alignItems: string
    justifyContent: string
    flexDirection: string
    flexWrap: string

    // Text (if TextNode)
    text: string
    fontSize: number
    fontFamily: string
    fontWeight: number
    textAlign: string
    color: string
    lineHeight: number
    letterSpacing: number

    // Effects
    shadow: object
    blur: number

    // Constraints
    aspectRatio: number
    minWidth: number
    maxWidth: number
    minHeight: number
    maxHeight: number
    top: number | null
    right: number | null
    bottom: number | null
    left: number | null
    centerX: number | null
    centerY: number | null
  }
  componentInfo?: {               // Only for component instances/masters
    identifier: string
    insertURL: string | null
    componentName: string | null
    controls?: object             // Only for instances (control props)
  }
}
```

### Example Export

**Component Instance**:
```json
{
  "name": "Primary Button",
  "type": "component-instance",
  "nodeType": "ComponentInstanceNode",
  "structure": {
    "id": "abc123",
    "name": "Primary Button",
    "visible": true,
    "locked": false,
    "childrenCount": 2,
    "children": [
      {
        "id": "text-1",
        "name": "Label",
        "type": "TextNode",
        "text": "Click Me",
        "fontSize": 16,
        "children": []
      }
    ]
  },
  "properties": {
    "width": 120,
    "height": 40,
    "backgroundColor": "#007AFF",
    "borderRadius": 8,
    "padding": 12
  },
  "componentInfo": {
    "identifier": "component-btn-primary",
    "componentName": "Button",
    "controls": {
      "label": "Click Me",
      "variant": "primary"
    }
  }
}
```

## Plugin UI Features

### Header
- **Plugin title**: "Component Exporter"
- **Refresh button**: Manual refresh (plugin auto-refreshes on selection change)

### Message Bar
Shows current context:
- "Select frames or components on canvas" (nothing selected)
- "X item(s) selected" (regular canvas)
- "ComponentName master + X selected" (component editing mode)

### Item List
Each item shows:
- **Checkbox**: Select for export
- **Icon**: Type indicator (Box=Master, Copy=Instance, FileText=Frame, Type=Text, Image=SVG)
- **Name**: Component/frame name
- **Badge**: "MASTER" or "INSTANCE" (if component)
- **Details**: Component name • children count • dimensions (if not master)

### Footer
- **Selection controls**: All / None buttons
- **Selection counter**: (X/Total)
- **Download button**: Exports selected items as JSON files

## Development

### File Structure

```
framer-plugin/
├── src/
│   ├── app.tsx              # Main plugin UI (568 lines)
│   │                        # - Component extraction logic
│   │                        # - Selection tracking
│   │                        # - JSON export
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── components/
│       ├── Button.tsx       # Framer-styled button
│       ├── Checkbox.tsx     # Framer-styled checkbox
│       └── ScrollArea.tsx   # Scrollable container
├── public/
│   └── icon.svg             # Plugin icon
├── package.json
├── vite.config.ts           # Vite + React + mkcert (SSL)
├── tailwind.config.js       # Tailwind with Framer design tokens
├── framer.json              # Plugin metadata
└── README.md                # This file
```

### Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 6 + vite-plugin-framer
- **Styling**: Tailwind CSS with Framer design tokens
- **SSL**: vite-plugin-mkcert (self-signed cert for localhost)
- **Framer SDK**: framer-plugin ^3

### Framer APIs Used

**Selection Tracking**:
```typescript
framer.subscribeToSelection(async (selection) => {
  // Called when canvas selection changes
})
```

**Canvas Root**:
```typescript
const canvasRoot = await framer.getCanvasRoot()
// Detects component editing mode (canvasRoot.__class === "ComponentNode")
```

**Node Traversal**:
```typescript
const children = await node.getChildren()
// Recursively extracts nested children
```

### Build & Deploy

**Development**:
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
# Outputs to dist/
```

**Package for Distribution**:
```bash
npm run pack
# Creates .framer-plugin file for installation
```

## Framer Design Tokens

Plugin uses Framer's CSS variables for native look:

```css
/* Colors */
--framer-text                /* Primary text */
--framer-text-secondary      /* Secondary text */
--framer-text-tertiary       /* Tertiary text */
--framer-bg                  /* Background */
--framer-bg-secondary        /* Secondary background */
--framer-divider             /* Border/divider */
--framer-tint                /* Accent color */
--framer-tint-border         /* Accent border */

/* Defined in tailwind.config.js */
```

## Troubleshooting

### Plugin Doesn't Load

**Check dev server**:
```bash
npm run dev
# Should output: https://localhost:XXXX
```

**SSL certificate**: Accept browser warning for self-signed cert

**Port conflict**: Vite auto-assigns next available port if 5173 is taken

### "No items to export"

**Select components on canvas**:
- Click frames, component instances, or component masters
- Or open component editing mode

**Check message bar**: Shows selection status

### Download Fails

**Browser blocks downloads**: Check browser's download settings

**JSON too large**: Export fewer items at once (browser download limits vary)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the root directory.

## License

MIT - See [LICENSE](../LICENSE) file for details
