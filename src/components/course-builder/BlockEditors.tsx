// Inline content editing for the course builder.
//
// Each section's blocks render as a single WYSIWYG canvas: every block shows
// its real learner-facing preview, text is edited directly in place, and any
// non-text settings (callout tone, banner color, media URLs, code language…)
// live in a small gear popover that appears on hover. The same `Block` objects
// feed the real lesson renderer (BlockList), so the canvas IS the preview.
import { useEffect, useRef, useState } from "react";
import {
  AppWindow,
  ChevronDown,
  Code2,
  Download,
  Flag,
  FileCode2,
  GripVertical,
  Image as ImageIcon,
  ListOrdered,
  Minus,
  MessageSquareQuote,
  Plus,
  Settings2,
  Slack,
  Table2,
  Tags as TagsIcon,
  Trash2,
  Type,
  Video as VideoIcon,
  X,
} from "lucide-react";

import type { Block, BannerColor } from "../../data/lessonBlocks";
import { useReorder } from "./dnd";
import { Prose, H3_CLASS } from "../lesson-blocks/Prose";
import { BrandSlack, IconChevronRight, IconDownload, IconInfo } from "../leland";
import * as LelandIcons from "../leland/svg/icons";
import * as LelandBrands from "../leland/svg/brands";

// ─── Block-type catalog (the "list of block types" the picker shows) ───────

type BlockTypeDef = {
  kind: Block["kind"];
  label: string;
  description: string;
  Icon: typeof Type;
  make: () => Block;
};

export const BLOCK_TYPES: BlockTypeDef[] = [
  { kind: "markdown", label: "Text", description: "Paragraphs, headings, and lists in Markdown.", Icon: Type, make: () => ({ kind: "markdown", body: "" }) },
  { kind: "image", label: "Image", description: "A picture with optional caption.", Icon: ImageIcon, make: () => ({ kind: "image", src: "", alt: "" }) },
  { kind: "video", label: "Video", description: "An inline video player.", Icon: VideoIcon, make: () => ({ kind: "video", src: "" }) },
  { kind: "callout", label: "Callout", description: "A tinted box for a concept or exercise.", Icon: MessageSquareQuote, make: () => ({ kind: "callout", tone: "blue", eyebrow: "", title: "", content: [{ kind: "markdown", body: "" }] }) },
  { kind: "steps", label: "Steps", description: "A numbered list of instructions.", Icon: ListOrdered, make: () => ({ kind: "steps", items: [{ text: "" }] }) },
  { kind: "toggle", label: "Accordion", description: "Expandable rows for FAQs or deep dives.", Icon: ChevronDown, make: () => ({ kind: "toggle", rows: [{ title: "", body: "" }] }) },
  { kind: "table", label: "Table", description: "Rows and columns of data.", Icon: Table2, make: () => ({ kind: "table", headers: ["Column 1", "Column 2"], rows: [["", ""]] }) },
  { kind: "code", label: "Code", description: "A code or prompt snippet with copy.", Icon: Code2, make: () => ({ kind: "code", code: "", language: "text" }) },
  { kind: "banner", label: "Banner", description: "A compact call-to-action row.", Icon: Flag, make: () => ({ kind: "banner", text: "", subtext: "", color: "gray" }) },
  { kind: "download", label: "Download", description: "A downloadable file card.", Icon: Download, make: () => ({ kind: "download", label: "Download", href: "#" }) },
  { kind: "tags", label: "Tags", description: "A row of labels or chips.", Icon: TagsIcon, make: () => ({ kind: "tags", tags: [{ text: "" }] }) },
  { kind: "divider", label: "Divider", description: "A horizontal rule between content.", Icon: Minus, make: () => ({ kind: "divider" }) },
  { kind: "embed", label: "Embed", description: "An iframe for interactive content.", Icon: AppWindow, make: () => ({ kind: "embed", src: "", height: 480 }) },
  { kind: "slackJoin", label: "Slack", description: "A join-the-community card.", Icon: Slack, make: () => ({ kind: "slackJoin", href: "#" }) },
  { kind: "html", label: "Custom HTML", description: "Raw HTML for anything else.", Icon: FileCode2, make: () => ({ kind: "html", html: "" }) },
];

