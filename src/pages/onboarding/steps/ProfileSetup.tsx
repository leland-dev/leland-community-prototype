import { useMemo, useRef, useState } from "react";
import { Camera, Check } from "lucide-react";

import foundPhoto from "../../../assets/profile photos/pic-1.png";

/* ─────────────────────────────────────────────────────────────────────────
 * ProfileSetup (v2) — the gentle photo step. Just the photo:
 *  - OAuth returned one: "Here's the photo we found — want to change it?"
 *  - Otherwise: an upload prompt with a stacked "Skip" beneath the primary.
 * The URL slug is derived silently from the name; no handle UI.
 * ──────────────────────────────────────────────────────────────────────── */

// In the real flow this comes from OAuth. Mocked here.
const NAME = "June Allen";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProfileSetup({
  onContinue,
  onSkip,
  /** whether OAuth returned a photo (mocked; defaults to true) */
  oauthPhoto = true,
}: {
  onContinue: () => void;
  onSkip?: () => void;
  oauthPhoto?: boolean;
}) {
  const [photo, setPhoto] = useState<string | null>(oauthPhoto ? foundPhoto : null);
  const fileRef = useRef<HTMLInputElement>(null);

  // hidden URL slug — derived from the name, never shown or edited
  const slug = useMemo(() => slugify(NAME), []);

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="flex h-full flex-col" data-profile-slug={slug}>
      {/* content */}
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-32 pt-2">
        <div className="pt-2">
          <h2 className="text-balance font-serif text-[28px] leading-[1.12] text-gray-dark md:text-[32px]">
            {photo ? "Here's the photo we found" : "Add a profile photo"}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-light">
            {photo ? "Want to change it?" : "A face helps people connect with you."}
          </p>
        </div>

        {/* photo — centered in the remaining space */}
        <div className="flex flex-1 flex-col items-center justify-center gap-5 pb-10">
          <button
            onClick={() => fileRef.current?.click()}
            className="h-36 w-36 overflow-hidden rounded-full ring-1 ring-black/[0.06] transition-transform active:scale-[0.98]"
            aria-label={photo ? "Change photo" : "Upload a photo"}
          >
            {photo ? (
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full flex-col items-center justify-center gap-1.5 border-2 border-dashed border-gray-stroke bg-gray-hover text-gray-light">
                <Camera size={30} />
                <span className="text-[13px] font-medium">Upload</span>
              </span>
            )}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-[15px] font-medium text-gray-dark underline decoration-gray-stroke underline-offset-4 transition-colors hover:decoration-gray-dark"
          >
            {photo ? "Choose a different photo" : "Upload a photo"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={pickFile}
            className="hidden"
          />
        </div>
      </div>

      {/* CTA — primary + (upload mode) stacked skip beneath */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        <button
          onClick={onContinue}
          disabled={!photo}
          className={`pointer-events-auto flex h-14 w-full items-center justify-center gap-1.5 rounded-full text-[15px] font-medium transition-colors ${
            photo
              ? "bg-gray-dark text-white hover:bg-[#333]"
              : "cursor-not-allowed bg-gray-dark/30 text-white"
          }`}
        >
          {photo ? (
            <>
              <Check size={17} />
              Looks good
            </>
          ) : (
            "Continue"
          )}
        </button>
        {!photo && onSkip ? (
          <button
            onClick={onSkip}
            className="pointer-events-auto mt-2 flex h-12 w-full items-center justify-center text-[15px] font-medium text-gray-light transition-colors hover:text-gray-dark"
          >
            Skip
          </button>
        ) : null}
      </div>
    </div>
  );
}
