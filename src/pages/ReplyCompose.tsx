import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";

import { posts } from "./Home";
import { addPostComment, addPostReply, type CommentData } from "./PostDetail";

import profilePhoto from "../assets/profile photos/profile photo.png";
import verifiedIconSrc from "../assets/icons/verified.svg";

// What the reply is aimed at — the post itself, or a specific comment.
type ReplyTarget = { kind: "post" } | { kind: "comment"; comment: CommentData };

// Focused reply page — a dedicated full-screen composer (Twitter-style) reached
// by tapping the comment icon on a post or the Reply button on a comment. Shows
// what's being replied to at the top with a thread connector, then a roomy
// input below. Submitting returns to the post with the new reply threaded in.
export default function ReplyCompose() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();
  const target = (location.state as { target?: ReplyTarget })?.target ?? { kind: "post" };
  const post = posts.find(p => p.id === Number(postId));

  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const canReply = text.trim().length > 0;

  // Slide-out-then-navigate: the page slides off to the right, then we run the
  // pending navigation. Enter animation is x:100% → 0; leaving flips it back.
  const [leaving, setLeaving] = useState(false);
  const pendingNav = useRef<() => void>(() => navigate(-1));
  const close = () => { pendingNav.current = () => navigate(-1); setLeaving(true); };

  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-light">
        <p className="text-[15px]">Post not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-gray-dark hover:underline">← Go home</button>
      </div>
    );
  }

  // Fields for the thing being replied to.
  const targetAuthor = target.kind === "comment" ? target.comment.author : post.author;
  const targetAvatar = target.kind === "comment" ? target.comment.avatar : post.avatar;
  const targetHeadline = target.kind === "comment" ? target.comment.headline : post.headline;
  const targetTime = target.kind === "comment" ? target.comment.time : post.time;
  const targetText = target.kind === "comment" ? target.comment.text : post.body;
  const targetVerified = target.kind === "comment" ? false : post.verified;
  const targetGroupColor = target.kind === "comment" ? undefined : post.groupColor;

  const submit = () => {
    if (!canReply) return;
    const reply: CommentData = {
      id: Date.now(),
      author: "You",
      avatar: profilePhoto,
      time: "just now",
      text: text.trim(),
      likes: 0,
    };
    if (target.kind === "comment") {
      addPostReply(post.id, target.comment.id, reply);
    } else {
      addPostComment(post.id, reply);
    }
    pendingNav.current = () => navigate(`/post/${post.id}`, { replace: true });
    setLeaving(true);
  };

  const Avatar = ({ src, name, color }: { src?: string; name: string; color?: string }) =>
    src ? (
      <img src={src} alt={name} className="h-11 w-11 shrink-0 rounded-full object-cover" style={{ objectPosition: "50% 15%" }} />
    ) : (
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[18px] font-semibold text-white"
        style={{ backgroundColor: color ?? "#2563EB" }}
      >
        {name.charAt(0)}
      </div>
    );

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: leaving ? "100%" : 0 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      onAnimationComplete={() => { if (leaving) pendingNav.current(); }}
      style={{ height: "100dvh" }}
      className="fixed left-0 right-0 top-0 z-[60] flex flex-col bg-white"
    >
      {/* Header — back + Reply. Kept out of the scroll area (flex-col + dvh
          height) so the Reply button stays visible when the keyboard opens. */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-stroke bg-white px-3 py-2.5 pt-[calc(env(safe-area-inset-top)+10px)]">
        <button
          onClick={close}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={submit}
          disabled={!canReply}
          className={`rounded-full px-5 py-1.5 text-[14px] font-semibold transition-colors ${
            canReply
              ? "bg-[#FFD96F] text-[#111111] hover:bg-[#F3C948]"
              : "cursor-not-allowed bg-gray-hover text-gray-light"
          }`}
        >
          Reply
        </button>
      </div>

      <div className="mx-auto w-full max-w-[600px] flex-1 overflow-y-auto px-4">
        {/* Target being replied to, with a thread connector dropping to the reply. */}
        <div className="flex gap-3 pt-4">
          <div className="flex flex-col items-center">
            <Avatar src={targetAvatar} name={targetAuthor} color={targetGroupColor} />
            <div className="my-1 w-px flex-1 bg-gray-200" />
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium leading-tight text-gray-dark">{targetAuthor}</span>
              {targetVerified ? <img src={verifiedIconSrc} alt="" className="h-[15px] w-[15px] shrink-0" /> : null}
              <span className="shrink-0 text-[15px] leading-tight text-gray-xlight">{targetTime}</span>
            </div>
            {targetHeadline ? <p className="truncate text-[13px] leading-tight text-[#707070]">{targetHeadline}</p> : null}
            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-[1.45] text-gray-dark">{targetText}</p>
            <p className="mt-3 text-[13px] text-gray-light">
              Replying to <span className="font-medium text-gray-dark">{targetAuthor}</span>
            </p>
          </div>
        </div>

        {/* Reply composer */}
        <div className="flex gap-3 pt-1 pb-6">
          <img src={profilePhoto} alt="You" className="h-11 w-11 shrink-0 rounded-full object-cover" />
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Post your reply"
            rows={3}
            className="mt-2 min-h-[120px] flex-1 resize-none bg-transparent text-[17px] leading-[1.4] text-gray-dark outline-none placeholder:text-gray-light"
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
          />
        </div>
      </div>
    </motion.div>
  );
}
