// The three card styles a storefront section can render in — small (stacked
// rows), medium (horizontal cards), large (big cover cards). Every kind of item
// normalizes to StorefrontItem, so one section renders all its items identically
// at the chosen size, and sections can mix kinds. Shared by the customer profile
// (OfferingSections) and the expert builder (category page v6).
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CalendarIcon } from "./SessionCard";
import { Button } from "./Button";
import { type StorefrontItem, type CardSize } from "../lib/storefrontSections";
import eyeIcon from "../assets/icons/eye.svg";
import editIcon from "../assets/icons/edit.svg";
import repostIcon from "../assets/icons/repost-2.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";

// Recolorable icon (CSS mask) — inherits `text-*` via bg-current.
function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}

const cardShell =
  "flex overflow-hidden rounded-2xl border border-gray-stroke bg-white no-underline shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]";

// Expert "manage" affordances. Pass this when a card is rendered in the builder
// or the expert-facing profile to reveal edit controls: a hover Preview + Edit
// overlay on cover cards (large/medium) and a "Manage" CTA on rows (small). The
// overlay mirrors the v2 category page's CoachOfferingCard treatment.
export type CardManage = {
  onPreview?: (item: StorefrontItem) => void;
  onEdit?: (item: StorefrontItem) => void;
};

function Wrap({ item, className, children, forceDiv, onClick }: { item: StorefrontItem; className: string; children: ReactNode; forceDiv?: boolean; onClick?: () => void }) {
  return item.href && !forceDiv ? (
    <Link to={item.href} className={`cursor-pointer ${className}`}>{children}</Link>
  ) : (
    <div className={`cursor-pointer ${className}`} onClick={onClick}>{children}</div>
  );
}

// Darken-the-cover-and-reveal Preview + Edit controls, shown on hover over a
// large/medium card's thumbnail. Buttons are sized to the thumbnail they sit on.
function HoverEditOverlay({ item, manage, size }: { item: StorefrontItem; manage: CardManage; size: "large" | "medium" }) {
  const btnSize = size === "large" ? "lg" : "md";
  const iconClass = size === "large" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      <Button
        iconOnly
        size={btnSize}
        variant="white"
        aria-label="Preview"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); manage.onPreview?.(item); }}
        className="pointer-events-auto shadow-[0_2px_8px_rgba(16,24,40,0.2)]"
      >
        <img src={eyeIcon} alt="" className={iconClass} />
      </Button>
      <Button
        iconOnly
        size={btnSize}
        variant="white"
        aria-label="Edit"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); manage.onEdit?.(item); }}
        className="pointer-events-auto shadow-[0_2px_8px_rgba(16,24,40,0.2)]"
      >
        <img src={editIcon} alt="" className={iconClass} />
      </Button>
    </div>
  );
}

function PriceRow({ item, variant }: { item: StorefrontItem; variant: "card" | "row" }) {
  return (
    <div>
      {variant === "card" && item.startingAt && (
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">Starting at</p>
      )}
      <p className="flex items-baseline gap-x-1 whitespace-nowrap text-[14px] font-semibold text-gray-dark">
        <span>
          {item.price}
          {item.priceSuffix && <span className="text-[13px] font-normal text-gray-light">{item.priceSuffix}</span>}
        </span>
        {item.origPrice && <span className="font-normal text-gray-extra-light line-through">{item.origPrice}</span>}
        {variant === "card" && item.savePct != null && (
          <span className="ml-auto text-[12px] font-medium text-[#1B8A54]">Save {item.savePct}%</span>
        )}
      </p>
    </div>
  );
}

function Cover({ item, className, style, children }: { item: StorefrontItem; className: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {item.image ? (
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-gray-hover" />
      )}
      {item.calendarDay && (
        <div className="absolute left-2 top-2">
          <CalendarIcon day={item.calendarDay} />
        </div>
      )}
      {children}
    </div>
  );
}

