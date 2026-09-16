import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";

import homeAlt from "../assets/icons/nav-icons/home-alt.svg";
import searchActive from "../assets/icons/nav-icons/search-active.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import jobsIcon from "../assets/icons/jobs.svg";
import browseActive from "../assets/icons/nav-icons/browse-active.svg";

// Mirrors the v1 alt-icons top nav: For you · Explore · My Leland · Jobs ·
// Messages. Notifications lives in the mobile top nav's top-right corner
// instead. When the user is already inside the /alt-nav experience, `altTo`
// keeps them there instead of bouncing back to the classic-nav routes.
const navItems = [
  { to: "/", altTo: "/alt-nav", icon: homeAlt, label: "For you", end: true },
  { to: "/browse", altTo: "/alt-nav/browse", icon: searchActive, label: "Explore" },
  { to: "/dashboard", altTo: "/my-leland", icon: browseActive, label: "My Leland" },
  { to: "/jobs", altTo: "/alt-nav/jobs", icon: jobsIcon, label: "Jobs" },
  { to: "/messages", altTo: "/alt-nav/messages", icon: chatActive, label: "Messages", badge: 1 },
];

export default function BottomNav() {
  const { dark: darkMode } = useDarkMode();
  const { pathname } = useLocation();
  const inAltNav = pathname.startsWith("/alt-nav") || pathname.startsWith("/my-leland");
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
    <nav className={`fixed bottom-0 left-0 right-0 z-30 ${darkMode ? "bg-[#131313]" : "bg-white"} shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pt-1 pb-[max(env(safe-area-inset-bottom),8px)] transition-transform duration-200 ease-out ${hidden ? "translate-y-full" : "translate-y-0"}`}>
      <ul className="flex items-center">
        {navItems.map(({ to, altTo, icon, label, end, badge, round }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={inAltNav && altTo ? altTo : to}
              end={end}
              className="flex flex-col items-center justify-center gap-1 py-2"
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <img
                      src={icon}
                      alt={label}
                      className={`h-7 w-7 ${
                        round
                          ? // My Leland photo: always full opacity; gains a 1.5px border when active
                            `rounded-full object-cover${isActive ? " ring-[1.5px] ring-gray-dark" : ""}`
                          : isActive
                            ? ""
                            : "opacity-40"
                      }`}
                    />
                    {badge ? (
                      <span className="absolute -right-2 -top-1 flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full border border-white bg-[#FF003D] px-1 py-0.5 text-[11px] font-semibold leading-none text-white">
                        {badge}
                      </span>
                    ) : null}
                  </span>
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
