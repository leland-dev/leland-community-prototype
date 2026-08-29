import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconCheck,
  IconChevronRight,
  IconMoney,
  IconX,
  Modal,
  ModalContent,
  ModalSize,
  withModal,
  type ModalProps,
} from "./leland";

// Two-step "not helpful" feedback flow: an optional free-text form, then a
// thank-you screen with a paid-research-call upsell. Skip and Submit both
// advance to the thank-you step — the "No" itself is already the feedback,
// this is just for optional detail.
const SectionFeedbackModalImpl = ({
  open,
  onOpenChange,
  sectionTitle,
}: ModalProps & { sectionTitle: string }) => {
  const [step, setStep] = useState<"form" | "thanks">("form");
  const [text, setText] = useState("");
  const [sectionTagDismissed, setSectionTagDismissed] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStep("form");
      setText("");
      setSectionTagDismissed(false);
    }
    onOpenChange?.(next);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} className="md:h-[560px]">
        {step === "form" ? (
          <div className="flex h-full flex-col p-6 md:p-8">
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-col gap-2 pr-8">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  {sectionTagDismissed ? "Help us improve this course" : "Help improve this section"}
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  {sectionTagDismissed
                    ? "What's not working — pace, level, format, anything."
                    : "Describe anything missing, outdated or unclear"}
                </p>
              </div>
              {!sectionTagDismissed && (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-leland-gray-hover px-4 py-3">
                  <p className="min-w-0 truncate leland-paragraph-base text-leland-gray-dark">
                    <span className="font-semibold">Section:</span> {sectionTitle}
                  </p>
                  <button
                    type="button"
                    aria-label="Remove section"
                    onClick={() => setSectionTagDismissed(true)}
                    className="flex shrink-0 items-center justify-center rounded-full text-leland-gray-light hover:text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                  >
                    <IconX className="size-4" />
                  </button>
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="section-feedback-text" className="leland-paragraph-base text-leland-gray-dark">
                  Optional feedback
                </label>
                <textarea
                  id="section-feedback-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full flex-1 resize-none rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-8">
              <Button
                label="Skip"
                buttonColor={ButtonColor.WHITE}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                onClick={() => setStep("thanks")}
              />
              <Button
                label="Submit feedback"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                disabled={text.trim() === ""}
                onClick={() => setStep("thanks")}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center p-6 text-center md:p-8">
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-leland-gray-hover">
                <IconCheck className="size-5 text-leland-gray-dark" />
              </span>
              <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                Thank you for your feedback
              </h2>
            </div>
            <div className="flex w-full flex-col gap-8">
              <a
                href="https://calendly.com/bootcamps-joinleland/ai-builder-program-office-hours"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-4 rounded-xl bg-leland-gray-hover px-5 py-4 text-left transition-colors hover:brightness-95"
              >
                <IconMoney className="size-6 shrink-0 text-leland-gray-dark" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="leland-paragraph-lg font-semibold! text-leland-gray-dark">
                    Get $25 in Leland credit
                  </span>
                  <span className="leland-paragraph-base text-leland-gray-light">
                    Complete a 15-minute call with our team
                  </span>
                </span>
                <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
              </a>
              <Button
                label="Return to course"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                onClick={() => handleOpenChange(false)}
              />
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export const SectionFeedbackModal = withModal(SectionFeedbackModalImpl);
