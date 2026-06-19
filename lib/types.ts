export type Section = "motivations" | "iic" | "background";
export type SizeTier = "largest" | "large" | "medium" | "small";

export interface StarContent {
  /** Unique key; also used as the panel/anchor id. */
  id: string;
  /** Which figure node (from lib/figure.ts) this story lives on. */
  node: string;
  /** Sets the star + accent color. */
  section: Section;
  /** Sets the star radius / brightness. */
  size: SizeTier;
  /** Headline + hover label. */
  name: string;
  /** Small role/category line under the title. */
  subtitle: string;
  /** Optional role/date/reference line. */
  meta?: string;
  /** Paragraph shown in the detail panel. */
  body: string;
  /** Optional outbound link. */
  link?: { text: string; url: string } | null;
  /** Other star ids whose connecting line should glow on hover. */
  connectsTo?: string[];
}

export interface SocialLink {
  platform: "x" | "linkedin" | "youtube" | "instagram" | "email";
  url: string;
}
