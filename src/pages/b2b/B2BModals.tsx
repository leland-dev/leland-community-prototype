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
      className="fixed inset-0 z-[1010] flex items-center justify-center bg-black/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`max-w-[95vw] overflow-hidden rounded-[14px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${wide ? "w-[540px]" : "w-[480px]"}`}
      >
        <div className="flex items-center justify-between border-b border-gray-stroke px-6 pb-4 pt-5">
          <div>
            <h3 className="text-[16px] font-medium text-gray-dark">{title}</h3>
            {subtitle && <p className="mt-[2px] text-[12px] text-gray-light">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded px-[6px] py-[2px] text-[20px] leading-none text-gray-xlight hover:bg-gray-hover hover:text-gray-dark"
          >
            &times;
          </button>
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

function Btn({ variant, children, onClick }: { variant: "primary" | "secondary"; children: ReactNode; onClick?: () => void }) {
  const base = "inline-flex items-center gap-[6px] rounded-lg px-[14px] py-[7px] text-[13px] font-semibold transition-all";
  const cls =
    variant === "primary"
      ? `${base} bg-primary text-white border border-primary hover:bg-primary-hover`
      : `${base} bg-white text-gray-dark border border-gray-stroke hover:bg-gray-hover`;
  return (
    <button className={cls} onClick={onClick}>
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

export function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"individual" | "bulk">("individual");
  const [offering, setOffering] = useState("");

  return (
    <B2BModal
      open={open}
      onClose={onClose}
      title="Submit a User"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary">{mode === "individual" ? "Send Invite" : "Upload & Submit"}</Btn>
        </>
      }
    >
      {/* Mode toggle */}
      <div className="mb-5 flex overflow-hidden rounded-lg border border-gray-stroke">
        {(["individual", "bulk"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setOffering(""); }}
            className={`flex-1 py-2 text-[13px] font-medium ${
              mode === m ? "bg-dark-green text-white" : "bg-white text-gray-xlight"
            }`}
          >
            {m === "individual" ? "Individual" : "Bulk Upload"}
          </button>
        ))}
      </div>

      {mode === "individual" ? (
        <>
          <FormGroup label="Email Address" hint="If this email already has a Leland account, they'll be linked automatically.">
            <input className={inputCls} type="email" placeholder="user@kellogg.edu" />
          </FormGroup>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <FormGroup label="First Name"><input className={inputCls} placeholder="First" /></FormGroup>
            <FormGroup label="Last Name"><input className={inputCls} placeholder="Last" /></FormGroup>
          </div>
          <FormGroup label="Grant Offering">
            <select className={selectCls} value={offering} onChange={(e) => setOffering(e.target.value)}>
              <option value="">&mdash; Select offering &mdash;</option>
              <option value="session">1:1 session</option>
              <option value="leland-plus">Leland+ access</option>
              <option value="live-course">Live course</option>
            </select>
          </FormGroup>
          <OfferingFields offering={offering} />
        </>
      ) : (
        <>
          <FormGroup label="Upload CSV" hint='Download template CSV to get started.'>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-stroke bg-[#FAFAFA] px-5 py-7 transition-colors hover:border-primary">
              <svg width="24" height="24" fill="none" stroke="currentColor" className="text-gray-xlight" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-[13px] font-medium text-gray-dark">Click to upload CSV</span>
              <span className="text-[12px] text-gray-xlight">One email address per row</span>
              <input type="file" accept=".csv" className="hidden" />
            </label>
          </FormGroup>
          <FormGroup label="Grant Offering">
            <select className={selectCls} value={offering} onChange={(e) => setOffering(e.target.value)}>
              <option value="">&mdash; Select offering &mdash;</option>
              <option value="session">1:1 session</option>
              <option value="leland-plus">Leland+ access</option>
              <option value="live-course">Live course</option>
            </select>
          </FormGroup>
          <OfferingFields offering={offering} />
        </>
      )}
    </B2BModal>
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
}: {
  openModal: ModalId;
  onClose: () => void;
  emailRecipients: { name: string; email: string }[];
  emailFilterLabel: string;
}) {
  return (
    <>
      <InviteModal open={openModal === "invite"} onClose={onClose} />
      <GrantModal open={openModal === "grant"} onClose={onClose} />
      <BulkImportModal open={openModal === "bulk"} onClose={onClose} />
      <AdminModal open={openModal === "admin"} onClose={onClose} />
      <GrantAccessModal open={openModal === "grant-access"} onClose={onClose} />
      <EmailModal
        open={openModal === "email"}
        onClose={onClose}
        recipients={emailRecipients}
        filterLabel={emailFilterLabel}
      />
    </>
  );
}
