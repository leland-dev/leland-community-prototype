import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { posts, type Post, FeedLikeButton, FeedRepostButton, ShareDropdown } from "./Home";

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

interface CommentData {
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
        author: "Sarah Chen",
        avatar: pic1,
        headline: "Admissions Coach",
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
    headline: "Career Coach",
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

function getCommentsForPost(postId: number): CommentData[] {
  // Rotate through seeds based on post id for variety
  const count = 3 + (postId % 3);
  return COMMENT_SEEDS.slice(0, count).map(c => ({
    ...c,
    id: c.id + postId * 1000,
    replies: c.replies?.map(r => ({ ...r, id: r.id + postId * 1000 })),
  }));
}

// ─── Sub-components ───────────────────────────────────

function AuthorRow({ post }: { post: Post }) {
  return (
    <div className="flex items-start gap-3">
      <img
        src={post.avatar}
        alt={post.author}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
        style={{ objectPosition: "50% 15%" }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-medium leading-tight text-gray-dark">{post.author}</span>
          {post.verified ? <img src={verifiedIconSrc} alt="" className="h-[15px] w-[15px] shrink-0" /> : null}
          <span className="shrink-0 text-[17px] leading-tight text-gray-xlight">{post.time}</span>
        </div>
        {post.headline ? (
          <p className="truncate text-[15px] leading-tight text-[#707070]">{post.headline}</p>
        ) : null}
      </div>
    </div>
  );
}

function PostMedia({ post }: { post: Post }) {
  if (post.type === "image") {
    const imgs = post.images;
    if (imgs.length === 1) {
      return <img src={imgs[0]} alt="" className="mt-3 w-full rounded-xl object-cover" style={{ maxHeight: 480 }} />;
    }
    return (
      <div className={`mt-3 grid gap-1 ${imgs.length === 2 ? "grid-cols-2" : imgs.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {imgs.map((img, i) => (
          <img key={i} src={img} alt="" className="aspect-square w-full rounded-lg object-cover" />
        ))}
      </div>
    );
  }

  if (post.type === "link") {
    return (
      <a href={post.link.url} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-xl border border-gray-stroke">
        <img src={post.link.image} alt="" className="h-[200px] w-full object-cover" />
        <div className="px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-gray-light">{post.link.domain}</p>
          <p className="mt-0.5 text-[15px] font-semibold text-gray-dark">{post.link.title}</p>
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
          <span className="absolute left-3 top-3 rounded-full bg-gray-100/90 px-2.5 py-0.5 text-[12px] font-semibold text-gray-dark backdrop-blur-sm">
            {event.format}
          </span>
        </div>
        <div className="px-4 py-4">
          <h3 className="text-[17px] font-semibold text-gray-dark">{event.title}</h3>
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[14px] text-gray-light">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {event.date}
            </div>
            <div className="flex items-center gap-2 text-[14px] text-gray-light">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {event.time}
            </div>
          </div>
          {event.spotsLeft != null ? (
            <p className="mt-2 text-[13px] text-gray-light">{event.spotsLeft} spots remaining</p>
          ) : null}
          <button className="mt-3 w-full rounded-lg bg-gray-100 py-2.5 text-[15px] font-medium text-gray-dark hover:bg-gray-200">
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
              className="relative z-0 flex h-14 w-14 items-center justify-center rounded-full text-[22px] font-bold text-white ring-2 ring-white"
              style={{ backgroundColor: milestone.schoolColor }}
            >
              {milestone.schoolInitial}
            </div>
            <div className="relative z-10 -ml-4 shrink-0">
              <img src={milestone.clientAvatar} alt={milestone.clientName} className="h-14 w-14 rounded-full object-cover ring-2 ring-white" />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-wide text-gray-light">Admitted</p>
            <p className="text-[17px] font-semibold text-gray-dark">{milestone.school}</p>
            <p className="text-[14px] text-gray-light">{milestone.program}</p>
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
    <div className="mt-2 flex items-center gap-2 py-1.5">
      <FeedLikeButton initialCount={post.likes} />
      {/* Comment */}
      <button
        onClick={onCommentFocus}
        className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover"
      >
        <img src={commentsIcon} alt="Comment" className="h-[22px] w-[22px] [filter:invert(44%)]" />
        {post.comments > 0 && <span className="text-[15px] font-normal">{post.comments.toLocaleString()}</span>}
      </button>
      {/* Repost */}
      <FeedRepostButton initialCount={post.reposts} />
      {/* Share */}
      <div className="relative">
        <button
          onClick={() => setShareOpen(o => !o)}
          className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover"
        >
          <img src={sharesIcon} alt="Share" className="h-[22px] w-[22px] [filter:invert(44%)]" />
        </button>
        <AnimatePresence>
          {shareOpen ? <ShareDropdown postId={post.id} onClose={() => setShareOpen(false)} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Comment components ───────────────────────────────

function ReplyInput({ onPost, onCancel }: { onPost: (text: string) => void; onCancel: () => void }) {
  const [text, setText] = useState("");
  return (
    <div
      className="mt-3 flex gap-3"
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node) && !text.trim()) {
          onCancel();
        }
      }}
    >
      <img src={profilePhoto} alt="You" className="h-9 w-9 shrink-0 rounded-full object-cover" />
      <div className="flex-1">
        <textarea
          autoFocus
          value={text}
          onChange={e => {
            setText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          placeholder="Write a reply…"
          rows={1}
          className="w-full resize-none overflow-hidden rounded-xl border border-gray-stroke px-3 py-2.5 text-[15px] text-gray-dark outline-none transition-[border] focus:border-gray-dark"
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && text.trim()) { onPost(text.trim()); } }}
        />
        <AnimatePresence>
          {text.trim() ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex justify-end"
            >
              <button
                onClick={() => { onPost(text.trim()); }}
                className="rounded-xl bg-gray-dark px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#222]"
              >
                Reply
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

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
          className="h-3.5 w-3.5"
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

function CommentItem({ comment, depth = 0 }: { comment: CommentData; depth?: number }) {
  const [liked, setLiked] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState<CommentData[]>(comment.replies ?? []);

  const addReply = (text: string) => {
    const newReply: CommentData = {
      id: Date.now(),
      author: "You",
      avatar: profilePhoto,
      time: "just now",
      text,
      likes: 0,
    };
    setReplies(r => [newReply, ...r]);
    setShowReply(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 py-2"
    >
      <img
        src={comment.avatar}
        alt={comment.author}
        className={`${depth === 0 ? "h-9 w-9" : "h-7 w-7"} shrink-0 rounded-full object-cover`}
        style={{ objectPosition: "50% 15%" }}
      />
      <div className="min-w-0 flex-1">
        {/* Author + time */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold text-gray-dark">{comment.author}</span>
          {comment.headline ? (
            <span className="text-[13px] text-gray-light">· {comment.headline}</span>
          ) : null}
          <span className="text-[13px] text-gray-light">· {comment.time}</span>
        </div>

        {/* Comment text */}
        <p className="mt-0.5 text-[17px] leading-[1.45] text-gray-dark">{comment.text}</p>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4">
          <HeartButton liked={liked} count={comment.likes + (liked ? 1 : 0)} onToggle={() => setLiked(l => !l)} />
          {depth === 0 ? (
            <button
              onClick={() => setShowReply(s => !s)}
              className="text-[13px] text-gray-light transition-colors hover:text-gray-dark"
            >
              Reply
            </button>
          ) : null}
        </div>

        {/* Reply input */}
        {showReply ? <ReplyInput onPost={addReply} onCancel={() => setShowReply(false)} /> : null}

        {/* Nested replies */}
        {replies.length > 0 ? (
          <div className="mt-1 pl-2">
            {replies.map(r => (
              <CommentItem key={r.id} comment={r} depth={1} />
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { focusInput = false, prefillComment = "" } = (location.state as { sourceY?: number; focusInput?: boolean; prefillComment?: string }) ?? {};
  const post = posts.find(p => p.id === Number(postId));
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    if (focusInput) {
      const t = setTimeout(() => commentInputRef.current?.focus(), 380);
      return () => clearTimeout(t);
    }
  }, [focusInput]);

  const [commentText, setCommentText] = useState(prefillComment);
  const [comments, setComments] = useState<CommentData[]>(() =>
    post ? getCommentsForPost(post.id) : []
  );

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-light">
        <p className="text-[17px]">Post not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">
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
    setComments(c => [newComment, ...c]);
    setCommentText("");
  };

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="xl:ml-[340px]"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 flex items-center gap-2 text-[15px] text-gray-light transition-colors hover:text-gray-dark"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </button>

      {/* Post */}
      <div className="mt-3 pb-2">
        <AuthorRow post={post} />
        <p className="mt-1 pl-[56px] text-[17px] leading-[1.4] text-gray-dark">{post.body}</p>
        <div className="pl-[56px]"><PostMedia post={post} /></div>
        <div className="pl-[56px]"><StatsRow post={post} onCommentFocus={() => commentInputRef.current?.focus()} /></div>
      </div>

      {/* Comment input */}
      <div className="flex gap-3 py-2">
        <img
          src={profilePhoto}
          alt="You"
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            ref={commentInputRef}
            value={commentText}
            onChange={e => {
              setCommentText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Add a comment…"
            rows={1}
            className="w-full resize-none overflow-hidden rounded-xl border border-gray-stroke px-3 py-2.5 text-[15px] text-gray-dark outline-none transition-[border] focus:border-gray-dark"
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitComment(); }}
          />
          <AnimatePresence>
            {commentText.trim() ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex justify-end"
              >
                <button
                  onClick={submitComment}
                  className="rounded-xl bg-gray-dark px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#222]"
                >
                  Post
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-1">
        {comments.map(c => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>
    </motion.div>
  );
}
