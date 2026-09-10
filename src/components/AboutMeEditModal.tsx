import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
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
  PERSONALIZATION_KEY,
  RadioList,
  ROLE_OPTIONS_BY_STATUS,
  ROLE_QUESTION,
  STATUS_OPTIONS,
  TENSE_BY_STATUS,
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
    if (next === "retired_exploring") {
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
    const isRetired = finalStatus === "retired_exploring";
    const data: PersonalizationData = {
      status: finalStatus,
      role: isRetired ? null : finalRole,
      roleTense: isRetired ? "n/a" : tense,
      industry: isRetired ? null : finalIndustry,
      industryTense: isRetired ? "n/a" : tense,
      aiGoalText: initialData?.aiGoalText ?? "",
    };
    localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(data));
    onSave(data);
    handleOpenChange(false);
  };

  const roleQuestion = status && status !== "retired_exploring" ? ROLE_QUESTION[status] : "";
  const industryQuestion = status && status !== "retired_exploring" ? INDUSTRY_QUESTION[status] : "";
  const roleOptions = status && status !== "retired_exploring" ? ROLE_OPTIONS_BY_STATUS[status] : [];
  const industryOptions = status && status !== "retired_exploring" ? INDUSTRY_OPTIONS_BY_STATUS[status] : [];

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
                <ChipGroup options={industryOptions} selected={industry} onSelect={setIndustry} />
              </div>
              <Button
                label="Save"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                disabled={!industry || !status}
                onClick={() => status && handleSave(status, role, industry)}
              />
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export const AboutMeEditModal = AboutMeEditModalImpl;
