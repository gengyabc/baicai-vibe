# Rule: Graph-Based Routing Docs

## Objective

Make routing-heavy command, workflow, and policy docs easy to understand at a glance.

## Scope

- Applies to docs that explain branching, selection, defaults, stop conditions, or handoff points.
- Does not apply to trivial linear docs or implementation details.

## Must

- Include a Mermaid flowchart when the doc contains branching or stop logic.
- Use concise, action-oriented node labels.
- Show decision points, default paths, and stop conditions explicitly.
- Pair the graph with short routing standards or bullets that explain the key rules.
- Keep the graph narrow enough to fit on one screen when possible.

## Must Not

- Use graphs as decoration without adding decision clarity.
- Hide argument validation, ambiguity handling, or stop conditions in prose only.
- Mix unrelated flows into one diagram.
- Add graph requirements to simple single-path docs.

## Acceptance

- A reader can identify inputs, branches, stop points, and next actions from the doc structure itself.
- The graph and the prose say the same thing.

## Non-goals

- Rewriting implementation code.
- Turning every document into a diagram.
- Creating a general documentation framework.
