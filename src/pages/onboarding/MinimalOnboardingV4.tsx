import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Compass, BookOpen, Send, Trophy } from "lucide-react";

import type { Branch } from "./data";
import { CATEGORIES_BY_BRANCH, CATEGORY_QUESTION, resonanceFor } from "./resonanceV4";
import PersistentLogo from "./steps/PersistentLogo";
import Opener from "./steps/Opener";
import Auth from "./steps/Auth";
import GoalSelect from "./steps/GoalSelect";
import ExpertReassurance from "./steps/ExpertReassurance";
import ChoiceQuestion from "./steps/ChoiceQuestion";
import { StepChrome } from "./steps/flowUI";
import SituationStep, { type Situation } from "./steps/SituationStep";
import StudentStatusStep, { type StudentStatus } from "./steps/StudentStatusStep";
import UniversitySearch, { type SchoolAnswer } from "./steps/UniversitySearch";
import SchoolProof from "./steps/SchoolProof";
import LinkedInConnect, { type LinkedInProfile } from "./steps/LinkedInConnect";
import ApplicationReview from "./steps/ApplicationReview";
import AccessExplainer from "./steps/AccessExplainer";
import WaitlistGate from "./steps/WaitlistGate";
import { Notify } from "../waitlist/Waitlist";
import foundPhoto from "../../assets/profile photos/pic-1.png";

/* ─────────────────────────────────────────────────────────────────────────
 * Onboarding v4 (Chandler's take on v3). Three acts:
 *
 *   Ambition   — goal → category → "experts are here for you" (adaptive)
 *   Credential — situation → student status → university + grad year →
 *                "{School} is on Leland" → connect LinkedIn (skippable)
 *   The gate   — "reviewing your application" → pre-approved (the pass) →
 *                how access works → push notifs → waitlist: invite 3 in 24h to skip the
 *                line, with the blurred line itself below the fold
 *
 * It's a dead end on purpose: the doors aren't open yet, and the whole flow
 * builds toward wanting in badly enough to bring three peers.
 *
 * The university step has no Skip on purpose: you come in through a school.
 * Narrative beats (reassurance, schoolproof, building) render no dots.
 * ──────────────────────────────────────────────────────────────────────── */

const SITUATIONS: Situation[] = [
  { label: "Just starting to explore", Icon: Compass },
  { label: "Actively preparing", Icon: BookOpen },
  { label: "Applying and interviewing", Icon: Send },
  { label: "Already in, leveling up", Icon: Trophy },
];

const TOTAL_STEPS = 6;

type Stage =
  | "loading"
  | "opener"
  | "signin"
  | "goal"
  | "category"
  | "reassurance"
  | "situation"
  | "student"
  | "school"
  | "schoolproof"
  | "linkedin"
  | "review"
  | "access"
  | "notify"
  | "gate";

const rise = {
  initial: (reduced: boolean) => (reduced ? { opacity: 0 } : { opacity: 0, y: 40 }),
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const, delay: 0.1 },
};

