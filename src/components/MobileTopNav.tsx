import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";
import MobileSidebar from "./MobileSidebar";

export default function MobileTopNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-stroke bg-white px-4">
        {/* Left: profile photo */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-8 w-8 items-center justify-center"
        >
          <img
            src={profilePhoto}
            alt="Profile"
            className="h-7 w-7 rounded-full object-cover"
          />
        </button>

        {/* Center: logo */}
        <img src={Logo} alt="Leland" className="h-[22px] w-auto" />

        {/* Right: notifications */}
        <NavLink
          to="/notifications"
          className="flex h-8 w-8 items-center justify-center"
        >
          <img
            src={notificationsInactive}
            alt="Notifications"
            className="h-[20px] w-[20px]"
          />
        </NavLink>
      </header>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
