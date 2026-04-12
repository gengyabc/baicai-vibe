# Internal Guidance: Synthesize Candidate Package

## Objective

Transform the selected worthy result into a reviewable staged package under temp.

This step must produce a package that is explicit, type-correct, reviewable, narrow in scope, and independent enough to evaluate without rereading the source session.

This step stages artifacts only.

It must not install into stable locations, silently refine stable artifacts, or generate multiple competing final packages.

## Output location

Write all outputs under `.temp/reusable-artifact-candidates/current/`.

Required files:

- `.temp/reusable-artifact-candidates/current/candidate.md`
- `.temp/reusable-artifact-candidates/current/package.md`

Optional draft files, depending on selected type:

- `.temp/reusable-artifact-candidates/current/artifacts/SKILL.md`
- `.temp/reusable-artifact-candidates/current/artifacts/workflow.md`
- `.temp/reusable-artifact-candidates/current/artifacts/rule.md`

Generate only the draft file that matches the selected final type.

If the final type is `reject`, do not generate artifact drafts.

## Inputs

Use only the selected result from worthiness check, source-session evidence, the explicit goal, relevant current workspace artifacts, existing stable artifacts only as needed for duplication or refinement context, and the governing rules from `@.opencode/rules/learn-skill-from-session/candidate-rule.md` and `@.opencode/rules/learn-skill-from-session/promotion-rule.md`.

Do not invent extra evidence.
Do not broaden the candidate during packaging.
Do not improve scope beyond what the evidence supports.

## Packaging principles

The package must answer four review questions clearly:

1. What is the proposed reusable artifact?
2. Why is it reusable?
3. Why is this artifact type correct?
4. Should it become a new stable artifact, refine an existing one, or be rejected?

It must also make the source goal easy to review against the draft.

The package should make review easier, not harder.

## Presentation Before Write

**CRITICAL**: Do NOT write any files until after the user alignment gate passes.

Use `@.opencode/rules/learn-skill-from-session/user-alignment-gate.md`.

### Presentation Order

1. First, prepare the candidate summary for user review
2. Present to user following the gate requirements
3. Await explicit approval
4. Only then proceed to write candidate.md, package.md, and draft artifacts

### If User Does Not Approve

- STOP and do NOT write any staging files
- Summarize the candidate and await user direction
- If user requests changes, return to appropriate prior stage
- If user explicitly rejects, document rejection rationale and stop

## Required contents: candidate.md

`candidate.md` is the reasoning summary for human review.

Prepare this content for user presentation, then write it only after approval.

It must include:

- title: `# Candidate: <name>`
- final status: `skill`, `workflow`, `rule`, or `reject`
- proposed name
- source session link
- target goal or requirement
- problem it solves
- evidence from source session
- goal-fit summary
- why it is reusable
- why this artifact type was selected
- scope boundaries
- duplication or refinement note
- risks or overfitting
- review recommendation

## Required contents: package.md

`package.md` is the install-facing summary.

It must include:

- title: `# Package: <name>`
- final type
- source session link
- target goal or requirement
- proposed stable target path
- staged draft path
- promotion preference
- goal-satisfaction check
- review checklist
- required revisions before promotion
- notes

## Draft synthesis rules by type

Generate draft artifacts only when the final type is not `reject`.

### If final type is `skill`

Generate `artifacts/SKILL.md`.

The skill draft must include frontmatter, clear purpose, when to use, when not to use, required inputs or references, bounded process, output requirements, stop conditions, and non-goals.

When useful, include concise trigger wording that reflects the staged goal and intended usage.

The skill must read like a reusable capability, not a session summary.

Do not include wording that depends on the original session such as “in this session”, “current conversation”, or “the above work”.

### If final type is `workflow`

Generate `artifacts/workflow.md`.

The workflow draft must include objective, stage sequence, decision points or gates, stop conditions, staging or install boundary if relevant, and non-goals where useful.

The workflow must read like reusable orchestration guidance, not a one-off recipe tied to the originating task.

### If final type is `rule`

Generate `artifacts/rule.md`.

The rule draft must include objective, scope, explicit must and must not logic, acceptance or rejection conditions, and boundaries.
