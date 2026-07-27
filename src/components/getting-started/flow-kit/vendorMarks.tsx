// Brand + service glyphs for the getting-started flows, ported from the
// standalone prototypes' inline SVG. Kept as small presentational components so
// the vendor picker and connector rows can share them.
import type { VendorKey } from "../it-setup/data";

export function VendorMark({ vendor }: { vendor: VendorKey }) {
  if (vendor === "claude") {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x="9"
            y="2"
            width="2"
            height="7"
            rx="1"
            fill="#fff"
            transform={`rotate(${i * 45} 10 10)`}
          />
        ))}
      </svg>
    );
  }
  if (vendor === "chatgpt") {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse
            key={i}
            cx="10"
            cy="5.6"
            rx="2.4"
            ry="3.8"
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
            transform={`rotate(${i * 60} 10 10)`}
          />
        ))}
      </svg>
    );
  }
  if (vendor === "copilot") {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
        <rect x="2" y="2" width="7" height="7" fill="#F25022" />
        <rect x="11" y="2" width="7" height="7" fill="#7FBA00" />
        <rect x="2" y="11" width="7" height="7" fill="#00A4EF" />
        <rect x="11" y="11" width="7" height="7" fill="#FFB900" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <defs>
        <linearGradient id="gemgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#EA4C89" />
        </linearGradient>
      </defs>
      <path
        d="M10 1 C10 7 13 10 19 10 C13 10 10 13 10 19 C10 13 7 10 1 10 C7 10 10 7 10 1 Z"
        fill="url(#gemgrad)"
      />
    </svg>
  );
}

const VENDOR_BADGE_BG: Record<VendorKey, string> = {
  claude: "#D97757",
  chatgpt: "#000000",
  copilot: "#FFFFFF",
  gemini: "#FFFFFF",
};

export function VendorBadge({ vendor }: { vendor: VendorKey }) {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-leland-gray-stroke"
      style={{ background: VENDOR_BADGE_BG[vendor] }}
    >
      <VendorMark vendor={vendor} />
    </div>
  );
}

export function SlackMark() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
      <rect x="7.3" y="0.5" width="2.6" height="8" rx="1.3" fill="#fff" />
      <rect x="0.5" y="7.4" width="8" height="2.6" rx="1.3" fill="#fff" />
      <rect x="10.1" y="11.5" width="2.6" height="8" rx="1.3" fill="#fff" />
      <rect x="11.5" y="10.1" width="8" height="2.6" rx="1.3" fill="#fff" />
    </svg>
  );
}

export function EmailMark() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
      <rect x="1.5" y="4.5" width="17" height="12" rx="2" fill="#fff" stroke="#5F6368" strokeWidth="1.3" />
      <path d="M2.2 5.3 L10 11.3 L17.8 5.3" fill="none" stroke="#5F6368" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarMark() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
      <rect x="2" y="3" width="16" height="15" rx="2" fill="#fff" stroke="#DADCE0" strokeWidth="1" />
      <path d="M2 6 a2 2 0 0 1 2 -2 h12 a2 2 0 0 1 2 2 v1.5 H2 Z" fill="#4285F4" />
      <line x1="6" y1="1.3" x2="6" y2="4.5" stroke="#4285F4" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="14" y1="1.3" x2="14" y2="4.5" stroke="#4285F4" strokeWidth="1.6" strokeLinecap="round" />
      <text x="10" y="14.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#3C4043" fontFamily="Macan, sans-serif">17</text>
    </svg>
  );
}

export function ServiceBadge({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-leland-gray-stroke bg-white"
      style={bg ? { background: bg } : undefined}
    >
      {children}
    </div>
  );
}
