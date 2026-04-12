---
description: Derive one reusable skill, workflow, or rule candidate from a referenced session and stage it for review
agent: build
model: bailian-coding-plan/glm-5
argument-hint: <session-share-link> <goal-or-requirement>
---

The first argument is the source session share link: `$1`
The second argument is the target goal or requirement for the reusable artifact: `$2...`

## Validate arguments

- `$1` is required and must be a fetchable session share link
- `$2...` is required and must state the intended reusable outcome, problem, or requirement
- if either argument is missing, STOP and report the missing input

## Objective

Stage exactly one reusable artifact candidate from the source session evidence and the explicit target goal.

This command is staging-only. It must not install into stable locations.

## Required references

Follow:

- `@.opencode/workflows/learn-skill-from-session.md`
- `@.opencode/rules/learn-skill-from-session/candidate-rule.md`
- `@.opencode/rules/learn-skill-from-session/promotion-rule.md`
- `@.opencode/rules/learn-skill-from-session/user-alignment-gate.md`

Use the supporting guidance in:

- `@.opencode/rules/learn-skill-from-session/01-pattern-extraction.md`
- `@.opencode/rules/learn-skill-from-session/02-worthiness-check.md`
- `@.opencode/rules/learn-skill-from-session/03-synthesize-package.md`

## Inputs

Primary inputs:

- source session share link: `$1`
- target reusable-artifact goal or requirement: `$2...`

Use only evidence from the fetched source session, the explicit goal, and directly relevant workspace artifacts needed for duplication checks or target-shape alignment.

Do not mine the whole repository for generic patterns.
Do not infer the goal from the session when `$2...` already constrains the outcome.
Do not ignore strong source-session evidence just because the goal is underspecified.

## Output staging location

Write all outputs under `.temp/reusable-artifact-candidates/current/`.

Required staged files:

- `.temp/reusable-artifact-candidates/current/candidate.md`
- `.temp/reusable-artifact-candidates/current/package.md`

Optional staged draft artifacts:

- `.temp/reusable-artifact-candidates/current/artifacts/SKILL.md`
- `.temp/reusable-artifact-candidates/current/artifacts/workflow.md`
- `.temp/reusable-artifact-candidates/current/artifacts/rule.md`

Create only the draft file that matches the selected final type.

## Final types

The final staged result must be exactly one of:

- `skill`
- `workflow`
- `rule`
- `reject`

Choose `skill` for a bounded reusable procedure.

Choose `workflow` for a reusable multi-stage orchestration pattern.

Choose `rule` for a reusable constraint, standard, boundary, or review gate.

Choose `reject` when no candidate is strong enough, narrow enough, or reusable enough.

## Hard constraints

- Derive exactly one candidate by default.
- Treat the explicit goal as a shaping constraint, not as permission to invent unsupported evidence.
- Prefer narrow, high-value, repeatable capability or guidance.
- Reject candidates that are too generic, too local, too one-off, or already covered.
- Do not promote or install automatically.
- Do not modify stable files under `.opencode/skills/`, `.opencode/workflows/`, or `.opencode/rules/`.
- The staged candidate must make sense without rereading the source session link.

## Procedure

1. Fetch and summarize the source session from `$1`.
2. Extract a small set of candidate patterns from the source-session evidence.
3. Evaluate those candidates against both the evidence and `$2...`.
4. Select exactly one final result or `reject`.
5. Synthesize candidate summary for user presentation (do NOT write files yet).
6. **Present candidate to user and await explicit approval.**
7. If approved, write `candidate.md`, `package.md`, and matching draft artifact (if not `reject`).
8. If rejected, document rejection rationale in `candidate.md` and `package.md`.
9. Stop.

## Stop conditions

Stop and report clearly if any of the following is true:

- there is not enough evidence in the source session
- the source session share link cannot be fetched or does not contain enough usable evidence
- no reusable pattern is strong enough
- the candidate is better represented as a note than as a reusable artifact
- the scope cannot be kept narrow
- the candidate would duplicate an existing stable artifact without a clear refinement case
- the explicit goal and the source-session evidence do not align closely enough to support a safe artifact
- **user does not give explicit approval to stage the candidate**

If stopped due to evidence/pattern issues, still write useful `candidate.md` and `package.md` that explain why no artifact should be promoted.

If stopped due to lack of user approval, do NOT write any staging files. Summarize the candidate and await user direction.

## Completion criteria

This command is complete only when all of the following are true:

- user has given **explicit approval** to stage the candidate (or explicitly rejected it)
- `.temp/reusable-artifact-candidates/current/candidate.md` exists
- `.temp/reusable-artifact-candidates/current/package.md` exists
- any proposed artifact draft is written under `.temp/reusable-artifact-candidates/current/artifacts/` (if not rejected)
- the final result is explicitly marked as exactly one of `skill`, `workflow`, `rule`, or `reject`
- the source session link and target goal are recorded in the staged package
- no stable install has occurred

If user does not give explicit approval, the command is NOT complete. Stop and await user direction.
