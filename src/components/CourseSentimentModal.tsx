import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconCheck,
  IconChevronRight,
  IconMoney,
  IconHeartLoveEmphasis,
  IconThumbsDown,
  IconThumbsUpPlain,
  Modal,
  ModalContent,
  ModalSize,
  withModal,
  type ModalProps,
} from "./leland";

type Sentiment = "notGreat" | "likeIt" | "loveIt";

const SENTIMENTS: { id: Sentiment; label: string; Icon: typeof IconThumbsDown }[] = [
  { id: "notGreat", label: "Not great", Icon: IconThumbsDown },
  { id: "likeIt", label: "Like it", Icon: IconThumbsUpPlain },
  { id: "loveIt", label: "Love it", Icon: IconHeartLoveEmphasis },
];

const FORM_COPY: Record<"notGreat" | "loveIt", { heading: string; subtext: string }> = {
  loveIt: {
    heading: "What should we keep doing?",
    subtext: "Your feedback helps us know what's working",
  },
  notGreat: {
    heading: "Help us improve this course",
    subtext: "What's not working — pace, level, format, anything.",
  },
};

// Course-level sentiment check-in — distinct from the per-section "Was this
// helpful?" flow. Triggered once, partway through the course (see
// ContentViewer's trigger effect), not tied to any single section.
const CourseSentimentModalImpl = ({ open, onOpenChange }: ModalProps) => {
  const [step, setStep] = useState<"pick" | "form" | "thanks">("pick");
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [text, setText] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStep("pick");
      setSentiment(null);
      setText("");
    }
    onOpenChange?.(next);
  };

  const pickSentiment = (id: Sentiment) => {
    setSentiment(id);
    setStep(id === "likeIt" ? "thanks" : "form");
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} className="md:h-[560px]">
        {step === "pick" ? (
          <div className="flex h-full flex-col justify-center p-6 md:p-8">
            <div className="mx-auto flex w-full max-w-[420px] flex-col gap-8">
              <h2 className="text-center text-heading-3xl font-season font-normal text-leland-gray-dark">
                How's the course so far?
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {SENTIMENTS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => pickSentiment(id)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-leland-gray-stroke bg-white py-5 transition-colors hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                  >
                    <Icon className="size-6 text-leland-gray-dark" />
                    <span className="leland-paragraph-base font-medium text-leland-gray-dark">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : step === "form" && sentiment && sentiment !== "likeIt" ? (
          <div className="flex h-full flex-col p-6 md:p-8">
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-col gap-2 pr-8">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  {FORM_COPY[sentiment].heading}
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  {FORM_COPY[sentiment].subtext}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="course-sentiment-text" className="leland-paragraph-base text-leland-gray-dark">
                  Optional feedback
                </label>
                <textarea
                  id="course-sentiment-text"
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
              <div className="flex flex-col gap-2">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  Thank you!
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  We appreciate your feedback
                </p>
              </div>
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

export const CourseSentimentModal = withModal(CourseSentimentModalImpl);
