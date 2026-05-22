import type { Session } from "../../_types";
import { programSessions } from "../../_mock";
import StatusHero from "../blocks/StatusHero";
import MaterialsRail from "../blocks/MaterialsRail";
import ProgramRail from "../blocks/ProgramRail";
import ActionItems from "../blocks/ActionItems";
import CoachCard from "../blocks/CoachCard";
import OneOnOneUpsell from "../blocks/OneOnOneUpsell";

export default function PreSessionView({ session }: { session: Session }) {
  return (
    <div className="flex flex-col gap-6">
      <StatusHero state="pre-session" session={session} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <MaterialsRail chapters={session.chapters} currentChapterId={session.currentChapterId} />
          <ProgramRail sessions={programSessions} />
        </div>
        <aside className="flex flex-col gap-4">
          <ActionItems state="pre-session" />
          <CoachCard coach={session.coach} />
          <OneOnOneUpsell programUrn={session.programUrn} />
        </aside>
      </div>
    </div>
  );
}
