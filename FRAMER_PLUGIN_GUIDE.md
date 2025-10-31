# Framer Plugin Development Guide

**Purpose**: Build a Framer Plugin to export component data for the MCP server.

Based on Context7 research from `/websites/framer-developers`.

---

## Plugin Types & Modes

### Three Plugin Modes

**1. Canvas Mode** (✅ What we need)
- Runs inside Framer editor
- Access to **all APIs** (project, nodes, components, collections)
- Can read component code, metadata, structure
- **Use case**: Export component list with CDN URLs

**2. Image Mode**
- Limited to image editing
- Use case: Image filters, cropping, effects

**3. Edit Image Mode**
- Edit specific images
- Use case: Image optimization plugins

### Our Plugin Mode: **Canvas**

```json
{
  "id": "framer-component-exporter",
  "name": "Component Exporter",
  "modes": ["canvas"],
  "icon": "/icon.svg"
}
```

---

## What Framer Plugins CAN Do

### ✅ Access Project Data

**Get all code files**:
```javascript
import { getCodeFiles } from "framer-plugin"

const codeFiles = await getCodeFiles()
// Returns array of CodeFile objects with:
// - id, name, content, exports[]
```

**Get specific code file**:
```javascript
const file = await getCodeFile("file-id")
console.log(file.content) // Full TypeScript/JSX source
console.log(file.exports) // Exported components
```

### ✅ Store Plugin Data

**Save component metadata to project**:
```javascript
// Store component URLs in project data
await framer.setPluginData('component-urls', JSON.stringify({
  components: [
    {
      name: "Text_Opacity_Words",
      url: "https://framerusercontent.com/modules/.../Text_Opacity_Words.tsx",
      moduleId: "tZeNnpnvmiDYQPzAbHwZ",
      versionId: "Qxb5zOvlAey6fBucOifc"
    }
  ]
}))
```

**Read plugin data later**:
```javascript
const data = await framer.getPluginData('component-urls')
const parsed = JSON.parse(data)
```

### ✅ Navigate & Inspect Canvas

**Get current selection**:
```javascript
const selection = await framer.getSelection()
// Returns array of selected nodes
```

**Get node properties**:
```javascript
const node = await framer.getNode('node-id')
console.log(node.properties.componentIdentifier)
console.log(node.properties.controls) // Component props
```

---

## Architecture: Plugin + MCP Server

### Two-Part System (Like Unframer)

**Part 1: Framer Plugin** (runs in Framer editor)
- Lists all code files in project
- Extracts component metadata (name, exports, CDN URLs)
- Saves data via API or stores in project

**Part 2: MCP Server** (already built)
- Reads component data from plugin
- Downloads components from CDN
- Transforms to NQH patterns

### Data Flow

```
Framer Editor
  ↓ (Plugin runs)
[Framer Plugin]
  ↓ (extracts metadata)
{
  "components": [
    {"name": "Button", "url": "https://..."},
    {"name": "Card", "url": "https://..."}
  ]
}
  ↓ (stores in project or sends to API)
[Your API/Database] or [Project Data]
  ↓ (MCP server reads)
[Framer Export MCP]
  ↓ (downloads components)
[Local Files]
```

---

## Implementation Plan

### Phase 1: Create Plugin

**Step 1: Initialize plugin**:
```bash
cd apps/scheemer
npm create framer-plugin@latest -- --name framer-component-exporter
```

**Step 2: Configure plugin** (`framer.config.json`):
```json
{
  "id": "framer-component-exporter",
  "name": "Component Exporter",
  "modes": ["canvas"],
  "icon": "/icon.svg"
}
```

**Step 3: Build plugin UI** (`src/App.tsx`):
```tsx
import { framer } from "framer-plugin"
import { getCodeFiles } from "framer-plugin"
import { useState } from "react"

export function App() {
  const [components, setComponents] = useState([])

  const handleExtractComponents = async () => {
    // Get all code files
    const codeFiles = await getCodeFiles()

    // Extract component metadata
    const componentData = codeFiles.map(file => ({
      id: file.id,
      name: file.name,
      exports: file.exports,
      // Need to construct CDN URL from moduleId + versionId
      // (may need additional API calls or data sources)
    }))

    setComponents(componentData)

    // Save to project data
    await framer.setPluginData(
      'component-list',
      JSON.stringify(componentData)
    )

    alert(`Extracted ${componentData.length} components!`)
  }

  return (
    <main>
      <h1>Component Exporter</h1>
      <button onClick={handleExtractComponents}>
        Extract Components
      </button>

      <ul>
        {components.map(comp => (
          <li key={comp.id}>{comp.name}</li>
        ))}
      </ul>
    </main>
  )
}
```

