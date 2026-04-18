---
description: Stage changes if needed, write a focused commit message, and create the commit.
model: bailian-coding-plan/glm-5
agent: build
argument-hint: [all, staged] [issue-key]
---

The `scope` to commit: `$1`, default to `staged`
The optional issue key: `$2`

## Steps

1. **Review changes**
    - Check the diff: `git diff --cached` (if changes are staged) or `git diff` (if unstaged)
    - Understand what changed and why
2. **Use issue key if provided**
     - Accept the issue key as the second argument
     - If no issue key is provided, do not include one in the commit message
3. **Stage changes (conditional)**
    - If `scope` is `staged` or not provided: skip staging (commit only already-staged changes)
    - If `scope` is `all` : `git add -A` (stage all changes)
    - if `scope` is empty and no staged changes: `git add -A` (stage all changes)
4. **Create short commit message**
    - Base the message on the actual changes in the diff
    - Example: `git commit -m "fix(auth): handle expired token refresh"`
    - Example with issue key: `git commit -m "PROJ-123: fix(auth): handle expired token refresh"`

## Template

- `git commit -m "<type>(<scope>): <short summary>"`
- With issue key: `git commit -m "<issue-key>: <type>(<scope>): <short summary>"`

## Rules

- **Length:** <= 72 characters
- **Imperative mood:** Use "fix", "add", "update" (not "fixed", "added", "updated")
- **Capitalize:** First letter of summary should be capitalized
- **No period:** Don't end the subject line with a period
- **Describe why:** Not just what - "fix stuff" is meaningless
