---
name: create-artifact
description: Create or improve OpenCode artifacts such as skills, commands, workflows, and rules. Use this whenever the user wants to draft, refactor, benchmark, compare, package, or optimize an artifact or an existing artifact stack, especially when the request involves modifying a command together with its related workflows, rules, or skills, adding QA/review/alignment loops, reusing nearby artifacts, or improving how an artifact is triggered, invoked, routed, or applied in OpenCode.
---

# Artifact Creator

Create or improve an OpenCode artifact end to end: understand the intended workflow, write or revise the artifact, evaluate it on realistic prompts or scenarios, review the results with the user, iterate, and optionally optimize the description or routing guidance for triggering and use.

This skill should also trigger for **artifact-stack optimization** requests, not only for brand-new artifact creation.

Strong trigger examples:
- improve an existing command and its related workflows, rules, or skills
- add a QA loop, review gate, approval gate, or user-alignment loop to an artifact stack
- refactor a command/workflow/rule set while preserving local conventions
- extract or reuse existing workflows, rules, commands, or skills instead of inventing a parallel path
- compare alternative artifact designs before patching
- optimize how an existing artifact is triggered, routed, invoked, or applied

If the request is about changing one or more OpenCode artifacts and the work would benefit from artifact-aware design, evaluation, or reuse analysis, prefer invoking this skill instead of directly editing files ad hoc.

This skill is for OpenCode. Prefer OpenCode-native tools, file conventions, and agent workflows.

Supported artifact types:
- skills
- commands
- workflows
- rules

## Model Fit

Write instructions that work well for both `gpt-5.4` and `codex-5.3`.

- Keep the artifact concrete and direct. Both models do better with explicit actions, outputs, and stop conditions than with motivational prose.
- Prefer short imperative steps over long narrative explanation.
- Explain the reason behind non-obvious constraints, but do not overexplain obvious ones.
- Avoid brittle micromanagement. State the invariant the model must preserve, then the preferred method.
- Keep trigger descriptions broad enough to fire reliably, but ground them in actual user intents rather than keyword spam.
- When the workflow has objective artifacts, prefer scripts, schemas, and file-based checkpoints over purely conversational judgment.

## Operating Style

Follow this loop and jump in at the stage the user is already in:

1. Capture intent.
2. Choose the execution mode.
3. Draft or revise the artifact.
4. Reuse or create evals as needed.
5. Run comparison evals when meaningful.
6. Review outputs and benchmark data with the user.
7. Improve the artifact.
8. Repeat until the user is satisfied or progress stalls.
9. Optionally optimize the description for triggering.
10. Optionally package the artifact.

Be flexible. If the user only wants to brainstorm, do that. If they already have a draft, skip straight to evaluation and iteration.

## Execution Modes

Choose the lightest mode that still gives trustworthy feedback.

### Mode A: full
Use for:
- brand new artifacts
- major workflow redesign
- changed scope or output contract
- major description rewrite

Required:
1. clarify intent if needed
2. draft/revise artifact
3. create or update evals
4. run comparison evals
5. grade and benchmark
6. generate review artifact
7. iterate

### Mode B: delta

Use for:
- wording changes
- tighter stop conditions
- small workflow adjustments
- minor improvements to existing behavior

Required:
1. revise artifact
2. reuse existing evals
3. run only the affected eval subset first
4. compare against the previous version of the artifact
5. expand to full evals only if needed

Escalate to `full` if:
- results are ambiguous
- improvements regress prior strengths
- changes affect multiple behaviors beyond the initial subset

### Mode C: description-only
Use for:
- frontmatter description optimization with no behavioral change

Required:
1. keep the artifact body fixed
2. run trigger evals only
3. apply best description
4. do not rerun full behavior evals unless needed

### Change Scope Heuristic

Treat the change as **large** if it changes:
- the artifact's goal
- output contract
- core workflow
- tool strategy
- the meaning of when the artifact should be used, beyond trigger-only tuning

Treat the change as **medium** if it:
- adds a new capability
- changes important steps
- affects multiple evals

Treat the change as **small** if it only:
- clarifies wording
- tightens stop conditions
- removes redundant phrasing
- improves one localized behavior

Then choose:
- large → full
- medium → delta (expand if needed)
- small → delta

## Communicating with the User

Adjust terminology to the user's fluency.

- Use plain language by default.
- Explain terms like `JSON`, `assertion`, `baseline`, and `benchmark` briefly when the user may not know them.
- Prefer concrete examples over jargon.
- Keep updates short and action-oriented.

## OpenCode-Specific Rules

