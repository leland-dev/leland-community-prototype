import { Button } from "../components/Button";
import { DetailSheet, DetailRow, StatCard, OfferingsSection } from "../components/DetailSheet";
import { type Collection } from "../lib/collections";
import { CollectionCover, collectionThumbs, CONTENT_LIBRARY, formatViews } from "./CoachProductNew";
import editIcon from "../assets/icons/edit.svg";

// Right-side detail sheet for a collection. Clicking a collection row opens this
// (read-only overview); the footer CTA hands off to the builder via `onEdit`.
export default function CoachContentCollectionSheet({ collection, onClose, onEdit }: { collection: Collection | null; onClose: () => void; onEdit: () => void }) {
  const lelandPlus = collection?.lelandPlus ?? false;
  const offerings = collection?.offerings ?? [];
  const itemCount = collection?.items.length ?? 0;
  return (
    <DetailSheet
      open={!!collection}
      onClose={onClose}
      title={collection?.title ?? ""}
      meta={
        <>
          {lelandPlus && <span className="rounded-full bg-[#F1ECFB] px-2.5 py-1 text-[13px] font-medium text-[#6B4BB8]">Leland+</span>}
          <span>{itemCount} {itemCount === 1 ? "resource" : "resources"}</span>
          <span className="text-gray-extra-light">·</span>
          <span>{offerings.length > 0 ? `${offerings.length} offering${offerings.length === 1 ? "" : "s"}` : "Not sold on your profile"}</span>
        </>
      }
      footer={
        <Button size="lg" variant="secondary" rounded="rounded-full" className="w-full font-semibold" onClick={onEdit}>
          <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
          Edit collection
        </Button>
      }
    >
      {collection && <CollectionBody collection={collection} />}
    </DetailSheet>
  );
}

function CollectionBody({ collection: c }: { collection: Collection }) {
  const items = c.items
    .map((it) => CONTENT_LIBRARY.find((l) => l.id === it.config.libraryId))
    .filter((l): l is (typeof CONTENT_LIBRARY)[number] => Boolean(l));
  const totalViews = items.reduce((sum, l) => sum + l.views, 0);
  const lelandPlus = c.lelandPlus ?? false;
  const offerings = c.offerings ?? [];

  return (
    <div className="flex flex-col gap-8">
      {/* Preview */}
      <div className="flex justify-center overflow-hidden rounded-2xl border border-gray-stroke bg-gray-hover py-8">
        <CollectionCover thumbs={collectionThumbs(c.items)} className="h-40 w-64" />
      </div>

      {/* Details */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">Details</h3>
        <div className="mt-2">
          <DetailRow label="Description">{c.description || <span className="text-gray-extra-light">—</span>}</DetailRow>
          <DetailRow label="Resources">{c.items.length} {c.items.length === 1 ? "resource" : "resources"}</DetailRow>
          <DetailRow label="Included in Leland+">{lelandPlus ? "Yes" : "No"}</DetailRow>
          <DetailRow label="Sold on profile" divider={false}>{offerings.length > 0 ? `Yes — in ${offerings.length} offering${offerings.length === 1 ? "" : "s"}` : <span className="text-gray-extra-light">Not yet</span>}</DetailRow>
        </div>
      </section>

      {/* Contents */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">What's inside</h3>
        <p className="mt-1 text-[14px] text-gray-light">{c.items.length} {c.items.length === 1 ? "resource" : "resources"} bundled in this collection.</p>
        <div className="mt-4 flex flex-col gap-3">
          {items.map((l) => (
            <div key={l.id} className="flex items-center gap-3 rounded-xl border border-gray-stroke bg-white p-3">
              <img src={l.thumb} alt="" className="h-12 w-[84px] shrink-0 rounded-lg object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-gray-dark">{l.title}</span>
                <span className="block truncate text-[14px] text-gray-light">{l.resourceType} · {formatViews(l.views)} views</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <OfferingsSection slugs={offerings} emptyText="This collection isn't part of any offerings yet." />

      {/* Leland+ performance */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">Leland+ performance</h3>
        {lelandPlus ? (
          <>
            <p className="mt-1 text-[14px] text-gray-light">How this collection is performing in the Leland+ library.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard value={totalViews.toLocaleString()} label="Total views" />
              <StatCard value={String(c.items.length)} label="Resources" />
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl bg-gray-hover p-5">
            <p className="text-[15px] text-gray-light">This collection isn't part of Leland+. Add it to the library to earn passive income as members engage with it.</p>
            <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold">Add to Leland+</Button>
          </div>
        )}
      </section>
    </div>
  );
}
