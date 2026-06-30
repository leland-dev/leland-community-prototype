import { Star, UserPlus } from "lucide-react";
import { Button } from "../../../../../components/Button";
import type { Coach } from "../../_types";

// Coach attribution row that sits between the session title and the
// session guide. Avatar + name + rating + credential on the left, a
// circular Follow icon button + Free intro call CTA on the right.
// Sized so the name + rating stay on a single line at mobile width.

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
    <div className="flex flex-col gap-3">
      {/* Coach identity — full name + credential, no truncation. */}
      <div className="flex items-start gap-3">
        <img
          src={coach.avatarUrl}
          alt={coach.name}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
          style={{ objectPosition: "50% 15%" }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="text-[15px] font-semibold text-gray-dark">
              {coach.name}
            </span>
            <Star size={13} className="shrink-0 fill-[#F5B729] text-[#F5B729]" />
            <span className="shrink-0 text-[13px] font-medium text-gray-dark">
              {rating.toFixed(1)}
            </span>
            <span className="shrink-0 text-[13px] text-gray-light">
              ({ratingCount})
            </span>
          </div>
          <div className="text-[13px] text-gray-light">{subtitle}</div>
        </div>
      </div>
      {/* Actions on their own line below the coach info. */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Follow"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]"
        >
          <UserPlus size={16} strokeWidth={2.25} />
        </button>
        <Button size="sm" variant="dark" rounded="rounded-full">
          Free intro call
        </Button>
      </div>
    </div>
  );
}
