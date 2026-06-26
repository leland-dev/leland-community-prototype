import { Star } from "lucide-react";
import { Button } from "../../../../../components/Button";
import type { Coach } from "../../_types";

// Coach attribution row that sits between the session title and the
// session guide. Avatar + name + rating + credential on the left,
// Follow + Free intro call CTAs on the right. Matches the shape of the
// existing live session host row on Leland.

type Props = {
  coach: Coach;
  /** Average rating, e.g. 4.9. */
  rating?: number;
  /** Number of ratings. */
  ratingCount?: number;
  /** Short credential / bio sentence under the name. */
  subtitle?: string;
};

export default function SessionCoachCard({
  coach,
  rating = 4.9,
  ratingCount = 179,
  subtitle = "AI Builder Lead Instructor · 12 cohorts · 200+ builders coached",
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={coach.avatarUrl}
        alt={coach.name}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
        style={{ objectPosition: "50% 15%" }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-gray-dark">{coach.name}</span>
          <Star size={13} className="fill-[#F5B729] text-[#F5B729]" />
          <span className="text-[11px] font-medium text-gray-dark">{rating.toFixed(1)}</span>
          <span className="text-[11px] text-gray-light">({ratingCount})</span>
        </div>
        <div className="truncate text-[11px] text-gray-light">{subtitle}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" variant="secondary" rounded="rounded-full">
          + Follow
        </Button>
        <Button size="sm" variant="dark" rounded="rounded-full">
          Free intro call
        </Button>
      </div>
    </div>
  );
}
