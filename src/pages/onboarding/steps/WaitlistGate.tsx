import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Bell, Share, Ticket, ChevronRight, Clock } from "lucide-react";

import { ShareSheet } from "../../waitlist/Waitlist";

/* ─────────────────────────────────────────────────────────────────────────
 * WaitlistGate (v4) — the dead end, centered on one thing: 0/3 invites.
 *
 *  · Spot in line (ladders down with each invite)
 *  · A three-segment progress bar — the whole screen is about filling it
 *  · 24-hour clock: three invites before it runs out locks the front spot
 *  · "See who's in line" → the leaderboard (separate screen)
 *  · At 3: front of the line → text-me-when-the-doors-open
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;
const INVITE_CODES = ["7F3K2M", "Q2XM9A", "9BWD4T"];
export const SPOT_LADDER = [142, 61, 19, 1];
const WINDOW_MS = 24 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useCountdown(deadline: number) {
  const [left, setLeft] = useState(() => Math.max(0, deadline - Date.now()));
  useEffect(() => {
    const t = window.setInterval(() => setLeft(Math.max(0, deadline - Date.now())), 1000);
    return () => window.clearInterval(t);
  }, [deadline]);
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function WaitlistGate({
  sent,
  onSent,
  category,
  onSeeLine,
  onDone,
}: {
  sent: number;
  onSent: () => void;
  category: string;
  onSeeLine: () => void;
  onDone: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [sharing, setSharing] = useState(false);
  const [notified, setNotified] = useState(false);
  // clock starts the first time the gate mounts, then persists across the
  // leaderboard round-trip
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
  const clock = useCountdown(deadline);

  const unlocked = sent >= 3;
  const spot = SPOT_LADDER[Math.min(sent, 3)];
  const code = INVITE_CODES[Math.min(sent, 2)];

  const link = `${window.location.origin}/onboarding-v4?code=${code}`;
  const message = `I just got pre-approved for Leland — early access to ${category.toLowerCase()} experts who are exactly where I'm trying to go. Skip the line with my invite: ${link}`;

  const markSent = () => {
    setSharing(false);
    onSent();
  };
  const share = async () => {
    if (unlocked) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Leland", text: message, url: link });
        markSent();
      } catch {
        /* canceled: nothing spent */
      }
    } else {
      setSharing(true);
    }
  };

  const notify = async () => {
    try {
      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch {
      /* unsupported */
    }
    setNotified(true);
  };

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASE },
  });

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-44 pt-[max(1.5rem,env(safe-area-inset-top))] text-center">
        <AnimatePresence mode="wait">
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
            <motion.div key="waiting" className="flex w-full flex-col items-center">
              {/* spot */}
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
                  className="mt-1 font-serif text-[80px] leading-none text-gray-dark"
                >
                  #{spot}
                </motion.h1>
              </AnimatePresence>

              {/* progress — the center of the screen */}
              <motion.div {...rise(0.15)} className="mt-9 w-full">
                <div className="flex items-end justify-between">
                  <p className="text-[16px] font-semibold text-gray-dark">Invite 3 to skip the line</p>
                  <p className="font-serif text-[22px] leading-none text-gray-dark">
                    {sent}<span className="text-[14px] text-gray-light">/3</span>
                  </p>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="relative h-3 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                      <motion.div
                        initial={false}
                        animate={{ width: i < sent ? "100%" : "0%" }}
                        transition={{ duration: 0.6, ease: EASE, delay: i < sent ? 0.05 : 0 }}
                        className="absolute inset-y-0 left-0 rounded-full bg-yellow"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-1 items-center justify-center gap-1 text-[12px] font-medium">
                      <Ticket size={13} className={i < sent ? "text-gray-dark" : "text-gray-xlight"} />
                      <span className={i < sent ? "text-gray-dark" : "text-gray-xlight"}>
                        {i < sent ? "Sent" : `→ #${SPOT_LADDER[i + 1]}`}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 24h clock */}
              <motion.div {...rise(0.3)} className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-gray-hover px-4 py-3 text-left">
                <Clock size={18} className="shrink-0 text-gray-dark" />
                <p className="min-w-0 flex-1 text-[13.5px] leading-snug text-gray-dark">
                  Send all 3 in the next{" "}
                  <span className="font-mono font-semibold tabular-nums">{clock}</span> and we lock you in at the front.
                </p>
              </motion.div>

              {/* leaderboard link */}
              <motion.button
                {...rise(0.42)}
                onClick={onSeeLine}
                className="mt-5 flex items-center gap-1 text-[14px] font-medium text-gray-dark underline decoration-gray-stroke underline-offset-4 transition-colors hover:decoration-gray-dark"
              >
                See who's in line
                <ChevronRight size={15} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* bottom CTA */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1rem)] pt-8">
        {!unlocked ? (
          <>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={share}
              className="pointer-events-auto flex h-14 w-full items-center justify-center gap-2 rounded-full bg-yellow text-[15px] font-semibold text-gray-dark transition-colors hover:bg-[#F3C948]"
            >
              <Share size={17} />
              {sent === 0 ? "Send your first invite" : sent === 1 ? "Send your second invite" : "Send your last invite"}
            </motion.button>
            <p className="pointer-events-auto mt-2.5 text-center text-[12px] text-gray-xlight">
              Anyone counts — friends, classmates, coworkers.
            </p>
          </>
        ) : notified ? (
          <button
            onClick={onDone}
            className="pointer-events-auto flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
          >
            Done
          </button>
        ) : (
          <>
            <button
              onClick={notify}
              className="pointer-events-auto flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              <Bell size={17} />
              Text me when the doors open
            </button>
            <button
              onClick={onSeeLine}
              className="pointer-events-auto mt-2 flex h-11 w-full items-center justify-center text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark"
            >
              See who's in line
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {sharing ? (
          <ShareSheet
            code={code}
            link={link}
            message={message}
            title="Skip the line — Leland early access"
            onSend={markSent}
            onClose={() => setSharing(false)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
