# Workflow: Learn Reusable Artifact From Referenced Session

## Objective

Derive one reusable artifact candidate from a referenced session and an explicit target goal, then stage it for review.

The final result must be exactly one of `skill`, `workflow`, `rule`, or `reject`.

All outputs must be written to `.temp/reusable-artifact-candidates/current/`.

This workflow must not install or modify any stable artifacts.

## Required References

Before proceeding, ensure all referenced rules and guidance are accessible:

- `@.opencode/rules/baicai-vibe/learn-skill-from-session/candidate-rule.md`
- `@.opencode/rules/baicai-vibe/learn-skill-from-session/promotion-rule.md`
- `@.opencode/rules/baicai-vibe/learn-skill-from-session/user-alignment-gate.md`
- `@.opencode/rules/baicai-vibe/learn-skill-from-session/01-pattern-extraction.md`
- `@.opencode/rules/baicai-vibe/learn-skill-from-session/02-worthiness-check.md`
- `@.opencode/rules/baicai-vibe/learn-skill-from-session/03-synthesize-package.md`

## Stage 0 - Input validation and scope definition

Required command inputs:

- source session share link
- target goal or requirement for the reusable artifact

If either input is missing, stop.

Fetch the source session first.

If the link cannot be fetched or the content is not usable as evidence, stop.

Limit analysis to:

- the fetched source session discussion
- the explicit target goal or requirement
- artifacts directly referenced by the source session or needed to check duplication and install fit
- relevant stable artifacts involved in overlap checking

Do not scan the entire repository.
Do not infer patterns beyond available evidence.
Do not assume repetition without proof.
Do not treat the target goal as evidence by itself.

## Stage 1 - Evidence collection

Collect a compact evidence set:

- source session link
- target goal or requirement
- key steps taken in the source session
- decisions made
- constraints enforced
- artifacts created or modified
- any failure -> correction -> success loop

Summarize the evidence into a short working set.

Also summarize the goal into concrete fit criteria:

- what the resulting reusable artifact should help accomplish
- what type it probably wants to be, if obvious
- what would count as missing the goal

## Stage 2 - Pattern extraction

Use `@.opencode/rules/baicai-vibe/learn-skill-from-session/01-pattern-extraction.md` and `@.opencode/rules/baicai-vibe/learn-skill-from-session/candidate-rule.md`.

Identify candidate patterns that capture:

- what sequence or logic actually worked
- what constraints remained stable
- what decisions are reusable
- what could be applied in a similar task
- what best satisfies the explicit goal without inventing unsupported scope

Generate 2-5 internal candidates max.

Each candidate must include:

- temporary name
- description
- supporting evidence

## Stage 3 - Worthiness evaluation

Use `@.opencode/rules/baicai-vibe/learn-skill-from-session/02-worthiness-check.md`.

Evaluate the candidates and select exactly one, or return `reject`.

Reject patterns that are vague, obvious, one-off, tightly coupled to this repo or task, or not reproducible.
Reject patterns that match the goal only superficially.

Prefer patterns that are bounded, high-leverage, reusable, and explainable as a procedure, rule, or workflow.

If no candidate passes, the final result must be `reject`.

## Stage 4 - Artifact type classification

Choose `skill` if the result is a reusable bounded procedure with clear inputs and outputs.

Choose `workflow` if the result is a reusable orchestration pattern with ordered stages or gates.

Choose `rule` if the result is a reusable constraint, standard, boundary, review rubric, or acceptance rule.

Choose `reject` if the candidate is unclear or not strong enough.

## Stage 5 - Synthesize candidate

Use `@.opencode/rules/baicai-vibe/learn-skill-from-session/03-synthesize-package.md` and the candidate and promotion rules.

Produce the candidate summary for presentation (do NOT write files yet):

### Candidate Summary Contents

Prepare for user presentation:

- final type: `skill`, `workflow`, `rule`, or `reject`
- proposed artifact name
- source session link
- target goal or requirement
- problem it solves
- why it is reusable (evidence summary)
- scope boundaries (what it is NOT)
- goal-fit assessment (how well it matches the stated goal)
- risks or overfitting concerns
- if not `reject`: brief outline of proposed artifact content

