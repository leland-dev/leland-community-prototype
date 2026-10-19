/* The question steps. Light Leland theme. Every step shows its selection
 * first and advances with the same full-width Continue at the bottom.
 * Single-select cards toggle: clicking the selected card clears it, which
 * puts the step back in its empty state (Continue disabled). */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import {
  CONTEXT_OPTIONS, EXPERIENCE_OPTIONS, LEVEL_OPTIONS, PERSONAL_ROLES, ROLES, TEAM_SIZES, TOOLS, USER, goalsFor, objectiveExample, roleAsksLevel,
  type Answers, type Path,
} from "../data";
import { Chip, Eyebrow, GhostCta, Heading, OptionCard, OptionGrid, StepContinue, Sub, TextInput, TileCard } from "../ui";

export type StepProps = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  step: number;
  total: number;
  path: Path;
};

/* ── Work vs personal ──────────────────────────────────────────────────── */
export function ContextStep(p: StepProps) {
  const value = p.answers.context;
  return (
    <>
      <div className="text-center">
        <Heading>How do you plan to use the AI Builder Program?</Heading>
        <Sub>We'll tailor features and AI tools to your goals</Sub>
      </div>
      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {CONTEXT_OPTIONS.map((o) => (
          <TileCard key={o.value} selected={value === o.value} onClick={() => p.update({ context: value === o.value ? undefined : o.value })} icon={o.icon} label={o.label} desc={o.desc} />
        ))}
      </div>
      <StepContinue onClick={p.onNext} disabled={!value} />
    </>
  );
}

