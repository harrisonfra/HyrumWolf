// Regenerates lib/figure.ts from the designer's reference art.
//   • ellipse-270.svg → the star positions (one <path> per star, a small circle)
//   • vector-87.svg   → the connecting lines (one big stroked <path>)
// Run with:  npm run gen:figure
//
// The two files were exported from the same artwork but in slightly different
// coordinate spaces; we snap each line vertex to the nearest star. A vertex
// with no nearby star (a banner fold) becomes its own decorative node so the
// outline stays faithful.

import fs from "node:fs";
import path from "node:path";

const here = import.meta.dirname;
const read = (f) => fs.readFileSync(path.join(here, f), "utf8");

// --- Star nodes from ellipse-270.svg (each path: "M{cx+3.5} {cy}C..." → center)
const nodes = [];
for (const m of read("ellipse-270.svg").matchAll(/M([\d.]+)\s+([\d.]+)C/g)) {
  nodes.push({ x: +(parseFloat(m[1]) - 3.5).toFixed(2), y: +parseFloat(m[2]).toFixed(2) });
}
const realCount = nodes.length;

// vector-87 coords are offset from ellipse coords by ~(+2.965, +2.456).
const OFF_X = 2.965, OFF_Y = 2.456, SNAP_TOL = 12;
function snap(x, y) {
  const ex = +(x + OFF_X).toFixed(2), ey = +(y + OFF_Y).toFixed(2);
  let best = -1, bestD = Infinity;
  nodes.forEach((n, i) => {
    const dd = (n.x - ex) ** 2 + (n.y - ey) ** 2;
    if (dd < bestD) { bestD = dd; best = i; }
  });
  if (Math.sqrt(bestD) > SNAP_TOL) { nodes.push({ x: ex, y: ey, synthetic: true }); return nodes.length - 1; }
  return best;
}

// --- Parse vector-87 path into subpaths of anchor points
const d = read("vector-87.svg").match(/ d="([^"]+)"/)[1];
const tokens = d.match(/[MLHVCZ]|-?[\d.]+/gi);
let cmd = null, x = 0, y = 0, startX = 0, startY = 0, p = 0;
const num = () => parseFloat(tokens[p++]);
const subpaths = []; let cur = null;
while (p < tokens.length) {
  const t = tokens[p];
  if (/[MLHVCZ]/i.test(t)) { cmd = t; p++; }
  switch (cmd) {
    case "M": x = num(); y = num(); cur = [[x, y]]; subpaths.push(cur); startX = x; startY = y; cmd = "L"; break;
    case "L": x = num(); y = num(); cur.push([x, y]); break;
    case "H": x = num(); cur.push([x, y]); break;
    case "V": y = num(); cur.push([x, y]); break;
    case "C": num(); num(); num(); num(); x = num(); y = num(); cur.push([x, y]); break;
    case "Z": x = startX; y = startY; cur.push([x, y]); break;
    default: p++;
  }
}

// --- Build edges by snapping consecutive anchors to nodes
const edgeSet = new Set(); const edges = [];
for (const sp of subpaths) {
  let prev = null;
  for (const [px, py] of sp) {
    const i = snap(px, py);
    if (prev !== null && prev !== i) {
      const key = prev < i ? `${prev}-${i}` : `${i}-${prev}`;
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([prev, i]); }
    }
    prev = i;
  }
}

const used = new Set(edges.flat());
const orphans = nodes.map((_, i) => i).filter((i) => !used.has(i));
if (orphans.length) {
  console.warn("WARNING: orphan nodes with no edge:", orphans);
}

// --- Emit lib/figure.ts and reference/figure.json
const decoR = (i) => +(2.2 + ((i * 37) % 11) / 10).toFixed(2);
const nodeLines = nodes
  .map((n, i) => `  { id: "n${i}", x: ${n.x}, y: ${n.y}, r: ${decoR(i)} },`)
  .join("\n");
const edgeStrs = edges.map(([a, b]) => `["n${a}", "n${b}"]`);
const wrapped = [];
for (let i = 0; i < edgeStrs.length; i += 6) wrapped.push("  " + edgeStrs.slice(i, i + 6).join(", ") + ",");

const out = `// AUTO-GENERATED from the designer's reference art (reference/vector-87.svg +
// reference/ellipse-270.svg) by reference/build-figure.mjs. Do not edit by hand;
// re-run \`npm run gen:figure\` if the reference changes. Ellipse 270 gives the
// star positions; Vector 87 gives the connecting lines. One synthetic node (a
// banner fold with no star in the source) keeps the banner outline faithful.

export type FigureNode = { id: string; x: number; y: number; r: number };
export type Edge = readonly [string, string];

/** Source-art coordinate space. The whole figure lives inside this box. */
export const VIEWBOX = { w: 963, h: 806 } as const;

export const NODES: FigureNode[] = [
${nodeLines}
];

export const EDGES: Edge[] = [
${wrapped.join("\n")}
];

export const NODE_BY_ID: Record<string, FigureNode> =
  Object.fromEntries(NODES.map((n) => [n.id, n]));
`;

fs.writeFileSync(path.join(here, "figure.json"), JSON.stringify({ nodes, edges }));
fs.writeFileSync(path.join(here, "..", "lib", "figure.ts"), out);
console.log(
  `lib/figure.ts: ${realCount} stars + ${nodes.length - realCount} synthetic = ${nodes.length} nodes, ${edges.length} edges`
);
