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

const BASE_ROLE_OPTIONS: ToggleChipOption[] = [
  { value: "swe", label: "Software Engineer / Developer" },
  { value: "pm", label: "Product Manager" },
  { value: "design", label: "Designer / UX" },
  { value: "data", label: "Data Analyst / Scientist" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "ops", label: "Operations" },
  { value: "finance", label: "Finance / Accounting" },
  { value: "hr", label: "HR / People" },
  { value: "legal", label: "Legal" },
  { value: "exec", label: "Executive / Leadership" },
  { value: "founder", label: "Founder / Entrepreneur" },
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

export type Step = "status" | "role" | "industry" | "goal";

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
// searching, in school, or not working) into role + industry follow-ups
// worded for their situation — someone laid off shouldn't be asked "what's
// your role?" in the present tense — before everyone answers the same
// closing open-ended question. Role/industry are skipped entirely for the
// not-working branch, since their learning here isn't tied to a job.
const PersonalizationModalImpl = ({ open, onOpenChange }: ModalProps) => {
  const [step, setStep] = useState<Step>("status");
  const [status, setStatus] = useState<PersonalizationStatus | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [goalText, setGoalText] = useState("");

  const reset = () => {
    setStep("status");
    setStatus(null);
    setRole(null);
    setIndustry(null);
    setGoalText("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange?.(next);
  };

  const handleStatusSelect = (next: PersonalizationStatus) => {
    setStatus(next);
    setStep(next === "not_working" ? "goal" : "role");
  };

  const handleSubmit = () => {
    if (status) {
      const tense = TENSE_BY_STATUS[status];
      const data: PersonalizationData = {
        status,
        role: status === "not_working" ? null : role,
        roleTense: status === "not_working" ? "n/a" : tense,
        industry: status === "not_working" ? null : industry,
        industryTense: status === "not_working" ? "n/a" : tense,
        aiGoalText: goalText,
      };
      localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(data));
    }
    handleOpenChange(false);
  };

  const roleQuestion = status && status !== "not_working" ? ROLE_QUESTION[status] : "";
  const industryQuestion = status && status !== "not_working" ? INDUSTRY_QUESTION[status] : "";
  const roleOptions = status && status !== "not_working" ? ROLE_OPTIONS_BY_STATUS[status] : [];
  const industryOptions = status && status !== "not_working" ? INDUSTRY_OPTIONS_BY_STATUS[status] : [];

  const roleChip = useChipGroupWithOther(roleOptions, role, (next) => {
    setRole(next);
    setStep("industry");
  });
  const industryChip = useChipGroupWithOther(industryOptions, industry, (next) => {
    setIndustry(next);
    setStep("goal");
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
          ) : step === "industry" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <h2 className="shrink-0 text-heading-3xl font-season font-normal text-leland-gray-dark">{industryQuestion}</h2>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ChipGroup options={industryOptions} selected={industryChip.selected} onSelect={industryChip.handleSelect} />
              </div>
              {industryChip.isOther ? (
                <OtherTextField
                  value={industryChip.otherText}
                  onChange={industryChip.setOtherText}
                  placeholder="e.g. Healthcare"
                  onSubmit={industryChip.submitOther}
                />
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <h2 className="shrink-0 text-heading-3xl font-season font-normal text-leland-gray-dark">
                What are you hoping to use AI for?
              </h2>
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <textarea
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="e.g., automating reports at work, building a personal project, drafting emails and messages"
                  className="w-full flex-1 resize-none rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:border-leland-gray-dark focus:outline-none"
                />
                <p className="shrink-0 leland-paragraph-sm text-leland-gray-light">
                  Your instructor may look at these to tailor examples for your cohort.
                </p>
              </div>
              <Button
                label="Done"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                disabled={goalText.trim() === ""}
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
