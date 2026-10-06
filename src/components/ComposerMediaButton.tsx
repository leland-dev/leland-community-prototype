import type { MouseEvent, ReactNode } from "react";
import MaskIcon from "./MaskIcon";

// Shared media-attachment icon button used by every composer (feed "What's on
// your mind", the compose modal, and the post-detail reply box). Styled like the
// per-post action buttons (like/comment/repost) — a compact rounded-pill hit
// area — with a slightly larger icon.
//   tone      — resting color: "light" (gray-light) or "extra-light".
//   active    — force the dark/selected color (e.g. image button once an image
//               is attached).
export default function ComposerMediaButton({
  src,
  label,
  onClick,
  onMouseDown,
  active = false,
  tone = "light",
}: {
  src: string;
  label: string;
  onClick?: () => void;
  onMouseDown?: (e: MouseEvent) => void;
  active?: boolean;
  tone?: "light" | "extra-light";
}): ReactNode {
  const restColor = tone === "extra-light" ? "text-gray-extra-light" : "text-gray-light";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={`flex shrink-0 cursor-pointer items-center rounded-[100px] px-2.5 py-1.5 transition-colors hover:bg-[#222222]/8 ${active ? "text-gray-dark" : restColor}`}
    >
      <MaskIcon src={src} className="h-[22px] w-[22px]" />
    </button>
  );
}
