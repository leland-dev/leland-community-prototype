import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import {
  Briefcase,
  BarChart3,
  Landmark,
  Boxes,
  Code2,
  Cpu,
  TrendingUp,
  Stethoscope,
  Scale,
  Megaphone,
  Rocket,
} from "lucide-react";

import PersistentLogo from "../onboarding/steps/PersistentLogo";
import Opener from "../onboarding/steps/Opener";
import Auth from "../onboarding/steps/Auth";
import GoalSelect from "../onboarding/steps/GoalSelect";
import ExpertReassurance from "../onboarding/steps/ExpertReassurance";
import ChoiceQuestion, { type Choice } from "../onboarding/steps/ChoiceQuestion";
import SituationStep from "../onboarding/steps/SituationStep";
import InstitutionSuggestions from "../onboarding/steps/InstitutionSuggestions";
import ProfileSetup from "../onboarding/steps/ProfileSetup";
import { StepChrome, StatusBar } from "../onboarding/steps/flowUI";
import { Joining, InLine, Front, Notify } from "./Waitlist";

/* ─────────────────────────────────────────────────────────────────────────
 * Waitlist Onboarding — the v3 onboarding flow wearing the waitlist's coat:
 * the b-roll film runs behind the opener (v3 layout + copy, white text), and
 * the flow dead-ends on the waitlist payoff — saving your spot, your wave,
 * and three skip-the-line passes.
 * ──────────────────────────────────────────────────────────────────────── */

const INTERESTED: Choice[] = [
  { label: "MBA & business school", Icon: Briefcase },
  { label: "Consulting", Icon: BarChart3 },
  { label: "Investment banking & finance", Icon: Landmark },
  { label: "Product management", Icon: Boxes },
  { label: "Software engineering", Icon: Code2 },
  { label: "AI & machine learning", Icon: Cpu },
  { label: "Venture capital & PE", Icon: TrendingUp },
  { label: "Medical school", Icon: Stethoscope },
  { label: "Law school", Icon: Scale },
  { label: "Data & analytics", Icon: BarChart3 },
  { label: "Marketing & growth", Icon: Megaphone },
  { label: "Entrepreneurship", Icon: Rocket },
];

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
  | "joining"
  | "inline"
  | "front"
  | "notify";

const EASE = [0.32, 0.72, 0, 1] as const;

