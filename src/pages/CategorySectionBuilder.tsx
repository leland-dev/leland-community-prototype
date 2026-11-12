// v6 of the category management page — a storefront *builder*. The expert
// composes the page into sections: create a section, give it a title, add any
// mix of offering types (group sessions, memberships, packages, content), and
// choose its card style (small rows / medium horizontal / large covers). Writes
// straight to the shared config (lib/storefrontSections), so the visitor-facing
// profile Offerings tab reflects it live.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import { SectionItems, type CardManage } from "../components/StorefrontCards";
import {
  loadSections,
  saveSections,
  resolveItems,
  getUnassignedItems,
  CATCH_ALL_TITLE,
  CATCH_ALL_SIZE,
  KIND_LABELS,
  CARD_SIZES,
  type SectionConfig,
  type CardSize,
  type StorefrontItem,
} from "../lib/storefrontSections";
import addPlusIcon from "../assets/icons/add-plus.svg";
import layoutGridIcon from "../assets/icons/layout-grid.svg";
import trashIcon from "../assets/icons/trash.svg";
import dotsIcon from "../assets/icons/dots-horizontal.svg";
import dragDotsIcon from "../assets/icons/drag-dots.svg";

// Sentinel drop target for the catch-all "All offerings" section — dropping here
// removes an item from every section (leaving it unassigned). Not a real section
// id, so moveItem finds no match and simply strips it.
const CATCH_ALL_DROP_ID = "__all_offerings__";


function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

// Segmented S / M / L control.
// Layout-density glyphs for the card-size toggle: small = compact rows, medium =
// stacked horizontal cards, large = big side-by-side cover cards.
const SIZE_ICON: Record<CardSize, React.ReactNode> = {
  small: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <rect x="4" y="5.5" width="16" height="3" rx="1" />
      <rect x="4" y="10.5" width="16" height="3" rx="1" />
      <rect x="4" y="15.5" width="16" height="3" rx="1" />
    </svg>
  ),
  medium: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <rect x="4" y="5" width="16" height="6" rx="1.5" />
      <rect x="4" y="13" width="16" height="6" rx="1.5" />
    </svg>
  ),
  large: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <rect x="4" y="4.5" width="7" height="15" rx="1.5" />
      <rect x="13" y="4.5" width="7" height="15" rx="1.5" />
    </svg>
  ),
};

function SizeToggle({ value, onChange }: { value: CardSize; onChange: (s: CardSize) => void }) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-hover p-1">
      {CARD_SIZES.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          aria-label={`${s.label} cards`}
          title={`${s.label} cards`}
          className={`flex h-7 w-8 cursor-pointer items-center justify-center rounded-md transition-colors ${
            value === s.value ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"
          }`}
        >
          {SIZE_ICON[s.value]}
        </button>
      ))}
    </div>
  );
}

// Per-section overflow menu — move up/down, remove.
function SectionMenu({ onMoveUp, onMoveDown, onRemove, canMoveUp, canMoveDown }: { onMoveUp: () => void; onMoveDown: () => void; onRemove: () => void; canMoveUp: boolean; canMoveDown: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  const item = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-medium transition-colors disabled:cursor-default disabled:opacity-40";
  return (
    <div ref={ref} className="relative">
      <Button size="sm" variant="secondary" iconOnly onClick={() => setOpen((v) => !v)} aria-label="Section options">
        <MaskIcon src={dotsIcon} className="h-[18px] w-[18px]" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-[180px] rounded-xl border border-gray-stroke bg-white p-1.5 shadow-lg">
          <button disabled={!canMoveUp} onClick={() => { onMoveUp(); setOpen(false); }} className={`${item} text-gray-dark hover:bg-gray-hover`}>Move up</button>
          <button disabled={!canMoveDown} onClick={() => { onMoveDown(); setOpen(false); }} className={`${item} text-gray-dark hover:bg-gray-hover`}>Move down</button>
          <button onClick={() => { onRemove(); setOpen(false); }} className={`${item} text-[#DC2B23] hover:bg-[#DC2B23]/[0.06]`}>
            <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
            Remove section
          </button>
        </div>
      )}
    </div>
  );
}

