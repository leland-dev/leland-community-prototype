import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, Bell, Check, Copy, Ticket, Sparkles, TrendingUp, GraduationCap, Laptop, MessageCircle, Mail, X } from "lucide-react";

import { StepChrome, StepHeading, SharpStar, StatusBar } from "../onboarding/steps/flowUI";
import { MEMBER_AVATARS } from "../onboarding/mockData";
import { REVIEW_STATS } from "../onboarding/data";
import mark from "../../assets/leland-logos/leland-mark.svg";
import wordmark from "../../assets/leland-logos/leland-wordmark.svg";

/* ─────────────────────────────────────────────────────────────────────────
 * Waitlist: landing (b-roll) → details → goal → joining → in line (passes).
 * Invite links (?code=XXXXXX) and manual entry both land on a merged claim +
 * details screen. Transition system: screens are absolutely stacked so exits
 * and entrances overlap; a constant-height chrome slot prevents reflow; the
 * landing cascades its elements off to the left with a stagger.
 * ──────────────────────────────────────────────────────────────────────── */

type Stage = "landing" | "code" | "details" | "goal" | "joining" | "inline" | "front" | "notify";

// Spot in line by passes sent: 0, 1, 2. The third send goes to the finale.
const SPOT_LADDER = { regular: [158, 106, 54], invited: [42, 28, 15] } as const;
const INVITE_CODES = ["7F3K2M", "Q2XM9A", "9BWD4T"];
const CODE_RE = /^[A-Z0-9]{6}$/;

const YELLOW_PILL =
  "flex w-full items-center justify-center gap-2 rounded-full bg-yellow py-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#F3C948]";
const GREY_PILL =
  "flex w-full items-center justify-center gap-2 rounded-full bg-[#f4f4f4] py-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#e9e9e9]";
const DARK_CTA =
  "flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]";

const EASE = [0.32, 0.72, 0, 1] as const;

function formatPhone(input: string): string {
  const d = input.replace(/\D/g, "").slice(0, 10);
  if (!d) return "";
  if (d.length < 3) return `(${d}`;
  if (d.length === 3) return `(${d})`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function codeFromUrl(): string | null {
  const fromSearch = new URLSearchParams(window.location.search).get("code");
  const hash = window.location.hash;
  const fromHash = hash.includes("?")
    ? new URLSearchParams(hash.slice(hash.indexOf("?") + 1)).get("code")
    : null;
  const raw = (fromSearch ?? fromHash ?? "").toUpperCase().trim();
  return CODE_RE.test(raw) ? raw : null;
}

/* Focus an input only after the slide settles, without scroll-jumping. */
function useSettledFocus<T extends HTMLInputElement>(delay = 520) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const t = window.setTimeout(() => ref.current?.focus({ preventScroll: true }), delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return ref;
}

/* ── landing: elements enter with a stagger, cascade off-left on exit ── */
const landItem = {
  enter: { x: 64, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { x: { type: "spring" as const, stiffness: 260, damping: 28 }, opacity: { duration: 0.35 } } },
  exit: { x: -110, opacity: 0, transition: { duration: 0.45, ease: EASE } },
};

// Cascade item for screens that build in element by element.
const cascadeItem = {
  enter: { x: 64, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { x: { type: "spring" as const, stiffness: 280, damping: 28 }, opacity: { duration: 0.3 } } },
};

function Landing({ onJoin, onInvite }: { onJoin: () => void; onInvite: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-9 text-center text-white">
      <motion.img
        variants={landItem}
        src={wordmark}
        alt="Leland"
        className="mx-auto h-5 w-auto"
        style={{ filter: "brightness(0) invert(1)" }}
      />

      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.h1
          variants={landItem}
          className="text-balance font-serif text-[40px] leading-[1.05] tracking-[-0.01em] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
        >
          The community for ambition
        </motion.h1>
        <motion.div variants={landItem} className="mt-5 flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SharpStar key={i} size={15} className="text-yellow" />
            ))}
          </div>
          <span className="text-[16px] font-semibold tabular-nums text-white/90">
            {REVIEW_STATS.reviews.toLocaleString()} reviews
          </span>
          <span className="h-3 w-px rounded-sm bg-white/30" />
          <span className="text-[16px] text-white/70">{REVIEW_STATS.avg} avg</span>
        </motion.div>
        <motion.div variants={landItem} className="mt-9 flex flex-col items-center gap-3">
          <div className="flex -space-x-3">
            {MEMBER_AVATARS.slice(0, 6).map((src, i) => (
              <img key={i} src={src} alt="" className="h-11 w-11 rounded-full border-[2.5px] border-white object-cover" style={{ zIndex: 6 - i }} />
            ))}
          </div>
          <span className="text-[13.5px] leading-tight text-white/80">
            <span className="font-semibold text-white">2,000+</span> experts
          </span>
        </motion.div>
      </div>

      <motion.div variants={landItem} className="flex w-full flex-col items-center gap-3">
        <button onClick={onJoin} className={YELLOW_PILL}>
          Join the waitlist
          <ArrowRight size={18} className="shrink-0" />
        </button>
        <button onClick={onInvite} className={GREY_PILL}>
          I have an invite code
        </button>
      </motion.div>
    </div>
  );
}

