import type { Team } from "../contexts/TeamContext";
import usersGroupIcon from "../assets/icons/users-group.svg";
import lockIcon from "../assets/icons/lock-outline.svg";
import chartIcon from "../assets/icons/chart.svg";
import lightningIcon from "../assets/icons/lightning.svg";
import moneyIcon from "../assets/icons/money.svg";
import userIcon from "../assets/icons/user.svg";

export interface TeamNavItem {
  to: string;
  label: string;
  icon: string;
}

// Menu for the standalone team dashboard — drives the desktop sidebar and the
// mobile hub. Overview (stats + user table) and Admins mirror the partner
// dashboard's split; Billing keeps the card on file and SSO/invoicing; the rest are placeholders for later. Members only see
// Overview.
export function getTeamNavItems(team: Team): TeamNavItem[] {
  const isAdmin = team.viewerRole === "Admin";
  return [
    { to: "/team/overview", label: "Overview", icon: usersGroupIcon },
    ...(isAdmin
      ? [
          { to: "/team/admins", label: "Admins", icon: lockIcon },
          { to: "/team/billing", label: "Billing", icon: moneyIcon },
          { to: "/team/reports", label: "Reports", icon: chartIcon },
          { to: "/team/ads", label: "Paid ads", icon: lightningIcon },
          { to: "/team/recruiting", label: "Recruiting", icon: userIcon },
        ]
      : []),
  ];
}
