import type { ReactNode } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  ProgressBar,
} from "../../leland";

// In-pane progress header — replaces the source's sticky global topbar. The
// course viewer already supplies the outer chrome, so this sits inside the
// content column.
export function FlowProgressHeader({
  breadcrumb,
  value,
}: {
  breadcrumb: string;
  value: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="leland-subtext-sm font-semibold uppercase tracking-[1.3px] text-leland-gray-extra-light">
        {breadcrumb}
      </span>
      <ProgressBar value={value} />
    </div>
  );
}

// Segmented step progress — one bar per step, completed steps filled dark gray.
export function FlowStepProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1 flex-1 rounded-full ${i < current ? "bg-leland-gray-dark" : "bg-leland-gray-stroke"}`}
        />
      ))}
    </div>
  );
}

type FlowShellProps = {
  eyebrow?: string;
  title: string;
  subhead?: string;
  children?: ReactNode;
  centered?: boolean;
  onBack?: () => void;
  backLabel?: string;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  // Replaces the default Back/Continue footer entirely (e.g. the receipt screen).
  footer?: ReactNode;
};

// The shared frame every flow step renders into: eyebrow + serif title +
// subhead, a content slot, and a Back/Continue footer with gating.
export function FlowShell({
  eyebrow,
  title,
  subhead,
  children,
  centered = false,
  onBack,
  backLabel = "Back",
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
  footer,
}: FlowShellProps) {
  const hasDefaultFooter = footer === undefined && (onBack || onContinue);
  return (
    <div className={`flex flex-col gap-6 ${centered ? "items-center text-center" : ""}`}>
      <div className="flex flex-col gap-2">
        {eyebrow ? (
          <span className="leland-subtext-sm font-semibold uppercase tracking-[1.3px] text-leland-gray-extra-light">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-heading-3xl md:text-heading-4xl font-season font-normal text-leland-gray-dark">
          {title}
        </h1>
        {subhead ? (
          <p className="leland-paragraph-lg text-leland-gray-light">{subhead}</p>
        ) : null}
      </div>

      {children}

      {footer}

      {hasDefaultFooter ? (
        <div className="flex items-center gap-3 pt-2">
          {onBack ? (
            <Button
              label={backLabel}
              buttonColor={ButtonColor.WHITE}
              size={ButtonSize.LARGE}
              onClick={onBack}
            />
          ) : null}
          {onContinue ? (
            <Button
              label={continueLabel}
              buttonColor={ButtonColor.PRIMARY}
              size={ButtonSize.LARGE}
              width={ButtonWidth.AUTO}
              disabled={continueDisabled}
              onClick={continueDisabled ? undefined : onContinue}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
