import { useEffect, useState, type ReactNode } from "react";

import { Button, ButtonColor, ButtonSize, IconCheck } from "../../leland";
import {
  CopyPromptButton,
  ExternalActionButton,
  FlowInfoCard,
  FlowShell,
  OptionCard,
  OptionGrid,
  ServiceBadge,
  SlackMark,
  EmailMark,
  CalendarMark,
  VendorBadge,
} from "../flow-kit";
import { ConfirmSetupModal } from "./ConfirmSetupModal";
import {
  COHORT_SLACK_INVITE,
  VENDOR_INFO,
  connectorDefs,
  type ConnectorKey,
  type VendorInfo,
  type VendorKey,
} from "./data";
import type { ItSetupController } from "./useItSetupFlow";

type StepProps = { c: ItSetupController };

// ── Shared bits ──────────────────────────────────────────────────────────────

function ConnectorListItem({
  badge,
  name,
  desc,
  action,
}: {
  badge: ReactNode;
  name: ReactNode;
  desc: string;
  action: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-leland-gray-stroke bg-white px-4 py-3.5">
      {badge}
      <div className="min-w-0 flex-1">
        <div className="leland-paragraph-base font-semibold text-leland-gray-dark">
          {name}
        </div>
        <div className="leland-paragraph-sm text-leland-gray-light">{desc}</div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

const CONNECTOR_ICON: Record<ConnectorKey, { mark: ReactNode; bg?: string }> = {
  slack: { mark: <SlackMark />, bg: "#4A154B" },
  email: { mark: <EmailMark /> },
  calendar: { mark: <CalendarMark /> },
};

function isChromiumBrowser(): boolean {
  const ua = navigator.userAgent;
  if (/Firefox\//.test(ua)) return false;
  if (/Chrome\/|Chromium\/|Edg\/|OPR\/|Vivaldi\//.test(ua)) return true;
  return false;
}

// ── Intro / transition screens ───────────────────────────────────────────────

function WelcomeStep({ c }: StepProps) {
  return (
    <FlowShell
      eyebrow="Getting started · Level 1"
      title="Let's get your tools set up"
      subhead="Seven quick steps, about 3 minutes. We'll confirm your account, connect the tools Level 1 needs, and make sure nothing blocks you once you're live."
      onContinue={() => c.goTo(c.nextFromWelcome())}
      continueLabel="Get started"
    />
  );
}

function ContextStep({ c }: StepProps) {
  if (c.state.persona === "company") {
    return (
      <FlowShell
        eyebrow="Before we start"
        title="Heads up: your company hasn't reviewed AI tools yet"
        subhead="That's normal, most people in your position get here before their IT team does. A couple of steps ahead may need their sign-off, so we'll flag those clearly as we go."
        onBack={() => c.goTo("welcome")}
        onContinue={() => c.goTo("choosetool")}
      >
        <ConnectorListItem
          badge={<ServiceBadge>📄</ServiceBadge>}
          name="AI Builder L1 — IT & Security Brief"
          desc="One page. What's installed, what data it touches, and where it's already certified (SOC 2 Type II, ISO 27001)."
          action={
            <ExternalActionButton
              label="View brief →"
              href="#"
              tone="secondary"
              size="sm"
            />
          }
        />
      </FlowShell>
    );
  }
  return (
    <FlowShell
      eyebrow="Before we start"
      title="Good news — your company's already cleared this"
      subhead="Your IT team approved this vendor as part of your organization's rollout, so you shouldn't hit any permission walls. If something does get blocked, it's worth a quick note to your admin."
      onBack={() => c.goTo("welcome")}
      onContinue={() => c.goTo("choosetool")}
    >
      <FlowInfoCard tone="blue" icon="✅">
        <strong>IT approval on file</strong> for your organization. You're clear
        to connect everything below.
      </FlowInfoCard>
    </FlowShell>
  );
}

// ── Choose AI tool ───────────────────────────────────────────────────────────

const TOOL_CHOICE_DESC: Record<VendorKey, string> = {
  claude: "Anthropic · desktop app + Cowork",
  chatgpt: "OpenAI · desktop app + Codex",
  copilot: "Microsoft 365 ecosystem",
  gemini: "Google Workspace ecosystem",
};

function ChooseToolStep({ c }: StepProps) {
  return (
    <FlowShell
      title="Which AI tool are you using for the program?"
      subhead="Everything in Level 1, including your setup steps, will be tailored to this."
      onBack={() => c.goTo(c.backFromAccount())}
      onContinue={() => c.goTo("plan")}
    >
      <OptionGrid>
        {(Object.keys(VENDOR_INFO) as VendorKey[]).map((key) => (
          <OptionCard
            key={key}
            name={VENDOR_INFO[key].name}
            desc={TOOL_CHOICE_DESC[key]}
            selected={c.state.vendor === key}
            onClick={() => c.selectVendor(key)}
          />
        ))}
      </OptionGrid>
    </FlowShell>
  );
}

// ── Account steps (plan / app / extension / cohort) ──────────────────────────

function PlanStep({ c }: StepProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const v = VENDOR_INFO[c.state.vendor];
  const selected = c.state.account.plan;
  return (
    <FlowShell
      title="Check if you're on a paid plan"
      subhead={`Level 1 uses features that aren't available on the free plan — you'll need ${v.planName} to follow along.`}
      onBack={() => c.goTo("choosetool")}
      onContinue={() => c.goTo("appinstall")}
      continueDisabled={selected === null}
    >
      <div className="flex flex-col gap-4">
        <ConnectorListItem
          badge={<VendorBadge vendor={c.state.vendor} />}
          name={v.planName}
          desc="Opens your account dashboard so you can check."
          action={
            <ExternalActionButton
              label="Check plan →"
              href={v.planLink}
              tone="secondary"
              size="sm"
            />
          }
        />
        <OptionGrid>
          <OptionCard
            name="I've confirmed I'm on a paid plan"
            desc="Good to go."
            selected={selected === true}
            onClick={() => c.setAccount("plan", true)}
          />
          <OptionCard
            name="I don't have that yet"
            desc="Takes about a minute."
            selected={selected === false}
            onClick={() => setModalOpen(true)}
          />
        </OptionGrid>
      </div>
      <ConfirmSetupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        header="Let's get you upgraded"
        desc={`Check your plan or upgrade to ${v.planName}, then come back here.`}
        actionLabel="Check plan →"
        actionHref={v.planLink}
        confirmLabel="I'm on a paid plan — continue"
        onConfirm={() => {
          c.setAccount("plan", true);
          setModalOpen(false);
          c.goTo("appinstall");
        }}
        onCantDoIt={() => {
          c.setAccount("plan", false);
          setModalOpen(false);
        }}
      />
    </FlowShell>
  );
}

function AppInstallStep({ c }: StepProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const v = VENDOR_INFO[c.state.vendor];
  const selected = c.state.account.app;
  const isDesktop = Boolean(v.desktopScheme);
  return (
    <FlowShell
      title={isDesktop ? `Get ${v.appName} installed` : `Sign in to ${v.appName}`}
      subhead={`Sign in with your ${v.signIn}${isDesktop ? " once installed." : "."}`}
      onBack={() => c.goTo("plan")}
      onContinue={() => c.goTo("extension")}
      continueDisabled={selected === null}
    >
      <div className="flex flex-col gap-4">
        <ConnectorListItem
          badge={<VendorBadge vendor={c.state.vendor} />}
          name={v.appName}
          desc={isDesktop ? "Opens the download page for your OS." : "Opens the sign-in page."}
          action={
            <ExternalActionButton
              label={isDesktop ? "Download →" : "Sign in →"}
              href={v.appLink}
              tone="secondary"
              size="sm"
            />
          }
        />
        <OptionGrid>
          <OptionCard
            name={isDesktop ? "Yes, I've got it installed" : "Yes, I'm signed in"}
            desc="Ready to go."
            selected={selected === true}
            onClick={() => c.setAccount("app", true)}
          />
          <OptionCard
            name="No, not yet"
            desc="Takes about a minute."
            selected={selected === false}
            onClick={() => setModalOpen(true)}
          />
        </OptionGrid>
        {v.desktopScheme && selected === true ? (
          <div className="flex flex-col gap-2 rounded-xl bg-leland-gray-solid-hover px-4 py-4">
            <div className="leland-paragraph-sm font-semibold uppercase tracking-[1px] text-leland-gray-extra-light">
              Test it
            </div>
            <ExternalActionButton
              label="Verify with Claude →"
              href={v.desktopScheme + encodeURIComponent(v.testPrompt ?? "")}
              tone="primary"
            />
            <p className="leland-paragraph-sm text-leland-gray-light">
              This opens {v.appName} with a quick test message already typed in —
              you'll still need to hit send.
            </p>
          </div>
        ) : null}
      </div>
      <ConfirmSetupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        header={isDesktop ? "Let's get it installed" : "Let's get you signed in"}
        desc={
          isDesktop
            ? `Download ${v.appName}, then come back here.`
            : `Sign in to ${v.appName} with your ${v.signIn}, then come back here.`
        }
        actionLabel={isDesktop ? "Download →" : "Go sign in →"}
        actionHref={v.appLink}
        confirmLabel={isDesktop ? "I've installed it — continue" : "I'm signed in — continue"}
        onConfirm={() => {
          c.setAccount("app", true);
          setModalOpen(false);
        }}
        onCantDoIt={() => {
          c.setAccount("app", false);
          setModalOpen(false);
        }}
      />
    </FlowShell>
  );
}

function ExtensionStep({ c }: StepProps) {
  const v = VENDOR_INFO[c.state.vendor];
  const selected = c.state.account.ext;
  const isChromeExt = c.state.vendor === "claude";
  const browserOk = !isChromeExt || isChromiumBrowser();
  const extLabel = isChromeExt ? "Chrome extension" : v.browserExt;

  let callout: ReactNode = null;
  if (isChromeExt && !browserOk) {
    callout = (
      <FlowInfoCard icon="🧭">
        <strong>Needs a Chromium browser — </strong>Chrome, Edge, Brave, Opera, or
        Vivaldi.
      </FlowInfoCard>
    );
  } else if (!isChromeExt) {
    callout = (
      <FlowInfoCard tone="blue" icon="ℹ️">
        <strong>We can't verify this automatically. </strong>Pick whichever
        matches below — you can hand Claude a screenshot instead during the
        session.
      </FlowInfoCard>
    );
  }

  return (
    <FlowShell
      title={`Get ${extLabel} set up`}
      subhead={isChromeExt ? "Let Claude see and act on whatever's open in your browser." : undefined}
      onBack={() => c.goTo("appinstall")}
      onContinue={() => c.goTo("cohort")}
      continueDisabled={selected === null}
    >
      <div className="flex flex-col gap-4">
        {callout}
        <ConnectorListItem
          badge={<VendorBadge vendor={c.state.vendor} />}
          name={
            <span className="flex items-center gap-2">
              {v.browserExt}
              <span className="rounded bg-leland-gray-solid-hover px-1.5 py-0.5 leland-paragraph-sm font-medium text-leland-gray-light">
                Optional
              </span>
            </span>
          }
          desc={v.browserExtNote}
          action={
            <ExternalActionButton
              label="Install →"
              href={v.browserExtLink}
              tone="secondary"
              size="sm"
            />
          }
        />
        <OptionGrid>
          <OptionCard
            name="Yes, I've got it installed"
            desc="Ready to go."
            selected={selected === true}
            onClick={() => c.setAccount("ext", true)}
          />
          <OptionCard
            name="No, not yet"
            desc="We'll flag it so it follows you into the session."
            selected={selected === false}
            onClick={() => c.setAccount("ext", false)}
          />
        </OptionGrid>
      </div>
    </FlowShell>
  );
}

function CohortStep({ c }: StepProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const selected = c.state.account.cohort;
  return (
    <FlowShell
      title="Join your cohort"
      subhead="Community membership, separate from the Slack connector in the next step."
      onBack={() => c.goTo("extension")}
      onContinue={() => c.goTo("connectors-intro")}
      continueDisabled={selected === null}
    >
      <div className="flex flex-col gap-4">
        <ConnectorListItem
          badge={<ServiceBadge bg="#4A154B"><SlackMark /></ServiceBadge>}
          name="Join #l1-jul6-cohort in Slack"
          desc="Your cohort, TAs, and announcements live here."
          action={
            <ExternalActionButton
              label="Join →"
              href={COHORT_SLACK_INVITE}
              tone="secondary"
              size="sm"
            />
          }
        />
        <OptionGrid>
          <OptionCard
            name="Yes, I've joined"
            desc="Good to go."
            selected={selected === true}
            onClick={() => c.setAccount("cohort", true)}
          />
          <OptionCard
            name="Not yet"
            desc="Takes about a minute."
            selected={selected === false}
            onClick={() => setModalOpen(true)}
          />
        </OptionGrid>
      </div>
      <ConfirmSetupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        header="Let's get you in the cohort"
        desc="Join the Slack workspace, then come back here."
        actionLabel="Join →"
        actionHref={COHORT_SLACK_INVITE}
        confirmLabel="I've joined — continue"
        onConfirm={() => {
          c.setAccount("cohort", true);
          setModalOpen(false);
          c.goTo("connectors-intro");
        }}
        onCantDoIt={() => {
          c.setAccount("cohort", false);
          setModalOpen(false);
        }}
      />
    </FlowShell>
  );
}

function ConnectorsIntroStep({ c }: StepProps) {
  const v = VENDOR_INFO[c.state.vendor];
  return (
    <FlowShell
      eyebrow="Almost there"
      title="Last step — connect your tools"
      subhead="You've downloaded everything you need. Now let's make sure it's all actually connected, not just installed."
      onBack={() => c.goTo("cohort")}
      onContinue={() => c.goTo("connectors")}
    >
      <FlowInfoCard
        tone="blue"
        icon={
          <span className="flex items-center gap-1.5">
            <ServiceBadge bg="#4A154B"><SlackMark /></ServiceBadge>
            <ServiceBadge><EmailMark /></ServiceBadge>
            <ServiceBadge><CalendarMark /></ServiceBadge>
          </span>
        }
      >
        Slack, email, and calendar — this is the part that makes {v.short} actually
        useful day to day.
      </FlowInfoCard>
    </FlowShell>
  );
}

// ── Connectors (one step, two views) ─────────────────────────────────────────

function ConnectHowTo({
  v,
  onVerify,
}: {
  v: VendorInfo;
  onVerify: () => void;
}) {
  const [wallOpen, setWallOpen] = useState(false);
  const ai = v.short || "your AI";
  const checkPrompt = `Check which connectors I have set up in ${v.name} — Slack, email, and calendar. Walk me through connecting any that aren't, step by step.`;

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-leland-gray-solid-hover px-5 py-5">
      <div className="leland-paragraph-sm font-semibold uppercase tracking-[1px] text-leland-gray-extra-light">
        Let {ai} do it for you
      </div>
      {v.desktopScheme ? (
        <>
          <p className="leland-paragraph-base text-leland-gray-light">
            Skip the menu-digging — click below and {ai} will check all three at
            once, then walk you through anything that isn't connected.
          </p>
          <ExternalActionButton
            label="Test the connection →"
            href={v.desktopScheme + encodeURIComponent(checkPrompt)}
            tone="primary"
            size="sm"
            onClick={onVerify}
          />
        </>
      ) : (
        <>
          <p className="leland-paragraph-base text-leland-gray-light">
            Skip the menu-digging — paste this into {ai} and it'll check all three
            at once, then walk you through anything that isn't connected.
          </p>
          <CopyPromptButton prompt={checkPrompt} onCopy={onVerify} />
        </>
      )}

      <button
        type="button"
        onClick={() => setWallOpen((o) => !o)}
        className="self-start leland-paragraph-sm font-semibold text-leland-gray-dark underline decoration-dotted underline-offset-4 hover:text-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
      >
        {wallOpen ? "Hide permission-wall options" : "Hit a permission wall? →"}
      </button>

      {wallOpen ? (
        <div className="flex flex-col gap-4 border-t border-leland-gray-stroke pt-4">
          <div className="flex flex-col gap-2">
            <div className="leland-paragraph-sm font-semibold uppercase tracking-[1px] text-leland-gray-extra-light">
              Ask {ai} to check
            </div>
            <CopyPromptButton
              prompt={`Which connectors do I have access to in ${v.name}, and which are blocked by my organization?`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="leland-paragraph-sm font-semibold uppercase tracking-[1px] text-leland-gray-extra-light">
              Or have it draft the ask for you
            </div>
            <CopyPromptButton
              prompt={`Draft a short email to my IT team asking them to review and approve connector access for ${v.name} in the AI Builder program.`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

const CONNECTOR_STATES = [
  { value: "ok", glyph: "✓", label: "Connected" },
  { value: "flag", glyph: "⚑", label: "Not sure — flag for later" },
  { value: "bad", glyph: "✕", label: "Not connected" },
] as const;

function ConnectorStateRow({
  connectorKey,
  name,
  status,
  onSet,
}: {
  connectorKey: ConnectorKey;
  name: string;
  status: "ok" | "flag" | "bad";
  onSet: (value: "ok" | "flag" | "bad") => void;
}) {
  const icon = CONNECTOR_ICON[connectorKey];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-leland-gray-stroke bg-white px-4 py-3">
      <ServiceBadge bg={icon.bg}>{icon.mark}</ServiceBadge>
      <div className="min-w-0 flex-1 leland-paragraph-base font-semibold text-leland-gray-dark">
        {name}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {CONNECTOR_STATES.map((s) => {
          const active = status === s.value;
          const activeClass =
            s.value === "ok"
              ? "border-leland-success bg-leland-success-extra-light text-leland-success"
              : s.value === "flag"
                ? "border-leland-primary bg-leland-primary-extra-light text-leland-gray-dark"
                : "border-leland-red bg-leland-red-light text-leland-red";
          return (
            <button
              key={s.value}
              type="button"
              aria-label={s.label}
              aria-pressed={active}
              onClick={() => onSet(s.value)}
              className={`flex size-8 items-center justify-center rounded-full border text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
                active
                  ? activeClass
                  : "border-leland-gray-stroke bg-white text-leland-gray-extra-light hover:bg-leland-gray-hover"
              }`}
            >
              {s.glyph}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConnectorsStep({ c }: StepProps) {
  const v = VENDOR_INFO[c.state.vendor];

  if (!c.state.connectorsConfirming) {
    return (
      <FlowShell
        title="Connect your tools"
        subhead="You'll need these live during class, connecting now means no surprise permission walls when it counts."
        onBack={() => c.goTo("connectors-intro")}
        onContinue={() => c.startVerify()}
        continueDisabled={!c.state.connectorsVerifyStarted}
      >
        <ConnectHowTo v={v} onVerify={c.startVerify} />
      </FlowShell>
    );
  }

  return (
    <FlowShell
      title="Connect your tools"
      subhead="Here's what came back. Mark anything that's off — you can still sort it out live in class."
      onBack={() => c.setConfirming(false)}
      onContinue={() => c.goTo("checking")}
    >
      <div className="flex flex-col gap-2">
        {connectorDefs(v).map((def) => (
          <ConnectorStateRow
            key={def.key}
            connectorKey={def.key}
            name={def.name}
            status={c.state.connectors[def.key]}
            onSet={(value) => c.setConnector(def.key, value)}
          />
        ))}
      </div>
    </FlowShell>
  );
}

// ── Finish (checking → receipt) ──────────────────────────────────────────────

const CHECK_ITEMS = [
  "Account & plan",
  "Desktop app, browser & Slack workspace",
  "Slack connector",
  "Email connector",
];

function CheckingStep({ c }: StepProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [doneCount, setDoneCount] = useState(0);
  const { goTo } = c;

  useEffect(() => {
    const timers: number[] = [];
    CHECK_ITEMS.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setActiveIndex(i);
          timers.push(
            window.setTimeout(() => {
              setActiveIndex(-1);
              setDoneCount(i + 1);
              if (i === CHECK_ITEMS.length - 1) {
                timers.push(window.setTimeout(() => goTo("clear"), 500));
              }
            }, 700),
          );
        }, i * 750),
      );
    });
    return () => timers.forEach((t) => clearTimeout(t));
    // Run the reveal sequence once on mount; goTo is stable enough for a
    // fire-once animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlowShell
      title="Running your system check"
      subhead="Hang tight, we're pulling your setup together so it's ready when you are."
    >
      <div className="flex flex-col gap-2">
        {CHECK_ITEMS.map((label, i) => {
          const done = i < doneCount;
          const active = i === activeIndex;
          return (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                active
                  ? "border-leland-primary bg-leland-primary-extra-light"
                  : "border-leland-gray-stroke bg-white"
              }`}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full text-sm transition-colors ${
                  done
                    ? "bg-leland-primary text-leland-on-primary-text"
                    : "border border-leland-gray-stroke text-transparent"
                }`}
              >
                {done ? <IconCheck className="size-3.5" /> : null}
              </span>
              <span className="leland-paragraph-base text-leland-gray-dark">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </FlowShell>
  );
}

function ClearStep({ c, onComplete }: StepProps & { onComplete?: () => void }) {
  const v = VENDOR_INFO[c.state.vendor];
  const defs = connectorDefs(v);
  const rows: { label: string; state: "ok" | "flag" | "bad" }[] = [
    { label: "Paid plan confirmed", state: c.state.account.plan === false ? "bad" : "ok" },
    {
      label: v.appName + (v.desktopScheme ? " installed" : " signed in"),
      state: c.state.account.app === false ? "bad" : "ok",
    },
    { label: "Cohort Slack workspace", state: c.state.account.cohort === false ? "bad" : "ok" },
    { label: v.browserExt, state: c.state.account.ext === false ? "bad" : "ok" },
    ...defs.map((d) => ({ label: d.name, state: c.state.connectors[d.key] })),
  ];
  const total = rows.length;
  const doneCount = rows.filter((r) => r.state === "ok").length;
  const allDone = doneCount === total;

  useEffect(() => {
    onComplete?.();
    // Mark the section complete once the receipt renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlowShell
      centered
      title={allDone ? "You're all set" : "You're on your way"}
      subhead={
        allDone
          ? "Every tool you need is ready. Nothing left to configure before you start."
          : `You've got ${doneCount} of ${total} things set up. What's left will follow you into the session so it doesn't get lost.`
      }
      footer={
        <div className="flex justify-center pt-2">
          <Button
            label="Restart preview →"
            buttonColor={ButtonColor.PRIMARY}
            size={ButtonSize.LARGE}
            onClick={() => c.reset()}
          />
        </div>
      }
    >
      <div
        className={`flex size-[92px] items-center justify-center rounded-full ${
          allDone
            ? "bg-leland-primary text-leland-on-primary-text"
            : "bg-leland-gray-solid-hover text-leland-gray-dark"
        }`}
      >
        {allDone ? (
          <IconCheck className="size-10" />
        ) : (
          <span className="leland-heading-2xl font-semibold">
            {doneCount}/{total}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col gap-2 text-left">
        {rows.map((r) => {
          if (r.state === "ok") {
            return (
              <div
                key={r.label}
                className="flex items-center gap-2 leland-paragraph-base text-leland-gray-dark"
              >
                <IconCheck className="size-4 shrink-0 text-leland-success" />
                {r.label}
              </div>
            );
          }
          const bad = r.state === "bad";
          return (
            <div
              key={r.label}
              className="flex items-center gap-2 leland-paragraph-base text-leland-gray-light"
            >
              <span className={bad ? "text-leland-red" : "text-leland-gray-dark"}>
                {bad ? "✕" : "⚑"}
              </span>
              {r.label}
              {bad ? " — still need this" : " — flagged for later"}
            </div>
          );
        })}
      </div>
    </FlowShell>
  );
}

// ── Step registry ────────────────────────────────────────────────────────────

export function renderItSetupStep(
  c: ItSetupController,
  onComplete?: () => void,
): ReactNode {
  switch (c.state.step) {
    case "welcome":
      return <WelcomeStep c={c} />;
    case "context":
      return <ContextStep c={c} />;
    case "choosetool":
      return <ChooseToolStep c={c} />;
    case "plan":
      return <PlanStep c={c} />;
    case "appinstall":
      return <AppInstallStep c={c} />;
    case "extension":
      return <ExtensionStep c={c} />;
    case "cohort":
      return <CohortStep c={c} />;
    case "connectors-intro":
      return <ConnectorsIntroStep c={c} />;
    case "connectors":
      return <ConnectorsStep c={c} />;
    case "checking":
      return <CheckingStep c={c} />;
    case "clear":
      return <ClearStep c={c} onComplete={onComplete} />;
    default:
      // Safety net for a stale persisted step (e.g. the removed "confirm").
      return <WelcomeStep c={c} />;
  }
}
