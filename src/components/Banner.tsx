import React from "react";

function InlineChevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      className="inline-block shrink-0 translate-y-[-1px] align-middle text-gray-light"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 5l5 5-5 5" />
    </svg>
  );
}

type BannerDecoration =
  | { type: "emoji"; value: string }
  | { type: "icon"; src: string; alt?: string };

type BannerProps = {
  title: React.ReactNode;
  subtext?: React.ReactNode;
  href: string;
  decoration?: BannerDecoration;
  variant?: "card" | "plain" | "timeline";
  className?: string;
};

export function Banner({ title, subtext, href, decoration, variant = "card", className = "" }: BannerProps) {
  const cardStyles = "rounded-xl bg-gray-hover px-6 py-5 shadow-card";

  const decorationNode = decoration && (
    decoration.type === "emoji" ? (
      <span className="shrink-0 text-[22px] leading-none">{decoration.value}</span>
    ) : (
      <img src={decoration.src} alt={decoration.alt ?? ""} className="h-6 w-6 shrink-0" />
    )
  );

  if (variant === "timeline") {
    return (
      <a href={href} className={`flex items-start gap-4 py-4 no-underline ${className}`}>
        <div className="flex w-8 shrink-0 items-start justify-center pt-0.5">
          {decorationNode}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">
            {title} <InlineChevron />
          </p>
          {subtext && (
            <p className="mt-1 leading-[1.2] text-gray-light">{subtext}</p>
          )}
        </div>
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`no-underline ${variant === "card" ? `@container flex flex-col gap-2 @[320px]:flex-row @[320px]:items-center @[320px]:gap-3 ${cardStyles}` : "flex w-full flex-row items-center gap-3"} ${className}`}
    >
      {decorationNode}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
        <p className="shrink-0 text-[14px] font-medium leading-[1.2] text-gray-dark">
          {title} <InlineChevron />
        </p>
        {subtext && (
          <p className="text-[14px] leading-[1.2] text-gray-light">{subtext}</p>
        )}
      </div>
    </a>
  );
}
