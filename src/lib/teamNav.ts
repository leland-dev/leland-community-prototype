import type { Team } from "../contexts/TeamContext";
import usersGroupIcon from "../assets/icons/users-group.svg";
import chartIcon from "../assets/icons/chart.svg";
import lockIcon from "../assets/icons/lock-outline.svg";
import lightningIcon from "../assets/icons/lightning.svg";
import moneyIcon from "../assets/icons/money.svg";
import userIcon from "../assets/icons/user.svg";

export interface TeamNavItem {
  to: string;
  label: string;
  icon: string;
}

// Menu for the standalone team dashboard — drives the desktop sidebar and the
// mobile hub. Overview (stats) and Admins mirror the partner
// dashboard's split; Billing keeps the card on file and SSO/invoicing; the rest are placeholders for later. Members only see
// Overview.
export function getTeamNavItems(team: Team, { paidAds = true, recruiting = true, adminsPage = false }: { paidAds?: boolean; recruiting?: boolean; adminsPage?: boolean } = {}): TeamNavItem[] {
  const isAdmin = team.viewerRole === "Admin";
  return [
    { to: "/team/overview", label: "Overview", icon: chartIcon },
    ...(isAdmin
      ? [
          // Enterprise keeps its user table inside the overview (partner dashboard).
          ...(team.plan !== "enterprise" ? [{ to: "/team/members", label: "Team members", icon: usersGroupIcon }] : []),
          // Small teams manage admins from the Admins tab on Team members; enterprise keeps this page.
          ...(team.plan === "enterprise" || adminsPage ? [{ to: "/team/admins", label: "Admins", icon: lockIcon }] : []),
          { to: "/team/billing", label: "Billing", icon: moneyIcon },
          ...(paidAds ? [{ to: "/team/ads", label: "Paid ads", icon: lightningIcon }] : []),
          ...(recruiting ? [{ to: "/team/recruiting", label: "Recruiting", icon: userIcon }] : []),
        ]
      : []),
  ];
}
