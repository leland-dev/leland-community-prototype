import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "../components/Button";

// ── Black Friday banner ──────────────────────────────────────────────

// Sale ends end of Nov 30, 2026.
const SALE_END = new Date("2026-11-30T23:59:59").getTime();

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins: Math.floor((diff % 3_600_000) / 60_000),
    secs: Math.floor((diff % 60_000) / 1_000),
  };
}

// A perforated promo ticket. Real notch holes are punched with a CSS mask
// (two radial gradients) so the blue banner shows through, and the shadow is a
// `drop-shadow` filter — which follows the masked shape — instead of a
// box-shadow that would ignore the holes and make the notches look pasted on.
// perfY is the fixed distance from the top where the tear line + holes sit.
const PERF_Y = 56;
const notchMask =
  `radial-gradient(circle 9px at left ${PERF_Y}px, transparent 8.5px, #000 9px), ` +
  `radial-gradient(circle 9px at right ${PERF_Y}px, transparent 8.5px, #000 9px)`;

function DealTicket({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.18))" }}
    >
      {/* Tall min-height keeps the card's bottom well below the banner's clip
          line, so it reads as cut off behind the banner — never a full card. */}
      <div
        className="w-[198px] min-h-[320px] rounded-2xl bg-[#F9F8F3]"
        style={{
          WebkitMaskImage: notchMask,
          WebkitMaskComposite: "source-in",
          maskImage: notchMask,
          maskComposite: "intersect",
        }}
      >
        {/* Stub — sits over the blue banner */}
        <div
          className="flex items-center justify-center px-4"
          style={{ height: PERF_Y }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-light">
            Black Friday Deals
          </div>
        </div>

        {/* Dashed tear line, aligned with the mask holes */}
        <div className="mx-4 border-t border-dashed border-gray-stroke" />

        {/* Body */}
        <div className="px-4 pt-4 text-center">
          <div className="text-[13px] font-medium text-gray-light">Up to</div>
          <div className="mt-0.5 font-serif text-[32px] font-medium leading-none text-gray-dark">
            $900 off
          </div>
        </div>
      </div>
    </div>
  );
}

function BlackFridayBanner() {
  const [collapsed, setCollapsed] = useState(false);
  const { days, hours, mins, secs } = useCountdown(SALE_END);

  return (
    // Collapsing wrapper: grid-rows 1fr→0fr shrinks the row while the blue
    // banner inside keeps its intrinsic height and gets clipped — so the
    // content stays put and the container "eats" it on dismiss.
    <div
      className={`grid transition-[grid-template-rows] duration-500 ease-in-out relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-4 mb-8 w-screen sm:-mt-10 ${
        collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
      }`}
      aria-hidden={collapsed}
    >
      <div className={`min-h-0 overflow-hidden ${collapsed ? "pointer-events-none" : ""}`}>
    {/* overflow-hidden clips the ticket at the banner's bottom edge, so it
        reads as tucked behind the banner rather than floating on the page. */}
    <div className="group relative overflow-hidden bg-[#9EC2F2]">
      {/* Soft glow behind the ticket */}
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />

      {/* Gutter lives OUTSIDE the 1100 box so the content left edge matches the
          page content below (whose gutter is the shell padding, not inside its
          own max-width). */}
      <div className="px-4 sm:px-6">
      <div className="relative mx-auto flex min-h-[160px] max-w-[1100px] items-center gap-6 py-6">
        <div className="min-w-0 flex-1">
          <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2C42A1]">
            Sale ends in{" "}
            <span className="tabular-nums">
              {days}d : {String(hours).padStart(2, "0")}h :{" "}
              {String(mins).padStart(2, "0")}m :{" "}
              {String(secs).padStart(2, "0")}s
            </span>
          </p>
          <h2 className="font-serif text-[30px] font-medium leading-none text-gray-dark sm:text-[36px]">
            Black Friday
          </h2>
          <p className="mt-2 text-[14px] font-medium text-gray-dark">
            Up to 70% off consulting &amp; admissions prep.
          </p>
        </div>

        {/* Promotional ticket — clipped at the banner's bottom edge, lifts on hover. */}
        <DealTicket
          className="pointer-events-none absolute right-[236px] top-4 hidden rotate-[3deg] transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[4deg] lg:block"
        />

        {/* CTA + dismiss, pinned to the right */}
        <div className="flex shrink-0 items-center gap-2">
          <Button size="md" variant="dark" className="font-semibold">
            See the deals
          </Button>
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Dismiss Black Friday banner"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-dark/60 transition-colors hover:bg-black/10 hover:text-gray-dark"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      </div>
    </div>
      </div>
    </div>
  );
}

