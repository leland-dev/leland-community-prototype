import React from "react";
import { ChevronRight, Star } from "lucide-react";
import lelandProfile from "../assets/leland-logos/leland-profile.png";

/* ──────────────────────────────────────────────────────────────────────────
   Notifications — modular design system

   Every notification is a NotificationItem composed of up to four parts:
     1. Source      — who it's from (a person, a group of people, or Leland)
     2. Description — the action text ("liked your post")
     3. Reference   — optional card for the thing being referenced (post,
                      livestream, session, order, review, payout…)
     4. CTA         — optional action (button or status pill)

   Compose a notification by rendering <NotificationItem> with a <ReferenceCard>
   and/or a CTA inside it. The pieces below are the full vocabulary.
   ────────────────────────────────────────────────────────────────────────── */

/* ── Source / avatar ──────────────────────────────────────────────────────── */

type Source =
  | { kind: "user"; name: string; avatar: string }
  // Aggregated actors: label is pre-formatted, e.g. "Justin S. and 12 others".
  | { kind: "group"; label: string; avatars: string[] }
  // A platform notification from Leland itself.
  | { kind: "leland" };

const avatarRing = "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]";

function LelandBadge() {
  return (
    <img
      src={lelandProfile}
      alt="Leland"
      className={`h-9 w-9 rounded-full object-cover ${avatarRing}`}
    />
  );
}

function SourceAvatar({ source }: { source: Source }) {
  if (source.kind === "leland") return <LelandBadge />;

  if (source.kind === "group") {
    const [a, b] = source.avatars;
    return (
      <div className="relative h-9 w-9 shrink-0">
        <img
          src={a}
          alt=""
          className={`absolute left-0 top-0 h-6 w-6 rounded-full object-cover ${avatarRing}`}
        />
        <img
          src={b}
          alt=""
          className={`absolute bottom-0 right-0 h-6 w-6 rounded-full object-cover ring-2 ring-white ${avatarRing}`}
        />
      </div>
    );
  }

  return (
    <img
      src={source.avatar}
      alt={source.name}
      className={`h-9 w-9 shrink-0 rounded-full object-cover ${avatarRing}`}
    />
  );
}

/* The bold-name + muted-action description line. */
function Description({ source, action }: { source: Source; action: React.ReactNode }) {
  const name = source.kind === "user" ? source.name : source.kind === "group" ? source.label : "Leland";

  return (
    <p className="text-[15px] leading-[1.4] text-gray-light">
      {source.kind !== "leland" && (
        <span className="font-semibold text-gray-dark">{name} </span>
      )}
      {action}
    </p>
  );
}

/* ── NotificationItem — the row ───────────────────────────────────────────── */

interface NotificationItemProps {
  source: Source;
  action: React.ReactNode;
  timestamp: string;
  read?: boolean;
  /** Reference card and/or CTA, stacked under the description. */
  children?: React.ReactNode;
  /** Compact trailing control on the description row (e.g. a Follow button). */
  trailing?: React.ReactNode;
  onClick?: () => void;
}

export function NotificationItem({
  source,
  action,
  timestamp,
  read = true,
  children,
  trailing,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`relative flex gap-3 px-4 py-4 transition-colors ${
        children ? "items-start" : "items-center"
      } ${read ? "" : "bg-[#F0F6FE]"} ${
        onClick ? `cursor-pointer ${read ? "hover:bg-[rgba(34,34,34,0.03)]" : "hover:bg-[#E4EDFB]"}` : ""
      }`}
    >
      <div className="shrink-0">
        <SourceAvatar source={source} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Description source={source} action={action} />
          <div className="flex shrink-0 items-center gap-2 pt-px">
            <time className="text-[15px] text-gray-xlight">{timestamp}</time>
            {!read && <span className="h-2.5 w-2.5 rounded-full bg-red" />}
          </div>
        </div>

        {children && <div className="mt-2.5 space-y-2">{children}</div>}
      </div>

      {trailing && <div className="flex shrink-0 items-center self-center">{trailing}</div>}
    </div>
  );
}

/* ── ReferenceCard — the thing being referenced ───────────────────────────── */

interface ReferenceCardProps {
  /** Leading thumbnail: an <img>, icon tile, or avatar. */
  thumbnail?: React.ReactNode;
  title?: React.ReactNode;
  /** Meta line under the title, e.g. "Apr 5 at 7:30 PM · 30m". */
  subtitle?: React.ReactNode;
  /** Multi-line excerpt (post / comment body). Clamped to 2 lines. */
  excerpt?: React.ReactNode;
  /** Footer row, e.g. "14 likes · 2 comments" or an outcome chip. */
  footer?: React.ReactNode;
  /** Right side: a CTA button, a <StatusPill>, or (default) a chevron. */
  trailing?: React.ReactNode;
  /** Set false to drop the default chevron on clickable cards. */
  chevron?: boolean;
  onClick?: () => void;
}

