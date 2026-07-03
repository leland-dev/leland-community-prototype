import { useState, useMemo, type ReactNode } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useExpertMode } from "../contexts/ExpertModeContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useSetLayoutVariant } from "../components/LayoutVariantContext";
import { useSetNavTheme } from "../components/NavThemeContext";
import SessionCard from "../components/SessionCard";
import OfferingCard, { type OfferingType } from "../components/OfferingCard";
import { LinkButton } from "../components/Button";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import calendarPageIcon from "../assets/icons/calendar-page.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";
import aiBuilderCourseImg from "../assets/placeholder images/ai-builder-course.avif";
import lelandPlusImg1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";

const HERO_BG = "#F3F1E6";

const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

const upcomingEvents = [
  { title: "1:1 Session with Jessica", dateTime: "Monday, Mar 30 at 2:00 PM", duration: "45m", image: pic6, type: "coach" as const, status: "live" as const },
  { title: "MBA Strategy Live", dateTime: "Monday, Mar 30 at 4:00 PM", duration: "45m", image: eventImg1, type: "event" as const, status: "upcoming" as const, startsIn: "2h" },
  { title: "Intro Call with Samantha", dateTime: "Wednesday, Apr 1 at 11:00 AM", duration: "30m", image: pic8, type: "coach" as const, status: "upcoming" as const, startsIn: "2d" },
];

interface PurchasedOffering {
  type: OfferingType;
  title: string;
  subtitle: ReactNode;
  image: string;
  exhausted?: boolean;
  href?: string;
}

const purchasedOfferings: PurchasedOffering[] = [
  {
    type: "hourly",
    title: "1h 20m with Marcus",
    subtitle: "45m available to schedule",
    image: pic9,
  },
  {
    type: "hourly",
    title: "Out of time with Jessica",
    subtitle: "0m available to schedule",
    image: pic6,
    exhausted: true,
  },
  {
    type: "package",
    title: "MBA Application Package",
    subtitle: <>Comprehensive package · <span className="text-gray-dark">Currently active</span></>,
    image: pic7,
  },
  {
    type: "course",
    title: "AI Builder Program Level 1: Use AI to 10x Your Impact",
    subtitle: <>Started May 12 <span className="text-[#9B9B9B]">· Next session tomorrow</span></>,
    image: aiBuilderCourseImg,
    href: "/course/1",
  },
  {
    type: "content",
    title: "How I Got Into Stanford GSB",
    subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>,
    image: lelandPlusImg1,
  },
];

