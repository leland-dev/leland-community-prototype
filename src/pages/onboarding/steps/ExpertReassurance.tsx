import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { COACH_FACES } from "../mockData";
import { SharpStar } from "./flowUI";

import pic2 from "../../../assets/profile photos/pic-2.png";
import pic10 from "../../../assets/profile photos/pic-10.png";
import pic11 from "../../../assets/profile photos/pic-11.png";
import pic12 from "../../../assets/profile photos/pic-12.png";
import pic13 from "../../../assets/profile photos/pic-13.png";
import pic14 from "../../../assets/profile photos/pic-14.png";

/* ─────────────────────────────────────────────────────────────────────────
 * ExpertReassurance (v2) — the "we've got you" beat after the goal pick.
 * Coach cards drift in a slow horizontal loop; review cards loop even slower
 * beneath them. Interstitial — no dots. (Uses the shared leland-marquee
 * keyframe: translateX(0) → -50%, so each row is duplicated for a seamless
 * loop.)
 * ──────────────────────────────────────────────────────────────────────── */

const ORGS = ["McKinsey", "Google", "Harvard", "Stanford", "Goldman Sachs", "Meta", "OpenAI"];

type Review = { quote: string; name: string; role: string; avatar: string };
const REVIEWS: Review[] = [
  { quote: "I got into HBS, Stanford, AND Wharton. Six months on Leland.", name: "Maya P.", role: "HBS '27", avatar: pic10 },
  { quote: "Went from rejected to a McKinsey offer. My coach saw everything.", name: "Karen J.", role: "Associate, McKinsey", avatar: pic12 },
  { quote: "Shipped a real AI product in 8 weeks and quit my job a month later.", name: "Andre S.", role: "Founder, Loomly AI", avatar: pic11 },
  { quote: "My essays finally sounded like me. Booth said yes.", name: "Deepa R.", role: "Booth '26", avatar: pic2 },
  { quote: "Landed the PM role I'd been chasing for two years.", name: "Tomás L.", role: "PM, Stripe", avatar: pic13 },
  { quote: "Three mock interviews and I walked in unshakeable.", name: "Grace W.", role: "IB Analyst, GS", avatar: pic14 },
];

const MASK = "linear-gradient(to right, transparent, black 6%, black 94%, transparent)";

export default function ExpertReassurance({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion() ?? false;

  const coaches = [...COACH_FACES, ...COACH_FACES];

  // reviews auto-advance every 2s (manual swipe is unreliable in the mock)
  const CARD_W = 300;
  const GAP = 12;
  const LEFT_PAD = 24;
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(
      () => setActive((a) => (a + 1) % REVIEWS.length),
      2500,
    );
    return () => window.clearInterval(t);
  }, [reduced]);

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-hidden pb-32 pt-2">
        <h2 className="px-6 font-serif text-[28px] leading-[1.15] text-gray-dark md:text-[32px]">
          Thousands of experts are here to help with that
        </h2>

        {/* coach cards — slow loop */}
        <div className="mt-6 overflow-hidden" style={{ maskImage: MASK, WebkitMaskImage: MASK }}>
          <div
            className="flex w-max"
            style={
              reduced
                ? undefined
                : { animation: "leland-marquee 34s linear infinite", willChange: "transform" }
            }
          >
            {coaches.map((f, i) => (
              <div
                key={i}
                className="relative mr-3 aspect-[3/4] w-[128px] shrink-0 overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5"
              >
                <img src={f.photo} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
                <span className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-gray-dark shadow-sm">
                  <SharpStar size={9} className="text-yellow" />
                  {f.rating.toFixed(1)}
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-2.5 pb-2.5 pt-7">
                  <p className="text-[12px] font-semibold leading-tight text-white">
                    {ORGS[i % ORGS.length]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* review cards — auto-advance every 2s with a bounce */}
        <div className="mt-5 overflow-hidden">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{
              left: LEFT_PAD - (REVIEWS.length - 1) * (CARD_W + GAP),
              right: LEFT_PAD,
            }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              const threshold = 60;
              if (info.offset.x < -threshold)
                setActive((a) => Math.min(a + 1, REVIEWS.length - 1));
              else if (info.offset.x > threshold)
                setActive((a) => Math.max(a - 1, 0));
            }}
            animate={{ x: reduced ? LEFT_PAD : LEFT_PAD - active * (CARD_W + GAP) }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          >
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="mr-3 flex w-[300px] shrink-0 flex-col rounded-2xl border border-gray-stroke bg-white p-4 shadow-card"
              >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <SharpStar key={s} size={13} className="text-yellow" />
                ))}
              </div>
              <p className="text-[14px] font-medium leading-snug text-gray-dark">
                “{r.quote}”
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <img src={r.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-gray-dark">{r.name}</p>
                  <p className="truncate text-[12px] text-gray-light">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
          </motion.div>
        </div>
      </div>

      {/* Continue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        <button
          onClick={onContinue}
          className="pointer-events-auto flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
