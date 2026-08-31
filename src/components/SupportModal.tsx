import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconCalendar,
  IconCheck,
  IconChevronRight,
  IconMoney,
  Modal,
  ModalContent,
  ModalSize,
  withModal,
  type ModalProps,
} from "./leland";

type SupportPath = "stuck" | "issue";

const OFFICE_HOURS_HREF = "https://calendly.com/bootcamps-joinleland/ai-builder-program-office-hours";

// General "get help" entry point — separate from the per-section/course
// feedback flows. "I'm stuck" routes to a direct message + office-hours
// signup; "Feedback or product issue" routes to the same course-improvement
// form/incentive used elsewhere.
const SupportModalImpl = ({ open, onOpenChange }: ModalProps) => {
  const [step, setStep] = useState<"pick" | "message" | "feedback" | "thanks">("pick");
  const [path, setPath] = useState<SupportPath | null>(null);
  const [text, setText] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStep("pick");
      setPath(null);
      setText("");
    }
    onOpenChange?.(next);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} className="md:h-[560px]">
        {step === "pick" ? (
          <div className="flex h-full flex-col p-6 md:p-8">
            <div className="flex flex-1 flex-col gap-8">
              <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                How can we help?
              </h2>
              <div className="flex flex-col gap-3">
                {(
                  [
                    {
                      id: "stuck",
                      label: "I'm stuck on something",
                      subtext: "Message support or sign up for office hours",
                    },
                    {
                      id: "issue",
                      label: "Feedback or product issue",
                      subtext: "Describe what's not working for you or schedule a chat",
                    },
                  ] as const
                ).map((option) => {
                  const selected = path === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPath(option.id)}
                      className={`flex w-full items-center gap-3 rounded-lg p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                        selected
                          ? "border-[1.5px] border-leland-gray-dark bg-white"
                          : "border border-leland-gray-stroke bg-white hover:bg-leland-gray-hover"
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="leland-paragraph-lg font-medium text-leland-gray-dark">
                          {option.label}
                        </span>
                        <span className="leland-paragraph-base text-leland-gray-light">
                          {option.subtext}
                        </span>
                      </div>
                      <div
                        className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-leland-gray-dark" : "border-leland-gray-stroke"}`}
                      >
                        {selected ? <div className="size-2 rounded-full bg-leland-gray-dark" /> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="pt-8">
              <Button
                label="Submit feedback"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                disabled={path === null}
                onClick={() => setStep(path === "stuck" ? "message" : "feedback")}
              />
            </div>
          </div>
        ) : step === "message" ? (
          <div className="flex h-full flex-col p-6 md:p-8">
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-col gap-2 pr-8">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  Message support
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  Describe what you need help with, and someone will get back to you as quickly as possible.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full flex-1 resize-none rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                />
              </div>
              <a
                href={OFFICE_HOURS_HREF}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-4 rounded-xl bg-leland-gray-hover px-5 py-4 text-left transition-colors hover:brightness-95"
              >
                <IconCalendar className="size-6 shrink-0 text-leland-gray-dark" />
                <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                  <span className="leland-paragraph-lg font-semibold! text-leland-gray-dark">
                    Sign up for office hours
                  </span>
                  <span className="leland-paragraph-base text-leland-gray-light">Get live support</span>
                </span>
                <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
              </a>
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
        ) : step === "feedback" ? (
          <div className="flex h-full flex-col p-6 md:p-8">
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-col gap-2 pr-8">
                <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                  Help improve this course
                </h2>
                <p className="leland-paragraph-lg text-leland-gray-light">
                  What's not working — pace, level, format, anything.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full flex-1 resize-none rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                />
              </div>
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
                {path === "stuck" ? "Message sent" : "Thank you for your feedback"}
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

export const SupportModal = withModal(SupportModalImpl);
