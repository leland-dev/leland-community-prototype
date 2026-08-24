import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Loader2, UserRound, ShieldCheck, Zap } from "lucide-react";

import foundPhoto from "../../../assets/profile photos/pic-1.png";
import linkedinIcon from "../../../assets/onboarding/linkedin-app-icon.webp";

/* ─────────────────────────────────────────────────────────────────────────
 * LinkedInConnect (v4) — borrow LinkedIn's credibility instead of building a
 * profile from scratch. Mocked OAuth: ~1.1s spinner, then the pulled profile
 * card slides in. Skippable, but the skip is deliberately quiet.
 * ──────────────────────────────────────────────────────────────────────── */

export type LinkedInProfile = { name: string; headline: string; photo: string };

function LinkedInMark({ size = 20, color = "#0A66C2" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z" />
    </svg>
  );
}

const BENEFITS = [
  { Icon: UserRound, text: "Your name, photo, and headline — done." },
  { Icon: ShieldCheck, text: "Your school and work history, verified." },
  { Icon: Zap, text: "Applications with LinkedIn attached are reviewed first." },
];

export default function LinkedInConnect({
  school,
  gradYear,
  onConnected,
  onSkip,
}: {
  school?: string;
  gradYear?: number | "earlier";
  onConnected: (p: LinkedInProfile) => void;
  onSkip: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"idle" | "loading" | "connected">("idle");

  const yr = typeof gradYear === "number" ? ` '${String(gradYear).slice(2)}` : "";
  const profile: LinkedInProfile = {
    name: "June Allen",
    headline: `Product Manager at Stripe${school ? ` · ${school}${yr}` : ""}`,
    photo: foundPhoto,
  };

  const connect = () => {
    if (phase !== "idle") return;
    setPhase("loading");
    window.setTimeout(() => setPhase("connected"), reduced ? 300 : 1100);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-40 pt-2">
        {/* the app icon itself — borrowed credibility, front and center */}
        <motion.img
          src={linkedinIcon}
          alt="LinkedIn"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="mt-4 h-[88px] w-[88px] rounded-[20px] shadow-[0_12px_32px_rgba(10,102,194,0.28)]"
        />
        <h2 className="mt-6 text-balance font-serif text-[28px] leading-[1.12] text-gray-dark md:text-[32px]">
          Bring your LinkedIn with you
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-light">
          Experts and members see a real profile, not an empty one. Takes five seconds.
        </p>

        <AnimatePresence mode="wait">
          {phase === "connected" ? (
            <motion.div
              key="card"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="relative mt-8 rounded-2xl border border-gray-stroke bg-white p-4 shadow-card"
            >
              <span className="absolute right-3 top-3">
                <LinkedInMark size={18} />
              </span>
              <div className="flex items-center gap-3.5">
                <img src={profile.photo} alt="" className="h-16 w-16 rounded-full object-cover ring-1 ring-black/[0.06]" />
                <div className="min-w-0 flex-1 pr-6">
                  <p className="text-[17px] font-semibold text-gray-dark">{profile.name}</p>
                  <p className="mt-0.5 text-[13.5px] leading-snug text-gray-light">{profile.headline}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-[#1a7f4b]">
                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#1a7f4b] text-white">
                  <Check size={11} strokeWidth={3} />
                </span>
                Connected
              </div>
            </motion.div>
          ) : (
            <motion.ul key="benefits" exit={{ opacity: 0 }} className="mt-8 flex flex-col gap-4">
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b.text}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
                  className="flex items-center gap-3.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-hover text-gray-dark">
                    <b.Icon size={19} strokeWidth={1.9} />
                  </span>
                  <span className="text-[15px] font-medium leading-snug text-gray-dark">{b.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        {phase === "connected" ? (
          <button
            onClick={() => onConnected(profile)}
            className="pointer-events-auto flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
          >
            <Check size={17} />
            Looks good
          </button>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={connect}
              disabled={phase === "loading"}
              className="pointer-events-auto flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333] disabled:opacity-80"
            >
              {phase === "loading" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LinkedInMark size={18} color="#ffffff" />
                  Connect LinkedIn
                </>
              )}
            </motion.button>
            <button
              onClick={onSkip}
              disabled={phase === "loading"}
              className="pointer-events-auto mt-2 flex h-12 w-full flex-col items-center justify-center text-[15px] font-medium text-gray-light transition-colors hover:text-gray-dark"
            >
              I'll build it myself
              <span className="text-[12px] font-normal text-gray-xlight">You can connect later in Settings</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
