import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, X, Check, Star, Award, Sparkles } from "lucide-react";

import Auth from "./Auth";
import expertPhoto from "../../../assets/profile photos/pic-4.png";
import couchPhoto from "../../../assets/photography/two-people-orange-couch.png";

/* ─────────────────────────────────────────────────────────────────────────
 * Existing-expert path — pre-filled screens on the white surface.
 *
 *   why  →  sign in  →  presence  →  golive  →  (Founding Expert) → Home.
 *
 * A returning expert only has to sign in — we never ask for data the platform
 * already has. Sign-in is what unlocks the "here's your presence" reveal; every
 * screen after it is a confirmation, not a form. The profile below is mocked as
 * if pulled from their existing Leland coach account.
 * ──────────────────────────────────────────────────────────────────────── */

/* ── mock: the expert's existing Leland profile ── */
const EXPERT = {
  name: "Daniel Cho",
  headline: "Ex-McKinsey EM · HBS MBA",
  photo: expertPhoto,
  rating: 4.9,
  reviews: 213,
  clientsHelped: 180,
  expertise: ["MBA Admissions", "Management Consulting", "Case Interviews"],
};

const INTRO_DRAFT =
  "Hey everyone — I'm Daniel, ex-McKinsey and an HBS MBA. I've helped 180+ people break into consulting and land spots at top MBA programs. Ask me anything about case prep, essays, or recruiting timelines — I'll be around this week. Excited to be here.";

type StepId = "why" | "signin" | "presence" | "golive";

const PROGRESS: Record<StepId, number> = {
  why: 0.34,
  signin: 0.5, // full-bleed Auth has no progress bar
  presence: 0.67,
  golive: 1,
};

