# Workflow: Discover Requirements Core

## Goal

Turn an initial request into a structured requirements note when the scope is clear enough to persist.

## Behavior

1. Clarify the user request and identify the target problem.
2. Capture in-scope and out-of-scope items, constraints, assumptions, and success criteria.
3. If the result is `ready`, persist to `docs/requirements/YYYY-MM-DD-<key>.md`.
4. If the result is `needs-more-discovery` or `blocked`, do not persist.

## Output

- a structured contract result
- a file path when persistence is allowed
