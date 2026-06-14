/* ============================================================================
   data.js — all editable content for the constellation site
   ============================================================================

   STAR CONTENT
   ------------
   Every clickable star is one entry in STAR_CONTENT. Each entry:

     {
       id: "cryopets",            // unique key; matches a star's `content` below
       section: "iic",            // motivations | iic | background  → sets COLOR
       size: "largest",           // largest | large | medium | small → brightness
       name: "Cryopets",          // headline + hover label
       subtitle: "Cryopreservation Service Provider",
       meta: "Head of Growth · 2025–Present", // small role/date/reference line
       body: "...",               // paragraph(s) in the detail panel
       link: { text: "cryopets.com", url: "https://cryopets.com" } | null,
       connectsTo: ["perfuslation"] // ids whose connecting line glows on hover
     }

   COLORS  (lines always stay electric blue)
       motivations → gold      (the flag / Title of Liberty)
       iic         → electric blue
       background  → silver-white

   SIZES → radius/brightness: largest, large, medium, small.

   MAPPING A STAR TO A PLACE ON THE FIGURE
   ---------------------------------------
   In FIGURE_STARS below, set a star's `content` to the id you want there
   (and clear the old one to null). e.g. to move Cosmism, find the star you
   want and set content: "cosmism". Position in STAR_CONTENT = tab order.

   RELATED STARS / HOVER GLOW
   --------------------------
   `connectsTo` makes the constellation line between two stars brighten on
   hover — but only if a line already runs between their two positions, so
   place related stars next to each other (see the company↔project pairs).

   FOOTER: SOCIAL_LINKS + BIRTH_ISO are near the bottom of this file.
   ========================================================================== */

