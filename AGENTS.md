# OpenCode Agent Instructions

If OpenCode behavior is unclear, check `https://opencode.ai/docs/`.

## Persistence

Requirements go in `docs/requirements/<date>-<key>.md`.

Plans go in `docs/plans/<date>-<key>.md`.

Use `YYYY-MM-DD` dates and durable lowercase kebab-case keys.

Requirement frontmatter:

```yaml
---
key: <durable-kebab-key>
status: ready | needs-more-discovery | blocked
date: YYYY-MM-DD
---
```

Plan frontmatter:

```yaml
---
key: <durable-kebab-key>
status: ready | blocked
date: YYYY-MM-DD
requirement: docs/requirements/<date>-<key>.md
---
```
