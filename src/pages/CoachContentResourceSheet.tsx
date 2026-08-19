import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { type Resource } from "../lib/resources";
import { getOfferingBySlug } from "../lib/offerings";
import editIcon from "../assets/icons/edit.svg";

function StatusPill({ status }: { status: Resource["status"] }) {
  const styles: Record<Resource["status"], string> = {
    Public: "bg-[#E5F3EC] text-[#1B7A4B]",
    Unlisted: "bg-[#EEF4FB] text-[#35506E]",
    Private: "bg-gray-hover text-gray-light",
  };
  return <span className={`inline-block rounded-full px-2.5 py-1 text-[13px] font-medium ${styles[status]}`}>{status}</span>;
}

function DetailRow({ label, children, divider = true }: { label: string; children: React.ReactNode; divider?: boolean }) {
  return (
    <div className={`grid grid-cols-1 gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6 ${divider ? "border-b border-gray-stroke" : ""}`}>
      <span className="text-[14px] font-medium text-gray-light">{label}</span>
      <div className="text-[15px] text-gray-dark">{children}</div>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-gray-extra-light">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span key={s} className="rounded-full bg-[#222222]/5 px-3 py-1 text-[13px] font-medium text-gray-light">{s}</span>
      ))}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-gray-stroke bg-white px-4 py-4">
      <p className="text-[22px] font-semibold leading-none text-gray-dark">{value}</p>
      <p className="mt-2 text-[13px] text-gray-light">{label}</p>
    </div>
  );
}

// Right-side, full-height sheet showing a resource's details. Renders nothing
// (but keeps its exit animation) when `resource` is null.
export default function CoachContentResourceSheet({ resource, onClose }: { resource: Resource | null; onClose: () => void }) {
  return createPortal(
    <AnimatePresence>
      {resource && (
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
                <h2 className="font-serif text-[24px] leading-tight text-gray-dark">{resource.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-gray-light">
                  <StatusPill status={resource.status} />
                  {resource.lelandPlus && <span className="rounded-full bg-[#F1ECFB] px-2.5 py-1 text-[13px] font-medium text-[#6B4BB8]">Leland+</span>}
                  <span className="text-gray-extra-light">·</span>
                  <span>{resource.price === "$0" ? "Free" : `${resource.price} default price`}</span>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-7 py-6">
              <ResourceBody resource={resource} />
            </div>

            {/* Footer */}
            <div className="border-t border-gray-stroke px-7 py-4">
              <Button size="lg" variant="secondary" rounded="rounded-full" className="w-full font-semibold">
                <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
                Edit resource
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ResourceBody({ resource: r }: { resource: Resource }) {
  const offerings = r.offerings.map((slug) => getOfferingBySlug(slug)).filter(Boolean);
  const isVideo = r.fileType === "Video";

  return (
    <div className="flex flex-col gap-8">
      {/* Preview */}
      <div>
        <div className="relative overflow-hidden rounded-2xl border border-gray-stroke bg-gray-hover">
          <img src={r.cover} alt="" className="aspect-video w-full object-cover" />
          {isVideo && (
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md">
              <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[1px] fill-gray-dark"><path d="M8 5v14l11-7z" /></svg>
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-gray-stroke px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium text-gray-dark">{r.fileName}</p>
            <p className="text-[13px] text-gray-extra-light">{r.fileType}</p>
          </div>
          <button className="shrink-0 text-[14px] font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">Replace</button>
        </div>
      </div>

      {/* Details */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">Details</h3>
        <div className="mt-2">
          <DetailRow label="Description">{r.description}</DetailRow>
          <DetailRow label="Default price">{r.price === "$0" ? "Free" : r.price}</DetailRow>
          <DetailRow label="Resource type"><Chips items={[r.resourceType]} /></DetailRow>
          <DetailRow label="Category"><Chips items={[r.category]} /></DetailRow>
          <DetailRow label="Topics"><Chips items={r.topics} /></DetailRow>
          <DetailRow label="Organizations"><Chips items={r.organizations} /></DetailRow>
          <DetailRow label="Downloadable">{r.downloadable ? "Yes" : "No"}</DetailRow>
          <DetailRow label="Attached file">{r.attachmentName ? r.attachmentName : <span className="text-gray-extra-light">None</span>}</DetailRow>
          <DetailRow label="Included in Leland+">{r.lelandPlus ? "Yes" : "No"}</DetailRow>
          <DetailRow label="Visibility" divider={false}>{r.status}</DetailRow>
        </div>
      </section>

      {/* Offerings */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">In your offerings</h3>
        <p className="mt-1 text-[14px] text-gray-light">Offerings that include this resource.</p>
        {offerings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-stroke px-6 py-8 text-center text-[15px] text-gray-light">
            This resource isn't part of any offerings yet.
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {offerings.map((o) => (
              <Link key={o!.slug} to={`/offering/${o!.slug}`} className="flex items-center gap-3 rounded-xl border border-gray-stroke bg-white p-3 no-underline transition-colors hover:bg-gray-hover">
                <img src={o!.image} alt="" className="h-12 w-[84px] shrink-0 rounded-lg object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-gray-dark">{o!.title}</span>
                  <span className="block truncate text-[14px] text-gray-light">{o!.headline}</span>
                </span>
                <span className="shrink-0 text-[14px] font-semibold text-gray-dark">{o!.price}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Leland+ performance */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">Leland+ performance</h3>
        {r.lelandPlus ? (
          <>
            <p className="mt-1 text-[14px] text-gray-light">How this resource is performing in the Leland+ library.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard value={r.views.toLocaleString()} label="Views" />
              <StatCard value={r.likes.toLocaleString()} label="Likes" />
              <StatCard value={r.earnings} label="Leland+ revenue" />
              <StatCard value="4m 12s" label="Avg. watch time" />
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl bg-gray-hover p-5">
            <p className="text-[15px] text-gray-light">
              This resource isn't part of Leland+. Add it to the library to earn passive income as members engage with it.
            </p>
            <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold">Add to Leland+</Button>
          </div>
        )}
      </section>
    </div>
  );
}
