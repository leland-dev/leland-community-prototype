import { useState, useRef, useEffect, type ReactNode } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import PageShell from "../components/PageShell";
import SidebarCard, { SidebarGroup } from "../components/SidebarCard";
import { FeedPost, ComposeModal, type Post, type ImageEntry } from "./Home";

import bootcampBanner from "../assets/placeholder images/bootcamp-1.webp";
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
import profilePhoto from "../assets/profile photos/profile photo.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";

// ─── Types ────────────────────────────────────────────

type Tab = "activity" | "members";

type LinkType = "profile" | "resource" | "booking" | "guide" | "support";

interface GroupData {
  name: string;
  cohortLabel: string;
  tagline: string;
  description: string;
  memberCount: number;
  sessionCount: number;
  banner: string;
  accentColor: string;
  instructor: { name: string; avatar: string; headline: string };
  helpfulLinks: Array<{ label: string; description: string; type: LinkType }>;
}

// ─── Group data ───────────────────────────────────────

const GROUPS: Record<string, GroupData> = {
  "ai-bootcamp-apr-2026": {
    name: "AI Boot Camp",
    cohortLabel: "April 21 – May 16, 2026 · Cohort 4",
    tagline: "Build real AI tools in 4 weeks.",
    description:
      "A hands-on cohort program covering AI fundamentals, prompt engineering, API integration, and AI product strategy. No engineering background required — just bring curiosity and a project idea.",
    memberCount: 24,
    sessionCount: 8,
    banner: bootcampBanner,
    accentColor: "#2563EB",
    instructor: { name: "David Kim", avatar: pic4, headline: "MBA Admissions Consultant | Ex-Bain, HBS '19" },
    helpfulLinks: [
      { label: "Instructor Profile", description: "View David Kim's full profile and book a session", type: "profile" },
      { label: "Session Recordings", description: "Catch up on past sessions and download slides", type: "resource" },
      { label: "Office Hours", description: "Book 1:1 time with your instructor", type: "booking" },
      { label: "Community Guidelines", description: "How we keep this space helpful and professional", type: "guide" },
    ],
  },
  mba: {
    name: "MBA Admissions",
    cohortLabel: "Leland Community · Open group",
    tagline: "The MBA admissions community on Leland.",
    description:
      "Share insights, ask questions, and connect with coaches and peers navigating the MBA admissions process — from GMAT prep to final decisions.",
    memberCount: 1840,
    sessionCount: 0,
    banner: eventImg1,
    accentColor: "#038561",
    instructor: { name: "David Kim", avatar: pic4, headline: "MBA Admissions Consultant | Ex-Bain, HBS '19" },
    helpfulLinks: [
      { label: "Browse MBA Coaches", description: "Find an expert to help with your applications", type: "profile" },
      { label: "Free Resources", description: "Essays, timelines, and school profiles", type: "resource" },
      { label: "Upcoming Events", description: "Free webinars and Q&As from top coaches", type: "booking" },
      { label: "Community Guidelines", description: "How we keep this space helpful and professional", type: "guide" },
    ],
  },
  consulting: {
    name: "Consulting",
    cohortLabel: "Leland Community · Open group",
    tagline: "Case prep, recruiting, and career strategy.",
    description:
      "A community for aspiring and current consultants — MBB recruiting, case interview prep, offer negotiation, and career transitions.",
    memberCount: 2310,
    sessionCount: 0,
    banner: eventImg2,
    accentColor: "#7C3AED",
    instructor: { name: "Nina Kowalski", avatar: pic7, headline: "Partner at McKinsey & Company | Recruiting Lead" },
    helpfulLinks: [
      { label: "Browse Consulting Coaches", description: "MBB veterans and recruiting experts", type: "profile" },
      { label: "Case Interview Resources", description: "Frameworks, drills, and practice cases", type: "resource" },
      { label: "Upcoming Events", description: "Free case prep sessions and recruiting Q&As", type: "booking" },
      { label: "Community Guidelines", description: "How we keep this space helpful and professional", type: "guide" },
    ],
  },
  law: {
    name: "Law School",
    cohortLabel: "Leland Community · Open group",
    tagline: "LSAT prep, applications, and law school life.",
    description:
      "A community for pre-law students and law school applicants — LSAT strategy, school selection, personal statement feedback, and advice from people who've been through it.",
    memberCount: 1240,
    sessionCount: 0,
    banner: eventImg3,
    accentColor: "#1e3a5f",
    instructor: { name: "Rachel Nguyen", avatar: pic9, headline: "1L at Yale Law School | Pre-Law Admissions Coach" },
    helpfulLinks: [
      { label: "Browse Law Coaches", description: "Find LSAT tutors and admissions advisors", type: "profile" },
      { label: "LSAT Resources", description: "Study plans, drill sets, and prep guides", type: "resource" },
      { label: "School Profiles", description: "Rankings, culture, employment outcomes", type: "resource" },
      { label: "Community Guidelines", description: "How we keep this space helpful and professional", type: "guide" },
    ],
  },
  "ai-bp-apr-26": {
    name: "AI BP April 26",
    cohortLabel: "April 21 – May 16, 2026 · Cohort 1",
    tagline: "Learn to build with AI in 4 weeks.",
    description:
      "A hands-on cohort for professionals who want to understand and build with AI — from prompting and APIs to real projects. No engineering background required.",
    memberCount: 18,
    sessionCount: 8,
    banner: bootcampBanner,
    accentColor: "#2563EB",
    instructor: { name: "David Kim", avatar: pic4, headline: "MBA Admissions Consultant | Ex-Bain, HBS '19" },
    helpfulLinks: [
      { label: "Instructor Profile", description: "View David Kim's full profile and book a session", type: "profile" },
      { label: "Session Recordings", description: "Catch up on past sessions and download slides", type: "resource" },
      { label: "Office Hours", description: "Book 1:1 time with your instructor", type: "booking" },
      { label: "Community Guidelines", description: "How we keep this space helpful and professional", type: "guide" },
    ],
  },
};

