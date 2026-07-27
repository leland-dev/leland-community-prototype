import { useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  Modal,
  ModalContent,
  ModalSize,
  withModal,
  type ModalProps,
} from "../../leland";
import { ExternalActionButton } from "../flow-kit";

interface ConfirmSetupModalProps extends ModalProps {
  header: string;
  desc: string;
  actionLabel: string;
  actionHref: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCantDoIt: () => void;
}

// The shared "negative card" modal for plan / app-install / cohort. Two buttons:
// the top one starts as the link to go do the thing, then swaps in place to the
// "done" confirmation once clicked; the bottom records the negative answer.
// withModal unmounts this when closed, so linkClicked resets on reopen.
const ConfirmSetupModalImpl = ({
  open,
  onOpenChange,
  header,
  desc,
  actionLabel,
  actionHref,
  confirmLabel,
  onConfirm,
  onCantDoIt,
}: ConfirmSetupModalProps) => {
  const [linkClicked, setLinkClicked] = useState(false);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size={ModalSize.SMALL} header={header}>
        <div className="flex flex-col gap-4 p-6">
          <p className="leland-paragraph-base text-leland-gray-light">{desc}</p>
          <div className="flex flex-col gap-3">
            {linkClicked ? (
              <Button
                label={confirmLabel}
                buttonColor={ButtonColor.PRIMARY}
                size={ButtonSize.LARGE}
                width={ButtonWidth.FULL}
                onClick={onConfirm}
              />
            ) : (
              <span className="[&>a]:w-full">
                <ExternalActionButton
                  label={actionLabel}
                  href={actionHref}
                  tone="primary"
                  onClick={() => setLinkClicked(true)}
                />
              </span>
            )}
            <Button
              label="I can't do this right now"
              buttonColor={ButtonColor.WHITE}
              size={ButtonSize.LARGE}
              width={ButtonWidth.FULL}
              onClick={onCantDoIt}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export const ConfirmSetupModal = withModal(ConfirmSetupModalImpl);
