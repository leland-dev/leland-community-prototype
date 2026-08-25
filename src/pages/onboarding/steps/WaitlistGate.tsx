import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Bell, Share, Clock } from "lucide-react";

import { ShareSheet } from "../../waitlist/Waitlist";
import LineList from "./LineLeaderboard";

/* ─────────────────────────────────────────────────────────────────────────
 * WaitlistGate (v4) — the dead end, one scrollable screen:
 *
 *  · Spot in line + a circular 0/3 invite ring (three milestone dots, a
 *    bubble that travels as invites go out)
 *  · The line itself below the fold — blurred faces/names, crisp affiliations
 *  · Opaque bottom sheet: the invite CTA with the 24h clock right under it
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

/* ── the ring: track, progress arc, three milestone dots, a travelling bubble ── */
function InviteRing({ n, size = 148 }: { n: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2 - 6; // leave room for the bubble
  const cx = size / 2;
  const c = 2 * Math.PI * r;
  const frac = n / 3;
  const pt = (f: number) => {
    const a = -Math.PI / 2 + f * 2 * Math.PI;
    return { x: cx + r * Math.cos(a), y: cx + r * Math.sin(a) };
  };
  const bubble = pt(frac);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#ececec" strokeWidth={stroke} />
        <motion.circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#FFD96F"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - frac) }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        {/* milestone dots at 1/3, 2/3, 3/3 */}
        {[1, 2, 3].map((k) => {
          const p = pt(k / 3);
          const reached = n >= k;
          return (
            <motion.circle
              key={k}
              cx={p.x}
              cy={p.y}
              r={reached ? 6 : 5}
              initial={false}
              animate={{ fill: reached ? "#222222" : "#ffffff", stroke: reached ? "#222222" : "#d9d9d9" }}
              transition={{ duration: 0.3 }}
              strokeWidth={2}
            />
          );
        })}
        {/* the bubble: sits at the start for 0/3, travels the arc as invites go out */}
        <motion.g initial={false} animate={{ x: bubble.x - cx, y: bubble.y - cx }} transition={{ duration: 0.7, ease: EASE }}>
          <circle cx={cx} cy={cx} r={11} fill="#222222" stroke="#ffffff" strokeWidth={3} />
          <circle cx={cx} cy={cx} r={3.5} fill="#FFD96F" />
        </motion.g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[34px] leading-none text-gray-dark">
          {n}<span className="text-[18px] text-gray-light">/3</span>
        </span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-light">invites</span>
      </div>
    </div>
  );
}

export default function WaitlistGate({
  sent,
  onSent,
  category,
  you,
  onDone,
}: {
  sent: number;
  onSent: () => void;
  category: string;
  you: { name: string; aff: string; avatar?: string };
  onDone: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [sharing, setSharing] = useState(false);
  const [notified, setNotified] = useState(false);
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
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-44 pt-[max(1.5rem,env(safe-area-inset-top))]">
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

              <motion.div {...rise(0.15)} className="mt-7">
                <InviteRing n={sent} />
              </motion.div>
              <motion.h2 {...rise(0.25)} className="mt-4 font-serif text-[20px] leading-tight text-gray-dark">
                {sent === 0
                  ? "Invite 3 to skip the line"
                  : sent === 1
                    ? `You jumped ${SPOT_LADDER[0] - SPOT_LADDER[1]} spots. Two more.`
                    : "One more and you're first through the door."}
              </motion.h2>
            </>
          )}
        </div>

        {/* ── below the fold: the line ── */}
        <motion.div {...rise(0.45)} className="mt-8">
          <LineList spot={spot} you={you} />
        </motion.div>
      </div>

      {/* ── bottom sheet: opaque, CTA + the clock right under it ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] rounded-t-[24px] border-t border-gray-stroke bg-white px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+0.75rem)] pt-4 shadow-[0_-12px_32px_rgba(0,0,0,0.06)]">
        {!unlocked ? (
          <>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={share}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-yellow text-[15px] font-semibold text-gray-dark transition-colors hover:bg-[#F3C948]"
            >
              <Share size={17} />
              {sent === 0 ? "Send your first invite" : sent === 1 ? "Send your second invite" : "Send your last invite"}
            </motion.button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-gray-light">
              <Clock size={14} className="text-gray-dark" />
              <Countdown deadline={deadline} />
              to lock in the front of the line
            </p>
          </>
        ) : notified ? (
          <button
            onClick={onDone}
            className="flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
          >
            Done
          </button>
        ) : (
          <>
            <button
              onClick={notify}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              <Bell size={17} />
              Text me when the doors open
            </button>
            <button
              onClick={onDone}
              className="mt-1 flex h-10 w-full items-center justify-center text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark"
            >
              Not now
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
