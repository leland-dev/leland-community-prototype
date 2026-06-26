import { Link, useParams } from "react-router-dom";
import PageShell from "../../../components/PageShell";
import SessionExperience from "./_components/SessionExperience";
import { resolveSession } from "./_mock";

const MOCK_URNS: { urn: string; label: string }[] = [
  { urn: "mock-pre", label: "Pre-session" },
  { urn: "mock-live", label: "Live" },
  { urn: "mock-ended", label: "Just ended" },
  { urn: "mock-idle", label: "Idle" },
];

function StateSwitcher({ activeUrn }: { activeUrn?: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] text-gray-light">
      <span className="font-medium uppercase tracking-[0.12em]">Preview state:</span>
      {MOCK_URNS.map((m) => {
        const active = activeUrn === m.urn;
        return (
          <Link
            key={m.urn}
            to={`/program/session/${m.urn}`}
            className={`rounded-md border px-2.5 py-1 transition-colors ${
              active
                ? "border-gray-dark bg-gray-dark text-white"
                : "border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover"
            }`}
          >
            {m.label}
          </Link>
        );
      })}
      <span className="ml-auto text-gray-stroke">{activeUrn}</span>
    </div>
  );
}

export default function LiveSession() {
  const { urn } = useParams<{ urn: string }>();
  const { session, state } = resolveSession(urn);

  // Live, pre-session, and just-ended all share the V4 studio layout, which
  // needs the wider 1440 wrapper so the right rail anchors correctly.
  // Idle keeps the narrower PageShell since it's an unrelated empty state.
  const usesStudio = state === "live" || state === "pre-session" || state === "just-ended";
  if (usesStudio) {
    return (
      <div className="mx-auto max-w-[1440px] lg:px-4 lg:py-6 sm:px-0">
        <SessionExperience session={session} state={state} />
        <div className="px-4 sm:px-6 lg:px-0">
          <StateSwitcher activeUrn={urn} />
        </div>
      </div>
    );
  }

  return (
    <PageShell variant="standard" contentMaxWidth={1100}>
      <SessionExperience session={session} state={state} />
      <StateSwitcher activeUrn={urn} />
    </PageShell>
  );
}
