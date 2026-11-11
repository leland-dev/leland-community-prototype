import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  Modal,
  ModalContent,
  ModalSize,
  withModal,
  type ModalProps,
} from "./leland";
import type { ToggleChipOption } from "../data/lessonBlocks";

export type PersonalizationStatus = "working" | "job_searching" | "in_school" | "not_working";
export type PersonalizationTense = "current" | "targeting" | "interested_in" | "n/a";

export type PersonalizationData = {
  status: PersonalizationStatus;
  role: string | null;
  roleTense: PersonalizationTense;
  industry: string | null;
  industryTense: PersonalizationTense;
  aiGoalText: string;
};

export const STATUS_OPTIONS: { value: PersonalizationStatus; label: string }[] = [
  { value: "working", label: "Working" },
  { value: "job_searching", label: "Job searching / between roles" },
  { value: "in_school", label: "In school" },
  { value: "not_working", label: "Focusing on life outside of work" },
];

export const BASE_ROLE_OPTIONS: ToggleChipOption[] = [
  { value: "swe", label: "Engineering" },
  { value: "pm", label: "Product" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data & Analytics" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "ops", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "legal", label: "Legal" },
  { value: "exec", label: "Executive" },
  { value: "founder", label: "Founder" },
  { value: "other", label: "Other" },
];

const BASE_INDUSTRY_OPTIONS: ToggleChipOption[] = [
  { value: "tech", label: "Technology" },
  { value: "finance", label: "Finance / Banking" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "consulting", label: "Consulting" },
  { value: "retail", label: "Retail / E-commerce" },
  { value: "media", label: "Media / Entertainment" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "realestate", label: "Real Estate" },
  { value: "gov", label: "Government / Nonprofit" },
  { value: "legal-industry", label: "Legal" },
  { value: "other", label: "Other" },
];

// "Not sure yet" is a first-class option for the In school branch, not
// folded into "Other" — inserted just before it so "Other" stays the
// catch-all at the end of the list.
const NOT_SURE_OPTION: ToggleChipOption = { value: "not-sure", label: "Not sure yet" };
function withNotSure(options: ToggleChipOption[]): ToggleChipOption[] {
  return [...options.slice(0, -1), NOT_SURE_OPTION, options[options.length - 1]];
}

export const ROLE_QUESTION: Record<Exclude<PersonalizationStatus, "not_working">, string> = {
  working: "What's your role?",
  job_searching: "What role are you targeting?",
  in_school: "What kind of work are you hoping to move into?",
};

export const INDUSTRY_QUESTION: Record<Exclude<PersonalizationStatus, "not_working">, string> = {
  working: "What industry are you in?",
  job_searching: "What industry are you targeting?",
  in_school: "What industry are you interested in?",
};

export const TENSE_BY_STATUS: Record<PersonalizationStatus, PersonalizationTense> = {
  working: "current",
  job_searching: "targeting",
  in_school: "interested_in",
  not_working: "n/a",
};

export const ROLE_OPTIONS_BY_STATUS: Record<Exclude<PersonalizationStatus, "not_working">, ToggleChipOption[]> = {
  working: BASE_ROLE_OPTIONS,
  job_searching: BASE_ROLE_OPTIONS,
  in_school: withNotSure(BASE_ROLE_OPTIONS),
};

export const INDUSTRY_OPTIONS_BY_STATUS: Record<Exclude<PersonalizationStatus, "not_working">, ToggleChipOption[]> = {
  working: BASE_INDUSTRY_OPTIONS,
  job_searching: BASE_INDUSTRY_OPTIONS,
  in_school: withNotSure(BASE_INDUSTRY_OPTIONS),
};

// "What do you want to use AI for?" options — every role gets these General
// tags plus its own role-specific ones below. Source: the onboarding
// focus-area rollout sheet (Tutorial Tags tab).
export const MAX_FOCUS_AREAS = 3;

export const GENERAL_FOCUS_AREAS: ToggleChipOption[] = [
  { value: "general-email", label: "Email & messages" },
  { value: "general-docs", label: "Documents & decks" },
  { value: "general-research", label: "Research & synthesis" },
  { value: "general-data", label: "Data analysis & reporting" },
  { value: "general-meetings", label: "Meetings & follow-up" },
  { value: "general-tasks", label: "Task management" },
];

// Role-specific focus areas, keyed by the same role codes as
// BASE_ROLE_OPTIONS. "other" has no role-specific tags of its own — just
// the General list above.
export const ROLE_FOCUS_AREAS: Record<string, ToggleChipOption[]> = {
  pm: [
    { value: "product-research", label: "User research" },
    { value: "product-competitive", label: "Competitive analysis" },
    { value: "product-specs", label: "PRDs & specs" },
    { value: "product-prototyping", label: "Prototyping" },
    { value: "product-roadmap", label: "Roadmap & prioritization" },
    { value: "product-stakeholders", label: "Stakeholder communications" },
  ],
  swe: [
    { value: "engineering-codegen", label: "Code generation" },
    { value: "engineering-review", label: "Code review & debugging" },
    { value: "engineering-testing", label: "Testing & QA" },
    { value: "engineering-docs", label: "Documentation" },
    { value: "engineering-tools", label: "Internal tools" },
    { value: "engineering-security", label: "Security" },
  ],
  design: [
    { value: "design-prototyping", label: "Prototyping" },
    { value: "design-research", label: "User research" },
    { value: "design-handoff", label: "Specs & handoff" },
    { value: "design-qa", label: "Design QA" },
    { value: "design-systems", label: "Design systems & assets" },
    { value: "design-creative", label: "Creative assets" },
  ],
  data: [
    { value: "data-sql", label: "Ad hoc SQL" },
    { value: "data-pipelines", label: "Data pipelines" },
    { value: "data-dashboards", label: "Dashboards & reporting" },
    { value: "data-qa", label: "Data QA" },
    { value: "data-selfserve", label: "Self-serve answers" },
    { value: "data-forecasting", label: "Experiments & forecasting" },
  ],
  marketing: [
    { value: "marketing-content", label: "Content creation" },
    { value: "marketing-seo", label: "SEO" },
    { value: "marketing-creative", label: "Creative assets" },
    { value: "marketing-campaign", label: "Campaign planning" },
    { value: "marketing-reporting", label: "Performance reporting" },
    { value: "marketing-research", label: "Market research" },
  ],
  sales: [
    { value: "sales-prospecting", label: "Prospecting" },
    { value: "sales-outreach", label: "Outreach & follow-up" },
    { value: "sales-callprep", label: "Call & meeting prep" },
    { value: "sales-crm", label: "CRM upkeep" },
    { value: "sales-proposals", label: "Proposals & pricing docs" },
  ],
  ops: [
    { value: "ops-sops", label: "SOPs & playbooks" },
    { value: "ops-intake", label: "Request intake & routing" },
    { value: "ops-prioritization", label: "Prioritization & scoping" },
  ],
  finance: [
    { value: "finance-recon", label: "Reconciliation" },
    { value: "finance-variance", label: "Variance & forecasting" },
    { value: "finance-modeling", label: "Financial modeling" },
    { value: "finance-compliance", label: "Compliance & regulatory" },
  ],
  hr: [
    { value: "people-jd", label: "Job descriptions" },
    { value: "people-interviews", label: "Interview guides" },
    { value: "people-onboarding", label: "Onboarding & training" },
    { value: "people-policy", label: "Policy Q&A" },
    { value: "people-reviews", label: "Performance reviews" },
  ],
  legal: [
    { value: "legal-drafting", label: "Contract drafting" },
    { value: "legal-review", label: "Contract review" },
    { value: "legal-intake", label: "Intake triage" },
    { value: "legal-policy", label: "Policy summaries" },
    { value: "legal-research", label: "Legal research" },
  ],
  exec: [
    { value: "exec-updates", label: "Leadership updates" },
    { value: "exec-strategy", label: "Strategy & planning" },
    { value: "exec-resourcing", label: "Resource planning" },
    { value: "exec-orgdesign", label: "Hiring and org design" },
  ],
  founder: [
    { value: "founder-investors", label: "Investor relations" },
    { value: "founder-strategy", label: "Strategy & planning" },
    { value: "founder-hiring", label: "Hiring & team planning" },
    { value: "founder-prototyping", label: "Product prototyping" },
    { value: "founder-support", label: "Customer support" },
  ],
  other: [],
};

// Prototype-only persistence, mirroring the pattern used for track/rating
// selections elsewhere in the course viewer — no real backend here.
export const PERSONALIZATION_KEY = "content-viewer-personalization";

export function loadPersonalizationData(): PersonalizationData | null {
  try {
    const raw = localStorage.getItem(PERSONALIZATION_KEY);
    return raw ? (JSON.parse(raw) as PersonalizationData) : null;
  } catch {
    return null;
  }
}

// Used on the account-settings "About me" row — general profile info (not
// course-specific), so it deliberately excludes the AI-goal free text.
export function summarizePersonalization(data: PersonalizationData): string {
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === data.status)?.label ?? "";
  if (data.status === "not_working") return statusLabel;
  // A role/industry that isn't in the known option list is custom text the
  // learner typed in after picking "Other" — show it as-is.
  const roleLabel = data.role
    ? (ROLE_OPTIONS_BY_STATUS[data.status].find((o) => o.value === data.role)?.label ?? data.role)
    : null;
  const industryLabel = data.industry
    ? (INDUSTRY_OPTIONS_BY_STATUS[data.status].find((o) => o.value === data.industry)?.label ?? data.industry)
    : null;
  const parts = [roleLabel, industryLabel].filter(Boolean);
  return parts.length ? parts.join(" · ") : statusLabel;
}