// "Add offerings" splits into two paths: pull in an offering you already have,
// or build a brand-new one. A small menu anchored to the button offers the choice.
function AddOfferingsButton({ onChooseExisting, onCreateNew }: { onChooseExisting: () => void; onCreateNew: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  const row = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover";
  return (
    <div ref={ref} className="relative">
      <Button size="md" variant="secondary" className="font-semibold" onClick={() => setOpen((v) => !v)}>
        <MaskIcon src={addPlusIcon} className="h-4 w-4" />
        Add offerings
      </Button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-[220px] rounded-xl border border-gray-stroke bg-white p-1.5 shadow-lg">
          <button onClick={() => { setOpen(false); onChooseExisting(); }} className={row}>
            <MaskIcon src={layoutGridIcon} className="h-[18px] w-[18px] shrink-0" />
            Choose from existing
          </button>
          <button onClick={() => { setOpen(false); onCreateNew(); }} className={row}>
            <MaskIcon src={addPlusIcon} className="h-[18px] w-[18px] shrink-0" />
            Create new
          </button>
        </div>
      )}
    </div>
  );
}

// Modal to pull existing offerings into a target section. Lists every offering
// grouped by the section it currently lives in (plus the unplaced "All
// offerings"); "Move" relocates it into the target. Items already in the target
// read "Added".
function MoveOfferingsModal({ open, targetId, sections, onMove, onClose }: {
  open: boolean;
  targetId: string | null;
  sections: SectionConfig[];
  onMove: (itemId: string) => void;
  onClose: () => void;
}) {
  if (!open || !targetId) return null;
  const target = sections.find((s) => s.id === targetId);
  const groups = [
    ...sections.map((s) => ({ id: s.id, title: s.title || "Untitled section", items: resolveItems(s.itemIds) })),
    { id: CATCH_ALL_DROP_ID, title: CATCH_ALL_TITLE, items: getUnassignedItems(sections) },
  ].filter((g) => g.items.length > 0);
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white sm:max-w-[560px] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-stroke px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold text-gray-dark">Choose from existing</h2>
            <p className="truncate text-[13px] text-gray-light">Move offerings into “{target?.title || "this section"}”</p>
          </div>
          <Button size="sm" variant="secondary" iconOnly onClick={onClose} aria-label="Close">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {groups.map((g) => (
            <div key={g.id} className="mb-5 last:mb-0">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-gray-light">{g.title}</p>
              <div className="flex flex-col gap-1.5">
                {g.items.map((item) => {
                  const here = g.id === targetId;
                  return (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-stroke p-2.5">
                      {item.image ? (
                        <img src={item.image} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
                      ) : (
                        <div className="h-10 w-14 shrink-0 rounded-md bg-gray-hover" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-gray-dark">{item.title}</p>
                        <p className="truncate text-[13px] text-gray-light">{KIND_LABELS[item.kind]}</p>
                      </div>
                      {here ? (
                        <span className="shrink-0 px-2 text-[13px] font-medium text-gray-light">Added</span>
                      ) : (
                        <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold" onClick={() => onMove(item.id)}>Move</Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-stroke px-5 py-3">
          <Button size="md" variant="dark" rounded="rounded-full" className="w-full font-semibold" onClick={onClose}>Done</Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export default function CategorySectionBuilder({ category }: { category?: string }) {
  const navigate = useNavigate();
  const [sections, setSections] = useState<SectionConfig[]>(() => loadSections(category));
  // Section targeted by the "Choose from existing" move modal.
  const [moveFor, setMoveFor] = useState<string | null>(null);

  // Render cards in their expert (manage) form — member counts, a "Manage" CTA,
  // the hover Preview/Edit overlay — and open an item's detail/edit page on
  // click. Memberships open their management page; other items open the offering.
  const manage: CardManage = useMemo(() => {
    const open = (item: StorefrontItem) => {
      if (item.kind === "membership") navigate(`/my-leland/manage/${category}/membership/${item.id}`);
      else if (item.href) navigate(item.href);
    };
    return { onEdit: open, onPreview: open };
  }, [navigate, category]);

  const commit = (next: SectionConfig[]) => {
    setSections(next);
    saveSections(next, category);
  };

  const patch = (id: string, changes: Partial<SectionConfig>) =>
    commit(sections.map((s) => (s.id === id ? { ...s, ...changes } : s)));

  const move = (index: number, dir: -1 | 1) => {
    const next = [...sections];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    commit(next);
  };

  const remove = (id: string) => commit(sections.filter((s) => s.id !== id));

  const addSection = () =>
    commit([{ id: `sec-${Date.now()}`, title: "New section", cardSize: "medium", itemIds: [] }, ...sections]);

  // ── Drag & drop: move an offering between sections, reorder within a section,
  // and drop into/out of the catch-all. While dragging, the dragged card is
  // lifted out of the flow and a "Drop to move" placeholder stands in at the live
  // slot; the slot is anchored to the id it sits *before* (null = append), so it
  // survives the list shifting. motion `layout` animates the other cards to open
  // space. The item inherits the target section's card style for free (style is
  // per-section). Native HTML5 DnD, no library.
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [over, setOver] = useState<{ sectionId: string; beforeId: string | null } | null>(null);
  // Cards stay fully clickable; a drag only starts from the hover handle, which
  // "arms" this on mousedown. Any other drag attempt (card body, inner image or
  // link) is cancelled in onDragStart.
  const dragArmed = useRef(false);
  useEffect(() => {
    const clear = () => { dragArmed.current = false; };
    window.addEventListener("mouseup", clear);
    return () => window.removeEventListener("mouseup", clear);
  }, []);

  const onDragStart = (e: React.DragEvent, itemId: string) => {
    if (!dragArmed.current) { e.preventDefault(); return; }
    dragArmed.current = false;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
    // Snapshot the card as an explicit drag image anchored under the cursor.
    // The browser keeps this snapshot even after we pull the source card out of
    // the flow — otherwise the default ghost vanishes with its removed node.
    const card = e.currentTarget.firstElementChild as HTMLElement | null;
    if (card) {
      const rect = card.getBoundingClientRect();
      e.dataTransfer.setDragImage(card, e.clientX - rect.left, e.clientY - rect.top);
    }
    // Defer the lift-out so the snapshot is captured first.
    setTimeout(() => setDraggingId(itemId), 0);
  };
  const onDragEnd = () => {
    setDraggingId(null);
    setOver(null);
  };

  const moveItem = (id: string, toId: string, beforeId: string | null) => {
    const stripped = sections.map((s) => ({ ...s, itemIds: s.itemIds.filter((x) => x !== id) }));
    const next = stripped.map((s) => {
      if (s.id !== toId) return s;
      const ids = [...s.itemIds];
      const at = beforeId ? ids.indexOf(beforeId) : -1;
      if (at >= 0) ids.splice(at, 0, id);
      else ids.push(id);
      return { ...s, itemIds: ids };
    });
    commit(next);
  };

  const dropId = (e: React.DragEvent) => draggingId ?? e.dataTransfer.getData("text/plain");

  const setSlot = (sectionId: string, beforeId: string | null) => {
    if (over?.sectionId !== sectionId || over?.beforeId !== beforeId) setOver({ sectionId, beforeId });
  };

  // Section-level dragover only sets the slot when *entering* a new section (so
  // the section highlights immediately, defaulting to append). Within a section,
  // whitespace and gaps must NOT rewrite the slot — otherwise the placeholder
  // landing under the cursor would flip the slot and cause the reflow jitter.
  const onSectionDragOver = (e: React.DragEvent, sectionId: string) => {
    if (!draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (over?.sectionId !== sectionId) setSlot(sectionId, null);
  };
  const onSectionLeave = (e: React.DragEvent, sectionId: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOver((o) => (o?.sectionId === sectionId ? null : o));
    }
  };
  const onDrop = (e: React.DragEvent, toId: string) => {
    e.preventDefault();
    const id = dropId(e);
    if (id) moveItem(id, toId, over?.sectionId === toId ? over.beforeId : null);
    onDragEnd();
  };

  // Hovering a card updates the slot only when the cursor crosses the card's
  // midpoint (before it vs. after it). A reading-order score (row first, then
  // column) handles both the stacked rows and the grids. Because the slot is
  // driven by midpoint crossings — not by which element is under the cursor —
  // the live reflow can't feed back into it, which kills the flicker.
  const onItemDragOver = (e: React.DragEvent, sectionId: string, itemId: string, orderedIds: string[]) => {
    if (!draggingId || itemId === draggingId) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    const r = e.currentTarget.getBoundingClientRect();
    const center = (r.top + r.height / 2) * 1e6 + (r.left + r.width / 2);
    const pointer = e.clientY * 1e6 + e.clientX;
    const idx = orderedIds.indexOf(itemId);
    const beforeId = pointer < center ? itemId : orderedIds[idx + 1] ?? null;
    setSlot(sectionId, beforeId);
  };

  // Per-section wrapper: each card stays fully interactive (click, hover); a drag
  // only begins from the hover handle, which arms `dragArmed` on mousedown. The
  // wrapper is the native-DnD drag source + midpoint drop target (plain div —
  // framer's motion props collide with native drag events); an inner motion
  // `layout` div lets siblings animate to open space.
  const makeWrap = (sectionId: string, orderedIds: string[], size: CardSize) => (item: { id: string }, node: React.ReactNode) => (
    <div
      key={item.id}
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onItemDragOver(e, sectionId, item.id, orderedIds)}
      onDrop={(e) => { e.stopPropagation(); onDrop(e, sectionId); }}
      className="group/card relative h-full select-none"
    >
      <motion.div layout transition={{ type: "spring", stiffness: 650, damping: 45 }} className="h-full">
        {node}
      </motion.div>
      <button
        type="button"
        aria-label="Drag to reorder"
        onMouseDown={() => { dragArmed.current = true; }}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className={`absolute z-10 flex h-7 w-7 cursor-grab items-center justify-center rounded-md border border-gray-stroke bg-white/90 opacity-0 shadow-[0_1px_3px_rgba(16,24,40,0.12)] backdrop-blur transition-opacity group-hover/card:opacity-100 active:cursor-grabbing ${size === "small" ? "left-1 top-1/2 -translate-y-1/2" : "right-2 top-2"}`}
      >
        <img src={dragDotsIcon} alt="" className="h-4 w-4 opacity-60" />
      </button>
    </div>
  );

  // Display list for a section while dragging: lift the dragged card out, and
  // report where the placeholder goes (index within the lifted list).
  function displayFor<T extends { id: string }>(sectionId: string, items: T[]) {
    const list = draggingId ? items.filter((it) => it.id !== draggingId) : items;
    let placeholderIndex: number | null = null;
    if (draggingId && over?.sectionId === sectionId) {
      const at = over.beforeId ? list.findIndex((it) => it.id === over.beforeId) : -1;
      placeholderIndex = at >= 0 ? at : list.length;
    }
    return { list, placeholderIndex };
  }

  const unassigned = getUnassignedItems(sections);

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={addSection}
        className="mb-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#222222]/[0.04] px-5 py-10 text-[16px] font-semibold text-gray-dark transition-colors hover:bg-[#222222]/[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='100%25'%20height='100%25'%20fill='none'%20rx='12'%20ry='12'%20stroke='%23222222'%20stroke-opacity='0.3'%20stroke-width='2'%20stroke-dasharray='3%204'/%3e%3c/svg%3e\")",
        }}
      >
        <MaskIcon src={addPlusIcon} className="h-6 w-6" />
        New section
      </button>

      <div className="flex flex-col gap-5">
        <AnimatePresence initial={false}>
          {sections.map((section, i) => {
            const { list, placeholderIndex } = displayFor(section.id, resolveItems(section.itemIds));
            return (
            <motion.section
              key={section.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              onDragOver={(e) => onSectionDragOver(e, section.id)}
              onDragLeave={(e) => onSectionLeave(e, section.id)}
              onDrop={(e) => onDrop(e, section.id)}
              className={`rounded-2xl border bg-white p-5 transition-colors ${over?.sectionId === section.id ? "border-gray-dark ring-2 ring-gray-dark/15" : "border-gray-stroke"}`}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <input
                  value={section.title}
                  onChange={(e) => patch(section.id, { title: e.target.value })}
                  placeholder="Section title"
                  className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-[20px] font-semibold text-gray-dark outline-none transition-colors hover:border-gray-stroke focus:border-gray-dark"
                />
                <div className="flex shrink-0 items-center gap-2">
                  <SizeToggle value={section.cardSize} onChange={(cardSize) => patch(section.id, { cardSize })} />
                  <SectionMenu
                    onMoveUp={() => move(i, -1)}
                    onMoveDown={() => move(i, 1)}
                    onRemove={() => remove(section.id)}
                    canMoveUp={i > 0}
                    canMoveDown={i < sections.length - 1}
                  />
                </div>
              </div>

              <SectionItems
                items={list}
                size={section.cardSize}
                manage={manage}
                wrapItem={makeWrap(section.id, list.map((it) => it.id), section.cardSize)}
                placeholderIndex={placeholderIndex}
                emptyHint="Drag offerings here, or use Add offerings."
              />

              <div className="mt-4 flex">
                <AddOfferingsButton
                  onChooseExisting={() => setMoveFor(section.id)}
                  onCreateNew={() => navigate(`/my-leland/manage/${category}/new`)}
                />
              </div>
            </motion.section>
            );
          })}
        </AnimatePresence>

        {/* Catch-all — everything not placed in a section. Drop a card here to
            unassign it; drag a card out to add it to a section. */}
        {(() => {
          const { list, placeholderIndex } = displayFor(CATCH_ALL_DROP_ID, unassigned);
          return (
            <section
              onDragOver={(e) => onSectionDragOver(e, CATCH_ALL_DROP_ID)}
              onDragLeave={(e) => onSectionLeave(e, CATCH_ALL_DROP_ID)}
              onDrop={(e) => onDrop(e, CATCH_ALL_DROP_ID)}
              className={`rounded-2xl border bg-white p-5 transition-colors ${over?.sectionId === CATCH_ALL_DROP_ID ? "border-gray-dark ring-2 ring-gray-dark/15" : "border-gray-stroke"}`}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-2">
                <h3 className="text-[20px] font-semibold text-gray-dark">{CATCH_ALL_TITLE}</h3>
                <span className="text-[13px] text-gray-light">Anything not added to a section</span>
              </div>
              <SectionItems
                items={list}
                size={CATCH_ALL_SIZE}
                manage={manage}
                wrapItem={makeWrap(CATCH_ALL_DROP_ID, list.map((it) => it.id), CATCH_ALL_SIZE)}
                placeholderIndex={placeholderIndex}
                emptyHint="Everything's been placed in a section."
              />
            </section>
          );
        })()}
      </div>

      <MoveOfferingsModal
        open={moveFor != null}
        targetId={moveFor}
        sections={sections}
        onMove={(itemId) => moveFor && moveItem(itemId, moveFor, null)}
        onClose={() => setMoveFor(null)}
      />
    </div>
  );
}
