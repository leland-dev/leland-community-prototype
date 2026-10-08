import { useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import B2BOverviewV2 from "./b2b/B2BOverviewV2";
import B2BSettings from "./b2b/B2BSettings";
import { B2BModalDispatcher } from "./b2b/B2BModals";
import type { ModalId } from "./b2b/B2BData";
import "../styles/b2b.css";
import { Button } from "../components/Button";
import { TeamLogo } from "../components/TeamLogo";
import { useTeam } from "../contexts/TeamContext";

// Team + Enterprise share this dashboard. Team is the lightweight version
// (a card on file + seat access); Enterprise layers on SSO, usage reporting and
// invoicing. The `plan` on the team record decides which cards render.
const ACCESS_OPTIONS = [
  "All programs",
  "AI Builder Program",
  "MBA Admissions Essentials",
  "Consulting Case Interview Prep",
  "1:1 coaching — hourly",
  "Leland+",
];

const cardCls =
  "overflow-hidden rounded-[12px] border border-[#222222]/[0.12] bg-white shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]";
const inputCls =
  "w-full rounded-lg border border-gray-stroke bg-white px-3 py-2.5 text-[14px] text-gray-dark outline-none focus:border-gray-dark";

function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className={cardCls}>
      <div className="flex items-center justify-between gap-3 border-b border-gray-stroke px-5 py-4">
        <h2 className="text-[16px] font-semibold text-gray-dark">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-gray-light">{label}</span>
      {children}
    </label>
  );
}

function readFile(file: File, cb: (url: string) => void) {
  const reader = new FileReader();
  reader.onload = () => typeof reader.result === "string" && cb(reader.result);
  reader.readAsDataURL(file);
}

// ── Empty state: no team yet ──
export function CreateTeam() {
  const { createTeam } = useTeam();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<string>();

  return (
    <div className="mx-auto max-w-[520px] pt-6">
      <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">Add your team</h1>
      <p className="mt-3 text-[15px] leading-[1.5] text-gray-light">
        Put your organization on one account. Add a card, then give teammates access to specific courses and coaching.
      </p>
      <form
        className={`${cardCls} mt-6 flex flex-col gap-4 p-5`}
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) createTeam(name.trim(), logo);
        }}
      >
        <Field label="Team or organization name">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Stanford GSB Consulting Club" />
        </Field>
        <Field label="Logo (optional)">
          <div className="flex items-center gap-3">
            <TeamLogo name={name || "Team"} logo={logo} size={40} />
            <input
              type="file"
              accept="image/*"
              className="text-[13px] text-gray-light"
              onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0], setLogo)}
            />
          </div>
        </Field>
        <Button type="submit" size="md" variant="primary" disabled={!name.trim()}>
          Create team
        </Button>
      </form>
    </div>
  );
}

// ── Billing ──
function Billing() {
  const { team, updateTeam } = useTeam();
  const [adding, setAdding] = useState(false);
  const [number, setNumber] = useState("");
  if (!team) return null;

  return (
    <Card
      title="Payment method"
      action={
        team.card && !adding ? (
          <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
            Replace
          </Button>
        ) : undefined
      }
    >
      {team.card && !adding ? (
        <p className="text-[14px] font-medium text-gray-dark">
          {team.card.brand} •••• {team.card.last4}
        </p>
      ) : adding || !team.card ? (
        <div className="flex flex-col gap-3">
          {!adding && (
            <p className="text-[14px] text-gray-light">Add a card to cover seats and sessions for your team.</p>
          )}
          {adding ? (
            <>
              <Field label="Card number">
                <input
                  className={inputCls}
                  inputMode="numeric"
                  value={number}
                  onChange={(e) => setNumber(e.target.value.replace(/[^\d ]/g, ""))}
                  placeholder="4242 4242 4242 4242"
                />
              </Field>
              <div className="flex gap-2">
                <Button
                  size="md"
                  variant="primary"
                  disabled={number.replace(/\s/g, "").length < 12}
                  onClick={() => {
                    updateTeam({ card: { brand: "Visa", last4: number.replace(/\s/g, "").slice(-4) } });
                    setAdding(false);
                    setNumber("");
                  }}
                >
                  Save card
                </Button>
                <Button size="md" variant="secondary" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div>
              <Button size="md" variant="primary" onClick={() => setAdding(true)}>
                Add credit card
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );
}

function SecurityCard() {
  const [sso, setSso] = useState(false);
  return (
    <Card title="Single sign-on & invoicing">
      <div className="flex flex-col gap-3 text-[14px] text-gray-dark">
        <div className="flex items-center justify-between gap-3">
          <span>SAML single sign-on</span>
          <Button size="sm" variant={sso ? "dark" : "secondary"} onClick={() => setSso((v) => !v)}>
            {sso ? "Enabled" : "Set up"}
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Invoiced billing (net 30)</span>
          <Button size="sm" variant="secondary">
            Contact sales
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ── Pages rendered inside TeamLayout ──
function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">{children}</h1>;
}

// Overview is the partner dashboard's overview, embedded as-is (minus the org name
// under the title and the Admin Settings button — the team menu links to Admins).
// Its modals are wired up here.
export function TeamOverview() {
  const { team } = useTeam();
  const [openModal, setOpenModal] = useState<ModalId>(null);
  const [partnerModel, setPartnerModel] = useState<"per-seat" | "a-la-carte">("per-seat");
  if (!team) return null;
  return (
    <>
      <B2BOverviewV2
        hideOrgName
        hideAdminSettings
        onNavigate={() => {}}
        onSetUtilFilter={() => {}}
        onOpenModal={setOpenModal}
        partnerModel={partnerModel}
        onSetPartnerModel={setPartnerModel}
      />
      <B2BModalDispatcher
        openModal={openModal}
        onClose={() => setOpenModal(null)}
        emailRecipients={[]}
        emailFilterLabel="All users"
        showVerizon={partnerModel === "per-seat"}
        isAlaCarte={partnerModel === "a-la-carte"}
      />
    </>
  );
}

// Placeholders for pages we'll build later.
function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="flex flex-col gap-5">
      <PageTitle>{title}</PageTitle>
      <Card title="Coming soon">
        <p className="text-[14px] text-gray-light">{blurb}</p>
      </Card>
    </div>
  );
}
export const TeamReportsPage = () => <ComingSoon title="Reports" blurb="Usage and engagement reports for your team." />;
export const TeamAdsPage = () => <ComingSoon title="Paid ads" blurb="Promote your team's programs and events with paid ads." />;
export const TeamRecruitingPage = () => <ComingSoon title="Recruiting" blurb="Find and recruit candidates through Leland for your team." />;

// Admins is the partner dashboard's Admin Settings page, embedded as-is (without its
// "Overview" link — the team menu already links there).
export function TeamAdmins() {
  const { team } = useTeam();
  if (!team) return null;
  if (team.viewerRole !== "Admin") return <Navigate to="/team" replace />;
  return <B2BSettings hideDashboardLink />;
}

// Billing — card on file, plus SSO/invoicing for Enterprise.
export function TeamBilling() {
  const { team } = useTeam();
  if (!team) return null;
  if (team.viewerRole !== "Admin") return <Navigate to="/team" replace />;
  return (
    <div className="flex flex-col gap-5">
      <PageTitle>Billing</PageTitle>
      <Billing />
      {team.plan === "enterprise" && <SecurityCard />}
    </div>
  );
}
