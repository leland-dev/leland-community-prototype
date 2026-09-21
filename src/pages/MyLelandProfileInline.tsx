import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyLelandProfileView from "./MyLelandProfileView";
import ProfileAdminMenu, { AdminToggle, AdminSelect } from "./ProfileAdminMenu";
import { useProfileBoxedMode } from "../contexts/ProfileBoxedModeContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
import coverImage from "../assets/img/cover-image-2.png";
import { useExpertMode } from "../contexts/ExpertModeContext";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import productManagementIcon from "../assets/icons/category-icons/product-management.svg";

/* ─────────────────────────────────────────────────────────────────────────
   My Leland → Profile (Inline)

   The signed-in user's OWN profile rendered with the exact public profile
   template (ProfileV2, unified) so it reads as a faithful, editable mirror of
   what visitors actually see at /profile/:slug. "Viewing my profile" is forced
   on (ownProfile), which surfaces the inline edit affordances throughout.

   Not the default profile version — reachable from the profile admin tool's
   "Mode" switcher (see `profileVersions.ts`). The sidebar "Profile" tab points
   at the Edit-mode page; because this route is nested under it
   (/my-leland/profile/inline), that tab stays highlighted here too.

   Expert vs. customer is driven by the global My Leland Expert toggle
   (useExpertMode) — the same switch that gates the rest of the My Leland shell
   — so coaching-only sections (offerings, reviews, availability, coach note,
   video, category listings) appear only for experts.
   ───────────────────────────────────────────────────────────────────────── */

// Categories this expert coaches for — mirrors the public template.
const categories = [
  { slug: "mba", label: "MBA", icon: mbaIcon, headline: "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits" },
  { slug: "management-consulting", label: "Management Consulting", icon: consultingIcon, headline: "Ex-McKinsey Consultant | Wharton MBA | Case Prep Pro" },
  { slug: "product-management", label: "Product Management", icon: productManagementIcon, headline: "Senior PM at LinkedIn | Ex-Meta | Breaking Into Tech" },
];

export default function MyLelandProfileInline() {
  // Expert vs. customer follows the global My Leland Expert toggle.
  const { expert } = useExpertMode();
  const navigate = useNavigate();
  // Boxed mode is an Inline-only sub-option. In context so CoachLayout can
  // paint the page beige to match.
  const { boxedMode, setBoxedMode } = useProfileBoxedMode();

  // Coaching-section demo toggles — default on so the expert profile shows rich.
  const [customerFavorite, setCustomerFavorite] = useState(true);
  const [coachNote, setCoachNote] = useState(true);
  const [video, setVideo] = useState(true);
  const [supercoach, setSupercoach] = useState(true);
  const [coverMode, setCoverMode] = useState<"default" | "dark" | "beige" | "none">("default");

  useEffect(() => {
    document.title = "Leland Prototype | Profile (Inline)";
  }, []);

  return (
    <>
      <MyLelandProfileView
        unified
        embedded
        coach={expert}
        coachId="samantha"
        name="Alex Rivera"
        photo={profilePhoto}
        cover={coverImage}
        customerFavorite={customerFavorite}
        coachNote={coachNote}
        coachVideo={video}
        supercoach={supercoach}
        offeringsTab
        coverMode={coverMode}
        ownProfile
        highLevel={expert}
        boxed={boxedMode}
        categories={categories}
        onSelectCategory={(slug) => navigate(`/my-leland/manage/${slug}`)}
      />

      {/* Admin tool — the shared version switcher plus this page's Inline-only
          preview controls (section/cover playground so the own-profile view can
          preview every state). Expert / My-profile are fixed here (Expert follows
          the My Leland toggle; My profile is on). */}
      <ProfileAdminMenu currentVersion="inline">
        <div className="my-1 border-t border-gray-100" />
        <AdminToggle label="Boxed mode" checked={boxedMode} onChange={() => setBoxedMode(!boxedMode)} />
        <div className="my-1 border-t border-gray-100" />
        {/* Coaching sections — only meaningful when Expert is on */}
        <AdminToggle label="Customer favorite" checked={customerFavorite} onChange={() => setCustomerFavorite((v) => !v)} disabled={!expert} />
        <AdminToggle label="Coach note" checked={coachNote} onChange={() => setCoachNote((v) => !v)} disabled={!expert} />
        <AdminToggle label="Video" checked={video} onChange={() => setVideo((v) => !v)} disabled={!expert} />
        <AdminToggle label="Top Expert" checked={supercoach} onChange={() => setSupercoach((v) => !v)} disabled={!expert} />
        <div className="my-1 border-t border-gray-100" />
        <AdminSelect
          label="Cover image"
          value={coverMode}
          onChange={(v) => setCoverMode(v as "default" | "dark" | "beige" | "none")}
          options={[
            { value: "default", label: "Default" },
            { value: "dark", label: "Dark" },
            { value: "beige", label: "Beige" },
            { value: "none", label: "None" },
          ]}
        />
      </ProfileAdminMenu>
    </>
  );
}
