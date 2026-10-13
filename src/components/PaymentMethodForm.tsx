import { useState, type ReactNode } from "react";
import { Button } from "./Button";
import type { BillingAddress, PaymentCard } from "../contexts/TeamContext";

// Card + company billing address, shared by the "add team members" checkout step and the
// Billing page. Prototype only: nothing is sent anywhere, and the full card number is never
// kept; only the brand, last four digits, expiry and name are saved on the team.

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "India", "Singapore", "Other"];

export function detectBrand(digits: string): string {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2(2[2-9][1-9]|[3-6]\d\d|7[01]\d|720))/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^(6011|65|64[4-9])/.test(digits)) return "Discover";
  return "Card";
}

const luhn = (digits: string) => {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const formatNumber = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 19);
  // Amex groups as 4-6-5, everything else in fours
  return detectBrand(d) === "Amex" ? [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ") : d.replace(/(.{4})/g, "$1 ").trim();
};

const formatExp = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const expired = (exp: string) => {
  const [mm, yy] = exp.split("/").map(Number);
  const now = new Date();
  return yy + 2000 < now.getFullYear() || (yy + 2000 === now.getFullYear() && mm < now.getMonth() + 1);
};

const inputCls = (error?: boolean) =>
  `h-[48px] w-full rounded-[8px] border bg-white px-4 text-[14px] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-primary ${error ? "border-[#B42318]" : "border-gray-stroke"}`;

