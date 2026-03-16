import { NavLink } from "react-router-dom";
import MoreMenu from "./MoreMenu";
import { useExtraLinks } from "./ExtraLinksContext";
import Logo from "../assets/Logo.svg";

import homeActive from "../assets/icons/nav-icons/home-active.svg";
import homeInactive from "../assets/icons/nav-icons/home-inactive.svg";
import browseActive from "../assets/icons/nav-icons/browse-active.svg";
import browseInactive from "../assets/icons/nav-icons/browse-inactive.svg";
import searchActive from "../assets/icons/nav-icons/search-active.svg";
import searchInactive from "../assets/icons/nav-icons/search-inactive.svg";
import notificationsActive from "../assets/icons/nav-icons/notifications-active.svg";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";
import inboxActive from "../assets/icons/nav-icons/inbox-active.svg";
import inboxInactive from "../assets/icons/nav-icons/inbox-inactive.svg";
import eventsActive from "../assets/icons/nav-icons/events-active.svg";
import eventsInactive from "../assets/icons/nav-icons/events-inactive.svg";
import coursesActive from "../assets/icons/nav-icons/courses-active.svg";
import coursesInactive from "../assets/icons/nav-icons/courses-inactive.svg";
import lelandPlusActive from "../assets/icons/nav-icons/leland-plus-active.svg";
import lelandPlusInactive from "../assets/icons/nav-icons/leland-plus-inactive.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";

const navItems = [
  { to: "/", active: homeActive, inactive: homeInactive, label: "Home" },
  { to: "/browse", active: browseActive, inactive: browseInactive, label: "Browse" },
  { to: "/search", active: searchActive, inactive: searchInactive, label: "Search" },
  { to: "/events", active: eventsActive, inactive: eventsInactive, label: "Free Events" },
  { to: "/courses", active: coursesActive, inactive: coursesInactive, label: "Courses" },
  { to: "/plus", active: lelandPlusActive, inactive: lelandPlusInactive, label: "Leland+" },
  { to: "/notifications", active: notificationsActive, inactive: notificationsInactive, label: "Notifications" },
  { to: "/messages", active: inboxActive, inactive: inboxInactive, label: "Inbox" },
  { to: "/profile", active: profilePhoto, inactive: profilePhoto, label: "Profile", isProfile: true },
];

const extraPaths = new Set(["/events", "/courses", "/plus"]);

export default function Sidebar() {
  const { showExtraLinks } = useExtraLinks();
  const visibleNavItems = showExtraLinks
    ? navItems
    : navItems.filter((item) => !extraPaths.has(item.to));

  return (
    <nav className="fixed left-0 top-0 z-10 flex h-full w-[72px] flex-col bg-white px-3 py-6 lg:w-[240px] lg:px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center px-3">
        <img src={Logo} alt="Leland" className="hidden h-[22px] w-auto lg:block" />
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 lg:hidden"
        >
          <path
            d="M15.8474 15.8447L1.81128 19.9199L6.3396 5.88379L19.9226 1.80859L15.8474 15.8447ZM10.8669 8.60059C9.61663 8.60059 8.60331 9.61395 8.60327 10.8643C8.60327 12.1146 9.6166 13.1279 10.8669 13.1279C12.1172 13.1279 13.1306 12.1146 13.1306 10.8643C13.1306 9.61399 12.1172 8.60066 10.8669 8.60059Z"
            fill="#038561"
          />
        </svg>
      </div>

      {/* Nav items */}
      <ul className="flex flex-1 flex-col gap-1">
        {visibleNavItems.map(({ to, active, inactive, label, isProfile }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-lg px-3 py-3 transition-colors lg:px-4 ${
                  isActive
                    ? "font-semibold text-gray-dark"
                    : "text-gray-light hover:bg-gray-hover"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? active : inactive}
                    alt={label}
                    className={`h-[22px] w-[22px] shrink-0 ${isProfile ? `rounded-full object-cover${isActive ? " ring-[1.5px] ring-black" : ""}` : ""}`}
                  />
                  <span className="hidden text-[18px] font-medium lg:block">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* More menu at bottom */}
      <MoreMenu />
    </nav>
  );
}
