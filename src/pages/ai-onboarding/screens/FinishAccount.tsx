/* Last question step: cohort + phone for reminders. Light theme.
 * Two modes:
 *   - cohort chosen at checkout  → confirm it (with a "change" escape hatch)
 *   - no cohort yet              → pick one here, or defer and start Level 0 */
import { useState } from "react";
import { CalendarDays, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../components/Button";
import { COHORTS, ORG } from "../data";
import { useScenario } from "../scenario";
import { Eyebrow, Heading, StepContinue, Sub, TextInput } from "../ui";
import type { StepProps } from "./Questions";

export function FinishStep(p: StepProps) {
  const scenario = useScenario();
  const team = p.path === "team";
  const preselected = COHORTS.find((c) => c.id === scenario.cohort);
  const [changing, setChanging] = useState(false);
  const [details, setDetails] = useState<string | null>(null);
  const confirmMode = !!preselected && !changing;
  const chosen = COHORTS.find((c) => c.id === p.answers.cohortId);

  return (
    <>
      <Eyebrow>Last step</Eyebrow>
      <Heading>{confirmMode ? "Confirm your cohort" : "Select a cohort"}</Heading>
      <Sub>
        {confirmMode
          ? team
            ? `${ORG.inviter.name.split(" ")[0]} put you in this cohort with your ${ORG.name} teammates. Level 0 unlocks the moment you finish; Level 1 starts with your cohort.`
            : "You picked these dates at checkout. Level 0 unlocks the moment you finish; Level 1 starts with your cohort."
          : `Level 0 unlocks the moment you finish. Level 1 is live, three weeks, with instructors and your cohort.${team ? ` ${ORG.name} teammates are spread across these dates.` : ""}`}
      </Sub>

      {confirmMode && chosen ? (
        <div className="mt-8 rounded-2xl border border-ink-primary p-5">
          <div className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow">
              <CalendarDays size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-ink-secondary">
                <Check size={12} strokeWidth={3} /> Your seat is reserved
              </div>
              <div className="mt-1 text-[20px] font-medium leading-tight">{chosen.label} · {chosen.dates}</div>
              <div className="text-[14px] text-ink-secondary">{chosen.schedule}</div>
            </div>
            <button
              type="button"
              onClick={() => setChanging(true)}
              className="text-[13px] font-medium text-ink-secondary underline-offset-4 hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 border-t border-gray-stroke">
          {COHORTS.map((c) => {
            const enrolled = p.answers.cohortId === c.id;
            const open = details === c.id;
            return (
              <div key={c.id} className="border-b border-gray-stroke py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[18px] leading-tight text-ink-primary">{c.dates}</div>
                    <button
                      type="button"
                      onClick={() => setDetails(open ? null : c.id)}
                      aria-expanded={open}
                      className="mt-1.5 border-b border-dotted border-ink-primary text-[15px] leading-tight text-ink-primary hover:border-solid"
                    >
                      {open ? "Hide details" : "More details"}
                    </button>
                  </div>
                  {enrolled ? (
                    <Button size="md" variant="secondary" rounded="rounded-xl" aria-pressed onClick={() => p.update({ cohortId: undefined })} className="text-gray-light">
                      Enrolled
                    </Button>
                  ) : (
                    <Button size="md" variant="primary" rounded="rounded-xl" onClick={() => p.update({ cohortId: c.id })}>
                      Enroll
                    </Button>
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 text-[14px] leading-[1.5] text-gray-light">
                        Live sessions {c.schedule}, three weeks, with instructors and TAs. {c.seatsLeft} seats left{c.soonest ? " · starts soonest" : ""}.
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => p.update({ cohortId: undefined })}
            className={`mt-4 text-[14px] underline-offset-4 hover:underline ${p.answers.cohortId === undefined && !preselected ? "font-medium text-ink-primary" : "text-gray-light"}`}
          >
            I'll choose a cohort later. Start me on Level 0 now.
          </button>
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-cream p-5">
        <TextInput
          name="phone"
          type="tel"
          inputMode="tel"
          label="Mobile number"
          placeholder="(555) 123-4567"
          value={p.answers.phone}
          onChange={(e) => p.update({ phone: e.target.value })}
          hint="For session reminders and a text from your TA before day one. Optional."
        />
        <label className="mt-4 flex items-center gap-3 text-[14px]">
          <input
            type="checkbox"
            checked={p.answers.reminders}
            onChange={(e) => p.update({ reminders: e.target.checked })}
            className="size-4 accent-[#222222]"
          />
          Text me reminders before live sessions
        </label>
      </div>

      <StepContinue onClick={p.onNext}>{confirmMode ? "Confirm and finish" : "Finish setup"}</StepContinue>
    </>
  );
}
