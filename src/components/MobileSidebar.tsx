import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import profilePhoto from "../assets/profile photos/profile photo.png";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const { dark: darkMode, toggle: toggleDarkMode } = useDarkMode();
  const [browseOpen, setBrowseOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col bg-white"
          >
            {/* Profile header */}
            <div className="px-6 pt-6 pb-4">
              <NavLink
                to="/profile-v2"
                onClick={onClose}
                className="flex items-center gap-3"
              >
                <img
                  src={profilePhoto}
                  alt="Jane Doe"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-[18px] font-medium text-gray-dark">Jane Doe</p>
                  <p className="text-[15px] text-gray-light">View profile</p>
                </div>
              </NavLink>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto">
              <nav className="px-6 py-2">
                {/* Browse — expandable */}
                <button
                  onClick={() => setBrowseOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-3 text-[22px] font-normal text-gray-dark transition-colors hover:text-black"
                >
                  Browse
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${browseOpen ? "rotate-90" : ""}`}
                  >
                    <polyline points="7 5 13 10 7 15" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {browseOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-1 pl-3">
                        <NavLink to="/coaches" onClick={onClose} className="block py-2 text-[16px] text-gray-dark hover:text-black">Find a Coach</NavLink>
                        <NavLink to="/events" onClick={onClose} className="block py-2 text-[16px] text-gray-dark hover:text-black">Livestreams</NavLink>
                        <NavLink to="/courses" onClick={onClose} className="block py-2 text-[16px] text-gray-dark hover:text-black">Live Programs</NavLink>
                        <NavLink to="/plus" onClick={onClose} className="block py-2 text-[16px] text-gray-dark hover:text-black">Leland+</NavLink>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dashboard */}
                <NavLink
                  to="/"
                  onClick={onClose}
                  className="block py-3 text-[22px] font-normal text-gray-dark transition-colors hover:text-black"
                >
                  Dashboard
                </NavLink>

                {/* Livestreams */}
                <NavLink
                  to="/events"
                  onClick={onClose}
                  className="block py-3 text-[22px] font-normal text-gray-dark transition-colors hover:text-black"
                >
                  Livestreams
                </NavLink>

                {/* Live Programs */}
                <NavLink
                  to="/courses"
                  onClick={onClose}
                  className="block py-3 text-[22px] font-normal text-gray-dark transition-colors hover:text-black"
                >
                  Live Programs
                </NavLink>

                {/* Leland+ */}
                <NavLink
                  to="/plus"
                  onClick={onClose}
                  className="block py-3 text-[22px] font-normal text-gray-dark transition-colors hover:text-black"
                >
                  Leland+
                </NavLink>

                {/* Account — expandable */}
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-3 text-[22px] font-normal text-gray-dark transition-colors hover:text-black"
                >
                  Account
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${accountOpen ? "rotate-90" : ""}`}
                  >
                    <polyline points="7 5 13 10 7 15" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {accountOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-1 pl-3">
                        <NavLink to="/profile-v2" onClick={onClose} className="block py-2 text-[16px] text-gray-dark hover:text-black">Settings</NavLink>
                        <NavLink to="/profile-v2?tab=more" onClick={onClose} className="block py-2 text-[16px] text-gray-dark hover:text-black">My Groups</NavLink>
                        <button onClick={onClose} className="block py-2 text-[16px] text-gray-dark hover:text-black">Order History</button>
                        <button onClick={onClose} className="block py-2 text-[16px] text-[#D92D20] hover:text-red-700">Log out</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>

              {/* Secondary links */}
              <div className="border-t border-gray-stroke px-6 py-3">
                <NavLink
                  to="/"
                  onClick={onClose}
                  className="block py-2 text-[16px] text-gray-dark transition-colors hover:text-black"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/coach/home"
                  onClick={onClose}
                  className="block py-2 text-[16px] text-gray-dark transition-colors hover:text-black"
                >
                  View Expert Dashboard
                </NavLink>
              </div>

              {/* Design toggle — dark mode + log out */}
              <div className="border-t border-gray-stroke px-6 py-3">
                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center justify-between py-2 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  <span>Dark Mode</span>
                  <span
                    aria-hidden
                    className={`relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors ${darkMode ? "bg-[#FFD96F]" : "bg-[#E5E5E5]"}`}
                  >
                    <span
                      className="absolute h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform"
                      style={{ transform: `translateX(${darkMode ? 20 : 2}px)` }}
                    />
                  </span>
                </button>
                <button
                  onClick={onClose}
                  className="flex w-full items-center gap-[10px] px-5 py-3 text-[14px] font-medium text-[#D92D20] transition-colors hover:bg-gray-hover"
                >
                  <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
