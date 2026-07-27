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

export type CalloutBlock = {
  kind: "callout";
  tone: "tip" | "warning" | "note";
  title?: string;
  body: Markdown;
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

export type ShareFeedbackBlock = { kind: "shareFeedback" };

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
  | LiveSessionBannerBlock
  | ShareFeedbackBlock
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