// ─── Shared primitives ───────────────────────────────────────────────────────

type Patch = (p: Record<string, unknown>) => void;

// A transparent, always-editable single-line field styled to match the text it
// replaces in the preview.
function InlineInput({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent outline-none placeholder:text-leland-gray-extra-light ${className}`}
    />
  );
}

// A transparent textarea that grows with its content.
function AutoTextarea({ value, onChange, placeholder, className = "", autoFocus = false, onBlur }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string; autoFocus?: boolean; onBlur?: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }
  }, [value]);
  useEffect(() => {
    if (autoFocus && ref.current) {
      const el = ref.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [autoFocus]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={1}
      className={`w-full resize-none bg-transparent outline-none placeholder:text-leland-gray-extra-light ${className}`}
    />
  );
}

// Markdown text that renders as Prose but swaps to a raw-markdown editor on
// click — so the canvas reads as the finished lesson until you edit.
function EditableProse({ value, onChange, placeholder, allowH1 = false, proseClassName }: { value: string; onChange: (v: string) => void; placeholder: string; allowH1?: boolean; proseClassName?: string }) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <AutoTextarea
        autoFocus
        value={value}
        onChange={onChange}
        onBlur={() => setEditing(false)}
        placeholder={placeholder}
        className="leland-paragraph-lg leading-relaxed text-leland-gray-dark"
      />
    );
  }
  return (
    <div onClick={() => setEditing(true)} className="cursor-text">
      {value.trim() ? (
        <Prose body={value} allowH1={allowH1} className={proseClassName} />
      ) : (
        <p className="leland-paragraph-lg italic text-leland-gray-extra-light">{placeholder}</p>
      )}
    </div>
  );
}

// A dashed drop target for media blocks with no source yet — clicking opens the
// gear popover where the URL is entered.
function MediaPlaceholder({ Icon, label, onClick }: { Icon: typeof ImageIcon; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-leland-gray-stroke py-12 text-leland-gray-light transition-colors hover:border-gray-dark hover:text-gray-dark"
    >
      <Icon className="h-7 w-7" />
      <span className="text-[14px] font-medium">{label}</span>
    </button>
  );
}

// ─── Settings-popover field primitives ───────────────────────────────────────

const settingsInput =
  "w-full rounded-lg border border-gray-stroke bg-white px-3 py-2 text-[13px] text-gray-dark placeholder:text-gray-extra-light focus:border-gray-dark focus:outline-none";

function SField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-gray-light">{label}</span>
      {children}
    </label>
  );
}
function SInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${settingsInput} ${props.className ?? ""}`} />;
}
function SSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${settingsInput} cursor-pointer appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}>
      {children}
    </select>
  );
}

const smallBtn =
  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark";

// ─── Banner styling (mirrors lesson-blocks/ContentBlocks) ────────────────────

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
const BANNER_ICON_OPTIONS = ["", "IconInfo", "IconCalendar", "IconCheck", "IconGift", "IconBooks", "IconLightning", "IconStar", "IconHelp"];

// ─── Per-kind inline content (the editable preview) ──────────────────────────

