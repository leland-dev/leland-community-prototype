import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { posts } from "./Home";

import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic11 from "../assets/profile photos/pic-11.png";

// ─── Replay viewer — the live-stream surface, after the fact ────────────────
// Same structure as the live room (video up top, Info / Chat / Viewers tabs
// below) so replays land somewhere familiar; the chat is replayed with stream
// timestamps instead of scrolling live.

const REPLAY_CHAT = [
  { at: "0:42", user: "alex_mba", avatar: pic2, text: "How do you handle the 'why consulting' question?" },
  { at: "2:15", user: "priya_t", avatar: pic3, text: "Should I cold email partners or go through recruiting?" },
  { at: "4:03", user: "jliu_biz", avatar: pic5, text: "What's the biggest mistake candidates make in fit interviews?" },
  { at: "6:47", user: "sarah_k", avatar: pic9, text: "This bullet-rewrite format is so useful 🙌" },
  { at: "9:12", user: "mwilliams", avatar: pic11, text: "Is a non-target school a dealbreaker for MBB?" },
  { at: "12:30", user: "r_nguyen", avatar: pic2, text: "Could you do one of these for cover letters?" },
  { at: "15:08", user: "dkim_mba", avatar: pic3, text: "The 'one story per bullet' rule just clicked for me" },
  { at: "18:55", user: "emma_r", avatar: pic5, text: "How many drafts do your clients usually go through?" },
  { at: "23:41", user: "jchen", avatar: pic9, text: "Joined late — is the first resume example recorded?" },
  { at: "31:20", user: "olivia_p", avatar: pic11, text: "This was worth skipping lunch for. Thank you!" },
];

const VIEWERS = [
  { name: "Priya Nair", avatar: pic3, note: "HBS MBA '25" },
  { name: "Marcus Lee", avatar: pic2, note: "Consulting" },
  { name: "Sofia Ramirez", avatar: pic5, note: "MBA Admissions" },
  { name: "James Allen", avatar: pic1, note: "Career pivot" },
  { name: "Alex Thompson", avatar: pic8, note: "Tech recruiting" },
  { name: "Rachel Nguyen", avatar: pic9, note: "MBA Admissions" },
  { name: "Olivia Park", avatar: pic11, note: "Law school" },
];

const TABS = ["Info", "Chat", "Viewers"] as const;
type Tab = (typeof TABS)[number];

export default function ReplayViewer() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Chat");
  const post = posts.find(p => p.id === Number(postId));
  const live = post?.type === "live" ? post.live : undefined;

  const tabCount = (t: Tab) =>
    t === "Chat" ? REPLAY_CHAT.length : t === "Viewers" ? VIEWERS.length : null;

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col">
        {/* Player pinned dark at the top, back floats over it */}
        <div className="relative shrink-0 bg-black">
          <video
            src={live?.videoSrc ?? "/videos/sabrina.mp4"}
            autoPlay
            playsInline
            controls
            className="aspect-[4/3] w-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
        </div>

        {/* Info / Chat / Viewers — same tabs as the live room */}
        <div className="flex shrink-0 items-center gap-2 border-b border-gray-stroke px-4 py-3">
          {TABS.map(t => {
            const count = tabCount(t);
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
                  tab === t ? "bg-gray-dark text-white" : "bg-gray-100 text-gray-light hover:bg-gray-200"
                }`}
              >
                {t}
                {count !== null ? <span className={tab === t ? "text-white/70" : "text-gray-xlight"}>{count}</span> : null}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
          {tab === "Info" ? (
            <div className="pt-4">
              <p className="text-[18px] font-semibold leading-snug text-gray-dark">{live?.title ?? "Live session replay"}</p>
              {post ? (
                <div className="mt-3 flex items-center gap-2.5">
                  <img src={post.avatar} alt={post.author} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-[14px] font-semibold text-gray-dark">{post.author}</p>
                    <p className="text-[12px] text-gray-light">{post.headline}</p>
                  </div>
                </div>
              ) : null}
              <p className="mt-3 text-[13px] text-gray-light">
                Streamed live{live?.duration ? ` · ${live.duration}` : ""}{live?.peakViewers ? ` · ${live.peakViewers} watching at peak` : ""}
              </p>
              <p className="mt-4 text-[15px] leading-[1.55] text-gray-dark">
                A working session, recorded live with the community. Questions from
                the chat are answered throughout — jump around with the scrubber or
                follow along with the chat replay.
              </p>
            </div>
          ) : null}

          {tab === "Chat" ? (
            <div className="pt-2">
              {REPLAY_CHAT.map(m => (
                <div key={m.at} className="flex items-start gap-2.5 py-2.5">
                  <img src={m.avatar} alt="" className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug text-gray-dark">
                      <span className="font-semibold">{m.user}</span>{" "}
                      <span className="text-gray-xlight">{m.at}</span>
                    </p>
                    <p className="mt-0.5 text-[14px] leading-snug text-gray-dark">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "Viewers" ? (
            <div className="pt-2">
              {post ? (
                <div className="flex items-center gap-2.5 py-2.5">
                  <img src={post.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-gray-dark">{post.author} <span className="font-normal text-gray-light">(Host)</span></p>
                    <p className="text-[12px] text-gray-light">{post.headline}</p>
                  </div>
                </div>
              ) : null}
              {VIEWERS.map(v => (
                <div key={v.name} className="flex items-center gap-2.5 py-2.5">
                  <img src={v.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-gray-dark">{v.name}</p>
                    <p className="text-[12px] text-gray-light">{v.note}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
