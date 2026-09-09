import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconLock,
  Modal,
  ModalContent,
  ModalSize,
  withModal,
  type ModalProps,
} from "./leland";

const PROGRAM_MARKETING_URL = "https://www.leland.ai/program";

// Hard paywall for anyone without course access — no close button and the
// overlay/Escape won't dismiss it either, since "purchase" or "learn more"
// are meant to be the only ways out.
const NoAccessModalImpl = ({ open, onOpenChange, purchaseHref }: ModalProps & { purchaseHref: string }) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size={ModalSize.SMALL} hideCloseButton preventCloseOnOverlayClick className="sm:h-[560px]">
        <div className="flex h-full flex-col p-6 md:p-8">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-leland-gray-hover">
              <IconLock className="size-5 text-leland-gray-dark" />
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                You don't have access
              </h2>
              <p className="leland-paragraph-lg text-leland-gray-light">
                Purchase the AI Builder Program.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button
              label="Purchase"
              buttonColor={ButtonColor.PRIMARY}
              size={ButtonSize.LARGE}
              rounded
              width={ButtonWidth.FULL}
              href={purchaseHref}
            />
            <Button
              label="Learn more"
              buttonColor={ButtonColor.WHITE}
              size={ButtonSize.LARGE}
              rounded
              width={ButtonWidth.FULL}
              href={PROGRAM_MARKETING_URL}
              openInNew
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export const NoAccessModal = withModal(NoAccessModalImpl);