### Phase 2: Extract CDN URLs

**Challenge**: CDN URLs require `moduleId` + `versionId`, which may not be directly available from Code File API.

**Solution A: Use Project Tree API**:
```javascript
// Fetch project tree (similar to what we saw in network tab)
const projectId = "Vn2I8BJCNgyby16NocWM"
const response = await fetch(
  `https://framer.com/projects/${projectId}/tree/15082.json`,
  {
    headers: {
      Authorization: `Bearer ${token}` // Available in plugin context?
    }
  }
)
```

**Solution B: Store URLs manually**:
- User opens DevTools once
- Copies component URLs from network tab
- Pastes into plugin UI
- Plugin stores in project data

### Phase 3: Integrate with MCP Server

**Option A: Direct file storage**:
```javascript
// Plugin writes to local file
const fs = require('fs') // If plugin has fs access
fs.writeFileSync('/tmp/framer-components.json', JSON.stringify(components))
```

**Option B: Project data storage**:
```javascript
// MCP server reads from Framer project data
// (requires project ID + access)
```

**Option C: HTTP API** (most robust):
```javascript
// Plugin POSTs to your API
await fetch('http://localhost:3000/api/components', {
  method: 'POST',
  body: JSON.stringify(components)
})

// MCP server reads from API
```

---

## Quick Start: Minimal Plugin

### 1. Create Plugin

```bash
cd /Users/huy/CODES/nqh/apps/scheemer
npm create framer-plugin@latest
# Name: framer-component-exporter
# Mode: canvas
```

### 2. Simple UI (`src/App.tsx`)

```tsx
import { framer } from "framer-plugin"
import { getCodeFiles } from "framer-plugin"

export function App() {
  const handleExport = async () => {
    const files = await getCodeFiles()

    const data = files.map(f => ({
      name: f.name,
      exports: f.exports.map(e => e.name)
    }))

    // Save to project
    await framer.setPluginData('components', JSON.stringify(data))

    // Show success
    framer.showUI()
    alert(`Saved ${data.length} components to project data!`)
  }

  return (
    <main>
      <button onClick={handleExport}>Export Component List</button>
    </main>
  )
}
```

### 3. Run Plugin

```bash
npm run dev
```

Opens in Framer → Plugin appears in toolbar → Click to run

### 4. Read from MCP Server

```javascript
// In MCP server tool
const projectData = await framer.getPluginData('components')
const components = JSON.parse(projectData)
// Now have component list without auth!
```

---

## Recommended Approach

### Hybrid: Manual CDN URLs + Plugin Metadata

**Why**: CDN URL structure is complex, easier to copy manually once.

**Step 1**: User runs plugin in Framer
- Plugin lists all components
- Shows in UI for confirmation

**Step 2**: User provides CDN URLs (manual, one-time)
- Open DevTools on published site
- Copy component URLs
- Paste into plugin or config file

**Step 3**: Plugin stores mapping
```javascript
{
  "Text_Opacity_Words": "https://framerusercontent.com/.../Text_Opacity_Words.tsx",
  "DateConverter": "https://framerusercontent.com/.../DateConverter.tsx"
}
```

**Step 4**: MCP server reads mapping
- No auth needed (CDN URLs are public)
- Plugin data stored in project (accessible via Framer)

---

## Resources

### Official Docs
- Plugin Quick Start: https://www.framer.com/developers/plugins-quick-start
- Canvas APIs: https://www.framer.com/developers/nodes
- Code File API: https://www.framer.com/developers/reference

### Next Steps

1. **Create minimal plugin** (5-10 minutes)
2. **Test component listing** (verify Code File API works)
3. **Add CDN URL mapping** (manual or automated)
4. **Integrate with MCP server** (read plugin data)

---

## Summary

**Framer Plugin enables**:
- ✅ Access to code file list (official API)
- ✅ Component metadata extraction
- ✅ Storage in project data (no external DB needed)
- ✅ Bypasses authentication issues (plugin runs in authenticated context)

**Architecture**:
```
[Framer Plugin] → Extracts metadata → Stores in project
                                         ↓
[MCP Server] ← Reads project data ← Downloads from CDN
```

**Effort**: 1-2 hours to build minimal plugin, test, integrate.

**Recommendation**: Start with minimal plugin (component listing), validate approach, then enhance with CDN URL automation if needed.
