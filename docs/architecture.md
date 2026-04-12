# baicai-vibe Architecture

## Goal

`baicai-vibe` holds reusable OpenCode building blocks that can be consumed by multiple projects without inheriting one project's planning runtime.

## Dependency Boundary

- `baicai-vibe` is upstream shared infrastructure.
- `baicai-vibe-coding` and other project runtimes may depend on it.
- `baicai-vibe` must not depend on downstream project repos.

## What Belongs Here

- repo-agnostic utility commands
- reusable workflows that do not persist into project-specific planning folders
- cross-project rules
- reusable skills and agents

## What Must Stay Out

- direct references to `@.planning/phase/`
- assumptions about `branch-phase.toml` or `phase-log.md`
- assumptions about local artifact names such as `requirement.md`, `step.md`, `quality-review.md`, `test-checklist.md`, `decision.md`, `contract.md`, or `feature.feature`
- project-specific naming or folder-numbering policies

## Discovery Split

`discover-requirements` is split into:

- shared core: `@.opencode/workflows/discover-requirements-core.md`
- local wrapper: owned by `baicai-vibe-coding`

The shared core produces neutral proposed units. Project wrappers decide folder naming, numbering, and file persistence.
