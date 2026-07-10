import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

import { CLOUDS_VIDEO, type Branch } from "./data";
import PersistentLogo from "./steps/PersistentLogo";
import Opener from "./steps/Opener";
import Reassurance from "./steps/Reassurance";
import FlowRunner from "./steps/FlowRunner";
import ExpertFlow from "./steps/ExpertFlow";

/* ─────────────────────────────────────────────────────────────────────────
 * Onboarding shell.
 *
 * loading → opener → flow → (Home).  The cloud video backs the loading +
 * opener stages, then fades out as the flow begins (cream background beneath).
 * ──────────────────────────────────────────────────────────────────────── */

type Stage = "loading" | "opener" | "reassurance" | "flow" | "expert";

export default function Onboarding() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;
  // Entry from the minimal flow — skip the logo splash (already seen), and go
  // straight to the expert flow when arriving via the "Leland experts" link.
  const navState = useLocation().state as
    | { skipIntro?: boolean; expert?: boolean }
    | null;
  const startExpert = navState?.expert ?? false;
  const skipIntro = navState?.skipIntro ?? startExpert;

  const [stage, setStage] = useState<Stage>(
    startExpert ? "expert" : skipIntro ? "opener" : "loading",
  );
  const [branch, setBranch] = useState<Branch | null>(null);
  const [logoRevealed, setLogoRevealed] = useState(skipIntro);

  useEffect(() => {
    document.title = "Leland — Join the community";
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
  const selectBranch = (b: Branch) => {
    setBranch(b);
    setStage("reassurance");
  };

  const cloudsVisible =
    stage === "loading" || stage === "opener" || stage === "reassurance";
  const logoVisible =
    stage === "loading" || stage === "opener" || stage === "reassurance";
  const logoDocked = stage === "opener" || stage === "reassurance";
  // Shell chrome only for the opener; the flow and expert path have their own headers.
  const showChrome = stage === "opener";

  // Tint the mobile status bar to match the sky while the clouds are up, so it
  // blends edge-to-edge instead of showing a white bar; restore white after.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (meta) meta.content = cloudsVisible ? "#8fb2d9" : "#ffffff";
  }, [cloudsVisible]);
  useEffect(() => {
    return () => {
      const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (meta) meta.content = "#ffffff";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-white">
      {/* ── cloud background (loading + opener), fades into the cream flow ── */}
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
                initial={skipIntro ? false : { opacity: 0, scale: 1.08 }}
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
            {/* scrim: bright clouds up top, darkening toward the bottom so the
                buttons / links / reviews stay legible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/60" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── white intro layer (fades out once we leave loading) ── */}
      <motion.div
        className="absolute inset-0 z-[40] bg-white"
        initial={{ opacity: skipIntro ? 0 : 1 }}
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
            instant={skipIntro}
          />
        ) : null}
      </AnimatePresence>

      {/* ── Screen 3: reassurance interstitial, over the clouds ── */}
      <AnimatePresence>
        {stage === "reassurance" && branch ? (
          <motion.div
            key="reassurance"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 z-[55]"
          >
            <Reassurance
              branch={branch}
              onDone={() => setStage("flow")}
              onBack={() => setStage("opener")}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── shell chrome (opener only) ── */}
      {showChrome ? (
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <span className="h-9 w-9" />
          <button
            onClick={exit}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label="Exit onboarding"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      {/* ── step stage: mobile-first column, centered on desktop ── */}
      <div className="relative z-10 mx-auto h-full w-full max-w-[440px]">
        <AnimatePresence mode="wait">
          {stage === "loading" || stage === "reassurance" ? null : stage === "opener" ? (
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
                onSelectBranch={selectBranch}
                onExpert={() => setStage("expert")}
                animateButtonsOnly={skipIntro}
              />
            </motion.div>
          ) : stage === "flow" && branch ? (
            <motion.div
              key="flow"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
              className="h-full"
            >
              <FlowRunner
                branch={branch}
                onBackToOpener={() => setStage("reassurance")}
                onExit={exit}
                onComplete={() => navigate("/")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="expert"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
              className="h-full"
            >
              <ExpertFlow
                onBackToOpener={() => setStage("opener")}
                onExit={exit}
                onComplete={() => navigate("/")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
