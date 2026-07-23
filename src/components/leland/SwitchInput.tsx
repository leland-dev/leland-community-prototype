import { useId } from "react";

export interface SwitchInputProps {
  label: string;
  isChecked: boolean;
  onToggle: (newValue: boolean) => void;
}

export function SwitchInput({ label, isChecked, onToggle }: SwitchInputProps) {
  const labelKey = useId();
  return (
    <div
      className="flex w-full cursor-pointer items-center"
      role="switch"
      aria-checked={isChecked}
      aria-labelledby={labelKey}
      tabIndex={0}
      onClick={() => onToggle(!isChecked)}
      onKeyUp={(e) => { if (e.key === " ") onToggle(!isChecked); }}
    >
      <div
        className={`relative mr-2 h-6 w-11 shrink-0 rounded-full transition-colors ${
          isChecked ? "bg-leland-gray-dark" : "bg-leland-gray-stroke"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-all ${
            isChecked ? "translate-x-full" : ""
          }`}
        />
      </div>
      <span
        id={labelKey}
        className="select-none leland-paragraph-base font-medium text-leland-gray-dark"
      >
        {label}
      </span>
    </div>
  );
}
