import { FlowStepProgress } from "../flow-kit";
import type { Persona } from "./data";
import { renderItSetupStep } from "./steps";
import { useItSetupFlow } from "./useItSetupFlow";

type ItSetupFlowProps = {
  onComplete?: () => void;
};

const PERSONAS: { key: Persona; label: string }[] = [
  { key: "personal", label: "Personal (IT-cleared)" },
  { key: "company", label: "Company (needs sign-off)" },
];

// Prototype-only affordance standing in for a future user-level B2C/B2B flag:
// the setup flow no longer asks persona up front, so this toggle keeps the
// company (sign-off) branch — the `context` screen — reviewable.
function PersonaPreviewControl({
  persona,
  onSelect,
}: {
  persona: Persona;
  onSelect: (persona: Persona) => void;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-leland-gray-stroke pt-4">
      <span className="leland-paragraph-sm text-leland-gray-extra-light">
        Preview as
      </span>
      {PERSONAS.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => onSelect(p.key)}
          className={`rounded-full px-3 py-1 leland-paragraph-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
            persona === p.key
              ? "bg-leland-gray-dark text-white"
              : "bg-leland-gray-solid-hover text-leland-gray-light hover:bg-leland-gray-hover"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function ItSetupFlow({ onComplete }: ItSetupFlowProps) {
  const controller = useItSetupFlow();

  return (
    <div className="flex flex-col gap-8">
      <FlowStepProgress
        current={controller.progress.n}
        total={controller.progress.total}
      />
      {renderItSetupStep(controller, onComplete)}
      <PersonaPreviewControl
        persona={controller.state.persona}
        onSelect={controller.setPersona}
      />
    </div>
  );
}
