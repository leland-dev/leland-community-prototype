import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import type { Branch } from "./data";
import { CATEGORIES_BY_BRANCH, CATEGORY_QUESTION, resonanceFor } from "./resonanceV4";
import PersistentLogo from "./steps/PersistentLogo";
import Opener from "./steps/Opener";
import Auth from "./steps/Auth";
import GoalSelect from "./steps/GoalSelect";
import ExpertReassurance from "./steps/ExpertReassurance";
import ChoiceQuestion, { type Choice } from "./steps/ChoiceQuestion";
import { StepChrome } from "./steps/flowUI";
import InstitutionSuggestions from "./steps/InstitutionSuggestions";
import ProfileSetup from "./steps/ProfileSetup";
import SituationStep from "./steps/SituationStep";
import BuildingFeed from "./steps/BuildingFeed";

/* ─────────────────────────────────────────────────────────────────────────
 * Onboarding v4 (Chandler's take on v3).
 *
 *   splash → opener → sign-in (phone-first) → goal → category drill-down →
 *   expert reassurance (copy adapts to the category) → intent → situation →
 *   schools & companies → profile → building your feed.
 *
 * The reassurance beat comes *after* the drill-down so it can name the exact
 * experts, orgs, and wins for what the member actually picked.
 * ──────────────────────────────────────────────────────────────────────── */

const LOOKING: Choice[] = [
  { label: "Get into a top program" },
  { label: "Break into a new field" },
  { label: "Level up in my current role" },
  { label: "Land a specific offer" },
  { label: "Start something of my own" },
  { label: "Just exploring for now" },
];


const TOTAL_STEPS = 7;

type Stage =
  | "loading"
  | "opener"
  | "signin"
  | "goal"
  | "reassurance"
  | "interested"
  | "looking"
  | "situation"
  | "institutions"
  | "profile"
  | "building";

const rise = {
  initial: (reduced: boolean) => (reduced ? { opacity: 0 } : { opacity: 0, y: 40 }),
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const, delay: 0.1 },
};

export default function MinimalOnboardingV4() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;

  const [stage, setStage] = useState<Stage>("loading");
  const [logoRevealed, setLogoRevealed] = useState(false);
  // "signup" = full Get-started flow; "login" = short returning-user path
  // (auth → profile photo → home).
  const [intent, setIntent] = useState<"signup" | "login">("signup");
  const [branch, setBranch] = useState<Branch>("grow-career");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    document.title = "Leland — Get started";
  }, []);

  // Intro choreography: pop → reveal wordmark → dock at top.
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

  // Persistent header (back · dots · skip) config per question stage. Rendered
  // once in the shell so it doesn't re-animate on every step transition.
  const STEP_BACK: Partial<Record<Stage, Stage>> = {
    goal: "signin",
    interested: "goal",
    reassurance: "interested",
    looking: "reassurance",
    situation: "looking",
    institutions: "situation",
    profile: "institutions",
  };
  const STEP_SKIP: Partial<Record<Stage, Stage>> = {
    goal: "interested",
    interested: "reassurance",
    reassurance: "looking",
    looking: "situation",
    situation: "institutions",
    institutions: "profile",
    profile: "building",
  };
  const STEP_INDEX: Partial<Record<Stage, number>> = {
    goal: 1,
    interested: 2,
    reassurance: 3,
    looking: 4,
    situation: 5,
    institutions: 6,
    profile: 7,
  };

  const resonance = resonanceFor(categories);

  const chrome =
    stage === "profile" && intent === "login"
      ? { onBack: () => setStage("signin"), onSkip: () => navigate("/"), step: undefined }
      : STEP_INDEX[stage] !== undefined
        ? {
            onBack: () => setStage(STEP_BACK[stage]!),
            onSkip: () => setStage(STEP_SKIP[stage]!),
            step: { index: STEP_INDEX[stage]!, total: TOTAL_STEPS },
          }
        : null;

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

      {/* ── persistent Leland logo: intro → docks at top of the opener ── */}
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
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[440px] flex-col">
        {/* persistent header — stays put across step transitions */}
        {chrome ? (
          <StepChrome onBack={chrome.onBack} onSkip={chrome.onSkip} step={chrome.step} />
        ) : null}

        <div className="relative min-h-0 flex-1">
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
                  onGetStarted={() => {
                    setIntent("signup");
                    setStage("signin");
                  }}
                  onSignIn={() => {
                    setIntent("login");
                    setStage("signin");
                  }}
                  onExpert={() => navigate("/onboarding", { state: { expert: true } })}
                />
              </motion.div>
            ) : stage === "signin" ? (
              <motion.div key="signin" initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
                <Auth
                  cohortName="the Leland community"
                  onBack={() => setStage("opener")}
                  onExit={exit}
                  onNext={() => setStage(intent === "login" ? "profile" : "goal")}
                  primary="phone"
                />
              </motion.div>
            ) : stage === "goal" ? (
              <motion.div key="goal" initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
                <GoalSelect
                  onSelect={(b) => {
                    setBranch(b);
                    setCategories([]);
                    setStage("interested");
                  }}
                />
              </motion.div>
            ) : stage === "interested" ? (
              <motion.div key={`interested-${branch}`} initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
                <ChoiceQuestion
                  title={CATEGORY_QUESTION[branch]}
                  options={CATEGORIES_BY_BRANCH[branch]}
                  multi
                  onContinue={(picked) => {
                    setCategories(picked);
                    setStage("reassurance");
                  }}
                />
              </motion.div>
            ) : stage === "reassurance" ? (
              <motion.div key="reassurance" initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
                <ExpertReassurance
                  title={resonance.title}
                  subline={resonance.subline}
                  orgs={resonance.orgs}
                  reviews={resonance.reviews}
                  onContinue={() => setStage("looking")}
                />
              </motion.div>
            ) : stage === "looking" ? (
              <motion.div key="looking" initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
                <ChoiceQuestion
                  title="What are you looking to do?"
                  options={LOOKING}
                  multi
                  onContinue={() => setStage("situation")}
                />
              </motion.div>
            ) : stage === "situation" ? (
              <motion.div key="situation" initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
                <SituationStep onContinue={() => setStage("institutions")} />
              </motion.div>
            ) : stage === "institutions" ? (
              <motion.div key="institutions" initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
                <InstitutionSuggestions onContinue={() => setStage("profile")} />
              </motion.div>
            ) : stage === "profile" ? (
              <motion.div key="profile" initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
                <ProfileSetup
                  onContinue={() => (intent === "login" ? navigate("/") : setStage("building"))}
                  onSkip={() => (intent === "login" ? navigate("/") : setStage("building"))}
                />
              </motion.div>
            ) : (
              <motion.div
                key="building"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <BuildingFeed onDone={() => navigate("/")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
