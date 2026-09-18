import { createContext, useContext, useState, type ReactNode } from "react";

// Whether the My Leland → Profile tab is in "Edit mode" (the beige, card-based
// editor) vs. "Inline" (the faithful public-template view). Lifted to context so
// the toggle — which lives in the profile page's admin menu — can drive
// CoachLayout's beige page treatment to match the Dashboard tab.
//
// `boxedMode` is an Inline-only sub-option (default on): a beige page with the
// hero + main content confined to two boxes (like the Dashboard/Edit mode).
interface ProfileEditModeContextValue {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  boxedMode: boolean;
  setBoxedMode: (v: boolean) => void;
}

const ProfileEditModeContext = createContext<ProfileEditModeContextValue>({
  editMode: true,
  setEditMode: () => {},
  boxedMode: true,
  setBoxedMode: () => {},
});

export function ProfileEditModeProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(true);
  const [boxedMode, setBoxedMode] = useState(true);
  return (
    <ProfileEditModeContext.Provider value={{ editMode, setEditMode, boxedMode, setBoxedMode }}>
      {children}
    </ProfileEditModeContext.Provider>
  );
}

export function useProfileEditMode() {
  return useContext(ProfileEditModeContext);
}
