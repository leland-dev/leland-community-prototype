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

export type PersonalizationStatus = "working" | "job_searching" | "in_school" | "retired_exploring";
export type PersonalizationTense = "current" | "targeting" | "interested_in" | "n/a";

export type PersonalizationData = {
  status: PersonalizationStatus;
  role: string | null;
  roleTense: PersonalizationTense;
  industry: string | null;
  industryTense: PersonalizationTense;
  aiGoalText: string;
};

const STATUS_OPTIONS: { value: PersonalizationStatus; label: string }[] = [
  { value: "working", label: "Working" },
  { value: "job_searching", label: "Job searching / between roles" },
  { value: "in_school", label: "In school" },
  { value: "retired_exploring", label: "Retired or just exploring AI on my own" },
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

const ROLE_QUESTION: Record<Exclude<PersonalizationStatus, "retired_exploring">, string> = {
  working: "What's your role?",
  job_searching: "What role are you targeting?",
  in_school: "What kind of work are you hoping to move into?",
};

const INDUSTRY_QUESTION: Record<Exclude<PersonalizationStatus, "retired_exploring">, string> = {
  working: "What industry are you in?",
  job_searching: "What industry are you targeting?",
  in_school: "What industry are you interested in?",
};

const TENSE_BY_STATUS: Record<PersonalizationStatus, PersonalizationTense> = {
  working: "current",
  job_searching: "targeting",
  in_school: "interested_in",
  retired_exploring: "n/a",
};

const ROLE_OPTIONS_BY_STATUS: Record<Exclude<PersonalizationStatus, "retired_exploring">, ToggleChipOption[]> = {
  working: BASE_ROLE_OPTIONS,
  job_searching: BASE_ROLE_OPTIONS,
  in_school: withNotSure(BASE_ROLE_OPTIONS),
};

const INDUSTRY_OPTIONS_BY_STATUS: Record<Exclude<PersonalizationStatus, "retired_exploring">, ToggleChipOption[]> = {
  working: BASE_INDUSTRY_OPTIONS,
  job_searching: BASE_INDUSTRY_OPTIONS,
  in_school: withNotSure(BASE_INDUSTRY_OPTIONS),
};

// Prototype-only persistence, mirroring the pattern used for track/rating
// selections elsewhere in the course viewer — no real backend here.
export const PERSONALIZATION_KEY = "content-viewer-personalization";

type Step = "status" | "role" | "industry" | "goal";

function RadioList<T extends string>({
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

function ChipGroup({
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

// Branching onboarding personalization flow, shown right after picking an AI
// tool track. A status question routes each learner (working, job
// searching, in school, or retired/exploring) into role + industry
// follow-ups worded for their situation — someone laid off shouldn't be
// asked "what's your role?" in the present tense — before everyone answers
// the same closing open-ended question. Role/industry are skipped entirely
// for the retired/exploring branch.
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
    setStep(next === "retired_exploring" ? "goal" : "role");
  };

  const handleSubmit = () => {
    if (status) {
      const tense = TENSE_BY_STATUS[status];
      const data: PersonalizationData = {
        status,
        role: status === "retired_exploring" ? null : role,
        roleTense: status === "retired_exploring" ? "n/a" : tense,
        industry: status === "retired_exploring" ? null : industry,
        industryTense: status === "retired_exploring" ? "n/a" : tense,
        aiGoalText: goalText,
      };
      localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(data));
    }
    handleOpenChange(false);
  };

  const roleQuestion = status && status !== "retired_exploring" ? ROLE_QUESTION[status] : "";
  const industryQuestion = status && status !== "retired_exploring" ? INDUSTRY_QUESTION[status] : "";
  const roleOptions = status && status !== "retired_exploring" ? ROLE_OPTIONS_BY_STATUS[status] : [];
  const industryOptions = status && status !== "retired_exploring" ? INDUSTRY_OPTIONS_BY_STATUS[status] : [];

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
                <ChipGroup options={roleOptions} selected={role} onSelect={setRole} />
              </div>
              <Button
                label="Continue"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                disabled={!role}
                onClick={() => setStep("industry")}
              />
            </div>
          ) : step === "industry" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <h2 className="shrink-0 text-heading-3xl font-season font-normal text-leland-gray-dark">{industryQuestion}</h2>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ChipGroup options={industryOptions} selected={industry} onSelect={setIndustry} />
              </div>
              <Button
                label="Continue"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                disabled={!industry}
                onClick={() => setStep("goal")}
              />
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
                  className="w-full flex-1 resize-none rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
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
