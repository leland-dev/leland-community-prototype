import { createContext, useContext, useState, type ReactNode } from "react";

// "Boxed mode" is an Inline-profile sub-option (default on): a beige page with
// the hero + main content confined to two boxes (like the Dashboard / Edit
// mode). It's lifted to context so the toggle — which lives in the Inline
// profile's admin menu — can drive CoachLayout's matching beige page treatment.
interface ProfileBoxedModeContextValue {
  boxedMode: boolean;
  setBoxedMode: (v: boolean) => void;
}

const ProfileBoxedModeContext = createContext<ProfileBoxedModeContextValue>({
  boxedMode: true,
  setBoxedMode: () => {},
});

export function ProfileBoxedModeProvider({ children }: { children: ReactNode }) {
  const [boxedMode, setBoxedMode] = useState(true);
  return (
    <ProfileBoxedModeContext.Provider value={{ boxedMode, setBoxedMode }}>
      {children}
    </ProfileBoxedModeContext.Provider>
  );
}

export function useProfileBoxedMode() {
  return useContext(ProfileBoxedModeContext);
}
