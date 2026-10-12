// Content-block editing for the course builder.
//
// Each block kind from src/data/lessonBlocks.ts gets a small inline editor.
// Authors add blocks from a type picker, edit them in place, and reorder/delete
// them. The same `Block` objects feed the real lesson renderer (BlockList), so
// a Preview tab in the builder shows exactly what the learner will see.
import { useState } from "react";
import {
  AppWindow,
  ChevronDown,
  ChevronUp,
  Code2,
  Download,
  Flag,
  FileCode2,
  GripVertical,
  Hash,
  Image as ImageIcon,
  ListOrdered,
  Minus,
  MessageSquareQuote,
  Plus,
  Slack,
  Table2,
  Tags as TagsIcon,
  Trash2,
  Type,
  Video as VideoIcon,
  X,
} from "lucide-react";

import type {
  Block,
  BannerColor,
} from "../../data/lessonBlocks";
import { useReorder } from "./dnd";

// ─── Block-type catalog (the "list of section types" the picker shows) ───────

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

// The grid shown in the picker.
const PICKER_TYPES = BLOCK_TYPES;

const labelForKind = (kind: Block["kind"]): string =>
  BLOCK_TYPES.find((t) => t.kind === kind)?.label ?? kind;
const iconForKind = (kind: Block["kind"]) =>
  BLOCK_TYPES.find((t) => t.kind === kind)?.Icon ?? Hash;

// ─── Shared input primitives ─────────────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-gray-stroke bg-white px-3 py-2 text-[14px] text-gray-dark placeholder:text-gray-extra-light focus:border-gray-dark focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-gray-light">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-[96px] resize-y leading-relaxed ${props.className ?? ""}`} />;
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputClass} cursor-pointer appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}>
      {children}
    </select>
  );
}

const smallBtn =
  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark";

// ─── Per-kind field editors ──────────────────────────────────────────────────

