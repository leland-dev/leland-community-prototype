import { useEffect } from "react";
import { Button } from "../components/Button";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic12 from "../assets/profile photos/pic-12.png";
import pic13 from "../assets/profile photos/pic-13.png";
import pic14 from "../assets/profile photos/pic-14.png";
// Company logos (local brand assets)
import anthropicLogo from "../assets/org-logos/Anthropic.jpg";
import openaiLogo from "../assets/org-logos/openai.png";
import stripeLogo from "../assets/logos/stripe.png";
import googleLogo from "../assets/logos/google.png";
import metaLogo from "../assets/logos/meta.png";
import coinbaseLogo from "../assets/logos/coinbase.png";
import salesforceLogo from "../assets/logos/salesforce.png";
import atlassianLogo from "../assets/logos/atlassian.png";
import instagramLogo from "../assets/logos/instagram.png";

// Teammate can be a photo or a colored initial badge (mirrors the reference).
type Teammate = { photo: string } | { initial: string; color: string };

type Role = {
  team: string;
  logo: string;
  position: string;
  location: string;
  manager: string;
  teammates: Teammate[];
  posted: string;
  external?: boolean;
};

const ROLES: Role[] = [
  {
    team: "Anthropic",
    logo: anthropicLogo,
    position: "Founding Product Designer 🤙",
    location: "Remote",
    manager: pic1,
    teammates: [],
    posted: "20 hours ago",
    external: true,
  },
  {
    team: "OpenAI",
    logo: openaiLogo,
    position: "Research Engineer, Applied",
    location: "San Francisco or remote",
    manager: pic2,
    teammates: [{ photo: pic3 }, { photo: pic4 }, { photo: pic5 }],
    posted: "3 days ago",
  },
  {
    team: "Stripe",
    logo: stripeLogo,
    position: "Full Stack Engineer, Payments",
    location: "New York City, San Francisco, or remote",
    manager: pic6,
    teammates: [{ photo: pic7 }, { photo: pic8 }, { photo: pic9 }],
    posted: "3 days ago",
  },
  {
    team: "Google",
    logo: googleLogo,
    position: "Senior Product Manager",
    location: "Mountain View or remote",
    manager: pic10,
    teammates: [{ photo: pic11 }],
    posted: "4 days ago",
  },
  {
    team: "Meta",
    logo: metaLogo,
    position: "iOS Frontend Engineer",
    location: "Menlo Park or remote",
    manager: pic12,
    teammates: [],
    posted: "5 days ago",
  },
  {
    team: "Coinbase",
    logo: coinbaseLogo,
    position: "Product Designer",
    location: "Remote",
    manager: pic13,
    teammates: [{ initial: "A", color: "#7A5AF8" }],
    posted: "5 days ago",
  },
  {
    team: "Salesforce",
    logo: salesforceLogo,
    position: "Staff Software Engineer",
    location: "San Francisco or remote",
    manager: pic14,
    teammates: [{ photo: pic1 }, { photo: pic2 }, { photo: pic3 }],
    posted: "5 days ago",
  },
  {
    team: "Atlassian",
    logo: atlassianLogo,
    position: "Product Design Lead",
    location: "Austin or remote",
    manager: pic4,
    teammates: [{ photo: pic5 }, { photo: pic6 }, { photo: pic7 }],
    posted: "6 days ago",
  },
  {
    team: "Instagram",
    logo: instagramLogo,
    position: "Lead Product Designer",
    location: "New York City or remote",
    manager: pic8,
    teammates: [
      { initial: "A", color: "#7A5AF8" },
      { initial: "C", color: "#B85A2B" },
    ],
    posted: "7 days ago",
  },
];

function TeamLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#222222]/10">
      <img src={logo} alt={name} className="h-full w-full object-cover" />
    </span>
  );
}

function Facepile({ people }: { people: Teammate[] }) {
  if (people.length === 0) return null;
  return (
    <div className="flex -space-x-2">
      {people.map((p, i) => (
        "photo" in p ? (
          <img key={i} src={p.photo} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
        ) : (
          <span
            key={i}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-white ring-2 ring-white"
            style={{ backgroundColor: p.color }}
          >
            {p.initial}
          </span>
        )
      ))}
    </div>
  );
}

const COLS = "md:grid-cols-[220px_minmax(0,1fr)_88px_150px_110px]";

export default function Jobs() {
  useEffect(() => {
    document.title = "Leland Prototype | Jobs";
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">Browse Jobs</h1>
        <Button size="md" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold">
          Post a job listing
        </Button>
      </div>

      {/* Column headers — desktop only */}
      <div className={`mt-8 hidden md:grid ${COLS} items-center gap-6 border-b border-gray-stroke pb-3`}>
        <span className="text-[14px] text-gray-light">Team</span>
        <span className="text-[14px] text-gray-light">Position</span>
        <span className="text-[14px] text-gray-light">Manager</span>
        <span className="text-[14px] text-gray-light">Teammates</span>
        <span className="text-[14px] text-gray-light">Posted</span>
      </div>

      {/* Rows */}
      <div className="mt-2 md:mt-0">
        {ROLES.map((role) => (
          <div
            key={role.team + role.position}
            className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-gray-stroke py-4 transition-colors hover:bg-gray-hover ${COLS} md:gap-6`}
          >
            {/* Team — logo always; name on desktop */}
            <div className="flex min-w-0 items-center gap-3">
              <TeamLogo name={role.team} logo={role.logo} />
              <span className="hidden min-w-0 items-center gap-1 truncate text-[16px] font-medium text-gray-dark md:inline-flex">
                {role.team}
                {role.external && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-extra-light">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                )}
              </span>
            </div>

            {/* Position — team label shown above title on mobile */}
            <div className="min-w-0">
              <p className="truncate text-[12px] text-gray-light md:hidden">{role.team}</p>
              <p className="truncate text-[16px] font-medium leading-snug text-gray-dark">{role.position}</p>
              <p className="truncate text-[14px] leading-snug text-gray-light">{role.location}</p>
            </div>

            {/* Manager — desktop only */}
            <div className="hidden md:block">
              <img src={role.manager} alt="" className="h-9 w-9 rounded-full object-cover" />
            </div>

            {/* Teammates — desktop only */}
            <div className="hidden md:block">
              <Facepile people={role.teammates} />
            </div>

            {/* Posted */}
            <div className="shrink-0 whitespace-nowrap text-right text-[14px] text-gray-light md:text-left">
              {role.posted}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
