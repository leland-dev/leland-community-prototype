import { useState, useEffect, type ReactNode } from "react";
import type { ModalId } from "./B2BData";
import { users } from "./B2BData";

// ── Modal wrapper ──

function B2BModal({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  footer: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1010] flex items-end justify-center bg-black/40 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative max-w-[95vw] overflow-hidden rounded-[14px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${wide ? "w-[540px]" : "w-[480px]"}`}
      >
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2"
        >
          <div className="flex items-center justify-center rounded-full border border-gray-stroke bg-white p-[10px] text-gray-dark hover:bg-gray-hover">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </div>
        </button>
        <div className="border-b border-gray-stroke px-6 pb-4 pt-5">
          <h3 className="text-[16px] font-medium text-gray-dark">{title}</h3>
          {subtitle && <p className="mt-[2px] text-[12px] text-gray-light">{subtitle}</p>}
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="flex justify-end gap-[10px] border-t border-gray-stroke bg-gray-hover px-6 py-[14px]">
          {footer}
        </div>
      </div>
    </div>
  );
}

// Form helpers
function FormGroup({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-[5px] block text-[12px] font-semibold text-gray-dark">{label}</label>
      {children}
      {hint && <div className="mt-1 text-[11px] text-gray-xlight">{hint}</div>}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-gray-stroke bg-white px-3 py-2 text-[13px] text-gray-dark outline-none focus:border-primary";
const selectCls = inputCls;

function Btn({ variant, children, onClick, className }: { variant: "primary" | "secondary"; children: ReactNode; onClick?: () => void; className?: string }) {
  const base = "inline-flex items-center gap-[6px] rounded-lg px-6 py-4 text-[16px] font-medium leading-[1.2] transition-all";
  const cls =
    variant === "primary"
      ? `${base} bg-[#038561] text-white`
      : `${base} bg-[#f5f5f5] text-gray-dark hover:bg-[#ebebeb]`;
  return (
    <button className={`${cls} ${className ?? ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ── Offering conditional fields ──

function OfferingFields({ offering }: { offering: string }) {
  if (offering === "session") {
    return (
      <>
        <FormGroup label="Category">
          <select className={selectCls} defaultValue="">
            <option value="">&mdash; Select category &mdash;</option>
            <option>Investment Banking</option>
            <option>Private Equity</option>
            <option>Consulting</option>
            <option>Growth Equity</option>
            <option>Venture Capital</option>
            <option>Sales &amp; Trading</option>
            <option>Other Finance</option>
          </select>
        </FormGroup>
        <FormGroup label="Number of Sessions">
          <select className={selectCls} defaultValue="1">
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </FormGroup>
      </>
    );
  }
  if (offering === "live-course") {
    return (
      <FormGroup label="Course">
        <select className={selectCls} defaultValue="">
          <option value="">&mdash; Select course &mdash;</option>
          <option>AI Mastery</option>
          <option>Consulting Recruiting</option>
          <option>IB Recruiting</option>
        </select>
      </FormGroup>
    );
  }
  return null;
}

// ── InviteModal ──

const chevronDown = (
  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </div>
);

const selectCls2 = "h-[48px] w-full appearance-none rounded-[8px] border border-gray-stroke bg-white px-4 pr-10 text-[16px] outline-none focus:border-primary";

const COHORTS = ["Spring '26 IB Recruiting", "PE Recruiting Bootcamp", "AI for Finance"];

function AlaCArteOfferings({ sessions, setSessions, lelandPlus, setLelandPlus }: {
  sessions: number; setSessions: (n: number) => void;
  lelandPlus: boolean; setLelandPlus: (b: boolean) => void;
}) {
  const [cohortInvited, setCohortInvited] = useState<Record<string, boolean>>({});

  return (
    <div className="mb-5 mt-8 flex flex-col divide-y divide-gray-stroke rounded-[10px] border border-gray-stroke">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="text-[15px] text-gray-dark">1:1 sessions</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setSessions(Math.max(0, sessions - 1))} disabled={sessions === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-gray-dark hover:bg-[#ebebeb] disabled:cursor-not-allowed disabled:opacity-30">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span className="w-6 text-center text-[15px] font-medium text-gray-dark">{sessions}</span>
          <button onClick={() => setSessions(sessions + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-gray-dark hover:bg-[#ebebeb]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
      {COHORTS.map((cohort) => (
        <div key={cohort} className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="text-[15px] text-gray-dark">{cohort}</span>
          {cohortInvited[cohort] ? (
            <div className="flex items-center gap-2 rounded-full bg-[#e6f4ef] px-3 py-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#038561" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="text-[14px] font-medium text-[#038561]">Invited</span>
              <button onClick={() => setCohortInvited((prev) => ({ ...prev, [cohort]: false }))} className="ml-1 text-[#038561] hover:opacity-70">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ) : (
            <button onClick={() => setCohortInvited((prev) => ({ ...prev, [cohort]: true }))}
              className="flex items-center gap-1.5 rounded-full bg-[#f5f5f5] px-3 py-1.5 text-[14px] font-medium text-gray-dark hover:bg-[#ebebeb]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Invite user
            </button>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="text-[15px] text-gray-dark">Leland+</span>
        {lelandPlus ? (
          <div className="flex items-center gap-2 rounded-full bg-[#e6f4ef] px-3 py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#038561" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[14px] font-medium text-[#038561]">3 months granted</span>
            <button onClick={() => setLelandPlus(false)} className="ml-1 text-[#038561] hover:opacity-70">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ) : (
          <button onClick={() => setLelandPlus(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#f5f5f5] px-3 py-1.5 text-[14px] font-medium text-gray-dark hover:bg-[#ebebeb]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Grant access
          </button>
        )}
      </div>
    </div>
  );
}

export function InviteModal({ open, onClose, hideOffering, isAlaCarte }: { open: boolean; onClose: () => void; hideOffering?: boolean; isAlaCarte?: boolean }) {
  const [mode, setMode] = useState<"individual" | "bulk">("individual");
  const [email, setEmail] = useState("");
  const [offering, setOffering] = useState("");
  const [sessions, setSessions] = useState(0);
  const [lelandPlus, setLelandPlus] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) { setSent(false); setEmail(""); }
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const successMessage = mode === "bulk"
    ? "Emails have been sent to 12 users."
    : `An email has been sent to ${email || "your new user"}.`;

  const modalWrapper = (children: React.ReactNode) => (
    <div
      className="fixed inset-0 z-[1010] flex items-end justify-center bg-black/40 sm:items-center"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full overflow-y-auto rounded-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:w-[520px] sm:max-w-[95vw] sm:overflow-hidden sm:rounded-2xl" style={{ maxHeight: "100dvh" }}>
        <button onClick={onClose} className="absolute right-0 top-0 p-2">
          <div className="flex items-center justify-center rounded-full border border-gray-stroke bg-white p-[10px] text-gray-dark hover:bg-gray-hover">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </div>
        </button>
        {children}
      </div>
    </div>
  );

  if (sent) return modalWrapper(
    <>
      <div className="flex flex-col items-center px-6 pb-8 pt-12 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf5]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#038561" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="mb-3 text-[30px] font-medium text-gray-dark">
          {isAlaCarte ? "Access granted!" : mode === "bulk" ? "Invites sent!" : "Invite sent!"}
        </h3>
        <p className="text-[18px] leading-[1.5] text-gray-light">{successMessage}</p>
      </div>
      <div className="border-t border-gray-stroke px-6 py-[14px]">
        <Btn variant="primary" onClick={onClose} className="w-full justify-center">Sounds good</Btn>
      </div>
    </>
  );

  return modalWrapper(
    <>
      <div className="px-6 pb-4 pt-6">
        <h3 className="text-[30px] font-medium text-gray-dark">{isAlaCarte ? "Grant access" : "Add users"}</h3>
      </div>

      {/* Body */}
      <div className="px-6 pb-2">
        {/* Toggle */}
        <div className="mb-6 flex gap-2">
          {(["individual", "bulk"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-[6px] text-[14px] font-medium transition-colors ${
                mode === m
                  ? "border-2 border-gray-dark bg-[#f5f5f5] text-gray-dark"
                  : "border border-transparent bg-[#f5f5f5] text-gray-dark hover:bg-[#ebebeb]"
              }`}
            >
              {m === "individual" ? "Individual" : "Bulk Upload"}
            </button>
          ))}
        </div>

        {mode === "individual" ? (
          <>
            <div className="mb-5">
              <label className="mb-[6px] block text-[16px] font-normal text-gray-dark">Email address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-[48px] w-full rounded-[8px] border border-gray-stroke bg-white px-4 text-[16px] text-gray-dark outline-none focus:border-primary" type="email" />
              <p className="mt-[6px] text-[14px] text-gray-light">If this email already has a Leland account, they'll be linked automatically.</p>
            </div>
            <div className="mb-5 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-[6px] block text-[16px] font-normal text-gray-dark">First name</label>
                <input className="h-[48px] w-full rounded-[8px] border border-gray-stroke bg-white px-4 text-[16px] text-gray-dark outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-[6px] block text-[16px] font-normal text-gray-dark">Last name</label>
                <input className="h-[48px] w-full rounded-[8px] border border-gray-stroke bg-white px-4 text-[16px] text-gray-dark outline-none focus:border-primary" />
              </div>
            </div>
            {isAlaCarte ? <AlaCArteOfferings sessions={sessions} setSessions={setSessions} lelandPlus={lelandPlus} setLelandPlus={setLelandPlus} /> : !hideOffering && (
              <div className="mb-5">
                <label className="mb-[6px] block text-[16px] font-normal text-gray-dark">Grant an offering</label>
                <div className="relative">
                  <select className={`${selectCls2} ${offering ? "text-gray-dark" : "text-gray-light"}`} value={offering} onChange={(e) => setOffering(e.target.value)}>
                    <option value="" disabled>Select one or more options</option>
                    <option value="session">1:1 session</option>
                    <option value="leland-plus">Leland+ access</option>
                    <option value="live-course">Live course</option>
                  </select>
                  {chevronDown}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <label className="mb-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-gray-stroke bg-[#f5f5f5] px-5 py-8 transition-colors hover:border-primary">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-light">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
              </svg>
              <span className="text-[15px] font-semibold text-gray-dark">Click to upload CSV</span>
              <span className="text-[14px] text-gray-light">One email address per row</span>
              <input type="file" accept=".csv" className="hidden" />
            </label>
            <button className="mb-5 flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download template CSV to get started.
            </button>
            {isAlaCarte ? <AlaCArteOfferings sessions={sessions} setSessions={setSessions} lelandPlus={lelandPlus} setLelandPlus={setLelandPlus} /> : !hideOffering && (
              <div className="mb-5">
                <label className="mb-[6px] block text-[16px] font-normal text-gray-dark">Grant an offering</label>
                <div className="relative">
                  <select className={`${selectCls2} ${offering ? "text-gray-dark" : "text-gray-light"}`} value={offering} onChange={(e) => setOffering(e.target.value)}>
                    <option value="" disabled>Select one or more options</option>
                    <option value="session">1:1 session</option>
                    <option value="leland-plus">Leland+ access</option>
                    <option value="live-course">Live course</option>
                  </select>
                  {chevronDown}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-stroke px-6 py-[14px]">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => setSent(true)}>{isAlaCarte ? "Grant access" : "Send invite"}</Btn>
      </div>
    </>
  );
}

// ── GrantModal ──

export function GrantModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <B2BModal
      open={open}
      onClose={onClose}
      title="Grant Offering"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary">Grant Offering</Btn>
        </>
      }
    >
      <FormGroup label="User">
        <select className={selectCls} defaultValue="">
          <option value="">&mdash; Select user &mdash;</option>
          {users.map((u) => (
            <option key={u.id}>{u.name}</option>
          ))}
        </select>
      </FormGroup>
      <FormGroup label="Offering Type">
        <select className={selectCls} defaultValue="">
          <option value="">&mdash; Select offering &mdash;</option>
          <option>1:1 Coaching &mdash; Investment Banking (28 remaining)</option>
          <option>1:1 Coaching &mdash; Private Equity (19 remaining)</option>
          <option>1:1 Coaching &mdash; Consulting (12 remaining)</option>
          <option>Leland+ Annual (8 remaining)</option>
          <option>IB Bootcamp (7 remaining)</option>
        </select>
      </FormGroup>
      <FormGroup label="Note to User (optional)">
        <textarea className={inputCls} rows={2} placeholder="e.g. Use this for your IB recruiting season..." />
      </FormGroup>
    </B2BModal>
  );
}

// ── BulkImportModal ──

export function BulkImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <B2BModal
      open={open}
      onClose={onClose}
      title="Import Users via CSV"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary">Upload &amp; Import</Btn>
        </>
      }
    >
      <div className="mb-4 cursor-pointer rounded-[9px] border-2 border-dashed border-gray-stroke bg-gray-hover p-8 text-center">
        <div className="mb-[10px] text-[28px]">&#128194;</div>
        <div className="mb-1 font-semibold text-gray-dark">Drop CSV file here or click to browse</div>
        <div className="text-[12px] text-gray-xlight">Columns: first_name, last_name, email, offering (optional)</div>
      </div>
      <div>
        <div className="mb-[6px] text-[12px] font-semibold text-gray-dark">CSV format example:</div>
        <pre className="overflow-x-auto rounded-[7px] bg-gray-hover px-3 py-[10px] text-[11px] text-gray-light">
{`first_name,last_name,email,offering
Alex,Chen,a-chen@kellogg.edu,coaching-ib
Maya,Rodriguez,m-rodriguez@kellogg.edu,leland-plus`}
        </pre>
      </div>
    </B2BModal>
  );
}

