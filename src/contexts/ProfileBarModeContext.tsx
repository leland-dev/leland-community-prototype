import { createContext, useContext, useState, type ReactNode } from "react";

// Demo toggle (Admin Tools) for the post identity bar ("profile bar"):
//   1 = Minimal   — name + company favicon, no title line
//   2 = Title     — name + the person's title/description below
//   3 = Dated     — Title version, with an older-post date on the timestamp
export type ProfileBarMode = 1 | 2 | 3;

const ProfileBarModeContext = createContext<{
  mode: ProfileBarMode;
  setMode: (m: ProfileBarMode) => void;
}>({ mode: 1, setMode: () => {} });

export function ProfileBarModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ProfileBarMode>(1);
  return (
    <ProfileBarModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ProfileBarModeContext.Provider>
  );
}

export const useProfileBarMode = () => useContext(ProfileBarModeContext);
