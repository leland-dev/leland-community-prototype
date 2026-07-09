import { Check } from "lucide-react";
import { Button } from "../../../components/Button";

/* Shared presentational primitives for the member flow (screens 2–8). */

/** Sharp, pointed 5-point star (matches the production homepage IconStar look —
 *  more angular than lucide's rounded star). Color via text-* (currentColor). */
export function SharpStar({
  className = "",
  size = 15,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 1.8l2.95 6.36 6.95.72-5.2 4.66 1.46 6.86L12 17.9l-6.16 3.5 1.46-6.86-5.2-4.66 6.95-.72z" />
    </svg>
  );
}

export function StepHeading({
  title,
  subtitle,
}: {
  /** eyebrow accepted for back-compat but no longer rendered */
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-[28px] leading-[1.12] text-gray-dark md:text-[32px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-[15px] leading-relaxed text-gray-light">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function OptionCard({
  label,
  sublabel,
  selected,
  multi,
  onClick,
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
}) {
  // `multi` no longer changes the visual — selection reads via border + check.
  void multi;
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-all ${
        selected
          ? "border-gray-dark bg-white shadow-card"
          : "border-transparent bg-[#f4f4f5] hover:bg-[#ececee]"
      }`}
    >
      <div className="min-w-0">
        <p className="text-[16px] font-medium text-gray-dark">{label}</p>
        {sublabel ? (
          <p className="mt-0.5 text-[13px] text-gray-light">{sublabel}</p>
        ) : null}
      </div>
      {selected ? (
        <Check size={19} strokeWidth={2.5} className="shrink-0 text-gray-dark" />
      ) : null}
    </button>
  );
}

export type ChoiceOption = { value: string; label: string; sublabel?: string };

export function ChoiceScreen({
  eyebrow,
  title,
  subtitle,
  options,
  multiSelect,
  selectedValues,
  onPick,
  onContinue,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  options: ChoiceOption[];
  multiSelect?: boolean;
  selectedValues: string[];
  onPick: (value: string) => void;
  onContinue?: () => void;
}) {
  return (
    <div className="flex flex-col">
      <StepHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="flex flex-col gap-2.5">
        {options.map((o) => (
          <OptionCard
            key={o.value}
            label={o.label}
            sublabel={o.sublabel}
            selected={selectedValues.includes(o.value)}
            multi={multiSelect}
            onClick={() => onPick(o.value)}
          />
        ))}
      </div>
      {multiSelect ? (
        <div className="mt-6">
          <Button
            variant="dark"
            size="lg"
            className="w-full"
            disabled={selectedValues.length === 0}
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      ) : null}
    </div>
  );
}
