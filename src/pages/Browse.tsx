import { useEffect, useState } from "react";

import {
  Users,
  Calendar,
  Rocket,
  BookOpen,
  Sparkles,
  GraduationCap,
  Briefcase,
  Landmark,
  Layers,
  Code2,
  BarChart3,
  Stethoscope,
  Scale,
  FileText,
  MessageSquare,
  ChevronRight,
  Radio,
} from "lucide-react";

import { Button } from "../components/Button";

const categories = [
  { name: "Coaching", icon: Users, color: "bg-blue/10 text-blue" },
  { name: "Events", icon: Calendar, color: "bg-orange/10 text-orange" },
  { name: "Bootcamps", icon: Rocket, color: "bg-red/10 text-red" },
  { name: "Programs", icon: BookOpen, color: "bg-blue/10 text-blue" },
  { name: "Leland+", icon: Sparkles, color: "bg-primary-xlight text-primary" },
  {
    name: "Graduate Programs",
    icon: GraduationCap,
    color: "bg-yellow/10 text-yellow",
  },
];

// Popular categories — the primary mobile surface. Mirrors the "Popular" bucket
// in BrowseMenu, with an icon + coach count per row.
const popularCategories = [
  { name: "MBA Admissions", icon: GraduationCap, color: "bg-blue/10 text-blue", coaches: "1,240 coaches" },
  { name: "Management Consulting", icon: Briefcase, color: "bg-orange/10 text-orange", coaches: "860 coaches" },
  { name: "Investment Banking", icon: Landmark, color: "bg-primary-xlight text-primary", coaches: "720 coaches" },
  { name: "Product Management", icon: Layers, color: "bg-red/10 text-red", coaches: "640 coaches" },
  { name: "Software Engineering", icon: Code2, color: "bg-blue/10 text-blue", coaches: "590 coaches" },
  { name: "Data Science", icon: BarChart3, color: "bg-yellow/10 text-yellow", coaches: "430 coaches" },
  { name: "Medical School", icon: Stethoscope, color: "bg-red/10 text-red", coaches: "510 coaches" },
  { name: "Law School", icon: Scale, color: "bg-orange/10 text-orange", coaches: "380 coaches" },
  { name: "Resume Review", icon: FileText, color: "bg-blue/10 text-blue", coaches: "920 coaches" },
  { name: "Interview Prep", icon: MessageSquare, color: "bg-primary-xlight text-primary", coaches: "780 coaches" },
];

// Mock free livestreams for the second tab.
const freeLivestreams = [
  { title: "Cracking the MBA Admissions Interview", coach: "Priya Shah · ex-HBS AdCom", when: "Today · 5:00 PM PT", live: true },
  { title: "Consulting Case Math, Fast", coach: "Daniel Okafor · ex-McKinsey", when: "Tomorrow · 12:00 PM PT", live: false },
  { title: "Breaking Into Product Management", coach: "Mei Lin · PM at Stripe", when: "Thu · 9:00 AM PT", live: false },
  { title: "IB Technical Prep: Valuation 101", coach: "Carlos Reyes · ex-Goldman", when: "Fri · 2:00 PM PT", live: false },
];

type Tab = "categories" | "livestreams";

const tabs: { id: Tab; label: string }[] = [
  { id: "categories", label: "Categories" },
  { id: "livestreams", label: "Free Livestreams" },
];

function MobileBrowse() {
  const [tab, setTab] = useState<Tab>("categories");

  return (
    <div className="md:hidden">
      <h1 className="text-[26px] font-medium text-gray-dark">Browse</h1>

      {/* Button tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={tab === t.id ? "dark" : "outline"}
            rounded="rounded-full"
            className="shrink-0"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {tab === "categories" ? (
        <div className="mt-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">
            Popular categories
          </h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
            {popularCategories.map(({ name, icon: Icon, color, coaches }, i) => (
              <button
                key={name}
                className={`flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-gray-hover ${
                  i > 0 ? "border-t border-gray-stroke" : ""
                }`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium text-gray-dark">{name}</div>
                  <div className="text-[13px] text-gray-light">{coaches}</div>
                </div>
                <ChevronRight size={18} className="shrink-0 text-gray-extra-light" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">
            Upcoming free livestreams
          </h2>
          <div className="mt-3 space-y-3">
            {freeLivestreams.map(({ title, coach, when, live }) => (
              <button
                key={title}
                className="flex w-full items-center gap-4 rounded-xl border border-gray-stroke p-4 text-left shadow-card transition-colors hover:bg-gray-hover"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-red/10 text-red">
                  <Radio size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {live && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Live
                      </span>
                    )}
                    <span className="text-[13px] text-gray-light">{when}</span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-[15px] font-medium text-gray-dark">{title}</div>
                  <div className="truncate text-[13px] text-gray-light">{coach}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Browse() {
  useEffect(() => { document.title = "Leland Prototype | Browse"; }, []);
  return (
    <div>
      <MobileBrowse />

      {/* Desktop — unchanged category grid + trending skeleton. */}
      <div className="hidden md:block">
        <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">Browse</h1>
        <p className="mt-2 text-[16px] text-gray-light">
          Explore categories across Leland&rsquo;s offerings.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map(({ name, icon: Icon, color }) => (
            <button
              key={name}
              className="flex flex-col items-center gap-3 rounded-lg border border-gray-stroke p-5 transition-colors hover:border-gray-xlight hover:bg-gray-hover"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}
              >
                <Icon size={24} />
              </div>
              <span className="text-sm font-medium text-gray-dark">{name}</span>
            </button>
          ))}
        </div>

        {/* Trending section skeleton */}
        <h2 className="mt-10 text-lg font-semibold text-gray-dark">
          Trending Now
        </h2>
        <div className="mt-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-gray-stroke p-4 shadow-card"
            >
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-gray-stroke" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-stroke" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-hover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
