# Rule: Learned Artifact Candidate Qualification

## Objective

Define strict criteria for deciding whether a reusable artifact candidate can be derived from a source session.

This rule prevents over-generalization, noisy generation, duplicate artifacts, and pollution of stable skill, workflow, and rule space.

## Core principle

A candidate must be evidence-based, goal-aligned, reusable, and bounded.

If any part is weak, reject it.

## Evidence requirements

A candidate must be supported by explicit evidence from the source session:

- concrete steps taken
- real decisions made
- actual constraints enforced
- an observable success pattern or corrected failure

The candidate must reference real artifacts or steps and must not rely on assumptions or imagined repetition.

Reject if evidence is weak or implicit.

## Goal-alignment requirements

A candidate must materially satisfy the explicit goal or requirement given for the run.

Reject if it:

- only loosely matches the goal
- solves a different problem than the requested reusable artifact
- expands beyond the evidence just to satisfy the goal text
- ignores an important constraint or intended use captured in the goal

## Reusability requirements

A candidate must be applicable to similar tasks beyond the current one.

Reject if it depends on:

- specific file paths
- specific project-only conventions
- one-off data or content

Reject if it is only useful for this exact task, too tied to one implementation detail, or cannot be reused without major modification.

## Boundedness requirements

A candidate must have a defined scope and remain small enough to describe as one artifact.

Reject if it is too broad, mixes unrelated concerns, or expands into a whole workflow system.

## Type clarity requirements

The candidate must clearly map to exactly one type:

- skill
- workflow
- rule

Reject if classification is ambiguous, mixes execution and policy, or tries to be both skill and rule.

If the goal suggests one type but the evidence supports another, follow the evidence and explain the mismatch.

## Non-triviality requirement

The candidate must provide meaningful value.

Reject if it is obvious common sense, already implied by basic good practice, or generic advice.

## Non-duplication requirement

Check whether a similar artifact already exists in `.opencode/skills/`, `.opencode/workflows/`, or `.opencode/rules/`.

Reject if it duplicates an existing artifact or only renames or slightly rephrases an existing concept.

If it is similar but clearly better, mark it as a refinement candidate instead of a new artifact.

## Single-candidate constraint

Select exactly one candidate per run or return `reject`.

Do not generate multiple candidates or bundle multiple ideas into one artifact.

## Preference rules

When multiple valid candidates exist, prefer:

1. highest reuse potential
2. strongest fit to the explicit goal
3. clearest boundaries
4. strongest evidence
5. simplest representation

## Hard rejection conditions

Immediately reject if any of the following is true:

- insufficient evidence
- weak alignment to the stated goal
- vague or abstract pattern
- not reusable beyond the current task
- overly broad scope
- duplicate of an existing artifact
- cannot clearly classify as skill, workflow, or rule

## Output requirement on rejection

If rejected, still produce `candidate.md` and explain:

- why no candidate qualifies
- what was considered
- what failed the criteria

## Guiding mindset

Prefer no artifact over a bad artifact.

A bad learned artifact is worse than no learning at all.
