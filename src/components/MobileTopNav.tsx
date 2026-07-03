import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import moreIcon from "../assets/icons/nav-icons/more-active.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";
import logoIcon from "../assets/logos/leland-logo-split/Icon.svg";
import logoWordmark from "../assets/logos/leland-logo-split/Wordmark.svg";
import { useNavTheme, useNavRightSlot } from "./NavThemeContext";
import { useMobileSidebar } from "./MobileSidebarContext";

export default function MobileTopNav() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navTheme = useNavTheme();
  const { setOpen: setSidebarOpen } = useMobileSidebar();
  const rightSlot = useNavRightSlot();
  // On a post detail page the left slot becomes a Back button (returns the
  // user to wherever they came from) instead of the menu.
  const isPostDetail = location.pathname.startsWith("/post/");

  const isLight = navTheme.light;
  const showWordmark = !navTheme.hideWordmark;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Icon filter: invert to white when light theme is active
  const iconFilter = isLight ? "brightness-0 invert" : "";

  const slideIn = navTheme.slideIn;

  return (
    <>
    {/* Solid strip behind the status bar so iOS Safari picks up the color */}
    {navTheme.bgGradient && (
      <motion.div
        className="fixed left-0 right-0 top-0 z-30"
        style={{ height: "env(safe-area-inset-top, 0px)", backgroundColor: navTheme.bg }}
        initial={slideIn ? { x: "100%" } : false}
        animate={{ x: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      />
    )}
    <motion.header
      initial={slideIn ? { x: "100%" } : false}
      animate={{ x: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between px-4 transition-all duration-200 ease-out ${
        isLight
          ? ""
          : scrolled
            ? "shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
            : ""
      }`}
      style={{
        background: navTheme.bgGradient
          ? `linear-gradient(to bottom, ${navTheme.bg}, transparent)`
          : navTheme.bg,
      }}
    >
      {/* Left: menu — or Back button on a post detail page */}
      {isPostDetail ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className={`flex h-8 w-8 items-center justify-center ${isLight ? "text-white" : "text-gray-dark"}`}
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
            className={`h-[23px] w-[23px] ${iconFilter}`}
          />
        </button>
      )}

      {/* Center: Leland icon + wordmark. Wordmark animates away on scroll.
          If already on the homepage, tapping scrolls to top instead of navigating. */}
      <button
        onClick={() => {
          if (location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            navigate("/");
          }
        }}
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[6px]"
      >
        <img
          src={logoIcon}
          alt="Leland"
          className={`h-[23px] w-auto ${iconFilter}`}
        />
        {showWordmark && (
          <motion.img
            src={logoWordmark}
            alt=""
            className={`h-[20px] w-auto ${iconFilter}`}
            animate={{
              opacity: scrolled ? 0 : 1,
              width: scrolled ? 0 : "auto",
              marginLeft: scrolled ? 0 : undefined,
            }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          />
        )}
      </button>

      {/* Right: custom slot or default profile photo */}
      {rightSlot ?? (
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
      )}
    </motion.header>
    </>
  );
}