/* ── manual code entry: six big boxes ── */
function CodeEntry({ onClaim }: { onClaim: (code: string) => void }) {
  const [code, setCode] = useState("");
  const valid = CODE_RE.test(code);
  const inputRef = useSettledFocus();
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (valid) onClaim(code); }}
      className="flex h-full flex-col px-6 pt-2"
    >
      <StepHeading
        title="Enter your invite code"
        subtitle="Got a link instead? Just tap it."
      />
      <div className="relative">
        <div className="flex justify-between gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const filled = i < code.length;
            const active = i === code.length;
            return (
              <div
                key={i}
                className={`flex h-16 flex-1 items-center justify-center rounded-2xl font-mono text-[26px] font-semibold text-gray-dark transition-colors ${
                  active ? "bg-white ring-2 ring-gray-dark" : "bg-gray-hover"
                }`}
              >
                {filled ? (
                  code[i]
                ) : active ? (
                  <span className="h-7 w-[2px] animate-pulse rounded-full bg-gray-dark" />
                ) : null}
              </div>
            );
          })}
        </div>
        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-label="6-character invite code"
          className="absolute inset-0 h-full w-full cursor-pointer bg-transparent text-transparent caret-transparent outline-none"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        <button
          type="submit"
          disabled={!valid}
          className={`pointer-events-auto ${DARK_CTA} ${valid ? "" : "cursor-not-allowed !bg-gray-dark/30"}`}
        >
          Claim my pass
        </button>
      </div>
    </form>
  );
}

/* ── details: doubles as the claim moment when they arrived with a pass ── */
function Details({ invited, cascade, onContinue }: { invited: boolean; cascade: boolean; onContinue: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const valid = name.trim().length >= 2 && phone.replace(/\D/g, "").length === 10;
  const nameRef = useSettledFocus(1300);
  const item = cascade ? cascadeItem : undefined;
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (valid) onContinue(); }}
      className="flex h-full flex-col px-6 pt-2"
    >
      <motion.div variants={item}>
        {invited ? (
          <div className="mb-6">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow text-gray-dark">
              <Ticket size={24} />
            </span>
            <h2 className="mt-5 text-balance font-serif text-[28px] leading-[1.12] text-gray-dark">
              A friend saved you a spot
            </h2>
            <p className="mt-2 max-w-[30ch] text-balance text-[15px] leading-relaxed text-gray-light">
              This pass skips you to the front of the line.
            </p>
          </div>
        ) : (
          <StepHeading title="Save your spot" />
        )}
      </motion.div>
      <div className="flex flex-col gap-3">
        <motion.div variants={item}>
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
            enterKeyHint="next"
            placeholder="First name"
            className="w-full rounded-xl border border-gray-stroke bg-white px-4 py-3.5 text-[16px] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-gray-dark/40"
          />
        </motion.div>
        <motion.div variants={item}>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            enterKeyHint="go"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(555) 123-4567"
            className="w-full rounded-xl border border-gray-stroke bg-white px-4 py-3.5 text-[16px] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-gray-dark/40"
          />
        </motion.div>
      </div>

      <motion.div
        variants={item}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8"
      >
        <button
          type="submit"
          disabled={!valid}
          className={`pointer-events-auto ${DARK_CTA} w-full ${valid ? "" : "cursor-not-allowed !bg-gray-dark/30"}`}
        >
          {invited ? "Claim your spot" : "Continue"}
        </button>
      </motion.div>
    </form>
  );
}

/* ── goal: 1:1 with the v3 onboarding GoalSelect (same buckets + sizing) ── */
const GOAL_BUCKETS = [
  { label: "Build with AI", Icon: Sparkles },
  { label: "Grow your career", Icon: TrendingUp },
  { label: "Get into school", Icon: GraduationCap },
];

