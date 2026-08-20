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
import LelandLoader from "./LelandLoader";

/* ─────────────────────────────────────────────────────────────────────────
 * Waitlist — a dead-end, invite-only "grand opening line" flow:
 *   landing (b-roll bg) → details → goal → joining → in line (spot + passes).
 * Invited users arrive via a pass link (?code=LELAND-XXXX) that lands them on
 * a claim screen with the code already applied — no copy/paste. A manual code
 * screen exists as the fallback. Mirrors onboarding v3 chrome + CTAs.
 * ──────────────────────────────────────────────────────────────────────── */

type Stage = "landing" | "code" | "claim" | "details" | "goal" | "joining" | "inline";

const START_SPOT = 1247;
const INVITED_SPOT = 47; // a pass skips you (near) the front
const JUMP = 100; // spots gained per accepted pass
const INVITE_CODES = ["LELAND-7F3K", "LELAND-Q2XM", "LELAND-9BWD"];
const CODE_RE = /^LELAND-[A-Z0-9]{4}$/;

// Mock: who sent the pass (real impl resolves the code server-side).
const INVITER_BY_CODE: Record<string, string> = {
  "LELAND-7F3K": "Maya P.",
  "LELAND-Q2XM": "Andre S.",
  "LELAND-9BWD": "Karen J.",
};

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

/* Read ?code= from the URL — works for both /waitlist?code=X and hash URLs. */
function codeFromUrl(): string | null {
  const fromSearch = new URLSearchParams(window.location.search).get("code");
  const hash = window.location.hash;
  const fromHash = hash.includes("?")
    ? new URLSearchParams(hash.slice(hash.indexOf("?") + 1)).get("code")
    : null;
  const raw = (fromSearch ?? fromHash ?? "").toUpperCase().trim();
  return CODE_RE.test(raw) ? raw : null;
}

/* Animated spot number: counts up on reveal, then eases to each new value. */
function useAnimatedNumber(target: number, reduced: boolean) {
  const [shown, setShown] = useState(reduced ? target : 0);
  const shownRef = useRef(shown);
  shownRef.current = shown;
  useEffect(() => {
    if (reduced) { setShown(target); return; }
    const from = shownRef.current;
    if (from === target) return;
    const ms = from === 0 ? 1000 : 600;
    let raf = 0, start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / ms, 1);
      setShown(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced]);
  return shown;
}

const rise = (reduced: boolean) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const, delay: 0.05 },
});

/* ── landing — white text over the b-roll ── */
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

/* ── manual code entry — the fallback when someone didn't tap their link ── */
function CodeEntry({ onClaim }: { onClaim: (code: string) => void }) {
  const [code, setCode] = useState("");
  const valid = CODE_RE.test(code);
  const format = (v: string) => {
    let s = v.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (!s.startsWith("LELAND-") && s.length > 6 && s.startsWith("LELAND")) s = `LELAND-${s.slice(6)}`;
    return s.slice(0, 11);
  };
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (valid) onClaim(code); }}
      className="flex h-full flex-col px-6 pt-2"
    >
      <StepHeading
        title="Enter your invite code"
        subtitle="Got a link instead? Just tap it — the code fills in on its own."
      />
      <input
        autoFocus
        value={code}
        onChange={(e) => setCode(format(e.target.value))}
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
        placeholder="LELAND-XXXX"
        className="w-full rounded-xl border border-gray-stroke bg-white px-4 py-3.5 text-center font-mono text-[18px] tracking-[0.08em] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-gray-dark/40"
      />

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

