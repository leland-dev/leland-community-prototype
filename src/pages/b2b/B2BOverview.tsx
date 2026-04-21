import { Card, ProgressBar, Pill } from "./B2BShared";
import type { B2BView, ModalId } from "./B2BData";

interface Props {
  onNavigate: (view: B2BView) => void;
  onSetUtilFilter: (filter: string) => void;
  onOpenModal: (m: ModalId) => void;
}

function FunnelStep({
  step,
  label,
  num,
  sub,
  pct,
  highlight,
  extra,
  onClick,
}: {
  step: number;
  label: string;
  num?: string;
  sub: string;
  pct: string;
  highlight?: boolean;
  extra?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-[16px_18px] transition-all ${
        highlight
          ? "cursor-pointer border-primary bg-primary-xlight hover:shadow-[0_4px_14px_rgba(21,176,120,0.2)] hover:-translate-y-[2px]"
          : onClick
            ? "cursor-pointer border-gray-stroke bg-white hover:shadow-card hover:-translate-y-[2px] hover:border-[#c8cdd5]"
            : "border-gray-stroke bg-white"
      }`}
    >
      <div className={`mb-[10px] flex items-center gap-[6px] text-[11px] font-bold uppercase tracking-[0.07em] ${highlight ? "text-dark-green" : "text-gray-xlight"}`}>
        <span
          className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
            highlight ? "bg-[rgba(24,84,64,0.15)] text-dark-green" : "bg-gray-hover text-gray-xlight"
          }`}
        >
          {step}
        </span>
        {label}
      </div>
      {extra || (
        num && <div className={`text-[30px] font-bold leading-none ${highlight ? "text-dark-green" : "text-gray-dark"}`}>
          {num}
        </div>
      )}
      <div className={`mt-1 text-[12px] ${highlight ? "text-dark-green opacity-70" : "text-gray-light"}`}>
        {sub}
      </div>
      <div
        className={`mt-2 inline-block rounded-full px-2 py-[2px] text-[11px] font-bold ${
          highlight ? "bg-[rgba(21,176,120,0.2)] text-primary" : "bg-primary-xlight text-dark-green"
        }`}
      >
        {pct}
      </div>
    </div>
  );
}

function FunnelArrow() {
  return (
    <div className="flex items-center justify-center text-[16px] text-[#D1D5DB]">&rsaquo;</div>
  );
}

