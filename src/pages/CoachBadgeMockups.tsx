import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";

import pic6 from "../assets/profile photos/pic-6.png";
import cover from "../assets/img/cover-images/cover-image-7.png";
import verifiedIcon from "../assets/icons/verified-new.svg";
import starIcon from "../assets/icons/star.svg";
import atlassianLogo from "../assets/logos/atlassian.png";
import yaleLogo from "../assets/logos/yale.png";

import badgeQuickResponder from "../assets/icons/quick-responder.svg";
import badgeCalendarExperience from "../assets/icons/calendar-experience.svg";
import badgeRisingStar from "../assets/icons/rising-star.svg";
import badgeBriefcase from "../assets/icons/briefcase.svg";
import badgeGraduateHat from "../assets/icons/graduate-hat.svg";
import badgeHandshake from "../assets/icons/handshake.svg";
import badgeInterviewer from "../assets/icons/interviewer.svg";
import badgeCustomerFavorite from "../assets/icons/customer-favorite.svg";

// ---------------------------------------------------------------------------
// Badge data. In a real system a coach can earn many of these and choose which
// to feature; `tint` is a soft background used by the chip/medallion paradigms.
// ---------------------------------------------------------------------------
type Badge = {
  id: string;
  icon?: string;
  emoji?: string;
  label: string; // short form for compact paradigms
  headline: string; // full form
  subheadline: string;
  tint: string;
};

const BADGES: Badge[] = [
  { id: "topExpert", emoji: "🏆", label: "Top Expert", headline: "Top Expert", subheadline: "Recognized for consistently outstanding coaching outcomes", tint: "#FBF3DC" },
  { id: "customerFavorite", icon: badgeCustomerFavorite, label: "Customer favorite", headline: "Customer favorite", subheadline: "In the top 10% of MBA experts on Leland", tint: "#E8F3EC" },
  { id: "quickResponder", icon: badgeQuickResponder, label: "Quick responder", headline: "Quick responder", subheadline: "Usually responds within an hour", tint: "#E9F1FA" },
  { id: "admissionsStaff", icon: badgeGraduateHat, label: "Admissions Committee", headline: "Admissions Committee", subheadline: "Former AdCom staff at Yale University", tint: "#F0ECF9" },
  { id: "experience", icon: badgeCalendarExperience, label: "10 yrs experience", headline: "10 years of experience", subheadline: "Proven track record of success", tint: "#F3F0EA" },
  { id: "risingStar", icon: badgeRisingStar, label: "Rising star", headline: "Rising star", subheadline: "Fast-growing favorite on Leland", tint: "#FBEEF0" },
  { id: "hiringManager", icon: badgeHandshake, label: "Hiring Manager", headline: "Hiring Manager", subheadline: "At Boston Consulting Group", tint: "#E9F1FA" },
  { id: "interviewer", icon: badgeInterviewer, label: "Interviewer", headline: "Interviewer", subheadline: "At Boston Consulting Group", tint: "#F3F0EA" },
  { id: "director", icon: badgeBriefcase, label: "Director-level", headline: "Director-level", subheadline: "Experienced in team and org leadership", tint: "#F0ECF9" },
];

function BadgeArt({ badge, size }: { badge: Badge; size: number }) {
  if (badge.emoji) {
    return <span className="flex shrink-0 items-center justify-center leading-none" style={{ width: size, height: size, fontSize: size * 0.82 }}>{badge.emoji}</span>;
  }
  return <img src={badge.icon} alt="" className="shrink-0" style={{ width: size, height: size }} />;
}

// ===========================================================================
// Paradigm 1 — Chips / pills (wrapping, +N overflow)
// ===========================================================================
function VariantPills({ onShowAll }: { onShowAll: () => void }) {
  const shown = BADGES.slice(0, 5);
  const extra = BADGES.length - shown.length;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {shown.map((b) => (
        <span
          key={b.id}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-stroke bg-white py-1.5 pl-2 pr-3 text-[13px] font-medium text-gray-dark"
        >
          <BadgeArt badge={b} size={16} />
          {b.label}
        </span>
      ))}
      {extra > 0 && (
        <button
          onClick={onShowAll}
          className="inline-flex cursor-pointer items-center rounded-full border border-gray-stroke bg-[#f7f7f7] px-3 py-1.5 text-[13px] font-medium text-gray-light transition-colors hover:bg-gray-hover"
        >
          +{extra} more
        </button>
      )}
    </div>
  );
}

