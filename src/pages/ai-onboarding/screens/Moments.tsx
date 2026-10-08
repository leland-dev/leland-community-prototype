/* The educational "moments" between questions: role affirmation, social
 * proof, and the preparing loader. They live in the same light shell as the
 * questions, sized like a question, so they read as a beat, not a takeover. */
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Star } from "lucide-react";
import { EXPERIENCE_ARC, EXPERIENCE_OPTIONS, INSTRUCTORS, ORG, TOOLS, isNonWorkRole, profileFor, roleLabel, toolLabel, COHORTS, type Answers, type Path } from "../data";
import { ORG_LOGOS } from "../../onboarding/data";
import { Dots, Eyebrow, Heading, StepContinue, Sub } from "../ui";
import { useScenario } from "../scenario";

type MomentProps = { answers: Answers; path: Path; onNext: () => void };

/* ── Affirmation: "the best place for {level} to get the most out of {tool}" ─ */
export function RoleAffirmation({ answers, onNext }: MomentProps) {
  const scenario = useScenario();
  const tool = scenario.orgTool ?? answers.tool;
  const toolMeta = TOOLS.find((t) => t.value === tool);
  const hasTool = !!toolMeta && tool !== "unsure";
  const toolName = hasTool ? toolMeta!.label : "AI";
  const level = answers.experience ?? "casual";
  const arc = EXPERIENCE_ARC[level];
  const dots = EXPERIENCE_OPTIONS.find((o) => o.value === level)?.dots ?? 2;
  const role = roleLabel(answers.role).toLowerCase();

  return (
    <>
      <div className="flex flex-col items-center text-center">
        {hasTool ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative mb-6"
          >
            <img src={`${import.meta.env.BASE_URL}${toolMeta!.logo}`} alt={toolName} className="size-16 rounded-2xl object-cover shadow-card" />
            <span className="absolute -bottom-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full border-2 border-white bg-yellow text-ink-primary">
              <Check size={12} strokeWidth={3} />
            </span>
          </motion.div>
        ) : null}
        <Eyebrow>{hasTool ? `Your ${toolName} track` : "Your track"}</Eyebrow>
        <Heading>
          The best place for {arc.noun} to get the most out of {toolName}
        </Heading>
        <Sub>
          {isNonWorkRole(answers.role)
            ? `Level 0 starts where you are. By Level 1 you're building with ${toolName} on things you actually care about.`
            : `Level 0 starts where you are. By Level 1 you're building with ${toolName} on real ${role} work.`}
        </Sub>
      </div>

      {/* Today → after the program */}
      <div className="mt-10 rounded-2xl border border-gray-stroke p-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
          <ArcNode label="Today" dots={dots} text={arc.today} delay={0.1} />
          <div className="mt-5 w-16 sm:w-24">
            {/* One path, one stroke weight: shaft + head drawn together. */}
            <svg viewBox="0 0 96 16" className="h-4 w-full overflow-visible text-ink-primary" fill="none" aria-hidden>
              <path d="M0 8H94" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
              <motion.path
                d="M0 8H94M88 2L94 8L88 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </div>
          <ArcNode label="After the program" dots={4} text={arc.after} delay={1.3} highlight />
        </div>
      </div>

      <StepContinue onClick={onNext} />
    </>
  );
}

function ArcNode({ label, dots, text, delay, highlight = false }: { label: string; dots: 1 | 2 | 3 | 4; text: string; delay: number; highlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-0"
    >
      <span className={`flex size-10 items-center justify-center rounded-full ${highlight ? "bg-blue text-ink-primary" : "bg-[#222222]/5 text-ink-primary"}`}>
        <Dots n={dots} />
      </span>
      <div className="mt-3 text-[12px] font-medium uppercase tracking-[0.12em] text-ink-secondary">{label}</div>
      <div className="mt-1 text-[15px] leading-[1.4] text-ink-primary">{text}</div>
    </motion.div>
  );
}

