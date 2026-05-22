import type { Session } from "../../_types";
import { programSessions } from "../../_mock";
import StatusHero from "../blocks/StatusHero";
import MaterialsRail from "../blocks/MaterialsRail";
import ProgramRail from "../blocks/ProgramRail";
import ActionItems from "../blocks/ActionItems";
import CoachCard from "../blocks/CoachCard";

export default function JustEndedView({ session }: { session: Session }) {
  return (
    <div className="flex flex-col gap-6">
      <StatusHero state="just-ended" session={session} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Replay placeholder */}
          <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "16 / 9" }}>
            <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
              Replay player · chapters synced from session guide
            </div>
            <div className="absolute top-4 left-4 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white">
              Replay
            </div>
          </div>
          <MaterialsRail chapters={session.chapters} currentChapterId={session.currentChapterId} />
          <ProgramRail sessions={programSessions} />
        </div>
        <aside className="flex flex-col gap-4">
          <ActionItems state="just-ended" />
          <CoachCard coach={session.coach} />
        </aside>
      </div>
    </div>
  );
}
