import { Button } from "./Button";
import coverImage from "../assets/img/cover-image-2.png";
import profilePhoto from "../assets/profile photos/profile photo.png";
import verifiedIcon from "../assets/icons/verified-new.svg";
import editIcon from "../assets/icons/edit.svg";
import gsbLogo from "../assets/logos/gsb.png";
import linkedinLogo from "../assets/org-logos/linkedin-logo.png";

// The feed's left-sidebar profile card. Starts as a faithful copy of the
// "Profile" tab hero header (My Leland → Profile, view state) so we can tweak
// from there — cover + overlapping avatar + Edit, name + verified + Top Expert,
// headline, and the featured experience/education tags.

const NAME = "Alex Rivera";
const HEADLINE = "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits";

// Featured experience + education tags shown under the headline.
const FEATURED = [
  { org: "LinkedIn", tileLabel: "in", tileColor: "#0A66C2", logo: linkedinLogo },
  { org: "Stanford GSB", tileLabel: "S", tileColor: "#8C1515", logo: gsbLogo },
];

// Stats row — the profile metrics, including Reviews.
const STATS = [
  { value: "4.9", label: "Reviews" },
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
    <section className="overflow-hidden rounded-2xl border border-[#222222]/10 bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.06)]">
      {/* Cover — full-bleed, clipped to the card's rounded top corners */}
      <img src={coverImage} alt="Cover" className="aspect-[4/1] w-full object-cover" />

      <div className="px-5 pb-5">
        {/* Photo + Edit — the avatar overlaps the cover (relative z-10); Edit is
            top-aligned so it sits just below the cover's bottom edge. */}
        <div className="flex items-start justify-between">
          <img
            src={profilePhoto}
            alt={NAME}
            className="relative z-10 -mt-10 h-20 w-20 shrink-0 rounded-full border-4 border-white object-cover"
          />
          <Button size="sm" variant="secondary" rounded="rounded-full" className="mt-3 shrink-0 text-[14px] font-semibold">
            <img src={editIcon} alt="" className="h-[16px] w-[16px]" />
            Edit
          </Button>
        </div>

        <div className="mt-3">
          {/* Name + verified + Top Expert — kept on one line */}
          <div className="flex items-center gap-1.5">
            <h2 className="shrink-0 font-serif text-[20px] leading-tight text-gray-dark">{NAME}</h2>
            <img src={verifiedIcon} alt="Verified" className="h-[16px] w-[16px] shrink-0" />
            <span className="shrink-0 whitespace-nowrap text-[13px] text-gray-light"><span className="text-[12px]">🏆</span> Top Expert</span>
          </div>

          {/* Headline */}
          <p className="mt-1.5 text-[14px] leading-[1.45] text-gray-light">{HEADLINE}</p>

          {/* Featured experience + education */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] leading-tight text-gray-light">
            {FEATURED.map((f) => (
              <div key={f.org} className="flex items-center gap-[6px]">
                <OrgSquare tileLabel={f.tileLabel} tileColor={f.tileColor} logo={f.logo} />
                <span>{f.org}</span>
              </div>
            ))}
          </div>

          {/* Stats — the profile metrics, with Reviews included. */}
          <div className="mt-4 flex items-center gap-x-6 border-t border-gray-stroke pt-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-[2px]">
                <span className="text-[15px] font-semibold leading-none text-gray-dark">{s.value}</span>
                <span className="text-[12px] leading-tight text-[#707070]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
