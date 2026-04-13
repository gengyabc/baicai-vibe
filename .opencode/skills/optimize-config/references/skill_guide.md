# Skill Guide

## Purpose

Use a skill when a capability should be reusable across multiple requests.

## Required Structure

```
.opencode/skills/<skill-name>/
  SKILL.md
```

Optional files for UI discoverability:

```
  agents/openai.yaml
  agents/agent.yaml
```

Optional directories:

- `scripts/`
- `references/`
- `assets/`

## Frontmatter

`SKILL.md` must start with frontmatter.

Required fields:

- `name`
- `description`

Recommended pattern for `description`:

- say what the skill does
- say when it should trigger

Example:

```yaml
---
name: optimize-config
description: Create, update, validate, and optimize OpenCode project configuration files, including skills, commands, rules, workflows, and AGENTS.md.
---
```

## Body Structure

Keep the body short and procedural.

Good sections:

- overview
- core scope
- workflows
- script reference
- constraints

Move long examples and detailed references into `references/`.

## UI Metadata (Optional)

If the skill needs UI discoverability, create `agents/openai.yaml` or `agents/agent.yaml` with:

- `display_name`
- `short_description`
- `default_prompt`

Keep `short_description` short and readable.

## When to Add Resources

Add `scripts/` when deterministic or repeated helpers are useful.

Add `references/` when variant-specific or detailed material would make `SKILL.md` too long.

Add `assets/` only when the skill needs files copied into outputs.

## Update Checklist

When revising a skill:

1. check whether `description` still matches behavior
2. if the skill has `agents/*.yaml`, check whether it's stale
3. remove duplicated detail from `SKILL.md`
4. move long guidance into references when useful

## Example in This Repo

Existing simple skills in this repo are concise and direct. This skill extends that style by adding reusable scripts and references without changing the basic contract.
