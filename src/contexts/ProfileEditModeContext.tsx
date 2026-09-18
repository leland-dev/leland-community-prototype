import { createContext, useContext, useState, type ReactNode } from "react";

// Whether the My Leland → Profile tab is in "Edit mode" (the beige, card-based
// editor) vs. "Inline" (the faithful public-template view). Lifted to context so
// the toggle — which lives in the profile page's admin menu — can drive
// CoachLayout's beige page treatment to match the Dashboard tab.
interface ProfileEditModeContextValue {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}

const ProfileEditModeContext = createContext<ProfileEditModeContextValue>({
  editMode: true,
  setEditMode: () => {},
});

export function ProfileEditModeProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(true);
  return (
    <ProfileEditModeContext.Provider value={{ editMode, setEditMode }}>
      {children}
    </ProfileEditModeContext.Provider>
  );
}

export function useProfileEditMode() {
  return useContext(ProfileEditModeContext);
}
