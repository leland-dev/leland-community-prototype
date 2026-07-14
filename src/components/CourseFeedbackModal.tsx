// Ported 1:1 from the monorepo course viewer
// (apps/customer/src/components/content/course/CourseFeedbackModal.client.tsx,
// feature/course-viewer branch) — imports adapted to the local leland kit.
import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconFlag,
  IconStar,
  Modal,
  ModalClose,
  ModalContent,
  ModalSize,
  Rating,
  RatingSize,
  withModal,
  type ModalProps,
} from "./leland";

type FeedbackType = "review" | "issue" | null;

interface CourseFeedbackModalProps extends ModalProps {
  currentEntryId: string;
  entries: Array<{ id: string; title: string }>;
}

const CourseFeedbackModalImpl = ({
  open,
  onOpenChange,
  currentEntryId,
  entries,
}: CourseFeedbackModalProps) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [rating, setRating] = useState(0);
  const [selectedEntryId, setSelectedEntryId] = useState(currentEntryId);
  const [text, setText] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setFeedbackType(null);
      setRating(0);
      setSelectedEntryId(currentEntryId);
      setText("");
    }
    onOpenChange?.(next);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} header="Share feedback">
        <div className="flex flex-col gap-4 p-6">
          {feedbackType === null ? (
            <>
              <p className="leland-paragraph-base text-leland-gray-light">
                What would you like to share?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setFeedbackType("review")}
                  className="flex items-center gap-3 rounded-lg bg-leland-beige px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary hover:bg-leland-gray-hover"
                >
                  <IconStar className="size-5 shrink-0 text-leland-gray-dark" />
                  <div>
                    <p className="leland-heading-lg text-leland-gray-dark">
                      Leave a review
                    </p>
                    <p className="leland-paragraph-base text-leland-gray-light">
                      Enjoying the course? Share what&apos;s working for you.
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setFeedbackType("issue")}
                  className="flex items-center gap-3 rounded-lg bg-leland-beige px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary hover:bg-leland-gray-hover"
                >
                  <IconFlag className="size-5 shrink-0 text-leland-gray-dark" />
                  <div>
                    <p className="leland-heading-lg text-leland-gray-dark">
                      Report an issue
                    </p>
                    <p className="leland-paragraph-base text-leland-gray-light">
                      Found something confusing or outdated? Let us know.
                    </p>
                  </div>
                </button>
              </div>
            </>
          ) : feedbackType === "review" ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <p className="leland-paragraph-base text-leland-gray-light">
                  How would you rate this course?
                </p>
                <Rating
                  rate={rating}
                  hoverable
                  size={RatingSize.LARGE}
                  onSaveRating={setRating}
                />
              </div>
              <div className="mt-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-leland-gray-stroke bg-white px-3 py-2 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                />
              </div>
              <ModalClose asChild>
                <span>
                  <Button
                    label="Submit"
                    buttonColor={ButtonColor.PRIMARY}
                    size={ButtonSize.LARGE}
                    rounded
                    width={ButtonWidth.FULL}
                  />
                </span>
              </ModalClose>
            </>
          ) : (
            <>
              <p className="leland-paragraph-base text-leland-gray-light">
                Which section has the issue?
              </p>
              <select
                value={selectedEntryId}
                onChange={(e) => setSelectedEntryId(e.target.value)}
                className="w-full rounded-lg border border-leland-gray-stroke bg-white pl-3 pr-8 py-2 leland-paragraph-base text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              >
                <option value="">This lesson generally</option>
                {entries.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.title}
                  </option>
                ))}
              </select>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe the issue (optional)"
                rows={4}
                className="w-full resize-none rounded-lg border border-leland-gray-stroke bg-white px-3 py-2 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              />
              <ModalClose asChild>
                <span>
                  <Button
                    label="Submit"
                    buttonColor={ButtonColor.PRIMARY}
                    size={ButtonSize.LARGE}
                    rounded
                    width={ButtonWidth.FULL}
                  />
                </span>
              </ModalClose>
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export const CourseFeedbackModal = withModal(CourseFeedbackModalImpl);
