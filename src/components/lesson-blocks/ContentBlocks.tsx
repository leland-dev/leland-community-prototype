import { IconInfo, IconSparkle, IconWarningTriangle } from "../leland";

import { Prose } from "./Prose";

import type {
  CalloutBlock as CalloutBlockType,
  DividerBlock as DividerBlockType,
  EmbedBlock as EmbedBlockType,
  HtmlBlock as HtmlBlockType,
  ImageBlock as ImageBlockType,
  VideoBlock as VideoBlockType,
} from "../../data/lessonBlocks";

const CALLOUT_TONES = {
  tip: {
    Icon: IconSparkle,
    container: "bg-leland-blue-light",
    icon: "text-leland-blue-dark",
  },
  warning: {
    Icon: IconWarningTriangle,
    container: "bg-leland-orange-light",
    icon: "text-leland-orange-dark",
  },
  note: {
    Icon: IconInfo,
    container: "bg-leland-gray-hover",
    icon: "text-leland-gray-light",
  },
} as const;

export function CalloutBlock({ block }: { block: CalloutBlockType }) {
  const tone = CALLOUT_TONES[block.tone];
  const Icon = tone.Icon;
  return (
    <div className={`flex gap-3 rounded-xl p-4 ${tone.container}`}>
      <Icon className={`mt-0.5 size-5 shrink-0 ${tone.icon}`} />
      <div className="flex min-w-0 flex-col gap-1">
        {block.title ? (
          <p className="leland-heading-lg font-semibold text-leland-gray-dark">
            {block.title}
          </p>
        ) : null}
        <Prose body={block.body} className="gap-2" />
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

// Escape hatch: bespoke markup that isn't worth a typed block yet.
export function HtmlBlock({ block }: { block: HtmlBlockType }) {
  return <div dangerouslySetInnerHTML={{ __html: block.html }} />;
}
