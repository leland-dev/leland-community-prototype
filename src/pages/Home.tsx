import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import profilePhoto from "../assets/profile photos/profile photo.png";
import eventImageSrc from "../assets/img/EventImage.avif";
import lelandCompass from "../assets/leland-compass.svg";

// Organisation logos
import orgHBS       from "../assets/org-logos/hbs.png";
import orgKellogg   from "../assets/org-logos/kellogg.png";
import orgMITSloan  from "../assets/org-logos/mit-sloan.png";
import orgColumbia  from "../assets/org-logos/columbia.png";
import orgHaas      from "../assets/org-logos/haas.png";
import orgTuck      from "../assets/org-logos/tuck.png";
import orgFuqua     from "../assets/org-logos/fuqua.png";
import orgMcKinsey  from "../assets/org-logos/mckinsey.png";
import orgBain      from "../assets/org-logos/bain.png";
import orgBCG       from "../assets/org-logos/bcg.png";
import orgDeloitte  from "../assets/org-logos/deloitte.png";
import orgGoogle    from "../assets/org-logos/google.png";
import orgOpenAI    from "../assets/org-logos/openai.png";

import commentsIcon from "../assets/icons/comments.svg";
import repostsIcon from "../assets/icons/reposts.svg";
import sharesIcon from "../assets/icons/shares.svg";
import verifiedIcon from "../assets/icons/verified.svg";

import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic12 from "../assets/profile photos/pic-12.png";
import pic13 from "../assets/profile photos/pic-13.png";
import pic14 from "../assets/profile photos/pic-14.png";

import stanford1 from "../assets/placeholder post assets/stanford-post/00c1e12547190979b4db2978dbe211e2.jpg";
import stanford2 from "../assets/placeholder post assets/stanford-post/39a9980b59e79fa3b58e8d7d5145b9a9.jpg";
import stanford3 from "../assets/placeholder post assets/stanford-post/989ac1d56cf981c783808b83154d8a25.jpg";
import stanford4 from "../assets/placeholder post assets/stanford-post/eb80edada3b3db7955379d433ca2861a.jpg";

// ─── Types ────────────────────────────────────────────

interface PostBase {
  id: number;
  author: string;
  avatar: string;
  time: string;
  verified?: boolean;
  headline?: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
}

interface TextPost extends PostBase {
  type: "text";
  body: string;
}

interface ImagePost extends PostBase {
  type: "image";
  body: string;
  images: string[];
}

interface LinkPost extends PostBase {
  type: "link";
  body: string;
  link: {
    url: string;
    domain: string;
    title: string;
    image: string;
  };
}

interface EventPost extends PostBase {
  type: "event";
  body: string;
  event: {
    title: string;
    image: string;
    date: string;
    time: string;
    format: "Online" | "In-person";
    spotsLeft?: number;
  };
}

interface MilestonePost extends PostBase {
  type: "milestone";
  body: string;
  milestone: {
    school: string;
    program: string;
    clientName: string;
    clientAvatar: string;
    schoolColor: string;
    schoolInitial: string;
  };
}

interface LivePost extends PostBase {
  type: "live";
  body: string;
  live: {
    title: string;
    videoId: string;
    viewers: number;
    topic: string;
  };
}

export type Post = TextPost | ImagePost | LinkPost | EventPost | MilestonePost | LivePost;
export type { TextPost, ImagePost, LinkPost, EventPost, MilestonePost, LivePost };

// ─── Sample data ──────────────────────────────────────

