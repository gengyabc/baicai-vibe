# Rule: Reusable Artifact Promotion

## Objective

Define strict rules for promoting a staged reusable artifact candidate from temp staging into stable locations.

This rule protects `.opencode/skills/`, `.opencode/workflows/`, and `.opencode/rules/` from noise, duplication, and under-reviewed artifacts.

## Core principle

Promotion is a manual review gate, not an automatic continuation of candidate generation.

A staged artifact may be promoted only if it is reviewed, type-correct, non-duplicative, and install-worthy.

It must also satisfy the explicit source goal captured in staging.

If any part is weak, do not promote.

## Stable locations

Promote approved artifacts only into the correct stable location:

- skill -> `.opencode/skills/<artifact-name>/SKILL.md`
- workflow -> `.opencode/workflows/<artifact-name>.md`
- rule -> `.opencode/rules/<artifact-name>.md`

Do not install an artifact into the wrong stable location.

## Manual review requirement

Do not promote unless the candidate has been explicitly reviewed.

Review must confirm all of the following:

- the candidate solves a real repeated or reusable problem
- the candidate satisfies the staged goal without unsupported expansion
- the selected type is correct
- the scope is narrow enough
- the artifact is understandable on its own
- the artifact does not duplicate an existing stable artifact
- the artifact is worth long-term maintenance

If any review point is unresolved, do not promote.

## Type-correctness requirement

Promote to `skill` only when the artifact is primarily a bounded reusable procedure.

Promote to `workflow` only when the artifact is primarily a multi-stage orchestration pattern.

Promote to `rule` only when the artifact is primarily a normative constraint, review standard, boundary, or policy-like guide.

Do not promote a rule disguised as a skill, a workflow flattened into a skill, a skill written as a rule, or any mixed artifact with unclear type boundaries.

If the type is wrong but the candidate is otherwise valuable, revise before promotion.

If the artifact would only fit the goal by changing type, scope, or name materially, revise before promotion or do not promote.

## Duplication and refinement rule

Check for overlap in `.opencode/skills/`, `.opencode/workflows/`, and `.opencode/rules/` before promotion.

If an existing stable artifact already covers substantially the same purpose, do not create a new artifact by default. Prefer refinement of the existing artifact.

A new artifact is allowed only if the scope is materially distinct, the naming is clearer, the separation improves maintainability, and the overlap is low enough to justify a new artifact.

Minor wording changes, renaming, or trivial specialization are not sufficient reason for a new artifact.

## Install-worthiness requirement

An artifact is install-worthy only if all of the following are true:

- it is likely to be reused
- it has stable boundaries
- it has clear invocation or usage conditions
- it has clear non-goals
- it is not too tied to one current task
- it is not merely a temporary note or reflection
- it can be adopted without needing to reopen the original source session

Reject promotion if the artifact is better kept as temp documentation, review notes, a one-off task summary, or a project-specific local note.

## Naming requirement

Before promotion, review the final artifact name.

The name must be clear, stable, specific, and not misleadingly broad.

The name must not overclaim scope, use vague terms like `general`, `helper`, `improve`, or `better`, or hide whether it is procedural, orchestrational, or normative.

If naming is weak, revise before promotion.

The name should reflect the actual goal being solved rather than the originating session.

## Minimality requirement

Only the minimum necessary stable artifacts should be promoted.

Do not promote extra files just because they were generated in temp.

Promotion is selective, not all-or-nothing.

## Quality requirements by type

### For skills

A promotable skill must have clear purpose, when to use, when not to use, required inputs or references, a bounded process, output requirements, stop conditions, and non-goals.

When the staged package came from a source session plus explicit goal, the promoted skill should reflect that goal in its purpose and trigger guidance.

### For workflows

A promotable workflow must have a clear objective, stage boundaries, decision points or gates, stop conditions, and an explicit staging or install boundary if relevant.

### For rules

A promotable rule must have a clear objective, explicit must and must not statements, understandable scope, actionable acceptance or rejection logic, and no hidden dependency on the original session context.

## Hard rejection conditions

Do not promote if any of the following is true:

- the candidate is under-evidenced
- the candidate misses the staged goal or only matches it superficially
- the candidate is too broad
- the candidate is too local to the originating task
- the candidate duplicates existing stable functionality
- the candidate type is wrong or unclear
- the artifact depends on original session context to make sense
- the artifact would create long-term maintenance burden with low reuse value

## Promotion output expectation

A promotion decision must be explicitly one of:

- promote as-is
- promote after revision
- refine existing artifact instead
- do not promote

Promotion should never be implicit.

## Guiding mindset

Stable artifact space is expensive.

Promote only artifacts that make the system cleaner, more reusable, and easier to operate later.

Prefer fewer stronger artifacts over more weaker artifacts.
