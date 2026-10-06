import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Check, Clock, ShieldCheck } from "lucide-react";

import { ShareSheet } from "../../waitlist/Waitlist";
import mark from "../../../assets/leland-logos/leland-mark.svg";
import { universityLogo } from "./UniversitySearch";
import type { ReviewInput } from "./ApplicationReview";
import LineList from "./LineLeaderboard";

/* ─────────────────────────────────────────────────────────────────────────
 * WaitlistGate (v4) — the finale, one continuous screen:
 *
 *  Act 1      · "You're qualified" copy around the member pass.
 *  The bridge · three clean beats on ONE persistent element: the card
 *               raises, flips at the apex, lands. Then the layout above it
 *               swaps (copy → your spot) and the card rides up on a layout
 *               animation. Then the two lower cards pop down. List last.
 *  Act 2      · sending the top card slides it off the deck; the rest
 *               square up on a shared spring. Three sends bring the member
 *               card back at the front of the line.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;
const INVITE_CODES = ["7F3K2M", "Q2XM9A", "9BWD4T"];
export const SPOT_LADDER = [142, 61, 19, 1];
const WINDOW_MS = 24 * 60 * 60 * 1000;
const PEEK_Y = 17;
const FLIP_S = 1.7;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function shortName(school: string): string {
  return school.replace(/^University of /, "").replace(/ University$/, "").replace(/ College$/, "");
}

/* stacked cards lighten as they go down, like edges catching light */
const CARD_TONES = [
  ["#262624", "#171716", "#101010"],
  ["#2e2e2b", "#201f1e", "#161615"],
  ["#363633", "#282826", "#1d1d1b"],
] as const;
const cardBg = (depth = 0) => {
  const [a, b, c] = CARD_TONES[Math.min(depth, 2)];
  return `radial-gradient(130% 100% at 15% 0%, ${a} 0%, ${b} 52%, ${c} 100%)`;
};
const CARD_CHROME =
  "relative overflow-hidden rounded-[22px] text-left text-white shadow-[0_8px_22px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-white/[0.14]";

/* FloatTilt — the "real card" treatment for the top of the deck: a gentle
   idle float, and 3D tilt that follows the phone's gyroscope (pointer on
   desktop) with a light reflection that tracks the tilt. */
