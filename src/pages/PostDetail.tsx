import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { nameToSlug } from "../lib/profileSlug";
import { motion, AnimatePresence } from "motion/react";

import { useSetRightSidebar } from "../components/RightSidebarContext";
import { useSetLeftSidebar } from "../components/LeftSidebarContext";
import { useSetNavBackHandler } from "../components/NavThemeContext";
import { useProfileBarMode } from "../contexts/ProfileBarModeContext";
import { FADE_TRANSITION, FADE_IN, FADE_OUT } from "../lib/pushTransition";
import { posts, type Post, FeedPost, FeedLikeButton, FeedRepostButton, FeedBookmarkButton, ShareDropdown, HomeRightSidebar, HomeSidebar, PollCard, usePostBase, POST_HOVER_SHADOW, VerifiedBadge } from "./Home";
import { Button } from "../components/Button";
import ImageLightbox from "../components/ImageLightbox";

import profilePhoto from "../assets/profile photos/profile photo.png";
import commentsIcon from "../assets/icons/comments.svg";
import sharesIcon from "../assets/icons/shares.svg";
import trashIcon from "../assets/icons/trash.svg";
import eyeClosedIcon from "../assets/icons/eye-closed.svg";
import reportFlagIcon from "../assets/icons/report-flag.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import checkIcon from "../assets/icons/check.svg";

import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic12 from "../assets/profile photos/pic-12.png";

// ─── Types ────────────────────────────────────────────

export interface CommentData {
  id: number;
  author: string;
  avatar: string;
  headline?: string;
  time: string;
  text: string;
  likes: number;
  replies?: CommentData[];
}

// ─── Mock comment seeds per post ─────────────────────

const COMMENT_SEEDS: CommentData[] = [
  {
    id: 1,
    author: "Priya Patel",
    avatar: pic3,
    headline: "HBS MBA '25",
    time: "1h",
    text: "This is exactly what I needed to hear today. Going through the process right now and it's easy to lose perspective. Thank you for sharing.",
    likes: 24,
    replies: [
      {
        id: 101,
        author: "James Allen",
        avatar: pic1,
        headline: "Admissions Expert",
        time: "45m",
        text: "You've got this! The process is hard but you're clearly putting in the work. Feel free to DM if you want to chat.",
        likes: 8,
      },
    ],
  },
  {
    id: 2,
    author: "Marcus Williams",
    avatar: pic2,
    time: "2h",
    text: "Completely agree. I've talked to so many people who got rejected with 760+ GMATs because their essays felt generic. The score opens the door — the story gets you in.",
    likes: 41,
    replies: [
      {
        id: 201,
        author: "David Kim",
        avatar: pic4,
        headline: "MBA Consultant · Ex-Bain",
        time: "1h",
        text: "This. A 700 with a compelling narrative beats a 780 with a bland one every time.",
        likes: 19,
      },
      {
        id: 202,
        author: "Emma Rodriguez",
        avatar: pic5,
        time: "55m",
        text: "Do you think this applies equally to R1 vs R2?",
        likes: 3,
      },
    ],
  },
  {
    id: 3,
    author: "Alex Thompson",
    avatar: pic8,
    headline: "Career Expert",
    time: "2h",
    text: "Sharing this with every client I have. The amount of time people spend obsessing over GMAT retakes when their essays are mediocre is genuinely painful to watch.",
    likes: 57,
  },
  {
    id: 4,
    author: "Rachel Nguyen",
    avatar: pic9,
    time: "3h",
    text: "How do you feel about the new GMAT Focus format? My prep material feels outdated.",
    likes: 12,
    replies: [
      {
        id: 401,
        author: "Michael Chen",
        avatar: pic10,
        headline: "Ex-BCG · Kellogg Adm.",
        time: "2h",
        text: "The Focus edition actually feels more like a real business problem set. I'd argue it's more predictive of MBA success than the old one.",
        likes: 22,
      },
    ],
  },
  {
    id: 5,
    author: "Olivia Park",
    avatar: pic11,
    time: "4h",
    text: "What score range do you think is 'good enough' to stop retaking and focus on essays?",
    likes: 9,
    replies: [
      {
        id: 501,
        author: "Lauren Hayes",
        avatar: pic12,
        headline: "HBS Admissions Expert",
        time: "3h",
        text: "Generally 700+ for most M7 programs, but it depends on your profile. If you're URM or international with a strong story, sometimes lower is fine. If you're an overrepresented demographic, you may want 720+.",
        likes: 31,
      },
    ],
  },
];

function offsetIds(comment: CommentData, offset: number): CommentData {
  return {
    ...comment,
    id: comment.id + offset,
    replies: comment.replies?.map(r => offsetIds(r, offset)),
  };
}

function getCommentsForPost(postId: number): CommentData[] {
  const count = 3 + (postId % 3);
  return COMMENT_SEEDS.slice(0, count).map(c => offsetIds(c, postId * 1000));
}

// Session-scoped comment store. Comments live here (keyed by post) rather than
// in PostDetail's local state so that replies composed on the focused reply
// page — and inline comments — persist across navigation instead of being
// wiped when PostDetail remounts and re-seeds.
const commentStore = new Map<number, CommentData[]>();

function insertReply(list: CommentData[], parentId: number, reply: CommentData): CommentData[] {
  return list.map(c =>
    c.id === parentId
      ? { ...c, replies: [reply, ...(c.replies ?? [])] }
      : c.replies
        ? { ...c, replies: insertReply(c.replies, parentId, reply) }
        : c,
  );
}