// Large — big vertical cover card (the storefront default).
export function LargeCard({ item, manage }: { item: StorefrontItem; manage?: CardManage }) {
  return (
    <Wrap item={item} forceDiv={!!manage} className={`${manage ? "group " : ""}h-full flex-col ${cardShell}`}>
      <Cover item={item} className="w-full" style={{ aspectRatio: "1.91 / 1" }}>
        {manage && <HoverEditOverlay item={item} manage={manage} size="large" />}
      </Cover>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[15px] font-semibold leading-tight text-gray-dark">{item.title}</p>
        <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-gray-light">{item.meta}</p>
        <div className="mt-auto pt-3">
          <PriceRow item={item} variant="card" />
        </div>
      </div>
    </Wrap>
  );
}

// The "Membership" type pill, reused in the header (expert) or footer (customer).
const membershipTag = (
  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#222222]/5 px-2 py-0.5 text-[12px] font-semibold text-gray-light">
    <MaskIcon src={repostIcon} className="h-3 w-3" />
    Membership
  </span>
);

// Medium membership — its own layout, matching the v2 category page's
// SubscriptionRowCard: a near-square thumbnail, a details link, and a footer.
// Member counts are private to the expert, so the footer shows the subscriber
// avatars + count only in manage view; the customer view shows the type tag
// there instead (and drops the duplicate header tag).
function MembershipMediumCard({ item, manage }: { item: StorefrontItem; manage?: CardManage }) {
  return (
    <Wrap
      item={item}
      forceDiv={!!manage}
      onClick={manage ? () => manage.onEdit?.(item) : undefined}
      className={`group h-full gap-4 p-3 ${cardShell}`}
    >
      <Cover item={item} className="h-[116px] w-[140px] shrink-0 self-start rounded-xl">
        {manage && <HoverEditOverlay item={item} manage={manage} size="medium" />}
      </Cover>
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-2 min-w-0 text-[16px] font-semibold leading-snug text-gray-dark">{item.title}</p>
          {manage && membershipTag}
        </div>
        <span className="mt-1 inline-flex w-fit items-center gap-0.5 whitespace-nowrap text-[14px] font-medium text-gray-light transition-colors group-hover:text-gray-dark">
          Membership details
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </span>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-stroke pt-2.5">
          {manage ? (
            <div className="flex min-w-0 items-center gap-1.5">
              <div className="flex -space-x-1">
                {[pic1, pic2, pic3].map((src, i) => (
                  <img key={i} src={src} alt="" className="h-[18px] w-[18px] shrink-0 rounded-full border border-white object-cover" />
                ))}
              </div>
              {item.priceSub && <span className="truncate text-[13px] text-gray-light">{item.priceSub}</span>}
            </div>
          ) : (
            membershipTag
          )}
          <p className="shrink-0 whitespace-nowrap text-[14px] text-gray-light">
            <span className="font-semibold text-gray-dark">{item.price}</span>
            {item.priceSuffix}
          </p>
        </div>
      </div>
    </Wrap>
  );
}

// Medium — horizontal card: thumbnail left, details right.
export function MediumCard({ item, manage }: { item: StorefrontItem; manage?: CardManage }) {
  if (item.kind === "membership") return <MembershipMediumCard item={item} manage={manage} />;
  return (
    <Wrap item={item} forceDiv={!!manage} className={`${manage ? "group " : ""}h-full gap-4 p-3 ${cardShell}`}>
      <Cover item={item} className="h-[116px] w-[140px] shrink-0 self-start rounded-xl">
        {manage && <HoverEditOverlay item={item} manage={manage} size="medium" />}
      </Cover>
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <p className="line-clamp-2 text-[16px] font-semibold leading-snug text-gray-dark">{item.title}</p>
        <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-gray-light">{item.meta}</p>
        <div className="mt-auto pt-2">
          <PriceRow item={item} variant="card" />
        </div>
      </div>
    </Wrap>
  );
}

