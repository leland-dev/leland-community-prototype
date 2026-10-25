import { Button } from "./Button";

const CARD = "rounded-2xl bg-white p-8 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

// Shown in place of the task list the first time a goal page renders — the
// list itself only appears once the user continues past this. Not
// persisted, so it reappears on every fresh visit.
export default function GoalTasksIntro({
  heading,
  body,
  ctaLabel = "Get started",
  onContinue,
}: {
  heading: string;
  body: string;
  ctaLabel?: string;
  onContinue: () => void;
}) {
  return (
    <section className={`${CARD} flex flex-col items-start gap-3`}>
      <h2 className="font-serif text-[22px] font-medium leading-[1.2] text-gray-dark">{heading}</h2>
      <p className="max-w-[520px] text-[15px] leading-[1.5] text-gray-light">{body}</p>
      <Button onClick={onContinue} size="md" variant="primary" className="font-medium">
        {ctaLabel}
      </Button>
    </section>
  );
}
