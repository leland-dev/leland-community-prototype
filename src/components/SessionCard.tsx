import React, { useState, useRef, useEffect } from "react";
import { Button, LinkButton } from "./Button";
import { motion, AnimatePresence } from "motion/react";
import arrowRoundIcon from "../assets/icons/arrow-round.svg";
import arrowRightIcon from "../assets/icons/arrow-right.svg";
import dotsVerticalIcon from "../assets/icons/dots-vertical.svg";
import calendarPageIcon from "../assets/icons/calendar-page.svg";
import editIcon from "../assets/icons/edit.svg";
import sessionSummaryIcon from "../assets/icons/session-summary.svg";
import downloadIcon from "../assets/icons/download.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import textIcon from "../assets/icons/text.svg";
import playVideoIcon from "../assets/icons/play-video.svg";

interface SessionCardProps {
  title: string;
  dateTime: string;
  duration: string;
  image: string;
  type?: "coach" | "event" | "bootcamp";
  status?: "live" | "upcoming" | "past";
  startsIn?: string;
  hasRecording?: boolean;
  hideImage?: boolean;
  /** "auto" renders small styles below a 500px container width, large above it. */
  size?: "large" | "small" | "auto";
  cta?: React.ReactNode;
  joinHref?: string;
  /** Day of the month shown in the calendar icon. Parsed from `dateTime` when omitted. */
  day?: string | number;
  /** Tailwind color class for the date/time subtitle (defaults to the muted gray). */
  subtitleColorClass?: string;
}

// Apple-style calendar chip: blue header bar over a white face with the day.
function CalendarIcon({ day, dim }: { day: string; dim?: boolean }) {
  return (
    <div
      className={`flex h-[36px] w-[36px] shrink-0 flex-col overflow-hidden rounded-[8px] bg-white${dim ? " opacity-50" : ""}`}
      style={{ boxShadow: "0 1px 3px 0 rgba(16, 24, 40, 0.10), 0 1px 2px 0 rgba(16, 24, 40, 0.06)" }}
    >
      <div className="h-[10px] w-full shrink-0" style={{ backgroundColor: "#80ACED" }} />
      <div className="flex flex-1 items-center justify-center pb-[2px]">
        <span className="text-[16px] font-semibold leading-[1.2] text-gray-dark">{day}</span>
      </div>
    </div>
  );
}

// Pull the day-of-month out of a "Weekday, Mon D at Time" string.
function dayFromDateTime(dateTime: string): string {
  const m = dateTime.split(" at ")[0].match(/(\d{1,2})/);
  return m ? m[1] : "";
}

function getMenuItems(status: string, type: string) {
  if (type === "bootcamp") {
    const items = [{ icon: textIcon, label: "Session Guide" }];
    if (status === "past") {
      items.unshift({ icon: arrowRoundIcon, label: "Watch recording" });
    }
    if (status === "upcoming") {
      items.unshift({ icon: calendarPageIcon, label: "Add to calendar" });
    }
    return items;
  }
  if (status === "past" && type === "coach") {
    return [
      { icon: sessionSummaryIcon, label: "View summary" },
      { icon: downloadIcon, label: "Download recording" },
      { icon: editIcon, label: "Edit session" },
      { icon: addPlusIcon, label: "New session" },
    ];
  }
  if (status === "past") {
    return [
      { icon: arrowRoundIcon, label: "Watch recording" },
      { icon: textIcon, label: "Session guide" },
      { icon: arrowRightIcon, label: "Browse more livestreams" },
    ];
  }
  if (type === "event") {
    return [
      { icon: calendarPageIcon, label: "Add to calendar" },
      { icon: textIcon, label: "Session guide" },
      { icon: "cancel", label: "Unenroll", danger: true },
    ];
  }
  // coach — live or upcoming
  return [
    { icon: calendarPageIcon, label: "Add to calendar" },
    { icon: editIcon, label: "Edit session" },
    { icon: addPlusIcon, label: "New session" },
    { icon: "cancel", label: "Cancel", danger: true },
  ];
}

function CancelIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-6 w-6 shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <line x1="5.64" y1="5.64" x2="18.36" y2="18.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function SessionCard({
  title,
  dateTime,
  duration,
  image,
  type = "coach",
  status = "upcoming",
  startsIn,
  hasRecording,
  hideImage,
  size = "large",
  cta,
  joinHref,
  day,
  subtitleColorClass = "text-[#707070]",
}: SessionCardProps) {
  const isPast = status === "past";
  const isAuto = size === "auto";
  const isSmall = size === "small";
  const dayNum = day != null ? String(day) : dayFromDateTime(dateTime);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // "auto" swaps small→large styles at a 500px container width via @container.
  const titleSizeClass = isAuto ? "text-[14px] @[500px]:text-[16px]" : isSmall ? "text-[14px]" : "text-[16px]";
  const subtitleSizeClass = isAuto ? "text-[12px] @[500px]:text-[14px]" : isSmall ? "text-[12px]" : "text-[14px]";
  const rowPadClass = isAuto ? "py-[10px] @[500px]:py-3" : isSmall ? "py-[10px]" : "py-3";

  // Join button: sized to match; in auto mode both sizes render and toggle by
  // container width (a Button's size prop can't itself be a container query).
  const joinButton = (sz: "sm" | "md") =>
    joinHref ? (
      <LinkButton size={sz} variant="dark" rounded="rounded-full" style={{ fontWeight: 600 }} href={joinHref}>Join</LinkButton>
    ) : (
      <Button size={sz} variant="dark" rounded="rounded-full" style={{ fontWeight: 600 }}>Join</Button>
    );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const menuItems = getMenuItems(status, type);

  return (
    <div className="@container">
      <div className={`flex cursor-pointer items-center gap-3 rounded-[12px] bg-white pl-2 pr-1 transition-colors hover:bg-[#F5F5F5] ${rowPadClass}`}>
        {/* Calendar icon — always shown (unless explicitly hidden) */}
        {!hideImage && <CalendarIcon day={dayNum} dim={isPast} />}

        {/* Title + date/time */}
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <p className={`truncate ${titleSizeClass} leading-[1.2] font-semibold ${isPast ? "text-[#707070]" : "text-gray-dark"}`}>
            {title}
          </p>
          <p className={`truncate ${subtitleSizeClass} leading-[1.4] ${subtitleColorClass}`}>
            {status === "live" ? (
              <><span className="text-red">Happening now</span> · Started at {dateTime.split(" at ")[1]} · <span className="text-[#9B9B9B]">{duration}</span></>
            ) : (
              <>{dateTime} · <span className="text-[#9B9B9B]">{duration}</span></>
            )}
          </p>
        </div>

        {/* Right action area */}
        <div className="flex shrink-0 items-center gap-0 self-stretch">
          {cta ? cta : status === "live" ? (
            isAuto ? (
              <>
                <span className="@[500px]:hidden">{joinButton("sm")}</span>
                <span className="hidden @[500px]:inline-flex">{joinButton("md")}</span>
              </>
            ) : joinButton(isSmall ? "sm" : "md")
          ) : status === "upcoming" ? null
          : isPast && hasRecording && (type === "event" || type === "bootcamp") ? (
            <Button size="md" variant="secondary" className="hidden @[448px]:inline-flex">
              <img src={arrowRoundIcon} alt="" className="h-4 w-4" />
              Watch
            </Button>
          ) : null}

          {/* 3-dot menu */}
          <div ref={menuRef} className="relative self-stretch">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group/dots flex w-8 cursor-pointer items-center justify-center self-stretch h-full"
            >
              <img src={dotsVerticalIcon} alt="" className="h-4 w-1 opacity-60 transition-opacity group-hover/dots:opacity-100" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute right-0 top-full z-50 mt-1 w-56 rounded-2xl border border-gray-stroke bg-white shadow-lg"
                >
                  <div className="px-2 py-2">
                    {menuItems.map(({ icon, label, danger }) => (
                      <button
                        key={label}
                        className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium transition-colors ${
                          danger
                            ? "text-[#D92D20] hover:bg-gray-hover"
                            : "text-gray-dark hover:bg-gray-hover"
                        }`}
                      >
                        {icon === "cancel" ? (
                          <CancelIcon />
                        ) : (
                          <img src={icon} alt="" className="h-6 w-6 shrink-0" />
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