export default function Dashboard() {
  useSetLayoutVariant("thin");
  const { dark: darkMode } = useDarkMode();
  const { expert: expertMode } = useExpertMode();
  const heroBg = darkMode ? "#5E6E79" : HERO_BG;
  const navTheme = useMemo(() => ({ bg: heroBg, light: darkMode, hideWordmark: false }), [heroBg, darkMode]);
  useSetNavTheme(navTheme);

  const [purchasesFilter, setPurchasesFilter] = useState<"All" | "Coaching" | "Programs" | "Content">("All");
  const [purchasesExpanded, setPurchasesExpanded] = useState(false);

  const filtered = purchasedOfferings.filter((offering) => {
    if (purchasesFilter === "All") return true;
    if (purchasesFilter === "Coaching") return offering.type === "hourly" || offering.type === "hourly-package" || offering.type === "package";
    if (purchasesFilter === "Programs") return offering.type === "course";
    return offering.type === "content";
  });
  const canTruncate = purchasesFilter === "All" && filtered.length > 4;
  const alwaysVisible = canTruncate ? filtered.slice(0, 4) : filtered;
  const overflow = canTruncate ? filtered.slice(4) : [];

  return (
    <div>
      {/* Mobile hero */}
      <div
        className="-mx-4 -mt-[72px] mb-0 px-4 pt-[150px] pb-6 md:hidden"
        style={{ backgroundColor: heroBg }}
      >
        <h1 className="font-serif text-[36px] font-medium leading-[1.2] text-gray-dark">
          You have {upcomingEvents.length}<br />upcoming sessions.
        </h1>
        <p className="mt-3 flex items-center gap-2 text-[16px] text-gray-dark">
          <img src={pic8} alt="" className="h-[18px] w-[18px] shrink-0 rounded-full object-cover" />
          Next session in 2h with
          <Link to="/messages" className="-ml-1 underline decoration-dotted underline-offset-2 text-gray-dark">
            Alex
          </Link>
        </p>
        {expertMode && (
          <LinkButton
            href="/coach/calendar"
            size="sm"
            variant="dark"
            rounded="rounded-full"
            className="mt-3 !px-5 !text-[14px]"
          >
            <img src={calendarPageIcon} alt="" className="h-[16px] w-[16px] shrink-0 invert" />
            Edit availability
          </LinkButton>
        )}
      </div>

      {/* Desktop h1 */}
      <h1 className="hidden font-serif text-[36px] font-medium text-gray-dark md:block">
        Dashboard
      </h1>

      {/* Upcoming sessions */}
      <section className="mt-6">
        <div>
          <div className="flex flex-col gap-1">
            {upcomingEvents.map((event, i) => (
              <SessionCard key={i} {...event} />
            ))}
          </div>
          <Link
            to="/calendar"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
          >
            See full calendar
          </Link>
        </div>
      </section>

      {/* My Purchases */}
      <section className="mt-12">
        <h2 className="text-[22px] text-gray-dark" style={{ fontWeight: 500 }}>
          My purchases
        </h2>
        <div className="mt-4 flex flex-wrap gap-[6px]">
          {(["All", "Coaching", "Programs", "Content"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setPurchasesFilter(tab); setPurchasesExpanded(false); }}
              className={`cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[12px] font-semibold text-[#222222] ${
                purchasesFilter === tab ? "border-[1.5px] border-[#222222]" : "border-[1.5px] border-transparent transition-colors hover:bg-[#ebebeb]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {alwaysVisible.map((offering) => (
            <OfferingCard
              key={offering.title}
              type={offering.type}
              title={offering.title}
              subtitle={offering.subtitle}
              image={offering.image}
              purchased
              exhausted={!!offering.exhausted}
              href={offering.href}
            />
          ))}
          <AnimatePresence initial={false}>
            {purchasesExpanded && overflow.map((offering, i) => (
              <motion.div
                key={offering.title}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.03 }}
                className="overflow-hidden"
              >
                <OfferingCard
                  type={offering.type}
                  title={offering.title}
                  subtitle={offering.subtitle}
                  image={offering.image}
                  purchased
                  exhausted={!!offering.exhausted}
                  href={offering.href}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {canTruncate && (
          <button
            onClick={() => setPurchasesExpanded(!purchasesExpanded)}
            className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
          >
            {purchasesExpanded ? "See less" : "See all"}
            <img src={chevronDownIcon} alt="" className={`h-[16px] w-[16px] transition-transform ${purchasesExpanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </section>

      {/* My Goals */}
      <section className="mt-12">
        <h2 className="text-[22px] text-gray-dark" style={{ fontWeight: 500 }}>
          My Goals
        </h2>
        <p className="text-[16px] text-[#707070]">Track your progress toward what matters most.</p>
        <div className="scrollbar-hide -mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-[100px] w-[200px] shrink-0 snap-start rounded-xl bg-[#F5F5F5]" style={dashedBorderStyle} />
          ))}
          <button className="flex h-[100px] w-[200px] shrink-0 cursor-pointer snap-start items-center justify-center rounded-xl border-none bg-[#F5F5F5] transition-colors hover:bg-[#EEEEEE]" style={dashedBorderStyle}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 8v16M8 16h16" stroke="#9B9B9B" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
