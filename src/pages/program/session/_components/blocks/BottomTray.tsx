import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

// Slide-up bottom sheet for mobile. Height uses dvh so it adapts when the
// mobile keyboard opens — the sheet shrinks, the chat input stays just above
// the keyboard. Locks body scroll while open.
export default function BottomTray({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          // dvh = dynamic viewport height, shrinks with the mobile keyboard so
          // the sheet (and its input) stay visible above the keyboard.
          height: "85dvh",
          maxHeight: "720px",
        }}
      >
        {/* Drag handle */}
        <div className="flex shrink-0 justify-center pt-2.5 pb-1">
          <span className="h-1 w-10 rounded-full bg-gray-stroke" />
        </div>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-stroke px-4 py-3">
          <div className="text-[16px] font-medium text-gray-dark">{title ?? "Chat"}</div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </>
  );
}
