import { useMemo, useState, type ReactNode } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconCheck,
} from "../../leland";
import { FlowShell, FlowStepProgress, OptionCard, OptionGrid } from "../flow-kit";

// ─── Question config ─────────────────────────────────────────────────────────
// A quiz flow is authored as an ordered list of these. The engine renders one
// per screen, tracks answers, gates Continue, and handles conditional steps via
// `showIf`. Intentionally simplified vs. the source HTML: the AI-personalization
// API calls and animated radar/donut results screens are stubbed (no backend);
// results are a lightweight recap.

export type Answers = Record<string, unknown>;

export type QuizOption = { value: string; label: string; desc?: string };

type Base = {
  id: string;
  eyebrow?: string;
  title: string | ((a: Answers) => string);
  subhead?: string;
  optional?: boolean;
  // Skip this step entirely when it returns false.
  showIf?: (a: Answers) => boolean;
};

export type Question =
  | (Base & { type: "info"; cta?: string })
  | (Base & { type: "single"; options: QuizOption[]; columns?: 1 | 2 })
  | (Base & {
      type: "multi";
      options: QuizOption[];
      columns?: 1 | 2;
      otherValue?: string;
    })
  | (Base & { type: "text" | "textarea"; placeholder?: string })
  | (Base & {
      type: "scale";
      min: number;
      max: number;
      minLabel: string;
      maxLabel: string;
    })
  | (Base & { type: "chips"; options: QuizOption[]; otherValue?: string })
  | (Base & { type: "dropdown"; options: string[]; placeholder?: string })
  | (Base & { type: "rank"; options: QuizOption[]; max: number })
  | (Base & {
      type: "sliders";
      items: { key: string; label: string; hint?: string }[];
      unit: string;
      max: number;
    });

// ─── Answer helpers ──────────────────────────────────────────────────────────

function isAnswered(q: Question, a: Answers): boolean {
  if (q.optional || q.type === "info" || q.type === "sliders") return true;
  const v = a[q.id];
  switch (q.type) {
    case "single":
    case "scale":
    case "dropdown":
      return v !== undefined && v !== null && v !== "";
    case "text":
    case "textarea":
      return typeof v === "string" && v.trim().length > 0;
    case "multi":
    case "chips": {
      const arr = Array.isArray(v) ? (v as string[]) : [];
      if (arr.length === 0) return false;
      if (q.otherValue && arr.includes(q.otherValue)) {
        const other = a[`${q.id}__other`];
        return typeof other === "string" && other.trim().length > 0;
      }
      return true;
    }
    case "rank":
      return Array.isArray(v) && (v as string[]).length > 0;
    default:
      return true;
  }
}

// ─── Inputs ──────────────────────────────────────────────────────────────────

