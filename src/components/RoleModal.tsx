import {
  Modal,
  ModalContent,
  ModalSize,
  type ModalProps,
} from "./leland";
import { ChipGroup } from "./PersonalizationModal";
import { CATEGORIES } from "../lib/categories";

// Header "role" chip's modal — sets the same shared selected category used
// on Program Hub (Recommended for you, Browse by use case) and the lesson
// build picker, so picking a role here carries over everywhere else, and
// vice versa.
const RoleModalImpl = ({
  open,
  onOpenChange,
  selectedCategory,
  onSelectCategory,
}: ModalProps & {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}) => {
  const handleSelect = (category: string) => {
    onSelectCategory(category);
    onOpenChange?.(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size={ModalSize.SMALL} className="md:h-[600px]">
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">Your role</h2>
            <p className="leland-paragraph-base text-leland-gray-light">
              This decides which build we show you in this course.
            </p>
          </div>

          <ChipGroup
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            selected={selectedCategory}
            onSelect={handleSelect}
          />
        </div>
      </ModalContent>
    </Modal>
  );
};

export const RoleModal = RoleModalImpl;
