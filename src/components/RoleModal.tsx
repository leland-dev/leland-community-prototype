import {
  Modal,
  ModalContent,
  ModalSize,
  type ModalProps,
} from "./leland";
import {
  ChipGroup,
  OtherTextField,
  PERSONALIZATION_KEY,
  ROLE_OPTIONS_BY_STATUS,
  useChipGroupWithOther,
  type PersonalizationData,
} from "./PersonalizationModal";

// Header "role" chip's modal — just the role question, for switching which
// role-specific build a learner sees. Separate from AboutMeEditModal, which
// covers the fuller status/role/industry profile elsewhere in the course.
const RoleModalImpl = ({
  open,
  onOpenChange,
  roleData,
  onSaveRole,
}: ModalProps & {
  roleData: PersonalizationData | null;
  onSaveRole: (data: PersonalizationData) => void;
}) => {
  const status = roleData?.status ?? "working";
  const roleOptions = status === "not_working" ? [] : ROLE_OPTIONS_BY_STATUS[status];

  const handleSelectRole = (nextRole: string) => {
    const data: PersonalizationData = {
      status: roleData?.status ?? "working",
      role: nextRole,
      roleTense: roleData?.roleTense ?? "current",
      industry: roleData?.industry ?? null,
      industryTense: roleData?.industryTense ?? "current",
      aiGoalText: roleData?.aiGoalText ?? "",
    };
    localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(data));
    onSaveRole(data);
  };

  const roleChip = useChipGroupWithOther(roleOptions, roleData?.role ?? null, handleSelectRole);

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

          <div className="flex flex-col gap-3">
            <ChipGroup options={roleOptions} selected={roleChip.selected} onSelect={roleChip.handleSelect} />
            {roleChip.isOther ? (
              <OtherTextField
                value={roleChip.otherText}
                onChange={roleChip.setOtherText}
                placeholder="e.g. Software Engineer"
                onSubmit={roleChip.submitOther}
              />
            ) : null}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export const RoleModal = RoleModalImpl;
