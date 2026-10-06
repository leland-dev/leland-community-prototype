import { type ReactNode, useRef, useEffect, useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  IconArrowUpRight,
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconLivestreamSignal,
  IconPlayVideo,
  IconQuestion,
  IconShare,
  IconThumbsDown,
  IconThumbsDownFilled,
  IconThumbsUpPlain,
  IconThumbsUpPlainFilled,
  IconX,
} from "../leland";

import { useLessonPage } from "./LessonPageContext";

import type { LiveSessionBannerBlock as LiveSessionBannerBlockType } from "../../data/lessonBlocks";

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
    <div className="relative flex aspect-video h-11 shrink-0 overflow-hidden rounded border border-leland-gray-stroke">
      <video
        ref={ref}
        src={src}
        muted
        preload="metadata"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

const SESSION_SLOTS = ["Apr 21, 11:00 AM Session", "Apr 21, 2:00 PM Session", "Apr 21, 5:00 PM Session"];

function SessionRecordingEmbed({
  src,
  title,
  onClose,
}: {
  src: string;
  title?: string;
  onClose?: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [muted, setMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const popOut = async () => {
    const v = videoRef.current;
    if (v && document.pictureInPictureEnabled && !v.disablePictureInPicture) {
      try {
        await v.requestPictureInPicture();
        return;
      } catch {
        // fall through to opening in a new tab
      }
    }
    window.open(src, "_blank", "noopener");
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen?.();
  };

  const overlayClass = `absolute inset-x-0 transition-opacity duration-200 ${
    showControls ? "opacity-100" : "opacity-0 pointer-events-none"
  }`;

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  const ctrlBtn = "flex size-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 focus:outline-none";

  return (
    <div
      ref={containerRef}
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

      {/* Top: title + X, session selector below */}
      <div className={`${overlayClass} top-0`}>
        <div className="bg-gradient-to-b from-[#222] to-transparent pl-5 pr-2 pt-2 pb-14">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2 pt-3">
              <p className="leland-heading-xl font-semibold text-white">
                {title ?? "Live session recording"}
              </p>
              <div className="relative">
                <select
                  value={selectedSlot}
                  onChange={e => setSelectedSlot(Number(e.target.value))}
                  className="cursor-pointer appearance-none pr-7 leland-paragraph-lg text-white focus:outline-none"
                >
                  {SESSION_SLOTS.map((label, i) => (
                    <option key={i} value={i} className="bg-gray-900">{label}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-1.5 top-1/2 size-[18px] -translate-y-1/2 text-white" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video player"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 focus:outline-none"
              >
                <IconX className="size-6" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom: scrubber row + controls row */}
      <div className={`${overlayClass} bottom-0`}>
        <div className="bg-gradient-to-t from-[#222] to-transparent px-2 pb-2 pt-12">
          {/* Row 1: progress bar + timestamp */}
          <div className="mb-2 flex items-center gap-3 px-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={e => { const v = videoRef.current; if (v) v.currentTime = Number(e.target.value); }}
              className="h-0.5 flex-1 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-0 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:size-0"
              style={{ background: `linear-gradient(to right, #fff ${progressPct}%, rgba(255,255,255,0.2) ${progressPct}%)` }}
            />
            <span className="shrink-0 leland-paragraph-base tabular-nums text-white">
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>
          {/* Row 2: playback controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button type="button" onClick={togglePlay} className={ctrlBtn} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 translate-x-px" aria-hidden>
                    <polygon points="6,4 22,12 6,20" />
                  </svg>
                )}
              </button>
              <button type="button" onClick={toggleMute} className={ctrlBtn} aria-label={muted ? "Unmute" : "Mute"}>
                {muted ? (
                  <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
                    <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
                    <path d="M16 8.8a4 4 0 010 6.4M18.6 6.4a7.5 7.5 0 010 11.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setCaptionsOn(c => !c)}
                className={`${ctrlBtn} ${captionsOn ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                aria-label="Captions"
                aria-pressed={captionsOn}
              >
                <span className="flex h-[18px] items-center justify-center rounded border-[1.5px] border-current px-1 text-[10px] font-bold leading-none">CC</span>
              </button>
              <button type="button" className={ctrlBtn} aria-label="Settings">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
                  <path d="M19.14 12.94a7.5 7.5 0 000-1.88l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7 7 0 00-1.62-.94l-.36-2.54a.5.5 0 00-.5-.42h-3.84a.5.5 0 00-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 00-.61.22L2.69 8.84a.5.5 0 00.12.64l2.03 1.58a7.5 7.5 0 000 1.88l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32a.5.5 0 00.61.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54a.5.5 0 00.5.42h3.84a.5.5 0 00.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96a.5.5 0 00.61-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                </svg>
              </button>
              <button type="button" onClick={popOut} className={ctrlBtn} aria-label="Pop out">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-6" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor" stroke="none" />
                </svg>
              </button>
              <button type="button" onClick={toggleFullscreen} className={ctrlBtn} aria-label="Fullscreen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden>
                  <path d="M4 9V5a1 1 0 011-1h4M20 9V5a1 1 0 00-1-1h-4M4 15v4a1 1 0 001 1h4M20 15v4a1 1 0 01-1 1h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LiveElapsedTime({ startSec = 0 }: { startSec?: number }) {
  const [elapsed, setElapsed] = useState(startSec);
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return (
    <span className="text-leland-gray-extra-light">
      {m}m {String(s).padStart(2, "0")}s
    </span>
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
export type KebabItem = { label: string; href: string; download?: string };
type CalloutTrailing =
  | { kind: "chevron" }
  | { kind: "chevronDown" }
  | { kind: "plus" }
  | { kind: "arrow" }
  | { kind: "kebab"; items?: KebabItem[] }
  | { kind: "join"; onJoin?: () => void; href?: string };

// Presentational live-session callout. Shared between the lesson-page banner
// (LiveSessionBanner) and the session-detail action banner — the callers own
// the per-variant copy so the layout lives in one place.
export function LiveSessionCallout({
  recording = false,
  recordingVideoSrc,
  liveNow = false,
  month,
  day,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  recording?: boolean;
  recordingVideoSrc?: string;
  liveNow?: boolean;
  month?: string;
  day?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing: CalloutTrailing;
  onClick?: () => void;
}) {
  const [kebabOpen, setKebabOpen] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!kebabOpen) return;
    const handler = (e: MouseEvent) => {
      if (!kebabRef.current?.contains(e.target as Node)) setKebabOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [kebabOpen]);

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
      ) : liveNow ? (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-leland-red/10">
          <IconLivestreamSignal className="size-6 text-leland-red" />
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
      ) : trailing.kind === "chevronDown" ? (
        <IconChevronDown className="size-5 shrink-0 text-leland-gray-light" />
      ) : trailing.kind === "plus" ? (
        <svg viewBox="0 0 20 20" fill="none" className="size-5 shrink-0 text-leland-gray-light" aria-hidden>
          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : trailing.kind === "arrow" ? (
        <IconArrowUpRight className="size-6 shrink-0 text-leland-gray-dark" />
      ) : trailing.kind === "kebab" ? (
        <div ref={kebabRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setKebabOpen((o) => !o)}
            aria-label="Session options"
            className="rounded p-1 text-leland-gray-light hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
          >
            <IconDotsVertical className="size-5" />
          </button>
          {kebabOpen && trailing.items && trailing.items.length > 0 && (
            <div className="absolute right-0 top-full z-50 mt-1 min-w-[220px] overflow-hidden rounded-xl border border-leland-gray-stroke bg-white py-1 shadow-lg">
              {trailing.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.download ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  download={item.download}
                  onClick={() => setKebabOpen(false)}
                  className="flex items-center px-4 py-2.5 leland-paragraph-base text-leland-gray-dark hover:bg-leland-gray-hover"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ) : trailing.kind === "join" && trailing.href ? (
        <a
          href={trailing.href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-leland-gray-dark px-4 py-3 leland-heading-base font-semibold text-white hover:bg-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          Join
        </a>
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

  // Chevron, arrow, chevronDown, and plus trailing kinds make the whole row clickable.
  if (onClick && (trailing.kind === "chevron" || trailing.kind === "arrow" || trailing.kind === "chevronDown" || trailing.kind === "plus")) {
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
  const { onOpenCalendar, onViewRecording, liveSessionVariant, liveProgram, calendarItems, meetingUrl } = useLessonPage();
  const [recordingExpanded, setRecordingExpanded] = useState(false);

  if (!liveProgram) return null;

  const formattedDate = `${block.month.charAt(0)}${block.month.slice(1).toLowerCase()} ${block.day}`;

  switch (liveSessionVariant) {
    case "watchRecording":
      if (recordingExpanded && block.recordingVideoSrc) {
        return (
          <SessionRecordingEmbed
            src={block.recordingVideoSrc}
            title="Live session recording"
            onClose={() => setRecordingExpanded(false)}
          />
        );
      }
      return (
        <LiveSessionCallout
          recording
          recordingVideoSrc={block.recordingVideoSrc}
          title="Live session recording"
          subtitle={block.sessionTitle}
          trailing={{ kind: "chevronDown" }}
          onClick={() => setRecordingExpanded(true)}
        />
      );
    case "addedToCalendar":
      return (
        <LiveSessionCallout
          month={block.month}
          day={block.day}
          title={`Live session starts in ${block.countdownLabel ?? "2 days"}`}
          subtitle={block.sessionTitle}
          trailing={{ kind: "kebab", items: calendarItems }}
        />
      );
    case "joinNow":
      return (
        <LiveSessionCallout
          liveNow
          title="Join the live session"
          subtitle={
            <>
              <span className="font-medium text-leland-red">Happening now</span>
              {" · "}<LiveElapsedTime startSec={636} />
            </>
          }
          trailing={{ kind: "join", href: meetingUrl, onJoin: onOpenCalendar }}
        />
      );
    default:
      return (
        <LiveSessionCallout
          month={block.month}
          day={block.day}
          title="Attend the live session"
          subtitle={
            <>
              <span className="font-medium text-leland-blue-dark">
                Add to calendar
              </span>{" · "}
              {formattedDate}
            </>
          }
          trailing={{ kind: "plus" }}
          onClick={onOpenCalendar}
        />
      );
  }
}

// Bottom-of-page action row: a top divider with 32px vertical padding.
// Get help / Share sit on the left; "Was this section helpful?" with Yes/No
// buttons is right-aligned on desktop and stacks below on mobile.
export function LessonFooterActions() {
  const { onShareFeedback, onOpenSupport } = useLessonPage();
  const [selectedThumb, setSelectedThumb] = useState<"yes" | "no" | null>(null);
  const [yesPopKey, setYesPopKey] = useState(0);
  const [noPopKey, setNoPopKey] = useState(0);
  return (
    <div className="flex flex-col gap-6 border-t border-leland-gray-stroke pt-8 pb-8 md:pb-16 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          label="Get help"
          buttonColor={ButtonColor.GRAY}
          size={ButtonSize.MEDIUM}
          LeftIcon={IconQuestion}
          onClick={onOpenSupport}
        />
        <Button
          label="Share"
          hideLabel
          buttonColor={ButtonColor.GRAY}
          size={ButtonSize.MEDIUM}
          LeftIcon={IconShare}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="leland-paragraph-base text-leland-gray-dark">
          Was this section helpful?
        </span>
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Not helpful"
            onClick={() => {
              setSelectedThumb("no");
              setNoPopKey((k) => k + 1);
              onShareFeedback();
            }}
            className="flex items-center gap-2 text-[0.875rem] font-semibold text-leland-gray-dark hover:text-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
          >
            {selectedThumb === "no" ? (
              <IconThumbsDownFilled key={noPopKey} className="size-5 animate-[icon-pop_400ms_ease-out]" />
            ) : (
              <IconThumbsDown className="size-5" />
            )}
            No
          </button>
          <button
            type="button"
            aria-label="Helpful"
            onClick={() => {
              setSelectedThumb("yes");
              setYesPopKey((k) => k + 1);
            }}
            className="flex items-center gap-2 text-[0.875rem] font-semibold text-leland-gray-dark hover:text-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
          >
            {selectedThumb === "yes" ? (
              <IconThumbsUpPlainFilled key={yesPopKey} className="size-5 animate-[icon-pop_400ms_ease-out]" />
            ) : (
              <IconThumbsUpPlain className="size-5" />
            )}
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
