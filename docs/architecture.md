# baicai-vibe Architecture

## Goal

`baicai-vibe` holds reusable OpenCode building blocks that can be consumed by multiple projects without inheriting one project's planning runtime.

## Dependency Boundary

- `baicai-vibe` is upstream shared infrastructure.
- `baicai-vibe-coding` and other project runtimes may depend on it.
- `baicai-vibe` must not depend on downstream project repos.

## What Belongs Here

- repo-agnostic utility commands (`commit-changes`, `discover-requirements`, `promote-skill-candidate`, `update-routing-docs`, `learn-skill-from-session`)
- reusable workflows that do not persist into project-specific planning folders (`discover-requirements-core`, `learn-skill-from-session`)
- cross-project rules (coding style, agent output, context7, entrypoint compatibility, discovery contract, token efficiency, graph routing docs)
- reusable skills and agents (`code-review-expert`, `fix-bugs`, `optimize-config`, `simplify-code`)
- chat and workflow plugins (`chat-manager`, `workflow-failure-notify`)

## What Must Stay Out

- direct references to `@.planning/phase/`
- assumptions about `branch-phase.toml` or `phase-log.md`
- assumptions about local artifact names such as `requirement.md`, `step.md`, `quality-review.md`, `test-checklist.md`, `decision.md`, `contract.md`, or `feature.feature`
- project-specific naming or folder-numbering policies

## Discovery Split

`discover-requirements` is split into:

- shared core: `@.opencode/workflows/discover-requirements-core.md`
- shared contract: `@.opencode/rules/discover-requirements-core-contract.md`
- local wrapper: owned by `baicai-vibe-coding`

The shared core produces neutral proposed units. The contract defines the structured return format. Project wrappers decide folder naming, numbering, and file persistence.

The core workflow enforces two hard constraints:
- no references to `@.planning/phase/` or local artifact paths
- no file writes — the local wrapper handles persistence after user approval
