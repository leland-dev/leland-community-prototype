// Full-width pivot/tab bar. Mirrors the profile template's tab bar
// (MyLelandProfileView): equal-width tabs, a 2px active underline, 16px medium
// labels, and an optional count badge.
export type PivotTab<T extends string> = {
  id: T;
  label: string;
  count?: number;
};

export function Pivot<T extends string>({ tabs, active, onChange, className = "", fill = true }: {
  tabs: PivotTab<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
  // When true (default) tabs stretch to fill the width equally; when false each
  // tab hugs its label and they sit left-aligned with a gap between them.
  fill?: boolean;
}) {
  return (
    <div className={`flex border-b border-gray-stroke ${fill ? "" : "gap-8"} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`cursor-pointer py-3 text-center transition-colors ${fill ? "flex-1" : ""} ${
            active === tab.id
              ? "border-b-2 border-gray-dark text-gray-dark"
              : "border-b-2 border-transparent text-gray-light hover:text-gray-dark"
          }`}
        >
          <span className="inline-flex items-center gap-1.5 text-[16px] font-medium">
            {tab.label}
            {tab.count != null && (
              <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#222222]/[0.06] px-[8px] py-[2px] text-[12px] font-medium text-gray-light/80">
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