// ===========================================================================
// Paradigm 2 — Icon medallions (max density, tap for label)
// ===========================================================================
function VariantMedallions({ onShowAll }: { onShowAll: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const shown = BADGES.slice(0, 6);
  const extra = BADGES.length - shown.length;
  const activeBadge = BADGES.find((b) => b.id === active);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        {shown.map((b) => (
          <button
            key={b.id}
            onMouseEnter={() => setActive(b.id)}
            onMouseLeave={() => setActive((a) => (a === b.id ? null : a))}
            onClick={() => setActive((a) => (a === b.id ? null : b.id))}
            aria-label={b.headline}
            className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full ring-1 ring-black/5 transition-transform hover:scale-105 ${active === b.id ? "scale-105" : ""}`}
            style={{ backgroundColor: b.tint }}
          >
            <BadgeArt badge={b} size={22} />
          </button>
        ))}
        {extra > 0 && (
          <button
            onClick={onShowAll}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] text-[13px] font-semibold text-gray-light ring-1 ring-black/5 transition-colors hover:bg-gray-hover"
          >
            +{extra}
          </button>
        )}
      </div>
      <div className="mt-2 h-[18px]">
        {activeBadge && (
          <p className="text-[13px] leading-tight text-gray-light">
            <span className="font-semibold text-gray-dark">{activeBadge.headline}</span> · {activeBadge.subheadline}
          </p>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// Paradigm 3 — Featured cards (rich, horizontal scroll)
// ===========================================================================
function VariantCards({ onShowAll }: { onShowAll: () => void }) {
  const shown = BADGES.slice(0, 3);
  return (
    <div>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shown.map((b) => (
          <div
            key={b.id}
            className="flex w-[220px] shrink-0 items-start gap-3 rounded-xl border border-gray-stroke bg-white p-3.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: b.tint }}>
              <BadgeArt badge={b} size={24} />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-tight text-gray-dark">{b.headline}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-gray-light">{b.subheadline}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onShowAll}
        className="mt-2.5 cursor-pointer text-[13px] font-semibold text-gray-dark underline-offset-2 hover:underline"
      >
        View all {BADGES.length} badges →
      </button>
    </div>
  );
}

// ===========================================================================
// Paradigm 4 — Spotlight + count (one marquee badge, rest behind a link)
// ===========================================================================
function VariantSpotlight({ onShowAll }: { onShowAll: () => void }) {
  const primary = BADGES[0];
  const extra = BADGES.length - 1;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-4" style={{ backgroundColor: primary.tint }}>
        <BadgeArt badge={primary} size={28} />
        <div>
          <p className="text-[14px] font-semibold leading-tight text-gray-dark">{primary.headline}</p>
          <p className="mt-0.5 text-[12.5px] leading-tight text-[#6b6b6b]">{primary.subheadline}</p>
        </div>
      </div>
      <button
        onClick={onShowAll}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-stroke bg-white px-3.5 py-2.5 transition-colors hover:bg-gray-hover"
      >
        <span className="flex -space-x-2">
          {BADGES.slice(1, 4).map((b) => (
            <span key={b.id} className="flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white" style={{ backgroundColor: b.tint }}>
              <BadgeArt badge={b} size={13} />
            </span>
          ))}
        </span>
        <span className="text-[13px] font-medium text-gray-dark">+{extra} more</span>
      </button>
    </div>
  );
}

// ===========================================================================
// Paradigm 5 — Inline meta strip (lightest touch, matches credentials row)
// ===========================================================================
function VariantInline({ onShowAll }: { onShowAll: () => void }) {
  const shown = BADGES.slice(0, 4);
  const extra = BADGES.length - shown.length;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px] text-gray-light">
      {shown.map((b) => (
        <span key={b.id} className="inline-flex items-center gap-1.5">
          <BadgeArt badge={b} size={16} />
          <span className="font-medium text-gray-dark">{b.label}</span>
        </span>
      ))}
      {extra > 0 && (
        <button onClick={onShowAll} className="cursor-pointer font-medium text-gray-dark underline-offset-2 hover:underline">
          +{extra} more
        </button>
      )}
    </div>
  );
}

// ===========================================================================
// Shared "all badges" sheet
// ===========================================================================
function AllBadgesSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-[560px] rounded-t-2xl bg-white p-5 sm:rounded-2xl"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-serif text-[20px] font-medium text-gray-dark">Badges</h3>
              <button onClick={onClose} aria-label="Close" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover">✕</button>
            </div>
            <p className="mb-4 text-[13px] text-gray-light">Samantha has earned {BADGES.length} badges. Coaches choose which to feature on their profile.</p>
            <div className="grid max-h-[60vh] grid-cols-1 gap-x-5 gap-y-4 overflow-y-auto sm:grid-cols-2">
              {BADGES.map((b) => (
                <div key={b.id} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: b.tint }}>
                    <BadgeArt badge={b} size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold leading-tight text-gray-dark">{b.headline}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-gray-light">{b.subheadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ===========================================================================
// Hero shell (faithful to the real profile hero) with a swappable badge slot
// ===========================================================================
const VARIANTS = [
  { id: "pills", label: "Chips", blurb: "Wrapping pills with icon + short label. Scans fast, familiar pattern, overflow collapses to “+N more”. Best all-round default." },
  { id: "medallions", label: "Medallions", blurb: "Icon-only circles — maximum density. Fits many badges in little space; label appears on hover/tap. Most visual, least text." },
  { id: "cards", label: "Featured cards", blurb: "Up to 3 rich cards with headline + description. Most prominent and legible; great for the 2–3 badges a coach most wants to sell." },
  { id: "spotlight", label: "Spotlight", blurb: "One marquee badge shown in full, the rest stacked behind a “+N” pill. Draws the eye to the single strongest signal." },
  { id: "inline", label: "Inline strip", blurb: "A single meta line matching the credentials row. Lightest footprint — reads as part of the identity, not a separate module." },
] as const;

export default function CoachBadgeMockups() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]["id"]>("pills");
  const [sheetOpen, setSheetOpen] = useState(false);
  const current = VARIANTS.find((v) => v.id === variant)!;

  const renderBadges = () => {
    const props = { onShowAll: () => setSheetOpen(true) };
    switch (variant) {
      case "pills": return <VariantPills {...props} />;
      case "medallions": return <VariantMedallions {...props} />;
      case "cards": return <VariantCards {...props} />;
      case "spotlight": return <VariantSpotlight {...props} />;
      case "inline": return <VariantInline {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f2] pb-24">
      {/* Switcher */}
      <div className="sticky top-0 z-30 border-b border-gray-stroke bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-[760px] px-4 py-3">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-gray-light">Badge placement — hero paradigms</p>
          <div className="flex flex-wrap gap-2">
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${variant === v.id ? "bg-gray-dark text-white" : "bg-[#222222]/5 text-gray-dark hover:bg-[#222222]/10"}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero card */}
      <div className="mx-auto max-w-[760px] px-4 pt-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Cover */}
          <div className="h-[150px] w-full bg-cover bg-center sm:h-[180px]" style={{ backgroundImage: `url(${cover})` }} />
          <div className="px-5 pb-6 sm:px-7">
            {/* Photo */}
            <div className="-mt-10 mb-3">
              <img src={pic6} alt="Samantha Parker" className="h-[88px] w-[88px] rounded-full border-4 border-white object-cover shadow-sm" />
            </div>

            {/* Name + verified */}
            <div className="mb-1.5 flex items-center gap-2">
              <h1 className="font-serif text-[26px] font-medium text-gray-dark">Samantha Parker</h1>
              <img src={verifiedIcon} alt="Verified" className="mt-[2px] h-[19px] w-[19px]" />
            </div>

            {/* Headline */}
            <p className="mb-3 text-[15px] leading-[1.4] text-gray-dark">
              MBA Admissions Coach | Stanford GSB | 100+ M7 Admits
            </p>

            {/* Credentials row */}
            <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] leading-tight text-gray-light">
              <div className="flex items-center gap-[6px]">
                <img src={atlassianLogo} alt="Atlassian" className="h-[18px] w-[18px] rounded" />
                <span>Atlassian</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <img src={yaleLogo} alt="Yale University" className="h-[18px] w-[18px] rounded" />
                <span>Yale University</span>
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-[1px]">
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={starIcon} alt="" className="h-[16px] w-[16px]" />
                ))}
              </div>
              <span className="text-[15px] font-semibold leading-none text-gray-dark">4.9</span>
              <span className="text-[15px] leading-none text-[#707070]">52 Reviews</span>
            </div>

            {/* === BADGE SLOT === */}
            <div className="border-t border-gray-100 pt-4">
              {renderBadges()}
            </div>

            {/* CTA to anchor the hero */}
            <div className="mt-6">
              <Button size="md" variant="primary">Book a free intro call</Button>
            </div>
          </div>
        </div>

        {/* Paradigm note */}
        <div className="mt-4 rounded-xl border border-gray-stroke bg-white p-4">
          <p className="text-[14px] font-semibold text-gray-dark">{current.label}</p>
          <p className="mt-1 text-[13.5px] leading-snug text-gray-light">{current.blurb}</p>
        </div>
      </div>

      <AllBadgesSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
