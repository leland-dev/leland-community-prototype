// Ported from @leland/ui-library (components/button) — the production Button
// with its full ButtonColor API. Changes from the source:
// - next/link → react-router-dom Link
// - tooltipContent dropped (production wraps in a radix Tooltip)
// - text-sm/text-base swapped for explicit sizes: the monorepo overrides the
//   Tailwind base scale (sm=12px, base=14px); the prototype keeps defaults.
import {
  type ButtonHTMLAttributes,
  type FC,
  forwardRef,
  type SVGProps,
} from 'react';
import { Link } from 'react-router-dom';

import {
  breakpointToTailwind,
  Breakpoints,
  FontWeight,
  FontWeightToStyles,
  type PickEnum,
} from './util';

export enum ButtonWidth {
  FULL = 'FULL',
  AUTO = 'AUTO',
  FULL_MOBILE = 'FULL_MOBILE',
}

export enum ButtonColor {
  PRIMARY = 'PRIMARY',
  WHITE = 'WHITE',
  GRAY = 'GRAY',
  RED = 'RED',
  PURPLE = 'PURPLE',
  LIGHT_BLUE = 'LIGHT_BLUE',
  BLUE = 'BLUE',
  ORANGE = 'ORANGE',
  BLACK = 'BLACK',
  TRANSPARENT = 'TRANSPARENT',
  REVEAL = 'REVEAL',
  REVEAL_PRIMARY = 'REVEAL_PRIMARY',
  REVEAL_WHITE = 'REVEAL_WHITE',
  LIGHT_RED = 'LIGHT_RED',
  SECONDARY = 'SECONDARY',
  SECONDARY_NEUTRAL = 'SECONDARY_NEUTRAL',
  TERTIARY = 'TERTIARY',
  DESTRUCTIVE = 'DESTRUCTIVE',
}

export enum ButtonSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum ButtonRoundedSide {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  BOTH = 'BOTH',
  NONE = 'NONE',
}

export type ButtonFontWeight = PickEnum<
  FontWeight,
  FontWeight.NORMAL | FontWeight.MEDIUM
>;

