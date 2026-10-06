/* ─────────────────────────────────────────────────────────────────────────
 * AI Builder Program — first-mile onboarding (post-checkout / post-invite).
 *
 * Route: /ai-onboarding?path=individual|team&cohort=oct&orgTool=none
 *
 *   individual: checkout ✓ → welcome → work/personal → [team details] → role
 *               → social proof (people like you) → experience → tool
 *               → "AIBP for role" → goals (chips) → goal (own words) → finish → preparing → hub
 *   team:       invite email → branded interstitial auth → welcome → role
 *               → team social proof → experience → [tool, if not set by org]
 *               → "AIBP for role" → goals → goal → finish → preparing → hub
 *
 * One slug, BetterHelp-style. The current step lives in history state (each
 * step pushes an entry, so browser back/forward still walk the questions) and
 * is mirrored to sessionStorage with the answers so a refresh keeps its place.
 *
 * Question, moment and loader steps share ONE persistent light Shell (logo,
 * progress, back); only the content column transitions between them. The
 * welcome and invite-auth screens are split layouts (content left, AI Builder
 * brand panel right); checkout, invite email and the hub are takeovers.
 * ──────────────────────────────────────────────────────────────────────── */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { EMPTY_ANSWERS, type Answers } from "./data";
import { DevPanel, ScenarioProvider, paramsFromScenario, scenarioFromParams, type Scenario } from "./scenario";
import { Shell, type Theme } from "./ui";
import { CheckoutConfirmation, InviteEmail, InviteInterstitial } from "./screens/Bookends";
import { ProgramHub } from "./screens/ProgramHub";
import { Welcome } from "./screens/Welcome";
import { ContextStep, ExperienceStep, GoalTextStep, GoalsStep, RoleStep, TeamStep, ToolStep } from "./screens/Questions";
import { Preparing, RoleAffirmation, SocialProof } from "./screens/Moments";
import { FinishStep } from "./screens/FinishAccount";

export const AI_ONBOARDING_PATH = "/ai-onboarding";

type StepId =
  | "checkout" | "invite" | "interstitial" | "welcome"
  | "context" | "team" | "role" | "experience" | "affirm" | "tool" | "goals" | "goal" | "proof" | "finish"
  | "preparing" | "hub";

type StepDef = {
  id: StepId;
  when?: (a: Answers, sc: Scenario) => boolean;
  counts?: boolean;
  skippable?: boolean;
  /** Rendered inside the persistent Shell (vs. a full-screen takeover). */
  shell?: { theme: Theme };
};

const SEQUENCE: StepDef[] = [
  { id: "checkout", when: (_, sc) => sc.path === "individual" },
  { id: "invite", when: (_, sc) => sc.path === "team" },
  { id: "interstitial", when: (_, sc) => sc.path === "team" },
  { id: "welcome" },
  { id: "context", when: (_, sc) => sc.path === "individual", counts: true, shell: { theme: "light" } },
  { id: "team", when: (a, sc) => sc.path === "individual" && a.context === "work", counts: true, skippable: true, shell: { theme: "light" } },
  { id: "role", counts: true, shell: { theme: "light" } },
  { id: "proof", shell: { theme: "light" } },      // "people like you", right after they tell us their role
  { id: "experience", counts: true, shell: { theme: "light" } },
  { id: "tool", when: (_, sc) => !sc.orgTool, counts: true, shell: { theme: "light" } },
  { id: "affirm", shell: { theme: "light" } },     // "AIBP for your role" — references the tool they just picked
  { id: "goals", counts: true, skippable: true, shell: { theme: "light" } },
  { id: "goal", counts: true, skippable: true, shell: { theme: "light" } },      // open-ended, in their own words
  { id: "finish", counts: true, shell: { theme: "light" } },
  { id: "preparing", shell: { theme: "light" } },
  { id: "hub" },
];

const STEP_IDS = SEQUENCE.map((s) => s.id);
const isStep = (s: unknown): s is StepId => typeof s === "string" && (STEP_IDS as string[]).includes(s);
const seqIndex = (id: StepId) => SEQUENCE.findIndex((s) => s.id === id);

/** Steps you can't "back" into (bookends and the loader). */
const NO_RETURN: StepId[] = ["checkout", "invite", "interstitial", "preparing"];
/** Steps that shouldn't linger in history (so browser-back skips them). */
const TRANSIENT: StepId[] = ["preparing"];

const ANSWERS_KEY = "aibp-onboarding-answers";
const STEP_KEY = "aibp-onboarding-step";
const firstStep = (sc: Scenario): StepId => (sc.path === "team" ? "invite" : "checkout");
const initialAnswers = (sc: Scenario): Answers => ({ ...EMPTY_ANSWERS, cohortId: sc.cohort ?? undefined });

const storage = {
  get<T>(key: string): T | null {
    try { const raw = sessionStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
  },
  set(key: string, value: unknown) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  },
  clear(...keys: string[]) {
    try { keys.forEach((k) => sessionStorage.removeItem(k)); } catch { /* ignore */ }
  },
};

/* Content transition inside the persistent shell: a quick, direction-aware
 * slide (100ms out + 100ms in). Page-level switches crossfade in 150ms each way. */
const slide = {
  enter: (dir: 1 | -1) => ({ opacity: 0, x: 16 * dir }),
  center: { opacity: 1, x: 0 },
  exit: (dir: 1 | -1) => ({ opacity: 0, x: -16 * dir }),
};