export const posts: Post[] = [
  {
    id: 1,
    type: "text",
    author: "Sarah Chen",
    avatar: pic1,
    time: "2h",
    verified: true,
    headline: "Former Director of Programs and Admissions at Stanford GSB",
    body: "Just wrapped up my first week at McKinsey. The learning curve is steep but the people are incredible. Grateful for the Leland community that helped me prep for case interviews — couldn't have done it without you all.",
    likes: 142,
    comments: 18,
    reposts: 5,
    shares: 3,
  },
  {
    id: 2,
    type: "image",
    author: "Marcus Williams",
    avatar: pic2,
    time: "4h",
    body: "Stanford GSB admit weekend was everything I hoped for and more. The campus, the people, the energy — can't wait to start in the fall. Here are some highlights:",
    images: [stanford1, stanford2, stanford3, stanford4],
    likes: 384,
    comments: 42,
    reposts: 12,
    shares: 8,
  },
  {
    id: 3,
    type: "link",
    author: "Priya Patel",
    avatar: pic3,
    time: "6h",
    body: "This article perfectly captures why networking in MBA admissions is so misunderstood. It's not about collecting contacts — it's about genuine curiosity.",
    link: {
      url: "https://example.com/mba-networking",
      domain: "hbr.org",
      title: "The Art of Networking in Business School Admissions",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=340&fit=crop",
    },
    likes: 89,
    comments: 7,
    reposts: 23,
    shares: 11,
  },
  {
    id: 4,
    type: "text",
    author: "David Kim",
    avatar: pic4,
    time: "8h",
    verified: true,
    headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
    body: "Hot take: the GMAT is not the most important part of your MBA application. I've seen 780 scorers get rejected and 680 scorers get into M7. Your story matters more than your score.",
    likes: 521,
    comments: 63,
    reposts: 34,
    shares: 2,
  },
  {
    id: 13,
    type: "event",
    author: "Leland",
    avatar: lelandCompass,
    time: "1h",
    headline: "Official Leland Events",
    body: "Join us for a live panel with admissions officers from HBS, Wharton, and GSB. Get your questions answered directly — no fluff, no scripts.",
    event: {
      title: "Public Policy Graduate Programs: Ask Me Anything",
      image: eventImageSrc,
      date: "Thursday, April 3, 2026",
      time: "6:00 PM – 7:30 PM PT",
      format: "Online",
      spotsLeft: 38,
    },
    likes: 214,
    comments: 29,
    reposts: 61,
    shares: 12,
  },
  {
    id: 14,
    type: "milestone",
    author: "David Kim",
    avatar: pic4,
    time: "2h",
    verified: true,
    headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
    body: "Incredibly proud of my client Jordan. We worked together for 6 months — rebuilding his narrative from scratch, reframing his non-traditional background into his biggest asset. Today he got the call from Wharton. This is why I do this work. 🎉",
    milestone: {
      school: "Wharton School",
      program: "MBA, Class of 2028",
      clientName: "Jordan M.",
      clientAvatar: pic6,
      schoolColor: "#002f6c",
      schoolInitial: "W",
    },
    likes: 431,
    comments: 47,
    reposts: 22,
    shares: 8,
  },
  {
    id: 15,
    type: "live",
    author: "Eric",
    avatar: pic7,
    time: "Now",
    verified: true,
    headline: "Ex-McKinsey | Consulting Recruiting Coach | 400+ Offers",
    body: "Going live to answer your consulting recruiting questions — case prep, fit interviews, offer negotiation. Drop your questions in the chat.",
    live: {
      title: "Consulting Recruiting Q&A",
      videoId: "1cfIAVasP6E",
      viewers: 214,
      topic: "Case prep · Fit interviews · Offer negotiation",
    },
    likes: 87,
    comments: 53,
    reposts: 12,
    shares: 6,
  },
  {
    id: 5,
    type: "image",
    author: "Emma Rodriguez",
    avatar: pic5,
    time: "10h",
    body: "Coaching session with an incredible candidate today. Went from a shaky \"tell me about yourself\" to a compelling 2-minute narrative. Love this work.",
    images: [
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=750&fit=crop",
    ],
    likes: 67,
    comments: 4,
    reposts: 1,
    shares: 0,
  },
  {
    id: 6,
    type: "text",
    author: "James Liu",
    avatar: pic6,
    time: "12h",
    body: "After 6 months of prep, 4 applications, and 2 interviews — I just got the call. Bain offered me a position in their SF office. I'm literally shaking right now. Thank you to everyone who believed in me when I didn't believe in myself.",
    likes: 892,
    comments: 97,
    reposts: 41,
    shares: 15,
  },
  {
    id: 7,
    type: "link",
    author: "Nina Kowalski",
    avatar: pic7,
    time: "14h",
    verified: true,
    headline: "Partner at McKinsey & Company | Recruiting Lead",
    body: "For anyone targeting consulting — this breakdown of the market map in 2026 is the best I've seen. Boutiques are quietly eating into MBB territory in some sectors.",
    link: {
      url: "https://example.com/consulting-2026",
      domain: "strategyand.pwc.com",
      title: "State of the Consulting Industry: 2026 Market Landscape",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop",
    },
    likes: 156,
    comments: 21,
    reposts: 38,
    shares: 19,
  },
  {
    id: 8,
    type: "text",
    author: "Alex Thompson",
    avatar: pic8,
    time: "16h",
    verified: true,
    headline: "Management Consultant | Career Coach for Non-Traditional Backgrounds",
    body: "Unpopular opinion: you don't need an MBA to break into consulting. I did it with a non-target undergrad and 3 years at a startup. AMA.",
    likes: 234,
    comments: 89,
    reposts: 15,
    shares: 4,
  },
  {
    id: 9,
    type: "image",
    author: "Rachel Nguyen",
    avatar: pic9,
    time: "1d",
    body: "Throwback to our Wharton study group that turned into lifelong friends. Two years later and we still meet every month. Business school is really about the people.",
    images: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=750&fit=crop",
    ],
    likes: 445,
    comments: 31,
    reposts: 8,
    shares: 6,
  },
  {
    id: 10,
    type: "text",
    author: "Michael Chen",
    avatar: pic10,
    time: "1d",
    verified: true,
    headline: "Ex-BCG Consultant | 500+ Case Interview Hours Coached",
    body: "Tip for MBB interviews: the frameworks are just training wheels. The best candidates drop the framework mid-case when they spot something interesting. Interviewers want to see how you think, not how well you memorized Victor Cheng.",
    likes: 312,
    comments: 44,
    reposts: 27,
    shares: 9,
  },
  {
    id: 11,
    type: "link",
    author: "Olivia Park",
    avatar: pic11,
    time: "1d",
    body: "New essay guide just dropped for HBS 2027 intake. The prompt changed subtly but the implications are huge for positioning.",
    link: {
      url: "https://example.com/hbs-essay",
      domain: "poetsandquants.com",
      title: "Breaking Down the HBS Essay Prompt for 2027 Applicants",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=340&fit=crop",
    },
    likes: 203,
    comments: 35,
    reposts: 52,
    shares: 24,
  },
  {
    id: 12,
    type: "text",
    author: "Ryan Foster",
    avatar: pic12,
    time: "2d",
    body: "Just hit 100 coaching sessions on Leland. What I've learned: every single person has a compelling story — most just need help finding it. The \"I'm not interesting enough\" narrative is almost never true.",
    likes: 178,
    comments: 22,
    reposts: 9,
    shares: 3,
  },
];

// ─── Icons ────────────────────────────────────────────

function MoreDotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toString();
}

const FEED_HEART_PARTICLES = [
  { angle: -80,  r: 28, color: "#ff4757", size: 6 },
  { angle: -40,  r: 32, color: "#fd79a8", size: 5 },
  { angle: -10,  r: 25, color: "#ff6b81", size: 7 },
  { angle: 20,   r: 30, color: "#ff4757", size: 5 },
  { angle: 55,   r: 28, color: "#ff6348", size: 6 },
  { angle: 90,   r: 32, color: "#ff4757", size: 5 },
  { angle: 130,  r: 25, color: "#fd79a8", size: 7 },
  { angle: 160,  r: 30, color: "#ff6b81", size: 5 },
  { angle: 200,  r: 28, color: "#ff4757", size: 6 },
  { angle: 240,  r: 25, color: "#ff6348", size: 5 },
  { angle: 270,  r: 32, color: "#fd79a8", size: 6 },
  { angle: 310,  r: 28, color: "#ff4757", size: 5 },
];