function BlockFields({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  // Narrow `onChange` to a patcher per kind. `block as any` is safe here —
  // each branch only runs for its matching kind.
  const patch = (p: Record<string, unknown>) => onChange({ ...block, ...p } as Block);

  switch (block.kind) {
    case "markdown":
      return (
        <TextArea
          value={block.body}
          placeholder="Write your content… Markdown supported (## headings, **bold**, - lists, > quotes)."
          onChange={(e) => patch({ body: e.target.value })}
        />
      );

    case "image":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Image URL"><TextInput value={block.src} placeholder="https://…" onChange={(e) => patch({ src: e.target.value })} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Alt text"><TextInput value={block.alt ?? ""} placeholder="Describe the image" onChange={(e) => patch({ alt: e.target.value })} /></Field>
            <Field label="Caption (optional)"><TextInput value={block.caption ?? ""} placeholder="Shown below the image" onChange={(e) => patch({ caption: e.target.value })} /></Field>
          </div>
        </div>
      );

    case "video":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Video URL"><TextInput value={block.src} placeholder="https://…/video.mp4" onChange={(e) => patch({ src: e.target.value })} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Poster image (optional)"><TextInput value={block.poster ?? ""} placeholder="https://…" onChange={(e) => patch({ poster: e.target.value })} /></Field>
            <Field label="Title (optional)"><TextInput value={block.title ?? ""} onChange={(e) => patch({ title: e.target.value })} /></Field>
          </div>
        </div>
      );

    case "callout": {
      // Edit the callout body as a single markdown string. (Rich nested content
      // in seed data is preserved on preview but collapses to markdown once
      // edited here — acceptable for the prototype builder.)
      const bodyText =
        block.content.length === 1 && block.content[0].kind === "markdown"
          ? (block.content[0] as { body: string }).body
          : "";
      return (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
            <Field label="Tone">
              <Select value={block.tone ?? "blue"} onChange={(e) => patch({ tone: e.target.value })}>
                <option value="blue">Blue</option>
                <option value="tan">Tan</option>
              </Select>
            </Field>
            <Field label="Eyebrow (optional)"><TextInput value={block.eyebrow ?? ""} placeholder="e.g. CONCEPT" onChange={(e) => patch({ eyebrow: e.target.value })} /></Field>
          </div>
          <Field label="Title"><TextInput value={block.title ?? ""} onChange={(e) => patch({ title: e.target.value })} /></Field>
          <Field label="Body"><TextArea value={bodyText} placeholder="Markdown supported" onChange={(e) => patch({ content: [{ kind: "markdown", body: e.target.value }] })} /></Field>
        </div>
      );
    }

    case "divider":
      return <p className="text-[13px] italic text-gray-extra-light">A horizontal divider. No content to edit.</p>;

    case "code":
      return (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Language"><TextInput value={block.language} placeholder="e.g. ts, python, prompt" onChange={(e) => patch({ language: e.target.value })} /></Field>
            <Field label="Filename (optional)"><TextInput value={block.filename ?? ""} onChange={(e) => patch({ filename: e.target.value })} /></Field>
          </div>
          <Field label="Code"><TextArea value={block.code} className="font-mono text-[13px]" onChange={(e) => patch({ code: e.target.value })} /></Field>
        </div>
      );

    case "banner": {
      const colors: BannerColor[] = ["gray", "white", "green", "yellow", "blue", "red", "beige", "black"];
      const icons = ["", "IconInfo", "IconCalendar", "IconCheck", "IconGift", "IconBooks", "IconLightning", "IconStar", "IconHelp"];
      return (
        <div className="flex flex-col gap-3">
          <Field label="Text"><TextInput value={block.text} placeholder="Banner heading" onChange={(e) => patch({ text: e.target.value })} /></Field>
          <Field label="Subtext (optional)"><TextInput value={block.subtext ?? ""} onChange={(e) => patch({ subtext: e.target.value })} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Color">
              <Select value={block.color ?? "gray"} onChange={(e) => patch({ color: e.target.value })}>
                {colors.map((c) => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
              </Select>
            </Field>
            <Field label="Icon">
              <Select value={block.icon ?? "IconInfo"} onChange={(e) => patch({ icon: e.target.value })}>
                {icons.map((i) => <option key={i} value={i}>{i === "" ? "No icon" : i.replace("Icon", "")}</option>)}
              </Select>
            </Field>
            <Field label="Link (optional)"><TextInput value={block.href ?? ""} placeholder="https:// or /path" onChange={(e) => patch({ href: e.target.value })} /></Field>
          </div>
        </div>
      );
    }

    case "download":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Label"><TextInput value={block.label} onChange={(e) => patch({ label: e.target.value })} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Filename (optional)"><TextInput value={block.filename ?? ""} placeholder="slides.pdf" onChange={(e) => patch({ filename: e.target.value })} /></Field>
            <Field label="File size (optional)"><TextInput value={block.fileSize ?? ""} placeholder="246 KB" onChange={(e) => patch({ fileSize: e.target.value })} /></Field>
          </div>
          <Field label="File URL"><TextInput value={block.href} placeholder="https://…" onChange={(e) => patch({ href: e.target.value })} /></Field>
        </div>
      );

    case "table": {
      const setHeader = (i: number, v: string) => patch({ headers: block.headers.map((h, j) => (j === i ? v : h)) });
      const setCell = (r: number, c: number, v: string) =>
        patch({ rows: block.rows.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row)) });
      const addColumn = () => patch({ headers: [...block.headers, `Column ${block.headers.length + 1}`], rows: block.rows.map((r) => [...r, ""]) });
      const removeColumn = (i: number) => patch({ headers: block.headers.filter((_, j) => j !== i), rows: block.rows.map((r) => r.filter((_, j) => j !== i)) });
      const addRow = () => patch({ rows: [...block.rows, block.headers.map(() => "")] });
      const removeRow = (i: number) => patch({ rows: block.rows.filter((_, j) => j !== i) });
      return (
        <div className="flex flex-col gap-2">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} className="p-1 align-top">
                      <div className="flex items-center gap-1">
                        <TextInput value={h} onChange={(e) => setHeader(i, e.target.value)} className="font-semibold" />
                        {block.headers.length > 1 && (
                          <button onClick={() => removeColumn(i)} className="shrink-0 rounded p-1 text-gray-extra-light hover:text-red-500" aria-label="Remove column"><X className="h-3.5 w-3.5" /></button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="p-1 align-top">
                    <button onClick={addColumn} className={smallBtn} aria-label="Add column"><Plus className="h-3.5 w-3.5" /></button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className="p-1"><TextInput value={cell} onChange={(e) => setCell(r, c, e.target.value)} /></td>
                    ))}
                    <td className="p-1">
                      <button onClick={() => removeRow(r)} className="rounded p-1.5 text-gray-extra-light hover:text-red-500" aria-label="Remove row"><Trash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addRow} className={`${smallBtn} self-start`}><Plus className="h-3.5 w-3.5" /> Add row</button>
        </div>
      );
    }

    case "toggle": {
      const setRow = (i: number, p: Partial<{ title: string; body: string }>) =>
        patch({ rows: block.rows.map((r, j) => (j === i ? { ...r, ...p } : r)) });
      return (
        <div className="flex flex-col gap-3">
          {block.rows.map((row, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-gray-stroke p-3">
              <div className="flex items-center gap-2">
                <TextInput value={row.title} placeholder="Row title" onChange={(e) => setRow(i, { title: e.target.value })} className="font-medium" />
                {block.rows.length > 1 && (
                  <button onClick={() => patch({ rows: block.rows.filter((_, j) => j !== i) })} className="shrink-0 rounded p-1.5 text-gray-extra-light hover:text-red-500" aria-label="Remove row"><Trash2 className="h-4 w-4" /></button>
                )}
              </div>
              <TextArea value={row.body} placeholder="Row content (Markdown)" onChange={(e) => setRow(i, { body: e.target.value })} className="min-h-[72px]" />
            </div>
          ))}
          <button onClick={() => patch({ rows: [...block.rows, { title: "", body: "" }] })} className={`${smallBtn} self-start`}><Plus className="h-3.5 w-3.5" /> Add row</button>
        </div>
      );
    }

    case "steps": {
      const setItem = (i: number, text: string) => patch({ items: block.items.map((it, j) => (j === i ? { ...it, text } : it)) });
      return (
        <div className="flex flex-col gap-2">
          {block.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-gray-stroke text-[12px] font-semibold text-gray-light">{i + 1}</span>
              <TextInput value={it.text} placeholder={`Step ${i + 1}`} onChange={(e) => setItem(i, e.target.value)} />
              {block.items.length > 1 && (
                <button onClick={() => patch({ items: block.items.filter((_, j) => j !== i) })} className="shrink-0 rounded p-1.5 text-gray-extra-light hover:text-red-500" aria-label="Remove step"><Trash2 className="h-4 w-4" /></button>
              )}
            </div>
          ))}
          <button onClick={() => patch({ items: [...block.items, { text: "" }] })} className={`${smallBtn} self-start`}><Plus className="h-3.5 w-3.5" /> Add step</button>
        </div>
      );
    }

    case "tags": {
      const setTag = (i: number, text: string) => patch({ tags: block.tags.map((t, j) => (j === i ? { ...t, text } : t)) });
      return (
        <div className="flex flex-wrap items-center gap-2">
          {block.tags.map((t, i) => (
            <div key={i} className="flex items-center gap-1 rounded-full border border-gray-stroke py-1 pl-3 pr-1">
              <input value={t.text} placeholder="Tag" onChange={(e) => setTag(i, e.target.value)} className="w-24 bg-transparent text-[13px] text-gray-dark placeholder:text-gray-extra-light focus:outline-none" />
              <button onClick={() => patch({ tags: block.tags.filter((_, j) => j !== i) })} className="rounded-full p-1 text-gray-extra-light hover:text-red-500" aria-label="Remove tag"><X className="h-3 w-3" /></button>
            </div>
          ))}
          <button onClick={() => patch({ tags: [...block.tags, { text: "" }] })} className={smallBtn}><Plus className="h-3.5 w-3.5" /> Add tag</button>
        </div>
      );
    }

    case "embed":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
          <Field label="Embed URL"><TextInput value={block.src} placeholder="https://…" onChange={(e) => patch({ src: e.target.value })} /></Field>
          <Field label="Height (px)"><TextInput type="number" value={block.height ?? 480} onChange={(e) => patch({ height: Number(e.target.value) })} /></Field>
        </div>
      );

    case "slackJoin":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Channel name (optional)"><TextInput value={block.channel ?? ""} placeholder="Join the Slack community" onChange={(e) => patch({ channel: e.target.value })} /></Field>
          <Field label="Invite URL"><TextInput value={block.href} placeholder="https://…" onChange={(e) => patch({ href: e.target.value })} /></Field>
        </div>
      );

    case "html":
      return <Field label="HTML"><TextArea value={block.html} className="font-mono text-[13px]" placeholder="<div>…</div>" onChange={(e) => patch({ html: e.target.value })} /></Field>;

    default:
      return <p className="text-[13px] italic text-gray-extra-light">This block type can't be edited here yet.</p>;
  }
}

