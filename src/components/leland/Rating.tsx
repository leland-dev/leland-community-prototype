// Ported from @leland/ui-library (components/rating) — star rating with hover
// state. The dimension-breakdown Popover branch (showRate + dimensionRates) is
// not ported; showRate renders the plain formatted number. text-* sizes are
// explicit rems (the monorepo overrides the Tailwind base scale).
import { type FC, useState } from "react";

import { IconStar, IconStarHalf } from "./svg/icons";

export enum RatingSize {
  XS = "xs",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum RatingTextColor {
  LIGHT = "light",
  DARK = "dark",
  WHITE = "white",
}

export interface RatingProps {
  totalStars?: number;
  rate: number;
  /** NOTE: if `overallRate` is not supplied, it falls back to `rate` */
  overallRate?: number;
  hoverable?: boolean;
  showRate?: boolean;
  onSaveRating?: (index: number) => void;
  size?: RatingSize;
  textColor?: RatingTextColor;
}

const ratingSizeClasses: Record<RatingSize, string> = {
  [RatingSize.XS]: "h-4 w-4",
  [RatingSize.SMALL]: "h-4 w-4",
  [RatingSize.MEDIUM]: "h-5 w-5",
  [RatingSize.LARGE]: "h-8 w-8",
};

const ratingTextSizeClasses: Record<RatingSize, string> = {
  [RatingSize.XS]: "text-[0.75rem]",
  [RatingSize.SMALL]: "text-[0.875rem]",
  [RatingSize.MEDIUM]: "text-[1rem]",
  [RatingSize.LARGE]: "text-[1.125rem]",
};

const ratingTextColorClasses: Record<RatingTextColor, string> = {
  [RatingTextColor.LIGHT]: "text-leland-gray-light",
  [RatingTextColor.DARK]: "text-leland-gray-dark",
  [RatingTextColor.WHITE]: "text-leland-white",
};

export const Rating: FC<RatingProps> = ({
  rate,
  overallRate = rate,
  hoverable,
  totalStars = 5,
  onSaveRating,
  showRate,
  size = hoverable ? RatingSize.LARGE : RatingSize.MEDIUM,
  textColor = RatingTextColor.LIGHT,
}) => {
  const [hoverRate, setHoverRate] = useState(0);

  const formattedRate = (overallRate ?? 0).toFixed(1);
  const rateToUse = hoverRate || overallRate;

  return (
    <div className="flex items-center justify-start">
      {/* Interactive rating exposes one labeled button per star; a static
       * display rating is a single labeled image (the decorative star icons
       * carry no name of their own). */}
      <div
        className="flex gap-px"
        role={hoverable ? undefined : "img"}
        aria-label={
          hoverable ? undefined : `${formattedRate} out of ${totalStars} stars`
        }
      >
        {Array.from({ length: totalStars }, (_, i) => i + 1).map((index) => {
          const indexDifference = rateToUse - index;
          const star =
            index <= rateToUse ||
            indexDifference > -0.25 ||
            (hoverRate === index && indexDifference > -0.75) ? (
              <IconStar
                className={`${ratingSizeClasses[size]} ${
                  hoverRate === index
                    ? "text-leland-yellow-hover active:text-leland-yellow-hover/80"
                    : "text-leland-yellow"
                }`}
              />
            ) : indexDifference > -0.75 ? (
              <IconStarHalf
                className={`${ratingSizeClasses[size]} fill-leland-gray-stroke text-leland-yellow`}
              />
            ) : (
              <IconStar
                className={`${ratingSizeClasses[size]} ${
                  hoverRate === index
                    ? "text-leland-yellow active:text-leland-yellow-hover"
                    : "text-leland-gray-stroke"
                }`}
              />
            );

          // A display-only rating is a single labeled image (the wrapper above
          // carries the name); its stars are decorative. Rendering a <button>
          // per star here produces invalid nested-button HTML whenever a
          // consumer wraps the rating in its own button/link, which fails
          // hydration and regenerates the subtree client-side (visible flash).
          // Only the interactive rating needs real buttons.
          return hoverable ? (
            <button
              type="button"
              key={index}
              aria-label={`Rate ${index} star${index === 1 ? "" : "s"}`}
              onMouseEnter={() => setHoverRate(index)}
              onMouseLeave={() => setHoverRate(0)}
              onClick={() => onSaveRating?.(index)}
            >
              {star}
            </button>
          ) : (
            <span key={index} className="inline-flex">
              {star}
            </span>
          );
        })}
      </div>
      {showRate ? (
        <p
          className={`ml-2 ${ratingTextSizeClasses[size]} ${ratingTextColorClasses[textColor]}`}
        >
          {formattedRate}
        </p>
      ) : null}
    </div>
  );
};
