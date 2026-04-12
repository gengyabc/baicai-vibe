# Code Review Expert

A comprehensive OpenCode-first code review skill. It performs structured reviews with a senior engineer lens, covering correctness, architecture, security, performance, and code quality.

## Fit

- OpenCode workflow
- GPT-5.4 for review, synthesis, and severity judgment
- Codex 5.3 for optional follow-up fixes
- Git diff, staged changes, commit ranges, and PR-style review

## Installation

```bash
npx skills add sanyuan0704/sanyuan-skills --path skills/code-review-expert
```

## Features

- **SOLID Principles** - Detect SRP, OCP, LSP, ISP, DIP violations
- **Security Scan** - XSS, injection, SSRF, race conditions, auth gaps, secrets leakage
- **Performance** - N+1 queries, CPU hotspots, missing cache, memory issues
- **Error Handling** - Swallowed exceptions, async errors, missing boundaries
- **Boundary Conditions** - Null handling, empty collections, off-by-one, numeric limits
- **Removal Planning** - Identify dead code with safe deletion plans

## Usage

After installation, simply run:

```
/code-review-expert
```

The skill will automatically review your current git changes.

If you later want fixes, use the review output to drive a separate implementation pass.

## Workflow

1. **Preflight** - Scope changes via `git diff`
2. **Correctness + Architecture** - Check intent, design, and invariants first
3. **Removal Candidates** - Find dead/unused code
4. **Security Scan** - Vulnerability detection
5. **Code Quality** - Error handling, performance, boundaries
6. **Output** - Findings by severity (P0-P3)
7. **Optional Follow-up** - Only implement fixes when the user asks

## Severity Levels

| Level | Name | Action |
|-------|------|--------|
| P0 | Critical | Must block merge |
| P1 | High | Should fix before merge |
| P2 | Medium | Fix or create follow-up |
| P3 | Low | Optional improvement |

## Structure

```
code-review-expert/
├── SKILL.md                 # Main skill definition
├── agents/
│   └── agent.yaml           # Agent interface config
└── references/
    ├── solid-checklist.md   # SOLID smell prompts
    ├── security-checklist.md    # Security & reliability
    ├── code-quality-checklist.md # Error, perf, boundaries
    └── removal-plan.md      # Deletion planning template
```

## References

Each checklist provides detailed prompts and anti-patterns:

- **solid-checklist.md** - SOLID violations + common code smells
- **security-checklist.md** - OWASP risks, race conditions, crypto, supply chain
- **code-quality-checklist.md** - Error handling, caching, N+1, null safety
- **removal-plan.md** - Safe vs deferred deletion with rollback plans

## License

MIT
