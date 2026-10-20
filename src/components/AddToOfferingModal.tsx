import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./Button";
import { OFFERINGS } from "../lib/offerings";

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Modal for attaching a content item (resource / collection / course) to one or
// more offerings — or creating a new offering inline. First-pass UX: a checklist
// of existing offerings (pre-checked for the item's current ones) plus a
// create-new affordance. `onSave` receives the full selected slug list.
export default function AddToOfferingModal({ open, title, offerings, onClose, onSave }: {
  open: boolean;
  title: string;
  offerings: string[];
  onClose: () => void;
  onSave: (slugs: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [created, setCreated] = useState<{ slug: string; title: string }[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // Reset to the item's current offerings each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setSelected(offerings);
    setCreated([]);
    setCreating(false);
    setNewName("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  const createOffering = () => {
    const name = newName.trim();
    if (!name) return;
    const slug = slugify(name) || `offering-${created.length + 1}`;
    if (!created.some((c) => c.slug === slug) && !OFFERINGS.some((o) => o.slug === slug)) {
      setCreated((c) => [{ slug, title: name }, ...c]);
    }
    setSelected((s) => (s.includes(slug) ? s : [...s, slug]));
    setNewName("");
    setCreating(false);
  };

  // Newly-created offerings lead the list, then the catalog.
  const rows = [
    ...created.map((c) => ({ slug: c.slug, title: c.title, price: "", image: undefined as string | undefined })),
    ...OFFERINGS.map((o) => ({ slug: o.slug, title: o.title, price: o.price, image: o.image })),
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-7 pb-4 pt-7">
              <div className="min-w-0">
                <h2 className="font-serif text-[24px] leading-tight text-gray-dark">Add to an offering</h2>
                <p className="mt-1.5 text-[14px] text-gray-light">
                  Choose the offerings that include <span className="font-medium text-gray-dark">{title}</span>. Anything in an offering is sold on your profile.
                </p>
              </div>
              <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Create a new offering */}
            <div className="px-7 pb-3">
              {creating ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createOffering();
                      if (e.key === "Escape") { setCreating(false); setNewName(""); }
                    }}
                    placeholder="New offering name"
                    className="h-10 min-w-0 flex-1 rounded-full border border-gray-stroke px-4 text-[14px] text-gray-dark outline-none placeholder:text-gray-extra-light focus:border-gray-dark"
                  />
                  <Button size="sm" variant="dark" rounded="rounded-full" className="shrink-0 font-semibold" onClick={createOffering}>Create</Button>
                </div>
              ) : (
                <button onClick={() => setCreating(true)} className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-stroke px-4 py-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  Create a new offering
                </button>
              )}
            </div>

            {/* Offerings checklist */}
            <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-2">
              <div className="flex flex-col">
                {rows.map((o) => {
                  const checked = selected.includes(o.slug);
                  return (
                    <button key={o.slug} onClick={() => toggle(o.slug)} className="flex items-center gap-3 border-b border-gray-stroke py-3 text-left last:border-b-0">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors ${checked ? "border-gray-dark bg-gray-dark" : "border-gray-stroke bg-white"}`}>
                        {checked && <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                      </span>
                      {o.image ? (
                        <img src={o.image} alt="" className="h-10 w-[60px] shrink-0 rounded-lg object-cover" />
                      ) : (
                        <span className="flex h-10 w-[60px] shrink-0 items-center justify-center rounded-lg bg-gray-hover text-[11px] font-medium text-gray-light">New</span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold text-gray-dark">{o.title}</span>
                        <span className="block truncate text-[13px] text-gray-light">{o.price || "New offering"}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-stroke px-7 py-4">
              <span className="text-[13px] text-gray-light">{selected.length} selected</span>
              <div className="flex items-center gap-2">
                <Button size="md" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={onClose}>Cancel</Button>
                <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold" onClick={() => onSave(selected)}>Save</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
