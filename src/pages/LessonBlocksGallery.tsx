// Reference sheet for the course lesson content-block system (src/data/lessonBlocks.ts
// + src/components/lesson-blocks/). Mirrors the pattern of LelandKitTest.tsx — one
// section per block kind, rendered through the real BlockList/BlockRenderer so this
// always reflects production output, not a reimplementation. Grows alongside each
// new block kind as it's built.
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "../components/Button";
import { BlockList, LessonPageProvider } from "../components/lesson-blocks";
import type { Block } from "../data/lessonBlocks";
import coverImage from "../assets/img/cover-images/cover-image-2.png";

const SAMPLE_VIDEO_SRC = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const ANIMATION_SRC = `data:text/html;charset=utf-8,${encodeURIComponent(
  `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;height:100%;display:grid;place-items:center;font-family:system-ui,-apple-system,sans-serif;background:#faf9f6}
.card{padding:24px 36px;border-radius:16px;color:#222;font-weight:600;font-size:18px;text-align:center;background:linear-gradient(120deg,#FFD96F,#80ACED,#FFD96F);background-size:200% 200%;animation:g 6s ease infinite}
@keyframes g{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
</style></head><body><div class="card">Embedded content</div></body></html>`,
)}`;

const HEADINGS_AND_TEXT: Block[] = [
  {
    kind: "markdown",
    body: [
      "# Heading 1",
      "",
      "This is a paragraph of standard body text. It uses **bold** and `inline code` — the only two inline styles this system supports; no italics, no underline. It also carries a [text link](https://www.leland.com) styled with a dotted underline.",
      "",
      "## Heading 2",
      "",
      "More body text under a second-level heading.",
      "",
      "### Heading 3",
      "",
      "Body text under a third-level heading.",
    ].join("\n"),
  },
];

const UNORDERED_LIST: Block[] = [
  {
    kind: "markdown",
    body: [
      "- First bullet point",
      "- Second bullet point, a little longer to see how wrapping looks",
      "- Third bullet point",
    ].join("\n"),
  },
];

const ORDERED_LIST: Block[] = [
  {
    kind: "markdown",
    body: [
      "1. Open the starter project and install dependencies.",
      "2. Read through the prompt template before making changes — it explains the constraints the model is working under.",
      "3. Make your first edit and confirm the build still passes.",
      "4. Share your result in the group channel.",
    ].join("\n"),
  },
];

// Trimmed to the examples that actually show off what makes Callout distinct
// from Banner — holding multiple/richer content blocks. A short one-liner
// with a title is better demonstrated as a Banner (see BANNER below).
const CALLOUTS: Block[] = [
  {
    kind: "callout",
    tone: "blue",
    title: "Callouts can hold more than text",
    content: [
      {
        kind: "markdown",
        body: "Callouts can contain any text (including lists) plus images or video:\n\n- Lists work fine\n- So do images below",
      },
      { kind: "image", src: coverImage, alt: "Sample image inside a callout" },
    ],
  },
  {
    kind: "callout",
    tone: "tan",
    title: "Almost any block can go inside",
    content: [
      { kind: "markdown", body: "Text, a code snippet, a download, and a banner can all sit in one callout:" },
      {
        kind: "code",
        language: "javascript",
        filename: "example.js",
        code: ["const greeting = \"Hello, world!\";", "console.log(greeting);"].join("\n"),
      },
      { kind: "download", label: "Download PDF", fileSize: "246 KB", filename: "session-1-slides.pdf", href: "#" },
      { kind: "banner", text: "Nested banners work too", subtext: "Just not nested callouts", color: "white" },
    ],
  },
];

const IMAGE: Block[] = [
  { kind: "image", src: coverImage, alt: "Sample cover image", caption: "An optional caption, rendered as centered small text." },
];

const VIDEO: Block[] = [{ kind: "video", src: SAMPLE_VIDEO_SRC, title: "Sample video" }];

const CODE: Block[] = [
  {
    kind: "code",
    language: "javascript",
    filename: "greet.js",
    code: ["function greet(name) {", "  return `Hello, ${name}!`;", "}", "", "greet(\"world\");"].join("\n"),
  },
];

const TABLE: Block[] = [
  {
    kind: "table",
    headers: ["Header row", "Header row", "Header row"],
    rows: [
      ["Table data", "Table data", "Table data"],
      ["Table data", "Table data", "Table data"],
      ["Table data", "Table data", "Table data"],
    ],
  },
];

const DOWNLOAD: Block[] = [
  { kind: "download", label: "Download PDF", fileSize: "246 KB", filename: "session-1-slides.pdf", href: "#" },
];

const BANNER: Block[] = [
  { kind: "banner", text: "This is a small banner", subtext: "Optionally, banner subtext will appear here" },
  {
    kind: "banner",
    text: "This banner links somewhere",
    subtext: "The chevron shows it's clickable",
    href: "#",
  },
  { kind: "banner", text: "A colored, icon-customized banner", icon: "IconSparkle", color: "blue", href: "#" },
];

const TAGS: Block[] = [
  {
    kind: "tags",
    tags: [
      { text: "Beginner friendly" },
      { text: "45 minutes" },
      { text: "No coding required", color: "white" },
      { text: "Claude" },
      { text: "Cowork" },
    ],
  },
];

const EMBED: Block[] = [{ kind: "embed", src: ANIMATION_SRC, height: 160, title: "Sample embed" }];

const DIVIDER: Block[] = [
  { kind: "markdown", body: "Content above the divider." },
  { kind: "divider" },
  { kind: "markdown", body: "Content below the divider." },
];

const TOGGLE: Block[] = [
  {
    kind: "toggle",
    rows: [
      {
        title: "The four modes of working with AI",
        body: "Most people think of AI as a writing tool: you ask, it produces. That's one mode. Depending on how you frame the request, AI can play entirely different roles, and each gives you a different kind of result.",
      },
      {
        title: "Comparing AI ecosystems",
        body: "A short comparison of the major AI ecosystems and where each one fits.",
      },
      {
        title: "When to use each mode",
        body: "A quick reference for picking the right mode for the task in front of you.",
      },
    ],
  },
];


const LIVE_SESSION: Block[] = [
  {
    kind: "liveSessionBanner",
    month: "APR",
    day: "21",
    sessionTitle: "Live session · Build 1",
    countdownLabel: "2 days",
  },
];

const LESSON_PAGE_STUB_ACTIONS = {
  onShareFeedback: () => {},
  onOpenCalendar: () => {},
  onViewRecording: () => {},
  liveSessionVariant: "addToCalendar" as const,
  liveProgram: true,
};

function GallerySection({ title, blocks }: { title: string; blocks: Block[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="leland-eyebrow text-leland-gray-extra-light">{title}</h2>
      <div className="flex flex-col gap-8 rounded-xl border border-leland-gray-stroke bg-leland-page-bg p-6">
        <BlockList blocks={blocks} />
      </div>
    </section>
  );
}

function GalleryContent() {
  return (
    <LessonPageProvider actions={LESSON_PAGE_STUB_ACTIONS}>
      <GallerySection title="Live session banner" blocks={LIVE_SESSION} />
      <GallerySection title="Headings & paragraph text" blocks={HEADINGS_AND_TEXT} />
      <GallerySection title="Unordered list" blocks={UNORDERED_LIST} />
      <GallerySection title="Ordered list" blocks={ORDERED_LIST} />
      <GallerySection title="Text callout block" blocks={CALLOUTS} />
      <GallerySection title="Image" blocks={IMAGE} />
      <GallerySection title="Video" blocks={VIDEO} />
      <GallerySection title="Code block" blocks={CODE} />
      <GallerySection title="Table" blocks={TABLE} />
      <GallerySection title="Download" blocks={DOWNLOAD} />
      <GallerySection title="Banner" blocks={BANNER} />
      <GallerySection title="Tags" blocks={TAGS} />
      <GallerySection title="Embed" blocks={EMBED} />
      <GallerySection title="Divider" blocks={DIVIDER} />
      <GallerySection title="Expandable / toggle" blocks={TOGGLE} />
    </LessonPageProvider>
  );
}

// Mobile mode renders through an actual iframe (a real 393px-wide viewport)
// rather than just narrowing a <div> — the block styles use `md:` media
// queries, which key off the real viewport width and don't care how narrow a
// parent container is, so a narrowed div alone never triggers them.
const MOBILE_FRAME_WIDTH = 393;
const MOBILE_FRAME_HEIGHT = 813;

export default function LessonBlocksGallery() {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  useEffect(() => {
    document.title = "Lesson Blocks Gallery";
  }, []);

  if (embed) {
    return (
      <div className="flex w-full flex-col gap-10 bg-white px-4 py-8 md:px-8">
        <GalleryContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-leland-gray-hover py-10">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-6 px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="leland-heading-2xl font-semibold text-leland-gray-dark">Lesson Blocks Gallery</h1>
            <p className="leland-paragraph-base text-leland-gray-light">
              Every content-block kind, rendered through the real lesson renderer.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-leland-gray-stroke bg-white p-1">
            <Button
              size="sm"
              variant={viewport === "desktop" ? "dark" : "white"}
              onClick={() => setViewport("desktop")}
            >
              Desktop
            </Button>
            <Button size="sm" variant={viewport === "mobile" ? "dark" : "white"} onClick={() => setViewport("mobile")}>
              Mobile
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          {viewport === "mobile" ? (
            <div
              className="overflow-hidden rounded-[32px] border-[10px] border-leland-gray-dark shadow-lg"
              style={{ width: MOBILE_FRAME_WIDTH, height: MOBILE_FRAME_HEIGHT }}
            >
              <iframe
                src="/components/lesson-blocks?embed=1"
                title="Mobile preview"
                className="block h-full w-full border-0 bg-white"
              />
            </div>
          ) : (
            <div className="flex w-full max-w-[800px] flex-col gap-10 rounded-xl border border-leland-gray-stroke bg-white px-4 py-8 md:px-8">
              <GalleryContent />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
