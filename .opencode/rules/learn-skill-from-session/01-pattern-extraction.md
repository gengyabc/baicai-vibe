# Internal Guidance: Pattern Extraction

## Objective

Extract a small set of candidate reusable patterns from the source session, the explicit target goal, and the minimum necessary workspace evidence.

This step is discovery only.

It must not decide final promotion, install anything, generate stable artifacts, or force every useful observation into a reusable artifact.

## Scope of evidence

Use only evidence from the current task context, especially:

- the fetched source session
- the explicit target goal or requirement
- artifacts explicitly referenced by the source session
- relevant plans under `.planning/`
- relevant specs
- relevant rules already used
- review outputs
- relevant changed files

Do not mine the whole repo, assume historical repetition without evidence, or generalize from vague impressions.
Do not mistake the goal text for evidence.

## What counts as a candidate pattern

A candidate pattern is a reusable working unit that appeared in the session.

It should usually be one of these:

- procedural pattern: a bounded sequence of steps that solved a repeatable problem
- orchestration pattern: a multi-stage structure with gates, phases, or decision points
- normative pattern: a reusable rule, boundary, review standard, or acceptance logic

## What to look for

Look for patterns such as:

- repeated decision logic
- stable constraints that shaped the work
- step sequences that clearly improved outcomes
- a failure -> correction -> success loop
- a reusable boundary or review rule
- a consistent transformation process from one artifact type to another
- a reliable staging or promotion rule
- a reusable procedure or rule that best fits the target goal

Focus on patterns that appear structurally reusable, not just locally convenient.

## What not to extract

Do not extract generic advice, personality or style preferences, broad slogans, one-off task content, project-specific facts, raw output sections that are not reusable methods, or “be careful” style observations.

Reject patterns that are merely good writing, good judgment in general, a one-time decision, or a local workaround.

## Extraction method

### Step 1 - Build a compact evidence map

Summarize the source session into:

- main problem being solved
- explicit target goal or requirement
- major artifacts involved
- key decisions made
- constraints enforced
- any corrections or refinements

Keep this compact.

### Step 2 - Identify reusable units

Ask:

- What actually worked here in a way that could work again?
- What logic or sequence would be reusable in a similar task?
- What rule or boundary was enforced repeatedly or clearly enough to reuse?
- What structure made the outcome cleaner or safer?
- Which candidate best satisfies the stated goal without stretching beyond the evidence?

### Step 3 - Draft candidate patterns

Produce 2-5 internal candidates max.

Each candidate should include:

- temporary name
- candidate type guess: skill, workflow, rule, or unknown
- short description
- concrete evidence
- goal-fit note
- rough reuse rationale

### Step 4 - Trim aggressively

Drop any candidate that is vague, too broad, too tied to this one task, duplicative, or too weakly evidenced.

## Candidate writing format

For each candidate, use this internal shape:

### Temporary name
A short working name in kebab-case or compact title form.

### Type guess
One of skill, workflow, rule, or unknown.

This is provisional only.

### Problem it appears to solve
One short paragraph.

### Evidence from the source session
List concrete supporting evidence such as specific steps, artifact transitions, decisions, corrections, or constraints.

### Why it might be reusable
One short paragraph.

### Risk of overfitting
One short paragraph.

## Quality bar

A strong candidate should feel like:

- this would help again in a similar situation
- this has clear scope
- this is more than common sense
- this can later be expressed as one artifact type

A weak candidate usually feels like:

- this was just part of working
- this is too broad to package
- this depends on session-specific context
- this is more note than reusable artifact

## Preference order during extraction

When multiple possibilities exist, prefer candidates that are:

1. more evidence-backed
2. more reusable across similar tasks
3. narrower in scope
4. easier to classify later
5. more likely to survive review

## Hard extraction limits

- Do not produce more than 5 internal candidates.
- Do not collapse unrelated ideas into one candidate.
- Do not force a candidate if evidence is weak.
- Do not pre-commit to promotion.
- Do not generate final artifact files in this step.

## Output expectation for downstream evaluation

The downstream evaluator should receive a short ranked set of candidate patterns.

That set should be small, concrete, and reviewable.

Prefer fewer stronger candidates over many weak observations.
