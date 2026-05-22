import { LinkButton } from "../../../../../components/Button";
import type { Coach } from "../../_types";

export default function CoachCard({ coach }: { coach: Coach }) {
  return (
    <section className="rounded-2xl border border-gray-stroke bg-white p-5">
      <div className="text-[12px] font-medium uppercase tracking-[0.12em] text-gray-light">Your coach</div>
      <div className="mt-3 flex items-center gap-3">
        <img src={coach.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="text-[16px] font-medium text-gray-dark">{coach.name}</div>
          {coach.role && <div className="text-[13px] text-gray-light">{coach.role}</div>}
        </div>
      </div>
      <div className="mt-4">
        <LinkButton size="sm" variant="secondary" href="/messages">Message coach</LinkButton>
      </div>
    </section>
  );
}