/* ── Team details (work only, individual path) ─────────────────────────── */
export function TeamStep(p: StepProps) {
  const [email, setEmail] = useState("");
  const addInvite = () => {
    const v = email.trim();
    if (!v || !v.includes("@") || p.answers.invites.includes(v)) return;
    p.update({ invites: [...p.answers.invites, v] });
    setEmail("");
  };
  // Progressive disclosure: company → team size → invites (invites only make
  // sense once we know there's a team).
  const hasCompany = p.answers.companyName.trim().length > 0;
  const hasSize = !!p.answers.teamSize;
  const showInvites = hasCompany && hasSize && p.answers.teamSize !== "Just me";
  const canContinue = hasCompany && hasSize;
  const reveal = {
    initial: { opacity: 0, y: 8, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: { opacity: 0, y: -4, height: 0 },
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  };
  return (
    <>
      <Eyebrow>Your team</Eyebrow>
      <Heading>Tell us about where you work</Heading>
      <Sub>You're the first person from your company here. We'll make it easy to bring others in.</Sub>

      <div className="mt-8">
        <TextInput
          label="Company"
          placeholder="Where do you work?"
          value={p.answers.companyName}
          onChange={(e) => p.update({ companyName: e.target.value })}
          autoFocus
        />

        <AnimatePresence initial={false}>
          {hasCompany ? (
            <motion.div key="size" {...reveal} className="overflow-hidden">
              <div className="pt-6">
                <span className="mb-2 block text-[13px] font-medium text-ink-secondary">Team size</span>
                <div className="flex flex-wrap gap-2">
                  {TEAM_SIZES.map((s) => (
                    <Chip key={s} selected={p.answers.teamSize === s} onClick={() => p.update({ teamSize: p.answers.teamSize === s ? undefined : s })}>{s}</Chip>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}

          {showInvites ? (
            <motion.div key="invites" {...reveal} className="overflow-hidden">
              <div className="pt-6">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-secondary">Invite teammates <span className="font-normal text-gray-extra-light">(optional)</span></span>
                <div className="flex gap-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInvite(); } }}
                    placeholder="teammate@company.com"
                    className="h-12 flex-1 rounded-xl border border-gray-stroke px-4 text-[16px] outline-none placeholder:text-gray-xlight focus:border-ink-primary"
                  />
                  <GhostCta type="button" onClick={addInvite} className="h-12 px-4!"><Plus size={16} /> Add</GhostCta>
                </div>
                {p.answers.invites.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.answers.invites.map((i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-[#222222]/5 py-1.5 pl-3 pr-2 text-[13px]">
                        {i}
                        <button type="button" aria-label={`Remove ${i}`} onClick={() => p.update({ invites: p.answers.invites.filter((x) => x !== i) })} className="rounded-full p-0.5 hover:bg-[#222222]/10">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
                <span className="mt-2 block text-[12px] text-gray-extra-light">They'll get an invite like the one you'd expect. Seats are billed to your account.</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <StepContinue onClick={p.onNext} disabled={!canContinue} />
    </>
  );
}

/* ── Role ──────────────────────────────────────────────────────────────── */
export function RoleStep(p: StepProps) {
  const value = p.answers.role;
  // "For personal use" still asks the role (it drives examples and social
  // proof), but reframes the question and adds three non-work options.
  const personal = p.path === "individual" && p.answers.context === "personal";
  const options = personal
    ? [...ROLES.filter((r) => r.key !== "other"), ...PERSONAL_ROLES, ...ROLES.filter((r) => r.key === "other")]
    : ROLES;
  // Changing to a role that doesn't ask seniority drops any level picked earlier.
  const pickRole = (key: string) =>
    p.update(value === key ? { role: undefined, level: undefined } : { role: key, level: roleAsksLevel(key) ? p.answers.level : undefined });
  // "Something else" opens a free-text field so we learn which options are missing.
  const typing = value === "other";
  return (
    <>
      <Eyebrow>About you</Eyebrow>
      <Heading>{personal ? "What do you do?" : "What's your role?"}</Heading>
      <Sub>
        {personal
          ? "Even if you're learning for yourself, this helps us pick examples from your world."
          : "We'll tailor the examples, the builds and the people you learn with."}
      </Sub>
      <OptionGrid cols={2}>
        {options.map((r) => (
          <OptionCard key={r.key} compact selected={value === r.key} onClick={() => pickRole(r.key)} icon={r.icon} label={r.label} />
        ))}
      </OptionGrid>

      <AnimatePresence initial={false}>
        {typing ? (
          <motion.div
            key="other"
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <TextInput
                autoFocus
                value={p.answers.roleOther}
                onChange={(e) => p.update({ roleOther: e.target.value })}
                placeholder="What's your role? (optional)"
                aria-label="Your role"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <StepContinue onClick={p.onNext} disabled={!value} />
    </>
  );
}

/* ── Role level (drill-down from the role question) ────────────────────── */
export function LevelStep(p: StepProps) {
  const role = [...ROLES, ...PERSONAL_ROLES].find((r) => r.key === p.answers.role);
  const value = p.answers.level;
  return (
    <>
      <Eyebrow>About you</Eyebrow>
      {role ? (
        <div className="mb-4 inline-flex items-center rounded-full bg-[#222222]/5 px-3.5 py-1.5 text-[14px] font-medium text-ink-primary">{role.label}</div>
      ) : null}
      <Heading>And what's your level?</Heading>
      <Sub>So the examples match the scope of your work.</Sub>
      <OptionGrid>
        {LEVEL_OPTIONS.map((l) => (
          <OptionCard key={l.value} compact selected={value === l.value} onClick={() => p.update({ level: value === l.value ? undefined : l.value })} label={l.label} desc={l.desc} />
        ))}
      </OptionGrid>
      <StepContinue onClick={p.onNext} disabled={!value} />
    </>
  );
}

/* ── AI experience ─────────────────────────────────────────────────────── */
export function ExperienceStep(p: StepProps) {
  const value = p.answers.experience;
  return (
    <>
      <div className="text-center">
        <Heading>How experienced are you with AI?</Heading>
        <Sub>We'll adapt the program to match your experience level</Sub>
      </div>
      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {EXPERIENCE_OPTIONS.map((o) => (
          <TileCard key={o.value} selected={value === o.value} onClick={() => p.update({ experience: value === o.value ? undefined : o.value })} dots={o.dots} label={o.label} desc={o.desc} />
        ))}
      </div>
      <StepContinue onClick={p.onNext} disabled={!value} />
    </>
  );
}

/* ── AI tool ───────────────────────────────────────────────────────────── */
export function ToolStep(p: StepProps) {
  const value = p.answers.tool;
  const work = p.answers.context === "work" || p.path === "team";
  return (
    <>
      <Eyebrow>Your track</Eyebrow>
      <Heading>Which AI tool will you build with?</Heading>
      <Sub>
        {work ? "Pick the one your company lets you use. " : ""}
        The program works with all of them, and we'll help you get set up before session one.
      </Sub>
      <OptionGrid cols={2}>
        {TOOLS.map((t) => (
          <OptionCard key={t.value} compact selected={value === t.value} onClick={() => p.update({ tool: value === t.value ? undefined : t.value })} logo={t.logo} label={t.label} desc={t.desc} />
        ))}
      </OptionGrid>
      <StepContinue onClick={p.onNext} disabled={!value} />
    </>
  );
}

/* ── Goals (multi-select chips): role-specific group, then generic ──────── */
export function GoalsStep(p: StepProps) {
  const toggle = (k: string) =>
    p.update({ goals: p.answers.goals.includes(k) ? p.answers.goals.filter((g) => g !== k) : [...p.answers.goals, k] });
  const { role, generic } = goalsFor(p.answers.role, p.answers.level);
  // One cloud, no section labels: the role-specific outcomes lead, the generic ones follow.
  const options = [...role, ...generic];
  return (
    <>
      <Heading>What do you want to accomplish with AI?</Heading>
      <Sub>Choose as many options as you want</Sub>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {options.map((g) => (
          <Chip key={g.key} selected={p.answers.goals.includes(g.key)} onClick={() => toggle(g.key)} icon={g.icon}>
            {g.label}
          </Chip>
        ))}
      </div>
      <StepContinue onClick={p.onNext} disabled={p.answers.goals.length === 0} />
    </>
  );
}

/* ── Goal, in their own words (the last question) ──────────────────────── */
/** Thoughtfulness meter: fills from orange to green as they write; maxes out
 *  at about a sentence and a half (~110 characters). Encouragement, not a gate. */
const GOAL_FULL_AT = 110;
function strengthOf(text: string) {
  const ratio = Math.min(1, text.trim().length / GOAL_FULL_AT);
  const color = ratio < 0.5 ? "#ef8509" : ratio < 1 ? "#FFD96F" : "#1F5340";
  return { ratio, color };
}

export function GoalTextStep(p: StepProps) {
  const text = p.answers.goalsNote;
  const hasText = text.trim().length > 0;
  const { ratio, color } = strengthOf(text);
  return (
    <>
      <Eyebrow>Your learning objective</Eyebrow>
      <Heading>What do you want AI to do for you?</Heading>
      <Sub>Finish the sentence in your own words. We'll save it as your learning objective and build toward it with you through the program.</Sub>

      {/* One sentence with a fixed lead-in: the structure does the articulating. */}
      <label className="mt-8 block cursor-text rounded-xl border border-gray-stroke bg-white px-4 pb-3 pt-3.5 transition-colors focus-within:border-ink-primary">
        <span className="block text-[16px] font-medium leading-[1.5] text-ink-primary">By the end of the program, I want to use AI to…</span>
        <textarea
          value={text}
          onChange={(e) => p.update({ goalsNote: e.target.value })}
          rows={3}
          autoFocus
          placeholder={objectiveExample(p.answers.role)}
          className="mt-1 w-full resize-none bg-transparent text-[16px] leading-[1.5] text-ink-primary outline-none placeholder:text-gray-xlight"
        />
      </label>
      <div className="mt-2.5 flex items-center gap-2.5 text-[12px] text-gray-extra-light">
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#222222]/10" aria-hidden>
          <motion.div
            className="h-full rounded-full"
            initial={false}
            animate={{ width: `${Math.max(ratio * 100, hasText ? 6 : 0)}%`, backgroundColor: color }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span>{text.trim().length} characters</span>
      </div>

      <StepContinue onClick={p.onNext} disabled={!hasText} />
    </>
  );
}
