import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconLock,
  IconX,
} from "./leland";

// Full-screen, undismissable paywall for anyone without course access — a
// plain fixed overlay rather than a Modal/Dialog, since it needs to cover
// the entire viewport (including the header/nav) rather than float as a
// card. The small exit button in the corner exists only for this prototype
// so we can get back to the course viewer; the real product has no way out
// except purchasing.
export function NoAccessModal({
  open,
  onDismiss,
  purchaseHref,
  courseDescription,
}: {
  open: boolean;
  onDismiss: () => void;
  purchaseHref: string;
  courseDescription: string;
}) {
  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-modal flex items-center justify-center bg-white p-6">
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Exit paywall (prototype only)"
        className="fixed bottom-4 left-4 flex items-center justify-center rounded-full border border-leland-gray-stroke bg-white p-2.5 text-leland-gray-light shadow-sm hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
      >
        <IconX className="size-4" />
      </button>
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
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
        <div className="mt-4 rounded-xl bg-leland-gray-hover p-5">
          <p className="leland-paragraph-base text-leland-gray-light">{courseDescription}</p>
        </div>
        <div className="mt-4 flex w-full flex-col items-center gap-3">
          <Button
            label="Get access"
            buttonColor={ButtonColor.PRIMARY}
            size={ButtonSize.LARGE}
            rounded
            width={ButtonWidth.FULL}
            href={purchaseHref}
          />
        </div>
        <p className="leland-paragraph-base text-leland-gray-light">
          Already have access?{" "}
          <button
            type="button"
            // Stand-in for a real sign-in flow, which doesn't exist in this
            // prototype — dismisses the paywall as if the learner had just
            // signed into an account that already has access.
            onClick={onDismiss}
            className="font-semibold text-leland-gray-dark underline decoration-dotted underline-offset-4 hover:text-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
