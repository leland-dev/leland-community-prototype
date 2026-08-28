import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Loader2, UserRound, ShieldCheck, Zap } from "lucide-react";

import { MEMBER_AVATARS } from "../mockData";
import { SharpStar } from "./flowUI";

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
  { Icon: UserRound, text: "Your name, photo, and headline. Done." },
  { Icon: ShieldCheck, text: "Your school and work history, verified." },
  { Icon: Zap, text: "Applications with LinkedIn attached are reviewed first." },
];

export default function LinkedInConnect({
  school,
  gradYear,
  onConnected,
}: {
  school?: string;
  gradYear?: number | "earlier" | "unknown" | "none";
  onConnected: (p: LinkedInProfile) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"idle" | "loading" | "connected">("idle");

  // Editable so a wrong import never forces anyone out of the flow.
  const yr = typeof gradYear === "number" ? ` '${String(gradYear).slice(2)}` : "";
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("June Allen");
  const [headline, setHeadline] = useState(`Product Manager at Stripe${school ? ` · ${school}${yr}` : ""}`);
  const profile: LinkedInProfile = { name, headline, photo: foundPhoto };

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
          className="mx-auto mt-6 h-[88px] w-[88px] rounded-[20px] shadow-[0_12px_32px_rgba(10,102,194,0.28)]"
        />
        <h2 className="mt-6 text-balance text-center font-serif text-[28px] leading-[1.12] text-gray-dark md:text-[32px]">
          Bring your LinkedIn with you
        </h2>
        <p className="mx-auto mt-2 max-w-[34ch] text-center text-[15px] leading-relaxed text-gray-light">
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
              <div className="flex items-center gap-3.5">
                <img src={profile.photo} alt="" className="h-16 w-16 rounded-full object-cover ring-1 ring-black/[0.06]" />
                {editing ? (
                  <div className="min-w-0 flex-1">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-stroke px-2.5 py-1.5 text-[15px] font-semibold text-gray-dark outline-none focus:border-gray-dark/40"
                    />
                    <input
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-stroke px-2.5 py-1.5 text-[13.5px] text-gray-dark outline-none focus:border-gray-dark/40"
                    />
                  </div>
                ) : (
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-semibold text-gray-dark">{profile.name}</p>
                    <p className="mt-0.5 text-[13.5px] leading-snug text-gray-light">{profile.headline}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                {/* the mark and the status live together: one animated pill */}
                <motion.span
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 380, damping: 22 }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2]/[0.08] py-1.5 pl-2.5 pr-3"
                >
                  <LinkedInMark size={14} />
                  <span className="text-[13px] font-semibold text-[#0A66C2]">Connected</span>
                  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" aria-hidden>
                    <motion.path
                      d="M5 12.5l4.4 4.3L19 7.5"
                      stroke="#0A66C2"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.65, duration: 0.35, ease: "easeOut" }}
                    />
                  </svg>
                </motion.span>
                {editing ? (
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-full bg-gray-dark px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#333]"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-[13px] font-medium text-gray-light underline decoration-gray-stroke underline-offset-4 transition-colors hover:text-gray-dark"
                  >
                    Not right? Edit
                  </button>
                )}
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
            {/* the magic button: LinkedIn-blue gradient, soft glow, a slow
                shimmer sweep, and a gentle breath so it feels alive */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.015 }}
              animate={reduced || phase === "loading" ? {} : { scale: [1, 1.012, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              onClick={connect}
              disabled={phase === "loading"}
              className="pointer-events-auto relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full text-[16px] font-semibold text-white shadow-[0_10px_30px_rgba(10,102,194,0.32)] disabled:opacity-90"
              style={{ background: "#0A66C2" }}
            >
              {!reduced && phase !== "loading" ? (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-[-40%] w-[85%]"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 45%, transparent 72%)",
                    filter: "blur(6px)",
                  }}
                  initial={{ x: "-90%", rotate: 14 }}
                  animate={{ x: ["-90%", "35%", "190%"] }}
                  transition={{ duration: 5.4, times: [0, 0.6, 1], repeat: Infinity, repeatDelay: 0.4, ease: "easeInOut" }}
                />
              ) : null}
              {phase === "loading" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-white">
                    <LinkedInMark size={17} />
                  </span>
                  Connect LinkedIn
                </>
              )}
            </motion.button>

            {/* trust signal */}
            <div className="pointer-events-auto mt-3.5 flex items-center justify-center gap-2.5">
              <div className="flex -space-x-2">
                {MEMBER_AVATARS.slice(0, 4).map((src, i) => (
                  <img key={i} src={src} alt="" className="h-6 w-6 rounded-full object-cover ring-2 ring-white" />
                ))}
              </div>
              <p className="flex items-center gap-1 text-[13px] text-gray-light">
                <span className="font-semibold text-gray-dark">30k+ people</span> trust Leland
                <SharpStar size={11} className="ml-0.5 text-yellow" />
                <span className="font-medium text-gray-dark">4.99</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
