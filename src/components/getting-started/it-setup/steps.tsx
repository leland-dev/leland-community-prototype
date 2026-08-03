import { useEffect, useState, type ReactNode } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  IconCalendar,
  IconCheck,
  IconEmail,
  IconFlag,
} from "../../leland";
import {
  CopyPromptButton,
  ExternalActionButton,
  FlowInfoCard,
  FlowShell,
  OptionCard,
  OptionGrid,
  ServiceBadge,
  SlackMark,
  VendorBadge,
} from "../flow-kit";
import { ConfirmSetupModal } from "./ConfirmSetupModal";
import {
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
    <div className="flex flex-col gap-3 rounded-xl border border-leland-gray-stroke bg-white px-4 py-3.5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {badge}
        <div className="min-w-0 flex-1">
          <div className="leland-paragraph-base font-semibold text-leland-gray-dark">
            {name}
          </div>
          <div className="leland-paragraph-sm text-leland-gray-light">{desc}</div>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

const CONNECTOR_ICON: Record<ConnectorKey, { mark: ReactNode; bg?: string }> = {
  slack: { mark: <SlackMark /> },
  email: { mark: <IconEmail className="size-5 text-leland-gray-dark" /> },
  calendar: { mark: <IconCalendar className="size-5 text-leland-gray-dark" /> },
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
      subhead="Six quick steps, about 3 minutes. We'll confirm your account, connect the tools Level 1 needs, and make sure nothing blocks you once you're live."
      onContinue={() => c.goTo("choosetool")}
      continueLabel="Get started"
    />
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
      onBack={() => c.goTo("welcome")}
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

// ── Account steps (plan / app / extension) ───────────────────────────────────

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
          <a
            href={v.desktopScheme + encodeURIComponent(v.testPrompt ?? "")}
            className="self-start leland-paragraph-base font-medium text-leland-gray-extra-light underline decoration-dotted underline-offset-4 hover:text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary rounded"
          >
            Verify {v.short} opens and you're signed in →
          </a>
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
  }

  return (
    <FlowShell
      title={`Get ${extLabel} set up`}
      subhead={`Let ${v.short} see and act on whatever's open in your browser.`}
      onBack={() => c.goTo("appinstall")}
      onContinue={() => c.goTo("connectors-intro")}
      continueDisabled={selected === null}
    >
      <div className="flex flex-col gap-4">
        {callout}
        <ConnectorListItem
          badge={<VendorBadge vendor={c.state.vendor} />}
          name={
            <span className="flex items-center gap-2">
              {v.browserExt}
              <span className="rounded bg-leland-gray-hover px-1.5 py-0.5 leland-paragraph-sm font-medium text-leland-gray-light">
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

function ConnectorsIntroStep({ c }: StepProps) {
  const v = VENDOR_INFO[c.state.vendor];
  return (
    <FlowShell
      eyebrow="Almost there"
      title="Last step — connect your tools"
      subhead="You've downloaded everything you need. Now let's make sure it's all actually connected, not just installed."
      onBack={() => c.goTo("extension")}
      onContinue={() => c.goTo("connectors")}
    >
      <FlowInfoCard
        tone="blue"
        className="flex-col text-leland-gray-dark sm:flex-row sm:items-center"
        icon={
          <span className="flex items-center gap-1.5">
            <ServiceBadge><SlackMark /></ServiceBadge>
            <ServiceBadge><IconEmail className="size-5 text-leland-gray-dark" /></ServiceBadge>
            <ServiceBadge><IconCalendar className="size-5 text-leland-gray-dark" /></ServiceBadge>
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-xl bg-leland-gray-hover px-5 py-5">
        {v.desktopScheme ? (
          <>
            <p className="leland-paragraph-base text-leland-gray-light">
              Skip the menu-digging — click below and {ai} will check all three at
              once, then walk you through anything that isn't connected.
            </p>
            <ExternalActionButton
              label={`Let ${ai} do it for you →`}
              href={v.desktopScheme + encodeURIComponent(checkPrompt)}
              tone="black"
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
      </div>

      <button
        type="button"
        onClick={() => setWallOpen((o) => !o)}
        className="self-start leland-paragraph-sm font-medium text-leland-gray-light underline decoration-dotted underline-offset-4 hover:text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
      >
        {wallOpen ? "Hide permission-wall options" : "Hit a permission wall?"}
      </button>

      {wallOpen ? (
        <div className="flex flex-col gap-4">
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

function ConnectorCheckRow({
  connectorKey,
  name,
  connected,
  onToggle,
}: {
  connectorKey: ConnectorKey;
  name: string;
  connected: boolean;
  onToggle: () => void;
}) {
  const icon = CONNECTOR_ICON[connectorKey];
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={connected}
      aria-label={`${name} — ${connected ? "connected" : "not connected"}`}
      className="flex w-full items-center gap-3 rounded-xl border border-leland-gray-stroke bg-white px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
    >
      <ServiceBadge>{icon.mark}</ServiceBadge>
      <span className="min-w-0 flex-1 leland-paragraph-base font-semibold text-leland-gray-dark">
        {name}
      </span>
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
          connected
            ? "border-leland-success bg-leland-success text-white"
            : "border-leland-gray-stroke text-transparent"
        }`}
      >
        <IconCheck className="size-3.5" />
      </span>
    </button>
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
      subhead="Check off your tools as you connect them."
      onBack={() => c.setConfirming(false)}
      onContinue={() => c.goTo("checking")}
    >
      <div className="flex flex-col gap-2">
        {connectorDefs(v).map((def) => (
          <ConnectorCheckRow
            key={def.key}
            connectorKey={def.key}
            name={def.name}
            connected={c.state.connectors[def.key] === "ok"}
            onToggle={() =>
              c.setConnector(
                def.key,
                c.state.connectors[def.key] === "ok" ? "skip" : "ok",
              )
            }
          />
        ))}
      </div>
    </FlowShell>
  );
}

// ── Finish (checking → receipt) ──────────────────────────────────────────────

function CheckingStep({
  c,
  onComplete,
  onContinue,
}: StepProps & { onComplete?: () => void; onContinue?: () => void }) {
  const v = VENDOR_INFO[c.state.vendor];
  const defs = connectorDefs(v);
  const rows: { label: string; done: boolean }[] = [
    { label: "Paid plan confirmed", done: c.state.account.plan !== false },
    {
      label: v.appName + (v.desktopScheme ? " installed" : " signed in"),
      done: c.state.account.app !== false,
    },
    { label: v.browserExt, done: c.state.account.ext !== false },
    ...defs.map((d) => ({
      label: d.name,
      done: c.state.connectors[d.key] === "ok",
    })),
  ];

  useEffect(() => {
    onComplete?.();
    // Mark the section complete once the summary renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlowShell
      title="Here's everything you've set up"
      subhead="Anything still open will follow you into the session so it doesn't get lost."
      footer={
        <div className="flex pt-2">
          <Button
            label="Continue"
            buttonColor={ButtonColor.PRIMARY}
            size={ButtonSize.LARGE}
            width={ButtonWidth.AUTO}
            onClick={() => onContinue?.()}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-3 rounded-xl border border-leland-gray-stroke bg-white px-4 py-3"
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                r.done
                  ? "bg-leland-success text-white"
                  : "bg-leland-gray-stroke text-leland-gray-dark"
              }`}
            >
              {r.done ? (
                <IconCheck className="size-3.5" />
              ) : (
                <IconFlag className="size-3" />
              )}
            </span>
            <span className="leland-paragraph-base text-leland-gray-dark">
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </FlowShell>
  );
}

// ── Step registry ────────────────────────────────────────────────────────────

export function renderItSetupStep(
  c: ItSetupController,
  onComplete?: () => void,
  onContinue?: () => void,
): ReactNode {
  switch (c.state.step) {
    case "welcome":
      return <WelcomeStep c={c} />;
    case "choosetool":
      return <ChooseToolStep c={c} />;
    case "plan":
      return <PlanStep c={c} />;
    case "appinstall":
      return <AppInstallStep c={c} />;
    case "extension":
      return <ExtensionStep c={c} />;
    case "connectors-intro":
      return <ConnectorsIntroStep c={c} />;
    case "connectors":
      return <ConnectorsStep c={c} />;
    case "checking":
      return (
        <CheckingStep c={c} onComplete={onComplete} onContinue={onContinue} />
      );
    default:
      // Safety net for a stale persisted step (e.g. the removed "confirm").
      return <WelcomeStep c={c} />;
  }
}