const STAR_CONTENT = [
  /* ---- MOTIVATIONS (gold) — on the flag --------------------------------- */
  {
    id: "title",
    section: "motivations",
    size: "largest",
    name: "Title of Liberty",
    subtitle: "The Book of Mormon",
    meta: "Alma 46:12",
    body: "In the Book of Mormon, another testament of Jesus Christ, Captain Moroni raises the Title of Liberty as a banner in defense of God, religion, freedom, peace, family, and future generations. For Hyrum, this declaration is not only a religious symbol, but a guiding framework for life and work. It represents the conviction that civilization, family, faith, and human flourishing must be actively defended and built. The image of Captain Moroni and his banner inspired the constellation imagery throughout this website.",
    link: null,
    connectsTo: []
  },
  {
    id: "cosmism",
    section: "motivations",
    size: "largest",
    name: "Cosmism",
    subtitle: "Cosmist",
    meta: "2025–Present",
    body: "Hyrum began publicly identifying with Cosmism in early 2025. Cosmism is a philosophical tradition concerned with humanity's long-term flourishing, the expansion of life and intelligence beyond Earth, radical scientific progress, and the eventual overcoming of death and biological limitation. For Hyrum, Cosmism is not a replacement for faith, but a practical extension of it: a call to build the Kingdom of Heaven on earth through organized work, scientific progress, and faith in Jesus Christ.",
    link: null,
    connectsTo: []
  },
  {
    id: "christianity",
    section: "motivations",
    size: "medium",
    name: "Christianity",
    subtitle: "Believer",
    meta: "2004–Present",
    body: "Hyrum was raised in a Bible-believing Christian home where scripture, prayer, family worship, and service were part of daily life. His faith in Jesus Christ deepened during his two-year mission and continues to shape his view of responsibility, work, and human dignity. Christianity is the moral foundation beneath his interest in science, technology, and the long-term future of mankind.",
    link: null,
    connectsTo: ["church"]
  },
  {
    id: "church",
    section: "motivations",
    size: "medium",
    name: "The Church",
    subtitle: "Member",
    meta: "2004–Present",
    body: "Hyrum was born into The Church of Jesus Christ of Latter-day Saints and identifies first and foremost as a believer in Jesus Christ. He believes his church to be God's church and the Kingdom of Heaven on earth. He attends church weekly with his family and regularly attends the temple for sacred worship. His faith informs his belief that building, healing, learning, and preserving life are not separate from discipleship, but part of it.",
    link: null,
    connectsTo: ["christianity"]
  },

  /* ---- IMMORTALITY INDUSTRIAL COMPLEX (electric blue) — head, hands, body */
  {
    id: "cryopets",
    section: "iic",
    size: "largest",
    name: "Cryopets",
    subtitle: "Cryopreservation Service Provider",
    meta: "Head of Growth Operations · 2025–Present",
    body: "Cryopets is building cryopreservation services for pets, with the goal of ending pet death. After his longtime friend Kai Micah Mills founded the company, Hyrum left Pennsylvania and moved to Texas to help build Cryopets' first official lab and early operating base. He joined, and since joining has helped the company through its first raise, securing its first facility, and fully relocating its founding team. As Head of Growth, Hyrum has worked across growth, media, partnerships, customer acquisition, public messaging, and early operational systems. Cryopets has raised millions of dollars from venture capital firms including Valyrian, Prelude, and Zee Prime Capital. The company represents Hyrum's central operating role in the fight against biological decay, beginning with pets and scaling toward broader whole-body cryopreservation, with the goal of ending human death.",
    link: { text: "cryopets.com", url: "https://cryopets.com" },
    connectsTo: ["perfuslation"]
  },
  {
    id: "perfuslation",
    section: "iic",
    size: "medium",
    name: "Perfuslation",
    subtitle: "Cryopets Research Project",
    meta: "Lab Assistant · 2026–Present",
    body: "Perfuslation is a research project focused on organ cryopreservation and revival through advanced perfusion-based techniques. Working alongside Cryopets' scientific leadership, Hyrum supports early development of the project as part of his transition from growth and operations into more direct technical contribution. The project reflects his broader aim to help turn biostasis from a speculative field into an engineering discipline with practical milestones.",
    link: null,
    connectsTo: ["cryopets"]
  },
  {
    id: "hydradao",
    section: "iic",
    size: "large",
    name: "HydraDAO",
    subtitle: "Replacement Research",
    meta: "Growth · 2024–Present",
    body: "Hyrum helped build HydraDAO's early fundraising and media efforts. HydraDAO is a nonprofit funding frontier science focused on whole-body replacement, cloned and synthetic embryos, progressive brain tissue replacement, organ replacement, bodyoids, and other engineering-heavy approaches to biological repair. The organization has raised over $4M to support high-risk research that traditional institutions are often too slow or conservative to fund.",
    link: { text: "hydradao.org", url: "https://hydradao.org" },
    connectsTo: ["dowellbio"]
  },
  {
    id: "dowellbio",
    section: "iic",
    size: "small",
    name: "Dowell Bio",
    subtitle: "HydraDAO-Funded Research",
    meta: "Investor",
    body: "Dowell Bio is a HydraDAO-funded research effort focused on spinal cord transection and refusion. HydraDAO is acting as the sole funder for this ongoing scientific research. In 2025, the team conducted over 200 rat surgeries with rehabilitation and video tracking, developed a roadmap toward human trials, and began analyzing microscopy and clinical data for patents and research papers. Early pig trials have also begun, expanding the project from small-animal work toward larger translational models.",
    link: null,
    connectsTo: ["hydradao"]
  },
  {
    id: "cryodao",
    section: "iic",
    size: "large",
    name: "CryoDAO",
    subtitle: "Cryopreservation Research",
    meta: "Growth · 2024–Present",
    body: "Hyrum joined CryoDAO in late 2024. CryoDAO is a nonprofit organization funding cryopreservation research across organ preservation, whole-body preservation, and revival-relevant biology. It has backed research including sheep ovary vitrification and transplantation, whole non-hibernating mammal high-subzero preservation and revival, and additional projects across the biostasis field. To date, CryoDAO has raised over $5M for cryopreservation research.",
    link: { text: "cryodao.org", url: "https://cryodao.org" },
    connectsTo: ["cryorat"]
  },
  {
    id: "cryorat",
    section: "iic",
    size: "medium",
    name: "CryoRat",
    subtitle: "CryoDAO Program",
    meta: "Growth · 2024–Present",
    body: "CryoRat is CryoDAO's whole-body rat preservation program with Advanced Neural Biosciences and Aschwin de Wolf. The program focuses on high-subzero cryoprotection as a staged path toward eventual whole-body mammalian revival. Hyrum co-launched and helped prepare the fundraiser, which closed at $900K in less than a day, with the first $500K raised in under an hour. The project includes perfusion optimization, cryoprotectant mapping across organs and brain tissue, viability testing, in-house micro-CT, and staged revival attempts as milestones are reached.",
    link: null,
    connectsTo: ["cryodao"]
  },
  {
    id: "abf",
    section: "iic",
    size: "large",
    name: "ABF",
    subtitle: "Biostasis Facility",
    meta: "Growth · 2025–Present",
    body: "ABF is a nonprofit building a flagship biostasis research lab and long-term patient care facility. The facility brings together Cryopets, Tomorrow Bio, the Space Biostasis Coalition, CryoDAO, and HydraDAO to support research, storage, and long-term care for patients from multiple providers. Hyrum helped begin fundraising efforts for the project in 2025. ABF represents the infrastructure layer of the biostasis ecosystem: the physical foundation needed to support serious long-term work in cryopreservation.",
    link: { text: "americanbiostasis.org", url: "https://americanbiostasis.org" },
    connectsTo: []
  },

  /* ---- BACKGROUND (silver) — at the feet -------------------------------- */
  {
    id: "mission",
    section: "background",
    size: "medium",
    name: "Mission, UT",
    subtitle: "Missionary",
    meta: "2022–2024",
    body: "Hyrum submitted his papers and left to serve a two-year mission for The Church of Jesus Christ of Latter-day Saints in the late spring of 2022. He was called to the Utah Salt Lake City Mission, where his assigned areas included Holladay, Murray, and Cottonwood Heights. At times, he served across areas covering up to 20 congregations. His mission developed his love for church history, apologetics, public speaking, discipline, and direct outreach. During this period, he also met Kai Micah Mills, who later became his friend, colleague, and founder of Cryopets.",
    link: null,
    connectsTo: ["byu"]
  },
  {
    id: "byu",
    section: "background",
    size: "small",
    name: "BYU",
    subtitle: "Mechanical Engineering",
    meta: "Spring 2022",
    body: "After graduating high school early, Hyrum attended a single semester at one of the BYU campuses as a declared Mechanical Engineering major before leaving to serve a two-year mission for his church. During this time, he became disillusioned with the conventional academic path, but gained a lasting love for the arts and humanities from a professor he admired. Though he did not continue formal university study, this period helped shape his interest in first principles, civilization, history, and the human condition.",
    link: null,
    connectsTo: ["mission"]
  },
  {
    id: "freemasonry",
    section: "background",
    size: "small",
    name: "Freemasonry",
    subtitle: "Fraternity",
    meta: "Master Mason · 2025–Present",
    body: "Hyrum's interest in esoteric knowledge, moral formation, fraternity, and self-improvement eventually led him to Freemasonry. He received his Third Degree in early 2025, becoming a Master Mason. While not central to his professional work, Freemasonry reflects his broader interest in disciplined self-development, inherited tradition, symbolism, and moral architecture.",
    link: null,
    connectsTo: []
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
  { id: "s0",  x: 474, y: 159, r: 6.0, content: "title" }, // flag tip — Title of Liberty
  { id: "s1",  x: 483, y: 181, r: 2.0, content: null },
  { id: "s2",  x: 532, y: 199, r: 2.2, content: null },
  { id: "s3",  x: 495, y: 209, r: 2.0, content: null },
  { id: "s4",  x: 592, y: 219, r: 4.2, content: "christianity" }, // banner — faith
  { id: "s5",  x: 622, y: 247, r: 2.0, content: "church" },       // banner — faith (next to Christianity)
  { id: "s6",  x: 505, y: 248, r: 2.0, content: null },
  { id: "s7",  x: 554, y: 249, r: 2.0, content: null },
  { id: "s8",  x: 648, y: 263, r: 2.5, content: null },
  { id: "s9",  x: 694, y: 270, r: 2.0, content: null },
  { id: "s10", x: 580, y: 274, r: 2.8, content: null },
  { id: "s11", x: 500, y: 276, r: 2.7, content: null },    // banner inner corner
  { id: "s12", x: 730, y: 291, r: 4.2, content: "cosmism" }, // banner, far sweep
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
  { id: "s49", x: 806, y: 414, r: 4.2, content: null }, // banner trailing tip

  // — Pole (vertical at x≈474, flag tip above, base on the ground) —
  { id: "s19", x: 474, y: 320, r: 3.0, content: null },      // pole above the grip
  { id: "s22", x: 481, y: 331, r: 4.5, content: "cryopets" }, // upper hand — central role
  { id: "s27", x: 462, y: 338, r: 2.2, content: null },      // grip knuckles
  { id: "s29", x: 483, y: 344, r: 2.0, content: null },
  { id: "s31", x: 474, y: 351, r: 3.2, content: null },
  { id: "s32", x: 462, y: 352, r: 2.0, content: null },
  { id: "s35", x: 474, y: 363, r: 4.5, content: null }, // lower hand on pole
  { id: "s78", x: 474, y: 641, r: 4.5, content: "mission" }, // pole base — at the feet

  // — Head (small polygon, helmeted, facing the pole) —
  { id: "s13", x: 374, y: 299, r: 4.2, content: "cryodao" }, // crown of the head
  { id: "s15", x: 343, y: 302, r: 2.4, content: null },
  { id: "s21", x: 393, y: 325, r: 2.7, content: "cryorat" }, // head (next to CryoDAO)
  { id: "s26", x: 322, y: 335, r: 3.2, content: null },
  { id: "s30", x: 381, y: 350, r: 2.0, content: null },
  { id: "s33", x: 307, y: 353, r: 2.0, content: null },    // jaw / neck

  // — Shoulders, chest & arms —
  { id: "s37", x: 273, y: 367, r: 4.6, content: "abf" },   // rear shoulder
  { id: "s39", x: 358, y: 374, r: 2.3, content: null },    // front shoulder
  { id: "s34", x: 375, y: 359, r: 2.6, content: null },
  { id: "s41", x: 375, y: 381, r: 2.0, content: null },
  { id: "s45", x: 355, y: 394, r: 4.4, content: "hydradao" }, // chest / heart
  { id: "s46", x: 412, y: 399, r: 3.4, content: "perfuslation" }, // forearm (next to Cryopets)
  { id: "s51", x: 423, y: 423, r: 2.7, content: null },    // rear forearm

  // — Torso & hip —
  { id: "s43", x: 307, y: 389, r: 2.5, content: null },
  { id: "s48", x: 253, y: 408, r: 2.0, content: null },    // upper back
  { id: "s52", x: 283, y: 427, r: 2.0, content: null },
  { id: "s53", x: 270, y: 447, r: 2.9, content: null },
  { id: "s54", x: 239, y: 457, r: 3.0, content: null },    // small of the back
  { id: "s55", x: 337, y: 462, r: 2.7, content: "dowellbio" }, // belly (next to HydraDAO)
  { id: "s56", x: 348, y: 468, r: 3.1, content: null },
  { id: "s57", x: 312, y: 468, r: 2.1, content: null },
  { id: "s59", x: 310, y: 483, r: 2.5, content: null },
  { id: "s60", x: 342, y: 487, r: 2.6, content: null },    // hip
  { id: "s62", x: 325, y: 489, r: 2.0, content: null },
  { id: "s64", x: 268, y: 506, r: 2.4, content: null },    // rear hip

  // — Front leg (knee up, foot planted beside the pole base) —
  { id: "s61", x: 433, y: 488, r: 4.2, content: null }, // front knee
  { id: "s63", x: 448, y: 505, r: 2.0, content: null },
  { id: "s65", x: 403, y: 521, r: 2.4, content: null },    // front thigh
  { id: "s67", x: 435, y: 549, r: 3.3, content: null },    // shin
  { id: "s71", x: 397, y: 615, r: 2.2, content: null },    // heel
  { id: "s72", x: 411, y: 615, r: 2.3, content: null },
  { id: "s76", x: 387, y: 639, r: 2.3, content: null },
  { id: "s77", x: 446, y: 639, r: 3.0, content: "byu" },   // front foot (next to Mission/base)

  // — Back leg (kneeling; shin folded, foot trailing lower left) —
  { id: "s66", x: 370, y: 548, r: 2.6, content: null },    // back thigh
  { id: "s68", x: 251, y: 585, r: 3.0, content: null },    // back knee on the ground
  { id: "s69", x: 234, y: 597, r: 2.1, content: null },
  { id: "s70", x: 262, y: 598, r: 2.0, content: null },
  { id: "s73", x: 258, y: 620, r: 3.0, content: null },
  { id: "s74", x: 329, y: 630, r: 3.7, content: "freemasonry" }, // back foot, toes tucked
  { id: "s75", x: 239, y: 637, r: 4.2, content: null } // trailing heel
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
