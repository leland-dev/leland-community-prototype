import { type FC, type ReactNode, type SVGProps } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  ButtonColor,
  ButtonSize,
  IconArrowRight,
  IconArrowUpRight,
  IconBookClosed,
  IconCalendar,
  IconChevronRight,
  IconDotsVertical,
  IconHelp,
  IconMegaphone,
  IconPlayVideo,
  IconQuestion,
  IconShare,
  IconStar,
  IconStarOutline,
} from "../leland";

import { useLessonPage } from "./LessonPageContext";

import type {
  CtaBlock as CtaBlockType,
  LiveSessionBannerBlock as LiveSessionBannerBlockType,
} from "../../data/lessonBlocks";

const CALLOUT_CONTAINER =
  "flex w-full items-center gap-3 rounded-lg border border-leland-gray-stroke bg-white p-4";

function LiveDateTile({ month, day }: { month: string; day: string }) {
  return (
    <div className="flex size-12 shrink-0 flex-col overflow-hidden rounded-lg border border-leland-gray-stroke">
      <div className="flex items-center justify-center bg-leland-blue px-2.5 pb-0.5 pt-[3px]">
        <span className="text-[10px] font-semibold uppercase tracking-[1px] text-leland-gray-dark">
          {month}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white">
        <span className="leland-heading-xl font-semibold text-leland-gray-dark">
          {day}
        </span>
      </div>
    </div>
  );
}

// Trailing affordance on the right edge of the callout.
type CalloutTrailing =
  | { kind: "chevron" }
  | { kind: "arrow" }
  | { kind: "kebab" }
  | { kind: "join"; onJoin?: () => void };

