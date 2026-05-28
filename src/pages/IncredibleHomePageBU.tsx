import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Send,
  Rocket,
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  Video,
  BookOpen,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "../components/Button";
import lelandLogo from "../assets/Logo.svg";
import lelandCompass from "../assets/leland-compass.svg";

// Imagery
import aiBuilder1 from "../assets/img/ai-builder-l1.avif";
import aiBuilder2 from "../assets/img/ai-builder-l2.avif";
import aiBuilder3 from "../assets/img/ai-builder-l3.avif";
import bootcamp1 from "../assets/placeholder images/bootcamp-1.webp";
import bootcamp2 from "../assets/placeholder images/bootcamp-2.webp";
import categoryIB from "../assets/placeholder images/category images/investment-banking.png";
import categoryLaw from "../assets/placeholder images/category images/law-school.png";
import categoryConsulting from "../assets/placeholder images/category images/management-consulting.png";
import categoryPE from "../assets/placeholder images/category images/private-equity.png";
import categoryPM from "../assets/placeholder images/category images/product-management.png";
import lelandPlus1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import lelandPlus2 from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";
import lelandPlus3 from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";

// Profile photos
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic12 from "../assets/profile photos/pic-12.png";

// Org logos
import orgWharton from "../assets/org-logos/wharton.png";
import orgHBS from "../assets/org-logos/hbs.png";
import orgKellogg from "../assets/org-logos/kellogg.png";
import orgMITSloan from "../assets/org-logos/mit-sloan.png";
import orgColumbia from "../assets/org-logos/columbia.png";
import orgHaas from "../assets/org-logos/haas.png";
import orgTuck from "../assets/org-logos/tuck.png";
import orgFuqua from "../assets/org-logos/fuqua.png";
import orgMcKinsey from "../assets/org-logos/mckinsey.png";
import orgBain from "../assets/org-logos/bain.png";
import orgBCG from "../assets/org-logos/bcg.png";
import orgDeloitte from "../assets/org-logos/deloitte.png";
import orgGoogle from "../assets/org-logos/google.png";
import orgOpenAI from "../assets/org-logos/openai.png";
import orgGoldman from "../assets/org-logos/goldman.png";
import orgMorganStanley from "../assets/org-logos/morgan-stanley.png";
import orgNYUStern from "../assets/org-logos/nyu-stern.png";
import orgAccenture from "../assets/org-logos/accenture.png";

/* ───────────────────────────── data ───────────────────────────── */

type Headline = { pre: string; highlight: string; post: string };

const HEADLINES: Headline[] = [
  { pre: "Do ",            highlight: "Ambitious",  post: " Things." },
  { pre: "Be ",            highlight: "Ambitious",  post: "" },
  { pre: "Dream it. ",     highlight: "Do",         post: " it." },
  { pre: "Unlock Your ",   highlight: "Potential",  post: "" },
  { pre: "Why Not ",       highlight: "You",        post: "?" },
  { pre: "Life is what ",  highlight: "you make",   post: " it." },
  { pre: "Take Back ",     highlight: "Control",    post: " of your Life." },
];

const ROTATING_AMBITIONS = [
  "Get into Stanford GSB",
  "Build an AI product",
  "Land at McKinsey",
  "Start your own company",
  "Crush the GMAT",
  "Become a PM at Google",
  "Break into Private Equity",
  "Get into HBS",
];

const LONGEST_AMBITION = ROTATING_AMBITIONS.reduce((a, b) =>
  a.length >= b.length ? a : b,
);

type QuickChip = {
  key: string;
  icon: any;
  label: string;
  stat: string;
  blurb: string;
  options: string[];
};

const QUICK_CHIPS: QuickChip[] = [
  {
    key: "mba",
    icon: GraduationCap,
    label: "Get into a top MBA",
    stat: "10,000+ admits · 95% placement",
    blurb: "Avg post-MBA salary $200k+. From every background.",
    options: ["Get into HBS", "Get into Stanford GSB", "Get into Wharton", "Crush the GMAT"],
  },
  {
    key: "ai",
    icon: Rocket,
    label: "Become an AI leader",
    stat: "2,400+ builders shipping real AI products",
    blurb: "Live cohorts. Working code. No CS degree required.",
    options: ["AI Builder Bootcamp", "Vibe-code with Claude", "Ship an AI SaaS", "Agents for business"],
  },
  {
    key: "pm",
    icon: Briefcase,
    label: "Land a tech PM role",
    stat: "Senior PMs at Google, Meta, Stripe inside",
    blurb: "End-to-end: from prep to portfolio to offer.",
    options: ["PM at Google", "PM at Meta", "FAANG interview prep", "Portfolio review"],
  },
  {
    key: "founder",
    icon: Sparkles,
    label: "Start a company",
    stat: "$1.4B+ raised by founders who started here",
    blurb: "Founders, VCs, and operators who've actually done it.",
    options: ["Founder office hours", "Get into YC", "Find a co-founder", "Pitch to Sequoia"],
  },
];

