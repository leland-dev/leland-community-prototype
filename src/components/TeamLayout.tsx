import { useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "./Button";
import { EditableTeamLogo } from "./TeamLogo";
import breezeLogo from "../assets/org-logos/breeze-airways.png";
import { CreateTeam } from "../pages/Team";
import { getTeamNavItems } from "../lib/teamNav";
import { useTeam, type TeamPlan } from "../contexts/TeamContext";
import { TeamPeopleProvider } from "../pages/b2b/TeamProgramOverview";
import { useTeamPrototype, type MembersLayout } from "../contexts/TeamPrototypeContext";

// The standalone team dashboard — a separate surface from the My Leland shell.
// Team and Enterprise share it. Desktop: sidebar + page. Mobile: the top nav's team-logo
// dropdown switches pages (see MobileTopNav).
const linkCls = ({ isActive }: { isActive: boolean }) =>
  `flex w-full items-center rounded-lg px-3 py-[10px] text-[15px] transition-colors ${
    isActive ? "bg-[#222222]/5 font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"
  }`;

const cardCls =
  "rounded-[12px] border border-[#222222]/[0.12] bg-white shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]";

// Prototype-only controls: a 3-dot button at the bottom of the sidebar opens a panel of
// toggles. Not part of the product UI.
function PrototypeMenu() {
  const { team, updateTeam, reset } = useTeam();
  const { membersLayout, setMembersLayout, showAccessColumn, setShowAccessColumn, showPaidAds, setShowPaidAds, showRecruiting, setShowRecruiting, emptyTeam, setEmptyTeam, showSkills, setShowSkills, showAdminsPage, setShowAdminsPage } = useTeamPrototype();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!team) return null;
  const sectionCls = "px-2 pb-2 pt-1 text-[12px] font-medium uppercase tracking-wider text-[#9b9b9b]";
  const layouts: { value: MembersLayout; label: string }[] = [
    { value: "tabs", label: "Tabs" },
    { value: "filter", label: "Filter" },
    { value: "combined", label: "One table" },
  ];

  return (
    <div ref={ref} className="relative mt-auto">
      {open && (
        <div className="absolute bottom-full left-0 right-0 z-40 mb-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <div className={sectionCls}>Plan</div>
          <div className="mx-2 mb-2 flex rounded-lg bg-[#f5f5f5] p-[3px]">
            {(["team", "enterprise"] as TeamPlan[]).map((p) => (
              <button
                key={p}
                onClick={() => updateTeam({ plan: p })}
                className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${team.plan === p ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"}`}
              >
                {p === "team" ? "Team" : "Enterprise"}
              </button>
            ))}
          </div>

          {team.plan !== "enterprise" && (
            <>
              <div className={sectionCls}>Team members table</div>
              <div className="mx-2 mb-1 flex rounded-lg bg-[#f5f5f5] p-[3px]">
                {layouts.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setMembersLayout(l.value)}
                    className={`flex-1 cursor-pointer whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${membersLayout === l.value ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[14px] font-medium text-gray-dark">Access column</span>
                <div className="relative">
                  <input type="checkbox" checked={showAccessColumn} onChange={() => setShowAccessColumn(!showAccessColumn)} className="peer sr-only" />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            </>
          )}

          <div className={sectionCls}>Menu items</div>
          <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
            <span className="text-[14px] font-medium text-gray-dark">Admins page</span>
            <div className="relative">
              <input type="checkbox" checked={showAdminsPage} onChange={() => setShowAdminsPage(!showAdminsPage)} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
              <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
            <span className="text-[14px] font-medium text-gray-dark">Paid ads</span>
            <div className="relative">
              <input type="checkbox" checked={showPaidAds} onChange={() => setShowPaidAds(!showPaidAds)} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
              <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
            <span className="text-[14px] font-medium text-gray-dark">Recruiting</span>
            <div className="relative">
              <input type="checkbox" checked={showRecruiting} onChange={() => setShowRecruiting(!showRecruiting)} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
              <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>

          <div className={sectionCls}>Data</div>
          <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
            <span className="text-[14px] font-medium text-gray-dark">Skills metrics</span>
            <div className="relative">
              <input type="checkbox" checked={showSkills} onChange={() => setShowSkills(!showSkills)} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
              <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
            <span className="text-[14px] font-medium text-gray-dark">Company logo</span>
            <div className="relative">
              <input type="checkbox" checked={!!team.logo} onChange={() => updateTeam({ logo: team.logo ? "" : breezeLogo })} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
              <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
            <span className="text-[14px] font-medium text-gray-dark">Card on file</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={!!team.card}
                onChange={() =>
                  team.card
                    ? updateTeam({ card: undefined, billing: undefined })
                    : updateTeam({
                        card: { brand: "Visa", last4: "4242", exp: "12/28", name: "Alex Rivera" },
                        billing: { company: team.name, line1: "1 Airport Way", city: "Salt Lake City", state: "UT", zip: "84116", country: "United States" },
                      })
                }
                className="peer sr-only"
              />
              <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
              <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
            <span className="text-[14px] font-medium text-gray-dark">Empty team</span>
            <div className="relative">
              <input type="checkbox" checked={emptyTeam} onChange={() => setEmptyTeam(!emptyTeam)} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
              <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>

          <div className="mt-1 border-t border-gray-200 px-2 pt-2">
            <Button size="tag" variant="secondary" onClick={reset}>Remove team</Button>
          </div>
        </div>
      )}
      <div className={`${cardCls} flex items-center justify-between p-3`}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-light">Prototype</span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Prototype options"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="3" cy="8" r="1.5" fill="#707070" />
            <circle cx="8" cy="8" r="1.5" fill="#707070" />
            <circle cx="13" cy="8" r="1.5" fill="#707070" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function TeamLayout() {
  const { team } = useTeam();
  const { showPaidAds, showRecruiting, showAdminsPage } = useTeamPrototype();
  const { pathname } = useLocation();

  if (!team) return pathname === "/team" ? <div className="px-4 py-10 sm:px-6"><CreateTeam /></div> : <Navigate to="/team" replace />;

  const items = getTeamNavItems(team, { paidAds: showPaidAds, recruiting: showRecruiting, adminsPage: showAdminsPage });

  return (
    <div className="flex min-h-[calc(100vh-61px)] bg-[#F3F1E6]/50">
      <aside className="hidden w-[264px] shrink-0 self-start sticky top-[61px] h-[calc(100vh-61px)] flex-col gap-4 overflow-y-auto px-4 pb-4 pt-5 md:flex">
        {/* Team profile card */}
        <div className={`${cardCls} p-5`}>
          {/* Same stacked header as the mobile menu: logo, name, then plan · role */}
          <EditableTeamLogo size={48} />
          <p className="mt-3 truncate text-[18px] font-semibold text-gray-dark">{team.name}</p>
          <p className="mt-2.5 text-[14px] leading-none text-gray-light">
              {team.plan === "enterprise" ? "Enterprise" : "Team"} {team.viewerRole.toLowerCase()}
            </p>
        </div>

        {/* Menu items card */}
        <div className={`${cardCls} p-2`}>
          <nav className="flex flex-col gap-1">
            {items.map((i) => (
              <NavLink key={i.to} to={i.to} className={linkCls}>
                {i.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <PrototypeMenu />
      </aside>

      <div className="min-w-0 flex-1">
        {/* Same 1080px content width as My Leland, so page layout stays standard */}
        <div className="mx-auto max-w-[1080px] px-4 py-8 sm:px-6 sm:py-10">
          <TeamPeopleProvider>
            <Outlet />
          </TeamPeopleProvider>
        </div>
      </div>
    </div>
  );
}
