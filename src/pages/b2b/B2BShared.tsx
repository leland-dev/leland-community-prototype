import { useState, useRef, useEffect, type ReactNode } from "react";

// ── Pill ──

const pillStyles: Record<string, string> = {
  green: "bg-primary-xlight text-dark-green",
  blue: "bg-[#eff5ff] text-blue",
  orange: "bg-[#fdf0e1] text-orange",
  red: "bg-[#fee6e3] text-red",
  purple: "bg-[rgba(45,37,166,0.1)] text-[#2d25a6]",
  gray: "bg-gray-hover text-gray-light",
  dark: "bg-[rgba(24,84,64,0.1)] text-dark-green",
};

export function Pill({ variant, children }: { variant: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-[10px] py-1 text-[11px] font-medium ${pillStyles[variant] || pillStyles.gray}`}
    >
      {children}
    </span>
  );
}

// ── StatCard ──

export function StatCard({
  label,
  value,
  sub,
  valueColor,
  subColor,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  valueColor?: string;
  subColor?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-stroke bg-white p-[18px_20px]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.07em] text-gray-xlight">
        {label}
      </div>
      <div className={`text-[28px] font-bold leading-none ${valueColor || "text-gray-dark"}`}>
        {value}
      </div>
      {sub && (
        <div className={`mt-1 text-[12px] ${subColor || "text-gray-light"}`}>{sub}</div>
      )}
    </div>
  );
}

// ── ProgressBar ──

export function ProgressBar({
  percent,
  color = "bg-primary",
}: {
  percent: number;
  color?: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-[10px]">
      <div className="h-[6px] flex-1 overflow-hidden rounded-[3px] bg-gray-stroke">
        <div className={`h-full rounded-[3px] ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="w-9 text-right text-[12px] font-semibold text-gray-light">
        {percent}%
      </span>
    </div>
  );
}

// ── Avatar ──

export function Avatar({
  initials,
  bg = "bg-primary-xlight",
  color = "text-dark-green",
  size = 30,
}: {
  initials: string;
  bg?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${bg} ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

// ── SearchToolbar ──

export function SearchToolbar({
  placeholder,
  onSearch,
  filters,
  activeFilter,
  onFilter,
  children,
}: {
  placeholder: string;
  onSearch: (q: string) => void;
  filters: { key: string; label: string }[];
  activeFilter: string;
  onFilter: (key: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-[10px] border-b border-gray-stroke px-4 py-[14px]">
      <div className="relative max-w-[300px] flex-1">
        <svg
          className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-gray-xlight"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          className="w-full rounded-lg border border-gray-stroke bg-gray-hover py-[7px] pl-8 pr-[10px] text-[13px] text-gray-dark outline-none focus:border-primary focus:bg-white"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilter(f.key)}
            className={`rounded-full border px-3 py-[5px] text-[12px] font-medium transition-colors ${
              activeFilter === f.key
                ? "border-dark-green bg-dark-green text-white"
                : "border-gray-stroke bg-white text-gray-light hover:bg-gray-hover"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

// ── ActionMenu ──

export function ActionMenu({ items }: { items: { label: string; danger?: boolean; onClick?: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="rounded-md border border-gray-stroke bg-gray-hover px-[9px] py-1 text-[16px] font-bold leading-none tracking-[1px] text-gray-xlight hover:bg-gray-stroke hover:text-gray-dark"
      >
        &middot;&middot;&middot;
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[190px] overflow-hidden rounded-[9px] border border-gray-stroke bg-white shadow-lg">
          {items.map((item, i) =>
            item.label === "---" ? (
              <div key={i} className="mx-0 my-[3px] h-px bg-gray-stroke" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={`flex w-full items-center gap-[9px] px-[14px] py-[9px] text-left text-[13px] ${
                  item.danger
                    ? "text-red hover:bg-[#fee6e3]"
                    : "text-gray-dark hover:bg-gray-hover"
                }`}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ── Card ──

export function Card({
  header,
  headerRight,
  children,
  className = "",
  headerPadding = "py-4",
  headerClassName = "",
}: {
  header?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
  headerPadding?: string;
  headerClassName?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-stroke bg-white ${className}`}>
      {header && (
        <div className={`flex items-center justify-between border-b border-gray-stroke px-5 ${headerPadding} ${headerClassName}`}>
          <div>{header}</div>
          {headerRight}
        </div>
      )}
      {children}
    </div>
  );
}
