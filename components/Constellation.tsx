"use client";

import { useMemo, useRef, useState } from "react";
import { EDGES, NODES, NODE_BY_ID, VIEWBOX } from "@/lib/figure";
import { STARS } from "@/lib/content";
import { SECTION, SIZE_R } from "@/lib/theme";
import type { StarContent } from "@/lib/types";

/** Stable 0..1 pseudo-random from a string, so twinkle/pulse phases survive
 *  re-renders and match between server and client (no hydration drift). */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const edgeKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

// Padding (in viewBox units) around the figure so the flag tip clears the
// header and the feet clear the footer at any aspect ratio.
const PAD = { x: 30, top: 120, bottom: 90 };
const VIEW = `${-PAD.x} ${-PAD.top} ${VIEWBOX.w + PAD.x * 2} ${
  VIEWBOX.h + PAD.top + PAD.bottom
}`;

interface Props {
  finePointer: boolean;
  activeId: string | null;
  onOpen: (content: StarContent) => void;
  onBackgroundClick: () => void;
}

export default function Constellation({
  finePointer,
  activeId,
  onOpen,
  onBackgroundClick,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [label, setLabel] = useState<{
    text: string;
    color: string;
    x: number;
    y: number;
    flip: boolean;
  } | null>(null);
  const coreRefs = useRef<Record<string, SVGCircleElement | null>>({});

  // Story-by-node and the edges that should glow when a story is hovered.
  const { contentByNode, glowEdges } = useMemo(() => {
    const contentByNode = new Map<string, StarContent>();
    STARS.forEach((s) => contentByNode.set(s.node, s));
    const glowEdges = new Map<string, Set<string>>();
    STARS.forEach((s) => {
      const keys = new Set<string>();
      (s.connectsTo ?? []).forEach((otherId) => {
        const other = STARS.find((o) => o.id === otherId);
        if (other) keys.add(edgeKey(s.node, other.node));
      });
      glowEdges.set(s.id, keys);
    });
    return { contentByNode, glowEdges };
  }, []);

  const glowSet =
    hoveredId && glowEdges.has(hoveredId) ? glowEdges.get(hoveredId)! : null;

  function showLabel(content: StarContent) {
    const core = coreRefs.current[content.node];
    if (!core) return;
    const r = core.getBoundingClientRect();
    // Flip the label to the left of the star when it would run off the right.
    const flip = r.right + 240 > window.innerWidth;
    setLabel({
      text: `${content.name.toUpperCase()} · ${content.subtitle}`,
      color: SECTION[content.section].label,
      x: flip ? r.left - 14 : r.right + 14,
      y: r.top + r.height / 2,
      flip,
    });
  }

  function onStarEnter(content: StarContent) {
    if (!finePointer) return;
    setHoveredId(content.id);
    if (activeId !== content.id) showLabel(content);
  }
  function onStarLeave() {
    setHoveredId(null);
    setLabel(null);
  }

  return (
    <main
      id="sky-wrap"
      aria-label="Interactive constellation of Captain Moroni planting the Title of Liberty"
    >
      <svg
        id="sky"
        className={activeId ? "is-dimmed" : undefined}
        viewBox={VIEW}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => {
          if (!(e.target as Element).closest(".star")) onBackgroundClick();
        }}
      >
        <defs>
          <radialGradient id="glow-fig">
            <stop offset="0%" stopColor="#dcebff" stopOpacity="1" />
            <stop offset="32%" stopColor="#5e93e6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3a6bc4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-blue">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="32%" stopColor="#8fc0ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5e93e6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-gold">
            <stop offset="0%" stopColor="#fff6df" stopOpacity="1" />
            <stop offset="32%" stopColor="#e9c878" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#caa24b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-silver">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="32%" stopColor="#d4e2f5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#aebfd6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Constellation lines */}
        <g id="edges">
          {EDGES.map(([a, b]) => {
            const na = NODE_BY_ID[a];
            const nb = NODE_BY_ID[b];
            const glow = glowSet?.has(edgeKey(a, b)) ?? false;
            return (
              <line
                key={`${a}-${b}`}
                className={glow ? "edge edge--glow" : "edge"}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
              />
            );
          })}
        </g>

        {/* Stars */}
        <g id="figure-stars">
          {NODES.map((n) => {
            const content = contentByNode.get(n.id) ?? null;
            const isHot = !!content;
            const sect = content ? SECTION[content.section] : null;
            const coreR = content ? SIZE_R[content.size] : n.r;
            const style = {
              ["--tw-dur" as string]: `${(3 + hash(n.id + "d") * 4.5).toFixed(2)}s`,
              ["--tw-delay" as string]: `${(-hash(n.id + "y") * 7).toFixed(2)}s`,
              ["--base-op" as string]: isHot
                ? "1"
                : (0.72 + hash(n.id + "o") * 0.28).toFixed(2),
              ["--pulse-dur" as string]: `${(5.5 + hash(n.id + "p") * 1.5).toFixed(2)}s`,
              ["--pulse-delay" as string]: `${(-hash(n.id + "q") * 6).toFixed(2)}s`,
            } as React.CSSProperties;

            const className =
              "star" +
              (isHot ? " star--interactive" : "") +
              (activeId === content?.id ? " is-active" : "");

            const interactiveProps = content
              ? {
                  role: "button",
                  tabIndex: 0,
                  "aria-label": `${content.name} — ${content.subtitle}`,
                  onClick: () => onOpen(content),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpen(content);
                    }
                  },
                  onPointerEnter: () => onStarEnter(content),
                  onPointerLeave: onStarLeave,
                  onFocus: () => {
                    setHoveredId(content.id);
                    showLabel(content);
                  },
                  onBlur: onStarLeave,
                }
              : {};

            return (
              <g
                key={n.id}
                className={className}
                data-id={n.id}
                style={style}
                {...interactiveProps}
              >
                <circle
                  className="halo"
                  cx={n.x}
                  cy={n.y}
                  r={(coreR * (isHot ? 3 : 2.4)).toFixed(1)}
                  fill={isHot ? sect!.glow : "url(#glow-fig)"}
                />
                <circle
                  className="core"
                  cx={n.x}
                  cy={n.y}
                  r={coreR}
                  fill={isHot ? sect!.core : "#dcebff"}
                  ref={(el) => {
                    coreRefs.current[n.id] = el;
                  }}
                />
                {isHot && (
                  <circle
                    className="hit"
                    cx={n.x}
                    cy={n.y}
                    r={Math.max(20, coreR + 14)}
                    fill="transparent"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hover annotation (star-chart style) */}
      {label && finePointer && (
        <div
          className={"star-label is-visible" + (label.flip ? " flip" : "")}
          aria-hidden="true"
          style={{ left: label.x, top: label.y, color: label.color }}
        >
          {label.text}
        </div>
      )}
    </main>
  );
}
