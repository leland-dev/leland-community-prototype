import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import commentsIcon from "../assets/icons/comments.svg";
import repostsIcon from "../assets/icons/reposts.svg";
import sharesIcon from "../assets/icons/shares.svg";
import verifiedIcon from "../assets/icons/verified.svg";

// ─── Types ─────────────────────────────────────────────

interface PostBase {
  id: number;
  author: string;
  avatar: string;
  time: string;
  verified?: boolean;
  headline?: string;
  body: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
}

export interface TextPost extends PostBase { type: "text"; }

export interface ImagePost extends PostBase {
  type: "image";
  images: string[];
  imageAspectRatios?: number[];
}

export interface LinkPost extends PostBase {
  type: "link";
  link: { url: string; domain: string; title: string; image: string };
}

export interface EventPost extends PostBase {
  type: "event";
  event: {
    title: string;
    image: string;
    date: string;
    time: string;
    format: "Online" | "In-person";
    spotsLeft?: number;
    registered?: number;
  };
}

export interface MilestonePost extends PostBase {
  type: "milestone";
  milestone: {
    school: string;
    program: string;
    clientName: string;
    clientAvatar: string;
    schoolColor: string;
    schoolInitial: string;
    schoolLogo?: string;
  };
}

export interface LivePost extends PostBase {
  type: "live";
  live: { title: string; videoId: string; viewers: number; topic: string };
}

export type PostData = TextPost | ImagePost | LinkPost | EventPost | MilestonePost | LivePost;

// ─── Helpers ───────────────────────────────────────────

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toString();
}

// ─── Like button ───────────────────────────────────────

const HEART_PARTICLES = [
  { angle: -80, r: 28, color: "#ff4757", size: 6 },
  { angle: -40, r: 32, color: "#fd79a8", size: 5 },
  { angle: -10, r: 25, color: "#ff6b81", size: 7 },
  { angle: 20,  r: 30, color: "#ff4757", size: 5 },
  { angle: 55,  r: 28, color: "#ff6348", size: 6 },
  { angle: 90,  r: 32, color: "#ff4757", size: 5 },
  { angle: 130, r: 25, color: "#fd79a8", size: 7 },
  { angle: 160, r: 30, color: "#ff6b81", size: 5 },
  { angle: 200, r: 28, color: "#ff4757", size: 6 },
  { angle: 240, r: 25, color: "#ff6348", size: 5 },
  { angle: 270, r: 32, color: "#fd79a8", size: 6 },
  { angle: 310, r: 28, color: "#ff4757", size: 5 },
];

