---
name: optimize-config
description: Create, update, validate, and optimize OpenCode configuration files (skills, commands, rules, workflows, AGENTS.md). Invoke when user asks to optimize, validate, create, or update any .opencode configuration file.
metadata:
  short-description: Optimize OpenCode configs (skills, commands, rules, workflows)
---

Use this skill to manage the prompt-and-instruction surface of an OpenCode project.

It covers creating or improving `command`, `rule`, `workflow`, `skill`, and `AGENTS.md` files, and keeping them aligned.

## Core Scope

Supported targets:

- `.opencode/skills/baicai-vibe/<name>/SKILL.md`
- `.opencode/commands/baicai-vibe/<name>.md`
- `.opencode/rules/baicai-vibe/<name>.md`
- `.opencode/workflows/baicai-vibe/<name>.md`
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

- use direct editing for content-specific improvements
- add scripts only when a helper will be reused
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

## Update Workflow

When editing an existing file:

1. Read the current file and nearby related files.
2. Preserve the established tone and structure unless there is a concrete reason to improve it.
3. Keep edits minimal and local.
4. If changing one layer affects another, call that out explicitly.
5. Run validation after editing.

For `AGENTS.md`, a full rewrite is allowed when it produces a clearer single source of truth, but keep the original product constraints intact unless the user asked to change them.

## Optimization Workflow

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

Read `@.opencode/skills/baicai-vibe/optimize-config/references/skill_guide.md` when creating or heavily revising a skill.

### Commands

Use for entry points a user invokes directly.

- Keep commands thin.
- Put orchestration in workflows.
- Show parameter handling and dispatch clearly.

Read `@.opencode/skills/baicai-vibe/optimize-config/references/command_guide.md` when creating or revising a command.

### Rules

Use for constraints, schemas, or project-wide reusable guidance.

- Prefer reusable statements over command-specific instructions.
- Avoid copying workflow steps into rules.

Read `@.opencode/skills/baicai-vibe/optimize-config/references/rule_guide.md` when creating or revising a rule.

### Workflows

Use for multi-step logic that commands or agents should execute.

- State goal, inputs, steps, outputs, and constraints.
- Keep the steps action-oriented.

Read `@.opencode/skills/baicai-vibe/optimize-config/references/workflow_guide.md` when creating or revising a workflow.

### AGENTS.md

Use for the repository's global operating model.

- Keep it stable and high signal.
- Put reusable specifics into rules and workflows rather than bloating `AGENTS.md`.

Read `@.opencode/skills/baicai-vibe/optimize-config/references/agents_guide.md` before significant rewrites.

## Reference Files

Read these files as needed:

- `@.opencode/skills/baicai-vibe/optimize-config/references/skill_guide.md`
- `@.opencode/skills/baicai-vibe/optimize-config/references/command_guide.md`
- `@.opencode/skills/baicai-vibe/optimize-config/references/rule_guide.md`
- `@.opencode/skills/baicai-vibe/optimize-config/references/workflow_guide.md`
- `@.opencode/skills/baicai-vibe/optimize-config/references/agents_guide.md`
- `@.opencode/skills/baicai-vibe/optimize-config/references/best_practices.md`

## Constraints

- Do not create extra documentation files unless they directly help another agent perform repeat work.
- Prefer the smallest correct structural change.
- Do not duplicate the same guidance across `AGENTS.md`, rules, and workflows without a clear reason.
- When uncertain whether something belongs in a command or workflow, put it in the workflow.
