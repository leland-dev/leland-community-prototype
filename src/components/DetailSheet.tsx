import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { getOfferingBySlug } from "../lib/offerings";

// Right-side, full-height sheet shell shared by the content detail sheets
// (resource / collection / course). Renders nothing (but keeps its exit
// animation) when `open` is false.
export function DetailSheet({ open, onClose, title, meta, footer, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  meta?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[600px] flex-col bg-white shadow-[-20px_0_60px_rgba(16,24,40,0.18)]"
          >
            {/* Sticky header */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-stroke px-7 py-5">
              <div className="min-w-0">
                <h2 className="font-serif text-[24px] leading-tight text-gray-dark">{title}</h2>
                {meta && <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-gray-light">{meta}</div>}
              </div>
              <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-7 py-6">{children}</div>

            {/* Footer */}
            {footer && <div className="border-t border-gray-stroke px-7 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function DetailRow({ label, children, divider = true }: { label: string; children: React.ReactNode; divider?: boolean }) {
  return (
    <div className={`grid grid-cols-1 gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6 ${divider ? "border-b border-gray-stroke" : ""}`}>
      <span className="text-[14px] font-medium text-gray-light">{label}</span>
      <div className="text-[15px] text-gray-dark">{children}</div>
    </div>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-gray-stroke bg-white px-4 py-4">
      <p className="text-[22px] font-semibold leading-none text-gray-dark">{value}</p>
      <p className="mt-2 text-[13px] text-gray-light">{label}</p>
    </div>
  );
}

// Prettify an offering slug for display when it isn't in the catalog.
function prettySlug(slug: string): string {
  return slug.split("-").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
}

// "In your offerings" section — resolves each slug against the catalog and
// renders a rich card, falling back to a minimal card for unknown slugs.
export function OfferingsSection({ slugs, emptyText }: { slugs: string[]; emptyText: string }) {
  return (
    <section>
      <h3 className="text-[18px] font-semibold text-gray-dark">In your offerings</h3>
      <p className="mt-1 text-[14px] text-gray-light">Offerings this is sold through on your profile.</p>
      {slugs.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-stroke px-6 py-8 text-center text-[15px] text-gray-light">{emptyText}</div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {slugs.map((slug) => {
            const o = getOfferingBySlug(slug);
            if (o) {
              return (
                <Link key={slug} to={`/offering/${slug}`} className="flex items-center gap-3 rounded-xl border border-gray-stroke bg-white p-3 no-underline transition-colors hover:bg-gray-hover">
                  <img src={o.image} alt="" className="h-12 w-[84px] shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-gray-dark">{o.title}</span>
                    <span className="block truncate text-[14px] text-gray-light">{o.headline}</span>
                  </span>
                  <span className="shrink-0 text-[14px] font-semibold text-gray-dark">{o.price}</span>
                </Link>
              );
            }
            return (
              <div key={slug} className="flex items-center gap-3 rounded-xl border border-gray-stroke bg-white p-3">
                <span className="flex h-12 w-[84px] shrink-0 items-center justify-center rounded-lg bg-gray-hover text-gray-extra-light">—</span>
                <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-gray-dark">{prettySlug(slug)}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
