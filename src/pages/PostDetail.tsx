import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { useSetRightSidebar } from "../components/RightSidebarContext";
import { useSetLeftSidebar } from "../components/LeftSidebarContext";
import { useSetNavBackHandler } from "../components/NavThemeContext";
import { useProfileBarMode } from "../contexts/ProfileBarModeContext";
import { posts, type Post, FeedLikeButton, FeedRepostButton, FeedBookmarkButton, ShareDropdown, HomeRightSidebar } from "./Home";

import profilePhoto from "../assets/profile photos/profile photo.png";
import verifiedIconSrc from "../assets/icons/verified.svg";
import commentsIcon from "../assets/icons/comments.svg";
import sharesIcon from "../assets/icons/shares.svg";

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

function AuthorRow({ post }: { post: Post }) {
  const [following, setFollowing] = useState(false);
  const { mode: profileBarMode } = useProfileBarMode();
  // Person leads: a member's group post surfaces the person + a small group
  // badge; a pure group announcement stays the group.
  const gp = post.groupPoster;
  const name = gp?.name ?? post.author;
  const avatarSrc = gp?.avatar ?? post.avatar;
  const displayHeadline = gp?.headline ?? post.headline;
  const displayTime = profileBarMode === 3 ? "Aug 12" : post.time;
  return (
    // Minimal mode is a single name line, so center it against the avatar; the
    // title modes are two lines, so they top-align.
    <div className={`flex gap-3 ${profileBarMode === 1 ? "items-center" : "items-start"}`}>
      <div className="relative shrink-0">
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
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-medium leading-tight text-gray-dark">{name}</span>
          {profileBarMode === 1 && post.companyLogo ? (
            <img src={post.companyLogo} alt="" className="h-[18px] w-[18px] shrink-0 rounded-[4px] object-contain" />
          ) : null}
          {post.verified ? <img src={verifiedIconSrc} alt="" className="h-[15px] w-[15px] shrink-0" /> : null}
          <span className="shrink-0 text-[13px] leading-tight text-gray-xlight">{displayTime}</span>
        </div>
        {profileBarMode !== 1 && displayHeadline ? (
          <p className="mt-0.5 truncate text-[13px] leading-tight text-gray-light">{displayHeadline}</p>
        ) : null}
      </div>
      {/* Follow — snappy, staged morph: press down (whileTap) → the pill snaps
          to a grey circle (width + color spring) → the check pops into the
          circle (delayed spring). Width animates as a real CSS value (not the
          `layout` transform), so the label never stretches. */}
      <motion.button
        type="button"
        onClick={() => setFollowing((f) => !f)}
        whileTap={{ scale: 0.9 }}
        initial={false}
        animate={{ width: following ? 36 : 73, backgroundColor: following ? "#F0F0F0" : "#FFD96F" }}
        transition={{ type: "spring", stiffness: 700, damping: 34, mass: 0.7 }}
        aria-label={following ? "Following" : "Follow"}
        className="relative flex h-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px] font-semibold"
      >
        <AnimatePresence mode="wait" initial={false}>
          {following ? (
            <motion.svg
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 900, damping: 19, delay: 0.12 }}
              className="h-[18px] w-[18px] text-gray-dark"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
            </motion.svg>
          ) : (
            <motion.span
              key="follow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              className="whitespace-nowrap text-[#111111]"
            >
              Follow
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function ImageLightbox({ images, index, onClose, onChangeIndex }: {
  images: string[];
  index: number;
  onClose: () => void;
  onChangeIndex: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onChangeIndex(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1) onChangeIndex(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onChangeIndex]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        src={images[index]}
        alt=""
        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
        onClick={e => e.stopPropagation()}
      />

      {index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onChangeIndex(index - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}
      {index < images.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); onChangeIndex(index + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-5 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); onChangeIndex(i); }}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </motion.div>,
    document.body
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
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-light">Admitted</p>
            <p className="text-[15px] font-semibold text-gray-dark">{milestone.school}</p>
            <p className="text-[12px] text-gray-light">{milestone.program}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function StatsRow({ post, onCommentFocus }: { post: Post; onCommentFocus: () => void }) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="mt-2 flex items-center justify-between px-2 py-1.5">
      <FeedLikeButton initialCount={post.likes} />
      {/* Comment */}
      <button
        onClick={onCommentFocus}
        className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover"
      >
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 21C13.486 21.0018 14.9492 20.6339 16.2576 19.9293L20.3676 20.9755C20.4517 20.9969 20.5398 20.9961 20.6234 20.9731C20.707 20.9502 20.7832 20.9058 20.8445 20.8445C20.9058 20.7832 20.9501 20.707 20.9731 20.6234C20.9961 20.5398 20.9969 20.4517 20.9755 20.3676L19.9293 16.2576C20.8609 14.5226 21.1978 12.5299 20.8882 10.5851C20.5786 8.64022 19.6396 6.85061 18.2152 5.49065C16.7909 4.13068 14.9598 3.27543 13.0027 3.05604C11.0457 2.83664 9.07066 3.26522 7.38054 4.27604C5.69042 5.28687 4.3785 6.82414 3.64594 8.65215C2.91338 10.4802 2.80062 12.498 3.32495 14.3962C3.84928 16.2945 4.98176 17.9684 6.54873 19.1612C8.1157 20.354 10.0307 21 12 21Z" /></svg>
        {post.comments > 0 && <span className="text-[13px] font-normal">{post.comments.toLocaleString()}</span>}
      </button>
      {/* Repost */}
      <FeedRepostButton initialCount={post.reposts} />
      {/* Share */}
      <div className="relative">
        <button
          onClick={() => setShareOpen(o => !o)}
          className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover"
        >
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 15V4" /><path d="m8 8 4-4 4 4" /><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" /></svg>
        </button>
        <AnimatePresence>
          {shareOpen ? <ShareDropdown post={post} onClose={() => setShareOpen(false)} /> : null}
        </AnimatePresence>
      </div>
      {/* Save */}
      <FeedBookmarkButton post={post} />
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
      {/* Balloon-pop particle burst */}
      <div className="pointer-events-none absolute left-[7px] top-[7px]">
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
        className={`flex items-center gap-1 text-[13px] transition-colors ${liked ? "text-red-500" : "text-gray-light hover:text-gray-dark"}`}
      >
        <motion.svg
          className="h-[20px] w-[20px]"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          animate={liked
            ? { scale: [1, 0.6, 1.8, 0.9, 1.05, 1] }
            : { scale: 1 }
          }
          transition={{ duration: 0.5, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeOut" }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </motion.svg>
        <motion.span
          animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {count}
        </motion.span>
      </button>
    </div>
  );
}

function CommentItem({ comment, depth = 0, postId }: { comment: CommentData; depth?: number; postId: number }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const replies = comment.replies ?? [];

  return (
    <div className="relative">
      {/* Comment row */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 pt-3"
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
          <div className="mt-2 flex items-center gap-4">
            <HeartButton liked={liked} count={comment.likes + (liked ? 1 : 0)} onToggle={() => setLiked(l => !l)} />
            {depth === 0 ? (
              <button
                onClick={() => navigate(`/reply/${postId}`, { state: { target: { kind: "comment", comment } } })}
                className="text-[13px] font-medium text-gray-light transition-colors hover:text-gray-dark"
              >
                Reply
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Replies sit at the SAME left margin as their parent — no indent. A
          thin vertical line runs down the avatar column (x≈21), linking the
          parent avatar to each reply avatar. The opaque avatars sit on top of
          it, so the line only shows in the gaps between them; a white trim on
          the last reply stops the line at that avatar's center. */}
      {replies.length > 0 ? (
        <>
          <div
            className="pointer-events-none absolute w-px bg-gray-200"
            style={{ left: 21, top: 56, bottom: 0 }}
          />
          {replies.map((r, i) => (
            <div key={r.id} className="relative">
              {i === replies.length - 1 ? (
                <div
                  className="pointer-events-none absolute w-px bg-white"
                  style={{ left: 21, top: 34, bottom: 0 }}
                />
              ) : null}
              <CommentItem comment={r} depth={depth + 1} postId={postId} />
            </div>
          ))}
        </>
      ) : null}
    </div>
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
    <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between bg-white px-4 md:hidden">
      <button onClick={onBack} aria-label="Go back" className="flex h-8 w-8 items-center justify-center text-gray-dark">
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] font-semibold text-gray-dark">Post</span>
      <div ref={menuRef} className="relative">
        <button onClick={() => setMenuOpen(o => !o)} aria-label="Post options" className="flex h-8 w-8 items-center justify-center text-gray-dark">
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></svg>
        </button>
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute right-0 top-9 z-50 w-44 rounded-2xl border border-gray-stroke bg-white p-1.5 shadow-lg"
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

// ─── Page ─────────────────────────────────────────────

export default function PostDetail() {
  const navigate = useNavigate();

  // Plays the reverse of the entrance animation before actually navigating
  // away, so the page slides back out to the right instead of just vanishing.
  const [isExiting, setIsExiting] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const handleBack = useCallback(() => setIsExiting(true), []);
  useSetNavBackHandler(handleBack);

  useEffect(() => {
    if (!isExiting) return;
    const el = pageRef.current;
    if (!el) { navigate(-1); return; }
    const onAnimationEnd = () => navigate(-1);
    el.addEventListener("animationend", onAnimationEnd, { once: true });
    return () => el.removeEventListener("animationend", onAnimationEnd);
  }, [isExiting, navigate]);

  useSetLeftSidebar(
    <div className="flex justify-end">
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-dark transition-colors hover:bg-gray-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
    </div>
  );
  useSetRightSidebar(<HomeRightSidebar />);
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();
  const { focusInput = false, prefillComment = "", focusImage } = (location.state as { sourceY?: number; focusInput?: boolean; prefillComment?: string; focusImage?: number }) ?? {};
  const post = posts.find(p => p.id === Number(postId));
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Mirror BottomNav's scroll-hide so the comment input slides down to the
  // bottom in unison with the nav as it slides out of view.
  const [navHidden, setNavHidden] = useState(false);
  const lastNavY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastNavY.current;
      if (y < 80) setNavHidden(false);
      else if (delta > 6) setNavHidden(true);
      else if (delta < -6) setNavHidden(false);
      lastNavY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const [comments, setComments] = useState<CommentData[]>(() =>
    post ? getPostComments(post.id) : []
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(
    typeof focusImage === "number" ? focusImage : null
  );

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
    addPostComment(post.id, newComment);
    setComments(getPostComments(post.id));
    setCommentText("");
  };

  return (
    <div ref={pageRef} className={isExiting ? "slide-out-page" : "slide-in-page"}>
    {/* Post's own top bar — lives inside the sliding page so header + content
        slide in as one piece. On mobile only (desktop uses the sidebars). */}
    <PostHeaderBar onBack={handleBack} />
    <motion.div initial={false}>
      {/* Content — full width; mobile top padding clears the fixed PostHeaderBar
          (desktop has no mobile header, so md:pt-0). */}
      <div className="min-w-0 pb-36 pt-14 md:pt-0">
        {/* Post — full width. Body/media/actions stack below the author header
            (avatar + name + description), no left indent. */}
        <div className="border-b border-gray-stroke pb-3">
          <AuthorRow post={post} />
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.5] text-gray-dark">{post.body}</p>
          <PostMedia post={post} onImageClick={post.type === "image" ? setLightboxIndex : undefined} />
          <StatsRow post={post} onCommentFocus={() => navigate(`/reply/${post.id}`, { state: { target: { kind: "post" } } })} />
        </div>

        {/* Comments */}
        <div className="mt-1">
          {comments.map(c => (
            <CommentItem key={c.id} comment={c} postId={post.id} />
          ))}
        </div>
      </div>
    </motion.div>

    {/* Comment input — portaled into the layout's stacking context (outside
        this page's slide transform) so it stays viewport-anchored, sits ABOVE
        the bottom nav (covering its shadow), and eases in with the page rather
        than sliding + snapping with it. */}
    {createPortal(
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        style={{ bottom: navHidden ? "env(safe-area-inset-bottom)" : "calc(env(safe-area-inset-bottom) + 61px)" }}
        className="fixed inset-x-0 z-40 bg-white px-4 py-2.5 shadow-[0_-6px_16px_-6px_rgba(0,0,0,0.08)] transition-[bottom] duration-200 ease-out"
      >
        <div className="mx-auto flex max-w-[600px] items-center gap-2">
          <img
            src={profilePhoto}
            alt="You"
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <textarea
            ref={commentInputRef}
            autoFocus={focusInput}
            value={commentText}
            onChange={e => {
              setCommentText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Add a comment…"
            rows={1}
            className="scrollbar-hide max-h-24 flex-1 resize-none overflow-y-auto rounded-xl border border-gray-stroke px-3 py-2.5 text-[14px] text-gray-dark outline-none transition-[border] focus:border-gray-dark"
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitComment(); }}
          />
          <AnimatePresence>
            {commentText.trim() ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={submitComment}
                className="shrink-0 rounded-[8px] bg-gray-dark px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#222]"
              >
                Post
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>,
      document.getElementById("saved-toast-root") ?? document.body,
    )}

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
    </div>
  );
}
