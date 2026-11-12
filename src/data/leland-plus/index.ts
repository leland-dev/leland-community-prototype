import type { Block, CalloutBlock, Step, ToggleRow } from "../lessonBlocks";

type LelandBlock = { type: string; [key: string]: unknown };

type LelandSection = {
  type: "section";
  id: string;
  title?: string;
  subtitle?: string;
  children: LelandBlock[];
};

type LelandPlusEntryFile = {
  id: string;
  title: string;
  resourceType: "TUTORIAL" | "SKILL";
  description: string;
  link: string;
  viewableFile: string | null;
  thumbnail: string | null;
  body: { sections: LelandSection[] };
};

export type LelandPlusEntry = {
  id: string;
  slug: string;
  title: string;
  resourceType: "TUTORIAL" | "SKILL";
  description: string;
  link: string;
  blocks: Block[];
};

const LELAND_ORIGIN = "https://www.joinleland.com";

const ENTRY_FILES = import.meta.glob<LelandPlusEntryFile>("./entries/*.json", {
  eager: true,
  import: "default",
});

function absolutizeLinks(markdown: string): string {
  return markdown.replace(/\[([^\]]*)\]\(#tooltip-[^)]*\)/g, "$1").replace(/\]\(\//g, `](${LELAND_ORIGIN}/`);
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function children(block: LelandBlock): LelandBlock[] {
  return Array.isArray(block.children) ? (block.children as LelandBlock[]) : [];
}

function listToMarkdown(block: LelandBlock): string {
  const items = (block.items as string[]) ?? [];
  const lines = items.map((item, i) => (block.ordered ? `${i + 1}. ${item}` : `- ${item}`));
  const title = str(block.title);
  return [title ? `**${title}**\n` : "", ...lines].filter(Boolean).join("\n");
}

function fence(code: string, language = ""): string {
  const ticks = code.includes("```") ? "````" : "```";
  return `${ticks}${language}\n${code}\n${ticks}`;
}

function tableToMarkdown(block: LelandBlock): string {
  const escape = (cell: string) => cell.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const head = (block.head as string[]) ?? [];
  const rows = (block.rows as string[][]) ?? [];
  return [
    `| ${head.map(escape).join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escape).join(" | ")} |`),
  ].join("\n");
}

function swappableChildren(block: LelandBlock): LelandBlock[] {
  const variants = (block.variants as { audience: unknown; children: LelandBlock[] }[]) ?? [];
  const chosen = variants.find((v) => v.audience === "everyone") ?? variants[0];
  return chosen?.children ?? [];
}

function blocksToMarkdown(blocks: LelandBlock[]): string {
  return blocks
    .map((block): string => {
      switch (block.type) {
        case "prose":
          return str(block.text) ?? "";
        case "list":
          return listToMarkdown(block);
        case "code":
          return fence(str(block.code) ?? "");
        case "prompt":
          return fence(str(block.prompt) ?? "");
        case "table":
          return tableToMarkdown(block);
        case "callout":
        case "toggle":
          return [
            str(block.title) ? `**${str(block.title)}**` : "",
            str(block.text) ?? "",
            blocksToMarkdown(children(block)),
          ]
            .filter(Boolean)
            .join("\n\n");
        case "steps":
          return ((block.steps as LelandBlock[]) ?? [])
            .map((step, i) => {
              const body = blocksToMarkdown(children(step));
              const title = str(step.title);
              return `${i + 1}. ${title ? `**${title}**` : ""}\n\n${body}`.trim();
            })
            .join("\n\n");
        case "swappable":
          return blocksToMarkdown(swappableChildren(block));
        case "divider":
          return "---";
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

function convertBlock(block: LelandBlock): Block[] {
  switch (block.type) {
    case "prose":
      return [{ kind: "markdown", body: absolutizeLinks(str(block.text) ?? "") }];
    case "list":
      return [{ kind: "markdown", body: absolutizeLinks(listToMarkdown(block)) }];
    case "code":
      return [
        {
          kind: "code",
          code: str(block.code) ?? "",
          language: str(block.label) ?? "text",
          filename: str(block.label),
        },
      ];
    case "prompt": {
      const prompt: Block = {
        kind: "code",
        code: str(block.prompt) ?? "",
        language: "prompt",
        filename: str(block.label) ?? "Prompt",
      };
      const note = str(block.prompt_note);
      return note ? [prompt, { kind: "markdown", body: absolutizeLinks(`*${note}*`) }] : [prompt];
    }
    case "table":
      return [
        {
          kind: "table",
          headers: (block.head as string[]) ?? [],
          rows: ((block.rows as string[][]) ?? []).map((row) => row.map(absolutizeLinks)),
          firstColumnBold: Boolean(block.first_column_bold),
        },
      ];
    case "divider":
      return [{ kind: "divider" }];
    case "tags":
      return [{ kind: "tags", tags: (block.tags as { text: string; color?: "white" | "gray" }[]) ?? [] }];
    case "banner":
      return [
        {
          kind: "banner",
          text: str(block.text) ?? "",
          subtext: str(block.subtext),
          href: str(block.href),
          color: str(block.color) as "gray" | "white" | "blue" | "red" | "beige" | "black" | undefined,
        },
      ];
    case "callout": {
      const text = str(block.text);
      const content = [
        ...(text ? [{ kind: "markdown", body: absolutizeLinks(text) } as Block] : []),
        ...convertBlocks(children(block)),
      ].flatMap((b) => (b.kind === "callout" ? b.content : [b]));
      return [
        {
          kind: "callout",
          tone: str(block.tone) as CalloutBlock["tone"],
          eyebrow: str(block.eyebrow),
          title: str(block.title),
          content,
        },
      ];
    }
    case "toggle":
      return [
        {
          kind: "toggle",
          rows: [{ title: str(block.title) ?? "", body: absolutizeLinks(blocksToMarkdown(children(block))) }],
        },
      ];
    case "flashcards":
      return [
        {
          kind: "toggle",
          rows: ((block.cards as { front: string; back: string }[]) ?? []).map((card) => ({
            title: card.front,
            body: card.back,
          })),
        },
      ];
    case "steps":
      return [
        {
          kind: "steps",
          items: ((block.steps as LelandBlock[]) ?? []).map(
            (step): Step => ({
              text: str(step.title) ? `**${str(step.title)}**` : "",
              blocks: convertBlocks(children(step)),
            }),
          ),
        },
      ];
    case "swappable":
      return convertBlocks(swappableChildren(block));
    default:
      return [];
  }
}

function mergeAdjacentToggles(blocks: Block[]): Block[] {
  return blocks.reduce<Block[]>((merged, block) => {
    const previous = merged[merged.length - 1];
    if (block.kind === "toggle" && previous?.kind === "toggle") {
      const rows: ToggleRow[] = [...previous.rows, ...block.rows];
      merged[merged.length - 1] = { kind: "toggle", rows };
    } else {
      merged.push(block);
    }
    return merged;
  }, []);
}

function convertBlocks(blocks: LelandBlock[]): Block[] {
  return mergeAdjacentToggles(blocks.flatMap(convertBlock));
}

export function lelandBodyToBlocks(body: { sections: LelandSection[] }): Block[] {
  return body.sections.flatMap((section) => [
    ...(section.title
      ? [
          {
            kind: "markdown",
            body: section.subtitle ? `### ${section.title}\n\n${section.subtitle}` : `### ${section.title}`,
          } as Block,
        ]
      : []),
    ...convertBlocks(section.children),
  ]);
}

function slugFromPath(path: string): string {
  return path.replace(/^.*\/(.+)\.json$/, "$1");
}

export const LELAND_PLUS_ENTRIES: LelandPlusEntry[] = Object.entries(ENTRY_FILES)
  .map(([path, file]) => ({
    id: file.id,
    slug: slugFromPath(path),
    title: file.title,
    resourceType: file.resourceType,
    description: file.description,
    link: file.link,
    blocks: lelandBodyToBlocks(file.body),
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

export const LELAND_PLUS_TUTORIALS = LELAND_PLUS_ENTRIES.filter((e) => e.resourceType === "TUTORIAL");
export const LELAND_PLUS_SKILLS = LELAND_PLUS_ENTRIES.filter((e) => e.resourceType === "SKILL");

export function findLelandPlusEntry(title: string): LelandPlusEntry | undefined {
  const normalized = title.trim().toLowerCase();
  return LELAND_PLUS_ENTRIES.find((e) => e.title.toLowerCase() === normalized);
}