// ─── Editable block card ─────────────────────────────────────────────────────

function BlockCard({
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
  const Icon = iconForKind(block.kind);
  return (
    <div
      {...itemProps}
      className={`group/block rounded-xl border bg-white transition-all ${dragging ? "opacity-40" : ""} ${over ? "border-gray-dark ring-2 ring-[#FFD96F]/40" : "border-gray-stroke"}`}
    >
      <div className="flex items-center gap-2 border-b border-gray-stroke px-3 py-2">
        <button {...handleProps} className="cursor-grab rounded p-1 text-gray-extra-light hover:bg-gray-hover hover:text-gray-dark active:cursor-grabbing" aria-label="Drag to reorder">
          <GripVertical className="h-4 w-4" />
        </button>
        <Icon className="h-4 w-4 shrink-0 text-gray-light" />
        <span className="text-[13px] font-semibold text-gray-dark">{labelForKind(block.kind)}</span>
        <button onClick={onDelete} className="ml-auto rounded-md p-1.5 text-gray-extra-light opacity-0 transition-opacity hover:bg-gray-hover hover:text-red-500 group-hover/block:opacity-100" aria-label="Delete block">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3.5">
        <BlockFields block={block} onChange={onChange} />
      </div>
    </div>
  );
}

// ─── Type picker ─────────────────────────────────────────────────────────────

export function BlockTypePicker({ onPick, onClose }: { onPick: (block: Block) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="max-h-[80vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[17px] font-semibold text-gray-dark">Add a section</h3>
          <button onClick={onClose} className="rounded-md p-1.5 text-gray-light hover:bg-gray-hover" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PICKER_TYPES.map(({ kind, label, description, Icon, make }) => (
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

// ─── The editable list of blocks for one section's page ──────────────────────

export function BlockListEditor({ blocks, onChange }: { blocks: Block[]; onChange: (next: Block[]) => void }) {
  const [picking, setPicking] = useState(false);
  const { itemProps, handleProps, state } = useReorder(blocks, onChange);

  const update = (i: number, b: Block) => onChange(blocks.map((x, j) => (j === i ? b : x)));
  const remove = (i: number) => onChange(blocks.filter((_, j) => j !== i));
  const add = (b: Block) => onChange([...blocks, b]);

  return (
    <div className="flex flex-col gap-3">
      {blocks.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-stroke py-10 text-center">
          <p className="text-[14px] text-gray-light">This page is empty.</p>
          <button onClick={() => setPicking(true)} className="mt-2 text-[14px] font-semibold text-gray-dark underline decoration-dotted underline-offset-2">Add your first section</button>
        </div>
      )}

      {blocks.map((block, i) => {
        const s = state(i);
        return (
          <BlockCard
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
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-stroke py-3 text-[14px] font-semibold text-gray-light transition-colors hover:border-gray-dark hover:text-gray-dark"
      >
        <Plus className="h-4 w-4" /> Add section
      </button>

      {picking && <BlockTypePicker onPick={add} onClose={() => setPicking(false)} />}
    </div>
  );
}
