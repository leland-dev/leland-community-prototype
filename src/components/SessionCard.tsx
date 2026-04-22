import React, { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
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
  size?: "large" | "small";
  cta?: React.ReactNode;
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
      { icon: arrowRightIcon, label: "Browse more events" },
    ];
  }
  if (type === "event") {
    return [
      { icon: calendarPageIcon, label: "Add to calendar" },
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
}: SessionCardProps) {
  const isPast = status === "past";
  const isSmall = size === "small";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const titleSizeClass = isSmall ? "text-[16px]" : "text-[18px]";
  const subtitleSizeClass = isSmall ? "text-[14px]" : "text-[16px]";

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
      <div className={`flex cursor-pointer items-center gap-3 rounded-[12px] bg-white pl-2 pr-1 transition-colors hover:bg-[#F5F5F5] ${isSmall ? "py-[10px]" : "py-3"}`}>
        {/* Image — hidden when hideImage, otherwise hidden below 380px */}
        {!hideImage && (type === "coach" ? (
          <img
            src={image}
            alt=""
            className={`hidden @[380px]:block h-[40px] w-[40px] shrink-0 rounded-full object-cover${isPast ? " opacity-50" : ""}`}
          />
        ) : (
          <img
            src={image}
            alt=""
            className={`hidden @[380px]:block h-[40px] w-[72px] shrink-0 rounded-[4px] object-cover${isPast ? " opacity-50" : ""}`}
          />
        ))}

        {/* Title + date/time */}
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <p className={`truncate ${titleSizeClass} leading-tight font-medium ${isPast ? "text-[#707070]" : "text-gray-dark"}`}>
            {title}
          </p>
          <p className={`truncate ${subtitleSizeClass} leading-tight text-[#707070]`}>
            {status === "live" ? (
              <><span className="text-[#E2574C]">Happening now</span> · Started at {dateTime.split(" at ")[1]} · <span className="text-[#9B9B9B]">{duration}</span></>
            ) : (
              <>{dateTime} · <span className="text-[#9B9B9B]">{duration}</span></>
            )}
          </p>
        </div>

        {/* Right action area */}
        <div className="flex shrink-0 items-center gap-0 self-stretch">
          {cta ? cta : status === "live" ? (
            <Button size="md" variant="primary">Join</Button>
          ) : status === "upcoming" && startsIn ? (
            <div className="hidden @[448px]:block rounded-lg px-4 py-3 text-[16px] font-medium leading-[1.2] bg-[#F5F5F5] text-[#9B9B9B]">
              Starts in {startsIn}
            </div>
          ) : isPast && hasRecording && (type === "event" || type === "bootcamp") ? (
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
                        className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium transition-colors ${
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
