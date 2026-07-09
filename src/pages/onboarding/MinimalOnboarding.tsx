import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { CLOUDS_VIDEO } from "./data";
import PersistentLogo from "./steps/PersistentLogo";
import Opener from "./steps/Opener";
import Auth from "./steps/Auth";

/* ─────────────────────────────────────────────────────────────────────────
 * Minimal onboarding (v1).
 *
 *   logo splash → clouds opener → sign-in.
 *
 * Reuses the exact same splash + clouds page as the main flow (Onboarding.tsx),
 * only swapping the goal CTAs for a single "Get started" + "Already have an
 * account?" via Opener's `getStarted` variant. Two real screens, no branching.
 *
 * NOTE (v1+): we'd like the sign-in step to support phone-number auth here too,
 * not just email / social providers. The shared Auth component is email+OAuth
 * only today — phone is a fast-follow.
 * ──────────────────────────────────────────────────────────────────────── */

type Stage = "loading" | "opener" | "signin";

export default function MinimalOnboarding() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;

  const [stage, setStage] = useState<Stage>("loading");
  const [logoRevealed, setLogoRevealed] = useState(false);

  useEffect(() => {
    document.title = "Leland — Get started";
  }, []);

  // Intro choreography: pop → reveal wordmark → dock at top + reveal clouds.
  useEffect(() => {
    if (stage !== "loading") return;
    const tReveal = window.setTimeout(() => setLogoRevealed(true), reduced ? 100 : 800);
    const tOpener = window.setTimeout(() => setStage("opener"), reduced ? 650 : 2100);
    return () => {
      window.clearTimeout(tReveal);
      window.clearTimeout(tOpener);
    };
  }, [stage, reduced]);

  const exit = () => navigate("/");

  const cloudsVisible = stage === "loading" || stage === "opener";
  const logoVisible = stage === "loading" || stage === "opener";
  const logoDocked = stage === "opener";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-white">
      {/* ── cloud background (loading + opener) ── */}
      <AnimatePresence>
        {cloudsVisible ? (
          <motion.div
            key="clouds-bg"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#8fb2d9] via-[#b9cfe6] to-[#dfe9f2]" />
            {!reduced ? (
              <motion.video
                key="clouds"
                src={CLOUDS_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ opacity: { duration: 1.2 }, scale: { duration: 18, ease: "linear" } }}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "brightness(1.12)" }}
              />
            ) : (
              <video
                src={CLOUDS_VIDEO}
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "brightness(1.12)" }}
              />
            )}
            {/* scrim for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/60" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── white intro layer (fades out once we leave loading) ── */}
      <motion.div
        className="absolute inset-0 z-[40] bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === "loading" ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ pointerEvents: stage === "loading" ? "auto" : "none" }}
      />

      {/* ── persistent Leland logo: intro → docks at top of the clouds page ── */}
      <AnimatePresence>
        {logoVisible ? (
          <PersistentLogo
            key="logo"
            docked={logoDocked}
            revealed={logoRevealed}
            reduced={reduced}
          />
        ) : null}
      </AnimatePresence>

      {/* ── step stage: mobile-first column, centered on desktop ── */}
      <div className="relative z-10 mx-auto h-full w-full max-w-[440px]">
        <AnimatePresence mode="wait">
          {stage === "loading" ? null : stage === "opener" ? (
            <motion.div
              key="opener"
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 40, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }
              }
              className="h-full"
            >
              <Opener
                variant="getStarted"
                onGetStarted={() =>
                  navigate("/onboarding", { state: { skipIntro: true } })
                }
                onSignIn={() => setStage("signin")}
                onExpert={() =>
                  navigate("/onboarding", { state: { expert: true } })
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="signin"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
              className="h-full"
            >
              {/* NOTE (v1+): phone-number auth would live here too — see file header. */}
              <Auth
                cohortName="the Leland community"
                memberCount={30975}
                onBack={() => setStage("opener")}
                onExit={exit}
                onNext={() => navigate("/")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
