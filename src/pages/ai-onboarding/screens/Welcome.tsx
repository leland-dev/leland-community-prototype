/* "Welcome to the AI Builder Program": onboarding content left, brand panel
 * right. The left column is the same shell the questions use, so the flow
 * never changes theme. */
import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { ORG, USER, WELCOME_QUOTES, type Path } from "../data";
import { Actions, Cta, Eyebrow, Heading, Sub } from "../ui";
import { BrandPanel, BrandQuotes, SplitLayout } from "./BrandPanel";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Welcome({ path, onNext }: { path: Path; onNext: () => void }) {
  const team = path === "team";
  return (
    <SplitLayout
      left={
        <div>
          <motion.div {...rise(0.05)}>
            <Eyebrow>{team ? `${ORG.name} × Leland` : `Welcome, ${USER.firstName}`}</Eyebrow>
          </motion.div>
          <motion.div {...rise(0.15)}>
            <Heading size="lg">Welcome to the AI Builder Program</Heading>
          </motion.div>
          <motion.div {...rise(0.28)}>
            <Sub>
              {team
                ? `${ORG.inviter.name} gave you a seat. Over the next few weeks you'll go from using AI to building with it, alongside your team.`
                : "Over the next few weeks you'll go from using AI to building with it. First, a minute to tailor the program to you."}
            </Sub>
          </motion.div>
          <motion.div {...rise(0.4)}>
            <Actions>
              <Cta onClick={onNext}>Get started <ArrowRight size={16} /></Cta>
              <span className="inline-flex items-center gap-1.5 text-[14px] text-ink-secondary">
                <Clock size={15} strokeWidth={1.75} /> ~2 min
              </span>
            </Actions>
          </motion.div>
        </div>
      }
      right={
        <BrandPanel>
          <motion.div {...rise(0.3)} className="max-w-[520px]">
            <div className="font-serif text-[34px] font-medium leading-[1.05] md:text-[44px] lg:text-[52px]">
              From using AI to building with it.
            </div>
            <p className="mt-4 hidden text-[17px] leading-[1.4] text-white/60 md:block">
              Level 0 Foundations, a live Level 1 cohort, and builds you'll actually use at work.
            </p>
          </motion.div>
          <motion.div {...rise(0.45)} className="mt-8 max-w-[520px]">
            <BrandQuotes quotes={WELCOME_QUOTES} />
          </motion.div>
        </BrandPanel>
      }
    />
  );
}
