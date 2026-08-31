import type { CSSProperties, ReactNode } from "react";

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
  // Left-sidebar-only overrides (win over sidebarWidth / the default top).
  // leftSidebarTop also re-derives the sidebar's max-height so it keeps an
  // equal gap at the bottom (top + bottom of the same size).
  leftSidebarWidth?: number;
  leftSidebarTop?: number;
  // When true, the left sidebar is pinned to the viewport with position:fixed
  // (full height, never scrolls with the page). An in-flow spacer reserves its
  // column width. Assumes an edge-to-edge layout with the standard horizontal
  // padding (px-4), so the fixed sidebar aligns to a 16px left inset.
  leftSidebarFixed?: boolean;
  // When true, the right sidebar stacks below main content at narrow viewports
  // instead of being hidden.
  stackRight?: boolean;
  // Override the outer vertical padding classes (defaults to "py-4 sm:py-10").
  paddingYClassName?: string;
  // Override the outer horizontal padding classes (defaults to "px-4 sm:px-6").
  paddingXClassName?: string;
  // Gap (px) between the columns. Defaults to 40.
  columnGap?: number;
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
  leftSidebarWidth,
  leftSidebarTop,
  leftSidebarFixed = false,
  stackRight = false,
  paddingYClassName = "py-4 sm:py-10",
  paddingXClassName = "px-4 sm:px-6",
  columnGap = 40,

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
  const effectiveLeftWidth = leftSidebarWidth ?? sidebarWidth;
  // Inline overrides for the left aside — win over the literal Tailwind classes
  // in leftClass (width / sticky top / max-height).
  const leftStyle: CSSProperties = {
    ...(effectiveLeftWidth != null ? { width: effectiveLeftWidth } : {}),
    ...(leftSidebarTop != null
      ? {
          top: leftSidebarTop,
          // Fixed height (not just a cap) so an inner flex column can pin a
          // footer to the bottom while the rest scrolls. Only the top offset is
          // subtracted — the column runs to the viewport bottom, and the pinned
          // profile footer supplies its own bottom padding.
          height: `calc(100vh - ${leftSidebarTop}px)`,
          maxHeight: `calc(100vh - ${leftSidebarTop}px)`,
        }
      : {}),
  };

  return (
    <div className={`${outerClass} ${paddingXClassName} ${paddingYClassName}`}>
      <div className={rowClass} style={{ gap: columnGap }}>
        {hasLeft && (
          leftSidebarFixed ? (
            <>
              {/* Spacer reserves the sidebar's column width in the flow… */}
              <div aria-hidden className="hidden shrink-0 min-[960px]:block" style={{ width: effectiveLeftWidth }} />
              {/* …while the sidebar itself is pinned to the viewport, so it's
                  always full height and never scrolls with the page. */}
              <aside
                className="fixed z-20 hidden min-[960px]:block"
                style={{
                  left: 16,
                  top: leftSidebarTop ?? 0,
                  width: effectiveLeftWidth,
                  height: `calc(100vh - ${leftSidebarTop ?? 0}px)`,
                }}
              >
                {leftSidebar}
              </aside>
            </>
          ) : (
            <aside className={leftClass} style={leftStyle}>
              {leftSidebar}
            </aside>
          )
        )}
        <div
          className="min-w-0"
          // edgeToEdge: let the middle column GROW to fill the space between the
          // sidebars (cap moves to an inner mx-auto wrapper), so the feed stays
          // centered in whatever room is left — even after the right sidebar
          // drops out at narrower widths. Otherwise the cap sits on the flex
          // item and the content keeps its own max-width behavior.
          style={
            edgeToEdge
              ? { flex: "1 1 0%" }
              : (hasLeft || hasRight)
                ? { flex: "1 1 0%", maxWidth: effectiveMaxWidth }
                : { flex: "1 1 0%" }
          }
        >
          {edgeToEdge ? (
            <div className="mx-auto w-full" style={{ maxWidth: effectiveMaxWidth }}>
              {children}
            </div>
          ) : (
            children
          )}
        </div>
        {hasRight && (
          <aside className={rightClass} style={{ ...(!stackRight ? { width: effectiveRightWidth } : {}), ...(rightSidebarTop != null ? { top: rightSidebarTop, maxHeight: `calc(100vh - ${rightSidebarTop + 20}px)` } : {}) }}>
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
