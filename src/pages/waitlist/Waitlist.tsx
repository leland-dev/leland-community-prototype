import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Share, Copy, MessageCircle, Mail, MoreHorizontal, X } from "lucide-react";

import { StepChrome, StepHeading, SharpStar } from "../onboarding/steps/flowUI";
import ChoiceQuestion, { type Choice } from "../onboarding/steps/ChoiceQuestion";
import { MEMBER_AVATARS } from "../onboarding/mockData";
import { REVIEW_STATS } from "../onboarding/data";
import mark from "../../assets/leland-logos/leland-mark.svg";
import wordmark from "../../assets/leland-logos/leland-wordmark.svg";

/* ─────────────────────────────────────────────────────────────────────────
 * Waitlist: landing (b-roll) → details → goal → joining → in line (passes).
 * Invite links (?code=XXXXXX) land on a claim moment with nothing to type;
 * the manual code screen is six big boxes. Screens slide on a left-to-right
 * axis with soft spring easing; back reverses the direction.
 * ──────────────────────────────────────────────────────────────────────── */

type Stage = "landing" | "code" | "claim" | "details" | "goal" | "joining" | "inline";

// Wave ladder: passes sent walk you toward the front of the line.
const WAVES = ["the front of the line", "the first wave", "the second wave"];
const INVITE_CODES = ["7F3K2M", "Q2XM9A", "9BWD4T"];
const CODE_RE = /^[A-Z0-9]{6}$/;

const GOALS: Choice[] = [
  { label: "Get into a top school" },
  { label: "Grow my career" },
  { label: "Build with AI" },
  { label: "Find a coach" },
  { label: "Just exploring" },
];

const YELLOW_PILL =
  "flex w-full items-center justify-center gap-2 rounded-full bg-yellow py-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#F3C948]";
const GREY_PILL =
  "flex w-full items-center justify-center gap-2 rounded-full bg-[#f4f4f4] py-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#e9e9e9]";
const DARK_CTA =
  "flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]";

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

/* ── landing ── */
function Landing({ onJoin, onInvite }: { onJoin: () => void; onInvite: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-[max(5.5rem,env(safe-area-inset-top))] text-center text-white">
      <img
        src={wordmark}
        alt="Leland"
        className="mx-auto h-5 w-auto"
        style={{ filter: "brightness(0) invert(1)" }}
      />

      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-balance font-serif text-[40px] leading-[1.05] tracking-[-0.01em] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
          The community for ambition
        </h1>
        <div className="mt-5 flex items-center gap-1.5">
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
        </div>
        <div className="mt-9 flex flex-col items-center gap-3">
          <div className="flex -space-x-3">
            {MEMBER_AVATARS.slice(0, 6).map((src, i) => (
              <img key={i} src={src} alt="" className="h-11 w-11 rounded-full border-[2.5px] border-white object-cover" style={{ zIndex: 6 - i }} />
            ))}
          </div>
          <span className="text-[13.5px] leading-tight text-white/80">
            <span className="font-semibold text-white">2,000+</span> experts
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        <button onClick={onJoin} className={YELLOW_PILL}>
          Join the waitlist
          <ArrowRight size={18} className="shrink-0" />
        </button>
        <button onClick={onInvite} className={GREY_PILL}>
          I have an invite code
        </button>
      </div>
    </div>
  );
}

