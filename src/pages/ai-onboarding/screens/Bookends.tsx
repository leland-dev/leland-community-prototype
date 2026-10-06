/* Mock bookends: the screens before and after the journey we're actually
 * designing. Checkout confirmation + invite email on the way in; a placeholder
 * Program Hub on the way out. All intentionally lightweight. */
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Inbox, Send, Archive, Star } from "lucide-react";
import { Button } from "../../../components/Button";
import { AI_GRADIENT_VIDEO, COHORTS, ORG, PROGRAM_COVER, USER } from "../data";
import { BrandLockup, Cta, Eyebrow, FLOW_COLUMN, Heading, Initials, LelandLogo, Sub, TextInput } from "../ui";
import { BrandPanel, SplitLayout } from "./BrandPanel";
import { useScenario } from "../scenario";
import { LelandMark } from "../LelandWordmark";

const cover = PROGRAM_COVER;

/* ── 1. Checkout confirmation (individual entry) ───────────────────────── */
export function CheckoutConfirmation({ onNext }: { onNext: () => void }) {
  const { cohort: cohortId } = useScenario();
  const cohort = COHORTS.find((c) => c.id === cohortId);
  const rows: [string, string][] = [
    ...(cohort ? ([["Live cohort", `${cohort.label} · ${cohort.dates} · ${cohort.schedule}`]] as [string, string][]) : []),
    ["Order", USER.orderId],
    ["Receipt", USER.email],
    ["Access", "Lifetime · Certificate on completion · 30-day guarantee"],
  ];
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white text-ink-primary">
      <header className="flex h-16 shrink-0 items-center px-5 md:px-8">
        <LelandLogo />
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className={`mx-auto flex min-h-full w-full flex-col justify-center px-5 pb-16 pt-6 ${FLOW_COLUMN}`}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-3 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-secondary">
              <span className="flex size-5 items-center justify-center rounded-full bg-yellow text-ink-primary">
                <Check size={12} strokeWidth={3} />
              </span>
              Order confirmed
            </div>
            <Heading>You're in, {USER.firstName}.</Heading>
            <Sub>Your seat in the AI Builder Program is reserved. A receipt is on its way to {USER.email}.</Sub>

            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-stroke">
              <div className="flex items-center gap-4 p-5">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-black">
                  <video className="absolute inset-0 h-full w-full object-cover opacity-80" src={AI_GRADIENT_VIDEO} autoPlay muted loop playsInline />
                  <span className="absolute inset-0 flex items-center justify-center text-white">
                    <LelandMark className="h-7 w-7" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[17px] font-medium">AI Builder Program</div>
                  <div className="text-[14px] text-gray-light">Level 1 live cohort · Levels 0–4 self-paced</div>
                </div>
                <div className="text-[17px] font-medium">$1,495</div>
              </div>
              <dl className="divide-y divide-gray-stroke border-t border-gray-stroke text-[14px]">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex gap-6 px-5 py-3">
                    <dt className="w-24 shrink-0 text-gray-light">{k}</dt>
                    <dd className="min-w-0 flex-1 text-ink-primary">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10">
              <Cta className="w-full" onClick={onNext}>
                Continue to program <ArrowRight size={16} />
              </Cta>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* ── 2. Invite email (team entry) ──────────────────────────────────────── */
export function InviteEmail({ onNext }: { onNext: () => void }) {
  const folders = [
    { icon: Inbox, label: "Inbox", count: 12, active: true },
    { icon: Star, label: "Starred" },
    { icon: Send, label: "Sent" },
    { icon: Archive, label: "Archive" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex bg-[#f6f8fc] text-[#1f1f1f]">
      <aside className="hidden w-[220px] shrink-0 flex-col gap-1 p-4 pt-6 md:flex">
        <div className="mb-4 px-3 text-[20px] font-medium tracking-tight text-[#444]">Mail</div>
        {folders.map((f) => (
          <div
            key={f.label}
            className={`flex items-center justify-between rounded-full px-4 py-2 text-[14px] ${f.active ? "bg-[#d3e3fd] font-medium" : "text-[#444]"}`}
          >
            <span className="flex items-center gap-3">
              <f.icon size={16} /> {f.label}
            </span>
            {f.count ? <span className="text-[12px]">{f.count}</span> : null}
          </div>
        ))}
      </aside>
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-3 md:p-4 md:pl-0">
        <div className="flex min-h-full flex-col rounded-2xl bg-white shadow-sm">
          <div className="border-b border-[#e3e3e3] px-6 py-5">
            <h1 className="text-[22px] font-normal">
              {ORG.inviter.name} invited you to the AI Builder Program
            </h1>
            <div className="mt-3 flex items-center gap-3 text-[13px] text-[#5e5e5e]">
              <span className="flex size-9 items-center justify-center rounded-full bg-yellow text-[12px] font-semibold text-ink-primary">L</span>
              <div>
                <span className="font-medium text-[#1f1f1f]">Leland</span> &lt;hello@joinleland.com&gt;
                <div>to {USER.firstName.toLowerCase()}.{USER.lastName.toLowerCase()}@{ORG.domain}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-start justify-center bg-[#fafafa] p-6 md:p-10">
            <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-[#e3e3e3] bg-white">
              <div className="bg-black px-7 py-6 text-white">
                <div className="flex items-center justify-between">
                  <LelandLogo theme="dark" />
                  <BrandLockup />
                </div>
              </div>
              <div className="px-7 py-7">
                <div className="flex items-center gap-3">
                  <Initials text={ORG.inviter.initials} />
                  <div className="text-[14px] text-ink-secondary">
                    <span className="font-medium text-ink-primary">{ORG.inviter.name}</span> · {ORG.inviter.title}, {ORG.name}
                  </div>
                </div>
                <h2 className="mt-5 text-[26px] font-medium leading-[1.1] tracking-[-0.02em] text-ink-primary">
                  {ORG.inviter.name.split(" ")[0]} invited you to start learning on Leland
                </h2>
                <p className="mt-3 text-[15px] leading-[1.5] text-ink-secondary">
                  {ORG.name} is enrolling your team in the AI Builder Program, Leland's hands-on program for going from using AI to building with it. Your seat is reserved.
                </p>
                <div className="mt-5 flex items-center gap-4 rounded-xl border border-gray-stroke p-3">
                  <img src={cover} alt="" className="size-14 rounded-lg object-cover" />
                  <div>
                    <div className="text-[15px] font-medium text-ink-primary">AI Builder Program</div>
                    <div className="text-[13px] text-ink-secondary">Level 0 Foundations + Level 1 live cohort</div>
                  </div>
                </div>
                <Button size="lg" variant="dark" rounded="rounded-full" className="mt-6 w-full" onClick={onNext}>
                  Accept invite <ArrowRight size={16} />
                </Button>
                <p className="mt-4 text-center text-[12px] text-gray-extra-light">
                  This invite is for {USER.firstName.toLowerCase()}.{USER.lastName.toLowerCase()}@{ORG.domain} and expires in 14 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── 3. Interstitial auth (team entry): onboarding left, brand right ───── */
export function InviteInterstitial({ onNext }: { onNext: () => void }) {
  const [busy, setBusy] = useState(false);
  const go = () => {
    setBusy(true);
    setTimeout(onNext, 1100);
  };
  const email = `${USER.firstName.toLowerCase()}.${USER.lastName.toLowerCase()}@${ORG.domain}`;
  const benefits = [
    "Level 0 Foundations, self-paced, starts today",
    "Level 1 live cohort with instructors and TAs",
    "Role-specific builds, office hours and a certificate",
  ];
  return (
    <SplitLayout
      left={
        <div>
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-gray-stroke py-1.5 pl-1.5 pr-4">
            <Initials text={ORG.inviter.initials} />
            <span className="text-[14px] text-ink-secondary">
              <span className="font-medium text-ink-primary">{ORG.inviter.name}</span> invited you · {ORG.name}
            </span>
          </div>
          <Eyebrow>Claim your seat</Eyebrow>
          <Heading>Create your Leland account</Heading>
          <Sub>{ORG.name} is enrolling {ORG.seats} people. Sign in with your work email and we'll tailor the program to your role.</Sub>

          <div className="mt-7">
            <TextInput label="Work email" readOnly value={email} />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button size="lg" variant="dark" rounded="rounded-full" className="w-full" disabled={busy} onClick={go}>
              {busy ? "Signing you in…" : "Continue with Google"}
            </Button>
            <Button size="lg" variant="secondary" rounded="rounded-full" className="w-full" disabled={busy} onClick={go}>
              Continue with email
            </Button>
          </div>
          <p className="mt-4 text-[12px] leading-[1.5] text-gray-extra-light">
            Your seat is tied to this email. By continuing you agree to Leland's terms and privacy policy.
          </p>
        </div>
      }
      right={
        <BrandPanel>
          <div className="max-w-[440px]">
            <div className="font-serif text-[30px] font-medium leading-[1.05] md:text-[44px]">
              {ORG.inviter.name.split(" ")[0]} invited you to the AI Builder Program
            </div>
            <ul className="mt-6 hidden space-y-3 md:block">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-white/85">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-yellow text-ink-primary">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </BrandPanel>
      }
    />
  );
}
