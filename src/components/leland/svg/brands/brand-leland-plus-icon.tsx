import type { FC, SVGProps } from 'react';

export const BrandLelandPlusIcon: FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      {...props}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4165_7788)">
        <rect width="48" height="48" fill="white" />
        <rect width="48.1875" height="48.1875" fill="black" />
        <g filter="url(#filter0_i_4165_7788)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M35.2129 12.6328L18.272 17.7151L12.625 35.2207L30.1306 30.1384L35.2129 12.6328ZM23.9211 26.7485C25.4805 26.7485 26.7446 25.4844 26.7446 23.925C26.7446 22.3657 25.4805 21.1016 23.9211 21.1016C22.3618 21.1016 21.0977 22.3657 21.0977 23.925C21.0977 25.4844 22.3618 26.7485 23.9211 26.7485Z"
            fill="url(#paint0_linear_4165_7788)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_i_4165_7788"
          x="12.625"
          y="12.6328"
          width="22.5898"
          height="22.5859"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.651108" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_4165_7788"
          />
        </filter>
        <linearGradient
          id="paint0_linear_4165_7788"
          x1="23.5"
          y1="18"
          x2="25.5"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E1BB63" />
          <stop offset="0.471523" stopColor="#F2E4A7" />
          <stop offset="1" stopColor="#CEA351" />
        </linearGradient>
        <clipPath id="clip0_4165_7788">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
