# Framer Component Exporter Plugin

**Purpose**: Extract component metadata from Framer projects for use with the MCP server.

**Location**: `apps/scheemer/framer-plugin/`

---

## What It Does

**Problem**: Framer's project metadata API requires authentication, making automated component exports difficult.

**Solution**: This plugin runs **inside Framer editor** (authenticated context) and:
1. Lists all code components in the project
2. Extracts component metadata (name, exports, ID)
3. Stores data in project for external access
4. Provides JSON export for manual use

---

## Features

### ✅ Component Extraction
- Uses Framer's `getCodeFiles()` API
- Extracts component names and exports
- No authentication issues (runs in Framer context)

### ✅ Project Data Storage
- Saves to project via `setPluginData()`
- Data persists with project
- Accessible by external tools (future: MCP integration)

### ✅ User Interface
- "Extract Components" button - fetches all components
- "Load Saved" button - loads previously extracted data
- "Copy JSON" button - copies component list to clipboard
- Component list display with exports
- Status messages for feedback

---

## Installation

### 1. Navigate to Plugin Directory

```bash
cd /Users/huy/CODES/nqh/apps/scheemer/framer-plugin
```

### 2. Install Dependencies (Already Done)

Dependencies were installed during `npm create framer-plugin`.

### 3. Start Development Server

```bash
npm run dev
```

This starts the plugin dev server on `https://localhost:5173` (or similar port).

### 4. Open Plugin in Framer

1. **Open Framer Desktop App**
2. **Open your project** (e.g., Nails by Stella)
3. **Click "Plugins" in toolbar**
4. **Select "Development" → "Open Plugin URL"**
5. **Enter**: `https://localhost:5173`
6. **Accept SSL certificate** (dev server uses self-signed cert)

**Or use this direct link**:
```
https://framer.com/plugins/open/
```

---

## Usage

### Step 1: Run Plugin in Framer

1. Open your Framer project
2. Load the plugin (see Installation step 4)
3. Plugin UI appears in center of screen

### Step 2: Extract Components

1. Click **"Extract Components"** button
2. Plugin fetches all code files via `getCodeFiles()`
3. Component list appears below
4. Status message shows: `✅ Extracted X components!`

### Step 3: Access Component Data

**Option A: Copy JSON to Clipboard**
1. Click **"Copy JSON"** button
2. Paste into text editor or MCP server config
3. Use for manual component URL mapping

**Option B: Saved in Project**
- Data automatically saved via `setPluginData()`
- Key: `"component-metadata"`
- Format:
  ```json
  {
    "exportedAt": "2025-10-30T17:00:00.000Z",
    "totalComponents": 15,
    "components": [
      {
        "id": "file-123",
        "name": "Text_Opacity_Words.tsx",
        "exports": ["Text_Opacity_Words", "default"]
      }
    ]
  }
  ```

**Option C: Load Saved Data**
- Click **"Load Saved"** button
- Loads previously extracted data from project
- Useful after reopening Framer

---

## Integration with MCP Server

### Current State

**Plugin**: ✅ Extracts component metadata
**MCP Server**: ✅ Downloads components from CDN

**Missing Link**: CDN URL mapping

### Why CDN URLs Are Not Included

The `getCodeFiles()` API returns:
- ✅ Component name
- ✅ Component exports
- ✅ Component source code
- ❌ Module ID (needed for CDN URL)
- ❌ Version ID (needed for CDN URL)

**CDN URL format**:
```
https://framerusercontent.com/modules/{moduleId}/{versionId}/{fileName}
```

### Workaround: Manual URL Mapping

**Step 1**: Extract components with plugin (get names)

**Step 2**: Find CDN URLs manually:
1. Open published site (e.g., nailsbystella.hu)
2. DevTools → Network tab → Filter "framerusercontent.com"
3. Copy component URLs

