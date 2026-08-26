import { useEffect } from "react";

// Proof-of-concept placeholder for the alt-nav "Expert tools" destinations.
// The point of these routes is the sidebar nav — each expert tool links to its
// own page inside the alt-nav shell (DesktopSidebar, no top navbar) — so the
// bodies are intentionally lightweight rather than reproductions of the real
// /coach pages.
export default function AltNavExpertPage({ title, eyebrow = "Expert tools" }: { title: string; eyebrow?: string }) {
  useEffect(() => {
    document.title = `Leland Prototype | ${title}`;
  }, [title]);

  return (
    <div>
      <p className="text-[13px] font-medium uppercase tracking-wide text-gray-light">{eyebrow}</p>
      <h1 className="mt-1 text-[28px] font-semibold leading-tight text-gray-dark">{title}</h1>
      <p className="mt-1.5 text-[15px] text-gray-light">
        Placeholder for the {title} page — recreated inside the alt-nav experience.
      </p>

      {/* Skeleton content so the page reads as a real surface */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
            <div className="h-3 w-1/3 rounded-full bg-[#EDEDED]" />
            <div className="mt-3 h-2.5 w-full rounded-full bg-[#F2F2F2]" />
            <div className="mt-2 h-2.5 w-4/5 rounded-full bg-[#F2F2F2]" />
            <div className="mt-2 h-2.5 w-2/3 rounded-full bg-[#F2F2F2]" />
          </div>
        ))}
      </div>
    </div>
  );
}