function TextInput({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { type: "text" | "textarea" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const shared =
    "w-full rounded-xl border border-leland-gray-stroke bg-white px-4 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:border-leland-gray-stroke-dark focus:outline-none focus:ring-2 focus:ring-leland-primary";
  return q.type === "textarea" ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={q.placeholder}
      rows={4}
      className={`${shared} resize-none`}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={q.placeholder}
      className={shared}
    />
  );
}

function Dropdown({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { type: "dropdown" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full cursor-pointer appearance-none rounded-xl border border-leland-gray-stroke bg-white px-4 py-3 pr-10 leland-paragraph-base focus:border-leland-gray-stroke-dark focus:outline-none focus:ring-2 focus:ring-leland-primary ${
          value ? "text-leland-gray-dark" : "text-leland-gray-extra-light"
        }`}
      >
        <option value="" disabled>
          {q.placeholder ?? "Select one…"}
        </option>
        {q.options.map((o) => (
          <option key={o} value={o} className="text-leland-gray-dark">
            {o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-leland-gray-light"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ScaleInput({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { type: "scale" }>;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const steps = [];
  for (let i = q.min; i <= q.max; i++) steps.push(i);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {steps.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex h-12 flex-1 items-center justify-center rounded-lg border-2 text-[0.875rem] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                active
                  ? "border-leland-gray-dark bg-white text-leland-gray-dark shadow-sm"
                  : "border-transparent bg-leland-gray-hover text-leland-gray-light hover:bg-leland-gray-stroke"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between leland-paragraph-sm text-leland-gray-light">
        <span>{q.minLabel}</span>
        <span>{q.maxLabel}</span>
      </div>
    </div>
  );
}

function Chips({
  q,
  value,
  onToggle,
}: {
  q: Extract<Question, { type: "chips" }>;
  value: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {q.options.map((o) => {
        const active = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={`rounded-full border px-4 py-2 leland-paragraph-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
              active
                ? "border-leland-gray-dark bg-leland-gray-dark text-white"
                : "border-leland-gray-stroke bg-white text-leland-gray-dark hover:bg-leland-gray-hover"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Ranking({
  q,
  value,
  onToggle,
}: {
  q: Extract<Question, { type: "rank" }>;
  value: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {q.options.map((o) => {
        const rank = value.indexOf(o.value);
        const ranked = rank !== -1;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
              ranked
                ? "border-leland-gray-dark bg-white shadow-sm"
                : "border-transparent bg-leland-gray-hover hover:bg-leland-gray-stroke"
            }`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[0.875rem] font-semibold ${
                ranked
                  ? "bg-leland-gray-dark text-white"
                  : "border border-leland-gray-stroke text-transparent"
              }`}
            >
              {ranked ? rank + 1 : ""}
            </span>
            <span className="leland-paragraph-base font-medium text-leland-gray-dark">
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Sliders({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { type: "sliders" }>;
  value: Record<string, number>;
  onChange: (key: string, v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {q.items.map((item) => {
        const v = value[item.key] ?? 0;
        return (
          <div key={item.key} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <div className="leland-paragraph-base font-semibold text-leland-gray-dark">
                  {item.label}
                </div>
                {item.hint ? (
                  <div className="leland-paragraph-sm text-leland-gray-light">
                    {item.hint}
                  </div>
                ) : null}
              </div>
              <div className="shrink-0 leland-paragraph-base font-semibold tabular-nums text-leland-gray-dark">
                {v} {q.unit}
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={q.max}
              step={1}
              value={v}
              onChange={(e) => onChange(item.key, Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-leland-gray-dark"
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export function QuizEngine({
  questions,
  progressLabel,
  completeTitle,
  completeSubhead,
  completeBody,
  onContinue,
}: {
  questions: Question[];
  progressLabel?: string;
  completeTitle: string;
  completeSubhead: string;
  completeBody?: (answers: Answers) => ReactNode;
  onContinue?: () => void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const steps = useMemo(
    () => questions.filter((q) => !q.showIf || q.showIf(answers)),
    [questions, answers],
  );
  const total = questions.filter(
    (q) => q.type !== "info" && (!q.showIf || q.showIf(answers)),
  ).length;
  const q = steps[Math.min(index, steps.length - 1)];

  const set = (id: string, v: unknown) =>
    setAnswers((a) => ({ ...a, [id]: v }));

  const toggleInArray = (id: string, v: string, max?: number) =>
    setAnswers((a) => {
      const arr = Array.isArray(a[id]) ? [...(a[id] as string[])] : [];
      const i = arr.indexOf(v);
      if (i !== -1) arr.splice(i, 1);
      else if (!max || arr.length < max) arr.push(v);
      return { ...a, [id]: arr };
    });

  const goNext = () => {
    if (index >= steps.length - 1) setDone(true);
    else setIndex((i) => i + 1);
  };
  const goBack = () => setIndex((i) => Math.max(0, i - 1));

  // Numbered position among counted (non-info, visible) questions.
  const numberedBefore = steps
    .slice(0, index + 1)
    .filter((s) => s.type !== "info").length;

  if (done) {
    return (
      <div className="flex flex-col gap-8">
        {progressLabel ? (
          <FlowStepProgress current={total} total={total} />
        ) : null}
        <FlowShell
          centered
          title={completeTitle}
          subhead={completeSubhead}
          footer={
            <div className="flex justify-center pt-2">
              <Button
                label="Continue"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                width={ButtonWidth.AUTO}
                onClick={() => onContinue?.()}
              />
            </div>
          }
        >
          <div className="flex size-[92px] items-center justify-center rounded-full bg-leland-success text-white">
            <IconCheck className="size-10" />
          </div>
          {completeBody ? completeBody(answers) : null}
        </FlowShell>
      </div>
    );
  }

  const title = typeof q.title === "function" ? q.title(answers) : q.title;
  const eyebrow =
    q.eyebrow ??
    (q.type !== "info" && progressLabel
      ? `${progressLabel} · Question ${numberedBefore} of ${total}`
      : undefined);

  return (
    <div className="flex flex-col gap-8">
      {progressLabel ? (
        <FlowStepProgress
          current={q.type === "info" ? numberedBefore : numberedBefore}
          total={total}
        />
      ) : null}
      <FlowShell
        eyebrow={eyebrow}
        title={title}
        subhead={q.subhead}
        onBack={index > 0 ? goBack : undefined}
        onContinue={goNext}
        continueLabel={
          q.type === "info" ? "Get started" : "Continue"
        }
        continueDisabled={!isAnswered(q, answers)}
      >
        <QuestionBody
          q={q}
          answers={answers}
          set={set}
          toggleInArray={toggleInArray}
        />
      </FlowShell>
    </div>
  );
}

function QuestionBody({
  q,
  answers,
  set,
  toggleInArray,
}: {
  q: Question;
  answers: Answers;
  set: (id: string, v: unknown) => void;
  toggleInArray: (id: string, v: string, max?: number) => void;
}) {
  switch (q.type) {
    case "info":
      return null;
    case "single":
      return (
        <OptionGrid columns={q.columns}>
          {q.options.map((o) => (
            <OptionCard
              key={o.value}
              name={o.label}
              desc={o.desc}
              selected={answers[q.id] === o.value}
              onClick={() => set(q.id, o.value)}
            />
          ))}
        </OptionGrid>
      );
    case "multi": {
      const arr = (answers[q.id] as string[] | undefined) ?? [];
      const showOther = q.otherValue && arr.includes(q.otherValue);
      return (
        <div className="flex flex-col gap-3">
          <OptionGrid columns={q.columns}>
            {q.options.map((o) => (
              <OptionCard
                key={o.value}
                name={o.label}
                desc={o.desc}
                selected={arr.includes(o.value)}
                onClick={() => toggleInArray(q.id, o.value)}
              />
            ))}
          </OptionGrid>
          {showOther ? (
            <input
              type="text"
              value={(answers[`${q.id}__other`] as string) ?? ""}
              onChange={(e) => set(`${q.id}__other`, e.target.value)}
              placeholder="Tell us more…"
              className="w-full rounded-xl border border-leland-gray-stroke bg-white px-4 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus:ring-2 focus:ring-leland-primary"
            />
          ) : null}
        </div>
      );
    }
    case "chips": {
      const arr = (answers[q.id] as string[] | undefined) ?? [];
      const showOther = q.otherValue && arr.includes(q.otherValue);
      return (
        <div className="flex flex-col gap-3">
          <Chips q={q} value={arr} onToggle={(v) => toggleInArray(q.id, v)} />
          {showOther ? (
            <input
              type="text"
              value={(answers[`${q.id}__other`] as string) ?? ""}
              onChange={(e) => set(`${q.id}__other`, e.target.value)}
              placeholder="What else?"
              className="w-full rounded-xl border border-leland-gray-stroke bg-white px-4 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus:ring-2 focus:ring-leland-primary"
            />
          ) : null}
        </div>
      );
    }
    case "text":
    case "textarea":
      return (
        <TextInput
          q={q}
          value={(answers[q.id] as string) ?? ""}
          onChange={(v) => set(q.id, v)}
        />
      );
    case "dropdown":
      return (
        <Dropdown
          q={q}
          value={(answers[q.id] as string) ?? ""}
          onChange={(v) => set(q.id, v)}
        />
      );
    case "scale":
      return (
        <ScaleInput
          q={q}
          value={answers[q.id] as number | undefined}
          onChange={(v) => set(q.id, v)}
        />
      );
    case "rank":
      return (
        <Ranking
          q={q}
          value={(answers[q.id] as string[] | undefined) ?? []}
          onToggle={(v) => toggleInArray(q.id, v, q.max)}
        />
      );
    case "sliders":
      return (
        <Sliders
          q={q}
          value={(answers[q.id] as Record<string, number> | undefined) ?? {}}
          onChange={(key, v) =>
            set(q.id, {
              ...((answers[q.id] as Record<string, number> | undefined) ?? {}),
              [key]: v,
            })
          }
        />
      );
    default:
      return null;
  }
}
