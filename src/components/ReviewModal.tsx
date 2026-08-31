import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconChat,
  IconCheck,
  IconChevronRight,
  Modal,
  ModalContent,
  ModalSize,
  Rating,
  RatingSize,
  withModal,
  type ModalProps,
} from "./leland";

// Public review-collection prompt — distinct from the internal feedback
// flows (SectionFeedbackModal / CourseSentimentModal). Triggered once, 80%
// through Lesson 1, after the learner has spent 10+ minutes on it. Every
// rating gets the same thank-you (no branching by star count — that's an
// FTC-regulated pattern we're deliberately avoiding).
const ReviewModalImpl = ({
  open,
  onOpenChange,
  onTalkToSupport,
}: ModalProps & { onTalkToSupport: () => void }) => {
  const [step, setStep] = useState<"rate" | "thanks">("rate");
  const [rating, setRating] = useState(0);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStep("rate");
      setRating(0);
    }
    onOpenChange?.(next);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} className="md:h-[560px]">
        {step === "rate" ? (
          <div className="flex h-full flex-col p-6 md:p-8">
            <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
              <div className="flex flex-col gap-2">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  Help us reach more people
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  Reviews help other learners understand what they'll get from this course
                </p>
              </div>
              <Rating
                rate={rating}
                hoverable
                size={RatingSize.LARGE}
                onSaveRating={(n) => {
                  setRating(n);
                  setStep("thanks");
                }}
              />
            </div>
            <div className="flex w-full flex-col gap-8">
              <button
                type="button"
                onClick={onTalkToSupport}
                className="flex w-full items-center gap-4 rounded-xl bg-leland-gray-hover px-5 py-4 text-left transition-colors hover:brightness-95"
              >
                <IconChat className="size-6 shrink-0 text-leland-gray-dark" />
                <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                  <span className="leland-paragraph-lg font-semibold! text-leland-gray-dark">
                    Having an issue or need help?
                  </span>
                  <span className="leland-paragraph-base text-leland-gray-light">Talk to support</span>
                </span>
                <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center p-6 text-center md:p-8">
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-leland-gray-hover">
                <IconCheck className="size-5 text-leland-gray-dark" />
              </span>
              <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                Your rating has been submitted
              </h2>
            </div>
            <div className="flex w-full flex-col gap-8">
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

export const ReviewModal = withModal(ReviewModalImpl);
