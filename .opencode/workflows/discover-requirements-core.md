## Objective

Transform an initial user request into neutral, plan-ready proposed units that a project wrapper can persist only after explicit user approval.

Optimize for planner input quality: the output must contain enough information for a later planner to generate a local implementation plan correctly, with no missing essentials and no project-specific persistence assumptions.

## Rules

- @.opencode/_vendor/baicai-vibe/rules/discovery-analysis-style.md
- @.opencode/_vendor/baicai-vibe/rules/discover-requirements-core-contract.md

---

## Step 1 - Restate the request

Restate:

- what the user says they want
- what is unclear
- what kind of result they expect

Do not assume correctness.

---

## Step 2 - Planner-first analysis

Before asking questions, analyze the request in planning terms.

Identify:

- who is acting
- what they are trying to accomplish
- what triggers the behavior or workflow
- what success looks like
- what failure or blocked behavior looks like
- what existing behavior must not change
- which boundaries or edge cases are likely to affect planning
- what is still ambiguous for planning

Rules:

- focus on behaviors and constraints, not implementation details
- prefer information that helps define objective, locked constraints, scope, invariants, and deferred follow-up later
- do not add broad product analysis unless it changes planning scope or decomposition

---

## Step 3 - Identify gaps

Check whether these are clear:

- user or actor
- desired outcome
- trigger or workflow entry point
- current problem
- success outcome
- failure outcome
- constraints
- scope boundaries
- non-goals
- existing behavior that must not change
- important edge cases or boundary conditions
- success criteria

---

## Step 4 - Ask focused questions

Ask only high-leverage questions.

Rules:

- 3-6 questions max per round
- prefer A/B or contrast questions
- avoid implementation questions
- ask proactively, not only when ambiguity is obvious
- cover the categories that matter for planning: functional outcome, scope boundary, failure or warning behavior, preserved behavior, and hidden assumptions
- surface all known blocking questions before returning `ready`
- surface non-blocking open questions before returning `ready` whenever they would materially affect planning

---

## Step 5 - Infer real need

Infer:

- real objective
- hidden constraints
- misunderstanding risks

Separate clearly:

- the user's stated request
- the underlying problem to solve
- the behavior that must be preserved
- any solution-shaped language that should be restated as user need or outcome

If justified, clarify:

"Your stated request is X, but your real need seems to be Y."

---

## Step 6 - Validate planning inputs

Before treating discovery as converged, validate that the discovered request is:

- specific enough to avoid obvious re-questions during planning
- observable enough that success and failure can be described clearly
- testable enough to support later TDD planning
- scoped tightly enough to fit one unit, or clearly large enough to justify decomposition into an ordered unit sequence

If not, continue discussion.

---

## Step 7 - Edge cases and error states

Review only the edge cases that materially affect planning.

Check for:

- empty, missing, or invalid states
- incompatible actions or blocked paths
- warnings versus hard errors
- first, last, and boundary conditions
- unexpected user actions that need defined outcomes

Rules:

- capture only behaviors that affect scope, constraints, or success criteria
- do not expand into full implementation or exhaustive test design

---

## Step 8 - Assess planning risks

Perform a lightweight risk assessment focused on plan quality.

Check for:

- ambiguity risk: important behavior is still underspecified
- scope risk: adjacent nice-to-haves are bleeding into this request
- dependency risk: other steps, teams, APIs, or missing decisions block safe planning
- testability risk: success criteria are too vague to translate into TDD planning

For each material risk, choose one:

- resolve now with a user question
- document as an explicit assumption
- keep as an explicit non-blocking open question
- stop because it blocks planning

Do not include generic risk prose that does not affect planning.

---

## Step 9 - Converge

Stop asking when these are clear enough:

- problem
- objective
- scope
- constraints
- success criteria

Also require:

- important boundary and failure behavior is known well enough for planning
- remaining open questions are truly non-blocking

Do not over-interview.

If the user is still brainstorming, comparing options, asking or answering questions, or expressing uncertainty, treat discovery as still in progress.

When the request is ready, explicitly decide one of these outcomes before asking for approval:

- one proposed unit is sufficient
- multiple ordered proposed units are required

---

## Step 10 - Planning readiness gate

Before any local wrapper is allowed to persist anything:

All must be sufficiently clear:

- problem
- real objective
- scope boundaries
- constraints
- success criteria
- important boundary and error behavior that affects planning
- all blocking questions have been resolved or explicitly deferred by the user
- all material non-blocking open questions have already been surfaced to the user
- the result is concise enough to serve as planner input rather than a general analysis dump

If not:

- continue discussion
- return `status: needs-more-discovery`

---

## Step 11 - Approval gate

Even when the request is ready for planning, do not authorize persistence until the user explicitly approves.

Required behavior before asking for approval:

- present the proposed requirement direction
- present the decomposition decision: one unit or multiple ordered units
- present one-sentence focus per proposed unit
- present the main assumptions that will appear in the stored requirement content
- present any remaining non-blocking open questions
- present any remaining non-blocking planning risks and how they are being handled
- state the proposed durable key or ordered key set
- ask whether to approve the proposed set for persistence

Rules:

- silence, continued discussion, or implied agreement is not approval
- if approval is not explicit, stop after summarizing the current discovery state
- do not mention local folders or files

---

## Step 12 - Return contract result

Return only the neutral structured result defined in @.opencode/_vendor/baicai-vibe/rules/discover-requirements-core-contract.md.

Hard constraints:

- do not reference `@.planning/phase/`
- do not assign local step numbers
- do not mention `requirement.md` or any local artifact path
- do not write files
