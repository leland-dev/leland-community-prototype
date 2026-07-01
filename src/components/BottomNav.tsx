import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "motion/react";

import homeActive from "../assets/icons/nav-icons/home-active.svg";
import homeInactive from "../assets/icons/nav-icons/home-inactive.svg";
import searchActive from "../assets/icons/nav-icons/search-active.svg";
import searchInactive from "../assets/icons/nav-icons/search-inactive.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import chatInactive from "../assets/icons/nav-icons/chat-inactive.svg";
import calendarActive from "../assets/icons/nav-icons/calendar-active.svg";
import calendarInactive from "../assets/icons/nav-icons/calendar-inactive.svg";
import notificationsActive from "../assets/icons/nav-icons/notifications-active.svg";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";

const navItems = [
  { to: "/", active: homeActive, inactive: homeInactive, label: "Home" },
  { to: "/search", active: searchActive, inactive: searchInactive, label: "Search" },
  { to: "/messages", active: chatActive, inactive: chatInactive, label: "Inbox" },
  { to: "/events", active: calendarActive, inactive: calendarInactive, label: "Calendar" },
  { to: "/notifications", active: notificationsActive, inactive: notificationsInactive, label: "Notifications" },
];

export default function BottomNav() {
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 80) setScrolled(false);
      else if (delta > 6) setScrolled(true);
      else if (delta < -6) setScrolled(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed bottom-4 left-4 right-4 z-30"
      style={{ originX: 0.5, originY: 1 }}
      animate={{ scale: scrolled ? 0.8 : 1 }}
      transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="mx-auto max-w-md rounded-full border border-[#222222]/5 bg-[#F5F5F5]/50 p-1 backdrop-blur-[16px]">
        <ul className="flex items-center gap-0">
          {navItems.map(({ to, active, inactive, label }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-center rounded-full px-6 py-4 transition-colors ${
                    isActive ? "bg-[#222222]/[0.07]" : "active:bg-[#222222]/[0.07]"
                  }`
                }
              >
                {({ isActive }) => (
                  <img
                    src={isActive ? active : inactive}
                    alt={label}
                    className="h-6 w-6"
                  />
                )}
              </NavLink>
            </li>
          ))}

        </ul>
      </div>
    </motion.nav>
  );
}
