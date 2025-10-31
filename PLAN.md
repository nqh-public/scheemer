# Framer Component Export Tool

## Goal
Export Framer site components as React code without $120/month unframer subscription.

## Key Discovery
Unframer.co is a middleman. Framer's components are publicly accessible via CDN.

## API Endpoints

### 1. Get Project Metadata
```bash
GET https://api.framer.com/web/projects/{projectId}?accessToken={token}&includeUsageData=true
```
**Returns**: Component list, module IDs, project structure

### 2. Download Component Files
```bash
GET https://framerusercontent.com/modules/{moduleId}/{versionId}/{componentName}.tsx
GET https://framerusercontent.com/modules/{moduleId}/{versionId}/{componentName}.js
```
**Returns**: Raw component code (TypeScript/JavaScript)

### 3. Get Component Dependencies
```bash
GET https://framerusercontent.com/modules/{moduleId}/{versionId}/dependencies.json
```

## Tool Architecture

### CLI Tool: `framer-export`

**Input**: Framer project URL or ID
**Output**: `/tmp/framer-export/{projectName}/`

**Structure**:
```
framer-export/
├── src/
│   ├── fetch-project.ts      # Get project metadata
│   ├── download-components.ts # Download from CDN
│   ├── transform.ts           # Clean up imports/exports
│   └── extract-styles.ts      # Extract CSS/fonts
├── cli.ts                     # CLI entry point
└── types.ts                   # API response types
```

## Implementation Steps

1. **Parse Project URL** → Extract project ID
2. **Fetch Metadata** → Get component list from api.framer.com
3. **Download Components** → Fetch .tsx/.js files from framerusercontent.com
4. **Extract Styles** → Find CSS references, download fonts
5. **Transform Code** → Remove Framer-specific imports
6. **Generate Manifest** → List all components + dependencies

## Example Usage

```bash
# From project URL
npx framer-export https://framer.com/projects/Nails-By-Stella--Vn2I8BJCNgyby16NocWM

# From published site
npx framer-export https://nailsbystella.hu

# Output
Exported 23 components to /tmp/framer-export/nails-by-stella/
```

## Known Limitations

- Framer Motion dependencies need manual installation
- Custom code components may have runtime dependencies
- Animations may need adjustment for non-Framer environments

## Network Captures

**Project ID from URL**: `Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w`
**Component CDN URLs found**:
- `https://framerusercontent.com/modules/tZeNnpnvmiDYQPzAbHwZ/Qxb5zOvlAey6fBucOifc/Text_Opacity_Words.tsx`
- `https://framerusercontent.com/modules/2qJxXueOAV8HsVMGY4i4/oN5o4iacVos3o17LU2I6/DateConverter.tsx`

## Alternative: MCP Server

Instead of CLI, build MCP server for Claude integration:

**Tools**:
- `list_framer_projects` - List user's projects
- `export_framer_components(projectUrl)` - Export to local directory
- `get_component_code(componentUrl)` - Fetch single component

**Use Case**: "Export components from my Framer site" → automatic download + analysis
