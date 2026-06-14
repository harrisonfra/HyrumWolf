/* ============================================================================
   data.js — all editable content for the constellation site
   ============================================================================

   HOW TO EDIT STAR CONTENT
   ------------------------
   Every clickable star's text lives in STAR_CONTENT below. Each entry:

     {
       id: "alpha",                          // unique key, links to the geometry
       designation: "α Moronis",             // Bayer-style name shown on hover
       label: "Core Identity",               // short category shown on hover
       title: "...",                         // headline in the detail panel
       body: "...",                          // 2–3 sentences in the panel
       link: { text: "...", url: "..." }     // optional link, or null for none
     }

   Just edit title / body / link — nothing else needs to change.

   HOW TO ADD AN INTERACTIVE STAR
   ------------------------------
   1. Pick (or add) a star in FIGURE_STARS and set its `content` field to a
      new id, e.g.  { id: "cloak1", x: 290, y: 290, r: 4.5, content: "nu" }.
      (Stars with content: null are decorative only.)
   2. Add a matching entry to STAR_CONTENT with id: "nu". Its position in the
      STAR_CONTENT array sets its keyboard tab order.

   HOW TO REMOVE ONE
   -----------------
   Delete its STAR_CONTENT entry and set that star's `content` back to null.

   THE FIGURE GEOMETRY
   -------------------
   FIGURE_STARS is the node list (x/y in the 1000×700 SVG viewBox, r = core
   radius in px). FIGURE_EDGES is a list of [idA, idB] pairs drawn as thin
   constellation lines. Tweak coordinates freely — everything else adapts.
   ========================================================================== */

const STAR_CONTENT = [
  {
    id: "alpha",
    designation: "α Moronis",
    label: "Core Identity",
    title: "PLACEHOLDER — One line that says who Hyrum is",
    body: "PLACEHOLDER — A two-to-three sentence mission statement. What drives him, what he is building toward, the thread that ties everything below together.",
    link: null
  },
  {
    id: "beta",
    designation: "β Moronis",
    label: "Beliefs & Worldview",
    title: "PLACEHOLDER — Cosmist & Christian",
    body: "PLACEHOLDER — What that pairing means to him. Two or three sentences on how a cosmic future and an ancient faith fit together in one worldview.",
    link: null
  },
  {
    id: "gamma",
    designation: "γ Moronis",
    label: "Faith & Family",
    title: "PLACEHOLDER — The things held closest",
    body: "PLACEHOLDER — Two or three sentences about faith and family: the people and convictions at the center of his life.",
    link: null
  },
  {
    id: "delta",
    designation: "δ Moronis",
    label: "Current Project",
    title: "PLACEHOLDER — Main project name",
    body: "PLACEHOLDER — What he is building right now, why it matters, and where it stands. Two or three sentences.",
    link: { text: "See the project", url: "#" }
  },
  {
    id: "epsilon",
    designation: "ε Moronis",
    label: "Second Project",
    title: "PLACEHOLDER — Second project name",
    body: "PLACEHOLDER — The other hand on the pole: a side project, collaboration, or long-running effort. Two or three sentences.",
    link: { text: "Learn more", url: "#" }
  },
  {
    id: "zeta",
    designation: "ζ Moronis",
    label: "Key Life Event I",
    title: "PLACEHOLDER — First milestone",
    body: "PLACEHOLDER — A formative event written into the banner. Two or three sentences on what happened and what it changed.",
    link: null
  },
  {
    id: "eta",
    designation: "η Moronis",
    label: "Key Life Event II",
    title: "PLACEHOLDER — Second milestone",
    body: "PLACEHOLDER — Another defining chapter. Two or three sentences.",
    link: null
  },
  {
    id: "theta",
    designation: "θ Moronis",
    label: "Key Life Event III",
    title: "PLACEHOLDER — Third milestone",
    body: "PLACEHOLDER — The most recent turning point. Two or three sentences.",
    link: null
  },
  {
    id: "iota",
    designation: "ι Moronis",
    label: "Skills & Craft",
    title: "PLACEHOLDER — What he's good at",
    body: "PLACEHOLDER — The craft carried on his shoulders: skills, tools, disciplines. Two or three sentences.",
    link: null
  },
  {
    id: "kappa",
    designation: "κ Moronis",
    label: "Education",
    title: "PLACEHOLDER — Where he trained",
    body: "PLACEHOLDER — Schools, degrees, self-teaching — the knee he rises from. Two or three sentences.",
    link: null
  },
  {
    id: "lambda",
    designation: "λ Moronis",
    label: "Origins",
    title: "PLACEHOLDER — Where he comes from",
    body: "PLACEHOLDER — Hometown and roots, the ground the back foot still touches. Two or three sentences.",
    link: null
  },
  {
    id: "mu",
    designation: "μ Moronis",
    label: "Foundations & Values",
    title: "PLACEHOLDER — What the pole is planted in",
    body: "PLACEHOLDER — The values everything else is staked on. Two or three sentences.",
    link: null
  }
];

