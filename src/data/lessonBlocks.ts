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

// Compact single/two-line banner with an icon, a 44x44 image, or neither.
// Informational when no href; clickable (chevron shown as the affordance)
// when href is set.
export type BannerBlock = {
  kind: "banner";
  text: string;
  subtext?: string;
  href?: string;
  // Mutually exclusive with `image` — if both are set, `image` wins. Leave
  // both unset for no leading visual at all.
  icon?: string; // any icon component name from the leland icon set, e.g. "IconInfo" (default)
  image?: string; // a brand/logo component name from the leland brand set, e.g. "BrandSlack" — rendered at 44x44 instead of the 24px icon
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

// One expandable row in a ToggleBlock (deep dives, FAQs). Each row toggles
// independently; only the currently open rows show their body.
export type ToggleRow = {
  title: string;
  body: Markdown;
  icon?: boolean;
};

export type ToggleBlock = {
  kind: "toggle";
  rows: ToggleRow[];
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

export type SlackJoinBlock = {
  kind: "slackJoin";
  href: string;
  channel?: string;
};

// "Invite your team" call to action: sends the learner to the team dashboard's add-members flow
// (or to creating a team first, if they don't have one yet).
export type InviteTeamBlock = {
  kind: "inviteTeam";
  title?: string;
  description?: string;
  href?: string;
};

export type RadioCardOption = {
  value: string;
  label: string;
  subtext?: string;
  icon?: string;
};

export type RadioCardGroupBlock = {
  kind: "radioCardGroup";
  id: string;
  eyebrow?: string;
  question: string;
  subtext?: string;
  options: RadioCardOption[];
};

export type ToggleChipOption = {
  value: string;
  label: string;
};

export type ToggleChipGroupBlock = {
  kind: "toggleChipGroup";
  id: string;
  eyebrow?: string;
  question: string;
  subtext?: string;
  multiple?: boolean;
  options: ToggleChipOption[];
};

// One specific build a learner can walk through — a title plus the full
// step-by-step tutorial, embedded inline rather than linking out to the
// role-specific page it's adapted from.
export type RoleBuild = {
  id: string;
  buildTitle: string; // what they'll build, e.g. "Build a one-page account brief for any prospect"
  description?: string; // one-line card subtext
  tutorial: Block[];
};

// One role's set of suggested builds in a RoleBuildPickerBlock. The learner
// still picks which build to do — these are just scoped to their function,
// not auto-applied.
export type RoleBuildOption = {
  value: string;
  label: string; // role/department name, e.g. "Sales"
  builds: RoleBuild[]; // first is the one we recommend by default
  // PersonalizationData role codes (see PersonalizationModal.tsx) that this
  // build set is tailored for — lets the picker auto-surface a learner's
  // suggested builds from their onboarding answer instead of asking again.
  matchesRoles?: string[];
};

// Surfaces build options scoped to the learner's role (known from
// onboarding) — same exercise, different real-world output per function —
// but still lets them choose which one to do, or build something custom.
// Never asks a question up front: an unknown or unmatched role falls back to
// a generic set of builds.
export type RoleBuildPickerBlock = {
  kind: "roleBuildPicker";
  eyebrow?: string;
  options: RoleBuildOption[];
  fallback: RoleBuildOption; // shown when the role isn't on file or doesn't match any option
};

// One multiple-choice question in a PromptQuizBlock — a short prompt excerpt
// and which Goal/Context/Rules part it is.
export type QuizOption = {
  label: string;
  correct?: boolean;
};

export type QuizQuestion = {
  prompt: Markdown; // the excerpt/question text, inline markdown
  subtext?: string; // e.g. "Choose an answer to check it."
  options: QuizOption[];
};

// Inline "quick check" quiz embedded in a lesson page (not the full-page
// getting-started QuizEngine) — a few questions, answered one at a time,
// with a running correct count.
export type PromptQuizBlock = {
  kind: "promptQuiz";
  title: string;
  questions: QuizQuestion[];
};

// One card in a BuildsCarouselBlock — a build someone shipped, shown with a
// screenshot, a short description, and who made it.
export type BuildCarouselItem = {
  title: string;
  description: string;
  image: string; // imported asset path
  author: string;
  avatarInitials: string;
  avatarColor?: string; // any Tailwind bg-* class; defaults to a neutral gray
  // "resource" = an official Leland+ tutorial/skill card (lightbulb badge);
  // "community" = a build a real learner shipped (people badge).
  kind: "resource" | "community";
};

// Horizontal scrollable row of build cards — "See what others built" style,
// modeled on the Leland+ library and course-complete "shipped" carousels.
export type BuildsCarouselBlock = {
  kind: "buildsCarousel";
  title: string;
  items: BuildCarouselItem[];
};

// Renders a single bullet naming whichever build the learner picked in this
// lesson's RoleBuildPicker — read from localStorage at render time, since the
// picker's own selection state doesn't otherwise reach a later section.
export type SelectedBuildSummaryBlock = {
  kind: "selectedBuildSummary";
  fallbackText?: string; // shown if nothing was picked, e.g. the section was skipped
};

// Self-contained "share your build" submission form — upload, title,
// description, an optional live link, and a reflection question. Every field
// starts blank regardless of whether the learner followed a tutorial or
// built something custom, so the write-up is always in their own words.
export type ShareBuildFormBlock = {
  kind: "shareBuildForm";
};

export type Block =
  | MarkdownBlock
  | CalloutBlock
  | EmbedBlock
  | ImageBlock
  | VideoBlock
  | DividerBlock
  | HtmlBlock
  | ToggleBlock
  | CodeBlock
  | TableBlock
  | DownloadBlock
  | BannerBlock
  | TagsBlock
  | StepsBlock
  | SlackJoinBlock
  | InviteTeamBlock
  | LiveSessionBannerBlock
  | RadioCardGroupBlock
  | ToggleChipGroupBlock
  | RoleBuildPickerBlock
  | PromptQuizBlock
  | BuildsCarouselBlock
  | SelectedBuildSummaryBlock
  | ShareBuildFormBlock;

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
  // Small tag shown next to the section title — e.g. a muted "Practice" vs a
  // louder "Featured", to distinguish build types at a glance without
  // baking the label into the title text.
  label?: { text: string; color?: BannerColor };
  blocks: Block[];
  track?: "claude" | "codex" | "gemini" | "copilot";
};
