import { useLocation } from "react-router-dom";
import TopNavClassic from "./TopNavClassic";
import TopNavLinkedIn from "./TopNavLinkedIn";
import { useTopNavStyle } from "../contexts/TopNavStyleContext";

// The LinkedIn-style nav (formerly the isolated /alt-nav experience) is now the
// default across the customer app. The classic nav is opt-in via the "Switch to
// Classic nav" toggle (style === "classic"). The isolated /alt-nav demo route
// and the /my-leland store shell always use the LinkedIn nav regardless.
export default function TopNav() {
  const { pathname } = useLocation();
  const { style } = useTopNavStyle();
  const onLinkedInPath =
    style === "linkedin" || pathname.startsWith("/alt-nav") || pathname.startsWith("/my-leland");
  return onLinkedInPath ? <TopNavLinkedIn /> : <TopNavClassic />;
}
