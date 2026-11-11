import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import aiBuilderTile from "../../assets/ai-onboarding/aibp-tile.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Button";
import { loadPersonalizationData } from "../PersonalizationModal";

import {
  BrandSlack,
  FontWeight,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconDownload,
  IconInfo,
  IconLightBulb,
  IconSparkle,
  IconUpload,
  IconUserGroup,
  IconX,
  Menu,
  Tag,
  TagColor,
  TagSize,
} from "../leland";
import * as LelandIcons from "../leland/svg/icons";
import * as LelandBrands from "../leland/svg/brands";

import { BlockList, BlockRenderer } from "./BlockRenderer";
import { H3_CLASS, Prose } from "./Prose";

import type {
  BannerBlock as BannerBlockType,
  BannerColor,
  Block,
  BuildsCarouselBlock as BuildsCarouselBlockType,
  CalloutBlock as CalloutBlockType,
  CodeBlock as CodeBlockType,
  DividerBlock as DividerBlockType,
  DownloadBlock as DownloadBlockType,
  EmbedBlock as EmbedBlockType,
  HtmlBlock as HtmlBlockType,
  InviteTeamBlock as InviteTeamBlockType,
  ImageBlock as ImageBlockType,
  PromptQuizBlock as PromptQuizBlockType,
  RadioCardGroupBlock as RadioCardGroupBlockType,
  RoleBuild as RoleBuildType,
  RoleBuildOption as RoleBuildOptionType,
  RoleBuildPickerBlock as RoleBuildPickerBlockType,
  SelectedBuildSummaryBlock as SelectedBuildSummaryBlockType,
  ShareBuildFormBlock as ShareBuildFormBlockType,
  SlackJoinBlock as SlackJoinBlockType,
  StepsBlock as StepsBlockType,
  TableBlock as TableBlockType,
  TagsBlock as TagsBlockType,
  ToggleBlock as ToggleBlockType,
  ToggleChipGroupBlock as ToggleChipGroupBlockType,
  VideoBlock as VideoBlockType,
} from "../../data/lessonBlocks";

const isTextBlock = (block: Block) => block.kind === "markdown";