/* --- Constellation geometry (viewBox 0 0 1000 700) ----------------------
   Traced star-by-star from the reference image of Captain Moroni kneeling
   and planting the Title of Liberty (blob + line detection on the PNG, then
   scaled into the viewBox). Kneeling figure facing right, both hands on the
   tall pole at x≈474, banner streaming to the upper right.
   content: null → decorative; content: "<id>" → links the star to a
   STAR_CONTENT entry and makes it interactive.                            */

const FIGURE_STARS = [
  // — Flag tip & banner (irregular polygon streaming upper right) —
  { id: "s0",  x: 474, y: 159, r: 6.0, content: "alpha" }, // flag tip — brightest
  { id: "s1",  x: 483, y: 181, r: 2.0, content: null },
  { id: "s2",  x: 532, y: 199, r: 2.2, content: null },
  { id: "s3",  x: 495, y: 209, r: 2.0, content: null },
  { id: "s4",  x: 592, y: 219, r: 4.2, content: "zeta" },  // banner, upper edge
  { id: "s5",  x: 622, y: 247, r: 2.0, content: null },
  { id: "s6",  x: 505, y: 248, r: 2.0, content: null },
  { id: "s7",  x: 554, y: 249, r: 2.0, content: null },
  { id: "s8",  x: 648, y: 263, r: 2.5, content: null },
  { id: "s9",  x: 694, y: 270, r: 2.0, content: null },
  { id: "s10", x: 580, y: 274, r: 2.8, content: null },
  { id: "s11", x: 500, y: 276, r: 2.7, content: null },    // banner inner corner
  { id: "s12", x: 730, y: 291, r: 4.2, content: "eta" },   // banner, mid sweep
  { id: "s14", x: 540, y: 300, r: 2.0, content: null },
  { id: "s16", x: 641, y: 315, r: 2.0, content: null },
  { id: "s17", x: 690, y: 320, r: 2.3, content: null },
  { id: "s18", x: 756, y: 320, r: 2.0, content: null },
  { id: "s20", x: 671, y: 321, r: 2.0, content: null },
  { id: "s23", x: 571, y: 332, r: 2.8, content: null },
  { id: "s24", x: 598, y: 333, r: 2.0, content: null },
  { id: "s25", x: 670, y: 335, r: 2.0, content: null },
  { id: "s28", x: 782, y: 342, r: 2.6, content: null },    // banner far point
  { id: "s36", x: 626, y: 364, r: 2.5, content: null },
  { id: "s38", x: 783, y: 372, r: 2.0, content: null },
  { id: "s40", x: 701, y: 374, r: 2.0, content: null },
  { id: "s42", x: 793, y: 383, r: 2.0, content: null },
  { id: "s44", x: 742, y: 390, r: 2.3, content: null },
  { id: "s47", x: 714, y: 408, r: 2.6, content: null },
  { id: "s49", x: 806, y: 414, r: 4.2, content: "theta" }, // banner trailing tip

  // — Pole (vertical at x≈474, flag tip above, base on the ground) —
  { id: "s19", x: 474, y: 320, r: 3.0, content: null },      // pole above the grip
  { id: "s22", x: 481, y: 331, r: 4.5, content: "delta" },   // upper hand on pole
  { id: "s27", x: 462, y: 338, r: 2.2, content: null },      // grip knuckles
  { id: "s29", x: 483, y: 344, r: 2.0, content: null },
  { id: "s31", x: 474, y: 351, r: 3.2, content: null },
  { id: "s32", x: 462, y: 352, r: 2.0, content: null },
  { id: "s35", x: 474, y: 363, r: 4.5, content: "epsilon" }, // lower hand on pole
  { id: "s78", x: 474, y: 641, r: 4.5, content: "mu" },      // pole base

  // — Head (small polygon, helmeted, facing the pole) —
  { id: "s13", x: 374, y: 299, r: 4.2, content: "beta" },  // crown of the head
  { id: "s15", x: 343, y: 302, r: 2.4, content: null },
  { id: "s21", x: 393, y: 325, r: 2.7, content: null },
  { id: "s26", x: 322, y: 335, r: 3.2, content: null },
  { id: "s30", x: 381, y: 350, r: 2.0, content: null },
  { id: "s33", x: 307, y: 353, r: 2.0, content: null },    // jaw / neck

  // — Shoulders, chest & arms —
  { id: "s37", x: 273, y: 367, r: 4.6, content: "iota" },  // rear shoulder
  { id: "s39", x: 358, y: 374, r: 2.3, content: null },    // front shoulder
  { id: "s34", x: 375, y: 359, r: 2.6, content: null },
  { id: "s41", x: 375, y: 381, r: 2.0, content: null },
  { id: "s45", x: 355, y: 394, r: 4.4, content: "gamma" }, // chest / heart
  { id: "s46", x: 412, y: 399, r: 3.4, content: null },    // front forearm
  { id: "s51", x: 423, y: 423, r: 2.7, content: null },    // rear forearm

  // — Torso & hip —
  { id: "s43", x: 307, y: 389, r: 2.5, content: null },
  { id: "s48", x: 253, y: 408, r: 2.0, content: null },    // upper back
  { id: "s52", x: 283, y: 427, r: 2.0, content: null },
  { id: "s53", x: 270, y: 447, r: 2.9, content: null },
  { id: "s54", x: 239, y: 457, r: 3.0, content: null },    // small of the back
  { id: "s55", x: 337, y: 462, r: 2.7, content: null },    // belly
  { id: "s56", x: 348, y: 468, r: 3.1, content: null },
  { id: "s57", x: 312, y: 468, r: 2.1, content: null },
  { id: "s59", x: 310, y: 483, r: 2.5, content: null },
  { id: "s60", x: 342, y: 487, r: 2.6, content: null },    // hip
  { id: "s62", x: 325, y: 489, r: 2.0, content: null },
  { id: "s64", x: 268, y: 506, r: 2.4, content: null },    // rear hip

  // — Front leg (knee up, foot planted beside the pole base) —
  { id: "s61", x: 433, y: 488, r: 4.2, content: "kappa" }, // front knee
  { id: "s63", x: 448, y: 505, r: 2.0, content: null },
  { id: "s65", x: 403, y: 521, r: 2.4, content: null },    // front thigh
  { id: "s67", x: 435, y: 549, r: 3.3, content: null },    // shin
  { id: "s71", x: 397, y: 615, r: 2.2, content: null },    // heel
  { id: "s72", x: 411, y: 615, r: 2.3, content: null },
  { id: "s76", x: 387, y: 639, r: 2.3, content: null },
  { id: "s77", x: 446, y: 639, r: 3.0, content: null },    // front foot at the pole

  // — Back leg (kneeling; shin folded, foot trailing lower left) —
  { id: "s66", x: 370, y: 548, r: 2.6, content: null },    // back thigh
  { id: "s68", x: 251, y: 585, r: 3.0, content: null },    // back knee on the ground
  { id: "s69", x: 234, y: 597, r: 2.1, content: null },
  { id: "s70", x: 262, y: 598, r: 2.0, content: null },
  { id: "s73", x: 258, y: 620, r: 3.0, content: null },
  { id: "s74", x: 329, y: 630, r: 3.7, content: null },    // back foot, toes tucked
  { id: "s75", x: 239, y: 637, r: 4.2, content: "lambda" } // trailing heel
];