function InlineContent({ block, patch, openSettings }: { block: Block; patch: Patch; openSettings: () => void }) {
  switch (block.kind) {
    case "markdown":
      return <EditableProse value={block.body} onChange={(body) => patch({ body })} placeholder="Write something… (Markdown supported)" allowH1 />;

    case "callout": {
      const tone = block.tone ?? "blue";
      const container = tone === "tan" ? "bg-leland-tan-light" : "bg-leland-blue-light";
      const eyebrow = tone === "tan" ? "text-leland-tan-dark" : "text-leland-blue-dark";
      const bodyText = block.content.length === 1 && block.content[0].kind === "markdown" ? (block.content[0] as { body: string }).body : "";
      return (
        <div className={`rounded-xl px-6 py-6 md:py-8 ${container}`}>
          <div className="flex flex-col gap-4">
            <InlineInput value={block.eyebrow ?? ""} onChange={(v) => patch({ eyebrow: v })} placeholder="Eyebrow (optional)" className={`leland-eyebrow font-semibold uppercase tracking-widest ${eyebrow}`} />
            <InlineInput value={block.title ?? ""} onChange={(v) => patch({ title: v })} placeholder="Title" className={H3_CLASS} />
            <EditableProse value={bodyText} onChange={(v) => patch({ content: [{ kind: "markdown", body: v }] })} placeholder="Body (Markdown supported)" />
          </div>
        </div>
      );
    }

    case "banner": {
      const color = BANNER_COLORS[block.color ?? "gray"];
      const Image = block.image ? (LelandBrands as Record<string, typeof BrandSlack>)[block.image] ?? null : null;
      const Icon = !Image && block.icon !== "" ? (LelandIcons as Record<string, typeof IconInfo>)[block.icon ?? "IconInfo"] ?? IconInfo : null;
      return (
        <div className={`flex items-center gap-6 rounded-xl px-6 py-5 ${color.container}`}>
          <span className="flex min-w-0 flex-1 items-start gap-3">
            {Image ? <Image className="size-11 shrink-0" /> : Icon ? <Icon className={`size-6 shrink-0 ${color.icon}`} /> : null}
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <InlineInput value={block.text} onChange={(v) => patch({ text: v })} placeholder="Banner heading" className={`leland-paragraph-lg font-semibold ${color.text ?? "text-leland-gray-dark"}`} />
              <InlineInput value={block.subtext ?? ""} onChange={(v) => patch({ subtext: v })} placeholder="Subtext (optional)" className={`leland-paragraph-base ${color.text ?? "text-[#222222]/80"}`} />
            </span>
          </span>
          {block.href ? <IconChevronRight className={`size-6 shrink-0 ${color.icon}`} /> : null}
        </div>
      );
    }

    case "image":
      return block.src ? (
        <figure className="flex flex-col gap-2">
          <img src={block.src} alt={block.alt ?? ""} className="w-full rounded-xl border border-leland-gray-stroke object-cover" />
          <InlineInput value={block.caption ?? ""} onChange={(v) => patch({ caption: v })} placeholder="Add a caption (optional)" className="leland-paragraph-sm text-leland-gray-light" />
        </figure>
      ) : (
        <MediaPlaceholder Icon={ImageIcon} label="Add an image" onClick={openSettings} />
      );

    case "video":
      return block.src ? (
        <video src={block.src} poster={block.poster} title={block.title} controls className="aspect-video w-full rounded-xl border border-leland-gray-stroke bg-black" />
      ) : (
        <MediaPlaceholder Icon={VideoIcon} label="Add a video" onClick={openSettings} />
      );

    case "embed":
      return block.src ? (
        <div className="overflow-hidden rounded-xl border border-leland-gray-stroke">
          <iframe src={block.src} title={block.title ?? "Embedded content"} className="block w-full border-0" style={{ height: block.height ?? 480 }} loading="lazy" />
        </div>
      ) : (
        <MediaPlaceholder Icon={AppWindow} label="Add an embed" onClick={openSettings} />
      );

    case "code":
      return (
        <div className="overflow-hidden rounded-lg border border-leland-gray-stroke">
          <div className="flex items-center bg-white py-3 pl-6 pr-4">
            <span className="truncate text-[13px] font-semibold text-leland-gray-extra-light">{block.filename || block.language || "code"}</span>
          </div>
          <div className="px-6 pb-6 pt-0">
            <AutoTextarea value={block.code} onChange={(code) => patch({ code })} placeholder="Paste code or a prompt…" className="font-mono text-[14px] leading-relaxed text-leland-gray-dark" />
          </div>
        </div>
      );

    case "download":
      return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-leland-gray-stroke bg-white p-6">
          <div className="flex min-w-0 flex-col gap-1">
            <InlineInput value={block.label} onChange={(v) => patch({ label: v })} placeholder="Download label" className="leland-paragraph-lg font-semibold text-leland-gray-dark" />
            {block.filename ? <p className="leland-paragraph-base text-leland-gray-light">{block.filename}</p> : null}
          </div>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-leland-gray-hover"><IconDownload className="size-5 text-leland-gray-dark" /></span>
        </div>
      );

    case "slackJoin":
      return (
        <div className="flex w-full items-center gap-3 rounded-lg border border-leland-gray-stroke bg-white p-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-leland-gray-stroke bg-white"><BrandSlack className="size-7" /></div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <InlineInput value={block.channel ?? ""} onChange={(v) => patch({ channel: v })} placeholder="Join the Slack community" className="leland-heading-base font-semibold text-leland-gray-dark" />
            <p className="leland-paragraph-base text-leland-gray-extra-light">Leland AI Builders</p>
          </div>
          <span className="shrink-0 rounded-lg bg-leland-gray-dark px-4 py-3 leland-heading-base font-semibold text-white">Join →</span>
        </div>
      );

    case "divider":
      return <hr className="border-leland-gray-stroke" />;

    case "html":
      return block.html.trim() ? (
        <div dangerouslySetInnerHTML={{ __html: block.html }} />
      ) : (
        <MediaPlaceholder Icon={FileCode2} label="Add custom HTML" onClick={openSettings} />
      );

    case "steps": {
      const setItem = (i: number, text: string) => patch({ items: block.items.map((it, j) => (j === i ? { ...it, text } : it)) });
      return (
        <ol className="flex flex-col text-leland-gray-dark">
          {block.items.map((it, i) => (
            <li key={i} className="group/step grid grid-cols-[24px_1fr_auto] gap-x-4">
              <div className="flex flex-col items-center">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-leland-gray-extra-light bg-white text-[13px] font-semibold text-leland-gray-dark">{i + 1}</span>
                <span className="w-0 flex-1 border-l-2 border-dotted border-leland-gray-extra-light group-last/step:hidden" />
              </div>
              <div className="min-w-0 pb-4 group-last/step:pb-0">
                <EditableProse value={it.text} onChange={(text) => setItem(i, text)} placeholder={`Step ${i + 1}`} allowH1={false} />
              </div>
              {block.items.length > 1 && (
                <button onClick={() => patch({ items: block.items.filter((_, j) => j !== i) })} className="h-6 shrink-0 rounded p-1 text-gray-extra-light opacity-0 transition-opacity hover:text-red-500 group-hover/step:opacity-100" aria-label="Remove step"><Trash2 className="h-4 w-4" /></button>
              )}
            </li>
          ))}
          <li className="grid grid-cols-[24px_1fr] gap-x-4">
            <span />
            <button onClick={() => patch({ items: [...block.items, { text: "" }] })} className={`${smallBtn} self-start`}><Plus className="h-3.5 w-3.5" /> Add step</button>
          </li>
        </ol>
      );
    }

    case "toggle": {
      const setRow = (i: number, p: Partial<{ title: string; body: string }>) => patch({ rows: block.rows.map((r, j) => (j === i ? { ...r, ...p } : r)) });
      return (
        <div className="flex flex-col gap-3">
          {block.rows.map((row, i) => (
            <div key={i} className="group/row rounded-2xl border border-leland-gray-stroke bg-white/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <InlineInput value={row.title} onChange={(v) => setRow(i, { title: v })} placeholder="Row title" className="leland-paragraph-lg font-semibold text-leland-gray-dark" />
                {block.rows.length > 1 && (
                  <button onClick={() => patch({ rows: block.rows.filter((_, j) => j !== i) })} className="shrink-0 rounded p-1 text-gray-extra-light opacity-0 transition-opacity hover:text-red-500 group-hover/row:opacity-100" aria-label="Remove row"><Trash2 className="h-4 w-4" /></button>
                )}
              </div>
              <div className="mt-2 border-t border-leland-gray-stroke pt-3">
                <EditableProse value={row.body} onChange={(v) => setRow(i, { body: v })} placeholder="Row content (Markdown)" />
              </div>
            </div>
          ))}
          <button onClick={() => patch({ rows: [...block.rows, { title: "", body: "" }] })} className={`${smallBtn} self-start`}><Plus className="h-3.5 w-3.5" /> Add row</button>
        </div>
      );
    }

    case "tags": {
      const setTag = (i: number, text: string) => patch({ tags: block.tags.map((t, j) => (j === i ? { ...t, text } : t)) });
      return (
        <div className="flex flex-wrap items-center gap-2">
          {block.tags.map((t, i) => (
            <div key={i} className="flex items-center gap-1 rounded-full border border-leland-gray-stroke bg-white py-1 pl-3 pr-1.5">
              <input value={t.text} placeholder="Tag" onChange={(e) => setTag(i, e.target.value)} className="w-24 bg-transparent text-[13px] text-gray-dark placeholder:text-gray-extra-light focus:outline-none" />
              <button onClick={() => patch({ tags: block.tags.filter((_, j) => j !== i) })} className="rounded-full p-1 text-gray-extra-light hover:text-red-500" aria-label="Remove tag"><X className="h-3 w-3" /></button>
            </div>
          ))}
          <button onClick={() => patch({ tags: [...block.tags, { text: "" }] })} className={smallBtn}><Plus className="h-3.5 w-3.5" /> Add tag</button>
        </div>
      );
    }

    case "table": {
      const setHeader = (i: number, v: string) => patch({ headers: block.headers.map((h, j) => (j === i ? v : h)) });
      const setCell = (r: number, c: number, v: string) => patch({ rows: block.rows.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row)) });
      const addColumn = () => patch({ headers: [...block.headers, `Column ${block.headers.length + 1}`], rows: block.rows.map((r) => [...r, ""]) });
      const removeColumn = (i: number) => patch({ headers: block.headers.filter((_, j) => j !== i), rows: block.rows.map((r) => r.filter((_, j) => j !== i)) });
      const addRow = () => patch({ rows: [...block.rows, block.headers.map(() => "")] });
      const removeRow = (i: number) => patch({ rows: block.rows.filter((_, j) => j !== i) });
      return (
        <div className="flex flex-col gap-2">
          <div className="overflow-x-auto rounded-xl border border-leland-gray-stroke">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="bg-leland-gray-hover">
                  {block.headers.map((h, i) => (
                    <th key={i} className={`p-1 align-top ${i > 0 ? "border-l border-leland-gray-stroke" : ""}`}>
                      <div className="flex items-center gap-1">
                        <input value={h} onChange={(e) => setHeader(i, e.target.value)} placeholder="Header" className="w-full bg-transparent px-2 py-1.5 text-leland-gray-light outline-none placeholder:text-gray-extra-light" />
                        {block.headers.length > 1 && (
                          <button onClick={() => removeColumn(i)} className="shrink-0 rounded p-1 text-gray-extra-light hover:text-red-500" aria-label="Remove column"><X className="h-3.5 w-3.5" /></button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="p-1 align-middle"><button onClick={addColumn} className={smallBtn} aria-label="Add column"><Plus className="h-3.5 w-3.5" /></button></th>
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t border-leland-gray-stroke">
                    {row.map((cell, c) => (
                      <td key={c} className={`p-1 ${c > 0 ? "border-l border-leland-gray-stroke" : ""}`}>
                        <input value={cell} onChange={(e) => setCell(r, c, e.target.value)} className={`w-full bg-transparent px-2 py-1.5 text-leland-gray-dark outline-none ${c === 0 ? "font-semibold" : ""}`} />
                      </td>
                    ))}
                    <td className="p-1"><button onClick={() => removeRow(r)} className="rounded p-1.5 text-gray-extra-light hover:text-red-500" aria-label="Remove row"><Trash2 className="h-3.5 w-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addRow} className={`${smallBtn} self-start`}><Plus className="h-3.5 w-3.5" /> Add row</button>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Per-kind gear settings (non-text config); null = no gear ─────────────────

function blockSettings(block: Block, patch: Patch): React.ReactNode {
  switch (block.kind) {
    case "callout":
      return (
        <SField label="Tone">
          <SSelect value={block.tone ?? "blue"} onChange={(e) => patch({ tone: e.target.value })}>
            <option value="blue">Blue</option>
            <option value="tan">Tan</option>
          </SSelect>
        </SField>
      );

    case "banner": {
      const colors: BannerColor[] = ["gray", "white", "green", "yellow", "blue", "red", "beige", "black"];
      return (
        <div className="flex flex-col gap-3">
          <SField label="Color">
            <SSelect value={block.color ?? "gray"} onChange={(e) => patch({ color: e.target.value })}>
              {colors.map((c) => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
            </SSelect>
          </SField>
          <SField label="Icon">
            <SSelect value={block.icon ?? "IconInfo"} onChange={(e) => patch({ icon: e.target.value })}>
              {BANNER_ICON_OPTIONS.map((i) => <option key={i} value={i}>{i === "" ? "No icon" : i.replace("Icon", "")}</option>)}
            </SSelect>
          </SField>
          <SField label="Link (optional)"><SInput value={block.href ?? ""} placeholder="https:// or /path" onChange={(e) => patch({ href: e.target.value })} /></SField>
        </div>
      );
    }

    case "image":
      return (
        <div className="flex flex-col gap-3">
          <SField label="Image URL"><SInput value={block.src} placeholder="https://…" onChange={(e) => patch({ src: e.target.value })} /></SField>
          <SField label="Alt text"><SInput value={block.alt ?? ""} placeholder="Describe the image" onChange={(e) => patch({ alt: e.target.value })} /></SField>
        </div>
      );

    case "video":
      return (
        <div className="flex flex-col gap-3">
          <SField label="Video URL"><SInput value={block.src} placeholder="https://…/video.mp4" onChange={(e) => patch({ src: e.target.value })} /></SField>
          <SField label="Poster image (optional)"><SInput value={block.poster ?? ""} placeholder="https://…" onChange={(e) => patch({ poster: e.target.value })} /></SField>
          <SField label="Title (optional)"><SInput value={block.title ?? ""} onChange={(e) => patch({ title: e.target.value })} /></SField>
        </div>
      );

    case "embed":
      return (
        <div className="flex flex-col gap-3">
          <SField label="Embed URL"><SInput value={block.src} placeholder="https://…" onChange={(e) => patch({ src: e.target.value })} /></SField>
          <SField label="Height (px)"><SInput type="number" value={block.height ?? 480} onChange={(e) => patch({ height: Number(e.target.value) })} /></SField>
        </div>
      );

    case "code":
      return (
        <div className="flex flex-col gap-3">
          <SField label="Language"><SInput value={block.language} placeholder="e.g. ts, python, prompt" onChange={(e) => patch({ language: e.target.value })} /></SField>
          <SField label="Filename (optional)"><SInput value={block.filename ?? ""} onChange={(e) => patch({ filename: e.target.value })} /></SField>
        </div>
      );

    case "download":
      return (
        <div className="flex flex-col gap-3">
          <SField label="File URL"><SInput value={block.href} placeholder="https://…" onChange={(e) => patch({ href: e.target.value })} /></SField>
          <SField label="Filename (optional)"><SInput value={block.filename ?? ""} placeholder="slides.pdf" onChange={(e) => patch({ filename: e.target.value })} /></SField>
          <SField label="File size (optional)"><SInput value={block.fileSize ?? ""} placeholder="246 KB" onChange={(e) => patch({ fileSize: e.target.value })} /></SField>
        </div>
      );

    case "slackJoin":
      return <SField label="Invite URL"><SInput value={block.href} placeholder="https://…" onChange={(e) => patch({ href: e.target.value })} /></SField>;

    case "html":
      return (
        <SField label="HTML">
          <textarea value={block.html} onChange={(e) => patch({ html: e.target.value })} placeholder="<div>…</div>" className={`${settingsInput} min-h-[120px] resize-y font-mono`} />
        </SField>
      );

    default:
      return null;
  }
}

// ─── The editable block shell (hover toolbar + gear popover) ──────────────────

function EditableBlock({
  block,
  onChange,
  onDelete,
  itemProps,
  handleProps,
  dragging,
  over,
}: {
  block: Block;
  onChange: (b: Block) => void;
  onDelete: () => void;
  itemProps: React.HTMLAttributes<HTMLDivElement> & { draggable?: boolean };
  handleProps: React.HTMLAttributes<HTMLButtonElement>;
  dragging: boolean;
  over: boolean;
}) {
  const [gearOpen, setGearOpen] = useState(false);
  const patch: Patch = (p) => onChange({ ...block, ...p } as Block);
  const settings = blockSettings(block, patch);

  return (
    <div
      {...itemProps}
      className={`group/eb relative rounded-lg py-2 transition-colors ${dragging ? "opacity-40" : ""} ${over ? "bg-[#FFD96F]/15" : "hover:bg-gray-hover/40"}`}
    >
      {/* Drag handle in the left gutter */}
      <button
        {...handleProps}
        aria-label="Drag to reorder"
        className="absolute -left-7 top-2.5 flex h-6 w-5 cursor-grab items-center justify-center rounded text-gray-extra-light opacity-0 transition-opacity hover:text-gray-dark group-hover/eb:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Hover toolbar: settings gear (if any) + delete */}
      <div className="absolute right-1 top-1 z-20 flex items-center gap-0.5 rounded-lg border border-gray-stroke bg-white p-0.5 opacity-0 shadow-sm transition-opacity group-hover/eb:opacity-100">
        {settings && (
          <div className="relative">
            <button
              onClick={() => setGearOpen((o) => !o)}
              className={`rounded-md p-1.5 transition-colors ${gearOpen ? "bg-gray-hover text-gray-dark" : "text-gray-light hover:bg-gray-hover hover:text-gray-dark"}`}
              aria-label="Block settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>
            {gearOpen && (
              <>
                <div className="fixed inset-0 z-30" onMouseDown={() => setGearOpen(false)} />
                <div className="absolute right-0 top-full z-40 mt-1 w-[280px] rounded-xl border border-gray-stroke bg-white p-3 shadow-lg">
                  {settings}
                </div>
              </>
            )}
          </div>
        )}
        <button onClick={onDelete} className="rounded-md p-1.5 text-gray-light transition-colors hover:bg-gray-hover hover:text-red-500" aria-label="Delete block">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <InlineContent block={block} patch={patch} openSettings={() => setGearOpen(true)} />
    </div>
  );
}

// ─── Type picker ─────────────────────────────────────────────────────────────

export function BlockTypePicker({ onPick, onClose }: { onPick: (block: Block) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="max-h-[80vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[17px] font-semibold text-gray-dark">Add a block</h3>
          <button onClick={onClose} className="rounded-md p-1.5 text-gray-light hover:bg-gray-hover" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BLOCK_TYPES.map(({ kind, label, description, Icon, make }) => (
            <button
              key={kind}
              onClick={() => { onPick(make()); onClose(); }}
              className="flex items-start gap-3 rounded-xl border border-gray-stroke p-3 text-left transition-colors hover:border-gray-dark hover:bg-gray-hover"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#222222]/5 text-gray-dark"><Icon className="h-[18px] w-[18px]" /></span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold text-gray-dark">{label}</span>
                <span className="block text-[12px] leading-snug text-gray-light">{description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── The inline canvas for one section's page ────────────────────────────────

export function BlockListEditor({ blocks, onChange }: { blocks: Block[]; onChange: (next: Block[]) => void }) {
  const [picking, setPicking] = useState(false);
  const { itemProps, handleProps, state } = useReorder(blocks, onChange);

  const update = (i: number, b: Block) => onChange(blocks.map((x, j) => (j === i ? b : x)));
  const remove = (i: number) => onChange(blocks.filter((_, j) => j !== i));
  const add = (b: Block) => onChange([...blocks, b]);

  return (
    <div className="flex flex-col gap-1">
      {blocks.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-stroke py-12 text-center">
          <p className="text-[14px] text-gray-light">This page is empty.</p>
          <button onClick={() => setPicking(true)} className="mt-2 text-[14px] font-semibold text-gray-dark underline decoration-dotted underline-offset-2">Add your first block</button>
        </div>
      )}

      {blocks.map((block, i) => {
        const s = state(i);
        return (
          <EditableBlock
            key={i}
            block={block}
            onChange={(b) => update(i, b)}
            onDelete={() => remove(i)}
            itemProps={itemProps(i)}
            handleProps={handleProps}
            dragging={s.dragging}
            over={s.over}
          />
        );
      })}

      <button
        onClick={() => setPicking(true)}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gray-hover py-3 text-[14px] font-semibold text-gray-light transition-colors hover:bg-[#222222]/10 hover:text-gray-dark"
      >
        <Plus className="h-4 w-4" /> Add block
      </button>

      {picking && <BlockTypePicker onPick={add} onClose={() => setPicking(false)} />}
    </div>
  );
}
