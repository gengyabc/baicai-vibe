# Rule: Entrypoint Compatibility

## Requirements

- keep existing command names stable during the refactor
- prefer explicit runtime failures over partial execution when required nested contracts cannot be loaded
- preserve familiar output blocks when practical

## Violations

- breaking command entrypoints without a migration path
- letting command wrappers silently compensate for missing required workflow loads
