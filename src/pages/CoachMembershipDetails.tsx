import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, LinkButton } from "../components/Button";
import MaskIcon from "../components/MaskIcon";
import { Pivot, type PivotTab } from "../components/Pivot";
import { UpcomingEventRow, type UpcomingEvent } from "./CoachCategoryEdit";
import { getSubscriptionBySlug } from "../lib/subscriptions";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import stackIcon from "../assets/icons/stack.svg";
import dotsVerticalIcon from "../assets/icons/dots-vertical.svg";
import eventPlaceholder1 from "../assets/placeholder images/placeholder-event-01.png";
import eventPlaceholder2 from "../assets/placeholder images/placeholder-event-02.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic7 from "../assets/profile photos/pic-7.png";

const card = "rounded-[20px] bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

type Tab = "membership" | "members" | "earnings" | "calendar";

// Deterministic mock roster for the Members section.
const ROSTER = [
  { name: "Jordan Patel", avatar: pic1, plan: "Annual", joined: "Mar 2026" },
  { name: "Mia Chen", avatar: pic2, plan: "Monthly", joined: "Apr 2026" },
  { name: "Andre Williams", avatar: pic3, plan: "Monthly", joined: "Apr 2026" },
  { name: "Sofia Rossi", avatar: pic4, plan: "Annual", joined: "Feb 2026" },
  { name: "Daniel Okafor", avatar: pic5, plan: "Monthly", joined: "May 2026" },
  { name: "Priya Nair", avatar: pic7, plan: "Annual", joined: "Jan 2026" },
];

// Products bundled into the membership — mirrors the offering builder's
// "Build your offering" product list (icon, title, detail, standalone price).
const INCLUDED_PRODUCTS = [
  { icon: hourglassIcon, title: "Monthly group coaching", detail: "2 sessions / month · 60 min", price: "$150" },
  { icon: bookOpenIcon, title: "MBA Essay Framework", detail: "PDF · 4.2k views", price: "$18" },
  { icon: stackIcon, title: "Members-only resource library", detail: "12 resources", price: "$0" },
];

// Upcoming paid group sessions for the Calendar tab (November 2026).
const CALENDAR_EVENTS = [
  { date: 12, weekday: "Thu", time: "5:00 PM", title: "Live member Q&A", attendees: "Open to all members", duration: "45 min" },
  { date: 17, weekday: "Tue", time: "6:00 PM", title: "Essay teardown: live edits", attendees: "32 going", duration: "60 min" },
  { date: 26, weekday: "Thu", time: "5:00 PM", title: "Live member Q&A", attendees: "Open to all members", duration: "45 min" },
];
// Early-December sessions shown in the upcoming list beneath the calendar.
const UPCOMING_NEXT_MONTH = [
  { label: "Dec 1", weekday: "Tue", time: "6:00 PM", title: "Monthly group coaching call", attendees: "128 invited", duration: "60 min" },
];

function StatCard({ label, value, delta, positive = true }: { label: string; value: string; delta?: string; positive?: boolean }) {
  // Arrow direction follows the delta's sign; color follows sentiment (positive).
  const down = delta?.trim().startsWith("-");
  return (
    <div className={card}>
      <p className="text-[14px] font-medium text-gray-light">{label}</p>
      <p className="mt-2 font-serif text-[30px] leading-none text-gray-dark">{value}</p>
      {delta && (
        <p className={`mt-2 flex items-center gap-1 text-[13px] font-medium ${positive ? "text-[#1B8A54]" : "text-[#DC2B23]"}`}>
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {down ? <path d="M7 7l10 10M17 17H9M17 17V9" /> : <path d="M7 17L17 7M17 7H9M17 7V15" />}
          </svg>
          {delta}
        </p>
      )}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[18px] font-semibold text-gray-dark">{title}</h2>
      {action}
    </div>
  );
}

const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold" onClick={onClick}>
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
    {label}
  </Button>
);

