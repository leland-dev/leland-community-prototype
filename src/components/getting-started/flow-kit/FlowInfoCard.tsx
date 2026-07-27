import type { ReactNode } from "react";

type FlowInfoCardProps = {
  tone?: "blue" | "neutral";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

// The blue/tan callout used for IT-approval notices, permission-wall hints, etc.
export function FlowInfoCard({
  tone = "neutral",
  icon,
  children,
  className = "",
}: FlowInfoCardProps) {
  const toneClasses =
    tone === "blue"
      ? "bg-leland-blue-light text-leland-blue-dark"
      : "bg-leland-beige text-leland-gray-dark";
  return (
    <div className={`flex items-start gap-3 rounded-xl px-4 py-3.5 ${toneClasses} ${className}`}>
      {icon ? <div className="shrink-0 text-lg leading-none">{icon}</div> : null}
      <div className="min-w-0 flex-1 leland-paragraph-base">{children}</div>
    </div>
  );
}