export function getPostComments(postId: number): CommentData[] {
  if (!commentStore.has(postId)) commentStore.set(postId, getCommentsForPost(postId));
  return commentStore.get(postId)!;
}

export function addPostComment(postId: number, comment: CommentData): void {
  commentStore.set(postId, [comment, ...getPostComments(postId)]);
}

export function addPostReply(postId: number, parentId: number, reply: CommentData): void {
  commentStore.set(postId, insertReply(getPostComments(postId), parentId, reply));
}

// ─── Sub-components ───────────────────────────────────

function AuthorRow({ post, featured = false }: { post: Post; featured?: boolean }) {
  const [following, setFollowing] = useState(false);
  const { mode: profileBarMode } = useProfileBarMode();
  // Person leads: a member's group post surfaces the person + a small group
  // badge; a pure group announcement stays the group.
  const gp = post.groupPoster;
  const name = gp?.name ?? post.author;
  const avatarSrc = gp?.avatar ?? post.avatar;
  const displayHeadline = gp?.headline ?? post.headline;
  const displayTime = profileBarMode === 3 ? "Aug 12" : post.time;
  // Verified experts show their headline as the subtext; everyone else gets a
  // "View profile" link.
  const isVerifiedExpert = Boolean(post.verified) && !gp && !post.isGroupPost;
  // Pure group announcements point at the group; people (incl. group posters)
  // link to their profile template.
  const profileTo = post.isGroupPost && !gp
    ? `/groups/${post.groupId ?? "ai-bp-apr-26"}`
    : `/profile/${nameToSlug(name)}`;
  return (
    // Minimal mode is a single name line, so center it against the avatar; the
    // title modes are two lines, so they top-align.
    <div className={`flex gap-3 ${profileBarMode === 1 ? "items-center" : "items-start"}`}>
      <Link to={profileTo} className="relative block shrink-0">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={name}
            className="h-11 w-11 rounded-full object-cover"
            style={{ objectPosition: "50% 15%" }}
          />
        ) : (
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[18px] font-semibold text-white"
            style={{ backgroundColor: post.groupColor ?? "#2563EB" }}
          >
            {post.author.charAt(0)}
          </div>
        )}
        {gp ? (
          <div
            className="absolute -bottom-1.5 -right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-[6px] border-2 border-white text-[11px] font-bold text-white"
            style={{ backgroundColor: post.groupColor ?? "#2563EB" }}
          >
            {post.author.charAt(0)}
          </div>
        ) : null}
        {/* Verified badge — bottom-right of the avatar, thin white outline. */}
        {post.verified && !gp && !post.isGroupPost ? (
          <VerifiedBadge className="absolute -bottom-1 -right-1 h-5 w-5" />
        ) : null}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link to={profileTo} className="text-[15px] font-semibold leading-tight text-gray-dark hover:underline">{name}</Link>
          {/* The featured post drops the inline "30m" timestamp in favour of the
              full date/time line below the name. */}
          {!featured ? <span className="shrink-0 text-[15px] leading-tight text-gray-extra-light">{displayTime}</span> : null}
        </div>
        {featured ? (
          isVerifiedExpert && displayHeadline ? (
            <p className="mt-0.5 truncate text-[14px] font-medium leading-tight text-gray-extra-light">{displayHeadline}</p>
          ) : (
            <p className="mt-0.5 truncate text-[14px] font-medium leading-tight text-gray-extra-light">Member since 2024</p>
          )
        ) : profileBarMode !== 1 && displayHeadline ? (
          <p className="mt-0.5 truncate text-[13px] leading-tight text-gray-light">{displayHeadline}</p>
        ) : null}
      </div>
      {/* Follow — dark pill by default; toggles to the gray (secondary) style
          with a checkmark once following. */}
      <Button
        size="sm"
        variant={following ? "secondary" : "dark"}
        rounded="rounded-full"
        onClick={() => setFollowing((f) => !f)}
        aria-label={following ? "Following" : "Follow"}
        className="shrink-0 self-start font-semibold"
      >
        {following ? (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Following
          </>
        ) : (
          "Follow"
        )}
      </Button>
    </div>
  );
}

