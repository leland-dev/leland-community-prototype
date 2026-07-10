import type { FC, SVGProps } from 'react';

export const IconArrowUpChartGrowth: FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.8333 8.16797L11.3333 16.168L7.58325 12.168L3.83325 16.168"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M12.8333 8.16797H18.8333V14.168"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
