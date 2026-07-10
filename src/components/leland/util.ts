// Ported from @leland/ui-library (util/font.ts, util/breakpoints.ts,
// types/utils.ts) — shared enums the Leland components depend on.

export enum FontWeight {
  NORMAL = 'NORMAL',
  MEDIUM = 'MEDIUM',
  SEMIBOLD = 'SEMIBOLD',
}

export const FontWeightToStyles: Record<FontWeight, string> = {
  [FontWeight.NORMAL]: 'font-normal',
  [FontWeight.MEDIUM]: 'font-medium',
  [FontWeight.SEMIBOLD]: 'font-semibold',
};

export enum BreakpointPixelValue {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  '2XL' = 1536,
}

export enum Breakpoints {
  SM = `(min-width: ${BreakpointPixelValue.SM}px)`,
  MD = `(min-width: ${BreakpointPixelValue.MD}px)`,
  LG = `(min-width: ${BreakpointPixelValue.LG}px)`,
  XL = `(min-width: ${BreakpointPixelValue.XL}px)`,
  '2XL' = `(min-width: ${BreakpointPixelValue['2XL']}px)`,
}

export const breakpointToTailwind = (breakpoint: Breakpoints) => {
  switch (breakpoint) {
    case Breakpoints.SM:
      return 'sm';
    case Breakpoints.MD:
      return 'md';
    case Breakpoints.LG:
      return 'lg';
    case Breakpoints.XL:
      return 'xl';
    case Breakpoints['2XL']:
      return '2xl';
  }
};

export type PickEnum<T, K extends T> = {
  [P in keyof K]: P extends K ? P : never;
};
