import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell, Camera, Send, UserPlus, MessageCircle, Check, Heart, Pin } from "lucide-react";

import { seededFeed, COACH_REPLY, type FeedPost } from "../mockData";

/* Screen 8 — cohort arrival. The handoff, not a tutorial. Pre-seeded feed,
   pre-filled intro composer; the notification ask fires only after they post. */

function ChecklistCard({ done }: { done: Record<string, boolean> }) {
  const items = [
    { key: "photo", icon: Camera, label: "Add a photo" },
    { key: "intro", icon: Send, label: "Post your intro" },
    { key: "follow", icon: UserPlus, label: "Follow 3 coaches" },
    { key: "reply", icon: MessageCircle, label: "Reply to someone" },
  ];
  const count = items.filter((i) => done[i.key]).length;
  return (
    <div className="rounded-2xl border border-gray-stroke bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[14px] font-semibold text-gray-dark">Get settled in</p>
        <span className="text-[12px] font-medium text-gray-light tabular-nums">
          {count}/{items.length}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((it) => {
          const isDone = done[it.key];
          const Icon = it.icon;
          return (
            <div key={it.key} className="flex items-center gap-3 py-1">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  isDone ? "bg-gray-dark text-white" : "bg-black/[0.05] text-gray-light"
                }`}
              >
                {isDone ? <Check size={15} strokeWidth={3} /> : <Icon size={15} />}
              </span>
              <span
                className={`text-[14px] ${
                  isDone ? "text-gray-light line-through" : "text-gray-dark"
                }`}
              >
                {it.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: FeedPost }) {
  return (
    <div className="rounded-2xl border border-gray-stroke bg-white p-4">
      {post.pinned ? (
        <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-light">
          <Pin size={12} /> Pinned
        </div>
      ) : null}
      <div className="flex items-center gap-2.5">
        <img src={post.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-tight text-gray-dark">
            {post.author}
            {post.coach ? (
              <span className="ml-1.5 rounded bg-gray-dark px-1.5 py-0.5 text-[10px] font-semibold text-white">
                COACH
              </span>
            ) : null}
          </p>
          <p className="text-[12px] text-gray-light">
            {post.role} · {post.time}
          </p>
        </div>
      </div>
      <p className="mt-2.5 text-[14px] leading-relaxed text-gray-dark">{post.text}</p>
      <div className="mt-3 flex items-center gap-5 text-[12.5px] text-gray-light">
        <span className="flex items-center gap-1">
          <Heart size={14} /> {post.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={14} /> {post.replies}
        </span>
      </div>
    </div>
  );
}

export default function CohortArrival({
  cohortName,
  memberCount,
  introDraft,
  onExit,
}: {
  cohortName: string;
  memberCount: number;
  introDraft: string;
  onExit: () => void;
}) {
  const [feed, setFeed] = useState<FeedPost[]>(() => seededFeed(cohortName));
  const [intro, setIntro] = useState(introDraft);
  const [posted, setPosted] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const replyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(replyTimer.current), []);

  const postIntro = () => {
    if (!intro.trim() || posted) return;
    const mine: FeedPost = {
      id: "mine",
      author: "You",
      avatar: "",
      role: "New member",
      time: "now",
      text: intro.trim(),
      likes: 0,
      replies: 0,
    };
    setFeed((f) => [f[0], mine, ...f.slice(1)]);
    setPosted(true);
    setDone((d) => ({ ...d, intro: true }));
    setShowNotif(true);
    // simulate a coach reply landing shortly after (concierge SLA moment)
    replyTimer.current = window.setTimeout(() => {
      setFeed((f) =>
        f.map((p) =>
          p.id === "mine" ? { ...p, replies: p.replies + 1 } : p,
        ),
      );
      const reply: FeedPost = {
        id: "reply",
        author: COACH_REPLY.author,
        avatar: COACH_REPLY.avatar,
        role: COACH_REPLY.role,
        time: "now",
        coach: true,
        text: COACH_REPLY.text,
        likes: 3,
        replies: 0,
      };
      setFeed((f) => [f[0], f[1], reply, ...f.slice(2)]);
    }, 6000);
  };

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* cohort banner with a one-time shimmer */}
      <div className="relative shrink-0 overflow-hidden bg-gray-dark px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] text-white">
        <button
          onClick={onExit}
          className="absolute right-3 top-[max(0.9rem,env(safe-area-inset-top))] flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="Enter full app"
        >
          <X size={16} />
        </button>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
          You're in
        </p>
        <p className="mt-1 font-serif text-[24px] leading-tight">{cohortName}</p>
        <p className="text-[13px] text-white/70">{memberCount} members</p>
        <motion.div
          initial={{ x: "-120%" }}
          animate={{ x: "220%" }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 0.35 }}
          className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />
      </div>

      {/* feed */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {/* pre-filled intro composer */}
        {!posted ? (
          <div className="rounded-2xl border border-gray-stroke bg-white p-4 shadow-card">
            <p className="mb-2 text-[13px] font-semibold text-gray-dark">
              Introduce yourself
            </p>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-stroke bg-[#fafafa] p-3 text-[14px] leading-relaxed text-gray-dark outline-none focus:border-gray-dark/40"
            />
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={postIntro}
                className="flex items-center gap-1.5 rounded-full bg-gray-dark px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#333]"
              >
                <Send size={15} />
                Post intro
              </button>
            </div>
          </div>
        ) : null}

        {/* notification ask — only after posting */}
        <AnimatePresence>
          {showNotif ? (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 rounded-2xl border border-gray-dark/15 bg-white p-4 shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-gray-dark">
                <Bell size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium text-gray-dark">
                  Get replies from your cohort
                </span>
                <span className="block text-[12.5px] text-gray-light">
                  We'll ping you when someone responds.
                </span>
              </span>
              <button
                onClick={() => setShowNotif(false)}
                className="shrink-0 rounded-full bg-gray-dark px-3 py-1.5 text-[13px] font-medium text-white"
              >
                Enable
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ChecklistCard done={done} />

        {feed.map((p) =>
          p.id === "mine" ? (
            <div
              key={p.id}
              className="rounded-2xl border border-gray-dark/15 bg-white p-4 shadow-card"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-dark text-[13px] font-semibold text-white">
                  You
                </span>
                <div>
                  <p className="text-[14px] font-semibold leading-tight text-gray-dark">
                    You
                  </p>
                  <p className="text-[12px] text-gray-light">{p.role} · now</p>
                </div>
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-gray-dark">
                {p.text}
              </p>
            </div>
          ) : (
            <PostCard key={p.id} post={p} />
          ),
        )}
      </div>
    </div>
  );
}
