# Internal Guidance: Worthiness Check

## Objective

Evaluate extracted candidate patterns and decide whether exactly one candidate is strong enough to continue to staged packaging.

This step is a strict filter.

It must select exactly one candidate or return `reject`.

It must not pass through multiple candidates, force packaging when evidence is weak, or promote anything into stable locations.

## Core principle

A candidate is worthy only if it is evidence-based, goal-aligned, reusable, bounded, non-trivial, and clearly representable as exactly one of `skill`, `workflow`, or `rule`.

If any of those is weak, prefer `reject`.

## Inputs

Use the extracted candidate set from the pattern-extraction step, source-session evidence, the explicit goal, current workspace artifacts, and existing stable artifacts under `.opencode/skills/`, `.opencode/workflows/`, and `.opencode/rules/`.

Apply the governing rules from `@.opencode/rules/learn-skill-from-session/candidate-rule.md` and `@.opencode/rules/learn-skill-from-session/promotion-rule.md`.

## Required evaluation dimensions

Evaluate each candidate on all of the following dimensions.

### 1. Evidence strength

Ask whether the candidate is supported by explicit session evidence, points to concrete decisions or artifacts, and is not mostly interpretation.

Reject if evidence is thin, indirect, or speculative.

### 2. Reuse potential

Ask whether this would help in a similar future task, survive outside the originating session, and remain useful without major rewriting.

Reject if it only fits the exact task or depends too much on local details.

### 3. Goal alignment

Ask whether the candidate actually solves the explicit target goal, whether it misses important parts of the requirement, and whether it would need invented scope to look like a fit.

Reject if alignment is weak, superficial, or only achievable by unsupported extrapolation.

### 4. Boundedness

Ask whether the scope is tight and can remain one artifact.

Reject if it is too broad, mixes unrelated concerns, or keeps expanding when described.

### 5. Type clarity

Ask whether this is primarily a skill, workflow, or rule.

Reject if classification remains ambiguous, mixes multiple types, or cannot be represented cleanly.

### 6. Non-triviality

Ask whether this is more than common sense and would actually help later as an artifact.

Reject if it is generic advice or a weak restatement of good practice.

### 7. Duplication risk

Ask whether a stable artifact already covers this, whether it is really a refinement, and whether a new artifact would create confusion.

Reject as a new candidate if it materially duplicates an existing artifact.

If valuable but overlapping, mark it as refine existing artifact instead.

## Decision method

### Step 1 - Judge informally

For each candidate, judge strong, moderate, or weak across the seven dimensions.

Do not use fake numeric precision.

### Step 2 - Eliminate weak candidates

Drop any candidate that fails hard on evidence strength, boundedness, type clarity, or duplication.
Drop any candidate that fails hard on goal alignment.

### Step 3 - Compare remaining candidates

If multiple viable candidates remain, prefer the one with the strongest evidence, strongest goal alignment, highest future reuse value, clearest boundaries, lowest duplication risk, and clearest artifact type.

### Step 4 - Make a forced final choice

Return exactly one of `selected candidate` or `reject`.

No ties.
No multiple finalists.

## Special handling: refine vs new

If the best candidate overlaps strongly with an existing stable artifact, do not treat it as a clean new artifact candidate by default.

Instead classify it internally as worthy in principle but better as a refinement of the existing stable artifact.

The staged package must then clearly say that the preferred outcome is to refine the existing artifact instead of creating a new one.

## Required output for downstream synthesis

The selected result must include:

- selected candidate name
- selected artifact type: `skill`, `workflow`, `rule`, or `reject`
- concise justification
- main evidence
- goal-fit summary
- main reuse rationale
- duplication note
- preferred promotion path: new artifact, refine existing artifact, or reject

## Hard constraints

- Select exactly one final result.
- Do not keep backup candidates in the final path.
- Prefer reject over a weak candidate.
- Do not allow `unknown` as a final type.
- Do not continue with a candidate that depends on the original session to make sense.
- Do not continue with a candidate that fails the explicit goal even if it is otherwise reusable.

## Evaluator mindset

Be conservative.

This step protects stable artifact quality.

Prefer one strong staged candidate over one questionable staged candidate.
