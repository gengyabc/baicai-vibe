#!/usr/bin/env bash

set -euo pipefail

root="${1:-.}"

patterns=(
  '@\\.planning/phase'
  'branch-phase\\.toml'
  'phase-log\\.md'
  'quality-review\\.md'
  'requirement\\.md'
  'step\\.md'
  'test-checklist\\.md'
)

for pattern in "${patterns[@]}"; do
  if rg -n "$pattern" "$root/.opencode" "$root/docs"; then
    echo
    echo "Found forbidden repo-specific reference: $pattern"
    exit 1
  fi
done

echo "Repo-agnostic reference check passed."
