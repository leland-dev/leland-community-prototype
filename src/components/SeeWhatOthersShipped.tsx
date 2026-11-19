import { useMemo } from "react";
import { Button } from "./Button";
import { ContentCard, RoundArrow, useCardCarousel, sectionTitle, ITEMS } from "../pages/ProgramHub";
import pic1 from "../assets/profile photos/pic-1.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic9 from "../assets/profile photos/pic-9.png";

// "See what others shipped" — a carousel of community builds. Shared between the
// Resources tab and the Roadmap page.
export default function SeeWhatOthersShipped() {
  const shippedItems = useMemo(() => ITEMS.filter((i) => i.collection === "Community builds").slice(0, 8), []);
  const shippedCarousel = useCardCarousel(shippedItems);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex min-w-px flex-1 flex-col gap-2">
          <p className={sectionTitle}>See what others shipped</p>
          <p className="text-[16px] leading-[1.5] text-gray-light">Real builds filterable by role, use case and tool</p>
        </div>
        <Button size="md" variant="dark" className="self-start font-semibold">Get inspiration</Button>
      </div>
      <div className="relative">
        <div ref={shippedCarousel.scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {shippedItems.map((it) => (
            <div key={it.title} className="w-[240px] shrink-0 sm:w-[calc((100%-60px)/4)]">
              <ContentCard item={it} />
            </div>
          ))}
        </div>
        {shippedCarousel.page > 0 ? (
          <div className="absolute left-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
            <RoundArrow dir="left" floating onClick={() => shippedCarousel.scrollByPage(-1)} />
          </div>
        ) : null}
        {shippedCarousel.page < shippedCarousel.pages - 1 ? (
          <div className="absolute right-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
            <RoundArrow dir="right" floating onClick={() => shippedCarousel.scrollByPage(1)} />
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[pic9, pic1, pic6].map((p, i) => (
            <img key={i} src={p} alt="" className={`h-5 w-5 rounded-full object-cover ring-2 ring-white ${i > 0 ? "-ml-1.5" : ""}`} />
          ))}
        </div>
        <span className="text-[14px] text-gray-light">331 submissions</span>
      </div>
    </div>
  );
}