/* ── manual code entry: six big boxes, every letter matters ── */
function CodeEntry({ onClaim }: { onClaim: (code: string) => void }) {
  const [code, setCode] = useState("");
  const valid = CODE_RE.test(code);
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
        {/* real input overlaid, keeps paste + keyboard */}
        <input
          autoFocus
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

/* ── claim: the moment. No code to re-enter, nothing to keep. ── */
function Claim({ onClaim }: { onClaim: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 pt-4 text-center">
      <div className="flex flex-1 flex-col items-center justify-center pb-16">
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 12 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow"
        >
          <img src={mark} alt="" className="h-8 w-8" style={{ filter: "brightness(0)" }} />
        </motion.span>
        <h1 className="mt-5 text-balance font-serif text-[32px] leading-[1.1] text-gray-dark">
          A friend saved you a spot
        </h1>
        <p className="mt-3 max-w-[28ch] text-[15px] leading-relaxed text-gray-light">
          This pass skips you to the front of the line.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        <button onClick={onClaim} className={`pointer-events-auto ${DARK_CTA}`}>
          Claim your spot
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

/* ── details ── */
function Details({ onContinue }: { onContinue: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const valid = name.trim().length >= 2 && phone.replace(/\D/g, "").length === 10;
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (valid) onContinue(); }}
      className="flex h-full flex-col px-6 pt-2"
    >
      <StepHeading title="Save your spot" />
      <div className="flex flex-col gap-3">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          enterKeyHint="next"
          placeholder="First name"
          className="w-full rounded-xl border border-gray-stroke bg-white px-4 py-3.5 text-[16px] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-gray-dark/40"
        />
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
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        <button
          type="submit"
          disabled={!valid}
          className={`pointer-events-auto ${DARK_CTA} ${valid ? "" : "cursor-not-allowed !bg-gray-dark/30"}`}
        >
          Continue
        </button>
      </div>
    </form>
  );
}

/* ── joining loader: brand loader GIF on its matching cream surface ── */
function Joining({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const dur = reduced ? 1.4 : 4.6;
  useEffect(() => {
    const t = window.setTimeout(onDone, dur * 1000 + 200);
    return () => window.clearTimeout(t);
  }, [onDone, dur]);
  return (
    <div className="flex h-full flex-col items-center justify-center px-10" style={{ backgroundColor: "#F8F7F4" }}>
      <img src="/leland-loader.gif" alt="" className="w-[170px]" />
      <div className="mt-6 h-1.5 w-56 max-w-[70%] overflow-hidden rounded-full bg-black/[0.08]">
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
      <p className="mt-5 text-[15px] font-medium text-gray-light">Saving your spot…</p>
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-gradient-to-t from-black/60 via-black/30 to-transparent"
      />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-[440px] rounded-t-[18px] bg-[#F2F2F7] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center gap-3 px-4 pb-3 pt-4">
          <video
            src="/waitlist-broll.mp4"
            muted autoPlay loop playsInline
            className="h-12 w-12 shrink-0 rounded-[10px] object-cover"
          />
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[15px] font-semibold leading-tight text-[#1C1C1E]">
              The community for ambition
            </p>
            <p className="truncate text-[12.5px] text-[#8E8E93]">
              community.leland-staging.com · 1 Link
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#E3E3E8] text-[#7C7C82]"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="h-px bg-black/[0.08]" />

        <div className="flex gap-5 px-5 pb-1 pt-4">
          {[
            { label: "Messages", Icon: MessageCircle, cls: "bg-gradient-to-b from-[#6BE36B] to-[#12B722]" },
            { label: "Mail", Icon: Mail, cls: "bg-gradient-to-b from-[#4FA8F8] to-[#1663D9]" },
            { label: "More", Icon: MoreHorizontal, cls: "bg-[#D1D1D6]" },
          ].map((a) => (
            <button key={a.label} onClick={() => sendVia(false)} className="flex w-[60px] flex-col items-center gap-1.5">
              <span className={`flex h-[60px] w-[60px] items-center justify-center rounded-[14px] text-white ${a.cls}`}>
                <a.Icon size={30} strokeWidth={a.label === "More" ? 2.5 : 2} fill={a.label === "Messages" ? "currentColor" : "none"} />
              </span>
              <span className="text-[11px] text-[#3C3C43]">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="mx-4 mt-3 overflow-hidden rounded-xl bg-white">
          <button
            onClick={() => sendVia(true)}
            className="flex w-full items-center justify-between px-4 py-3 text-[16px] text-[#1C1C1E]"
          >
            Copy
            <Copy size={19} className="text-[#1C1C1E]" />
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* ── in line: staged entrance, passes, done ── */
function InLine({ invited, reduced, onDone }: { invited: boolean; reduced: boolean; onDone: () => void }) {
  const [sent, setSent] = useState<boolean[]>([false, false, false]);
  const [sharing, setSharing] = useState<number | null>(null);
  const used = sent.filter(Boolean).length;
  const wave = WAVES[Math.max(0, (invited ? 1 : 2) - used)];

  const markSent = (i: number) => {
    setSent((s) => s.map((v, idx) => (idx === i ? true : v)));
    setSharing(null);
  };

  const ease = [0.32, 0.72, 0, 1] as const;

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-6 pb-10 pt-4 text-center">
        <motion.div
          initial={reduced ? undefined : { y: 170 }}
          animate={{ y: 0 }}
          transition={{ delay: 1.0, duration: 0.6, ease }}
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
            transition={{ delay: reduced ? 0 : 0.3, duration: 0.45, ease }}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={wave}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="mt-4 text-balance font-serif text-[30px] leading-[1.12] text-gray-dark"
              >
                You're in {wave}
              </motion.h1>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0.1 : 1.35, duration: 0.5 }}
        >
          <p className="mt-3 text-[13.5px] text-gray-light">Your spot is secure</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0.2 : 1.6, duration: 0.5 }}
        >
          <p className="mx-auto mt-9 max-w-[30ch] text-[15px] leading-relaxed text-gray-light">
            Send these 3 passes and we'll bump you to the front of the line.
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            {INVITE_CODES.map((code, i) => (
              <div
                key={code}
                className="flex items-center gap-3 rounded-2xl bg-[#f4f4f4] p-4 text-left"
              >
                <img
                  src={mark}
                  alt=""
                  className={`ml-0.5 h-7 w-7 shrink-0 ${sent[i] ? "opacity-30" : ""}`}
                  style={{ filter: "brightness(0)" }}
                />
                <span className="min-w-0 flex-1">
                  <span className={`block text-[15px] font-medium ${sent[i] ? "text-gray-light" : "text-gray-dark"}`}>
                    {sent[i] ? "Pass sent" : "Skip-the-line pass"}
                  </span>
                  <span className="block truncate font-mono text-[13px] tracking-[0.08em] text-gray-light">{code}</span>
                </span>
                {sent[i] ? (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-light">
                    <Check size={19} strokeWidth={2.5} />
                  </span>
                ) : (
                  <button
                    onClick={() => setSharing(i)}
                    aria-label="Share pass"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-dark text-white transition-colors hover:bg-[#333]"
                  >
                    <Share size={17} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 text-[13px] text-gray-light">
            We'll text you when your wave opens.
          </p>

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

export default function Waitlist() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState<Stage>("landing");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  // +1 = forward (new screen slides in from the right), -1 = back
  const dirRef = useRef<1 | -1>(1);

  useEffect(() => { document.title = "Leland — Join the waitlist"; }, []);

  useEffect(() => {
    const code = codeFromUrl();
    if (code) {
      setInviteCode(code);
      setStage("claim");
    }
  }, []);

  const go = (next: Stage, dir: 1 | -1 = 1) => {
    dirRef.current = dir;
    setStage(next);
  };

  const chrome =
    stage === "code"
      ? { onBack: () => go("landing", -1), step: undefined }
      : stage === "claim"
        ? { onBack: () => go(inviteCode && !codeFromUrl() ? "code" : "landing", -1), step: undefined }
        : stage === "details"
          ? { onBack: () => go(inviteCode ? "claim" : "landing", -1), step: { index: 1, total: 2 } }
          : stage === "goal"
            ? { onBack: () => go("details", -1), step: { index: 2, total: 2 } }
            : stage === "inline"
              ? { onBack: () => go("goal", -1), step: undefined }
              : null;

  /* jelly slide: soft spring on x, quick fade; direction-aware */
  const slideVariants = {
    enter: (d: number) => (reduced ? { opacity: 0 } : { x: d > 0 ? 96 : -96, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => (reduced ? { opacity: 0 } : { x: d > 0 ? -96 : 96, opacity: 0 }),
  };
  const slideTransition = {
    x: { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.9 },
    opacity: { duration: 0.3, ease: "easeOut" as const },
  };

  const screen = (key: string, children: React.ReactNode) => (
    <motion.div
      key={key}
      custom={dirRef.current}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="h-full"
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
            exit={{ opacity: 0, x: reduced ? 0 : -60 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
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
        {chrome ? <StepChrome onBack={chrome.onBack} step={chrome.step} /> : null}

        <div className="relative min-h-0 flex-1">
          <AnimatePresence mode="wait" custom={dirRef.current}>
            {stage === "landing"
              ? screen("landing", <Landing onJoin={() => go("details")} onInvite={() => go("code")} />)
              : stage === "code"
                ? screen("code", <CodeEntry onClaim={(c) => { setInviteCode(c); go("claim"); }} />)
                : stage === "claim"
                  ? screen("claim", <Claim onClaim={() => go("details")} />)
                  : stage === "details"
                    ? screen("details", <Details onContinue={() => go("goal")} />)
                    : stage === "goal"
                      ? screen("goal", (
                          <ChoiceQuestion
                            title="What brings you to Leland?"
                            subtitle="Pick any that apply."
                            options={GOALS}
                            multi
                            onContinue={() => go("joining")}
                          />
                        ))
                      : stage === "joining"
                        ? screen("joining", <Joining reduced={reduced} onDone={() => go("inline")} />)
                        : screen("inline", <InLine invited={!!inviteCode} reduced={reduced} onDone={() => navigate("/")} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
