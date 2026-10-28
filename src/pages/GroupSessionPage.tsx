import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { getOfferingBySlug, type Offering } from "../lib/offerings";
import {
  getGroupSession,
  getGroupSessionsForOffering,
  BUNDLED_PRODUCTS,
  ATTENDEES,
  STANDALONE_SESSION_KEY,
  isStandaloneSessionMode,
  WAITLIST_KEY,
  isWaitlistMode,
  getCohorts,
  type GroupSession,
  type SessionSlot,
  type BundledProduct,
} from "../lib/groupSessions";
import { COACH } from "./OfferingPage";
import { CalendarIcon } from "../components/SessionCard";
import samanthaPhoto from "../assets/profile photos/pic-6.png";
import videoIcon from "../assets/icons/video-icon.svg";
import lockIcon from "../assets/icons/lock-outline.svg";
import checkmarkFilledIcon from "../assets/icons/checkmark-filled.svg";
import starIcon from "../assets/icons/star.svg";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import shareArrowIcon from "../assets/icons/share-arrow.svg";

// Customer-facing page for a single group session. It's a sub-page of the
// offering (/offering/:slug/session/:id) that experts can share on its own, so
// the layout follows the livestream event page — but access is gated behind the
// parent offering, and the rest of the bundle stays visible throughout. Dates
// come from the offering's cohorts (?cohort= picks one; defaults to the soonest).

const formatMoney = (n: number) => `$${n.toLocaleString("en-US")}`;
const parseMoney = (s?: string) => Number((s ?? "").replace(/[^0-9.]/g, "")) || 0;

const productIcon: Record<BundledProduct["kind"], string> = {
  "coaching-time": hourglassIcon,
  content: bookOpenIcon,
  course: myCoursesIcon,
};

// Medium calendar chip — same 48px width as the icon tiles below it. Undated
// (waitlisted) sessions show "TBA".
function DateTile({ slot }: { slot?: SessionSlot }) {
  return slot ? <CalendarIcon size="md" month={slot.month} day={slot.day} /> : <CalendarIcon size="md" month="TBA" day="–" />;
}

function IconTile({ src }: { src: string }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-stroke">
      <img src={src} alt="" className="h-5 w-5" />
    </span>
  );
}