// ─── Activity posts ───────────────────────────────────

const GROUP_POSTS: Record<string, Post[]> = {
  "ai-bootcamp-apr-2026": [
    {
      id: 1001,
      type: "text",
      author: "David Kim",
      avatar: pic4,
      time: "1h",
      verified: true,
      headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
      feed: "AI Boot Camp",
      body: "Welcome to Cohort 4! Before Monday's first session, I'd love for everyone to share one thing: what's the specific problem you're hoping AI helps you solve in your work or career? Drop it in the replies — this will shape how we structure project time in week 3.",
      likes: 31,
      comments: 12,
      reposts: 2,
      shares: 1,
    },
    {
      id: 1002,
      type: "text",
      author: "Sarah Chen",
      avatar: pic3,
      time: "3h",
      verified: false,
      headline: "Product Manager | AI Boot Camp Cohort 4",
      feed: "AI Boot Camp",
      body: "Just wrapped up Session 2 on prompt engineering — my brain is fried in the best possible way. Spent two hours after the session building a small tool that auto-generates interview prep questions from job descriptions. The concepts are clicking. See you all Monday!",
      likes: 18,
      comments: 4,
      reposts: 1,
      shares: 0,
    },
    {
      id: 1003,
      type: "link",
      author: "Marcus Williams",
      avatar: pic2,
      time: "1d",
      verified: false,
      headline: "Incoming MBA Candidate | Stanford GSB '26",
      feed: "AI Boot Camp",
      body: "Sharing this ahead of Session 3 — the best breakdown of RAG architecture I've read. No PhD required. If you've been confused by the difference between retrieval-augmented generation and fine-tuning, this will clear it up.",
      link: {
        url: "https://example.com/rag-explained",
        domain: "simonwillison.net",
        title: "Retrieval-Augmented Generation: A Practical Guide for Product People",
        image:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop",
      },
      likes: 24,
      comments: 3,
      reposts: 8,
      shares: 2,
    },
    {
      id: 1004,
      type: "text",
      author: "Emma Rodriguez",
      avatar: pic5,
      time: "2d",
      verified: false,
      headline: "MBA Admissions Coach | Ex-Deloitte | Wharton '22",
      feed: "AI Boot Camp",
      body: "After Session 1 I thought this might be a bit too technical for me. After Session 2 I'm building things I didn't think were possible six months ago. For anyone on the fence about whether they're 'technical enough' — you don't need to be. The frameworks they teach work regardless.",
      likes: 42,
      comments: 7,
      reposts: 3,
      shares: 1,
    },
    {
      id: 1005,
      type: "text",
      author: "James Liu",
      avatar: pic6,
      time: "3d",
      verified: false,
      headline: "Incoming Business Analyst at Bain & Company | Booth '25",
      feed: "AI Boot Camp",
      body: "Cohort 4 intro! I'm James, ex-strategy consulting, currently at Booth. I'm here because I want to stop relying on engineers to build every tool I dream up. Goal by end of bootcamp: a working AI assistant that helps MBA applicants prep for case interviews. Anyone with a CS background feel free to adopt me.",
      likes: 56,
      comments: 14,
      reposts: 0,
      shares: 0,
    },
    {
      id: 1006,
      type: "image",
      author: "Nina Kowalski",
      avatar: pic7,
      time: "4d",
      verified: true,
      headline: "Partner at McKinsey & Company | Recruiting Lead",
      feed: "AI Boot Camp",
      body: "We built a fully working AI-powered case interview prep tool in under 3 hours during Session 2's project block. Three weeks ago I thought this was impossible without an engineering team. Sharing the screenshots — I still can't believe this came out of a single afternoon.",
      images: [eventImg2, eventImg3],
      likes: 94,
      comments: 21,
      reposts: 11,
      shares: 4,
    },
    {
      id: 1007,
      type: "link",
      author: "Alex Thompson",
      avatar: pic8,
      time: "5d",
      verified: false,
      headline: "Management Consultant | Career Coach",
      feed: "AI Boot Camp",
      body: "Worth reading before Session 3 — this piece on how product managers at Google and Meta actually use AI in their day-to-day workflow. Spoiler: it's almost nothing like the demo use cases you see on social media. Much more mundane, much more useful.",
      link: {
        url: "https://example.com/ai-in-product-work",
        domain: "lennysnewsletter.com",
        title: "How PMs at top companies actually use AI (it's not what you think)",
        image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&h=340&fit=crop",
      },
      likes: 38,
      comments: 6,
      reposts: 9,
      shares: 1,
    },
  ],
  law: [
    {
      id: 3001,
      type: "text",
      author: "Rachel Nguyen",
      avatar: pic9,
      time: "13h",
      verified: false,
      headline: "1L at Yale Law School | Pre-Law Admissions Coach",
      feed: "Law School",
      body: "A lot of people ask me how I chose between law schools. Honestly? I stopped looking at rankings and started asking: where do the students actually seem happy?\n\nVisited three campuses. At two of them, the 2Ls and 3Ls gave very polished answers. At Yale, someone told me \"it's not perfect, but we actually like each other.\" That was enough.\n\nThe rankings will shuffle. The culture won't.",
      likes: 318,
      comments: 41,
      reposts: 29,
      shares: 7,
    },
    {
      id: 3002,
      type: "text",
      author: "Michael Chen",
      avatar: pic10,
      time: "1d",
      verified: false,
      headline: "2L at Columbia Law | Former Finance Analyst",
      feed: "Law School",
      body: "LSAT tip that nobody talks about: your timing strategy matters as much as your content knowledge.\n\nI wasted three months drilling logic games before I realized I was spending 4 minutes on easy questions and running out of time on medium ones. Fixed my pacing first, score jumped 8 points in a month.\n\nKnow your questions, know your limits, skip and come back.",
      likes: 204,
      comments: 27,
      reposts: 18,
      shares: 5,
    },
    {
      id: 3003,
      type: "link",
      author: "Olivia Park",
      avatar: pic11,
      time: "2d",
      verified: true,
      headline: "Pre-Law Admissions Coach | Yale JD '21",
      feed: "Law School",
      body: "The best piece I've read on writing a law school personal statement. It's not about being dramatic — it's about being precise. Why law, why you, why now. That's it.",
      link: {
        url: "https://example.com/law-personal-statement",
        domain: "lawschooli.com",
        title: "How to Write a Law School Personal Statement That Actually Works",
        image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=600&h=340&fit=crop",
      },
      likes: 156,
      comments: 14,
      reposts: 31,
      shares: 9,
    },
  ],
  mba: [],
  consulting: [],
  "ai-bp-apr-26": [
    {
      id: 16,
      type: "text",
      author: "Sarah Chen",
      avatar: pic3,
      time: "45m",
      verified: false,
      headline: "Product Manager | AI BP April 26 Cohort",
      feed: "AI BP April 26",
      body: "Session 1 was last night and I already feel like a different person.\n\nI'd always thought of AI as a black box that either works or doesn't. Turns out the way you ask is almost everything. We rewrote the same prompt three different ways and the outputs were completely different — one was useless, one was okay, one was exactly what I needed.\n\nSix weeks ago I would have called that magic. Now I know it's just structure. Can't believe I waited this long to learn this.",
      likes: 47,
      comments: 9,
      reposts: 6,
      shares: 2,
    },
    {
      id: 2006,
      type: "image",
      author: "Nina Kowalski",
      avatar: pic7,
      time: "4d",
      verified: true,
      headline: "Partner at McKinsey & Company | Recruiting Lead",
      feed: "AI BP April 26",
      body: "We built a fully working AI-powered case interview prep tool in under 3 hours during Session 2's project block. Three weeks ago I thought this was impossible without an engineering team. Sharing the screenshots — I still can't believe this came out of a single afternoon.",
      images: [eventImg2, eventImg3],
      likes: 94,
      comments: 21,
      reposts: 11,
      shares: 4,
    },
    {
      id: 2007,
      type: "link",
      author: "Alex Thompson",
      avatar: pic8,
      time: "5d",
      verified: false,
      headline: "Management Consultant | Career Coach",
      feed: "AI BP April 26",
      body: "Worth reading before Session 3 — this piece on how product managers at Google and Meta actually use AI in their day-to-day workflow. Spoiler: it's almost nothing like the demo use cases you see on social media. Much more mundane, much more useful.",
      link: {
        url: "https://example.com/ai-in-product-work",
        domain: "lennysnewsletter.com",
        title: "How PMs at top companies actually use AI (it's not what you think)",
        image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&h=340&fit=crop",
      },
      likes: 38,
      comments: 6,
      reposts: 9,
      shares: 1,
    },
  ],
};

