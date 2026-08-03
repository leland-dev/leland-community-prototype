import type { FlowProps } from "../index";
import { Button, ButtonColor, ButtonSize, ButtonWidth } from "../../leland";
import {
  ExternalActionButton,
  FlowShell,
  ServiceBadge,
  SlackMark,
} from "../flow-kit";
import { COHORT_SLACK_INVITE } from "../it-setup/data";

export function JoinCohortFlow({ onComplete }: FlowProps) {
  const complete = () => onComplete?.();
  return (
    <FlowShell
      title="Join your Slack community"
      subhead="Your cohort, TAs, and announcements live in Slack."
      footer={
        <div className="flex items-center gap-3 pt-2">
          <Button
            label="Skip for now"
            buttonColor={ButtonColor.GRAY}
            size={ButtonSize.LARGE}
            onClick={complete}
          />
          <Button
            label="I've joined →"
            buttonColor={ButtonColor.PRIMARY}
            size={ButtonSize.LARGE}
            width={ButtonWidth.AUTO}
            onClick={complete}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-3 rounded-xl border border-leland-gray-stroke bg-white px-4 py-3.5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <ServiceBadge>
            <SlackMark />
          </ServiceBadge>
          <div className="min-w-0 flex-1">
            <div className="leland-paragraph-base font-semibold text-leland-gray-dark">
              Join #l1-jul6-cohort in Slack
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <ExternalActionButton
            label="Join →"
            href={COHORT_SLACK_INVITE}
            tone="secondary"
            size="sm"
          />
        </div>
      </div>
    </FlowShell>
  );
}
