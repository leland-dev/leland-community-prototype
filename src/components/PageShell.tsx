import type { ReactNode } from "react";

type PageShellProps = {
  variant?: "standard" | "thin";
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  contentMaxWidth?: number;
  leftMaxWidth?: number;
  children: ReactNode;
};

export default function PageShell({
  variant = "standard",
  leftSidebar,
  rightSidebar,
  contentMaxWidth,
  leftMaxWidth,
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
  const leftClass = "hidden w-[300px] shrink-0 sticky top-5 self-start min-[960px]:block";
  const rightClass = hasBoth
    ? "hidden w-[300px] shrink-0 sticky top-5 self-start min-[1200px]:block"
    : "hidden w-[300px] shrink-0 sticky top-5 self-start min-[960px]:block";

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

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:py-10 sm:px-6">
      <div
        className={contentMaxWidth
          ? "flex items-start justify-center gap-col-gap"
          : "flex items-start gap-col-gap"
        }
      >
        {hasLeft && <aside className={leftClass}>{leftSidebar}</aside>}
        <div
          className={contentMaxWidth ? "min-w-0 w-full" : "min-w-0 flex-1"}
          style={contentMaxWidth ? { maxWidth: contentMaxWidth } : undefined}
        >
          {children}
        </div>
        {hasRight && <aside className={rightClass}>{rightSidebar}</aside>}
      </div>
    </div>
  );
}