// Small switch, matching the offering page's admin Toggle.
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-[#222222]" : "bg-[#d9d9d9]"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

// Prototype-only admin menu — previews the page as someone who already bought
// the offering (RSVP instead of purchase), or as an offering whose only product
// is this session (no bundle to surface).
function AdminMenu({ toggles }: { toggles: { label: string; checked: boolean; onChange: () => void }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-xl border border-gray-stroke bg-white p-1 shadow-lg">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-light">Admin</p>
            {toggles.map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2">
                <span className="text-[14px] font-medium text-gray-dark">{t.label}</span>
                <Toggle checked={t.checked} onChange={t.onChange} />
              </div>
            ))}
          </div>
        </>
      )}
      <button
        type="button"
        aria-label="Admin menu"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-stroke bg-white shadow-lg transition-colors ${open ? "text-gray-dark" : "text-gray-light hover:text-gray-dark"}`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
    </div>
  );
}

// "2d 4h 6m" — drops zero units, always keeps minutes.
function formatCountdown(ms: number) {
  const totalMin = Math.max(0, Math.ceil(ms / 60_000));
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const minutes = totalMin % 60;
  return [days && `${days}d`, hours && `${hours}h`, `${minutes}m`].filter(Boolean).join(" ");
}

// The bottom of the event card. Without access it sells the parent offering
// (the only way in); owners are assumed RSVP'd, so they just see a countdown.
// Standalone sessions skip the offering entirely and sell the seat directly.
function AccessPanel({
  offering,
  session,
  productCount,
  purchased,
  standalone,
  waitlist,
  startsIn,
  onViewOffering,
}: {
  offering: Offering;
  session: GroupSession;
  productCount: number;
  purchased: boolean;
  standalone: boolean;
  waitlist: boolean;
  startsIn: string;
  onViewOffering: () => void;
}) {
  if (purchased) {
    return (
      <div className="border-t border-gray-stroke p-5">
        <p className="mb-4 flex items-center gap-2 text-[14px] text-gray-light">
          {/* Green "you're in" check: light green disc, dark green tick. */}
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E5F3EC]">
            <svg className="h-2.5 w-2.5 text-[#1B7A4B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          {standalone ? (
            "You're registered for this session"
          ) : (
            <>Included in your <span className="font-medium text-gray-dark">{offering.title}</span></>
          )}
        </p>
        <Button size="lg" variant="secondary" rounded="rounded-full" className="w-full text-[15px]" disabled>
          Starts in {startsIn}
        </Button>
      </div>
    );
  }

  if (standalone) {
    return (
      <div className="border-t border-gray-stroke p-5">
        <Button size="lg" variant="primary" rounded="rounded-full" className="w-full text-[15px]">
          {waitlist ? "Join waitlist" : `Register · ${formatMoney(session.price)}`}
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-stroke p-5">
      <p className="mb-3 flex items-center gap-2 text-[14px] text-gray-light">
        <img src={lockIcon} alt="" className="h-4 w-4 opacity-70" />
        This session is included with
      </p>
      {/* The parent offering, front and center — tapping it opens the offering. */}
      <button
        type="button"
        onClick={onViewOffering}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-stroke p-2.5 text-left transition-colors hover:bg-[#fafafa]"
      >
        <img src={offering.image} alt="" className="h-14 w-[106px] shrink-0 rounded-lg object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-gray-dark">{offering.title}</span>
          <span className="block text-[14px] text-gray-light">
            {productCount} products · {offering.startingAt ? "from " : ""}
            {offering.price}
            {offering.origPrice && <span className="ml-1 text-gray-extra-light line-through">{offering.origPrice}</span>}
          </span>
        </span>
        <svg className="mr-1 h-4 w-4 shrink-0 text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </button>
      <Button size="lg" variant="primary" rounded="rounded-full" className="mt-4 w-full text-[15px]">
        {waitlist ? "Join waitlist" : `Get access · ${offering.price}`}
      </Button>
      <Button size="lg" variant="secondary" rounded="rounded-full" className="mt-2 w-full text-[15px]" onClick={onViewOffering}>
        See everything included
      </Button>
    </div>
  );
}

export default function GroupSessionPage() {
  const { slug, sessionId } = useParams<{ slug: string; sessionId: string }>();
  const navigate = useNavigate();
  const offering = getOfferingBySlug(slug);
  const session = getGroupSession(slug, sessionId);
  const siblings = getGroupSessionsForOffering(slug);
  const bundled = BUNDLED_PRODUCTS[slug ?? ""] ?? [];

  const [purchased, setPurchased] = useState<boolean>(() => {
    try { return localStorage.getItem("group-session-purchased") === "1"; } catch { return false; }
  });
  const togglePurchased = () =>
    setPurchased((v) => {
      const next = !v;
      try { localStorage.setItem("group-session-purchased", next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  const [standalone, setStandalone] = useState<boolean>(isStandaloneSessionMode);
  const toggleStandalone = () =>
    setStandalone((v) => {
      const next = !v;
      try { localStorage.setItem(STANDALONE_SESSION_KEY, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  const [waitlist, setWaitlist] = useState<boolean>(isWaitlistMode);
  const toggleWaitlist = () =>
    setWaitlist((v) => {
      const next = !v;
      try { localStorage.setItem(WAITLIST_KEY, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Which cohort's dates to show — from ?cohort=, else the soonest. None while
  // waitlisted (every cohort has passed).
  const [searchParams, setSearchParams] = useSearchParams();
  const cohorts = getCohorts(slug);
  const cohort = waitlist ? undefined : cohorts.find((c) => c.id === searchParams.get("cohort")) ?? cohorts[0];
  const pickCohort = (id: string) => setSearchParams({ cohort: id }, { replace: true });
  const cohortQuery = cohort ? `?cohort=${cohort.id}` : "";

  // Prototype countdown: the session starts a fixed 2d 4h 6m after page load,
  // ticking down once a minute.
  const [startAt] = useState(() => Date.now() + ((2 * 24 + 4) * 60 + 6) * 60_000);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  const startsIn = formatCountdown(startAt - now);

  useEffect(() => {
    document.title = session ? `Leland | ${session.name}` : "Leland | Group session";
    window.scrollTo(0, 0);
  }, [session]);

  if (!offering || !session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
        <p className="text-[18px] font-semibold text-gray-dark">Session not found</p>
        <Link to={offering ? `/offering/${offering.slug}` : "/profile/samantha-parker"} className="text-[15px] font-medium text-gray-light underline">
          Back to {offering ? offering.title : "profile"}
        </Link>
      </div>
    );
  }

  const offeringUrl = `/offering/${offering.slug}`;
  const viewOffering = () => navigate(offeringUrl);
  const productCount = siblings.length + bundled.length;
  const slot = cohort?.sessions[session.id];
  const enrolled = cohort?.enrolled ?? 0;
  const total = parseMoney(offering.price);
  const subtotal = parseMoney(offering.origPrice) || total;

  const share = () => {
    try { void navigator.clipboard?.writeText(window.location.href); } catch { /* ignore */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:py-12 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Left: cover, attendees, host — mirrors the livestream page. */}
          <aside className="flex w-full flex-col gap-8 lg:w-[400px] lg:shrink-0">
            <img src={session.image} alt="" className="aspect-[1200/630] w-full rounded-2xl object-cover" />

            {enrolled > 2 && (
              <div className="order-last lg:order-none">
                <p className="text-[18px] font-medium text-gray-dark">{enrolled} people going</p>
                <div className="mt-3 flex items-center">
                  {ATTENDEES.map((a, i) => (
                    <img key={a.name} src={a.photo} alt="" className={`h-8 w-8 rounded-full border-2 border-white object-cover ${i > 0 ? "-ml-2" : ""}`} />
                  ))}
                </div>
                <p className="mt-2 text-[15px] text-gray-light">
                  {ATTENDEES[0].name}, {ATTENDEES[1].name}, and {enrolled - 2} others
                </p>
              </div>
            )}

            <div className="order-last lg:order-none">
              <p className="mb-3 text-[18px] font-medium text-gray-dark">Hosted by</p>
              <div className="rounded-2xl border border-gray-stroke p-4">
                <div className="flex items-start gap-3">
                  <img src={samanthaPhoto} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/profile/${COACH.slug}`} className="text-[15px] font-semibold text-gray-dark hover:underline">{COACH.name}</Link>
                    <p className="mt-0.5 flex items-center gap-1 text-[14px] text-gray-light">
                      <img src={starIcon} alt="" className="h-3.5 w-3.5" />
                      <span className="font-medium text-gray-dark">{COACH.rating.toFixed(1)}</span>
                      <span>({COACH.reviewCount})</span>
                    </p>
                  </div>
                  <Button size="md" variant="secondary" rounded="rounded-full" className="font-semibold">Follow</Button>
                </div>
                <p className="mt-3 text-[15px] leading-snug text-gray-dark">{COACH.headline}</p>
              </div>
            </div>
          </aside>

          {/* Right: title, event card with access, details, the rest of the bundle. */}
          <main className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[13px] font-medium text-gray-dark">
                  <img src={videoIcon} alt="" className="h-4 w-4" />
                  Group session
                </p>
                <h1 className="font-serif text-[32px] leading-tight text-gray-dark md:text-[40px]">{session.name}</h1>
              </div>
              {/* Icon-only share; briefly swaps to a checkmark once the link is copied. */}
              <Button size="md" variant="secondary" iconOnly className="mt-1 shrink-0" onClick={share} aria-label={copied ? "Link copied" : "Share"} title={copied ? "Link copied" : "Share"}>
                <img src={copied ? checkmarkFilledIcon : shareArrowIcon} alt="" className="h-5 w-5" />
              </Button>
            </div>

            {/* Event card — schedule + format, with the access panel underneath. */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-stroke">
              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center gap-4">
                  <DateTile slot={slot} />
                  <div>
                    <p className="text-[15px] font-semibold text-gray-dark">{slot ? slot.dateLabel : "Dates to be announced"}</p>
                    <p className="text-[14px] text-gray-light">{slot ? `${slot.timeLabel} · ` : ""}{session.durationMin} min</p>
                  </div>
                </div>
                {/* Other cohorts' dates for this session — pick before buying. */}
                {!purchased && cohort && cohorts.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2 sm:pl-16">
                    <span className="text-[13px] text-gray-light">Also offered:</span>
                    {cohorts.map((c) => {
                      const sl = c.sessions[session.id];
                      if (!sl) return null;
                      const active = c.id === cohort.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => pickCohort(c.id)}
                          aria-pressed={active}
                          className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${active ? "border-gray-dark bg-gray-dark text-white" : "border-gray-stroke text-gray-dark hover:border-[#c9c9c9]"}`}
                        >
                          {sl.month} {sl.day}
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <IconTile src={videoIcon} />
                  <div>
                    <p className="text-[15px] font-semibold text-gray-dark">Live virtual session</p>
                    <p className="text-[14px] text-gray-light">Join link shared with attendees before it starts</p>
                  </div>
                </div>
              </div>
              <AccessPanel
                offering={offering}
                session={session}
                productCount={productCount}
                purchased={purchased}
                standalone={standalone}
                waitlist={waitlist}
                startsIn={startsIn}
                onViewOffering={viewOffering}
              />
            </div>

            {/* About */}
            <section className="mt-10">
              <h2 className="mb-3 text-[20px] font-semibold text-gray-dark">About this session</h2>
              {/* Collapsed: the paragraphs run together, clamped to 3 lines. */}
              <div className="flex flex-col gap-4 text-[16px] leading-[1.6] text-gray-dark">
                {expanded
                  ? session.description.map((p, i) => <p key={i}>{p}</p>)
                  : <p className="line-clamp-3">{session.description.join(" ")}</p>}
              </div>
              {session.description.join(" ").length > 260 && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-2 cursor-pointer text-[15px] font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px]"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </section>

            {/* Agenda */}
            <section className="mt-10">
              <h2 className="mb-4 text-[20px] font-semibold text-gray-dark">What we'll cover</h2>
              <ul className="flex flex-col gap-3">
                {session.agenda.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <img src={checkmarkFilledIcon} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-[16px] leading-snug text-gray-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* The rest of the bundle — the same product list as the offering
                page, with this session pinned and highlighted at the top.
                Hidden for standalone sessions, which have no bundle. */}
            {!standalone && (
              <section className="mt-10">
                <h2 className="text-[20px] font-semibold text-gray-dark">
                  {purchased ? "Also in your offering" : `Everything in ${offering.title}`}
                </h2>
                <p className="mb-4 mt-1 text-[15px] text-gray-light">
                  {purchased ? "You already have access to all of these." : "One purchase unlocks this session and everything below."}
                </p>
                <div className="overflow-hidden rounded-2xl border border-gray-stroke px-4">
                  {siblings.map((s) => {
                    const current = s.id === session.id;
                    const sl = cohort?.sessions[s.id];
                    return (
                      <Link
                        key={s.id}
                        to={`${offeringUrl}/session/${s.id}${cohortQuery}`}
                        className={`-mx-4 flex items-center gap-3 border-b border-gray-stroke px-4 py-4 no-underline ${current ? "bg-[#f7f7f7]" : "hover:bg-[#fafafa]"}`}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                          <CalendarIcon day={sl?.day ?? "–"} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-[15px] font-semibold text-gray-dark">{s.name}</span>
                            {current && <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[12px] font-medium text-gray-light ring-1 ring-gray-stroke">Viewing</span>}
                          </span>
                          <span className="block text-[15px] text-gray-light">Group session · {sl ? sl.dateLabel : "Dates to be announced"}</span>
                        </span>
                      </Link>
                    );
                  })}
                  {bundled.map((p, i) => (
                    <div key={p.title} className={`flex items-center gap-3 py-4 ${i < bundled.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                        <img src={productIcon[p.kind]} alt="" className="h-[26px] w-[26px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold text-gray-dark">{p.title}</span>
                        <span className="block text-[15px] text-gray-light">{p.detail}</span>
                      </span>
                    </div>
                  ))}
                </div>

                {!purchased && (
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-baseline gap-2">
                      <span className="text-[16px] font-semibold text-gray-dark">Total</span>
                      {subtotal > total && <span className="text-[16px] text-gray-extra-light line-through decoration-1">{formatMoney(subtotal)}</span>}
                      <span className="text-[18px] font-semibold text-gray-dark">{offering.price}</span>
                    </span>
                    <Button size="md" variant="secondary" onClick={viewOffering}>
                      View full offering
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </Button>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>

      <AdminMenu
        toggles={[
          { label: "Viewer owns offering", checked: purchased, onChange: togglePurchased },
          { label: "Session is the only product", checked: standalone, onChange: toggleStandalone },
          { label: "No upcoming cohorts", checked: waitlist, onChange: toggleWaitlist },
        ]}
      />
    </div>
  );
}