function PostMedia({ post, onImageClick }: { post: Post; onImageClick?: (idx: number) => void }) {
  if (post.type === "image") {
    const imgs = post.images;
    if (imgs.length === 1) {
      return (
        <img
          src={imgs[0]}
          alt=""
          className={`mt-3 w-full rounded-xl object-cover${onImageClick ? " cursor-zoom-in" : ""}`}
          style={{ maxHeight: 480 }}
          onClick={onImageClick ? () => onImageClick(0) : undefined}
        />
      );
    }
    return (
      <div className={`mt-3 grid gap-1 ${imgs.length === 2 ? "grid-cols-2" : imgs.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {imgs.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className={`aspect-square w-full rounded-lg object-cover${onImageClick ? " cursor-zoom-in" : ""}`}
            onClick={onImageClick ? () => onImageClick(i) : undefined}
          />
        ))}
      </div>
    );
  }

  if (post.type === "link") {
    return (
      <a href={post.link.url} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-xl border border-gray-stroke">
        <img src={post.link.image} alt="" className="h-[200px] w-full object-cover" />
        <div className="px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-gray-light">{post.link.domain}</p>
          <p className="mt-0.5 text-[13px] font-semibold text-gray-dark">{post.link.title}</p>
        </div>
      </a>
    );
  }

  if (post.type === "event") {
    const { event } = post;
    return (
      <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
        <div className="relative">
          <img src={event.image} alt="" className="h-[200px] w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-gray-100/90 px-2.5 py-0.5 text-[10px] font-semibold text-gray-dark backdrop-blur-sm">
            {event.format}
          </span>
        </div>
        <div className="px-4 py-4">
          <h3 className="text-[15px] font-semibold text-gray-dark">{event.title}</h3>
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[12px] text-gray-light">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {event.date}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-gray-light">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {event.time}
            </div>
          </div>
          {event.spotsLeft != null ? (
            <p className="mt-2 text-[11px] text-gray-light">{event.spotsLeft} spots remaining</p>
          ) : null}
          <button className="mt-3 w-full rounded-lg bg-gray-100 py-2.5 text-[13px] font-medium text-gray-dark hover:bg-gray-200">
            Register for free
          </button>
        </div>
      </div>
    );
  }

  if (post.type === "milestone") {
    const { milestone } = post;
    return (
      <div className="relative mt-3 overflow-hidden rounded-xl border border-gray-stroke px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex shrink-0 items-center">
            <div
              className="relative z-0 flex h-14 w-14 items-center justify-center rounded-full text-[20px] font-bold text-white ring-2 ring-white"
              style={{ backgroundColor: milestone.schoolColor }}
            >
              {milestone.schoolInitial}
            </div>
            <div className="relative z-10 -ml-4 shrink-0">
              <img src={milestone.clientAvatar} alt={milestone.clientName} className="h-14 w-14 rounded-full object-cover ring-2 ring-white" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-light">
              {milestone.kind === "offer" ? "Offer signed" : "Admitted"}
            </p>
            <p className="text-[15px] font-semibold text-gray-dark">{milestone.school}</p>
            <p className="text-[12px] text-gray-light">{milestone.program}</p>
          </div>
        </div>
      </div>
    );
  }

  if (post.type === "session") {
    const { session } = post;
    return (
      <div className="relative mt-3 overflow-hidden rounded-xl border border-gray-stroke px-4 py-4">
        <div className="flex items-center gap-4">
          <img src={session.coachAvatar} alt={session.coachName} className="h-14 w-14 shrink-0 rounded-full object-cover" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-light">Session completed</p>
            <p className="text-[15px] font-semibold text-gray-dark">{session.topic}</p>
            <p className="text-[12px] text-gray-light">
              {session.duration} with {session.coachName}
              {session.sessionsTogether !== undefined ? <> · Session #{session.sessionsTogether}</> : null}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Compact view-count formatting (e.g. 2632 → "2.6K", 14500 → "15K").
function formatViews(n: number): string {
  if (n < 1000) return `${n}`;
  const k = n / 1000;
  return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}K`;
}

// The overflow (3-dot) menu that normally sits at a post's top-right; on the
// featured post it lives at the far right of the action row instead.
function PostOverflowMenu() {
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Menu-row icon — 20px asset-folder svg (4px smaller than the profile dropdown).
  const menuIcon = (src: string) => <img src={src} alt="" className="h-5 w-5 shrink-0" />;
  // Danger rows tint their icon to the row's red via a CSS mask (asset svgs are
  // pre-colored, so a plain <img> can't inherit the text color).
  const dangerIcon = (src: string) => (
    <span
      aria-hidden
      className="h-5 w-5 shrink-0 bg-current"
      style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
    />
  );
  const items: { label: string; icon: ReactNode; danger: boolean; onClick?: () => void }[] = [
    {
      label: following ? "Following" : "Follow",
      icon: menuIcon(following ? checkIcon : addPlusIcon),
      danger: false,
      onClick: () => setFollowing(f => !f),
    },
    {
      label: "Not interested",
      icon: menuIcon(eyeClosedIcon),
      danger: false,
    },
    {
      label: "Report post",
      icon: menuIcon(reportFlagIcon),
      danger: false,
    },
    {
      label: "Delete post",
      icon: dangerIcon(trashIcon),
      danger: true,
    },
  ];

  return (
    <div ref={ref} className="relative ml-auto shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="More"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
      >
        <svg className="h-[20px] w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute right-0 top-10 z-50 w-56 rounded-2xl border border-gray-stroke bg-white shadow-lg"
            >
              <div className="px-2 py-2">
                {items.map(item => (
                  <button
                    key={item.label}
                    onClick={() => { if (item.onClick) { item.onClick(); } else { setOpen(false); } }}
                    className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-left text-[14px] font-medium transition-colors hover:bg-[#222222]/5 ${item.danger ? "text-[#D92D20]" : "text-gray-dark"}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatsRow({ post, onCommentFocus }: { post: Post; onCommentFocus: () => void }) {
  const [shareOpen, setShareOpen] = useState(false);

  // -mx-2.5 cancels the buttons' px-2.5 so the heart glyph lines up flush with
  // the paragraph left edge. All five actions spread equally across the row.
  return (
    <div className="-mx-2.5 flex items-center justify-between py-1.5">
      <FeedLikeButton initialCount={post.likes} />
      {/* Comment — outline chat bubble, matches the feed action row */}
      <button
        onClick={onCommentFocus}
        className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2.5 py-1.5 text-gray-light transition-colors hover:bg-[#222222]/8"
      >
        <svg className="h-[22px] w-[22px] fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4.541 17.003C3.577 15.571 3 13.857 3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21C10.474 21 9.04 20.613 7.78 19.943C6.434 20.661 4.907 21.084 3.276 21.084C2.842 21.084 2.419 21.045 2 20.99C3.173 19.923 4.055 18.553 4.541 17.003Z" /></svg>
        {post.comments > 0 && <span className="text-[13px] font-medium">{post.comments.toLocaleString()}</span>}
      </button>
      {/* Repost */}
      <FeedRepostButton initialCount={post.reposts} />
      {/* Save */}
      <FeedBookmarkButton post={post} />
      {/* Share — swapped to the uploaded share.svg (upload glyph) */}
      <div className="relative">
        <button
          onClick={() => setShareOpen(o => !o)}
          className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2.5 py-1.5 text-gray-light transition-colors hover:bg-[#222222]/8"
        >
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 9h2c1.10457 0 2 .89543 2 2v8c0 1.10457-.89543 2-2 2h-10c-1.10457 0-2-.89543-2-2v-8c0-1.10457.89543-2 2-2h2" /><line x1="12" x2="12" y1="15" y2="3" /><polyline points="15,6 12,3 9,6" /></svg>
        </button>
        <AnimatePresence>
          {shareOpen ? <ShareDropdown post={post} onClose={() => setShareOpen(false)} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Comment components ───────────────────────────────

const HEART_PARTICLES = [
  { angle: -80,  r: 22, color: "#ff4757", size: 5 },
  { angle: -40,  r: 26, color: "#fd79a8", size: 4 },
  { angle: -10,  r: 20, color: "#ff6b81", size: 6 },
  { angle: 20,   r: 24, color: "#ff4757", size: 4 },
  { angle: 55,   r: 22, color: "#ff6348", size: 5 },
  { angle: 90,   r: 26, color: "#ff4757", size: 4 },
  { angle: 130,  r: 20, color: "#fd79a8", size: 6 },
  { angle: 160,  r: 24, color: "#ff6b81", size: 4 },
  { angle: 200,  r: 22, color: "#ff4757", size: 5 },
  { angle: 240,  r: 20, color: "#ff6348", size: 4 },
  { angle: 270,  r: 26, color: "#fd79a8", size: 5 },
  { angle: 310,  r: 22, color: "#ff4757", size: 4 },
];

function HeartButton({ liked, count, onToggle }: { liked: boolean; count: number; onToggle: () => void }) {
  const [burst, setBurst] = useState(false);

  const handleClick = () => {
    onToggle();
    if (!liked) { setBurst(true); setTimeout(() => setBurst(false), 700); }
  };

  return (
    <div className="relative flex items-center gap-1">
      {/* Balloon-pop particle burst — origin sits at the icon center, offset
          by the button's px-2 padding */}
      <div className="pointer-events-none absolute left-[15px] top-[13px]">
        <AnimatePresence>
          {burst ? HEART_PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [1, 1, 0],
                x: [0, Math.cos((p.angle * Math.PI) / 180) * p.r * 0.4, Math.cos((p.angle * Math.PI) / 180) * p.r],
                y: [0, Math.sin((p.angle * Math.PI) / 180) * p.r * 0.4, Math.sin((p.angle * Math.PI) / 180) * p.r + 6],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.55, ease: [0.2, 0, 0.8, 1], delay: i * 0.008 }}
            />
          )) : null}
        </AnimatePresence>
      </div>

      <button
        onClick={handleClick}
        className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 transition-colors hover:bg-gray-hover ${liked ? "text-red-500" : "text-[#555555]"}`}
      >
        <motion.svg
          className="h-[18px] w-[18px]"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.75"
          animate={liked
            ? { scale: [1, 0.6, 1.8, 0.9, 1.05, 1] }
            : { scale: 1 }
          }
          transition={{ duration: 0.5, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeOut" }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </motion.svg>
        <motion.span
          className="text-[12px] font-medium"
          animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {count}
        </motion.span>
      </button>
    </div>
  );
}

// Twitter model: every comment IS a post. It renders as a full post row
// (avatar · name · body · its own action bar), separated by dividers rather
// than thread lines, and tapping it opens the comment's own post page where
// its replies become the comments. Nested replies are never inlined here.
function CommentItem({ comment, postId }: { comment: CommentData; postId: number }) {
  const navigate = useNavigate();
  const postBase = usePostBase();
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const replies = comment.replies ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`${postBase}/${postId}/comment/${comment.id}`)}
      className="flex cursor-pointer gap-3 border-b border-gray-stroke/60 pt-3"
    >
      <img
        src={comment.avatar}
        alt={comment.author}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
        style={{ objectPosition: "50% 15%" }}
      />
      <div className="min-w-0 flex-1 pb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-medium text-gray-dark">{comment.author}</span>
          <span className="text-[15px] leading-tight text-gray-xlight">· {comment.time}</span>
        </div>
        {comment.headline ? (
          <p className="truncate text-[13px] leading-tight text-[#707070]">{comment.headline}</p>
        ) : null}
        <p className="mt-0.5 text-[15px] leading-[1.4] text-gray-dark">{comment.text}</p>
        {/* Full action row — taps here act on the comment, not the row */}
        <div className="mt-1 -ml-2 flex max-w-[260px] items-center justify-between" onClick={e => e.stopPropagation()}>
          {/* Reply */}
          <button
            onClick={() => navigate(`/reply/${postId}`, { state: { target: { kind: "comment", comment } } })}
            className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 text-[#555555] transition-colors hover:bg-gray-hover"
            aria-label="Reply"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 21C13.486 21.0018 14.9492 20.6339 16.2576 19.9293L20.3676 20.9755C20.4517 20.9969 20.5398 20.9961 20.6234 20.9731C20.707 20.9502 20.7832 20.9058 20.8445 20.8445C20.9058 20.7832 20.9501 20.707 20.9731 20.6234C20.9961 20.5398 20.9969 20.4517 20.9755 20.3676L19.9293 16.2576C20.8609 14.5226 21.1978 12.5299 20.8882 10.5851C20.5786 8.64022 19.6396 6.85061 18.2152 5.49065C16.7909 4.13068 14.9598 3.27543 13.0027 3.05604C11.0457 2.83664 9.07066 3.26522 7.38054 4.27604C5.69042 5.28687 4.3785 6.82414 3.64594 8.65215C2.91338 10.4802 2.80062 12.498 3.32495 14.3962C3.84928 16.2945 4.98176 17.9684 6.54873 19.1612C8.1157 20.354 10.0307 21 12 21Z" /></svg>
            {replies.length > 0 ? <span className="text-[12px] font-medium">{replies.length}</span> : null}
          </button>
          {/* Repost */}
          <button
            onClick={() => setReposted(r => !r)}
            className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 transition-colors hover:bg-gray-hover ${reposted ? "text-[#4F86DB]" : "text-[#555555]"}`}
            aria-label="Repost"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6.34204 6.34448C7.79104 4.89648 9.79204 4.00048 12.003 4.00048C16.424 4.00048 20.008 7.58248 20.008 12.0025C20.008 12.6105 19.934 13.2005 19.806 13.7695" />
              <path d="M17.658 17.6555C16.209 19.1035 14.208 19.9995 11.997 19.9995C7.576 19.9995 3.992 16.4175 3.992 11.9975C3.992 11.3895 4.066 10.7995 4.194 10.2305" />
            </svg>
            {reposted ? <span className="text-[12px] font-medium">1</span> : null}
          </button>
          {/* Like */}
          <HeartButton liked={liked} count={comment.likes + (liked ? 1 : 0)} onToggle={() => setLiked(l => !l)} />
          {/* Share */}
          <button className="flex cursor-pointer items-center rounded-full px-2 py-1.5 text-[#555555] transition-colors hover:bg-gray-hover" aria-label="Share">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11.082 8.95158V8.95158C6.196 9.503 2.50256 13.6346 2.5 18.5516V19.1636H2.5C4.62349 16.6055 7.75786 15.1019 11.082 15.0466V18.2736V18.2733C11.082 18.9482 11.6291 19.4953 12.304 19.4953C12.5786 19.4953 12.8452 19.4028 13.0608 19.2328L21.0508 12.9238V12.9238C21.5622 12.5207 21.65 11.7794 21.247 11.268C21.1895 11.1951 21.1237 11.1292 21.0508 11.0718L13.0608 4.76276V4.76276C12.531 4.34468 11.7626 4.43525 11.3445 4.96505C11.1744 5.18061 11.0818 5.44717 11.0818 5.72176L11.082 8.95158Z" /></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Post header (own surface) ────────────────────────

/** The post page's own top bar: back · "Post" · overflow menu. Rendered inside
 *  the sliding page so it slides in as one piece with the content. */
function PostHeaderBar({ onBack }: { onBack: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const items: { label: string; danger?: boolean; onClick: () => void }[] = [
    { label: following ? "Following" : "Follow", onClick: () => setFollowing(f => !f) },
    { label: "Copy link", onClick: () => setMenuOpen(false) },
    { label: "Not interested", onClick: () => setMenuOpen(false) },
    { label: "Report post", danger: true, onClick: () => setMenuOpen(false) },
  ];

  return (
    <header className="sticky top-0 z-20 -mx-4 -mt-4 flex items-center gap-2 border-b border-gray-stroke bg-white px-3 py-2.5 pt-[calc(env(safe-area-inset-top)+10px)] md:hidden">
      <button onClick={onBack} aria-label="Go back" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover">
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <p className="text-[15px] font-semibold leading-tight text-gray-dark">Post</p>
      </div>
      <div ref={menuRef} className="relative shrink-0">
        <button onClick={() => setMenuOpen(o => !o)} aria-label="Post options" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover">
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></svg>
        </button>
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute right-0 top-full z-50 mt-1 w-44 rounded-2xl border border-gray-stroke bg-white p-1.5 shadow-lg"
            >
              {items.map(it => (
                <button
                  key={it.label}
                  onClick={it.onClick}
                  className={`flex w-full items-center rounded-lg p-2.5 text-left text-[14px] font-medium transition-colors hover:bg-gray-hover ${it.danger ? "text-[#D92D20]" : "text-gray-dark"}`}
                >
                  {it.label}
                </button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}

/** The post's visual surface (sticky header + post + comments). Shared by the
 *  live page and the frozen exit copy so the back-slide looks identical. */
// The featured (top) post rendered in the expanded layout: avatar + name row on
// top, then body, media, metadata and the action bar span the full column width
// below it (rather than the compact avatar-left layout the comments use).
function FeaturedPost({ post, onImageClick, onCommentFocus }: {
  post: Post;
  onImageClick?: (i: number) => void;
  onCommentFocus: () => void;
}) {
  return (
    <div className="pt-5">
      <AuthorRow post={post} featured />
      {post.type === "article" ? (
        <>
          <h1 className="mt-3 font-serif text-[26px] leading-[1.15] tracking-[-0.01em] text-gray-dark">{post.title}</h1>
          {post.subtitle ? (
            <p className="mt-2 text-[15px] leading-snug text-gray-light">{post.subtitle}</p>
          ) : null}
        </>
      ) : null}
      {post.type === "article" && post.bodyHtml ? (
        <div
          className="article-body mt-3 text-[16px] leading-[1.65] text-gray-dark"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      ) : (
        <p className={`mt-3 whitespace-pre-wrap text-gray-dark ${post.type === "article" ? "text-[16px] leading-[1.65]" : "text-[17px] font-medium leading-[1.5]"}`}>{post.body}</p>
      )}
      {post.type === "poll" ? <PollCard poll={post.poll} /> : null}
      <PostMedia post={post} onImageClick={post.type === "image" ? onImageClick : undefined} />
      {/* Action row, then a bordered stat row: views (left) · date (right). */}
      <StatsRow post={post} onCommentFocus={onCommentFocus} />
      <div className="mt-2 flex items-center justify-between border-y border-gray-stroke py-2.5 text-[14px] leading-tight text-gray-extra-light">
        <span className="flex items-center gap-1.5">
          {/* chart-2.svg, 14px, inherits the row's gray-extra-light */}
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" aria-hidden><path d="M9 13v8" vectorEffect="non-scaling-stroke" /><path d="M21 8v13" vectorEffect="non-scaling-stroke" /><path d="M15 3v18" vectorEffect="non-scaling-stroke" /><path d="M3 8v13" vectorEffect="non-scaling-stroke" /></svg>
          {formatViews(post.likes * 24 + post.comments * 18 + post.reposts * 40)} Views
        </span>
        <span>Jul 7, 2026 at 9:41 AM</span>
      </div>
    </div>
  );
}

function PostSurface({ post, comments, onBack, onImageClick, boxed = false }: {
  post: Post;
  comments: CommentData[];
  onBack: () => void;
  onImageClick?: (i: number) => void;
  // boxed = rendered inside the alt-nav card (its own ThreadHeader replaces the
  // mobile PostHeaderBar, and the card wrapper owns the bottom spacing).
  boxed?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <>
      {!boxed && <PostHeaderBar onBack={onBack} />}
      <div className={`min-w-0 ${boxed ? "" : "pb-36"}`}>
        <div className="border-b border-gray-stroke pt-4 pb-3">
          <AuthorRow post={post} />
          {post.type === "article" ? (
            <>
              <h1 className="mt-3 font-serif text-[26px] leading-[1.15] tracking-[-0.01em] text-gray-dark">{post.title}</h1>
              {post.subtitle ? (
                <p className="mt-2 text-[15px] leading-snug text-gray-light">{post.subtitle}</p>
              ) : null}
            </>
          ) : null}
          {post.type === "article" && post.bodyHtml ? (
            <div
              className="article-body mt-3 text-[16px] leading-[1.65] text-gray-dark"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
          ) : (
            <p className={`mt-3 whitespace-pre-wrap text-gray-dark ${post.type === "article" ? "text-[16px] leading-[1.65]" : "text-[15px] leading-[1.5]"}`}>{post.body}</p>
          )}
          {post.type === "poll" ? <PollCard poll={post.poll} /> : null}
          <PostMedia post={post} onImageClick={post.type === "image" ? onImageClick : undefined} />
          {/* Metadata — time · date · views, below the body/media, above the actions. */}
          <div className="mt-3 flex flex-wrap items-center gap-x-1.5 text-[14px] leading-tight text-gray-light">
            <span>9:41 AM</span>
            <span aria-hidden>·</span>
            <span>Jul 7, 2026</span>
            <span aria-hidden>·</span>
            <span>
              <span className="font-semibold text-gray-dark">{formatViews(post.likes * 24 + post.comments * 18 + post.reposts * 40)}</span> Views
            </span>
          </div>
          <StatsRow post={post} onCommentFocus={() => navigate(`/reply/${post.id}`, { state: { target: { kind: "post" } } })} />
        </div>
        <div className="mt-1">
          {comments.map(c => (
            <CommentItem key={c.id} comment={c} postId={post.id} />
          ))}
        </div>
      </div>
    </>
  );
}

// alt-nav thread header — sits ABOVE the content card: a back arrow, a bold
// "Post" title, and a trailing overflow menu.
function ThreadHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="mb-3 flex items-center gap-3 px-1">
      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
      >
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
      <p className="min-w-0 text-[18px] font-semibold leading-tight text-gray-dark">Post</p>
      {/* The post's action dropdown lives here now (dropped from the action row). */}
      <PostOverflowMenu />
    </div>
  );
}

// The post + replies. In alt-nav they're boxed in the same card treatment as
// the feed (rounded border, ThreadHeader on top); elsewhere the bare surface.
// A comment rendered as a post — same shape FeedPost expects, so it looks
// identical to a top-level post (comments are treated as their own posts).
function commentToPost(c: CommentData): Post {
  return {
    id: c.id,
    type: "text",
    author: c.author,
    avatar: c.avatar,
    headline: c.headline,
    time: c.time,
    body: c.text,
    likes: c.likes,
    comments: c.replies?.length ?? 0,
    reposts: 0,
    shares: 0,
  };
}

function ThreadBody({ post, comments, onBack, boxed, onImageClick, composer, onCommentFocus, urlPostId }: {
  post: Post;
  comments: CommentData[];
  onBack: () => void;
  boxed: boolean;
  onImageClick?: (i: number) => void;
  composer?: ReactNode;
  onCommentFocus: () => void;
  // The post id used to build nested-comment links. Defaults to post.id; on a
  // comment page it's the top-level post id (so replies open under /post/:id).
  urlPostId?: number;
}) {
  const navigate = useNavigate();
  const postBase = usePostBase();
  const linkPostId = urlPostId ?? post.id;
  // Default (non-boxed) keeps the bare post surface.
  if (!boxed) {
    return <PostSurface post={post} comments={comments} onBack={onBack} boxed={false} onImageClick={onImageClick} />;
  }
  // alt-nav: the featured post uses the expanded layout (author row on top,
  // content full-width below); the comment composer sits directly beneath it as
  // a full-width row; each comment renders through the compact FeedPost and
  // opens its own thread.
  return (
    <div>
      <ThreadHeader onBack={onBack} />
      <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white">
        <div className="px-4 sm:px-6">
          <FeaturedPost post={post} onImageClick={onImageClick} onCommentFocus={onCommentFocus} />
        </div>
        {/* Composer's top border is inset (lives inside the px padding) so it
            aligns with the sections' content, not the card edges. */}
        {composer ? <div className="px-4 sm:px-6">{composer}</div> : null}
        {comments.map(c => (
          <div key={c.id} className={`border-t border-gray-stroke px-4 sm:px-6 ${POST_HOVER_SHADOW}`}>
            <FeedPost post={commentToPost(c)} onOpen={() => navigate(`${postBase}/${linkPostId}/comment/${c.id}`)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────

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

// Prototype-only admin menu — a 3-dot button pinned to the bottom-right that
// toggles preview states to show the team (starting with the sort section).
function PostAdminMenu({ showSort, onToggleSort }: { showSort: boolean; onToggleSort: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 z-10 mb-2 w-56 rounded-xl border border-gray-stroke bg-white p-1 shadow-lg">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-light">Admin</p>
            <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2">
              <span className="text-[14px] font-medium text-gray-dark">Show sort</span>
              <Toggle checked={showSort} onChange={onToggleSort} />
            </div>
          </div>
        </>
      )}
      <button
        type="button"
        aria-label="Admin menu"
        onClick={() => setOpen(o => !o)}
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

// Renders a thread — either a top-level post or a comment promoted to a post —
// using the same boxed card, sidebars, composer and animation. On a comment
// page the comment is the featured post and its replies render as the comments,
// so comments feel exactly like posts.
function PostThread() {
  const navigate = useNavigate();

  useSetRightSidebar(<HomeRightSidebar />);
  const { postId, commentId } = useParams<{ postId: string; commentId?: string }>();
  const pid = Number(postId);
  const isComment = commentId != null;
  const location = useLocation();
  // Back fades the card out in place before navigating away.
  const [exiting, setExiting] = useState(false);
  const { focusInput = false, prefillComment = "", focusImage } = (location.state as { sourceY?: number; focusInput?: boolean; prefillComment?: string; focusImage?: number }) ?? {};
  // On a comment page, promote the comment to the featured post; its replies
  // become the comment list. Otherwise feature the top-level post.
  const sourceComment = isComment ? findComment(getPostComments(pid), Number(commentId)) : undefined;
  const post = isComment
    ? (sourceComment ? commentToPost(sourceComment) : undefined)
    : posts.find(p => p.id === pid);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Only scroll to top on initial mount when not arriving via Comment tap —
  // otherwise we fight the scroll that brings the comment input above the
  // keyboard.
  useEffect(() => { if (!focusInput) window.scrollTo(0, 0); }, [focusInput]);

  // When arriving via a Comment tap, focus the comment box so the mobile
  // keyboard pops open AND scroll the input so it sits just above the
  // keyboard. iOS won't auto-scroll for programmatic focus, so we watch the
  // Visual Viewport: once the keyboard opens (visible height shrinks), bring
  // the input to rest right above the visible-area bottom.
  useEffect(() => {
    if (!focusInput) return;
    const focusId = requestAnimationFrame(() => commentInputRef.current?.focus());

    const scrollInputAboveKeyboard = () => {
      const input = commentInputRef.current;
      if (!input) return;
      const vv = window.visualViewport;
      const visibleBottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
      const rect = input.getBoundingClientRect();
      const delta = rect.bottom - visibleBottom + 16;
      if (delta > 0) window.scrollBy({ top: delta, behavior: "smooth" });
    };

    // Try a few times — keyboard takes ~200–400ms to animate in on iOS.
    const timers = [160, 320, 520].map(ms => setTimeout(scrollInputAboveKeyboard, ms));
    const vv = window.visualViewport;
    vv?.addEventListener("resize", scrollInputAboveKeyboard);
    return () => {
      cancelAnimationFrame(focusId);
      timers.forEach(clearTimeout);
      vv?.removeEventListener("resize", scrollInputAboveKeyboard);
    };
  }, [focusInput]);


  const [commentText, setCommentText] = useState(prefillComment);
  // When the reply field is focused, reveal the media toolbar (mirrors the
  // compose modal's icons) with an expand animation.
  const [replyFocused, setReplyFocused] = useState(focusInput);
  // Admin preview toggles (bottom-right 3-dot menu). Sort section is OFF by
  // default; persisted so it survives navigation.
  const [showSort, setShowSort] = useState<boolean>(() => localStorage.getItem("postdetail-show-sort") === "1");
  const toggleShowSort = () => setShowSort(v => {
    const next = !v;
    localStorage.setItem("postdetail-show-sort", next ? "1" : "0");
    return next;
  });
  const [comments, setComments] = useState<CommentData[]>(() =>
    isComment ? (sourceComment?.replies ?? []) : (post ? getPostComments(pid) : [])
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(
    typeof focusImage === "number" ? focusImage : null
  );

  // Back: fade the card out in place, then navigate once the exit animation
  // completes (see onAnimationComplete on the surface). Same for alt-nav and the
  // regular post detail now that both render the boxed thread card.
  const handleBack = useCallback(() => {
    setExiting(true);
  }, []);
  useSetNavBackHandler(handleBack);
  // The regular post detail keeps the home feed's left sidebar persistent; on
  // alt-nav this is ignored (ContextLayout forces the DesktopSidebar).
  useSetLeftSidebar(<HomeSidebar onCreatePost={() => {}} />);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-light">
        <p className="text-[15px]">Post not found.</p>
        <button onClick={handleBack} className="mt-4 text-primary hover:underline">
          ← Go back
        </button>
      </div>
    );
  }

  const submitComment = () => {
    if (!commentText.trim()) return;
    const newComment: CommentData = {
      id: Date.now(),
      author: "You",
      avatar: profilePhoto,
      time: "just now",
      text: commentText.trim(),
      likes: 0,
    };
    if (isComment) {
      addPostReply(pid, Number(commentId), newComment);
      setComments(findComment(getPostComments(pid), Number(commentId))?.replies ?? []);
    } else {
      addPostComment(pid, newComment);
      setComments(getPostComments(pid));
    }
    setCommentText("");
  };

  // alt-nav: the comment composer is a full-width row at the top of the replies
  // (directly under the post) instead of a fixed bar at the bottom.
  const inlineComposer = (
    <div className="py-3">
      {/* Sort control (activity link hidden) — toggled via the admin menu. */}
      {showSort ? (
        <div className="mb-3 flex items-center justify-between">
          <button className="flex items-center gap-1.5 text-[15px] font-bold text-gray-dark transition-opacity hover:opacity-70">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M7 3v18" /><path d="m3 17 4 4 4-4" />
              <path d="M17 21V3" /><path d="m13 7 4-4 4 4" />
            </svg>
            Top
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <polyline points="4 6 8 10 12 6" />
            </svg>
          </button>
        </div>
      ) : null}

      {/* Reply field — mirrors the feed's "What's new?" composer: avatar +
          borderless prompt + an outline Post button. Focusing the field reveals
          the same media toolbar the compose modal shows, animated in below. */}
      <div>
        <div className="flex items-center gap-3">
          <img src={profilePhoto} alt="You" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          <textarea
            ref={commentInputRef}
            autoFocus={focusInput}
            value={commentText}
            onFocus={() => setReplyFocused(true)}
            onBlur={() => setReplyFocused(false)}
            onChange={e => { setCommentText(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
            placeholder="Add a comment…"
            rows={1}
            className="scrollbar-hide max-h-24 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent text-[15px] text-gray-dark outline-none placeholder:text-gray-light"
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitComment(); }}
          />
          <Button
            size="md"
            variant="outline"
            rounded="rounded-[6px]"
            onClick={submitComment}
            className="shrink-0 font-semibold shadow-[0_1px_2px_0_rgba(16,24,40,0.06)]"
          >
            Post
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {replyFocused ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden pl-[52px]"
            >
              {/* -ml-2 aligns the first glyph under the input text (cancels p-2);
                  onMouseDown-preventDefault keeps the field focused on tap. */}
              <div className="-ml-2 mt-1.5 flex items-center gap-3">
                {[
                  { label: "Add image", icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5a2 2 0 0 0-2.83 0L6 20" /></svg> },
                  { label: "Take photo", icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3.5" /></svg> },
                  { label: "Add video", icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg> },
                  { label: "Add poll", icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M6 20V10" /><path d="M12 20V4" /><path d="M18 20v-6" /></svg> },
                ].map(t => (
                  <button
                    key={t.label}
                    aria-label={t.label}
                    onMouseDown={e => e.preventDefault()}
                    className="shrink-0 cursor-pointer rounded-full p-2 text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
                  >
                    {t.icon}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
    {/* Entrance: the whole thread card fades up + scales in as one piece; on back
        it fades out in place before navigating (see onAnimationComplete). Both
        the regular and alt-nav post detail share this boxed-card treatment. */}
    <motion.div
      initial={FADE_IN.initial}
      animate={exiting ? FADE_OUT.animate : FADE_IN.animate}
      transition={FADE_TRANSITION}
      onAnimationComplete={() => { if (exiting) navigate(-1); }}
      className="min-h-[100dvh] pb-36"
    >
      <ThreadBody post={post} comments={comments} onBack={handleBack} boxed onImageClick={setLightboxIndex} composer={inlineComposer} onCommentFocus={() => commentInputRef.current?.focus()} urlPostId={pid} />
    </motion.div>

    <AnimatePresence>
      {lightboxIndex !== null && post.type === "image" && (
        <ImageLightbox
          images={post.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </AnimatePresence>

    <PostAdminMenu showSort={showSort} onToggleSort={toggleShowSort} />
    </>
  );
}

// ─── Comment as its own post page ─────────────────────
// The Twitter model completed: tapping a comment opens it as the main post,
// with its replies rendered as the comments. Works at any depth — replies to
// replies open their own page too.

function findComment(list: CommentData[], id: number): CommentData | undefined {
  for (const c of list) {
    if (c.id === id) return c;
    const nested = c.replies ? findComment(c.replies, id) : undefined;
    if (nested) return nested;
  }
  return undefined;
}

// Remounts the thread when the post changes so effects/state re-seed cleanly.
export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  return <PostThread key={postId} />;
}

// A comment opens as its own post page (Twitter model), rendered by the exact
// same PostThread. Keyed so navigating comment → comment remounts (the route
// pattern stays the same, only params change).
export function CommentDetail() {
  const { postId, commentId } = useParams<{ postId: string; commentId: string }>();
  return <PostThread key={`${postId}-${commentId}`} />;
}
