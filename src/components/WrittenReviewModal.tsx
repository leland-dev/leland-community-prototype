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
  Tag,
  TagColor,
  TagRounding,
  TagSize,
  withModal,
  type ModalProps,
} from "./leland";

// Written-review prompt shown on the course-completion page — distinct from
// the star-only ReviewModal. Shows the learner's existing star rating (if
// any) so they can adjust it here rather than re-opening that modal. Review
// body is optional; a title is required to submit.
const WrittenReviewModalImpl = ({
  open,
  onOpenChange,
  rating,
  onRatingChange,
}: ModalProps & {
  rating?: number;
  onRatingChange?: (rating: number) => void;
}) => {
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setBody("");
      setTitle("");
    }
    onOpenChange?.(next);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} className="md:h-[600px]">
        <div className="flex h-full flex-col p-6 md:p-8">
          <div className="flex min-h-0 flex-1 flex-col gap-5">
            <div className="flex shrink-0 items-center gap-2 pr-8">
              <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                Review this course
              </h2>
              <Tag text="Optional" tagColor={TagColor.GRAY} size={TagSize.SMALL} rounding={TagRounding.SM} />
            </div>
            {rating ? (
              <div className="flex shrink-0 items-center gap-3">
                <span className="leland-paragraph-base text-leland-gray-dark">Your rating</span>
                <Rating
                  rate={rating}
                  hoverable
                  size={RatingSize.MEDIUM}
                  onSaveRating={(n) => onRatingChange?.(n)}
                />
              </div>
            ) : null}
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What do you want others to know about this course?"
                className="w-full flex-1 resize-none rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              />
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <label htmlFor="written-review-title" className="leland-paragraph-base text-leland-gray-dark">
                Title your review <span className="text-leland-gray-light">· Required</span>
              </label>
              <input
                id="written-review-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write a short headline"
                className="w-full rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              />
            </div>
          </div>
          <div className="pt-6">
            <Button
              label="Submit review"
              buttonColor={ButtonColor.PRIMARY}
              size={ButtonSize.LARGE}
              rounded
              width={ButtonWidth.FULL}
              disabled={title.trim() === ""}
              onClick={() => handleOpenChange(false)}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export const WrittenReviewModal = withModal(WrittenReviewModalImpl);
