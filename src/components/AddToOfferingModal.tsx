import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./Button";
import { OFFERINGS } from "../lib/offerings";

type Mode = "free" | "raise";

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
const parsePrice = (s: string) => Number(String(s).replace(/[^0-9.]/g, "")) || 0;
const fmtPrice = (n: number) => `$${n.toLocaleString()}`;

// Modal for attaching a content item (resource / collection / course) to one or
// more offerings — or creating a new offering inline. For each offering, the
// coach chooses whether to include the content for free or raise that offering's
// price by the content's suggested price. `onSave` receives the selected slugs.
export default function AddToOfferingModal({ open, title, suggestedPrice, offerings, onClose, onSave }: {
  open: boolean;
  title: string;
  suggestedPrice: string | null;
  offerings: string[];
  onClose: () => void;
  onSave: (slugs: string[]) => void;
}) {
  // Each selected offering maps to a pricing choice; absence = not selected.
  const [selections, setSelections] = useState<Record<string, Mode>>({});
  const [created, setCreated] = useState<{ slug: string; title: string }[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelections(Object.fromEntries(offerings.map((s) => [s, "free" as Mode])));
    setCreated([]);
    setCreating(false);
    setNewName("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const suggestedNum = suggestedPrice ? parsePrice(suggestedPrice) : 0;
  const canRaise = suggestedNum > 0;

  const toggle = (slug: string) =>
    setSelections((s) => {
      const next = { ...s };
      if (next[slug]) delete next[slug];
      else next[slug] = "free";
      return next;
    });
  const setMode = (slug: string, mode: Mode) => setSelections((s) => ({ ...s, [slug]: mode }));

  const createOffering = () => {
    const name = newName.trim();
    if (!name) return;
    const slug = slugify(name) || `offering-${created.length + 1}`;
    if (!created.some((c) => c.slug === slug) && !OFFERINGS.some((o) => o.slug === slug)) {
      setCreated((c) => [{ slug, title: name }, ...c]);
    }
    setSelections((s) => (s[slug] ? s : { ...s, [slug]: "free" }));
    setNewName("");
    setCreating(false);
  };

  const rows = [
    ...created.map((c) => ({ slug: c.slug, title: c.title, price: "", image: undefined as string | undefined })),
    ...OFFERINGS.map((o) => ({ slug: o.slug, title: o.title, price: o.price, image: o.image })),
  ];
  const selectedCount = Object.keys(selections).length;

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
                <h2 className="font-serif text-[32px] leading-tight text-gray-dark">Sell this on your profile</h2>
                <p className="mt-1.5 text-[15px] text-gray-light">
                  To sell <span className="font-semibold text-gray-dark">{title}</span> on your profile, add it to an offering below — or create a new one. It won't be for sale until it's in at least one offering.
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
                <button onClick={() => setCreating(true)} className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-extra-light px-4 py-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  Create a new offering
                </button>
              )}
            </div>

            {/* Offerings checklist */}
            <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-2">
              <div className="flex flex-col">
                {rows.map((o) => {
                  const mode = selections[o.slug];
                  const checked = mode !== undefined;
                  const newPrice = fmtPrice(parsePrice(o.price) + suggestedNum);
                  return (
                    <div key={o.slug} className="border-b border-gray-stroke py-3 last:border-b-0">
                      <button onClick={() => toggle(o.slug)} className="flex w-full items-center gap-3 text-left">
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

                      {/* Pricing choice — only when selected and the content has a
                          suggested price to raise by. Eases open/closed on toggle. */}
                      <AnimatePresence initial={false}>
                        {checked && canRaise && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 flex flex-col gap-2 pl-8">
                              <PriceChoice
                                active={mode === "free"}
                                title="Include it for free"
                                price={o.price || "$0"}
                                onClick={() => setMode(o.slug, "free")}
                              />
                              <PriceChoice
                                active={mode === "raise"}
                                title="Add it to the price"
                                price={`${o.price || "$0"} → ${newPrice} (+${suggestedPrice})`}
                                onClick={() => setMode(o.slug, "raise")}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-stroke px-7 py-4">
              <span className="text-[13px] text-gray-light">{selectedCount} selected</span>
              <div className="flex items-center gap-2">
                <Button size="md" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={onClose}>Cancel</Button>
                <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold" onClick={() => onSave(Object.keys(selections))}>Save</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// A radio-style pricing option shown under a selected offering: label on the
// left, price on the right.
function PriceChoice({ active, title, price, onClick }: { active: boolean; title: string; price: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${active ? "border-gray-dark bg-gray-hover/60" : "border-gray-stroke hover:bg-gray-hover"}`}>
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active ? "border-gray-dark" : "border-gray-stroke"}`}>
        {active && <span className="h-2 w-2 rounded-full bg-gray-dark" />}
      </span>
      <span className="flex-1 text-[14px] font-semibold text-gray-dark">{title}</span>
      <span className="shrink-0 text-[14px] text-gray-light">{price}</span>
    </button>
  );
}
