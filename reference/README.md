# Reference art & figure generator

The constellation's geometry is derived from the designer's own artwork, not
traced by eye. This folder is the source of truth for the shape of Moroni.

| File | What it is |
|------|------------|
| `moroni-reference-glow.png` | The clear, glowing blue render of Captain Moroni — used to read the pose. |
| `moroni-reference-stars.png` | The gold-name / white-star render — palette and typography reference. |
| `ellipse-270.svg` | One small circle per **star** — exact node positions. |
| `vector-87.svg` | One stroked path = the **connecting lines** between stars. |
| `prompt.md` | The original brief the first version was built from. |
| `build-figure.mjs` | Reads the two SVGs and writes `../lib/figure.ts` + `figure.json`. |
| `figure.json` | Last generated raw `{ nodes, edges }`, for inspection/debugging. |

## Rebuild

```bash
npm run gen:figure
```

### How it works

1. Each star in `ellipse-270.svg` is a tiny circle path `M{cx+3.5} {cy}C…`;
   the center is `(cx, cy)`.
2. `vector-87.svg` is one path; its `M/L/H/V/C` vertices are the line corners.
   The two files were exported in slightly offset coordinate spaces, so each
   vertex is snapped to the nearest star (offset ≈ `(+2.965, +2.456)`).
3. A vertex with no star within `12px` (one banner fold in the source) becomes
   its own decorative node so the banner outline stays faithful.

Result: **56 real stars + 1 synthetic = 57 nodes, 65 edges.**
