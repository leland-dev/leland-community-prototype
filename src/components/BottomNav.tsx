import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import homeActive from "../assets/icons/nav-icons/home-active.svg";
import homeInactive from "../assets/icons/nav-icons/home-inactive.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import chatInactive from "../assets/icons/nav-icons/chat-inactive.svg";
import calendarActive from "../assets/icons/nav-icons/calendar-active.svg";
import calendarInactive from "../assets/icons/nav-icons/calendar-inactive.svg";
import notificationsActive from "../assets/icons/nav-icons/notifications-active.svg";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";

const navItems = [
  { to: "/", active: homeActive, inactive: homeInactive, label: "Home" },
  { to: "/messages", active: chatActive, inactive: chatInactive, label: "Inbox" },
  { to: "/events", active: calendarActive, inactive: calendarInactive, label: "Calendar" },
  { to: "/notifications", active: notificationsActive, inactive: notificationsInactive, label: "Notifications" },
];

export default function BottomNav() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      // Ignore tiny jitters; always show near the top
      if (y < 80) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed bottom-4 left-4 right-4 z-30 transition-all duration-200 ease-out ${hidden ? "translate-y-[calc(100%+24px)]" : "translate-y-0"}`}
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

          {/* Profile — last item */}
          <li className="flex-1">
            <NavLink
              to="/profile-v2"
              className={({ isActive }) =>
                `flex items-center justify-center rounded-full px-6 py-4 transition-colors ${
                  isActive ? "bg-[#222222]/[0.07]" : "active:bg-[#222222]/[0.07]"
                }`
              }
            >
              {({ isActive }) => (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className={`h-7 w-7 rounded-full object-cover ${isActive ? "ring-2 ring-gray-dark" : ""}`}
                />
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
