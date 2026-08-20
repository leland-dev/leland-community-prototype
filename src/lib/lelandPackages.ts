// Leland-standardized packages — pre-built offerings authored by Leland that a
// coach can toggle on/off for a category. Unlike custom offerings, the coach
// can't change the content (title, structure, deliverables); they can only
// choose whether to offer it and adjust the price — either synced to their
// hourly rate or set manually per package size.
import compPkgCover from "../assets/placeholder images/offering-images/6a47d9ac398d8afe96319817.avif";
import caseInterviewCover from "../assets/placeholder images/offering-images/6a499011e7b7966f939ef6f6.avif";
import resumeCover from "../assets/placeholder images/offering-images/6a47db26e7b7966f939eee7a.avif";
import fitInterviewCover from "../assets/placeholder images/offering-images/6a47dc2bb0982d533096264a.avif";
import networkingCover from "../assets/placeholder images/placeholder-event-02.png";
import negotiationCover from "../assets/placeholder images/placeholder-event-03.png";

// A single purchasable size of a package (e.g. "Lite · 5h"). `price` is Leland's
// recommended price in whole dollars.
export type PackageTier = { name: string; hours: string; price: number };

export type LelandPackage = {
  slug: string;
  title: string;
  headline: string;
  // Short hours range shown wherever the package is summarized (e.g. "5h–10h").
  hoursLabel: string;
  tiers: PackageTier[];
  image: string;
  // Whether the coach is currently offering this package.
  offered: boolean;
};

export const LELAND_PACKAGES: LelandPackage[] = [
  {
    slug: "comprehensive-consulting-package",
    title: "Comprehensive Consulting Recruiting Package — Land Your Dream Firm",
    headline: "End-to-end recruiting support, from firm strategy through final offer.",
    hoursLabel: "20h–60h",
    tiers: [
      { name: "Lite", hours: "20h", price: 6000 },
      { name: "Standard", hours: "40h", price: 10000 },
      { name: "Full", hours: "60h", price: 14000 },
    ],
    image: compPkgCover,
    offered: true,
  },
  {
    slug: "master-the-case-interview",
    title: "Master the Case Interview",
    headline: "Drill frameworks and mock cases until they're second nature.",
    hoursLabel: "5h–10h",
    tiers: [
      { name: "Lite", hours: "5h", price: 1960 },
      { name: "Recommended", hours: "10h", price: 3850 },
    ],
    image: caseInterviewCover,
    offered: true,
  },
  {
    slug: "standout-consulting-resume",
    title: "Craft a Standout Consulting Resume",
    headline: "Frame your impact into a resume that clears the screen.",
    hoursLabel: "3h–5h",
    tiers: [
      { name: "Lite", hours: "3h", price: 1185 },
      { name: "Recommended", hours: "5h", price: 1960 },
    ],
    image: resumeCover,
    offered: false,
  },
  {
    slug: "behavioral-fit-interview-prep",
    title: "Behavioral & Fit Interview Prep",
    headline: "Sharpen your stories for the personal experience interview.",
    hoursLabel: "3h–5h",
    tiers: [
      { name: "Lite", hours: "3h", price: 1185 },
      { name: "Recommended", hours: "5h", price: 1960 },
    ],
    image: fitInterviewCover,
    offered: false,
  },
  {
    slug: "networking-referral-strategy",
    title: "Networking & Referral Strategy",
    headline: "Build the connections that turn into interview invites.",
    hoursLabel: "2h–4h",
    tiers: [
      { name: "Lite", hours: "2h", price: 780 },
      { name: "Recommended", hours: "4h", price: 1560 },
    ],
    image: networkingCover,
    offered: false,
  },
  {
    slug: "final-offer-negotiation",
    title: "Final Offer Negotiation",
    headline: "Walk into the offer conversation with a clear plan.",
    hoursLabel: "2h–3h",
    tiers: [
      { name: "Lite", hours: "2h", price: 600 },
      { name: "Recommended", hours: "3h", price: 1100 },
    ],
    image: negotiationCover,
    offered: false,
  },
];

// Format a whole-dollar amount as "$1,960".
export function fmtPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
