import { useState } from "react";

type Step = {
  id: string;
  title: string;
  durationMin: number;
  recommendedModel?: string;
  substeps?: string[];
  examplePrompt?: string;
};

const STEPS: Step[] = [
  {
    id: "step-1",
    title: "Set up your build environment",
    durationMin: 15,
    recommendedModel: "Claude Sonnet 4.5",
    substeps: [
      "Open Claude.ai in a separate window so you can build alongside the session.",
      "Create a new project for this session — name it something you'll find again.",
      "Pin the session guide tab so you can refer back without losing context.",
    ],
    examplePrompt:
      "Help me build an agent that can search documents, look up calendar events, and draft emails. Wire all three tools into a single Claude session and walk me through it step by step.",
  },
  {
    id: "step-2",
    title: "Build the agent skeleton",
    durationMin: 25,
    recommendedModel: "Claude Sonnet 4.5",
    substeps: [
      "Sketch the agent's three jobs in plain English before writing any code.",
      "Define one tool function for each job — stubs are fine, you're proving the wiring.",
      "Connect them to Claude using the tool-use API and test a single round-trip.",
    ],
    examplePrompt:
      "Write a minimal Python file that registers three tools — search, calendar, email — and routes user intents to the right one. Include type hints and a small CLI loop so I can test it.",
  },
  {
    id: "step-3",
    title: "Add memory and feedback",
    durationMin: 25,
    substeps: [
      "Persist tool results so Claude can refer back across turns.",
      "Add a one-line feedback step after each tool call (did this work?).",
      "Log every tool call to console so you can debug what the agent actually did.",
    ],
  },
  {
    id: "step-4",
    title: "Demo to the cohort",
    durationMin: 15,
    substeps: [
      "Pick one task and run your agent end-to-end without intervening.",
      "Share your repo link in #session-3-builds.",
      "Watch two other builds and leave one specific compliment on each.",
    ],
  },
];

const SHIPPED_ITEMS = [
  "Share your repo link in Slack (#session-3-builds) if you haven't already.",
  "Before Session 4, write down one thing you'd improve and one thing that surprised you.",
  "Session 4 is Monday — we'll layer memory patterns onto your agent.",
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepRow({
  step,
  index,
  isOpen,
  onToggle,
}: {
  step: Step;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-hover/40 lg:gap-4 lg:px-5 lg:py-5"
        aria-expanded={isOpen}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-hover text-[11px] font-semibold text-gray-dark">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-gray-dark lg:text-[16px]">{step.title}</span>
        <span className="shrink-0 text-[11px] text-gray-light lg:text-[12px]">{step.durationMin} min</span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <div className="px-4 pb-5 pl-4 lg:px-5 lg:pb-6 lg:pl-[68px]">
          {step.recommendedModel && (
            <div className="text-[12px] text-gray-light">
              Recommended model:{" "}
              <span className="font-semibold text-gray-dark">{step.recommendedModel}</span>
            </div>
          )}
          {step.substeps && (
            <ol className="mt-4 flex flex-col gap-3">
              {step.substeps.map((s, i) => (
                <li key={i} className="flex items-start gap-4 text-[13px] leading-snug text-gray-dark">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-hover text-[10px] font-medium text-gray-light">
                    {i + 1}
                  </span>
                  <span className="flex-1">{s}</span>
                </li>
              ))}
            </ol>
          )}
          {step.examplePrompt && (
            <div className="mt-5 rounded-xl bg-gray-hover/60 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-light">
                Example prompts
              </div>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-gray-dark">
                "{step.examplePrompt}"
              </pre>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function SessionGuide() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([STEPS[0].id]));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="rounded-2xl border border-gray-stroke bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-stroke px-5 py-4">
        <h2 className="text-[18px] font-medium text-gray-dark">Session guide</h2>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-dark hover:opacity-80"
        >
          Open in new tab
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* Steps */}
      <ol className="divide-y divide-gray-stroke">
        {STEPS.map((step, i) => (
          <StepRow
            key={step.id}
            step={step}
            index={i}
            isOpen={openIds.has(step.id)}
            onToggle={() => toggle(step.id)}
          />
        ))}
      </ol>

      {/* Summary card */}
      <div className="border-t border-gray-stroke p-5">
        <div className="rounded-xl bg-gray-hover/60 p-5">
          <h3 className="text-[14px] font-semibold text-gray-dark">You shipped something today</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {SHIPPED_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[12px] leading-snug text-gray-dark">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-light" />
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
