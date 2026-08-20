// Content-block schema for the native lesson "page" renderer.
//
// Lesson bodies are composed of typed blocks rendered natively in React (see
// src/components/lesson-blocks/), instead of the legacy per-section HTML iframe.
// Text blocks carry markdown strings — the eventual "markdown blocks" direction.

export type Markdown = string;

// ─── Content blocks ──────────────────────────────────────────────────────────

export type MarkdownBlock = {
  kind: "markdown";
  body: Markdown;
};

// Content allowed inside a callout: any block except another callout (no
// nesting) — text (including lists), images, video, code, downloads,
// banners, etc. H1-sized markdown headings are demoted to H2 size when
// rendered inside a callout; that "no H1" rule is a rendering rule, not
// something the type enforces.
export type CalloutBlock = {
  kind: "callout";
  tone?: "blue" | "tan";
  eyebrow?: string;
  title?: string;
  content: Exclude<Block, CalloutBlock>[];
};

// The one iframe block — for self-contained HTML animations/embeds. Unlike the
// legacy full-section iframe, this is a bounded, fixed-height element.
export type EmbedBlock = {
  kind: "embed";
  src: string;
  height?: number;
  title?: string;
};

export type ImageBlock = {
  kind: "image";
  src: string;
  alt?: string;
  caption?: Markdown;
};

// Inline video player (e.g. a session recording), sized to the content column
// rather than taking over the page.
export type VideoBlock = {
  kind: "video";
  src: string;
  poster?: string;
  title?: string;
};

export type DividerBlock = { kind: "divider" };

// Structured table (not markdown-table syntax) so headers/rows are reliable
// for machine generation and match the dedicated design (no outer card,
// muted header row, thin row dividers) rather than the generic markdown
// table styling.
export type TableBlock = {
  kind: "table";
  headers: string[];
  rows: string[][];
  // CSS grid track sizes per column, e.g. ["56px", "1fr", "1fr"]. When omitted,
  // all columns share equal width via minmax(120px, 1fr).
  columnWidths?: string[];
  // Bold the first column (row labels). Defaults to true — set to false when
  // the first column is a numeric index rather than a semantic label.
  firstColumnBold?: boolean;
};

// Matches the design system's tag color palette (see leland/Tag.tsx).
export type BannerColor = "gray" | "white" | "green" | "yellow" | "blue" | "red" | "beige" | "black";

// Compact single/two-line banner with an icon. Informational when no href;
// clickable (chevron shown as the affordance) when href is set.
export type BannerBlock = {
  kind: "banner";
  text: string;
  subtext?: string;
  href?: string;
  icon?: string; // any icon component name from the leland icon set, e.g. "IconInfo" (default)
  color?: BannerColor; // defaults to "gray"
};

// A wrapping row of tags from the design system's Tag component (leland/Tag.tsx).
// Standalone rather than inline in text — Tag is a chip, not something
// Markdown has a way to embed mid-sentence, and it matches how Tag is used
// elsewhere in the product (rows of chips, not inline in copy).
export type TagsBlock = {
  kind: "tags";
  tags: { text: string; color?: "white" | "gray" }[]; // color defaults to "gray"
};

// CTA card for a downloadable file (e.g. a PDF).
export type DownloadBlock = {
  kind: "download";
  label: string; // e.g. "Download PDF"
  fileSize?: string; // e.g. "246 KB" — shown next to the label
  filename?: string; // e.g. "session-1-slides.pdf" — shown as the subtitle line
  href: string;
};

// Syntax-highlighted-ready code snippet with a copy button. `language` drives
// the label shown in the header (no highlighting yet — see ContentBlocks.tsx).
export type CodeBlock = {
  kind: "code";
  code: string;
  language: string;
  filename?: string;
};

// One expandable row in an AccordionBlock (deep dives, FAQs). Each row toggles
// independently; only the currently open rows show their body.
export type AccordionRow = {
  title: string;
  body: Markdown;
};

export type AccordionBlock = {
  kind: "accordion";
  rows: AccordionRow[];
};

// Escape hatch for bespoke markup that isn't worth a typed block yet.
export type HtmlBlock = { kind: "html"; html: string };

// Numbered steps where each step can carry optional nested blocks (e.g. a
// copyable prompt as a CodeBlock). Renders the same circle-badge + dotted
// connector treatment as an ordered list in markdown, but lets content authors
// embed structured blocks — like a CodeBlock for a copyable prompt — below
// the step description. Use this instead of an ordered markdown list whenever
// any step has nested block content; use the markdown ordered list for simple
// text-only step sequences.
export type Step = {
  text: string; // inline markdown — no block-level syntax (headings, lists)
  blocks?: Block[]; // optional blocks rendered below the step text
};

export type StepsBlock = {
  kind: "steps";
  items: Step[];
};

// ─── Product / CTA blocks (page chrome around the lesson body) ────────────────

// Which state of the live-session callout to show (chosen via prototype menu).
export type LiveSessionVariant =
  | "addToCalendar"
  | "addedToCalendar"
  | "watchRecording"
  | "joinNow";

// Carries the content for the callout; the *variant* (state) is selected at
// runtime from the prototype menu, not from the block data.
export type LiveSessionBannerBlock = {
  kind: "liveSessionBanner";
  month: string; // e.g. "APR"
  day: string; // e.g. "21"
  time?: string; // e.g. "11:00 AM PT" — shown in the recording variant
  sessionTitle: string; // the session/lesson name, shown as the subtitle
  countdownLabel?: string; // e.g. "2 days" — shown in the countdown variant
  // Video URL used to generate a thumbnail preview in the "watchRecording" variant.
  recordingVideoSrc?: string;
};

export type Block =
  | MarkdownBlock
  | CalloutBlock
  | EmbedBlock
  | ImageBlock
  | VideoBlock
  | DividerBlock
  | HtmlBlock
  | AccordionBlock
  | CodeBlock
  | TableBlock
  | DownloadBlock
  | BannerBlock
  | TagsBlock
  | StepsBlock
  | LiveSessionBannerBlock;

// A section rendered as native blocks. Coexists with the legacy html/video/pdf
// sections (see the Section union in ContentViewer.tsx) — chosen per-section by
// `kind`, so block sections and iframe sections live in the same course.
export type BlockSection = {
  kind: "blocks";
  id: string;
  title: string;
  description?: string;
  durationMin?: number | null;
  // Session-level metadata shown as tags under the title (time, build count,
  // model). Same across a lesson's sections.
  meta?: {
    minsTotal?: number;
    builds?: number;
    model?: string;
  };
  blocks: Block[];
  track?: "claude" | "codex" | "gemini" | "copilot";
};
