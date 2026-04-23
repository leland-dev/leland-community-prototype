import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import homeActive from "../assets/icons/nav-icons/home-active.svg";
import homeInactive from "../assets/icons/nav-icons/home-inactive.svg";
import browseActive from "../assets/icons/nav-icons/browse-active.svg";
import browseInactive from "../assets/icons/nav-icons/browse-inactive.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import chatInactive from "../assets/icons/nav-icons/chat-inactive.svg";
import notificationsActive from "../assets/icons/nav-icons/notifications-active.svg";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";

const navItems = [
  { to: "/", active: homeActive, inactive: homeInactive, label: "Home" },
  { to: "/browse", active: browseActive, inactive: browseInactive, label: "Browse" },
  { to: "/messages", active: chatActive, inactive: chatInactive, label: "Inbox" },
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
      className={`fixed bottom-0 left-0 right-0 border-t border-gray-stroke bg-white pb-[env(safe-area-inset-bottom)] transition-transform duration-200 ease-out ${hidden ? "translate-y-full" : "translate-y-0"}`}
    >
      <ul className="flex items-center justify-around px-2 py-1">
        {navItems.map(({ to, active, inactive, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-colors ${
                  isActive
                    ? "text-gray-dark"
                    : "text-gray-light active:bg-gray-hover"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? active : inactive}
                    alt={label}
                    className="h-[22px] w-[22px]"
                  />
                  <span className="text-[12px] font-medium leading-tight">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to="/profile-v2"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-colors ${
                isActive
                  ? "text-gray-dark"
                  : "text-gray-light active:bg-gray-hover"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className={`h-[22px] w-[22px] rounded-full object-cover ${isActive ? "ring-2 ring-gray-dark" : ""}`}
                />
                <span className="text-[12px] font-medium leading-tight">Profile</span>
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
