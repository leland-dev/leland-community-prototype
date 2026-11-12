// Customer-facing storefront for a coach's Offerings tab. Renders the shared,
// expert-configured sections (see lib/storefrontSections) — each section at its
// own card size (small rows / medium horizontal / large covers). Two variants:
//   - "preview" → each section truncated, with a "See all" link out to the full
//                 offerings page (/profile/:slug/offerings?section=…)
//   - "full"    → everything (activeSection "all") or a single filtered section
import { Link } from "react-router-dom";
import { SectionItems } from "./StorefrontCards";
import {
  loadSections,
  resolveItems,
  getUnassignedItems,
  CATCH_ALL_TITLE,
  CATCH_ALL_SIZE,
  type CardSize,
} from "../lib/storefrontSections";
import chevronRightIcon from "../assets/icons/chevron-right.svg";

// How many items a section previews before it links out, by card size (rows are
// cheaper vertically than covers, so they can show a couple more).
const PREVIEW_LIMIT: Record<CardSize, number> = { small: 4, medium: 4, large: 3 };

function SectionHeader({ title, seeAllHref }: { title: string; seeAllHref?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-[20px] font-semibold text-gray-dark">{title}</h3>
      {seeAllHref && (
        <Link
          to={seeAllHref}
          className="flex shrink-0 items-center gap-0.5 text-[14px] font-semibold text-gray-dark no-underline transition-opacity hover:opacity-70"
        >
          See all
          <img src={chevronRightIcon} alt="" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default function OfferingSections({
  slug,
  category,
  variant,
  activeSection = "all",
}: {
  slug?: string;
  category?: string;
  variant: "preview" | "full";
  activeSection?: string;
}) {
  const allSections = loadSections(category);
  const sections = allSections.filter((s) =>
    variant === "full" && activeSection !== "all" ? s.id === activeSection : true
  );

  // The catch-all trails the configured sections, but only under "All" (or the
  // preview) — not when a single section is filtered.
  const unassigned = getUnassignedItems(allSections);
  const showCatchAll = unassigned.length > 0 && (variant === "preview" || activeSection === "all");
  const catchAllLimit = variant === "preview" ? PREVIEW_LIMIT[CATCH_ALL_SIZE] : Infinity;

  return (
    <div className="flex flex-col gap-[52px]">
      {sections.map((section) => {
        const items = resolveItems(section.itemIds);
        if (items.length === 0) return null;
        const limit = variant === "preview" ? PREVIEW_LIMIT[section.cardSize] : Infinity;
        const truncated = variant === "preview" && items.length > limit;
        return (
          <section key={section.id}>
            <SectionHeader
              title={section.title}
              seeAllHref={truncated && slug ? `/profile/${slug}/offerings?section=${section.id}` : undefined}
            />
            <SectionItems items={items.slice(0, limit)} size={section.cardSize} />
          </section>
        );
      })}
      {showCatchAll && (
        <section>
          <SectionHeader
            title={CATCH_ALL_TITLE}
            seeAllHref={variant === "preview" && slug && unassigned.length > catchAllLimit ? `/profile/${slug}/offerings` : undefined}
          />
          <SectionItems items={unassigned.slice(0, catchAllLimit)} size={CATCH_ALL_SIZE} />
        </section>
      )}
    </div>
  );
}
