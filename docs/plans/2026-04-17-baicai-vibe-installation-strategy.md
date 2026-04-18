---
key: baicai-vibe-installation-strategy
status: ready
date: 2026-04-17
requirement: docs/requirements/2026-04-17-baicai-vibe-installation-strategy.md
---

# Baicai Vibe Installation Strategy Plan

## Objective

Implement a project-first, global-fallback asset model for Baicai Vibe, with installer support for both project and global targets.

## Scope

- Define install targets: project and global.
- Implement lookup precedence: project first, global fallback.
- Keep commands, skills, workflows, rules, contracts, and templates separated by responsibility.
- Document the resolution and installation rules.

## Non-Goals

- Reworking unrelated OpenCode routing.
- Making plugin code the primary storage location for assets.

## Implementation Plan

### Phase 1: Standardize Paths

- Declare canonical project root assets under `.opencode/`.
- Declare canonical global assets under `~/.config/opencode/`.
- Keep OpenCode-scannable content in `.opencode/commands/baicai-vibe/`, `.opencode/skills/baicai-vibe/`, and `.opencode/agents/baicai-vibe/`.
- Keep shared content in `.opencode/workflows/baicai-vibe/`, `.opencode/rules/baicai-vibe/`, `.opencode/contracts/`, and `.opencode/templates/`.

### Phase 2: Implement Resolution Rules

- Resolve project-local assets before global assets.
- Use absolute paths or resolved real paths when reading assets.
- Install assets to the final local position directly.
- Resolve links to their correct target paths.
- Make every lookup path explicit in docs and runtime helpers.

### Phase 3: Add Installer Target Selection

- Add an install option for `project` scope.
- Add an install option for `global` scope.
- Default behavior should be explicit in CLI/help text.
- Ensure installation writes to the chosen target only.

### Phase 4: Light Plugin Boundary

- Keep plugin code thin.
- Use plugin code for bootstrap, env setup, and diagnostics only.
- Do not store primary workflow/rule content inside plugin code.

### Phase 5: Documentation

- Document the lookup order.
- Document install mode differences.
- Document where each asset type belongs.
- Add examples for overriding global defaults from the project layer.

### Phase 6: Verification

- Confirm project assets override global assets.
- Confirm missing project assets fall back to global assets.
- Confirm installer can write to both targets.
- Confirm no behavior depends on legacy symlink-specific path handling.

## Acceptance Criteria

- A user can install Baicai Vibe into a project or into global config.
- The runtime resolves `.opencode/` first.
- Global config is used only when the project does not define the asset.
- The plan and requirement docs are committed under `docs/` with valid frontmatter.
