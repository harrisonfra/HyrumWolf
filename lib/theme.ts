import type { Section, SizeTier } from "./types";

/** Per-section star color + glow gradient id + hover-label color. */
export const SECTION: Record<
  Section,
  { core: string; glow: string; label: string }
> = {
  motivations: { core: "#f3dda6", glow: "url(#glow-gold)", label: "#ecd9a4" },
  iic: { core: "#dcebff", glow: "url(#glow-blue)", label: "#bcd6ff" },
  background: { core: "#eef3fb", glow: "url(#glow-silver)", label: "#dde6f2" },
};

/** Interactive-star core radius by size tier. */
export const SIZE_R: Record<SizeTier, number> = {
  largest: 7,
  large: 5.5,
  medium: 4.3,
  small: 3.4,
};
