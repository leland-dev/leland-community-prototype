import { useEffect, useState } from "react";
import { Button, LinkButton } from "../components/Button";
import eyeIcon from "../assets/icons/eye.svg";
import likesIcon from "../assets/icons/likes.svg";
import linkExternalIcon from "../assets/icons/link-external.svg";
import dotsIcon from "../assets/icons/dots-horizontal.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import helpIcon from "../assets/icons/help.svg";
import editIcon from "../assets/icons/edit.svg";
import stackIcon from "../assets/icons/stack.svg";
import lockIcon from "../assets/icons/lock.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import courseThumb from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";

// Icons ship with hardcoded fills, so tint them via CSS mask + bg-current to
// follow the surrounding text color. MaskIcon renders an inline span — its
// parent must be a flex container for h/w classes to size it.
function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

// ── Resource table data ──
type Resource = {
  title: string;
  date: string;
  earnings: string;
  likes: number;
  views: number;
  status: "Public" | "Unlisted" | "Private";
};

const RESOURCES: Resource[] = [
  { title: "Winning Essays from My HBS Admits [7/17/2026] (Recording)", date: "Jul 17, 2026", earnings: "$0.00", likes: 0, views: 14, status: "Public" },
  { title: "Winning Essays from My Stanford GSB Admits [7/24/2026] (Recording)", date: "Jul 24, 2026", earnings: "$0.00", likes: 0, views: 11, status: "Public" },
  { title: "Live Case Coach Throwdown: Bain vs. McKinsey", date: "Jul 24, 2026", earnings: "$0.13", likes: 0, views: 51, status: "Public" },
  { title: "Session 3 Recording", date: "Jul 16, 2026", earnings: "$0.00", likes: 0, views: 5, status: "Private" },
  { title: "Build a Full Trip Itinerary with Claude (Cowork, Code & Design)", date: "Jun 3, 2026", earnings: "$0.00", likes: 3, views: 252, status: "Public" },
  { title: "Your MBA Application Roadmap", date: "Jun 1, 2026", earnings: "$0.00", likes: 0, views: 13, status: "Public" },
  { title: "MBA Application Week Kickoff [6/1/2026] (Recording)", date: "Jun 1, 2026", earnings: "$0.00", likes: 0, views: 43, status: "Public" },
  { title: "Build Your Personal Budget with Claude", date: "Jun 1, 2026", earnings: "$0.00", likes: 0, views: 48, status: "Public" },
  { title: "Build an Investor-Level Pitch Deck with Claude, Excel & PowerPoint [5/29/2026] (Recording)", date: "May 29, 2026", earnings: "$0.00", likes: 1, views: 17, status: "Public" },
];

