import type { FC, SVGProps } from 'react';

export const IconEllipse: FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      {...props}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="7"
        cy="7"
        r="3"
        fill="currentColor"
        vectorEffect="non-scaling-stroke"
      ></circle>
      <circle
        cx="7"
        cy="7"
        r="5"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      ></circle>
    </svg>
  );
};