function Goal({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="h-full overflow-y-auto px-6 pb-10 pt-2">
      <StepHeading title="What brings you to Leland?" />
      <div className="flex flex-col gap-3">
        {GOAL_BUCKETS.map((b, i) => (
          <motion.button
            key={b.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.07, ease: EASE }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className="flex items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-5 py-5 text-left text-[17px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
          >
            <b.Icon size={22} strokeWidth={1.9} className="shrink-0 text-gray-dark" />
            {b.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ── joining: tiny brand loader on pristine white ── */
export function Joining({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const dur = reduced ? 1.4 : 4.6;
  useEffect(() => {
    const t = window.setTimeout(onDone, dur * 1000 + 200);
    return () => window.clearTimeout(t);
  }, [onDone, dur]);
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white px-10">
      <img src="/leland-loader-alpha.png" alt="" className="w-[72px]" />
      <div className="mt-7 h-1 w-40 overflow-hidden rounded-full bg-gray-stroke">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: reduced ? "100%" : ["0%", "58%", "58%", "100%"] }}
          transition={
            reduced
              ? { duration: dur }
              : { duration: dur, times: [0, 0.38, 0.64, 1], ease: "easeInOut" }
          }
          className="h-full rounded-full bg-gray-dark"
        />
      </div>
      <p className="mt-4 text-[13.5px] font-medium text-gray-light">Saving your spot…</p>
    </div>
  );
}

/* ── share sheet: iOS-fidelity mock ── */
function ShareSheet({ code, onSend, onClose }: { code: string; onSend: () => void; onClose: () => void }) {
  const link = `${window.location.origin}/waitlist?code=${code}`;
  const message = `I saved you a spot in the Leland community. Tap to skip the line: ${link}`;

  const sendVia = (copy: boolean) => {
    if (copy) navigator.clipboard?.writeText(message).catch(() => {});
    onSend();
  };

  const messagesBadge = (
    <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-[6px] bg-gradient-to-b from-[#6BE36B] to-[#12B722] ring-2 ring-[#252527]">
      <MessageCircle size={11} strokeWidth={0} fill="currentColor" className="text-white" />
    </span>
  );
  const airdropBadge = (
    <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-[6px] bg-[#0A84FF] ring-2 ring-[#252527]">
      <svg width="12" height="12" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="5">
        <circle cx="24" cy="24" r="7" />
        <circle cx="24" cy="24" r="18" opacity="0.6" />
      </svg>
    </span>
  );

  const contacts = [
    { name: "June's MacBook Pro", avatar: null as string | null, airdrop: true },
    { name: "Maya Chen", avatar: MEMBER_AVATARS[0], airdrop: false },
    { name: "April Ross", avatar: MEMBER_AVATARS[1], airdrop: false },
    { name: "Sean Park", avatar: MEMBER_AVATARS[2], airdrop: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex flex-col bg-black/85"
    >
      <StatusBar light />

      {/* link preview: a demo of the first screen */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.06 }}
        onClick={(e) => e.stopPropagation()}
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-8"
      >
        <div className="w-full max-w-[340px] overflow-hidden rounded-[16px] bg-[#2C2C2E] shadow-2xl">
          <img
            src="/waitlist-preview.png"
            alt=""
            className="h-[238px] w-full object-cover"
            style={{ objectPosition: "50% 30%" }}
          />
          <div className="bg-[#3A3A3C] px-4 py-3 text-left">
            <p className="text-[16px] font-medium leading-snug text-white">
              The community for ambition
            </p>
            <p className="mt-0.5 truncate text-[13px] text-white/55">
              community.leland-staging.com
            </p>
          </div>
        </div>
        <button
          onClick={() => sendVia(true)}
          className="flex items-center gap-2 rounded-full bg-[#A8C7FA] px-6 py-2.5 text-[16px] font-medium text-[#062E6F]"
        >
          Copy link <Copy size={17} />
        </button>
      </motion.div>

      {/* the sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.32, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-[440px] rounded-t-[18px] bg-[#252527] pb-[max(1.25rem,env(safe-area-inset-bottom))] text-left"
      >
        <div className="flex items-center gap-3 px-4 pb-3.5 pt-4">
          <img src="/waitlist-preview.png" alt="" className="h-12 w-12 shrink-0 rounded-[10px] object-cover" style={{ objectPosition: "50% 30%" }} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold leading-tight text-white">
              The community for ambition
            </p>
            <p className="truncate text-[12.5px] text-white/50">community.leland-staging.com</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#3A3A3C] text-[#9B9BA1]"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="h-px bg-white/10" />

        {/* contacts */}
        <div className="flex gap-2 overflow-x-auto px-4 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {contacts.map((c) => (
            <button
              key={c.name}
              onClick={() => sendVia(false)}
              className="flex w-[82px] shrink-0 flex-col items-center gap-1.5"
            >
              <span className="relative">
                {c.avatar ? (
                  <img src={c.avatar} alt="" className="h-[60px] w-[60px] rounded-full object-cover" />
                ) : (
                  <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white">
                    <Laptop size={30} strokeWidth={1.6} className="text-gray-dark" />
                  </span>
                )}
                {c.airdrop ? airdropBadge : messagesBadge}
              </span>
              <span className="text-center text-[11px] leading-[1.25] text-white/90">{c.name}</span>
            </button>
          ))}
        </div>

        {/* apps */}
        <div className="flex gap-2 px-4 pb-1 pt-4">
          <button onClick={() => sendVia(false)} className="flex w-[82px] flex-col items-center gap-1.5">
            <span className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px] bg-[#2E3033]">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="#1FA3FF" strokeWidth="3.2">
                <circle cx="24" cy="24" r="6" />
                <circle cx="24" cy="24" r="13" opacity="0.7" />
                <circle cx="24" cy="24" r="20" opacity="0.4" />
              </svg>
            </span>
            <span className="text-[11px] text-white/80">AirDrop</span>
          </button>
          <button onClick={() => sendVia(false)} className="flex w-[82px] flex-col items-center gap-1.5">
            <span className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px] bg-gradient-to-b from-[#6BE36B] to-[#12B722] text-white">
              <MessageCircle size={32} strokeWidth={0} fill="currentColor" />
            </span>
            <span className="text-[11px] text-white/80">Messages</span>
          </button>
          <button onClick={() => sendVia(false)} className="flex w-[82px] flex-col items-center gap-1.5">
            <span className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4FA8F8] to-[#1663D9] text-white">
              <Mail size={30} strokeWidth={2} />
            </span>
            <span className="text-[11px] text-white/80">Mail</span>
          </button>
          <button onClick={() => sendVia(false)} className="flex w-[82px] flex-col items-center gap-1.5">
            <span className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px] bg-white">
              {/* simplified Chrome roundel: three ring arcs + blue core */}
              <svg width="32" height="32" viewBox="0 0 48 48">
                <g fill="none" strokeWidth="11">
                  <path d="M11.44 16.75 A14.5 14.5 0 0 1 36.56 16.75" stroke="#EA4335" />
                  <path d="M36.56 16.75 A14.5 14.5 0 0 1 24 38.5" stroke="#34A853" />
                  <path d="M24 38.5 A14.5 14.5 0 0 1 11.44 16.75" stroke="#FBBC05" />
                </g>
                <circle cx="24" cy="24" r="8" fill="#4285F4" stroke="#fff" strokeWidth="2.6" />
              </svg>
            </span>
            <span className="text-[11px] text-white/80">Chrome</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── in line: staged entrance, spot-in-line headline, passes, done ── */
export function InLine({ invited, reduced, onDone, onFront }: { invited: boolean; reduced: boolean; onDone: () => void; onFront: () => void }) {
  const [sent, setSent] = useState<boolean[]>([false, false, false]);
  const [sharing, setSharing] = useState<number | null>(null);
  const used = sent.filter(Boolean).length;
  const ladder = invited ? SPOT_LADDER.invited : SPOT_LADDER.regular;
  const spot = ladder[Math.min(used, 2)];

  const markSent = (i: number) => {
    const next = sent.map((v, idx) => (idx === i ? true : v));
    setSent(next);
    setSharing(null);
    // last pass spent: give the check a beat, then the finale
    if (next.every(Boolean)) window.setTimeout(onFront, 700);
  };

  // Real devices get the native share sheet (Web Share API); the mock sheet is
  // the desktop fallback. A pass is only spent if the share actually completes.
  const sharePass = async (i: number) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Leland",
          text: "I saved you a spot in the Leland community. Tap to skip the line:",
          url: `${window.location.origin}/waitlist?code=${INVITE_CODES[i]}`,
        });
        markSent(i);
      } catch {
        // canceled: leave the pass unspent
      }
    } else {
      setSharing(i);
    }
  };

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-6 pb-10 pt-4 text-center">
        <motion.div
          initial={reduced ? undefined : { y: "36vh" }}
          animate={{ y: 0 }}
          transition={{ delay: 1.0, duration: 0.6, ease: EASE }}
        >
          <motion.span
            initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduced ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 12 }}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-yellow text-gray-dark"
          >
            <Check size={28} strokeWidth={3} />
          </motion.span>
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.3, duration: 0.45, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={spot}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="mt-4 text-balance font-serif text-[30px] leading-[1.12] text-gray-dark"
              >
                You're #{spot} in line
              </motion.h1>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0.2 : 1.55, duration: 0.45, ease: EASE }}
          className="mx-auto mt-9 max-w-[30ch] text-[15px] leading-relaxed text-gray-light"
        >
          Invite your friends to move to the front of the line.
        </motion.p>
        <div className="mt-4 flex flex-col gap-2.5">
          {INVITE_CODES.map((code, i) => (
            <motion.div
              key={code}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                reduced
                  ? { duration: 0.3, delay: 0.3 }
                  : { delay: 1.9 + i * 0.22, type: "spring", stiffness: 300, damping: 22 }
              }
              className="flex items-center gap-3 rounded-2xl bg-[#f4f4f4] p-4 text-left"
            >
                <Ticket size={20} className={`ml-1 shrink-0 ${sent[i] ? "text-gray-light" : "text-gray-dark"}`} />
                <span className={`min-w-0 flex-1 truncate font-mono text-[17px] font-semibold tracking-[0.14em] ${sent[i] ? "text-gray-light" : "text-gray-dark"}`}>
                  {code}
                </span>
                {sent[i] ? (
                  <span className="px-3 text-[14px] font-medium text-gray-light">Sent</span>
                ) : (
                  <button
                    onClick={() => sharePass(i)}
                    className="shrink-0 rounded-full bg-yellow px-5 py-2 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#F3C948]"
                  >
                    Invite
                  </button>
                )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0.4 : 2.6, duration: 0.45 }}
        >
          <button onClick={onDone} className={`mt-8 ${DARK_CTA}`}>
            Done
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {sharing !== null ? (
          <ShareSheet
            code={INVITE_CODES[sharing]}
            onSend={() => markSent(sharing)}
            onClose={() => setSharing(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ── front of the line: the finale after all three passes are spent ── */
export function Front({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-4 text-center">
      <div className="flex flex-1 flex-col items-center justify-center pb-10">
        <motion.span
          initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduced ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 11 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow"
        >
          <img src={mark} alt="" className="h-10 w-10" style={{ filter: "brightness(0)" }} />
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45, ease: EASE }}
          className="mt-6 text-balance font-serif text-[34px] leading-[1.08] text-gray-dark"
        >
          You're at the front of the line
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="mt-3 max-w-[28ch] text-[15px] leading-relaxed text-gray-light"
        >
          All three passes spent. The moment the doors open, you're first through.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <button onClick={onDone} className={DARK_CTA}>
          Done
        </button>
      </motion.div>
    </div>
  );
}

/* ── notifications: turn on texts before landing on the profile ── */
export function Notify({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  // The real native permission prompt, where the browser supports it. Either
  // answer moves on; the prototype only cares about the moment itself.
  const request = async () => {
    try {
      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch {
      // unsupported context: just continue
    }
    onDone();
  };

  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-4 text-center">
      <div className="flex flex-1 flex-col items-center justify-center pb-10">
        <motion.span
          initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduced ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 12 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow"
        >
          <Bell size={34} strokeWidth={1.8} className="text-gray-dark" />
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45, ease: EASE }}
          className="mt-6 max-w-[16ch] text-balance font-serif text-[34px] leading-[1.08] text-gray-dark"
        >
          We'll text you when the doors open
        </motion.h1>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <button onClick={request} className={DARK_CTA}>
          Get notified
        </button>
        <button
          onClick={onDone}
          className="mt-3 flex h-11 w-full items-center justify-center text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark"
        >
          Not now
        </button>
      </motion.div>
    </div>
  );
}

export default function Waitlist() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState<Stage>("landing");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const viaRef = useRef<"url" | "code" | null>(null);
  const dirRef = useRef<1 | -1>(1);
  const delayRef = useRef(0);

  useEffect(() => { document.title = "Leland — Join the waitlist"; }, []);

  useEffect(() => {
    const code = codeFromUrl();
    if (code) {
      setInviteCode(code);
      viaRef.current = "url";
      setStage("details");
    }
  }, []);

  type Nav = { d: 1 | -1; delay: number };

  const go = (next: Stage, dir: 1 | -1 = 1) => {
    dirRef.current = dir;
    // Leaving the landing: let the cascade + video fade finish (screen goes
    // fully white) before the next screen enters.
    delayRef.current = stage === "landing" ? 0.8 : 0;
    setStage(next);
  };

  const chrome =
    stage === "code"
      ? { onBack: () => go("landing", -1), step: undefined }
      : stage === "details"
        ? {
            onBack: () => go(viaRef.current === "code" ? "code" : "landing", -1),
            step: inviteCode ? undefined : { index: 1, total: 2 },
          }
        : stage === "goal"
          ? { onBack: () => go("details", -1), step: inviteCode ? undefined : { index: 2, total: 2 } }
          : stage === "inline"
            ? { onBack: () => go("goal", -1), step: undefined }
            : null;

  /* screens are absolutely stacked so exit + enter overlap */
  const screenVariants = {
    enter: (c: Nav) => (reduced ? { opacity: 0 } : { x: c.d > 0 ? 96 : -96, opacity: 0 }),
    center: (c: Nav) => ({
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 280, damping: 30, mass: 0.9, delay: c.delay },
        opacity: { duration: 0.32, ease: "easeOut" as const, delay: c.delay },
      },
    }),
    exit: (c: Nav) =>
      reduced
        ? { opacity: 0 }
        : { x: c.d > 0 ? -96 : 96, opacity: 0, transition: { duration: 0.38, ease: EASE } },
  };

  /* landing orchestrates its children instead of sliding as one block */
  const landingVariants = {
    enter: {},
    center: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
    exit: { transition: { staggerChildren: 0.045 } },
  };

  /* details builds in element by element, left to right */
  const detailsVariants = {
    enter: {},
    center: (c: Nav) => ({
      transition: { delayChildren: (c?.delay ?? 0) + 0.05, staggerChildren: 0.09 },
    }),
    exit: (c: Nav) =>
      reduced
        ? { opacity: 0 }
        : { x: (c?.d ?? 1) > 0 ? -96 : 96, opacity: 0, transition: { duration: 0.38, ease: EASE } },
  };

  const screen = (key: string, children: React.ReactNode, variants: Variants = screenVariants as Variants) => (
    <motion.div
      key={key}
      custom={{ d: dirRef.current, delay: delayRef.current }}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-white">
      {/* b-roll behind the landing */}
      <AnimatePresence>
        {stage === "landing" ? (
          <motion.div
            key="broll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 bg-[#1a1a1a]"
          >
            {reduced ? (
              <video src="/waitlist-broll.mp4" muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <video src="/waitlist-broll.mp4" autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/75" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[440px] flex-col">
        <StatusBar visible={stage !== "landing"} />

        {/* constant-height chrome slot: content never reflows when it appears */}
        <div className="h-[52px] shrink-0">
          <AnimatePresence>
            {chrome ? (
              <motion.div
                key="chrome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <StepChrome onBack={chrome.onBack} step={chrome.step} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative min-h-0 flex-1">
          <AnimatePresence custom={{ d: dirRef.current, delay: delayRef.current }}>
            {stage === "landing"
              ? screen("landing", <Landing onJoin={() => go("details")} onInvite={() => go("code")} />, landingVariants as Variants)
              : stage === "code"
                ? screen("code", <CodeEntry onClaim={(c) => { setInviteCode(c); viaRef.current = "code"; go("details"); }} />)
                : stage === "details"
                  ? screen("details", <Details invited={!!inviteCode} cascade={!reduced} onContinue={() => go("goal")} />, (reduced ? screenVariants : detailsVariants) as Variants)
                  : stage === "goal"
                    ? screen("goal", <Goal onSelect={() => go("joining")} />)
                    : stage === "joining"
                      ? screen("joining", <Joining reduced={reduced} onDone={() => go("inline")} />)
                      : stage === "inline"
                        ? screen("inline", <InLine invited={!!inviteCode} reduced={reduced} onDone={() => go("notify")} onFront={() => go("front")} />)
                        : stage === "front"
                          ? screen("front", <Front reduced={reduced} onDone={() => go("notify")} />)
                          : screen("notify", <Notify reduced={reduced} onDone={() => navigate("/profile-v2")} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
