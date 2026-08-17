// Delete for a task/routine/project row. Hover-revealed by default (stays in
// the DOM so it's always keyboard-reachable, just fades in on hover/focus) —
// right for a review context like goal detail, where deleting is a rare
// secondary action. Pass alwaysVisible where removing generated content is a
// primary, expected action (the new-goal draft) — hidden-until-hover reads as
// "not available" there.
export default function RowDelete({ onDelete, label, alwaysVisible = false }: { onDelete: () => void; label: string; alwaysVisible?: boolean }) {
  return (
    <button
      type="button"
      onClick={onDelete}
      aria-label={`Delete ${label}`}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-extra-light transition-[opacity,background-color,color] hover:bg-[#222222]/10 hover:text-[#9F5B34] focus-visible:opacity-100 ${
        alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}
