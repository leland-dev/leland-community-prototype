import { useEffect, useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, TrendingUp, GraduationCap, ArrowRight } from "lucide-react";

import {
  HERO_COPY,
  REVIEW_STATS,
  ORG_LOGOS,
  GLASS_PILL,
  type Branch,
} from "../data";
import { SharpStar } from "./flowUI";

import face1 from "../../../assets/profile photos/pic-9.png";
import face2 from "../../../assets/profile photos/pic-10.png";
import face3 from "../../../assets/profile photos/pic-11.png";
import face4 from "../../../assets/profile photos/pic-12.png";

const FACEPILE = [face1, face2, face3, face4];

/* ─────────────── pills (mirror the homepage HERO_PILLS) ─────────────── */

type Pill = {
  label: string;
  Icon: ComponentType<{ size?: number | string; className?: string }>;
  branch?: Branch;
  href?: string;
};

const PILLS: Pill[] = [
  { label: "Build with AI", Icon: Sparkles, branch: "build-with-ai" },
  { label: "Grow your career", Icon: TrendingUp, branch: "grow-career" },
  { label: "Get into school", Icon: GraduationCap, branch: "get-into-school" },
];

/* ─────────────── count-up hook ─────────────── */

function useCountUp(target: number, durationMs: number, enabled: boolean) {
  const [value, setValue] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, enabled]);
  return value;
}

/* ─────────────── logo marquee (mirror homepage LogosBar) ─────────────── */

