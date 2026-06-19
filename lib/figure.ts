// AUTO-GENERATED from the designer's reference art (reference/vector-87.svg +
// reference/ellipse-270.svg) by reference/build-figure.mjs. Do not edit by hand;
// re-run `npm run gen:figure` if the reference changes. Ellipse 270 gives the
// star positions; Vector 87 gives the connecting lines. One synthetic node (a
// banner fold with no star in the source) keeps the banner outline faithful.

export type FigureNode = { id: string; x: number; y: number; r: number };
export type Edge = readonly [string, string];

/** Source-art coordinate space. The whole figure lives inside this box. */
export const VIEWBOX = { w: 963, h: 806 } as const;

export const NODES: FigureNode[] = [
  { id: "n0", x: 404.5, y: 3.5, r: 2.2 },
  { id: "n1", x: 237.5, y: 235.5, r: 2.6 },
  { id: "n2", x: 185.5, y: 239.5, r: 3 },
  { id: "n3", x: 150.5, y: 295.5, r: 2.3 },
  { id: "n4", x: 126.5, y: 324.5, r: 2.7 },
  { id: "n5", x: 69.5, y: 349.5, r: 3.1 },
  { id: "n6", x: 36.5, y: 418.5, r: 2.4 },
  { id: "n7", x: 12.5, y: 498.5, r: 2.8 },
  { id: "n8", x: 65.5, y: 534.5, r: 3.2 },
  { id: "n9", x: 61.5, y: 581.5, r: 2.5 },
  { id: "n10", x: 31.5, y: 711.5, r: 2.9 },
  { id: "n11", x: 51.5, y: 733.5, r: 2.2 },
  { id: "n12", x: 3.5, y: 732.5, r: 2.6 },
  { id: "n13", x: 12.5, y: 799.5, r: 3 },
  { id: "n14", x: 45.5, y: 771.5, r: 2.3 },
  { id: "n15", x: 162.5, y: 787.5, r: 2.7 },
  { id: "n16", x: 260.5, y: 802.5, r: 3.1 },
  { id: "n17", x: 276.5, y: 763.5, r: 2.4 },
  { id: "n18", x: 300.5, y: 763.5, r: 2.8 },
  { id: "n19", x: 358.5, y: 802.5, r: 3.2 },
  { id: "n20", x: 286.5, y: 604.5, r: 2.5 },
  { id: "n21", x: 231.5, y: 648.5, r: 2.9 },
  { id: "n22", x: 132.5, y: 543.5, r: 2.2 },
  { id: "n23", x: 183.5, y: 550.5, r: 2.6 },
  { id: "n24", x: 194.5, y: 518.5, r: 3 },
  { id: "n25", x: 176.5, y: 507.5, r: 2.3 },
  { id: "n26", x: 134.5, y: 517.5, r: 2.7 },
  { id: "n27", x: 65.5, y: 483.5, r: 3.1 },
  { id: "n28", x: 126.5, y: 385.5, r: 2.4 },
  { id: "n29", x: 231.5, y: 438.5, r: 2.8 },
  { id: "n30", x: 320.5, y: 442.5, r: 3.2 },
  { id: "n31", x: 404.5, y: 342.5, r: 2.5 },
  { id: "n32", x: 419.5, y: 321.5, r: 2.9 },
  { id: "n33", x: 417.5, y: 287.5, r: 2.2 },
  { id: "n34", x: 404.5, y: 270.5, r: 2.6 },
  { id: "n35", x: 384.5, y: 300.5, r: 3 },
  { id: "n36", x: 384.5, y: 323.5, r: 2.3 },
  { id: "n37", x: 269.5, y: 280.5, r: 2.7 },
  { id: "n38", x: 239.5, y: 335.5, r: 3.1 },
  { id: "n39", x: 212.5, y: 359.5, r: 2.4 },
  { id: "n40", x: 301.5, y: 401.5, r: 2.8 },
  { id: "n41", x: 338.5, y: 550.5, r: 3.2 },
  { id: "n42", x: 362.5, y: 579.5, r: 2.5 },
  { id: "n43", x: 404.5, y: 802.5, r: 2.9 },
  { id: "n44", x: 445.5, y: 214.5, r: 2.2 },
  { id: "n45", x: 566.5, y: 291.5, r: 2.6 },
  { id: "n46", x: 659.5, y: 345.5, r: 3 },
  { id: "n47", x: 806.5, y: 419.5, r: 2.3 },
  { id: "n48", x: 852.5, y: 389.5, r: 2.7 },
  { id: "n49", x: 959.5, y: 426.5, r: 3.1 },
  { id: "n50", x: 919.5, y: 309.5, r: 2.4 },
  { id: "n51", x: 767.5, y: 272.5, r: 2.8 },
  { id: "n52", x: 684.5, y: 264.5, r: 3.2 },
  { id: "n53", x: 583.5, y: 196.5, r: 2.5 },
  { id: "n54", x: 602.5, y: 103.5, r: 2.9 },
  { id: "n55", x: 771.5, y: 188.5, r: 2.2 },
  { id: "n56", x: 934.5, y: 376.22, r: 2.6 },
];

export const EDGES: Edge[] = [
  ["n34", "n33"], ["n33", "n32"], ["n32", "n31"], ["n34", "n35"], ["n35", "n36"], ["n36", "n40"],
  ["n40", "n39"], ["n39", "n38"], ["n38", "n37"], ["n37", "n1"], ["n1", "n2"], ["n2", "n3"],
  ["n3", "n4"], ["n4", "n5"], ["n5", "n6"], ["n6", "n7"], ["n7", "n8"], ["n44", "n45"],
  ["n45", "n46"], ["n46", "n47"], ["n47", "n48"], ["n48", "n49"], ["n49", "n56"], ["n56", "n50"],
  ["n50", "n55"], ["n55", "n54"], ["n54", "n0"], ["n0", "n34"], ["n34", "n44"], ["n31", "n43"],
  ["n31", "n30"], ["n30", "n29"], ["n29", "n24"], ["n8", "n9"], ["n9", "n10"], ["n10", "n12"],
  ["n12", "n13"], ["n13", "n14"], ["n14", "n15"], ["n15", "n21"], ["n21", "n20"], ["n20", "n17"],
  ["n17", "n16"], ["n16", "n19"], ["n19", "n18"], ["n18", "n42"], ["n42", "n41"], ["n41", "n23"],
  ["n23", "n22"], ["n22", "n8"], ["n10", "n11"], ["n11", "n15"], ["n23", "n24"], ["n24", "n25"],
  ["n25", "n26"], ["n26", "n27"], ["n27", "n28"], ["n0", "n44"], ["n0", "n53"], ["n50", "n51"],
  ["n47", "n52"], ["n46", "n53"], ["n53", "n52"], ["n52", "n51"], ["n51", "n56"],
];

export const NODE_BY_ID: Record<string, FigureNode> =
  Object.fromEntries(NODES.map((n) => [n.id, n]));
