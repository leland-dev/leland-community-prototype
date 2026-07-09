import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowLeft, X } from "lucide-react";

import type { Branch } from "../data";
import {
  BUCKETS,
  memberCountFor,
  type FlowAnswers,
  type BucketConfig,
} from "../flowConfig";
import CategorySelect from "./CategorySelect";
import CoachCount from "./CoachCount";
import TargetSelect from "./TargetSelect";
import Auth from "./Auth";
import CohortArrival from "./CohortArrival";

/* ─────────────────────────────────────────────────────────────────────────
 * FlowRunner — screens 4–8 on the white surface.
 * category → coach-count → target → auth → cohort arrival.
 * (Screen 3, reassurance, is a shell stage over the clouds.)
 * ──────────────────────────────────────────────────────────────────────── */

type StepId = "category" | "coachcount" | "target" | "auth" | "arrival";

function nextStep(cur: StepId): StepId | null {
  switch (cur) {
    case "category": return "coachcount";
    case "coachcount": return "target";
    case "target": return "auth";
    case "auth": return "arrival";
    case "arrival": return null;
  }
}

const PROGRESS: Record<StepId, number> = {
  category: 0.4,
  coachcount: 0.58,
  target: 0.78,
  auth: 0.95,
  arrival: 1,
};

function buildIntro(cfg: BucketConfig, a: FlowAnswers): string {
  const first = a.targets[0];
  const cat = a.categories[0] ?? "my options";
  if (cfg.targetMode === "ai-goal") {
    return first
      ? `Hey everyone — here to ${first.toLowerCase()}. Just getting started 👋`
      : `Hey everyone — just getting started with AI 👋`;
  }
  if (cfg.targetMode === "schools") {
    return first
      ? `Hey everyone — ${first} is the dream, just getting started. Any tips welcome!`
      : `Hey everyone — exploring ${cat} and figuring out my next move.`;
  }
  return first
    ? `Hey everyone — aiming to break into ${first}, just getting started. Would love to connect!`
    : `Hey everyone — exploring ${cat} and figuring out my next move.`;
}

export default function FlowRunner({
  branch,
  onBackToOpener,
  onExit,
  onComplete,
}: {
  branch: Branch;
  onBackToOpener: () => void;
  onExit: () => void;
  onComplete: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const cfg = BUCKETS[branch];
  const [answers, setAnswers] = useState<FlowAnswers>({ categories: [], targets: [] });
  const [step, setStep] = useState<StepId>("category");
  const [history, setHistory] = useState<StepId[]>([]);

  const go = (from: StepId, to: StepId | null) => {
    setHistory((h) => [...h, from]);
    if (to) setStep(to);
    else onComplete();
  };

  const goBack = () => {
    if (history.length === 0) {
      onBackToOpener();
      return;
    }
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setStep(prev);
  };

  const cohortName = cfg.cohortName(answers);
  const memberCount = memberCountFor(cohortName);

  const render = () => {
    switch (step) {
      case "category":
        return (
          <CategorySelect
            branch={branch}
            selected={answers.categories}
            onCommit={(categories) => {
              setAnswers((a) => ({ ...a, categories }));
              go("category", "coachcount");
            }}
          />
        );
      case "coachcount":
        return (
          <CoachCount
            branch={branch}
            category={answers.categories[0]}
            onDone={() => go("coachcount", "target")}
          />
        );
      case "target":
        return (
          <TargetSelect
            branch={branch}
            category={answers.categories[0]}
            initial={answers.targets}
            onCommit={(targets) => {
              setAnswers((a) => ({ ...a, targets }));
              go("target", "auth");
            }}
          />
        );
      case "auth":
        return (
          <Auth
            cohortName={cohortName}
            memberCount={memberCount}
            onBack={goBack}
            onExit={onExit}
            onNext={() => go("auth", "arrival")}
          />
        );
      case "arrival":
        return (
          <CohortArrival
            cohortName={cohortName}
            memberCount={memberCount}
            introDraft={buildIntro(cfg, answers)}
            onExit={onComplete}
          />
        );
    }
  };

  // Auth & arrival are full-bleed (own layout); everything else gets the header.
  if (step === "arrival" || step === "auth") {
    return <div className="h-full">{render()}</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <button
          onClick={goBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-black/[0.05]"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.07]">
          <motion.div
            className="h-full rounded-full bg-yellow"
            initial={false}
            animate={{ width: `${PROGRESS[step] * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
        <button
          onClick={onExit}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-black/[0.05]"
          aria-label="Exit onboarding"
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            {render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
