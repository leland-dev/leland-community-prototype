import type { FC, SVGProps } from 'react';

export const IconMedicalCross: FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 9H21V15H15V21H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M9 15H3V9H9V3H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
