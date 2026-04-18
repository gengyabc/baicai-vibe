# Best Practices

## Keep Layers Sharp

Use one layer for one job:

- `AGENTS.md`: what the whole project is trying to do
- `rules/`: always-on or reusable constraints
- `workflows/`: step-by-step orchestration
- `commands/`: user-facing dispatch
- `skills/`: reusable capability packs

If a file is trying to do two jobs, split it.

## Prefer Reuse Over Copying

If the same instruction is needed in several places:

- move shared constraints into `rules/`
- move repeated multi-step logic into `workflows/`
- keep commands short and refer to the workflow

## Optimize for Another Agent

Write for another capable agent, not for a novice human.

- explain non-obvious decisions
- skip generic filler
- use short examples when they remove ambiguity

## Keep Trigger Text Strong

For skill and command descriptions, say both:

- what the file helps do
- when it should be used

Weak:

`Run learning`

Better:

`Run an adaptive learning session for the current student, including target selection from profile data or analyzed error files.`

## Prefer Minimal Edits

When updating an existing configuration:

- keep headings if they still work
- edit the smallest section that solves the problem
- do not rewrite large files unless the structure is the problem

## Keep AGENTS.md Lean

`AGENTS.md` should set the operating model, not hold every detail.

Move these out when they get long:

- schemas
- repeated process steps
- domain-specific procedures

Those belong in `rules/` or `workflows/`.

## Mechanical Improvements That Are Usually Safe

Safe automatic improvements include:

- trim trailing whitespace
- collapse runs of 3+ blank lines
- normalize final newline
- normalize obvious template placeholders when the intended value is known

Do not automatically rewrite substantive content unless the user asked for optimization to be applied.
