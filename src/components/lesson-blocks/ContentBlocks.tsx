import { useState } from "react";
import { Link } from "react-router-dom";

import {
  BrandSlack,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCopy,
  IconDownload,
  IconInfo,
  Tag,
  TagColor,
} from "../leland";
import * as LelandIcons from "../leland/svg/icons";

import { BlockRenderer } from "./BlockRenderer";
import { H3_CLASS, Prose } from "./Prose";

import type {
  AccordionBlock as AccordionBlockType,
  BannerBlock as BannerBlockType,
  BannerColor,
  Block,
  CalloutBlock as CalloutBlockType,
  CodeBlock as CodeBlockType,
  DividerBlock as DividerBlockType,
  DownloadBlock as DownloadBlockType,
  EmbedBlock as EmbedBlockType,
  HtmlBlock as HtmlBlockType,
  ImageBlock as ImageBlockType,
  RadioCardGroupBlock as RadioCardGroupBlockType,
  SlackJoinBlock as SlackJoinBlockType,
  StepsBlock as StepsBlockType,
  TableBlock as TableBlockType,
  TagsBlock as TagsBlockType,
  ToggleChipGroupBlock as ToggleChipGroupBlockType,
  VideoBlock as VideoBlockType,
} from "../../data/lessonBlocks";

const isTextBlock = (block: Block) => block.kind === "markdown";

const CALLOUT_TONES = {
  blue: { container: "bg-leland-blue-light", eyebrow: "text-leland-blue-dark" },
  tan:  { container: "bg-leland-tan-light",  eyebrow: "text-leland-tan-dark"  },
} as const;

