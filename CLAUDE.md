# Scheemer

**Purpose**: Framer plugin for exporting component metadata and structure as JSON
**Status**: Production-ready with testing, CI/CD, and quality enforcement
**Repository**: Standalone public repo + NQH monorepo subtree

---

## Project Overview

Scheemer extracts component metadata from Framer designs and exports as structured JSON for analysis, documentation, and design system auditing.

**Core functionality**:
- Component metadata extraction (frames, instances, masters)
- Visual property capture (colors, layout, typography, sizing)
- Batch JSON export with sanitized filenames
- Real-time selection tracking with auto-refresh

---

## Architecture

**Framer plugin structure** (subtree root: `apps/scheemer/`):
```
framer-plugin/
  src/
    app.tsx              Main plugin UI + extraction logic
    components/          Reusable UI components (Button, Checkbox, ScrollArea)
    types.ts             TypeScript interfaces (FramerNode, ExportItem)
  static/
    manifest.json        Framer plugin manifest
  tests/                 Vitest + React Testing Library
```

**Key constraint**: All plugin logic must run in single Framer iframe context.

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (Framer design tokens)
- **Testing**: Vitest + React Testing Library + jsdom
- **Build**: Vite + framer-plugin-tools
- **Quality**: ESLint + Prettier + Husky pre-commit hooks
- **CI/CD**: GitHub Actions (typecheck, lint, test, build)

---

## Code Quality Standards

**Pre-commit enforcement** (from NQH monorepo):
- File headers with `@what`, `@why`, `@props`/`@exports` tags
- File size limits (≤350 LOC, **except `app.tsx`** - Framer plugin constraint)
- Circular dependency detection
- Semantic duplication detection (Rule of 3)
- ESLint + Prettier auto-fix

**Exception**: `app.tsx` exempt from 350 LOC limit (Framer requires all logic in single file)

**Run checks**:
```bash
pnpm lint        # ESLint
pnpm test        # Vitest
pnpm build       # Vite build
```

---

## Development Workflow

**Setup**:
```bash
cd framer-plugin
pnpm install
pnpm dev         # Start dev server with HMR
```

**Testing**:
```bash
pnpm test              # Run tests
```

**Build for Framer**:
```bash
pnpm build       # Production build
pnpm pack        # Package as .framer plugin
```

**Install in Framer**:
1. Build plugin: `pnpm pack`
2. Open Framer → Plugins → Install from file
3. Select generated `.framer` file

---

## Key Constraints

1. **Framer Plugin API limitations**:
   - Must use Framer-provided design tokens (e.g., `text-framer-text`)
   - All UI runs in sandboxed iframe
   - Limited to Framer's React component ecosystem

2. **Single-file architecture**:
   - `app.tsx` contains all extraction logic (cannot split into multiple files easily)
   - Exempted from 350 LOC limit for this reason
   - Use inline comments for organization

3. **Framer design tokens**:
   - Must use Framer's CSS classes (`bg-framer-bg`, `text-framer-text-secondary`, etc.)
   - Tailwind custom classes disabled for these (see `eslint-disable` in `app.tsx`)

---

## Framer API Usage

**Extract component metadata**:
```typescript
const canvasRoot = await framer.getCanvasRoot()
const selection = await framer.getSelection()

// Get component info
const componentIdentifier = node.componentIdentifier
const componentName = node.componentName
const insertURL = node.insertURL

// Get children
const children = await node.getChildren()

// Extract properties
const { x, y, width, height, backgroundColor, text } = node
```

**Key Framer node types**:
- `ComponentNode`: Component master definition
- `ComponentInstanceNode`: Component instance
- `FrameNode`: Regular frame

---

## File Organization

**Component structure**:
```typescript
// ✅ Correct component pattern
export const Button = ({ children, onClick }: ButtonProps) => (
  <button className="..." onClick={onClick}>
    {children}
  </button>
)

// ✅ File header required
/**
 * @what Button component for plugin UI
 * @why Consistent button styling across plugin
 * @props children, onClick, variant
 */
```

**Import patterns**:
```typescript
// ✅ Correct
import { Button } from './components/Button'
import type { FramerNode, ExportItem } from './types'

// ❌ Wrong (no relative parent imports)
import { Button } from '../Button'
```

---

## Testing Philosophy

**TDD workflow**: RED → GREEN → REFACTOR

**Coverage targets**:
- UI components: 80% (interaction-heavy)
- Extraction logic: Test via manual Framer testing (API mocking difficult)

**Test location**: Co-located with components (`button.test.tsx` next to `Button.tsx`)

**Test example**:
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

it('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

---

## Distribution

**Public repository**: `github.com/nqh-public/scheemer`
**NQH monorepo subtree**: `apps/scheemer/`

**Sync strategy**:
- Monorepo → Public: Manual push via `git subtree push`
- Public → Monorepo: Daily automated sync at 7 AM UTC (GitHub Actions)

---

## Important Reminders

- **Framer tokens only**: Use `text-framer-*` and `bg-framer-*` classes
- **app.tsx exempt**: Don't worry about 350 LOC limit here
- **Test UI components**: Write tests for Button, Checkbox, ScrollArea
- **Atomic commits**: Use line references in commit messages (e.g., `app.tsx:42`)
- **Evidence-based**: No "completed" without line references

---

## Common Tasks

**Add new property extraction**:
1. Locate extraction logic in `app.tsx` (search for `baseProperties`)
2. Add new property to extraction object
3. Update `ExportItem` type in `types.ts`
4. Test in Framer

**Update UI component**:
1. Modify component file (e.g., `components/Button.tsx`)
2. Write/update test in `button.test.tsx`
3. Verify in plugin with `pnpm dev`

**Fix export format**:
1. Locate `exportData` object creation in `app.tsx`
2. Modify JSON structure
3. Test export with Framer component

---

**Created**: 2025-11-02
**Last updated**: 2025-11-02
