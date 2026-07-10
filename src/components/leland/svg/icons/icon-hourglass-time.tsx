import type { FC, SVGProps } from 'react';

export const IconHourglassTime: FC<SVGProps<SVGSVGElement>> = ({
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
        d="M6 4H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M6 20H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M7.99927 4V8C7.99927 8.63 8.29527 9.222 8.79927 9.6L11.9993 12L15.1993 9.6C15.7033 9.222 15.9993 8.63 15.9993 8V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M15.9993 20V16C15.9993 15.37 15.7033 14.778 15.1993 14.4L11.9993 12L8.79927 14.4C8.29527 14.778 7.99927 15.37 7.99927 16V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
