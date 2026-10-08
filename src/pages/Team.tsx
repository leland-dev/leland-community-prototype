import { useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
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

// ── Overview: everyone added to the organization and what they can access ──
function UsersTable({ isAdmin }: { isAdmin: boolean }) {
  const { team, addMember, updateMember, removeMember } = useTeam();
  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState(ACCESS_OPTIONS[0]);
  const [editing, setEditing] = useState<string | null>(null);
  if (!team) return null;

  const invite = () => {
    const value = email.trim();
    if (!value) return;
    addMember({ name: value.split("@")[0], email: value, role: "Member", access: [access] });
    setEmail("");
    setAdding(false);
  };
  const toggleAccess = (id: string, current: string[], item: string) =>
    updateMember(id, { access: current.includes(item) ? current.filter((a) => a !== item) : [...current, item] });

  return (
    <Card
      title={`Users (${team.members.length})`}
      action={
        isAdmin ? (
          <Button size="sm" variant="primary" onClick={() => setAdding((v) => !v)}>
            Add user
          </Button>
        ) : undefined
      }
    >
      {adding && (
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Email">
              <input
                className={inputCls}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && invite()}
                placeholder="teammate@company.com"
              />
            </Field>
          </div>
          <div className="sm:w-[220px]">
            <Field label="Grant access to">
              <select className={inputCls} value={access} onChange={(e) => setAccess(e.target.value)}>
                {ACCESS_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          </div>
          <Button size="md" variant="primary" onClick={invite} disabled={!email.trim()}>
            Invite
          </Button>
        </div>
      )}

      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-gray-stroke text-[12px] font-medium text-gray-light">
              <th className="pb-2 pr-4 font-medium">User</th>
              <th className="pb-2 pr-4 font-medium">Access</th>
              {isAdmin && <th className="pb-2 text-right font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-stroke">
            {team.members.map((m) => {
              const isEditing = editing === m.id;
              const locked = m.role === "Admin";
              return (
                <tr key={m.id} className="align-top">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-dark">{m.name}</p>
                    <p className="text-[13px] text-gray-light">{m.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1.5">
                      {ACCESS_OPTIONS.filter((o) => isEditing || m.access.includes(o)).map((o) => {
                        const on = m.access.includes(o);
                        return (
                          <button
                            key={o}
                            type="button"
                            disabled={!isEditing}
                            onClick={() => toggleAccess(m.id, m.access, o)}
                            className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors disabled:cursor-default ${
                              on ? "bg-[#222222] text-white" : "bg-[#222222]/5 text-gray-light hover:bg-[#222222]/10"
                            }`}
                          >
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="py-3 text-right">
                      {locked ? (
                        <span className="text-[12px] text-gray-light">Admin</span>
                      ) : (
                        <div className="inline-flex gap-1.5">
                          <Button size="tag" variant="secondary" onClick={() => setEditing(isEditing ? null : m.id)}>
                            {isEditing ? "Done" : "Edit access"}
                          </Button>
                          <Button size="tag" variant="secondary" onClick={() => removeMember(m.id)}>
                            Remove
                          </Button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

function Admins() {
  const { team, addMember, updateMember } = useTeam();
  const [email, setEmail] = useState("");
  if (!team) return null;
  const admins = team.members.filter((m) => m.role === "Admin");
  const others = team.members.filter((m) => m.role !== "Admin");

  const row = (m: (typeof team.members)[number], action: ReactNode) => (
    <li key={m.id} className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium text-gray-dark">{m.name}</p>
        <p className="truncate text-[13px] text-gray-light">{m.email}</p>
      </div>
      {action}
    </li>
  );

  return (
    <Card title={`Admins (${admins.length})`}>
      <p className="mb-3 text-[13px] text-gray-light">Admins can add and remove people, grant access, and manage billing.</p>
      <ul className="divide-y divide-gray-stroke border-t border-gray-stroke">
        {admins.map((m) =>
          row(
            m,
            m.id === "me" ? (
              <span className="text-[12px] text-gray-light">You</span>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => updateMember(m.id, { role: "Member" })}>
                Remove admin
              </Button>
            )
          )
        )}
      </ul>

      {others.length > 0 && (
        <>
          <p className="mb-1 mt-5 text-[12px] font-medium text-gray-light">Make an existing member an admin</p>
          <ul className="divide-y divide-gray-stroke border-t border-gray-stroke">
            {others.map((m) =>
              row(
                m,
                <Button size="sm" variant="secondary" onClick={() => updateMember(m.id, { role: "Admin" })}>
                  Make admin
                </Button>
              )
            )}
          </ul>
        </>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="Invite a new admin">
            <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" />
          </Field>
        </div>
        <Button
          size="md"
          variant="primary"
          disabled={!email.trim()}
          onClick={() => {
            addMember({ name: email.trim().split("@")[0], email: email.trim(), role: "Admin", access: ["All programs"] });
            setEmail("");
          }}
        >
          Invite admin
        </Button>
      </div>
    </Card>
  );
}

// ── Pages rendered inside TeamLayout ──
function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">{children}</h1>;
}

export function TeamOverview() {
  const { team } = useTeam();
  if (!team) return null;
  const isAdmin = team.viewerRole === "Admin";
  const stats = [
    { label: "Users", value: String(team.members.length) },
    { label: "Admins", value: String(team.members.filter((m) => m.role === "Admin").length) },
    { label: "Plan", value: team.plan === "enterprise" ? "Enterprise" : "Team" },
    ...(isAdmin ? [{ label: "Payment method", value: team.card ? `${team.card.brand} •••• ${team.card.last4}` : "Not added" }] : []),
  ];
  return (
    <div className="flex flex-col gap-5">
      <PageTitle>Overview</PageTitle>
      <section className={`${cardCls} grid grid-cols-2 gap-5 p-5 ${isAdmin ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        {stats.map((st) => (
          <div key={st.label}>
            <p className="text-[12px] text-gray-light">{st.label}</p>
            <p className="mt-1 text-[18px] font-semibold text-gray-dark">{st.value}</p>
          </div>
        ))}
      </section>
      <UsersTable isAdmin={isAdmin} />
    </div>
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

export function TeamAdmins() {
  const { team } = useTeam();
  if (!team) return null;
  if (team.viewerRole !== "Admin") return <Navigate to="/team" replace />;
  return (
    <div className="flex flex-col gap-5">
      <PageTitle>Admins</PageTitle>
      <Admins />
    </div>
  );
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