const FLYOUT_GROUPS: Array<{
  icon: any;
  title: string;
  accent: string;
  items: string[];
}> = [
  {
    icon: GraduationCap,
    title: "Admissions",
    accent: "text-[#f59e0b]",
    items: [
      "Get into HBS",
      "Get into Stanford GSB",
      "Apply to law school",
      "Crush the GMAT",
      "Get into a top med school",
    ],
  },
  {
    icon: Briefcase,
    title: "Career",
    accent: "text-[#3b82f6]",
    items: [
      "Land at McKinsey",
      "Break into investment banking",
      "Become a PM at a top company",
      "Get promoted to VP",
      "Switch into venture capital",
    ],
  },
  {
    icon: Rocket,
    title: "Build",
    accent: "text-[#15b078]",
    items: [
      "Ship an AI product",
      "Become an AI Leader",
      "Build a $100k SaaS",
      "Learn to code with AI",
      "Start your own company",
    ],
  },
  {
    icon: Heart,
    title: "Life",
    accent: "text-[#ec4899]",
    items: [
      "Build a personal brand",
      "Move to a new city",
      "Get out of a career rut",
      "Find a mentor",
      "Own your future",
    ],
  },
];

const LIVE_NOW = [
  {
    title: "Cracking the MBB Case in 2026",
    host: "Sarah Chen · ex-McKinsey EM",
    avatar: pic2,
    cover: bootcamp1,
    watching: 412,
    tag: "Consulting",
  },
  {
    title: "AI Builder Live: Shipping with Claude",
    host: "Marcus Rivera · AI Lead, OpenAI",
    avatar: pic5,
    cover: aiBuilder2,
    watching: 1287,
    tag: "AI Builder",
  },
  {
    title: "Inside the HBS Round 1 Read",
    host: "Priya Singh · ex-HBS AdCom",
    avatar: pic7,
    cover: bootcamp2,
    watching: 296,
    tag: "Admissions",
  },
  {
    title: "Quant Interview Brain-Teasers",
    host: "Daniel Park · Citadel PM",
    avatar: pic3,
    cover: categoryPE,
    watching: 188,
    tag: "Finance",
  },
];

const BUILDER_CLASSES = [
  {
    title: "AI Builder Bootcamp",
    sub: "Ship a real product in 6 weeks. Live cohorts.",
    cover: aiBuilder1,
    pill: "Live cohort",
    stat: "4.9 ★ · 2,400+ builders",
  },
  {
    title: "Vibe-Coding with Claude",
    sub: "Go from zero to shipped — no CS degree required.",
    cover: aiBuilder2,
    pill: "Self-paced",
    stat: "Lifetime access",
  },
  {
    title: "Agents for Business",
    sub: "Automate your work and your team's.",
    cover: aiBuilder3,
    pill: "New",
    stat: "Starts next week",
  },
  {
    title: "GenAI for PMs",
    sub: "The toolkit every product leader needs in 2026.",
    cover: lelandPlus1,
    pill: "Live cohort",
    stat: "4.8 ★ · 980+ alums",
  },
  {
    title: "From Idea to Launch",
    sub: "Build, brand, and launch your first AI SaaS.",
    cover: lelandPlus2,
    pill: "Cohort",
    stat: "Founders welcome",
  },
];

const EXPERT_COACHES = [
  { name: "Samantha L.", role: "Goldman → HBS → VC", avatar: pic1, sub: "MBA · Finance", price: "$240/hr" },
  { name: "John K.", role: "ex-McKinsey EM", avatar: pic4, sub: "Consulting · MBB", price: "$280/hr" },
  { name: "Priya R.", role: "Stanford GSB AdCom", avatar: pic7, sub: "MBA Admissions", price: "$320/hr" },
  { name: "Marcus T.", role: "Staff PM · Google", avatar: pic5, sub: "Product · Tech", price: "$220/hr" },
  { name: "Aisha M.", role: "Partner at Sequoia", avatar: pic8, sub: "VC · Founders", price: "$400/hr" },
  { name: "David O.", role: "ex-OpenAI eng lead", avatar: pic6, sub: "AI · Engineering", price: "$300/hr" },
  { name: "Lena W.", role: "HBS '24 · IB → PE", avatar: pic9, sub: "Finance · MBA", price: "$190/hr" },
];

