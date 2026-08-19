import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

import mark from "../../assets/leland-logos/leland-mark.svg";
import alex from "../../assets/profile photos/pic-2.png";

/* ─────────────────────────────────────────────────────────────────────────
 * AppPromoBanner — the contextual "download the app" banner that sits above
 * the page (mirrors the three states in the design). One component, three
 * intents:
 *   - "download":     neutral nudge to install the app
 *   - "session-soon": a coaching session starting shortly (slate)
 *   - "session-live": a session happening now (red, most urgent)
 * The whole banner is tappable (deep-links to the app / store); the ✕ dismisses.
 * ──────────────────────────────────────────────────────────────────────── */

type Variant = "download" | "session-soon" | "session-live";

const THEME: Record<Variant, { bg: string; sub: string }> = {
  download: { bg: "bg-[#1a1a1a]", sub: "text-white/70" },
  "session-soon": { bg: "bg-[#5a6b78]", sub: "text-white/80" },
  "session-live": { bg: "bg-[#c0362c]", sub: "text-white/85" },
};

export default function AppPromoBanner({
  variant = "download",
  onAction,
}: {
  variant?: Variant;
  onAction?: () => void;
}) {
  const [open, setOpen] = useState(true);
  const t = THEME[variant];
  const cta = variant === "download" ? "Open" : "Join";

  const title =
    variant === "download" ? "Leland is better in the app" : "Your session with Alex";
  const sub =
    variant === "download"
      ? "Download now"
      : variant === "session-soon"
        ? "Starts in 10 minutes"
        : "Happening now";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          className={`overflow-hidden text-white ${t.bg}`}
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <button
              onClick={onAction}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              {variant === "download" ? (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow">
                  <img src={mark} alt="" className="h-5 w-5" style={{ filter: "brightness(0)" }} />
                </span>
              ) : (
                <img src={alex} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/30" />
              )}
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[14px] font-semibold">{title}</span>
                <span className={`block truncate text-[12.5px] ${t.sub}`}>{sub}</span>
              </span>
            </button>

            <button
              onClick={onAction}
              className="shrink-0 rounded-full bg-yellow px-4 py-1.5 text-[14px] font-semibold text-gray-dark transition-transform active:scale-95"
            >
              {cta}
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Dismiss"
              className="shrink-0 rounded-full p-1 text-white/70 transition-colors hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