function StatusPill({ status }: { status: Resource["status"] }) {
  const styles: Record<Resource["status"], string> = {
    Public: "bg-[#E5F3EC] text-[#1B7A4B]",
    Unlisted: "bg-[#EEF4FB] text-[#35506E]",
    Private: "bg-gray-hover text-gray-light",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[13px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function StatCard({ value, label, info }: { value: string; label: string; info?: boolean }) {
  return (
    <div className="flex items-baseline gap-2 rounded-xl border border-gray-stroke bg-white px-5 py-6">
      <span className="text-[24px] font-semibold text-gray-dark">{value}</span>
      <span className="flex items-center gap-1.5 text-[15px] text-gray-light">
        {label}
        {info && (
          <span className="flex text-gray-extra-light">
            <MaskIcon src={helpIcon} className="h-4 w-4" />
          </span>
        )}
      </span>
    </div>
  );
}

// ── "Types of content" cards — generated gradient covers ──
type ContentType = { title: string; desc: string; cover: React.ReactNode };

function GuidesCover() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg, #6FA8F5 0%, #4B84E0 100%)" }}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px] fill-[#4B84E0]"><path d="M8 5v14l11-7z" /></svg>
      </span>
    </div>
  );
}
function PdfsCover() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "linear-gradient(135deg, #F4A08C 0%, #E97B60 100%)" }}>
      <div className="absolute left-1/2 top-1/2 h-[70px] w-[52px] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-[3px] bg-white shadow-md" />
      <div className="absolute left-1/2 top-1/2 h-[70px] w-[52px] -translate-x-1/2 -translate-y-1/2 translate-x-[10px] rotate-[6deg] rounded-[3px] bg-white/95 shadow-md" />
    </div>
  );
}
function TemplatesCover() {
  return (
    <div className="relative flex h-full w-full items-end justify-center px-4" style={{ background: "linear-gradient(135deg, #6FC7A0 0%, #46A97D 100%)" }}>
      <div className="w-full rounded-t-[4px] bg-white px-2.5 pt-2 shadow-md">
        <div className="mb-1.5 h-1.5 w-8 rounded-full bg-[#46A97D]" />
        <div className="mb-1 h-1 w-full rounded-full bg-gray-stroke" />
        <div className="mb-1 h-1 w-3/4 rounded-full bg-gray-stroke" />
        <div className="mb-2 h-1 w-5/6 rounded-full bg-gray-stroke" />
      </div>
    </div>
  );
}
function PracticeCover() {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #A18BE0 0%, #7C5FCB 100%)" }}>
      <div className="w-full rounded-[6px] bg-white p-2.5 shadow-md">
        <div className="mb-1 h-1 w-16 rounded-full bg-gray-dark/70" />
        <div className="mb-2 h-1 w-10 rounded-full bg-gray-stroke" />
        <div className="mb-2 h-1.5 w-full rounded-full bg-gray-stroke">
          <div className="h-1.5 w-1/4 rounded-full bg-[#7C5FCB]" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-4 flex-1 rounded-[3px] bg-gray-hover" />
          <div className="h-4 flex-1 rounded-[3px] bg-gray-dark" />
        </div>
      </div>
    </div>
  );
}
function ToolsCover() {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #F0C46B 0%, #E0A93F 100%)" }}>
      <div className="w-full overflow-hidden rounded-[5px] bg-white shadow-md">
        <div className="flex border-b border-gray-stroke">
          <div className="h-4 flex-1 border-r border-gray-stroke bg-[#F0F7F2]" />
          <div className="h-4 flex-1 border-r border-gray-stroke bg-[#F0F7F2]" />
          <div className="h-4 flex-1 bg-[#F0F7F2]" />
        </div>
        {[0, 1, 2].map((r) => (
          <div key={r} className="flex border-b border-gray-stroke last:border-0">
            <div className="flex-1 border-r border-gray-stroke px-1.5 py-1"><div className="h-1 w-3/4 rounded-full bg-gray-stroke" /></div>
            <div className="flex-1 border-r border-gray-stroke px-1.5 py-1"><div className="h-1 w-1/2 rounded-full bg-gray-stroke" /></div>
            <div className="flex-1 px-1.5 py-1"><div className="h-1 w-2/3 rounded-full bg-gray-stroke" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CONTENT_TYPES: ContentType[] = [
  { title: "Guides", desc: "Submit educational content, like videos, slide decks or PDFs. (e.g. “How to ace your HBS interview”, or “LSAT question types”).", cover: <GuidesCover /> },
  { title: "PDFs", desc: "Share real-world examples, like resumes, essays, or interview recordings. Be sure to get permission to submit someone else’s content.", cover: <PdfsCover /> },
  { title: "Templates", desc: "Help the user get started with a template, like a networking email template, a brainstorming framework, or a downloadable financial model.", cover: <TemplatesCover /> },
  { title: "Practice Exercises", desc: "Give users an easy way to apply what they’re learning—e.g. a list of unanswered interview questions or worksheet of practice problems.", cover: <PracticeCover /> },
  { title: "Tools", desc: "Give the user something to support their goal progress, like an application tracker, task prioritizer, or decision matrix.", cover: <ToolsCover /> },
];

// ── FAQ data ──
const FAQS: { icon: string; q: string; a: React.ReactNode }[] = [
  { icon: helpIcon, q: "What is Leland+?", a: "Leland+ is a collection of expert resources and tools from vetted Leland coaches like you. Coaches contribute examples, templates, guides, courses, and more — and earn money as users engage with that content." },
  { icon: editIcon, q: "Will I retain ownership of my content?", a: <>Yes. Coaches are owners of the content they create, package, and sell on Leland. This means that Leland expects coaches to have the rights to distribute any content they submit. Read the full terms <a href="#" className="text-gray-dark underline">here</a>.</> },
  { icon: stackIcon, q: "How do Leland+ payouts work?", a: "Each month, 50% of Leland+ revenue is paid out to contributors based on engagement. The more time users spend viewing your resources, the more you earn. Payouts are issued on the first day of each month." },
  { icon: bookOpenIcon, q: "Can I submit resources for any category?", a: "Yes! Leland+ is available in dozens of categories today and we’re always introducing more. Being an early contributor to an emerging category is a great way to get your resources seen." },
  { icon: lockIcon, q: "Do coaches get access to Leland+?", a: "When you contribute your first resource, you’ll also unlock Leland+ access yourself to learn from other top experts on the platform." },
];

const EXTERNAL_ARROW = (
  <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H8M17 7v9" />
  </svg>
);

export default function CoachContent() {
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Leland Prototype | Content";
  }, []);

  return (
    <div className="pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">Contribute to Leland+</h1>
          <p className="mt-2 text-[15px] text-gray-light">
            Upload content and earn passive income.{" "}
            <a href="#" className="inline-flex items-center gap-1 text-gray-dark underline">
              See content requests from Leland
              <span className="flex">{EXTERNAL_ARROW}</span>
            </a>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="md" variant="secondary">Browse Leland+</Button>
          <Button size="md" variant="dark">Submit a resource</Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard value="$1,984.55" label="Total earnings" info />
        <StatCard value="8.5k" label="Views" />
        <StatCard value="251" label="Likes" />
      </div>

      {/* ── Your resources ── */}
      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[22px] font-semibold text-gray-dark">Your resources</h2>
          <p className="mt-1 text-[15px] text-gray-light">Leland+ payouts are calculated once a month based on engagement. Last updated Aug 1.</p>
        </div>
        <button className="flex shrink-0 items-center justify-between gap-8 rounded-lg border border-gray-stroke bg-white px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
          Date added
          <MaskIcon src={chevronDownIcon} className="h-4 w-4 text-gray-light" />
        </button>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-xl border border-gray-stroke">
        {/* Header row */}
        <div className="hidden bg-gray-hover px-6 py-3.5 text-[13px] font-medium text-gray-light md:grid md:grid-cols-[1fr_100px_80px_80px_110px_72px] md:items-center md:gap-4">
          <span>Resource Title</span>
          <span>Earnings</span>
          <span>Likes</span>
          <span>Views</span>
          <span>Status</span>
          <span />
        </div>
        {/* Rows */}
        {RESOURCES.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-2 border-t border-gray-stroke px-6 py-4 md:grid-cols-[1fr_100px_80px_80px_110px_72px] md:items-center md:gap-4"
          >
            <div className="min-w-0">
              <p className="text-[15px] font-medium leading-snug text-gray-dark">{r.title}</p>
              <p className="mt-0.5 text-[13px] text-gray-extra-light">Uploaded {r.date}</p>
            </div>
            <div className="flex items-center gap-3 text-[14px] text-gray-dark md:contents">
              <span className="md:block">{r.earnings}</span>
              <span className="flex items-center gap-1.5 text-gray-light">
                <MaskIcon src={likesIcon} className="h-4 w-4" />
                {r.likes}
              </span>
              <span className="flex items-center gap-1.5 text-gray-light">
                <MaskIcon src={eyeIcon} className="h-4 w-4" />
                {r.views}
              </span>
              <span><StatusPill status={r.status} /></span>
              <span className="flex items-center justify-end gap-1 text-gray-light">
                <button className="flex rounded-md p-1.5 transition-colors hover:bg-gray-hover hover:text-gray-dark">
                  <MaskIcon src={linkExternalIcon} className="h-[18px] w-[18px]" />
                </button>
                <button className="flex rounded-md p-1.5 transition-colors hover:bg-gray-hover hover:text-gray-dark">
                  <MaskIcon src={dotsIcon} className="h-[18px] w-[18px]" />
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-stroke bg-white text-gray-light transition-colors hover:bg-gray-hover"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`h-9 w-9 rounded-lg text-[14px] font-medium transition-colors ${
              page === n ? "bg-gray-dark text-white" : "border border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(5, p + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-stroke bg-white text-gray-light transition-colors hover:bg-gray-hover"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* ── Types of content ── */}
      <div className="mt-16">
        <h2 className="text-[22px] font-semibold text-gray-dark">Types of content you can submit</h2>
        <a href="#" className="mt-1 inline-flex items-center gap-1 text-[15px] text-gray-light underline">
          See our content creation guidelines
          <span className="flex">{EXTERNAL_ARROW}</span>
        </a>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CONTENT_TYPES.map((c) => (
            <div key={c.title} className="flex flex-col overflow-hidden rounded-xl border border-gray-stroke bg-white">
              <div className="aspect-[16/10] w-full">{c.cover}</div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[16px] font-semibold text-gray-dark">{c.title}</h3>
                <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-gray-light">{c.desc}</p>
                <a href="#" className="mt-3 inline-block text-[14px] font-medium text-gray-dark underline">See examples</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Course banner ── */}
      <div className="mt-8 flex flex-col items-start gap-5 rounded-2xl bg-gray-hover p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <img src={courseThumb} alt="" className="h-[72px] w-[104px] shrink-0 rounded-lg object-cover" />
          <div>
            <h3 className="text-[20px] font-semibold text-gray-dark">Interested in creating a course?</h3>
            <p className="mt-1 max-w-xl text-[15px] text-gray-light">
              Courses are a popular way to explore Leland+, as they help users learn through structured paths.{" "}
              <a href="#" className="text-gray-dark underline">Learn more</a>
            </p>
          </div>
        </div>
        <LinkButton size="md" variant="white" href="#" className="shrink-0 border border-gray-stroke">
          Submit a course outline
          <span className="flex">{EXTERNAL_ARROW}</span>
        </LinkButton>
      </div>

      {/* ── FAQ ── */}
      <div className="mt-16">
        <h2 className="text-[22px] font-semibold text-gray-dark">Frequently asked questions</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark">
                <MaskIcon src={f.icon} className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h3 className="text-[16px] font-semibold text-gray-dark">{f.q}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-gray-light">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