export default function MinimalOnboardingV4() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;

  const [stage, setStage] = useState<Stage>("loading");
  const [logoRevealed, setLogoRevealed] = useState(false);
  // "signup" = full Get-started flow; "login" = short returning-user path
  // (auth → home).
  const [intent, setIntent] = useState<"signup" | "login">("signup");

  // answers
  const [branch, setBranch] = useState<Branch>("grow-career");
  const [categories, setCategories] = useState<string[]>([]);
  const [studentStatus, setStudentStatus] = useState<StudentStatus>("enrolled");
  const [school, setSchool] = useState<SchoolAnswer | null>(null);
  const [linkedin, setLinkedin] = useState<LinkedInProfile | null>(null);
  const [invitesSent, setInvitesSent] = useState(0);

  useEffect(() => {
    document.title = "Leland — Get started";
  }, []);

  // Intro choreography: pop → reveal wordmark → dock at top.
  useEffect(() => {
    if (stage !== "loading") return;
    const tReveal = window.setTimeout(() => setLogoRevealed(true), reduced ? 100 : 800);
    const tOpener = window.setTimeout(() => setStage("opener"), reduced ? 650 : 2100);
    return () => {
      window.clearTimeout(tReveal);
      window.clearTimeout(tOpener);
    };
  }, [stage, reduced]);

  const exit = () => navigate("/");

  const logoVisible = stage === "loading" || stage === "opener";
  const logoDocked = stage === "opener";

  const resonance = resonanceFor(categories);


  // Persistent header (back · dots · skip) per stage. Narrative beats have a
  // back target but no dot index; the school step has no skip (intentional).
  const STEP_BACK: Partial<Record<Stage, Stage>> = {
    goal: "signin",
    category: "goal",
    reassurance: "category",
    situation: "reassurance",
    student: "situation",
    school: "student",
    schoolproof: "school",
    linkedin: "schoolproof",
  };
  const STEP_SKIP: Partial<Record<Stage, Stage>> = {
    goal: "category",
    category: "reassurance",
    reassurance: "situation",
    situation: "student",
    student: "school",
    schoolproof: "linkedin",
    linkedin: "review",
  };
  const STEP_INDEX: Partial<Record<Stage, number>> = {
    goal: 1,
    category: 2,
    situation: 3,
    student: 4,
    school: 5,
    linkedin: 6,
  };

  const chrome =
    STEP_BACK[stage] !== undefined
        ? {
            onBack: () => setStage(STEP_BACK[stage]!),
            onSkip: STEP_SKIP[stage] ? () => setStage(STEP_SKIP[stage]!) : undefined,
            step:
              STEP_INDEX[stage] !== undefined
                ? { index: STEP_INDEX[stage]!, total: TOTAL_STEPS }
                : undefined,
          }
        : null;

  const primaryCategory = categories[0] ?? "Career";
  // "350+ MBA admissions experts are here…" → "350+ MBA admissions experts"
  const expertHeadline = resonance.title.includes(" experts")
    ? `${resonance.title.split(" experts")[0]} experts`
    : "thousands of experts";
  const reviewInput = school
    ? {
        school: school.school,
        logoKey: school.logoKey,
        gradYear: school.gradYear,
        category: primaryCategory,
        expertHeadline,
        name: linkedin?.name,
      }
    : null;

  const screen = (key: string, node: React.ReactNode) => (
    <motion.div key={key} initial={rise.initial(reduced)} animate={rise.animate} transition={rise.transition} className="h-full">
      {node}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-white">
      {/* ── white intro layer (fades out once we leave loading) ── */}
      <motion.div
        className="absolute inset-0 z-[40] bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === "loading" ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ pointerEvents: stage === "loading" ? "auto" : "none" }}
      />

      {/* ── persistent Leland logo: intro → docks at top of the opener ── */}
      <AnimatePresence>
        {logoVisible ? (
          <PersistentLogo key="logo" docked={logoDocked} revealed={logoRevealed} reduced={reduced} light />
        ) : null}
      </AnimatePresence>

      {/* ── step stage: mobile-first column, centered on desktop ── */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[440px] flex-col">
        {chrome ? <StepChrome onBack={chrome.onBack} onSkip={chrome.onSkip} step={chrome.step} /> : null}

        <div className="relative min-h-0 flex-1">
          <AnimatePresence mode="wait">
            {stage === "loading" ? null : stage === "opener" ? (
              <motion.div
                key="opener"
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
                className="h-full"
              >
                <Opener
                  variant="getStarted"
                  light
                  onGetStarted={() => {
                    setIntent("signup");
                    setStage("signin");
                  }}
                  onSignIn={() => {
                    setIntent("login");
                    setStage("signin");
                  }}
                  onExpert={() => navigate("/onboarding", { state: { expert: true } })}
                />
              </motion.div>
            ) : stage === "signin" ? (
              screen("signin",
                <Auth
                  cohortName="the Leland community"
                  onBack={() => setStage("opener")}
                  onExit={exit}
                  onNext={() => (intent === "login" ? navigate("/") : setStage("goal"))}
                  primary="phone"
                />,
              )
            ) : stage === "goal" ? (
              screen("goal",
                <GoalSelect
                  onSelect={(b) => {
                    setBranch(b);
                    setCategories([]);
                    setStage("category");
                  }}
                />,
              )
            ) : stage === "category" ? (
              screen(`category-${branch}`,
                <ChoiceQuestion
                  title={CATEGORY_QUESTION[branch]}
                  options={CATEGORIES_BY_BRANCH[branch]}
                  multi
                  onContinue={(picked) => {
                    setCategories(picked);
                    setStage("reassurance");
                  }}
                />,
              )
            ) : stage === "reassurance" ? (
              screen("reassurance",
                <ExpertReassurance
                  title={resonance.title}
                  emphasis={resonance.emphasis}
                  subline={resonance.subline}
                  orgs={resonance.orgs}
                  reviews={resonance.reviews}
                  onContinue={() => setStage("situation")}
                />,
              )
            ) : stage === "situation" ? (
              screen("situation",
                <SituationStep
                  title="Where are you in the journey?"
                  options={SITUATIONS}
                  single
                  onContinue={() => setStage("student")}
                />,
              )
            ) : stage === "student" ? (
              screen("student",
                <StudentStatusStep
                  branch={branch}
                  onSelect={(s) => {
                    setStudentStatus(s);
                    setSchool(null);
                    setStage("school");
                  }}
                />,
              )
            ) : stage === "school" ? (
              screen(`school-${studentStatus}`,
                <UniversitySearch
                  status={studentStatus}
                  onContinue={(a) => {
                    setSchool(a);
                    setStage("schoolproof");
                  }}
                />,
              )
            ) : stage === "schoolproof" && school ? (
              screen("schoolproof",
                <SchoolProof
                  school={school.school}
                  logoKey={school.logoKey}
                  pioneer={school.custom}
                  resonance={resonance}
                  onContinue={() => setStage("linkedin")}
                />,
              )
            ) : stage === "linkedin" ? (
              screen("linkedin",
                <LinkedInConnect
                  school={school?.school}
                  gradYear={school?.gradYear}
                  onConnected={(p) => {
                    setLinkedin(p);
                    setStage("review");
                  }}
                />,
              )
            ) : stage === "review" && reviewInput ? (
              <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="h-full">
                <ApplicationReview input={reviewInput} onContinue={() => setStage("access")} />
              </motion.div>
            ) : stage === "access" && school ? (
              screen("access",
                <AccessExplainer
                  category={primaryCategory}
                  orgs={resonance.orgs}
                  expertHeadline={expertHeadline}
                  onContinue={() => setStage("notify")}
                />,
              )
            ) : stage === "notify" ? (
              screen("notify", <Notify reduced={reduced} onDone={() => setStage("gate")} />)
            ) : school ? (
              screen("gate",
                <WaitlistGate
                  sent={invitesSent}
                  onSent={() => setInvitesSent((n) => Math.min(n + 1, 3))}
                  category={primaryCategory}
                  you={{
                    name: linkedin?.name ?? "June Allen",
                    aff: `${school.school.replace(/^University of /, "").replace(/ University$/, "").replace(/ College$/, "")} · ${
                      school.gradYear === "earlier" ? "Alum" : school.gradYear === "unknown" ? "Member" : `Class of '${String(school.gradYear).slice(2)}`
                    }`,
                    avatar: linkedin?.photo ?? foundPhoto,
                  }}
                  onDone={() => navigate("/")}
                />,
              )
            ) : (
              <motion.div key="fallback" className="h-full" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
