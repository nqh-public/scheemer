# Framer Marketplace Submission - Scheemer

**Plugin Name**: Scheemer (Component Exporter)
**Version**: 1.0.0
**Author**: Scheemer Contributors
**Category**: Design Tools / Developer Tools
**Pricing**: Free
**License**: MIT

---

## Short Description (1-2 sentences)

Export Framer component metadata and structure as JSON files. Extract 40+ properties including visual styles, layout, text, and nested children for design-to-code workflows, documentation, and QA.

---

## Long Description

Scheemer is a powerful Framer plugin that bridges design and development by exporting comprehensive component metadata as structured JSON files.

### Key Features

**Comprehensive Metadata Extraction** (40+ properties per component):
- Visual properties: colors, backgrounds, gradients, borders, opacity, shadows, blur
- Layout properties: flex, padding, gap, alignment, constraints, positioning
- Text properties: fonts, sizes, weights, colors, alignment, line height, letter spacing
- Structural data: dimensions, rotation, aspect ratios, pins, visibility, lock state

**Intelligent Component Detection**:
- Automatically distinguishes frames, component instances, and component masters
- Extracts control props from component instances
- Includes component master when editing components
- Recursive traversal of nested children with full hierarchy

**Real-Time Selection Tracking**:
- Plugin updates automatically when canvas selection changes
- Manual refresh option for on-demand updates
- Clear visual indicators showing current context (canvas vs. component editing mode)

**Batch Export Workflow**:
- Select multiple frames/components for simultaneous export
- "All" / "None" buttons for quick selection management
- Sanitized filenames (lowercase, hyphenated, alphanumeric)
- Each item exports as separate JSON file

**Native Framer Integration**:
- Uses Framer design tokens for seamless UI integration
- Supports both canvas and component editing modes
- Type indicators with icons (Box=Master, Copy=Instance, FileText=Frame, Type=Text, Image=SVG)
- Component details showing name, children count, dimensions

### Use Cases

**1. Design-to-Code Translation**
- Export component specifications as JSON
- Parse structure and properties programmatically
- Generate React components matching design exactly
- Automate frontend implementation from Framer designs

**2. Component Documentation**
- Extract component variants and their properties
- Document design system components automatically
- Track component structure changes over time
- Generate component specification sheets

**3. Design QA & Validation**
- Compare exported specs against implementation
- Validate dimensions, spacing, colors programmatically
- Verify component hierarchy matches design intent
- Ensure design-dev consistency

### How It Works

1. **Select** - Select frames or components on canvas (or open component editing mode)
2. **Review** - Plugin lists all exportable items with metadata preview
3. **Choose** - Check items to export (or use All/None buttons)
4. **Download** - Click Download to export selected items as JSON files

### JSON Export Format

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
    "padding": 12,
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center"
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

### Technical Highlights

- **Modern Tech Stack**: React 18 + TypeScript + Vite 6
- **Type Safety**: Strict TypeScript for reliability
- **Framer API v3**: Uses latest Canvas API features
- **Tested**: Component tests with Vitest + React Testing Library
- **Quality Assured**: CI/CD pipeline with automated checks
- **Well Documented**: Comprehensive README with troubleshooting

### Supported Node Types

- FrameNode (regular frames)
- ComponentInstanceNode (component instances with control props)
- ComponentNode (component masters when editing)
- TextNode (text layers)
- SVGNode (vector graphics)

---

## Installation & Usage

### Installation

1. Open Framer Desktop App
2. Open your project
3. Click **Plugins** in toolbar
4. Search for "Scheemer" or "Component Exporter"
5. Click **Install**

### Usage

**Basic Workflow**:
1. Select frames/components on canvas
2. Plugin lists exportable items automatically
3. Check items to export
4. Click **Download** button
5. JSON files download to browser's default folder

**Component Editing Mode**:
- Open component for editing
- Plugin auto-includes the component master
- Select additional variants/frames if needed
- Export as usual

**Keyboard Shortcuts** (Planned for v1.1.0):
- Cmd/Ctrl+A: Select all
- Escape: Deselect all
- Enter: Download selected

---

## Requirements

- Framer Desktop App (latest version recommended)
- Modern browser (Chrome, Firefox, Safari, Edge)
- No authentication required
- No external dependencies

---

## Privacy & Security

- **No data collection** - Plugin does not collect, store, or transmit user data
- **No external requests** - All processing happens locally in Framer
- **No analytics** - No tracking or telemetry
- **Open source** - Full source code available on GitHub

---

## Support & Documentation

- **GitHub Repository**: https://github.com/nqh-public/scheemer
- **Issue Tracker**: https://github.com/nqh-public/scheemer/issues
- **Documentation**: https://github.com/nqh-public/scheemer#readme
- **Changelog**: https://github.com/nqh-public/scheemer/blob/main/framer-plugin/CHANGELOG.md

For bugs, feature requests, or questions, please open an issue on GitHub.

---

## Roadmap

### v1.1.0 (Next Release)
- Keyboard navigation support
- Accessibility improvements (ARIA labels)
- Enhanced error handling
- Performance optimizations

### Future Plans
- Search/filter functionality
- Export format options (CSV, Markdown, TypeScript)
- Batch export as ZIP
- Export presets (minimal vs. full data)

---

## Screenshots

**Screenshot 1: Component List View**
- Shows plugin UI with multiple components selected
- Displays icons, badges, and component details
- Shows All/None selection buttons and counter

**Screenshot 2: Component Editing Mode**
- Plugin detecting component master automatically
- Shows "Button master + 3 selected" message
- Demonstrates component mode support

**Screenshot 3: Export Dialog**
- Multiple items checked for export
- Download button highlighted
- Shows selection counter (5/12)

**Screenshot 4: JSON Output Example**
- Sample JSON file open in code editor
- Shows clean, structured export format
- Highlights nested children structure

**Screenshot 5: Batch Export Workflow**
- Before/after showing multiple JSON files downloaded
- Demonstrates sanitized filenames
- Shows real-world usage with design system components

---

## Testing Instructions

### Test Account
Not required - plugin works with any Framer project.

### Test Scenario

1. **Create test components** in Framer:
   - Create a button component with text + icon
   - Create a card component with image + text
   - Create several instances with different control props

2. **Test basic export**:
   - Select 2-3 frames
   - Open plugin
   - Verify items appear in list
   - Check all items
   - Click Download
   - Verify JSON files download correctly

3. **Test component editing mode**:
   - Edit a component
   - Open plugin
   - Verify component master appears automatically
   - Select additional variants
   - Export and verify componentInfo includes control props

4. **Test edge cases**:
   - Empty selection (should show "Select frames on canvas")
   - Large component hierarchy (50+ nested children)
   - Components with special characters in names
   - Components with no children
   - Hidden/locked components

### Expected Behavior

- Plugin loads in <2 seconds
- Selection updates instantly
- Download completes without errors
- JSON files are valid (parseable)
- Filenames are sanitized (no spaces/special chars)
- Component properties match visual appearance in Framer

---

## License

MIT License - Free for personal and commercial use.

Copyright (c) 2025 Scheemer Contributors

---

## Contact

**Maintainer**: Scheemer Contributors
**Email**: (via GitHub Issues)
**GitHub**: https://github.com/nqh-public/scheemer
