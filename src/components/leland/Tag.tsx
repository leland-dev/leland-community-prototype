// Ported from @leland/ui-library (components/tag) — 1:1 except text-sm/base
// swapped for explicit sizes (the monorepo overrides the Tailwind base scale:
// sm=12px, base=14px; the prototype keeps defaults).
import { type FC, type SVGProps } from 'react';

import { FontWeight, FontWeightToStyles, type PickEnum } from './util';

export enum TagColor {
  TRANSPARENT = 'TRANSPARENT',
  GRAY = 'GRAY',
  PRIMARY = 'PRIMARY',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
  RED = 'RED',
  PURPLE = 'PURPLE',
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
  [TagColor.GRAY]: (hoverable, selected) =>
    `bg-leland-gray-hover text-leland-gray-light border ${selected ? 'border-leland-black' : 'border-leland-gray-hover'} ${hoverable ? 'hover:bg-leland-gray-stroke' : ''}`,
  [TagColor.PRIMARY]: (hoverable, selected) =>
    `tag--primary border ${selected ? 'border-leland-black' : ''} ${hoverable ? 'hover:bg-leland-primary-light' : ''}`,
  [TagColor.ORANGE]: (hoverable, selected) =>
    `bg-leland-orange-light text-leland-orange border ${selected ? 'border-leland-black' : 'border-leland-orange-light'} ${hoverable ? 'hover:bg-leland-orange-light-hover' : ''}`,
  [TagColor.YELLOW]: (hoverable, selected) =>
    `bg-leland-primary-extra-light text-leland-gray-dark border ${selected ? 'border-leland-black' : 'border-leland-primary-extra-light'} ${hoverable ? 'hover:bg-leland-primary-light' : ''}`,
  [TagColor.BLUE]: (hoverable, selected) =>
    `bg-leland-blue-light text-leland-blue border ${selected ? 'border-leland-black' : 'border-leland-blue-light'} ${hoverable ? 'hover:bg-leland-blue-light-hover' : ''}`,
  [TagColor.RED]: (hoverable, selected) =>
    `bg-leland-red-light text-leland-red border ${selected ? 'border-leland-black' : 'border-leland-red-light'} ${hoverable ? 'hover:bg-leland-red-light-hover' : ''}`,
  [TagColor.PURPLE]: (hoverable, selected) =>
    `bg-leland-purple text-leland-white border ${selected ? 'border-leland-black' : 'border-leland-purple'} ${hoverable ? 'hover:bg-leland-purple-hover' : ''}`,
  [TagColor.WHITE]: (hoverable, selected) =>
    `bg-leland-white text-leland-black border ${selected ? 'border-leland-black' : 'border-leland-white'} ${hoverable ? 'hover:bg-leland-gray-stroke' : ''}`,
  [TagColor.BLACK]: (hoverable, selected) =>
    `bg-leland-black text-leland-white border ${selected ? 'border-leland-black' : 'border-leland-black'} ${hoverable ? 'hover:bg-leland-black-hover' : ''}`,
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
