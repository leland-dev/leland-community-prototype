type Tone = "primary" | "secondary";
type Size = "sm" | "md";

type ExternalActionButtonProps = {
  label: string;
  // External URLs and app deep-links (claude://, codex://) — a plain anchor,
  // not the router-aware Button/Link which would try to navigate internally.
  href: string;
  tone?: Tone;
  size?: Size;
  onClick?: () => void;
};

const TONE_CLASSES: Record<Tone, string> = {
  primary:
    "border-transparent bg-leland-primary text-leland-on-primary-text hover:bg-leland-primary-hover",
  secondary:
    "border-leland-gray-stroke bg-white text-leland-gray-dark hover:bg-leland-gray-hover",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-2 text-[0.75rem]",
  md: "px-4 py-3 text-[0.875rem]",
};

export function ExternalActionButton({
  label,
  href,
  tone = "primary",
  size = "md",
  onClick,
}: ExternalActionButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border font-medium leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-gray-dark ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]}`}
    >
      {label}
    </a>
  );
}