const ButtonColorToStyles: Record<ButtonColor, (selected?: boolean) => string> =
  {
    [ButtonColor.PRIMARY]: (selected) =>
      selected
        ? 'text-leland-primary bg-white border-leland-primary shadow-leland-primary'
        : 'text-leland-on-primary-text bg-leland-primary border-leland-primary disabled:bg-leland-primary hover:bg-leland-primary-hover hover:border-leland-primary-hover shadow-transparent',
    [ButtonColor.WHITE]: (selected) =>
      selected
        ? 'text-leland-gray-dark bg-white border-leland-gray-dark shadow-leland-gray-dark'
        : 'text-leland-gray-dark bg-white disabled:bg-white border-leland-gray-stroke hover:bg-leland-gray-hover shadow-transparent',
    [ButtonColor.GRAY]: (selected) =>
      selected
        ? 'text-leland-gray-dark bg-white border-leland-gray-dark shadow-leland-gray-dark'
        : 'btn--gray-borderless text-leland-gray-dark bg-leland-gray-hover disabled:bg-leland-gray-hover border-leland-gray-hover hover:bg-leland-gray-stroke hover:border-leland-gray-stroke shadow-transparent',
    [ButtonColor.RED]: (selected) =>
      selected
        ? 'text-leland-red bg-white border-leland-red shadow-leland-red'
        : 'text-white bg-leland-red disabled:bg-leland-red border-leland-red hover:bg-leland-red-hover hover:border-leland-red-hover shadow-transparent',
    [ButtonColor.PURPLE]: (selected) =>
      selected
        ? 'text-leland-purple bg-white border-leland-purple shadow-leland-purple'
        : 'text-white bg-leland-purple disabled:bg-leland-purple border-leland-purple hover:bg-leland-purple-hover hover:border-leland-purple-hover shadow-transparent',
    [ButtonColor.LIGHT_BLUE]: (selected) =>
      selected
        ? 'text-leland-blue bg-white border-leland-blue shadow-leland-blue'
        : 'text-leland-blue bg-leland-blue-light disabled:bg-leland-blue-light border-leland-blue-light hover:bg-leland-blue-light-hover hover:border-leland-blue-light-hover shadow-transparent',
    [ButtonColor.BLUE]: (selected) =>
      selected
        ? 'text-leland-blue bg-white border-leland-blue shadow-leland-blue'
        : 'text-leland-white bg-leland-blue disabled:bg-leland-blue border-leland-blue hover:bg-leland-blue-hover hover:border-leland-blue-hover shadow-transparent',
    [ButtonColor.ORANGE]: (selected) =>
      selected
        ? 'text-leland-orange bg-white border-leland-orange shadow-leland-orange'
        : 'text-leland-white bg-leland-orange disabled:bg-leland-orange border-leland-orange hover:bg-leland-orange-dark hover:border-leland-orange-dark shadow-transparent',
    [ButtonColor.BLACK]: (selected) =>
      selected
        ? 'text-leland-black bg-white border-leland-black shadow-leland-black'
        : 'text-white bg-leland-black disabled:bg-leland-black border-leland-black hover:bg-leland-black-hover hover:border-leland-black-hover shadow-transparent',
    [ButtonColor.TRANSPARENT]: (selected) =>
      selected
        ? 'text-leland-white bg-transparent border-leland-white shadow-leland-white'
        : 'text-leland-white bg-transparent disabled:bg-transparent border-leland-white hover:bg-leland-white/5 shadow-transparent',
    [ButtonColor.REVEAL]: (selected) =>
      selected
        ? 'text-leland-gray-dark bg-transparent border-transparent shadow-transparent'
        : 'text-leland-gray-dark bg-transparent disabled:text-leland-gray-light disabled:bg-transparent hover:bg-leland-gray-hover border-transparent shadow-transparent',
    [ButtonColor.REVEAL_PRIMARY]: (selected) =>
      selected
        ? 'text-leland-primary bg-transparent border-transparent shadow-transparent'
        : 'text-leland-primary bg-transparent disabled:text-leland-gray-light disabled:bg-transparent border-transparent shadow-transparent',
    [ButtonColor.REVEAL_WHITE]: (selected) =>
      selected
        ? 'text-leland-white bg-leland-white/10 border-transparent shadow-transparent'
        : 'text-leland-white bg-transparent disabled:text-leland-white/50 disabled:bg-transparent hover:bg-leland-white/10 border-transparent shadow-transparent',
    [ButtonColor.LIGHT_RED]: (selected) =>
      selected
        ? 'text-leland-red bg-leland-red-light border-transparent shadow-transparent'
        : 'text-leland-red bg-leland-red-light disabled:text-leland-gray-light disabled:bg-transparent hover:bg-leland-red-light-hover border-transparent shadow-transparent',
    [ButtonColor.SECONDARY]: (selected) =>
      selected
        ? 'text-leland-gray-dark bg-white border-leland-gray-dark shadow-leland-gray-dark'
        : 'text-leland-gray-dark bg-white disabled:bg-white border-leland-gray-stroke hover:bg-leland-gray-hover shadow-transparent',
    [ButtonColor.SECONDARY_NEUTRAL]: (selected) =>
      selected
        ? 'text-leland-gray-dark bg-white border-leland-gray-dark shadow-leland-gray-dark'
        : 'btn--gray-borderless text-leland-gray-dark bg-leland-gray-hover disabled:bg-leland-gray-hover border-leland-gray-hover hover:bg-leland-gray-stroke hover:border-leland-gray-stroke shadow-transparent',
    // TERTIARY reads as an inline text link (dotted underline) — no hover box.
    [ButtonColor.TERTIARY]: (selected) =>
      selected
        ? 'text-leland-gray-dark bg-transparent border-transparent shadow-transparent underline decoration-dotted decoration-[1.5px] underline-offset-4'
        : 'text-leland-gray-dark bg-transparent disabled:text-leland-gray-light disabled:bg-transparent border-transparent shadow-transparent underline decoration-dotted decoration-[1.5px] underline-offset-4',
    [ButtonColor.DESTRUCTIVE]: (selected) =>
      selected
        ? 'text-leland-red bg-white border-leland-red shadow-leland-red'
        : 'text-white bg-leland-red disabled:bg-leland-red border-leland-red hover:bg-leland-red-hover hover:border-leland-red-hover shadow-transparent',
  };

// Production sizes: monorepo text-sm = 0.75rem, text-base = 0.875rem.
const ButtonSizeToStyles: Record<ButtonSize, string> = {
  [ButtonSize.SMALL]: 'p-2 text-[0.75rem] leading-none space-x-1',
  [ButtonSize.MEDIUM]: 'p-3 text-[0.875rem] space-x-2',
  [ButtonSize.LARGE]: 'p-4 text-[0.875rem] space-x-2',
};

export const ButtonSizeToIconStyles: Record<ButtonSize, string> = {
  [ButtonSize.SMALL]: 'size-3.5',
  [ButtonSize.MEDIUM]: 'size-5',
  [ButtonSize.LARGE]: 'size-5',
};

