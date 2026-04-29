import { useLocation } from "react-router-dom";

export function useIsCoachMode() {
  return useLocation().pathname.startsWith("/coach");
}
