import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  Modal,
  ModalContent,
  ModalSize,
  Rating,
  RatingSize,
  withModal,
  type ModalProps,
} from "./leland";

type Thumb = "yes" | "no";

const THUMBS: { id: Thumb; emoji: string; label: string }[] = [
  { id: "no", emoji: "👎", label: "No" },
  { id: "yes", emoji: "👍", label: "Yes" },
];

const CourseFeedbackModalImpl = ({
  open,
  onOpenChange,
}: ModalProps) => {
  const [thumb, setThumb] = useState<Thumb | null>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setThumb(null);
      setRating(0);
      setText("");
    }
    onOpenChange?.(next);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL}>
        <div className="flex flex-col gap-5 p-6 md:p-8">
          <h2 className="leland-heading-3xl font-semibold text-leland-gray-dark pr-8">
            Was this lesson helpful?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {THUMBS.map(({ id, emoji, label }) => {
              const selected = thumb === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setThumb(id)}
                  className={`flex flex-col items-center gap-2 rounded-xl py-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
                    selected
                      ? "border-2 border-leland-gray-dark bg-white"
                      : "border border-leland-gray-stroke bg-white hover:bg-leland-gray-hover"
                  }`}
                >
                  <span className="text-4xl leading-none">{emoji}</span>
                  <span className="leland-heading-base font-semibold text-leland-gray-dark">{label}</span>
                </button>
              );
            })}
          </div>
          {thumb !== null && (
            <>
              {thumb === "yes" && (
                <div className="flex flex-col gap-2">
                  <p className="leland-paragraph-base text-leland-gray-dark">How many stars would you give it?</p>
                  <Rating
                    rate={rating}
                    hoverable
                    size={RatingSize.LARGE}
                    onSaveRating={setRating}
                  />
                </div>
              )}
              {(thumb === "no" || rating > 0) && (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={thumb === "no" ? "What wasn't helpful?" : "Share your thoughts"}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                />
              )}
              <Button
                label="Submit"
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                rounded
                width={ButtonWidth.FULL}
                onClick={() => handleOpenChange(false)}
              />
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export const CourseFeedbackModal = withModal(CourseFeedbackModalImpl);
