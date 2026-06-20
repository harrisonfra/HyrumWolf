"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EDGE_PATH, EDGE_OFFSET, NODES, NODE_BY_ID, VIEWBOX } from "@/lib/figure";
import type { FigureNode } from "@/lib/figure";
import { STARS } from "@/lib/content";
import type { StarContent, Section } from "@/lib/types";

// Every clickable star looks the same: one size, the "OG" Cryopets blue.
const INTERACTIVE = { core: "#dcebff", glow: "url(#glow-blue)", label: "#bcd6ff" };
const INTERACTIVE_R = 5;

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

// Padding (in viewBox units) around the figure so it sits clear of the name at
// the top and the footer at the bottom — and reads smaller, not edge-to-edge.
const PAD = { x: 150, top: 300, bottom: 150 };
const VIEW = `${-PAD.x} ${-PAD.top} ${VIEWBOX.w + PAD.x * 2} ${
  VIEWBOX.h + PAD.top + PAD.bottom
}`;

interface Props {
  finePointer: boolean;
  activeId: string | null;
  activeSection: Section | null;
  onOpen: (content: StarContent) => void;
  onBackgroundClick: () => void;
}

export default function Constellation({
  finePointer,
  activeId,
  activeSection,
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

  // Story-by-node, plus the node pairs to glow when a story is hovered.
  const { contentByNode, glowPairs } = useMemo(() => {
    const contentByNode = new Map<string, StarContent>();
    STARS.forEach((s) => contentByNode.set(s.node, s));
    const glowPairs = new Map<string, [FigureNode, FigureNode][]>();
    STARS.forEach((s) => {
      const pairs: [FigureNode, FigureNode][] = [];
      (s.connectsTo ?? []).forEach((otherId) => {
        const other = STARS.find((o) => o.id === otherId);
        if (other) pairs.push([NODE_BY_ID[s.node], NODE_BY_ID[other.node]]);
      });
      glowPairs.set(s.id, pairs);
    });
    return { contentByNode, glowPairs };
  }, []);

  const glowLines = hoveredId ? glowPairs.get(hoveredId) ?? [] : [];

  // When a panel opens, the hover name is redundant — clear it so it never
  // lingers behind/after the side panel.
  useEffect(() => {
    if (activeId) {
      setHoveredId(null);
      setLabel(null);
    }
  }, [activeId]);

  function showLabel(content: StarContent) {
    const core = coreRefs.current[content.node];
    if (!core) return;
    const r = core.getBoundingClientRect();
    // Flip the label to the left of the star when it would run off the right.
    const flip = r.right + 160 > window.innerWidth;
    setLabel({
      text: content.name.toUpperCase(),
      color: INTERACTIVE.label,
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
        className={
          activeSection ? "is-filtered" : activeId ? "is-dimmed" : undefined
        }
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
        </defs>

        {/* Constellation lines — the exact vector-87 art (curves and all),
            shifted into the stars' coordinate space. */}
        <g
          id="edges"
          transform={`translate(${EDGE_OFFSET.x} ${EDGE_OFFSET.y})`}
        >
          <path className="edges-path" d={EDGE_PATH} />
        </g>

        {/* Brighten the line(s) between a hovered story and its relatives. */}
        <g id="glow-lines">
          {glowLines.map(([a, b], i) => (
            <line
              key={i}
              className="edge edge--glow"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
          ))}
        </g>

        {/* Stars */}
        <g id="figure-stars">
          {NODES.map((n) => {
            const content = contentByNode.get(n.id) ?? null;
            const isHot = !!content;
            const coreR = isHot ? INTERACTIVE_R : n.r;
            const style = {
              ["--tw-dur" as string]: `${(3 + hash(n.id + "d") * 4.5).toFixed(2)}s`,
              ["--tw-delay" as string]: `${(-hash(n.id + "y") * 7).toFixed(2)}s`,
              ["--base-op" as string]: isHot
                ? "1"
                : (0.72 + hash(n.id + "o") * 0.28).toFixed(2),
              ["--pulse-dur" as string]: `${(5.5 + hash(n.id + "p") * 1.5).toFixed(2)}s`,
              ["--pulse-delay" as string]: `${(-hash(n.id + "q") * 6).toFixed(2)}s`,
            } as React.CSSProperties;

            const isMatch =
              !!content && !!activeSection && content.section === activeSection;
            const className =
              "star" +
              (isHot ? " star--interactive" : "") +
              (activeId === content?.id ? " is-active" : "") +
              (isMatch ? " star--match" : "");

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
                  onFocus: (e: React.FocusEvent) => {
                    // Only show the name for keyboard focus — not the
                    // programmatic focus restore after closing the panel.
                    if (e.currentTarget.matches(":focus-visible")) {
                      setHoveredId(content.id);
                      showLabel(content);
                    }
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
                  fill={isHot ? INTERACTIVE.glow : "url(#glow-fig)"}
                />
                <circle
                  className="core"
                  cx={n.x}
                  cy={n.y}
                  r={coreR}
                  fill={isHot ? INTERACTIVE.core : "#dcebff"}
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
