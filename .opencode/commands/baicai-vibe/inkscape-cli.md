---
description: Create and edit vector graphics using cli-anything-inkscape CLI
agent: build
model: bailian-coding-plan/glm-5
---

Create and edit vector graphics: $ARGUMENTS

Always use `--json` flag for parseable output. Use absolute paths for all file operations.

## Basic Commands

```bash
cli-anything-inkscape --help
cli-anything-inkscape --json project new -o project.json
cli-anything-inkscape --json project info -p project.json
```

## Command Groups

### Document

| Command | Description |
|---------|-------------|
| `new` | Create a new document |
| `open` | Open an existing project |
| `save` | Save the current project |
| `info` | Show document information |
| `profiles` | List available document profiles |
| `canvas-size` | Set the canvas size |
| `units` | Set the document units |
| `json` | Print raw project JSON |

### Shape

| Command | Description |
|---------|-------------|
| `add-rect` | Add a rectangle |
| `add-circle` | Add a circle |
| `add-ellipse` | Add an ellipse |
| `add-line` | Add a line |
| `add-polygon` | Add a polygon |
| `add-path` | Add a path |
| `add-star` | Add a star |
| `remove` | Remove a shape by index |
| `duplicate` | Duplicate a shape |
| `list` | List all shapes/objects |
| `get` | Get detailed info about a shape |

### Text

| Command | Description |
|---------|-------------|
| `add` | Add a text element |
| `set` | Set a text property |
| `list` | List all text objects |

### Style

| Command | Description |
|---------|-------------|
| `set-fill` | Set the fill color of an object |
| `set-stroke` | Set the stroke color (and optionally width) |
| `set-opacity` | Set the opacity of an object (0.0-1.0) |
| `set` | Set an arbitrary style property |
| `get` | Get the style properties of an object |
| `list-properties` | List all available style properties |

### Transform

| Command | Description |
|---------|-------------|
| `translate` | Translate (move) an object |
| `rotate` | Rotate an object |
| `scale` | Scale an object |
| `skew-x` | Skew an object horizontally |
| `skew-y` | Skew an object vertically |
| `get` | Get the current transform of an object |
| `clear` | Clear all transforms from an object |

### Layer

| Command | Description |
|---------|-------------|
| `add` | Add a new layer |
| `remove` | Remove a layer by index |
| `move-object` | Move an object to a different layer |
| `set` | Set a layer property |
| `list` | List all layers |
| `reorder` | Move a layer position |
| `get` | Get detailed info about a layer |

### Path

| Command | Description |
|---------|-------------|
| `union` | Union of two objects |
| `intersection` | Intersection of two objects |
| `difference` | Difference of two objects |
| `exclusion` | Exclusion (XOR) of two objects |
| `convert` | Convert a shape to a path |
| `list-operations` | List available path operations |

### Gradient

| Command | Description |
|---------|-------------|
| `add-linear` | Add a linear gradient |
| `add-radial` | Add a radial gradient |
| `apply` | Apply a gradient to an object |
| `list` | List all gradients |

### Export

| Command | Description |
|---------|-------------|
| `png` | Render the document to PNG |
| `svg` | Export the document as SVG |
| `pdf` | Export the document as PDF |
| `presets` | List export presets |

### Session

| Command | Description |
|---------|-------------|
| `status` | Show session status |
| `undo` | Undo the last operation |
| `redo` | Redo the last undone operation |
| `history` | Show undo history |

## Examples

```bash
# Create new document
cli-anything-inkscape --json document new -o mydoc.json

# Add a rectangle
cli-anything-inkscape --json -p mydoc.json shape add-rect --x 100 --y 100 --width 200 --height 80

# Set fill color
cli-anything-inkscape --json -p mydoc.json style set-fill --index 0 --color "#a5d8ff"

# Add text
cli-anything-inkscape --json -p mydoc.json text add --x 150 --y 130 --text "Hello"

# Export to PNG
cli-anything-inkscape --json -p mydoc.json export png output.png --overwrite
```
