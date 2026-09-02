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

const FOLLOW_UP_COPY: Record<"improve" | "keepDoing", { heading: string; subtext: string }> = {
  keepDoing: {
    heading: "What should we keep doing?",
    subtext: "Your feedback helps us know what's working",
  },
  improve: {
    heading: "Help us improve this course",
    subtext: "What's not working — pace, level, format, anything.",
  },
};

// Public review-collection prompt — distinct from the internal feedback flow
// (SectionFeedbackModal). Triggered once, 80% through Lesson 1, after the
// learner has spent 10+ minutes on it, and again (in "ratingOnly" mode) on
// the course-completion page for anyone who hasn't rated yet. The star
// rating itself is submitted as-is regardless of the follow-up shown next —
// we're not gating which ratings get collected, only which prompt asks for
// more detail.
const TENSE_HEADING: Record<"enjoying" | "enjoyed", string> = {
  enjoying: "Enjoying this course?",
  enjoyed: "Enjoyed this course?",
};

const ReviewModalImpl = ({
  open,
  onOpenChange,
  onTalkToSupport,
  mode = "full",
  onRated,
  tense = "enjoying",
}: ModalProps & {
  onTalkToSupport: () => void;
  // "full": rate, then an improve/keep-doing follow-up form, then thanks.
  // "ratingOnly": rate, then hand off to onRated — used on the completion
  // page, which chains into the written-review modal instead.
  mode?: "full" | "ratingOnly";
  onRated?: (rating: number) => void;
  // "enjoying" mid-course (Lesson 1 trigger); "enjoyed" once the course is
  // actually over (completion-page trigger).
  tense?: "enjoying" | "enjoyed";
}) => {
  const [step, setStep] = useState<"rate" | "form" | "thanks">("rate");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const followUp: "improve" | "keepDoing" = rating <= 3 ? "improve" : "keepDoing";

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStep("rate");
      setRating(0);
      setText("");
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
                  {TENSE_HEADING[tense]}
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  Help us reach more people
                </p>
              </div>
              <Rating
                rate={rating}
                hoverable
                size={RatingSize.LARGE}
                onSaveRating={(n) => {
                  setRating(n);
                  onRated?.(n);
                  if (mode !== "ratingOnly") setStep("form");
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
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="leland-paragraph-lg font-semibold! text-leland-gray-dark">
                    Having an issue or need help?
                  </span>
                  <span className="leland-paragraph-base text-leland-gray-light">Talk to support</span>
                </span>
                <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
              </button>
            </div>
          </div>
        ) : step === "form" ? (
          <div className="flex h-full flex-col p-6 md:p-8">
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-col gap-2 pr-8">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  {FOLLOW_UP_COPY[followUp].heading}
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  {FOLLOW_UP_COPY[followUp].subtext}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="review-follow-up-text" className="leland-paragraph-base text-leland-gray-dark">
                  Optional feedback
                </label>
                <textarea
                  id="review-follow-up-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full flex-1 resize-none rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                />
              </div>
            </div>
            <div className="pt-8">
              <Button
                label="Submit feedback"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
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
