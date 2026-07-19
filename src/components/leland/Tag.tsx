// Ported from @leland/ui-library (components/tag) — 1:1 except text-sm/base
// swapped for explicit sizes (the monorepo overrides the Tailwind base scale:
// sm=12px, base=14px; the prototype keeps defaults).
import { type FC, type SVGProps } from 'react';

import { FontWeight, FontWeightToStyles, type PickEnum } from './util';

export enum TagColor {
  TRANSPARENT = 'TRANSPARENT',
  GRAY = 'GRAY',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
  RED = 'RED',
  BEIGE = 'BEIGE',
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export enum TagSize {
  XXS = 'XXS',
  XS = 'XS',
  SMALL = 'SMALL',
  LARGE = 'LARGE',
}

export enum TagRounding {
  FULL = 'FULL',
  SM = 'SM',
}

export type TagFontWeight = PickEnum<
  FontWeight,
  FontWeight.NORMAL | FontWeight.MEDIUM
>;

const TagColorToStyles: Record<
  TagColor,
  (hoverable: boolean, selected: boolean) => string
> = {
  [TagColor.TRANSPARENT]: (hoverable, selected) =>
    `border ${selected ? 'border-leland-black' : 'border-leland-gray-stroke'} ${hoverable ? 'hover:opacity-50' : ''}`,
  // gray-solid-hover (opaque #F4F4F4), not gray-hover: gray-hover is gray-dark @
  // 5% alpha, so a gray tag on any non-white surface reads as transparent.
  [TagColor.GRAY]: (hoverable, selected) =>
    `bg-leland-gray-solid-hover text-leland-gray-light border ${selected ? 'border-leland-black' : 'border-transparent'} ${hoverable ? 'hover:bg-leland-gray-stroke' : ''}`,
  [TagColor.GREEN]: (hoverable, selected) =>
    `bg-leland-success-extra-light text-leland-dark-green border ${selected ? 'border-leland-black' : 'border-transparent'} ${hoverable ? 'hover:bg-leland-success-extra-light' : ''}`,
  [TagColor.YELLOW]: (_hoverable, selected) =>
    `bg-leland-primary-extra-light text-leland-yellow-dark border ${selected ? 'border-leland-black' : 'border-transparent'}`,
  [TagColor.BLUE]: (hoverable, selected) =>
    `bg-leland-blue-light text-leland-blue-dark border ${selected ? 'border-leland-black' : 'border-transparent'} ${hoverable ? 'hover:bg-leland-blue-light' : ''}`,
  [TagColor.RED]: (hoverable, selected) =>
    `bg-leland-red-light text-leland-red-dark border ${selected ? 'border-leland-black' : 'border-transparent'} ${hoverable ? 'hover:bg-leland-red-light' : ''}`,
  [TagColor.BEIGE]: (_hoverable, selected) =>
    `bg-leland-tan-light text-leland-tan-dark border ${selected ? 'border-leland-black' : 'border-transparent'}`,
  [TagColor.WHITE]: (hoverable, selected) =>
    `bg-white text-leland-black border ${selected ? 'border-leland-black' : 'border-leland-gray-stroke'} ${hoverable ? 'hover:bg-leland-gray-stroke' : ''}`,
  [TagColor.BLACK]: (hoverable, selected) =>
    `bg-leland-black text-leland-white border ${selected ? 'border-leland-black' : 'border-transparent'} ${hoverable ? 'hover:bg-leland-black' : ''}`,
};

interface TagSizePaddingProps {
  decreasedYPadding: boolean;
  decreasedLeftPadding: boolean;
  decreasedRightPadding: boolean;
}

const getTagSizeStyles = (
  tagSize: TagSize,
  {
    decreasedYPadding,
    decreasedLeftPadding,
    decreasedRightPadding,
  }: TagSizePaddingProps,
) => {
  switch (tagSize) {
    case TagSize.XXS:
      return `text-[0.75rem] space-x-1.5 py-0.5 ${decreasedLeftPadding ? 'pl-1' : 'pl-2'} ${decreasedRightPadding ? 'pr-1' : 'pr-2'}`;
    case TagSize.XS:
      return `text-[0.75rem] space-x-1.5 py-1 ${decreasedLeftPadding ? 'pl-1' : 'pl-2'} ${decreasedRightPadding ? 'pr-1' : 'pr-2'}`;
    case TagSize.SMALL:
      return `text-[0.75rem] space-x-2 py-1.5 ${decreasedLeftPadding ? 'pl-1.5' : 'pl-2.5'} ${decreasedRightPadding ? 'pr-1.5' : 'pr-2.5'}`;
    case TagSize.LARGE:
      return `text-[0.875rem] leading-tight space-x-2 ${decreasedYPadding ? 'py-1.5' : 'py-2'} ${decreasedLeftPadding ? 'pl-1.5' : 'pl-3'} ${decreasedRightPadding ? 'pr-1.5' : 'pr-3'}`;
  }
};

const TagRoundingToStyles: Record<TagRounding, string> = {
  [TagRounding.FULL]: 'rounded-full',
  [TagRounding.SM]: 'rounded',
};

export const getTagSizeIconStyles = (tagSize: TagSize, largeIcons: boolean) => {
  switch (tagSize) {
    case TagSize.XXS:
    case TagSize.XS:
      return largeIcons ? 'size-4.5' : 'size-3.5';
    case TagSize.SMALL:
      return largeIcons ? 'size-5' : 'size-4';
    case TagSize.LARGE:
      return largeIcons ? 'size-6' : 'size-4';
  }
};

export interface TagProps {
  fontWeight?: TagFontWeight;
  LeftIcon?: FC<SVGProps<SVGSVGElement>>;
  CustomLeftIcon?: FC<{ iconClassName?: string }>;
  RightIcon?: FC<SVGProps<SVGSVGElement>>;
  CustomRightIcon?: FC<{ iconClassName?: string }>;
  largeIcons?: boolean;
  rounding?: TagRounding;
  size?: TagSize;
  text: string;
  tagColor?: TagColor;
  hoverable?: boolean;
  selected?: boolean;
  shadow?: boolean;
}

export const Tag: FC<TagProps> = ({
  CustomLeftIcon,
  CustomRightIcon,
  LeftIcon,
  RightIcon,
  largeIcons = false,
  text,
  tagColor = TagColor.GRAY,
  size = TagSize.SMALL,
  fontWeight = FontWeight.MEDIUM,
  rounding = TagRounding.FULL,
  hoverable = false,
  selected = false,
  shadow = false,
}) => {
  const hasLeftIcon = !!LeftIcon || !!CustomLeftIcon;
  const hasRightIcon = !!RightIcon || !!CustomRightIcon;

  const iconClassName = getTagSizeIconStyles(size, largeIcons);

  return (
    <div
      className={`inline-flex items-center justify-center max-w-full ${TagColorToStyles[tagColor](hoverable, selected)} ${getTagSizeStyles(size, {
        decreasedYPadding: largeIcons && (hasLeftIcon || hasRightIcon),
        decreasedLeftPadding: largeIcons && hasLeftIcon,
        decreasedRightPadding: largeIcons && hasRightIcon,
      })} ${FontWeightToStyles[fontWeight]} ${TagRoundingToStyles[rounding]} ${shadow ? 'shadow-sm' : 'shadow-none'}`}
    >
      {CustomLeftIcon ? (
        <CustomLeftIcon iconClassName={iconClassName} />
      ) : LeftIcon ? (
        <LeftIcon className={iconClassName} />
      ) : null}
      <p className="min-w-0 truncate">{text}</p>
      {CustomRightIcon ? (
        <CustomRightIcon iconClassName={iconClassName} />
      ) : RightIcon ? (
        <RightIcon className={iconClassName} />
      ) : null}
    </div>
  );
};
