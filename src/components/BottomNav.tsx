import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";

import homeActive from "../assets/icons/nav-icons/home-active.svg";
import searchActive from "../assets/icons/nav-icons/search-active.svg";
import browseActive from "../assets/icons/nav-icons/browse-active.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import notificationsActive from "../assets/icons/nav-icons/notifications-active.svg";

const navItems = [
  { to: "/", icon: homeActive, label: "Home" },
  { to: "/search", icon: searchActive, label: "Search" },
  { to: "/dashboard", icon: browseActive, label: "Dashboard" },
  { to: "/notifications", icon: notificationsActive, label: "Notifications" },
  { to: "/messages", icon: chatActive, label: "Messages" },
];

export default function BottomNav() {
  const { dark: darkMode } = useDarkMode();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 80) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-30 ${darkMode ? "bg-[#131313]" : "bg-white"} shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)] transition-transform duration-200 ease-out ${hidden ? "translate-y-full" : "translate-y-0"}`}>
      <ul className="flex items-center">
        {navItems.map(({ to, icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className="flex flex-col items-center justify-center gap-1 py-2"
            >
              {({ isActive }) => (
                <>
                  <img
                    src={icon}
                    alt={label}
                    className={`h-6 w-6 ${isActive ? "" : "opacity-40"}`}
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
