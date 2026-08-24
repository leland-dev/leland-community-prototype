import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Lock, Check, Bell, Share } from "lucide-react";

import { MEMBER_AVATARS } from "../mockData";
import { memberCountFor } from "../universities";
import { universityLogo } from "./UniversitySearch";
import { ShareSheet } from "../../waitlist/Waitlist";

/* ─────────────────────────────────────────────────────────────────────────
 * WaitlistGate (v4) — the dead end that drives the k-factor.
 *
 *  · Spot in line, anchored on the school ("23 from Stanford ahead of you")
 *  · 0/3 unlock ring — three peers unlocks access; each share moves you up
 *  · Locked "who else from {School} is here" — blurred until unlocked
 *  · A live ticker of people joining, so the line feels like it's moving
 *  · At 3: access unlocked → text-me-when-the-doors-open
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;
const INVITE_CODES = ["7F3K2M", "Q2XM9A", "9BWD4T"];
// spot by invites sent: 0 → 1 → 2 → unlocked
const SPOT_LADDER = [142, 61, 19];
const AHEAD_LADDER = [23, 9, 2];

const TICKER = [
  { name: "Maya C.", from: "same", role: "Class of '27" },
  { name: "Sean P.", from: "Harvard", role: "brought 2 peers" },
  { name: "April R.", from: "same", role: "Class of '26" },
  { name: "Daniel K.", from: "MIT", role: "Class of '28" },
  { name: "Priya S.", from: "same", role: "brought 3 peers · unlocked" },
  { name: "Leo M.", from: "Stanford", role: "Class of '25" },
];

const PEERS = [
  { name: "Maya Chen", role: "Class of '27 · Consulting", avatar: MEMBER_AVATARS[0] },
  { name: "Sean Park", role: "Class of '26 · Product", avatar: MEMBER_AVATARS[2] },
  { name: "April Ross", role: "Class of '25 · now at Bain", avatar: MEMBER_AVATARS[1] },
  { name: "Daniel Kim", role: "Class of '28 · Banking", avatar: MEMBER_AVATARS[3] },
];

function shortName(school: string): string {
  return school.replace(/^University of /, "").replace(/ University$/, "").replace(/ College$/, "");
}

function UnlockRing({ n, size = 88 }: { n: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ececec" strokeWidth="6" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={false}
        animate={{ strokeDashoffset: c * (1 - n / 3) }}
        transition={{ duration: 0.7, ease: EASE }}
      />
    </svg>
  );
}

export default function WaitlistGate({
  school,
  logoKey,
  category,
  onDone,
}: {
  school: string;
  logoKey?: string;
  category: string;
  onDone: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const short = shortName(school);
  const logo = universityLogo(logoKey);
  const members = memberCountFor(school);

  const [sent, setSent] = useState(0);
  const [sharing, setSharing] = useState(false);
  const [notified, setNotified] = useState(false);
  const unlocked = sent >= 3;
  const spot = SPOT_LADDER[Math.min(sent, 2)];
  const ahead = AHEAD_LADDER[Math.min(sent, 2)];

  // live ticker
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setTick((x) => x + 1), 3400);
    return () => window.clearInterval(t);
  }, [reduced]);
  const live = TICKER[tick % TICKER.length];

  const link = `${window.location.origin}/onboarding-v4?school=${encodeURIComponent(school)}&code=${INVITE_CODES[Math.min(sent, 2)]}`;
  const message = `I just got approved for Leland — ${short} is in the first wave. Early access to ${category.toLowerCase()} experts who are exactly where we're trying to go. Claim a ${short} spot before the wave fills: ${link}`;

  const markSent = () => {
    setSharing(false);
    setSent((n) => Math.min(n + 1, 3));
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

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-6 pb-44 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {/* school + live ticker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-contain p-1" /> : <span className="text-[13px] font-semibold">{short.charAt(0)}</span>}
            </span>
            <div>
              <p className="text-[13px] font-semibold text-gray-dark">{short}</p>
              <p className="text-[11.5px] text-gray-light">First wave · {members} approved</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-gray-hover px-2.5 py-1 text-[11px] font-semibold text-gray-dark">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1a7f4b] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1a7f4b]" />
            </span>
            Live
          </span>
        </div>

        {/* headline: spot */}
        <div className="mt-8 text-center">
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.div key="unlocked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <motion.span
                  initial={reduced ? { opacity: 0 } : { scale: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 13 }}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-yellow text-gray-dark"
                >
                  <Check size={28} strokeWidth={3} />
                </motion.span>
                <h1 className="mt-4 text-balance font-serif text-[32px] leading-[1.1] text-gray-dark">Access unlocked</h1>
                <p className="mx-auto mt-2 max-w-[30ch] text-[15px] leading-relaxed text-gray-light">
                  You're first through when the {short} doors open.
                </p>
              </motion.div>
            ) : (
              <motion.div key={`spot-${spot}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-light">Your spot</p>
                <h1 className="mt-1 font-serif text-[64px] leading-none text-gray-dark">#{spot}</h1>
                <p className="mt-2 text-[15px] text-gray-light">
                  <span className="font-semibold text-gray-dark">{ahead}</span> from {short} ahead of you
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* unlock ring */}
        {!unlocked ? (
          <div className="mt-8 flex items-center gap-5 rounded-2xl border border-gray-stroke bg-white p-4">
            <div className="relative shrink-0">
              <UnlockRing n={sent} />
              <span className="absolute inset-0 flex items-center justify-center font-serif text-[22px] text-gray-dark">
                {sent}<span className="text-[14px] text-gray-light">/3</span>
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-gray-dark">Bring 3 {short} peers to unlock</p>
              <p className="mt-1 text-[13.5px] leading-snug text-gray-light">
                {sent === 0
                  ? "Each one moves you up the line. Three opens the door."
                  : sent === 1
                    ? `You moved up ${SPOT_LADDER[0] - SPOT_LADDER[1]} spots. Two more.`
                    : "One more and you're in."}
              </p>
            </div>
          </div>
        ) : null}

        {/* live ticker line */}
        <div className="mt-4 h-6 overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={tick}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-[12.5px] text-gray-light"
            >
              <span className="font-medium text-gray-dark">{live.name}</span>
              {" · "}
              {live.from === "same" ? short : live.from}
              {" · "}
              {live.role}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* who else from {school} — locked until unlocked */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[15px] font-semibold text-gray-dark">Who else from {short} is here</p>
            {!unlocked ? (
              <span className="flex items-center gap-1 text-[12px] font-medium text-gray-light">
                <Lock size={12} /> Unlocks at 3
              </span>
            ) : null}
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-gray-stroke bg-white">
            <div className={`flex flex-col transition-all duration-700 ${unlocked ? "" : "select-none blur-[6px]"}`}>
              {PEERS.map((p, i) => (
                <div key={p.name} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-stroke" : ""}`}>
                  <img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-medium text-gray-dark">{p.name}</p>
                    <p className="truncate text-[12.5px] text-gray-light">{p.role}</p>
                  </div>
                  <span className="rounded-full bg-gray-hover px-2.5 py-1 text-[11px] font-medium text-gray-dark">Approved</span>
                </div>
              ))}
            </div>
            {!unlocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-dark text-white shadow-card">
                  <Lock size={18} />
                </span>
                <p className="mt-2.5 text-[13px] font-medium text-gray-dark">
                  {members} {short} members approved so far
                </p>
              </div>
            ) : null}
          </div>
        </div>
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
              Invite a {short} peer
            </motion.button>
            <p className="pointer-events-auto mt-2.5 text-center text-[12px] text-gray-xlight">
              Invite link · {INVITE_CODES[Math.min(sent, 2)]} · we'll text you when the doors open
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
              onClick={onDone}
              className="pointer-events-auto mt-2 flex h-11 w-full items-center justify-center text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark"
            >
              Not now
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {sharing ? (
          <ShareSheet
            code={INVITE_CODES[Math.min(sent, 2)]}
            link={link}
            message={message}
            title={`${short} is in the first wave`}
            onSend={markSent}
            onClose={() => setSharing(false)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
