// Brand + service glyphs for the getting-started flows. Vendor logos are real
// brand assets (see VendorBadge); the connector marks below stay inline SVG.
import type { VendorKey } from "../it-setup/data";

const VENDOR_LOGO: Record<VendorKey, string> = {
  claude: "logo-claude.webp",
  chatgpt: "logo-chatgpt.jpg",
  copilot: "logo-copilot.jpg",
  gemini: "logo-gemini.webp",
};

export function VendorBadge({ vendor }: { vendor: VendorKey }) {
  return (
    <div className="size-9 shrink-0 overflow-hidden rounded-lg border border-leland-gray-stroke bg-white">
      <img
        src={`${import.meta.env.BASE_URL}${VENDOR_LOGO[vendor]}`}
        alt=""
        className="size-full object-cover"
      />
    </div>
  );
}

export function SlackMark() {
  return (
    <svg viewBox="0 0 127 127" width="18" height="18" aria-hidden>
      <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z" fill="#E01E5A" />
      <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z" fill="#36C5F0" />
      <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z" fill="#2EB67D" />
      <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z" fill="#ECB22E" />
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
