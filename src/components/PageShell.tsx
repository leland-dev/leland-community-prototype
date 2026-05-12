import type { ReactNode } from "react";

type PageShellProps = {
  variant?: "standard" | "thin";
  leftSidebar?: ReactNode;
  leftSidebarMobile?: boolean;
  rightSidebar?: ReactNode;
  rightSidebarWidth?: number;
  contentMaxWidth?: number;
  // When true, the right sidebar stacks below main content at narrow viewports
  // instead of being hidden.
  stackRight?: boolean;
  children: ReactNode;
};

export default function PageShell({
  variant = "standard",
  leftSidebar,
  leftSidebarMobile = false,
  rightSidebar,
  rightSidebarWidth = 300,
  contentMaxWidth,
  stackRight = false,
  children,
}: PageShellProps) {
  if (variant === "thin") {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-4 sm:py-10 sm:px-6">
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
  const leftClass = leftSidebarMobile
    ? "w-full shrink-0 md:w-[300px] md:sticky md:top-5 md:self-start"
    : "hidden w-[300px] shrink-0 sticky top-5 self-start min-[960px]:block";

  // stackRight: always visible, becomes sticky column at the breakpoint.
  // Default: hidden until the breakpoint.
  const rightClass = stackRight
    ? hasBoth
      ? "w-full shrink-0 min-[1200px]:w-auto min-[1200px]:sticky min-[1200px]:top-5 min-[1200px]:self-start"
      : "w-full shrink-0 min-[960px]:w-auto min-[960px]:sticky min-[960px]:top-5 min-[960px]:self-start"
    : hasBoth
      ? "hidden shrink-0 sticky top-5 self-start min-[1200px]:block"
      : "hidden shrink-0 sticky top-5 self-start min-[960px]:block";

  const effectiveMaxWidth = contentMaxWidth ?? 800;

  // stackRight needs a column-first layout on narrow viewports
  const rowClass = stackRight
    ? `flex flex-col items-stretch min-[960px]:flex-row min-[960px]:items-start ${leftSidebarMobile ? "md:flex-row" : ""}`
    : `flex items-start ${leftSidebarMobile ? "flex-col md:flex-row" : ""}`;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-4 sm:py-10 sm:px-6">
      <div className={rowClass} style={{ gap: 40 }}>
        {hasLeft && <aside className={leftClass}>{leftSidebar}</aside>}
        <div
          className="min-w-0"
          style={(hasLeft || hasRight) ? { width: "100%", maxWidth: effectiveMaxWidth } : { flex: "1 1 0%" }}
        >
          {children}
        </div>
        {hasRight && (
          <aside className={rightClass} style={stackRight ? undefined : { width: rightSidebarWidth }}>
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
