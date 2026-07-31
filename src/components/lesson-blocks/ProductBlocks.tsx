import { type FC, type ReactNode, type SVGProps, useRef, useEffect, useState } from "react";
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

// Renders a frame from a video as a thumbnail with a play icon overlay.
// Seeks to 2s on load to skip any black opening frame.
function VideoThumbnail({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seek = () => { el.currentTime = 2; };
    el.addEventListener("loadedmetadata", seek);
    return () => el.removeEventListener("loadedmetadata", seek);
  }, [src]);
  return (
    <div className="relative flex aspect-video h-14 shrink-0 overflow-hidden rounded-lg border border-leland-gray-stroke">
      <video
        ref={ref}
        src={src}
        muted
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <div className="flex size-6 items-center justify-center rounded-full bg-white/90 shadow">
          <IconPlayVideo className="size-3.5 text-leland-gray-dark" />
        </div>
      </div>
    </div>
  );
}

const SESSION_SLOTS = ["11:00 AM Session", "2:00 PM Session", "5:00 PM Session"];

function SessionRecordingEmbed({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showControls = !isPlaying || hovering;

  const fmt = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };

  const overlayClass = `pointer-events-none absolute inset-x-0 transition-opacity duration-200 ${
    showControls ? "opacity-100 pointer-events-auto" : "opacity-0"
  }`;

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-xl border border-leland-gray-stroke bg-black"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full cursor-pointer object-cover"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
      />

      {/* Top: title + session selector */}
      <div className={`${overlayClass} top-0`}>
        <div className="bg-gradient-to-b from-black/70 to-transparent px-4 pt-3 pb-14">
          <div className="flex items-center justify-between gap-3">
            <p className="leland-paragraph-base font-semibold text-white">Session recording</p>
            <div className="relative">
              <select
                value={selectedSlot}
                onChange={e => setSelectedSlot(Number(e.target.value))}
                className="cursor-pointer appearance-none rounded-full bg-white/15 py-1.5 pl-3 pr-7 text-[13px] font-medium text-white backdrop-blur-sm focus:outline-none"
              >
                {SESSION_SLOTS.map((label, i) => (
                  <option key={i} value={i} className="bg-gray-900">{label}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-white" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Center: large play button when paused */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center focus:outline-none"
          aria-label="Play"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="white" className="size-7 translate-x-0.5" aria-hidden>
              <polygon points="5,3 21,12 5,21" />
            </svg>
          </div>
        </button>
      )}

      {/* Bottom: scrubber + controls */}
      <div className={`${overlayClass} bottom-0`}>
        <div className="bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-12">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={e => { const v = videoRef.current; if (v) v.currentTime = Number(e.target.value); }}
            className="mb-2.5 h-0.5 w-full cursor-pointer accent-white"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white focus:outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
                  <rect x="4" y="3" width="4" height="14" rx="1" />
                  <rect x="12" y="3" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="white" className="size-5 translate-x-px" aria-hidden>
                  <polygon points="5,3 21,12 5,21" />
                </svg>
              )}
            </button>
            <span className="leland-paragraph-sm tabular-nums text-white/80">
              {fmt(currentTime)} / {fmt(duration)}
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => window.open(src, "_blank", "noopener")}
              className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white focus:outline-none"
              aria-label="Open in new window"
            >
              <IconArrowUpRight className="size-4" />
              Pop out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  recordingVideoSrc,
  month,
  day,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  recording?: boolean;
  recordingVideoSrc?: string;
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
        recordingVideoSrc ? (
          <VideoThumbnail src={recordingVideoSrc} />
        ) : (
          <div className="flex aspect-[1200/630] h-12 shrink-0 items-center justify-center overflow-hidden rounded border border-leland-gray-stroke bg-leland-gray-hover">
            <IconPlayVideo className="size-5 text-leland-gray-light" />
          </div>
        )
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
  const { onOpenCalendar, onViewRecording, liveSessionVariant, liveProgram } = useLessonPage();

  if (!liveProgram) return null;

  switch (liveSessionVariant) {
    case "watchRecording":
      return block.recordingVideoSrc ? (
        <SessionRecordingEmbed src={block.recordingVideoSrc} />
      ) : (
        <LiveSessionCallout
          recording
          title="Live session recording"
          subtitle={block.sessionTitle}
          trailing={{ kind: "arrow" }}
          onClick={onViewRecording}
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
