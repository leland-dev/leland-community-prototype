import { useEffect } from "react";

export default function B2BDashboard() {
  useEffect(() => {
    document.title = "B2B Dashboard – Leland";
  }, []);

  return (
    <iframe
      src={import.meta.env.BASE_URL + "b2b-dashboard.html"}
      title="B2B Dashboard"
      style={{ width: "100vw", height: "100vh", border: "none" }}
    />
  );
}
