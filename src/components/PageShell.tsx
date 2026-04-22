import type { ReactNode } from "react";

type PageShellProps = {
  variant?: "standard" | "thin";
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  rightSidebarWidth?: number;
  contentMaxWidth?: number;
  leftMaxWidth?: number;
  sidebarAlign?: "start" | "between";
  children: ReactNode;
};

export default function PageShell({
  variant = "standard",
  leftSidebar,
  rightSidebar,
  rightSidebarWidth = 300,
  contentMaxWidth,
  leftMaxWidth,
  sidebarAlign = "between",
  children,
}: PageShellProps) {
  if (variant === "thin") {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-8 sm:py-10 sm:px-6">
        {children}
      </div>
    );
  }

  const hasLeft = leftSidebar != null;
  const hasRight = rightSidebar != null;
  const hasBoth = hasLeft && hasRight;

  // Right sidebar in a 3-col layout needs more room, so it appears at a
  // larger viewport than a sidebar in a 2-col layout. Any single sidebar
  // (2-col) shows at the smaller threshold.
  // NOTE: keep full class strings literal so Tailwind's JIT scanner picks them
  // up. Building arbitrary variants like `min-[1200px]:block` via template
  // strings causes the rule to be silently dropped from the generated CSS.
  const leftClass = "hidden w-[300px] shrink-0 sticky top-5 self-start min-[960px]:block";
  const rightClass = hasBoth
    ? "hidden shrink-0 sticky top-5 self-start min-[1200px]:block"
    : "hidden shrink-0 sticky top-5 self-start min-[960px]:block";

  if (leftMaxWidth) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:py-10 sm:px-6">
        <div className="flex items-start">
          {hasLeft && <aside className={leftClass}>{leftSidebar}</aside>}
          <div className="min-w-0" style={{ flex: `0 1 ${leftMaxWidth}px` }}>
            {children}
          </div>
          {hasRight && <div className="hidden min-[960px]:block" style={{ flex: '1 0 40px' }} />}
          {hasRight && <aside className={rightClass}>{rightSidebar}</aside>}
        </div>
      </div>
    );
  }

  const effectiveMaxWidth = contentMaxWidth ?? 800;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:py-10 sm:px-6">
      <div className="flex items-start justify-between" style={{ gap: 40 }}>
        {hasLeft && <aside className={leftClass}>{leftSidebar}</aside>}
        <div
          className="min-w-0"
          style={(hasLeft || hasRight) ? { width: effectiveMaxWidth, maxWidth: effectiveMaxWidth } : { flex: "1 1 0%" }}
        >
          {children}
        </div>
        {hasRight && <aside className={rightClass} style={{ width: rightSidebarWidth }}>{rightSidebar}</aside>}
      </div>
    </div>
  );
}