// ─── Sessions ─────────────────────────────────────────

const COHORT_SESSIONS = [
  { id: 1, title: "Intro to AI & LLMs", date: "Mon, Apr 21", time: "6:00 PM PT", duration: "90m", past: true, hasRecording: true, image: eventImg1 },
  { id: 2, title: "Prompt Engineering", date: "Wed, Apr 23", time: "6:00 PM PT", duration: "90m", past: true, hasRecording: true, image: eventImg2 },
  { id: 3, title: "Building with APIs", date: "Mon, Apr 28", time: "6:00 PM PT", duration: "90m", past: false, hasRecording: false, image: eventImg3 },
  { id: 4, title: "AI Product Strategy", date: "Wed, Apr 30", time: "6:00 PM PT", duration: "90m", past: false, hasRecording: false, image: eventImg1 },
  { id: 5, title: "RAG & Fine-tuning", date: "Mon, May 5", time: "6:00 PM PT", duration: "90m", past: false, hasRecording: false, image: eventImg2 },
  { id: 6, title: "Building Your Project", date: "Wed, May 7", time: "6:00 PM PT", duration: "90m", past: false, hasRecording: false, image: eventImg3 },
  { id: 7, title: "Guest Speakers", date: "Mon, May 12", time: "6:00 PM PT", duration: "90m", past: false, hasRecording: false, image: eventImg1 },
  { id: 8, title: "Demo Day", date: "Fri, May 16", time: "4:00 PM PT", duration: "2h", past: false, hasRecording: false, image: eventImg2 },
];

