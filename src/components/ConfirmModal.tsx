import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./Button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
};

// Destructive-action confirmation dialog: serif title, muted body, a "Never
// mind" button and a red confirm button. Shared by any delete flow that
// deserves a deliberate second step before removing something.
export default function ConfirmModal({ open, title, body, confirmLabel, onConfirm, onClose }: ConfirmModalProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]"
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <h2 className="pr-10 font-serif text-[24px] leading-tight text-gray-dark">{title}</h2>
            <p className="mt-2 text-[15px] leading-[1.5] text-gray-light">{body}</p>
            <div className="mt-6 flex gap-3">
              <Button size="md" variant="secondary" onClick={onClose}>
                Never mind
              </Button>
              <Button size="md" variant="danger" onClick={onConfirm} className="font-semibold">
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
