---
description: Review a staged reusable artifact candidate and promote, refine, or reject it
agent: build
model: bailian-coding-plan/glm-5
---

This command takes no positional arguments.

## Objective

Review the staged candidate under `.temp/reusable-artifact-candidates/current/` and decide exactly one of:

- promote as-is
- promote after targeted revision
- refine an existing stable artifact instead
- do not promote

This command is the only allowed path from temp staging into stable reusable artifact locations.

## Source of truth

Use only the staged candidate package and relevant stable artifacts.

Required staged inputs:

- `.temp/reusable-artifact-candidates/current/candidate.md`
- `.temp/reusable-artifact-candidates/current/package.md`

Optional staged drafts:

- `.temp/reusable-artifact-candidates/current/artifacts/SKILL.md`
- `.temp/reusable-artifact-candidates/current/artifacts/workflow.md`
- `.temp/reusable-artifact-candidates/current/artifacts/rule.md`

Relevant stable references:

- `@.opencode/_vendor/baicai-vibe/rules/learn-skill-from-session/promotion-rule.md`
- `@.opencode/_vendor/baicai-vibe/rules/learn-skill-from-session/candidate-rule.md`
- existing stable artifacts under `.opencode/skills/`, `.opencode/workflows/`, and `.opencode/rules/`

Do not use unstaged assumptions.
Do not promote based on memory of the source session alone.
Do not install anything if staged files are missing or inconsistent.

## Review task

Determine:

1. whether the candidate is install-worthy
2. whether the selected artifact type is correct
3. whether the candidate duplicates an existing stable artifact
4. whether targeted revision is required before promotion
5. whether promotion should create a new stable artifact or refine an existing one
6. whether the candidate actually satisfies the explicit source goal recorded in staging

## Allowed stable destinations

Promote only into the matching stable location:

- skill -> `.opencode/skills/<artifact-name>/SKILL.md`
- workflow -> `.opencode/workflows/<artifact-name>.md`
- rule -> `.opencode/rules/<artifact-name>.md`

Do not promote into multiple stable destinations by default.
Do not install extra files just because they exist in staging.

## Required checks

Before promoting, verify all of the following:

- the staged candidate selects exactly one final type: `skill`, `workflow`, `rule`, or `reject`
- the staged draft matches that type
- the staged package records the source session link and target goal clearly
- the scope is narrow and reusable
- the artifact is understandable without the original session
- the artifact solves the stated goal without overreaching beyond the evidence
- the artifact does not materially duplicate an existing stable artifact
- the final name is clear and appropriately scoped
- the artifact is worth long-term maintenance

If any check fails, do not promote as-is.

## Decision rules

### Promote as-is

Choose only when the candidate is strong, the type is correct, the artifact is self-contained, duplication risk is low, the name is good, and no revision is needed.

### Promote after targeted revision

Choose when the candidate is valid but the draft needs small, concrete changes before install.

Examples:

- rename artifact
- tighten scope
- add stop conditions
- clarify non-goals
- tighten alignment to the stated goal
- remove session-specific wording

Apply only the minimum necessary revision, then promote the corrected artifact.

### Refine existing stable artifact instead

Choose when a stable artifact already covers substantially the same purpose and the staged candidate is better treated as an improvement.

In this case, do not install a new artifact by default. Update the existing stable artifact carefully and minimally.

### Do not promote

Choose when the candidate is weak, the evidence is insufficient, the type is wrong or unclear, the staged artifact is too broad or too local, or the maintenance cost is not justified.

## Hard constraints

- Never promote a `reject` result.
- Never auto-promote without review.
- Never create more than one new stable artifact by default.
- Never promote both a workflow and a rule from the same staged candidate unless the package explicitly justifies that split and review confirms it is necessary.
- Never overwrite a stable artifact carelessly.
- Never install drafts that still depend on temp-only wording such as "this session" or "current task".
- Never promote a draft that ignores or materially misses the stated goal captured in staging.

## Output expectations

At the end of this command, produce a clear promotion decision:

- `promote as-is`
- `promote after targeted revision`
- `refine existing artifact instead`
- `do not promote`

Also state:

- selected stable target path
- artifact final name
- whether a new artifact was created or an existing one was refined
- what changed during promotion, if anything
- whether the promoted artifact satisfies the staged goal as-is or after revision

## Stop conditions

Stop and do not promote if any of the following is true:

- staged candidate files are missing
- staged package is internally inconsistent
- selected type and draft artifact do not match
- stable destination is unclear
- duplication cannot be resolved confidently
- the final artifact name remains misleading or too broad
- the staged goal is missing, unclear, or still unmet after revision

If stopped, explain why and do not install anything.

## Completion criteria

This command is complete only when one of the following is true:

### Promotion path

- exactly one clear promotion decision was made
- the stable artifact was created or refined in the correct location
- no unnecessary extra artifacts were installed

### Non-promotion path

- an explicit decision not to promote was made
- no stable files were modified

Under no circumstance should this command end ambiguously.

## Post-promotion cleanup

After a successful promotion, the staging area must be cleaned up to prevent stale files from accumulating.

### On successful promotion

- Delete all files under `.temp/reusable-artifact-candidates/current/`
- Remove the `artifacts/` subdirectory if it exists
- Keep the `.temp/` directory structure but ensure it is empty
- Report to the user: `Staging area cleaned up. Promoted artifact is now stable at <path>.`

### On failed or stopped promotion

- Preserve all staged files for debugging, retry, or revision
- Do not delete anything
- Report to the user: `Staging area preserved at .temp/reusable-artifact-candidates/current/ for review or retry.`

### Why this matters

- Prevents confusion about which version is canonical (staged vs. stable)
- Avoids accidental re-promotion of stale candidates
- Keeps the workspace clean and predictable