export default function AiOnboarding() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const scenario = useMemo(() => scenarioFromParams(params), [params]);
  const { path } = scenario;

  /* ── current step: history state → sessionStorage → first step ── */
  const stateStep = (location.state as { step?: unknown } | null)?.step;
  const stepId: StepId = isStep(stateStep) ? stateStep : (storage.get<StepId>(STEP_KEY) ?? firstStep(scenario));
  useEffect(() => { storage.set(STEP_KEY, stepId); }, [stepId]);

  const go = useCallback(
    (id: StepId, opts: { replace?: boolean; search?: string } = {}) =>
      navigate({ pathname: AI_ONBOARDING_PATH, search: opts.search ?? location.search }, { state: { step: id }, replace: opts.replace }),
    [navigate, location.search],
  );

  // Give the initial history entry a step so back/forward have something to restore.
  useEffect(() => {
    if (!isStep(stateStep)) go(stepId, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── answers (persisted) ── */
  const [answers, setAnswers] = useState<Answers>(() => ({ ...initialAnswers(scenario), ...(storage.get<Partial<Answers>>(ANSWERS_KEY) ?? {}) }));
  useEffect(() => { storage.set(ANSWERS_KEY, answers); }, [answers]);

  // Latest answers + step, readable from callbacks that fire after a timeout
  // (single-select steps auto-advance a beat after setting their answer).
  const latest = useRef(answers);
  latest.current = answers;
  const stepRef = useRef(stepId);
  stepRef.current = stepId;

  const update = useCallback((patch: Partial<Answers>) => {
    latest.current = { ...latest.current, ...patch };
    setAnswers(latest.current);
  }, []);

  /* ── sequence ── */
  const visibleFor = useCallback((a: Answers) => SEQUENCE.filter((s) => !s.when || s.when(a, scenario)), [scenario]);
  const visible = useMemo(() => visibleFor(answers), [visibleFor, answers]);
  const current = SEQUENCE[seqIndex(stepId)];
  const counted = visible.filter((s) => s.counts);
  const total = counted.length;
  // Progress = question steps reached so far (moments inherit the previous question's count).
  const step = counted.filter((s) => seqIndex(s.id) <= seqIndex(current.id)).length;

  // Direction for the content slide: forward if the step index grew.
  const prevStepRef = useRef(stepId);
  const dir: 1 | -1 = seqIndex(stepId) >= seqIndex(prevStepRef.current) ? 1 : -1;
  useEffect(() => { prevStepRef.current = stepId; }, [stepId]);

  const next = useCallback(() => {
    const from = stepRef.current;
    const i = seqIndex(from);
    const n = visibleFor(latest.current).find((s) => seqIndex(s.id) > i);
    if (n) go(n.id, { replace: TRANSIENT.includes(from) });
  }, [visibleFor, go]);

  const prev = [...visible].reverse().find((s) => seqIndex(s.id) < seqIndex(stepId));
  const back = prev && !NO_RETURN.includes(prev.id) ? () => go(prev.id) : undefined;
  const skip = current.skippable ? next : undefined;

  const restart = (sc: Scenario) => {
    storage.clear(ANSWERS_KEY, STEP_KEY);
    latest.current = initialAnswers(sc);
    setAnswers(latest.current);
    go(firstStep(sc), { search: "?" + new URLSearchParams(paramsFromScenario(sc)).toString() });
  };

  const stepProps = { answers, update, onNext: next, onBack: back, onSkip: skip, step, total, path };

  const screen = (() => {
    switch (current.id) {
      case "checkout": return <CheckoutConfirmation onNext={next} />;
      case "invite": return <InviteEmail onNext={next} />;
      case "interstitial": return <InviteInterstitial onNext={next} />;
      case "welcome": return <Welcome path={path} onNext={next} />;
      case "context": return <ContextStep {...stepProps} />;
      case "team": return <TeamStep {...stepProps} />;
      case "role": return <RoleStep {...stepProps} />;
      case "experience": return <ExperienceStep {...stepProps} />;
      case "affirm": return <RoleAffirmation answers={answers} path={path} onNext={next} />;
      case "tool": return <ToolStep {...stepProps} />;
      case "goals": return <GoalsStep {...stepProps} />;
      case "goal": return <GoalTextStep {...stepProps} />;
      case "proof": return <SocialProof answers={answers} path={path} onNext={next} />;
      case "finish": return <FinishStep {...stepProps} />;
      case "preparing": return <Preparing answers={answers} path={path} onDone={next} />;
      case "hub": return <ProgramHub answers={answers} path={path} />;
    }
  })();

  const shell = current.shell;

  return (
    <ScenarioProvider value={scenario}>
    <div className="aibp-flow">
      {/* Outer: swaps between the persistent shell and full-screen takeovers. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={shell ? "shell" : current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {shell ? (
            <Shell
              theme={shell.theme}
              step={step}
              total={total}
              onBack={back}
              onSkip={skip}
              scrollKey={current.id}
            >
              {/* Inner: only the content column moves between steps. */}
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={current.id}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {screen}
                </motion.div>
              </AnimatePresence>
            </Shell>
          ) : (
            screen
          )}
        </motion.div>
      </AnimatePresence>
      <DevPanel scenario={scenario} stepId={current.id} onChange={restart} onRestart={() => restart(scenario)} />
    </div>
    </ScenarioProvider>
  );
}
