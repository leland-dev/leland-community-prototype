import { useState } from "react";
import { Button } from "../../components/Button";
import RowDelete from "../../components/RowDelete";
import { useGoals } from "../contexts/GoalsContext";
import { attemptDateLabel, sectionProgress, testSummary, type Goal, type TestAttempt } from "../data/goals";
import { examSectionsFor, scoreRangeFor } from "../../data/goalPlans";
import addPlusIcon from "../../assets/icons/add-plus.svg";

const CARD = "rounded-2xl bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

// Signed delta, coloured by direction. Down is rust, not red — this is progress
// tracking, not an error state.
function Delta({ value, suffix }: { value: number | null; suffix?: string }) {
  if (value === null || value === 0) return null;
  const up = value > 0;
  return (
    <span className={`text-[13px] font-medium ${up ? "text-[#037052]" : "text-[#9F5B34]"}`}>
      {up ? "+" : "−"}
      {Math.abs(value)}
      {suffix}
    </span>
  );
}

// Score trend across every sitting. Official sittings are filled dots, practice
// runs are hollow — the shape of the climb matters more than exact pixels, so
// this stays a small inline SVG rather than a chart dependency.
function TrendChart({ goal }: { goal: Goal }) {
  const { attempts, target } = testSummary(goal);
  if (attempts.length < 2) return null;

  const w = 640;
  const h = 150;
  const pad = { top: 16, right: 16, bottom: 26, left: 40 };
  const values = attempts.map((a) => a.total);
  // Domain covers the scores actually achieved plus the target — not the exam's
  // full scale, which would flatten a 60-point climb into a straight line.
  const lo = Math.min(...values, target ?? Infinity);
  const hi = Math.max(...values, target ?? -Infinity);
  // Pad so the line never sits flush against the frame.
  const spread = hi - lo || 20;
  const min = Math.floor(lo - spread * 0.18);
  const max = Math.ceil(hi + spread * 0.18);

  const x = (i: number) => pad.left + (i / (attempts.length - 1)) * (w - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - (v - min) / (max - min)) * (h - pad.top - pad.bottom);

  const line = attempts.map((a, i) => `${x(i).toFixed(1)},${y(a.total).toFixed(1)}`).join(" ");

  return (
    <div className="overflow-x-auto">
      {/* h-auto so the viewBox scales to the full width instead of being
          letterboxed and centred inside a fixed height. */}
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full min-w-[420px]" role="img" aria-label="Score trend across sittings">
        {target !== undefined && (
          <>
            <line x1={pad.left} x2={w - pad.right} y1={y(target)} y2={y(target)} stroke="#869AA6" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x={pad.left - 6} y={y(target) + 4} textAnchor="end" className="fill-[#869AA6]" style={{ fontSize: 11, fontWeight: 500 }}>
              {target}
            </text>
          </>
        )}
        <polyline points={line} fill="none" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {attempts.map((a, i) => (
          <g key={a.id}>
            <circle cx={x(i)} cy={y(a.total)} r="4.5" fill={a.kind === "official" ? "#222222" : "#FFFFFF"} stroke="#222222" strokeWidth="2" />
            <text x={x(i)} y={y(a.total) - 11} textAnchor="middle" className="fill-gray-dark" style={{ fontSize: 11, fontWeight: 600 }}>
              {a.total}
            </text>
            <text x={x(i)} y={h - 8} textAnchor="middle" className="fill-[#767676]" style={{ fontSize: 10 }}>
              {attemptDateLabel(a.date).replace(/, \d{4}$/, "")}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex items-center gap-4 text-[12px] text-gray-extra-light">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gray-dark" /> Official
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border-2 border-gray-dark bg-white" /> Practice
        </span>
        {target !== undefined && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-[#869AA6]" /> Target
          </span>
        )}
      </div>
    </div>
  );
}

function AttemptForm({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  const { addAttempt } = useGoals();
  const sections = examSectionsFor(goal.categories[0]);
  const range = scoreRangeFor(goal.categories[0]);

  const [kind, setKind] = useState<TestAttempt["kind"]>("practice");
  const [date, setDate] = useState("");
  const [total, setTotal] = useState("");
  const [note, setNote] = useState("");
  const [sectionScores, setSectionScores] = useState<Record<string, string>>({});
  const [warn, setWarn] = useState<string | null>(null);

  const input =
    "rounded-lg border-[1.5px] border-[#949494] bg-white px-3 py-2.5 text-[15px] text-gray-dark outline-none placeholder:text-[#949494] focus:border-gray-dark";

  const submit = () => {
    const totalNum = Number(total);
    if (!total.trim() || Number.isNaN(totalNum)) return setWarn("Enter the total score.");
    if (range && (totalNum < range.min || totalNum > range.max)) return setWarn(`${goal.categories[0]} totals run ${range.min}–${range.max}.`);
    if (!date) return setWarn("Pick the date you sat it.");

    const parsed: Record<string, number> = {};
    for (const s of sections) {
      const raw = sectionScores[s.name];
      if (!raw?.trim()) continue;
      const n = Number(raw);
      if (Number.isNaN(n) || n < s.min || n > s.max) return setWarn(`${s.name} runs ${s.min}–${s.max}.`);
      parsed[s.name] = n;
    }

    addAttempt(goal.id, {
      kind,
      date,
      total: totalNum,
      sections: Object.keys(parsed).length ? parsed : undefined,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#F5F5F5] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-white p-1">
          {(["practice", "official"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium capitalize transition-colors ${
                kind === k ? "bg-[#EBD4B5] text-gray-dark" : "text-gray-light hover:text-gray-dark"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date sat" className={`${input} py-2`} />
        <input
          type="number"
          inputMode="numeric"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          aria-label="Total score"
          placeholder={range ? `Total (${range.min}–${range.max})` : "Total"}
          className={`${input} w-[170px] py-2`}
        />
      </div>

      {sections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <input
              key={s.name}
              type="number"
              inputMode="numeric"
              value={sectionScores[s.name] ?? ""}
              onChange={(e) => setSectionScores((prev) => ({ ...prev, [s.name]: e.target.value }))}
              aria-label={`${s.name} score`}
              placeholder={`${s.name} (${s.min}–${s.max})`}
              className={`${input} w-[190px] py-2 text-[14px]`}
            />
          ))}
        </div>
      )}

      <textarea
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        aria-label="Note"
        placeholder="What happened? Anything you'd do differently."
        className={`${input} resize-y text-[14px] leading-[1.5]`}
      />

      {warn && <span className="text-[13px] text-[#9F5B34]">{warn}</span>}

      <div className="flex items-center gap-2.5">
        <Button onClick={submit} size="md" variant="primary" className="font-medium">
          Log score
        </Button>
        <button onClick={onClose} className="px-2.5 py-2 text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function TestOutcomes({ goal }: { goal: Goal }) {
  const { deleteAttempt, setSectionTarget } = useGoals();
  const [adding, setAdding] = useState(false);
  const summary = testSummary(goal);
  const sections = examSectionsFor(goal.categories[0]);
  const exam = goal.categories[0];

  return (
    <section className={CARD}>
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[19px] font-semibold leading-[1.2] text-gray-dark">Scores</h2>
        <span className="text-[13px] text-gray-extra-light">
          {summary.attempts.length} sitting{summary.attempts.length === 1 ? "" : "s"} logged
        </span>
      </div>
      <p className="mb-4 text-[14px] text-[#707070]">Every {exam} sitting, practice and official, and how the sections are moving.</p>

      {summary.attempts.length === 0 ? (
        <div className="rounded-xl bg-[#F3F1E6] p-5">
          <p className="text-[15px] font-semibold text-gray-dark">No scores yet.</p>
          <p className="mt-1 text-[14px] leading-[1.5] text-gray-light">
            Log a diagnostic or practice test and the trend starts building from there.
          </p>
        </div>
      ) : (
        <>
          {/* Headline numbers */}
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">Latest</span>
              <span className="flex items-baseline gap-2">
                <span className="font-serif text-[34px] font-medium leading-none text-gray-dark">{summary.latest?.total}</span>
                <Delta value={summary.delta} />
              </span>
              <span className="text-[12px] text-gray-extra-light">
                {summary.latest?.kind === "official" ? "Official" : "Practice"} · {attemptDateLabel(summary.latest!.date)}
              </span>
            </div>

            {summary.target !== undefined && (
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">Target</span>
                <span className="font-serif text-[34px] font-medium leading-none text-gray-dark">{summary.target}</span>
                <span className="text-[12px] text-gray-extra-light">
                  {summary.hitTarget
                    ? "Reached on an official sitting"
                    : summary.latest
                      ? `${Math.max(0, summary.target - summary.latest.total)} to go`
                      : ""}
                </span>
              </div>
            )}

            {summary.gained !== null && (
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">Gained</span>
                <span className="font-serif text-[34px] font-medium leading-none text-[#037052]">+{summary.gained}</span>
                <span className="text-[12px] text-gray-extra-light">since {attemptDateLabel(summary.baseline!.date)}</span>
              </div>
            )}
          </div>

          <div className="mt-5">
            <TrendChart goal={goal} />
          </div>

          {/* Per-section movement */}
          {sections.length > 0 && (
            <div className="mt-6 flex flex-col gap-2">
              <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">By section</span>
              <div className="flex flex-col gap-[2px]">
                {sections.map((s) => {
                  const p = sectionProgress(goal, s.name);
                  const pct = p.target ? Math.min(100, Math.round(((p.latest ?? 0) / p.target) * 100)) : null;
                  return (
                    <div key={s.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#F5F5F5]">
                      <span className="w-[150px] shrink-0 text-[15px] font-medium text-gray-dark">{s.name}</span>
                      <span className="flex w-[80px] shrink-0 items-baseline gap-1.5">
                        <span className="text-[17px] font-semibold leading-none text-gray-dark">{p.latest ?? "—"}</span>
                        <Delta value={p.delta} />
                      </span>
                      {pct !== null && (
                        <span className="flex min-w-[120px] flex-1 items-center gap-2.5">
                          <span className="h-1 flex-1 overflow-hidden rounded-full bg-[#222222]/10">
                            <span className="block h-full rounded-full bg-gray-dark" style={{ width: `${pct}%` }} />
                          </span>
                        </span>
                      )}
                      <label className="flex shrink-0 items-center gap-1.5 text-[13px] text-gray-extra-light">
                        Target
                        <input
                          type="number"
                          inputMode="numeric"
                          defaultValue={p.target ?? ""}
                          aria-label={`${s.name} target`}
                          onBlur={(e) => {
                            const raw = e.target.value.trim();
                            const n = raw ? Number(raw) : undefined;
                            setSectionTarget(goal.id, s.name, n !== undefined && n >= s.min && n <= s.max ? n : undefined);
                          }}
                          className="w-[64px] rounded border-[1.5px] border-[#949494] bg-white px-1.5 py-1 text-[13px] text-gray-dark outline-none focus:border-gray-dark"
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sitting-by-sitting log, newest first */}
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">Every sitting</span>
            <div className="flex flex-col gap-[2px]">
              {[...summary.attempts].reverse().map((a) => (
                <div key={a.id} className="group flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#F5F5F5]">
                  <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${a.kind === "official" ? "bg-gray-dark" : "border-2 border-gray-dark bg-white"}`} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="text-[16px] font-semibold leading-none text-gray-dark">{a.total}</span>
                      <span className="text-[13px] capitalize text-gray-extra-light">{a.kind}</span>
                      <span className="text-[13px] text-gray-extra-light">· {attemptDateLabel(a.date)}</span>
                      {a.loggedBy && (
                        <span className="inline-flex items-center gap-[5px] rounded-full bg-[#F3F1E6] py-[2px] pl-[3px] pr-2 text-[12px] text-gray-light">
                          <img src={a.loggedBy.avatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                          via {a.loggedBy.name}
                        </span>
                      )}
                    </div>
                    {a.sections && (
                      <div className="flex flex-wrap gap-x-3 text-[13px] text-gray-extra-light">
                        {Object.entries(a.sections).map(([name, score]) => (
                          <span key={name}>
                            {name} {score}
                          </span>
                        ))}
                      </div>
                    )}
                    {a.note && <p className="text-[13px] leading-[1.4] text-gray-light">{a.note}</p>}
                  </div>
                  <RowDelete onDelete={() => deleteAttempt(goal.id, a.id)} label={`${a.kind} score ${a.total}`} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {adding ? (
        <AttemptForm goal={goal} onClose={() => setAdding(false)} />
      ) : (
        <Button onClick={() => setAdding(true)} size="md" variant="secondary" className="mt-4 font-semibold">
          <img src={addPlusIcon} alt="" className="h-[18px] w-[18px]" />
          Log a score
        </Button>
      )}
    </section>
  );
}
