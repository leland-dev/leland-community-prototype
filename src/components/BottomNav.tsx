import { NavLink } from "react-router-dom";

import homeActive from "../assets/icons/nav-icons/home-active.svg";
import homeInactive from "../assets/icons/nav-icons/home-inactive.svg";
import searchActive from "../assets/icons/nav-icons/search-active.svg";
import searchInactive from "../assets/icons/nav-icons/search-inactive.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import chatInactive from "../assets/icons/nav-icons/chat-inactive.svg";
import livestreamsActive from "../assets/icons/nav-icons/livestreams-active.svg";
import livestreamsInactive from "../assets/icons/nav-icons/livestreams-inactive.svg";
import notificationsActive from "../assets/icons/nav-icons/notifications-active.svg";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";

const navItems = [
  { to: "/", active: homeActive, inactive: homeInactive, label: "Home" },
  { to: "/search", active: searchActive, inactive: searchInactive, label: "Search" },
  { to: "/events", active: livestreamsActive, inactive: livestreamsInactive, label: "Livestreams" },
  { to: "/notifications", active: notificationsActive, inactive: notificationsInactive, label: "Notifications" },
  { to: "/messages", active: chatActive, inactive: chatInactive, label: "Messages" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-stroke bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-center">
        {navItems.map(({ to, active, inactive, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className="flex flex-col items-center justify-center gap-1 py-2"
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? active : inactive}
                    alt={label}
                    className="h-6 w-6"
                  />
                  <span className={`text-[11px] ${isActive ? "font-semibold text-gray-dark" : "font-medium text-gray-light"}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
