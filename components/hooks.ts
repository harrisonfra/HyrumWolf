"use client";

import { useEffect, useState } from "react";

/** True when the OS asks for reduced motion (override with ?motion in the URL). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const forced =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("motion");
    if (forced) {
      setReduced(false);
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True for hover-capable, fine pointers (mouse) — false for touch. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

/** Window size, tracked on resize (debounced). 0×0 until mounted. */
export function useWindowSize(): { w: number; h: number } {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(update, 150);
    };
    update();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return size;
}
