import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import moreIcon from "../assets/icons/nav-icons/more-active.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";
import logoIcon from "../assets/logos/leland-logo-split/Icon.svg";
import logoWordmark from "../assets/logos/leland-logo-split/Wordmark.svg";
import MobileSidebar from "./MobileSidebar";

export default function MobileTopNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // On a post detail page the left slot becomes a Back button (returns the
  // user to wherever they came from) instead of the menu.
  const isPostDetail = location.pathname.startsWith("/post/");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between bg-white px-4 transition-shadow duration-200 ease-out ${scrolled ? "shadow-[0_1px_4px_rgba(0,0,0,0.08)]" : ""}`}>
        {/* Left: menu — or Back button on a post detail page */}
        {isPostDetail ? (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-8 w-8 items-center justify-center text-gray-dark"
          >
            <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
            className="flex h-8 w-8 items-center justify-center"
          >
            <img
              src={moreIcon}
              alt="Menu"
              className="h-[23px] w-[23px]"
            />
          </button>
        )}

        {/* Center: Leland icon + wordmark. Wordmark animates away on scroll. */}
        <NavLink to="/" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[6px]">
          <img
            src={logoIcon}
            alt="Leland"
            className="h-[23px] w-auto"
          />
          <motion.img
            src={logoWordmark}
            alt=""
            className="h-[20px] w-auto"
            animate={{
              opacity: scrolled ? 0 : 1,
              width: scrolled ? 0 : "auto",
              marginLeft: scrolled ? 0 : undefined,
            }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </NavLink>

        {/* Right: profile */}
        <NavLink
          to="/profile-v2"
          className="flex h-8 w-8 items-center justify-center"
        >
          <img
            src={profilePhoto}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        </NavLink>
      </header>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
