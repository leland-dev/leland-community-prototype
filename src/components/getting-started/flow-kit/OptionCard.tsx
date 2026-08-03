import type { ReactNode } from "react";

type OptionCardProps = {
  name: string;
  desc?: string;
  selected?: boolean;
  onClick: () => void;
};

// The flows' dominant input: a selectable card with a name + supporting line.
export function OptionCard({ name, desc, selected = false, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-1 rounded-lg border-2 px-5 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
        selected
          ? "border-leland-gray-dark bg-white shadow-sm"
          : "border-transparent bg-leland-gray-hover hover:bg-leland-gray-stroke"
      }`}
    >
      <span className="leland-paragraph-base font-semibold text-leland-gray-dark">
        {name}
      </span>
      {desc ? (
        <span className="leland-paragraph-sm text-leland-gray-light">{desc}</span>
      ) : null}
    </button>
  );
}

export function OptionGrid({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <div className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {children}
    </div>
  );
}