// Read by SelectedBuildSummary in a later section — RoleBuildPicker has no
// other way to hand its selection forward once that section unmounts.
const SELECTED_BUILD_KEY = "content-viewer-selected-build";

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
  // image > named icon > default IconInfo > nothing (icon: "" opts out entirely).
  const Image = block.image
    ? (LelandBrands as Record<string, typeof BrandSlack>)[block.image] ?? null
    : null;
  const Icon = !Image && block.icon !== ""
    ? (LelandIcons as Record<string, typeof IconInfo>)[block.icon ?? "IconInfo"] ?? IconInfo
    : null;
  const headingClass = `leland-paragraph-lg font-semibold! ${color.text ?? "text-leland-gray-dark"}`;
  const subtextClass = `leland-paragraph-base ${color.text ?? "text-[#222222]/80"}`;

  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-start gap-3">
        {Image ? (
          <Image className="size-11 shrink-0" />
        ) : Icon ? (
          <Icon className={`size-6 shrink-0 ${color.icon}`} />
        ) : null}
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
// and gets built-in keyboard/accessibility support. Each row is its own
// bordered card (12px gap between them), rather than sharing one container.
export function ToggleBlock({ block }: { block: ToggleBlockType }) {
  return (
    <div className="flex flex-col gap-3">
      {block.rows.map((row, i) => (
        <details key={i} className="group rounded-2xl border border-leland-gray-stroke bg-white/50 px-6">
          <summary className="flex cursor-pointer list-none items-center gap-2 py-3 [&::-webkit-details-marker]:hidden">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              {row.icon ? (
                <span className="flex shrink-0 items-center py-2">
                  <IconInfo className="size-6 text-leland-gray-dark" />
                </span>
              ) : null}
              <span className="min-w-0 flex-1 py-2 leland-paragraph-lg font-semibold text-leland-gray-dark">
                {row.title}
              </span>
            </div>
            <span className="flex shrink-0 items-center justify-center rounded-lg bg-black/5 p-2.5">
              <IconChevronDown className="size-3.5 text-leland-gray-dark transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <div>
            <hr className="border-t border-leland-gray-stroke" />
          </div>
          <div className="pt-6 pb-8">
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

export function InviteTeamBlock({ block }: { block: InviteTeamBlockType }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] border border-leland-gray-stroke bg-white/60 p-5 sm:flex-row sm:items-center sm:gap-4">
      <img src={aiBuilderTile} alt="" className="size-12 shrink-0 rounded-[4px] object-cover" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="leland-heading-lg font-semibold text-leland-gray-dark">
          {block.title ?? "Bring your team along"}
        </p>
        <p className="leland-paragraph-base text-leland-gray-light">
          {block.description ?? "Invite teammates to the AI Builder Program."}
        </p>
      </div>
      <Button
        size="md"
        variant="secondary"
        className="shrink-0 self-start sm:self-auto"
        onClick={() => {
          // Open the team dashboard in a new tab, with the invite-members modal triggered by ?invite=1.
          const path = block.href ?? "/team/members?invite=1";
          window.open(`${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`, "_blank", "noopener");
        }}
      >
        Invite your team
      </Button>
    </div>
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
              className={`flex w-full items-center gap-3 rounded-lg p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                isSelected
                  ? "border-[1.5px] border-leland-gray-dark bg-white"
                  : "border border-leland-gray-stroke bg-white hover:bg-leland-gray-hover"
              }`}
            >
              {Icon ? (
                <div className="flex shrink-0 items-center justify-center rounded-[4px] bg-leland-gray-hover p-2.5">
                  <Icon className="size-6" />
                </div>
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="leland-paragraph-lg font-medium text-leland-gray-dark">{opt.label}</span>
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

// Prototype toggle for the build-option card look (sparkle/default vs. the
// dot-indicator + dark "complete" treatment). Lives outside React state
// (module-level store + useSyncExternalStore) so the control in the
// ContentViewer "Prototype options" menu and the cards themselves — which
// sit in unrelated parts of the tree — stay in sync without prop-drilling.
export type BuildCardStyle = "default" | "dots";
const BUILD_CARD_STYLE_KEY = "content-viewer-build-card-style";

function readBuildCardStyle(): BuildCardStyle {
  try {
    return localStorage.getItem(BUILD_CARD_STYLE_KEY) === "default" ? "default" : "dots";
  } catch {
    return "dots";
  }
}

let buildCardStyle: BuildCardStyle = readBuildCardStyle();
const buildCardStyleListeners = new Set<() => void>();

export function setBuildCardStyle(style: BuildCardStyle) {
  buildCardStyle = style;
  try {
    localStorage.setItem(BUILD_CARD_STYLE_KEY, style);
  } catch {
    // ignore
  }
  buildCardStyleListeners.forEach((listener) => listener());
}

function subscribeBuildCardStyle(listener: () => void) {
  buildCardStyleListeners.add(listener);
  return () => buildCardStyleListeners.delete(listener);
}

export function useBuildCardStyle(): BuildCardStyle {
  return useSyncExternalStore(subscribeBuildCardStyle, () => buildCardStyle, () => "dots");
}

// One suggested or custom build card in the picker grid. The "dots" style
// (prototype direction, toggled from the Prototype options menu) swaps the
// sparkle icon for a level-dot indicator, shows a "Complete"/"Not started"
// status tag, and gives a completed build a faded card treatment.
function BuildOptionCard({
  title,
  description,
  selected,
  completed,
  level = 1,
  image,
  cardStyle,
  onClick,
}: {
  title: string;
  description?: string;
  selected: boolean;
  completed?: boolean;
  level?: number;
  image?: string;
  cardStyle: BuildCardStyle;
  onClick: () => void;
}) {
  if (cardStyle !== "dots") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex h-full flex-col items-start gap-2 rounded-lg p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
          selected
            ? "border-[1.5px] border-leland-gray-dark bg-leland-gray-hover"
            : "bg-leland-gray-hover hover:bg-[rgba(34,34,34,0.08)]"
        }`}
      >
        <IconSparkle className="size-4 shrink-0 text-leland-gray-dark" />
        <span className="leland-paragraph-lg font-semibold text-leland-gray-dark">{title}</span>
        {description ? <span className="line-clamp-3 leland-paragraph-base text-leland-gray-light">{description}</span> : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full flex-col gap-4 rounded-lg p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
        selected
          ? "border-[1.5px] border-leland-gray-dark bg-leland-gray-hover"
          : "bg-leland-gray-hover hover:bg-[rgba(34,34,34,0.08)]"
      }`}
    >
      <div className="relative h-16 w-[120px] shrink-0 overflow-hidden rounded-md border border-leland-gray-hover">
        <img src={image ?? aiBuilderTile} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-[4px] bg-leland-black/[87%] px-1 pt-[3px] pb-[4px] text-[0.75rem] font-semibold leading-none text-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
          Level {level}
        </span>
      </div>
      <div className="flex flex-1 flex-col items-start">
        <span className={`line-clamp-2 text-[16px] font-semibold leading-[1.3] ${completed ? "text-leland-gray-light" : "text-leland-gray-dark"}`}>
          {title}
        </span>
        {description ? <span className="mt-0.5 line-clamp-2 text-[14px] text-leland-gray-light">{description}</span> : null}
      </div>
      <div className="self-start">
        <Tag text={completed ? "Complete" : "Not started"} tagColor={completed ? TagColor.BLACK : TagColor.WHITE} size={TagSize.XS} fontWeight={FontWeight.SEMIBOLD} />
      </div>
    </button>
  );
}

// Lets the learner switch to a different role's suggested builds — a
// rounded white chip at the right edge of the toggle row (hidden on
// mobile, where the nav menu already exposes category switching).
function CategoryChip({
  options,
  value,
  onChange,
}: {
  options: RoleBuildOptionType[];
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <Menu
      align="end"
      hasCustomTriggerRadius
      itemSections={[
        options.map((o) => ({
          label: o.label,
          selected: o.value === value,
          onSelect: () => onChange(o.value),
        })),
      ]}
    >
      <button
        type="button"
        className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-leland-gray-stroke bg-white px-4 py-2 leland-paragraph-base font-medium text-leland-gray-dark shadow-sm transition-colors hover:bg-leland-gray-hover sm:inline-flex"
      >
        <span>{selected?.label ?? "Category"}</span>
        <IconChevronDown className="size-4" />
      </button>
    </Menu>
  );
}

// Switches between the role-specific suggestions and the generic custom
// build — the active segment is the "selected" state, and it decides
// whether the suggestion row even renders.
function BuildModeToggle({
  mode,
  onChange,
}: {
  mode: "suggested" | "custom";
  onChange: (mode: "suggested" | "custom") => void;
}) {
  const options: { value: "suggested" | "custom"; label: string }[] = [
    { value: "suggested", label: "Suggested builds" },
    { value: "custom", label: "Custom build" },
  ];
  return (
    <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-leland-gray-hover p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`whitespace-nowrap rounded-full px-4 py-2 leland-paragraph-base font-medium transition-colors ${
            mode === o.value
              ? "bg-white text-leland-gray-dark shadow-sm"
              : "text-leland-gray-light hover:text-leland-gray-dark"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Horizontal, swipeable row of build cards — shows three at a time on
// desktop with nav arrows, one-and-a-bit at a time on mobile (a sliver of
// the next card invites a swipe), same scroll-snap mechanics as the "See
// what others built" carousel.
function SuggestedBuildsCarousel({
  builds,
  selectedId,
  onSelect,
}: {
  builds: RoleBuildType[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 1;
      setPage(Math.round(el.scrollLeft / w));
      setPages(Math.max(1, Math.ceil(el.scrollWidth / w)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [builds]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const cardStyle = useBuildCardStyle();

  return (
    <div className="relative">
      <div ref={scrollRef} className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 py-1">
        {builds.map((b, i) => (
          <div key={b.id} className="w-[75%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/3)]">
            <BuildOptionCard
              title={b.buildTitle}
              description={b.description}
              selected={b.id === selectedId}
              // Demo stand-in for real progress data — just shows the first
              // card as "complete" so both states are visible side by side.
              completed={i === 0}
              level={b.level}
              image={b.image}
              cardStyle={cardStyle}
              onClick={() => onSelect(b.id)}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        disabled={page <= 0}
        aria-label="Previous"
        className="absolute left-0 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-leland-gray-stroke bg-white shadow-sm transition-colors hover:bg-leland-gray-hover disabled:opacity-0"
      >
        <IconChevronLeft className="size-4 text-leland-gray-dark" />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        disabled={page >= pages - 1}
        aria-label="Next"
        className="absolute right-0 top-1/2 flex size-9 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-leland-gray-stroke bg-white shadow-sm transition-colors hover:bg-leland-gray-hover disabled:opacity-0"
      >
        <IconChevronRight className="size-4 text-leland-gray-dark" />
      </button>
    </div>
  );
}

// Known from onboarding — surface builds scoped to this role, but let the
// learner switch to a generic "build something custom" build instead, or to
// a different role's suggestions via the text link under the carousel.
// Falls back to the generic build (no toggle) when no role is known or
// matched — there's nothing to switch between.
export function RoleBuildPicker({ block }: { block: RoleBuildPickerBlockType }) {
  const knownRole = loadPersonalizationData()?.role ?? null;
  const matched = knownRole ? block.options.filter((opt) => opt.matchesRoles?.includes(knownRole)) : [];
  const defaultOption = matched.length === 1 ? matched[0] : null;

  const [roleOverride, setRoleOverride] = useState<string | null>(null);
  const roleOption = roleOverride ? (block.options.find((o) => o.value === roleOverride) ?? null) : defaultOption;
  const suggestedBuilds = roleOption?.builds ?? block.fallback.builds;
  const customBuild = block.fallback.builds[0];

  // The fallback's single generic build doubles as "custom" when a role
  // isn't on file, so there's no distinct mode to switch to in that case.
  const hasCustom = suggestedBuilds.some((b) => b.id === customBuild.id);
  const customOption: RoleBuildType = {
    ...customBuild,
    buildTitle: "Build something custom",
    description: "Pick your own piece of real work instead.",
  };

  const [mode, setMode] = useState<"suggested" | "custom">("suggested");
  const [selectedId, setSelectedId] = useState(suggestedBuilds[0].id);
  const selected =
    mode === "custom" ? customOption : (suggestedBuilds.find((b) => b.id === selectedId) ?? suggestedBuilds[0]);

  useEffect(() => {
    setSelectedId(suggestedBuilds[0].id);
    setMode("suggested");
    // Only reset when the active role (and so the build set) actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleOption?.value]);

  useEffect(() => {
    localStorage.setItem(SELECTED_BUILD_KEY, selected.buildTitle);
  }, [selected.buildTitle]);

  const suggestedLabel = roleOption ? `Suggested builds for ${roleOption.label}` : "Suggested builds";

  return (
    <div className="flex flex-col gap-8">
      {block.eyebrow ? (
        <span className="leland-subtext-sm font-semibold uppercase tracking-[1.3px] text-leland-gray-extra-light">
          {block.eyebrow}
        </span>
      ) : null}

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          {hasCustom ? <h3 className={H3_CLASS}>{suggestedLabel}</h3> : <BuildModeToggle mode={mode} onChange={setMode} />}

          {block.options.length > 1 ? (
            <CategoryChip
              options={block.options}
              value={roleOption?.value ?? block.options[0].value}
              onChange={setRoleOverride}
            />
          ) : null}
        </div>

        {mode === "suggested" ? <SuggestedBuildsCarousel builds={suggestedBuilds} selectedId={selectedId} onSelect={setSelectedId} /> : null}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="leland-heading-3xl font-semibold! text-leland-gray-dark">{selected.buildTitle}</h2>
        <BlockList blocks={selected.tutorial} allowH1={false} />
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

const QUIZ_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function PromptQuiz({ block }: { block: PromptQuizBlockType }) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Record<number, number>>({});
  const total = block.questions.length;
  const correctCount = Object.entries(answered).filter(
    ([qIdx, optIdx]) => block.questions[Number(qIdx)].options[optIdx]?.correct,
  ).length;
  const question = block.questions[index];
  const pickedOption = answered[index];
  const hasAnswered = pickedOption !== undefined;

  return (
    <div className="overflow-hidden rounded-xl border border-leland-gray-stroke">
      <div className="flex items-center justify-between gap-4 bg-leland-gray-hover px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <span className="leland-paragraph-lg font-semibold text-leland-gray-dark">{block.title}</span>
          <span className="leland-paragraph-base text-leland-gray-light">
            Question {index + 1} of {total} · {correctCount} correct
          </span>
        </div>
        <div className="flex shrink-0 gap-2">
          {block.questions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to question ${i + 1}`}
              className={`flex size-8 items-center justify-center rounded-full leland-paragraph-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                i === index
                  ? "border-2 border-leland-gray-dark text-leland-gray-dark"
                  : answered[i] !== undefined
                    ? "bg-leland-gray-dark text-white"
                    : "bg-white text-leland-gray-light"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-white px-6 py-6">
        <div className="flex flex-col gap-1.5">
          <p className="leland-heading-base font-semibold text-leland-gray-dark">{question.prompt}</p>
          <p className="leland-paragraph-base text-leland-gray-light">
            {question.subtext ?? "Choose an answer to check it."}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => {
            const isPicked = pickedOption === i;
            const showCorrect = hasAnswered && opt.correct;
            const showWrong = hasAnswered && isPicked && !opt.correct;
            return (
              <button
                key={i}
                type="button"
                disabled={hasAnswered}
                onClick={() => setAnswered((prev) => ({ ...prev, [index]: i }))}
                className={`flex w-full items-center gap-3 rounded-lg border p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary disabled:cursor-default ${
                  showCorrect
                    ? "border-[1.5px] border-green-600 bg-green-50"
                    : showWrong
                      ? "border-[1.5px] border-red-500 bg-red-50"
                      : "border-leland-gray-stroke bg-white hover:bg-leland-gray-hover"
                }`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-leland-gray-hover leland-paragraph-base font-semibold text-leland-gray-dark">
                  {QUIZ_LETTERS[i] ?? i + 1}
                </span>
                <span className="min-w-0 flex-1 leland-paragraph-lg text-leland-gray-dark">{opt.label}</span>
                {showCorrect ? <IconCheck className="size-5 shrink-0 text-green-600" /> : null}
                {showWrong ? <IconX className="size-5 shrink-0 text-red-500" /> : null}
              </button>
            );
          })}
        </div>
        {hasAnswered && index < total - 1 ? (
          <Button size="sm" variant="secondary" className="self-start" onClick={() => setIndex(index + 1)}>
            Next question
          </Button>
        ) : null}
      </div>
    </div>
  );
}

const AVATAR_COLOR_FALLBACK = "bg-leland-gray-dark";

function BuildCard({ item }: { item: BuildsCarouselBlockType["items"][number] }) {
  const KindIcon = item.kind === "resource" ? IconLightBulb : IconUserGroup;
  return (
    <div className="w-[260px] shrink-0 snap-start">
      <div className="relative aspect-[1.91/1] w-full overflow-hidden rounded-xl border border-leland-gray-stroke bg-leland-gray-hover">
        <img src={item.image} alt="" className="size-full object-cover object-top" />
        <div className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <KindIcon className="size-4 text-leland-gray-dark" />
        </div>
      </div>
      <h3 className="mt-3 leland-paragraph-lg line-clamp-2 font-semibold text-leland-gray-dark">{item.title}</h3>
      <p className="mt-1 leland-paragraph-base line-clamp-2 text-leland-gray-light">{item.description}</p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${item.avatarColor ?? AVATAR_COLOR_FALLBACK}`}
        >
          {item.avatarInitials}
        </span>
        <span className="leland-paragraph-base text-leland-gray-light">{item.author}</span>
      </div>
    </div>
  );
}

export function BuildsCarousel({ block }: { block: BuildsCarouselBlockType }) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 1;
      setPage(Math.round(el.scrollLeft / w));
      setPages(Math.max(1, Math.ceil(el.scrollWidth / w)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-8">
      <hr className="border-t border-leland-gray-stroke" />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className={H3_CLASS}>{block.title}</h3>
          <Button size="sm" variant="secondary" onClick={() => navigate("/program/ai-builder")}>
            Browse all
          </Button>
        </div>
        <div className="relative">
          <div ref={scrollRef} className="scrollbar-hide snap-x snap-mandatory overflow-x-auto py-1">
            <div className="flex w-max items-start gap-4">
              {block.items.map((item, i) => (
                <BuildCard key={i} item={item} />
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#F9F8F3] to-transparent" />
          <div className="pointer-events-none absolute inset-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-1">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={page <= 0}
              aria-label="Previous"
              className="pointer-events-auto flex size-9 items-center justify-center rounded-full border border-leland-gray-stroke bg-white shadow-sm transition-colors hover:bg-leland-gray-hover disabled:opacity-0"
            >
              <IconChevronLeft className="size-4 text-leland-gray-dark" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={page >= pages - 1}
              aria-label="Next"
              className="pointer-events-auto flex size-9 items-center justify-center rounded-full border border-leland-gray-stroke bg-white shadow-sm transition-colors hover:bg-leland-gray-hover disabled:opacity-0"
            >
              <IconChevronRight className="size-4 text-leland-gray-dark" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HtmlBlock({ block }: { block: HtmlBlockType }) {
  return <div dangerouslySetInnerHTML={{ __html: block.html }} />;
}

// One bullet naming the build the learner picked earlier in this lesson's
// RoleBuildPicker — styled to match the markdown list it visually continues.
export function SelectedBuildSummary({ block }: { block: SelectedBuildSummaryBlockType }) {
  const buildTitle = typeof window !== "undefined" ? localStorage.getItem(SELECTED_BUILD_KEY) : null;
  const text = buildTitle ?? block.fallbackText;
  if (!text) return null;
  return (
    <ul className="flex list-disc flex-col gap-4 pl-5 leland-paragraph-lg text-leland-gray-dark marker:text-leland-gray-extra-light">
      <li>{text}</li>
    </ul>
  );
}

const SHARE_FORM_FIELD_CLASS =
  "w-full rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:border-leland-gray-dark focus:outline-none";

// "Share what you built" — every field starts blank regardless of whether
// the learner followed a tutorial or built something custom, so the
// write-up is always in their own words (see RoleBuildPicker's selected
// build, which this deliberately does NOT pull a title/description from).
export function ShareBuildForm({ block: _block }: { block: ShareBuildFormBlockType }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFilePreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const canSubmit = title.trim() && description.trim() && reflection.trim();

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-leland-gray-stroke bg-white px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-leland-gray-hover">
          <IconCheck className="size-5 text-leland-gray-dark" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="leland-heading-base font-semibold text-leland-gray-dark">Shared with your cohort</p>
          <p className="leland-paragraph-base text-leland-gray-light">Your build now shows up in the cohort showcase.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) setSubmitted(true);
      }}
    >
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-4 rounded-xl border-[3px] border-dashed border-leland-gray-stroke bg-white px-6 py-12 text-center hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          {filePreviewUrl ? (
            <img src={filePreviewUrl} alt="" className="max-h-32 rounded-lg border border-leland-gray-stroke object-cover" />
          ) : (
            <span className="flex size-14 items-center justify-center rounded-full bg-leland-gray-hover">
              <IconUpload className="size-6 text-leland-gray-dark" />
            </span>
          )}
          <span className="leland-paragraph-lg font-semibold text-leland-gray-dark">
            {fileName ?? "Upload a screenshot or screen recording"}
          </span>
          {!fileName ? (
            <span className="leland-paragraph-base text-leland-gray-light">Optional, but it helps others see what you made</span>
          ) : null}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="share-build-title" className="leland-paragraph-base font-medium text-leland-gray-dark">
          Title
        </label>
        <input
          id="share-build-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What did you build?"
          className={SHARE_FORM_FIELD_CLASS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="share-build-description" className="leland-paragraph-base font-medium text-leland-gray-dark">
          Description
        </label>
        <textarea
          id="share-build-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="How does it work, and what value did it create?"
          rows={4}
          className={`${SHARE_FORM_FIELD_CLASS} resize-none`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="share-build-link" className="leland-paragraph-base font-medium text-leland-gray-dark">
          Link <span className="text-leland-gray-light">(optional)</span>
        </label>
        <input
          id="share-build-link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="If it's live somewhere, share the link"
          className={SHARE_FORM_FIELD_CLASS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="share-build-reflection" className="leland-paragraph-base font-medium text-leland-gray-dark">
          What did you learn, and how will you apply this to your work?
        </label>
        <textarea
          id="share-build-reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={4}
          className={`${SHARE_FORM_FIELD_CLASS} resize-none`}
        />
      </div>

      <Button type="submit" size="md" variant="dark" disabled={!canSubmit} className="self-start font-semibold">
        Submit
      </Button>
    </form>
  );
}
