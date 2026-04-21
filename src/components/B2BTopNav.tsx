import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import profilePhoto from "../assets/profile photos/profile photo.png";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import settingsIcon from "../assets/icons/settings.svg";
import lelandLogo from "../assets/Logo.svg";

const profileMenuGroups = [
  {
    items: [
      { to: "/", icon: switchIcon, label: "Switch to customer", danger: false },
      { to: null, icon: helpIcon, label: "Help", danger: false },
      { to: null, icon: logOutIcon, label: "Log out", danger: true },
    ],
  },
];

export default function B2BTopNav({
  onNavigateSettings,
  onNavigateDashboard,
  isOnSettings = false,
}: {
  onNavigateSettings?: () => void;
  onNavigateDashboard?: () => void;
  isOnSettings?: boolean;
} = {}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  return (
    <header className="border-b border-gray-stroke bg-white">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
      <div className="relative flex h-14 items-center justify-between">
        {/* Left: Logo */}
        <NavLink to="/" className="flex shrink-0 items-center">
          <img src={lelandLogo} alt="Leland" className="h-[22px] w-auto" />
        </NavLink>

        {/* Right: Profile avatar + dropdown */}
        <div ref={profileRef} className="relative flex items-center">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full"
          >
            <img
              src={profilePhoto}
              alt="Profile"
              className={`h-[30px] w-[30px] rounded-full object-cover transition-shadow ${
                profileOpen ? "ring-2 ring-gray-dark" : "hover:ring-2 hover:ring-gray-stroke"
              }`}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
              >
                {/* Admin Settings / Partner dashboard toggle */}
                <div className="px-2 py-2">
                  {isOnSettings ? (
                    <button
                      onClick={() => { setProfileOpen(false); onNavigateDashboard?.(); }}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0 text-gray-dark"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      Partner dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => { setProfileOpen(false); onNavigateSettings?.(); }}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                    >
                      <img src={settingsIcon} alt="Admin Settings" className="h-6 w-6 shrink-0" />
                      Admin Settings
                    </button>
                  )}
                </div>
                {profileMenuGroups.map((group, gi) => (
                  <div
                    key={gi}
                    className="border-t border-gray-stroke px-2 py-2"
                  >
                    {group.items.map(({ to, icon, label, danger }) =>
                      to ? (
                        <NavLink
                          key={label}
                          to={to}
                          onClick={() => setProfileOpen(false)}
                          className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium transition-colors ${
                            danger
                              ? "text-[#D92D20] hover:bg-gray-hover"
                              : "text-gray-dark hover:bg-gray-hover"
                          }`}
                        >
                          {icon && (
                            <img
                              src={icon}
                              alt={label}
                              className="h-6 w-6 shrink-0"
                            />
                          )}
                          {label}
                        </NavLink>
                      ) : (
                        <button
                          key={label}
                          onClick={() => setProfileOpen(false)}
                          className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium transition-colors ${
                            danger
                              ? "text-[#D92D20] hover:bg-gray-hover"
                              : "text-gray-dark hover:bg-gray-hover"
                          }`}
                        >
                          {icon && (
                            <img src={icon} alt={label} className="h-6 w-6 shrink-0" />
                          )}
                          {label}
                        </button>
                      )
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </header>
  );
}