export function CalloutBlock({ block }: { block: CalloutBlockType }) {
  const tone = CALLOUT_TONES[block.tone ?? "blue"];
  return (
    <div className={`rounded-xl px-6 py-6 md:py-8 ${tone.container}`}>
      <div className="flex min-w-0 flex-col gap-4">
        {block.eyebrow ? (
          <p className={`leland-eyebrow font-semibold uppercase tracking-widest ${tone.eyebrow}`}>
            {block.eyebrow}
          </p>
        ) : null}
        {block.title ? <h3 className={H3_CLASS}>{block.title}</h3> : null}
        <div className="flex flex-col">
          {block.content.map((item, i) => {
            // Consecutive text blocks get normal paragraph spacing (16px); a
            // gap touching any non-text block (image, video, list, etc.) gets
            // more room (24px) to read as a distinct element.
            const spacing =
              i === 0 ? "" : isTextBlock(item) && isTextBlock(block.content[i - 1]) ? "mt-4" : "mt-6";
            return (
              <div key={i} className={spacing}>
                <BlockRenderer block={item} allowH1={false} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Backgrounds/icon tints match the design system's tag colors (leland/Tag.tsx)
// exactly, so a banner's color always resolves to a real token, never a raw
// hex value. Heading/subtext text stay the fixed gray-dark/#222-80% treatment
// on every color except "black", which needs light text to stay legible.
const BANNER_COLORS: Record<BannerColor, { container: string; icon: string; text?: string }> = {
  gray: { container: "bg-leland-gray-hover", icon: "text-leland-gray-dark" },
  white: { container: "bg-white border border-leland-gray-stroke", icon: "text-leland-gray-dark" },
  green: { container: "bg-leland-success-extra-light", icon: "text-leland-dark-green" },
  yellow: { container: "bg-leland-primary-extra-light", icon: "text-leland-yellow-dark" },
  blue: { container: "bg-leland-blue-light", icon: "text-leland-blue-dark" },
  red: { container: "bg-leland-red-light", icon: "text-leland-red-dark" },
  beige: { container: "bg-leland-tan-light", icon: "text-leland-tan-dark" },
  black: { container: "bg-leland-black", icon: "text-leland-white", text: "text-leland-white" },
};

export function BannerBlock({ block }: { block: BannerBlockType }) {
  const color = BANNER_COLORS[block.color ?? "gray"];
  const Icon = (LelandIcons as Record<string, typeof IconInfo>)[block.icon ?? "IconInfo"] ?? IconInfo;
  const headingClass = `leland-paragraph-lg font-semibold! ${color.text ?? "text-leland-gray-dark"}`;
  const subtextClass = `leland-paragraph-base ${color.text ?? "text-[#222222]/80"}`;

  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-start gap-3">
        <Icon className={`size-6 shrink-0 ${color.icon}`} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={headingClass}>{block.text}</span>
          {block.subtext ? <span className={subtextClass}>{block.subtext}</span> : null}
        </span>
      </span>
      {block.href ? <IconChevronRight className={`size-6 shrink-0 ${color.icon}`} /> : null}
    </>
  );

  const sharedClass = `flex items-center gap-6 rounded-xl px-6 py-5 transition-colors hover:brightness-95 ${color.container}`;
  if (!block.href) return <div className={`flex items-center gap-6 rounded-xl px-6 py-5 ${color.container}`}>{content}</div>;
  if (block.href.startsWith("http")) return <a href={block.href} target="_blank" rel="noreferrer" className={sharedClass}>{content}</a>;
  return <Link to={block.href} className={sharedClass}>{content}</Link>;
}

export function EmbedBlock({ block }: { block: EmbedBlockType }) {
  return (
    <div className="overflow-hidden rounded-xl border border-leland-gray-stroke">
      <iframe
        src={block.src}
        title={block.title ?? "Embedded content"}
        className="block w-full border-0"
        style={{ height: block.height ?? 480 }}
        loading="lazy"
      />
    </div>
  );
}

export function ImageBlock({ block }: { block: ImageBlockType }) {
  return (
    <figure className="flex flex-col gap-2">
      <img
        src={block.src}
        alt={block.alt ?? ""}
        className="w-full rounded-xl border border-leland-gray-stroke object-cover"
      />
      {block.caption ? (
        <figcaption>
          <Prose
            body={block.caption}
            className="gap-1 leland-paragraph-sm text-leland-gray-light"
          />
        </figcaption>
      ) : null}
    </figure>
  );
}

export function VideoBlock({ block }: { block: VideoBlockType }) {
  return (
    <video
      src={block.src}
      poster={block.poster}
      title={block.title}
      controls
      className="aspect-video w-full rounded-xl border border-leland-gray-stroke bg-black"
    />
  );
}

export function DividerBlock(_: { block: DividerBlockType }) {
  return <hr className="border-leland-gray-stroke" />;
}

// Structured table: no outer card, muted header row, thin dividers between
// body rows only (no divider after the header, none after the last row).
export function TableBlock({ block }: { block: TableBlockType }) {
  const columns = block.columnWidths
    ? block.columnWidths.map(w => `minmax(min-content, ${w})`).join(" ")
    : `repeat(${block.headers.length}, minmax(min-content, 1fr))`;
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-full overflow-hidden rounded-xl border border-leland-gray-stroke"
        style={{ gridTemplateColumns: columns }}
      >
        {block.headers.map((header, i) => (
          <div
            key={`h-${i}`}
            className={`bg-leland-gray-hover px-3 py-3 leland-paragraph-base text-leland-gray-light ${
              i > 0 ? "border-l border-leland-gray-stroke" : ""
            }`}
          >
            {header}
          </div>
        ))}
        {block.rows.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`border-t border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark ${
                colIndex > 0 ? "border-l border-leland-gray-stroke" : ""
              } ${colIndex === 0 && block.firstColumnBold !== false ? "font-semibold" : ""}`}
            >
              {cell}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

const TAG_COLORS: Record<NonNullable<TagsBlockType["tags"][number]["color"]>, TagColor> = {
  white: TagColor.WHITE,
  gray: TagColor.GRAY,
};

// A wrapping row of the design system's real Tag component — not inline in
// text, since Tag is a chip and Markdown has no way to embed one mid-sentence.
export function TagsBlock({ block }: { block: TagsBlockType }) {
  return (
    <div className="flex flex-wrap gap-2">
      {block.tags.map((tag, i) => (
        <Tag key={i} text={tag.text} tagColor={TAG_COLORS[tag.color ?? "gray"]} />
      ))}
    </div>
  );
}

export function DownloadBlock({ block }: { block: DownloadBlockType }) {
  return (
    <a
      href={block.href}
      download
      className="flex items-center justify-between gap-4 rounded-xl border border-leland-gray-stroke bg-white p-6 hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <p className="leland-paragraph-lg text-leland-gray-dark">
          <span className="font-semibold">{block.label}</span>
          {block.fileSize ? <span className="text-leland-gray-light"> · {block.fileSize}</span> : null}
        </p>
        {block.filename ? (
          <p className="leland-paragraph-base text-leland-gray-light">{block.filename}</p>
        ) : null}
      </div>
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-leland-gray-hover">
        <IconDownload className="size-5 text-leland-gray-dark" />
      </span>
    </a>
  );
}

export function CodeBlock({ block }: { block: CodeBlockType }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(block.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-leland-gray-stroke">
      <div className="flex items-center justify-between gap-3 bg-white py-4 pl-6 pr-4">
        <span className="truncate leland-heading-base text-leland-gray-extra-light">
          {block.filename ?? block.language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex shrink-0 items-center justify-center rounded-lg p-2.5 text-leland-gray-light hover:bg-leland-gray-hover hover:text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          {copied ? <IconCheck className="size-5" /> : <IconCopy className="size-5" />}
        </button>
      </div>
      <pre className={`bg-white px-6 pb-6 pt-0 ${block.language === "prompt" ? "whitespace-pre-wrap break-words" : "overflow-x-auto"}`}>
        <code className="font-mono leland-paragraph-base text-leland-gray-dark">{block.code}</code>
      </pre>
    </div>
  );
}

// Expandable rows for optional deep dives or FAQs. Built on native
// <details>/<summary> so each row toggles independently with no extra state
// and gets built-in keyboard/accessibility support.
export function AccordionBlock({ block }: { block: AccordionBlockType }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-leland-beige">
      {block.rows.map((row, i) => (
        <details key={i} className={`group px-6 py-2 ${i > 0 ? "border-t-[1.5px] border-white" : ""}`}>
          <summary className="flex cursor-pointer list-none items-center gap-2 py-4 [&::-webkit-details-marker]:hidden">
            <span className={`flex-1 ${H3_CLASS}`}>{row.title}</span>
            <span className="flex shrink-0 items-center justify-center rounded-lg bg-leland-gray-hover p-2.5">
              <IconChevronDown className="size-3.5 text-leland-gray-dark transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <div className="pb-4">
            <Prose body={row.body} className="gap-2" />
          </div>
        </details>
      ))}
    </div>
  );
}

// Numbered steps with optional nested blocks per step. Matches the ordered-list
// circle-badge treatment from Prose.tsx but allows embedding structured blocks
// (e.g. a copyable CodeBlock for a prompt) below each step's description.
export function StepsBlock({ block }: { block: StepsBlockType }) {
  return (
    <ol className="flex flex-col text-leland-gray-dark">
      {block.items.map((step, i) => (
        <li key={i} className="group grid grid-cols-[24px_1fr] gap-x-4">
          <div className="flex flex-col items-center">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-leland-gray-extra-light bg-white text-[13px] font-semibold text-leland-gray-dark">
              {i + 1}
            </span>
            <span className="w-0 flex-1 border-l-2 border-dotted border-leland-gray-extra-light group-last:hidden" />
          </div>
          <div className="flex min-w-0 flex-col gap-3 pb-4 group-last:pb-0">
            <Prose body={step.text} allowH1={false} />
            {step.blocks?.length ? (
              <div className="flex flex-col gap-3">
                {step.blocks.map((b, j) => (
                  <BlockRenderer key={j} block={b} allowH1={false} />
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function SlackJoinBlock({ block }: { block: SlackJoinBlockType }) {
  return (
    <a
      href={block.href}
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center gap-3 rounded-lg border border-leland-gray-stroke bg-white p-4 hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-leland-gray-stroke bg-white">
        <BrandSlack className="size-7" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="leland-heading-base font-semibold text-leland-gray-dark">
          {block.channel ?? "Join the Slack community"}
        </p>
        <p className="leland-paragraph-base text-leland-gray-extra-light">Leland AI Builders</p>
      </div>
      <span className="shrink-0 rounded-lg bg-leland-gray-dark px-4 py-3 leland-heading-base font-semibold text-white">
        Join →
      </span>
    </a>
  );
}

function QuestionHeader({ eyebrow, question, subtext }: { eyebrow?: string; question: string; subtext?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {eyebrow ? (
        <span className="leland-subtext-sm font-semibold uppercase tracking-[1.3px] text-leland-gray-extra-light">
          {eyebrow}
        </span>
      ) : null}
      <p className="leland-heading-xl font-semibold text-leland-gray-dark">{question}</p>
      {subtext ? (
        <p className="leland-paragraph-base text-leland-gray-light">{subtext}</p>
      ) : null}
    </div>
  );
}

export function RadioCardGroup({ block }: { block: RadioCardGroupBlockType }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <QuestionHeader eyebrow={block.eyebrow} question={block.question} subtext={block.subtext} />
      <div className="flex flex-col gap-3">
        {block.options.map((opt) => {
          const isSelected = selected === opt.value;
          const Icon = opt.icon
            ? (LelandIcons as Record<string, typeof IconInfo>)[opt.icon] ?? null
            : null;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(isSelected ? null : opt.value)}
              className={`flex w-full items-center gap-3 rounded-lg border-2 p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                isSelected
                  ? "border-leland-gray-dark bg-white"
                  : "border-leland-gray-stroke bg-white hover:bg-leland-gray-hover"
              }`}
            >
              {Icon ? (
                <div className="flex shrink-0 items-center justify-center rounded-[4px] bg-leland-gray-hover p-2.5">
                  <Icon className="size-6" />
                </div>
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="leland-paragraph-lg font-semibold text-leland-gray-dark">{opt.label}</span>
                {opt.subtext ? (
                  <span className="leland-paragraph-base text-leland-gray-light">{opt.subtext}</span>
                ) : null}
              </div>
              <div
                className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-leland-gray-dark" : "border-leland-gray-stroke"}`}
              >
                {isSelected ? <div className="size-2 rounded-full bg-leland-gray-dark" /> : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ToggleChipGroup({ block }: { block: ToggleChipGroupBlockType }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (value: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (block.multiple === false) {
        next.clear();
        if (!prev.has(value)) next.add(value);
      } else {
        if (next.has(value)) next.delete(value);
        else next.add(value);
      }
      return next;
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <QuestionHeader eyebrow={block.eyebrow} question={block.question} subtext={block.subtext} />
      <div className="flex flex-wrap gap-2">
        {block.options.map((opt) => {
          const isSelected = selected.has(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`rounded-full border-2 px-4 py-3 leland-heading-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                isSelected
                  ? "border-leland-gray-dark bg-leland-gray-hover text-leland-gray-dark"
                  : "border-transparent bg-leland-gray-hover text-leland-gray-dark hover:border-leland-gray-stroke"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HtmlBlock({ block }: { block: HtmlBlockType }) {
  return <div dangerouslySetInnerHTML={{ __html: block.html }} />;
}