/* ── claim — landing spot for a pass link; the code is already applied ── */
function Claim({ code, onClaim }: { code: string; onClaim: () => void }) {
  const inviter = INVITER_BY_CODE[code] ?? "A friend";
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
        <h1 className="mt-5 text-balance font-serif text-[30px] leading-[1.1] text-gray-dark">
          {inviter} saved you a spot
        </h1>
        <p className="mt-3 max-w-[28ch] text-[15px] leading-relaxed text-gray-light">
          This pass skips you to the front of the line.
        </p>
        <span className="mt-6 rounded-full bg-gray-hover px-4 py-2 font-mono text-[14px] tracking-[0.06em] text-gray-dark">
          {code}
        </span>
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

/* ── details — first name + phone ── */
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

/* ── joining loader — logo animation + a bar that stalls, then finishes ── */
function Joining({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const dur = reduced ? 1.4 : 4.6;
  useEffect(() => {
    const t = window.setTimeout(onDone, dur * 1000 + 200);
    return () => window.clearTimeout(t);
  }, [onDone, dur]);
  return (
    <div className="flex h-full flex-col items-center justify-center px-10">
      <LelandLoader size={140} ink="#222222" bg="#ffffff" />
      <div className="mt-8 h-1.5 w-56 max-w-[70%] overflow-hidden rounded-full bg-gray-stroke">
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

/* ── share sheet — iOS-fidelity mock: full-screen gradient scrim (light at
      the top for the emulator's status bar), grey sheet, link preview with the
      live b-roll video, squircle app tiles, grouped Copy row. ── */
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
        {/* header — link preview, like iOS shows the shared content */}
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

        {/* app tiles */}
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

        {/* grouped action row */}
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

/* ── in line — staged entrance: check pops, rises, then place + passes ── */
function InLine({ invited, reduced }: { invited: boolean; reduced: boolean }) {
  const [sent, setSent] = useState<boolean[]>([false, false, false]);
  const [sharing, setSharing] = useState<number | null>(null);
  const used = sent.filter(Boolean).length;
  const spot = Math.max(1, (invited ? INVITED_SPOT : START_SPOT) - used * JUMP);
  const shown = useAnimatedNumber(spot, reduced);

  const markSent = (i: number) => {
    setSent((s) => s.map((v, idx) => (idx === i ? true : v)));
    setSharing(null);
  };

  const ease = [0.32, 0.72, 0, 1] as const;

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-6 pb-10 pt-4 text-center">
        {/* hero — pops centered, then rises to the top */}
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
          <motion.h1
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.3, duration: 0.45, ease }}
            className="mt-4 text-balance font-serif text-[28px] leading-[1.12] text-gray-dark"
          >
            {invited ? "You skipped the line" : "You're in line"}
          </motion.h1>
        </motion.div>

        {/* place in line — no bar, no fixed-total implication */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0.1 : 1.35, duration: 0.5 }}
        >
          <p className="mt-7 font-serif text-[44px] leading-none tabular-nums text-gray-dark">
            {shown.toLocaleString()}
          </p>
          <p className="mt-2 text-[13.5px] text-gray-light">your place in line</p>
        </motion.div>

        {/* passes */}
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
                  <span className="block truncate font-mono text-[12.5px] text-gray-light">{code}</span>
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

  useEffect(() => { document.title = "Leland — Join the waitlist"; }, []);

  // A tapped pass link carries the code — land straight on claim, prefilled.
  useEffect(() => {
    const code = codeFromUrl();
    if (code) {
      setInviteCode(code);
      setStage("claim");
    }
  }, []);

  const claim = (code: string) => {
    setInviteCode(code);
    setStage("claim");
  };

  // Same persistent chrome as onboarding — every page past the landing has a back.
  const chrome =
    stage === "code"
      ? { onBack: () => setStage("landing"), step: undefined }
      : stage === "claim"
        ? { onBack: () => setStage(inviteCode && !codeFromUrl() ? "code" : "landing"), step: undefined }
        : stage === "details"
          ? { onBack: () => setStage(inviteCode ? "claim" : "landing"), step: { index: 1, total: 2 } }
          : stage === "goal"
            ? { onBack: () => setStage("details"), step: { index: 2, total: 2 } }
            : stage === "inline"
              ? { onBack: () => setStage("goal"), step: undefined }
              : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-white">
      {/* ── b-roll collage behind the landing, faded by a scrim ── */}
      <AnimatePresence>
        {stage === "landing" ? (
          <motion.div
            key="broll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
          <AnimatePresence mode="wait">
            {stage === "landing" ? (
              <motion.div key="landing" {...rise(reduced)} className="h-full">
                <Landing onJoin={() => setStage("details")} onInvite={() => setStage("code")} />
              </motion.div>
            ) : stage === "code" ? (
              <motion.div key="code" {...rise(reduced)} className="h-full">
                <CodeEntry onClaim={claim} />
              </motion.div>
            ) : stage === "claim" ? (
              <motion.div key="claim" {...rise(reduced)} className="h-full">
                <Claim code={inviteCode ?? INVITE_CODES[0]} onClaim={() => setStage("details")} />
              </motion.div>
            ) : stage === "details" ? (
              <motion.div key="details" {...rise(reduced)} className="h-full">
                <Details onContinue={() => setStage("goal")} />
              </motion.div>
            ) : stage === "goal" ? (
              <motion.div key="goal" {...rise(reduced)} className="h-full">
                <ChoiceQuestion
                  title="What brings you to Leland?"
                  subtitle="Pick any that apply."
                  options={GOALS}
                  multi
                  onContinue={() => setStage("joining")}
                />
              </motion.div>
            ) : stage === "joining" ? (
              <motion.div key="joining" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="h-full">
                <Joining reduced={reduced} onDone={() => setStage("inline")} />
              </motion.div>
            ) : (
              <motion.div key="inline" {...rise(reduced)} className="h-full">
                <InLine invited={!!inviteCode} reduced={reduced} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