**Step 3**: Create mapping file:
```json
{
  "Text_Opacity_Words.tsx": "https://framerusercontent.com/modules/.../Text_Opacity_Words.tsx",
  "DateConverter.tsx": "https://framerusercontent.com/modules/.../DateConverter.tsx"
}
```

**Step 4**: Use MCP server with mapping

---

## File Structure

```
framer-plugin/
├── framer.json          # Plugin config (ID, name, modes)
├── package.json         # Dependencies
├── vite.config.ts       # Vite build config
├── tsconfig.json        # TypeScript config
├── src/
│   ├── App.tsx          # Main plugin UI (component extraction)
│   ├── main.tsx         # Entry point
│   └── App.css          # Styles
├── public/
│   └── icon.svg         # Plugin icon
└── PLUGIN_README.md     # This file
```

---

## Development

### Run Dev Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Test in Framer

1. Make code changes in `src/App.tsx`
2. Vite hot-reloads automatically
3. Refresh plugin in Framer to see changes

---

## Plugin API Reference

### Framer APIs Used

**`getCodeFiles()`**:
```typescript
import { getCodeFiles } from "framer-plugin"

const files = await getCodeFiles()
// Returns: CodeFile[]
// Each file has: id, name, exports[], content
```

**`setPluginData(key, value)`**:
```typescript
await framer.setPluginData("component-metadata", JSON.stringify(data))
// Stores data in project (max 2KB per key, 4KB total)
```

**`getPluginData(key)`**:
```typescript
const saved = await framer.getPluginData("component-metadata")
const data = JSON.parse(saved)
// Retrieves stored data
```

### Component Data Structure

```typescript
interface ComponentInfo {
  id: string           // Framer internal ID
  name: string         // File name (e.g., "Button.tsx")
  exports: string[]    // Exported component names
}
```

---

## Troubleshooting

### "getCodeFiles is not a function"

**Solution**: Ensure `framer-plugin` package is installed:
```bash
npm install framer-plugin
```

### Plugin Doesn't Load in Framer

**Solutions**:
1. Check dev server is running (`npm run dev`)
2. Verify URL is correct (`https://localhost:5173`)
3. Accept SSL certificate warning
4. Try Chrome if Safari has issues

### "No components found"

**Solutions**:
1. Ensure project has code components (not just visual layers)
2. Check Framer console for errors
3. Try "Load Saved" if data was extracted before

### Plugin Data Storage Limits

**Limits**:
- 2KB per key
- 4KB total across all keys
- Strings only (use JSON.stringify for objects)

**If exceeding limits**:
- Use "Copy JSON" instead of storage
- Reduce data (exclude `content` field)
- Split into multiple keys

---

## Next Steps

### Future Enhancements

**1. CDN URL Extraction**
- Research Framer's internal module/version ID mapping
- Automate CDN URL generation
- Full automation without manual URL discovery

**2. MCP Server Integration**
- Read plugin data directly from Framer project
- Requires Framer project file access
- Alternative: HTTP API for plugin data

**3. Batch Export**
- Export all components with one click
- Generate component → URL mapping automatically
- Save to local file system

---

## Related Files

- **MCP Server**: `../src/` (TypeScript MCP server)
- **Plugin Guide**: `../FRAMER_PLUGIN_GUIDE.md` (development guide)
- **Auth Update**: `../AUTHENTICATION_UPDATE.md` (why plugin is needed)
- **Status**: `../STATUS.md` (current project status)

---

## Summary

✅ **Plugin extracts** component metadata from Framer
✅ **Data stored** in project via `setPluginData()`
✅ **UI provides** extraction, loading, and clipboard export
⏳ **Manual step** still needed for CDN URL mapping
🔧 **Future enhancement**: Automate CDN URL extraction

**Current workflow**:
1. Run plugin in Framer → Extract components
2. Find CDN URLs in DevTools (one-time)
3. Create manual mapping
4. Use MCP server to download components

**Plugin is production-ready** for component metadata extraction!
