import type { Block } from "../../data/lessonBlocks";

import {
  AccordionBlock,
  BannerBlock,
  CalloutBlock,
  CodeBlock,
  DividerBlock,
  DownloadBlock,
  EmbedBlock,
  HtmlBlock,
  ImageBlock,
  SlackJoinBlock,
  StepsBlock,
  TableBlock,
  TagsBlock,
  VideoBlock,
} from "./ContentBlocks";
import { Prose } from "./Prose";
import { LiveSessionBanner } from "./ProductBlocks";

export function BlockRenderer({ block, allowH1 = true }: { block: Block; allowH1?: boolean }) {
  switch (block.kind) {
    case "markdown":
      return <Prose body={block.body} allowH1={allowH1} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "embed":
      return <EmbedBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "divider":
      return <DividerBlock block={block} />;
    case "html":
      return <HtmlBlock block={block} />;
    case "accordion":
      return <AccordionBlock block={block} />;
    case "code":
      return <CodeBlock block={block} />;
    case "table":
      return <TableBlock block={block} />;
    case "download":
      return <DownloadBlock block={block} />;
    case "banner":
      return <BannerBlock block={block} />;
    case "tags":
      return <TagsBlock block={block} />;
    case "steps":
      return <StepsBlock block={block} />;
    case "slackJoin":
      return <SlackJoinBlock block={block} />;
    case "liveSessionBanner":
      return <LiveSessionBanner block={block} />;
    default: {
      // Exhaustiveness guard — a new block kind must be handled above.
      const _never: never = block;
      return _never;
    }
  }
}

export function BlockList({
  blocks,
  className = "flex flex-col gap-8",
  allowH1 = true,
}: {
  blocks: Block[];
  className?: string;
  allowH1?: boolean;
}) {
  return (
    <div className={className}>
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} allowH1={allowH1} />
      ))}
    </div>
  );
}
