import type { Chapter } from "../../_types";

type Props = {
  chapters: Chapter[];
  currentChapterId?: string;
  compact?: boolean;
};

function fmtOffset(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MaterialsRail({ chapters, currentChapterId, compact }: Props) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-stroke bg-white">
      <div className="border-b border-gray-stroke px-5 py-4">
        <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-light">Materials</div>
        {!compact && (
          <div className="mt-1 text-[16px] font-medium text-gray-dark">Session guide</div>
        )}
      </div>
      <ol className="flex-1 overflow-auto">
        {chapters.map((c, i) => {
          const isCurrent = c.id === currentChapterId;
          return (
            <li
              key={c.id}
              className={`relative flex items-start gap-3 border-b border-gray-stroke px-4 py-3 last:border-b-0 ${
                isCurrent ? "bg-[#F3FBF6]" : ""
              }`}
            >
              {isCurrent && (
                <span className="absolute left-0 top-0 h-full w-[3px] bg-[#FFD96F]" aria-hidden />
              )}
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                  isCurrent
                    ? "bg-[#FFD96F] text-[#222222]"
                    : "border border-gray-stroke text-gray-light"
                }`}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-[13px] leading-snug ${isCurrent ? "font-medium text-gray-dark" : "text-gray-dark"}`}>
                  {c.title}
                </div>
                <div className="mt-1 text-[10px] text-gray-light">
                  {isCurrent ? (
                    <span className="font-semibold uppercase tracking-[0.12em] text-gray-dark">Now</span>
                  ) : (
                    <>{fmtOffset(c.startOffsetSec)}</>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
