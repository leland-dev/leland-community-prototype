import { useState } from "react";

import {
  IconChevronLeft,
  Modal,
  ModalContent,
  ModalSize,
  type ModalProps,
} from "./leland";
import {
  ChipGroup,
  INDUSTRY_OPTIONS_BY_STATUS,
  INDUSTRY_QUESTION,
  OtherTextField,
  PERSONALIZATION_KEY,
  RadioList,
  ROLE_OPTIONS_BY_STATUS,
  ROLE_QUESTION,
  STATUS_OPTIONS,
  TENSE_BY_STATUS,
  useChipGroupWithOther,
  type PersonalizationData,
  type PersonalizationStatus,
} from "./PersonalizationModal";

type Step = "status" | "role" | "industry";

// Account-settings counterpart to the onboarding PersonalizationModal — same
// status → role/industry branching and options, prefilled with whatever was
// saved before, but as an editable flow (Back button, real close, "Save"
// instead of "Continue") rather than a first-run wizard. Deliberately
// excludes the AI-goal question, which is course-specific, not general
// profile info.
const AboutMeEditModalImpl = ({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ModalProps & {
  initialData: PersonalizationData | null;
  onSave: (data: PersonalizationData) => void;
}) => {
  const [step, setStep] = useState<Step>("status");
  const [status, setStatus] = useState<PersonalizationStatus | null>(initialData?.status ?? null);
  const [role, setRole] = useState<string | null>(initialData?.role ?? null);
  const [industry, setIndustry] = useState<string | null>(initialData?.industry ?? null);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStep("status");
      setStatus(initialData?.status ?? null);
      setRole(initialData?.role ?? null);
      setIndustry(initialData?.industry ?? null);
    }
    onOpenChange?.(next);
  };

  const handleStatusSelect = (next: PersonalizationStatus) => {
    setStatus(next);
    if (next === "not_working") {
      handleSave(next, null, null);
    } else {
      setStep("role");
    }
  };

  const handleSave = (
    finalStatus: PersonalizationStatus,
    finalRole: string | null,
    finalIndustry: string | null,
  ) => {
    const tense = TENSE_BY_STATUS[finalStatus];
    const isNotWorking = finalStatus === "not_working";
    const data: PersonalizationData = {
      status: finalStatus,
      role: isNotWorking ? null : finalRole,
      roleTense: isNotWorking ? "n/a" : tense,
      industry: isNotWorking ? null : finalIndustry,
      industryTense: isNotWorking ? "n/a" : tense,
      aiGoalText: initialData?.aiGoalText ?? "",
    };
    localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(data));
    onSave(data);
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
    if (status) handleSave(status, role, next);
  });

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} className="md:h-[600px]">
        <div className="flex h-full flex-col p-6 md:p-8">
          {step === "status" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <h2 className="shrink-0 text-heading-3xl font-season font-normal text-leland-gray-dark">
                What best describes your current situation?
              </h2>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <RadioList options={STATUS_OPTIONS} selected={status} onSelect={handleStatusSelect} />
              </div>
            </div>
          ) : step === "role" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <button
                type="button"
                onClick={() => setStep("status")}
                className="flex shrink-0 items-center gap-1 self-start leland-paragraph-base font-semibold text-leland-gray-dark hover:text-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              >
                <IconChevronLeft className="size-4" />
                Back
              </button>
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
              <button
                type="button"
                onClick={() => setStep("role")}
                className="flex shrink-0 items-center gap-1 self-start leland-paragraph-base font-semibold text-leland-gray-dark hover:text-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              >
                <IconChevronLeft className="size-4" />
                Back
              </button>
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
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export const AboutMeEditModal = AboutMeEditModalImpl;
