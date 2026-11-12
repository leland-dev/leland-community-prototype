import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { LargeCard, MediumCard, SmallRow, DropPlaceholder, type CardManage } from "../components/StorefrontCards";
import { getStorefrontItem, type StorefrontItem, type CardSize } from "../lib/storefrontSections";
import livestreamImg from "../assets/placeholder images/placeholder-event-02.png";

type Audience = "customer" | "expert";

// A free, scheduled livestream isn't in the storefront catalog, so synthesize a
// representative one. (Cards render off StorefrontItem fields, not `kind`.)
const LIVESTREAM: StorefrontItem = {
  id: "ls-demo",
  kind: "group-session",
  title: "Free Livestream: Cracking the MBA Interview",
  image: livestreamImg,
  meta: "Fri, Nov 21 · 5:00 PM PT · 1 hr",
  price: "Free",
  priceSub: "312 registered",
  calendarDay: "21",
  calendarMonth: "Nov",
};

const item = (id: string) => getStorefrontItem(id)!;

// One representative item per "thing" the storefront can sell.
const THINGS: { label: string; item: StorefrontItem }[] = [
  { label: "Offering", item: item("10-hour-coaching-package") },
  { label: "Membership", item: item("mba-insider-membership") },
  { label: "Group Session", item: item("gs1") },
  { label: "Free Livestream", item: LIVESTREAM },
];

const SIZES: { size: CardSize; label: string }[] = [
  { size: "large", label: "Large" },
  { size: "medium", label: "Medium" },
  { size: "small", label: "Small" },
];

// Wrap by a min card width so cards never squish; they reflow instead.
const GRID: Record<CardSize, string> = {
  large: "grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] items-start gap-6",
  medium: "grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] items-start gap-6",
  small: "flex max-w-[840px] flex-col gap-5",
};

// Matches the category management page's section card (boxClass).
const CARD = "rounded-[20px] bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

function baseCard(size: CardSize, it: StorefrontItem, manage?: CardManage) {
  if (size === "large") return <LargeCard item={it} manage={manage} />;
  if (size === "medium") return <MediumCard item={it} manage={manage} />;
  return <SmallRow item={it} manage={manage} />;
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9B9B9B]">{label}</p>
      {children}
    </div>
  );
}

function Segmented({ value, onChange }: { value: Audience; onChange: (a: Audience) => void }) {
  const opts: { value: Audience; label: string }[] = [
    { value: "customer", label: "Customer-facing" },
    { value: "expert", label: "Expert-facing" },
  ];
  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#222222]/5 p-1">
      {opts.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
            value === o.value ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(16,24,40,0.12)]" : "text-gray-light hover:text-gray-dark"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function StorefrontCardsTest() {
  const [audience, setAudience] = useState<Audience>("customer");
  useEffect(() => {
    document.title = "Component: Storefront Cards";
  }, []);

  // In expert mode, pass a manage config so cards reveal their edit affordances
  // (hover Preview/Edit overlay on cover cards, a Manage CTA on rows).
  const renderCard = (size: CardSize, it: StorefrontItem) =>
    baseCard(size, it, audience === "expert" ? {} : undefined);

  return (
    <div className="min-h-screen bg-[#F3F1E6]/50">
      <PageShell>
        <Link
          to="/components"
          className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]"
        >
          &lt;COMPONENT&gt;
        </Link>
        <h1 className="mt-2 font-serif text-[40px] leading-[1.1] text-gray-dark">Storefront Cards</h1>
        <p className="mt-2 max-w-[760px] text-[16px] text-[#707070]">
          Every card style (Small, Medium, Large) for every thing an expert can sell — Offering, Membership, Group
          Session, and Free Livestream. The same cards render on the profile Offerings tab and in the category-page
          storefront builder.
        </p>

        {SIZES.map(({ size, label }) => (
          <section key={size} className={`mt-8 ${CARD}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-[18px] font-semibold leading-tight text-gray-dark">{label}</h2>
              <Segmented value={audience} onChange={setAudience} />
            </div>
            <div className={GRID[size]}>
              {THINGS.map((t) => (
                <Specimen key={t.label} label={t.label}>
                  {renderCard(size, t.item)}
                </Specimen>
              ))}
            </div>
          </section>
        ))}

        {/* Utility — the drag placeholder shown while reordering in the builder. */}
        <section className={`mt-8 ${CARD}`}>
          <h2 className="mb-5 text-[18px] font-semibold leading-tight text-gray-dark">Drop placeholder</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {(["large", "medium", "small"] as CardSize[]).map((size) => (
              <Specimen key={size} label={size}>
                <DropPlaceholder size={size} />
              </Specimen>
            ))}
          </div>
        </section>
      </PageShell>
    </div>
  );
}