// ─── Members ──────────────────────────────────────────

const COHORT_MEMBERS: { name: string; avatar: string; headline: string; role: "self" | "coach" | "member" }[] = [
  { name: "You", avatar: profilePhoto, headline: "Product Manager", role: "self" },
  { name: "David Kim", avatar: pic4, headline: "MBA Admissions Consultant", role: "coach" },
  { name: "Sarah Chen", avatar: pic3, headline: "Product Manager", role: "member" },
  { name: "Marcus Williams", avatar: pic2, headline: "Stanford GSB '26", role: "member" },
  { name: "Emma Rodriguez", avatar: pic5, headline: "MBA Coach | Wharton '22", role: "coach" },
  { name: "James Liu", avatar: pic6, headline: "Incoming BA at Bain | Booth '25", role: "member" },
  { name: "Nina Kowalski", avatar: pic7, headline: "Partner at McKinsey", role: "member" },
  { name: "Alex Thompson", avatar: pic8, headline: "Management Consultant", role: "member" },
  { name: "Rachel Nguyen", avatar: pic9, headline: "Wharton MBA '24", role: "member" },
  { name: "Michael Chen", avatar: pic10, headline: "Ex-BCG Consultant", role: "member" },
  { name: "Olivia Park", avatar: pic11, headline: "HBS Admissions Coach", role: "coach" },
  { name: "Ryan Foster", avatar: pic12, headline: "Career Coach | Ex-McKinsey", role: "coach" },
  { name: "James Allen", avatar: pic1, headline: "Former Director at Stanford GSB", role: "coach" },
];

// ─── Tabs ─────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "activity", label: "Activity" },
  { id: "members", label: "Members" },
];

