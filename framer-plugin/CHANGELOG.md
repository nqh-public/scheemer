# Changelog

All notable changes to the Scheemer Framer Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-04

### Added

#### Core Functionality
- **Component metadata extraction** - Extract 40+ properties from Framer components
- **Visual property capture** - Colors, backgrounds, gradients, borders, opacity, shadows
- **Layout property extraction** - Flex, padding, gap, alignment, constraints
- **Text property extraction** - Fonts, sizes, weights, colors, alignment, line height
- **Position/sizing data** - x, y, width, height, pins, aspect ratios
- **Recursive child traversal** - Full component hierarchy extraction
- **Component mode support** - Auto-detect and include component masters when editing

#### User Interface
- **Real-time selection tracking** - Plugin updates automatically when canvas selection changes
- **Manual refresh option** - Refresh button for on-demand updates
- **Batch export** - Select multiple items for simultaneous JSON export
- **Selection helpers** - "All" / "None" buttons for quick selection management
- **Visual indicators** - Icons and badges distinguish frames, instances, and masters
- **Component details** - Show component name, children count, dimensions
- **Empty state guidance** - Clear messaging when no items selected

#### Export Features
- **JSON export format** - Structured data with name, type, structure, properties, componentInfo
- **Sanitized filenames** - Safe file naming (lowercase, hyphens, alphanumeric)
- **Multiple file export** - Downloads separate JSON file per selected item
- **Component instance data** - Includes control props for component instances
- **Component master data** - Full master definition when editing components

#### Developer Experience
- **TypeScript strict mode** - Full type safety throughout codebase
- **React 18** - Modern React with hooks and concurrent features
- **Vite 6** - Fast development server with HMR
- **Framer design tokens** - Native look matching Framer's UI
- **Self-signed SSL** - HTTPS dev server via vite-plugin-mkcert
- **Component testing** - Vitest + React Testing Library for UI components
- **ESLint + Prettier** - Code quality enforcement
- **Pre-commit hooks** - Automated quality checks before commits

#### Quality Assurance
- **GitHub Actions CI/CD** - Automated lint, typecheck, test, build on PR/push
- **File header enforcement** - @what/@why/@props documentation tags
- **File size limits** - ≤350 LOC for maintainability (app.tsx exempted)
- **Circular dependency detection** - Prevent import cycles
- **Semantic duplication detection** - Rule of 3 enforcement
- **Comprehensive README** - Installation, usage, troubleshooting docs

### Technical Details

#### Supported Node Types
- FrameNode (regular frames)
- ComponentInstanceNode (component instances with control props)
- ComponentNode (component masters when editing)
- TextNode (text layers)
- SVGNode (vector graphics)

#### Framer API Integration
- `framer.subscribeToSelection()` - Real-time selection tracking
- `framer.getCanvasRoot()` - Canvas context detection
- `node.getChildren()` - Recursive child extraction
- Component identifier/insertURL extraction
- Control props extraction for instances

#### Export Data Structure
```json
{
  "name": "Component Name",
  "type": "component-instance",
  "nodeType": "ComponentInstanceNode",
  "structure": {
    "id": "...",
    "name": "...",
    "visible": true,
    "locked": false,
    "childrenCount": 2,
    "children": [...]
  },
  "properties": {
    "width": 120,
    "height": 40,
    "backgroundColor": "#007AFF",
    ...
  },
  "componentInfo": {
    "identifier": "...",
    "componentName": "...",
    "controls": {...}
  }
}
```

### Dependencies

#### Production
- framer-plugin: ^3 (Framer Canvas API)
- react: ^18 (UI framework)
- react-dom: ^18 (React renderer)
- vite-plugin-mkcert: ^1 (SSL for dev server)

#### Development
- @vitejs/plugin-react-swc: ^3 (Fast React refresh)
- eslint: ^9 (Code linting)
- prettier: ^3 (Code formatting)
- typescript: ^5.3 (Type checking)
- vitest: ^4 (Testing framework)
- husky: ^9 (Git hooks)
- lint-staged: ^16 (Pre-commit linting)
- madge: ^8 (Circular dependency detection)
- jsinspect: ^0.12 (Semantic duplication detection)

### Use Cases

1. **Design-to-Code Translation** - Export component specs as JSON, parse programmatically, generate React components matching design
2. **Component Documentation** - Extract component variants and properties, document design system components, track structure changes
3. **Design QA** - Compare exported specs against implementation, validate dimensions/spacing/colors, verify component hierarchy

### Repository

- **Public Repository**: https://github.com/nqh-public/scheemer
- **Issue Tracker**: https://github.com/nqh-public/scheemer/issues
- **License**: MIT

---

## Future Roadmap (Planned)

### v1.1.0
- Keyboard navigation (Cmd+A, Escape, Enter, arrows)
- ARIA labels for accessibility
- React ErrorBoundary for graceful error handling
- ScrollArea component tests
- Performance optimizations (useCallback, useMemo)

### v1.2.0+
- Search/filter functionality
- Virtualization for long lists (100+ items)
- Export format options (CSV, Markdown, TypeScript interfaces)
- Export presets (minimal vs. full data)
- Batch export as ZIP file
- Dark mode support

---

[1.0.0]: https://github.com/nqh-public/scheemer/releases/tag/v1.0.0
