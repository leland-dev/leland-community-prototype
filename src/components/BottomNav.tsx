import { NavLink } from "react-router-dom";

import homeActive from "../assets/icons/nav-icons/home-active.svg";
import homeInactive from "../assets/icons/nav-icons/home-inactive.svg";
import browseActive from "../assets/icons/nav-icons/browse-active.svg";
import browseInactive from "../assets/icons/nav-icons/browse-inactive.svg";
import searchActive from "../assets/icons/nav-icons/search-active.svg";
import searchInactive from "../assets/icons/nav-icons/search-inactive.svg";
import calendarActive from "../assets/icons/nav-icons/calendar-active.svg";
import calendarInactive from "../assets/icons/nav-icons/calendar-inactive.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import chatInactive from "../assets/icons/nav-icons/chat-inactive.svg";

const navItems = [
  { to: "/", active: homeActive, inactive: homeInactive, label: "Home" },
  { to: "/browse", active: browseActive, inactive: browseInactive, label: "Browse" },
  { to: "/search", active: searchActive, inactive: searchInactive, label: "Search" },
  { to: "/calendar", active: calendarActive, inactive: calendarInactive, label: "Calendar" },
  { to: "/messages", active: chatActive, inactive: chatInactive, label: "Inbox" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-stroke bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, active, inactive, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-3 py-3 transition-colors ${
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
      </ul>
    </nav>
  );
}