/* ── count-up (matches CoachCount's exponential ease-out) ── */
function useCountUp(target: number, ms: number, enabled: boolean) {
  const [v, setV] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) {
      setV(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / ms, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      setV(Math.round(target * (p >= 1 ? 1 : eased)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, enabled]);
  return v;
}

/* ─────────────────────────── Screen 1 — why ─────────────────────────── */
function WhyScreen({ onNext }: { onNext: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const pct = useCountUp(72, 650, !reduced);

  return (
    <div className="flex flex-col">
      {/* full-bleed hero — edge to edge, top ~half of the screen, copy on top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative -mx-6 -mt-3 h-[52vh] min-h-[340px] overflow-hidden"
      >
        <img
          src={couchPhoto}
          alt="Two Leland experts working together"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* scrim: darkens the lower half so the white copy stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* overlaid copy — bottom-anchored, white */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 text-center text-white drop-shadow-[0_1px_14px_rgba(0,0,0,0.5)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/70">
            Welcome back
          </p>
          <p className="mt-2 font-serif text-[60px] font-medium leading-none tabular-nums">
            {pct}%
          </p>
          <p className="mx-auto mt-2 w-full text-balance text-[18px] leading-snug">
            more bookings go to experts who are active in the community.
          </p>
          <p className="mx-auto mt-3 w-full text-balance text-[13.5px] leading-relaxed text-white/80">
            Members book the coaches they already know and trust. A few posts a
            week keeps you top of mind and top of the list.
          </p>
        </div>
      </motion.div>

      {/* CTA below the hero */}
      <div className="px-1 pt-8">
        <motion.button
          onClick={onNext}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
        >
          Sign in to see your presence
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}

/* ──────────────────────── Screen 2 — presence ──────────────────────── */
function PresenceScreen({ onNext }: { onNext: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h2 className="font-serif text-[28px] leading-[1.12] text-gray-dark md:text-[32px]">
          Your presence is ready
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-light">
          Built from your Leland profile. Nothing to fill in.
        </p>
      </div>

      {/* profile preview card */}
      <motion.div
        {...rise(0.05)}
        className="overflow-hidden rounded-3xl border border-gray-stroke bg-white shadow-card"
      >
        {/* header band */}
        <div className="relative h-20 bg-gradient-to-r from-[#eef2f6] to-[#f6efe4]" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end justify-between">
            <img
              src={EXPERT.photo}
              alt={EXPERT.name}
              className="h-20 w-20 rounded-full border-4 border-white object-cover object-top shadow-card"
            />
            <span className="mb-1 flex items-center gap-1 rounded-full bg-gray-dark px-2.5 py-1 text-[11px] font-semibold text-white">
              <Check size={12} strokeWidth={3} />
              Verified
            </span>
          </div>

          <div className="mt-3">
            <p className="text-[19px] font-semibold leading-tight text-gray-dark">
              {EXPERT.name}
            </p>
            <p className="mt-0.5 text-[13.5px] text-gray-light">{EXPERT.headline}</p>
          </div>

          {/* stats */}
          <div className="mt-3 flex items-center gap-4 text-[13px] text-gray-dark">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-yellow text-yellow" />
              <span className="font-semibold tabular-nums">
                {EXPERT.rating.toFixed(1)}
              </span>
              <span className="text-gray-light">({EXPERT.reviews})</span>
            </span>
            <span className="h-3 w-px bg-gray-stroke" />
            <span className="text-gray-light">
              Helped{" "}
              <span className="font-semibold text-gray-dark tabular-nums">
                {EXPERT.clientsHelped}+
              </span>{" "}
              clients
            </span>
          </div>

          {/* expertise chips */}
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-xlight">
              Expertise
            </p>
            <div className="flex flex-wrap gap-2">
              {EXPERT.expertise.map((e, i) => (
                <motion.span
                  key={e}
                  {...rise(0.2 + i * 0.06)}
                  className="rounded-full bg-gray-hover px-3 py-1.5 text-[12.5px] font-medium text-gray-dark"
                >
                  {e}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.button
        {...rise(0.5)}
        onClick={onNext}
        className="mt-6 flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
      >
        Continue
        <ArrowRight size={16} />
      </motion.button>
    </div>
  );
}

/* ──────────────────────── Screen 3 — go live ──────────────────────── */
function GoLiveScreen({ onPublish }: { onPublish: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const [intro, setIntro] = useState(INTRO_DRAFT);

  // Auto-fit the composer to its content: the drafted intro shows in full with
  // no inner scroll, and the box grows as the expert edits — one defined space,
  // never a cramped scroll window.
  const taRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    // scrollHeight excludes the border, so add it back (border-box) to avoid a
    // few stray pixels of scroll.
    const border = el.offsetHeight - el.clientHeight;
    el.style.height = `${el.scrollHeight + border}px`;
  }, [intro]);

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="flex flex-col">
      <motion.div {...rise(0)} className="mb-5">
        <h2 className="font-serif text-[28px] leading-[1.12] text-gray-dark md:text-[32px]">
          Say hello to the community
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-light">
          We drafted your intro. Post it as-is or make it yours.
        </p>
      </motion.div>

      {/* editable intro post, styled like a real feed card */}
      <motion.div
        {...rise(0.08)}
        className="rounded-2xl border border-gray-stroke bg-white p-4 shadow-card"
      >
        <div className="flex items-center gap-2.5">
          <img
            src={EXPERT.photo}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[14px] font-semibold leading-tight text-gray-dark">
              {EXPERT.name}
              <span className="rounded bg-gray-dark px-1.5 py-0.5 text-[10px] font-semibold text-white">
                COACH
              </span>
            </p>
            <p className="text-[12px] text-gray-light">{EXPERT.headline} · now</p>
          </div>
        </div>
        <textarea
          ref={taRef}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          aria-label="Your intro post"
          className="mt-3 w-full resize-none overflow-hidden rounded-xl border border-gray-stroke bg-[#fafafa] p-3 text-[14px] leading-relaxed text-gray-dark outline-none transition-colors focus:border-gray-dark/40"
        />
      </motion.div>

      <motion.button
        {...rise(0.16)}
        onClick={onPublish}
        disabled={!intro.trim()}
        className="mt-6 flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333] disabled:opacity-50"
      >
        <Sparkles size={16} />
        Publish & go live
      </motion.button>

      <motion.p
        {...rise(0.22)}
        className="mt-3 text-center text-[12.5px] text-gray-light"
      >
        Publishing earns your{" "}
        <span className="font-semibold text-gray-dark">Founding Expert</span> badge.
      </motion.p>
    </div>
  );
}

/* ─────────────────── Founding Expert celebration ─────────────────── */
function Celebration({ onEnter }: { onEnter: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const rays = Array.from({ length: 10 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-white px-8 text-center"
    >
      {/* badge with radiating rings + rays */}
      <div className="relative flex items-center justify-center">
        {!reduced
          ? [0, 1].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0.4, opacity: 0.5 }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{
                  duration: 1.6,
                  delay: 0.2 + i * 0.4,
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  ease: "easeOut",
                }}
                className="absolute h-28 w-28 rounded-full border border-yellow"
              />
            ))
          : null}

        {!reduced
          ? rays.map((_, i) => (
              <motion.span
                key={`ray-${i}`}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.02 }}
                className="absolute h-10 w-[3px] origin-bottom rounded-full bg-yellow"
                style={{
                  transform: `rotate(${i * 36}deg) translateY(-56px)`,
                }}
              />
            ))
          : null}

        <motion.div
          initial={reduced ? { opacity: 0 } : { scale: 0, rotate: -18 }}
          animate={reduced ? { opacity: 1 } : { scale: 1, rotate: 0 }}
          transition={
            reduced
              ? { duration: 0.3 }
              : { type: "spring", stiffness: 260, damping: 15, delay: 0.1 }
          }
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-[#FFE79A] to-yellow shadow-[0_10px_30px_rgba(255,217,111,0.55)]"
        >
          <Award size={44} className="text-gray-dark" strokeWidth={2} />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0.15 : 0.5, duration: 0.5 }}
        className="mt-8 text-[12px] font-medium uppercase tracking-[0.2em] text-gray-xlight"
      >
        Badge earned
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0.2 : 0.6, duration: 0.5 }}
        className="mt-2 font-serif text-[32px] leading-tight text-gray-dark"
      >
        You're a Founding Expert
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0.25 : 0.75, duration: 0.5 }}
        className="mt-3 max-w-[30ch] text-[14px] leading-relaxed text-gray-light"
      >
        Your intro is live and your badge is on your profile. Members can find and
        book you starting now.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0.3 : 0.9, duration: 0.5 }}
        onClick={onEnter}
        className="mt-10 flex h-14 w-full max-w-[360px] items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
      >
        Enter your community
        <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );
}

