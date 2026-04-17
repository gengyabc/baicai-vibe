# baicai-vibe

Global OpenCode artifacts for reuse across projects.

This repo owns shared `agents`, `commands`, `rules`, `skills`, `plugins`, and `workflows` that must stay repo-agnostic.

## Prerequisites for Diagram Commands

The diagram commands require CLI tools to be installed:

| CLI | Package | System Requirement |
|-----|---------|-------------------|
| `cli-anything-drawio` | `pip install cli-anything-drawio` | Draw.io desktop app |
| `cli-anything-inkscape` | `pip install cli-anything-inkscape` | Inkscape |
| `excalidraw-cli` | `pip install excalidraw-cli` | None |

Python 3.10+ required for all.

## Install

Run:

```bash
./scripts/install-global.sh
```

That creates:

```text
~/.config/opencode -> ~/programming/baicai-vibe/.opencode
```

## Project Use

Downstream repos should point their vendor link at `~/.config/opencode`:

```bash
ln -s ~/.config/opencode .opencode/_vendor/baicai-vibe
```

## Validate

```bash
./scripts/validate-repo-agnostic.sh
```

## Check

```bash
ls -la ~/.config/opencode
```


## Layout

- Source: `~/programming/baicai-vibe/.opencode`
- Global install: `~/.config/opencode`
- Project usage: `.opencode/_vendor/baicai-vibe` in downstream repos
- Shared commands/rules reference that vendor path internally, so downstream repos must provide it

## Artifacts

### Commands

| Command | What it does | When to use |
|---|---|---|
| `drawio-cli` | Create/edit Draw.io diagrams via CLI | When user requests diagrams, flowcharts, or visual documentation |
| `excalidraw-cli` | Create hand-drawn style diagrams | When user requests casual/sketch-style diagrams |
| `inkscape-cli` | Create/edit vector graphics via CLI | When user requests SVG editing, logos, or vector illustrations |
| `commit-changes` | Stages changes, writes a conventional commit message, and commits | After making code changes that need a clean, formatted commit |
| `discover-requirements` | Transforms a user request into plan-ready proposed units through structured discovery | At the start of any feature or change request, before planning begins |
| `learn-skill-from-session` | Extracts a reusable skill/workflow/rule candidate from a session and stages it for review | After a session produced a repeatable pattern worth capturing |
| `promote-skill-candidate` | Reviews a staged candidate and promotes, refines, or rejects it into stable artifacts | After `learn-skill-from-session` stages a candidate that needs review |
| `update-routing-docs` | Creates or updates routing docs with layered Mermaid flowcharts | When command/workflow routing needs visual documentation or is out of date |

### Workflows

| Workflow | What it does | When to use |
|---|---|---|
| `discover-requirements-core` | Structured 12-step discovery: restate, analyze, find gaps, ask questions, converge, validate | Invoked by `discover-requirements` command; the repo-agnostic discovery engine |
| `learn-skill-from-session` | Fetches a session, extracts patterns, evaluates worthiness, synthesizes a candidate package | Invoked by `learn-skill-from-session` command; handles the extraction logic |

### Skills

| Skill | What it does | When to use |
|---|---|---|
| `code-review-expert` | Senior-engineer lens code review of git changes, diffs, PRs, or commit ranges | When asked to review code, audit a diff, inspect a PR, or check a branch |
| `fix-bugs` | Diagnose and fix bugs, regressions, and failing tests with minimal targeted changes | When a user reports incorrect behavior, crashes, or a reproducible failure |
| `optimize-config` | Create, update, validate, and optimize OpenCode configuration files | When asked to optimize, validate, create, or update any `.opencode` config file |
| `simplify-code` | Refine recently written or heavily changed code for clarity while preserving behavior | After major refactors, large code additions, or when asked to simplify/clean up |

### Agents

| Agent | What it does | When to use |
|---|---|---|
| `simplify-code` | Subagent that simplifies recently modified code for clarity and maintainability | Between requirement alignment and quality review; invoked automatically by the build pipeline |

### Rules

| Rule | What it does | When to use |
|---|---|---|
| `agent-output` | Enforces structured, pipeline-safe output (JSON/bullets/tables, no prose) | When output is consumed by downstream systems, bots, or automation |
| `coding-style` | Simplest-working-solution coding standard with strict no-bloat rules | During all code generation, review, and debugging tasks |
| `context7` | Always-apply rule: fetch current library docs via Context7 MCP instead of using training memory | Whenever working with libraries, frameworks, or APIs |
| `discover-requirements-core-contract` | Defines the neutral structured output shape for the discovery core | Ensures `discover-requirements-core` returns repo-agnostic results |
| `discovery-analysis-style` | Finding-first, bullet-heavy analysis style with explicit confidence labeling | During requirements discovery to keep output scannable and accurate |
| `entrypoint-compatibility` | Keeps command names stable, prefers explicit failures over silent compensation | During refactors that touch command entrypoints or nested contracts |
| `graph-routing-docs` | Requires Mermaid flowcharts for docs with branching/stop logic | When creating or updating routing-heavy documentation |
| `token-efficient-workflow` | Minimizes token overhead: be concise, edit not rewrite, test before declaring done | During token-to-green coding benchmarks or when efficiency matters |

### Plugins

| Plugin | What it does | When to use |
|---|---|---|
| `chat-manager` | Manages chat sessions and context | Always loaded; handles chat lifecycle |
| `workflow-failure-notify` | Notifies on workflow failures | Always loaded; fires when a workflow step fails |