// ── AdminModal ──

export function AdminModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <B2BModal
      open={open}
      onClose={onClose}
      title="Add Admin User"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary">Send Invite</Btn>
        </>
      }
    >
      <FormGroup label="Email Address">
        <input className={inputCls} type="email" placeholder="admin@kellogg.edu" />
      </FormGroup>
      <FormGroup label="Permission Level">
        <select className={selectCls}>
          <option>Admin &mdash; Full access (invite users, grant offerings, view all data)</option>
          <option>View Only &mdash; Can view dashboard but cannot make changes</option>
        </select>
      </FormGroup>
    </B2BModal>
  );
}

// ── GrantAccessModal ──

export function GrantAccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [offering, setOffering] = useState("");

  return (
    <B2BModal
      open={open}
      onClose={onClose}
      title="Grant Access"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary">Grant Access</Btn>
        </>
      }
    >
      <FormGroup label="Offering">
        <select className={selectCls} value={offering} onChange={(e) => setOffering(e.target.value)}>
          <option value="">&mdash; Select offering &mdash;</option>
          <option value="session">1:1 session</option>
          <option value="leland-plus">Leland+ access</option>
          <option value="live-course">Live course</option>
        </select>
      </FormGroup>
      <OfferingFields offering={offering} />
      <div className="mb-0">
        <label className="mb-[5px] block text-[12px] font-semibold text-gray-dark">Note to User (optional)</label>
        <textarea className={inputCls} rows={2} placeholder="e.g. Use this for your recruiting season..." />
      </div>
    </B2BModal>
  );
}

