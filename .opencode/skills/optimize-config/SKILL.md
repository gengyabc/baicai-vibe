---
name: optimize-config
description: Create, update, validate, and optimize OpenCode configuration files (skills, commands, rules, workflows, AGENTS.md). Invoke when user asks to optimize, validate, create, or update any .opencode configuration file.
metadata:
  short-description: Optimize OpenCode configs (skills, commands, rules, workflows)
---

Use this skill to manage the prompt-and-instruction surface of an OpenCode project.

It extends the idea of `skill-creator`: not only create a skill, but also create or improve `command`, `rule`, `workflow`, and `AGENTS.md` files, and keep them aligned.

## Core Scope

Supported targets:

- `.opencode/skills/<name>/SKILL.md`
- `.opencode/commands/<name>.md`
- `.opencode/rules/<name>.md`
- `.opencode/workflows/<name>.md`
- `AGENTS.md`

Primary operations:

- create a new file or skill directory
- update an existing file to support new behavior
- optimize an existing file for clarity and reuse
- validate structure and naming
- review how the layers fit together

## Layer Model

Use the existing project layering rather than inventing a parallel system.

- `AGENTS.md`: project-wide product intent and engineering constraints
- `rules/`: reusable behavior constraints and schemas
- `workflows/`: multi-step orchestration logic
- `commands/`: small entry points that dispatch to workflows
- `skills/`: reusable specialized capabilities

Prefer extending an existing layer before creating a new one.

## Working Style

Use a mixed mode:

- use scripts for repeatable scaffolding, validation, and analysis
- use direct editing for content-specific improvements
- ask short clarifying questions only when the target or behavior is ambiguous

When optimizing, support both styles:

- analysis-only: report issues and suggest changes
- apply-and-review: make the improvements and summarize them

## Creation Workflow

Follow this order:

1. Identify the right target layer.
2. Check nearby files for project style and naming.
3. Create the minimal correct file or directory structure.
4. Fill only the information that helps another agent do the work.
5. Validate format and naming.
6. If relevant, explain what other files should call or load this file.

Use `@.opencode/_vendor/baicai-vibe/skills/optimize-config/scripts/init_config.py` for first-pass scaffolding when the target type and name are clear.

## Update Workflow

When editing an existing file:

1. Read the current file and nearby related files.
2. Preserve the established tone and structure unless there is a concrete reason to improve it.
3. Keep edits minimal and local.
4. If changing one layer affects another, call that out explicitly.
5. Run validation after editing.

For `AGENTS.md`, a full rewrite is allowed when it produces a clearer single source of truth, but keep the original product constraints intact unless the user asked to change them.

## Optimization Workflow

Use `@.opencode/_vendor/baicai-vibe/skills/optimize-config/scripts/analyze.py` first when the user asks to optimize or review quality.

Evaluate these dimensions:

- clarity: is the file easy for another agent to follow?
- scope: is the file doing the right layer's job?
- reuse: should content move to a rule, workflow, or reference file?
- duplication: is the same guidance repeated elsewhere?
- trigger quality: for skills and commands, does the description clearly say when to use it?

Then choose one of two outcomes:

- report-only: summarize findings and leave files unchanged
- improve-now: edit the files, then summarize what changed

## Validation Rules

Use `@.opencode/_vendor/baicai-vibe/skills/optimize-config/scripts/validate.py` for quick checks.

Important checks:

- skill names must be hyphen-case
- `SKILL.md` must have frontmatter with `name` and `description`
- command files must have frontmatter with `description` and `agent`
- `agents/openai.yaml` or `agents/agent.yaml` may exist for skills that need UI discoverability; optional for internal-only skills
- descriptions should be concise and explicit about when to use the file

The validator is intentionally lightweight. It should catch structure problems early, not replace judgment.

## File-Type Guidance

### Skills

Use for reusable specialized capability.

- Keep `SKILL.md` focused on procedure and decision points.
- Put detailed references in `references/`.
- Put deterministic helpers in `scripts/`.
- Optionally add `agents/openai.yaml` or `agents/agent.yaml` if the skill needs UI discoverability and invocation hints

Read `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/skill_guide.md` when creating or heavily revising a skill.

### Commands

Use for entry points a user invokes directly.

- Keep commands thin.
- Put orchestration in workflows.
- Show parameter handling and dispatch clearly.

Read `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/command_guide.md` when creating or revising a command.

### Rules

Use for constraints, schemas, or project-wide reusable guidance.

- Prefer reusable statements over command-specific instructions.
- Avoid copying workflow steps into rules.

Read `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/rule_guide.md` when creating or revising a rule.

### Workflows

Use for multi-step logic that commands or agents should execute.

- State goal, inputs, steps, outputs, and constraints.
- Keep the steps action-oriented.

Read `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/workflow_guide.md` when creating or revising a workflow.

### AGENTS.md

Use for the repository's global operating model.

- Keep it stable and high signal.
- Put reusable specifics into rules and workflows rather than bloating `AGENTS.md`.

Read `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/agents_guide.md` before significant rewrites.

## Script Reference

### `scripts/init_config.py`

Create scaffold files for supported types.

Examples:

```bash
python scripts/init_config.py skill my-skill --root /repo
python scripts/init_config.py command my-command --root /repo --description "Run a guided session"
python scripts/init_config.py workflow my-workflow --root /repo
python scripts/init_config.py agents project-name --root /repo
```

### `scripts/validate.py`

Validate one file, one skill directory, or a directory tree.

Examples:

```bash
python scripts/validate.py /repo/.opencode/skills/my-skill
python scripts/validate.py /repo/.opencode/commands/my-command.md
python scripts/validate.py /repo/AGENTS.md
```

### `scripts/analyze.py`

Generate a lightweight quality report.

Examples:

```bash
python scripts/analyze.py /repo/.opencode/skills/my-skill/SKILL.md
python scripts/analyze.py /repo/.opencode/commands --format json
```

### `scripts/optimize.py`

Run analysis first, then optionally apply safe mechanical improvements.

Examples:

```bash
python scripts/optimize.py /repo/.opencode/skills/my-skill/SKILL.md --mode report
python scripts/optimize.py /repo/.opencode/skills/my-skill/SKILL.md --mode apply
```

## Reference Files

Read these files as needed:

- `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/skill_guide.md`
- `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/command_guide.md`
- `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/rule_guide.md`
- `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/workflow_guide.md`
- `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/agents_guide.md`
- `@.opencode/_vendor/baicai-vibe/skills/optimize-config/references/best_practices.md`

## Constraints

- Do not create extra documentation files unless they directly help another agent perform repeat work.
- Prefer the smallest correct structural change.
- Do not duplicate the same guidance across `AGENTS.md`, rules, and workflows without a clear reason.
- When uncertain whether something belongs in a command or workflow, put it in the workflow.