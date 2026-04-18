---
key: baicai-vibe-installation-strategy
status: ready
date: 2026-04-17
---

# Baicai Vibe Installation Strategy

## Goal

Define a stable distribution and lookup model for Baicai Vibe assets where project-local content overrides global defaults, while installation can target either project scope or global scope.

## Primary Behavior

- Project scope has higher priority than global scope.
- Global scope acts as fallback when a project-local asset is missing.
- User-facing installers must let the user choose project install or global install.
- Assets are installed into the final local position directly.
- Link resolution must return the correct linked target path.

## Asset Layers

- `commands/baicai-vibe/` and `skills/baicai-vibe/` are discoverable OpenCode assets.
- `.opencode/` stores workflows, rules, contracts, and templates.
- Project overrides live under `.opencode/`.
- Global defaults live under `~/.config/opencode/`.

## Lookup Order

1. `.opencode/...`
2. `~/.config/opencode/...`

## Installation Modes

- `project` installs assets into the current project only.
- `global` installs assets into the user config directory.
- Installers must make the destination explicit instead of guessing.

## Success Criteria

- Users can install the same package into project or global scope.
- Runtime behavior resolves project assets first.
- Documentation clearly states lookup order and install targets.
- No package logic depends on legacy symlink path handling as the source of truth.
