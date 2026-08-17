import { useEffect, useRef, useState } from "react";

// Click-to-edit text. Renders as plain text until clicked, then swaps to an
// input in place. Enter or blur commits, Escape reverts. Used for every
// renameable thing on a goal so editing works the same way everywhere.
type EditableTextProps = {
  value: string;
  onCommit: (next: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  label: string;
  // Blank commits are dropped by default — a nameless task is worse than the
  // old name. Set this for genuinely optional fields.
  allowEmpty?: boolean;
};

export default function EditableText({
  value,
  onCommit,
  className = "",
  inputClassName = "",
  placeholder,
  label,
  allowEmpty = false,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const start = () => {
    setDraft(value);
    setEditing(true);
  };

  const commit = () => {
    const next = draft.trim();
    setEditing(false);
    if (!next && !allowEmpty) return;
    if (next !== value) onCommit(next);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={start}
        aria-label={`Edit ${label}`}
        className={`rounded px-1 -mx-1 text-left transition-colors hover:bg-[#222222]/[0.06] ${className}`}
      >
        {value || <span className="text-[#949494]">{placeholder}</span>}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      autoFocus
      value={draft}
      placeholder={placeholder}
      aria-label={label}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") setEditing(false);
      }}
      className={`w-full rounded border-[1.5px] border-gray-dark bg-white px-1 -mx-1 outline-none ${className} ${inputClassName}`}
    />
  );
}