function Field({ label, error, optional, className = "", children }: { label: string; error?: string; optional?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label className="mb-[6px] block text-[14px] text-gray-dark">
        {label}{optional && <span className="text-gray-light"> (optional)</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] text-[#B42318]">{error}</p>}
    </div>
  );
}

export interface PaymentMethodFormProps {
  initialBilling?: BillingAddress;
  initialName?: string;
  submitLabel: string;
  /** Shown above the card fields, e.g. an order summary */
  summary?: ReactNode;
  /** Authorization / terms text shown directly above the button */
  terms: ReactNode;
  onSubmit: (card: PaymentCard, billing: BillingAddress) => void;
  onCancel?: () => void;
}

export function PaymentMethodForm({ initialBilling, initialName = "", submitLabel, summary, terms, onSubmit, onCancel }: PaymentMethodFormProps) {
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState(initialName);
  const [company, setCompany] = useState(initialBilling?.company ?? "");
  const [line1, setLine1] = useState(initialBilling?.line1 ?? "");
  const [line2, setLine2] = useState(initialBilling?.line2 ?? "");
  const [city, setCity] = useState(initialBilling?.city ?? "");
  const [state, setState] = useState(initialBilling?.state ?? "");
  const [zip, setZip] = useState(initialBilling?.zip ?? "");
  const [country, setCountry] = useState(initialBilling?.country ?? "United States");
  const [attempted, setAttempted] = useState(false);

  const digits = number.replace(/\D/g, "");
  const brand = detectBrand(digits);
  const us = country === "United States";
  const errors: Record<string, string> = {};
  if (digits.length < 13 || !luhn(digits)) errors.number = "Enter a valid card number";
  if (!/^(0[1-9]|1[0-2])\/\d\d$/.test(exp)) errors.exp = "Use MM/YY";
  else if (expired(exp)) errors.exp = "This card has expired";
  if (!/^\d{3,4}$/.test(cvc) || (brand !== "Amex" && cvc.length !== 3)) errors.cvc = "Enter the security code";
  if (!name.trim()) errors.name = "Enter the name on the card";
  if (!company.trim()) errors.company = "Enter your company name";
  if (!line1.trim()) errors.line1 = "Enter your street address";
  if (!city.trim()) errors.city = "Enter a city";
  if (!state.trim()) errors.state = us ? "Enter a state" : "Enter a state or region";
  if (us ? !/^\d{5}(-\d{4})?$/.test(zip.trim()) : !zip.trim()) errors.zip = us ? "Enter a 5-digit ZIP code" : "Enter a postal code";
  const show = (k: string) => (attempted ? errors[k] : undefined);

  const submit = () => {
    setAttempted(true);
    if (Object.keys(errors).length > 0) return;
    onSubmit(
      { brand, last4: digits.slice(-4), exp, name: name.trim() },
      { company: company.trim(), line1: line1.trim(), line2: line2.trim() || undefined, city: city.trim(), state: state.trim(), zip: zip.trim(), country },
    );
  };

  return (
    <form
      noValidate
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      className="flex flex-col"
    >
      {summary && <div className="mb-6">{summary}</div>}

      <p className="mb-3 text-[16px] font-semibold text-gray-dark">Card</p>
      <div className="flex flex-col gap-4">
        <Field label="Card number" error={show("number")}>
          <div className="relative">
            <input
              className={`${inputCls(!!show("number"))} pr-24`}
              inputMode="numeric"
              autoComplete="off"
              placeholder="1234 1234 1234 1234"
              value={number}
              onChange={(e) => setNumber(formatNumber(e.target.value))}
            />
            {digits.length >= 1 && brand !== "Card" && (
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-light">{brand}</span>
            )}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiration" error={show("exp")}>
            <input className={inputCls(!!show("exp"))} inputMode="numeric" autoComplete="off" placeholder="MM/YY" value={exp} onChange={(e) => setExp(formatExp(e.target.value))} />
          </Field>
          <Field label="Security code" error={show("cvc")}>
            <input className={inputCls(!!show("cvc"))} inputMode="numeric" autoComplete="off" placeholder={brand === "Amex" ? "4 digits" : "3 digits"} value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} />
          </Field>
        </div>
        <Field label="Name on card" error={show("name")}>
          <input className={inputCls(!!show("name"))} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
      </div>

      <p className="mb-3 mt-8 text-[16px] font-semibold text-gray-dark">Billing address</p>
      <div className="flex flex-col gap-4">
        <Field label="Company name" error={show("company")}>
          <input className={inputCls(!!show("company"))} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </Field>
        <Field label="Country or region">
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`${inputCls()} cursor-pointer appearance-none pr-10`}
            >
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-light" aria-hidden>
              <polyline points="4 6 8 10 12 6" />
            </svg>
          </div>
        </Field>
        <Field label="Address line 1" error={show("line1")}>
          <input className={inputCls(!!show("line1"))} autoComplete="off" value={line1} onChange={(e) => setLine1(e.target.value)} />
        </Field>
        <Field label="Address line 2" optional>
          <input className={inputCls()} autoComplete="off" value={line2} onChange={(e) => setLine2(e.target.value)} />
        </Field>
        <div className="grid grid-cols-6 gap-3">
          <Field label="City" error={show("city")} className="col-span-6 sm:col-span-3">
            <input className={inputCls(!!show("city"))} autoComplete="off" value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label={us ? "State" : "State / region"} error={show("state")} className="col-span-3 sm:col-span-1">
            <input className={inputCls(!!show("state"))} autoComplete="off" value={state} onChange={(e) => setState(e.target.value)} />
          </Field>
          <Field label={us ? "ZIP code" : "Postal code"} error={show("zip")} className="col-span-3 sm:col-span-2">
            <input
              className={inputCls(!!show("zip"))}
              inputMode={us ? "numeric" : "text"}
              autoComplete="off"
              value={zip}
              onChange={(e) => setZip(us ? e.target.value.replace(/[^\d-]/g, "").slice(0, 10) : e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 text-[12px] leading-[1.5] text-gray-light">{terms}</div>
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-gray-light">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
        Payments are processed securely.
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button type="submit" size="lg" variant="primary" rounded="rounded-full" className="w-full">{submitLabel}</Button>
        {onCancel && <Button type="button" size="lg" variant="secondary" rounded="rounded-full" className="w-full" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}

// Terms links are placeholders for the prototype; point them at the real documents.
export function TermsLinks() {
  const link = "underline hover:text-gray-dark";
  return (
    <>
      <a href="#" onClick={(e) => e.preventDefault()} className={link}>Terms of Service</a>
      {" and "}
      <a href="#" onClick={(e) => e.preventDefault()} className={link}>Refund Policy</a>
    </>
  );
}
