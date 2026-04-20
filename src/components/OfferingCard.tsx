import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import dotsVerticalIcon from "../assets/icons/dots-vertical.svg";
import downloadIcon from "../assets/icons/download.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import chatIcon from "../assets/icons/nav-icons/chat-inactive.svg";
import menuBurgerIcon from "../assets/icons/menu-burger.svg";
import playVideoIcon from "../assets/icons/play-video.svg";
import slackIcon from "../assets/icons/slack-black.svg";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import browserIcon from "../assets/icons/browser.svg";
import introCallImg from "../assets/img/intro-call.png";

export type OfferingType = "free-intro" | "hourly" | "hourly-package" | "package" | "course" | "content";

interface OfferingCardProps {
  type: OfferingType;
  title: string;
  subtitle: ReactNode;
  image: string;
  purchased?: boolean;
  cohortSelected?: boolean;
  ctaLabel?: string;
  showImage?: boolean;
  size?: "large" | "small";
}

function getDefaultCta(type: OfferingType, purchased: boolean, cohortSelected: boolean): { label: string; green?: boolean } {
  if (purchased) {
    if (type === "hourly") return { label: "Schedule" };
    if (type === "hourly-package") return { label: "Schedule" };
    if (type === "package") return { label: "Schedule" };
    if (type === "course") return cohortSelected ? { label: "Details" } : { label: "Select cohort", green: true };
    return { label: "Details" };
  }
  if (type === "free-intro") return { label: "Schedule", green: true };
  if (type === "hourly") return { label: "Details" };
  if (type === "hourly-package") return { label: "Details" };
  if (type === "package") return { label: "Details" };
  if (type === "course") return { label: "Details" };
  return { label: "Details" };
}

interface MenuItem {
  icon: string;
  label: string;
  danger?: boolean;
}

function getMenuItems(type: OfferingType, cohortSelected: boolean): MenuItem[] {
  if (type === "hourly") {
    return [
      { icon: addPlusIcon, label: "Buy more time" },
      { icon: chatIcon, label: "Message" },
    ];
  }
  if (type === "hourly-package") {
    return [
      { icon: addPlusIcon, label: "Buy more time" },
      { icon: chatIcon, label: "Message" },
    ];
  }
  if (type === "package") {
    return [
      { icon: addPlusIcon, label: "Buy more time" },
      { icon: chatIcon, label: "Message" },
    ];
  }
  if (type === "course") {
    if (!cohortSelected) {
      return [
        { icon: browserIcon, label: "Course details" },
      ];
    }
    return [
      { icon: menuBurgerIcon, label: "Syllabus" },
      { icon: playVideoIcon, label: "Recordings" },
      { icon: slackIcon, label: "Group Slack" },
    ];
  }
  // content
  return [
    { icon: downloadIcon, label: "Download" },
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

export default function OfferingCard({
  type,
  title,
  subtitle,
  image,
  purchased = false,
  cohortSelected = true,
  ctaLabel,
  showImage = false,
  size = "large",
}: OfferingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isSmall = size === "small";
  const isPersonImage = type === "hourly" || ((type === "hourly-package" || type === "package") && purchased);
  const cta = getDefaultCta(type, purchased, cohortSelected);
  const label = ctaLabel || cta.label;
  const menuItems = getMenuItems(type, cohortSelected);

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

  /* ── Free intro card ── */
  if (type === "free-intro" && !purchased) {
    return (
      <div className="@container">
        <div className="flex cursor-pointer items-center overflow-hidden rounded-[8px] border border-[#E5E5E5] bg-[#F5F5F5] transition-colors hover:bg-[#EFEFEF]">
          <img
            src={introCallImg}
            alt=""
            className="hidden @[380px]:block ml-3 w-[64px] shrink-0 object-contain"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-[2px] py-4 pl-3">
            <p className="truncate text-[18px] leading-tight font-medium text-gray-dark">{title}</p>
            <p className="truncate text-[16px] leading-tight text-[#707070]">{subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center pr-2 py-4">
            <button className="hidden @[448px]:flex cursor-pointer items-center gap-2 rounded-lg bg-[#038561] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90">
              {label}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Standard inline row layout ── */
  return (
    <div className="@container">
      <div className={`flex cursor-pointer items-center gap-3 rounded-[12px] bg-white pl-2 py-3 transition-colors hover:bg-[#F5F5F5] ${purchased ? "pr-1" : "pr-2"}`}>
        {/* Image */}
        {type === "hourly" && !purchased ? (
          <div className={`${showImage ? "flex" : "hidden @[380px]:flex"} h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[4px] bg-[#F5F5F5]`}>
            <img src={hourglassIcon} alt="" className="h-[20px] w-[20px]" />
          </div>
        ) : isPersonImage ? (
          <img
            src={image}
            alt=""
            className={`${showImage ? "block" : "hidden @[380px]:block"} h-[40px] w-[40px] shrink-0 rounded-full object-cover`}
          />
        ) : (
          <img
            src={image}
            alt=""
            className={`${showImage ? "block" : "hidden @[380px]:block"} h-[40px] w-[72px] shrink-0 rounded-[4px] object-cover`}
          />
        )}

        {/* Title + subtitle */}
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <p className={`truncate ${isSmall ? "text-[16px]" : "text-[18px]"} leading-tight font-medium text-gray-dark`}>
            {title}
          </p>
          <p className={`truncate ${isSmall ? "text-[14px]" : "text-[16px]"} leading-tight text-[#707070]`}>
            {subtitle}
          </p>
        </div>

        {/* Right action area */}
        <div className="flex shrink-0 items-center gap-0 self-stretch">
          <button className={`hidden @[448px]:flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-[16px] font-medium transition-colors ${
            cta.green
              ? "bg-[#038561] text-white hover:bg-[#038561]/90"
              : "bg-[#222222]/5 text-gray-dark hover:bg-[#222222]/[0.08]"
          }`}>
            {label}
          </button>

          {/* 3-dot menu — purchased state only */}
          {purchased && (
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
                      {menuItems.map(({ icon, label: menuLabel, danger }) => (
                        <button
                          key={menuLabel}
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
                          {menuLabel}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
