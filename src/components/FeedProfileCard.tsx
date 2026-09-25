import { Link } from "react-router-dom";
import coverImage from "../assets/img/cover-image-2.png";
import profilePhoto from "../assets/profile photos/profile photo.png";
import verifiedIcon from "../assets/icons/verified-new.svg";
import starIcon from "../assets/icons/star.svg";
import gsbLogo from "../assets/logos/gsb.png";
import linkedinLogo from "../assets/org-logos/linkedin-logo.png";

// The feed's left-sidebar profile card. Starts as a faithful copy of the
// "Profile" tab hero header (My Leland → Profile, view state) so we can tweak
// from there — cover + overlapping avatar + floating Edit, name + verified,
// headline, and the featured experience/education tags.

const NAME = "Alex Rivera";
const HEADLINE = "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits";

// Featured experience + education tags shown under the headline.
const FEATURED = [
  { org: "LinkedIn", tileLabel: "in", tileColor: "#0A66C2", logo: linkedinLogo },
  { org: "Stanford GSB", tileLabel: "S", tileColor: "#8C1515", logo: gsbLogo },
];

// Stats row — the profile metrics. The rating leads with a star and shows the
// number of reviews as its label.
const STATS = [
  { value: "4.9", label: "38 reviews", star: true },
  { value: "84", label: "Followers" },
  { value: "22.9k", label: "Likes" },
];

function OrgSquare({ tileLabel, tileColor, logo }: { tileLabel: string; tileColor: string; logo?: string }) {
  if (logo) {
    return <img src={logo} alt="" className="h-[18px] w-[18px] shrink-0 rounded-[3px] object-cover" />;
  }
  return (
    <span
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] text-[9px] font-semibold leading-none text-white"
      style={{ backgroundColor: tileColor }}
    >
      {tileLabel}
    </span>
  );
}

export default function FeedProfileCard() {
  return (
    <Link
      to="/my-leland/profile"
      className="block overflow-hidden rounded-2xl border border-[#222222]/[0.12] bg-white no-underline transition-shadow duration-200 hover:shadow-[0_16px_21px_0_rgba(0,0,0,0.07)]"
    >
      {/* Cover — full-bleed, clipped to the card's rounded top corners. */}
      <img src={coverImage} alt="Cover" className="aspect-[4/1] w-full object-cover" />

      <div className="px-5 pb-5">
        {/* Photo + Edit — the avatar overlaps the cover (relative z-10); a simple
            edit icon sits across from it, bottom-aligned with the photo. */}
        <div className="flex items-end justify-between">
          <img
            src={profilePhoto}
            alt={NAME}
            className="relative z-10 -mt-10 h-20 w-20 shrink-0 rounded-full border-4 border-white object-cover"
          />
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-label="Edit profile"
            className="mb-1.5 h-[18px] w-[18px] shrink-0 text-gray-extra-light opacity-60 transition-opacity hover:opacity-100"
          >
            <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" />
          </svg>
        </div>

        <div className="mt-3">
          {/* Name + verified — kept on one line */}
          <div className="flex items-center gap-1.5">
            <h2 className="shrink-0 font-serif text-[24px] leading-tight text-gray-dark hover:underline">{NAME}</h2>
            <img src={verifiedIcon} alt="Verified" className="h-[18px] w-[18px] shrink-0" />
          </div>

          {/* Headline */}
          <p className="mt-1.5 text-[14px] leading-[1.45] text-gray-light">{HEADLINE}</p>

          {/* Stats — the profile metrics. The rating leads with a star. */}
          <div className="mt-3 flex items-center gap-x-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-[2px]">
                <span className="flex items-center gap-1 text-[15px] font-semibold leading-none text-gray-dark">
                  {s.value}
                  {s.star && <img src={starIcon} alt="" className="h-[15px] w-[15px]" />}
                </span>
                <span className="text-[13px] leading-tight text-gray-extra-light">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Featured experience + education — hidden for now; may re-add later. */}
          {false && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] leading-tight text-gray-light">
              {FEATURED.map((f) => (
                <div key={f.org} className="flex items-center gap-[6px]">
                  <OrgSquare tileLabel={f.tileLabel} tileColor={f.tileColor} logo={f.logo} />
                  <span>{f.org}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
