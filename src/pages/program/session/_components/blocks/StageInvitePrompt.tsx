import { useEffect } from "react";
import { Button } from "../../../../../components/Button";
import type { Coach } from "../../_types";

// Centered prompt that appears over the video when the coach (or stage
// moderator) calls a hand-raiser up. Backdrop dims the video so the
// decision feels clearly distinct from passive watching. ESC dismisses.

type Props = {
  coach: Coach;
  onAccept: () => void;
  onDecline: () => void;
};

export default function StageInvitePrompt({ coach, onAccept, onDecline }: Props) {
  // ESC to decline (matches typical modal behavior).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDecline();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onDecline]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 backdrop-blur-sm">
      <div className="w-[360px] max-w-[90%] rounded-2xl bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3">
          <img
            src={coach.avatarUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
            style={{ objectPosition: "50% 15%" }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#038561]">
              Invitation to stage
            </div>
            <div className="mt-0.5 text-[15px] font-semibold leading-tight text-gray-dark">
              {coach.name} wants to bring you up
            </div>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-snug text-gray-light">
          You'll be unmuted and visible to everyone watching. Step down any time.
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={onDecline}>
            Not now
          </Button>
          <Button size="sm" variant="primary" onClick={onAccept}>
            Join stage
          </Button>
        </div>
      </div>
    </div>
  );
}