// ── GetMoreModal ──

export function GetMoreModal({ open, onClose, offering }: { open: boolean; onClose: () => void; offering?: string }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1010] flex items-end justify-center bg-black/40 sm:items-center"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full overflow-y-auto rounded-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:w-[520px] sm:max-w-[95vw] sm:overflow-hidden sm:rounded-2xl" style={{ maxHeight: "100dvh" }}>
        <button onClick={onClose} className="absolute right-0 top-0 p-2">
          <div className="flex items-center justify-center rounded-full border border-gray-stroke bg-white p-[10px] text-gray-dark hover:bg-gray-hover">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </div>
        </button>
        <div className="px-6 pb-8 pt-6">
          <h3 className="text-[30px] font-medium text-gray-dark">Expand your plan or request more access</h3>
          <p className="mt-2 text-[18px] leading-[1.5] text-gray-light">
            {offering
              ? `Need more ${offering}? We'll get you set up.`
              : "Need more capacity or interested in additional services? We'll get you set up."}
          </p>
        </div>
        <div className="px-6 pb-2">
          <div className="mb-5">
            <label className="mb-[6px] block text-[16px] font-normal text-gray-dark">What do you need?</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={offering
                ? `e.g. We'd like to add 20 more ${offering} to our contract.`
                : "e.g. We'd like to add more coaching sessions and explore live cohort access."}
              className="w-full resize-none rounded-[8px] border border-gray-stroke bg-white px-4 py-3 text-[16px] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-primary"
            />
            <p className="mt-2 text-[14px] text-gray-light">Your account manager will follow up to discuss options.</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-stroke px-6 py-[14px]">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary">Send request</Btn>
        </div>
      </div>
    </div>
  );
}

