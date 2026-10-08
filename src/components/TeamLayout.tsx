import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "./Button";
import { TeamLogo } from "./TeamLogo";
import { CreateTeam } from "../pages/Team";
import { getTeamNavItems } from "../lib/teamNav";
import { useTeam, type TeamPlan } from "../contexts/TeamContext";

// The standalone team dashboard — a separate surface from the My Leland shell.
// Team and Enterprise share it. Desktop: sidebar + page. Mobile: the top nav's team-logo
// dropdown switches pages (see MobileTopNav).
const linkCls = ({ isActive }: { isActive: boolean }) =>
  `flex w-full items-center rounded-lg px-3 py-[10px] text-[15px] transition-colors ${
    isActive ? "bg-[#222222]/5 font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"
  }`;

const cardCls =
  "rounded-[12px] border border-[#222222]/[0.12] bg-white shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]";

export default function TeamLayout() {
  const { team, updateTeam, reset } = useTeam();
  const { pathname } = useLocation();

  if (!team) return pathname === "/team" ? <div className="px-4 py-10 sm:px-6"><CreateTeam /></div> : <Navigate to="/team" replace />;

  const items = getTeamNavItems(team);

  return (
    <div className="flex min-h-[calc(100vh-61px)] bg-[#F3F1E6]/50">
      <aside className="hidden w-[264px] shrink-0 self-start sticky top-[61px] h-[calc(100vh-61px)] flex-col gap-4 overflow-y-auto px-4 pb-4 pt-5 md:flex">
        {/* Team profile card */}
        <div className={`${cardCls} p-5`}>
          {/* Same stacked header as the mobile menu: logo, name, then plan · role */}
          <TeamLogo name={team.name} logo={team.logo} size={48} circle />
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

        {/* Prototype controls — not part of the product UI */}
        <div className={`${cardCls} mt-auto flex flex-wrap items-center gap-2 p-3`}>
          <span className="w-full text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-light">Prototype</span>
          {(["team", "enterprise"] as TeamPlan[]).map((p) => (
            <Button key={p} size="tag" variant={team.plan === p ? "dark" : "secondary"} onClick={() => updateTeam({ plan: p })}>
              {p === "team" ? "Team" : "Enterprise"}
            </Button>
          ))}
          <Button size="tag" variant="secondary" onClick={reset}>
            Remove team
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[860px] px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
