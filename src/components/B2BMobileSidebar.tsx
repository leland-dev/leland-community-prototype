import { motion, AnimatePresence } from "motion/react";
import { navItems, type B2BView } from "../pages/b2b/B2BData";
import settingsIcon from "../assets/icons/settings.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";
import kelloggLogo from "../assets/img/kellogg.svg";

interface Props {
  open: boolean;
  onClose: () => void;
  activeView: B2BView;
  onNavigate: (view: B2BView) => void;
  onNavigateSettings: () => void;
  items?: typeof navItems;
  showVerizon?: boolean;
}

export default function B2BMobileSidebar({ open, onClose, activeView, onNavigate, onNavigateSettings, items = navItems, showVerizon }: Props) {
  const handleNav = (view: B2BView) => {
    onNavigate(view);
    onClose();
  };

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
            className="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col overflow-y-auto bg-white"
          >
            {/* Profile header */}
            <div className="px-5 pb-5 pt-6">
              <img
                src={profilePhoto}
                alt="Katie Brown"
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="mt-3 text-[16px] font-semibold text-gray-dark">Katie Brown</p>
              <p className="text-sm text-gray-light">katie.brown@kellogg.edu</p>
            </div>

            {/* Nav items + Admin Settings */}
            <div className="border-t border-gray-stroke py-2">
              {items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={`flex w-full items-center gap-[10px] px-5 py-3 text-[16px] font-medium transition-colors ${
                    activeView === item.key
                      ? "bg-[#222222]/5 text-gray-dark"
                      : "text-gray-dark hover:bg-gray-hover"
                  }`}
                >
                  <img src={item.icon} alt="" className="h-6 w-6 shrink-0" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { onNavigateSettings(); onClose(); }}
                className={`flex w-full items-center gap-[10px] px-5 py-3 text-[16px] font-medium transition-colors ${
                  activeView === "settings"
                    ? "bg-[#222222]/5 text-gray-dark"
                    : "text-gray-dark hover:bg-gray-hover"
                }`}
              >
                <img src={settingsIcon} alt="" className="h-6 w-6 shrink-0" />
                Admin Settings
              </button>
            </div>

            {/* Provisioned for */}
            <div className="mx-4 flex flex-col items-center py-6">
              <div className="flex w-full items-center gap-[6px]">
                <div className="h-px flex-1 bg-gray-stroke" />
                <span className="whitespace-nowrap text-[14px] font-normal uppercase tracking-[0.1em] text-[#9B9B9B]">Provisioned for</span>
                <div className="h-px flex-1 bg-gray-stroke" />
              </div>
              {showVerizon ? (
                <span className="mt-5 text-[22px] font-bold tracking-tight text-[#CD040B]">Verizon</span>
              ) : (
                <img src={kelloggLogo} alt="Kellogg School of Management" className="mt-5 max-h-16 max-w-[60%]" />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
