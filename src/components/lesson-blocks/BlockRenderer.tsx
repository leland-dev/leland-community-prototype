import type { Block } from "../../data/lessonBlocks";

import {
  BannerBlock,
  CalloutBlock,
  CodeBlock,
  DividerBlock,
  DownloadBlock,
  EmbedBlock,
  HtmlBlock,
  ImageBlock,
  RadioCardGroup,
  SlackJoinBlock,
  StepsBlock,
  TableBlock,
  TagsBlock,
  ToggleBlock,
  ToggleChipGroup,
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
    case "toggle":
      return <ToggleBlock block={block} />;
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
    case "radioCardGroup":
      return <RadioCardGroup block={block} />;
    case "toggleChipGroup":
      return <ToggleChipGroup block={block} />;
    case "liveSessionBanner":
      return <LiveSessionBanner block={block} />;
    default: {
      // Exhaustiveness guard — a new block kind must be handled above.
      const _never: never = block;
      return _never;
    }
  }
}

const isTextBlock = (block: Block) => block.kind === "markdown";

export function BlockList({
  blocks,
  className = "flex flex-col",
  allowH1 = true,
}: {
  blocks: Block[];
  className?: string;
  allowH1?: boolean;
}) {
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        // Consecutive text blocks read as one flow of prose (16px); a gap
        // touching any non-text block (image, callout, toggle, etc.) gets
        // full separation (32px) so it reads as a distinct element.
        const spacing =
          i === 0 ? "" : isTextBlock(block) && isTextBlock(blocks[i - 1]) ? "mt-4" : "mt-8";
        return (
          <div key={i} className={spacing}>
            <BlockRenderer block={block} allowH1={allowH1} />
          </div>
        );
      })}
    </div>
  );
}