export default function B2BOverview({ onNavigate, onSetUtilFilter }: Props) {
  const goToUtil = (filterKey: string) => {
    onSetUtilFilter(filterKey);
    onNavigate("utilization");
  };

  return (
    <>
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-[40px] font-medium text-gray-dark">Overview</h1>
        <p className="mt-[2px] text-[18px] text-[#707070]">Kellogg School of Management &middot; Contract Jan 2025 &ndash; Jun 2026</p>
      </div>

      {/* ── 1:1 Sessions Section ── */}
      <div className="b2b-section-divider mb-5 mt-7 flex items-center gap-3">
        <h2 className="whitespace-nowrap text-[15px] font-medium text-gray-dark">1:1 Sessions</h2>
      </div>

      {/* Funnel */}
      <div className="mb-6 grid items-stretch gap-0" style={{ gridTemplateColumns: "1fr 20px 1fr 20px 1fr 20px 1fr 20px 1fr" }}>
        <FunnelStep step={1} label="Submitted by Admin" num="325" sub="users submitted" pct="100%" onClick={() => goToUtil("all")} />
        <FunnelArrow />
        <FunnelStep step={2} label="Created Leland Account" num="289" sub="of 325 submitted" pct="89%" onClick={() => goToUtil("not-started")} />
        <FunnelArrow />
        <FunnelStep step={3} label="Matched with Coach" num="241" sub="of 289 accounts" pct="83%" onClick={() => goToUtil("matched")} />
        <FunnelArrow />
        <FunnelStep step={4} label="Scheduled Session" num="198" sub="of 241 matched" pct="82%" onClick={() => goToUtil("scheduled")} />
        <FunnelArrow />
        <FunnelStep
          step={5}
          label="Completed Session"
          highlight
          sub="sessions completed vs. purchased"
          pct="84% utilization"
          extra={
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-bold leading-none text-dark-green">251</span>
              <span className="text-[18px] font-bold text-gray-xlight">/ 300</span>
            </div>
          }
          onClick={() => goToUtil("completed")}
        />
      </div>

      {/* Coaching utilization */}
      <div className="mb-1 grid gap-4" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <Card
          header={
            <div>
              <h2 className="text-[14px] font-medium text-gray-dark">Coaching Session Utilization</h2>
              <p className="text-[12px] text-gray-light">Completed sessions by track</p>
            </div>
          }
          headerRight={
            <button
              onClick={() => onNavigate("utilization")}
              className="inline-flex items-center gap-[6px] rounded-lg border border-gray-stroke bg-white px-[10px] py-[5px] text-[12px] font-semibold text-gray-dark hover:bg-gray-hover"
            >
              Details
            </button>
          }
        >
          <div className="p-5">
            {[
              { name: "Investment Banking", dotColor: "bg-primary", barColor: "bg-primary", pct: 72, counts: "72/100" },
              { name: "Private Equity", dotColor: "bg-blue", barColor: "bg-blue", pct: 62, counts: "31/50" },
              { name: "Consulting", dotColor: "bg-[#2d25a6]", barColor: "bg-[#2d25a6]", pct: 88, counts: "88/100" },
            ].map((track, i, arr) => (
              <div
                key={track.name}
                className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}
              >
                <div className="flex w-[180px] shrink-0 items-center gap-2 text-[13px] font-medium">
                  <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${track.dotColor}`} />
                  {track.name}
                </div>
                <ProgressBar percent={track.pct} color={track.barColor} />
                <span className="w-[70px] shrink-0 text-right text-[12px] text-gray-light">{track.counts}</span>
              </div>
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-gray-stroke pt-3">
              <span className="text-[12px] text-gray-xlight">Total sessions</span>
              <span className="text-[13px] font-bold text-gray-dark">
                191 / 250{" "}
                <span className="text-[11px] font-bold text-primary">76%</span>
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Leland+ Section ── */}
      <div className="b2b-section-divider mb-5 mt-7 flex items-center gap-3">
        <h2 className="whitespace-nowrap text-[15px] font-medium text-gray-dark">Leland+</h2>
      </div>

      <div className="mb-1 grid grid-cols-2 gap-4">
        <Card
          header={
            <div>
              <h2 className="text-[14px] font-medium text-gray-dark">Activation &amp; Engagement</h2>
              <p className="text-[12px] text-gray-light">Seats granted vs. activated</p>
            </div>
          }
          headerRight={
            <button
              onClick={() => onNavigate("leland-plus")}
              className="inline-flex items-center gap-[6px] rounded-lg border border-gray-stroke bg-white px-[10px] py-[5px] text-[12px] font-semibold text-gray-dark hover:bg-gray-hover"
            >
              Details
            </button>
          }
        >
          <div className="p-5">
            <div className="mb-4 grid grid-cols-3 gap-[10px]">
              {[
                { value: <>42<span className="text-[13px] font-normal text-gray-light">/50</span></>, label: "Seats Activated", color: "text-dark-green" },
                { value: "84%", label: "Activation Rate", color: "text-primary" },
                { value: "12.4", label: "Avg Resources/User", color: "text-dark-green" },
              ].map((s) => (
                <div key={s.label} className="rounded-[9px] bg-gray-hover p-3 text-center">
                  <div className={`text-[22px] font-bold ${s.color}`}>{s.value}</div>
                  <div className="mt-[3px] text-[10px] uppercase tracking-[0.06em] text-gray-xlight">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-stroke pt-3">
              <div className="mb-[10px] text-[11px] font-bold uppercase tracking-[0.07em] text-gray-xlight">Top content categories</div>
              {[
                { name: "Finance & PE", dotColor: "bg-orange", barColor: "bg-orange", pct: 68 },
                { name: "Consulting", dotColor: "bg-blue", barColor: "bg-blue", pct: 54 },
                { name: "Interview Guides", dotColor: "bg-primary", barColor: "bg-primary", pct: 81 },
              ].map((cat, i, arr) => (
                <div
                  key={cat.name}
                  className={`flex items-center gap-3 py-[7px] ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}
                >
                  <div className="flex w-[140px] shrink-0 items-center gap-2 text-[12px] font-medium">
                    <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${cat.dotColor}`} />
                    {cat.name}
                  </div>
                  <ProgressBar percent={cat.pct} color={cat.barColor} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Live Courses Section ── */}
      <div className="b2b-section-divider mb-5 mt-7 flex items-center gap-3">
        <h2 className="whitespace-nowrap text-[15px] font-medium text-gray-dark">Live Courses</h2>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-4">
        {/* AI Mastery */}
        <Card
          header={
            <div>
              <h2 className="text-[14px] font-medium text-gray-dark">AI Mastery</h2>
              <p className="text-[12px] text-gray-light">Live course</p>
            </div>
          }
          headerRight={<Pill variant="green">Active</Pill>}
        >
          <div className="p-5">
            <div className="mb-4 grid grid-cols-2 gap-[10px]">
              <div className="rounded-[9px] bg-gray-hover p-3 text-center">
                <div className="text-[22px] font-bold text-dark-green">24<span className="text-[13px] font-normal text-gray-light">/30</span></div>
                <div className="mt-[3px] text-[10px] uppercase tracking-[0.06em] text-gray-xlight">Enrolled</div>
              </div>
              <div className="rounded-[9px] bg-gray-hover p-3 text-center">
                <div className="text-[22px] font-bold text-primary">80%</div>
                <div className="mt-[3px] text-[10px] uppercase tracking-[0.06em] text-gray-xlight">Completion</div>
              </div>
            </div>
            {[
              { label: "Completed", dotColor: "bg-primary", count: "8", countColor: "text-gray-dark" },
              { label: "In progress", dotColor: "bg-blue", count: "16", countColor: "text-gray-dark" },
              { label: "Not enrolled", dotColor: "bg-[#D1D5DB]", count: "6", countColor: "text-gray-light" },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex items-center py-[7px] ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                <div className="flex items-center gap-2 text-[12px] font-medium">
                  <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${row.dotColor}`} />
                  {row.label}
                </div>
                <div className={`ml-auto text-[12px] font-semibold ${row.countColor}`}>{row.count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Consulting Recruiting */}
        <Card
          header={
            <div>
              <h2 className="text-[14px] font-medium text-gray-dark">Consulting Recruiting</h2>
              <p className="text-[12px] text-gray-light">Live course</p>
            </div>
          }
          headerRight={<Pill variant="purple">Active</Pill>}
        >
          <div className="p-5">
            <div className="mb-4 grid grid-cols-2 gap-[10px]">
              <div className="rounded-[9px] bg-gray-hover p-3 text-center">
                <div className="text-[22px] font-bold text-dark-green">18<span className="text-[13px] font-normal text-gray-light">/25</span></div>
                <div className="mt-[3px] text-[10px] uppercase tracking-[0.06em] text-gray-xlight">Enrolled</div>
              </div>
              <div className="rounded-[9px] bg-gray-hover p-3 text-center">
                <div className="text-[22px] font-bold text-primary">72%</div>
                <div className="mt-[3px] text-[10px] uppercase tracking-[0.06em] text-gray-xlight">Completion</div>
              </div>
            </div>
            {[
              { label: "Completed", dotColor: "bg-primary", count: "5", countColor: "text-gray-dark" },
              { label: "In progress", dotColor: "bg-[#2d25a6]", count: "13", countColor: "text-gray-dark" },
              { label: "Not enrolled", dotColor: "bg-[#D1D5DB]", count: "7", countColor: "text-gray-light" },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex items-center py-[7px] ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                <div className="flex items-center gap-2 text-[12px] font-medium">
                  <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${row.dotColor}`} />
                  {row.label}
                </div>
                <div className={`ml-auto text-[12px] font-semibold ${row.countColor}`}>{row.count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* IB Recruiting */}
        <Card
          header={
            <div>
              <h2 className="text-[14px] font-medium text-gray-dark">IB Recruiting</h2>
              <p className="text-[12px] text-gray-light">Live course</p>
            </div>
          }
          headerRight={<Pill variant="orange">Starting Soon</Pill>}
        >
          <div className="p-5">
            <div className="mb-4 grid grid-cols-2 gap-[10px]">
              <div className="rounded-[9px] bg-gray-hover p-3 text-center">
                <div className="text-[22px] font-bold text-dark-green">12<span className="text-[13px] font-normal text-gray-light">/20</span></div>
                <div className="mt-[3px] text-[10px] uppercase tracking-[0.06em] text-gray-xlight">Enrolled</div>
              </div>
              <div className="rounded-[9px] bg-gray-hover p-3 text-center">
                <div className="text-[22px] font-bold text-orange">Mar 15</div>
                <div className="mt-[3px] text-[10px] uppercase tracking-[0.06em] text-gray-xlight">Start Date</div>
              </div>
            </div>
            {[
              { label: "Enrolled", dotColor: "bg-primary", count: "12", countColor: "text-gray-dark" },
              { label: "Remaining seats", dotColor: "bg-[#D1D5DB]", count: "8", countColor: "text-gray-light" },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex items-center py-[7px] ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                <div className="flex items-center gap-2 text-[12px] font-medium">
                  <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${row.dotColor}`} />
                  {row.label}
                </div>
                <div className={`ml-auto text-[12px] font-semibold ${row.countColor}`}>{row.count}</div>
              </div>
            ))}
            <div className="mt-2 border-t border-gray-stroke pt-[10px]">
              <span className="text-[12px] text-gray-xlight">Next session: </span>
              <span className="text-[12px] font-bold text-gray-dark">Mar 15 &middot; Cohort 4</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
