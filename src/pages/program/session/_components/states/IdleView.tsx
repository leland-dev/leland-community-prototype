import type { Session } from "../../_types";
import { programSessions } from "../../_mock";
import StatusHero from "../blocks/StatusHero";
import ProgramRail from "../blocks/ProgramRail";
import ActionItems from "../blocks/ActionItems";
import CoachCard from "../blocks/CoachCard";

export default function IdleView({ session }: { session: Session }) {
  return (
    <div className="flex flex-col gap-6">
      <StatusHero state="idle" session={session} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <ProgramRail sessions={programSessions} />
        <aside className="flex flex-col gap-4">
          <ActionItems state="idle" />
          <CoachCard coach={session.coach} />
        </aside>
      </div>
    </div>
  );
}