// Same data as summarizePersonalization, but split into a primary line
// (role, or status when there's no role — e.g. "Focusing on life outside of
// work") and a secondary line (industry, when there is one). Used by the
// course-viewer "About me" banner, which wants that as a two-line heading +
// subtext rather than one "role · industry" string.
export function summarizePersonalizationParts(
  data: PersonalizationData,
): { primary: string; secondary: string | null } {
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === data.status)?.label ?? "";
  if (data.status === "not_working") return { primary: statusLabel, secondary: null };
  const roleLabel = data.role
    ? (ROLE_OPTIONS_BY_STATUS[data.status].find((o) => o.value === data.role)?.label ?? data.role)
    : null;
  const industryLabel = data.industry
    ? (INDUSTRY_OPTIONS_BY_STATUS[data.status].find((o) => o.value === data.industry)?.label ?? data.industry)
    : null;
  return { primary: roleLabel ?? statusLabel, secondary: industryLabel };
}

export type Step = "status" | "role" | "focus";

export function RadioList<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T | null;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map(({ value, label }) => {
        const isSelected = selected === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={`flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
              isSelected
                ? "border-2 border-leland-gray-dark bg-white"
                : "border border-leland-gray-stroke bg-white hover:bg-leland-gray-hover"
            }`}
          >
            <span className="min-w-0 flex-1 leland-heading-base font-semibold text-leland-gray-dark">{label}</span>
            <div
              className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                isSelected ? "border-leland-gray-dark bg-leland-gray-dark" : "border-leland-gray-stroke bg-white"
              }`}
            >
              {isSelected ? <div className="size-2 rounded-full bg-white" /> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function ChipGroup({
  options,
  selected,
  onSelect,
}: {
  options: ToggleChipOption[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`rounded-full border-2 px-4 py-2.5 leland-paragraph-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
              isSelected
                ? "border-leland-gray-dark bg-leland-gray-hover text-leland-gray-dark"
                : "border-transparent bg-leland-gray-hover text-leland-gray-dark hover:border-leland-gray-stroke"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// Backs a ChipGroup with a free-text follow-up for "Other" — so picking it
// doesn't just discard the detail, we actually capture what it is. Every
// other chip still advances immediately on click; "Other" reveals a text
// field and Continue button instead. Returns pieces rather than a single
// element so the caller can render the chips in a scrollable region and the
// "Other" input/button anchored to the bottom of the modal, like every
// other step's primary action. `initialValue` may be a known option value,
// a previously-entered custom string, or null/undefined (first run).
export function useChipGroupWithOther(
  options: ToggleChipOption[],
  initialValue: string | null | undefined,
  onContinue: (value: string) => void,
) {
  const isKnownValue = initialValue != null && options.some((o) => o.value === initialValue);
  const [selected, setSelected] = useState<string | null>(
    initialValue == null ? null : isKnownValue ? initialValue : "other",
  );
  const [otherText, setOtherText] = useState(isKnownValue ? "" : (initialValue ?? ""));

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value !== "other") onContinue(value);
  };

  return {
    selected,
    handleSelect,
    otherText,
    setOtherText,
    isOther: selected === "other",
    submitOther: () => onContinue(otherText.trim()),
  };
}

