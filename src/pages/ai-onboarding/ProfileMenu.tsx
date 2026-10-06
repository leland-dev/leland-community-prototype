/* Signed-in avatar + dropdown, mirrored from TopNav's profile menu (same
 * avatar, item markup, icons and motion) minus the coach-mode and admin
 * entries, which don't apply to a brand-new AI Builder learner. */
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import profilePhoto from "../../assets/profile photos/profile photo.png";
import myCoursesIcon from "../../assets/icons/my-courses.svg";
import giftIcon from "../../assets/icons/gift.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import helpIcon from "../../assets/icons/help.svg";
import logOutIcon from "../../assets/icons/log out.svg";

type Item = { to: string | null; icon: string; label: string; isProfile?: boolean; danger?: boolean };

const GROUPS: Item[][] = [
  [
    { to: "/profile/june-allen?me=1", icon: profilePhoto, label: "Profile", isProfile: true },
    { to: "/my-programs", icon: myCoursesIcon, label: "My programs" },
    { to: null, icon: giftIcon, label: "Refer a friend" },
    { to: "/settings", icon: settingsIcon, label: "Settings" },
  ],
  [
    { to: null, icon: helpIcon, label: "Help" },
    { to: null, icon: logOutIcon, label: "Log out", danger: true },
  ],
];

const itemClass = (danger?: boolean) =>
  `flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium transition-colors ${
    danger ? "text-[#D92D20] hover:bg-[#222222]/5" : "text-gray-dark hover:bg-[#222222]/5"
  }`;

export function ProfileMenu({ theme = "light" }: { theme?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  const ring = theme === "dark" ? "ring-white" : "ring-gray-dark";
  const hoverRing = theme === "dark" ? "hover:ring-white/40" : "hover:ring-gray-stroke";
  return (
    <div ref={ref} className="relative flex items-center">
      <button onClick={() => setOpen((o) => !o)} aria-label="Account menu" aria-expanded={open} className="flex h-9 w-9 items-center justify-center rounded-full">
        <img
          src={profilePhoto}
          alt="Profile"
          className={`h-[30px] w-[30px] rounded-full object-cover transition-shadow ${open ? `ring-2 ${ring}` : `hover:ring-2 ${hoverRing}`}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
          >
            {GROUPS.map((group, gi) => (
              <div key={gi} className={`px-2 py-2${gi > 0 ? " border-t border-gray-stroke" : ""}`}>
                {group.map((item) =>
                  item.to ? (
                    <NavLink key={item.label} to={item.to} onClick={() => setOpen(false)} className={itemClass(item.danger)}>
                      <img src={item.icon} alt="" className={`h-6 w-6 shrink-0${item.isProfile ? " rounded-full object-cover" : ""}`} />
                      {item.label}
                    </NavLink>
                  ) : (
                    <button key={item.label} type="button" onClick={() => setOpen(false)} className={itemClass(item.danger)}>
                      <img src={item.icon} alt="" className="h-6 w-6 shrink-0" />
                      {item.label}
                    </button>
                  ),
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