const REPOST_PARTICLES = [
  { angle: -80,  r: 28, color: "#138462", size: 6 },
  { angle: -40,  r: 32, color: "#1aad80", size: 5 },
  { angle: -10,  r: 25, color: "#0d6b50", size: 7 },
  { angle: 20,   r: 30, color: "#138462", size: 5 },
  { angle: 55,   r: 28, color: "#1aad80", size: 6 },
  { angle: 90,   r: 32, color: "#138462", size: 5 },
  { angle: 130,  r: 25, color: "#0d6b50", size: 7 },
  { angle: 160,  r: 30, color: "#1aad80", size: 5 },
  { angle: 200,  r: 28, color: "#138462", size: 6 },
  { angle: 240,  r: 25, color: "#0d6b50", size: 5 },
  { angle: 270,  r: 32, color: "#1aad80", size: 6 },
  { angle: 310,  r: 28, color: "#138462", size: 5 },
];

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(l => !l);
    if (!liked) { setBurst(true); setTimeout(() => setBurst(false), 700); }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-[13px] top-[13px]">
        <AnimatePresence>
          {burst ? HEART_PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ backgroundColor: p.color, width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [1, 1, 0],
                x: [0, Math.cos((p.angle * Math.PI) / 180) * p.r * 0.4, Math.cos((p.angle * Math.PI) / 180) * p.r],
                y: [0, Math.sin((p.angle * Math.PI) / 180) * p.r * 0.4, Math.sin((p.angle * Math.PI) / 180) * p.r + 7],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.55, ease: [0.2, 0, 0.8, 1], delay: i * 0.008 }}
            />
          )) : null}
        </AnimatePresence>
      </div>
      <button
        onClick={handleClick}
        className={`flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 transition-colors hover:bg-gray-hover ${liked ? "text-red-500" : "text-gray-light"}`}
      >
        <motion.svg
          className="h-[22px] w-[22px]"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          animate={liked ? { scale: [1, 0.6, 1.8, 0.9, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeOut" }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </motion.svg>
        <motion.span
          className="text-[15px] font-normal"
          animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {formatCount(initialCount + (liked ? 1 : 0))}
        </motion.span>
      </button>
    </div>
  );
}

// ─── Share dropdown ────────────────────────────────────

function ShareDropdown({ postId, onClose }: { postId: number; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const postUrl = `${window.location.origin}${window.location.pathname}#/post/${postId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); onClose(); }, 1200);
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ duration: 0.12 }}
        className="absolute top-full right-0 z-50 mt-1 w-56 rounded-2xl border border-gray-stroke bg-white shadow-lg"
      >
        <div className="px-2 py-2">
          <button onClick={copyLink} className="flex w-full items-center gap-[10px] rounded-lg p-3 text-left text-[16px] font-medium text-gray-dark hover:bg-gray-hover">
            {copied ? (
              <svg className="h-5 w-5 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            )}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium text-gray-dark hover:bg-gray-hover">
            <svg className="h-5 w-5 shrink-0 rounded-[3px]" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            LinkedIn
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium text-gray-dark hover:bg-gray-hover">
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            Twitter / X
          </a>
        </div>
      </motion.div>
    </>
  );
}

// ─── Repost button ─────────────────────────────────────

export function RepostButton({ initialCount }: { initialCount: number }) {
  const [reposted, setReposted] = useState(false);
  const [burst, setBurst] = useState(false);
  const [open, setOpen] = useState(false);

  const triggerRepost = () => {
    if (!reposted) { setReposted(true); setBurst(true); setTimeout(() => setBurst(false), 700); }
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-[13px] top-[13px]">
        <AnimatePresence>
          {burst ? REPOST_PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ backgroundColor: p.color, width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [1, 1, 0],
                x: [0, Math.cos((p.angle * Math.PI) / 180) * p.r * 0.4, Math.cos((p.angle * Math.PI) / 180) * p.r],
                y: [0, Math.sin((p.angle * Math.PI) / 180) * p.r * 0.4, Math.sin((p.angle * Math.PI) / 180) * p.r + 7],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.55, ease: [0.2, 0, 0.8, 1], delay: i * 0.008 }}
            />
          )) : null}
        </AnimatePresence>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className={`flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 transition-colors hover:bg-gray-hover ${reposted ? "text-[#138462]" : "text-gray-light"}`}
      >
        <motion.img
          src={repostsIcon}
          alt="Repost"
          className="h-[22px] w-[22px]"
          style={{ filter: reposted ? "invert(27%) sepia(60%) saturate(600%) hue-rotate(122deg) brightness(90%)" : "invert(44%)" }}
          animate={reposted && burst ? { scale: [1, 0.6, 1.8, 0.9, 1.05, 1], rotate: [0, 360] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeOut" }}
        />
        <motion.span
          className="text-[15px] font-normal"
          animate={reposted && burst ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {formatCount(initialCount + (reposted ? 1 : 0))}
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
            >
              <div className="px-2 py-2">
                <button onClick={triggerRepost} className="flex w-full items-center gap-[10px] rounded-lg p-3 text-left text-[16px] font-medium text-gray-dark hover:bg-gray-hover">
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Repost with your thoughts
                </button>
                {reposted ? (
                  <button onClick={() => { setReposted(false); setOpen(false); }} className="flex w-full items-center gap-[10px] rounded-lg p-3 text-left text-[16px] font-medium text-gray-dark hover:bg-gray-hover">
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
                    Undo repost
                  </button>
                ) : (
                  <button onClick={triggerRepost} className="flex w-full items-center gap-[10px] rounded-lg p-3 text-left text-[16px] font-medium text-gray-dark hover:bg-gray-hover">
                    <img src={repostsIcon} alt="" className="h-5 w-5 shrink-0 [filter:invert(44%)]" />
                    Repost to feed
                  </button>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ─── Action bar ────────────────────────────────────────

export function PostActionBar({
  likes,
  comments,
  reposts,
  postId,
  onCommentClick,
}: {
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  postId: number;
  onCommentClick?: () => void;
}) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="mt-1 flex items-center justify-between pl-[44px]">
      <LikeButton initialCount={likes} />
      <button
        onClick={(e) => { e.stopPropagation(); onCommentClick?.(); }}
        className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover"
      >
        <img src={commentsIcon} alt="Comment" className="h-[22px] w-[22px] [filter:invert(44%)]" />
        {comments > 0 && <span className="text-[15px] font-normal">{formatCount(comments)}</span>}
      </button>
      <RepostButton initialCount={reposts} />
      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShareOpen(o => !o); }}
          className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover"
        >
          <img src={sharesIcon} alt="Share" className="h-[22px] w-[22px] [filter:invert(44%)]" />
        </button>
        <AnimatePresence>
          {shareOpen ? <ShareDropdown postId={postId} onClose={() => setShareOpen(false)} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Post header row ───────────────────────────────────

function PostHeaderRow({ author, time, verified, headline }: {
  author: string;
  time: string;
  verified?: boolean;
  headline?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link
            to={`/profile-v2?type=${verified ? "coach" : "customer"}`}
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer text-[17px] leading-tight font-medium text-gray-dark underline decoration-white decoration-[0.75px] underline-offset-2 transition-[text-decoration-color] duration-200 hover:decoration-gray-light/50"
          >
            {author}
          </Link>
          {verified && <img src={verifiedIcon} alt="Verified" className="h-[15px] w-[15px] shrink-0" />}
          <span className="shrink-0 text-[17px] leading-tight text-gray-xlight">{time}</span>
        </div>
        {headline && <p className="truncate text-[15px] leading-tight text-[#707070]">{headline}</p>}
      </div>
      <div ref={menuRef} className="relative shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
          className="cursor-pointer pl-2 text-[#424242] opacity-40 transition-opacity hover:opacity-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
        <AnimatePresence>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-7 z-50 w-48 rounded-2xl border border-gray-stroke bg-white shadow-lg"
              >
                <div className="px-2 py-2">
                  {[
                    { label: "Not interested", danger: false },
                    { label: "Report post", danger: false },
                    { label: "Delete post", danger: true },
                  ].map(({ label, danger }) => (
                    <button
                      key={label}
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
                      className={`flex w-full items-center gap-[10px] rounded-lg px-3 py-2.5 text-left text-[16px] font-medium transition-colors hover:bg-gray-hover ${danger ? "text-[#D92D20]" : "text-gray-dark"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Image grid ────────────────────────────────────────

export function PostImageGrid({
  images,
  className = "",
  onImageClick,
}: {
  images: { src: string; aspectRatio?: number }[];
  className?: string;
  onImageClick?: (idx: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "right" ? 175 : -175, behavior: "smooth" });

  const count = images.length;
  if (count === 0) return null;

  const cell = (src: string, idx: number, extraClass = "") => (
    <div
      key={idx}
      className={`relative overflow-hidden bg-black ${extraClass}${onImageClick ? " cursor-zoom-in" : ""}`}
      onClick={onImageClick ? () => onImageClick(idx) : undefined}
    >
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
    </div>
  );

  if (count === 1) {
    const r = images[0].aspectRatio ?? 1;
    const clamped = Math.min(Math.max(r, 0.5), 2);
    return (
      <div
        className={`relative overflow-hidden rounded-xl bg-white ${className}${onImageClick ? " cursor-zoom-in" : ""}`}
        style={{ aspectRatio: String(clamped) }}
        onClick={onImageClick ? () => onImageClick(0) : undefined}
      >
        <img src={images[0].src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
      </div>
    );
  }
  if (count === 2) {
    return (
      <div className={`grid grid-cols-2 grid-rows-1 gap-0.5 overflow-hidden rounded-xl ${className}`} style={{ aspectRatio: "7/4" }}>
        {images.map((img, i) => cell(img.src, i))}
      </div>
    );
  }
  if (count === 3) {
    return (
      <div className={`grid grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-xl ${className}`} style={{ aspectRatio: "4/3" }}>
        {cell(images[0].src, 0, "row-span-2")}
        {cell(images[1].src, 1)}
        {cell(images[2].src, 2)}
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide rounded-xl">
        {images.map((img, i) => (
          <div
            key={i}
            className={`relative shrink-0 overflow-hidden rounded-xl bg-black${onImageClick ? " cursor-zoom-in" : ""}`}
            style={{ height: 220, width: 165 }}
            onClick={onImageClick ? () => onImageClick(i) : undefined}
          >
            <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll("left")} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-gray-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-white/85">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button onClick={() => scroll("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-gray-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-white/85">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>
  );
}

// ─── Link card ─────────────────────────────────────────

export function LinkCard({ link }: { link: LinkPost["link"] }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block overflow-hidden rounded-xl border border-gray-stroke transition-colors hover:bg-gray-hover"
    >
      <div className="relative w-full" style={{ paddingBottom: `${(1 / 1.91) * 100}%` }}>
        <img src={link.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="px-4 py-3">
        <p className="text-[13px] text-gray-light">{link.domain}</p>
        <p className="mt-0.5 text-[15px] font-medium text-gray-dark leading-snug">{link.title}</p>
      </div>
    </a>
  );
}

// ─── Event card ────────────────────────────────────────

export function EventCard({ event }: { event: EventPost["event"] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <img src={event.image} alt={event.title} className="aspect-[1200/628] w-full object-cover" />
      <div className="px-4 py-4">
        <p className="text-[17px] font-medium leading-snug text-gray-dark">{event.title}</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-[15px] text-gray-light">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {event.date}
          </div>
          <div className="flex items-center gap-2 text-[15px] text-gray-light">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {event.time}
          </div>
          {(event.registered !== undefined || event.spotsLeft !== undefined) && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[15px] text-gray-light">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>
                  {event.registered !== undefined && <>{event.registered.toLocaleString()} registered</>}
                  {event.spotsLeft !== undefined && <> ({event.spotsLeft} spots left)</>}
                </span>
              </div>
              <button className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-200">
                Register for free
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Milestone card ────────────────────────────────────

const GREENS = ["#0a5c3f", "#038561", "#15b078", "#34d399", "#6ee7b7", "#a7f3d0", "#1a7a52", "#059669", "#10b981"];
const CONFETTI = [
  { color: GREENS[0], x: 4,  delay: 0,    dur: 1.8, drift:  8,  w: 8,  h: 12, shape: "rect",     spin: 720  },
  { color: GREENS[1], x: 11, delay: 0.3,  dur: 2.1, drift: -10, w: 6,  h: 6,  shape: "square",   spin: 540  },
  { color: GREENS[2], x: 18, delay: 0.1,  dur: 1.6, drift:  6,  w: 10, h: 5,  shape: "streamer", spin: 1080 },
  { color: GREENS[3], x: 25, delay: 0.5,  dur: 2.0, drift: -8,  w: 7,  h: 10, shape: "rect",     spin: 360  },
  { color: GREENS[4], x: 32, delay: 0.15, dur: 1.7, drift:  12, w: 6,  h: 6,  shape: "circle",   spin: 0    },
  { color: GREENS[5], x: 39, delay: 0.4,  dur: 2.2, drift: -6,  w: 9,  h: 5,  shape: "streamer", spin: 900  },
  { color: GREENS[6], x: 46, delay: 0.05, dur: 1.9, drift:  9,  w: 7,  h: 11, shape: "rect",     spin: 720  },
  { color: GREENS[7], x: 53, delay: 0.6,  dur: 1.6, drift: -11, w: 6,  h: 6,  shape: "square",   spin: 540  },
  { color: GREENS[8], x: 60, delay: 0.25, dur: 2.0, drift:  7,  w: 5,  h: 9,  shape: "rect",     spin: 360  },
  { color: GREENS[0], x: 67, delay: 0.45, dur: 1.8, drift: -9,  w: 8,  h: 5,  shape: "streamer", spin: 1080 },
  { color: GREENS[1], x: 74, delay: 0.7,  dur: 2.1, drift:  10, w: 6,  h: 6,  shape: "circle",   spin: 0    },
  { color: GREENS[2], x: 80, delay: 0.8,  dur: 1.7, drift: -7,  w: 7,  h: 10, shape: "rect",     spin: 720  },
  { color: GREENS[3], x: 87, delay: 0.2,  dur: 2.3, drift:  5,  w: 6,  h: 6,  shape: "square",   spin: 540  },
  { color: GREENS[4], x: 93, delay: 0.55, dur: 1.9, drift: -8,  w: 9,  h: 5,  shape: "streamer", spin: 900  },
  { color: GREENS[6], x: 21, delay: 0.35, dur: 1.7, drift: -6,  w: 6,  h: 6,  shape: "circle",   spin: 0    },
  { color: GREENS[7], x: 35, delay: 0.65, dur: 2.2, drift:  8,  w: 8,  h: 5,  shape: "streamer", spin: 1080 },
  { color: GREENS[8], x: 50, delay: 0.12, dur: 1.8, drift: -10, w: 7,  h: 11, shape: "rect",     spin: 720  },
];

export function MilestoneCard({
  milestone,
  onCongratulate,
}: {
  milestone: MilestonePost["milestone"];
  onCongratulate?: () => void;
}) {
  return (
    <div className="relative mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 overflow-hidden">
        {CONFETTI.map((c, i) => (
          <motion.div
            key={i}
            className="absolute top-0"
            style={{ left: `${c.x}%`, width: c.w, height: c.h, backgroundColor: c.color, borderRadius: c.shape === "circle" ? "50%" : "2px" }}
            initial={{ y: -14, x: 0, opacity: 1, rotate: 0, scaleX: 1 }}
            animate={{
              y: 72,
              x: [0, c.drift * 0.4, c.drift, c.drift * 0.6, 0],
              opacity: [1, 1, 1, 0.6, 0],
              rotate: c.spin,
              scaleX: c.shape === "streamer" ? [1, 0.2, 1, 0.2, 1] : [1, 0.3, 1, 0.3, 1],
            }}
            transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, repeatDelay: 1.8 + c.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </div>
      <div className="px-5 py-5">
        <div className="flex items-end gap-4">
          <div className="relative flex shrink-0 items-center">
            {milestone.schoolLogo ? (
              <img src={milestone.schoolLogo} alt={milestone.school} className="relative z-0 h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-white" />
            ) : (
              <div className="relative z-0 flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-[26px] font-bold text-white ring-2 ring-white" style={{ backgroundColor: milestone.schoolColor }}>
                {milestone.schoolInitial}
              </div>
            )}
            <div className="relative z-10 -ml-6 shrink-0">
              <img src={milestone.clientAvatar} alt={milestone.clientName} className="h-20 w-20 rounded-full object-cover ring-2 ring-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[16px] shadow-sm">🎉</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium uppercase tracking-wide text-gray-light">Admitted</p>
            <p className="mt-0.5 text-[17px] font-medium leading-tight text-gray-dark">{milestone.school}</p>
            <p className="text-[14px] text-gray-light">{milestone.program}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onCongratulate?.(); }}
            className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-200"
          >
            Say congratulations
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Live card ─────────────────────────────────────────

const LIVE_CHAT = [
  "How do you handle the 'why consulting' question?",
  "Should I cold email partners or go through recruiting?",
  "What's the biggest mistake candidates make in fit interviews?",
  "Is a non-target school a dealbreaker for MBB?",
  "How many cases should I do before my first round?",
  "What about lateral hires from industry?",
  "Can you talk about the BCG vs McKinsey culture diff?",
  "Love your content! 🙌",
];

function LiveCommentsFeed() {
  const [visible, setVisible] = useState<{ id: number; text: string }[]>([]);
  const counter = useRef(0);
  const index = useRef(0);

  useEffect(() => {
    setVisible([{ id: counter.current++, text: LIVE_CHAT[index.current++ % LIVE_CHAT.length] }]);
    const interval = setInterval(() => {
      const text = LIVE_CHAT[index.current++ % LIVE_CHAT.length];
      setVisible(prev => [...prev, { id: counter.current++, text }].slice(-4));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute bottom-10 left-3 flex w-[55%] flex-col gap-1.5 overflow-hidden">
      <AnimatePresence initial={false}>
        {visible.map(c => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <span className="rounded-lg bg-black/40 px-2 py-0.5 text-[11px] leading-snug text-white/90 backdrop-blur-sm">
              {c.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function LiveCard({ live, author, avatar }: { live: LivePost["live"]; author: string; avatar: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <div className="relative h-[280px] bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${live.videoId}?autoplay=1&mute=1&loop=1&playlist=${live.videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
          allow="autoplay; encrypted-media"
          className="h-full w-full"
          style={{ border: "none", pointerEvents: "none" }}
        />
        <LiveCommentsFeed />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[13px] font-semibold tracking-wide text-gray-dark">LIVE</span>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 text-white/90">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
          <span className="text-[12px] font-medium drop-shadow">{live.viewers.toLocaleString()} watching</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <p className="text-[17px] font-medium leading-snug text-gray-dark">{live.title}</p>
          <p className="mt-1 text-[14px] text-gray-light">{live.topic}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
          className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-200"
        >
          Join live
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="pointer-events-auto w-full max-w-[420px] rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
                <div className="relative overflow-hidden rounded-t-2xl bg-gray-dark px-6 pb-6 pt-8">
                  <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={avatar} alt={author} className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/20" style={{ objectPosition: "50% 15%" }} />
                      <span className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full bg-red-500 px-1.5 py-0.5">
                        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white opacity-80" />
                        <span className="text-[9px] font-bold text-white">LIVE</span>
                      </span>
                    </div>
                    <div>
                      <p className="text-[17px] font-semibold text-white">{author}</p>
                      <p className="text-[13px] text-white/70">{live.viewers.toLocaleString()} watching now</p>
                    </div>
                  </div>
                  <h2 className="mt-4 text-[22px] font-bold text-white">Join Office Hours</h2>
                  <p className="mt-1 text-[14px] leading-snug text-white/70">
                    {author} is live and answering questions in real time.
                  </p>
                </div>
                <div className="px-6 py-5">
                  <div className="rounded-xl border border-gray-stroke bg-gray-50 px-4 py-3">
                    <p className="text-[13px] text-gray-light">Session</p>
                    <p className="mt-0.5 text-[15px] font-semibold text-gray-dark">{live.title}</p>
                    <p className="text-[13px] text-gray-light">{live.topic}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                    <div>
                      <p className="text-[13px] text-gray-light">Access fee</p>
                      <p className="text-[15px] font-semibold text-gray-dark">One-time ticket</p>
                    </div>
                    <p className="text-[24px] font-bold text-gray-dark">$5</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-6 pb-6">
                  <button onClick={() => setShowModal(false)} className="w-full cursor-pointer rounded-xl bg-primary py-3 text-[16px] font-bold text-white transition-colors hover:bg-primary-hover">
                    Buy ticket · $5
                  </button>
                  <button onClick={() => setShowModal(false)} className="w-full cursor-pointer py-2 text-[14px] text-gray-light transition-colors hover:text-gray-dark">
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Post component ───────────────────────────────

export default function Post({
  post,
  onPostClick,
  onImageClick,
  onCommentClick,
}: {
  post: PostData;
  onPostClick?: (post: PostData) => void;
  onImageClick?: (idx: number) => void;
  onCommentClick?: (post: PostData) => void;
}) {
  const navigate = useNavigate();

  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick(post);
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick(post);
    } else {
      navigate(`/post/${post.id}`, { state: { focusInput: true } });
    }
  };

  const handleImageClick = (idx: number) => {
    if (onImageClick) {
      onImageClick(idx);
    } else {
      navigate(`/post/${post.id}`, { state: { focusImage: idx } });
    }
  };

  return (
    <div className="pt-5 pb-[14px]">
      <div className="flex gap-3 cursor-pointer" onClick={handlePostClick}>
        {/* Avatar */}
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <div
            className="group relative h-10 w-10 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); navigate(`/profile-v2?type=${post.verified ? "coach" : "customer"}`); }}
          >
            {post.type === "event" ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <img src={post.avatar} alt={post.author} className="h-5 w-5 brightness-0 invert" />
              </div>
            ) : (
              <img src={post.avatar} alt={post.author} className="h-10 w-10 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
            )}
            <div className="absolute inset-0 rounded-full bg-black/0 transition-colors group-hover:bg-black/10" />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <PostHeaderRow
            author={post.author}
            time={post.time}
            verified={post.verified}
            headline={post.headline}
          />
          <p className="mt-1 text-[17px] leading-[1.4] text-gray-dark">{post.body}</p>

          {/* Type-specific attachment */}
          <div className={post.type !== "text" ? "pb-1" : ""} onClick={(e) => e.stopPropagation()}>
            {post.type === "image" && (
              <PostImageGrid
                className="mt-3"
                images={post.images.map((src, i) => ({ src, aspectRatio: post.imageAspectRatios?.[i] }))}
                onImageClick={handleImageClick}
              />
            )}
            {post.type === "link" && <LinkCard link={post.link} />}
            {post.type === "event" && <EventCard event={post.event} />}
            {post.type === "milestone" && (
              <MilestoneCard
                milestone={post.milestone}
                onCongratulate={handleCommentClick}
              />
            )}
            {post.type === "live" && (
              <LiveCard live={post.live} author={post.author} avatar={post.avatar} />
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-1" onClick={(e) => e.stopPropagation()}>
        <PostActionBar
          likes={post.likes}
          comments={post.comments}
          reposts={post.reposts}
          shares={post.shares}
          postId={post.id}
          onCommentClick={handleCommentClick}
        />
      </div>
    </div>
  );
}
