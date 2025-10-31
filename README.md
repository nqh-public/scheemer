# Scheemer MCP Server

Model Context Protocol server for exporting Framer components from published sites.

## Overview

This MCP server enables Claude to export React components from Framer sites by accessing Framer's public CDN. It works with **published Framer sites only** (not unpublished/private projects).

**Key Features**:
- List components and modules in Framer projects
- Export full projects to local directories
- Fetch individual component source code
- Extract dependencies and generate summaries
- No Framer plugin required (uses public CDN)

## Architecture

**How It Works**:
1. Fetches project metadata from `api.framer.com`
2. Downloads component code from `framerusercontent.com`
3. Extracts dependencies from import statements
4. Generates summary reports

**Framer API Discovery** (from PLAN.md network captures):
- Project API: `GET https://api.framer.com/web/projects/{projectId}?accessToken={token}`
- Component CDN: `GET https://framerusercontent.com/modules/{moduleId}/{versionId}/{file}.tsx`

## Installation

### 1. Install Dependencies

```bash
cd apps/scheemer
npm install
```

### 2. Build TypeScript

```bash
npm run build
```

### 3. Get Framer Access Token

**Where to find it**:
- Open your Framer project
- Go to Settings → API
- Generate an access token
- Copy the token

**Set environment variable**:

```bash
export FRAMER_ACCESS_TOKEN="your-token-here"
```

Or add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
echo 'export FRAMER_ACCESS_TOKEN="your-token-here"' >> ~/.zshrc
source ~/.zshrc
```

### 4. Configure MCP Server

Add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "scheemer": {
      "command": "node",
      "args": ["/Users/huy/CODES/nqh/apps/scheemer/dist/index.js"],
      "env": {
        "FRAMER_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

**Note**: Replace `/Users/huy/CODES/nqh` with your actual monorepo path.

### 5. Restart Claude Code

```bash
# Restart Claude Code to load the new MCP server
```

## Usage

### Tool 1: List Framer Projects

Lists components and modules in a Framer project.

**Example (published site)**:

```
List components from https://nailsbystella.hu
Project ID: Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w
```

**Example (framer.com URL)**:

```
List components from https://framer.com/projects/My-Project--ABC123
```

**Returns**:
- Project metadata (name, URL, component count)
- List of modules
- List of all components with CDN URLs

### Tool 2: Export Framer Components

Exports all components to a local directory.

**Example**:

```
Export components from https://nailsbystella.hu to /tmp/scheemer/nails-by-stella
Project ID: Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w
```

**What it does**:
1. Fetches project metadata
2. Downloads all component `.tsx` files
3. Extracts dependencies
4. Generates `export-summary.json` report

**Output structure**:
```
/tmp/scheemer/nails-by-stella/
├── original/
│   ├── Text_Opacity_Words.tsx
│   ├── DateConverter.tsx
│   └── ... (all components)
└── export-summary.json
```

**Summary report includes**:
- Total components exported
- Total lines of code
- npm dependencies found
- List of exported files

### Tool 3: Get Component Code

Fetches source code for a single component.

**Example**:

```
Get code from https://framerusercontent.com/modules/tZeNnpnvmiDYQPzAbHwZ/Qxb5zOvlAey6fBucOifc/Text_Opacity_Words.tsx
```

**Returns**:
- Full component source code
- Line count
- Extracted dependencies

## How to Find Project ID

For **published Framer sites**:

1. Visit the published site (e.g., https://nailsbystella.hu)
2. Open browser DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Look for requests to `api.framer.com`
6. Find the project ID in the URL or response

**Example from PLAN.md**:
- Site: https://nailsbystella.hu
- Project ID: `Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w`

For **framer.com URLs**, the project ID is in the URL:
- URL: `https://framer.com/projects/My-Project--ABC123`
- Project ID: `My-Project--ABC123`

## Limitations

**What works**:
- ✅ Published Framer sites (public CDN access)
- ✅ Fetching component source code
- ✅ Extracting npm dependencies
- ✅ Multiple components per project

**What doesn't work**:
- ❌ Unpublished/private projects (requires Framer Plugin)
- ❌ Automatic design token transformation (see transformation plugin below)
- ❌ CMS data replacement (placeholders kept as-is)
- ❌ Animation conversion (Framer Motion kept as-is)

## Transformation Plugin (Planned)

**Status**: Not yet implemented. Current export keeps all code in original form.

**Planned features** (based on user requirements):
- Generate `framer-*` prefixed design tokens when can't auto-map to `@nqh/styles`
- Keep Framer responsive breakpoints as CSS custom properties
- Extract typography and generate `framer-font-*` tokens
- Keep CMS placeholders for manual data source implementation
- Summary-only transformation reports

**Workaround for now**: Manually adapt exported components to NQH patterns.

## Development

### Run in Development Mode

```bash
npm run dev
```

### Test MCP Server Locally

```bash
# In one terminal, run the server
node dist/index.js

# In another terminal, send test input
echo '{"method":"tools/list","params":{}}' | node dist/index.js
```

### Project Structure

```
apps/scheemer/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/                # 3 MCP tools
│   │   ├── list-projects.ts
│   │   ├── export-components.ts
│   │   └── get-component.ts
│   ├── framer-cdn/           # Framer API client
│   │   ├── api-client.ts
│   │   ├── download.ts
│   │   └── types.ts
│   └── transform/            # Transformation plugin (TODO)
│       └── plugin.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### "FRAMER_ACCESS_TOKEN environment variable is required"

**Solution**: Set the token in `~/.claude.json` or as an environment variable.

### "Authentication failed. Check your FRAMER_ACCESS_TOKEN"

**Solutions**:
1. Verify token is correct (copy from Framer project settings)
2. Check token hasn't expired
3. Ensure project has API access enabled

### "Project not found"

**Solutions**:
1. Verify the site is **published** (unpublished sites not supported)
2. Check project ID is correct (see "How to Find Project ID")
3. Ensure your token has access to this project

### "Could not extract project ID from URL"

**Solution**: For published sites, provide the `projectId` parameter explicitly:

```json
{
  "projectUrl": "https://nailsbystella.hu",
  "projectId": "Nails-By-Stella-Explore--Vn2I8BJCNgyby16NocWM-75A2w"
}
```

### "Failed to fetch component"

**Solutions**:
1. Check CDN URL is correct (should be `framerusercontent.com`)
2. Verify component exists in the published site
3. Check network connectivity

## Contributing

This is part of the NQH monorepo. All changes must follow:
- Constitutional principles (`.specify/memory/constitution.md`)
- Pre-commit hooks (`pnpm pre-commit`)
- Evidence-based completion (file:line references required)

## Related

- **PLAN.md** - Original discovery and architecture planning
- **@nqh/styles** - Design token system for transformation
- **@nqh/hui** - Component library for mapping Framer components

## License

MIT
