import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { ContentCard, RoundArrow, useCardCarousel, sectionTitle, ITEMS, SALES_RECOMMENDED_ITEMS } from "../pages/ProgramHub";
import { useSelectedCategory } from "../contexts/SelectedCategoryContext";

// Recommended-builds carousel — follows the shared selected category. Shared by
// the home tab ("Your next build", with a CTA) and the Resources tab
// ("Recommended for you", no CTA).
export default function RecommendedBuilds({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: { label: string; to: string };
}) {
  const { selectedCategory } = useSelectedCategory();
  const navigate = useNavigate();
  const items = useMemo(() => {
    if (!selectedCategory) return SALES_RECOMMENDED_ITEMS;
    const matches = ITEMS.filter((it) => it.collection !== "Community builds" && it.categories.includes(selectedCategory));
    return matches.length ? matches.slice(0, 8) : SALES_RECOMMENDED_ITEMS;
  }, [selectedCategory]);
  const carousel = useCardCarousel(items);
  const sub = subtitle ?? (selectedCategory ? `Builds picked for ${selectedCategory}` : "Builds picked for your role");

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex min-w-px flex-1 flex-col gap-2">
          <p className={sectionTitle}>{title}</p>
          <p className="text-[16px] leading-[1.5] text-gray-light">{sub}</p>
        </div>
        {cta && (
          <Button size="md" variant="dark" className="self-start font-semibold" onClick={() => navigate(cta.to)}>
            {cta.label}
          </Button>
        )}
      </div>
      <div className="relative">
        <div ref={carousel.scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((it) => (
            <div key={it.title} className="w-[240px] shrink-0 sm:w-[calc((100%-60px)/4)]">
              <ContentCard item={it} />
            </div>
          ))}
        </div>
        {carousel.page > 0 ? (
          <div className="absolute left-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
            <RoundArrow dir="left" floating onClick={() => carousel.scrollByPage(-1)} />
          </div>
        ) : null}
        {carousel.page < carousel.pages - 1 ? (
          <div className="absolute right-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
            <RoundArrow dir="right" floating onClick={() => carousel.scrollByPage(1)} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
