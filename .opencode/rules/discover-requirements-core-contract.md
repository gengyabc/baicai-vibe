# Discovery Core Contract

The shared discovery core must return neutral output that a project wrapper can map into local artifact conventions.

## Required Shape

```md
- status: ready | needs-more-discovery | blocked
- decomposition: single-step | multi-step
- proposed-units:
  - key: <durable-kebab-key>
    title: <short title>
    focus: <one-line focus>
    in-scope: <list>
    out-of-scope: <list>
    constraints: <list>
    assumptions: <list>
    open-questions: <list>
    success-criteria: <list>
- approval-required: yes
- remaining-open-questions: <list>
- planning-risks: <list>
```

## Rules

- output must be repo-agnostic
- `key` values must be durable lowercase ASCII kebab-case identifiers
- proposed units must be ordered when decomposition is `multi-step`
- open questions that block planning must move `status` to `needs-more-discovery` or `blocked`
- the core must not decide local persistence paths