// Small — horizontal list row, matching the category page's UpcomingEventRow: a
// 60×100 thumbnail, title + meta, a fixed price/sub column that lines up across
// rows, and a Details pill. Rendered as a visual pill (not a nested button) so
// the whole row can stay a link.
export function SmallRow({ item, manage }: { item: StorefrontItem; manage?: CardManage }) {
  return (
    <Wrap item={item} forceDiv={!!manage} className="group flex items-center gap-5 rounded-xl px-3 py-3 transition-colors hover:bg-[#F7F7F7]">
      <div className="relative h-[60px] w-[114px] shrink-0 overflow-hidden rounded-md">
        {item.image ? (
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-hover" />
        )}
        {item.calendarDay && (
          <div className="absolute left-1 top-1">
            <CalendarIcon day={item.calendarDay} size="xs" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-gray-dark">{item.title}</h3>
        <p className="mt-0.5 truncate text-[14px] text-gray-light">{item.meta}</p>
      </div>
      <div className="hidden w-[92px] shrink-0 md:block">
        <p className="text-[15px] font-semibold text-gray-dark">
          {item.price}
          {item.priceSuffix && <span className="text-[13px] font-normal text-gray-light">{item.priceSuffix}</span>}
        </p>
        {/* Hide a membership's subscriber count from customers; keep it for the
            expert and keep event "going/registered" counts for everyone. */}
        {item.priceSub && !(item.kind === "membership" && !manage) && (
          <p className="text-[13px] text-gray-light">{item.priceSub}</p>
        )}
      </div>
      {manage ? (
        <span className="hidden shrink-0 sm:block">
          <Button
            variant="outline"
            size="sm"
            rounded="rounded-full"
            className="px-5 py-2.5 text-[14px] font-semibold"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); manage.onEdit?.(item); }}
          >
            Manage
          </Button>
        </span>
      ) : (
        <span className="hidden shrink-0 items-center justify-center rounded-full border border-gray-stroke bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors group-hover:bg-gray-hover sm:inline-flex">
          {item.ctaLabel ?? "Details"}
        </span>
      )}
    </Wrap>
  );
}

function renderCard(item: StorefrontItem, size: CardSize, manage?: CardManage) {
  if (size === "small") return <SmallRow item={item} manage={manage} />;
  if (size === "medium") return <MediumCard item={item} manage={manage} />;
  return <LargeCard item={item} manage={manage} />;
}

// Dashed "Drop to move" slot shown at the live drop position while dragging. It
// stands in for the dragged card (which is lifted out of the flow), and its
// `layout` lets the surrounding cards animate to open space around it.
// pointer-events-none so it never steals the dragover from the section/cards.
export function DropPlaceholder({ size }: { size: CardSize }) {
  const base =
    "pointer-events-none flex items-center justify-center border-2 border-dashed border-gray-dark/25 text-[14px] font-medium text-gray-light";
  const shape = size === "small" ? "mx-3 rounded-xl py-4" : `rounded-2xl ${size === "large" ? "min-h-[232px]" : "min-h-[132px]"}`;
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={`${base} ${shape}`}
    >
      Drop to move
    </motion.div>
  );
}

const CONTAINER: Record<CardSize, string> = {
  small: "-mx-3 flex flex-col",
  medium: "grid grid-cols-1 gap-4 sm:grid-cols-2",
  large: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
};

// Dispatcher — lays out a section's items at the chosen card size. `wrapItem`
// lets a host (the expert builder) wrap each card, e.g. in a drag handle; the
// default (customer) rendering leaves cards untouched.
export function SectionItems({
  items,
  size,
  wrapItem,
  manage,
  emptyHint = "No items yet.",
  placeholderIndex = null,
}: {
  items: StorefrontItem[];
  size: CardSize;
  wrapItem?: (item: StorefrontItem, node: ReactNode, index: number) => ReactNode;
  // When set, cards render expert edit affordances (hover overlay / Manage CTA).
  manage?: CardManage;
  emptyHint?: string;
  // When set, renders a "Drop to move" placeholder at this index (drag preview).
  placeholderIndex?: number | null;
}) {
  const hasPlaceholder = placeholderIndex != null;
  if (items.length === 0 && !hasPlaceholder) {
    return (
      <div className="rounded-xl border border-dashed border-gray-stroke px-4 py-8 text-center text-[14px] text-gray-light">
        {emptyHint}
      </div>
    );
  }
  const nodes: ReactNode[] = items.map((item, i) => {
    const node = renderCard(item, size, manage);
    return wrapItem ? wrapItem(item, node, i) : <Fragment key={item.id}>{node}</Fragment>;
  });
  if (hasPlaceholder) {
    const idx = Math.min(Math.max(placeholderIndex, 0), nodes.length);
    nodes.splice(idx, 0, <DropPlaceholder key="__drop_placeholder" size={size} />);
  }
  return <div className={CONTAINER[size]}>{nodes}</div>;
}
