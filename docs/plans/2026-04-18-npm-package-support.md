---
key: npm-package-support
status: completed
date: 2026-04-18
---

# Plan: npm/bun Package Support

## Goal

Publish `baicai-vibe` as an npm package so users can install with `bun add baicai-vibe`, with postinstall auto-copying `.opencode/` into the target project.

## Current State

- Repo structure: git repo with bun postinstall hooks and a small repo-agnostic validation script
- `.opencode/` contains artifacts (commands, skills, rules, workflows, agents, plugins)
- `.opencode/package.json` exists for plugin dependencies (zod, @opencode-ai/plugin)
- `.opencode/node_modules` should NOT be published

## Target State

- Root `package.json` for npm publishing
- Postinstall script that copies `.opencode/` to target project
- Local development workflow via `bun link`
- Bun install/remove are the supported install and uninstall flows

## Implementation Steps

### Step 1: Create root `package.json`

```json
{
  "name": "baicai-vibe",
  "version": "0.1.0",
  "description": "Global OpenCode artifacts for reuse across projects",
  "license": "MIT",
  "files": [
    ".opencode/",
    "scripts/",
    "bin/"
  ],
  "scripts": {
    "postinstall": "node bin/postinstall.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/anomalyco/baicai-vibe"
  },
  "keywords": ["opencode", "ai", "coding", "agents"]
}
```

**Notes:**
- `files` includes what npm will publish
- `.npmignore` will exclude `.opencode/node_modules`
- `postinstall` runs after `bun add` or `npm install`

### Step 2: Create `.npmignore`

```
.opencode/node_modules/
.opencode/.DS_Store
.DS_Store
.github/
docs/
*.md
!README.md
```

**Goal:** Exclude dev files, keep essential docs and artifacts.

### Step 3: Create `bin/postinstall.js`

```javascript
const fs = require('fs');
const path = require('path');

const pkgDir = path.dirname(require.resolve('baicai-vibe/package.json'));

// Detect if we're in a target project (not during bun link local dev)
const isLinked = pkgDir.includes('/node_modules/.link/') || 
                 !pkgDir.includes('/node_modules/baicai-vibe');

if (isLinked) {
  console.log('baicai-vibe: linked mode, skipping postinstall copy');
  process.exit(0);
}

const targetDir = path.resolve(pkgDir, '..', '..', '.opencode');
const sourceDir = path.join(pkgDir, '.opencode');

// Sync .opencode/ (excluding node_modules)
function syncDir(src, dest, exclude = ['node_modules', '.DS_Store']) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  for (const entry of fs.readdirSync(src)) {
    if (exclude.includes(entry)) continue;
    
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    
    if (fs.statSync(srcPath).isDirectory()) {
      syncDir(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

syncDir(sourceDir, targetDir);

console.log('✓ baicai-vibe installed to .opencode/');
```

### Step 4: Update `.gitignore`

Add:
```
node_modules/
```

At root level (for future root package deps if needed).

### Step 5: Update README.md

Add npm/bun installation section:

```markdown
## Install

### Via bun (recommended)

```bash
bun add baicai-vibe
```

Postinstall will automatically copy `.opencode/` into your project.
```

### Step 6: Local Development Workflow

**In baicai-vibe repo:**
```bash
bun link
```

**In target project:**
```bash
bun link baicai-vibe
```

Changes in baicai-vibe repo are immediately reflected in linked project.

To unlink:
```bash
bun unlink baicai-vibe  # in target project
bun unlink              # in baicai-vibe repo
```

### Step 7: Publish Process

```bash
bun run postinstall  # test locally first
cd target-project && bun add ../baicai-vibe  # local test

# Publish
npm login
npm publish
```

Or use bun:
```bash
bun publish
```

## File Changes Summary

| File | Action |
|------|--------|
| `package.json` | Create at root |
| `.npmignore` | Create |
| `bin/postinstall.js` | Create |
| `.gitignore` | Add `node_modules/` |
| `README.md` | Add npm/bun install section |
| `scripts/validate-repo-agnostic.sh` | Keep repo-agnostic scan |

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Postinstall runs during bun link | Check for `.link` path to skip |
| Target `.opencode/` has user content | rsync-style sync, don't delete existing |
| Cross-platform path issues | Use `path.resolve()` in Node |
| Large package size | Exclude node_modules in .npmignore |

## Testing Checklist

- [ ] `bun add baicai-vibe` in empty project → `.opencode/` created
- [ ] `bun add baicai-vibe` in project with existing `.opencode/` → merged
- [ ] `bun link` in baicai-vibe repo → no postinstall copy
- [ ] `bun link baicai-vibe` in target → changes reflected immediately
- [ ] npm publish → package size reasonable (< 100KB)
- [ ] `bun update baicai-vibe` → artifacts refreshed
- [ ] `bun remove baicai-vibe` → cleanup handled (optional)

## Decisions

1. Overwrite existing `.opencode/` → **Prompt user before overwriting**
2. Preuninstall cleanup → **Yes, with user prompt**
3. Version → **0.1.0**
