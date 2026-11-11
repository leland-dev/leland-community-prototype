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
  BASE_ROLE_OPTIONS,
  ChipGroup,
  GENERAL_FOCUS_AREAS,
  MAX_FOCUS_AREAS,
  PERSONALIZATION_KEY,
  ROLE_FOCUS_AREAS,
  type PersonalizationData,
} from "./PersonalizationModal";

type Step = "role" | "focus";

// Trimmed-down edit flow for the pencil next to "Your featured builds" —
// just role and what the learner wants to use AI for, as a multi-select
// list of focus areas scoped to that role, instead of the fuller
// status/role/industry/free-text flow in AboutMeEditModal.
const QuickPreferencesModalImpl = ({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ModalProps & {
  initialData: PersonalizationData | null;
  onSave: (data: PersonalizationData) => void;
}) => {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<string | null>(initialData?.role ?? null);
  const [focusAreas, setFocusAreas] = useState<string[]>(() =>
    initialData?.aiGoalText ? initialData.aiGoalText.split(", ").filter(Boolean) : [],
  );

  const reset = () => {
    setStep("role");
    setRole(initialData?.role ?? null);
    setFocusAreas(initialData?.aiGoalText ? initialData.aiGoalText.split(", ").filter(Boolean) : []);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange?.(next);
  };

  const handleSelectRole = (next: string) => {
    setRole(next);
    // Starting fresh with a new role's own focus areas rather than carrying
    // over selections that may not even exist in the new list.
    setFocusAreas([]);
    setStep("focus");
  };

  const toggleFocusArea = (value: string) => {
    setFocusAreas((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= MAX_FOCUS_AREAS) return prev;
      return [...prev, value];
    });
  };

  const handleSave = () => {
    if (!role) return;
    const data: PersonalizationData = {
      status: initialData?.status ?? "working",
      role,
      roleTense: initialData?.roleTense ?? "current",
      industry: initialData?.industry ?? null,
      industryTense: initialData?.industryTense ?? "current",
      aiGoalText: focusAreas.join(", "),
    };
    localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(data));
    onSave(data);
    handleOpenChange(false);
  };

  const focusOptions = role ? [...GENERAL_FOCUS_AREAS, ...(ROLE_FOCUS_AREAS[role] ?? [])] : [];

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} className="md:h-[600px]">
        <div className="flex h-full flex-col p-6 md:p-8">
          {step === "role" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <h2 className="shrink-0 text-heading-3xl font-season font-normal text-leland-gray-dark">
                What&apos;s your role?
              </h2>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ChipGroup options={BASE_ROLE_OPTIONS} selected={role} onSelect={handleSelectRole} />
              </div>
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
                label="Save"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                disabled={focusAreas.length === 0}
                onClick={handleSave}
              />
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export const QuickPreferencesModal = QuickPreferencesModalImpl;
