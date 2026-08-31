import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Clock, BellRing, ShieldCheck, Ticket, X } from "lucide-react";

import { ShareSheet } from "../../waitlist/Waitlist";
import mark from "../../../assets/leland-logos/leland-mark.svg";
import { expertCountFor } from "../universities";
import { universityLogo } from "./UniversitySearch";
import type { ReviewInput } from "./ApplicationReview";
import LineList from "./LineLeaderboard";

/* ─────────────────────────────────────────────────────────────────────────
 * WaitlistGate (v4) — the finale, one continuous screen in two acts:
 *
 *  Act 1 ("card")  · "You're qualified" copy around the member pass.
 *  The bridge      · copy fades, the pass does a full 3D flip with a glint,
 *                    and three guest-pass stubs unfold from under it —
 *                    perforated tear-offs, each with its own invite code.
 *  Act 2 ("gate")  · your spot in line above the pass, the 24h countdown
 *                    and the blurred line below. Sending a stub IS sending
 *                    your pass: the VIP-connection moment.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;
const INVITE_CODES = ["7F3K2M", "Q2XM9A", "9BWD4T"];
export const SPOT_LADDER = [142, 61, 19, 1];
const WINDOW_MS = 24 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function shortName(school: string): string {
  return school.replace(/^University of /, "").replace(/ University$/, "").replace(/ College$/, "");
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
  /** dev-only easter egg: double-tap the toast to step back into the flow */
  onDevBack?: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [act, setAct] = useState<"card" | "gate">("card");
  const gate = act === "gate";
  const [toast, setToast] = useState(true);
  const [sharing, setSharing] = useState<number | null>(null);
  const [spent, setSpent] = useState<boolean[]>([false, false, false]);
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
  const experts = expertCountFor(pass.school);
  const logo = universityLogo(pass.logoKey, pass.school);
  const classLine =
    typeof pass.gradYear === "number"
      ? `Class of ${pass.gradYear}`
      : pass.gradYear === "earlier"
        ? "Alum"
        : "Member";

  const linkFor = (i: number) => `${window.location.origin}/onboarding-v4?code=${INVITE_CODES[i]}`;
  const messageFor = (i: number) =>
    `Here's one of my 3 Leland guest passes for early access to ${pass.category.toLowerCase()} experts. It gets you pre-approved at the front of the line: ${linkFor(i)}`;

  const markSent = (i: number) => {
    setSpent((prev) => prev.map((v, idx) => (idx === i ? true : v)));
    setSharing(null);
    onSent();
  };
  const share = async (i: number) => {
    if (unlocked || spent[i]) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Leland", text: messageFor(i), url: linkFor(i) });
        markSent(i);
      } catch {
        /* canceled: nothing spent */
      }
    } else {
      setSharing(i);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* system-style toast: enters with act two */}
      <AnimatePresence>
        {gate && toast ? (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: 1.3, ease: EASE } }}
            exit={{ opacity: 0, y: -14, transition: { duration: 0.25 } }}
            onDoubleClick={import.meta.env.DEV && onDevBack ? onDevBack : undefined}
            className="absolute inset-x-4 top-[calc(env(safe-area-inset-top,0px)+0.75rem)] z-30 flex items-center gap-2.5 rounded-2xl bg-gray-dark py-3 pl-4 pr-2 text-[13px] font-medium text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
          >
            <BellRing size={14} className="shrink-0" />
            <span className="min-w-0 flex-1">We'll text you the moment the doors open.</span>
            <button
              onClick={() => setToast(false)}
              aria-label="Dismiss"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={15} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-[calc(max(1.5rem,env(safe-area-inset-bottom))+0.5rem)] pt-[calc(env(safe-area-inset-top,0px)+4.25rem)]">
        {/* a way out, once you're at the gate */}
        <div className="-mt-7 mb-2 flex h-7 justify-end">
          {gate ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              onClick={onDone}
              className="py-1 text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark"
            >
              Skip
            </motion.button>
          ) : null}
        </div>

        {/* ── slot above the pass: approval copy, then your spot ── */}
        <div className="flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            {!gate ? (
              <motion.div
                key="intro"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.3, ease: EASE } }}
                className="flex flex-col items-center"
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.45, ease: EASE }}
                className="flex flex-col items-center"
              >
                <div className="rounded-[22px] bg-[#f4f4f4] px-9 pb-3.5 pt-3 text-center">
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
                  <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-light">
                    in line
                  </p>
                </div>
                <h2 className="mt-5 text-balance font-serif text-[20px] leading-tight text-gray-dark">
                  {unlocked
                    ? "You're at the front of the line"
                    : sent === 0
                      ? "Send a guest pass to 3 friends to skip the line"
                      : sent === 1
                        ? `You jumped ${SPOT_LADDER[0] - SPOT_LADDER[1]} spots. Two more.`
                        : "One more and you're first through the door."}
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── the pass: persists across both acts, flips at the bridge ── */}
        <div className="mx-auto mt-7 w-full max-w-[340px]" style={{ perspective: 1200 }}>
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: gate && !reduced ? 360 : 0 }}
            transition={{
              opacity: { delay: 0.6, duration: 0.6, ease: EASE },
              y: { delay: 0.6, duration: 0.6, ease: EASE },
              rotateX: { delay: 0.6, duration: 0.6, ease: EASE },
              rotateY: { duration: 1.1, ease: EASE },
            }}
            style={{
              transformStyle: "preserve-3d",
              background: "radial-gradient(130% 100% at 15% 0%, #262624 0%, #171716 52%, #101010 100%)",
            }}
            className="relative overflow-hidden rounded-[22px] text-left text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10"
          >
            {/* a glint on arrival, and again as it flips */}
            {!reduced ? (
              <motion.span
                key={act}
                aria-hidden
                className="pointer-events-none absolute inset-y-[-30%] z-10 w-[55%]"
                style={{
                  background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%)",
                }}
                initial={{ x: "-120%", rotate: 10 }}
                animate={{ x: "320%" }}
                transition={{ delay: gate ? 0.2 : 1.4, duration: gate ? 1.1 : 1.6, ease: "easeInOut" }}
              />
            ) : null}

            <div className="flex items-center justify-between px-5 pt-5">
              <img src={mark} alt="Leland" className="h-6 w-6" style={{ filter: "brightness(0) invert(1)" }} />
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                <ShieldCheck size={12} /> Pre-approved
              </span>
            </div>
            <div className="px-5 pb-5 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Member</p>
              <p className="mt-1 font-serif text-[26px] leading-tight">{pass.name ?? "June Allen"}</p>
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
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[11.5px] text-white/45">
                <span>
                  {experts} {short} experts already inside
                </span>
                <span className="font-mono tracking-[0.08em] text-white/35">Nº 000142</span>
              </div>
            </div>

            {/* ── guest-pass stubs: unfold from under the pass after the flip ── */}
            <motion.div
              initial={false}
              animate={{ height: gate ? "auto" : 0, opacity: gate ? 1 : 0 }}
              transition={{ delay: gate ? (reduced ? 0 : 0.85) : 0, duration: 0.5, ease: EASE }}
            >
              <div className="px-5 pb-1 pt-0.5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">Guest passes</p>
              </div>
              {INVITE_CODES.map((c, i) => (
                <div key={c} className="relative border-t border-dashed border-white/20 px-5 py-3.5">
                  {/* punched notches, clipped to half-moons by the card edge */}
                  <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-white" />
                  <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-white" />
                  <div className="flex items-center gap-3">
                    <Ticket size={18} className={`shrink-0 ${spent[i] ? "text-white/25" : "text-white/70"}`} />
                    <span
                      className={`min-w-0 flex-1 truncate font-mono text-[15px] font-semibold tracking-[0.14em] ${
                        spent[i] ? "text-white/25" : "text-white"
                      }`}
                    >
                      {c}
                    </span>
                    {spent[i] ? (
                      <span className="flex items-center gap-1 px-2 text-[13px] font-medium text-white/40">
                        <Check size={13} strokeWidth={3} /> Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => share(i)}
                        className="shrink-0 rounded-full bg-yellow px-4 py-1.5 text-[13px] font-semibold text-gray-dark transition-colors hover:bg-[#F3C948]"
                      >
                        Invite
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── slot below the pass: continue, then countdown + the line ── */}
        <AnimatePresence mode="wait">
        {!gate ? (
          <motion.div
            key="continue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="mt-8"
          >
            <button
              onClick={() => setAct("gate")}
              className="flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              Continue
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="line"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.45, ease: EASE }}
          >
            {unlocked ? (
              <button
                onClick={onDone}
                className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
              >
                Done
              </button>
            ) : (
              <p className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-gray-light">
                <Clock size={14} className="text-gray-dark" />
                <Countdown deadline={deadline} />
                to lock in the front of the line
              </p>
            )}
            <div className="mt-7">
              <LineList spot={spot} you={you} />
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sharing !== null ? (
          <ShareSheet
            code={INVITE_CODES[sharing]}
            link={linkFor(sharing)}
            message={messageFor(sharing)}
            title="Leland early access"
            onSend={() => markSent(sharing)}
            onClose={() => setSharing(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