/* ── Social proof ──────────────────────────────────────────────────────── */
export function SocialProof({ answers, path, onNext }: MomentProps) {
  const profile = profileFor(answers.role);
  const team = path === "team";
  const teammates = ["AR", "MK", "SD", "TL", "JW", "PN", "DO"];
  const peers = team
    ? [
        { name: ORG.inviter.name, title: ORG.inviter.title, company: ORG.name, quote: "I went through the program first. It changed how we run the week, so I'm bringing the whole team." },
        profile.peers.find((x) => x.company !== ORG.name) ?? profile.peers[0],
      ]
    : profile.peers;

  return (
    <>
      <Eyebrow>{team ? `Your team at ${ORG.name}` : "People like you"}</Eyebrow>
      <Heading>
        {team ? (
          <>You're joining {ORG.seats} teammates who are building with AI together</>
        ) : (
          <>{profile.proofHeadline}</>
        )}
      </Heading>

      {team ? (
        <div className="mt-5 flex items-center gap-3">
          <div className="flex -space-x-2">
            {teammates.map((t) => (
              <span key={t} className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-cream text-[10px] font-semibold">{t}</span>
            ))}
          </div>
          <span className="text-[14px] text-ink-secondary">+{ORG.seats - teammates.length} more from {ORG.name}</span>
        </div>
      ) : null}

      <div className="mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max items-center gap-10" style={{ animation: "leland-marquee 40s linear infinite" }}>
          {[...ORG_LOGOS, ...ORG_LOGOS].map((l, i) => (
            <img key={`${l.name}-${i}`} src={l.src} alt={l.name} style={{ height: Math.round(l.height * 0.8) }} className="w-auto shrink-0 opacity-50 grayscale" />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {peers.map((peer) => (
          // Same card grammar as the quotes on the welcome brand panel, in light.
          <div key={peer.name} className="rounded-2xl border border-gray-stroke bg-white p-4">
            <div className="flex gap-0.5 text-yellow">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
            <p className="mt-2 text-[15px] leading-[1.45] text-ink-primary">"{peer.quote}"</p>
            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 text-[13px]">
              <span className="font-medium text-ink-primary">{peer.name}</span>
              <span className="text-gray-light">{peer.title}, {peer.company}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-gray-stroke pt-5 text-[14px] text-ink-secondary">
        <div><span className="text-[22px] font-medium text-ink-primary">{profile.stat.value}</span> · {profile.stat.label}</div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {INSTRUCTORS.map((ins) => <img key={ins.name} src={ins.photo} alt={ins.name} className="size-8 rounded-full border-2 border-white object-cover" />)}
          </div>
          <span>Your instructors and TAs</span>
        </div>
      </div>

      <StepContinue onClick={onNext} />
    </>
  );
}

/* ── Preparing your experience ─────────────────────────────────────────── */
export function Preparing({ answers, onDone }: { answers: Answers; path: Path; onDone: () => void }) {
  const scenario = useScenario();
  const tool = scenario.orgTool ?? answers.tool;
  const cohort = COHORTS.find((c) => c.id === answers.cohortId);
  const lines = [
    `Setting your track: ${toolLabel(tool)}`,
    `Tailoring examples for ${roleLabel(answers.role).toLowerCase()}`,
    cohort
      ? `${scenario.cohort === cohort.id ? "Confirming" : "Reserving"} your seat in the ${cohort.label}`
      : "Unlocking Level 0 Foundations",
    "Building your program hub",
  ];
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= lines.length) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 650);
    return () => clearTimeout(t);
  }, [done, lines.length, onDone]);

  return (
    <div className="flex flex-1 flex-col justify-center">
      <Eyebrow>Almost there</Eyebrow>
      <Heading>Preparing your experience</Heading>
      <ul className="mt-8 space-y-3">
        {lines.map((l, i) => {
          const state = i < done ? "done" : i === done ? "active" : "todo";
          return (
            <li key={l} className={`flex items-center gap-3 text-[16px] transition-colors ${state === "todo" ? "text-gray-xlight" : "text-ink-primary"}`}>
              <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${state === "done" ? "border-ink-primary bg-ink-primary text-white" : state === "active" ? "border-ink-primary" : "border-gray-stroke"}`}>
                {state === "done" ? <Check size={12} strokeWidth={3} /> : state === "active" ? <motion.span className="size-2 rounded-full bg-ink-primary" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} /> : null}
              </span>
              {l}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
