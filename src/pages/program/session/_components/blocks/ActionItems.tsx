import type { SessionState } from "../../_types";

type Item = { label: string; done?: boolean; hint?: string };

function itemsForState(state: SessionState): Item[] {
  switch (state) {
    case "pre-session":
      return [
        { label: "Install Claude Desktop", done: true },
        { label: "Read pre-work: 'Why narrative compounds in AI products'", done: false, hint: "8 min read" },
        { label: "Set a calendar reminder", done: false },
      ];
    case "live":
      return [
        { label: "Open Claude.ai in a separate window", hint: "Build along with the coach" },
        { label: "Drop blockers into Q&A as they come up" },
      ];
    case "just-ended":
      return [
        { label: "Submit your build for review", hint: "Due Sunday 11:59 PT" },
        { label: "Watch replay (chapters available)" },
        { label: "Skim peer submissions" },
      ];
    case "idle":
    default:
      return [
        { label: "Finish session 3 reflection", done: false },
        { label: "Pre-work for session 4 unlocks Monday", done: false },
      ];
  }
}

export default function ActionItems({ state }: { state: SessionState }) {
  const items = itemsForState(state);
  return (
    <section className="rounded-2xl border border-gray-stroke bg-white p-5">
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-light">
        Action items
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                it.done
                  ? "border-gray-dark bg-[#FFD96F] text-[#222222]"
                  : "border-gray-stroke bg-white"
              }`}
            >
              {it.done && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5l2 2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className={`text-[12px] ${it.done ? "text-gray-light line-through" : "text-gray-dark"}`}>
                {it.label}
              </div>
              {it.hint && <div className="text-[10px] text-gray-light">{it.hint}</div>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