function FeedLikeButton({ initialCount }: { initialCount: number }) {
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
          {burst ? FEED_HEART_PARTICLES.map((p, i) => (
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
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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
        className="absolute bottom-full left-0 z-50 mb-2 w-52 overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-lg"
      >
        <button onClick={copyLink} className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-gray-dark hover:bg-gray-hover">
          {copied ? (
            <svg className="h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          )}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <div className="mx-4 border-t border-gray-stroke" />
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
          target="_blank" rel="noopener noreferrer"
          onClick={onClose}
          className="flex w-full items-center gap-3 px-4 py-3 text-[15px] text-gray-dark hover:bg-gray-hover"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`}
          target="_blank" rel="noopener noreferrer"
          onClick={onClose}
          className="flex w-full items-center gap-3 px-4 py-3 text-[15px] text-gray-dark hover:bg-gray-hover"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Twitter / X
        </a>
      </motion.div>
    </>
  );
}

function ActionBar({ likes, comments, reposts, postId }: { likes: number; comments: number; reposts: number; shares: number; postId: number }) {
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="mt-1 flex items-center gap-2 pl-[44px]">
      <FeedLikeButton initialCount={likes} />
      {[
        { icon: commentsIcon, count: comments, label: "Comment", onClick: (e: React.MouseEvent) => { const rect = (e.currentTarget as HTMLElement).closest('[class*="pt-5"]')?.getBoundingClientRect(); navigate(`/post/${postId}`, { state: { sourceY: rect?.top ?? 80, focusInput: true } }); } },
        { icon: repostsIcon,  count: reposts,  label: "Repost",  onClick: undefined as ((e: React.MouseEvent) => void) | undefined },
      ].map(({ icon, count, label, onClick }) => (
        <button key={label} onClick={onClick} className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover">
          <img src={icon} alt={label} className="h-[22px] w-[22px] [filter:invert(44%)]" />
          {count > 0 && <span className="text-[15px] font-normal">{formatCount(count)}</span>}
        </button>
      ))}
      <div className="relative">
        <button onClick={() => setShareOpen(o => !o)} className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover">
          <img src={sharesIcon} alt="Share" className="h-[22px] w-[22px] [filter:invert(44%)]" />
        </button>
        <AnimatePresence>
          {shareOpen ? <ShareDropdown postId={postId} onClose={() => setShareOpen(false)} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PostHeaderRow({ author, time, verified, headline }: { author: string; time: string; verified?: boolean; headline?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link to={`/profile-v2?type=${verified ? "coach" : "customer"}`} className="cursor-pointer text-[17px] leading-tight font-medium text-gray-dark underline decoration-white decoration-[0.75px] underline-offset-2 transition-[text-decoration-color] duration-200 hover:decoration-gray-light/50">{author}</Link>
          {verified && <img src={verifiedIcon} alt="Verified" className="h-[15px] w-[15px] shrink-0" />}
          <span className="shrink-0 text-[17px] leading-tight text-gray-xlight">{time}</span>
        </div>
        {headline && (
          <p className="truncate text-[15px] leading-tight text-[#707070]">{headline}</p>
        )}
      </div>
      <button className="cursor-pointer pl-2 text-[#424242] opacity-40 transition-opacity hover:opacity-100">
        <MoreDotsIcon />
      </button>
    </div>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (images.length === 1) {
    return (
      <div className="mt-3 overflow-hidden rounded-xl">
        <img
          src={images[0]}
          alt=""
          className="w-full object-cover"
          style={{ maxHeight: 400 }}
        />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto"
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="h-[280px] w-[220px] shrink-0 rounded-xl object-cover"
        />
      ))}
    </div>
  );
}

function LinkCard({ link }: { link: LinkPost["link"] }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block overflow-hidden rounded-xl border border-gray-stroke transition-colors hover:bg-gray-hover"
    >
      <div className="relative w-full" style={{ paddingBottom: `${(1 / 1.91) * 100}%` }}>
        <img
          src={link.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="px-4 py-3">
        <p className="text-[13px] text-gray-light">{link.domain}</p>
        <p className="mt-0.5 text-[15px] font-medium text-gray-dark leading-snug">{link.title}</p>
      </div>
    </a>
  );
}

function EventCard({ event }: { event: EventPost["event"] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <div className="relative">
        <img src={event.image} alt={event.title} className="aspect-[1200/628] w-full object-cover" />
      </div>
      <div className="px-4 py-4">
        <p className="text-[17px] font-semibold leading-snug text-gray-dark">{event.title}</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-[15px] text-gray-light">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-[15px] text-gray-light">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{event.time}</span>
          </div>
        </div>
        {event.spotsLeft !== undefined && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[13px] font-medium text-orange-500">Only {event.spotsLeft} spots left</p>
            <button className="cursor-pointer rounded-lg bg-[#222222]/5 px-[14px] py-1.5 text-[15px] font-medium text-[#424242] transition-colors hover:bg-[#222222]/[0.08]">
              Register for free
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Greens: dark → mid → bright → light → pale
const GREENS = ["#0a5c3f", "#038561", "#15b078", "#34d399", "#6ee7b7", "#a7f3d0", "#1a7a52", "#059669", "#10b981"];

// shape: "rect" | "square" | "circle" | "streamer"
const CONFETTI: { color: string; x: number; delay: number; dur: number; drift: number; w: number; h: number; shape: string; spin: number }[] = [
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
  { color: GREENS[5], x: 7,  delay: 0.9,  dur: 2.0, drift:  11, w: 7,  h: 8,  shape: "rect",     spin: 360  },
  { color: GREENS[6], x: 21, delay: 0.35, dur: 1.7, drift: -6,  w: 6,  h: 6,  shape: "circle",   spin: 0    },
  { color: GREENS[7], x: 35, delay: 0.65, dur: 2.2, drift:  8,  w: 8,  h: 5,  shape: "streamer", spin: 1080 },
  { color: GREENS[8], x: 50, delay: 0.12, dur: 1.8, drift: -10, w: 7,  h: 11, shape: "rect",     spin: 720  },
  { color: GREENS[0], x: 63, delay: 0.75, dur: 2.1, drift:  9,  w: 6,  h: 6,  shape: "square",   spin: 540  },
  { color: GREENS[2], x: 97, delay: 0.42, dur: 1.6, drift: -7,  w: 5,  h: 9,  shape: "rect",     spin: 360  },
];

function MilestoneCard({ milestone }: { milestone: MilestonePost["milestone"] }) {
  return (
    <div className="relative mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 overflow-hidden">
        {CONFETTI.map((c, i) => (
          <motion.div
            key={i}
            className="absolute top-0"
            style={{
              left: `${c.x}%`,
              width: c.w,
              height: c.h,
              backgroundColor: c.color,
              borderRadius: c.shape === "circle" ? "50%" : c.shape === "streamer" ? "2px" : "2px",
            }}
            initial={{ y: -14, x: 0, opacity: 1, rotate: 0, scaleX: 1 }}
            animate={{
              y: 72,
              x: [0, c.drift * 0.4, c.drift, c.drift * 0.6, 0],
              opacity: [1, 1, 1, 0.6, 0],
              rotate: c.spin,
              scaleX: c.shape === "streamer" ? [1, 0.2, 1, 0.2, 1] : [1, 0.3, 1, 0.3, 1],
            }}
            transition={{
              duration: c.dur,
              delay: c.delay,
              repeat: Infinity,
              repeatDelay: 1.8 + c.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}
      </div>

      {/* Card content */}
      <div className="flex items-center gap-4 px-4 py-4">
        {/* Overlapping avatars */}
        <div className="relative flex shrink-0 items-center">
          {/* School initial avatar — behind */}
          <div
            className="relative z-0 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[22px] font-bold text-white ring-2 ring-white"
            style={{ backgroundColor: milestone.schoolColor }}
          >
            {milestone.schoolInitial}
          </div>
          {/* Client avatar — overlaps on top */}
          <div className="relative z-10 -ml-4 shrink-0">
            <img
              src={milestone.clientAvatar}
              alt={milestone.clientName}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
            />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[14px] shadow-sm">
              🎉
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium uppercase tracking-wide text-gray-light">Admitted</p>
          <p className="mt-0.5 text-[17px] font-semibold leading-tight text-gray-dark">{milestone.school}</p>
          <p className="text-[14px] text-gray-light">{milestone.program}</p>
        </div>
      </div>
    </div>
  );
}

const LIVE_COMMENTS = [
  { user: "alex_mba", text: "How do you handle the 'why consulting' question?", delay: 0 },
  { user: "priya_t", text: "Should I cold email partners or go through recruiting?", delay: 2.5 },
  { user: "jliu_biz", text: "What's the biggest mistake candidates make in fit interviews?", delay: 5 },
  { user: "mwilliams", text: "Is a non-target school a dealbreaker for MBB?", delay: 7.5 },
  { user: "sarah_k", text: "How many cases should I do before my first round?", delay: 10 },
  { user: "r_nguyen", text: "Love your content Nina!! 🙌", delay: 12 },
  { user: "david_c", text: "Can you talk about the BCG vs McKinsey culture diff?", delay: 14.5 },
  { user: "emma_t", text: "What about lateral hires from industry?", delay: 17 },
];

function LiveCommentsFeed() {
  const [visible, setVisible] = useState<{ id: number; text: string }[]>([]);
  const counter = useRef(0);
  const index = useRef(0);

  useEffect(() => {
    // Seed with first comment immediately
    setVisible([{ id: counter.current++, text: LIVE_COMMENTS[index.current++ % LIVE_COMMENTS.length].text }]);

    const interval = setInterval(() => {
      const text = LIVE_COMMENTS[index.current++ % LIVE_COMMENTS.length].text;
      setVisible(prev => [...prev, { id: counter.current++, text }].slice(-4));
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute bottom-10 left-3 flex w-[33%] flex-col gap-1.5 overflow-hidden">
      <AnimatePresence initial={false}>
        {visible.map(c => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex"
          >
            <span className="rounded-lg bg-black/40 px-2 py-0.5 text-[10px] leading-snug text-white/90 backdrop-blur-sm">
              {c.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Office hours modals ──────────────────────────────

function ModalBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
  );
}

function OfficeHoursInfoModal({ live, author, avatar, onBuy, onClose }: {
  live: LivePost["live"];
  author: string;
  avatar: string;
  onBuy: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <ModalBackdrop onClose={onClose} />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="pointer-events-auto w-full max-w-[420px] rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
          {/* Header */}
          <div className="relative overflow-hidden rounded-t-2xl bg-gray-dark px-6 pb-6 pt-8">
            <button onClick={onClose} className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
              {author} is holding a live session open to anyone. Ask your questions directly and get real-time answers.
            </p>
          </div>

          {/* Body */}
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

            <ul className="mt-4 flex flex-col gap-2">
              {["Live Q&A with the coach", "Ask questions in real time", "Access ends when session ends"].map(item => (
                <li key={item} className="flex items-center gap-2 text-[14px] text-gray-dark">
                  <svg className="h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 px-6 pb-6">
            <button
              onClick={onBuy}
              className="w-full cursor-pointer rounded-xl bg-primary py-3 text-[16px] font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Buy ticket · $5
            </button>
            <button onClick={onClose} className="w-full cursor-pointer py-2 text-[14px] text-gray-light transition-colors hover:text-gray-dark">
              Maybe later
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const [paymentPlan, setPaymentPlan] = useState<"single" | "multi">("single");
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const total = paymentPlan === "multi" ? 5.15 : 5.00;

  return (
    <>
      <ModalBackdrop onClose={onClose} />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="pointer-events-auto flex w-full max-w-[720px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">

          {/* Left — checkout form */}
          <div className="flex-1 overflow-y-auto px-8 py-8" style={{ maxHeight: "90vh" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-[24px] font-bold text-gray-dark">Checkout</h2>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-dark hover:bg-gray-200">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Service row */}
            <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-stroke px-4 py-3">
              <div>
                <p className="text-[15px] font-semibold text-gray-dark">Office Hours · Consulting Q&A</p>
                <p className="text-[13px] text-gray-light">One time purchase</p>
              </div>
              <div className="text-right">
                <p className="text-[17px] font-bold text-gray-dark">$5.00</p>
                <button className="text-[13px] text-primary hover:underline">See payment plans</button>
              </div>
            </div>

            {/* Payment structure */}
            <p className="mt-6 text-[15px] font-semibold text-gray-dark">Payment Structure</p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { id: "single", label: "Single payment", sub: "Pay the full amount today" },
                { id: "multi",  label: "Multiple payments (+3% fee)", sub: "Split the cost into scheduled installments" },
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${paymentPlan === opt.id ? "border-primary bg-primary/5" : "border-gray-stroke"}`}
                  onClick={() => setPaymentPlan(opt.id as "single" | "multi")}
                >
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${paymentPlan === opt.id ? "border-primary" : "border-gray-300"}`}>
                    {paymentPlan === opt.id ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-gray-dark">{opt.label}</p>
                    <p className="text-[13px] text-gray-light">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Payment information */}
            <p className="mt-6 text-[15px] font-semibold text-gray-dark">Payment Information</p>
            <div className="mt-3 rounded-xl border border-gray-stroke p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[12px] font-medium text-gray-light">Card number</label>
                  <input className="mt-1 w-full rounded-lg border border-gray-stroke px-3 py-2 text-[15px] text-gray-dark outline-none focus:border-primary" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[12px] font-medium text-gray-light">Expiry</label>
                    <input className="mt-1 w-full rounded-lg border border-gray-stroke px-3 py-2 text-[15px] text-gray-dark outline-none focus:border-primary" placeholder="MM / YY" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[12px] font-medium text-gray-light">CVC</label>
                    <input className="mt-1 w-full rounded-lg border border-gray-stroke px-3 py-2 text-[15px] text-gray-dark outline-none focus:border-primary" placeholder="123" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <span className="flex items-center gap-1.5 rounded-md border border-gray-stroke px-2 py-1 text-[11px] text-gray-light">
                  Powered by <span className="font-bold text-gray-dark">stripe</span>
                </span>
              </div>
            </div>

            {/* Terms */}
            <p className="mt-6 text-[15px] font-semibold text-gray-dark">Terms</p>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                "The Leland Experience Guarantee protects you with every booking.",
                "Refund policy: Refunds are available within 14 days of purchase.",
                "Expiration terms: access is valid for the duration of this session.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-gray-light">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
                  {t} <button className="ml-1 text-primary hover:underline">Learn more.</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — summary */}
          <div className="flex w-[260px] shrink-0 flex-col border-l border-gray-stroke bg-gray-50 px-6 py-8">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-light">Subtotal</span>
              <span className="font-medium text-gray-dark">$5.00</span>
            </div>
            <div className="mt-4 border-t border-gray-stroke pt-4 flex items-center justify-between text-[15px]">
              <span className="text-gray-light">Discount</span>
              {discountOpen ? (
                <input
                  autoFocus
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  className="w-24 rounded-lg border border-gray-stroke px-2 py-1 text-[13px] outline-none focus:border-primary"
                  placeholder="Code"
                />
              ) : (
                <button onClick={() => setDiscountOpen(true)} className="font-semibold text-primary hover:underline">Use code</button>
              )}
            </div>
            <div className="mt-4 border-t border-gray-stroke pt-4 flex items-center justify-between text-[17px]">
              <span className="font-semibold text-gray-dark">Total</span>
              <span className="font-bold text-gray-dark">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full cursor-pointer rounded-xl bg-primary py-3 text-[15px] font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Confirm payment
            </button>
            <p className="mt-3 text-center text-[12px] text-gray-light">Secured by Stripe</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function LiveCard({ live, author, avatar }: { live: LivePost["live"]; author: string; avatar: string }) {
  const [modal, setModal] = useState<null | "info" | "checkout">(null);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      {/* Video + comments */}
      <div className="relative h-[300px] bg-black">
        {/* YouTube embed — autoplay, muted, loop */}
        <iframe
          src={`https://www.youtube.com/embed/${live.videoId}?autoplay=1&mute=1&loop=1&playlist=${live.videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
          allow="autoplay; encrypted-media"
          className="h-full w-full"
          style={{ border: "none", pointerEvents: "none" }}
        />

        {/* Live comments overlay — bottom-left third */}
        <LiveCommentsFeed />

        {/* LIVE badge — grey with red dot */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[13px] font-semibold tracking-wide text-gray-dark">LIVE</span>
        </div>

        {/* Viewer count — top right, no border */}
        <div className="absolute right-3 top-3 flex items-center gap-1 text-white/90">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <span className="text-[12px] font-medium drop-shadow">{live.viewers.toLocaleString()} watching</span>
        </div>

      </div>

      {/* Info row */}
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <p className="text-[17px] font-semibold leading-snug text-gray-dark">{live.title}</p>
          <p className="mt-1 text-[14px] text-gray-light">{live.topic}</p>
        </div>
        <button
          onClick={() => setModal("info")}
          className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-[14px] py-1.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-200"
        >
          Join live
        </button>
      </div>

      <AnimatePresence>
        {modal === "info" && (
          <OfficeHoursInfoModal
            live={live}
            author={author}
            avatar={avatar}
            onBuy={() => setModal("checkout")}
            onClose={() => setModal(null)}
          />
        )}
        {modal === "checkout" && (
          <CheckoutModal onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Coach hover card ─────────────────────────────────

interface CoachProfile {
  rating: number;
  reviews: number;
  customerFavorite?: boolean;
  supercoach?: boolean;
  minutesCoached: number;
  followers: number;
  affiliation?: string;        // e.g. "Admissions at Stanford GSB"
  company?: string;            // e.g. "McKinsey & Company"
  companyLogo?: string;        // imported logo image
  companyColor?: string;
  companyInitial?: string;
  successfulClients: { logo: string; name: string }[];
  successfulClientsMore?: number;
  price?: string;
}

const coachProfiles: Record<string, CoachProfile> = {
  "Sarah Chen": {
    rating: 4.9, reviews: 187, customerFavorite: true, supercoach: true,
    minutesCoached: 156420, followers: 843,
    affiliation: "Admissions at Stanford GSB",
    company: "Harvard Business School", companyLogo: orgHBS, companyColor: "#A51C30", companyInitial: "H",
    successfulClients: [
      { logo: orgHBS,      name: "Harvard Business School" },
      { logo: orgKellogg,  name: "Kellogg" },
      { logo: orgColumbia, name: "Columbia Business School" },
      { logo: orgTuck,     name: "Tuck" },
    ],
    successfulClientsMore: 19,
  },
  "David Kim": {
    rating: 5.0, reviews: 214, customerFavorite: true, supercoach: true,
    minutesCoached: 219990, followers: 596,
    affiliation: "Adm. Committee at Chicago Booth",
    company: "Bain & Company", companyLogo: orgBain, companyColor: "#CC0000", companyInitial: "B",
    successfulClients: [
      { logo: orgHBS,      name: "Harvard Business School" },
      { logo: orgKellogg,  name: "Kellogg" },
      { logo: orgMITSloan, name: "MIT Sloan" },
      { logo: orgColumbia, name: "Columbia" },
    ],
    successfulClientsMore: 27,
  },
  "Nina Kowalski": {
    rating: 4.9, reviews: 103,
    minutesCoached: 98730, followers: 412,
    company: "McKinsey & Company", companyLogo: orgMcKinsey, companyColor: "#003580", companyInitial: "M",
    successfulClients: [
      { logo: orgMcKinsey, name: "McKinsey" },
      { logo: orgBCG,      name: "BCG" },
      { logo: orgBain,     name: "Bain" },
    ],
    successfulClientsMore: 14,
  },
  "Eric": {
    rating: 4.9, reviews: 103, supercoach: true,
    minutesCoached: 98730, followers: 412,
    company: "McKinsey & Company", companyLogo: orgMcKinsey, companyColor: "#003580", companyInitial: "M",
    affiliation: "Recruiting at McKinsey & Company",
    successfulClients: [
      { logo: orgMcKinsey, name: "McKinsey" },
      { logo: orgBCG,      name: "BCG" },
      { logo: orgDeloitte, name: "Deloitte" },
    ],
    successfulClientsMore: 14,
  },
  "Marcus Williams": {
    rating: 4.8, reviews: 52, price: "$199/hr",
    minutesCoached: 44200, followers: 198,
    affiliation: "Admissions at Stanford GSB",
    successfulClients: [
      { logo: orgHBS,      name: "Harvard Business School" },
      { logo: orgKellogg,  name: "Kellogg" },
    ],
    successfulClientsMore: 8,
  },
  "Priya Patel": {
    rating: 4.9, reviews: 76, price: "$249/hr",
    minutesCoached: 71580, followers: 305,
    company: "Harvard Business School", companyLogo: orgHBS, companyColor: "#A51C30", companyInitial: "H",
    successfulClients: [
      { logo: orgHBS,      name: "Harvard Business School" },
      { logo: orgMITSloan, name: "MIT Sloan" },
      { logo: orgTuck,     name: "Tuck" },
    ],
    successfulClientsMore: 11,
  },
  "Emma Rodriguez": {
    rating: 4.8, reviews: 98, price: "$279/hr",
    minutesCoached: 103440, followers: 467,
    company: "BCG", companyLogo: orgBCG, companyColor: "#006600", companyInitial: "B",
    successfulClients: [
      { logo: orgKellogg,  name: "Kellogg" },
      { logo: orgColumbia, name: "Columbia" },
      { logo: orgMITSloan, name: "MIT Sloan" },
      { logo: orgHaas,     name: "Haas" },
    ],
    successfulClientsMore: 16,
  },
  "Alex Thompson": {
    rating: 4.8, reviews: 64, price: "$189/hr",
    minutesCoached: 58200, followers: 278,
    company: "Google", companyLogo: orgGoogle, companyColor: "#4285F4", companyInitial: "G",
    successfulClients: [
      { logo: orgGoogle,   name: "Google" },
      { logo: orgOpenAI,   name: "OpenAI" },
      { logo: orgMcKinsey, name: "McKinsey" },
    ],
    successfulClientsMore: 9,
  },
  "Michael Chen": {
    rating: 4.9, reviews: 118, supercoach: true, price: "$319/hr",
    minutesCoached: 134760, followers: 521,
    company: "BCG", companyLogo: orgBCG, companyColor: "#006600", companyInitial: "B",
    affiliation: "Admissions at Kellogg",
    successfulClients: [
      { logo: orgKellogg,  name: "Kellogg" },
      { logo: orgColumbia, name: "Columbia" },
      { logo: orgHBS,      name: "Harvard Business School" },
      { logo: orgMITSloan, name: "MIT Sloan" },
    ],
    successfulClientsMore: 21,
  },
  "Lauren Hayes": {
    rating: 5.0, reviews: 93, customerFavorite: true, price: "$399/hr",
    minutesCoached: 87300, followers: 389,
    affiliation: "Admissions at Harvard Business School",
    company: "Harvard Business School", companyLogo: orgHBS, companyColor: "#A51C30", companyInitial: "H",
    successfulClients: [
      { logo: orgHBS,      name: "Harvard Business School" },
      { logo: orgMITSloan, name: "MIT Sloan" },
      { logo: orgTuck,     name: "Tuck" },
    ],
    successfulClientsMore: 13,
  },
  "Jason Park": {
    rating: 4.8, reviews: 71, price: "$229/hr",
    minutesCoached: 62490, followers: 243,
    company: "Deloitte", companyLogo: orgDeloitte, companyColor: "#86BC25", companyInitial: "D",
    successfulClients: [
      { logo: orgKellogg,  name: "Kellogg" },
      { logo: orgMITSloan, name: "MIT Sloan" },
      { logo: orgFuqua,    name: "Fuqua" },
    ],
    successfulClientsMore: 7,
  },
};

function OrgLogo({ logo, name, size = 24 }: { logo: string; name: string; size?: number }) {
  return (
    <img
      src={logo}
      alt={name}
      title={name}
      className="shrink-0 rounded-md object-contain ring-1 ring-black/10"
      style={{ width: size, height: size }}
    />
  );
}

function CoachHoverCard({ author, avatar, verified, headline, isEvent }: {
  author: string;
  avatar: string;
  verified?: boolean;
  headline?: string;
  isEvent?: boolean;
}) {
  if (isEvent) return null;
  const p = coachProfiles[author];

  return (
    <motion.div
      className="absolute left-0 top-12 z-50 w-[310px] rounded-2xl border border-gray-stroke bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.13)]"
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onMouseEnter={(e) => e.stopPropagation()}
    >
      {/* Avatar + name row — matches expert card layout */}
      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt={author}
          className="h-[112px] w-[112px] shrink-0 rounded-xl object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
          style={{ objectPosition: "50% 15%" }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-medium leading-tight text-gray-dark">{author}</span>
            {verified ? <img src={verifiedIcon} alt="" className="h-[15px] w-[15px] shrink-0" /> : null}
          </div>
          {p ? (
            <div className="mt-0.5 flex items-center gap-1 text-[15px]">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold text-gray-dark">{p.rating.toFixed(1)}</span>
              <span className="text-gray-light">({p.reviews})</span>
            </div>
          ) : null}
        </div>
        {/* Follow button — grey fill, no outline */}
        <button
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
          aria-label="Follow"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </button>
      </div>

      {/* Headline */}
      {headline ? (
        <p className="mt-3 line-clamp-2 text-[15px] leading-snug text-gray-dark">{headline}</p>
      ) : null}

      {/* Minutes coached + followers */}
      {p ? (
        <p className="mt-1 text-[14px] text-gray-light">
          <span className="font-medium text-gray-dark">{p.minutesCoached.toLocaleString()}</span> min coached
          <span className="mx-1.5 text-gray-stroke">|</span>
          <span className="font-medium text-gray-dark">{p.followers.toLocaleString()}</span> followers
        </p>
      ) : null}

      {/* Badge rows — real logos */}
      {p ? (
        <div className="mt-3 flex flex-col gap-2">
          {p.supercoach ? (
            <div className="flex items-center gap-2">
              <span className="text-[15px] leading-none">🏆</span>
              <span className="text-[14px] text-gray-dark">Supercoach</span>
            </div>
          ) : null}
          {p.affiliation && p.companyLogo ? (
            <div className="flex items-center gap-2">
              <OrgLogo logo={p.companyLogo} name={p.company ?? ""} size={20} />
              <span className="truncate text-[14px] text-gray-dark">{p.affiliation}</span>
            </div>
          ) : null}
          {p.company && p.companyLogo ? (
            <div className="flex items-center gap-2">
              <OrgLogo logo={p.companyLogo} name={p.company} size={20} />
              <span className="truncate text-[14px] text-gray-dark">
                {p.affiliation ? `Worked at ${p.company}` : `Director at ${p.company}`}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Successful clients */}
      {p && p.successfulClients.length > 0 ? (
        <div className="mt-3">
          <p className="text-[14px] text-gray-light">Successful clients at:</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            {p.successfulClients.slice(0, 5).map((c, i) => (
              <OrgLogo key={i} logo={c.logo} name={c.name} size={26} />
            ))}
            {p.successfulClientsMore ? (
              <span className="ml-0.5 text-[12px] text-gray-light">+{p.successfulClientsMore}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* CTAs */}
      <div className="mt-4 flex gap-2">
        <button className="flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-gray-100 py-2.5 text-[15px] font-semibold text-gray-dark transition-colors hover:bg-gray-200">
          Message
        </button>
        <button className="flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-gray-dark py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#222]">
          Book a session
        </button>
      </div>
    </motion.div>
  );
}

function AvatarWithHoverCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEvent = post.type === "event";

  const handleMouseEnter = () => {
    if (isEvent) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), 350);
  };

  const handleMouseLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="group relative h-10 w-10 cursor-pointer">
        {isEvent ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
            <img src={post.avatar} alt={post.author} className="h-5 w-5 brightness-0 invert" />
          </div>
        ) : (
          <img
            src={post.avatar}
            alt={post.author}
            className="h-10 w-10 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
          />
        )}
        <div className="absolute inset-0 rounded-full bg-black/0 transition-colors group-hover:bg-black/10" />
      </div>

      <AnimatePresence>
        {open ? (
          <CoachHoverCard
            author={post.author}
            avatar={post.avatar}
            verified={post.verified}
            headline={post.headline}
            isEvent={isEvent}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ─── Post component ───────────────────────────────────

function FeedPost({ post }: { post: Post }) {
  const navigate = useNavigate();

  return (
    <div className="pt-5 pb-[14px]">
      <div
        className="flex gap-3 cursor-pointer"
        onClick={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          navigate(`/post/${post.id}`, { state: { sourceY: rect.top } });
        }}
      >
        {/* Left column: avatar with hover card */}
        <div onClick={e => e.stopPropagation()}>
          <AvatarWithHoverCard post={post} />
        </div>
        {/* Right column: content */}
        <div className="min-w-0 flex-1">
          <PostHeaderRow author={post.author} time={post.time} verified={post.verified} headline={post.headline} />
          <p className="mt-1 text-[17px] leading-[1.4] text-gray-dark">{post.body}</p>
          <div onClick={e => e.stopPropagation()}>
            {post.type === "image" && <ImageGallery images={post.images} />}
            {post.type === "link" && <LinkCard link={post.link} />}
            {post.type === "event" && <EventCard event={post.event} />}
            {post.type === "milestone" && <MilestoneCard milestone={post.milestone} />}
            {post.type === "live" && <LiveCard live={post.live} author={post.author} avatar={post.avatar} />}
          </div>
        </div>
      </div>
      <div onClick={e => e.stopPropagation()}>
        <ActionBar likes={post.likes} comments={post.comments} reposts={post.reposts} shares={post.shares} postId={post.id} />
      </div>
    </div>
  );
}

// ─── Suggested experts ────────────────────────────────

const suggestedExperts = [
  { name: "Sarah Chen",     avatar: pic1,  verified: true, headline: "Former Director of Admissions at Stanford GSB | 200+ M7 Admits" },
  { name: "David Kim",      avatar: pic4,  verified: true, headline: "MBA Admissions Consultant | Ex-Bain, HBS '19 | Ranked Top 4 on P&Q" },
  { name: "Nina Kowalski",  avatar: pic7,  verified: true, headline: "Partner at McKinsey & Company | Consulting Recruiting Lead" },
  { name: "Alex Thompson",  avatar: pic8,  verified: false, headline: "Career Coach | Ex-Google PM | Tech & MBA Transitions" },
  { name: "Michael Chen",   avatar: pic10, verified: true, headline: "Ex-BCG Consultant | Kellogg Adm. Insider | 130+ M7 Admits" },
  { name: "Lauren Hayes",   avatar: pic13, verified: true, headline: "HBS Admissions Expert | Former Reader | 5.0 Rated Coach" },
  { name: "Jason Park",     avatar: pic14, verified: false, headline: "Deloitte Strategy Lead | MBA Career Coach | Finance & Consulting" },
];

function ExpertCard({ expert, isOnline }: { expert: typeof suggestedExperts[number]; isOnline?: boolean }) {
  const p = coachProfiles[expert.name];
  return (
    <div
      className="flex shrink-0 flex-col rounded-2xl border border-gray-stroke p-4"
      style={{ width: "310px", minWidth: "310px" }}
    >
      {/* Avatar + name row */}
      <div className="flex items-start gap-3">
        <img
          src={expert.avatar}
          alt={expert.name}
          className="h-[112px] w-[112px] shrink-0 rounded-xl object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
          style={{ objectPosition: "50% 15%" }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="text-[17px] font-medium leading-tight text-gray-dark">{expert.name}</span>
                {expert.verified ? <img src={verifiedIcon} alt="" className="h-[15px] w-[15px] shrink-0" /> : null}
              </div>
              {p ? (
                <div className="mt-0.5 flex items-center gap-1 text-[15px]">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-dark">{p.rating.toFixed(1)}</span>
                  <span className="text-gray-light">({p.reviews})</span>
                </div>
              ) : null}
              <p className="mt-0.5 text-[14px] text-gray-light">$150/hr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Headline */}
      <p className="mt-3 line-clamp-2 w-4/5 text-[15px] leading-snug text-gray-dark">
        {expert.headline}
      </p>

      {/* Successful clients */}
      {p && p.successfulClients.length > 0 ? (
        <div className="mt-3">
          <p className="text-[14px] text-gray-light">Successful clients at:</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            {p.successfulClients.slice(0, 5).map((c, i) => (
              <OrgLogo key={i} logo={c.logo} name={c.name} size={26} />
            ))}
            {p.successfulClientsMore ? (
              <span className="ml-0.5 text-[12px] text-gray-light">+{p.successfulClientsMore}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Spacer pushes button to bottom */}
      <div className="flex-1" />

      <div className="mt-4 flex gap-2">
        <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-200">
          Free intro call
        </button>
        <button className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-stroke bg-white transition-colors hover:bg-gray-50" aria-label="Follow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SuggestedExperts() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * scrollRef.current.clientWidth * 0.75, behavior: "smooth" });
    }
  };

  const NavBtn = ({ dir, label }: { dir: 1 | -1; label: string }) => (
    <button
      onClick={() => scrollBy(dir)}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-stroke text-gray-dark transition-colors hover:bg-gray-hover"
      aria-label={label}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === 1
          ? <polyline points="9 18 15 12 9 6" />
          : <polyline points="15 18 9 12 15 6" />}
      </svg>
    </button>
  );

  return (
    <div className="py-5">
      <div className="flex items-center justify-between">
        <p className="text-[17px] font-semibold text-gray-dark">Suggested experts</p>
        <div className="flex items-center gap-1.5">
          <NavBtn dir={-1} label="Scroll left" />
          <NavBtn dir={1} label="Scroll right" />
        </div>
      </div>
      <div ref={scrollRef} className="scrollbar-hide mt-4 flex gap-3 overflow-x-auto">
        {suggestedExperts.map((expert, i) => (
          <ExpertCard key={expert.name} expert={expert} isOnline={i === 0} />
        ))}
      </div>
    </div>
  );
}

// ─── Compose Modal ────────────────────────────────────

function ComposeModal({ onClose, onPost }: { onClose: () => void; onPost: (text: string) => void }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const autoGrow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const charCount = text.length;
  const maxChars = 280;
  const remaining = maxChars - charCount;
  const circleR = 9;
  const circumference = 2 * Math.PI * circleR;
  const progress = Math.min(charCount / maxChars, 1);
  const dashOffset = circumference * (1 - progress);
  const overLimit = remaining < 0;
  const nearLimit = remaining <= 20;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      {/* Modal */}
      <motion.div
        className="relative mt-[60px] w-full max-w-[600px] rounded-2xl bg-white shadow-2xl mx-4"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* X button — absolute top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-[16px] border border-gray-stroke bg-white text-gray-dark shadow-sm transition-colors hover:bg-gray-hover"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Compose area — avatar + textarea flush at top */}
        <div className="flex gap-3 px-4 pt-4 pb-3 pr-14">
          <img
            src={profilePhoto}
            alt="Your profile"
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={autoGrow}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full resize-none bg-transparent text-[17px] text-gray-dark placeholder:text-gray-light focus:outline-none leading-relaxed"
              style={{ minHeight: "100px" }}
            />
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 px-4 pb-4">
          {[
            { label: "Attach your upcoming event", icon: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" /> },
            { label: "Attach Bootcamp", icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></> },
            { label: "Go Live", icon: <><circle cx="12" cy="12" r="3"/><path d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7"/><path d="M5.5 5.5a9 9 0 000 13M18.5 5.5a9 9 0 010 13"/></> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-gray-stroke px-3 py-1.5 text-[13px] font-medium text-gray-light transition-colors hover:border-gray-dark hover:text-gray-dark"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
              {label}
            </button>
          ))}
        </div>

        <div className="border-t border-gray-stroke" />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Action icons: Image, Poll, Video */}
          <div className="flex items-center gap-1">
            {/* Image */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-gray-light hover:bg-gray-hover transition-colors" title="Add image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </button>
            {/* Poll / Survey */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-gray-light hover:bg-gray-hover transition-colors" title="Create poll">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </button>
            {/* Record video */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-gray-light hover:bg-gray-hover transition-colors" title="Record video">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14"/>
                <rect x="3" y="8" width="12" height="8" rx="2"/>
              </svg>
            </button>
          </div>

          {/* Char counter + Post button */}
          <div className="flex items-center gap-3">
            {charCount > 0 && (
              <div className="relative flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 26 26">
                  <circle cx="13" cy="13" r={circleR} fill="none" stroke="#E5E5E5" strokeWidth="2.5" />
                  <circle
                    cx="13" cy="13" r={circleR}
                    fill="none"
                    stroke={overLimit ? "#EF4444" : nearLimit ? "#F59E0B" : "#222222"}
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 13 13)"
                    style={{ transition: "stroke-dashoffset 0.1s, stroke 0.2s" }}
                  />
                </svg>
                {nearLimit && (
                  <span className={`absolute text-[10px] font-semibold ${overLimit ? "text-red-500" : "text-amber-500"}`}>
                    {remaining}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => { onPost(text.trim()); onClose(); }}
              disabled={!text.trim() || overLimit}
              className="rounded-[16px] bg-gray-dark px-6 py-2.5 text-[15px] font-semibold text-white transition-opacity disabled:opacity-40 enabled:hover:opacity-90"
            >
              Post
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─── Page ─────────────────────────────────────────────

export default function Home() {
  useEffect(() => { document.title = "Leland Prototype | Feed"; }, []);
  const [composeOpen, setComposeOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts);

  const handlePost = (text: string) => {
    const newPost: Post = {
      id: Date.now(),
      type: "text",
      author: "You",
      avatar: profilePhoto,
      time: "just now",
      body: text,
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
    };
    setFeedPosts(prev => [newPost, ...prev]);
  };

  return (
    <div>
      {/* Post composer */}
      <div className="flex items-center gap-3 border-b border-gray-stroke pb-5">
        <img
          src={profilePhoto}
          alt="Your profile"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <button
          onClick={() => setComposeOpen(true)}
          className="flex-1 rounded-full bg-gray-hover px-4 py-[10px] text-left text-[16px] text-gray-light transition-shadow hover:shadow-[0_0_0_2px_#dddddd]"
        >
          Create a post...
        </button>
      </div>

      {/* Feed */}
      <div className="divide-y divide-gray-stroke">
        {feedPosts.map((post, i) => (
          <div key={post.id}>
            <FeedPost post={post} />
            {i === 3 && <SuggestedExperts />}
          </div>
        ))}
      </div>

      {composeOpen ? <ComposeModal onClose={() => setComposeOpen(false)} onPost={handlePost} /> : null}
    </div>
  );
}