const ButtonWidthToStyles: Record<ButtonWidth, string> = {
  [ButtonWidth.FULL]: 'flex w-full',
  [ButtonWidth.AUTO]: 'inline-flex',
  [ButtonWidth.FULL_MOBILE]: 'flex w-full sm:w-auto sm:inline-flex',
};

const ButtonRoundedSideToStyles: Record<
  ButtonRoundedSide,
  (rounded: boolean, selected?: boolean) => string
> = {
  [ButtonRoundedSide.LEFT]: (rounded, selected) =>
    `${rounded ? 'rounded-l-full' : 'rounded-l-lg'} ${selected ? '' : 'border-r-0'}`,
  [ButtonRoundedSide.RIGHT]: (rounded) =>
    `${rounded ? 'rounded-r-full' : 'rounded-r-lg'} border-l-leland-gray-stroke`,
  [ButtonRoundedSide.BOTH]: (rounded) => (rounded ? 'rounded-full' : 'rounded-lg'),
  [ButtonRoundedSide.NONE]: () => 'border-l-leland-gray-stroke border-r-0',
};

interface ButtonStyleProps {
  buttonColor: ButtonColor;
  size: ButtonSize;
  width: ButtonWidth;
  fontWeight: FontWeight;
  roundedSide?: ButtonRoundedSide;
  rounded?: boolean;
  selected?: boolean;
}

export const getButtonStyles = ({
  buttonColor,
  size,
  width,
  fontWeight,
  rounded = false,
  selected,
  roundedSide = ButtonRoundedSide.BOTH,
}: ButtonStyleProps): string =>
  `sm:whitespace-nowrap leading-tight items-center justify-center border shadow-border ${ButtonColorToStyles[
    buttonColor
  ](selected)} ${ButtonSizeToStyles[size]} ${ButtonWidthToStyles[width]} ${
    FontWeightToStyles[fontWeight]
  } ${ButtonRoundedSideToStyles[roundedSide](rounded, selected)}`;

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'style' | 'color' | 'disabled' | 'aria-label' | 'children'
  > {
  buttonColor?: ButtonColor;
  disabled?: boolean;
  fontWeight?: ButtonFontWeight;
  label: string;
  LeftIcon?: FC<SVGProps<SVGSVGElement>>;
  CustomLeftIcon?: FC<{ iconClassName?: string }>;
  RightIcon?: FC<SVGProps<SVGSVGElement>>;
  CustomRightIcon?: FC<{ iconClassName?: string }>;
  rounded?: boolean;
  selected?: boolean;
  hideLabel?: boolean;
  hideLabelBelow?: Breakpoints;
  size?: ButtonSize;
  width?: ButtonWidth;
  roundedSide?: ButtonRoundedSide;
  href?: string;
  useSolidHover?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      buttonColor = ButtonColor.WHITE,
      disabled,
      fontWeight = FontWeight.SEMIBOLD,
      label,
      LeftIcon,
      RightIcon,
      CustomLeftIcon,
      CustomRightIcon,
      rounded,
      selected,
      hideLabel,
      hideLabelBelow,
      size = ButtonSize.MEDIUM,
      width = ButtonWidth.AUTO,
      roundedSide = ButtonRoundedSide.BOTH,
      href,
      useSolidHover,
      ...props
    },
    ref,
  ) => {
    const labelVisibilityClass =
      hideLabelBelow != null
        ? `hidden ${breakpointToTailwind(hideLabelBelow)}:inline`
        : '';

    const content = (
      <button
        type="button"
        {...props}
        className={`${getButtonStyles({
          buttonColor,
          size,
          width,
          fontWeight,
          rounded,
          selected,
          roundedSide,
        })} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${useSolidHover ? 'hover:bg-leland-gray-solid-hover' : ''}`}
        aria-label={label}
        disabled={disabled}
        ref={ref}
      >
        {CustomLeftIcon ? (
          <CustomLeftIcon iconClassName={ButtonSizeToIconStyles[size]} />
        ) : LeftIcon ? (
          <LeftIcon className={ButtonSizeToIconStyles[size]} />
        ) : null}
        {hideLabel ? null : (
          <span className={labelVisibilityClass}>{label}</span>
        )}
        {CustomRightIcon ? (
          <CustomRightIcon iconClassName={ButtonSizeToIconStyles[size]} />
        ) : RightIcon ? (
          <RightIcon className={ButtonSizeToIconStyles[size]} />
        ) : null}
      </button>
    );
    return href ? <Link to={href}>{content}</Link> : content;
  },
);
Button.displayName = 'Button';
