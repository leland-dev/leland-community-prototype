import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Clock, BellRing, Ticket } from "lucide-react";

import { ShareSheet } from "../../waitlist/Waitlist";
import LineList from "./LineLeaderboard";

/* ─────────────────────────────────────────────────────────────────────────
 * WaitlistGate (v4) — the dead end, one scrollable screen:
 *
 *  · Spot in line + three invite "seats" that fill as invites go out
 *  · The line itself below the fold — blurred faces/names, crisp affiliations
 *  · The invite CTA (with the 24h clock) appears twice: above the line and
 *    again at the bottom, so it's there wherever you stop scrolling
 *  · At 3: front of the line → text-me-when-the-doors-open
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;
const INVITE_CODES = ["7F3K2M", "Q2XM9A", "9BWD4T"];
export const SPOT_LADDER = [142, 61, 19, 1];
const WINDOW_MS = 24 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
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
  sent,
  onSent,
  category,
  you,
  onDone,
  onDevBack,
}: {
  sent: number;
  onSent: () => void;
  category: string;
  you: { name: string; aff: string; avatar?: string };
  onDone: () => void;
  /** dev-only easter egg: double-tap the banner to step back into the flow */
  onDevBack?: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
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

  const linkFor = (i: number) => `${window.location.origin}/onboarding-v4?code=${INVITE_CODES[i]}`;
  const messageFor = (i: number) =>
    `I just got pre-approved for Leland: early access to ${category.toLowerCase()} experts who are exactly where I'm trying to go. Skip the line with my invite: ${linkFor(i)}`;

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

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASE },
  });

  const tickets = (
    <div className="flex flex-col gap-2.5">
      {INVITE_CODES.map((c, i) => (
        <div key={c} className="flex items-center gap-3 rounded-2xl bg-[#f4f4f4] p-4 text-left">
          <Ticket size={20} className={`ml-1 shrink-0 ${spent[i] ? "text-gray-light" : "text-gray-dark"}`} />
          <span
            className={`min-w-0 flex-1 truncate font-mono text-[17px] font-semibold tracking-[0.14em] ${
              spent[i] ? "text-gray-light" : "text-gray-dark"
            }`}
          >
            {c}
          </span>
          {spent[i] ? (
            <span className="px-3 text-[14px] font-medium text-gray-light">Sent</span>
          ) : (
            <button
              onClick={() => share(i)}
              className="shrink-0 rounded-full bg-yellow px-5 py-2 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#F3C948]"
            >
              Invite
            </button>
          )}
        </div>
      ))}
      <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[13px] text-gray-light">
        <Clock size={14} className="text-gray-dark" />
        <Countdown deadline={deadline} />
        to lock in the front of the line
      </p>
    </div>
  );

  return (
    <div className="relative flex h-full flex-col">
      {/* pinned: you're all set */}
      <div
        onDoubleClick={import.meta.env.DEV && onDevBack ? onDevBack : undefined}
        className="flex shrink-0 items-center justify-center gap-2 bg-[#f4f4f4] px-4 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] text-[13px] font-medium text-gray-dark"
      >
        <BellRing size={14} />
        We'll text you the moment the doors open.
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-[calc(max(1.5rem,env(safe-area-inset-bottom))+0.5rem)] pt-8">
        {/* ── above the fold: spot + ring ── */}
        <div className="flex flex-col items-center text-center">
          {unlocked ? (
            <motion.div key="front" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col items-center">
              <motion.span
                initial={reduced ? { opacity: 0 } : { scale: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 13 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow text-gray-dark"
              >
                <Check size={30} strokeWidth={3} />
              </motion.span>
              <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-light">Your spot</p>
              <h1 className="mt-1 font-serif text-[72px] leading-none text-gray-dark">#1</h1>
              <h2 className="mt-4 text-balance font-serif text-[28px] leading-[1.1] text-gray-dark">You're at the front of the line</h2>
              <p className="mx-auto mt-2 max-w-[30ch] text-[15px] leading-relaxed text-gray-light">
                Locked in. The moment the doors open, you're first through.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.p {...rise(0)} className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-light">
                Your spot in line
              </motion.p>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={spot}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="mt-1 font-serif text-[68px] leading-none text-gray-dark"
                >
                  #{spot}
                </motion.h1>
              </AnimatePresence>

              <motion.h2 {...rise(0.2)} className="mt-4 font-serif text-[20px] leading-tight text-gray-dark">
                {sent === 0
                  ? "Invite 3 to skip the line"
                  : sent === 1
                    ? `You jumped ${SPOT_LADDER[0] - SPOT_LADDER[1]} spots. Two more.`
                    : "One more and you're first through the door."}
              </motion.h2>
            </>
          )}
        </div>

        <motion.div {...rise(0.35)} className="mt-7">
          {unlocked ? (
            <button
              onClick={onDone}
              className="flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              Done
            </button>
          ) : (
            tickets
          )}
        </motion.div>

        {/* ── the line itself, below the fold ── */}
        <motion.div {...rise(0.5)} className="mt-8">
          <LineList spot={spot} you={you} />
        </motion.div>
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