// ─── Sub-components ───────────────────────────────────

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Tab content ──────────────────────────────────────


function ActivityTab({ posts: initialPosts }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [composeOpen, setComposeOpen] = useState(false);

  const handleEdit = (id: number, text: string, postImages: ImageEntry[]) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (postImages.length > 0) {
        return { ...p, type: "image" as const, body: text, images: postImages.map(img => img.cropped), imageAspectRatios: postImages.map(img => img.aspectRatio) };
      }
      return { ...p, type: "text" as const, body: text } as Post;
    }));
  };

  return (
    <div>
      {/* Post composer — same as home feed */}
      <div className="flex items-center gap-3 border-b border-gray-stroke py-5">
        <img
          src={profilePhoto}
          alt="Your profile"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <button
          onClick={() => setComposeOpen(true)}
          className="flex-1 rounded-full bg-gray-hover px-4 py-[10px] text-left text-[16px] text-gray-light transition-shadow hover:shadow-[0_0_0_1.5px_#111111]"
        >
          Create post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[18px] font-medium text-gray-dark">No posts yet</p>
          <p className="mt-1 text-[16px] text-[#707070]">Be the first to post in this group.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#F0F0F0]">
          {posts.map((post) => (
            <FeedPost key={post.id} post={post} onUpdate={handleEdit} />
          ))}
        </div>
      )}

      {composeOpen && (
        <ComposeModal onClose={() => setComposeOpen(false)} onPost={() => {}} isMVP={true} />
      )}
    </div>
  );
}

const LINK_ICONS: Record<LinkType, ReactNode> = {
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  resource: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
  booking: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  guide: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  support: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
};


