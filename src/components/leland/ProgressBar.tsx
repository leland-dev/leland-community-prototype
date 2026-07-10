// Ported from @leland/ui-library (components/chart/ProgressBar) — the radix
// Progress primitive is replaced with plain divs (visually identical; radix
// only added aria plumbing, reproduced here).
import { type FC } from 'react';

export enum ProgressBarColor {
  Primary = 'primary',
  Dark = 'dark',
}

const ProgressBarColorToStyles: Record<ProgressBarColor, string> = {
  [ProgressBarColor.Primary]: 'bg-leland-primary',
  [ProgressBarColor.Dark]: 'bg-leland-gray-dark',
};

export type ProgressBarProps = {
  value: number;
  color?: ProgressBarColor;
};

export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  color = ProgressBarColor.Primary,
}) => {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-2 w-full rounded-full bg-leland-gray-stroke duration-700"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-in-out ${ProgressBarColorToStyles[color]}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
