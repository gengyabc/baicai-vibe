---
description: Create and edit Draw.io diagrams using cli-anything-drawio CLI
agent: build
model: bailian-coding-plan/glm-5
---

Create, edit, and export diagrams: $ARGUMENTS

Always use `--json` flag for parseable output. Use absolute paths for all file operations.

## Basic Commands

```bash
cli-anything-drawio --help
cli-anything-drawio --json project new -o project.json
cli-anything-drawio --json project info -p project.json
```

## Command Groups

### Project

| Command | Description |
|---------|-------------|
| `new` | Create a new blank diagram |
| `open` | Open an existing .drawio project file |
| `save` | Save the current project |
| `info` | Show detailed project information |
| `xml` | Print the raw XML of the current project |
| `presets` | List available page size presets |

### Shape

| Command | Description |
|---------|-------------|
| `add` | Add a shape to the diagram |
| `remove` | Remove a shape by ID |
| `list` | List all shapes on a page |
| `label` | Update a shape's label text |
| `move` | Move a shape to new coordinates |
| `resize` | Resize a shape |
| `style` | Set a style property on a shape |
| `info` | Show detailed info about a shape |
| `types` | List all available shape types |

### Connect

| Command | Description |
|---------|-------------|
| `add` | Add a connector between two shapes |
| `remove` | Remove a connector by ID |
| `label` | Update a connector's label |
| `style` | Set a style property on a connector |
| `list` | List all connectors on a page |
| `styles` | List available edge styles |

### Page

| Command | Description |
|---------|-------------|
| `add` | Add a new page |
| `remove` | Remove a page by index |
| `rename` | Rename a page |
| `list` | List all pages |

### Export

| Command | Description |
|---------|-------------|
| `render` | Export the diagram to a file |
| `formats` | List available export formats |

### Session

| Command | Description |
|---------|-------------|
| `status` | Show current session status |
| `undo` | Undo the last operation |
| `redo` | Redo the last undone operation |
| `save-state` | Save session state to disk |
| `list` | List all saved sessions |

## Examples

```bash
# Create new project
cli-anything-drawio --json project new -o myproject.json

# Add a shape
cli-anything-drawio --json -p myproject.json shape add --type rectangle --x 100 --y 100 --width 200 --height 80

# Add a label to shape
cli-anything-drawio --json -p myproject.json shape label --id <shape-id> --text "My Box"

# Add a connector between two shapes
cli-anything-drawio --json -p myproject.json connect add --from <shape1-id> --to <shape2-id>

# Export to PDF
cli-anything-drawio --project myproject.json export render output.pdf --overwrite
```