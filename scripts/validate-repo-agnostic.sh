#!/usr/bin/env bash

set -euo pipefail

root="${1:-.}"

require_tools() {
  local tool

  for tool in "$@"; do
    if ! command -v "$tool" >/dev/null 2>&1; then
      echo "❌ ERROR: missing required command: $tool" >&2
      exit 1
    fi
  done
}

require_tools rg

patterns=(
  '@.planning/phase'
  'branch-phase.toml'
  'phase-log.md'
  'quality-review.md'
  'requirement.md'
  'step.md'
  'test-checklist.md'
)

for pattern in "${patterns[@]}"; do
  if rg -n -F "$pattern" "$root/.opencode" "$root/docs"; then
    echo
    echo "Found forbidden repo-specific reference: $pattern"
    exit 1
  fi
done

echo "Repo-agnostic reference check passed."
