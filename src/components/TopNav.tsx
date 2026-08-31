import { useLocation } from "react-router-dom";
import TopNavClassic from "./TopNavClassic";
import TopNavLinkedIn from "./TopNavLinkedIn";

// Dispatches to the LinkedIn-style nav inside the isolated /linkedin-nav
// experience, and the classic nav everywhere else. Path-driven so each nav
// direction stays isolated to its own routes.
export default function TopNav() {
  const { pathname } = useLocation();
  const onLinkedInPath = pathname === "/linkedin-nav" || pathname.startsWith("/linkedin-nav/");
  return onLinkedInPath ? <TopNavLinkedIn /> : <TopNavClassic />;
}