// Reusable gray blocks for the skeleton mockup.
function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-stroke ${className}`} />;
}

function Pill({ className = "" }: { className?: string }) {
  return <div className={`h-8 shrink-0 animate-pulse rounded-full bg-gray-hover ${className}`} />;
}

// A horizontally scrolling row of skeleton cards.
function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">{children}</div>
  );
}

// Offering card — thumbnail, title lines, price, button.
function OfferingCard() {
  return (
    <div className="flex w-[260px] shrink-0 flex-col gap-4 rounded-xl bg-gray-hover p-4">
      <Bar className="h-28 w-full rounded-lg" />
      <div className="space-y-2">
        <Bar className="h-4 w-11/12" />
        <Bar className="h-4 w-2/3" />
      </div>
      <div className="space-y-2">
        <Bar className="h-3 w-full" />
        <Bar className="h-3 w-5/6" />
      </div>
      <Bar className="h-3.5 w-16" />
      <Bar className="h-10 w-full rounded-full" />
    </div>
  );
}

// Livestream card — wide thumbnail with a title/host row below.
function LivestreamCard() {
  return (
    <div className="w-[300px] shrink-0">
      <Bar className="h-[150px] w-full rounded-lg" />
      <div className="mt-3 flex items-center gap-3">
        <Bar className="h-9 w-9 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Bar className="h-3.5 w-3/4" />
          <Bar className="h-3 w-1/2" />
        </div>
        <Bar className="h-8 w-20 shrink-0 rounded-full" />
      </div>
    </div>
  );
}

// Consultant card — avatar block with name/price overlay lines.
function ConsultantCard() {
  return (
    <div className="w-[260px] shrink-0 rounded-xl bg-gray-hover p-4">
      <Bar className="h-20 w-20 rounded-lg" />
      <div className="mt-3 space-y-2">
        <Bar className="h-4 w-2/3" />
        <Bar className="h-3 w-1/2" />
        <Bar className="h-3 w-5/6" />
      </div>
    </div>
  );
}

// Section header: real title + optional subtitle/filter pills, action on the right.
function SectionHeader({
  title,
  subtitle,
  pills = 0,
}: {
  title: string;
  subtitle?: string;
  pills?: number;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-semibold text-gray-dark">{title}</h2>
        <span className="shrink-0 text-[14px] font-medium text-gray-dark">
          Browse more
        </span>
      </div>
      {subtitle && <p className="mt-1 text-[14px] text-gray-light">{subtitle}</p>}
      {pills > 0 && (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: pills }).map((_, i) => (
            <Pill key={i} className="w-24" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Browse() {
  useEffect(() => {
    document.title = "Leland Prototype | Browse";
  }, []);

  return (
    <div className="pb-2">
      <BlackFridayBanner />

      <div className="mx-auto max-w-[1100px]">
      {/* Page title + action + related links */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif text-[40px] font-medium text-gray-dark">MBA Admissions</h1>
        <Pill className="h-10 w-44" />
      </div>
      <p className="mt-2 text-[14px] text-gray-light">
        Related:{" "}
        <span className="text-gray-dark underline">
          GMAT, GRE, Investment Banking, Management Consulting
        </span>
      </p>

      {/* Search bar + filter pills */}
      <div className="mt-8 flex items-center gap-5">
        <Bar className="h-12 w-[340px] rounded-full" />
        <div className="h-8 w-px shrink-0 bg-gray-stroke" />
        <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 8 }).map((_, i) => (
            <Pill key={i} className="w-24" />
          ))}
        </div>
      </div>

      {/* Featured offerings carousel */}
      <div className="mt-8">
        <Carousel>
          {Array.from({ length: 5 }).map((_, i) => (
            <OfferingCard key={i} />
          ))}
        </Carousel>
      </div>

      {/* Join a livestream */}
      <div className="mt-12">
        <SectionHeader
          title="Join a livestream"
          subtitle="Learn from top admissions consultants in live, interactive sessions you can join for free."
        />
        <Carousel>
          {Array.from({ length: 5 }).map((_, i) => (
            <LivestreamCard key={i} />
          ))}
        </Carousel>
      </div>

      {/* Get started with a consultant */}
      <div className="mt-12">
        <SectionHeader
          title="Get started with an admissions consultant"
          pills={3}
        />
        <Carousel>
          {Array.from({ length: 5 }).map((_, i) => (
            <ConsultantCard key={i} />
          ))}
        </Carousel>
      </div>
      </div>
    </div>
  );
}
