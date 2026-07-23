import type { Block } from "../../data/lessonBlocks";

import {
  CalloutBlock,
  DividerBlock,
  EmbedBlock,
  HtmlBlock,
  ImageBlock,
  VideoBlock,
} from "./ContentBlocks";
import { Prose } from "./Prose";
import { Cta, LiveSessionBanner, ShareFeedback } from "./ProductBlocks";

function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "markdown":
      return <Prose body={block.body} />;
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
    case "liveSessionBanner":
      return <LiveSessionBanner block={block} />;
    case "shareFeedback":
      return <ShareFeedback />;
    case "cta":
      return <Cta block={block} />;
    default: {
      // Exhaustiveness guard — a new block kind must be handled above.
      const _never: never = block;
      return _never;
    }
  }
}

export function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}
