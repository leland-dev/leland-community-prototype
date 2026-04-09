import type { ReactNode } from "react";

type PageShellProps = {
  variant?: "standard" | "thin";
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  contentMaxWidth?: number;
  children: ReactNode;
};

export default function PageShell({
  variant = "standard",
  leftSidebar,
  rightSidebar,
  contentMaxWidth,
  children,
}: PageShellProps) {
  if (variant === "thin") {
    return (
      <div className="mx-auto max-w-[620px] px-4 py-8 sm:px-6">
        {children}
      </div>
    );
  }

  const hasLeft = leftSidebar != null;
  const hasRight = rightSidebar != null;
  const hasBoth = hasLeft && hasRight;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <div
        className={contentMaxWidth
          ? "flex items-start justify-center"
          : "flex items-start"
        }
        style={{ gap: 40 }}
      >
        {hasLeft && (
          <aside
            className={hasBoth
              ? "hidden w-[300px] shrink-0 sticky top-5 self-start xl:block"
              : "hidden w-[300px] shrink-0 sticky top-5 self-start xl:block"
            }
          >
            {leftSidebar}
          </aside>
        )}
        <div
          className={contentMaxWidth ? "min-w-0 w-full" : "min-w-0 flex-1"}
          style={contentMaxWidth ? { maxWidth: contentMaxWidth } : undefined}
        >
          {children}
        </div>
        {hasRight && (
          <aside
            className={hasBoth
              ? "hidden w-[300px] shrink-0 sticky top-5 self-start 2xl:block"
              : "hidden w-[300px] shrink-0 sticky top-5 self-start xl:block"
            }
          >
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
