---
description: Create hand-drawn diagrams using excalidraw-cli
agent: build
model: bailian-coding-plan/glm-5
---

Create hand-drawn diagrams: $ARGUMENTS

## Quick Start

```bash
excalidraw create --json '[...elements...]' -o diagram.excalidraw
excalidraw export diagram.excalidraw
```

## Built-in Defaults (skip these in JSON)

| Property | Default |
|----------|---------|
| `roughness` | `2` (hand-drawn) |
| `roundness` | `{ "type": 3 }` |
| `fontFamily` | `1` (handwritten) |
| `strokeColor` | `"#1e1e1e"` |
| `backgroundColor` | `"transparent"` |
| `fillStyle` | `"solid"` |
| `strokeWidth` | `2` |
| `opacity` | `100` |

## Element Types

### Shapes

```json
{ "type": "rectangle", "id": "r1", "x": 100, "y": 100, "width": 200, "height": 100 }
```

### Labels (text inside shapes)

```json
{ "type": "rectangle", "id": "b1", "x": 100, "y": 100, "width": 200, "height": 80, "backgroundColor": "#a5d8ff", "fillStyle": "solid", "label": { "text": "My Label" } }
```

### Arrows

```json
{ "type": "arrow", "id": "a1", "x": 300, "y": 150, "width": 200, "height": 0, "points": [[0,0],[200,0]], "endArrowhead": "arrow" }
```

### Arrow Bindings

```json
{
  "type": "arrow", "id": "a1", "x": 300, "y": 150, "width": 150, "height": 0,
  "points": [[0,0],[150,0]], "endArrowhead": "arrow",
  "startBinding": { "elementId": "b1", "fixedPoint": [1, 0.5] },
  "endBinding": { "elementId": "b2", "fixedPoint": [0, 0.5] }
}
```

**fixedPoint**: `[1, 0.5]` right, `[0, 0.5]` left, `[0.5, 0]` top, `[0.5, 1]` bottom

## Camera (Viewport)

```json
{ "type": "cameraUpdate", "width": 800, "height": 600, "x": 50, "y": 20 }
```

## Color Palette

### Shape Fills

| Color | Hex |
|-------|-----|
| Light Blue | `#a5d8ff` |
| Light Green | `#b2f2bb` |
| Light Orange | `#ffd8a8` |
| Light Purple | `#d0bfff` |
| Light Red | `#ffc9c9` |
| Light Yellow | `#fff3bf` |
| Light Teal | `#c3fae8` |

### Background Zones (`opacity: 30`)

| Color | Hex |
|-------|-----|
| Blue zone | `#dbe4ff` |
| Purple zone | `#e5dbff` |
| Green zone | `#d3f9d8` |

## Drawing Order

Array order = z-order (first = back, last = front). Emit progressively: `camera → zones → shape → text → arrow → ...`

## Font Size Rules

- **28+** for titles
- **20** for labels
- **16-18** for body text
- **14** minimum

## Element Sizing

- Minimum shape: **120×60**
- **20-30 px** gaps minimum

## Dark Mode

Add dark background as FIRST element:

```json
{ "type": "rectangle", "id": "darkbg", "x": -4000, "y": -3000, "width": 10000, "height": 7500, "backgroundColor": "#1e1e2e", "fillStyle": "solid", "strokeColor": "transparent", "strokeWidth": 0 }
```

Dark fills: `#1e3a5f` blue, `#1a4d2e` green, `#2d1b69` purple, `#5c3d1a` orange, `#5c1a1a` red

## Tips

- No emoji in text
- Always set `fillStyle: "solid"` when using `backgroundColor`
- Arrow `points` are offsets from arrow's `x, y`

## Complete Example: Simple Flow

```bash
excalidraw create --json '[
  { "type": "cameraUpdate", "width": 800, "height": 600, "x": 0, "y": 100 },
  { "type": "rectangle", "id": "b1", "x": 60, "y": 250, "width": 200, "height": 80, "backgroundColor": "#a5d8ff", "fillStyle": "solid", "label": { "text": "Input" }, "boundElements": [{ "id": "a1", "type": "arrow" }] },
  { "type": "arrow", "id": "a1", "x": 260, "y": 290, "width": 150, "height": 0, "points": [[0,0],[150,0]], "endArrowhead": "arrow", "startBinding": { "elementId": "b1", "fixedPoint": [1, 0.5] }, "endBinding": { "elementId": "b2", "fixedPoint": [0, 0.5] } },
  { "type": "rectangle", "id": "b2", "x": 430, "y": 250, "width": 200, "height": 80, "backgroundColor": "#b2f2bb", "fillStyle": "solid", "label": { "text": "Output" }, "boundElements": [{ "id": "a1", "type": "arrow" }] }
]' -o flow.excalidraw
```

## Templates

### Labeled Box

```json
{ "type": "rectangle", "id": "ID", "x": X, "y": Y, "width": 200, "height": 80, "backgroundColor": "COLOR", "fillStyle": "solid", "label": { "text": "LABEL" } }
```

### Arrow with Binding

```json
{ "type": "arrow", "id": "AID", "x": X, "y": Y, "width": W, "height": 0, "points": [[0,0],[W,0]], "endArrowhead": "arrow", "startBinding": { "elementId": "FROM", "fixedPoint": [1, 0.5] }, "endBinding": { "elementId": "TO", "fixedPoint": [0, 0.5] } }
```