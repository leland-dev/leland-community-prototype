import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import ProfileCard, { type ProfileCardData } from "../components/ProfileCard";

import pic1 from "../assets/profile photos/pic-1.png";
import pic4 from "../assets/profile photos/pic-4.png";
import hbsLogo from "../assets/org-logos/hbs.png";
import bainLogo from "../assets/org-logos/bain.png";
import whartonLogo from "../assets/org-logos/wharton.png";

// ─── Variants ──────────────────────────────────────────

type Variant = "Client" | "Coach";

const variants: Variant[] = ["Client", "Coach"];

const cards: Record<Variant, { description: string; card: ProfileCardData }> = {
  Client: {
    description: "Shown in the left sidebar for a logged-in customer. Displays name, headline, follower count, and an edit profile action.",
    card: {
      variant: "client",
      name: "Jamie Allen",
      avatar: pic1,
      headline: "Interactive Lead at Airbnb",
      followers: 245,
      connections: 182,
    },
  },
  Coach: {
    description: "Shown on a coach's profile and as a sidebar preview for customers. Includes credential logos, star rating, session count, and a booking CTA.",
    card: {
      variant: "coach",
      name: "David Kim",
      avatar: pic4,
      headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
      credentials: [
        { logo: bainLogo, label: "Bain & Company" },
        { logo: hbsLogo, label: "Harvard Business School" },
        { logo: whartonLogo, label: "Wharton" },
      ],
      rating: 5.0,
      reviews: 52,
      followers: 1840,
      sessions: 430,
    },
  },
};

// ─── Page ──────────────────────────────────────────────

export default function ProfileCardTest() {
  useEffect(() => { document.title = "Component: Profile Card"; }, []);
  const [active, setActive] = useState<Variant>("Coach");
  const { description, card } = cards[active];

  return (
    <PageShell variant="thin">
      {/* Header */}
      <Link to="/components" className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[13px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]">&lt;COMPONENT&gt;</Link>
      <h1 className="mt-1 text-[40px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Profile Card</h1>
      <p className="mt-1 text-[18px] text-[#707070]">
        A card displaying a user's identity — avatar, name, headline, and key stats. Two variants: client and coach.
      </p>

      {/* Variant pills */}
      <div className="mt-6 flex flex-wrap gap-[6px]">
        {variants.map((v) => (
          <button
            key={v}
            onClick={() => setActive(v)}
            className={`cursor-pointer rounded-full px-[14px] py-[6px] text-[14px] font-medium text-[#222222] ${
              active === v
                ? "border-[1.5px] border-[#222222] bg-[#f5f5f5]"
                : "border-[1.5px] border-transparent bg-[#f5f5f5] transition-colors hover:bg-[#ebebeb]"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Demo */}
      <section className="mt-6">
        <p className="mb-4 text-[18px] text-[#707070]">{description}</p>
        <div
          className="rounded-[32px] bg-[#F0F0F0] p-3"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` }}
        >
          <div className="flex items-center justify-center rounded-[24px] bg-white p-8" style={{ boxShadow: "0 20px 24px -4px rgba(16, 24, 40, 0.08)" }}>
            <div className="w-full max-w-[320px]">
              <ProfileCard card={card} />
            </div>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </PageShell>
  );
}
