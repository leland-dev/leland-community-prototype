import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Bell, MessageSquare } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
 * NotifyStep (v4) — "Be the first to know when the doors open."
 * SMS + push arrive pre-toggled ON; turning one off gets an are-you-sure
 * moment (your spot goes to the next person in line). Confirming keeps the
 * opt-in framing: you're not enabling notifications, you're keeping them.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-yellow" : "bg-[#d9d9d9]"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}`}
      />
    </button>
  );
}

export default function NotifyStep({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(true);
  // which channel is being confirmed off, if any
  const [confirming, setConfirming] = useState<"sms" | "push" | null>(null);

  const tryToggle = (which: "sms" | "push") => {
    const on = which === "sms" ? sms : push;
    if (on) setConfirming(which); // turning off requires the are-you-sure
    else which === "sms" ? setSms(true) : setPush(true);
  };
  const confirmOff = () => {
    if (confirming === "sms") setSms(false);
    if (confirming === "push") setPush(false);
    setConfirming(null);
  };

  const done = async () => {
    if (push) {
      try {
        if ("Notification" in window && Notification.permission === "default") {
          await Notification.requestPermission();
        }
      } catch {
        /* unsupported */
      }
    }
    onDone();
  };

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASE },
  });

  return (
    <div className="relative flex h-full flex-col px-6 pb-8 pt-4">
      <div className="flex flex-1 flex-col items-center justify-center pb-6 text-center">
        <motion.span
          initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduced ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 12 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow"
        >
          <Bell size={34} strokeWidth={1.8} className="text-gray-dark" />
        </motion.span>
        <motion.h1
          {...rise(0.2)}
          className="mt-6 max-w-[16ch] text-balance font-serif text-[32px] leading-[1.1] text-gray-dark"
        >
          Be the first to know when the doors open
        </motion.h1>
        <motion.p {...rise(0.35)} className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-gray-light">
          We're actively filling up the community right now. We'll send you a notification when it's ready.
        </motion.p>

        <motion.div {...rise(0.5)} className="mt-8 w-full">
          <div className="flex flex-col divide-y divide-gray-stroke rounded-2xl border border-gray-stroke bg-white">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <MessageSquare size={20} strokeWidth={1.9} className="shrink-0 text-gray-dark" />
              <span className="min-w-0 flex-1 text-left text-[15px] font-medium text-gray-dark">Text me</span>
              <Toggle on={sms} onClick={() => tryToggle("sms")} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Bell size={20} strokeWidth={1.9} className="shrink-0 text-gray-dark" />
              <span className="min-w-0 flex-1 text-left text-[15px] font-medium text-gray-dark">Push notifications</span>
              <Toggle on={push} onClick={() => tryToggle("push")} />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div {...rise(0.65)}>
        <button
          onClick={done}
          className="flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
        >
          {sms || push ? "Notify me" : "Continue"}
        </button>
      </motion.div>

      {/* are-you-sure — your spot is on the line */}
      <AnimatePresence>
        {confirming ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[90] flex items-center justify-center bg-black/40 px-8"
            onClick={() => setConfirming(null)}
          >
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[320px] rounded-2xl bg-white p-5 text-center shadow-2xl"
            >
              <p className="font-serif text-[20px] leading-tight text-gray-dark">Are you sure?</p>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-light">
                If we can't reach you when the doors open, your spot goes to the next person in line.
              </p>
              <button
                onClick={() => setConfirming(null)}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-gray-dark text-[14.5px] font-medium text-white transition-colors hover:bg-[#333]"
              >
                Keep me notified
              </button>
              <button
                onClick={confirmOff}
                className="mt-1.5 flex h-10 w-full items-center justify-center text-[13.5px] font-medium text-gray-light transition-colors hover:text-gray-dark"
              >
                Turn off anyway
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
