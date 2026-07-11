// Ported from @leland/ui-library (components/modal) — the production Modal on
// @radix-ui/react-dialog with the withModal HOC pattern (parent owns the open
// state; deprecated ModalProvider/useControlledModalState not ported).
// Changes from the source: text-lg → 1rem and min-w-100 → 25rem (monorepo
// scale overrides); z-modal utility comes from styles/leland-theme.css.
import * as RdxDialog from "@radix-ui/react-dialog";
import { type FC, type PropsWithChildren, type ReactNode } from "react";

import { Button, ButtonSize } from "./Button";
import { IconX } from "./svg/icons";

export enum ModalSize {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
}

export enum ModalHeight {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  AUTO = "auto",
}

const ModalSizeToClass: Record<ModalSize, string> = {
  [ModalSize.SMALL]: "sm:max-w-lg",
  [ModalSize.MEDIUM]: "sm:max-w-2xl",
  [ModalSize.LARGE]: "sm:max-w-6xl",
};

const ModalHeightToClass: Record<ModalHeight, string> = {
  [ModalHeight.SMALL]: "sm:h-[650px]",
  [ModalHeight.MEDIUM]: "sm:h-[800px]",
  [ModalHeight.LARGE]: "sm:h-[90%]",
  [ModalHeight.AUTO]: "",
};

export type ModalProps = RdxDialog.DialogProps &
  Required<Pick<RdxDialog.DialogProps, "open" | "onOpenChange">>;

export const Modal: FC<ModalProps> = (props) => {
  return <RdxDialog.Root {...props} />;
};

/** HOC that resets the state of the component when it is closed and does not rerender any state before it is open */
export function withModal<T extends ModalProps>(Component: FC<T>) {
  return function ModalComponent(props: T) {
    if (!props.open) {
      return null;
    }

    return <Component {...props} />;
  };
}

export const ModalTrigger = RdxDialog.Trigger;
export const ModalClose = RdxDialog.Close;

export interface ModalContentProps {
  size?: ModalSize;
  height?: ModalHeight;
  header?: ReactNode;
  footer?: ReactNode;
  hideCloseButton?: boolean;
  preventCloseOnOverlayClick?: boolean;
  preventScroll?: boolean;
  /** Extra classes appended to the modal content root — use `md:!min-w-0` and a tighter `sm:!max-w-*` to override default sizing. */
  className?: string;
}

export const ModalContent: FC<PropsWithChildren<ModalContentProps>> = ({
  size = ModalSize.MEDIUM,
  height = ModalHeight.AUTO,
  header,
  footer,
  hideCloseButton,
  children,
  preventCloseOnOverlayClick,
  preventScroll,
  className,
}) => {
  const content = (
    <RdxDialog.Content
      className={`fixed inset-y-0 left-0 w-full bg-white sm:relative sm:max-h-[90vh] sm:rounded-2xl md:min-w-[25rem] ${ModalSizeToClass[size]} flex flex-col overflow-hidden ${ModalHeightToClass[height]} z-modal ${className ?? ""}`}
      onPointerDownOutside={
        preventCloseOnOverlayClick ? (e) => e.preventDefault() : undefined
      }
      onEscapeKeyDown={
        preventCloseOnOverlayClick ? (e) => e.preventDefault() : undefined
      }
      // The content isn't required to describe itself; opt out of Radix's
      // missing-`aria-describedby` warning rather than inventing a description.
      aria-describedby={undefined}
    >
      {header ? (
        <RdxDialog.Title asChild>
          <header className="relative flex min-h-12 w-full shrink-0 items-center justify-center border-b border-b-leland-gray-stroke px-6 pt-6 pb-4 text-[1rem] font-medium text-leland-gray-dark">
            {header}
          </header>
        </RdxDialog.Title>
      ) : (
        <RdxDialog.Title className="sr-only">Dialog</RdxDialog.Title>
      )}
      {hideCloseButton ? null : (
        <RdxDialog.Close className="absolute right-2 top-2" asChild>
          <span>
            <Button
              label="Close"
              hideLabel
              LeftIcon={IconX}
              size={ButtonSize.SMALL}
              rounded
            />
          </span>
        </RdxDialog.Close>
      )}
      <div
        className={`flex grow flex-col ${
          preventScroll ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        {children}
      </div>
      {footer ? (
        <footer className="shrink-0 border-t border-t-leland-gray-stroke p-4">
          {footer}
        </footer>
      ) : null}
    </RdxDialog.Content>
  );
  return (
    <RdxDialog.Portal>
      <RdxDialog.Overlay className="fixed left-0 top-0 flex size-full items-center justify-center bg-leland-gray-overlay px-8 py-[5%] z-modal">
        {content}
      </RdxDialog.Overlay>
    </RdxDialog.Portal>
  );
};