function LogoMarquee({ reduced, start }: { reduced: boolean; start: boolean }) {
  const row = [...ORG_LOGOS, ...ORG_LOGOS];
  const mask =
    "linear-gradient(to right, transparent, black 5%, black 95%, transparent)";
  return (
    <div
      className="w-full min-w-0 overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div
        className="flex w-max items-center"
        style={
          reduced || !start
            ? undefined
            : { animation: "leland-marquee 60s linear infinite", willChange: "transform" }
        }
      >
        {row.map((logo, i) => (
          <img
            key={`${logo.name}-${i}`}
            src={logo.src}
            alt={i < ORG_LOGOS.length ? logo.name : ""}
            aria-hidden={i >= ORG_LOGOS.length || undefined}
            className="mr-[52px] block w-auto shrink-0 opacity-50"
            style={{ height: logo.height }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────── opener ─────────────── */

export default function Opener({
  onSelectBranch,
  onExpert,
  variant = "full",
  onGetStarted,
  onSignIn,
  animateButtonsOnly,
  light = false,
}: {
  onSelectBranch?: (b: Branch) => void;
  onExpert?: () => void;
  /** "full" = the branching main-flow opener; "getStarted" = the minimal-flow
   *  variant with a single Get-started CTA. Same clouds page, different CTAs. */
  variant?: "full" | "getStarted";
  onGetStarted?: () => void;
  onSignIn?: () => void;
  /** Light theme — ink text/links for docking over a white background instead
   *  of the clouds. Defaults to the on-clouds (white text) treatment. */
  light?: boolean;
  /** When true, the hero (headline, reviews, marquee) renders instantly and
   *  only the goal buttons + links below animate in — used when arriving from
   *  the minimal flow's "Get started", where the page was already on screen. */
  animateButtonsOnly?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const instant = animateButtonsOnly ?? false;
  const reviews = useCountUp(REVIEW_STATS.reviews, 1400, !reduced && !instant);
  const [marqueeStart, setMarqueeStart] = useState(reduced || instant);

  useEffect(() => {
    if (reduced || instant) return;
    const t = window.setTimeout(() => setMarqueeStart(true), 1500);
    return () => window.clearTimeout(t);
  }, [reduced, instant]);

  const ease = [0.22, 1, 0.36, 1] as const;
  const pillClass = GLASS_PILL;
  // Solid light grey (#f4f4f4) — the secondary "Log in" pill.
  const greyPill =
    "flex w-full items-center justify-center gap-2 rounded-full bg-[#f4f4f4] py-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#e9e9e9]";
  // Solid yellow primary pill — same shape/size as the glass pill.
  const yellowPill =
    "flex w-full items-center justify-center gap-2 rounded-full bg-yellow py-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#F3C948]";
  // Theme tokens — ink on white (light) vs. white on clouds (default).
  const rootText = light ? "text-gray-dark" : "text-white";
  const headlineExtra = light ? "" : "drop-shadow-[0_2px_20px_rgba(0,0,0,0.25)]";
  const strongText = light ? "text-gray-dark" : "text-white/90";
  const mutedText = light ? "text-gray-light" : "text-white/60";
  const dividerCls = light ? "bg-black/15" : "bg-white/30";
  const expertText = light ? "text-gray-dark/70" : "text-white/80";
  const linkClass = light
    ? "underline decoration-dotted decoration-[1.5px] decoration-gray-dark/40 underline-offset-[3px] transition-colors hover:text-gray-dark"
    : "underline decoration-dotted decoration-[1.5px] decoration-white/50 underline-offset-[3px] transition-colors hover:text-white";
  const headlineWords = HERO_COPY.headline.split(" ");

  return (
    <div className={`relative flex min-h-[100svh] w-full flex-col px-6 pb-8 pt-[max(5rem,env(safe-area-inset-top))] text-center ${rootText}`}>
      {/* hero block: headline centered upper, CTA cluster pushed lower */}
      <div className="flex flex-1 flex-col items-center">
        {/* headline + subhead — centered in the upper region */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <h1 className={`font-serif text-[46px] leading-[1.02] tracking-[-0.01em] ${headlineExtra}`}>
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={instant ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.24 }}
              >
                {word}
                {i < headlineWords.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </h1>
          {/* review trust row — now directly under the headline */}
          <motion.div
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.2 + headlineWords.length * 0.24 }}
            className="mt-2 flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SharpStar key={i} size={15} className="text-yellow" />
                ))}
              </div>
              <span className={`text-[17px] font-semibold tabular-nums ${strongText}`}>
                {reviews.toLocaleString()} reviews
              </span>
              <span className={`h-3 w-px rounded-sm ${dividerCls}`} />
              <span className={`text-[17px] ${mutedText}`}>{REVIEW_STATS.avg} avg</span>
            </div>
            <span className={`flex items-center gap-1.5 text-[14px] ${mutedText}`}>
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#34d399]" />
              {REVIEW_STATS.lastMonth.toLocaleString()} submitted last month
            </span>
            {/* facepile — real members, below the review stats */}
            <div className="mt-3 flex items-center justify-center">
              {FACEPILE.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="-ml-3 h-11 w-11 rounded-full border-[3px] border-white object-cover shadow-[0_2px_8px_rgba(0,0,0,0.18)] first:ml-0"
                  style={{ zIndex: FACEPILE.length - i }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA cluster — reviews + buttons + links, lower on the screen */}
        <div className="flex w-full flex-col items-center gap-6 pb-2">
        {/* prompt directly above the buttons */}
        {variant === "full" ? (
          <motion.p
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease, delay: instant ? 0 : 1.05 }}
            className="text-[17px] leading-normal text-white drop-shadow-[0_1px_14px_rgba(0,0,0,0.4)]"
          >
            {HERO_COPY.subhead}
          </motion.p>
        ) : null}

        {variant === "getStarted" ? (
          <div className="flex w-full flex-col items-center gap-3">
            {/* solid yellow get started */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease, delay: 1.15 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              onClick={onGetStarted}
              className={yellowPill}
            >
              Get started
              <ArrowRight size={18} className="shrink-0" />
            </motion.button>

            {/* grey log in */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease, delay: 1.22 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              onClick={onSignIn}
              className={greyPill}
            >
              Log in
            </motion.button>

            {/* experts entry — routes into the expert flow */}
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 1.4 }}
              onClick={onExpert}
              className={`mt-1 text-[14px] font-medium ${expertText} ${linkClass}`}
            >
              Experts
            </motion.button>
          </div>
        ) : (
          <>
            {/* goal pills — stacked, full width */}
            <div className="flex w-full flex-col gap-2.5">
              {PILLS.map((pill, i) => {
                const inner = (
                  <>
                    <pill.Icon size={19} className="shrink-0" />
                    {pill.label}
                  </>
                );
                const anim = {
                  initial: { opacity: 0, y: instant ? 10 : 0 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    duration: 0.45,
                    ease,
                    delay: (instant ? 0.1 : 1.15) + i * 0.07,
                  },
                  whileTap: reduced ? undefined : { scale: 0.97 },
                } as const;
                return pill.href ? (
                  <motion.a
                    key={pill.label}
                    {...anim}
                    href={pill.href}
                    target="_blank"
                    rel="noreferrer"
                    className={pillClass}
                  >
                    {inner}
                  </motion.a>
                ) : (
                  <motion.button
                    key={pill.label}
                    {...anim}
                    onClick={() => pill.branch && onSelectBranch?.(pill.branch)}
                    className={pillClass}
                  >
                    {inner}
                  </motion.button>
                );
              })}
            </div>

            {/* secondary link: become an expert */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: instant ? 0.35 : 1.55 }}
              className="flex items-center justify-center text-[14px] font-medium text-white/80"
            >
              <button onClick={onExpert} className={linkClass}>
                {HERO_COPY.expertLink}
              </button>
            </motion.div>
          </>
        )}
        </div>
      </div>

      {/* logo marquee pinned to the bottom */}
      <motion.div
        initial={instant ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 1.0 }}
        className="mt-6 flex w-full flex-col items-center gap-3"
      >
        <LogoMarquee reduced={reduced} start={marqueeStart} />
      </motion.div>
    </div>
  );
}
