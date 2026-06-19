"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BackgroundField from "./BackgroundField";
import Constellation from "./Constellation";
import Panel from "./Panel";
import Footer from "./Footer";
import CometTrail from "./CometTrail";
import { usePrefersReducedMotion, useFinePointer } from "./hooks";
import { STARS } from "@/lib/content";
import type { StarContent } from "@/lib/types";

export default function Sky() {
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hintGone, setHintGone] = useState(false);
  const lastFocused = useRef<HTMLElement | null>(null);

  const openStar = useCallback((content: StarContent) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setActiveId(content.id);
    setHintGone(true);
  }, []);

  const closePanel = useCallback(() => {
    setActiveId(null);
    // Return focus to the star that opened the panel.
    lastFocused.current?.focus?.();
  }, []);

  // Mark <html> so CSS can respond to reduced motion.
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
  }, [reducedMotion]);

  const activeContent =
    activeId !== null ? STARS.find((s) => s.id === activeId) ?? null : null;

  return (
    <>
      {/* Nebula haze */}
      <div className="nebula-field" aria-hidden="true">
        <span className="nebula nebula--violet" />
        <span className="nebula nebula--teal" />
        <span className="nebula nebula--amber" />
      </div>

      <BackgroundField reducedMotion={reducedMotion} finePointer={finePointer} />

      <header className="site-header">
        <span className="header-glow" aria-hidden="true" />
        <h1 className="name">Hyrum HG Wolf</h1>
        <p className="tagline">Cosmist &amp; Christian</p>
      </header>

      <Constellation
        finePointer={finePointer}
        activeId={activeId}
        onOpen={openStar}
        onBackgroundClick={closePanel}
      />

      <CometTrail finePointer={finePointer} reducedMotion={reducedMotion} />

      <div className={"hint" + (hintGone ? " is-gone" : "")} aria-hidden="true">
        Brighter stars hold stories — click one
      </div>

      <Panel
        content={activeContent}
        reducedMotion={reducedMotion}
        onClose={closePanel}
      />

      <Footer />
    </>
  );
}
