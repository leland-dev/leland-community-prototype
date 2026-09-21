// The My Leland → Profile page comes in more than one version (Edit mode,
// Inline, …). These used to be a runtime toggle on a single page; they are now
// separate routes. "Edit mode" is the default the sidebar "Profile" tab points
// at; every other version is reachable from the profile admin tool, which links
// out to them.
//
// Add a version here (label + route) and the admin menu picks it up
// automatically — no need to wire the switcher by hand.
export interface ProfileVersion {
  key: string;
  label: string;
  path: string;
}

export const PROFILE_VERSIONS: ProfileVersion[] = [
  // Edit mode 2 is the default — it lives at the bare /my-leland/profile that
  // the sidebar "Profile" tab points at.
  { key: "edit-2", label: "Edit mode 2", path: "/my-leland/profile" },
  { key: "edit", label: "Edit mode", path: "/my-leland/profile/edit" },
  { key: "inline", label: "Inline", path: "/my-leland/profile/inline" },
  { key: "inline-2", label: "Inline 2", path: "/my-leland/profile/inline-2" },
];
