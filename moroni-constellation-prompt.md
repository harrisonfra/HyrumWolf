# Prompt for Claude Code

Build a single-page personal website for my friend **Hyrum HG Wolf**, tagline **"Cosmist & Christian."** The entire page is an interactive constellation of Captain Moroni (Book of Mormon figure) kneeling and planting the Title of Liberty flag. I'm attaching two reference images: one shows the exact constellation geometry and typography style I want (gold serif name, white stars on near-black sky), the other shows a glowier blue rendering of the same figure for lighting/glow inspiration. Match the **geometry of image 1** and borrow the **glow quality of image 2**, but keep the palette of image 1 (warm white stars, deep blue-black sky, gold accent text).

## Tech constraints

- Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step. One `index.html` (a separate `styles.css`, `main.js`, and `data.js` are fine).
- The constellation must be **inline SVG** so every star is a real DOM node (clickable, focusable, styleable).
- All star content lives in a single exported object in `data.js` so I can edit text without touching markup.
- Must work well on desktop and mobile.

## The constellation figure

Recreate the Captain Moroni figure from the reference images as an SVG: a kneeling man, one knee down, both hands gripping a tall vertical flagpole, with a large banner (the Title of Liberty) streaming to the upper right. Trace the node-and-edge structure from image 1 as closely as you can — roughly 60–70 stars connected by thin lines, including:

- The **flag tip star** at the very top of the pole (the brightest star in the scene — treat it like the constellation's alpha star).
- The banner as an irregular polygon of ~15 stars streaming right.
- The head as a small polygon of ~6 stars, shoulders, both arms meeting at the pole grip, torso, the bent front leg, the kneeling back leg, and feet.
- The pole as a long straight line of 3–4 stars from flag tip down to the ground.

Lines should be thin (1–1.5px), soft white at ~35% opacity. Stars vary in radius (2–6px) with a soft radial glow (SVG filter or layered circles). A handful of stars are noticeably brighter — these are the **interactive stars**.

## Interactive stars

About 10–14 of the stars are clickable hotspots. Each one maps to a part of Hyrum's life. Assign them to anatomically meaningful positions and give each a Bayer-style designation that appears on hover, like a real star chart:

| Designation | Position on figure | Content category |
|---|---|---|
| α Moronis | Flag tip (brightest) | Core identity / mission statement |
| β Moronis | Head | Beliefs & worldview ("Cosmist & Christian") |
| γ Moronis | Heart / chest | Faith & family |
| δ Moronis | Right hand on pole | Current main project |
| ε Moronis | Left hand on pole | Second project |
| ζ Moronis | Banner star 1 | Key life event 1 |
| η Moronis | Banner star 2 | Key life event 2 |
| θ Moronis | Banner star 3 | Key life event 3 |
| ι Moronis | Shoulder | Skills / craft |
| κ Moronis | Front knee | Education |
| λ Moronis | Back foot | Origins / hometown |
| μ Moronis | Pole base | Foundations / values |

Fill every entry with clearly-marked placeholder content (title, 2–3 sentence body, optional link) — I will replace it. Structure each entry in `data.js` as:

```js
{
  id: "alpha",
  designation: "α Moronis",
  label: "Core Identity",
  title: "PLACEHOLDER — short headline",
  body: "PLACEHOLDER — 2–3 sentences.",
  link: { text: "Optional link", url: "#" } // or null
}
```

### Interaction behavior

- **Hover (desktop):** the star brightens and its glow expands; a small label fades in next to it showing the designation and label (e.g., "α Moronis · Core Identity"), styled like star-chart annotations — small caps, letterspaced, gold.
- **Click / tap:** a side panel slides in from the right (or up from the bottom on mobile) with the designation, title, body, and link. Dark glassy panel (blurred backdrop, thin gold top border), close button, also closes on Escape or clicking the sky.
- While a panel is open, dim the rest of the constellation slightly and draw a brighter "selection ring" around the active star.
- Interactive stars need an idle affordance so visitors know to click: a slow pulse (scale + glow oscillation, ~4s period, desynchronized between stars).
- Full keyboard support: interactive stars are tabbable in the order above, Enter/Space opens the panel, visible focus ring.

## Motion — make the sky feel alive (this is important)

The constellation figure itself stays **anchored** so targets don't move under the cursor. The life comes from three layers:

1. **Twinkle:** every star (figure + background) oscillates opacity and glow radius subtly and independently — randomized phase and period (2–7s) so it never looks synchronized. Use CSS animations or rAF, keep it cheap.
2. **Parallax starfield background:** generate 2–3 layers of ~150 procedural background stars (tiny, varied brightness, occasional faint warm/cool color tint). On mouse move, layers shift at different rates (deepest layer slowest) — a few pixels max, eased, so the sky has depth. On mobile, use a very slow autonomous drift instead.
3. **Sidereal drift:** the entire sky group (background + constellation together) rotates extremely slowly around a point off the top of the viewport — think one degree per minute, like a long-exposure photo of the night sky. Slow enough that clicking is unaffected, but if you stare you can see the heavens turning.

Plus one delight: a **shooting star** streaks across a random part of the background every 20–40 seconds (thin bright line with fading tail, ~700ms). Never crosses through the figure's interactive area.

Respect `prefers-reduced-motion`: disable parallax, drift, and shooting stars; reduce twinkle to a faint opacity shimmer or none.

## Layout & typography

- Full-viewport sky, no scrolling on desktop. Background: very deep blue-black radial gradient (e.g., `#05070f` center to `#020308` edges) with a barely-visible nebula haze (large soft radial gradients at ~3% opacity in purple/teal) like image 1.
- **Header, top center:** "Hyrum HG Wolf" in a gold (#c9a24b-ish) serif — Playfair Display or similar from Google Fonts — with "COSMIST & CHRISTIAN" beneath in small white letterspaced caps. Match image 1's header closely.
- **Footer, bottom corner, very subtle:** a one-line hint like "✦ Brighter stars hold stories — click one" in 50%-opacity small caps. Fade it out permanently after the first star is clicked.
- Constellation sized to occupy roughly the central 70% of the viewport with the flag sweeping toward the upper right, as in the references. On narrow screens, scale the SVG via `viewBox` so the whole figure fits; the detail panel becomes a bottom sheet.

## Quality bar

- 60fps; prefer transform/opacity animations; no layout thrash in the rAF loop.
- No external assets beyond Google Fonts — all stars and effects are procedural/SVG/CSS.
- Clean, commented code; the constellation's star coordinates defined as a data array (id, x, y, radius, interactive?) plus an edges array of id pairs, so the figure is easy to tweak.
- Semantic HTML, ARIA labels on interactive stars (`role="button"`, `aria-label` with designation + label), panel as `aria-modal` dialog.
- Page `<title>`: "Hyrum HG Wolf — Cosmist & Christian". Add a simple star/asterisk SVG favicon.

When done, give me a short README section in a comment at the top of `data.js` explaining how to edit star content and how to add or remove an interactive star.
