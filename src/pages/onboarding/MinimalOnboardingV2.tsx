import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import PersistentLogo from "./steps/PersistentLogo";
import Opener from "./steps/Opener";
import Auth from "./steps/Auth";
import JourneyStage from "./steps/JourneyStage";
import TopicSuggestions from "./steps/TopicSuggestions";
import InstitutionSuggestions from "./steps/InstitutionSuggestions";
import ExpertSuggestions from "./steps/ExpertSuggestions";

/* ─────────────────────────────────────────────────────────────────────────
 * Minimal onboarding (v2).
 *
 *   logo splash → clouds opener → sign-in.
 *
 * A straight duplicate of MinimalOnboarding (v1) to iterate on independently.
 * Reuses the same shared steps for now (Opener `getStarted` variant + Auth);
 * diverge these as the v2 direction takes shape.
 * ──────────────────────────────────────────────────────────────────────── */

type Stage =
  | "loading"
  | "opener"
  | "signin"
  | "journey"
  | "topics"
  | "institutions"
  | "experts";

export default function MinimalOnboardingV2() {
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

  const logoVisible = stage === "loading" || stage === "opener";
  const logoDocked = stage === "opener";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-white">
      {/* v2: plain white background (no clouds) — ink text on the opener. */}

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
            light
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
                light
                onGetStarted={() => setStage("signin")}
                onSignIn={() => setStage("signin")}
                onExpert={() =>
                  navigate("/onboarding", { state: { expert: true } })
                }
              />
            </motion.div>
          ) : stage === "signin" ? (
            <motion.div
              key="signin"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
              className="h-full"
            >
              <Auth
                cohortName="the Leland community"
                memberCount={30975}
                onBack={() => setStage("opener")}
                onExit={exit}
                onNext={() => setStage("topics")}
              />
            </motion.div>
          ) : stage === "journey" ? (
            <motion.div
              key="journey"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
              className="h-full"
            >
              <JourneyStage
                onBack={() => setStage("experts")}
                onContinue={() => navigate("/")}
                onSkip={() => navigate("/")}
              />
            </motion.div>
          ) : stage === "topics" ? (
            <motion.div
              key="topics"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
              className="h-full"
            >
              <TopicSuggestions
                onBack={() => setStage("signin")}
                onContinue={() => setStage("institutions")}
                onSkip={() => setStage("institutions")}
              />
            </motion.div>
          ) : stage === "institutions" ? (
            <motion.div
              key="institutions"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
              className="h-full"
            >
              <InstitutionSuggestions
                onBack={() => setStage("topics")}
                onContinue={() => setStage("experts")}
                onSkip={() => setStage("experts")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="experts"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
              className="h-full"
            >
              <ExpertSuggestions
                onBack={() => setStage("institutions")}
                onContinue={() => setStage("journey")}
                onSkip={() => setStage("journey")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
