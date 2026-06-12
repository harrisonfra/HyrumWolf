/* ============================================================================
   main.js — builds the sky, the constellation, and all interaction.
   Reads STAR_CONTENT / FIGURE_STARS / FIGURE_EDGES from data.js.
   ========================================================================== */

(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const VIEW_W = 1000;
  const VIEW_H = 700;

  const svg = document.getElementById("sky");
  const labelEl = document.getElementById("star-label");
  const panel = document.getElementById("panel");
  const panelClose = document.getElementById("panel-close");
  const panelDesignation = document.getElementById("panel-designation");
  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");
  const panelLink = document.getElementById("panel-link");
  const hint = document.getElementById("hint");

  // Honor the OS reduced-motion preference; append "?motion" to the URL to
  // override it (useful for testing or showing off the full effect).
  const forceMotion = new URLSearchParams(location.search).has("motion");
  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches && !forceMotion;
  document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const rand = (min, max) => min + Math.random() * (max - min);

  // "α Moronis" → "α MORONIS": uppercase the Latin part only, so the Greek
  // letter keeps its lowercase Bayer form (CSS text-transform would break it).
  const caps = (designation, label) =>
    designation.charAt(0) + designation.slice(1).toUpperCase() +
    " · " + label.toUpperCase();

  function el(name, attrs, parent) {
    const node = document.createElementNS(SVG_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  /* ------------------------------------------------------------------ defs */

  const defs = el("defs", {}, svg);

  // Soft warm-white halo for ordinary stars
  const glowWarm = el("radialGradient", { id: "glow-warm" }, defs);
  el("stop", { offset: "0%", "stop-color": "#fdf6e8", "stop-opacity": "0.9" }, glowWarm);
  el("stop", { offset: "35%", "stop-color": "#fdf6e8", "stop-opacity": "0.32" }, glowWarm);
  el("stop", { offset: "100%", "stop-color": "#fdf6e8", "stop-opacity": "0" }, glowWarm);

  // Slightly golden, brighter halo for interactive stars
  const glowGold = el("radialGradient", { id: "glow-gold" }, defs);
  el("stop", { offset: "0%", "stop-color": "#fff7df", "stop-opacity": "1" }, glowGold);
  el("stop", { offset: "30%", "stop-color": "#f2d99a", "stop-opacity": "0.45" }, glowGold);
  el("stop", { offset: "100%", "stop-color": "#e8c87a", "stop-opacity": "0" }, glowGold);

  /* ------------------------------------------------- groups & sky structure
     #sky-rotor carries the sidereal drift (CSS). Inside it:
     three parallax background layers, then the constellation.             */

  const rotor = el("g", { id: "sky-rotor" }, svg);
  const bgLayers = [
    el("g", { class: "bg-layer", "data-depth": "0.25" }, rotor), // deepest, slowest
    el("g", { class: "bg-layer", "data-depth": "0.55" }, rotor),
    el("g", { class: "bg-layer", "data-depth": "1" }, rotor)
  ];
  const constellation = el("g", { id: "constellation" }, rotor);
  const edgeGroup = el("g", { id: "edges" }, constellation);
  const starGroup = el("g", { id: "figure-stars" }, constellation);
  const hotGroup = el("g", { id: "interactive-stars" }, constellation);
  const meteorGroup = el("g", { id: "meteors" }, svg); // outside rotor: fixed zones

  /* ------------------------------------------------ background starfield */

  const TINTS = ["#fdf6e8", "#fdf6e8", "#fdf6e8", "#cfdcff", "#ffe3bd"]; // mostly warm white
  const LAYER_COUNTS = [70, 55, 45];

  bgLayers.forEach((layer, i) => {
    for (let n = 0; n < LAYER_COUNTS[i]; n++) {
      // Generate beyond the viewBox so parallax & rotation never expose edges
      const g = el("g", { class: "star" }, layer);
      g.style.setProperty("--tw-dur", rand(2, 7).toFixed(2) + "s");
      g.style.setProperty("--tw-delay", (-rand(0, 7)).toFixed(2) + "s");
      g.style.setProperty("--base-op", rand(0.25, 0.9).toFixed(2));
      el("circle", {
        cx: rand(-120, VIEW_W + 120).toFixed(1),
        cy: rand(-120, VIEW_H + 120).toFixed(1),
        r: rand(0.4, 0.7 + i * 0.45).toFixed(2),
        fill: TINTS[Math.floor(Math.random() * TINTS.length)]
      }, g);
    }
  });

  /* --------------------------------------------------- constellation edges */

  const starById = {};
  FIGURE_STARS.forEach((s) => { starById[s.id] = s; });

  FIGURE_EDGES.forEach(([a, b]) => {
    const sa = starById[a], sb = starById[b];
    if (!sa || !sb) { console.warn("Edge references unknown star:", a, b); return; }
    el("line", { class: "edge", x1: sa.x, y1: sa.y, x2: sb.x, y2: sb.y }, edgeGroup);
  });

  /* --------------------------------------------------- constellation stars */

  // Decorative star: halo + core, randomized twinkle phase/period.
  function makeStar(s, parent, opts) {
    const g = el("g", { class: "star" + (opts.interactive ? " star--interactive" : "") }, parent);
    g.style.setProperty("--tw-dur", rand(2, 7).toFixed(2) + "s");
    g.style.setProperty("--tw-delay", (-rand(0, 7)).toFixed(2) + "s");
    g.style.setProperty("--base-op", opts.interactive ? "1" : rand(0.7, 1).toFixed(2));
    el("circle", {
      class: "halo",
      cx: s.x, cy: s.y,
      r: (s.r * (opts.interactive ? 4 : 3.2)).toFixed(1),
      fill: opts.interactive ? "url(#glow-gold)" : "url(#glow-warm)"
    }, g);
    el("circle", { class: "core", cx: s.x, cy: s.y, r: s.r, fill: "#fdf6e8" }, g);
    return g;
  }

  // Decorative pass — interactive stars are rendered separately (below) in
  // STAR_CONTENT order so keyboard tab order matches the designations.
  FIGURE_STARS.forEach((s) => {
    if (!s.content) makeStar(s, starGroup, { interactive: false });
  });

  /* ----------------------------------------------------- interactive stars */

  const contentById = {};
  STAR_CONTENT.forEach((c) => { contentById[c.id] = c; });

  let activeStar = null;   // { el, ring, content }
  let lastFocused = null;
  let hintDismissed = false;

  function showLabel(starEl, content) {
    const rect = starEl.querySelector(".core").getBoundingClientRect();
    labelEl.textContent = caps(content.designation, content.label);
    labelEl.classList.add("is-visible");
    // Position to the right of the star; flip left near the viewport edge.
    labelEl.style.left = "0px"; labelEl.style.top = "0px"; // reset before measuring
    const lw = labelEl.offsetWidth;
    let x = rect.right + 14;
    if (x + lw > window.innerWidth - 12) x = rect.left - lw - 14;
    labelEl.style.left = Math.max(8, x) + "px";
    labelEl.style.top = (rect.top + rect.height / 2 - labelEl.offsetHeight / 2) + "px";
  }

  function hideLabel() { labelEl.classList.remove("is-visible"); }

  function openPanel(starEl, figureStar, content) {
    closePanel(false);
    panelDesignation.textContent = caps(content.designation, content.label);
    panelTitle.textContent = content.title;
    panelBody.textContent = content.body;
    if (content.link) {
      panelLink.textContent = content.link.text;
      panelLink.href = content.link.url;
      panelLink.hidden = false;
    } else {
      panelLink.hidden = true;
    }

    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));

    // Dim the sky, mark + ring the active star
    svg.classList.add("is-dimmed");
    starEl.classList.add("is-active");
    const ring = el("circle", {
      class: "selection-ring",
      cx: figureStar.x, cy: figureStar.y, r: figureStar.r + 9
    }, starEl);

    activeStar = { el: starEl, ring, content };
    lastFocused = starEl;
    hideLabel();
    panelClose.focus();

    if (!hintDismissed) {
      hintDismissed = true;
      hint.classList.add("is-hidden");
    }
  }

  function closePanel(restoreFocus = true) {
    if (!activeStar) return;
    panel.classList.remove("is-open");
    panel.addEventListener("transitionend", () => { if (!activeStar) panel.hidden = true; }, { once: true });
    svg.classList.remove("is-dimmed");
    activeStar.el.classList.remove("is-active");
    activeStar.ring.remove();
    if (restoreFocus && lastFocused) lastFocused.focus();
    activeStar = null;
    if (reduceMotion) panel.hidden = true;
  }

  // Build interactive stars in STAR_CONTENT order (= tab order)
  STAR_CONTENT.forEach((content, i) => {
    const figureStar = FIGURE_STARS.find((s) => s.content === content.id);
    if (!figureStar) { console.warn("No figure star assigned to content:", content.id); return; }

    const g = makeStar(figureStar, hotGroup, { interactive: true });
    g.setAttribute("role", "button");
    g.setAttribute("tabindex", "0");
    g.setAttribute("aria-label", content.designation + " — " + content.label);
    // Desynchronize the idle pulse between stars
    g.style.setProperty("--pulse-dur", rand(3.6, 4.6).toFixed(2) + "s");
    g.style.setProperty("--pulse-delay", (-(i * 0.7) - rand(0, 1)).toFixed(2) + "s");

    // Generous invisible hit target for touch
    el("circle", {
      class: "hit", cx: figureStar.x, cy: figureStar.y, r: 18,
      fill: "transparent", stroke: "none"
    }, g);

    g.addEventListener("mouseenter", () => { if (!activeStar || activeStar.el !== g) showLabel(g, content); });
    g.addEventListener("mouseleave", hideLabel);
    g.addEventListener("focus", () => showLabel(g, content));
    g.addEventListener("blur", hideLabel);
    g.addEventListener("click", (e) => { e.stopPropagation(); openPanel(g, figureStar, content); });
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPanel(g, figureStar, content);
      }
    });
  });

  /* --------------------------------------------------------- close handlers */

  panelClose.addEventListener("click", () => closePanel());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });
  svg.addEventListener("click", (e) => {
    // Clicking empty sky closes the panel
    if (!e.target.closest(".star--interactive")) closePanel();
  });

  /* -------------------------------------------------- parallax (background)
     Mouse moves shift the three background layers at different rates —
     a few px max, eased in a rAF loop (transform-only, no layout work).
     On touch devices the layers drift autonomously and very slowly.       */

  if (!reduceMotion) {
    const MAX_SHIFT = 10;  // mouse parallax range (px, scaled per layer depth)
    const AMBIENT = 7;     // autonomous wander amplitude — under a px/second
    let targetX = 0, targetY = 0; // where the mouse wants the sky
    let curX = 0, curY = 0;       // eased mouse offset
    const start = performance.now();

    function tick(now) {
      curX += (targetX - curX) * 0.04;
      curY += (targetY - curY) * 0.04;
      // Slow Lissajous wander so the sky never sits perfectly still.
      // Incommensurate frequencies keep the path from visibly looping.
      const t = (now - start) / 1000;
      const ambX = Math.sin(t * 0.050) * AMBIENT;
      const ambY = Math.cos(t * 0.037) * AMBIENT * 0.7;
      bgLayers.forEach((layer) => {
        const d = parseFloat(layer.dataset.depth);
        layer.style.transform =
          "translate(" + ((curX + ambX) * d).toFixed(2) + "px," +
                         ((curY + ambY) * d).toFixed(2) + "px)";
      });
      requestAnimationFrame(tick);
    }

    if (hasFinePointer) {
      window.addEventListener("mousemove", (e) => {
        targetX = ((e.clientX / window.innerWidth) - 0.5) * -2 * MAX_SHIFT;
        targetY = ((e.clientY / window.innerHeight) - 0.5) * -2 * MAX_SHIFT;
      }, { passive: true });
    }
    requestAnimationFrame(tick);
  }

  /* --------------------------------------------------------- shooting stars
     A thin bright streak every 20–40 s, restricted to zones that never
     cross the figure's interactive area (left strip, bottom strip, top
     strip left of the banner).                                            */

  if (!reduceMotion) {
    const ZONES = [
      { x: [15, 150], y: [70, 630] },   // left strip
      { x: [60, 940], y: [660, 692] },  // below the figure
      { x: [20, 440], y: [8, 38] }      // above, left of the banner
    ];

    function shoot() {
      if (!document.hidden) {
        const z = ZONES[Math.floor(Math.random() * ZONES.length)];
        const x1 = rand(z.x[0], z.x[1]);
        const y1 = rand(z.y[0], z.y[1]);
        const x2 = Math.min(Math.max(x1 + rand(-110, 110), z.x[0]), z.x[1]);
        const y2 = Math.min(Math.max(y1 + rand(-60, 60), z.y[0]), z.y[1]);
        const len = Math.hypot(x2 - x1, y2 - y1);

        if (len > 35) {
          const line = el("line", {
            class: "shooting-star",
            x1, y1, x2, y2,
            stroke: "#fdf6e8", "stroke-width": 1.4,
            "stroke-dasharray": "55 " + (len + 55)
          }, meteorGroup);
          line.animate(
            [
              { strokeDashoffset: 55, opacity: 0 },
              { opacity: 0.95, offset: 0.25 },
              { strokeDashoffset: -len, opacity: 0 }
            ],
            { duration: 700, easing: "ease-out" }
          ).onfinish = () => line.remove();
        }
      }
      setTimeout(shoot, rand(20000, 40000));
    }
    setTimeout(shoot, rand(6000, 15000));
  }
})();
