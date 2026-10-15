import breezeLogo from "../assets/org-logos/breeze-airways.png";
import { createContext, useContext, useState, type ReactNode } from "react";

export type TeamPlan = "team" | "enterprise";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member";
  access: string[];
}

export interface Purchase {
  id: string;
  date: string; // display date
  description: string; // what was purchased
  detail?: string; // e.g. seats, dates
  amount: number; // USD
}

export interface PaymentCard {
  brand: string;
  last4: string;
  exp?: string; // MM/YY
  name?: string; // name on card
}

export interface BillingAddress {
  company: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Team {
  name: string;
  logo?: string; // image URL / data URL
  plan: TeamPlan;
  /** The signed-in user's role on this team (prototype-switchable). */
  viewerRole: TeamMember["role"];
  card?: PaymentCard;
  /** Company billing address, collected with the card (also used for tax). */
  billing?: BillingAddress;
  members: TeamMember[];
  purchases?: Purchase[];
}

interface TeamContextValue {
  team: Team | null;
  createTeam: (name: string, logo?: string) => void;
  updateTeam: (patch: Partial<Team>) => void;
  addMember: (m: Omit<TeamMember, "id">) => void;
  updateMember: (id: string, patch: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;
  reset: () => void;
  /** Prototype switch: view the app as a user with no team, or as a member of a sample team. */
  setMembership: (m: "none" | "member") => void;
  /** Prototype switch: view the team as an admin or a regular member. */
  setViewerRole: (r: TeamMember["role"]) => void;
}

const STORAGE_KEY = "leland-team";

const TeamContext = createContext<TeamContextValue>({
  team: null,
  createTeam: () => {},
  updateTeam: () => {},
  addMember: () => {},
  updateMember: () => {},
  removeMember: () => {},
  reset: () => {},
  setMembership: () => {},
  setViewerRole: () => {},
});

const SAMPLE_TEAM: Team = {
  name: "Breeze Airways",
  logo: breezeLogo,
  plan: "team",
  viewerRole: "Admin",
  card: { brand: "Visa", last4: "4242", exp: "12/28", name: "Alex Rivera" },
  billing: { company: "Breeze Airways", line1: "1 Airport Way", city: "Salt Lake City", state: "UT", zip: "84116", country: "United States" },
  purchases: [
    { id: "p-4", date: "Sep 30, 2026", description: "1:1 coaching sessions", detail: "6 sessions \u00b7 Jordan Lee, Sam Patel", amount: 1500 },
    { id: "p-3", date: "Sep 12, 2026", description: "Leland+ annual access", detail: "3 seats", amount: 897 },
    { id: "p-2", date: "Aug 18, 2026", description: "AI Builder Program", detail: "2 seats \u00b7 Cohort starts Sep 8", amount: 1798 },
    { id: "p-1", date: "Aug 4, 2026", description: "AI Builder Program", detail: "1 seat \u00b7 Cohort starts Sep 8", amount: 899 },
  ],
  members: [
    { id: "me", name: "Alex Rivera", email: "alex.rivera@flybreeze.com", role: "Admin", access: ["All programs"] },
    { id: "m-1", name: "Jordan Lee", email: "jordan.lee@flybreeze.com", role: "Member", access: ["AI Builder Program"] },
    { id: "m-2", name: "Sam Patel", email: "sam.patel@flybreeze.com", role: "Member", access: ["Leland+", "1:1 coaching — hourly"] },
    // Admins on the Team members page: Dana is also in the program and coaching; the other two are admin-only.
    { id: "m-3", name: "Dana Whitfield", email: "dana.whitfield@flybreeze.com", role: "Admin", access: ["All programs"] },
    { id: "m-4", name: "Renee Castillo", email: "renee.castillo@flybreeze.com", role: "Admin", access: ["All programs"] },
    { id: "m-5", name: "Theo Nakamura", email: "theo.nakamura@flybreeze.com", role: "Admin", access: ["All programs"] },
  ],
};

const SAMPLE_ADMINS_KEY = "leland-team-sample-admins-v2";

function load(): Team | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Team) : null;
    if (!parsed) return null;
    // Bundled asset URLs change between builds, so a stored one can go stale:
    // re-attach the sample team's logo, and drop any other non-uploaded logo.
    // "" means the logo was removed on purpose. An uploaded (data:) logo is kept; the sample team otherwise gets its bundled one.
    const logo = parsed.logo === "" ? undefined : parsed.logo?.startsWith("data:") ? parsed.logo : parsed.name === SAMPLE_TEAM.name ? SAMPLE_TEAM.logo : undefined;
    let members = parsed.members;
    // A team saved before the sample admins existed gets them once (not again, so removing one sticks).
    if (parsed.name === SAMPLE_TEAM.name && !localStorage.getItem(SAMPLE_ADMINS_KEY)) {
      const have = new Set(members.map((m) => m.email.toLowerCase()));
      members = [...members, ...SAMPLE_TEAM.members.filter((m) => m.role === "Admin" && !have.has(m.email.toLowerCase()))];
      localStorage.setItem(SAMPLE_ADMINS_KEY, "1");
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, members }));
    }
    return { ...parsed, members, logo, viewerRole: parsed.viewerRole ?? "Admin" };
  } catch {
    return null;
  }
}

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeamState] = useState<Team | null>(load);

  const setTeam = (next: Team | null) => {
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage full / unavailable — keep in-memory state */
    }
    setTeamState(next);
  };

  const createTeam = (name: string, logo?: string) =>
    setTeam({
      name,
      logo,
      plan: "team",
      viewerRole: "Admin",
      members: [{ id: "me", name: "Alex Rivera", email: "alex.rivera@example.com", role: "Admin", access: ["All programs"] }],
    });

  const updateTeam = (patch: Partial<Team>) => team && setTeam({ ...team, ...patch });

  const addMember = (m: Omit<TeamMember, "id">) =>
    team && setTeam({ ...team, members: [...team.members, { ...m, id: `m-${Date.now()}` }] });

  const updateMember = (id: string, patch: Partial<TeamMember>) =>
    team && setTeam({ ...team, members: team.members.map((m) => (m.id === id ? { ...m, ...patch } : m)) });

  const removeMember = (id: string) =>
    team && setTeam({ ...team, members: team.members.filter((m) => m.id !== id) });

  const setViewerRole = (role: TeamMember["role"]) =>
    team && setTeam({ ...team, viewerRole: role, members: team.members.map((m) => (m.id === "me" ? { ...m, role } : m)) });

  return (
    <TeamContext.Provider value={{ team, createTeam, updateTeam, addMember, updateMember, removeMember, reset: () => setTeam(null), setMembership: (m) => setTeam(m === "member" ? SAMPLE_TEAM : null), setViewerRole }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