// ── EmailModal ──

export function EmailModal({
  open,
  onClose,
  recipients,
  filterLabel,
}: {
  open: boolean;
  onClose: () => void;
  recipients: { name: string; email: string }[];
  filterLabel: string;
}) {
  return (
    <B2BModal
      open={open}
      onClose={onClose}
      title="Email Users"
      subtitle={`${recipients.length} user${recipients.length !== 1 ? "s" : ""} \u00b7 ${filterLabel}`}
      wide
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email
          </Btn>
        </>
      }
    >
      <FormGroup label="To">
        <div className="b2b-scroll flex max-h-[140px] flex-col gap-1 overflow-y-auto rounded-lg border border-gray-stroke bg-gray-hover p-2">
          {recipients.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-gray-stroke bg-white px-[6px] py-1">
              <span className="text-[12px] font-medium text-gray-dark">{r.name}</span>
              <span className="text-[11px] text-gray-xlight">{r.email}</span>
            </div>
          ))}
        </div>
      </FormGroup>
      <FormGroup label="Subject">
        <input className={inputCls} placeholder="e.g. Schedule your coaching session on Leland" />
      </FormGroup>
      <div>
        <label className="mb-[5px] block text-[12px] font-semibold text-gray-dark">Message</label>
        <textarea className={`${inputCls} resize-y`} rows={5} placeholder="Write your message..." />
      </div>
    </B2BModal>
  );
}

// ── Dispatcher ──

export function B2BModalDispatcher({
  openModal,
  onClose,
  emailRecipients,
  emailFilterLabel,
  showVerizon,
  isAlaCarte,
}: {
  openModal: ModalId;
  onClose: () => void;
  emailRecipients: { name: string; email: string }[];
  emailFilterLabel: string;
  showVerizon?: boolean;
  isAlaCarte?: boolean;
}) {
  return (
    <>
      <InviteModal open={openModal === "invite"} onClose={onClose} hideOffering={showVerizon} isAlaCarte={isAlaCarte} />
      <GrantModal open={openModal === "grant"} onClose={onClose} />
      <BulkImportModal open={openModal === "bulk"} onClose={onClose} />
      <AdminModal open={openModal === "admin"} onClose={onClose} />
      <GrantAccessModal open={openModal === "grant-access"} onClose={onClose} />
      <GetMoreModal open={openModal === "get-more"} onClose={onClose} />
      <EmailModal
        open={openModal === "email"}
        onClose={onClose}
        recipients={emailRecipients}
        filterLabel={emailFilterLabel}
      />
    </>
  );
}