function MembersTab({ memberCount }: { memberCount: number }) {
  const navigate = useNavigate();
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  return (
    <div className="py-6">
      <p className="mb-5 text-[16px] text-[#707070]">{memberCount} members</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[...COHORT_MEMBERS].sort((a, b) => {
          const rank = (m: typeof COHORT_MEMBERS[number]) =>
            m.role === "self" ? 0 : m.role === "coach" ? 1 : followed.has(m.name) ? 2 : 3;
          return rank(a) - rank(b);
        }).map((m) => (
          <div
            key={m.name}
            onClick={() => navigate("/profile-v2")}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E5E5] px-4 py-3 transition-colors hover:bg-[#F9F9F9]"
          >
            <img src={m.avatar} alt={m.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-medium leading-tight text-gray-dark">{m.name}</p>
              <p className="truncate text-[14px] leading-tight text-[#707070]">{m.headline}</p>
            </div>
            {m.role === "coach" && (
              <button
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 rounded-[8px] bg-[#F0F0F0] px-3 py-1.5 text-[13px] font-medium text-gray-dark transition-colors hover:bg-[#E8E8E8]"
              >
                Message
              </button>
            )}
            {m.role === "member" && (
              <button
                onClick={(e) => { e.stopPropagation(); setFollowed(prev => { const next = new Set(prev); next.has(m.name) ? next.delete(m.name) : next.add(m.name); return next; }); }}
                className="shrink-0 rounded-[8px] bg-[#F0F0F0] px-3 py-1.5 text-[13px] font-medium text-gray-dark transition-colors hover:bg-[#E8E8E8]"
              >
                {followed.has(m.name) ? "Following" : "Follow"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right sidebar ────────────────────────────────────

function GroupSidebar({ group }: { group: GroupData }) {
  const isCohort = group.sessionCount > 0;
  const nextSession = isCohort ? COHORT_SESSIONS.find((s) => !s.past) : null;

  return (
    <div className="flex flex-col gap-6 px-1">
      {nextSession && (
        <SidebarGroup label="Next session">
          <SidebarCard
            variant="event"
            image={nextSession.image}
            title={nextSession.title}
            subtitle={`${nextSession.date} · ${nextSession.time}`}
            right={
              <div className="rounded-[8px] bg-[#038561] px-3 py-1.5 text-[13px] font-medium text-white" style={{ lineHeight: 1.2 }}>
                RSVP
              </div>
            }
          />
        </SidebarGroup>
      )}

      {!isCohort && (
        <SidebarGroup label="Top contributors">
          <SidebarCard variant="coach" image={pic4} title="David Kim" subtitle="MBA Admissions Consultant | Ex-Bain" />
          <SidebarCard variant="coach" image={pic7} title="Nina Kowalski" subtitle="Partner at McKinsey | Recruiting Lead" />
          <SidebarCard variant="coach" image={pic8} title="Alex Thompson" subtitle="Management Consultant | Career Coach" />
        </SidebarGroup>
      )}

      {group.helpfulLinks.length > 0 && (
        <SidebarGroup label="Helpful Links" hideChevron>
          {group.helpfulLinks.map((link) => (
            <SidebarCard
              key={link.label}
              variant="topic"
              icon={
                <div className="flex h-[44px] w-[80px] items-center justify-center rounded-[4px] bg-[#f5f5f5] text-[#707070]">
                  {LINK_ICONS[link.type]}
                </div>
              }
              title={link.label}
              subtitle={link.description}
            />
          ))}
        </SidebarGroup>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────

export default function Group() {
  useEffect(() => {
    document.title = "Leland Prototype | Group";
  }, []);

  const { groupId = "ai-bootcamp-apr-2026" } = useParams<{ groupId: string }>();
  const group = GROUPS[groupId];
  const posts = GROUP_POSTS[groupId] ?? [];

  const [activeTab, setActiveTab] = useState<Tab>("activity");
  const [isJoined, setIsJoined] = useState(true);
  const [stickyNavVisible, setStickyNavVisible] = useState(false);
  const heroSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyNavVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (!group) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[20px] font-medium text-gray-dark">Group not found</p>
          <p className="mt-2 text-[16px] text-[#707070]">This group page hasn't been built yet.</p>
          <Link to="/" className="mt-6 text-[16px] font-medium text-[#038561] hover:underline">
            ← Back to feed
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <>
      {/* Sticky tab nav — portaled to body */}
      {createPortal(
        <AnimatePresence>
          {stickyNavVisible && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 right-0 z-30 border-b border-gray-stroke bg-white"
            >
              <div className="mx-auto flex max-w-[1280px] items-stretch gap-4 px-6">
                <div
                  className="flex shrink-0 cursor-pointer items-center gap-2.5 py-3"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-[14px] font-bold"
                    style={{ backgroundColor: group.accentColor }}
                  >
                    {group.name.charAt(0)}
                  </div>
                  <span className="text-[17px] font-medium text-gray-dark">{group.name}</span>
                </div>

                <div className="min-w-0 flex-1" />

                <div className="flex shrink-0 items-stretch gap-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 cursor-pointer border-b-2 px-3 pt-4 pb-4 text-[16px] font-medium transition-colors ${
                        activeTab === tab.id
                          ? "border-[#038561] text-gray-dark"
                          : "border-transparent text-[#707070] hover:text-gray-dark"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Full-bleed banner — outside PageShell */}
      <div className="w-full bg-[#f0f0f0]" style={{ height: 122 }} />

      <PageShell rightSidebar={<GroupSidebar group={group} />} rightSidebarWidth={360} contentMaxWidth={740} sidebarAlign="start">
        {/* Group icon + CTA row — overlaps banner with negative margin */}
        <div className="-mt-[100px] mb-4 flex items-end justify-between">
          <div
            className="flex h-[132px] w-[132px] shrink-0 items-center justify-center rounded-lg border-[4px] border-white text-white text-[48px] font-bold"
            style={{ backgroundColor: group.accentColor }}
          >
            {group.name.charAt(0)}
          </div>
          <div className="pb-[82px]">
            <button
              onClick={() => setIsJoined(!isJoined)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-[16px] font-medium transition-colors ${
                isJoined
                  ? "border border-[#222222]/10 bg-white text-gray-dark hover:border-[#222222]/20"
                  : "bg-[#038561] text-white hover:bg-[#038561]/90"
              }`}
            >
              {isJoined && <CheckIcon />}
              {isJoined ? "Joined" : "Join group"}
            </button>
          </div>
        </div>

        {/* Group name + tagline */}
        <h1 className="text-[24px] font-medium leading-tight text-gray-dark">{group.name}</h1>
        <p className="mt-1 mb-[6px] text-[18px] leading-[1.3] text-[#707070]">{group.tagline}</p>

        {/* Sentinel for sticky nav */}
        <div ref={heroSentinelRef} />

        {/* Tab bar */}
        <div className="mt-4 flex gap-1 border-b border-[#E5E5E5]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer border-b-2 px-3 pt-4 pb-4 text-[16px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-[#038561] text-gray-dark"
                  : "border-transparent text-[#707070] hover:text-gray-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "activity" && <ActivityTab posts={posts} />}
{activeTab === "members" && <MembersTab memberCount={group.memberCount} />}
      </PageShell>
    </>
  );
}