function FloatTilt({ children, reduced }: { children: React.ReactNode; reduced: boolean }) {
  const mx = useMotionValue(0); // -1..1 across the card / device roll
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-9, 9]), { stiffness: 150, damping: 18 });
  const gx = useTransform(mx, [-1, 1], [22, 78]);
  const gy = useTransform(my, [-1, 1], [15, 85]);
  const glare = useMotionTemplate`radial-gradient(130% 90% at ${gx}% ${gy}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 38%, transparent 68%)`;
  // at rest the card is clean; the reflection exists only while tilting
  const glareOpacity = useSpring(
    useTransform(() => Math.min(1, Math.abs(mx.get()) + Math.abs(my.get()))),
    { stiffness: 150, damping: 22 },
  );

  useEffect(() => {
    if (reduced) return;
    let base: number | null = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      if (base === null) base = e.beta; // however they're holding it is neutral
      mx.set(Math.max(-1, Math.min(1, e.gamma / 26)));
      my.set(Math.max(-1, Math.min(1, (e.beta - base) / 26)));
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [reduced, mx, my]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      animate={reduced ? undefined : { y: [0, -5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {children}
        {!reduced ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[22px]"
            style={{ background: glare, opacity: glareOpacity }}
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
}

/* Owns the 1s interval so the ticks re-render only this span, not the whole
   gate (which would remount the line list and replay its animations). */
function Countdown({ deadline }: { deadline: number }) {
  const [left, setLeft] = useState(() => Math.max(0, deadline - Date.now()));
  useEffect(() => {
    const t = window.setInterval(() => setLeft(Math.max(0, deadline - Date.now())), 1000);
    return () => window.clearInterval(t);
  }, [deadline]);
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const sec = Math.floor((left % 60_000) / 1000);
  return (
    <span className="font-mono font-semibold tabular-nums text-gray-dark">
      {pad(h)}:{pad(m)}:{pad(sec)}
    </span>
  );
}

export default function WaitlistGate({
  pass,
  sent,
  onSent,
  you,
  onDone,
  onDevBack,
}: {
  pass: ReviewInput;
  sent: number;
  onSent: () => void;
  you: { name: string; aff: string; avatar?: string };
  onDone: () => void;
  /** dev-only easter egg: double-tap the spot number to step back */
  onDevBack?: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  // card (act 1) → flip (the bridge, one keyframe pass) → gate (act 2)
  const [act, setAct] = useState<"card" | "flip" | "gate">("card");
  const gate = act === "gate";
  const [sharing, setSharing] = useState(false);
  const [deadline] = useState(() => {
    const k = "leland-v4-gate-deadline";
    try {
      const saved = Number(sessionStorage.getItem(k));
      if (saved && saved > Date.now()) return saved;
      const d = Date.now() + WINDOW_MS;
      sessionStorage.setItem(k, String(d));
      return d;
    } catch {
      return Date.now() + WINDOW_MS;
    }
  });

  const unlocked = sent >= 3;
  const spot = SPOT_LADDER[Math.min(sent, 3)];

  const short = shortName(pass.school);
  const logo = universityLogo(pass.logoKey, pass.school);
  const memberName = pass.name ?? "June Allen";
  const classLine =
    typeof pass.gradYear === "number"
      ? `Class of ${pass.gradYear}`
      : pass.gradYear === "earlier"
        ? "Alum"
        : "Member";

  const linkFor = (i: number) => `${window.location.origin}/onboarding-v4?code=${INVITE_CODES[i]}`;
  const messageFor = (i: number) =>
    `Here's one of my 3 Leland guest passes for early access to ${pass.category.toLowerCase()} experts. It gets you pre-approved at the front of the line: ${linkFor(i)}`;

  const markSent = () => {
    setSharing(false);
    onSent();
  };
  const share = async () => {
    if (unlocked) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Leland", text: messageFor(sent), url: linkFor(sent) });
        markSent();
      } catch {
        /* canceled: nothing spent */
      }
    } else {
      setSharing(true);
    }
  };

  const beginGate = () => {
    // iOS only grants gyroscope access from a user gesture; this is one
    type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
    (DeviceOrientationEvent as DOE).requestPermission?.().catch(() => {});
    setAct(reduced ? "gate" : "flip");
  };

  /* ── the front: your membership ── */
  const memberCard = (
    <div className={CARD_CHROME} style={{ background: cardBg() }}>
      {act === "card" && !reduced ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-[-30%] z-10 w-[55%]"
          style={{
            background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%)",
          }}
          initial={{ x: "-120%", rotate: 10 }}
          animate={{ x: "320%" }}
          transition={{ delay: 1.4, duration: 1.6, ease: "easeInOut" }}
        />
      ) : null}
      <div className="flex items-center justify-between px-5 pt-5">
        <img src={mark} alt="Leland" className="h-6 w-6" style={{ filter: "brightness(0) invert(1)" }} />
        <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
          <ShieldCheck size={12} /> Pre-approved
        </span>
      </div>
      <div className="px-5 pb-6 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Member</p>
        <p className="mt-1 font-serif text-[26px] leading-tight">{memberName}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
            {logo ? (
              <img src={logo} alt="" className="h-full w-full object-contain p-1.5" />
            ) : (
              <span className="text-[15px] font-semibold text-gray-dark">{short.charAt(0)}</span>
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium">{short}</p>
            <p className="truncate text-[12.5px] text-white/55">{classLine}</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── the back: a referral card, almost a credit card ── */
  const guestCard = (i: number, depth = 0) => (
    <div className={CARD_CHROME} style={{ background: cardBg(depth) }}>
      <div className="flex items-center justify-between px-5 pt-5">
        <img src={mark} alt="Leland" className="h-6 w-6" style={{ filter: "brightness(0) invert(1)" }} />
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/70">
          Guest pass · {i + 1} of 3
        </span>
      </div>
      <div className="px-5 pb-5 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Admit one</p>
        {/* embossed, card-number style */}
        <p
          className="mt-1.5 font-mono text-[25px] font-semibold tracking-[0.22em]"
          style={{ textShadow: "0 1px 0 rgba(255,255,255,0.16), 0 -1px 1px rgba(0,0,0,0.65)" }}
        >
          {INVITE_CODES[i]}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[12.5px] text-white/55">Pre-approved by {memberName}</p>
          <button
            onClick={share}
            className="shrink-0 rounded-full bg-yellow px-5 py-2 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#F3C948]"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );

  /* One persistent element carries the whole bridge: member on the front,
     guest pass 1 on the back — one and a half turns (540°), so it lands on
     the back. Never unmounted mid-motion. The 3D cues: a dark core gives
     the card thickness at edge-on, each face catches a sheen as it sweeps
     past the light, and a ground shadow detaches while it's airborne. */
  const flipping = act === "flip";
  const flipCard = (
    <motion.div
      initial={false}
      animate={
        act === "card"
          ? { y: 0, rotateY: 0, scale: 1 }
          : flipping
            ? { y: [0, -16, -16, 0], rotateY: [0, 0, 540, 540], scale: [1, 1.045, 1.045, 1] }
            : { y: 0, rotateY: 540, scale: 1 }
      }
      transition={
        flipping
          ? {
              duration: FLIP_S,
              times: [0, 0.18, 0.82, 1],
              y: { duration: FLIP_S, times: [0, 0.18, 0.82, 1], ease: "easeInOut" },
              scale: { duration: FLIP_S, times: [0, 0.18, 0.82, 1], ease: "easeInOut" },
              rotateY: { duration: FLIP_S, times: [0, 0.18, 0.82, 1], ease: ["linear", "easeInOut", "linear"] },
            }
          : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (act === "flip") setAct("gate");
      }}
      style={{ transformStyle: "preserve-3d" }}
      className="grid"
    >
      {/* dark core: the card's thickness when seen edge-on */}
      <div className="m-[1px] rounded-[22px] bg-[#131312]" style={{ gridArea: "1 / 1" }} />
      <div className="relative" style={{ backfaceVisibility: "hidden", transform: "translateZ(2px)", gridArea: "1 / 1" }}>
        {memberCard}
        {flipping && !reduced ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[22px]"
            style={{ background: "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: FLIP_S, times: [0.14, 0.3, 0.48] }}
          />
        ) : null}
      </div>
      <div
        className="relative"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg) translateZ(2px)", gridArea: "1 / 1" }}
      >
        {guestCard(0)}
        {flipping && !reduced ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[22px]"
            style={{ background: "linear-gradient(-100deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: FLIP_S, times: [0.55, 0.72, 0.88] }}
          />
        ) : null}
      </div>
    </motion.div>
  );

  return (
    <div className="relative flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 pb-[calc(max(1.5rem,env(safe-area-inset-bottom))+0.5rem)] pt-[calc(env(safe-area-inset-top,0px)+4.25rem)]">
        {/* a way out, once you're at the gate */}
        <div className="-mt-7 mb-2 flex h-7 justify-end">
          {gate ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              onClick={onDone}
              className="py-1 text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark"
            >
              Skip
            </motion.button>
          ) : null}
        </div>

        {/* ── slot above the pass: approval copy fades during the flip, then
              unmounts at landing so the card rides up on a layout animation ── */}
        <div className="flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            {!gate ? (
              <motion.div
                key="intro"
                animate={{ opacity: act === "card" ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: { opacity: { duration: 0.2 }, height: { duration: 0.65, ease: EASE, delay: 0.05 } },
                }}
                className="flex flex-col items-center overflow-hidden"
              >
                <motion.span
                  initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={reduced ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 13 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow text-gray-dark"
                >
                  <Check size={28} strokeWidth={3} />
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                  className="mt-5 max-w-[16ch] text-balance font-serif text-[32px] leading-[1.1] text-gray-dark"
                >
                  You're qualified for the Leland community.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-gray-light"
                >
                  Congrats! Your application is approved in the first wave of members we're admitting.
                  <br />
                  Here's your member pass:
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="spot"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ height: { duration: 0.5, ease: EASE }, opacity: { delay: 0.25, duration: 0.4 } }}
                className="flex flex-col items-center overflow-hidden"
              >
                <div onDoubleClick={import.meta.env.DEV && onDevBack ? onDevBack : undefined}>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={spot}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                      className="font-serif text-[52px] leading-none text-gray-dark"
                    >
                      #{spot}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <h2 className="mt-4 max-w-[24ch] text-balance font-serif text-[20px] leading-tight text-gray-dark">
                  {unlocked
                    ? "You're at the front of the line"
                    : sent === 0
                      ? "Each invite gets you closer to the front of the line."
                      : sent === 1
                        ? `You jumped ${SPOT_LADDER[0] - SPOT_LADDER[1]} spots. Two passes left.`
                        : "One more and you're first through the door."}
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── the deck: the flip card stays item zero until it's sent ── */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ opacity: { delay: 0.6, duration: 0.6, ease: EASE }, y: { delay: 0.6, duration: 0.6, ease: EASE } }}
          className="mx-auto mt-7 w-full max-w-[340px]"
          style={{ perspective: 900 }}
        >
          {gate && unlocked ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              <FloatTilt reduced={reduced}>{memberCard}</FloatTilt>
            </motion.div>
          ) : (
            <motion.div
              className="relative"
              initial={false}
              animate={{ paddingBottom: gate ? (2 - sent) * PEEK_Y : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* invisible sizer keeps the column height stable so every
                  reorder is a pure transform, never a reflow */}
              <div className="invisible" aria-hidden>
                {guestCard(0)}
              </div>
              {/* ground shadow: separates from the card while it's in the air */}
              {flipping && !reduced ? (
                <motion.div
                  aria-hidden
                  className="absolute inset-x-8 -bottom-1.5 h-5 rounded-[50%] bg-black/35 blur-md"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 0.5, 0.5, 0], scale: [1, 0.78, 0.78, 1] }}
                  transition={{ duration: FLIP_S, times: [0, 0.22, 0.8, 1] }}
                />
              ) : null}
              <AnimatePresence>
                {INVITE_CODES.map((code, i) => {
                  if (i < sent) return null;
                  if (!gate && i > 0) return null;
                  const depth = i - sent;
                  return (
                    <motion.div
                      key={code}
                      initial={depth === 0 ? false : { y: 0, scale: 1 - depth * 0.035 }}
                      animate={{ y: depth * PEEK_Y, scale: 1 - depth * 0.035 }}
                      exit={
                        reduced
                          ? { opacity: 0 }
                          : {
                              x: [0, 30, 620],
                              y: [0, -22, -6],
                              rotate: [0, 2, 8],
                              transition: { duration: 0.8, times: [0, 0.35, 1], ease: "easeInOut" },
                            }
                      }
                      transition={{ type: "spring", stiffness: 300, damping: 24, delay: gate ? 0.2 + depth * 0.07 : 0 }}
                      style={{ zIndex: 30 - i }}
                      className="absolute inset-x-0 top-0"
                    >
                      {depth === 0 ? (
                        <FloatTilt reduced={reduced}>{i === 0 && sent === 0 ? flipCard : guestCard(i, depth)}</FloatTilt>
                      ) : (
                        guestCard(i, depth)
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* ── slot below the pass: continue, then countdown + the line ── */}
        <AnimatePresence mode="wait">
          {act === "card" ? (
            <motion.div
              key="continue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ delay: 1.3, duration: 0.4 }}
              className="mt-8"
            >
              <button
                onClick={beginGate}
                className="flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
              >
                Continue
              </button>
            </motion.div>
          ) : gate ? (
            <motion.div
              key="line"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.45, ease: EASE }}
            >
              {unlocked ? (
                <button
                  onClick={onDone}
                  className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
                >
                  Done
                </button>
              ) : (
                <p className="mt-6 flex items-center justify-center gap-1.5 text-[13px] text-gray-light">
                  <Clock size={14} className="text-gray-dark" />
                  <Countdown deadline={deadline} />
                  to lock in the front of the line
                </p>
              )}
              <div className="mt-7">
                <LineList spot={spot} you={you} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sharing ? (
          <ShareSheet
            code={INVITE_CODES[Math.min(sent, 2)]}
            link={linkFor(Math.min(sent, 2))}
            message={messageFor(Math.min(sent, 2))}
            title="Leland early access"
            onSend={markSent}
            onClose={() => setSharing(false)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
