# Command Guide

## Purpose

Commands are direct entry points a user invokes.

## Required Structure

Command files live in `.opencode/commands/` and use markdown frontmatter.

Required frontmatter:

- `description`
- `agent`

Typical body sections:

- `## Purpose`
- `## Parameters`
- `## Student-Facing Behavior` or similar
- `## Dispatch`
- `## Constraints`

## Design Rules

- keep commands thin
- parse arguments here if needed
- put main orchestration into workflows
- mention which workflow to run

## Example Pattern

```yaml
---
description: Run an adaptive learning session
agent: build
---
```

Then use a numbered dispatch section that points to workflows.

## Update Checklist

1. verify the command still points to the right workflow
2. check that parameter handling matches current behavior
3. remove logic that belongs in a workflow
