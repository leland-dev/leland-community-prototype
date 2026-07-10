import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import mark from "../../../assets/leland-logos/leland-mark.svg";

/* ─────────────────────────────────────────────────────────────────────────
 * BuildingFeed (v2) — the closing "we're cooking something up" moment. Logo +
 * a determinate loading bar that fills partway, pauses, then finishes, while
 * the caption swaps from "Building your feed" to "Setting up your profile".
 * Purely theatrical — waits out the bar, then calls onDone.
 * ──────────────────────────────────────────────────────────────────────── */

const CAPTIONS = ["Building your feed…", "Setting up your profile…"];

export default function BuildingFeed({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const dur = reduced ? 1.4 : 4.6; // total seconds

  const [caption, setCaption] = useState(0);

  useEffect(() => {
    const done = window.setTimeout(onDone, dur * 1000 + 300);
    if (reduced) return () => window.clearTimeout(done);
    // swap the caption around when the bar resumes after its pause
    const swap = window.setTimeout(() => setCaption(1), dur * 1000 * 0.6);
    return () => {
      window.clearTimeout(done);
      window.clearTimeout(swap);
    };
  }, [onDone, dur, reduced]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-10">
      <motion.img
        src={mark}
        alt="Leland"
        // force ink regardless of the svg's OS-dark-mode media query
        style={{ filter: "brightness(0)" }}
        initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="h-11 w-11"
      />

      <div className="mt-7 h-1.5 w-56 max-w-[70%] overflow-hidden rounded-full bg-gray-stroke">
        <motion.div
          initial={{ width: "0%" }}
          // fill to ~55%, hold, then finish — the deliberate pause
          animate={{ width: reduced ? "100%" : ["0%", "55%", "55%", "100%"] }}
          transition={
            reduced
              ? { duration: dur }
              : { duration: dur, times: [0, 0.38, 0.6, 1], ease: "easeInOut" }
          }
          className="h-full rounded-full bg-gray-dark"
        />
      </div>

      <div className="mt-5 h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-[15px] font-medium text-gray-light"
          >
            {CAPTIONS[caption]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
