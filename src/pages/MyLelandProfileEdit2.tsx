import { useState, useEffect } from "react";
import { Button, LinkButton } from "../components/Button";
import MaskIcon from "../components/MaskIcon";
import ProfileEditMode from "./ProfileEditMode";
import ProfileAdminMenu from "./ProfileAdminMenu";
import { SidebarSectionCard } from "./Home";
import { useExpertMode } from "../contexts/ExpertModeContext";
import editIcon from "../assets/icons/edit.svg";
import eyeIcon from "../assets/icons/eye.svg";
import copyIcon from "../assets/icons/copy.svg";
import videoThumbnail from "../assets/img/Video-Thumbnail.png";

/* ─────────────────────────────────────────────────────────────────────────
   My Leland → Profile (Edit mode 2)

   Starts from the base of "Edit mode" (ProfileEditMode) in the left column, with
   a narrow (280px) right rail. The rail uses the home feed's SidebarSectionCard
   so its cards match the "Popular experts" design language. Contents:

   - Public profile — the editable URL + a "View public profile" button.
   - If NOT an expert: a "Start selling on Leland" upsell to turn on expert tools.
   - If an expert: the Intro video (relocated from the editor), then a weekly
     availability preview with a shortcut to the Calendar tab.

   Reached from the profile admin tool's "Mode" switcher (see profileVersions.ts).
   ───────────────────────────────────────────────────────────────────────── */

// A small pencil action for a card header (matches the Public profile / Intro
// video edit affordance).
function EditPencil({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Edit"
      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
    >
      <img src={editIcon} alt="" className="h-[15px] w-[15px]" />
    </button>
  );
}

function ProfileUrlCard() {
  const [slug, setSlug] = useState("alex-rivera");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(slug);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard?.writeText(`leland.com/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <SidebarSectionCard title="Public profile" bleed={false}>
      {editing ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center rounded-lg border border-gray-300 px-2.5 py-2 text-[13px]">
            <span className="shrink-0 text-gray-light">leland.com/</span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-gray-dark outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => { setDraft(slug); setEditing(false); }}>Cancel</Button>
            <Button size="sm" variant="dark" onClick={() => { setSlug(draft); setEditing(false); }}>Save</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-hover px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate text-[13px] text-gray-dark">leland.com/{slug}</span>
          <button
            type="button"
            onClick={copyLink}
            aria-label={copied ? "Copied" : "Copy link"}
            title={copied ? "Copied" : "Copy link"}
            className="shrink-0 text-gray-light transition-colors hover:text-gray-dark"
          >
            {copied ? (
              <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6L9 17l-5-5" vectorEffect="non-scaling-stroke" /></svg>
            ) : (
              <MaskIcon src={copyIcon} className="h-[16px] w-[16px]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => { setDraft(slug); setEditing(true); }}
            aria-label="Edit URL"
            title="Edit URL"
            className="shrink-0 text-gray-light transition-colors hover:text-gray-dark"
          >
            <MaskIcon src={editIcon} className="h-[16px] w-[16px]" />
          </button>
        </div>
      )}

      <LinkButton
        size="lg"
        variant="white"
        rounded="rounded-full"
        href="/profile/samantha-parker"
        className="mt-4 w-full border border-gray-stroke font-semibold"
      >
        <MaskIcon src={eyeIcon} className="h-[16px] w-[16px]" />
        View public profile
      </LinkButton>
    </SidebarSectionCard>
  );
}

// Non-expert upsell — a lightweight advertisement to turn on the seller tools.
function SellingPromoCard({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <SidebarSectionCard title="Start selling on Leland" bleed={false}>
      <p className="text-[13px] leading-snug text-gray-light">
        Turn on expert tools to offer coaching, set your availability, and get paid — right from your profile.
      </p>
      <Button size="md" variant="dark" rounded="rounded-full" onClick={onGetStarted} className="mt-4 w-full font-semibold">
        Get started
      </Button>
    </SidebarSectionCard>
  );
}

// Expert: intro video, relocated from the editor and reformatted to match the
// Public profile card (full-width thumbnail rather than a horizontal banner).
function IntroVideoCard() {
  return (
    <SidebarSectionCard title="Intro video" bleed={false} action={<EditPencil />}>
      <div className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-black">
        <img src={videoThumbnail} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 transition-colors group-hover:bg-black/10" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#222222"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-[1px] text-[11px] font-medium leading-none text-white">1:24</span>
      </div>
    </SidebarSectionCard>
  );
}

// Expert: a preview of the coach's set weekly availability — the next open
// slot, a compact M–S day preview (green = available), and a shortcut to the
// Calendar tab to edit it. `label` is the single-letter day; two days share T
// (Tue/Thu) and S (Sat/Sun), matching a standard week strip.
const WEEK_DAYS: { key: string; label: string; available: boolean }[] = [
  { key: "mon", label: "M", available: true },
  { key: "tue", label: "T", available: true },
  { key: "wed", label: "W", available: true },
  { key: "thu", label: "T", available: true },
  { key: "fri", label: "F", available: true },
  { key: "sat", label: "S", available: false },
  { key: "sun", label: "S", available: false },
];

function AvailabilityCard() {
  return (
    <SidebarSectionCard title="Available tomorrow" bleed={false}>
      {/* Next availability — headline is the section title; time sits below it */}
      <p className="-mt-2 text-[13px] leading-tight text-gray-light">Starting at 5:30 PM MT</p>

      {/* Weekly day preview — available days filled */}
      <div className="mt-4 flex items-center justify-between">
        {WEEK_DAYS.map((d) => (
          <span
            key={d.key}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold ${
              d.available ? "bg-gray-light text-white" : "bg-gray-hover text-gray-extra-light"
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>

      <LinkButton
        size="md"
        variant="white"
        rounded="rounded-full"
        href="/my-leland/calendar"
        className="mt-4 w-full border border-gray-stroke font-semibold"
      >
        <MaskIcon src={editIcon} className="h-[15px] w-[15px]" />
        Edit availability
      </LinkButton>
    </SidebarSectionCard>
  );
}

export default function MyLelandProfileEdit2() {
  const { expert, setExpert } = useExpertMode();

  useEffect(() => {
    document.title = "Leland Prototype | Profile (Edit 2)";
  }, []);

  // The rail cards. Rendered twice — in the desktop right rail, and (on mobile,
  // where the rail is hidden) directly below the hero, wrapping 2 per row.
  const railCards = (
    <>
      <ProfileUrlCard />
      {expert ? (
        <>
          <IntroVideoCard />
          <AvailabilityCard />
        </>
      ) : (
        <SellingPromoCard onGetStarted={() => setExpert(true)} />
      )}
    </>
  );

  return (
    <>
      <div className="flex items-start gap-6">
        {/* Left column — the base Edit-mode editor. The public-profile banner and
            (for experts) the Intro video card are relocated to the rail. On
            mobile the rail cards drop in below the hero via `afterHero`. */}
        <div className="min-w-0 flex-1">
          <ProfileEditMode
            publicProfileBanner={false}
            introVideoCard={false}
            afterHero={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                {railCards}
              </div>
            }
          />
        </div>

        {/* Right rail (280px) — desktop only */}
        <aside className="hidden w-[280px] shrink-0 flex-col gap-4 lg:flex">
          {railCards}
        </aside>
      </div>

      <ProfileAdminMenu currentVersion="edit-2" />
    </>
  );
}
