import { useState } from "react";

import {
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconDownload,
  IconInfo,
  IconSparkle,
  IconWarningTriangle,
} from "../leland";

import { BlockRenderer } from "./BlockRenderer";
import { H3_CLASS, Prose } from "./Prose";

import type {
  AccordionBlock as AccordionBlockType,
  Block,
  CalloutBlock as CalloutBlockType,
  CodeBlock as CodeBlockType,
  DividerBlock as DividerBlockType,
  DownloadBlock as DownloadBlockType,
  EmbedBlock as EmbedBlockType,
  HtmlBlock as HtmlBlockType,
  ImageBlock as ImageBlockType,
  TableBlock as TableBlockType,
  VideoBlock as VideoBlockType,
} from "../../data/lessonBlocks";

const isTextBlock = (block: Block) => block.kind === "markdown";

// Every background here is a named design-system token — never a raw hex
// value. "gray" is the default (see CalloutBlock.tone); "warning" is the one
// deliberate exception to the blue/beige/gray default set.
const CALLOUT_TONES = {
  blue: {
    Icon: IconSparkle,
    container: "bg-leland-blue-light",
    icon: "text-leland-blue-dark",
  },
  beige: {
    Icon: IconSparkle,
    container: "bg-leland-beige",
    icon: "text-leland-gray-light",
  },
  gray: {
    Icon: IconInfo,
    container: "bg-leland-gray-hover",
    icon: "text-leland-gray-light",
  },
  warning: {
    Icon: IconWarningTriangle,
    container: "bg-leland-orange-light",
    icon: "text-leland-orange-dark",
  },
} as const;

export function CalloutBlock({ block }: { block: CalloutBlockType }) {
  const tone = CALLOUT_TONES[block.tone ?? "gray"];
  const Icon = tone.Icon;
  return (
    <div className={`flex gap-3 rounded-xl px-6 py-6 md:py-8 ${tone.container}`}>
      {block.showIcon !== false ? <Icon className={`size-5 shrink-0 ${tone.icon}`} /> : null}
      <div className="flex min-w-0 flex-col gap-4">
        {block.title ? (
          <p className="leland-heading-lg font-semibold text-leland-gray-dark">
            {block.title}
          </p>
        ) : null}
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
            className="gap-1 text-center leland-paragraph-sm text-leland-gray-light"
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
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-full gap-x-8"
        style={{ gridTemplateColumns: `repeat(${block.headers.length}, minmax(120px, 1fr))` }}
      >
        {block.headers.map((header, i) => (
          <div key={`h-${i}`} className="pb-4 leland-paragraph-base text-leland-gray-light md:leland-paragraph-lg">
            {header}
          </div>
        ))}
        {block.rows.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`py-3 leland-paragraph-base text-leland-gray-dark md:leland-paragraph-lg ${
                rowIndex < block.rows.length - 1 ? "border-b border-leland-gray-stroke" : ""
              }`}
            >
              {cell}
            </div>
          )),
        )}
      </div>
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
      <div className="flex items-center justify-between gap-3 border-b border-leland-gray-stroke bg-white px-4 py-2">
        <span className="truncate font-mono text-[12px] text-leland-gray-light">
          {block.filename ?? block.language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex shrink-0 items-center gap-1.5 rounded px-1.5 py-1 text-[12px] font-medium text-leland-gray-light hover:bg-leland-gray-hover hover:text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          {copied ? <IconCheck className="size-3.5" /> : <IconCopy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-white p-4">
        <code className="font-mono text-[13px] leading-relaxed text-leland-gray-dark">{block.code}</code>
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

// Escape hatch: bespoke markup that isn't worth a typed block yet.
export function HtmlBlock({ block }: { block: HtmlBlockType }) {
  return <div dangerouslySetInnerHTML={{ __html: block.html }} />;
}