const COMMUNITIES = [
  { title: "MBA Class of 2027", members: "4,820 members", cover: categoryConsulting, color: "from-blue-500/70 to-blue-700/70" },
  { title: "AI Builders", members: "12,400 members", cover: aiBuilder1, color: "from-emerald-500/70 to-emerald-700/70" },
  { title: "PM Aspirants", members: "3,210 members", cover: categoryPM, color: "from-purple-500/70 to-purple-700/70" },
  { title: "IB / PE / HF", members: "5,640 members", cover: categoryIB, color: "from-amber-500/70 to-amber-700/70" },
  { title: "Law School '27", members: "2,180 members", cover: categoryLaw, color: "from-rose-500/70 to-rose-700/70" },
  { title: "Founders Circle", members: "1,940 members", cover: lelandPlus3, color: "from-orange-500/70 to-orange-700/70" },
];

const AMBITION_TILES = [
  { label: "Get into HBS", icon: "🎓", grad: "from-[#0f3a2d] to-[#0a5c3f]" },
  { label: "Land at McKinsey", icon: "💼", grad: "from-[#1e3a8a] to-[#3b82f6]" },
  { label: "Ship an AI product", icon: "🤖", grad: "from-[#064e3b] to-[#10b981]" },
  { label: "Crush the GMAT", icon: "📈", grad: "from-[#7c2d12] to-[#f97316]" },
  { label: "Get into law school", icon: "⚖️", grad: "from-[#581c87] to-[#a855f7]" },
  { label: "Become a PM", icon: "🚀", grad: "from-[#0e7490] to-[#06b6d4]" },
  { label: "Break into VC", icon: "💎", grad: "from-[#831843] to-[#ec4899]" },
  { label: "Start a company", icon: "🔥", grad: "from-[#92400e] to-[#f59e0b]" },
  { label: "Get promoted", icon: "📊", grad: "from-[#1f2937] to-[#4b5563]" },
  { label: "Move into PE", icon: "🏛️", grad: "from-[#365314] to-[#84cc16]" },
  { label: "Become an AI leader", icon: "✨", grad: "from-[#1e1b4b] to-[#6366f1]" },
  { label: "Build a personal brand", icon: "🎙️", grad: "from-[#7f1d1d] to-[#ef4444]" },
];

const TESTIMONIALS = [
  {
    quote:
      "I got into HBS, Stanford, AND Wharton. Three years of dreaming, six months on Leland.",
    name: "Maya P.",
    role: "HBS '27",
    avatar: pic10,
  },
  {
    quote:
      "I shipped a real AI product in 8 weeks and quit my job a month later. Leland made it actually happen.",
    name: "Andre S.",
    role: "Founder, Loomly AI",
    avatar: pic11,
  },
  {
    quote:
      "I went from rejected to McKinsey offer. My expert saw everything the interviewer would see.",
    name: "Karen J.",
    role: "Associate, McKinsey",
    avatar: pic12,
  },
];

const ORG_LOGOS = [
  orgHBS, orgWharton, orgKellogg, orgMITSloan, orgColumbia, orgHaas,
  orgTuck, orgFuqua, orgNYUStern, orgMcKinsey, orgBain, orgBCG,
  orgDeloitte, orgGoogle, orgOpenAI, orgGoldman, orgMorganStanley, orgAccenture,
];

/* ───────────────────────────── component ───────────────────────────── */

