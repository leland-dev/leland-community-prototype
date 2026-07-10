import type { FC, SVGProps } from 'react';

export const IconCalendarTurning: FC<SVGProps<SVGSVGElement>> = ({
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
        d="M15 21V17C15 16.4696 15.2107 15.9609 15.5858 15.5858C15.9609 15.2107 16.4696 15 17 15H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M3 7.5V18C3 18.7956 3.31607 19.5587 3.87868 20.1213C4.44129 20.6839 5.20435 21 6 21H15.7574C16.553 21 17.3161 20.6839 17.8787 20.1213L20.1213 17.8787C20.6839 17.3161 21 16.553 21 15.7574V7.5C21 6.70435 20.6839 5.94129 20.1213 5.37868C19.5587 4.81607 18.7956 4.5 18 4.5H6C5.20435 4.5 4.44129 4.81607 3.87868 5.37868C3.31607 5.94129 3 6.70435 3 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M16.5 3V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        d="M7.5 3V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
