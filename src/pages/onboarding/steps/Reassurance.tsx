import { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { AI_GRADIENT_VIDEO, GLASS_PILL, type Branch } from "../data";
import { BUCKETS } from "../flowConfig";
import treeBlur from "../../../assets/photography/tree-blur.png";

/* ─────────────────────────────────────────────────────────────────────────
 * Screen 3 — Reassurance interstitial.
 *  - career / school: solid slate, left-aligned editorial stat
 *  - AI: dark gradient video
 * Auto-advances after 10s; Next (or a tap) advances early.
 * ──────────────────────────────────────────────────────────────────────── */

export default function Reassurance({
  branch,
  onDone,
  onBack,
}: {
  branch: Branch;
  onDone: () => void;
  onBack?: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const { text, emphasis, subline } = BUCKETS[branch].reassurance;
  const isAI = branch === "build-with-ai";

  const done = useRef(false);
  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onDone();
  }, [onDone]);

  // auto-advance after 10s
  useEffect(() => {
    const t = window.setTimeout(finish, 10000);
    return () => window.clearTimeout(t);
  }, [finish]);

  const idx = text.indexOf(emphasis);
  const pre = idx >= 0 ? text.slice(0, idx) : text;
  const post = idx >= 0 ? text.slice(idx + emphasis.length) : "";

  return (
    <div
      onClick={finish}
      className="absolute inset-0 z-[55] flex cursor-pointer flex-col justify-center overflow-hidden px-7 text-left"
    >
      {/* ── background ── */}
      {isAI ? (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#06080f]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1426] via-[#05070d] to-black" />
          {!reduced ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src={AI_GRADIENT_VIDEO}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[#131313]">
          <img
            src={treeBlur}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* scrim so the white + yellow copy stays legible over the photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/70" />
        </div>
      )}

      {/* back + slim progress bar */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 px-4 pt-[max(0.9rem,env(safe-area-inset-top))]">
        {onBack ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        ) : null}
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[16%] rounded-full bg-yellow" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full"
      >

        <p className="font-serif text-[32px] leading-[1.15] text-pretty text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] md:text-[38px]">
          {pre}
          <motion.span
            initial={reduced ? undefined : { scale: 1.03 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block font-semibold text-yellow"
          >
            {emphasis}
          </motion.span>
          {post}
        </p>
        {subline ? (
          <p className="mt-5 max-w-[34ch] text-[13.5px] leading-relaxed text-white/70 drop-shadow-[0_1px_10px_rgba(0,0,0,0.4)]">
            {subline}
          </p>
        ) : null}
      </motion.div>

      {/* Next — same liquid-glass pill as the cloud page buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute inset-x-0 bottom-[max(1.75rem,env(safe-area-inset-bottom))] mx-auto w-full max-w-[440px] px-6"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
          className={GLASS_PILL}
        >
          Next
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