export default function IncredibleHomePageBU() {
  useEffect(() => {
    document.title = "Leland — Do Ambitious Things (BU)";
  }, []);

  return (
    <div className="relative min-h-screen bg-[#06231b] text-white overflow-x-hidden">
      <Hero />
      <LivePeekStrip />
      <SectionDivider />
      <WhatYouCanDo />
      <BuilderCarousel />
      <ExpertsCarousel />
      <CommunitiesGrid />
      <SocialProofMarquee />
      <AmbitionsWall />
      <Testimonials />
      <StatsBar />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ───────────────────────────── hero ───────────────────────────── */

function Hero() {
  const [rotIndex, setRotIndex] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const flyoutRef = useRef<HTMLDivElement | null>(null);
  const { handlers: spotlight, overlay: spotlightOverlay } = useSpotlight({
    size: 720,
    color: "rgba(160,250,210,0.15)",
  });

  useEffect(() => {
    const t = setInterval(() => {
      setRotIndex((i) => (i + 1) % ROTATING_AMBITIONS.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  // Close flyout on outside click
  useEffect(() => {
    if (!flyoutOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!flyoutRef.current) return;
      if (!flyoutRef.current.contains(e.target as Node)) setFlyoutOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [flyoutOpen]);

  return (
    <section
      {...spotlight}
      className="relative isolate flex min-h-[100svh] flex-col"
    >
      <AuroraBackground />
      {spotlightOverlay}

      {/* Logo top-right */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <div className="flex items-center gap-2 opacity-80">
          <span className="flex h-2 w-2 rounded-full bg-[#15b078]">
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-[#15b078] opacity-75" />
          </span>
          <span className="text-[13px] font-medium tracking-wide text-white/70">
            8,217 ambitions started this week
          </span>
        </div>
        <Link to="/" className="group inline-flex items-center gap-2">
          <img
            src={lelandLogo}
            alt="Leland"
            className="h-6 md:h-7"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </Link>
      </div>

      {/* Hero body */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-6 pt-4 pb-32 text-center md:px-12 md:pt-6 md:pb-40">
        {/* Social-proof eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.07] px-3 py-1.5 pr-5 text-[13px] text-white/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <div className="flex -space-x-2">
            {[pic1, pic2, pic3, pic4, pic5].map((p, i) => (
              <img
                key={i}
                src={p}
                alt=""
                className="h-6 w-6 rounded-full border-2 border-[#0a352a] object-cover"
              />
            ))}
          </div>
          <span className="font-medium">
            Join 200,000 people building their future
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="inline-flex items-center gap-1 font-medium">
            <Star size={13} className="fill-[#fbbf24] text-[#fbbf24]" />
            4.9
          </span>
        </motion.div>

        {/* Headline (swappable via bottom-right control) */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {(() => {
              const h = HEADLINES[headlineIndex];
              return (
                <motion.h1
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="font-medium tracking-[-0.02em] text-white"
                  style={{ fontSize: "clamp(48px, 8vw, 112px)", lineHeight: 0.98 }}
                >
                  {h.pre}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#9ff2c8] via-[#15b078] to-[#5eead4] bg-clip-text text-transparent">
                      {h.highlight}
                    </span>
                    <motion.span
                      aria-hidden
                      className="absolute -inset-x-2 -bottom-1 h-[3px] origin-left rounded-full bg-gradient-to-r from-[#15b078] to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.55, ease: "easeOut" }}
                    />
                  </span>
                  {h.post}
                </motion.h1>
              );
            })()}
          </AnimatePresence>
        </div>

        {/* Rotating subline — single tight statement */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-5 max-w-[960px] font-medium leading-[1.25] tracking-[-0.01em] text-white/85"
          style={{ fontSize: "clamp(20px, 2.3vw, 30px)" }}
        >
          Whether you want to{" "}
          <span className="relative inline-block whitespace-nowrap align-baseline">
            {/* invisible sizer: gives the slot the width of the longest variant
                AND a real text baseline so it aligns with surrounding copy */}
            <span aria-hidden className="invisible font-semibold">
              {LONGEST_AMBITION}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={rotIndex}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute left-0 right-0 top-0 text-center font-semibold text-[#9ff2c8]"
              >
                {ROTATING_AMBITIONS[rotIndex]}
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          — Leland gets you there.
        </motion.p>

        {/* AI input + flyout */}
        <motion.div
          ref={flyoutRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative z-30 mt-10 w-full max-w-[820px]"
        >
          {/* Input + flyout share a positioning context so the flyout
              anchors directly under the input box (not the chip row). */}
          <div className="relative">
            <div
              onMouseEnter={() => setFlyoutOpen(true)}
              onFocus={() => setFlyoutOpen(true)}
              className={`group relative flex items-center gap-3 rounded-2xl border bg-white/95 px-3 py-2.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all ${
                flyoutOpen ? "border-[#15b078]/50 ring-4 ring-[#15b078]/20" : "border-white/40"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a5c3f] to-[#15b078]">
                <Sparkles size={18} className="text-white" />
              </div>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask Leland AI… e.g. "${ROTATING_AMBITIONS[rotIndex]}"`}
                className="flex-1 bg-transparent text-[16px] text-gray-dark placeholder:text-[#888] focus:outline-none md:text-[18px]"
              />
              <Button size="md" variant="primary" rounded="rounded-xl" className="!px-4">
                <Send size={16} />
                <span className="hidden sm:inline">Get started</span>
              </Button>
            </div>

            {/* Flyout — anchored directly under the input box, overlays chips
                via z-50 so the mouse path from input → flyout never crosses
                a chip pill. */}
            <AnimatePresence>
              {flyoutOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-1/2 top-[calc(100%+6px)] z-50 w-[min(94vw,1040px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-[#0c1f17]/97 p-5 text-left shadow-2xl backdrop-blur-xl md:p-6"
                >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/55">
                    Pick a path — Leland AI takes it from there
                  </p>
                  <button
                    onClick={() => setFlyoutOpen(false)}
                    className="text-[12px] text-white/50 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  {FLYOUT_GROUPS.map((g) => (
                    <div key={g.title}>
                      <div className="mb-2 flex items-center gap-2">
                        <g.icon size={16} className={g.accent} />
                        <p className="text-[14px] font-semibold text-white">{g.title}</p>
                      </div>
                      <ul className="space-y-1">
                        {g.items.map((it) => (
                          <li key={it}>
                            <button
                              onClick={() => {
                                setInputValue(it);
                                setFlyoutOpen(false);
                              }}
                              className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[14px] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                            >
                              <span>{it}</span>
                              <ArrowRight
                                size={14}
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                              />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-[13px] text-white/75">
                    <Zap size={14} className="text-[#fbbf24]" />
                    Not sure yet?
                  </div>
                  <Button size="sm" variant="white">
                    Take the 2-min compass quiz
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Chips → expand into mini-cards on hover. Rendered AFTER the
              input/flyout wrapper so the flyout (z-50) overlays them when open. */}
          <QuickChipGrid
            setInputValue={setInputValue}
            closeFlyout={() => setFlyoutOpen(false)}
          />
        </motion.div>

      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 flex justify-center pb-3 text-[11px] uppercase tracking-[0.28em] text-white/40"
      >
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          ↓ See what&rsquo;s happening right now
        </motion.span>
      </motion.div>

      {/* Headline cycler — bottom-right */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-5 right-5 z-30 flex items-center gap-0.5 rounded-full border border-white/15 bg-white/[0.06] px-1.5 py-1 text-white/65 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md md:bottom-7 md:right-7"
      >
        <button
          aria-label="Previous headline"
          onClick={() =>
            setHeadlineIndex(
              (i) => (i - 1 + HEADLINES.length) % HEADLINES.length
            )
          }
          className="rounded-full p-1.5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="select-none px-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
          Headline {headlineIndex + 1}/{HEADLINES.length}
        </span>
        <button
          aria-label="Next headline"
          onClick={() =>
            setHeadlineIndex((i) => (i + 1) % HEADLINES.length)
          }
          className="rounded-full p-1.5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronRight size={14} />
        </button>
      </motion.div>
    </section>
  );
}

/* ─────────────── expandable quick-chip grid ─────────────── */

function QuickChipGrid({
  setInputValue,
  closeFlyout,
}: {
  setInputValue: (s: string) => void;
  closeFlyout: () => void;
}) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  return (
    <div className="mx-auto mt-5 grid w-full max-w-[820px] grid-cols-2 items-start gap-2.5 md:grid-cols-4">
      {QUICK_CHIPS.map((chip) => (
        <QuickChipCard
          key={chip.key}
          chip={chip}
          isHover={hoveredKey === chip.key}
          onEnter={() => {
            setHoveredKey(chip.key);
            closeFlyout();
          }}
          onLeave={() => setHoveredKey(null)}
          setInputValue={setInputValue}
        />
      ))}
    </div>
  );
}

function QuickChipCard({
  chip,
  isHover,
  onEnter,
  onLeave,
  setInputValue,
}: {
  chip: QuickChip;
  isHover: boolean;
  onEnter: () => void;
  onLeave: () => void;
  setInputValue: (s: string) => void;
}) {
  const Icon = chip.icon;
  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        onClick={() => setInputValue(chip.label)}
        className={`relative z-10 flex w-full items-center justify-center gap-2 rounded-full border bg-white/15 px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all ${
          isHover
            ? "scale-[1.04] border-white/70 bg-white/25"
            : "border-white/40 hover:border-white/70 hover:bg-white/25"
        }`}
      >
        <Icon size={15} className="shrink-0 text-[#9ff2c8]" />
        <span className="truncate">{chip.label}</span>
      </button>

      <AnimatePresence>
        {isHover && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ width: "min(300px, calc(100vw - 32px))" }}
            className="absolute left-1/2 top-[calc(100%+8px)] z-50 -translate-x-1/2 rounded-2xl border border-white/20 bg-[#0d2620]/95 p-4 text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          >
            <div className="mb-3 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2">
              <p className="text-[12px] font-semibold leading-tight text-[#9ff2c8]">
                {chip.stat}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-white/80">
                {chip.blurb}
              </p>
            </div>
            <ul className="space-y-0.5">
              {chip.options.map((opt) => (
                <li key={opt}>
                  <button
                    onClick={() => setInputValue(opt)}
                    className="group/opt flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <span>{opt}</span>
                    <ArrowRight
                      size={12}
                      className="opacity-40 transition-opacity group-hover/opt:opacity-90"
                    />
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setInputValue(chip.label)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#15b078] px-3 py-2 text-[13px] font-semibold text-white shadow-md transition-colors hover:bg-[#12a06c]"
            >
              Start this path
              <ArrowRight size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── mouse-following spotlight hook ─────────────── */

function useSpotlight(opts?: { size?: number; color?: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const size = opts?.size ?? 600;
  const color = opts?.color ?? "rgba(94,234,212,0.30)";

  const handlers = {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    onMouseLeave: () => setPos(null),
  };

  // Valid CSS: `radial-gradient(circle <radius> at <x> <y>, stops)`
  const bg =
    pos !== null
      ? `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, ${color} 0%, rgba(21,176,120,0.08) 35%, transparent 70%)`
      : "";

  const overlay = (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
      style={{
        opacity: pos !== null ? 1 : 0,
        backgroundImage: bg,
      }}
    />
  );

  return { handlers, overlay };
}

/* ───────────────────────────── aurora bg ───────────────────────────── */

function AuroraBackground() {
  // animated drifting blurred radial blobs
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#06231b]">
      {/* base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#062b1f] via-[#08402e] to-[#04150f]" />

      {/* aurora blobs */}
      <motion.div
        aria-hidden
        className="absolute -left-[10%] top-[5%] h-[60vh] w-[60vh] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(21,176,120,0.55), rgba(21,176,120,0))",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-[10%] top-[15%] h-[55vh] w-[55vh] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(94,234,212,0.42), rgba(94,234,212,0))",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, -50, 20, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute left-[30%] bottom-[-10%] h-[70vh] w-[70vh] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(251,191,36,0.18), rgba(251,191,36,0))",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, 30, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#04150f]"
      />
    </div>
  );
}

/* ──────────────────────── live now strip (peek) ──────────────────── */

function LivePeekStrip() {
  return (
    <section className="relative z-10 -mt-2 px-6 pb-14 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-4 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <h2 className="text-[20px] font-medium text-white md:text-[24px]">
              Live on Leland right now
            </h2>
          </div>
          <Link
            to="/events"
            className="text-[13px] font-medium text-white/60 hover:text-white"
          >
            See all live →
          </Link>
        </div>

        <HoverRow items={LIVE_NOW.map((l, i) => ({ key: String(i), ...l }))} renderCard={renderLiveCard} cardWidth={320} />
      </div>
    </section>
  );
}

function renderLiveCard(l: typeof LIVE_NOW[number]) {
  return (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
        <img src={l.cover} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live
        </div>
        <div className="absolute right-3 top-3 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {l.watching.toLocaleString()} watching
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[11px] uppercase tracking-wider text-white/75">{l.tag}</p>
          <p className="mt-1 line-clamp-2 text-[16px] font-medium leading-tight text-white">
            {l.title}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2.5">
        <img src={l.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
        <p className="text-[13px] text-white/70">{l.host}</p>
      </div>
    </>
  );
}

/* ───────────────────────── hover-expand row primitive ─────────────── */

function HoverRow<T extends { key: string }>({
  items,
  renderCard,
  cardWidth = 260,
}: {
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  cardWidth?: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={scrollerRef}
      className="scrollbar-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-2 md:-mx-12 md:px-12"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {items.map((it) => {
        const isHover = hovered === it.key;
        const isOther = hovered && hovered !== it.key;
        return (
          <motion.div
            key={it.key}
            onMouseEnter={() => setHovered(it.key)}
            onMouseLeave={() => setHovered(null)}
            animate={{
              scale: isHover ? 1.035 : isOther ? 0.985 : 1,
              opacity: isOther ? 0.7 : 1,
              y: isHover ? -4 : 0,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="shrink-0"
            style={{ width: cardWidth, scrollSnapAlign: "start" }}
          >
            {renderCard(it)}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────── section divider ──────────────────────── */

function SectionDivider() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
    </div>
  );
}

/* ───────────────────────── "what you can do" ───────────────────── */

function WhatYouCanDo() {
  const items = [
    {
      icon: Sparkles,
      title: "Leland AI",
      desc: "Your always-on guide. Build the plan, draft the essay, run the practice case, get unstuck at midnight.",
      cta: "Talk to Leland AI",
      tone: "from-[#0a5c3f] to-[#15b078]",
    },
    {
      icon: Users,
      title: "Real experts",
      desc: "1,800+ vetted experts who&rsquo;ve actually done it — McKinsey, HBS, Stanford, OpenAI, Goldman.",
      cta: "Browse experts",
      tone: "from-[#1e3a8a] to-[#3b82f6]",
    },
    {
      icon: Video,
      title: "Live classes & bootcamps",
      desc: "Cohort-based, live, taught by the best. Ship a product. Crack the case. Nail the essay.",
      cta: "See what&rsquo;s live",
      tone: "from-[#7c2d12] to-[#f59e0b]",
    },
    {
      icon: BookOpen,
      title: "Leland+ library",
      desc: "Every framework, template, and on-demand course you&rsquo;ll need. Owned, not rented.",
      cta: "Explore Leland+",
      tone: "from-[#581c87] to-[#a855f7]",
    },
  ];
  const { handlers, overlay } = useSpotlight();
  return (
    <section {...handlers} className="relative px-6 py-20 md:px-12">
      {overlay}
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="WHY LELAND"
          title="Everything you need. None of the noise."
          sub="A platform, a community, and an AI that all want you to win."
        />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <motion.div
              key={i.title}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <div
                className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${i.tone} opacity-30 blur-2xl transition-opacity group-hover:opacity-60`}
              />
              <div
                className={`relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${i.tone}`}
              >
                <i.icon size={20} className="text-white" />
              </div>
              <h3 className="relative text-[20px] font-medium text-white">{i.title}</h3>
              <p
                className="relative mt-2 text-[14px] leading-snug text-white/70"
                dangerouslySetInnerHTML={{ __html: i.desc }}
              />
              <button className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#9ff2c8] hover:text-white">
                {i.cta}
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9ff2c8]/80">
          {eyebrow}
        </p>
        <h2
          className="mt-2 font-medium tracking-[-0.01em] text-white"
          style={{ fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.05 }}
        >
          {title}
        </h2>
        {sub && <p className="mt-2 max-w-[640px] text-[15px] text-white/65">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ───────────────────────── builder carousel ───────────────────── */

function BuilderCarousel() {
  const { handlers, overlay } = useSpotlight();
  return (
    <section {...handlers} className="relative px-6 pb-10 md:px-12">
      {overlay}
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="AI BUILDER CLASSES"
          title="Build something real."
          sub="Live cohorts and on-demand bootcamps that turn ambition into shipped work."
          right={
            <Link
              to="/courses"
              className="text-[13px] font-medium text-white/60 hover:text-white"
            >
              All bootcamps →
            </Link>
          }
        />
        <div className="mt-8">
          <HoverRow
            items={BUILDER_CLASSES.map((c, i) => ({ key: String(i), ...c }))}
            renderCard={(c) => (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={c.cover} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-gray-dark">
                    {c.pill}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-medium text-white">{c.title}</p>
                  <p className="mt-1 line-clamp-2 text-[13px] text-white/65">
                    {c.sub}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-white/55">
                    <span>{c.stat}</span>
                    <span className="inline-flex items-center gap-1 text-[#9ff2c8]">
                      Enroll <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            )}
            cardWidth={300}
          />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── experts carousel ───────────────────── */

function ExpertsCarousel() {
  const { handlers, overlay } = useSpotlight();
  return (
    <section {...handlers} className="relative px-6 pb-10 md:px-12">
      {overlay}
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="EXPERTS"
          title="People who&rsquo;ve already done it."
          sub="Vetted experts from McKinsey, HBS, Stanford GSB, Google, OpenAI, Goldman, and more."
          right={
            <Link
              to="/browse"
              className="text-[13px] font-medium text-white/60 hover:text-white"
            >
              Browse all 1,800+ experts →
            </Link>
          }
        />
        <div className="mt-8">
          <HoverRow
            items={EXPERT_COACHES.map((c, i) => ({ key: String(i), ...c }))}
            renderCard={(c) => (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={c.avatar} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute inset-x-3 bottom-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/65">
                      {c.sub}
                    </p>
                    <p className="mt-0.5 text-[16px] font-medium text-white">{c.name}</p>
                    <p className="mt-0.5 text-[13px] text-white/75">{c.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="inline-flex items-center gap-1 text-[12px] text-white/65">
                    <Star size={12} className="fill-[#fbbf24] text-[#fbbf24]" />
                    4.9 · 120 reviews
                  </span>
                  <span className="text-[13px] font-medium text-white">{c.price}</span>
                </div>
              </div>
            )}
            cardWidth={240}
          />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── communities ───────────────────── */

function CommunitiesGrid() {
  return (
    <section className="relative px-6 pb-16 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="COMMUNITIES"
          title="Find your people."
          sub="The class of '27. The AI builders. The founders. Everyone trying to do something hard, doing it together."
        />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {COMMUNITIES.map((c) => (
            <motion.div
              key={c.title}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
            >
              <img
                src={c.cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.color}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-3 bottom-3">
                <p className="text-[14px] font-medium leading-tight text-white">
                  {c.title}
                </p>
                <p className="mt-0.5 text-[11px] text-white/80">{c.members}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── logo marquee ───────────────────── */

function SocialProofMarquee() {
  // Duplicate the logo set to enable infinite-loop marquee
  const row = [...ORG_LOGOS, ...ORG_LOGOS];
  return (
    <section className="relative py-14">
      <div className="mx-auto mb-6 max-w-[1400px] px-6 text-center md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
          Leland alums landed at
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#06231b] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#06231b] to-transparent"
          aria-hidden
        />
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {row.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-9 w-auto shrink-0 opacity-70 grayscale brightness-200 contrast-50"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.55 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── ambitions wall ───────────────────── */

function AmbitionsWall() {
  const { handlers, overlay } = useSpotlight({ size: 760, color: "rgba(251,191,36,0.10)" });
  return (
    <section {...handlers} className="relative px-6 py-20 md:px-12">
      {overlay}
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="WHAT WILL YOU DO?"
          title="There&rsquo;s no reason you can&rsquo;t do this."
          sub="Whatever &lsquo;this&rsquo; is. Pick a tile — or pick three. Leland helps with all of them."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {AMBITION_TILES.map((t) => (
            <motion.button
              key={t.label}
              whileHover={{ y: -4, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`group relative aspect-[5/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${t.grad} p-5 text-left`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="text-3xl drop-shadow-md">{t.icon}</span>
                <div>
                  <p className="text-[18px] font-medium leading-tight text-white">
                    {t.label}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                    Start this path <ArrowRight size={12} />
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── testimonials ───────────────────── */

function Testimonials() {
  const { handlers, overlay } = useSpotlight();
  return (
    <section {...handlers} className="relative px-6 py-20 md:px-12">
      {overlay}
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="STORIES"
          title="Real wins from real people."
        />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
            >
              <span className="absolute right-4 top-2 select-none font-serif text-[88px] leading-none text-white/10">
                &ldquo;
              </span>
              <p className="relative text-[18px] font-medium leading-snug text-white">
                {t.quote}
              </p>
              <div className="relative mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-[14px] font-medium text-white">{t.name}</p>
                  <p className="text-[12px] text-white/60">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── stats bar ───────────────────── */

function StatsBar() {
  const stats = [
    { v: "200,000+", l: "ambitious people on Leland" },
    { v: "$1.4B+", l: "in scholarships & offers earned" },
    { v: "1,800+", l: "vetted experts" },
    { v: "4.9 / 5", l: "across 28,000+ reviews" },
  ];
  const { handlers, overlay } = useSpotlight();
  return (
    <section {...handlers} className="relative px-6 py-14 md:px-12">
      {overlay}
      <div className="relative mx-auto max-w-[1400px] rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 md:p-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <p
                className="font-medium tracking-[-0.02em] text-white"
                style={{ fontSize: "clamp(30px, 3.5vw, 48px)", lineHeight: 1 }}
              >
                {s.v}
              </p>
              <p className="mt-2 text-[13px] text-white/65">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── final CTA ───────────────────── */

function FinalCTA() {
  const [val, setVal] = useState("");
  return (
    <section className="relative px-6 py-24 md:px-12">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0a5c3f] via-[#08402e] to-[#062b1f] p-10 text-center md:p-16">
        <motion.div
          aria-hidden
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#15b078] opacity-40 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#5eead4] opacity-30 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9ff2c8]">
            Make it real
          </p>
          <h2
            className="mt-3 font-medium tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(36px, 5.5vw, 72px)", lineHeight: 1.02 }}
          >
            What will you do?
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[16px] text-white/75 md:text-[18px]">
            You don&rsquo;t have to do it alone. Leland&rsquo;s AI, experts,
            and community are here to make whatever you&rsquo;re after — real.
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-[640px] items-center gap-2 rounded-2xl border border-white/30 bg-white/95 px-3 py-2.5 shadow-2xl">
            <Sparkles size={18} className="ml-1 text-[#15b078]" />
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Type your ambition…"
              className="flex-1 bg-transparent text-[16px] text-gray-dark placeholder:text-[#888] focus:outline-none"
            />
            <Button size="md" variant="primary" rounded="rounded-xl">
              Start
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[12px] text-white/55">
            <span>Free to start</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>No credit card</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>Live human help within 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── footer ───────────────────── */

function Footer() {
  return (
    <footer className="relative px-6 pb-14 pt-6 md:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img
            src={lelandCompass}
            alt=""
            className="h-6 w-6"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <img
            src={lelandLogo}
            alt="Leland"
            className="h-5"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
        <p className="text-[12px] text-white/45">
          © 2026 Leland · Built for the ambitious.
        </p>
      </div>
    </footer>
  );
}
