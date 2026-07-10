import type { FC, SVGProps } from 'react';

export const IconChat: FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.151 16.396C3.421 15.096 3 13.598 3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21C10.402 21 8.904 20.579 7.604 19.849L3 21L4.151 16.396Z"
        stroke="currentColor"
        strokeWidth="1.5882"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
