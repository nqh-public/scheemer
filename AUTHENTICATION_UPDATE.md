# Authentication Update - Important Discovery

## What We Found

During testing with Chrome DevTools MCP, we discovered:

**❌ Your PLAN.md assumption was incorrect**:
```bash
# This doesn't work:
GET https://api.framer.com/web/projects/{projectId}?accessToken={token}
```

**✅ Framer actually uses**:
```bash
# Authorization header with Bearer token
GET https://api.framer.com/modules/v1/modules/?projectId=Vn2I8BJCNgyby16NocWM
Authorization: Bearer {token}
```

## Network Requests We Observed

From nailsbystella.hu:
1. `https://api.framer.com/auth/web/access-token` - Gets Bearer token
2. `https://api.framer.com/modules/v1/modules/?projectId=Vn2I8BJCNgyby16NocWM` - Uses Authorization header
3. `https://framerusercontent.com/modules/.../Component.tsx` - **Public CDN (no auth needed)**

## What This Means

### Good News ✅
- **Component CDN URLs are still public** (your PLAN.md was correct here)
- You can fetch `.tsx` files directly from `framerusercontent.com`
- No authentication needed for individual component downloads

### Challenge ❌
- **Project metadata API requires authentication**
- Token is dynamically generated via authenticated session
- Not available in page source (uses secure httpOnly cookies)
- Can't extract from published site without being logged in

## Three Options Forward

### Option 1: Use Unframer (Easiest)
**What**: Pay for unframer.co ($120/month)
**Pros**: Works immediately, maintained by others
**Cons**: Monthly cost

### Option 2: Build Framer Plugin (Most Powerful)
**What**: Create a Framer Plugin that runs inside Framer editor
**Pros**:
- Access to unpublished projects
- Official Framer Plugin API
- Can save component URLs to your database
**Cons**:
- More complex (need plugin development)
- Requires running plugin inside Framer

### Option 3: Manual Component List (Pragmatic)
**What**: Manually provide component URLs, skip project metadata API
**Pros**:
- MCP server still works
- No authentication needed
- Components are publicly accessible
**Cons**:
- Need to manually find component URLs first

## Recommended: Option 3 (Keep MCP Server, Manual URLs)

### How It Works

**1. Find Component URLs** (one-time manual step):
- Open nailsbystella.hu
- DevTools → Network tab → Filter "framerusercontent.com"
- Copy component URLs like:
  ```
  https://framerusercontent.com/modules/tZeNnpnvmiDYQPzAbHwZ/Qxb5zOvlAey6fBucOifc/Text_Opacity_Words.tsx
  https://framerusercontent.com/modules/2qJxXueOAV8HsVMGY4i4/oN5o4iacVos3o17LU2I6/DateConverter.tsx
  ```

**2. Use MCP Server's `get_component_code` tool**:
```
Get component code from https://framerusercontent.com/modules/tZeNnpnvmiDYQPzAbHwZ/Qxb5zOvlAey6fBucOifc/Text_Opacity_Words.tsx
```

**3. Repeat for all components** you need

### Modified Tool Usage

Since `list_framer_projects` and `export_framer_components` require project metadata API (auth-required), we can only use:

**✅ Works without auth**:
- `get_component_code(componentUrl)` - Fetch single component from CDN

**❌ Requires auth**:
- `list_framer_projects(projectUrl)` - Needs API token
- `export_framer_components(projectUrl, outputPath)` - Needs API token

## What We Built (Still Useful!)

The MCP server is **fully functional** for:
- Downloading components from public CDN URLs
- Extracting dependencies
- Generating summaries

**Use case**: When you have component URLs (from DevTools Network tab), use `get_component_code` to fetch and analyze them.

## Next Steps

### For Immediate Use (No Auth Required)

1. **Create a component URL list**:
   ```bash
   # Save to /tmp/component-urls.txt
   https://framerusercontent.com/modules/tZeNnpnvmiDYQPzAbHwZ/Qxb5zOvlAey6fBucOifc/Text_Opacity_Words.tsx
   https://framerusercontent.com/modules/2qJxXueOAV8HsVMGY4i4/oN5o4iacVos3o17LU2I6/DateConverter.tsx
   https://framerusercontent.com/modules/enJS0Gc2QaygKdiIKtSH/gHd4plb8zw3Y1aUXOwdb/Toggle.tsx
   # ... (all from DevTools Network tab)
   ```

2. **Use MCP tool for each URL**:
   ```
   Get component code from [URL]
   ```

3. **Manually organize exports**

### For Future (With Auth)

**Option A: Framer Plugin**
- Study: https://www.framer.com/developers/plugins-introduction
- Build plugin that saves component metadata to your database
- CLI fetches from your database (like Unframer architecture)

**Option B: Reverse Engineer Auth**
- Inspect `https://api.framer.com/auth/web/access-token` response
- Find how it generates Bearer tokens
- Implement in MCP server
- **Warning**: May violate Framer's ToS

## Summary

**What's Still Valuable**:
- ✅ MCP server architecture is correct
- ✅ CDN component fetching works perfectly
- ✅ `get_component_code` tool ready to use
- ✅ Transformation plugin can be added later

**What Changed**:
- ❌ Can't auto-list all components (needs auth)
- ❌ Can't auto-export full project (needs auth)
- ✅ Can export individual components (no auth needed)

**Practical Workflow**:
1. Open site in DevTools
2. Find component URLs in Network tab (5-10 minutes)
3. Use MCP server to fetch each component
4. Manual but works without authentication

---

**Decision Point**: Continue with Option 3 (manual URL list), or pivot to Option 2 (build Framer Plugin)?
