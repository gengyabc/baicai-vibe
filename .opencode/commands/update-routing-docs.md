---
description: Apply the graph-routing-docs rule to create or update routing documentation with proper Mermaid flowcharts
tools: Write, Read, Grep
tool_mode: tool-only
model: bailian-coding-plan/glm-5
---

The first argument is the target document path: `$1`

## Validate target argument

- If `$1` is missing or empty:
  - Default to `@docs/routing-flows.md`
  - Report: `No document specified. Defaulting to @docs/routing-flows.md`
- If `$1` is provided:
  - Validate the path format
  - If the path starts with `@docs/` or `docs/`:
    - Extract the filename
  - If the path contains no directory component:
    - Assume it belongs in `@docs/`
  - If the file does not exist:
    - Report: `Creating new routing doc: @docs/<filename>`
  - If the file exists:
    - Report: `Updating existing routing doc: @docs/<filename>`

## Parse `-f` source path arguments

Collect all `-f` arguments into a SOURCE_PATHS list.

- If no `-f` arguments provided:
  - Set SOURCE_PATHS to `[".opencode/"]`
  - Report: `No source paths specified. Scanning entire .opencode/ directory`
- If one or more `-f` arguments provided:
  - For each path in `-f` arguments:
    - Check if path exists (file or directory)
    - If path does not exist:
      - Error: `Source path does not exist: <path>`
      - Exit with error status
    - If path exists:
      - Add to SOURCE_PATHS list
  - Report: `Scanning <N> source path(s): <path1>, <path2>, ...`

## Required input

- @.opencode/rules/graph-routing-docs.md
- Source files/directories from SOURCE_PATHS
- Target doc file (existing or to be created)

## Flow

1. Parse `-f` arguments to determine SOURCE_PATHS
2. Read the graph-routing-docs rule
3. For each source path in SOURCE_PATHS:
   - If path is a file: add to FILES_TO_PROCESS list
   - If path is a directory: recursively find all files, add to FILES_TO_PROCESS list
4. Check if target doc exists
5. If creating new:
   - Initialize with standard routing doc structure
   - Include source files inventory: list all files processed from SOURCE_PATHS
   - Include Mermaid flowchart template
   - Add routing standards section
6. If updating existing:
   - Read existing content
   - Update source files inventory section with current FILES_TO_PROCESS
   - Identify missing routing diagrams
   - Apply rule's "Must" criteria:
     - Add Mermaid flowcharts for branching/stop logic
     - Ensure decision points are explicit
     - Add routing standards bullets
   - Apply rule's "Must Not" criteria:
     - Remove decorative graphs without decision clarity
     - Ensure stop conditions are visible in diagrams
7. Validate against rule's Acceptance criteria
8. Write the updated/new doc

## Output

- Target doc path
- Source paths scanned: list of all processed paths
- Source files processed: <count>
- Action taken: `created` | `updated`
- Changes summary:
  - Source files inventory added/updated
  - Flowcharts added/updated
  - Routing standards added
  - Stop conditions made explicit
- Validation result: `pass` | `needs review`

## Success requirements

- All specified `-f` paths exist (validated before processing)
- Source files inventory is accurate and complete
- Doc follows graph-routing-docs rule structure
- Mermaid flowcharts are valid and renderable
- Routing standards are explicit
- Stop conditions are visible in diagrams
- Decision points are clear

## Non-goals

- Rewriting implementation code
- Changing command/workflow logic
- Creating general documentation framework