export function ReferenceCard({
  thumbnail,
  title,
  subtitle,
  excerpt,
  footer,
  trailing,
  chevron = true,
  onClick,
}: ReferenceCardProps) {
  const showChevron = !trailing && chevron && !!onClick;

  return (
    <div
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      className={`flex items-center gap-3 rounded-[10px] border border-gray-stroke bg-white p-3 shadow-[0_1px_2px_rgba(34,34,34,0.06)] transition-colors ${
        onClick ? "cursor-pointer hover:border-leland-gray-stroke-dark" : ""
      }`}
    >
      {thumbnail && <div className="shrink-0">{thumbnail}</div>}

      <div className="min-w-0 flex-1">
        {title && (
          <div className="truncate text-[14px] font-semibold leading-[1.3] text-gray-dark">
            {title}
          </div>
        )}
        {excerpt && (
          <p className="line-clamp-2 text-[14px] leading-[1.45] text-gray-light">{excerpt}</p>
        )}
        {subtitle && (
          <div className="mt-0.5 text-[13px] leading-[1.3] text-gray-extra-light">{subtitle}</div>
        )}
        {footer && <div className="mt-1.5 text-[13px] text-gray-extra-light">{footer}</div>}
      </div>

      {trailing && <div className="shrink-0 self-center">{trailing}</div>}
      {showChevron && <ChevronRight size={18} className="shrink-0 self-center text-gray-xlight" />}
    </div>
  );
}

/* ── Thumbnails ───────────────────────────────────────────────────────────── */

/** Rounded image thumbnail for events, livestreams, posts with media. */
export function ThumbImage({ src, alt = "" }: { src: string; alt?: string }) {
  return <img src={src} alt={alt} className="h-11 w-11 rounded-lg object-cover" />;
}

/** Icon tile for resources / documents. */
export function ThumbIcon({ src }: { src: string }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-hover">
      <img src={src} alt="" className="h-5 w-5 opacity-60" />
    </div>
  );
}

/** Apple-style calendar-day chip for session / dated references. The cancelled
    variant greys out the header bar and strikes through the day. */
export function ThumbCalendar({ day, cancelled = false }: { day: number | string; cancelled?: boolean }) {
  return (
    <div
      className="flex h-[36px] w-[36px] shrink-0 flex-col overflow-hidden rounded-[8px] bg-white"
      style={{ boxShadow: "0 1px 3px 0 rgba(16,24,40,0.10), 0 1px 2px 0 rgba(16,24,40,0.06)" }}
    >
      <div
        className={`h-[10px] w-full shrink-0 ${cancelled ? "bg-gray-hover" : ""}`}
        style={cancelled ? undefined : { backgroundColor: "#80ACED" }}
      />
      <div className="flex flex-1 items-center justify-center pb-[2px]">
        <span
          className={`text-[16px] font-semibold leading-[1.2] ${
            cancelled ? "text-gray-extra-light" : "text-gray-dark"
          }`}
        >
          {day}
        </span>
      </div>
    </div>
  );
}

/* ── StatusPill — non-interactive status (e.g. "Starts in 2d 4h") ─────────── */

export function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-gray-hover px-3 py-2 text-[13px] font-semibold text-gray-extra-light">
      {children}
    </span>
  );
}

/* ── Rating — compact star row for review references ──────────────────────── */

export function Rating({ value }: { value: number }) {
  return (
    <div className="mb-1 flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={13}
          className={i < Math.round(value) ? "fill-leland-yellow text-leland-yellow" : "text-gray-stroke"}
        />
      ))}
      <span className="ml-0.5 text-[13px] font-medium text-gray-dark">{value.toFixed(1)}</span>
    </div>
  );
}

/* ── OutcomeChip — "Landed a role at Atlassian" style footer chip ─────────── */

export function OutcomeChip({ logos, children }: { logos?: string[]; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-t border-gray-stroke pt-2">
      {logos && logos.length > 0 && (
        <div className="flex -space-x-1">
          {logos.map((l, i) => (
            <img
              key={i}
              src={l}
              alt=""
              className="h-4 w-4 rounded-[3px] object-cover ring-1 ring-white"
            />
          ))}
        </div>
      )}
      <span className="text-[13px] text-gray-light">{children}</span>
    </div>
  );
}

/* ── SectionHeader ────────────────────────────────────────────────────────── */

export function NotificationSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-1 px-3 text-[15px] font-semibold text-gray-dark">{title}</h2>
      <div className="divide-y divide-gray-stroke/60">{children}</div>
    </section>
  );
}
