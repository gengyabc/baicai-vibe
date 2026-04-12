---
name: fix-bugs
description: Diagnose and fix bugs, regressions, and failing tests with minimal targeted changes; use when a user reports incorrect behavior, crashes, or a reproducible failure
---

This skill diagnoses and fixes general code bugs.

---

## Purpose

Find the root cause of a bug, apply the smallest safe fix, and verify the behavior.

This skill is for direct bug repair, not review-batch processing.

If the issue comes from a selected quality-review batch, use your project's quality-review workflow instead.

---

## What it handles

Use this skill for:
- crash reports
- incorrect behavior
- failing tests
- regressions
- data mismatches
- edge-case bugs

Do not use it for:
- review-batch-only fixes
- broad refactors
- cleanup without a bug
- feature work

---

## Process

1. Reproduce or restate the bug precisely.
2. Inspect the narrowest relevant code path.
3. Identify the root cause.
4. Make the smallest bounded fix.
5. Add or update the narrowest test that proves the bug is fixed.
6. Verify the fix with focused tests or checks.

---

## Guardrails

Rules:
- Prefer guard clauses and local fixes.
- Avoid unrelated refactors.
- Do not change behavior you cannot justify from the bug report.
- Do not broaden into cleanup unless it is required to fix the bug.

If the bug is not reproducible, say so and explain what evidence is missing.

---

## Output

Report:
- root cause
- files changed
- tests run
- result

If the issue is a quality-review batch, your project's quality-review workflow will handle that separately.