## Stage 6 - User alignment gate

Use `@.opencode/rules/baicai-vibe/learn-skill-from-session/user-alignment-gate.md`.

### Present to User

Present the candidate summary clearly:

1. **Proposed Artifact Overview**
   - Name and type
   - Problem it solves
   - Reusability justification

2. **Goal Alignment Assessment**
   - How well it addresses the target goal
   - Any gaps or mismatches

3. **Scope and Boundaries**
   - What is included
   - What is explicitly excluded

4. **Risk Summary**
   - Overfitting risks
   - Reusability limitations

5. **Explicit Approval Question**
   - Ask: "Should I stage this candidate?"
   - Options: "yes/proceed" or "no/revise/reject"

### Await Explicit Approval

Valid approval forms:
- "yes", "approve", "write it", "stage it", "proceed"
- Direct confirmation like "this looks good, go ahead"

NOT approval:
- Silence or no response
- Continued discussion without explicit confirmation
- "ok" or "sure" without explicit go-ahead
- Hedging like "maybe" or "let me think about it"

### Gate Decision

IF user approves explicitly:
→ Proceed to Stage 7 (Draft and Stage)

ELSE IF user requests changes:
→ Return to Stage 2, 3, or 4 as appropriate
→ Update candidate based on feedback
→ Re-synthesize and re-present

ELSE IF user rejects:
→ Change final type to `reject`
→ Proceed to Stage 7 to write rejection documentation

ELSE (no explicit response):
→ STOP
→ Do NOT write any files
→ Summarize current state and await user input

## Stage 7 - Draft and stage artifacts

Only proceed if Stage 6 resulted in explicit approval or explicit rejection.

### If Approved and Type is NOT `reject`:

Write required staged files:

1. **candidate.md**
   - Include all fields from Stage 5 summary
   - Add detailed evidence from source session
   - Document why the type was selected
   - Include review recommendation

2. **package.md**
   - Proposed artifact paths
   - Install recommendation (default: no)
   - Required review points
   - Duplication check guidance
   - Goal-satisfaction check guidance

3. **Draft artifact** (in `artifacts/` subdirectory):
   - If `skill`: `artifacts/SKILL.md`
   - If `workflow`: `artifacts/workflow.md`
   - If `rule`: `artifacts/rule.md`

### If Rejected (Type is `reject`):

Write only:

1. **candidate.md** - explaining:
   - Why no candidate qualifies
   - What was considered
   - What failed the criteria

2. **package.md** - documenting:
   - Rejection rationale
   - Any partial findings
   - Recommendations for future attempts

Do NOT write any draft artifact files when rejected.

### Output Location

Write all outputs under:

```text
.temp/reusable-artifact-candidates/current/
  candidate.md
  package.md
  artifacts/ (if not reject)
```

Do not write anywhere else.

## Stage 8 - Final validation

Before finishing, ensure:

- exactly one final type is chosen
- the candidate is supported by real evidence
- the candidate fits the explicit goal closely enough to justify the chosen type
- the scope is narrow and reusable
- no stable files were modified
- artifacts are consistent with the chosen type
- if approved: all staged files are written correctly
- if rejected: rejection is documented clearly

## Stage 9 - Stop

Stop after staging.

Do not install artifacts.
Do not modify `.opencode/skills/baicai-vibe/`, `.opencode/workflows/baicai-vibe/`, or `.opencode/rules/baicai-vibe/`.

Return summary to user:
- Final type (skill/workflow/rule/reject)
- Approval status (approved/rejected/pending)
- Staged files written (if approved)
- Rejection rationale (if rejected)
- Next steps for review or iteration

## Notes

- Prefer precision over completeness
- Prefer reject over a weak artifact
- Prefer rule over a fake skill
- Prefer workflow over an over-complicated skill
- Default to no installation

This workflow is a reflection and staging mechanism, not an auto-evolution system.
