import { useState, useRef, useEffect } from "react";
import { useVersion, type PrototypeVersion } from "../contexts/VersionContext";

const versions: { label: string; value: PrototypeVersion; description: string }[] = [
  { label: "Version A", value: "A", description: "Current prototype" },
  { label: "Version B", value: "B", description: "Alternate prototype" },
];

export default function VersionToggle() {
  const { version, setVersion } = useVersion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-24 right-4 z-[9999] md:bottom-6 md:right-6">
      {/* Popover menu */}
      {open ? (
        <div className="absolute bottom-14 right-0 w-[200px] rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Prototype</p>
          </div>
          {versions.map((v) => (
            <button
              key={v.value}
              onClick={() => { setVersion(v.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                version === v.value ? "bg-gray-50" : ""
              }`}
            >
              <div>
                <p className={`text-[14px] font-medium ${version === v.value ? "text-gray-900" : "text-gray-700"}`}>
                  {v.label}
                </p>
                <p className="text-[12px] text-gray-400">{v.description}</p>
              </div>
              {version === v.value ? (
                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {/* Three-dot trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Switch prototype version"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white shadow-md border border-gray-200 md:bg-[#222222]/5 md:shadow-none md:border-0 transition-colors hover:bg-gray-50 md:hover:bg-[#222222]/[0.08]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="3" cy="8" r="1.5" fill="#707070" />
          <circle cx="8" cy="8" r="1.5" fill="#707070" />
          <circle cx="13" cy="8" r="1.5" fill="#707070" />
        </svg>
      </button>

      {/* Active version badge */}
      <span className="pointer-events-none absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#222222] text-[10px] font-bold text-white">
        {version}
      </span>
    </div>
  );
}
