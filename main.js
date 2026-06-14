/* ============================================================================
   main.js — builds the sky, the constellation, and all interaction.
   Reads STAR_CONTENT / FIGURE_STARS / FIGURE_EDGES / SOCIAL_LINKS / BIRTH_ISO
   from data.js.

   Layout of the moving parts:
     #bg-sky   full-viewport starfield (pixel coords) — parallaxes, never
               letterboxes, always full. Holds the shooting stars too.
     #sky      the constellation (viewBox units) — ANCHORED. It never drifts
               or rotates; its life comes from twinkle, a gentle flag wave,
               and per-star spring nudges on hover / drag.
     #fx       overlay (pixel coords) — cursor comet trail + stardust burst.
   ========================================================================== */

(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const VIEW_W = 1000;
  const VIEW_H = 700;

  const bgSky = document.getElementById("bg-sky");
  const sky = document.getElementById("sky");
  const fx = document.getElementById("fx");
  const labelEl = document.getElementById("star-label");
  const panel = document.getElementById("panel");
  const panelClose = document.getElementById("panel-close");
  const panelDesignation = document.getElementById("panel-designation");
  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");
  const panelLink = document.getElementById("panel-link");
  const hint = document.getElementById("hint");
  const eternityEl = document.getElementById("eternity");
  const socialEl = document.getElementById("social");

  // Honor the OS reduced-motion preference; append "?motion" to override it.
  const forceMotion = new URLSearchParams(location.search).has("motion");
  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches && !forceMotion;
  document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  // "α Moronis" → "α MORONIS · LABEL" (Latin only; keep the Greek lowercase)
  const caps = (d, l) =>
    d.charAt(0) + d.slice(1).toUpperCase() + " · " + l.toUpperCase();

  function el(name, attrs, parent) {
    const node = document.createElementNS(SVG_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  /* ------------------------------------------------------------------ defs */

  const defs = el("defs", {}, sky);

  // Cool blue glow for ordinary figure stars (tight falloff = sharp/magical)
  const glowFig = el("radialGradient", { id: "glow-fig" }, defs);
  el("stop", { offset: "0%",  "stop-color": "#dcebff", "stop-opacity": "0.95" }, glowFig);
  el("stop", { offset: "32%", "stop-color": "#5e93e6", "stop-opacity": "0.40" }, glowFig);
  el("stop", { offset: "100%","stop-color": "#3a6bc4", "stop-opacity": "0" }, glowFig);

  // Brighter glow for interactive stars
  const glowHot = el("radialGradient", { id: "glow-hot" }, defs);
  el("stop", { offset: "0%",  "stop-color": "#ffffff", "stop-opacity": "1" }, glowHot);
  el("stop", { offset: "30%", "stop-color": "#8fc0ff", "stop-opacity": "0.6" }, glowHot);
  el("stop", { offset: "100%","stop-color": "#5e93e6", "stop-opacity": "0" }, glowHot);

  // Soft round gradient for cursor-trail / stardust particles (in #fx)
  const fxDefs = el("defs", {}, fx);
  const dust = el("radialGradient", { id: "dust" }, fxDefs);
  el("stop", { offset: "0%",  "stop-color": "#ffffff", "stop-opacity": "0.95" }, dust);
  el("stop", { offset: "45%", "stop-color": "#bcd6ff", "stop-opacity": "0.6" }, dust);
  el("stop", { offset: "100%","stop-color": "#7fb0ff", "stop-opacity": "0" }, dust);

  /* ---------------------------------------------- background starfield (#bg-sky)
     Generated in viewport pixels across an oversized field so parallax never
     exposes an empty edge, and so the area above/below the figure on tall
     phones is full of stars rather than dead space. Repopulated on resize. */

  const COOL_TINTS = ["#eef4ff", "#eef4ff", "#dfe9ff", "#cfe0ff", "#ffe9cf"];
  const bgLayers = [
    el("g", { class: "bg-layer", "data-depth": "0.25" }, bgSky), // deep, slow, faint
    el("g", { class: "bg-layer", "data-depth": "0.55" }, bgSky),
    el("g", { class: "bg-layer", "data-depth": "1" }, bgSky)     // near, fastest
  ];
  const meteorGroup = el("g", { id: "meteors" }, bgSky);

  // stars per 10k px² per layer → a dense field that scales with screen size
  // and never leaves dead space (deepest layer is densest + faintest)
  const LAYER_DENSITY = [2.2, 1.5, 1.0];

  function populateBackground() {
    const W = window.innerWidth, H = window.innerHeight;
    const M = 140; // margin beyond the viewport for parallax headroom
    bgLayers.forEach((layer, i) => {
      layer.textContent = "";
      const area = (W + 2 * M) * (H + 2 * M);
      const count = Math.round((area / 10000) * LAYER_DENSITY[i]);
      for (let n = 0; n < count; n++) {
        const c = el("circle", {
          class: "star",
          cx: rand(-M, W + M).toFixed(1),
          cy: rand(-M, H + M).toFixed(1),
          r: rand(0.4, 0.8 + i * 0.55).toFixed(2),
          fill: COOL_TINTS[Math.floor(Math.random() * COOL_TINTS.length)]
        }, layer);
        c.style.setProperty("--tw-dur", rand(2.5, 7).toFixed(2) + "s");
        c.style.setProperty("--tw-delay", (-rand(0, 7)).toFixed(2) + "s");
        c.style.setProperty("--base-op", rand(0.28, 0.92).toFixed(2));
      }
    });
  }
  populateBackground();

  /* ----------------------------------------------------- constellation (#sky)
     Build edges first (so stars paint on top), then stars. Each star is a
     <g> we can transform for spring nudges; we keep a list of which line
     endpoints to drag along with it so lines stay attached. */

  const constellation = el("g", { id: "constellation" }, sky);
  const edgeGroup = el("g", { id: "edges" }, constellation);
  const starLayer = el("g", { id: "figure-stars" }, constellation);

  const starById = {};
  FIGURE_STARS.forEach((s) => { starById[s.id] = s; });

  // state per star + which line endpoints follow it
  const state = {};          // id → spring/wave state + element refs
  const linesOf = {};        // id → [{ line, xAttr, yAttr }]
  FIGURE_STARS.forEach((s) => { linesOf[s.id] = []; });

  FIGURE_EDGES.forEach(([a, b]) => {
    const sa = starById[a], sb = starById[b];
    if (!sa || !sb) { console.warn("Edge references unknown star:", a, b); return; }
    const line = el("line", { class: "edge", x1: sa.x, y1: sa.y, x2: sb.x, y2: sb.y }, edgeGroup);
    linesOf[a].push({ line, xAttr: "x1", yAttr: "y1" });
    linesOf[b].push({ line, xAttr: "x2", yAttr: "y2" });
  });

  // Flag-wave: banner cloth stars sway gently, weighted by distance from the
  // pole (x≈474) so the free edge moves most and the pole edge barely at all.
  const BANNER_IDS = new Set([
    "s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11","s12","s14","s16",
    "s17","s18","s20","s23","s24","s25","s28","s36","s38","s40","s42","s44","s47","s49"
  ]);
  const POLE_X = 474, BANNER_FAR = 806;

  const contentById = {};
  STAR_CONTENT.forEach((c) => { contentById[c.id] = c; });

  // Render order: decorative stars first, interactive last (so they sit on top
  // and so STAR_CONTENT order = keyboard tab order).
  const decorative = FIGURE_STARS.filter((s) => !s.content);
  const interactive = STAR_CONTENT
    .map((c) => FIGURE_STARS.find((s) => s.content === c.id))
    .filter(Boolean);

  function buildStar(s) {
    const isHot = !!s.content;
    const g = el("g", {
      class: "star" + (isHot ? " star--interactive" : ""),
      "data-id": s.id
    }, starLayer);
    g.style.setProperty("--tw-dur", rand(3, 7.5).toFixed(2) + "s");
    g.style.setProperty("--tw-delay", (-rand(0, 7)).toFixed(2) + "s");
    g.style.setProperty("--base-op", isHot ? "1" : rand(0.72, 1).toFixed(2));

    el("circle", {
      class: "halo", cx: s.x, cy: s.y,
      r: (s.r * (isHot ? 3.0 : 2.4)).toFixed(1),
      fill: isHot ? "url(#glow-hot)" : "url(#glow-fig)"
    }, g);
    el("circle", { class: "core", cx: s.x, cy: s.y, r: s.r, fill: "#dcebff" }, g);
    // invisible hit target — generous on interactive stars, modest elsewhere
    el("circle", {
      class: "hit", cx: s.x, cy: s.y, r: isHot ? 20 : 11,
      fill: "transparent"
    }, g);

    // wave weight (0 for non-banner; up to 1 at the banner's free edge)
    const waveW = BANNER_IDS.has(s.id)
      ? clamp((s.x - POLE_X) / (BANNER_FAR - POLE_X), 0, 1)
      : 0;

    state[s.id] = {
      bx: s.x, by: s.y, dx: 0, dy: 0, vx: 0, vy: 0,
      g, lines: linesOf[s.id], waveW, dragging: false
    };
    return g;
  }

  decorative.forEach(buildStar);
  interactive.forEach(buildStar);

  /* ------------------------------------------------------- spring + wave loop
     One rAF drives: background parallax, the flag wave, and any stars that are
     currently displaced (hover nudge / drag / settling). A star is "active"
     while it has a wave, is dragging, or hasn't settled back to rest. */

  const active = new Set();
  // banner stars wave forever
  if (!reduceMotion) Object.keys(state).forEach((id) => { if (state[id].waveW) active.add(id); });

  const K = 0.16;     // spring stiffness toward rest (0,0)
  const DAMP = 0.82;  // velocity damping
  const W_AMP = 3.0;  // flag wave amplitude (viewBox units) at the free edge
  const W_FREQ = 0.7; // flag wave speed

  function renderStar(id, t) {
    const st = state[id];
    if (!st.dragging) {
      st.vx = (st.vx + (0 - st.dx) * K) * DAMP;
      st.vy = (st.vy + (0 - st.dy) * K) * DAMP;
      st.dx += st.vx;
      st.dy += st.vy;
    }
    let wx = 0, wy = 0;
    if (st.waveW && !reduceMotion) {
      wy = Math.sin(t * W_FREQ + st.bx * 0.03) * W_AMP * st.waveW;
      wx = Math.cos(t * W_FREQ * 0.8 + st.bx * 0.02) * W_AMP * 0.45 * st.waveW;
    }
    const ox = st.dx + wx, oy = st.dy + wy;
    st.g.setAttribute("transform", `translate(${ox.toFixed(2)} ${oy.toFixed(2)})`);
    for (const L of st.lines) {
      L.line.setAttribute(L.xAttr, (st.bx + ox).toFixed(2));
      L.line.setAttribute(L.yAttr, (st.by + oy).toFixed(2));
    }
    // retire fully-settled, non-waving, non-dragged stars
    const settled = !st.dragging && !st.waveW &&
      Math.abs(st.vx) < 0.01 && Math.abs(st.vy) < 0.01 &&
      Math.abs(st.dx) < 0.04 && Math.abs(st.dy) < 0.04;
    if (settled) {
      st.dx = st.dy = st.vx = st.vy = 0;
      st.g.setAttribute("transform", "translate(0 0)");
      for (const L of st.lines) {
        L.line.setAttribute(L.xAttr, st.bx.toFixed(2));
        L.line.setAttribute(L.yAttr, st.by.toFixed(2));
      }
      active.delete(id);
    }
  }

  // Background parallax: eased toward the mouse, plus a slow autonomous wander
  // so the sky is never perfectly still. Disabled under reduced motion.
  const PARALLAX = 14, AMBIENT = 6;
  let tgtX = 0, tgtY = 0, curX = 0, curY = 0;
  const t0 = performance.now();

  function frame(now) {
    const t = (now - t0) / 1000;
    if (!reduceMotion) {
      curX += (tgtX - curX) * 0.05;
      curY += (tgtY - curY) * 0.05;
      const ax = Math.sin(t * 0.05) * AMBIENT;
      const ay = Math.cos(t * 0.037) * AMBIENT * 0.7;
      for (const layer of bgLayers) {
        const d = parseFloat(layer.dataset.depth);
        layer.setAttribute("transform",
          `translate(${((curX + ax) * d).toFixed(2)} ${((curY + ay) * d).toFixed(2)})`);
      }
    }
    if (active.size) active.forEach((id) => renderStar(id, t));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ----------------------------------------------------------- star pointer FX
     Hover gives a star a little outward kick that springs back. Press-drag
     lets you pull a star and release it to snap home. A press that doesn't
     move (a tap/click) opens the panel for interactive stars. */

  const scale = () => (sky.getScreenCTM() ? sky.getScreenCTM().a : 1);

  function kick(id, fromClientX, fromClientY) {
    if (reduceMotion) return;
    const st = state[id];
    const ctm = sky.getScreenCTM(); if (!ctm) return;
    const sx = ctm.a * st.bx + ctm.e, sy = ctm.d * st.by + ctm.f;
    let dx = sx - fromClientX, dy = sy - fromClientY;
    const m = Math.hypot(dx, dy) || 1;
    const impulse = 2.6; // velocity in viewBox units/frame → ~8px peak nudge
    st.vx += (dx / m) * impulse;
    st.vy += (dy / m) * impulse;
    active.add(id);
  }

  let dragId = null, dragStart = null, dragMoved = false, dragDownAt = 0;

  function onStarDown(e, id, content) {
    const st = state[id];
    e.preventDefault();
    try { st.g.setPointerCapture(e.pointerId); } catch (_) {}
    dragId = id;
    dragMoved = false;
    dragDownAt = performance.now();
    dragStart = { x: e.clientX, y: e.clientY, dx: st.dx, dy: st.dy };
    st.dragging = true;
    active.add(id);
    st._content = content;
  }

  function onStarMove(e) {
    if (dragId === null) return;
    const st = state[dragId];
    const s = scale() || 1;
    let ndx = dragStart.dx + (e.clientX - dragStart.x) / s;
    let ndy = dragStart.dy + (e.clientY - dragStart.y) / s;
    const m = Math.hypot(ndx, ndy), MAX = 48;
    if (m > MAX) { ndx = ndx / m * MAX; ndy = ndy / m * MAX; }
    st.dx = ndx; st.dy = ndy; st.vx = 0; st.vy = 0;
    if (Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y) > 4) dragMoved = true;
  }

  function onStarUp(e) {
    if (dragId === null) return;
    const st = state[dragId];
    const id = dragId, content = st._content;
    try { st.g.releasePointerCapture(e.pointerId); } catch (_) {}
    st.dragging = false;
    active.add(id); // let it spring home
    dragId = null;
    // A short press that didn't move = a click → open the panel.
    if (!dragMoved && content && performance.now() - dragDownAt < 600) {
      openPanel(st.g, starById[id], content);
    }
  }

  // wire pointer handlers on every figure star
  FIGURE_STARS.forEach((s) => {
    const st = state[s.id]; if (!st) return;
    const content = s.content ? contentById[s.content] : null;
    st.g.addEventListener("pointerdown", (e) => onStarDown(e, s.id, content));
    st.g.addEventListener("pointermove", onStarMove);
    st.g.addEventListener("pointerup", onStarUp);
    st.g.addEventListener("pointercancel", onStarUp);
    if (hasFinePointer) {
      st.g.addEventListener("pointerenter", (e) => {
        if (dragId === null) kick(s.id, e.clientX, e.clientY);
        if (content && (!activeStar || activeStar.el !== st.g)) showLabel(st.g, content);
      });
      st.g.addEventListener("pointerleave", hideLabel);
    }
    if (content) {
      st.g.setAttribute("role", "button");
      st.g.setAttribute("tabindex", "0");
      st.g.setAttribute("aria-label", content.designation + " — " + content.label);
      st.g.style.setProperty("--pulse-dur", rand(5.5, 7).toFixed(2) + "s");
      st.g.style.setProperty("--pulse-delay", (-rand(0, 6)).toFixed(2) + "s");
      st.g.addEventListener("focus", () => showLabel(st.g, content));
      st.g.addEventListener("blur", hideLabel);
      st.g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPanel(st.g, s, content); }
      });
    }
  });

  /* ---------------------------------------------------------- panel + label */

  let activeStar = null, lastFocused = null, hintGone = false;

  function showLabel(g, content) {
    const rect = g.querySelector(".core").getBoundingClientRect();
    labelEl.textContent = caps(content.designation, content.label);
    labelEl.classList.add("is-visible");
    labelEl.style.left = "0px"; labelEl.style.top = "0px";
    const lw = labelEl.offsetWidth;
    let x = rect.right + 14;
    if (x + lw > window.innerWidth - 12) x = rect.left - lw - 14;
    labelEl.style.left = Math.max(8, x) + "px";
    labelEl.style.top = (rect.top + rect.height / 2 - labelEl.offsetHeight / 2) + "px";
  }
  function hideLabel() { labelEl.classList.remove("is-visible"); }

  function openPanel(g, figureStar, content) {
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

    // dim the sky and brighten the active star — no ring (item 10)
    sky.classList.add("is-dimmed");
    g.classList.add("is-active");
    activeStar = { el: g, content };
    lastFocused = g;
    hideLabel();
    panelClose.focus();
    blowAwayHint();
  }

  function closePanel(restoreFocus = true) {
    if (!activeStar) return;
    panel.classList.remove("is-open");
    panel.addEventListener("transitionend",
      () => { if (!activeStar) panel.hidden = true; }, { once: true });
    sky.classList.remove("is-dimmed");
    activeStar.el.classList.remove("is-active");
    if (restoreFocus && lastFocused) lastFocused.focus();
    activeStar = null;
    if (reduceMotion) panel.hidden = true;
  }

  panelClose.addEventListener("click", () => closePanel());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });
  sky.addEventListener("click", (e) => {
    // click on empty sky closes; clicks on a star are handled by pointerup
    if (!e.target.closest(".star")) closePanel();
  });

  /* --------------------------------------------------- big hint → stardust
     Positioned just under the figure (measured from the pole-base star), the
     hint bursts into drifting stardust the first time a star is opened. */

  function positionHint() {
    const base = sky.querySelector('[data-id="s78"] .core');
    if (!base) return;
    const r = base.getBoundingClientRect();
    hint.style.top = Math.min(r.bottom + 30, window.innerHeight - 120) + "px";
  }

  function blowAwayHint() {
    if (hintGone) return;
    hintGone = true;
    if (!reduceMotion) {
      const r = hint.getBoundingClientRect();
      const n = 56;
      for (let i = 0; i < n; i++) {
        const px = rand(r.left, r.right), py = rand(r.top, r.bottom);
        const p = el("circle", { cx: px, cy: py, r: rand(1.2, 3).toFixed(2), fill: "url(#dust)" }, fx);
        const ang = rand(0, Math.PI * 2), dist = rand(20, 120);
        p.animate(
          [
            { transform: "translate(0,0)", opacity: 1 },
            { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist - 20}px)`, opacity: 0 }
          ],
          { duration: rand(700, 1300), easing: "cubic-bezier(0.2,0.7,0.3,1)" }
        ).onfinish = () => p.remove();
      }
    }
    hint.classList.add("is-gone");
    setTimeout(() => hint.remove(), 600);
  }

  /* ----------------------------------------------------- cursor comet (#fx)
     A soft head follows the cursor, shedding a short, fading trail. Fine
     pointers only; off under reduced motion. */

  if (hasFinePointer && !reduceMotion) {
    const head = el("circle", { r: 4, fill: "url(#dust)", opacity: "0" }, fx);
    let lastTrail = 0, idleHide;
    window.addEventListener("pointermove", (e) => {
      head.setAttribute("cx", e.clientX);
      head.setAttribute("cy", e.clientY);
      head.setAttribute("opacity", "0.9");
      clearTimeout(idleHide);
      idleHide = setTimeout(() => head.setAttribute("opacity", "0"), 300);
      const now = performance.now();
      if (now - lastTrail > 22) {
        lastTrail = now;
        const dotEl = el("circle", { cx: e.clientX, cy: e.clientY, r: rand(1.6, 3), fill: "url(#dust)" }, fx);
        dotEl.animate(
          [{ opacity: 0.75, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.2)" }],
          { duration: 520, easing: "ease-out" }
        ).onfinish = () => dotEl.remove();
      }
    }, { passive: true });

    // parallax target follows the cursor too
    window.addEventListener("mousemove", (e) => {
      tgtX = ((e.clientX / window.innerWidth) - 0.5) * -2 * PARALLAX;
      tgtY = ((e.clientY / window.innerHeight) - 0.5) * -2 * PARALLAX;
    }, { passive: true });
  }

  /* --------------------------------------------------------- shooting stars
     Larger, easier to notice but not frequent. They streak through the
     background only, steering clear of the figure's on-screen box. */

  let figureBox = null;
  function computeFigureBox() {
    const r = constellation.getBoundingClientRect();
    const pad = 40;
    figureBox = { l: r.left - pad, t: r.top - pad, rt: r.right + pad, b: r.bottom + pad };
  }

  if (!reduceMotion) {
    function shoot() {
      if (!document.hidden && figureBox) {
        const W = window.innerWidth, H = window.innerHeight;
        let x1, y1, tries = 0;
        do {
          x1 = rand(0, W); y1 = rand(0, H * 0.85); tries++;
        } while (tries < 12 &&
          x1 > figureBox.l && x1 < figureBox.rt && y1 > figureBox.t && y1 < figureBox.b);

        const ang = rand(Math.PI * 0.08, Math.PI * 0.42); // down-right-ish
        const len = rand(110, 190);
        const x2 = x1 + Math.cos(ang) * len, y2 = y1 + Math.sin(ang) * len;

        const g = el("g", { class: "shooting-star" }, meteorGroup);
        const line = el("line", {
          x1, y1, x2, y2,
          stroke: "#eaf2ff", "stroke-width": 2.2,
          "stroke-dasharray": len + " " + (len + 60), "stroke-dashoffset": len
        }, g);
        const dot = el("circle", { cx: x2, cy: y2, r: 2.6, fill: "url(#dust)" }, g);
        line.animate(
          [{ strokeDashoffset: len, opacity: 0 },
           { opacity: 1, offset: 0.25 },
           { strokeDashoffset: -60, opacity: 0 }],
          { duration: 850, easing: "ease-out" }
        );
        dot.animate(
          [{ opacity: 0, transform: "translate(0,0)" },
           { opacity: 1, offset: 0.25 },
           { opacity: 0, transform: `translate(${Math.cos(ang) * 30}px, ${Math.sin(ang) * 30}px)` }],
          { duration: 850, easing: "ease-out" }
        ).onfinish = () => g.remove();
      }
      setTimeout(shoot, rand(14000, 30000));
    }
    setTimeout(shoot, rand(4000, 9000));
  }

  // Occasionally nudge a random interactive star so it's noticed — a hint that
  // these stars are alive and clickable (helps discovery, esp. on touch).
  if (!reduceMotion) {
    function tease() {
      if (!document.hidden && !activeStar && interactive.length) {
        const s = interactive[Math.floor(Math.random() * interactive.length)];
        const st = state[s.id];
        st.vx += rand(-1.4, 1.4); st.vy += rand(-1.8, -0.6);
        active.add(s.id);
      }
      setTimeout(tease, rand(6000, 11000));
    }
    setTimeout(tease, 5000);
  }

  /* ------------------------------------------------------- social + eternity */

  const ICON_PATHS = {
    x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    linkedin: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
    youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z",
    instagram: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.71 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
    email: "M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5-8-5zm0 12H4V8l8 5 8-5z"
  };
  const ICON_LABEL = { x: "X", linkedin: "LinkedIn", youtube: "YouTube", instagram: "Instagram", email: "Email" };

  if (typeof SOCIAL_LINKS !== "undefined") {
    SOCIAL_LINKS.forEach((s) => {
      const path = ICON_PATHS[s.platform];
      if (!path || !s.url) return;
      const a = document.createElement("a");
      a.href = s.url;
      a.setAttribute("aria-label", ICON_LABEL[s.platform] || s.platform);
      if (!s.url.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener"; }
      const svg = el("svg", { viewBox: "0 0 24 24", fill: "currentColor" });
      el("path", { d: path }, svg);
      a.appendChild(svg);
      socialEl.appendChild(a);
    });
  }

  if (typeof BIRTH_ISO !== "undefined") {
    const birth = new Date(BIRTH_ISO).getTime();
    function updateEternity() {
      const days = Math.floor((Date.now() - birth) / 86400000);
      eternityEl.textContent = "✦ " + days.toLocaleString() + " days into eternity";
    }
    updateEternity();
    setInterval(updateEternity, 60000);
  }

  /* ----------------------------------------------------------------- resize */

  let resizeTimer;
  window.addEventListener("resize", () => {
    computeFigureBox();
    positionHint();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(populateBackground, 200); // debounce the rebuild
  });

  // initial geometry-dependent setup (after layout settles)
  requestAnimationFrame(() => { computeFigureBox(); positionHint(); });
  window.addEventListener("load", () => { computeFigureBox(); positionHint(); });
})();
