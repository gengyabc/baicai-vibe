# Rule: User Alignment Gate for Learned Artifacts

## Purpose

Ensure staged reusable artifact candidates align with user needs before they are written to staging locations. This gate prevents wasted effort on candidates that miss user intent.

## When to Apply

Apply this gate after:
- Pattern extraction and worthiness evaluation are complete
- Artifact type classification is determined
- The candidate package is synthesized but NOT yet written to staging

## Explicit Approval Requirement

Before writing `candidate.md`, `package.md`, or any draft artifacts, you MUST obtain explicit user approval.

### Required Presentation

Present the following to the user:

1. **Candidate Summary**
   - Proposed artifact name
   - Selected type: `skill`, `workflow`, `rule`, or `reject`
   - Target goal or requirement being addressed

2. **Problem and Reusability Justification**
   - What problem this artifact solves
   - Why it is reusable (evidence from source session)
   - Scope boundaries (what it is NOT)

3. **Goal-Fit Assessment**
   - How closely the candidate aligns with the stated goal
   - Any gaps or mismatches
   - Risks of overfitting or underfitting

4. **Draft Artifact Preview** (if type is not `reject`)
   - Brief outline of what the draft artifact would contain
   - Key sections or capabilities

5. **Explicit Question**
   - Ask: "Should I stage this candidate?"
   - Provide clear approval options

### Valid Approval Forms

The following constitute explicit approval:

- "yes"
- "approve"
- "write it"
- "stage it"
- "proceed"
- Direct confirmation like "this looks good, go ahead"

### What is NOT Approval

The following do NOT constitute approval:

- Silence or no response
- Continued discussion or questions
- Implied agreement like "ok" or "sure" without explicit confirmation
- "I'll review it later"
- Any hedging like "maybe" or "let me think about it"

## Gate Decision Logic

```
IF user approves explicitly:
    → Proceed to Stage 5 (Synthesize and Write)
ELSE IF user requests changes:
    → Return to relevant prior stage
    → Update candidate based on feedback
    → Re-present for approval
ELSE IF user rejects:
    → Change final type to `reject`
    → Write `candidate.md` and `package.md` explaining rejection
    → Do NOT write draft artifacts
ELSE (no explicit response):
    → STOP
    → Do NOT write any files
    → Summarize current state and await user input
```

## Post-Approval Actions

After explicit approval is obtained:

1. Write `candidate.md` and `package.md` to staging location
2. If type is not `reject`, write the corresponding draft artifact
3. Validate all files are written correctly
4. Return summary to user

## Stop Conditions

STOP and do NOT proceed if:

- User has not given explicit approval
- User has explicitly rejected the candidate
- User's intent is unclear from the response
- The candidate would duplicate an existing stable artifact without clear refinement value

## Alignment with discover-requirements Pattern

This gate mirrors the approval pattern from `discover-requirements`:

- Discovery workflows (Step 10-11) have explicit planning readiness and user approval gates
- The same strict approval requirements apply here
- "Silence, continued discussion, or implied agreement is NOT approval"

## Notes

- This gate is intentionally strict to prevent wasted work
- It is better to stop and clarify than to stage a misaligned candidate
- The user can always approve and proceed after seeing the summary
- Rejection is also a valid outcome and should be documented