- Use the actual tools available in the session.
- Prefer `Glob` and `Grep` for search, `Read` for files, `apply_patch` for manual edits, and `multi_tool_use.parallel` for independent reads/searches.
- Use `task` agents for parallel eval execution or focused review when that is faster or cleaner than doing everything inline.
- Do not invent tool names from other environments.
- If the environment is headless, generate static review artifacts instead of relying on a live browser session.

## Creating an Artifact

This section applies to the target artifact type.

Use these default path conventions unless the repo already uses a different structure:

```text
.opencode/skills/<name>/SKILL.md
.opencode/commands/<name>.md
.opencode/workflows/<name>.md
.opencode/rules/<name>.md
```

When the user did not specify the artifact type, infer it from the intent:

- choose a **skill** for reusable capability or expertise that may be triggered across many tasks
- choose a **command** for a user-invoked entry point with arguments and a clear execution contract
- choose a **workflow** for multi-step orchestration, routing, or coordination across files/skills/agents
- choose a **rule** for stable policy, boundary, invariant, naming convention, or repository-wide guidance
- choose an **artifact stack optimization** path when the request spans multiple related artifacts and requires coordinated changes across a command, workflow, rule, or skill set

Preserve the existing artifact type unless the user explicitly wants a redesign.

### 1. Capture Intent

Extract as much as possible from the current conversation before asking more questions.

Confirm these points when they are still unclear:

1. What should the artifact help the model or user do?
2. When should it trigger, be invoked, or apply?
3. What outputs should it produce?
4. What inputs or files should it expect?
5. What does success look like?
6. Should it include evals now, later, or not at all?
7. Which artifact type is intended: skill, command, workflow, or rule?

Also clarify artifact-specific questions when relevant:

- **skill**: what user intents should cause it to trigger, and what reusable capability should it provide?
- **command**: what arguments are accepted, what validation is required, and what must the command do versus delegate?
- **workflow**: what stages, routing points, and invoked skills/agents must exist?
- **rule**: what invariant or policy must hold, and where does it apply?
- **artifact stack**: which files are in scope, which existing artifacts should be reused, what coordination or QA loop is missing, and what must remain stable while the stack is improved?

Ask about edge cases early. A small amount of clarification here avoids overfitting later.

### 2. Research and Gather Context

Before writing the artifact:

- Inspect nearby skills, commands, workflows, and rules for style, structure, naming, and composition patterns if relevant.
- Read any local scripts, schemas, contracts, plans, or references the artifact may rely on.
- Use parallel reads/searches when helpful.
- If the artifact concerns a framework or API, fetch current docs first.
- Check how adjacent artifacts call each other so the new or revised artifact fits the local architecture instead of duplicating it.

### 3. Write the Artifact

Create or revise the target artifact with the correct OpenCode shape.

For a **skill**, create or revise `SKILL.md` with these components:

- `name`: stable identifier
- `description`: the primary trigger text
- `compatibility`: only when useful
- body: the operating instructions

For a **command**, create or revise the markdown command file with:

- frontmatter including `description` and `agent` when needed
- argument contract and validation
- execution steps
- delegation points to workflows, skills, or agents
- stop conditions and output expectations

For a **workflow**, create or revise the workflow markdown with:

- objective
- inputs and assumptions
- ordered stages
- routing and decision points
- invoked skills, commands, or agents
- artifacts or files that must be produced or updated

For a **rule**, create or revise the rule markdown with:

- scope
- invariant or policy
- required behaviors
- forbidden behaviors
- examples only when they reduce ambiguity
- references to the files, contracts, or workflows the rule constrains

#### Description Guidance

The description is the main trigger mechanism for skills and often the routing clue for commands.
It should say both what the artifact does and when to use it.

Good descriptions:

- mention the user intents the artifact should win on
- include adjacent phrasing the user may use
- stay faithful to the actual capability of the artifact
- lean slightly toward under-specified user prompts so the artifact still triggers when helpful

Bad descriptions:

- list keywords without context
- promise behavior the artifact body does not support
- bury trigger guidance in the markdown body instead of the frontmatter

For workflows and rules, optimize the title, headings, and opening summary for discoverability and correct reuse, even if there is no frontmatter trigger.

### 4. Artifact Writing Guidelines

Prefer this shape:

```text
skill-name/
├── SKILL.md
├── evals/
│   └── evals.json
├── scripts/
├── references/
└── assets/
```

For other artifact types, prefer these shapes:

```text
.opencode/commands/<name>.md
.opencode/workflows/<name>.md
.opencode/rules/<name>.md
```

Use progressive disclosure:

1. Put trigger information in frontmatter.
2. Put the core operating flow in the artifact body.
3. Put bulky or reusable material in `references/`, `scripts/`, or `assets/`.

Keep the artifact focused. If it starts growing into a handbook, move stable detail into referenced files.

Artifact-specific guidance:

- **skills** should stay capability-focused and reusable across many requests
- **commands** should stay thin at the boundary and delegate reusable logic to workflows or skills when appropriate
- **workflows** should define orchestration, sequencing, and decision logic rather than duplicating detailed skill content
- **rules** should stay stable, normative, and concise; avoid embedding task-specific execution plans in rules

### 5. Writing Style

Optimize for reliable execution by `gpt-5.4` and `codex-5.3`:

- Use clear headings and short sections.
- Prefer ordered steps when sequence matters.
- State exact file paths, filenames, and JSON field names where correctness matters.
- Avoid repeated emphasis blocks and rhetorical filler.
- Use examples sparingly and only when they disambiguate.
- Use strong words like "always" or "never" only for real invariants.

## Test Cases


For a new artifact, write `2-3` realistic prompts or scenarios unless the user explicitly does not want evals yet.
For an existing artifact, reuse the current eval set first and add new prompts or scenarios only when:
- the change introduces new behavior
- new failure modes appear
- existing evals do not cover the change

Good eval prompts or scenarios:

- sound like real user requests
- exercise different parts of the artifact
- reveal likely failure modes
- are specific enough that outputs can be judged

Use the right eval shape for the artifact type:

- **skills**: realistic user prompts that should trigger the skill
- **commands**: invocation requests, argument variations, validation failures, and downstream effects
- **workflows**: end-to-end scenarios, branch conditions, and required artifacts
- **rules**: positive/negative compliance cases and near-miss examples

Save them to `evals/evals.json`:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User prompt here",
      "expected_output": "What success looks like",
      "files": [],
      "expectations": []
    }
  ]
}
```

See `references/schemas.md` for the full schema.

Show the proposed eval prompts or scenarios to the user before running them unless the user asked you to move fast without review.

## Running and Evaluating Test Cases

Prefer reusing existing evals.
Do not create new evals by default when improving an existing artifact.

Use the smallest eval subset that can validate the change first.
Only expand to the full eval set when:
- results are unclear
- changes affect multiple behaviors
- or the user asks for a full benchmark

Treat this as one continuous workflow.

Create a sibling workspace named `<artifact-name>-workspace/` and store iterations there:

```text
<artifact-name>-workspace/
  iteration-1/
    <eval-name>/
      with_skill/
      without_skill/
```

Note: Some internal tools and scripts may still use legacy names such as `skill`, `--skill-name`, or `package_skill`. Keep those names when required by the tooling, even when evaluating non-skill artifacts.

If improving an existing artifact, snapshot the old version and use that as the baseline when that comparison is more meaningful than a no-artifact baseline.

### Step 1: Launch Runs

For each eval, launch the comparison runs in the same turn when possible:

* `with_skill`: current skill
* `without_skill`: no skill for new-skill creation, or
* `old_skill`: prior version for improvement work

Adapt the comparison labels for non-skill artifacts when helpful, for example:

* `new_command` vs `old_command`
* `new_workflow` vs `old_workflow`
* `rule_applied` vs `rule_not_applied`

Use `task` agents for independent runs when available. Launch them in parallel.

Write `eval_metadata.json` for each eval directory:

```json
{
  "eval_id": 0,
  "eval_name": "descriptive-name",
  "prompt": "The full eval prompt",
  "assertions": []
}
```

Use descriptive eval names, not just `eval-0`.

### Step 2: Draft Assertions While Runs Execute

Do not wait idly for runs to finish.

* Draft assertions that check meaningful outcomes.
* Prefer objective assertions.
* Avoid assertions that only check surface compliance.
* For subjective artifacts, keep assertions light and rely more on human review.

Artifact-specific assertion examples:

- **skills**: triggered appropriately, produced the expected structure, avoided wasted work
- **commands**: validated arguments, chose the right downstream path, wrote the expected artifacts
- **workflows**: followed the intended stages, respected routing decisions, produced required intermediate files
- **rules**: enforced or preserved the intended invariant, rejected prohibited patterns, reduced drift

Update both `eval_metadata.json` and `evals/evals.json` once the assertions are ready.

### Step 3: Capture Timing Data Immediately

When a task finishes, capture `total_tokens` and `duration_ms` from the task result right away and write `timing.json` in that run directory.

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
```

This data is easy to lose. Save it as each run completes.

### Step 4: Grade and Aggregate

After all runs finish:

1. Grade each run using `agents/grader.md`.
2. Save results to `grading.json`.
3. Aggregate the iteration benchmark:

```bash
python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>
```

The viewer expects grading entries to use `text`, `passed`, and `evidence` exactly.

When assertions can be checked programmatically, prefer a script over manual inspection.

### Step 5: Generate the Review Artifact

Use the provided viewer generator. Do not build custom review HTML.

Interactive environment:

```bash
nohup python <skill-creator-path>/eval-viewer/generate_review.py \
  <workspace>/iteration-N \
  --skill-name "my-skill" \
  --benchmark <workspace>/iteration-N/benchmark.json \
  > /dev/null 2>&1 &
```

Headless environment:

```bash
python <skill-creator-path>/eval-viewer/generate_review.py \
  <workspace>/iteration-N \
  --skill-name "my-skill" \
  --benchmark <workspace>/iteration-N/benchmark.json \
  --static <workspace>/iteration-N/review.html
```

For iteration `2+`, include `--previous-workspace <workspace>/iteration-<N-1>`.

Tell the user where to review outputs and benchmark results.

### Step 6: Read Feedback

When the user finishes reviewing, read `feedback.json` and focus changes on runs with concrete complaints.

Empty feedback usually means the user was satisfied with that case.

If you launched a background review server, stop it after review is complete.

## Improving the Artifact

This is the core of the loop.

### Version Control Principle

Keep a clear `current_best` version.
Do not assume the latest iteration is the best one.

Promote a candidate only when:
- benchmark results improve meaningfully, or
- user review clearly prefers it

Otherwise, keep the previous best version.

### Improvement Principles

1. Generalize from the feedback rather than patching only the visible examples.
2. Remove instructions that cause wasted work or noisy reasoning.
3. Explain why important behaviors matter.
4. Bundle repeated helper logic into `scripts/` when multiple eval runs reinvent it.
5. Prefer the smallest artifact change that addresses the observed failure.

### Iteration Loop

After revising the artifact:

1. Update the artifact files.
2. Run the eval set again into `iteration-<N+1>/`.
3. Keep the baseline consistent unless there is a good reason to change it.
4. Generate a fresh review artifact.
5. Wait for user review.
6. Repeat until the user is happy, feedback is empty, or progress stalls.

Stop when:
- the user is satisfied
- feedback is empty
- improvements no longer change results meaningfully
- repeated failures suggest redesigning evals or scope first

## Description Optimization

Treat routing/description optimization as a separate problem from core artifact behavior optimization.

Prefer to:
1. stabilize the artifact behavior first
2. then optimize triggering separately

Do not mix both in the same iteration unless the user explicitly requests it.

Offer this after the artifact itself is in good shape.

The goal is to improve discovery, routing, invocation, or triggering accuracy for OpenCode.

### Step 1: Create Trigger Evals

Create about `20` realistic queries:

- `8-10` should trigger, invoke, or apply
- `8-10` should not trigger, invoke, or apply

Save them as:

```json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

The best negative examples are near misses, not obviously unrelated prompts.

### Step 2: Review the Eval Set with the User

Use `assets/eval_review.html`:

1. Read the template.
2. Replace the placeholders.
3. Write a temp HTML file.
4. Open it for the user, or provide the static file path in headless mode.
5. Load the exported `eval_set.json` from the user's download or chosen output path.

This review step matters. Weak trigger evals produce misleading description changes.

### Step 3: Run the Optimization Loop

Use the helper script:

```bash
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-artifact> \
  --model <session-model-id> \
  --max-iterations 5 \
  --verbose
```

Use the active session model ID so the routing test matches the user's actual environment.

In OpenCode, that usually means using the model backing the current session, such as `gpt-5.4` or `codex-5.3`.

While it runs, report progress briefly: current iteration, train score, test score, and whether the description changed materially.

### Step 4: Apply the Best Result

Take `best_description` from the loop output, update the artifact frontmatter or routing summary where applicable, and show the user the before/after diff plus the measured scores.

## Packaging

When the user wants an installable artifact, package the artifact:

```bash
python -m scripts.package_skill <path/to/skill-folder>
```

Return the generated package path.

## Updating an Existing Artifact

When modifying an installed or existing artifact:

- preserve the artifact name unless the user asks to rename it
- preserve the directory structure unless there is a good reason to change it
- copy to a writable location before editing if the original path is read-only
- compare against the original version during evals when that is the relevant baseline

## Safety and Quality Bar

- Do not create deceptive, malicious, or security-compromising artifacts.
- Do not claim an artifact can safely perform actions it should not perform.
- Do not add workflow steps that surprise the user relative to the artifact description.
- Keep the artifact aligned with the user's actual intent.

## References

Read these when needed:

- `references/schemas.md`
- `agents/grader.md`
- `agents/comparator.md`
- `agents/analyzer.md`

## Final Reminder

The core loop is simple:

1. Understand the workflow.
2. Draft or improve the artifact.
3. Run realistic evals.
4. Review outputs and benchmark data with the user.
5. Improve the artifact.
6. Repeat.
7. Optimize routing/description and package only after the core behavior is solid.

Track the work in a todo list when the task is multi-step so the evaluation and review steps do not get skipped.