/* Edges form a clean, readable skeleton: a closed banner outline with a few
   interior folds, a single straight pole, a tight hand-knot, and one
   unbroken chain per limb. Tweak freely — every line re-derives from the
   two stars it names. */
const FIGURE_EDGES = [
  // Banner — closed outline (tip → top edge → right end → bottom edge → tip)
  ["s0", "s2"], ["s2", "s4"], ["s4", "s5"], ["s5", "s8"], ["s8", "s9"],
  ["s9", "s12"], ["s12", "s18"], ["s18", "s28"], ["s28", "s49"],
  ["s0", "s1"], ["s1", "s3"], ["s3", "s6"], ["s6", "s11"], ["s11", "s14"],
  ["s14", "s23"], ["s23", "s36"], ["s36", "s44"], ["s44", "s47"], ["s47", "s49"],
  // Banner — a few interior folds for cloth texture
  ["s11", "s10"], ["s7", "s10"], ["s10", "s16"], ["s16", "s20"], ["s20", "s25"],
  ["s17", "s20"], ["s24", "s40"], ["s40", "s44"], ["s28", "s38"], ["s38", "s42"],
  // Pole — one straight line, flag tip to base
  ["s0", "s19"], ["s19", "s35"], ["s35", "s78"],
  // Both hands gripping the pole (compact knot)
  ["s19", "s22"], ["s22", "s27"], ["s27", "s31"], ["s31", "s35"],
  ["s27", "s29"], ["s29", "s32"], ["s32", "s35"],
  // Head (helmet polygon)
  ["s13", "s15"], ["s15", "s26"], ["s26", "s33"], ["s13", "s21"],
  ["s21", "s30"], ["s30", "s34"],
  // Neck, shoulders, and the two arms reaching to the grip
  ["s33", "s37"], ["s34", "s39"], ["s33", "s45"],
  ["s39", "s41"], ["s41", "s46"], ["s46", "s22"],   // front arm → upper hand
  ["s45", "s51"], ["s51", "s35"],                    // rear arm → lower hand
  // Torso — back curve and front line meeting at the hip
  ["s37", "s48"], ["s48", "s43"], ["s43", "s52"], ["s52", "s53"], ["s53", "s54"],
  ["s54", "s64"], ["s37", "s45"], ["s45", "s55"], ["s55", "s56"], ["s56", "s60"],
  ["s60", "s64"],
  // Armor plate over the midsection (small quad)
  ["s56", "s57"], ["s57", "s59"], ["s59", "s62"], ["s62", "s60"],
  // Front leg — raised knee down to the foot at the pole base
  ["s60", "s61"], ["s61", "s63"], ["s63", "s67"], ["s61", "s65"], ["s65", "s66"],
  ["s67", "s72"], ["s72", "s77"], ["s77", "s76"], ["s76", "s71"], ["s71", "s67"],
  ["s77", "s78"],
  // Back leg — folded knee on the ground, foot trailing lower-left
  ["s64", "s68"], ["s68", "s70"], ["s70", "s74"], ["s68", "s69"], ["s69", "s75"],
  ["s73", "s75"], ["s73", "s74"], ["s66", "s74"]
];

/* --- Editable extras -----------------------------------------------------
   SOCIAL_LINKS: the icons in the footer. Set each url; use "" to hide a row.
   For email use a mailto: url. Reorder freely — icons render in this order.
   BIRTH_ISO: the moment the "days into eternity" counter starts ticking.   */

const SOCIAL_LINKS = [
  { platform: "x",         url: "#" },   // PLACEHOLDER — your X / Twitter URL
  { platform: "linkedin",  url: "#" },   // PLACEHOLDER — your LinkedIn URL
  { platform: "youtube",   url: "#" },   // PLACEHOLDER — your YouTube URL
  { platform: "instagram", url: "#" },   // PLACEHOLDER — your Instagram URL
  { platform: "email",     url: "mailto:hello@example.com" } // PLACEHOLDER — your email
];

const BIRTH_ISO = "2004-04-21T00:00:00"; // 12:00 AM, April 21 2004 (local time)
