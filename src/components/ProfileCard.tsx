import verifiedIcon from "../assets/icons/verified.svg";
import starIcon from "../assets/icons/star.svg";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ClientProfileCardData = {
  variant: "client";
  name: string;
  avatar: string;
  headline: string;
  followers: number;
  connections: number;
  banner?: string;
};

export type CoachProfileCardData = {
  variant: "coach";
  name: string;
  avatar: string;
  headline: string;
  credentials: { logo: string; label: string }[];
  rating: number;
  reviews: number;
  followers: number;
  sessions: number;
  banner?: string;
};

export type ProfileCardData = ClientProfileCardData | CoachProfileCardData;

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function ProfileCard({ card }: { card: ProfileCardData }) {
  const isCoach = card.variant === "coach";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Banner */}
      <div
        className="relative h-[56px]"
        style={
          card.banner
            ? { backgroundImage: `url(${card.banner})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { backgroundColor: "#F3F4F6" }
        }
      >
        <div className="absolute -bottom-10 left-4">
          <img
            src={card.avatar}
            alt={card.name}
            className="h-[80px] w-[80px] rounded-full border-[3px] border-white object-cover shadow-sm"
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-12">
        {/* Name + verified */}
        <div className="flex items-center gap-1.5">
          <p className="text-[19px] font-medium leading-tight text-gray-dark">{card.name}</p>
          {isCoach && <img src={verifiedIcon} alt="Verified" className="h-[16px] w-[16px] shrink-0" />}
        </div>

        {/* Headline */}
        <p className="mt-0.5 text-[15px] leading-snug text-gray-light">{card.headline}</p>

        {/* Coach: credentials row */}
        {isCoach && card.credentials.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            {card.credentials.map((c) => (
              <div key={c.label} className="flex items-center gap-1.5 text-[13px] text-[#707070]">
                <img src={c.logo} alt={c.label} className="h-[16px] w-[16px] rounded object-contain" />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3">
          {isCoach && (
            <div className="flex items-baseline gap-1">
              <img src={starIcon} alt="" className="mb-[2px] h-[13px] w-[13px] shrink-0" />
              <span className="text-[15px] font-medium text-gray-dark">{card.rating.toFixed(1)}</span>
              <span className="text-[13px] text-gray-light">{fmt(card.reviews)} reviews</span>
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-medium text-gray-dark">{fmt(card.followers)}</span>
            <span className="text-[13px] text-gray-light">followers</span>
          </div>
          {isCoach ? (
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-medium text-gray-dark">{fmt(card.sessions)}</span>
              <span className="text-[13px] text-gray-light">sessions</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-medium text-gray-dark">{fmt(card.connections)}</span>
              <span className="text-[13px] text-gray-light">connections</span>
            </div>
          )}
        </div>

        {/* Coach: Book CTA */}
        {isCoach && (
          <button className="mt-3 w-full rounded-[10px] bg-gray-dark py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-85">
            Book a session
          </button>
        )}

        {/* Client: Edit profile link */}
        {!isCoach && (
          <button className="mt-3 w-full rounded-[10px] border border-gray-200 py-2.5 text-[15px] font-medium text-gray-dark transition-colors hover:bg-gray-50">
            Edit profile
          </button>
        )}
      </div>
    </div>
  );
}
