# OpenCode Agent Instructions

If OpenCode behavior is unclear, check `https://opencode.ai/docs/`.

## Project Management

This project uses **bun** as the package manager and test runner.

### Commands

```bash
bun install          # Install dependencies
bun test             # Run all tests
bun test --watch     # Run tests in watch mode
bun test --coverage  # Run tests with coverage report
```

### Configuration

- `bunfig.toml` - Bun configuration file
- `package.json` - Package metadata and scripts

### Testing

Tests are located in `bin/__tests__/` directory:
- `install-utils.test.js` - Unit tests for utility functions
- `postinstall.test.js` - Integration tests for install script
- `preuninstall.test.js` - Integration tests for uninstall script

## Artifact Formats

Use `YYYY-MM-DD` dates and durable lowercase kebab-case keys.

Requirement frontmatter:

```yaml
---
key: <durable-kebab-key>
status: ready | needs-more-discovery | blocked
date: YYYY-MM-DD
---
```

Plan frontmatter:

```yaml
---
key: <durable-kebab-key>
status: ready | blocked
date: YYYY-MM-DD
requirement: docs/requirements/<date>-<key>.md
---
```
