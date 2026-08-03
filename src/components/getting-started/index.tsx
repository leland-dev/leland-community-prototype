import type { ComponentType } from "react";

import { AddToCalendarFlow } from "./add-to-calendar/AddToCalendarFlow";
import { ItSetupFlow } from "./it-setup/ItSetupFlow";
import { JoinCohortFlow } from "./join-cohort/JoinCohortFlow";
import { PersonalizationFlow } from "./personalization/PersonalizationFlow";

export type FlowKey =
  | "add-to-calendar"
  | "it-setup"
  | "join-cohort"
  | "skills-assessment"
  | "personalization";

export type FlowProps = { onComplete?: () => void; onContinue?: () => void };

const FLOW_COMPONENTS: Partial<Record<FlowKey, ComponentType<FlowProps>>> = {
  "add-to-calendar": AddToCalendarFlow,
  "it-setup": ItSetupFlow,
  "join-cohort": JoinCohortFlow,
  "personalization": PersonalizationFlow,
};

export function GettingStartedFlow({
  flow,
  onComplete,
  onContinue,
}: {
  flow: FlowKey;
  onComplete?: () => void;
  onContinue?: () => void;
}) {
  const Flow = FLOW_COMPONENTS[flow];
  if (!Flow) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <h1 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
          Coming soon
        </h1>
        <p className="leland-paragraph-lg text-leland-gray-light">
          This getting-started module hasn't been built out yet.
        </p>
      </div>
    );
  }
  return <Flow onComplete={onComplete} onContinue={onContinue} />;
}
