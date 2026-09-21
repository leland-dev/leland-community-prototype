import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyLelandProfileView from "./MyLelandProfileView";
import ProfileAdminMenu, { AdminToggle, AdminSelect } from "./ProfileAdminMenu";
import profilePhoto from "../assets/profile photos/profile photo.png";
import coverImage from "../assets/img/cover-image-2.png";
import { useExpertMode } from "../contexts/ExpertModeContext";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import productManagementIcon from "../assets/icons/category-icons/product-management.svg";

/* ─────────────────────────────────────────────────────────────────────────
   My Leland → Profile (Inline 2)

   A blend of the public profile template and the own-profile editor: the page
   is shown exactly as it appears to visitors — the faithful two-column template
   layout, no beige "boxed" cards — but every section is editable inline (the
   same per-section affordances the Inline view uses via `ownProfile`).

   Differs from "Inline" in two ways: it forces the template's two-column layout
   on (`twoColumn`) and drops boxed mode, so it reads as the real profile page
   rather than a boxed dashboard card.

   Not the default profile version — reachable from the profile admin tool's
   "Mode" switcher (see `profileVersions.ts`). The sidebar "Profile" tab points
   at the Edit-mode page; because this route is nested under it
   (/my-leland/profile/inline-2), that tab stays highlighted here too.
   ───────────────────────────────────────────────────────────────────────── */

// Categories this expert coaches for — mirrors the public template.
const categories = [
  { slug: "mba", label: "MBA", icon: mbaIcon, headline: "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits" },
  { slug: "management-consulting", label: "Management Consulting", icon: consultingIcon, headline: "Ex-McKinsey Consultant | Wharton MBA | Case Prep Pro" },
  { slug: "product-management", label: "Product Management", icon: productManagementIcon, headline: "Senior PM at LinkedIn | Ex-Meta | Breaking Into Tech" },
];

export default function MyLelandProfileInline2() {
  // Expert vs. customer follows the global My Leland Expert toggle.
  const { expert } = useExpertMode();
  const navigate = useNavigate();

  // Coaching-section demo toggles — default on so the expert profile shows rich.
  const [customerFavorite, setCustomerFavorite] = useState(true);
  const [coachNote, setCoachNote] = useState(true);
  const [video, setVideo] = useState(true);
  const [supercoach, setSupercoach] = useState(true);
  const [coverMode, setCoverMode] = useState<"default" | "dark" | "beige" | "none">("default");

  useEffect(() => {
    document.title = "Leland Prototype | Profile (Inline 2)";
  }, []);

  return (
    <>
      <MyLelandProfileView
        unified
        embedded
        twoColumn
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
        categories={categories}
        onSelectCategory={(slug) => navigate(`/my-leland/manage/${slug}`)}
      />

      {/* Admin tool — the shared version switcher plus this page's preview
          controls. No "Boxed mode" here: Inline 2 is deliberately the faithful,
          non-boxed two-column template. */}
      <ProfileAdminMenu currentVersion="inline-2">
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
