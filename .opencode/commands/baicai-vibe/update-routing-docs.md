---
description: Create or update routing docs with layered Mermaid flowcharts that stop at the right handoff depth
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

- @.opencode/rules/baicai-vibe/graph-routing-docs.md
- Source files/directories from SOURCE_PATHS
- Target doc file (existing or to be created)

## Diagram granularity policy

- For command docs, show only: arguments -> validation -> selected workflow -> output/result.
- For workflow docs, show only: stage flow, decision points, and handoffs to skills/rules.
- For skill docs, show only: when to use, bounds, and the skill's own decisions.
- For rule docs, show only: the rule's own must/must not logic and acceptance checks.
- Do not expand the internals of downstream workflow, skill, or rule artifacts unless the current file is that artifact.
- Prefer one clear handoff graph over nested detail graphs.
- If a source file already includes deeper diagrams than its layer warrants, simplify them to the layer boundary.

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
    - Group inventory by layer: command, workflow, rule, skill
    - Add one routing graph per source file, sized to that file's layer boundary
    - For command graphs, show argument routing, workflow selection, and output only
    - For workflow graphs, show stage flow and downstream handoffs only
    - Add routing standards section with explicit layer-boundary rules
6. If updating existing:
    - Read existing content
    - Update source files inventory section with current FILES_TO_PROCESS
    - Identify missing routing diagrams and over-detailed diagrams
    - Apply rule's "Must" criteria:
      - Add Mermaid flowcharts for branching/stop logic
      - Ensure decision points are explicit
      - Keep each diagram at the correct layer depth
      - Add routing standards bullets
    - Apply rule's "Must Not" criteria:
      - Remove decorative graphs without decision clarity
      - Remove downstream internal detail from higher-level command and workflow diagrams
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
  - Diagram granularity normalized by layer
  - Routing standards added
  - Stop conditions made explicit
- Validation result: `pass` | `needs review`

## Success requirements

- All specified `-f` paths exist (validated before processing)
- Source files inventory is accurate and complete
- Doc follows graph-routing-docs rule structure
- Mermaid flowcharts are valid and renderable
- Command diagrams stop at workflow handoff
- Workflow diagrams stop at skill/rule handoff
- Routing standards are explicit
- Stop conditions are visible in diagrams
- Decision points are clear

## Non-goals

- Rewriting implementation code
- Changing command/workflow logic
- Creating general documentation framework
