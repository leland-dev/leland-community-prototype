import { useEffect } from "react";
import ProfileEditMode from "./ProfileEditMode";
import ProfileAdminMenu from "./ProfileAdminMenu";

/* ─────────────────────────────────────────────────────────────────────────
   My Leland → Profile (Edit mode)

   The default profile version — what the sidebar "Profile" tab points at. A
   beige, card-based editor (ProfileEditMode).

   The other versions (currently just the faithful public-template "Inline"
   view) each live at their own route. You move between them from the floating
   admin tool, whose "Mode" switcher links out to every version — see
   `profileVersions.ts` and `ProfileAdminMenu.tsx`.
   ───────────────────────────────────────────────────────────────────────── */
export default function MyLelandProfile() {
  useEffect(() => {
    document.title = "Leland Prototype | Profile";
  }, []);

  return (
    <>
      <ProfileEditMode />
      <ProfileAdminMenu currentVersion="edit" />
    </>
  );
}
