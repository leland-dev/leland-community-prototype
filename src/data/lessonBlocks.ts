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

// Content allowed inside a callout: text (including lists), images, and
// video — anything except an H1. H1-sized markdown headings are demoted to
// H2 size when rendered inside a callout, so this is a rendering rule rather
// than something enforced by the type.
export type CalloutBlock = {
  kind: "callout";
  // Named colors from the design system only — never a raw hex value.
  // Defaults to "gray" when omitted; "blue" and "beige" are explicit
  // alternate choices; "warning" (orange) is reserved for actual warnings.
  tone?: "blue" | "beige" | "gray" | "warning";
  title?: string;
  content: Block[];
  // Defaults to true. Icons read well on short, banner-style callouts; for
  // larger callouts with a lot of text/image content, skipping the icon
  // usually looks better.
  showIcon?: boolean;
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

export type CtaBlock = {
  kind: "cta";
  label: string;
  sublabel?: string;
  tone?: "primary" | "neutral";
  icon?: "calendar" | "arrow" | "book" | "help" | "megaphone";
  href?: string;
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
  | LiveSessionBannerBlock
  | CtaBlock;

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
};