// The free-text field + Continue button shown once "Other" is selected —
// meant to be rendered outside the chip list's scroll container, anchored
// to the bottom of the modal.
export function OtherTextField({
  value,
  onChange,
  placeholder,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onSubmit: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={30}
        autoFocus
        className="w-full rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:border-leland-gray-dark focus:outline-none"
      />
      <Button
        label="Continue"
        buttonColor={ButtonColor.PRIMARY}
        size={ButtonSize.LARGE}
        rounded
        width={ButtonWidth.FULL}
        disabled={value.trim() === ""}
        onClick={onSubmit}
      />
    </div>
  );
}

// Branching onboarding personalization flow, shown right after picking an AI
// tool track. A status question routes each learner (working, job
// searching, in school, or not working) into a role follow-up worded for
// their situation — someone laid off shouldn't be asked "what's your
// role?" in the present tense — before everyone picks from the same
// closing "what do you want to use AI for" focus areas, scoped to their
// role (or just the General list for the not-working branch, which has no
// role). Role is skipped entirely for the not-working branch, since their
// learning here isn't tied to a job.
const PersonalizationModalImpl = ({ open, onOpenChange }: ModalProps) => {
  const [step, setStep] = useState<Step>("status");
  const [status, setStatus] = useState<PersonalizationStatus | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const reset = () => {
    setStep("status");
    setStatus(null);
    setRole(null);
    setFocusAreas([]);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange?.(next);
  };

  const handleStatusSelect = (next: PersonalizationStatus) => {
    setStatus(next);
    setStep(next === "not_working" ? "focus" : "role");
  };

  const toggleFocusArea = (value: string) => {
    setFocusAreas((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= MAX_FOCUS_AREAS) return prev;
      return [...prev, value];
    });
  };

  const handleSubmit = () => {
    if (status) {
      const tense = TENSE_BY_STATUS[status];
      const data: PersonalizationData = {
        status,
        role: status === "not_working" ? null : role,
        roleTense: status === "not_working" ? "n/a" : tense,
        industry: null,
        industryTense: "n/a",
        aiGoalText: focusAreas.join(", "),
      };
      localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(data));
    }
    handleOpenChange(false);
  };

  const roleQuestion = status && status !== "not_working" ? ROLE_QUESTION[status] : "";
  const roleOptions = status && status !== "not_working" ? ROLE_OPTIONS_BY_STATUS[status] : [];
  const focusOptions = role ? [...GENERAL_FOCUS_AREAS, ...(ROLE_FOCUS_AREAS[role] ?? [])] : GENERAL_FOCUS_AREAS;

  const roleChip = useChipGroupWithOther(roleOptions, role, (next) => {
    setRole(next);
    setStep("focus");
  });

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} hideCloseButton className="md:h-[600px]">
        <div className="flex h-full flex-col p-6 md:p-8">
          {step === "status" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <div className="flex shrink-0 flex-col gap-2">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  What best describes your current situation?
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  Your answers help us tailor your experience.
                </p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <RadioList options={STATUS_OPTIONS} selected={status} onSelect={handleStatusSelect} />
              </div>
            </div>
          ) : step === "role" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <h2 className="shrink-0 text-heading-3xl font-season font-normal text-leland-gray-dark">{roleQuestion}</h2>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ChipGroup options={roleOptions} selected={roleChip.selected} onSelect={roleChip.handleSelect} />
              </div>
              {roleChip.isOther ? (
                <OtherTextField
                  value={roleChip.otherText}
                  onChange={roleChip.setOtherText}
                  placeholder="e.g. Software Engineer"
                  onSubmit={roleChip.submitOther}
                />
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <div className="flex shrink-0 flex-col gap-2">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  What are you most interested in using AI for?
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">Select up to three.</p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {focusOptions.map((opt) => {
                    const isSelected = focusAreas.includes(opt.value);
                    const isDisabled = !isSelected && focusAreas.length >= MAX_FOCUS_AREAS;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleFocusArea(opt.value)}
                        className={`rounded-full border-2 px-4 py-2.5 leland-paragraph-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                          isSelected
                            ? "border-leland-gray-dark bg-leland-gray-hover text-leland-gray-dark"
                            : isDisabled
                              ? "cursor-not-allowed border-transparent bg-leland-gray-hover text-leland-gray-light opacity-50"
                              : "border-transparent bg-leland-gray-hover text-leland-gray-dark hover:border-leland-gray-stroke"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Button
                label="Done"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                disabled={focusAreas.length === 0}
                onClick={handleSubmit}
              />
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export const PersonalizationModal = withModal(PersonalizationModalImpl);
