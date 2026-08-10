import type { ReactNode } from "react";

type PageShellProps = {
  variant?: "standard" | "thin";
  leftSidebar?: ReactNode;
  leftSidebarMobile?: boolean;
  rightSidebar?: ReactNode;
  rightSidebarWidth?: number;
  rightSidebarTop?: number;
  contentMaxWidth?: number;
  // Full-bleed 3-col mode: the outer container fills the window (no 1280px cap)
  // and the columns are pushed to the edges via justify-between.
  edgeToEdge?: boolean;
  // Overrides the width of BOTH sidebars (defaults to the per-side widths).
  sidebarWidth?: number;
  // When true, the right sidebar stacks below main content at narrow viewports
  // instead of being hidden.
  stackRight?: boolean;
  // Override the outer vertical padding classes (defaults to "py-4 sm:py-10").
  paddingYClassName?: string;
  // Override the outer horizontal padding classes (defaults to "px-4 sm:px-6").
  paddingXClassName?: string;
  children: ReactNode;
};

export default function PageShell({
  variant = "standard",
  leftSidebar,
  leftSidebarMobile = false,
  rightSidebar,
  rightSidebarWidth = 300,
  rightSidebarTop,
  contentMaxWidth,
  edgeToEdge = false,
  sidebarWidth,
  stackRight = false,
  paddingYClassName = "py-4 sm:py-10",
  paddingXClassName = "px-4 sm:px-6",

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
  //
  // Sticky offset clears the 61px sticky TopNav (61 + 20px gap = 81px) so the
  // columns pin BELOW the nav instead of scrolling up underneath it. Each
  // sidebar also caps its height to the remaining viewport and scrolls its own
  // overflow, so a tall sidebar stays fully reachable on short screens rather
  // than being clipped.
  // NOTE: keep full class strings literal so Tailwind's JIT scanner picks them
  // up. Building arbitrary variants like `min-[1200px]:block` via template
  // strings causes the rule to be silently dropped from the generated CSS.
  const leftClass = leftSidebarMobile
    ? "w-full shrink-0 md:w-[300px] md:sticky md:top-[81px] md:self-start md:max-h-[calc(100vh-101px)] md:overflow-y-auto"
    : "hidden w-[300px] shrink-0 sticky top-[81px] self-start max-h-[calc(100vh-101px)] overflow-y-auto min-[960px]:block";

  // stackRight: always visible, becomes sticky column at the breakpoint.
  // Default: hidden until the breakpoint.
  const rightClass = stackRight
    ? hasBoth
      ? "w-full shrink-0 min-[1200px]:w-auto min-[1200px]:sticky min-[1200px]:top-[81px] min-[1200px]:self-start min-[1200px]:max-h-[calc(100vh-101px)] min-[1200px]:overflow-y-auto"
      : "w-full shrink-0 min-[960px]:w-auto min-[960px]:sticky min-[960px]:top-[81px] min-[960px]:self-start min-[960px]:max-h-[calc(100vh-101px)] min-[960px]:overflow-y-auto"
    : hasBoth
      ? "hidden shrink-0 sticky top-[81px] self-start max-h-[calc(100vh-101px)] overflow-y-auto min-[1200px]:block"
      : "hidden shrink-0 sticky top-[81px] self-start max-h-[calc(100vh-101px)] overflow-y-auto min-[960px]:block";

  const effectiveMaxWidth = contentMaxWidth ?? 800;

  // stackRight needs a column-first layout on narrow viewports.
  // Right-only layout uses justify-between so extra space falls between the
  // content and sidebar rather than after the sidebar.
  const rowClass = stackRight
    ? `flex flex-col items-stretch min-[960px]:flex-row min-[960px]:items-start ${leftSidebarMobile ? "md:flex-row" : ""}`
    : `flex items-start ${leftSidebarMobile ? "flex-col md:flex-row" : ""} ${(edgeToEdge || (hasRight && !hasLeft)) ? "justify-between" : ""}`;

  const outerClass = edgeToEdge ? "w-full" : "mx-auto max-w-[1280px]";
  const effectiveRightWidth = sidebarWidth ?? rightSidebarWidth;

  return (
    <div className={`${outerClass} ${paddingXClassName} ${paddingYClassName}`}>
      <div className={rowClass} style={{ gap: 40 }}>
        {hasLeft && (
          <aside className={leftClass} style={sidebarWidth != null ? { width: sidebarWidth } : undefined}>
            {leftSidebar}
          </aside>
        )}
        <div
          className="min-w-0"
          style={(hasLeft || hasRight) ? { flex: "1 1 0%", maxWidth: effectiveMaxWidth } : { flex: "1 1 0%" }}
        >
          {children}
        </div>
        {hasRight && (
          <aside className={rightClass} style={{ ...(!stackRight ? { width: effectiveRightWidth } : {}), ...(rightSidebarTop != null ? { top: rightSidebarTop } : {}) }}>
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
