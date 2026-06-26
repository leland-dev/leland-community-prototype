import { useEffect, useState } from "react";
import { Button, LinkButton } from "../../../../../components/Button";
import type { Session, SessionState } from "../../_types";

type Props = {
  state: SessionState;
  session: Session;
};

function diffParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { d, h, m, s };
}

function formatRelative(ms: number) {
  const past = ms < 0;
  const { d, h, m } = diffParts(Math.abs(ms));
  let label: string;
  if (d > 0) label = `${d}d ${h}h`;
  else if (h > 0) label = `${h}h ${m}m`;
  else label = `${m}m`;
  return past ? `${label} ago` : `in ${label}`;
}

function CountdownBlock({ targetIso }: { targetIso: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const ms = new Date(targetIso).getTime() - now;
  const { d, h, m, s } = diffParts(ms);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    <div className="flex items-baseline gap-2 text-gray-dark">
      {d > 0 && (
        <>
          <span className="text-[46px] font-medium leading-none tabular-nums">{d}</span>
          <span className="pr-1 text-[12px] uppercase tracking-[0.12em] text-gray-light">d</span>
        </>
      )}
      <span className="text-[46px] font-medium leading-none tabular-nums">{pad(h)}</span>
      <span className="pr-1 text-[12px] uppercase tracking-[0.12em] text-gray-light">h</span>
      <span className="text-[46px] font-medium leading-none tabular-nums">{pad(m)}</span>
      <span className="pr-1 text-[12px] uppercase tracking-[0.12em] text-gray-light">m</span>
      <span className="text-[46px] font-medium leading-none tabular-nums">{pad(s)}</span>
      <span className="text-[12px] uppercase tracking-[0.12em] text-gray-light">s</span>
    </div>
  );
}

export default function StatusHero({ state, session }: Props) {
  const headline =
    state === "pre-session" ? "Know what's coming." :
    state === "live" ? "Join now." :
    state === "just-ended" ? "Catch up." :
    "Where you are.";

  const startsAtMs = new Date(session.startsAt).getTime();
  const endsAtMs = new Date(session.endsAt).getTime();

  return (
    <div className="rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-light">
            AI Bootcamp Program · Session {session.number}
          </div>
          <h1 className="text-[38px] font-medium leading-[1.05] text-gray-dark">{headline}</h1>
          <div className="text-[16px] text-gray-light">
            {state === "pre-session" && (
              <>{session.title} · starts {formatRelative(startsAtMs - Date.now())}</>
            )}
            {state === "live" && (
              <><span className="font-medium text-[#E2574C]">Live now</span> · {session.title}</>
            )}
            {state === "just-ended" && (
              <>{session.title} · ended {formatRelative(endsAtMs - Date.now())}</>
            )}
            {state === "idle" && (
              <>Next: {session.title} · starts {formatRelative(startsAtMs - Date.now())}</>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {state === "pre-session" && (
            <Button size="lg" variant="primary">Add to calendar</Button>
          )}
          {state === "live" && (
            <LinkButton size="lg" variant="primary" href="#join">Join session</LinkButton>
          )}
          {state === "just-ended" && (
            <LinkButton size="lg" variant="primary" href={session.recordingUrl ?? "#"}>Watch replay</LinkButton>
          )}
          {state === "idle" && (
            <LinkButton size="lg" variant="secondary" href="#program">View program</LinkButton>
          )}
        </div>
      </div>

      {state === "pre-session" && (
        <div className="mt-8 border-t border-gray-stroke pt-6">
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-light">
            Session starts in
          </div>
          <div className="mt-3">
            <CountdownBlock targetIso={session.startsAt} />
          </div>
        </div>
      )}
    </div>
  );
}
