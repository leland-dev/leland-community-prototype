import { motion } from "motion/react";

import wordmark from "../../../assets/leland-logos/leland-wordmark.svg";

/* ─────────────────────────────────────────────────────────────────────────
 * PersistentLogo — the Leland lockup that ties the loading screen to the
 * clouds screen. It pops as the swoosh mark, slides left to reveal the
 * wordmark, then moves + shrinks to dock at the top of the clouds page.
 *
 * Lives in the shell (not per-screen) so it survives the loading→opener
 * transition as one continuous element.
 *   - `revealed`: clip has expanded from mark → full wordmark
 *   - `docked`:   moved to the top, shrunk to nav size
 * ──────────────────────────────────────────────────────────────────────── */

const H = 51; // intro logo height (15% smaller)
const FULL_W = Math.round((797 / 171) * H); // full lockup width (≈280)
const MARK_W = H; // swoosh is ~square → clip to its width for the "mark only" state
const DOCK_SCALE = 20 / H; // docked height ≈ 20px

const EASE = [0.32, 0.72, 0, 1] as const;

export default function PersistentLogo({
  docked,
  revealed,
  reduced,
  instant = false,
  light = false,
}: {
  docked: boolean;
  revealed: boolean;
  reduced: boolean;
  /** Mount already at the docked state with no entrance (used when the intro
   *  was skipped and the logo should just be there). */
  instant?: boolean;
  /** Light theme: keep the docked lockup ink (black) instead of flipping it to
   *  white — for docking over a white background rather than the clouds. */
  light?: boolean;
}) {
  const wide = revealed || docked;

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-[65] flex justify-center"
      initial={
        instant ? false : { top: "50%", y: "-50%", opacity: reduced ? 1 : 0 }
      }
      animate={{
        top: docked ? "calc(env(safe-area-inset-top, 0px) + 9.5%)" : "50%",
        y: "-50%",
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ top: { duration: 0.7, ease: EASE }, opacity: { duration: 0.4 } }}
    >
      <motion.div
        initial={
          instant
            ? false
            : reduced
              ? { scale: docked ? DOCK_SCALE : 1 }
              : { scale: 0.5 }
        }
        animate={{ scale: docked ? DOCK_SCALE : 1 }}
        transition={
          docked
            ? { duration: 0.7, ease: EASE }
            : { type: "spring", stiffness: 180, damping: 15, delay: 0.1 }
        }
        style={{ transformOrigin: "center top" }}
      >
        <motion.div
          className="overflow-hidden"
          initial={instant ? false : { width: reduced ? FULL_W : MARK_W }}
          animate={{ width: wide ? FULL_W : MARK_W }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <img
            src={wordmark}
            alt="Leland"
            className="block max-w-none"
            style={{
              height: H,
              width: FULL_W,
              // black on the white loading screen → white once docked on the
              // clouds; light theme keeps it black when docked (white bg).
              filter: docked && !light ? "brightness(0) invert(1)" : "none",
              transition: "filter 0.5s ease",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
