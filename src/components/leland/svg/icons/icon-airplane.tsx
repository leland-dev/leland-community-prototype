import type { FC, SVGProps } from 'react';

export const IconAirplane: FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 16"
      fill="none"
    >
      <path
        d="M6.29501 7.12352L7.77084 13.7644C7.95501 14.5919 9.05418 14.7702 9.49001 14.0435L16.3642 2.58602C16.74 1.96102 16.29 1.16602 15.5608 1.16602H2.60168C1.76584 1.16602 1.34751 2.17602 1.93834 2.76685L6.29501 7.12352Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M16.3667 1.63281L6.29169 7.12448"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
