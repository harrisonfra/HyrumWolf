"use client";

import { useMemo } from "react";
import { STARS } from "@/lib/content";
import type { Section, StarContent } from "@/lib/types";

const CATEGORIES: { key: Section; label: string }[] = [
  { key: "motivations", label: "Motivations" },
  { key: "iic", label: "Immortalist Industrial Complex" },
  { key: "background", label: "Background" },
];

interface Props {
  activeSection: Section | null;
  activeId: string | null;
  onSelectSection: (section: Section) => void;
  onSelectStar: (content: StarContent) => void;
}

/** Left-side legend + filter. Clicking a category highlights its stars and
 *  drops down their names; clicking a name opens that story. */
export default function Legend({
  activeSection,
  activeId,
  onSelectSection,
  onSelectStar,
}: Props) {
  const bySection = useMemo(() => {
    const map = new Map<Section, StarContent[]>();
    STARS.forEach((s) => {
      const list = map.get(s.section) ?? [];
      list.push(s);
      map.set(s.section, list);
    });
    return map;
  }, []);

  return (
    <aside className="legend" aria-label="Constellation legend and filter">
      <p className="legend-title">Legend</p>
      <ul>
        {CATEGORIES.map((c) => {
          const expanded = activeSection === c.key;
          const stars = bySection.get(c.key) ?? [];
          return (
            <li key={c.key}>
              <button
                type="button"
                className={"legend-item" + (expanded ? " is-active" : "")}
                aria-expanded={expanded}
                onClick={() => onSelectSection(c.key)}
              >
                {c.label}
              </button>
              {expanded && (
                <ul className="legend-sub">
                  {stars.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        className={
                          "legend-star" + (activeId === s.id ? " is-active" : "")
                        }
                        onClick={() => onSelectStar(s)}
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
