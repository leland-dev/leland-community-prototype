import type { ProgramSessionSummary } from "../../_types";

type Props = {
  sessions: ProgramSessionSummary[];
};

export default function ProgramRail({ sessions }: Props) {
  return (
    <section className="rounded-2xl border border-gray-stroke bg-white">
      <div className="border-b border-gray-stroke px-5 py-4">
        <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-light">Program</div>
        <h2 className="mt-1 text-[18px] font-medium text-gray-dark">AI Bootcamp · Spring 2026</h2>
      </div>
      <ul className="divide-y divide-gray-stroke">
        {sessions.map((s) => {
          const isCurrent = s.status === "current";
          const isDone = s.status === "done";
          return (
            <li
              key={s.urn}
              className={`flex items-center gap-3 px-5 py-3 ${isCurrent ? "bg-[#F3FBF6]" : ""}`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                  isCurrent
                    ? "bg-[#038561] text-white"
                    : isDone
                    ? "bg-gray-hover text-gray-light"
                    : "border border-gray-stroke text-gray-light"
                }`}
              >
                {isDone ? "✓" : s.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-[13px] ${isCurrent ? "font-medium text-gray-dark" : isDone ? "text-gray-light" : "text-gray-dark"}`}>
                  {s.title}
                </div>
                {isCurrent && (
                  <div className="mt-1 h-[4px] w-full rounded-full bg-gray-stroke">
                    <div
                      className="h-full rounded-full bg-[#038561]"
                      style={{ width: `${s.progressPct ?? 0}%` }}
                    />
                  </div>
                )}
              </div>
              {isCurrent && (
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#038561]">
                  Now
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