// Presentational live-session callout. Shared between the lesson-page banner
// (LiveSessionBanner) and the session-detail action banner — the callers own
// the per-variant copy so the layout lives in one place.
export function LiveSessionCallout({
  recording = false,
  month,
  day,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  recording?: boolean;
  month?: string;
  day?: string;
  title: string;
  subtitle?: ReactNode;
  trailing: CalloutTrailing;
  onClick?: () => void;
}) {
  const body = (
    <>
      {recording ? (
        <div className="flex aspect-[1200/630] h-12 shrink-0 items-center justify-center overflow-hidden rounded border border-leland-gray-stroke bg-leland-gray-hover">
          <IconPlayVideo className="size-5 text-leland-gray-light" />
        </div>
      ) : (
        <LiveDateTile month={month ?? ""} day={day ?? ""} />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="leland-heading-base font-semibold text-leland-gray-dark">
          {title}
        </p>
        {subtitle ? (
          <div className="truncate leland-paragraph-base text-leland-gray-extra-light">
            {subtitle}
          </div>
        ) : null}
      </div>
      {trailing.kind === "chevron" ? (
        <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
      ) : trailing.kind === "arrow" ? (
        <IconArrowUpRight className="size-6 shrink-0 text-leland-gray-dark" />
      ) : trailing.kind === "kebab" ? (
        <button
          type="button"
          aria-label="Session options"
          className="shrink-0 rounded p-1 text-leland-gray-light hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          <IconDotsVertical className="size-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={trailing.onJoin}
          className="shrink-0 rounded-lg bg-leland-gray-dark px-4 py-3 leland-heading-base font-semibold text-white hover:bg-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          Join
        </button>
      )}
    </>
  );

  // Only the chevron/arrow states make the whole row a click target; kebab and
  // join own their own controls.
  if (onClick && (trailing.kind === "chevron" || trailing.kind === "arrow")) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${CALLOUT_CONTAINER} text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary`}
      >
        {body}
      </button>
    );
  }
  return <div className={CALLOUT_CONTAINER}>{body}</div>;
}

// Lesson-page live-session banner: four states (chosen from the prototype menu)
// with the session title in the subtext.
export function LiveSessionBanner({ block }: { block: LiveSessionBannerBlockType }) {
  const { onOpenCalendar, liveSessionVariant } = useLessonPage();

  switch (liveSessionVariant) {
    case "watchRecording":
      return (
        <LiveSessionCallout
          recording
          title="Live session recording"
          subtitle={
            <>
              {block.time ? `${block.time} · ` : ""}
              {block.sessionTitle}
            </>
          }
          trailing={{ kind: "arrow" }}
          onClick={onOpenCalendar}
        />
      );
    case "addedToCalendar":
      return (
        <LiveSessionCallout
          month={block.month}
          day={block.day}
          title={`Live session starts in ${block.countdownLabel ?? "2 days"}`}
          subtitle={block.sessionTitle}
          trailing={{ kind: "kebab" }}
        />
      );
    case "joinNow":
      return (
        <LiveSessionCallout
          month={block.month}
          day={block.day}
          title="Join the live session"
          subtitle={
            <>
              <span className="font-medium text-leland-rust">Happening now</span>{" "}
              · {block.sessionTitle}
            </>
          }
          trailing={{ kind: "join", onJoin: onOpenCalendar }}
        />
      );
    default:
      return (
        <LiveSessionCallout
          month={block.month}
          day={block.day}
          title="Join the live session"
          subtitle={
            <>
              <span className="font-medium text-leland-blue-dark">
                Add to calendar
              </span>{" "}
              · {block.sessionTitle}
            </>
          }
          trailing={{ kind: "chevron" }}
          onClick={onOpenCalendar}
        />
      );
  }
}

export function ShareFeedback() {
  const { onShareFeedback } = useLessonPage();
  return (
    <button
      type="button"
      onClick={onShareFeedback}
      className="flex w-full items-center gap-4 rounded-xl border border-leland-gray-stroke bg-white px-5 py-4 text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
    >
      <IconStar className="size-5 shrink-0 text-leland-gray-dark" />
      <span className="flex-1 leland-heading-base font-semibold text-leland-gray-dark">
        Share feedback
      </span>
      <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
    </button>
  );
}

// Bottom-of-page action row: a top divider with 32px vertical padding and
// medium gray-fill buttons mirroring the header actions (Get help / Feedback /
// Share). Subtle, page-level actions separated from the lesson content.
export function LessonFooterActions() {
  const { onShareFeedback } = useLessonPage();
  return (
    <div className="-mx-3 flex flex-wrap items-center gap-1 border-t border-leland-gray-stroke pt-8 pb-16">
      <Button
        label="Get help"
        buttonColor={ButtonColor.REVEAL}
        size={ButtonSize.MEDIUM}
        LeftIcon={IconQuestion}
      />
      <Button
        label="Feedback"
        buttonColor={ButtonColor.REVEAL}
        size={ButtonSize.MEDIUM}
        LeftIcon={IconStarOutline}
        onClick={onShareFeedback}
      />
      <Button
        label="Share"
        buttonColor={ButtonColor.REVEAL}
        size={ButtonSize.MEDIUM}
        LeftIcon={IconShare}
      />
    </div>
  );
}

const CTA_ICONS: Record<
  NonNullable<CtaBlockType["icon"]>,
  FC<SVGProps<SVGSVGElement>>
> = {
  calendar: IconCalendar,
  arrow: IconArrowRight,
  book: IconBookClosed,
  help: IconHelp,
  megaphone: IconMegaphone,
};

export function Cta({ block }: { block: CtaBlockType }) {
  const Icon = block.icon ? CTA_ICONS[block.icon] : null;
  const isPrimary = block.tone === "primary";
  const className = `flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
    isPrimary
      ? "bg-leland-primary text-leland-on-primary-text hover:bg-leland-primary-hover"
      : "border border-leland-gray-stroke bg-white text-leland-gray-dark hover:bg-leland-gray-hover"
  }`;

  const inner = (
    <>
      {Icon ? <Icon className="size-5 shrink-0" /> : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="leland-heading-base font-semibold">{block.label}</span>
        {block.sublabel ? (
          <span
            className={`leland-paragraph-sm ${isPrimary ? "opacity-80" : "text-leland-gray-light"}`}
          >
            {block.sublabel}
          </span>
        ) : null}
      </span>
      <IconChevronRight className="size-5 shrink-0 opacity-60" />
    </>
  );

  return block.href ? (
    <Link to={block.href} className={className}>
      {inner}
    </Link>
  ) : (
    <button type="button" className={className}>
      {inner}
    </button>
  );
}
