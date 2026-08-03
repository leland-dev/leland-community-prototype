import { Link } from "react-router-dom";
import lelandMark from "../assets/leland-mark.svg";

/* ── Cover themes ──
 * Each package cover is a generated "certificate" banner. Themes rotate by
 * index so a grid of cards reads as varied, like real coach offerings. */
const COVER_THEMES = [
  { bg: "linear-gradient(135deg, #EAEEE2 0%, #DCE4D2 100%)", ink: "#3B5241" },
  { bg: "linear-gradient(135deg, #F4ECDD 0%, #EBDCC4 100%)", ink: "#7A5A3A" },
  { bg: "linear-gradient(135deg, #ECEAF4 0%, #DDD8EC 100%)", ink: "#524A78" },
  { bg: "linear-gradient(135deg, #E9EEF3 0%, #D5DFEA 100%)", ink: "#35506E" },
  { bg: "linear-gradient(135deg, #E8EFE9 0%, #D6E4D9 100%)", ink: "#3B6147" },
  { bg: "linear-gradient(135deg, #F4EAEA 0%, #EBD8D8 100%)", ink: "#8A5A5A" },
];

export interface PackageCardProps {
  title: string;
  /** e.g. "Starting at $8,000 · 20h+ of coaching" */
  meta: string;
  coachName: string;
  coachPhoto: string;
  /** Green pill, e.g. "Best Value" or "Save up to $555" */
  badge?: string;
  /** Selects the cover theme; falls back to cycling by other means. */
  themeIndex?: number;
  href?: string;
}

function Cover({ title, coachName, coachPhoto, themeIndex = 0 }: Pick<PackageCardProps, "title" | "coachName" | "coachPhoto" | "themeIndex">) {
  const theme = COVER_THEMES[themeIndex % COVER_THEMES.length];
  const firstLast = coachName.split(" ");
  const shortName = firstLast.length > 1 ? `${firstLast[0]} ${firstLast[firstLast.length - 1][0]}.` : coachName;

  return (
    <div
      className="relative flex aspect-[16/10] w-full items-center overflow-hidden px-4"
      style={{ background: theme.bg, color: theme.ink }}
    >
      {/* Coach avatar — left, vertically centered */}
      <img
        src={coachPhoto}
        alt=""
        className="h-[52px] w-[52px] shrink-0 rounded-full object-cover ring-2 ring-white/70"
      />

      {/* Centered certificate text block */}
      <div className="flex min-w-0 flex-1 flex-col items-center px-2 text-center">
        <span className="font-serif text-[8px] uppercase tracking-[0.14em] opacity-70">Leland Top Coach</span>
        <span className="mt-1 line-clamp-2 font-serif text-[16px] font-medium leading-[1.15]">{title}</span>
        <span className="mt-1 font-serif text-[10px] italic opacity-90">{shortName}</span>
        <span className="mt-1 text-[7px] font-medium uppercase tracking-[0.12em] opacity-55">200+ reviews · #1 on Leland</span>
      </div>

      {/* Leland mark — bottom-right badge */}
      <span className="absolute bottom-2 right-3 flex items-center gap-1 text-[9px] font-semibold" style={{ color: theme.ink }}>
        <img src={lelandMark} alt="" className="h-[10px] w-[10px] opacity-80" />
        Leland
      </span>
    </div>
  );
}

export default function PackageCard({ title, meta, coachName, coachPhoto, badge, themeIndex = 0, href }: PackageCardProps) {
  const body = (
    <div className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[8px] border border-gray-stroke bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] transition-shadow hover:shadow-[0_4px_12px_-2px_rgba(16,24,40,0.12)]">
      <Cover title={title} coachName={coachName} coachPhoto={coachPhoto} themeIndex={themeIndex} />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[17px] font-semibold leading-[1.25] text-gray-dark">{title}</h3>
        <p className="mt-1 truncate text-[14px] text-gray-light">{meta}</p>
        {badge && (
          <span className="mt-3 inline-block self-start rounded-md bg-[#E5F3EC] px-2.5 py-1 text-[13px] font-medium text-[#1B7A4B]">
            {badge}
          </span>
        )}
      </div>
    </div>
  );

  return href ? <Link to={href} className="block h-full">{body}</Link> : body;
}
