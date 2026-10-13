import { createContext, useContext, useState, type ReactNode } from "react";

// Prototype-only display options for the team dashboard, switched from the 3-dot menu in
// the sidebar (see TeamLayout). Not part of the product UI.

/** How the Team members table splits up the offerings a person has access to. */
export type MembersLayout =
  | "tabs" // tabs with counts: All / AI Builder Program / 1:1 coaching / Leland+
  | "filter" // one table, with an "Offering" dropdown filter
  | "combined"; // one table with program and coaching columns side by side

interface TeamPrototypeValue {
  membersLayout: MembersLayout;
  setMembersLayout: (v: MembersLayout) => void;
  /** Show a column of tags listing everything each person has access to. */
  showAccessColumn: boolean;
  setShowAccessColumn: (v: boolean) => void;
  /** Show the "Paid ads" and "Recruiting" menu items (placeholder pages for later). */
  showPaidAds: boolean;
  setShowPaidAds: (v: boolean) => void;
  showRecruiting: boolean;
  setShowRecruiting: (v: boolean) => void;
  /** Start from a team with no members, to see the empty states. */
  emptyTeam: boolean;
  setEmptyTeam: (v: boolean) => void;
}

const Ctx = createContext<TeamPrototypeValue>({
  membersLayout: "tabs",
  setMembersLayout: () => {},
  showAccessColumn: true,
  setShowAccessColumn: () => {},
  showPaidAds: true,
  setShowPaidAds: () => {},
  showRecruiting: true,
  setShowRecruiting: () => {},
  emptyTeam: false,
  setEmptyTeam: () => {},
});

export function TeamPrototypeProvider({ children }: { children: ReactNode }) {
  const [membersLayout, setMembersLayout] = useState<MembersLayout>("tabs");
  const [showAccessColumn, setShowAccessColumn] = useState(true);
  const [showPaidAds, setShowPaidAds] = useState(true);
  const [showRecruiting, setShowRecruiting] = useState(true);
  const [emptyTeam, setEmptyTeam] = useState(false);
  return (
    <Ctx.Provider value={{ membersLayout, setMembersLayout, showAccessColumn, setShowAccessColumn, showPaidAds, setShowPaidAds, showRecruiting, setShowRecruiting, emptyTeam, setEmptyTeam }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTeamPrototype = () => useContext(Ctx);
