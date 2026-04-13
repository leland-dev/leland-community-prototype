import type { ReactNode } from "react";

/* ── SidebarGroup ── */

interface SidebarGroupProps {
  label: string;
  href?: string;
  children: ReactNode;
}

export function SidebarGroup({ label, href, children }: SidebarGroupProps) {
  const header = (
    <div className="flex items-center gap-1.5 text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-opacity hover:opacity-80">
      {label}
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div>
      {href ? (
        <a href={href} className="inline-flex">{header}</a>
      ) : (
        <div className="inline-flex cursor-pointer">{header}</div>
      )}
      <div className="mt-[6px] flex flex-col">
        {children}
      </div>
    </div>
  );
}

/* ── SidebarCard ── */

export type SidebarCardVariant = "event" | "topic" | "coach" | "course" | "category" | "resource";

interface SidebarCardProps {
  variant: SidebarCardVariant;
  image?: string;
  icon?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  /** Optional review row rendered below the subtitle */
  reviews?: { rating: number; count: number };
  right?: ReactNode;
  /** Event-only: adds the inset red border on the thumbnail */
  live?: boolean;
  /** Vertical alignment of content relative to the leading element */
  align?: "center" | "top";
}

function ReviewRow({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="#FFCB47" className="shrink-0">
        <path d="M7 1l1.8 3.65L13 5.3l-3 2.84.7 4.02L7 10.36 3.3 12.16l.7-4.02-3-2.84 4.2-.65L7 1z" />
      </svg>
      <span>{rating.toFixed(1)} <span className="text-[#9B9B9B]">({count})</span></span>
    </span>
  );
}

function Leading({ variant, image, icon, live }: Pick<SidebarCardProps, "variant" | "image" | "icon" | "live">) {
  if ((variant === "event" || variant === "course" || variant === "resource") && image) {
    if (variant === "event" && live) {
      return (
        <div className="relative h-[44px] w-[80px] shrink-0">
          <img src={image} alt="" className="h-full w-full rounded-[4px] object-cover" />
          <div className="pointer-events-none absolute inset-0 rounded-[4px] border-[2px] border-[#FB5A42]" />
        </div>
      );
    }
    return <img src={image} alt="" className="h-[44px] w-[80px] shrink-0 rounded-[4px] object-cover" />;
  }
  if (variant === "coach" && image) {
    return <img src={image} alt="" className="h-[36px] w-[36px] shrink-0 rounded-full object-cover" />;
  }
  if (variant === "category" && image) {
    return <img src={image} alt="" className="h-[44px] w-[44px] shrink-0 rounded-[4px] object-cover" />;
  }
  if (variant === "topic" && icon) {
    return <div className="shrink-0">{icon}</div>;
  }
  return null;
}

export default function SidebarCard({
  variant,
  image,
  icon,
  title,
  subtitle,
  reviews,
  right,
  live,
  align = "center",
}: SidebarCardProps) {
  return (
    <div className={`group flex cursor-pointer py-[10px] transition-[padding] duration-300 ease-out hover:pl-[4px] ${variant === "topic" ? "gap-2" : "gap-3"} ${align === "top" ? "items-start" : "items-center"}`}>
      <Leading variant={variant} image={image} icon={icon} live={live} />

      {/* Center: title + subtitle */}
      <div className={`flex min-w-0 flex-1 flex-col ${variant === "category" ? "gap-[2px]" : "gap-[4px]"}`}>
        <p className="line-clamp-2 text-[16px] font-medium leading-[1.2] text-gray-dark hover:underline hover:decoration-[1px] hover:underline-offset-[2px]">{title}</p>
        <p className="truncate text-[14px] font-normal leading-none text-[#707070]">{subtitle}</p>
        {reviews && (
          <p className="truncate text-[14px] font-normal leading-none text-[#707070]">
            <ReviewRow rating={reviews.rating} count={reviews.count} />
          </p>
        )}
      </div>

      {/* Right: optional element */}
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
