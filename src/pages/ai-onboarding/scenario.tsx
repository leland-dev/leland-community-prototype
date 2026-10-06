/* Scenario = the pre-conditions the flow has to handle, driven by URL params so
 * any state is linkable:
 *   ?path=individual|team   self-purchase vs. invited by a B2B admin
 *   ?cohort=oct|nov|dec     cohort already chosen at checkout (omit = choose in onboarding)
 *   ?orgTool=claude|...|none  team path: did the admin set the AI tool for everyone?
 * A floating dev panel flips these and restarts the flow. */
import { createContext, useContext, useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "../../components/Button";
import { COHORTS, TOOLS, type Path, type ToolKey } from "./data";

export type Scenario = {
  path: Path;
  /** Cohort id chosen at checkout, or null if the learner still has to pick one. */
  cohort: string | null;
  /** Team path only: tool set at the org level, or null if each learner picks. */
  orgTool: ToolKey | null;
};

export const DEFAULT_ORG_TOOL: ToolKey = "claude";

export function scenarioFromParams(params: URLSearchParams): Scenario {
  const path: Path = params.get("path") === "team" ? "team" : "individual";
  const c = params.get("cohort");
  const cohort = c && COHORTS.some((x) => x.id === c) ? c : null;
  const t = params.get("orgTool");
  const orgTool: ToolKey | null =
    path !== "team" ? null
    : t === "none" ? null
    : t && TOOLS.some((x) => x.value === t) ? (t as ToolKey)
    : DEFAULT_ORG_TOOL;
  return { path, cohort, orgTool };
}

export function paramsFromScenario(s: Scenario): Record<string, string> {
  const p: Record<string, string> = { path: s.path };
  if (s.cohort) p.cohort = s.cohort;
  if (s.path === "team") p.orgTool = s.orgTool ?? "none";
  return p;
}

const ScenarioContext = createContext<Scenario>({ path: "individual", cohort: null, orgTool: null });
export const ScenarioProvider = ScenarioContext.Provider;
export const useScenario = () => useContext(ScenarioContext);

/* ── Dev panel ─────────────────────────────────────────────────────────── */
function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">{label}</div>
      <div className="flex gap-1">
        {options.map((o) => (
          <Button
            key={o.value}
            size="tag"
            variant="glass"
            rounded="rounded-md"
            onClick={() => onChange(o.value)}
            className={o.value === value ? "bg-yellow! text-ink-primary!" : "bg-white/10! text-white/80 hover:bg-white/20!"}
          >
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function DevPanel({
  scenario,
  stepId,
  onChange,
  onRestart,
}: {
  scenario: Scenario;
  stepId: string;
  onChange: (s: Scenario) => void;
  onRestart: () => void;
}) {
  const [open, setOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768);
  return (
    <div className={`fixed bottom-4 right-4 z-[70] overflow-hidden rounded-xl border border-white/10 bg-[#111]/95 text-white shadow-2xl backdrop-blur ${open ? "w-[280px]" : "w-auto"}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-3 py-2 text-left"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-yellow">{open ? "Dev · scenario" : "Dev"}</span>
        <span className="flex items-center gap-2 font-mono text-[10px] text-white/40">
          {stepId}
          {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-white/10 px-3 py-3">
          <Seg
            label="Entry"
            value={scenario.path}
            options={[
              { value: "individual", label: "Self-purchase" },
              { value: "team", label: "B2B invite" },
            ]}
            onChange={(path) => onChange({ ...scenario, path, orgTool: path === "team" ? scenario.orgTool ?? DEFAULT_ORG_TOOL : null })}
          />
          <Seg
            label="Cohort"
            value={scenario.cohort ?? "none"}
            options={[
              { value: "none", label: "Pick in onboarding" },
              { value: "oct", label: scenario.path === "team" ? "Assigned by admin" : "Chosen at checkout" },
            ]}
            onChange={(v) => onChange({ ...scenario, cohort: v === "none" ? null : v })}
          />
          {scenario.path === "team" ? (
            <Seg
              label="AI tool"
              value={scenario.orgTool ?? "none"}
              options={[
                { value: DEFAULT_ORG_TOOL, label: "Set by admin" },
                { value: "none", label: "Learner picks" },
              ]}
              onChange={(v) => onChange({ ...scenario, orgTool: v === "none" ? null : (v as ToolKey) })}
            />
          ) : null}
          <Button size="sm" variant="glass" rounded="rounded-md" className="w-full bg-white/10! hover:bg-white/20!" onClick={onRestart}>
            <RotateCcw size={12} /> Restart flow
          </Button>
        </div>
      ) : null}
    </div>
  );
}
