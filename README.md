# Scheemer - Framer Component Exporter

Framer Plugin that exports component metadata and structure as JSON files.

## What It Does

Runs inside Framer editor to extract:
- **Component structure** - Nested children hierarchy
- **Visual properties** - Colors, backgrounds, gradients, borders, opacity
- **Layout properties** - Flex, padding, gap, alignment, constraints
- **Text properties** - Fonts, sizes, weights, colors, alignment
- **Position/sizing** - x, y, width, height, pins, aspect ratios

Supports:
- Regular frames
- Component instances (with control props)
- Component masters (when editing components)

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/huy/CODES/nqh/apps/scheemer/framer-plugin
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Starts plugin at `https://localhost:5173`

### 3. Load in Framer

1. Open Framer Desktop App
2. Open your project
3. Click **Plugins** in toolbar
4. Select **Development** → **Open Plugin URL**
5. Enter: `https://localhost:5173`
6. Accept SSL certificate

### 4. Use Plugin

1. Select frames/components on canvas
2. Plugin lists them with metadata
3. Check items to export
4. Click **Download** → Downloads JSON files

## Output Format

Each exported file contains:

```json
{
  "name": "Button",
  "type": "component-instance",
  "nodeType": "ComponentInstanceNode",
  "structure": {
    "id": "abc123",
    "name": "Button",
    "visible": true,
    "locked": false,
    "childrenCount": 3,
    "children": [...]
  },
  "properties": {
    "width": 120,
    "height": 40,
    "backgroundColor": "#007AFF",
    "borderRadius": 8,
    "padding": 12,
    ...
  },
  "componentInfo": {
    "identifier": "component-id",
    "componentName": "Button",
    "controls": {...}
  }
}
```

## Full Documentation

See [framer-plugin/README.md](./framer-plugin/README.md) for:
- Complete installation guide
- Plugin UI features
- Data structure reference
- Development workflow
- Troubleshooting

## Use Cases

**Design-to-Code Translation**:
- Export component specs as JSON
- Parse structure/properties programmatically
- Generate React components matching design

**Component Documentation**:
- Extract component variants and their properties
- Document design system components
- Track component structure changes

**Design QA**:
- Compare exported specs against implementation
- Validate dimensions, spacing, colors
- Verify component hierarchy

## Project Structure

```
apps/scheemer/
├── README.md                    # This file
└── framer-plugin/               # Framer Plugin source
    ├── src/
    │   ├── app.tsx              # Main plugin UI (568 lines)
    │   ├── main.tsx             # Entry point
    │   └── components/          # UI components (Button, Checkbox, ScrollArea)
    ├── package.json
    ├── vite.config.ts
    └── README.md                # Plugin documentation
```

## Contributing

This is part of the NQH monorepo. All changes must follow:
- Constitutional principles (`.specify/memory/constitution.md`)
- Pre-commit hooks (`pnpm pre-commit`)
- Evidence-based completion (file:line references required)

## License

MIT