export default function CoachMembershipDetails() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const plan = getSubscriptionBySlug(slug);
  const [tab, setTab] = useState<Tab>("membership");

  useEffect(() => {
    document.title = `Leland Prototype | ${plan?.title ?? "Membership"}`;
  }, [plan?.title]);

  if (!plan) {
    return (
      <div className="max-w-[720px]">
        <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">Membership not found</h1>
        <p className="mt-2 text-[14px] text-[#707070]">
          <Link to={`/my-leland/manage/${category}`} className="text-gray-dark underline">Back to category</Link>
        </p>
      </div>
    );
  }

  const mrr = plan.monthly * plan.members;
  const newMembers = Math.max(3, Math.round(plan.members * 0.09));
  const annualCount = Math.round(plan.members * 0.3);
  const monthlyCount = plan.members - annualCount;
  const annualSavePct = Math.round((1 - plan.annual / (plan.monthly * 12)) * 100);
  const arpu = Math.round(mrr / plan.members);

  const editBuilder = () => navigate(`/my-leland/manage/${category}/new-product/subscription`);
  const addSession = () => navigate(`/my-leland/manage/${category}/new-event`);

  // Included live sessions — recurring sessions bundled into the membership,
  // rendered with the same event row used on the category management page.
  const liveSessionRows: UpcomingEvent[] = [
    { id: "coaching", title: "Monthly group coaching call", dateTime: "First Tuesday", duration: "60 min", thumb: eventPlaceholder1, free: false, price: "", enrolled: plan.members, joinable: false },
    { id: "qa", title: "Live member Q&A", dateTime: "Every other Thursday", duration: "45 min", thumb: eventPlaceholder2, free: false, price: "", enrolled: plan.members, joinable: false },
  ];

  const TABS: PivotTab<Tab>[] = [
    { id: "membership", label: "Membership" },
    { id: "members", label: "Members" },
    { id: "earnings", label: "Earnings" },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <div className="pb-16">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button size="sm" variant="secondary" iconOnly onClick={() => navigate(`/my-leland/manage/${category}`)} aria-label="Back">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Button>
        <div className="flex items-center gap-2">
          <LinkButton size="sm" variant="secondary" rounded="rounded-full" href={`/offering/${plan.slug}`} className="font-semibold">
            View public page
          </LinkButton>
          <Button size="sm" variant="dark" rounded="rounded-full" className="font-semibold" onClick={editBuilder}>Edit membership</Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        {plan.image && <img src={plan.image} alt="" className="hidden h-[72px] w-[100px] shrink-0 rounded-xl object-cover sm:block" />}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-[34px] leading-[1.1] text-gray-dark md:text-[40px]">{plan.title}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3F2E9] px-2.5 py-1 text-[12px] font-semibold text-[#1B8A54]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1B8A54]" />
              Active
            </span>
          </div>
          <p className="mt-2 max-w-[640px] text-[16px] leading-relaxed text-gray-light">{plan.headline}</p>
        </div>
      </div>

      {/* Pivot tabs — shared component mirroring the profile template's tab bar. */}
      <Pivot className="mt-8" fill={false} tabs={TABS} active={tab} onChange={setTab} />

      {/* Membership — what's included & recurring sessions */}
      {tab === "membership" && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <section className={card}>
              <SectionHeader title="What's included" />
              {/* Mirrors the offering builder's product list: a bordered card of
                  product rows (icon · title · detail · price · actions) with an
                  "Add product" footer. */}
              <div className="overflow-hidden rounded-[20px] border border-gray-stroke bg-white">
                {INCLUDED_PRODUCTS.map((p, i) => (
                  <div key={p.title} className="px-4">
                    <div className={`group flex items-center gap-3 bg-white py-4 ${i === INCLUDED_PRODUCTS.length - 1 ? "" : "border-b border-gray-stroke"}`}>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                        <img src={p.icon} alt="" className="h-[26px] w-[26px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-gray-dark">{p.title}</span>
                        <span className="flex items-center gap-1.5 text-[15px] text-gray-light">
                          <span className="truncate">{p.detail}</span>
                        </span>
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[15px] text-gray-dark">{p.price}</span>
                        <button onClick={editBuilder} aria-label={`Actions for ${p.title}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-extra-light transition-colors hover:text-gray-light">
                          <MaskIcon src={dotsVerticalIcon} className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={editBuilder}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-gray-stroke py-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  Add product
                </button>
              </div>
            </section>

            <section className={card}>
              <SectionHeader title="Live sessions" action={<AddButton label="Add session" onClick={addSession} />} />
              <p className="-mt-2 mb-3 text-[14px] text-gray-light">Recurring sessions members get access to as part of this membership.</p>
              <div className="-mx-3 flex flex-col gap-1">
                {liveSessionRows.map((ev) => (
                  <UpcomingEventRow key={ev.id} ev={ev} onJoin={addSession} onDetails={addSession} showPrice={false} enrolledNoun="RSVPs" />
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-5">
            <section className={card}>
              <SectionHeader title="Pricing" action={<button onClick={editBuilder} className="text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark">Edit</button>} />
              <div className="flex flex-col gap-3">
                <div className="flex items-end justify-between gap-3 rounded-xl bg-gray-hover px-4 py-3">
                  <div>
                    <p className="text-[13px] text-gray-light">Monthly</p>
                    <p className="mt-0.5 text-[20px] font-bold text-gray-dark">${plan.monthly}<span className="text-[13px] font-normal text-gray-light">/mo</span></p>
                  </div>
                  <span className="text-[13px] text-gray-extra-light">{monthlyCount} members</span>
                </div>
                <div className="flex items-end justify-between gap-3 rounded-xl bg-gray-hover px-4 py-3">
                  <div>
                    <p className="flex items-center gap-2 text-[13px] text-gray-light">
                      Annual
                      {annualSavePct > 0 && <span className="rounded-full bg-[#E3F2E9] px-1.5 py-0.5 text-[11px] font-semibold text-[#1B8A54]">Save {annualSavePct}%</span>}
                    </p>
                    <p className="mt-0.5 text-[20px] font-bold text-gray-dark">${plan.annual.toLocaleString()}<span className="text-[13px] font-normal text-gray-light">/yr</span></p>
                  </div>
                  <span className="text-[13px] text-gray-extra-light">{annualCount} members</span>
                </div>
              </div>
            </section>

            <section className={card}>
              <h2 className="mb-4 text-[18px] font-semibold text-gray-dark">Plan mix</h2>
              <div className="flex justify-center py-2">
                <DonutChart
                  segments={[
                    { label: "Monthly", value: monthlyCount, color: "#80ACED" },
                    { label: "Annual", value: annualCount, color: "#94370C" },
                  ]}
                />
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="flex items-center gap-2 text-gray-dark"><span className="h-2.5 w-2.5 rounded-full bg-[#80ACED]" />Monthly</span>
                  <span className="font-semibold text-gray-dark">{monthlyCount}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="flex items-center gap-2 text-gray-dark"><span className="h-2.5 w-2.5 rounded-full bg-[#94370C]" />Annual</span>
                  <span className="font-semibold text-gray-dark">{annualCount}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Members */}
      {tab === "members" && (
        <div className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StatCard label="Active members" value={plan.members.toLocaleString()} delta={`+${newMembers} this month`} />
            <StatCard label="Churn rate" value="2.1%" delta="-0.4% vs last month" />
          </div>

          <section className={card}>
            <SectionHeader
              title="Members"
              action={<Link to="/my-leland/messages" className="text-[14px] font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70">Message all</Link>}
            />
            <div className="-mx-6 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr className="border-y border-gray-stroke text-left text-[13px] font-medium text-gray-light">
                    <th className="py-2.5 pl-6 pr-3 font-medium">Member</th>
                    <th className="px-3 py-2.5 font-medium">Plan</th>
                    <th className="px-3 py-2.5 font-medium">Joined</th>
                    <th className="py-2.5 pl-3 pr-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ROSTER.map((m) => (
                    <tr key={m.name} className="border-b border-gray-stroke last:border-0">
                      <td className="py-3 pl-6 pr-3">
                        <div className="flex items-center gap-2.5">
                          <img src={m.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                          <span className="text-[14px] font-medium text-gray-dark">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[14px] text-gray-light">{m.plan}</td>
                      <td className="px-3 py-3 text-[14px] text-gray-light">{m.joined}</td>
                      <td className="py-3 pl-3 pr-6">
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1B8A54]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1B8A54]" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] text-gray-light">Showing {ROSTER.length} of {plan.members} members</p>
          </section>
        </div>
      )}

      {/* Earnings */}
      {tab === "earnings" && (
        <div className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Monthly recurring revenue" value={`$${mrr.toLocaleString()}`} delta="+8% vs last month" />
            <StatCard label="Avg. revenue / member" value={`$${arpu}`} delta="+$3 vs last month" />
            <StatCard label="Lifetime revenue" value={`$${(mrr * 11).toLocaleString()}`} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className={card}>
              <SectionHeader title="Revenue over time" />
              <RevenueChart mrr={mrr} />
            </section>

            <section className={card}>
              <h2 className="mb-4 text-[18px] font-semibold text-gray-dark">Revenue by plan</h2>
              <div className="flex flex-col gap-4">
                <RevenueRow label="Monthly" value={plan.monthly * monthlyCount} total={mrr} color="bg-[#80ACED]" />
                <RevenueRow label="Annual (monthly equiv.)" value={Math.round((plan.annual / 12) * annualCount)} total={mrr} color="bg-[#94370C]" />
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Calendar */}
      {tab === "calendar" && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className={card}>
            <SectionHeader title="November 2026" action={<AddButton label="Add session" onClick={addSession} />} />
            <CalendarGrid />
          </section>

          <section className={card}>
            <h2 className="mb-4 text-[18px] font-semibold text-gray-dark">Upcoming sessions</h2>
            <div className="flex flex-col divide-y divide-gray-stroke">
              {CALENDAR_EVENTS.map((e) => (
                <UpcomingRow key={`${e.date}-${e.title}`} month="Nov" day={String(e.date)} weekday={e.weekday} time={e.time} title={e.title} attendees={e.attendees} duration={e.duration} onManage={addSession} />
              ))}
              {UPCOMING_NEXT_MONTH.map((e) => (
                <UpcomingRow key={`${e.label}-${e.title}`} month="Dec" day={e.label.replace("Dec ", "")} weekday={e.weekday} time={e.time} title={e.title} attendees={e.attendees} duration={e.duration} onManage={addSession} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// Two-segment donut (plan mix). Segments are drawn clockwise from 12 o'clock
// with a small gap between them.
function DonutChart({ segments, size = 168, thickness = 26, gap = 3 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  gap?: number;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      {segments.map((seg) => {
        const len = (seg.value / total) * c;
        const dash = Math.max(len - gap, 0);
        const circle = (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += len;
        return circle;
      })}
    </svg>
  );
}

// Last six months of MRR, ramping up to the current value.
function RevenueChart({ mrr }: { mrr: number }) {
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const factors = [0.72, 0.79, 0.85, 0.9, 0.95, 1];
  const values = factors.map((f) => Math.round(mrr * f));
  const max = Math.max(...values);
  return (
    <div>
      {/* Plot area — columns are full-height so the bars' percentage heights
          resolve; bars cap at 85% to leave headroom for the value labels. */}
      <div className="flex h-[200px] items-end gap-3">
        {values.map((v, i) => (
          <div key={months[i]} className="flex h-full flex-1 flex-col items-center justify-end">
            <span className="mb-1.5 text-[12px] font-medium text-gray-dark">${(v / 1000).toFixed(1)}k</span>
            <div
              className="w-full rounded-t-md bg-[#80ACED]"
              style={{ height: `${(v / max) * 85}%` }}
            />
          </div>
        ))}
      </div>
      {/* Month axis */}
      <div className="mt-2 flex gap-3">
        {months.map((m) => (
          <span key={m} className="flex-1 text-center text-[12px] text-gray-light">{m}</span>
        ))}
      </div>
    </div>
  );
}

function RevenueRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[14px]">
        <span className="text-gray-dark">{label}</span>
        <span className="font-semibold text-gray-dark">${value.toLocaleString()}/mo</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-hover">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// November 2026 starts on a Sunday; today is the 10th.
function CalendarGrid() {
  const eventDays = new Set(CALENDAR_EVENTS.map((e) => e.date));
  const today = 10;
  const cells: (number | null)[] = [];
  // Nov 1, 2026 is a Sunday → no leading blanks.
  for (let d = 1; d <= 30; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-gray-light">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`b-${i}`} />;
          const hasEvent = eventDays.has(d);
          const isToday = d === today;
          return (
            <div
              key={d}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-[13px] ${
                isToday ? "bg-gray-dark font-semibold text-white" : hasEvent ? "bg-[#1B8A54]/10 font-medium text-gray-dark" : "text-gray-dark"
              }`}
            >
              {d}
              {hasEvent && !isToday && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#1B8A54]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingRow({ month, day, weekday, time, title, attendees, duration, onManage }: { month: string; day: string; weekday: string; time: string; title: string; attendees: string; duration: string; onManage: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-hover">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-light">{month}</span>
        <span className="text-[16px] font-bold leading-none text-gray-dark">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-gray-dark">{title}</p>
        <p className="mt-0.5 text-[13px] text-gray-light">{weekday} · {time} · {duration} · {attendees}</p>
      </div>
      <button onClick={onManage} className="shrink-0 text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark">Manage</button>
    </div>
  );
}
