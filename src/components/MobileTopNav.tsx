import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import moreIcon from "../assets/icons/nav-icons/more-active.svg";
import searchInactive from "../assets/icons/nav-icons/search-inactive.svg";
import MobileSidebar from "./MobileSidebar";

export default function MobileTopNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <>
      <header className={`fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-stroke bg-white px-4 transition-transform duration-200 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
        {/* Left: menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-8 w-8 items-center justify-center"
        >
          <img
            src={moreIcon}
            alt="Menu"
            className="h-[20px] w-[20px]"
          />
        </button>

        {/* Center: logo */}
        <img src={Logo} alt="Leland" className="h-[22px] w-auto" />

        {/* Right: search */}
        <NavLink
          to="/search"
          className="flex h-8 w-8 items-center justify-center"
        >
          <img
            src={searchInactive}
            alt="Search"
            className="h-[20px] w-[20px]"
          />
        </NavLink>
      </header>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
