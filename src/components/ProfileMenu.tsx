import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      {/* Dropdown menu */}
      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-56 rounded-lg border border-gray-stroke bg-white py-1 shadow-card lg:left-0">
          <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-dark hover:bg-gray-hover">
            <User size={18} />
            Profile
          </button>
          <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-dark hover:bg-gray-hover">
            <Settings size={18} />
            Settings
          </button>
          <div className="my-1 border-t border-gray-stroke" />
          <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red hover:bg-gray-hover">
            <LogOut size={18} />
            Log out
          </button>
        </div>
      )}

      {/* Profile button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-hover"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-stroke text-sm font-semibold text-gray-light">
          {!imgError ? (
            <img
              src="https://i.pravatar.cc/80?u=jane-doe"
              alt="Jane Doe"
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            "JD"
          )}
        </div>
        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-sm font-semibold text-gray-dark">
            Jane Doe
          </p>
          <p className="truncate text-xs text-gray-light">jane@example.com</p>
        </div>
      </button>
    </div>
  );
}
