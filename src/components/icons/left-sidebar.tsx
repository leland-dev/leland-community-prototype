// Custom sidebar open/close icons (from design, not yet in the monorepo icon
// library — add via `pnpm standardize-svgs && pnpm build-svgs` there, then
// these can move into components/leland/svg/icons). White background rect
// removed and strokes converted to currentColor to match library icons.
import type { FC, SVGProps } from 'react';

export const IconLeftSidebarClose: FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      {...props}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 21V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <rect
        x="4"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></rect>
      <path
        d="M17 15L14 12L17 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </svg>
  );
};

export const IconLeftSidebarOpen: FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      {...props}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 21V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <rect
        x="4"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></rect>
      <path
        d="M14 15L17 12L14 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