/* ───────────────────────────── runner ───────────────────────────── */
export default function ExpertFlow({
  onBackToOpener,
  onExit,
  onComplete,
}: {
  onBackToOpener: () => void;
  onExit: () => void;
  onComplete: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [step, setStep] = useState<StepId>("why");
  const [history, setHistory] = useState<StepId[]>([]);
  const [celebrating, setCelebrating] = useState(false);

  const go = (from: StepId, to: StepId) => {
    setHistory((h) => [...h, from]);
    setStep(to);
  };

  const goBack = () => {
    if (history.length === 0) {
      onBackToOpener();
      return;
    }
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setStep(prev);
  };

  const render = () => {
    switch (step) {
      case "why":
        return <WhyScreen onNext={() => go("why", "signin")} />;
      case "presence":
        return <PresenceScreen onNext={() => go("presence", "golive")} />;
      case "golive":
        return <GoLiveScreen onPublish={() => setCelebrating(true)} />;
      case "signin":
        return null; // rendered full-bleed below
    }
  };

  // Sign in reuses the shared Auth screen full-bleed (own chrome, no progress
  // header) — matching how the member flow presents it.
  if (step === "signin") {
    return (
      <div className="h-full">
        <Auth
          cohortName="the Leland community"
          memberCount={30975}
          onBack={goBack}
          onExit={onExit}
          onNext={() => go("signin", "presence")}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <button
          onClick={goBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-black/[0.05]"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.07]">
          <motion.div
            className="h-full rounded-full bg-yellow"
            initial={false}
            animate={{ width: `${PROGRESS[step] * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
        <button
          onClick={onExit}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-black/[0.05]"
          aria-label="Exit onboarding"
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            {render()}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {celebrating ? <Celebration onEnter={onComplete} /> : null}
      </AnimatePresence>
    </div>
  );
}
