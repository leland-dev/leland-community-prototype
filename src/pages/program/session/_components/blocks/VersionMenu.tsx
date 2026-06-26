import { useEffect, useRef, useState } from "react";
import { MoreVertical, Smartphone } from "lucide-react";

export type VersionOption = {
  id: string;
  label: string;
  description?: string;
};

type Props = {
  versions: VersionOption[];
  currentId: string;
  onChange: (id: string) => void;
  mobilePreviewActive?: boolean;
  onToggleMobilePreview?: () => void;
};

export default function VersionMenu({
  versions,
  currentId,
  onChange,
  mobilePreviewActive,
  onToggleMobilePreview,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={wrapperRef} className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-2 w-[260px] overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_14px_44px_rgba(0,0,0,0.18)]">
          <div className="border-b border-gray-stroke px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-light">
            Prototype version
          </div>
          <ul>
            {versions.map((v) => {
              const active = v.id === currentId;
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(v.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                      active ? "bg-gray-hover/60" : "hover:bg-gray-hover/40"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        active ? "border-gray-dark bg-white" : "border-gray-stroke bg-white"
                      }`}
                      aria-hidden
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-gray-dark" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold text-gray-dark">
                        {v.label}
                      </span>
                      {v.description && (
                        <span className="mt-0.5 block text-[10px] leading-tight text-gray-light">
                          {v.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Preview options */}
          {onToggleMobilePreview && (
            <div className="border-t border-gray-stroke">
              <button
                type="button"
                onClick={() => {
                  onToggleMobilePreview();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-hover/40"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-gray-dark">
                  <Smartphone size={16} strokeWidth={2} />
                </span>
                <span className="flex-1 text-[11px] font-semibold text-gray-dark">
                  Mobile preview
                </span>
                <span
                  className={`relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors ${
                    mobilePreviewActive ? "bg-gray-dark" : "bg-gray-stroke"
                  }`}
                  aria-hidden
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      mobilePreviewActive ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition-colors hover:bg-gray-hover/60"
        aria-label="Prototype versions"
        aria-expanded={open}
      >
        <MoreVertical size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
