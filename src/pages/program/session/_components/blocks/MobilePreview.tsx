import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  url: string;
  onClose: () => void;
};

// Renders an iframe of the current page sized to a mobile viewport so the
// `lg:` responsive classes fire as mobile. The actual app inside the iframe
// detects the iframe context (window.self !== window.top) and suppresses the
// VersionMenu, so we don't get a recursive nest of menus.
export default function MobilePreview({ url, onClose }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close mobile preview"
        className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-dark shadow-lg transition-colors hover:bg-gray-hover"
      >
        <X size={20} />
      </button>
      <div
        className="relative overflow-hidden rounded-[40px] border-[10px] border-gray-dark bg-black shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        style={{ width: 393, height: 813 }}
      >
        <iframe
          src={url}
          title="Mobile preview"
          className="block h-full w-full border-0 bg-white"
        />
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-medium text-gray-dark shadow">
        Mobile preview · 393 × 813
      </div>
    </div>
  );
}
