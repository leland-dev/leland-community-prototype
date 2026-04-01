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
      <div className="mx-auto max-w-[620px] px-6 py-6">
        {children}
      </div>
    );
  }

  const hasLeft = leftSidebar != null;
  const hasRight = rightSidebar != null;
  const hasBoth = hasLeft && hasRight;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <div
        className={`flex items-start gap-10${contentMaxWidth ? " justify-center" : ""}`}
      >
        {hasLeft && (
          <aside
            className={`hidden w-[320px] shrink-0 sticky top-5 self-start ${
              hasBoth ? "xl:block" : "xl:block"
            }`}
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
            className={`hidden w-[320px] shrink-0 sticky top-5 self-start ${
              hasBoth ? "2xl:block" : "xl:block"
            }`}
          >
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