export default function WaitlistOnboarding() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;

  const [stage, setStage] = useState<Stage>("loading");
  const [logoRevealed, setLogoRevealed] = useState(false);

  useEffect(() => {
    document.title = "Leland — Join the waitlist";
  }, []);

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

  const dirRef = useRef<1 | -1>(1);
  const delayRef = useRef(0);

  type Nav = { d: 1 | -1; delay: number };

  const go = (next: Stage, dir: 1 | -1 = 1) => {
    dirRef.current = dir;
    // Leaving the opener: let the film fade to white before the next screen
    // slides in.
    delayRef.current = stage === "opener" ? 0.55 : 0;
    setStage(next);
  };

  const logoVisible = stage === "loading" || stage === "opener";
  const logoDocked = stage === "opener";
  const brollVisible = stage === "opener";

  const STEP_BACK: Partial<Record<Stage, Stage>> = {
    goal: "signin",
    reassurance: "goal",
    interested: "reassurance",
    looking: "interested",
    situation: "looking",
    institutions: "situation",
    profile: "institutions",
  };
  const STEP_SKIP: Partial<Record<Stage, Stage>> = {
    goal: "reassurance",
    reassurance: "interested",
    interested: "looking",
    looking: "situation",
    situation: "institutions",
    institutions: "profile",
    profile: "joining",
  };
  const STEP_INDEX: Partial<Record<Stage, number>> = {
    goal: 1,
    reassurance: 2,
    interested: 3,
    looking: 4,
    situation: 5,
    institutions: 6,
    profile: 7,
  };

  const chrome =
    STEP_INDEX[stage] !== undefined
      ? {
          onBack: () => go(STEP_BACK[stage]!, -1),
          onSkip: () => go(STEP_SKIP[stage]!),
          step: { index: STEP_INDEX[stage]!, total: TOTAL_STEPS },
        }
      : null;

  /* screens are absolutely stacked so exit + enter overlap, left to right */
  const screenVariants = {
    enter: (c: Nav) => (reduced ? { opacity: 0 } : { x: c.d > 0 ? 96 : -96, opacity: 0 }),
    center: (c: Nav) => ({
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 280, damping: 30, mass: 0.9, delay: c.delay },
        opacity: { duration: 0.32, ease: "easeOut" as const, delay: c.delay },
      },
    }),
    exit: (c: Nav) =>
      reduced
        ? { opacity: 0 }
        : { x: c.d > 0 ? -96 : 96, opacity: 0, transition: { duration: 0.38, ease: EASE } },
  };

  /* the opener appears with the film (no slide in) but exits like a screen */
  const openerVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
    exit: (c: Nav) =>
      reduced
        ? { opacity: 0 }
        : { x: (c?.d ?? 1) > 0 ? -96 : 96, opacity: 0, transition: { duration: 0.38, ease: EASE } },
  };

  const screen = (
    key: string,
    children: React.ReactNode,
    variants: Variants = screenVariants as Variants,
    className = "absolute inset-0",
  ) => (
    <motion.div
      key={key}
      custom={{ d: dirRef.current, delay: delayRef.current }}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-white">
      {/* ── waitlist b-roll behind the opener ── */}
      <AnimatePresence>
        {brollVisible ? (
          <motion.div
            key="broll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 bg-[#1a1a1a]"
          >
            {reduced ? (
              <video src="/waitlist-broll.mp4" muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <video src="/waitlist-broll.mp4" autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/75" />
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

      {/* ── persistent Leland logo: black on the splash, white over the film ── */}
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

      {/* ── step stage ── */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[440px] flex-col">
        <StatusBar visible={stage !== "loading" && stage !== "opener"} />

        {/* constant-height chrome slot: content never reflows when it appears */}
        <div className="h-[52px] shrink-0">
          <AnimatePresence>
            {chrome ? (
              <motion.div
                key="chrome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <StepChrome onBack={chrome.onBack} onSkip={chrome.onSkip} step={chrome.step} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative min-h-0 flex-1">
          <AnimatePresence custom={{ d: dirRef.current, delay: delayRef.current }}>
            {stage === "loading"
              ? null
              : stage === "opener"
                ? screen(
                    "opener",
                    <Opener
                      variant="getStarted"
                      onGetStarted={() => go("signin")}
                      onSignIn={() => go("signin")}
                      onExpert={() => navigate("/onboarding", { state: { expert: true } })}
                    />,
                    openerVariants as Variants,
                    "absolute inset-x-0 bottom-0 top-[-106px]",
                  )
                : stage === "signin"
                  ? screen(
                      "signin",
                      <Auth
                        cohortName="the Leland community"
                        onBack={() => go("opener", -1)}
                        onExit={exit}
                        onNext={() => go("goal")}
                      />,
                      screenVariants as Variants,
                      "absolute inset-x-0 bottom-0 top-[-52px]",
                    )
                  : stage === "goal"
                    ? screen("goal", <GoalSelect onSelect={() => go("reassurance")} />)
                    : stage === "reassurance"
                      ? screen("reassurance", <ExpertReassurance onContinue={() => go("interested")} />)
                      : stage === "interested"
                        ? screen(
                            "interested",
                            <ChoiceQuestion
                              title="What are you most interested in?"
                              options={INTERESTED}
                              multi
                              onContinue={() => go("looking")}
                            />,
                          )
                        : stage === "looking"
                          ? screen(
                              "looking",
                              <ChoiceQuestion
                                title="What are you looking to do?"
                                options={LOOKING}
                                multi
                                onContinue={() => go("situation")}
                              />,
                            )
                          : stage === "situation"
                            ? screen("situation", <SituationStep onContinue={() => go("institutions")} />)
                            : stage === "institutions"
                              ? screen("institutions", <InstitutionSuggestions onContinue={() => go("profile")} />)
                              : stage === "profile"
                                ? screen(
                                    "profile",
                                    <ProfileSetup onContinue={() => go("joining")} onSkip={() => go("joining")} />,
                                  )
                                : stage === "joining"
                                  ? screen("joining", <Joining reduced={reduced} onDone={() => go("inline")} />)
                                  : stage === "inline"
                                    ? screen(
                                        "inline",
                                        <InLine
                                          invited={false}
                                          reduced={reduced}
                                          onDone={() => go("notify")}
                                          onFront={() => go("front")}
                                        />,
                                      )
                                    : stage === "front"
                                      ? screen("front", <Front reduced={reduced} onDone={() => go("notify")} />)
                                      : screen("notify", <Notify reduced={reduced} onDone={() => navigate("/profile-v2")} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
