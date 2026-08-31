import { useRef, useState, useEffect, Fragment, type CSSProperties, type RefObject } from "react";
import { Button } from "../components/Button";
import ImageLightbox from "../components/ImageLightbox";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FADE_IN, FADE_TRANSITION } from "../lib/pushTransition";
import { nameToSlug } from "../lib/profileSlug";
import { Image as ImageIcon } from "lucide-react";
import { useVersion } from "../contexts/VersionContext";
import { useBookmarks } from "../contexts/BookmarksContext";
import { useSavedToast } from "../contexts/SavedToastContext";
import { Composer } from "./Composer";
import { useFeedDemo } from "../contexts/FeedDemoContext";
import { useProfileBarMode } from "../contexts/ProfileBarModeContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useSetLeftSidebar } from "../components/LeftSidebarContext";
import { useSetRightSidebar } from "../components/RightSidebarContext";
import DashboardProfileCard from "../components/DashboardProfileCard";
import { useIsMobile } from "../hooks/useIsMobile";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import SessionCard from "../components/SessionCard";
import OfferingCard from "../components/OfferingCard";
import SidebarCard from "../components/SidebarCard";
import profilePhoto from "../assets/profile photos/profile photo.png";
import profileCover from "../assets/img/cover-image-2.png";
import editIcon from "../assets/icons/edit.svg";
import trashIcon from "../assets/icons/trash.svg";
import eyeClosedIcon from "../assets/icons/eye-closed.svg";
import reportFlagIcon from "../assets/icons/report-flag.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import checkIcon from "../assets/icons/check.svg";
import calendarPageIcon from "../assets/icons/calendar-page.svg";
import dotsHorizontalIcon from "../assets/icons/dots-horizontal.svg";
import eventImageSrc from "../assets/img/EventImage.avif";
import lelandCompass from "../assets/leland-compass.svg";
import categoryInvestmentBanking from "../assets/placeholder images/category images/investment-banking.png";
import categoryAI from "../assets/placeholder images/category images/AI-automation-and-agents.png";
import categoryGMAT from "../assets/placeholder images/category images/gmat-tutoring.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";

// Organisation logos
import orgWharton   from "../assets/org-logos/wharton.png";
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
// Company favicons for the "Minimal" profile-bar mode.
import logoMeta       from "../assets/logos/facebook.png";
import logoGoogle     from "../assets/logos/google.png";
import logoSalesforce from "../assets/logos/salesforce.png";
import logoCoinbase   from "../assets/logos/coinbase.png";
import logoMcKinsey   from "../assets/logos/mckinsey.png";

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
// OG preview images for embedded link posts.
import linkOg1 from "../assets/placeholder post assets/link-OGs/Property 1=AIBP.png";
import linkOg2 from "../assets/placeholder post assets/link-OGs/Property 1=B2B.png";
import linkOg3 from "../assets/placeholder post assets/link-OGs/Property 1=Variant11.png";

// Post images — sourced from src/assets/placeholder post assets. Single-image
// posts use the three top-level files; multi-image posts use the stanford-post
// and stripe-office folders.
import postImgA from "../assets/placeholder post assets/1786570620765.jpg";
import postImgB from "../assets/placeholder post assets/1787660900685.jpg";
import postImgLinkedIn from "../assets/placeholder post assets/LinkedIn-8png.jpg";
import stanford1 from "../assets/placeholder post assets/stanford-post/00c1e12547190979b4db2978dbe211e2.jpg";
import stanford2 from "../assets/placeholder post assets/stanford-post/39a9980b59e79fa3b58e8d7d5145b9a9.jpg";
import stanford3 from "../assets/placeholder post assets/stanford-post/989ac1d56cf981c783808b83154d8a25.jpg";
import stanford4 from "../assets/placeholder post assets/stanford-post/eb80edada3b3db7955379d433ca2861a.jpg";
import stripe1 from "../assets/placeholder post assets/stripe-office/1787349143622.jpg";
import stripe2 from "../assets/placeholder post assets/stripe-office/1787349143698.jpg";
import stripe3 from "../assets/placeholder post assets/stripe-office/1787349145262.jpg";
import stripe4 from "../assets/placeholder post assets/stripe-office/1787349147111.jpg";
import stripe5 from "../assets/placeholder post assets/stripe-office/1787349147131.jpg";
import stripe6 from "../assets/placeholder post assets/stripe-office/1787349147226.jpg";
import stripe7 from "../assets/placeholder post assets/stripe-office/1787349147888.jpg";
import stripe8 from "../assets/placeholder post assets/stripe-office/1787349148103.jpg";

// ─── Types ────────────────────────────────────────────

interface PostBase {
  id: number;
  author: string;
  avatar: string;
  time: string;
  verified?: boolean;
  headline?: string;
  feed?: string;
  isGroupPost?: boolean;
  groupId?: string;
  groupColor?: string;
  groupPoster?: { name: string; avatar: string; headline?: string; overlay?: boolean };
  // Small company favicon shown next to the poster's name in the "Minimal"
  // profile-bar mode (Admin Tools → Profile bar → Min).
  companyLogo?: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  // Simple-repost attribution. When set, this feed entry is a re-surfaced
  // repost ("↻ You reposted"); repostOfId points at the original post.
  repostedBy?: string;
  repostOfId?: number;
}

interface TextPost extends PostBase {
  type: "text";
  body: string;
}

interface ImagePost extends PostBase {
  type: "image";
  body: string;
  images: string[];
  imageAspectRatios?: number[];
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
    registered?: number;
    // Live/wrapped lifecycle demo (Admin Tools → Event stage)
    videoId?: string;           // stream source while live
    watching?: number;          // concurrent viewers while live
    attended?: number;          // total attendees once wrapped
    recordingDuration?: string; // e.g. "1:24:36"
  };
}

interface MilestonePost extends PostBase {
  type: "milestone";
  body: string;
  milestone: {
    // Celebration flavor: "admitted" (default) for school admits,
    // "offer" for job offers. Both share the confetti treatment.
    kind?: "admitted" | "offer";
    school: string; // institution or company name
    program: string; // program or role line
    clientName: string;
    clientAvatar: string;
    schoolColor: string;
    schoolInitial: string;
    schoolLogo?: string;
  };
}

// Quieter milestone — a coaching session wrapped. No confetti; the CTA sells
// the coach, not the celebration.
interface SessionPost extends PostBase {
  type: "session";
  body: string;
  session: {
    topic: string;
    duration: string;
    coachName: string;
    coachAvatar: string;
    sessionsTogether?: number;
  };
}

// Platform-parody explorations of the live post type. A post with a variant
// always renders that parody card; posts without one use the Admin Tools
// "Live card" toggle (Video/Min) as before.
export type LiveVariant = "minimal" | "twitter" | "tiktok" | "linkedin" | "reddit" | "substack" | "instagram";

interface LivePost extends PostBase {
  type: "live";
  body: string;
  live: {
    title: string;
    videoId: string;
    viewers: number;
    topic: string;
    variant?: LiveVariant;
    // Local mp4 for the cam feed — preferred over the YouTube embed when set.
    videoSrc?: string;
    // Multi-host session: one cam feed per host, side by side.
    hosts?: string[];
    // Panel layout: equal-height rows instead of a dominant hero frame.
    evenSplit?: boolean;
    // Drop the screen-share thumbnail from the card.
    hideDeck?: boolean;
    // Media-only post: no author row or body text above the card.
    bare?: boolean;
    // Recorded session posted after the fact — swaps the pulsing live chip
    // for a play-button + duration chip.
    replay?: boolean;
    duration?: string;
    // Simple horizontal replay card (no vertical chrome). Toggles come from
    // the composer: burned-in captions and the replayed chat overlay.
    horizontal?: boolean;
    showCaptions?: boolean;
    showChat?: boolean;
    // Best concurrent-viewer moment of the original stream — the hook that
    // makes a replay worth tapping (live count would restart near zero).
    peakViewers?: number;
    // LLM-composed caption clip: animated Q&A type over brand yellow with the
    // real session audio — no footage of the host needed.
    captionCard?: { q: string; a: string; qAudio: string; aAudio: string }[];
    // Crop chosen in the composer: card ratio + the user's framing pan.
    cropAspect?: "Original" | "16:9" | "1:1" | "4:5" | "9:16";
    cropX?: number;
    cropY?: number;
  };
}

// Compact, read-only snapshot of the post being quoted, embedded inside a
// QuotePost card and the quote composer preview.
export interface QuotedSnapshot {
  id: number;
  author: string;
  avatar: string;
  time: string;
  verified?: boolean;
  body: string;
  image?: string;
}

// "Repost with your thoughts" — a new post carrying the reposter's commentary
// plus an embedded snapshot of the original.
interface QuotePost extends PostBase {
  type: "quote";
  body: string;
  quoted: QuotedSnapshot;
}

// Long-form content, Substack-style: a titled article that renders as a
// preview card in the feed and full-length on its post page.
interface ArticlePost extends PostBase {
  type: "article";
  title: string;
  subtitle?: string;
  body: string;
  // Rich HTML from the composer's editor; `body` stays plain text for
  // excerpts and read-time. Read page prefers this when present.
  bodyHtml?: string;
  readMinutes: number;
}

interface PollPost extends PostBase {
  type: "poll";
  body: string;
  poll: {
    options: { label: string; votes: number }[];
    durationLabel: string; // e.g. "2 days left"
  };
}

export type Post = TextPost | ImagePost | LinkPost | EventPost | MilestonePost | SessionPost | LivePost | QuotePost | ArticlePost | PollPost;
export type { TextPost, ImagePost, LinkPost, EventPost, MilestonePost, SessionPost, LivePost, QuotePost, ArticlePost, PollPost };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Sample data ──────────────────────────────────────

export const posts: Post[] = [
  {
    id: 36,
    type: "text",
    author: "Marcus Williams",
    avatar: pic14,
    time: "30m",
    headline: "Admissions at Stanford GSB",
    body: "Unpopular opinion: your resume matters less than your ability to tell the same story out loud in 60 seconds.",
    likes: 88,
    comments: 14,
    reposts: 6,
    shares: 1,
  },
  {
    id: 23,
    type: "image",
    author: "Samantha Parker",
    avatar: pic6,
    time: "20m",
    verified: true,
    headline: "AI BP Instructor · Ex-Meta PM",
    companyLogo: logoMeta,
    feed: "AI BP April 26",
    body: "Reviewed every week 2 submission this morning ☕️ The standouts had one thing in common — they didn't just automate a task, they redesigned the workflow first. Tools second.",
    images: [postImgA],
    likes: 89,
    comments: 12,
    reposts: 7,
    shares: 4,
  },
  {
    id: 19,
    type: "text",
    author: "Emma Rodriguez",
    avatar: pic5,
    time: "12m",
    verified: false,
    headline: "Ops Lead at Notion",
    companyLogo: logoSalesforce,
    feed: "AI BP April 26",
    body: "Quick Q for cohort 1 — for the week 2 project, did anyone find a good way to handle rate limits when chaining multiple Claude calls?\n\nI've got a little script that pulls meeting notes, summarizes them, and then drafts follow-up emails. Works great on one meeting, blows up on five. Considering just adding a sleep() but that feels dumb. Open to ideas before I over-engineer this.",
    likes: 18,
    comments: 11,
    reposts: 1,
    shares: 0,
  },
  {
    id: 21,
    type: "image",
    author: "Jackson Ringger",
    avatar: pic6,
    time: "32m",
    verified: false,
    headline: "Strategy @ Airbnb",
    companyLogo: logoCoinbase,
    feed: "AI BP April 26",
    body: "Wild — asked Claude to rewrite our team's weekly status update template and this is what it came back with. Three years of 'what shipped / what's blocked' and nobody thought to add the third column. Trying it at standup Monday. 👀",
    images: [postImgB],
    likes: 64,
    comments: 14,
    reposts: 4,
    shares: 2,
  },
  {
    id: 16,
    type: "text",
    author: "Sarah Chen",
    avatar: pic3,
    time: "45m",
    verified: false,
    headline: "Product Manager",
    companyLogo: logoGoogle,
    feed: "AI BP April 26",
    body: "Session 1 was last night and I already feel like a different person.\n\nI'd always thought of AI as a black box that either works or doesn't. Turns out the way you ask is almost everything. We rewrote the same prompt three different ways and the outputs were completely different — one was useless, one was okay, one was exactly what I needed.\n\nSix weeks ago I would have called that magic. Now I know it's just structure. Can't believe I waited this long to learn this.",
    likes: 47,
    comments: 9,
    reposts: 6,
    shares: 2,
  },
  {
    id: 1,
    type: "text",
    author: "James Allen",
    avatar: pic1,
    time: "2h",
    verified: true,
    headline: "Former Director of Programs and Admissions at Stanford GSB",
    companyLogo: logoMcKinsey,
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
    headline: "Incoming MBA Candidate | Stanford GSB '26",
    feed: "MBA Admissions",
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
    headline: "HBS MBA '25 | Former Investment Banking Analyst",
    body: "This article perfectly captures why networking in MBA admissions is so misunderstood. It's not about collecting contacts — it's about genuine curiosity.",
    link: {
      url: "https://example.com/mba-networking",
      domain: "hbr.org",
      title: "The Art of Networking in Business School Admissions",
      image: linkOg1,
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
    feed: "MBA Admissions",
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
    headline: "Official Leland Livestreams",
    body: "Curious about public policy grad school? Join Sarah Esquivel — Former Associate Director of Admissions at a Top 3 Public Policy School — for a live Ask Me Anything. Bring your questions about applications, programs, and career paths.",
    event: {
      title: "Public Policy Graduate Programs: Ask Me Anything",
      image: eventImageSrc,
      date: "Thursday, April 3, 2026",
      time: "6:00 PM – 7:30 PM PT",
      format: "Online",
      spotsLeft: 38,
      registered: 142,
      videoId: "1cfIAVasP6E",
      watching: 89,
      attended: 214,
      recordingDuration: "1:24:36",
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
      schoolLogo: orgWharton,
    },
    likes: 431,
    comments: 47,
    reposts: 22,
    shares: 8,
  },
  {
    id: 24,
    type: "milestone",
    author: "Nina Kowalski",
    avatar: pic7,
    time: "3h",
    verified: true,
    feed: "Consulting",
    headline: "Partner at McKinsey & Company | Consulting Recruiting Lead",
    body: "Six months of case prep, three final-round loops, and one very persistent client. Maya just signed her offer with McKinsey. Couldn't be prouder — she earned every bit of this.",
    milestone: {
      kind: "offer",
      school: "McKinsey & Company",
      program: "Associate, Strategy & Corporate Finance",
      clientName: "Maya R.",
      clientAvatar: pic12,
      schoolColor: "#003580",
      schoolInitial: "M",
      schoolLogo: orgMcKinsey,
    },
    likes: 389,
    comments: 41,
    reposts: 18,
    shares: 7,
  },
  {
    id: 25,
    type: "session",
    author: "Jordan Mitchell",
    avatar: pic11,
    time: "4h",
    headline: "MBA Candidate | Deferred admit hopeful",
    body: "Just wrapped my essay review session with David — we tore my Wharton essays apart and rebuilt them around a story I'd been burying the whole time. Feeling 10x more confident about round 2.",
    session: {
      topic: "MBA essay deep-dive",
      duration: "60 min",
      coachName: "David Kim",
      coachAvatar: pic4,
      sessionsTogether: 7,
    },
    likes: 96,
    comments: 11,
    reposts: 3,
    shares: 1,
  },
  {
    id: 27,
    type: "live",
    author: "Priya Patel",
    avatar: pic3,
    time: "Now",
    verified: true,
    headline: "MBA Admissions Coach | HBS MBA",
    body: "Join my live stream 👋",
    live: {
      variant: "tiktok",
      title: "GMAT quant night grind",
      videoId: "1cfIAVasP6E",
      videoSrc: "/videos/corinna.mp4",
      viewers: 2113,
      topic: "Study with me",
    },
    likes: 542,
    comments: 187,
    reposts: 31,
    shares: 26,
  },
  {
    id: 37,
    type: "text",
    author: "Emma Rodriguez",
    avatar: pic5,
    time: "45m",
    headline: "AI Builder Program · Cohort 1",
    body: "Round 2 deadlines are six weeks out. If you haven't started your essays yet, this is your sign.",
    likes: 67,
    comments: 9,
    reposts: 4,
    shares: 1,
  },
  {
    id: 34,
    type: "live",
    author: "David Kim",
    avatar: pic4,
    time: "Now",
    verified: true,
    headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
    body: "Join our live panel 👋",
    live: {
      variant: "tiktok",
      title: "MBA admissions panel — ask us anything",
      videoId: "1cfIAVasP6E",
      hosts: ["/videos/garritt.mp4", "/videos/sabrina.mp4", "/videos/corinna.mp4"],
      viewers: 3402,
      topic: "Admissions panel",
    },
    likes: 618,
    comments: 203,
    reposts: 47,
    shares: 22,
  },
  {
    id: 38,
    type: "text",
    author: "Samantha Parker",
    avatar: pic6,
    time: "1h",
    verified: true,
    headline: "AI BP Instructor · Ex-Meta PM",
    body: "Hot take from this week's cohort: the best AI demos were the simplest ones. Scope small, ship weekly.",
    likes: 143,
    comments: 19,
    reposts: 8,
    shares: 2,
  },
  {
    id: 39,
    type: "article",
    author: "Lauren Hayes",
    avatar: pic13,
    time: "2h",
    verified: true,
    headline: "HBS Admissions Expert | Former Reader",
    title: "Why your safest essay is your weakest essay",
    subtitle: "Notes from 400 applications: the essays that stuck were the ones that stopped performing.",
    body: "I read over 400 applications last cycle, and the essays that stuck with me had one thing in common: they weren't trying to impress anyone. The writers had stopped performing. Start with the moment, not the lesson. If your first sentence could open anyone else's essay, cut it.",
    bodyHtml: "I read over 400 applications last cycle, and the essays that stuck with me had one thing in common: <b>they weren't trying to impress anyone.</b> The writers had stopped performing.<div><br/></div><div>They wrote about the moment they realized their dad's small business was failing, about botching their first client meeting, about the semester everything fell apart. Not because trauma wins admissions — it doesn't — but because specificity is the only thing a reader can't skim.</div><h2>Start with the moment, not the lesson</h2><div>If your first sentence could open anyone else's essay, cut it. Write the scene you'd be embarrassed to read aloud, then earn the reflection.</div><h3>The checklist I give every client</h3><ul><li>Open inside a scene, not a summary</li><li>One decision you'd defend, one you wouldn't</li><li>Reflection in the last third, never the first</li></ul><blockquote>A safe essay reads like everyone's. A specific one can only be yours.</blockquote><div>That's the whole trick. The reader has 400 of these — give them the one they can't skim.</div>",
    readMinutes: 6,
    likes: 287,
    comments: 45,
    reposts: 38,
    shares: 21,
  },
  {
    id: 40,
    type: "poll",
    author: "David Kim",
    avatar: pic4,
    time: "3h",
    verified: true,
    headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
    body: "Settle a debate from today's session — which part of the application did you underestimate the most?",
    poll: {
      options: [
        { label: "Essays", votes: 412 },
        { label: "Recommendation letters", votes: 268 },
        { label: "The interview", votes: 187 },
        { label: "Short-answer questions", votes: 94 },
      ],
      durationLabel: "2 days left",
    },
    likes: 156,
    comments: 33,
    reposts: 12,
    shares: 5,
  },
  {
    id: 5,
    type: "image",
    author: "Emma Rodriguez",
    avatar: pic5,
    time: "10h",
    headline: "MBA Admissions Expert | Ex-Deloitte | Wharton '22",
    body: "Coaching session with an incredible candidate today. Went from a shaky \"tell me about yourself\" to a compelling 2-minute narrative. Love this work.",
    images: [postImgLinkedIn],
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
    headline: "Incoming Business Analyst at Bain & Company | Booth '25",
    body: "After 6 months of prep, 4 applications, and 2 interviews — I just got the call. Bain offered me a position in their SF office. I'm literally shaking right now. Thank you to everyone who believed in me when I didn't believe in myself.",
    likes: 892,
    comments: 97,
    reposts: 41,
    shares: 15,
  },
  {
    id: 18,
    type: "text",
    author: "Rachel Nguyen",
    avatar: pic9,
    time: "13h",
    headline: "1L at Yale Law School | Pre-Law Admissions Expert",
    feed: "Law School",
    body: "A lot of people ask me how I chose between law schools. Honestly? I stopped looking at rankings and started asking: where do the students actually seem happy?\n\nVisited three campuses. At two of them, the 2Ls and 3Ls gave very polished answers. At Yale, someone told me \"it's not perfect, but we actually like each other.\" That was enough.\n\nThe rankings will shuffle. The culture won't.",
    likes: 318,
    comments: 41,
    reposts: 29,
    shares: 7,
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
      image: linkOg2,
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
    headline: "Management Consultant | Career Expert for Non-Traditional Backgrounds",
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
    headline: "Wharton MBA '24 | Product Strategy | Ex-Google",
    body: "Throwback to our Wharton study group that turned into lifelong friends. Two years later and we still meet every month. Business school is really about the people.",
    images: [stripe1, stripe2, stripe3, stripe4, stripe5, stripe6, stripe7, stripe8],
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
    headline: "MBA Admissions Expert | Former HBS Admissions Reader",
    body: "New essay guide just dropped for HBS 2027 intake. The prompt changed subtly but the implications are huge for positioning.",
    link: {
      url: "https://example.com/hbs-essay",
      domain: "poetsandquants.com",
      title: "Breaking Down the HBS Essay Prompt for 2027 Applicants",
      image: linkOg3,
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
    headline: "Career & MBA Expert | 100+ Sessions | Ex-McKinsey",
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

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toString();
}

// Post links stay inside whichever experience you're in: under /alt-nav they
// point at /alt-nav/post/:id (keeping the sidebar shell), under /linkedin-nav at
// /linkedin-nav/post/:id, everywhere else at /post/:id. Consumed by every
// card/action that opens a post.
export function usePostBase(): string {
  const { pathname } = useLocation();
  if (pathname.startsWith("/alt-nav")) return "/alt-nav/post";
  if (pathname.startsWith("/linkedin-nav")) return "/linkedin-nav/post";
  return "/post";
}

// iOS Safari only opens the soft keyboard when focus() is called synchronously
// inside a user gesture. When tapping Comment we navigate to a new route, so by
// the time the real <textarea> mounts the gesture context is gone. Prime the
// keyboard here: create a hidden, focusable input in the same tap handler,
// focus it, then let PostDetail's autoFocus/rAF transfer focus to the real
// comment box — the keyboard stays open through the route change.
function primeKeyboard() {
  if (typeof document === "undefined") return;
  const tmp = document.createElement("input");
  tmp.type = "text";
  tmp.setAttribute("autocomplete", "off");
  tmp.setAttribute("aria-hidden", "true");
  tmp.tabIndex = -1;
  // font-size must be ≥16px or iOS will trigger a zoom.
  tmp.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;border:0;padding:0;font-size:16px;";
  document.body.appendChild(tmp);
  tmp.focus();
  setTimeout(() => tmp.remove(), 600);
}

const FEED_REPOST_PARTICLES = [
  { angle: -80,  r: 28, color: "#4F86DB", size: 6 },
  { angle: -40,  r: 32, color: "#80ACED", size: 5 },
  { angle: -10,  r: 25, color: "#A6C5F0", size: 7 },
  { angle: 20,   r: 30, color: "#4F86DB", size: 5 },
  { angle: 55,   r: 28, color: "#80ACED", size: 6 },
  { angle: 90,   r: 32, color: "#4F86DB", size: 5 },
  { angle: 130,  r: 25, color: "#A6C5F0", size: 7 },
  { angle: 160,  r: 30, color: "#80ACED", size: 5 },
  { angle: 200,  r: 28, color: "#4F86DB", size: 6 },
  { angle: 240,  r: 25, color: "#A6C5F0", size: 5 },
  { angle: 270,  r: 32, color: "#80ACED", size: 6 },
  { angle: 310,  r: 28, color: "#4F86DB", size: 5 },
];

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

export function FeedLikeButton({ initialCount }: { initialCount: number }) {
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
        className={`flex cursor-pointer items-center gap-1 rounded-[100px] px-2.5 py-1.5 transition-colors hover:bg-[#222222]/8 ${liked ? "text-red-500" : "text-gray-light"}`}
      >
        {/* Heart geometry mirrors the uploaded heart.svg / heart-filled.svg —
            inlined so the fill can animate gray→red via currentColor. */}
        <motion.svg
          className="h-[22px] w-[22px]"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={liked ? { scale: [1, 0.6, 1.8, 0.9, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeOut" }}
        >
          <path d="M15.696 4C18.871 4 21 6.98 21 9.755C21 15.388 12.161 20 12 20C11.839 20 3 15.388 3 9.755C3 6.98 5.129 4 8.304 4C10.119 4 11.311 4.905 12 5.711C12.689 4.905 13.881 4 15.696 4V4Z"/>
        </motion.svg>
        {initialCount + (liked ? 1 : 0) > 0 && (
          <motion.span
            className="text-[13px] font-medium"
            animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {formatCount(initialCount + (liked ? 1 : 0))}
          </motion.span>
        )}
      </button>
    </div>
  );
}

export function ShareDropdown({ post, onClose }: { post: Post; onClose: () => void }) {
  const postId = post.id;
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  useLockBodyScroll(isMobile);
  const postUrl = `${window.location.origin}${window.location.pathname}#/post/${postId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); onClose(); }, 1200);
    });
  };

  const mobileVariants = {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
  };
  const desktopVariants = {
    initial: { opacity: 0, scale: 0.95, y: -4 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -4 },
  };

  const content = (
    <>
      <div className={`fixed inset-0 z-[60] ${isMobile ? "bg-black/30" : ""}`} onClick={onClose} />
      <motion.div
        initial={(isMobile ? mobileVariants : desktopVariants).initial}
        animate={(isMobile ? mobileVariants : desktopVariants).animate}
        exit={(isMobile ? mobileVariants : desktopVariants).exit}
        transition={{ duration: isMobile ? 0.22 : 0.12, ease: [0.25, 0.1, 0.25, 1] }}
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => { if (isMobile && (info.offset.y > 100 || info.velocity.y > 400)) onClose(); }}
        className={
          isMobile
            ? "fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl border-t border-gray-stroke bg-white pb-[env(safe-area-inset-bottom)] shadow-lg"
            : "absolute top-full right-0 z-50 mt-1 w-[380px] max-w-[92vw] rounded-2xl border border-gray-stroke bg-white shadow-lg"
        }
      >
        {isMobile && <div className="mx-auto mt-2.5 mb-1 h-1 w-10 cursor-grab rounded-full bg-gray-300 active:cursor-grabbing" />}
        <div className={isMobile ? "px-4 pb-5 pt-1" : "px-4 py-4"}>
          {/* Post preview */}
          <div className="mb-4 flex gap-3 rounded-2xl border border-gray-stroke p-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-hover">
              {post.avatar ? <img src={post.avatar} alt={post.author} className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[14px] font-semibold text-gray-dark">{post.author}</span>
                {post.verified && <img src={verifiedIcon} alt="" className="h-[13px] w-[13px] shrink-0" />}
                <span className="shrink-0 text-[13px] text-gray-xlight">· {post.time}</span>
              </div>
              <p className="mt-0.5 line-clamp-4 text-[13px] leading-snug text-gray-light">{post.body}</p>
            </div>
          </div>

          {/* Actions. Fixed-width items + truncated labels keep the row
              evenly spaced regardless of label length. */}
          <div className="flex gap-6">
            <button onClick={copyLink} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-gray-stroke text-gray-dark">
                {copied ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                )}
              </span>
              <span className="w-full truncate text-center text-[12px] text-gray-dark">{copied ? "Copied!" : "Copy Link"}</span>
            </button>
            <button onClick={onClose} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-gray-stroke text-gray-dark">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4"/><path d="m8 8 4-4 4 4"/><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/></svg>
              </span>
              <span className="w-full truncate text-center text-[12px] text-gray-dark">Share via…</span>
            </button>
            <button onClick={onClose} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-gray-stroke text-gray-dark">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11"/><path d="m8 11 4 4 4-4"/><path d="M20 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/></svg>
              </span>
              <span className="w-full truncate text-center text-[12px] text-gray-dark">Download</span>
            </button>
          </div>

          <div className="my-3 border-t border-gray-stroke" />

          {/* Row 3 — external apps */}
          <div className="-mx-1 flex gap-6 overflow-x-auto px-1 pb-1 scrollbar-hide">
            <a href={`sms:&body=${encodeURIComponent(postUrl)}`} onClick={onClose} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#34C759] text-white"><svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.34 1.26 4.45 3.28 5.9-.14 1.13-.72 2.4-1.53 3.35 1.6-.2 3.1-.83 4.22-1.6 1.24.35 2.6.55 4.03.55 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/></svg></span>
              <span className="w-full truncate text-center text-[12px] text-gray-dark">Messages</span>
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#0A66C2] text-white"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></span>
              <span className="w-full truncate text-center text-[12px] text-gray-dark">LinkedIn</span>
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-black text-white"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></span>
              <span className="w-full truncate text-center text-[12px] text-gray-dark">Twitter</span>
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
  return isMobile ? createPortal(content, document.body) : content;
}

export function FeedRepostButton({ initialCount, initialReposted = false, onRepost, onUndoRepost, onQuote }: { initialCount: number; initialReposted?: boolean; onRepost?: () => void; onUndoRepost?: () => void; onQuote?: () => void }) {
  const [reposted, setReposted] = useState(initialReposted);
  const [burst, setBurst] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  useLockBodyScroll(open && isMobile);

  const triggerRepost = () => {
    if (!reposted) {
      setReposted(true);
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
      onRepost?.();
    }
    setOpen(false);
  };

  const undoRepost = () => {
    setReposted(false);
    onUndoRepost?.();
    setOpen(false);
  };

  const handleQuote = () => {
    setOpen(false);
    onQuote?.();
  };

  return (
    <div className="relative">
      {/* Particles */}
      <div className="pointer-events-none absolute left-[13px] top-[13px]">
        <AnimatePresence>
          {burst ? FEED_REPOST_PARTICLES.map((p, i) => (
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
        className={`flex cursor-pointer items-center gap-1 rounded-[100px] px-2.5 py-1.5 transition-colors hover:bg-[#222222]/8 ${reposted ? "text-[#4F86DB]" : "text-gray-light"}`}
      >
        <motion.svg
          className="h-[22px] w-[22px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          animate={reposted && burst ? { scale: [1, 0.6, 1.8, 0.9, 1.05, 1], rotate: [0, 360] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeOut" }}
        >
          <path d="M22.008 12L20.006 14L18.005 12" />
          <path d="M6.341 6.344C7.79 4.896 9.791 4 12.002 4C16.423 4 20.007 7.582 20.007 12.002C20.007 12.61 19.933 13.2 19.805 13.769" />
          <path d="M1.992 12L3.994 10L5.995 12" />
          <path d="M17.658 17.6555C16.209 19.1035 14.208 19.9995 11.997 19.9995C7.576 19.9995 3.992 16.4175 3.992 11.9975C3.992 11.3895 4.066 10.7995 4.194 10.2305" />
        </motion.svg>
        {initialCount + (reposted ? 1 : 0) > 0 && (
          <motion.span
            className="text-[13px] font-medium"
            animate={reposted && burst ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {formatCount(initialCount + (reposted ? 1 : 0))}
          </motion.span>
        )}
      </button>

      {(() => {
        const menuBody = (
          <AnimatePresence>
          {open ? (
          <>
            <div className={`fixed inset-0 ${isMobile ? "z-[60] bg-black/30" : "z-40"}`} onClick={() => setOpen(false)} />
            <motion.div
              initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, scale: 0.95, y: -4 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: isMobile ? 0.22 : 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              drag={isMobile ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => { if (isMobile && (info.offset.y > 100 || info.velocity.y > 400)) setOpen(false); }}
              className={
                isMobile
                  ? "fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl border-t border-gray-stroke bg-white pb-[env(safe-area-inset-bottom)] shadow-lg"
                  : "absolute bottom-full left-0 z-50 mb-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
              }
            >
              {isMobile && <div className="mx-auto mt-2.5 mb-1 h-1 w-10 cursor-grab rounded-full bg-gray-300 active:cursor-grabbing" />}
              <div className={isMobile ? "px-3 pt-1 pb-3" : "px-2 py-2"}>
                <button onClick={handleQuote} className={`flex w-full items-center gap-3 rounded-lg text-left font-medium text-gray-dark hover:bg-gray-hover ${isMobile ? "p-4 text-[15px]" : "p-3 text-[14px]"}`}>
                  <svg className={`${isMobile ? "h-6 w-6" : "h-5 w-5"} shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Repost with your thoughts
                </button>
                {reposted ? (
                  <button onClick={undoRepost} className={`flex w-full items-center gap-3 rounded-lg text-left font-medium text-gray-dark hover:bg-gray-hover ${isMobile ? "p-4 text-[15px]" : "p-3 text-[14px]"}`}>
                    <svg className={`${isMobile ? "h-6 w-6" : "h-5 w-5"} shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>
                    Undo repost
                  </button>
                ) : (
                  <button onClick={triggerRepost} className={`flex w-full items-center gap-3 rounded-lg text-left font-medium text-gray-dark hover:bg-gray-hover ${isMobile ? "p-4 text-[15px]" : "p-3 text-[14px]"}`}>
                    <svg className={`${isMobile ? "h-6 w-6" : "h-5 w-5"} shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                    Repost to feed
                  </button>
                )}
              </div>
            </motion.div>
          </>
          ) : null}
          </AnimatePresence>
        );
        return isMobile ? createPortal(menuBody, document.body) : menuBody;
      })()}
    </div>
  );
}

// Bookmark (save) button — the fifth action. Saving fires a small dark-pill
// toast (matching the app's popup pattern) and adds the post to the profile's
// "Liked & Saved" tab via the bookmarks store. Saved state shows a filled
// yellow bookmark.
export function FeedBookmarkButton({ post }: { post: Post }) {
  const { isSaved, toggleBookmark } = useBookmarks();
  const { setActive: setToastActive } = useSavedToast();
  const navigate = useNavigate();
  const saved = isSaved(post.id);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const hideToast = () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(false);
    setToastActive(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willSave = !saved;
    toggleBookmark(post);
    if (willSave) {
      setToast(true);
      setToastActive(true);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(hideToast, 5000);
    }
  };

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); setToastActive(false); }, [setToastActive]);

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={saved ? "Remove from saved" : "Save"}
        className={`flex cursor-pointer items-center gap-1 rounded-[100px] px-2.5 py-1.5 transition-colors hover:bg-[#222222]/8 ${saved ? "text-[#FFD96F]" : "text-gray-light"}`}
      >
        {/* Bookmark geometry mirrors the uploaded bookmark.svg / bookmark-filled.svg
            — inlined so the fill toggles via currentColor on save. */}
        <motion.svg
          className="h-[22px] w-[22px]"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={saved ? { scale: [1, 0.7, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <path d="M7.70001 3H16.3C17.405 3 18.3 3.895 18.3 5V21L12.008 17.727L5.70001 21V5C5.70001 3.895 6.59501 3 7.70001 3Z" />
        </motion.svg>
      </button>
      {createPortal(
        <AnimatePresence>
          {toast ? (
            <motion.div
              initial={{ y: "130%" }}
              animate={{ y: 0 }}
              exit={{ y: "130%" }}
              transition={{ type: "spring", stiffness: 480, damping: 34, mass: 0.8 }}
              onClick={() => { hideToast(); navigate("/profile-v2?tab=saved"); }}
              role="button"
              className="fixed inset-x-0 bottom-[calc(max(env(safe-area-inset-bottom),20px)+61px)] z-20 flex cursor-pointer items-center justify-between bg-[#FFD96F] px-5 py-3.5 text-[#111111] md:bottom-0"
            >
              <div className="flex items-center gap-2.5">
                <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                <span className="text-[15px] font-semibold">Saved to your profile</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); hideToast(); }}
                aria-label="Dismiss"
                className="-mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/10"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.getElementById("saved-toast-root") ?? document.body,
      )}
    </>
  );
}

function ActionBar({ post, likes, comments, reposts, postId, onRepost, onUndoRepost, onQuote }: { post: Post; likes: number; comments: number; reposts: number; shares: number; postId: number; authorName: string; onRepost?: (post: Post) => void; onUndoRepost?: (post: Post) => void; onQuote?: (post: Post) => void }) {
  const navigate = useNavigate();
  const postBase = usePostBase();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    // All five actions spread equally across the full row width.
    <div className="mt-1 flex items-center justify-between pl-[44px] pr-1">
      <FeedLikeButton initialCount={likes} />
      {/* Comment — outline chat bubble (chat-inactive.svg), stays outlined */}
      <button onClick={(e) => { primeKeyboard(); const rect = (e.currentTarget as HTMLElement).closest('[class*="pt-5"]')?.getBoundingClientRect(); navigate(`${postBase}/${postId}`, { state: { sourceY: rect?.top ?? 80, focusInput: true } }); }} className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2.5 py-1.5 text-gray-light transition-colors hover:bg-[#222222]/8">
        <svg className="h-[22px] w-[22px] fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4.541 17.003C3.577 15.571 3 13.857 3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21C10.474 21 9.04 20.613 7.78 19.943C6.434 20.661 4.907 21.084 3.276 21.084C2.842 21.084 2.419 21.045 2 20.99C3.173 19.923 4.055 18.553 4.541 17.003Z" /></svg>
        {comments > 0 && <span className="text-[13px] font-medium">{formatCount(comments)}</span>}
      </button>
      {/* Repost */}
      <FeedRepostButton
        initialCount={reposts}
        initialReposted={Boolean(post.repostedBy)}
        onRepost={() => onRepost?.(post)}
        onUndoRepost={() => onUndoRepost?.(post)}
        onQuote={() => onQuote?.(post)}
      />
      {/* Bookmark / save */}
      <FeedBookmarkButton post={post} />
      {/* Share — swapped to the uploaded share.svg (upload glyph) */}
      <div className="relative">
        <button onClick={() => setShareOpen(o => !o)} className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2.5 py-1.5 text-gray-light transition-colors hover:bg-[#222222]/8">
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 9h2c1.10457 0 2 .89543 2 2v8c0 1.10457-.89543 2-2 2h-10c-1.10457 0-2-.89543-2-2v-8c0-1.10457.89543-2 2-2h2" /><line x1="12" x2="12" y1="15" y2="3" /><polyline points="15,6 12,3 9,6" /></svg>
        </button>
        <AnimatePresence>
          {shareOpen ? <ShareDropdown post={post} onClose={() => setShareOpen(false)} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PostHeaderRow({ author, time, verified, headline, feed, isGroupPost, groupId, groupPoster, companyLogo, onEdit, nameHover }: { author: string; time: string; verified?: boolean; headline?: string; feed?: string; isGroupPost?: boolean; groupId?: string; groupPoster?: { name: string; avatar: string; headline?: string; overlay?: boolean }; companyLogo?: string; onEdit?: () => void; nameHover?: HoverProps }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Set when Follow is tapped from the menu, so the sheet dismisses only after
  // the check's pop-in animation actually completes (not on a fixed timer).
  const justFollowedRef = useRef(false);
  const isMobile = useIsMobile();
  useLockBodyScroll(menuOpen && isMobile);

  const { mode: profileBarMode } = useProfileBarMode();
  // The title/description line the older profile-bar versions surface.
  const displayHeadline = groupPoster?.headline ?? headline;
  // Mode 3 demonstrates an older post: show an absolute date instead of a
  // relative timestamp. (Absolute "Aug 12" vs. relative "3d" is the open
  // question — this shows the absolute-date treatment.)
  const displayTime = profileBarMode === 3 ? "Aug 12" : time;

  useEffect(() => {
    // Desktop only: close the dropdown on an outside click. On mobile the menu
    // is a portaled bottom sheet (outside menuRef), so this handler would fire
    // on every item tap — including Follow — and slam the sheet shut before its
    // animation plays. The mobile sheet dismisses via its own backdrop instead.
    if (!menuOpen || isMobile) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen, isMobile]);

  // Menu-row icon — 20px asset-folder svg (4px smaller than the profile dropdown).
  const menuIcon = (src: string, alt = "") => <img src={src} alt={alt} className="h-5 w-5 shrink-0" />;
  // Danger rows tint their icon to the row's red via a CSS mask (asset svgs are
  // pre-colored, so a plain <img> can't inherit the text color).
  const dangerIcon = (src: string) => (
    <span
      aria-hidden
      className="h-5 w-5 shrink-0 bg-current"
      style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
    />
  );
  const menuItems = [
    {
      label: "Follow",
      follow: true,
      icon: null,
      danger: false,
      onClick: undefined as (() => void) | undefined,
    },
    {
      label: "Not interested",
      icon: menuIcon(eyeClosedIcon),
      danger: false,
      onClick: undefined as (() => void) | undefined,
    },
    {
      label: "Report post",
      icon: menuIcon(reportFlagIcon),
      danger: false,
      onClick: undefined as (() => void) | undefined,
    },
    ...(onEdit ? [{
      label: "Edit post",
      icon: menuIcon(editIcon),
      danger: false,
      onClick: onEdit,
    }] : []),
    {
      label: "Delete post",
      icon: dangerIcon(trashIcon),
      danger: true,
      onClick: undefined as (() => void) | undefined,
    },
  ];

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        {/* Person leads: for a member's group post we surface the person, not
            the group; the group is shown as a small badge on the avatar. Pure
            group announcements (no groupPoster) still read as the group. */}
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to={groupPoster ? `/profile/${nameToSlug(groupPoster.name)}` : isGroupPost ? `/groups/${groupId ?? "ai-bp-apr-26"}` : `/profile/${nameToSlug(author)}`}
            onClick={(e) => e.stopPropagation()}
            {...(nameHover ?? {})}
            className="cursor-pointer truncate text-[15px] leading-tight font-semibold text-gray-dark hover:underline"
          >{groupPoster ? groupPoster.name : author}</Link>
          <span className="shrink-0 text-[15px] leading-tight text-gray-extra-light">{displayTime}</span>
        </div>
        {/* Title / description line — surfaced in the "Title" (2) and "Dated"
            (3) profile-bar modes; hidden in "Minimal" (1). */}
        {profileBarMode !== 1 && displayHeadline ? (
          <p className="mt-0.5 truncate text-[13px] leading-tight text-gray-light">{displayHeadline}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-start gap-1">
      <div ref={menuRef} className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
          className="cursor-pointer pl-2 text-[#424242] opacity-40 transition-opacity hover:opacity-100"
        >
          <MoreDotsIcon />
        </button>
        {(() => {
          const menuBody = (
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className={`fixed inset-0 ${isMobile ? "z-[60] bg-black/30" : "z-40"}`} onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
                  <motion.div
                    initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, scale: 0.95, y: -4 }}
                    animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: isMobile ? 0.22 : 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                    drag={isMobile ? "y" : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.6 }}
                    // Require real downward travel to dismiss — a fast tap on a
                    // menu item (e.g. Follow) releases with high velocity but ~0
                    // offset, which would otherwise slam the sheet shut before
                    // the follow animation could play.
                    onDragEnd={(_, info) => { if (isMobile && (info.offset.y > 80 || (info.velocity.y > 500 && info.offset.y > 24))) setMenuOpen(false); }}
                    className={
                      isMobile
                        ? "fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl border-t border-gray-stroke bg-white pb-[env(safe-area-inset-bottom)] shadow-lg"
                        : "absolute right-0 top-7 z-50 w-56 rounded-2xl border border-gray-stroke bg-white shadow-lg"
                    }
                  >
                    {isMobile && <div className="mx-auto mt-2.5 mb-1 h-1 w-10 cursor-grab rounded-full bg-gray-300 active:cursor-grabbing" />}
                    <div className={isMobile ? "px-3 pt-1 pb-3" : "px-2 py-2"}>
                      {menuItems.map((item) => {
                        const { label, icon, danger, onClick } = item;
                        const itemClass = `flex w-full items-center gap-[10px] rounded-lg text-left font-medium transition-colors hover:bg-[#222222]/5 ${isMobile ? "p-4 text-[15px]" : "p-3 text-[14px]"}`;
                        if ((item as { follow?: boolean }).follow) {
                          // Tapping Follow flips the icon to a check + the label
                          // to "Following". The sheet stays put and dismisses
                          // only once the check's pop-in has FULLY settled
                          // (onAnimationComplete + a short linger) — never on a
                          // fixed timer that can fire mid-spring. Unfollowing
                          // just toggles back in place.
                          const onFollowTap = (e: React.MouseEvent) => {
                            e.stopPropagation();
                            if (following) { setFollowing(false); return; }
                            justFollowedRef.current = true;
                            setFollowing(true);
                          };
                          const iconSpring = { type: "spring" as const, stiffness: 620, damping: 26 };
                          return (
                            <motion.button
                              key="follow"
                              whileTap={{ scale: 0.96 }}
                              onClick={onFollowTap}
                              className={`${itemClass} text-gray-dark`}
                            >
                              <span className="relative h-5 w-5 shrink-0">
                                <AnimatePresence initial={false} mode="popLayout">
                                  {following ? (
                                    <motion.img
                                      key="check"
                                      src={checkIcon}
                                      alt=""
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={iconSpring}
                                      onAnimationComplete={() => {
                                        if (justFollowedRef.current) {
                                          justFollowedRef.current = false;
                                          window.setTimeout(() => setMenuOpen(false), 450);
                                        }
                                      }}
                                      className="absolute inset-0 h-full w-full"
                                    />
                                  ) : (
                                    <motion.img
                                      key="plus"
                                      src={addPlusIcon}
                                      alt=""
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={iconSpring}
                                      className="absolute inset-0 h-full w-full"
                                    />
                                  )}
                                </AnimatePresence>
                              </span>
                              <span className="relative inline-flex" style={{ perspective: 500 }}>
                                <AnimatePresence mode="wait" initial={false}>
                                  <motion.span
                                    key={following ? "following" : "follow"}
                                    initial={{ rotateX: -90, opacity: 0 }}
                                    animate={{ rotateX: 0, opacity: 1 }}
                                    exit={{ rotateX: 90, opacity: 0 }}
                                    transition={{ duration: 0.16, ease: "easeOut" }}
                                    className="inline-block"
                                    style={{ transformOrigin: "center", backfaceVisibility: "hidden" }}
                                  >
                                    {following ? "Following" : "Follow"}
                                  </motion.span>
                                </AnimatePresence>
                              </span>
                            </motion.button>
                          );
                        }
                        return (
                          <button
                            key={label}
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onClick?.(); }}
                            className={`${itemClass} ${danger ? "text-[#D92D20]" : "text-gray-dark"}`}
                          >
                            {icon}
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          );
          return isMobile ? createPortal(menuBody, document.body) : menuBody;
        })()}
      </div>
      </div>
    </div>
  );
}

// ─── PostImageGrid ───────────────────────────────────────────────────────────
// Shared grid used by both the compose preview and the feed post.
// Layout mirrors Twitter/X: fixed slot aspect-ratios per image count so the
// grid always looks good regardless of each image's original orientation.
//   1 image  → full width, aspect ratio clamped to 2:1 – 3:4
//   2 images → side-by-side, each slot 7:8
//   3 images → large left (row-span-2) + 2 stacked right; overall container 4:3
//   4 images → 2×2 grid; overall container 1:1 (each slot ~square)
function PostImageGrid({
  images,
  renderOverlay,
  className = "",
  maxHeight,
  onImageClick,
  avatarInset = false,
}: {
  images: { src: string; aspectRatio?: number }[];
  renderOverlay?: (idx: number) => React.ReactNode;
  className?: string;
  maxHeight?: number;
  onImageClick?: (idx: number) => void;
  // Feed layout only: the post body is indented past a 40px avatar + 12px gap
  // inside the px-4/sm:px-6 gutter, so the 4+ carousel bleeds left by that full
  // offset (68px / 76px) and pads back so it starts aligned with the text.
  avatarInset?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "right" ? 175 : -175, behavior: "smooth" });

  // Track scroll position so each chevron only shows when there's room to scroll
  // that way (hidden at the respective end). Only the 4+ carousel uses these.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };
  useEffect(() => { updateArrows(); }, [images.length]);

  const count = images.length;
  if (count === 0) return null;

  const cell = (src: string, idx: number, extraClass = "") => (
    <div
      key={idx}
      className={`relative overflow-hidden bg-black group ${extraClass}${onImageClick ? " cursor-zoom-in" : ""}`}
      onClick={onImageClick ? () => onImageClick(idx) : undefined}
    >
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
      {renderOverlay?.(idx)}
    </div>
  );

  if (count === 1) {
    const r = images[0].aspectRatio ?? 1;
    const clamped = Math.min(Math.max(r, 0.5), 2); // 1:2 portrait → 2:1 landscape
    const singleStyle: React.CSSProperties = { aspectRatio: String(clamped) };
    if (maxHeight) { singleStyle.maxHeight = maxHeight; singleStyle.maxWidth = maxHeight * clamped; }
    return (
      <div
        className={`relative overflow-hidden rounded-xl bg-white group ${className}${onImageClick ? " cursor-zoom-in" : ""}`}
        style={singleStyle}
        onClick={onImageClick ? () => onImageClick(0) : undefined}
      >
        <img src={images[0].src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
        {renderOverlay?.(0)}
      </div>
    );
  }

  if (count === 2) {
    // Side-by-side; container aspect 7:4 makes each half-width slot 7:8 (portrait-ish)
    // grid-rows-1 ensures the single row stretches to fill the container height
    return (
      <div className={`grid grid-cols-2 grid-rows-1 gap-0.5 overflow-hidden rounded-xl ${className}`} style={{ aspectRatio: "7/4" }}>
        {images.map((img, i) => cell(img.src, i))}
      </div>
    );
  }

  if (count === 3) {
    // Left spans both rows; overall 4:3 container keeps the grid compact
    return (
      <div className={`grid grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-xl ${className}`} style={{ aspectRatio: "4/3" }}>
        {cell(images[0].src, 0, "row-span-2")}
        {cell(images[1].src, 1)}
        {cell(images[2].src, 2)}
      </div>
    );
  }

  // 4 images: horizontal scroll strip with arrow buttons. Negative margins
  // cancel the post's gutters (and, in the feed, the avatar indent) so the strip
  // scrolls edge-to-edge across the whole post; the matching scroll padding keeps
  // the first image aligned with the text at rest.
  return (
    <div className={`relative -mr-4 sm:-mr-6 ${avatarInset ? "-ml-[68px] sm:-ml-[76px]" : ""} ${className}`}>
      <div ref={scrollRef} onScroll={updateArrows} className={`flex gap-2 overflow-x-auto scrollbar-hide pr-4 sm:pr-6 ${avatarInset ? "pl-[68px] sm:pl-[76px]" : ""}`}>
        {images.map((img, i) => (
          <div
            key={i}
            className={`relative shrink-0 overflow-hidden rounded-xl bg-black group${onImageClick ? " cursor-zoom-in" : ""}`}
            style={{ height: 220, width: 165 }}
            onClick={onImageClick ? () => onImageClick(i) : undefined}
          >
            <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
            {renderOverlay?.(i)}
          </div>
        ))}
      </div>
      {!atStart ? (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 z-0 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-gray-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-white/85"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      ) : null}
      {!atEnd ? (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 z-0 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-gray-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-white/85"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      ) : null}
    </div>
  );
}

function ImageGallery({ images, imageAspectRatios, onImageClick }: { images: string[]; imageAspectRatios?: number[]; onImageClick?: (idx: number) => void }) {
  return (
    <PostImageGrid
      className="mt-3"
      avatarInset
      images={images.map((src, i) => ({ src, aspectRatio: imageAspectRatios?.[i] }))}
      onImageClick={onImageClick}
    />
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
      <div className="px-4 py-3.5">
        {/* Domain with a favicon (derived from the domain); hides if it fails. */}
        <div className="flex items-center gap-1.5">
          <img
            src={`https://www.google.com/s2/favicons?domain=${link.domain}&sz=64`}
            alt=""
            className="h-4 w-4 shrink-0 rounded-sm"
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          <p className="text-[13px] text-gray-light">{link.domain}</p>
        </div>
        <p className="mt-1 text-[15px] font-medium text-gray-dark leading-snug">{link.title}</p>
      </div>
    </a>
  );
}

function EventCard({ event }: { event: EventPost["event"] }) {
  const [rsvped, setRsvped] = useState(false);
  const registered = event.registered !== undefined ? event.registered + (rsvped ? 1 : 0) : undefined;
  const totalSpots =
    event.registered !== undefined && event.spotsLeft !== undefined
      ? event.registered + event.spotsLeft
      : undefined;
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <img src={event.image} alt={event.title} className="aspect-[1200/628] w-full object-cover" />
      <div className="px-4 pb-4 pt-3.5">
        <p className="text-[15px] font-medium leading-snug text-gray-dark">{event.title}</p>
        {/* Date + time on one line; the year is noise in a feed */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-gray-light">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="truncate">
            {event.date
              .replace(/, \d{4}$/, "")
              .replace(/^(\w{3})\w+day/, "$1")
              .replace(/(January|February|March|April|June|July|August|September|October|November|December)/, m => m.slice(0, 3))}
            {" · "}
            {event.time}
          </span>
        </div>
        {registered !== undefined ? (
          <div className="mt-3 flex items-center gap-3.5">
            <div className="min-w-0 flex-1">
              {totalSpots !== undefined ? (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-dark transition-[width] duration-300"
                    style={{ width: `${Math.min(100, Math.round((registered / totalSpots) * 100))}%` }}
                  />
                </div>
              ) : null}
              <p className="mt-1.5 text-[12px] text-gray-light">
                {totalSpots !== undefined
                  ? <><span className="font-medium text-gray-dark">{registered.toLocaleString()}</span> of {totalSpots.toLocaleString()} spots filled</>
                  : <>{registered.toLocaleString()} registered</>}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setRsvped(v => !v)}
              className={`shrink-0 cursor-pointer rounded-lg px-4 py-2.5 text-[12px] font-medium transition-colors ${
                rsvped
                  ? "bg-[#E7F4EC] text-[#0A7C4A] hover:bg-[#DCEEE3]"
                  : "bg-gray-100 text-gray-dark hover:bg-gray-200"
              }`}
            >
              {rsvped ? "✓ You're going" : "RSVP for free"}
            </motion.button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, postId, authorName }: { milestone: MilestonePost["milestone"]; postId: number; authorName: string }) {
  const navigate = useNavigate();
  const postBase = usePostBase();
  return (
    <div className="mt-3 rounded-xl border border-gray-stroke p-4">
      <div className="flex items-center gap-4">
        {/* Overlapping avatars */}
        <div className="flex shrink-0 items-center">
          {milestone.schoolLogo ? (
            <img
              src={milestone.schoolLogo}
              alt={milestone.school}
              className="relative z-0 h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div
              className="relative z-0 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full text-[22px] font-bold text-white ring-2 ring-white"
              style={{ backgroundColor: milestone.schoolColor }}
            >
              {milestone.schoolInitial}
            </div>
          )}
          <img
            src={milestone.clientAvatar}
            alt={milestone.clientName}
            className="relative z-10 -ml-5 h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-2 ring-white"
          />
        </div>
        {/* Text — vertically centered beside the avatars */}
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-light">
            {milestone.kind === "offer" ? "Offer signed" : "Admitted"}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[16px] font-semibold leading-snug text-gray-dark">{milestone.school}</p>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-gray-light">{milestone.program}</p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          primeKeyboard();
          navigate(`${postBase}/${postId}`, { state: { focusInput: true, prefillComment: `@${authorName} Congratulations! 🎉` } });
        }}
        className="mt-4 w-full cursor-pointer rounded-lg bg-gray-100 py-2.5 text-[13px] font-medium text-gray-dark transition-colors hover:bg-gray-200"
      >
        Say congratulations
      </button>
    </div>
  );
}

function SessionCompletedCard({ session }: { session: SessionPost["session"] }) {
  const navigate = useNavigate();
  const coachFirstName = session.coachName.split(" ")[0];
  return (
    <div className="mt-3 rounded-xl border border-gray-stroke p-4">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={session.coachAvatar}
            alt={session.coachName}
            className="h-16 w-16 rounded-full object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
            <svg className="h-3.5 w-3.5 text-[#0A7C4A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-light">Session completed</p>
          <p className="mt-0.5 line-clamp-2 text-[16px] font-semibold leading-snug text-gray-dark">{session.topic}</p>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-gray-light">
            {session.duration} with {session.coachName}
            {session.sessionsTogether !== undefined ? <> · Session #{session.sessionsTogether}</> : null}
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${nameToSlug(session.coachName)}`);
        }}
        className="mt-4 w-full cursor-pointer rounded-lg bg-gray-100 py-2.5 text-[13px] font-medium text-gray-dark transition-colors hover:bg-gray-200"
      >
        Book with {coachFirstName}
      </button>
    </div>
  );
}

// Substack-style article preview: title + snippet in the feed, full read on
// the post page.
function ArticleCard({ post }: { post: ArticlePost }) {
  const navigate = useNavigate();
  const postBase = usePostBase();
  const heroSrc = post.bodyHtml?.match(/<img[^>]+src="([^"]+)"/)?.[1];
  return (
    <div
      onClick={() => navigate(`${postBase}/${post.id}`)}
      className="mt-3 cursor-pointer overflow-hidden rounded-xl border border-gray-stroke transition-colors hover:bg-gray-50"
    >
      {heroSrc ? <img src={heroSrc} alt="" className="h-40 w-full object-cover" /> : null}
      <div className="p-4">
      <p className="font-serif text-[22px] leading-snug text-gray-dark">{post.title}</p>
      <p className="mt-1.5 line-clamp-3 text-[13px] leading-[1.5] text-gray-light">{post.subtitle || post.body}</p>
      <p className="mt-2.5 text-[12px] text-gray-light">
        <span className="font-medium text-gray-dark">Read article</span> · {post.readMinutes} min read
      </p>
      </div>
    </div>
  );
}

// Twitter-style poll: tappable options that flip into result bars once voted.
export function PollCard({ poll }: { poll: PollPost["poll"] }) {
  const [choice, setChoice] = useState<number | null>(null);
  const total = poll.options.reduce((sum, o) => sum + o.votes, 0) + (choice !== null ? 1 : 0);
  return (
    <div className="mt-3 space-y-2">
      {poll.options.map((option, i) => {
        const votes = option.votes + (choice === i ? 1 : 0);
        const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
        // Both states are h-9 rows so voting never shifts the page.
        return choice === null ? (
          <button
            key={i}
            onClick={() => setChoice(i)}
            className="flex h-9 w-full cursor-pointer items-center rounded-lg border border-gray-stroke px-3 text-left text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
          >
            {option.label}
          </button>
        ) : (
          <div key={i} className="relative h-9 overflow-hidden rounded-lg bg-gray-50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className={`absolute inset-y-0 left-0 rounded-lg ${choice === i ? "bg-[#E7F4EC]" : "bg-gray-100"}`}
            />
            <div className="relative flex h-full items-center justify-between px-3">
              <span className={`flex items-center gap-1.5 text-[14px] text-gray-dark ${choice === i ? "font-semibold" : "font-medium"}`}>
                {option.label}
                {choice === i ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.15 }}
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </motion.svg>
                ) : null}
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="text-[13px] font-medium tabular-nums text-gray-light"
              >
                {pct}%
              </motion.span>
            </div>
          </div>
        );
      })}
      <p className="pt-0.5 text-[12px] text-gray-light">{total.toLocaleString()} {total === 1 ? "vote" : "votes"} · {poll.durationLabel}</p>
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
                <p className="text-[15px] font-semibold text-white">{author}</p>
                <p className="text-[11px] text-white/70">{live.viewers.toLocaleString()} watching now</p>
              </div>
            </div>
            <h2 className="mt-4 text-[20px] font-bold text-white">Join Office Hours</h2>
            <p className="mt-1 text-[12px] leading-snug text-white/70">
              {author} is holding a live session open to anyone. Ask your questions directly and get real-time answers.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="rounded-xl border border-gray-stroke bg-gray-50 px-4 py-3">
              <p className="text-[11px] text-gray-light">Session</p>
              <p className="mt-0.5 text-[13px] font-semibold text-gray-dark">{live.title}</p>
              <p className="text-[11px] text-gray-light">{live.topic}</p>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
              <div>
                <p className="text-[11px] text-gray-light">Access fee</p>
                <p className="text-[13px] font-semibold text-gray-dark">One-time ticket</p>
              </div>
              <p className="text-[22px] font-bold text-gray-dark">$5</p>
            </div>

            <ul className="mt-4 flex flex-col gap-2">
              {["Live Q&A with the expert", "Ask questions in real time", "Access ends when session ends"].map(item => (
                <li key={item} className="flex items-center gap-2 text-[12px] text-gray-dark">
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
              className="w-full cursor-pointer rounded-xl bg-primary py-3 text-[14px] font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Buy ticket · $5
            </button>
            <button onClick={onClose} className="w-full cursor-pointer py-2 text-[12px] text-gray-light transition-colors hover:text-gray-dark">
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
              <h2 className="text-[22px] font-bold text-gray-dark">Checkout</h2>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-dark hover:bg-gray-200">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Service row */}
            <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-stroke px-4 py-3">
              <div>
                <p className="text-[13px] font-semibold text-gray-dark">Office Hours · Consulting Q&A</p>
                <p className="text-[11px] text-gray-light">One time purchase</p>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-bold text-gray-dark">$5.00</p>
                <button className="text-[11px] text-primary hover:underline">See payment plans</button>
              </div>
            </div>

            {/* Payment structure */}
            <p className="mt-6 text-[13px] font-semibold text-gray-dark">Payment Structure</p>
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
                    <p className="text-[13px] font-medium text-gray-dark">{opt.label}</p>
                    <p className="text-[11px] text-gray-light">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Payment information */}
            <p className="mt-6 text-[13px] font-semibold text-gray-dark">Payment Information</p>
            <div className="mt-3 rounded-xl border border-gray-stroke p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-medium text-gray-light">Card number</label>
                  <input className="mt-1 w-full rounded-lg border border-gray-stroke px-3 py-2 text-[13px] text-gray-dark outline-none focus:border-primary" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-medium text-gray-light">Expiry</label>
                    <input className="mt-1 w-full rounded-lg border border-gray-stroke px-3 py-2 text-[13px] text-gray-dark outline-none focus:border-primary" placeholder="MM / YY" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-medium text-gray-light">CVC</label>
                    <input className="mt-1 w-full rounded-lg border border-gray-stroke px-3 py-2 text-[13px] text-gray-dark outline-none focus:border-primary" placeholder="123" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <span className="flex items-center gap-1.5 rounded-md border border-gray-stroke px-2 py-1 text-[10px] text-gray-light">
                  Powered by <span className="font-bold text-gray-dark">stripe</span>
                </span>
              </div>
            </div>

            {/* Terms */}
            <p className="mt-6 text-[13px] font-semibold text-gray-dark">Terms</p>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                "The Leland Experience Guarantee protects you with every booking.",
                "Refund policy: Refunds are available within 14 days of purchase.",
                "Expiration terms: access is valid for the duration of this session.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-gray-light">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
                  {t} <button className="ml-1 text-primary hover:underline">Learn more.</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — summary */}
          <div className="flex w-[260px] shrink-0 flex-col border-l border-gray-stroke bg-gray-50 px-6 py-8">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-light">Subtotal</span>
              <span className="font-medium text-gray-dark">$5.00</span>
            </div>
            <div className="mt-4 border-t border-gray-stroke pt-4 flex items-center justify-between text-[13px]">
              <span className="text-gray-light">Discount</span>
              {discountOpen ? (
                <input
                  autoFocus
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  className="w-24 rounded-lg border border-gray-stroke px-2 py-1 text-[11px] outline-none focus:border-primary"
                  placeholder="Code"
                />
              ) : (
                <button onClick={() => setDiscountOpen(true)} className="font-semibold text-primary hover:underline">Use code</button>
              )}
            </div>
            <div className="mt-4 border-t border-gray-stroke pt-4 flex items-center justify-between text-[15px]">
              <span className="font-semibold text-gray-dark">Total</span>
              <span className="font-bold text-gray-dark">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full cursor-pointer rounded-xl bg-primary py-3 text-[13px] font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Confirm payment
            </button>
            <p className="mt-3 text-center text-[10px] text-gray-light">Secured by Stripe</p>
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
          <span className="text-[11px] font-semibold tracking-wide text-gray-dark">LIVE</span>
        </div>

        {/* Viewer count — top right, no border */}
        <div className="absolute right-3 top-3 flex items-center gap-1 text-white/90">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <span className="text-[10px] font-medium drop-shadow">{live.viewers.toLocaleString()} watching</span>
        </div>

      </div>

      {/* Info row */}
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <p className="text-[15px] font-medium leading-snug text-gray-dark">{live.title}</p>
          <p className="mt-1 text-[12px] text-gray-light">{live.topic}</p>
        </div>
        <button
          onClick={() => setModal("info")}
          className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2.5 text-[12px] font-medium text-gray-dark transition-colors hover:bg-gray-200"
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

// Compact Twitter/X-style live treatment (Admin Tools → Live card → Min):
// no embedded player or chat overlay — a slim broadcast row with a static
// thumbnail, red LIVE chip, and viewer count. The whole row is the CTA.
function LiveCardCompact({ live, author, avatar }: { live: LivePost["live"]; author: string; avatar: string }) {
  const [modal, setModal] = useState<null | "info" | "checkout">(null);

  return (
    <>
      <button
        onClick={() => setModal("info")}
        className="mt-3 flex w-full cursor-pointer items-stretch overflow-hidden rounded-xl border border-gray-stroke text-left transition-colors hover:bg-gray-hover"
      >
        {/* Thumbnail */}
        <div className="relative h-[96px] w-[128px] shrink-0 overflow-hidden bg-black">
          <img
            src={`https://img.youtube.com/vi/${live.videoId}/hqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-[4px] bg-[#D6204C] px-1.5 py-[2px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-[10px] font-semibold tracking-wide text-white">LIVE</span>
          </div>
        </div>
        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3.5 py-2.5">
          <p className="line-clamp-2 text-[15px] font-medium leading-snug text-gray-dark">{live.title}</p>
          <p className="truncate text-[13px] text-gray-light">
            {author} · {live.viewers.toLocaleString()} watching
          </p>
          <p className="text-[13px] font-medium text-[#D6204C]">Join live</p>
        </div>
      </button>

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
    </>
  );
}

// ─── Live-stream platform parodies ────────────────────
// Six explorations of the same live post, each a 1:1-style parody of how a
// major platform surfaces a live stream in its feed. Placement decisions:
// coach cam is the main surface everywhere except LinkedIn (presentation-first,
// coach in PiP) and Substack (speaker grid: coach top, guest + slides below).

const liveEmbedUrl = (videoId: string) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`;

// A feed full of simultaneously-decoding videos is what makes scrolling
// jitter — only the ones near the viewport should be playing.
function useAutoPauseOffscreen(ref: RefObject<HTMLVideoElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

// True once the element has come within a screen of the viewport; stays true
// so heavyweight embeds mount once and never flicker back out.
function useMountWhenNear(ref: RefObject<Element | null>, enabled: boolean): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!enabled || near) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "500px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enabled, near]);
  return near;
}

function LazyVideo({ src, className, style }: { src: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoPauseOffscreen(ref);
  return <video ref={ref} src={src} muted loop playsInline preload="metadata" className={className} style={style} />;
}

// 16:9 YouTube embed cropped to fill any container (vertical crops zoom in,
// which reads like a phone-native cam feed).
function CoverVideo({ videoId, src, scrim = false, cropTop = false, objPos }: { videoId: string; src?: string; scrim?: boolean; cropTop?: boolean; objPos?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedNear = useMountWhenNear(containerRef, !src);
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black">
      {/* Local mp4s object-cover cleanly and autoplay reliably; the YouTube
          embed is the fallback when a post has no local footage. `cropTop`
          bottom-anchors an oversized video box so the top of the source
          (ceiling/headroom) is cropped away and the subject rides higher. */}
      {src ? (
        <LazyVideo
          src={src}
          className={cropTop ? "absolute bottom-0 left-0 w-full object-cover" : "absolute inset-0 h-full w-full object-cover"}
          style={{ ...(cropTop ? { height: "135%" } : null), ...(objPos ? { objectPosition: objPos } : null) }}
        />
      ) : embedNear ? (
        <iframe
          src={liveEmbedUrl(videoId)}
          allow="autoplay; encrypted-media"
          className="absolute left-1/2 top-0 h-full w-[320%] -translate-x-1/2"
          style={{ border: "none", pointerEvents: "none" }}
        />
      ) : null}
      {/* TikTok/IG-style scrims keep the header and comment bar legible over
          whatever the video is doing (including YouTube's paused chrome). */}
      {scrim ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
        </>
      ) : null}
    </div>
  );
}

// Stand-in for the shared presentation / screen-share surface.
function FakeSlide() {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-[#101418] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Case math · the 80/20</p>
      <div className="flex items-end gap-1.5">
        {[34, 20, 44, 28, 56].map((h, i) => (
          <div key={i} className="w-4 rounded-sm bg-[#4F86DB]" style={{ height: h }} />
        ))}
      </div>
      <p className="text-[9px] text-white/40">Slide 12 / 34</p>
    </div>
  );
}

function useRotatingComments(keep: number): { id: number; user: string; text: string }[] {
  const [visible, setVisible] = useState<{ id: number; user: string; text: string }[]>([]);
  const counter = useRef(0);
  const index = useRef(0);

  useEffect(() => {
    const push = () => {
      const c = LIVE_COMMENTS[index.current++ % LIVE_COMMENTS.length];
      setVisible(prev => [...prev, { id: counter.current++, user: c.user, text: c.text }].slice(-keep));
    };
    push();
    const interval = setInterval(push, 2800);
    return () => clearInterval(interval);
  }, [keep]);

  return visible;
}

// Thumbnail of the shared deck — small enough to sit on the cam feed, just
// legible enough to read as "they're presenting something".
function MiniShareSlide({ title }: { title: string }) {
  return (
    <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-[#141824] to-[#0D1016] p-2">
      <div className="absolute -left-4 top-0 h-5 w-24 rotate-[-14deg] rounded-full bg-[#3B62B8]/35 blur-lg" />
      <p className="relative text-[7px] font-semibold uppercase tracking-[0.14em] text-[#F5C64F]">Live workshop</p>
      <p className="relative mt-0.5 line-clamp-2 font-serif text-[10px] leading-[1.15] text-white">{title}</p>
      <div className="absolute inset-x-2 bottom-1.5 flex items-center gap-1">
        <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-[35%] rounded-full bg-white/60" />
        </div>
        <span className="text-[6px] font-medium tabular-nums text-white/50">12/34</span>
      </div>
    </div>
  );
}

// X/Twitter broadcast card: clean 16:9 media, red LIVE chip + bold white title
// on a bottom gradient, viewer chip top-right. No chat — X keeps the card quiet.
function LiveCardTwitter({ live }: { live: LivePost["live"] }) {
  return (
    <div className="relative mt-3 aspect-video overflow-hidden rounded-2xl border border-gray-stroke bg-black">
      <CoverVideo src={live.videoSrc} videoId={live.videoId} />
      <div className="absolute right-3 top-3 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
        <span className="text-[11px] font-medium text-white">{live.viewers.toLocaleString()} viewers</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-10">
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded bg-[#D6204C] px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white">LIVE</span>
          <p className="truncate text-[14px] font-bold text-white">{live.title}</p>
        </div>
      </div>
    </div>
  );
}

// The pick: a super-simple vertical live video. No in-card identity (the post
// header above carries it), no close/follow/comment chrome — just the cam(s),
// live attendee count, a small screen-share thumbnail, and quiet bare chat.
function LiveCardTikTok({ live }: { live: LivePost["live"] }) {
  const comments = useRotatingComments(3);
  const isPanel = live.hosts !== undefined && live.hosts.length > 1;

  // Shared chat block. On panels it renders inside the host frame so it sits
  // over the host's lower third regardless of the row proportions; on
  // single-host cards it renders at the card's bottom.
  const chatRows = (
    <div className="pointer-events-none absolute bottom-3 left-3 flex w-[80%] flex-col gap-1">
      {comments.map(c => (
        <motion.p
          key={c.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.65, y: 0 }}
          className="text-[11px] leading-snug text-white drop-shadow"
        >
          <span className="font-semibold">{c.user}</span> {c.text}
        </motion.p>
      ))}
    </div>
  );

  return (
    <div className={`relative mt-3 overflow-hidden rounded-xl bg-black ${isPanel ? "aspect-[9/14]" : live.cropAspect === "9:16" ? "aspect-[9/16]" : "aspect-[9/13]"}`}>
      {isPanel && live.hosts ? (
        <>
          {/* Panel: host on top, each guest in their own frame below —
              nobody's face is cropped to a sliver. evenSplit balances the
              rows instead of letting the host dominate. */}
          <div className="absolute inset-0 flex flex-col gap-0.5 bg-black">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <LazyVideo src={live.hosts[0]} className="absolute inset-0 h-full w-full object-cover" />
              {/* Legibility for the chat that sits over the host's lower third */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
              {chatRows}
            </div>
            <div
              className={`grid gap-0.5 ${live.evenSplit ? "min-h-0 flex-1" : "h-36 shrink-0"}`}
              style={{ gridTemplateColumns: `repeat(${live.hosts.length - 1}, minmax(0, 1fr))` }}
            >
              {live.hosts.slice(1).map((src, i) => (
                <div key={i} className="relative overflow-hidden">
                  <LazyVideo src={src} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
        </>
      ) : (
        <>
          <CoverVideo src={live.videoSrc} videoId={live.videoId} scrim objPos={live.cropX !== undefined ? `${live.cropX}% ${live.cropY ?? 50}%` : undefined} />
          {chatRows}
        </>
      )}
      {/* Top-left chip: pulsing dot + attendees while live; play + duration
          once it's a posted replay. */}
      {live.replay ? (
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>
          <span className="text-[11px] font-medium text-white">{live.duration ?? "Replay"}</span>
        </div>
      ) : (
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D6204C] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D6204C]" />
          </span>
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
          <span className="text-[11px] font-medium text-white">{live.viewers.toLocaleString()}</span>
        </div>
      )}
      {/* What they're sharing — small screen top-right */}
      {!live.hideDeck ? (
        <div className="absolute right-2.5 top-2.5 w-[124px] overflow-hidden rounded-lg shadow-lg ring-1 ring-white/25">
          <MiniShareSlide title={live.title} />
        </div>
      ) : null}
    </div>
  );
}

// LinkedIn Live: presentation-first (slides are the stream), coach cam in a
// PiP window, attendee meta + reaction cluster + outline CTA below.
function LiveCardLinkedIn({ live, avatar }: { live: LivePost["live"]; avatar: string }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <div className="relative aspect-video">
        <FakeSlide />
        {/* bottom-left keeps the badge clear of the slide's own title */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-[3px] bg-[#D6204C] px-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="text-[10px] font-bold tracking-wide text-white">LIVE</span>
        </div>
        {/* Coach cam PiP */}
        <img src={avatar} alt="" className="absolute bottom-2 right-2 h-16 w-24 rounded-md object-cover ring-2 ring-white/80" />
      </div>
      <div className="px-3.5 py-3">
        <p className="text-[14px] font-semibold leading-snug text-gray-dark">{live.title}</p>
        <p className="mt-0.5 text-[12px] text-gray-light">{live.viewers.toLocaleString()} attendees · Started 18 min ago</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              {["👍", "❤️", "👏"].map((e, i) => (
                <span key={i} className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[10px] ring-1 ring-gray-stroke" style={{ zIndex: 3 - i }}>{e}</span>
              ))}
            </div>
            <span className="text-[12px] text-gray-light">Dwight K. and 87 others</span>
          </div>
          <button className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-[12px] font-medium text-gray-dark transition-colors hover:bg-gray-200">
            View event
          </button>
        </div>
      </div>
    </div>
  );
}

// Reddit live AMA: flair chip + title up top, media, then a live-chat preview
// (u/handles) and the vote / comments / join-chat pill row.
function LiveCardReddit({ live }: { live: LivePost["live"] }) {
  const comments = useRotatingComments(2);
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <div className="px-3.5 pt-3">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="font-bold text-gray-dark">MBA Admissions</span>
          <span className="text-gray-light">· Live AMA</span>
          <span className="rounded-full bg-[#D6204C] px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wide text-white">Live</span>
        </div>
        <p className="mt-1 text-[15px] font-semibold leading-snug text-gray-dark">{live.title}</p>
      </div>
      <div className="relative mt-2.5 aspect-video bg-black">
        <CoverVideo src={live.videoSrc} videoId={live.videoId} />
      </div>
      {/* Live chat preview — no exit animation (hidden-tab exits pile up) */}
      <div className="space-y-1 bg-gray-50 px-3.5 py-2">
        {comments.map(c => (
          <motion.p key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate text-[12px] text-gray-dark">
            <span className="font-semibold">{c.user}</span> {c.text}
          </motion.p>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
          <svg className="h-3.5 w-3.5 text-gray-dark" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l8 8h-5v8H9v-8H4z"/></svg>
          <span className="text-[12px] font-semibold text-gray-dark">1.2k</span>
          <svg className="h-3.5 w-3.5 text-gray-light" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20l-8-8h5V4h6v8h5z"/></svg>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
          <span className="text-[12px]">💬</span>
          <span className="text-[12px] font-semibold text-gray-dark">342</span>
        </div>
        <button className="ml-auto cursor-pointer rounded-full bg-gray-dark px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#333]">
          Join live chat
        </button>
      </div>
    </div>
  );
}

// Substack live: speaker grid — host cam on top, guest + shared slides below —
// with the Subscribe pill, viewer eye, joined-toast, and inline "Hi" composer.
function LiveCardSubstack({ live, author, avatar }: { live: LivePost["live"]; author: string; avatar: string }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-2.5 pb-1.5 pt-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <img src={avatar} alt={author} className="h-7 w-7 rounded-full object-cover ring-1 ring-white/30" />
          <div className="min-w-0">
            <p className="max-w-[80px] truncate text-[11px] font-semibold leading-tight text-white">{author}</p>
            <p className="truncate text-[9px] leading-tight text-white/60">Admissions, weekly</p>
          </div>
          <button className="ml-1 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-bold text-gray-dark">Subscribe</button>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-md bg-[#D6204C] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">LIVE</span>
          <div className="flex items-center gap-1 rounded-md bg-white/15 px-1.5 py-0.5">
            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>
            <span className="text-[10px] font-semibold text-white">{live.viewers}</span>
          </div>
          <span className="text-[14px] leading-none text-white/80">✕</span>
        </div>
      </div>
      {/* Speaker grid: host on top, guest + slides below */}
      <div className="flex flex-col gap-px">
        <div className="relative aspect-[16/9]">
          <CoverVideo src={live.videoSrc} videoId={live.videoId} />
        </div>
        <div className="grid grid-cols-2 gap-px">
          <img src={pic9} alt="Guest speaker" className="aspect-[8/7] w-full object-cover" />
          <div className="aspect-[8/7]"><FakeSlide /></div>
        </div>
      </div>
      {/* Joined toast + composer */}
      <div className="px-2.5 pb-2.5 pt-1.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {[pic2, pic11].map((p, i) => (
              <img key={i} src={p} alt="" className="h-4 w-4 rounded-full object-cover ring-1 ring-black" />
            ))}
          </div>
          <span className="text-[11px] text-white/70"><span className="font-semibold text-white/90">Alex Smith</span> and 2 others joined</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 flex-1 items-center justify-between rounded-full border border-white/30 pl-3.5 pr-1">
            <span className="text-[13px] text-white/60">Hi</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[13px] text-white">↑</span>
          </div>
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4"/><path d="m8 8 4-4 4 4"/><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/></svg>
        </div>
      </div>
    </div>
  );
}

// Instagram Live: full-bleed vertical cam, gradient LIVE badge, plain white
// chat overlay, "Add a comment…" pill with heart + paper-plane.
function LiveCardInstagram({ live, author, avatar }: { live: LivePost["live"]; author: string; avatar: string }) {
  const comments = useRotatingComments(3);
  return (
    <div className="relative mt-3 aspect-[9/13] overflow-hidden rounded-xl bg-black">
      <CoverVideo src={live.videoSrc} videoId={live.videoId} scrim />
      {/* Header */}
      <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="rounded-full bg-white/80 p-[2px]">
            <img src={avatar} alt={author} className="h-7 w-7 rounded-full object-cover" />
          </span>
          <p className="max-w-[110px] truncate text-[12px] font-semibold text-white drop-shadow">{author.toLowerCase().replace(" ", "_")}</p>
          <span className="rounded-md bg-[#D6204C] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">LIVE</span>
          <div className="flex items-center gap-0.5 rounded-md bg-black/40 px-1.5 py-0.5">
            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>
            <span className="text-[10px] font-semibold text-white">{live.viewers}</span>
          </div>
        </div>
        <span className="text-[16px] leading-none text-white drop-shadow">✕</span>
      </div>
      {/* Chat overlay — no exit animation (hidden-tab exits pile up) */}
      <div className="pointer-events-none absolute bottom-14 left-3 flex w-[75%] flex-col gap-1.5">
        {comments.map(c => (
          <motion.p key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-[12px] leading-snug text-white drop-shadow">
            <span className="font-semibold">{c.user}</span> {c.text}
          </motion.p>
        ))}
      </div>
      {/* Comment bar */}
      <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-2.5">
        <div className="flex h-9 flex-1 items-center rounded-full border border-white/40 px-3.5">
          <span className="text-[12px] text-white/70">Add a comment…</span>
        </div>
        <svg className="h-[22px] w-[22px] text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <svg className="h-[22px] w-[22px] text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
      </div>
    </div>
  );
}

// Full-screen workshop slide (recreates the marketing-deck look: dark canvas,
// soft light streaks, serif headline). Copy comes from the post's live data.
function WorkshopSlide({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0C10]">
      {/* Stage ambience behind the deck */}
      <div className="absolute -left-16 top-[10%] h-14 w-[380px] rotate-[-16deg] rounded-full bg-[#3B62B8]/25 blur-3xl" />
      <div className="absolute -right-12 bottom-[10%] h-12 w-[300px] rotate-[-18deg] rounded-full bg-[#B77239]/20 blur-3xl" />
      {/* The slide itself — an inset surface, like a shared deck */}
      <div className="absolute inset-x-3 bottom-3 top-11 overflow-hidden rounded-lg bg-gradient-to-br from-[#141824] to-[#0D1016] shadow-[0_8px_24px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
        <div className="absolute -left-10 top-1 h-10 w-64 rotate-[-14deg] rounded-full bg-[#3B62B8]/35 blur-2xl" />
        <div className="absolute -right-8 bottom-3 h-10 w-56 rotate-[-16deg] rounded-full bg-[#C98A3D]/25 blur-2xl" />
        <div className="relative flex h-full flex-col justify-center px-4 pb-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#F5C64F]">Live workshop</p>
          <h3 className="mt-1 font-serif text-[20px] leading-[1.1] tracking-[-0.01em] text-white">{title}</h3>
          <p className="mt-1 line-clamp-2 max-w-[95%] text-[11px] leading-snug text-white/60">{subtitle}</p>
        </div>
        {/* Deck chrome: progress + page count */}
        <div className="absolute inset-x-4 bottom-2.5 flex items-center gap-2">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[35%] rounded-full bg-white/60" />
          </div>
          <span className="text-[9px] font-medium tabular-nums text-white/50">12 / 34</span>
        </div>
      </div>
    </div>
  );
}

// Leland-native minimal treatment: full-bleed, fully self-contained — post
// chrome lives ON the media. Presentation band on top (1/3) carries the
// identity row (avatar · name · badges) and the ⋯ menu; coach cam below (2/3)
// carries bare chat and the post's action bar.
function LiveCardMinimal({ post }: { post: LivePost }) {
  const navigate = useNavigate();
  const postBase = usePostBase();
  const comments = useRotatingComments(3);
  const [liked, setLiked] = useState(false);
  const { live } = post;

  return (
    <div className="bg-[#0E0F12]">
      {/* Presentation — top third */}
      <div className="relative aspect-[15/8]">
        <WorkshopSlide title={live.title} subtitle={live.topic} />
        {/* Identity row — like a post header */}
        <div className="absolute inset-x-3 top-2.5 flex items-center gap-2">
          <img src={post.avatar} alt={post.author} className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/40" />
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[13px] font-semibold text-white drop-shadow">{post.author}</span>
            {post.verified ? <img src={verifiedIcon} alt="" className="h-[14px] w-[14px] shrink-0" /> : null}
            {post.companyLogo ? <img src={post.companyLogo} alt="" className="h-4 w-4 shrink-0 rounded-[3px] bg-white object-contain p-[1.5px]" /> : null}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D6204C] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D6204C]" />
              </span>
              <span className="text-[10px] font-semibold tracking-wide text-white">LIVE · {live.viewers}</span>
            </div>
            <button className="cursor-pointer rounded-full p-1 text-white/90 transition-colors hover:bg-white/10" aria-label="More options">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>
            </button>
          </div>
        </div>
      </div>
      {/* Coach cam — bottom two-thirds; crop biased up so the face sits in
          the top half, clear of the chat and actions */}
      <div className="relative aspect-[15/16]">
        <CoverVideo src={live.videoSrc} videoId={live.videoId} scrim cropTop />
        {/* Chat — plain text, raised above the action row. No exit animation:
            AnimatePresence exits never finish in a hidden tab and pile up. */}
        <div className="pointer-events-none absolute bottom-14 left-3 flex w-[85%] flex-col gap-1.5">
          {comments.map(c => (
            <motion.p
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 0.72, y: 0 }}
              className="text-[12px] leading-snug text-white drop-shadow"
            >
              <span className="font-semibold">{c.user}</span> {c.text}
            </motion.p>
          ))}
        </div>
        {/* Action row — on the video */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-3 pt-1">
          <button
            onClick={() => setLiked(l => !l)}
            className={`flex cursor-pointer items-center gap-1.5 drop-shadow transition-colors ${liked ? "text-red-500" : "text-white"}`}
            aria-label="Like"
          >
            <motion.svg
              className="h-[22px] w-[22px]"
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.75"
              animate={liked ? { scale: [1, 0.6, 1.8, 0.9, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeOut" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </motion.svg>
            <span className="text-[13px] font-medium">{post.likes + (liked ? 1 : 0)}</span>
          </button>
          <button
            onClick={() => { primeKeyboard(); navigate(`${postBase}/${post.id}`, { state: { focusInput: true } }); }}
            className="flex cursor-pointer items-center gap-1.5 text-white drop-shadow"
            aria-label="Comment"
          >
            <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C13.486 21.0018 14.9492 20.6339 16.2576 19.9293L20.3676 20.9755C20.4517 20.9969 20.5398 20.9961 20.6234 20.9731C20.707 20.9502 20.7832 20.9058 20.8445 20.8445C20.9058 20.7832 20.9501 20.707 20.9731 20.6234C20.9961 20.5398 20.9969 20.4517 20.9755 20.3676L19.9293 16.2576C20.8609 14.5226 21.1978 12.5299 20.8882 10.5851C20.5786 8.64022 19.6396 6.85061 18.2152 5.49065C16.7909 4.13068 14.9598 3.27543 13.0027 3.05604C11.0457 2.83664 9.07066 3.26522 7.38054 4.27604C5.69042 5.28687 4.3785 6.82414 3.64594 8.65215C2.91338 10.4802 2.80062 12.498 3.32495 14.3962C3.84928 16.2945 4.98176 17.9684 6.54873 19.1612C8.1157 20.354 10.0307 21 12 21Z" /></svg>
            <span className="text-[13px] font-medium">{post.comments}</span>
          </button>
          <button className="flex cursor-pointer items-center gap-1.5 text-white drop-shadow" aria-label="Repost">
            <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.34204 6.34448C7.79104 4.89648 9.79204 4.00048 12.003 4.00048C16.424 4.00048 20.008 7.58248 20.008 12.0025C20.008 12.6105 19.934 13.2005 19.806 13.7695" />
              <path d="M17.658 17.6555C16.209 19.1035 14.208 19.9995 11.997 19.9995C7.576 19.9995 3.992 16.4175 3.992 11.9975C3.992 11.3895 4.066 10.7995 4.194 10.2305" />
            </svg>
            <span className="text-[13px] font-medium">{post.reposts}</span>
          </button>
          <button className="flex cursor-pointer items-center text-white drop-shadow" aria-label="Share">
            <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.082 8.95158V8.95158C6.196 9.503 2.50256 13.6346 2.5 18.5516V19.1636H2.5C4.62349 16.6055 7.75786 15.1019 11.082 15.0466V18.2736V18.2733C11.082 18.9482 11.6291 19.4953 12.304 19.4953C12.5786 19.4953 12.8452 19.4028 13.0608 19.2328L21.0508 12.9238V12.9238C21.5622 12.5207 21.65 11.7794 21.247 11.268C21.1895 11.1951 21.1237 11.1292 21.0508 11.0718L13.0608 4.76276V4.76276C12.531 4.34468 11.7626 4.43525 11.3445 4.96505C11.1744 5.18061 11.0818 5.44717 11.0818 5.72176L11.082 8.95158Z" /></svg>
          </button>
          <button className="flex cursor-pointer items-center text-white drop-shadow" aria-label="Save">
            <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Rolling transcript of what the speaker is saying — stands in for real
// burned-in captions on a replay.
const TRANSCRIPT_LINES = [
  "…does the top bullet tell a story?…",
  "…numbers only matter if we know what changed…",
  "…read it out loud — if you stumble, they will too…",
  "…one story per bullet, that's the whole trick…",
  "…recruiters skim, so front-load the verbs…",
];

function CaptionsTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TRANSCRIPT_LINES.length), 3400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0">
      <div className="h-16 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <p className="absolute inset-x-0 bottom-2 truncate px-4 text-center text-[12px] font-medium leading-snug text-white">
        {TRANSCRIPT_LINES[idx]}
      </p>
    </div>
  );
}

// Simple horizontal replay: the person talking, edge to edge. No vertical
// chrome, no deck — just the video, a play chip, and (via composer toggles)
// captions and/or the replayed chat. Tapping opens the full replay viewer.
// Animated Q&A clip: words trickle in over brand yellow. Silent by default
// (autoplay-safe); tapping toggles the real audio, whose clock then drives the
// word timing so type lands with the voice.
export function CaptionClip({ segments, className = "" }: { segments: { q: string; a: string; qAudio: string; aAudio: string }[]; className?: string }) {
  const [segIdx, setSegIdx] = useState(0);
  const [qShown, setQShown] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  // The layer beneath the paint sweep — trails the active color by one beat.
  const [baseBg, setBaseBg] = useState("#FFD96F");
  const tokenRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const PALETTES = [
    { bg: "#FFD96F", fg: "#111111", badge: "rgba(17,17,17,0.14)" },
    { bg: "#475569", fg: "#FFFFFF", badge: "rgba(255,255,255,0.25)" },
    { bg: "#AECBFA", fg: "#111111", badge: "rgba(17,17,17,0.14)" },
  ];
  const pal = PALETTES[segIdx % PALETTES.length];
  const seg = segments[segIdx] ?? segments[0];
  const qWords = seg.q.split(" ");

  useEffect(() => {
    const t = window.setTimeout(() => setBaseBg(pal.bg), 650);
    return () => clearTimeout(t);
  }, [pal.bg]);

  useEffect(() => {
    const token = ++tokenRef.current;
    const live = () => tokenRef.current === token;
    let raf = 0;
    let timer = 0;
    const wait = (ms: number) => new Promise<void>(r => { timer = window.setTimeout(r, ms); });
    const silentPhase = (n: number, set: (i: number) => void, per: number) =>
      new Promise<void>(res => {
        let i = 0;
        const tick = () => {
          if (!live()) return;
          i++;
          set(i);
          if (i < n) timer = window.setTimeout(tick, per);
          else res();
        };
        timer = window.setTimeout(tick, per);
      });
    const audioPhase = (srcUrl: string, n: number, set: (i: number) => void) =>
      new Promise<void>(res => {
        const audio = new Audio(srcUrl);
        audioRef.current = audio;
        const step = () => {
          if (!live()) return;
          set(Math.min(n, Math.ceil((audio.currentTime / (audio.duration || 1)) * n)));
          if (!audio.ended) raf = requestAnimationFrame(step);
        };
        audio.onended = () => { if (live()) { set(n); res(); } };
        audio.play()
          .then(() => { raf = requestAnimationFrame(step); })
          .catch(() => { silentPhase(n, set, 150).then(res); });
      });
    const audioPlain = (srcUrl: string, fallbackMs: number) =>
      new Promise<void>(res => {
        const audio = new Audio(srcUrl);
        audioRef.current = audio;
        audio.onended = () => { if (live()) res(); };
        audio.play().catch(() => { wait(fallbackMs).then(res); });
      });
    const run = async () => {
      while (live()) {
        for (let s = 0; s < segments.length; s++) {
          if (!live()) return;
          const sg = segments[s];
          setSegIdx(s);
          setRevealed(false);
          setQShown(0);
          await wait(380);
          if (!live()) return;
          if (soundOn) await audioPhase(sg.qAudio, sg.q.split(" ").length, setQShown);
          else await silentPhase(sg.q.split(" ").length, setQShown, 140);
          if (!live()) return;
          await wait(650);
          if (!live()) return;
          setRevealed(true);
          if (soundOn) await audioPlain(sg.aAudio, sg.a.split(" ").length * 105);
          else await wait(Math.max(1800, sg.a.split(" ").length * 150));
          if (!live()) return;
          await wait(1100);
        }
      }
    };
    run();
    return () => {
      tokenRef.current++;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [soundOn, segments]);

  return (
    <div
      onClick={e => { e.stopPropagation(); if (!revealed) setRevealed(true); else setSoundOn(v => !v); }}
      className={`relative cursor-pointer overflow-hidden ${className}`}
      style={{ backgroundColor: baseBg }}
    >
      {/* Each question's color paints across the board from the corner */}
      <motion.div
        key={segIdx}
        className="absolute inset-0"
        style={{ backgroundColor: pal.bg }}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="relative flex h-full flex-col p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: pal.fg, opacity: 0.5 }}>Q</p>
        <p className="mt-1.5 min-h-[87px] font-serif text-[22px] leading-[1.3]" style={{ color: pal.fg }}>
          {qWords.slice(0, qShown).map((w, i) => (
            <motion.span key={`${segIdx}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.16 }} className="inline-block whitespace-pre">
              {w}{" "}
            </motion.span>
          ))}
        </p>
        {/* The answer sits under blur from the start — tap to reveal early */}
        <motion.div
          animate={{ filter: revealed ? "blur(0px)" : "blur(9px)", opacity: revealed ? 1 : 0.5, scale: revealed ? 1 : 1.015 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: pal.fg, opacity: 0.5 }}>A</p>
          <p className="mt-1.5 text-[17px] font-medium leading-[1.45]" style={{ color: pal.fg, opacity: 0.92 }}>{seg.a}</p>
        </motion.div>
      </div>
      {/* The badge breathes while muted, begging for the tap. */}
      <motion.div
        onClick={e => { e.stopPropagation(); setSoundOn(v => !v); }}
        animate={soundOn ? { scale: 1, opacity: 1 } : { scale: [1, 1.14, 1], opacity: [0.6, 1, 0.6] }}
        transition={soundOn ? { duration: 0.2 } : { duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: pal.badge, color: pal.fg }}
      >
        {soundOn ? (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4z" /><path d="m22 9-6 6" /><path d="m16 9 6 6" /></svg>
        )}
      </motion.div>
    </div>
  );
}

export function LiveReplayCard({ live, postId, static: isStatic }: { live: LivePost["live"]; postId: number; static?: boolean }) {
  const navigate = useNavigate();
  const comments = useRotatingComments(2);
  if (live.captionCard) {
    return (
      <div className="mt-3 w-[290px] overflow-hidden rounded-xl">
        <CaptionClip segments={live.captionCard} className="aspect-[4/5] w-full" />
      </div>
    );
  }
  const aspect = live.cropAspect === "16:9" ? "aspect-video" : live.cropAspect === "1:1" ? "aspect-square" : live.cropAspect === "4:5" ? "aspect-[4/5] w-[290px]" : live.cropAspect === "9:16" ? "aspect-[9/16] w-[290px]" : "aspect-[4/3]";
  const userFramed = live.cropAspect !== undefined && live.cropAspect !== "Original";
  return (
    <div
      onClick={isStatic ? undefined : () => navigate(`/replay/${postId}`)}
      className={`relative mt-3 ${aspect} overflow-hidden rounded-xl bg-black ${isStatic ? "" : "cursor-pointer"}`}
    >
      {live.videoSrc ? (
        userFramed ? (
          /* The author framed this themselves in the crop editor. */
          <LazyVideo src={live.videoSrc} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: `${live.cropX ?? 50}% ${live.cropY ?? 50}%` }} />
        ) : (
          /* Bottom-anchored overscan crops the source's empty ceiling so the
             speaker rides high in the frame, clear of the caption strip. */
          <div className="absolute inset-0 overflow-hidden">
            <LazyVideo src={live.videoSrc} className="absolute bottom-0 left-0 h-[135%] w-full object-cover" />
          </div>
        )
      ) : (
        <CoverVideo src={live.videoSrc} videoId={live.videoId} />
      )}
      {live.peakViewers ? (
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 backdrop-blur-sm">
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
          <span className="text-[11px] font-medium text-white">{live.peakViewers.toLocaleString()}</span>
        </div>
      ) : null}
      {live.showChat ? (
        <div className="pointer-events-none absolute left-3 top-10 flex w-[70%] flex-col gap-1">
          {comments.map(c => (
            <motion.p key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.65, y: 0 }} className="text-[11px] leading-snug text-white drop-shadow">
              <span className="font-semibold">{c.user}</span> {c.text}
            </motion.p>
          ))}
        </div>
      ) : null}
      {live.showCaptions ? <CaptionsTicker /> : null}
    </div>
  );
}

function LiveCardParody({ live, author, avatar }: { live: LivePost["live"]; author: string; avatar: string }) {
  switch (live.variant) {
    // "minimal" needs the full post (identity + counts) and is handled
    // directly in FeedPost, not through this switch.
    case "twitter": return <LiveCardTwitter live={live} />;
    case "tiktok": return <LiveCardTikTok live={live} />;
    case "linkedin": return <LiveCardLinkedIn live={live} avatar={avatar} />;
    case "reddit": return <LiveCardReddit live={live} />;
    case "substack": return <LiveCardSubstack live={live} author={author} avatar={avatar} />;
    case "instagram": return <LiveCardInstagram live={live} author={author} avatar={avatar} />;
    default: return null;
  }
}

// While an event is live it renders through the live-stream treatment.
const eventAsLive = (event: EventPost["event"]): LivePost["live"] => ({
  title: event.title,
  videoId: event.videoId ?? "1cfIAVasP6E",
  viewers: event.watching ?? 0,
  topic: "Happening now · Free livestream",
});

// Post-event recap (Admin Tools → Event stage → Done): recording preview plus
// a route back into the thread — the post becomes the place the conversation
// continues after the event ends.
function EventWrappedCard({ event, postId }: { event: EventPost["event"]; postId: number }) {
  const navigate = useNavigate();
  const postBase = usePostBase();
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <button
        onClick={() => navigate(`${postBase}/${postId}`)}
        className="relative block w-full cursor-pointer"
      >
        <img src={event.image} alt={event.title} className="aspect-[1200/628] w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform hover:scale-105">
            <svg className="ml-1 h-6 w-6 text-gray-dark" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l10.44-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
            </svg>
          </div>
        </div>
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
          <span className="text-[11px] font-semibold tracking-wide text-gray-dark">ENDED</span>
        </div>
        {event.recordingDuration ? (
          <div className="absolute bottom-2 right-2 rounded-[4px] bg-black/70 px-1.5 py-[2px]">
            <span className="text-[11px] font-medium text-white">{event.recordingDuration}</span>
          </div>
        ) : null}
      </button>
      <div className="px-4 py-4">
        <p className="text-[15px] font-medium leading-snug text-gray-dark">{event.title}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[12px] text-gray-light">
            {event.attended !== undefined ? <>{event.attended.toLocaleString()} attended · </> : null}Recording available
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              primeKeyboard();
              navigate(`${postBase}/${postId}`, { state: { focusInput: true } });
            }}
            className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2.5 text-[12px] font-medium text-gray-dark transition-colors hover:bg-gray-200"
          >
            Join the conversation
          </button>
        </div>
      </div>
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
  "James Allen": {
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
      className="absolute left-0 top-12 z-50 w-[340px] overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_8px_32px_rgba(0,0,0,0.13)]"
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onMouseEnter={(e) => e.stopPropagation()}
    >
      <ProfileHoverContent
        avatar={avatar}
        name={author}
        verified={verified}
        headline={headline}
        p={p}
      />
    </motion.div>
  );
}

// Inline verified badge so the white separator can be a thin, crisp
// non-scaling stroke that hugs the scalloped contour (a bg-white ring reads too
// thick at this size). Blue scallop + explicit white check (the raw asset's
// check is a cut-out hole, so it needs a solid fill behind it here).
export function VerifiedBadge({ className = "" }: { className?: string }) {
  // Uses the uploaded verified.svg (self-contained blue badge with a white
  // outline), matching the verified icon shown next to names in posts.
  return <img src={verifiedIcon} alt="" aria-hidden className={className} />;
}

type HoverProps = { onMouseEnter: () => void; onMouseLeave: () => void };

// Shared hover-card controller: the avatar AND the author name drive the SAME
// coach preview card, so hovering either opens it and moving between them (or
// onto the card) keeps it open. Disabled for events / group posts, which don't
// map to a coach profile.
function useCoachHover(post: Post): { open: boolean; enabled: boolean; hoverProps: HoverProps } {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabled = post.type !== "event" && !post.isGroupPost && !post.groupPoster;

  const onMouseEnter = () => {
    if (!enabled) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), 350);
  };
  const onMouseLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };
  return { open, enabled, hoverProps: { onMouseEnter, onMouseLeave } };
}

function AvatarWithHoverCard({ post, open, hoverProps }: { post: Post; open: boolean; hoverProps: HoverProps }) {
  const navigate = useNavigate();
  const isEvent = post.type === "event";
  const isGroupPost = post.isGroupPost || !!post.groupPoster;

  return (
    <div className="relative shrink-0" {...hoverProps}>
      <div
        className="group relative h-10 w-10 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          if (isGroupPost) navigate(`/groups/${post.groupId ?? "ai-bp-apr-26"}`);
          else if (!isEvent) navigate(`/profile/${nameToSlug(post.groupPoster?.name ?? post.author)}`);
        }}
      >
        {isGroupPost ? (
          post.groupPoster ? (
            // Member's group post: person photo leads, group as a small badge.
            <>
              <img
                src={post.groupPoster.avatar}
                alt={post.groupPoster.name}
                className="h-10 w-10 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
              />
              <div
                className="absolute -bottom-1.5 -right-1.5 flex h-[20px] w-[20px] items-center justify-center rounded-[6px] border-2 border-white text-[10px] font-bold text-white"
                style={{ backgroundColor: post.groupColor ?? "#2563EB" }}
              >
                {post.author.charAt(0)}
              </div>
            </>
          ) : (
            // Group announcement: the group itself.
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[15px] font-bold text-white"
              style={{ backgroundColor: post.groupColor ?? "#2563EB" }}
            >
              {post.author.charAt(0)}
            </div>
          )
        ) : isEvent ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
            <img src={post.avatar} alt={post.author} className="h-5 w-5 brightness-0 invert" />
          </div>
        ) : post.type === "live" ? (
          // Just posted a livestream — red ring pulls the eye to the coach.
          <div className="h-10 w-10 rounded-full bg-[#D6204C] p-[2px]">
            <img
              src={post.avatar}
              alt={post.author}
              className="h-full w-full rounded-full border-2 border-white object-cover"
            />
          </div>
        ) : (
          <img
            src={post.avatar}
            alt={post.author}
            className="h-10 w-10 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
          />
        )}
        <div className={`absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 ${isGroupPost && !post.groupPoster ? "rounded-[8px]" : "rounded-full"}`} />
        {/* Verified badge — bottom-right of the avatar, ringed in white to lift
            off the photo. Skipped for group/event avatars (which own that spot). */}
        {post.verified && !isGroupPost && !isEvent ? (
          <VerifiedBadge className="absolute -bottom-1 -right-1 h-5 w-5" />
        ) : null}
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

// Compact embed of the post a quote is quoting. Read-only; the parent decides
// click behavior (in the feed it navigates to the original).
function QuotedPostCard({ quoted }: { quoted: QuotedSnapshot }) {
  const body = quoted.body.length > 220 ? `${quoted.body.slice(0, 220).trimEnd()}…` : quoted.body;
  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-gray-stroke">
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          {quoted.avatar
            ? <img src={quoted.avatar} alt={quoted.author} className="h-6 w-6 shrink-0 rounded-full object-cover" />
            : <div className="h-6 w-6 shrink-0 rounded-full bg-gray-hover" />}
          <span className="truncate text-[14px] font-medium text-gray-dark">{quoted.author}</span>
          {quoted.verified && <img src={verifiedIcon} alt="Verified" className="h-[13px] w-[13px] shrink-0" />}
          <span className="shrink-0 text-[13px] text-gray-xlight">{quoted.time}</span>
        </div>
        {body && <p className="whitespace-pre-wrap text-[14px] leading-[1.4] text-gray-dark">{body}</p>}
        {quoted.image && <img src={quoted.image} alt="" className="mt-1 max-h-64 w-full rounded-xl object-cover" />}
      </div>
    </div>
  );
}

// Per-post hover treatment: the whole row tints to gray-dark (#222) at 3%.
// Applied to the post's full-bleed row wrapper so it reaches the card edges.
export const POST_HOVER_SHADOW = "transition-colors hover:bg-[rgba(34,34,34,0.03)]";

export function FeedPost({ post, onUpdate, onRepost, onUndoRepost, onQuote, onOpen }: { post: Post; onUpdate?: (id: number, text: string, images: ImageEntry[]) => void; onRepost?: (post: Post) => void; onUndoRepost?: (post: Post) => void; onQuote?: (post: Post) => void; onOpen?: () => void }) {
  const navigate = useNavigate();
  const postBase = usePostBase();
  const [editOpen, setEditOpen] = useState(false);
  const { mode: profileBarMode } = useProfileBarMode();
  const { liveCardStyle, eventStage } = useFeedDemo();
  // Avatar + name share one coach hover-card (see useCoachHover).
  const hover = useCoachHover(post);
  // Clicking a post image expands it in a lightbox in place (no navigation), so
  // dismissing leaves the feed exactly where it was.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Media-only live post: identity and actions live on the card itself.
  if (post.type === "live" && post.live.variant === "minimal" && post.live.bare) {
    return (
      <div className="py-3">
        <div className="-mx-4 sm:-mx-6" onClick={e => e.stopPropagation()}>
          <LiveCardMinimal post={post} />
        </div>
      </div>
    );
  }

  // A re-surfaced simple repost points its click-through and repost state at
  // the original. A quote post is local-only (no /post route), so its card
  // click goes to the quoted original instead.
  const canonicalId = post.repostOfId ?? post.id;
  const navId = post.type === "quote" ? post.quoted.id : canonicalId;

  return (
    <div className="pt-5 pb-[14px]">
      {post.repostedBy && (
        <div className="mb-2 flex items-center gap-1.5 pl-[44px] text-[13px] font-medium text-gray-light">
          <img src={repostsIcon} alt="" className="h-4 w-4 [filter:invert(44%)]" />
          <span>{post.repostedBy === "You" ? "You reposted" : `${post.repostedBy} reposted`}</span>
        </div>
      )}
      <div
        className="flex cursor-pointer gap-3"
        onClick={(e) => {
          if (onOpen) { onOpen(); return; }
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          navigate(`${postBase}/${navId}`, { state: { sourceY: rect.top } });
        }}
      >
        {/* Left column: avatar with hover card */}
        <div onClick={e => e.stopPropagation()}>
          <AvatarWithHoverCard post={post} open={hover.open} hoverProps={hover.hoverProps} />
        </div>
        {/* Right column: content */}
        <div className="min-w-0 flex-1">
          <PostHeaderRow author={post.author} time={post.time} verified={post.verified} headline={post.headline} feed={post.feed} isGroupPost={post.isGroupPost} groupId={post.groupId} groupPoster={post.groupPoster} companyLogo={post.companyLogo} onEdit={onUpdate ? () => setEditOpen(true) : undefined} nameHover={hover.enabled ? hover.hoverProps : undefined} />
          {/* Minimal mode has no title line, so the body tucks up tight to the
              identity row (negative margin trims the line-height leading); the
              title modes give the body a touch more air. */}
          {/* Articles are represented by their card (title + clamped excerpt) —
              the raw body would dump the whole essay into the feed. */}
          {post.type !== "article" ? (
            <p className={`${profileBarMode === 1 ? "-mt-1.5" : "mt-1.5"} text-[15px] leading-[1.4] text-gray-dark`}>{post.body}</p>
          ) : null}
          <div className={post.type !== "text" ? "pb-1" : ""} onClick={e => e.stopPropagation()}>
            {post.type === "image" && (
              <ImageGallery
                images={post.images}
                imageAspectRatios={post.imageAspectRatios}
                onImageClick={(idx) => setLightboxIndex(idx)}
              />
            )}
            {post.type === "link" && <LinkCard link={post.link} />}
            {post.type === "article" && <ArticleCard post={post} />}
            {post.type === "poll" && <PollCard poll={post.poll} />}
            {post.type === "event" && (
              eventStage === "live" ? (
                liveCardStyle === "min"
                  ? <LiveCardCompact live={eventAsLive(post.event)} author={post.author} avatar={post.avatar} />
                  : <LiveCard live={eventAsLive(post.event)} author={post.author} avatar={post.avatar} />
              ) : eventStage === "wrapped" ? (
                <EventWrappedCard event={post.event} postId={post.id} />
              ) : (
                <EventCard event={post.event} />
              )
            )}
            {post.type === "milestone" && <MilestoneCard milestone={post.milestone} postId={post.id} authorName={post.milestone.clientName} />}
            {post.type === "session" && <SessionCompletedCard session={post.session} />}
            {/* "minimal" is full-bleed and renders below, outside the avatar column */}
            {post.type === "live" && post.live.variant !== "minimal" && (
              post.live.horizontal ? <LiveReplayCard live={post.live} postId={post.id} />
                : post.live.variant ? <LiveCardParody live={post.live} author={post.author} avatar={post.avatar} />
                : liveCardStyle === "min"
                  ? <LiveCardCompact live={post.live} author={post.author} avatar={post.avatar} />
                  : <LiveCard live={post.live} author={post.author} avatar={post.avatar} />
            )}
            {post.type === "quote" && (
              <div onClick={(e) => { e.stopPropagation(); navigate(`${postBase}/${post.quoted.id}`); }}>
                <QuotedPostCard quoted={post.quoted} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Full-bleed minimal live: escapes both the avatar column and the
          feed's horizontal gutters (px-4 / sm:px-6 on the page wrapper). */}
      {post.type === "live" && post.live.variant === "minimal" ? (
        <div className="-mx-4 mt-3 sm:-mx-6" onClick={e => e.stopPropagation()}>
          <LiveCardMinimal post={post} />
        </div>
      ) : null}
      <div className="mt-1" onClick={e => e.stopPropagation()}>
        <ActionBar post={post} likes={post.likes} comments={post.comments} reposts={post.reposts} shares={post.shares} postId={navId} authorName={post.author} onRepost={onRepost} onUndoRepost={onUndoRepost} onQuote={onQuote} />
      </div>
      {editOpen && (
        <ComposeModal
          editPost={post}
          onClose={() => setEditOpen(false)}
          onPost={() => {}}
          onUpdate={(id, text, images) => { onUpdate?.(id, text, images); }}
          isMVP={true}
        />
      )}
      {/* Expand-in-place image viewer — no navigation, so closing returns to the
          exact scroll position. */}
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

// ─── People to follow ─────────────────────────────────

// Any user, not just experts — verified experts get a badge on their avatar.
type FollowPerson = { name: string; avatar: string; verified: boolean; subtitle: string };

const peopleToFollow: FollowPerson[] = [
  { name: "Dylan Allen",       avatar: pic1,  verified: false, subtitle: "techocarrott" },
  { name: "Claire Vo",         avatar: pic13, verified: false, subtitle: "Claire's Substack" },
  { name: "Julie Zhuo",        avatar: pic7,  verified: true,  subtitle: "The Looking Glass" },
  { name: "Molly Baz",         avatar: pic2,  verified: false, subtitle: "mollybaz" },
  { name: "Jordan Allen",      avatar: pic8,  verified: false, subtitle: "jordanallen1" },
  { name: "Nina Kowalski",     avatar: pic5,  verified: true,  subtitle: "McKinsey & Company" },
  { name: "Garry Tan",         avatar: pic10, verified: false, subtitle: "Garry Tan" },
  { name: "Dwarkesh Patel",    avatar: pic4,  verified: true,  subtitle: "Dwarkesh Podcast" },
  { name: "Michael Brandley",  avatar: pic6,  verified: false, subtitle: "Followed by Austin Winfield" },
  { name: "Paul Graham",       avatar: pic9,  verified: false, subtitle: "Paul Graham" },
  { name: "Andrew Huberman",   avatar: pic11, verified: true,  subtitle: "Andrew Huberman" },
  { name: "Patrick Collison",  avatar: pic12, verified: false, subtitle: "Patrick Collison" },
  { name: "Michael Pollan",    avatar: pic14, verified: false, subtitle: "The Microdose" },
  { name: "Andrej Karpathy",   avatar: pic3,  verified: false, subtitle: "Andrej's Substack" },
  { name: "Lauren Hayes",      avatar: pic13, verified: true,  subtitle: "HBS Admissions" },
  { name: "Emily Oster",       avatar: pic2,  verified: false, subtitle: "emilyoster" },
  { name: "Samin Nosrat",      avatar: pic7,  verified: true,  subtitle: "a grain of salt" },
  { name: "Alison Roman",      avatar: pic1,  verified: false, subtitle: "a newsletter" },
  { name: "Jake Reni",         avatar: pic8,  verified: false, subtitle: "Jake Reni" },
  { name: "Marc Andreessen",   avatar: pic10, verified: true,  subtitle: "Marc Andreessen Substack" },
];

// The hover popover shown over a post's avatar/name: identity (name + handle +
// avatar), a short bio, follower count, and two equal-weight CTAs — Follow
// (toggles to Following) and Message.
function ProfileHoverContent({ avatar, name, verified, headline, p }: {
  avatar: string;
  name: string;
  verified?: boolean;
  headline?: string;
  p: CoachProfile | undefined;
}) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const handle = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const bio = headline ?? p?.affiliation;
  const profileTo = `/profile/${nameToSlug(name)}`;

  return (
    <div className="p-4">
      {/* Identity: name + handle on the left, circular avatar on the right */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Link to={profileTo} className="truncate text-[17px] font-semibold leading-tight text-gray-dark hover:underline">{name}</Link>
            {verified ? <img src={verifiedIcon} alt="" className="h-4 w-4 shrink-0" /> : null}
          </div>
          <p className="mt-1 truncate text-[14px] leading-tight text-gray-light">@{handle}</p>
        </div>
        <Link to={profileTo} className="shrink-0">
          <img src={avatar} alt={name} className="h-14 w-14 rounded-full object-cover" style={{ objectPosition: "50% 15%" }} />
        </Link>
      </div>

      {bio ? <p className="mt-3 text-[14px] leading-snug text-gray-dark">{bio}</p> : null}

      {p ? (
        <p className="mt-2 text-[13px] leading-tight text-gray-light">
          <span className="font-semibold text-gray-dark">{formatCount(p.followers)}</span> followers
        </p>
      ) : null}

      {/* Two primary CTAs */}
      <div className="mt-4 flex gap-2">
        <Button
          size="md"
          rounded="rounded-xl"
          variant={following ? "outline" : "dark"}
          onClick={() => setFollowing(f => !f)}
          className="flex-1"
        >
          {following ? "Following" : "Follow"}
        </Button>
        <Button
          size="md"
          rounded="rounded-xl"
          variant="outline"
          onClick={() => navigate("/messages")}
          className="flex-1"
        >
          Message
        </Button>
      </div>
    </div>
  );
}

// A person's avatar with the verified badge overlaid bottom-right (experts only).
function FollowAvatar({ person, size, badge }: { person: FollowPerson; size: number; badge: string }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <img src={person.avatar} alt={person.name} className="h-full w-full rounded-full object-cover" style={{ objectPosition: "50% 15%" }} />
      {person.verified ? <VerifiedBadge className={`absolute -bottom-0.5 -right-0.5 ${badge}`} /> : null}
    </div>
  );
}

// Simple follow toggle — gray-dark by default, gray (secondary) once following.
function FollowToggle({ className = "" }: { className?: string }) {
  const [following, setFollowing] = useState(false);
  return (
    <Button
      size="sm"
      variant={following ? "secondary" : "dark"}
      rounded="rounded-lg"
      onClick={() => setFollowing(f => !f)}
      className={`font-semibold ${className}`}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}

function DismissButton({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

// Carousel card: dismissable, centered avatar (+badge), name, subtitle, Follow.
function PersonToFollowCard({ person, onDismiss }: { person: FollowPerson; onDismiss: () => void }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center rounded-2xl border border-gray-stroke bg-white px-4 pb-4 pt-8" style={{ width: 200, minWidth: 200 }}>
      <DismissButton label={`Dismiss ${person.name}`} onClick={onDismiss} className="absolute right-2 top-2" />
      <FollowAvatar person={person} size={88} badge="h-6 w-6" />
      <p className="mt-3 max-w-full truncate text-center text-[15px] font-semibold text-gray-dark">{person.name}</p>
      <p className="mt-0.5 max-w-full truncate text-center text-[13px] text-gray-light">{person.subtitle}</p>
      <FollowToggle className="mt-4 w-full" />
    </div>
  );
}

// Full-list row (the "See all" view): avatar (+badge), name, subtitle, Follow · X.
function PersonRow({ person, onDismiss }: { person: FollowPerson; onDismiss: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <FollowAvatar person={person} size={48} badge="h-[18px] w-[18px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-gray-dark">{person.name}</p>
        <p className="truncate text-[14px] text-gray-light">{person.subtitle}</p>
      </div>
      <FollowToggle />
      <DismissButton label={`Dismiss ${person.name}`} onClick={onDismiss} />
    </div>
  );
}

// Feed section — a horizontal carousel of people to follow, with a "See all"
// link that swaps the center feed for the full list (PeopleToFollowFull).
function PeopleToFollow({ onSeeAll }: { onSeeAll: () => void }) {
  const [people, setPeople] = useState(() => peopleToFollow.slice(0, 9));
  if (people.length === 0) return null;
  return (
    // Its own feed row — the parent divide-y provides the full-width top border,
    // and there's no post hover state here.
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="text-[19px] font-semibold text-gray-dark">People to follow</p>
        <button onClick={onSeeAll} className="text-[14px] font-medium text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70">See all</button>
      </div>
      {/* Full-bleed scroll area: negative margins cancel the section padding so
          cards scroll to the section edges; the matching px keeps the first card
          aligned under the header (scroll padding). */}
      <div className="scrollbar-hide -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        {people.map(p => (
          <PersonToFollowCard key={p.name} person={p} onDismiss={() => setPeople(prev => prev.filter(x => x.name !== p.name))} />
        ))}
      </div>
    </div>
  );
}

// The "See all" view — replaces the center feed with a long list of accounts.
// Mirrors the Post Details layout: a back + title header ABOVE the boxed card.
function PeopleToFollowFull({ onBack }: { onBack: () => void }) {
  const [people, setPeople] = useState(peopleToFollow);
  // Always open at the top, regardless of the feed scroll position on entry.
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div>
      {/* Header sits outside the card, like the post thread header. */}
      <div className="mb-3 flex items-center gap-3 px-1">
        <button onClick={onBack} aria-label="Back to feed" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover">
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        </button>
        <p className="min-w-0 text-[18px] font-semibold leading-tight text-gray-dark">People to follow</p>
      </div>
      <div className="rounded-2xl border border-gray-stroke bg-white">
        <div className="divide-y divide-gray-stroke px-4 sm:px-6">
          {people.map(p => (
            <PersonRow key={p.name} person={p} onDismiss={() => setPeople(prev => prev.filter(x => x.name !== p.name))} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Compose Modal ────────────────────────────────────

const UPCOMING_EVENTS: EventPost["event"][] = [
  {
    title: "Public Policy Graduate Programs: Ask Me Anything",
    image: eventImageSrc,
    date: "Thursday, April 3, 2026",
    time: "6:00 PM – 7:30 PM PT",
    format: "Online",
    spotsLeft: 38,
    registered: 142,
  },
  {
    title: "MBA Admissions Office Hours with Ex-Wharton Advisor",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=628&fit=crop",
    date: "Tuesday, April 8, 2026",
    time: "5:00 PM – 6:00 PM PT",
    format: "Online",
    spotsLeft: 12,
    registered: 88,
  },
  {
    title: "Law School Application Strategy: Live Q&A",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=1200&h=628&fit=crop",
    date: "Saturday, April 12, 2026",
    time: "11:00 AM – 12:00 PM PT",
    format: "Online",
    spotsLeft: 55,
    registered: 210,
  },
];

type CropRatio = "free" | "1:1" | "4:5" | "16:9";
export type ImageEntry = { original: string; cropped: string; aspectRatio: number };

export const FEEDS = [
  { id: "community", label: "Leland Community" },
  { id: "mba", label: "MBA Admissions" },
  { id: "consulting", label: "Consulting" },
  { id: "tech", label: "Tech Recruiting" },
  { id: "law", label: "Law School" },
  { id: "ai-bp-apr-26", label: "AI BP April 26" },
];

export function ComposeModal({ onClose, onPost, onUpdate, editPost, quotePost, onGoLive, isMVP }: { onClose: () => void; onPost: (text: string, images: ImageEntry[]) => void; onUpdate?: (id: number, text: string, images: ImageEntry[]) => void; editPost?: Post; quotePost?: Post; onGoLive?: () => void; isMVP?: boolean }) {
  const isEditing = editPost != null;
  const isQuoting = quotePost != null;
  const isMobileModal = useIsMobile();
  useLockBodyScroll(true);

  // Escape key closes the modal (unless we're in crop mode — handled below)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Track keyboard height on mobile via the Visual Viewport API so the bottom
  // media bar can sit flush against the top of the keyboard (iOS Safari does
  // not resize the layout viewport when the keyboard appears).
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  useEffect(() => {
    if (!isMobileModal || typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(offset);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [isMobileModal]);

  // Post animation state — brief "posting" signal before the modal dismisses.
  const [posting, setPosting] = useState(false);
  const submitPost = () => {
    if (posting) return;
    if ((!text.trim() && images.length === 0) || overLimit) return;
    setPosting(true);
    setTimeout(() => {
      if (isEditing && onUpdate) onUpdate(editPost!.id, text.trim(), images);
      else onPost(text.trim(), images);
      onClose();
    }, 450);
  };
  const [text, setText] = useState(editPost?.body ?? "");
  const [selectedFeed, setSelectedFeed] = useState(FEEDS[0]);
  const [feedDropdownOpen, setFeedDropdownOpen] = useState(false);

  function selectFeed(feed: typeof FEEDS[number]) {
    setSelectedFeed(feed);
    // On mobile (bottom sheet), delay close so the radio-fill + row highlight
    // register as selection feedback before the tray dismisses.
    if (isMobileModal) {
      setTimeout(() => setFeedDropdownOpen(false), 280);
    } else {
      setFeedDropdownOpen(false);
    }
  }
  const feedDropdownRef = useRef<HTMLDivElement>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIdx(i => (i + 1) % composerPrompts.length);
        setPlaceholderVisible(true);
      }, 250);
    }, 3200);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (feedDropdownRef.current && !feedDropdownRef.current.contains(e.target as Node)) {
        setFeedDropdownOpen(false);
      }
    }
    if (feedDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [feedDropdownOpen]);

  const [eventAttached, setEventAttached] = useState(false);
  const [selectingEvent, setSelectingEvent] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  const [images, setImages] = useState<ImageEntry[]>(
    editPost?.type === "image"
      ? editPost.images.map((img, i) => ({ original: img, cropped: img, aspectRatio: editPost.imageAspectRatios?.[i] ?? 1 }))
      : []
  );
  const [cropMode, setCropMode] = useState(false);
  const [cropOriginalUrl, setCropOriginalUrl] = useState<string | null>(null);
  const [cropQueue, setCropQueue] = useState<string[]>([]);
  const [cropReCropIndex, setCropReCropIndex] = useState<number | null>(null);
  const [cropRatio, setCropRatio] = useState<CropRatio>("free");
  const [cropRotation, setCropRotation] = useState<0 | 90 | 180 | 270>(0);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [imgBounds, setImgBounds] = useState<{ rw: number; rh: number; ox: number; oy: number; scale: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ type: string; startX: number; startY: number; startBox: { x: number; y: number; w: number; h: number }; rw: number; rh: number } | null>(null);

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  // ── Crop helpers ─────────────────────────────────────────────────────────────
  const computeBounds = (rotation = cropRotation) => {
    const img = cropImgRef.current;
    const container = cropContainerRef.current;
    if (!img || !container || !img.naturalWidth) return null;
    const cw = container.offsetWidth;
    const ch = container.offsetHeight;
    const rotated90 = rotation === 90 || rotation === 270;
    const nw = rotated90 ? img.naturalHeight : img.naturalWidth;
    const nh = rotated90 ? img.naturalWidth : img.naturalHeight;
    const scale = Math.min(cw / nw, ch / nh);
    const rw = nw * scale; const rh = nh * scale;
    return { rw, rh, ox: (cw - rw) / 2, oy: (ch - rh) / 2, scale };
  };

  const onCropImgLoad = () => setImgBounds(computeBounds());

  // Recompute bounds when rotation changes
  useEffect(() => {
    if (cropMode) { const b = computeBounds(); setImgBounds(b); setCropBox({ x: 0, y: 0, w: 1, h: 1 }); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropRotation]);

  const applyRatioPreset = (ratio: CropRatio) => {
    setCropRatio(ratio);
    const b = imgBounds ?? computeBounds();
    if (!b) return;
    if (ratio === "free") { setCropBox({ x: 0, y: 0, w: 1, h: 1 }); return; }
    const ratioMap: Record<string, number> = { "1:1": 1, "4:5": 4 / 5, "16:9": 16 / 9 };
    const normTarget = ratioMap[ratio] / (b.rw / b.rh);
    let w: number, h: number;
    if (normTarget >= 1) { w = 1; h = clamp(1 / normTarget, 0.05, 1); }
    else { h = 1; w = clamp(normTarget, 0.05, 1); }
    setCropBox({ x: (1 - w) / 2, y: (1 - h) / 2, w, h });
  };

  const startCropDrag = (type: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const b = imgBounds ?? computeBounds();
    if (!b) return;
    dragRef.current = { type, startX: e.clientX, startY: e.clientY, startBox: { ...cropBox }, rw: b.rw, rh: b.rh };
    const onMove = (me: MouseEvent) => {
      const d = dragRef.current; if (!d) return;
      const dx = (me.clientX - d.startX) / d.rw;
      const dy = (me.clientY - d.startY) / d.rh;
      const min = 0.08;
      let { x, y, w, h } = d.startBox;
      if (d.type === "move") {
        x = clamp(x + dx, 0, 1 - w); y = clamp(y + dy, 0, 1 - h);
      } else if (d.type === "nw") {
        const nx = clamp(x + dx, 0, x + w - min); const ny = clamp(y + dy, 0, y + h - min);
        w = w + (x - nx); h = h + (y - ny); x = nx; y = ny;
      } else if (d.type === "ne") {
        const ny = clamp(y + dy, 0, y + h - min);
        h = h + (y - ny); y = ny; w = clamp(w + dx, min, 1 - x);
      } else if (d.type === "sw") {
        const nx = clamp(x + dx, 0, x + w - min);
        w = w + (x - nx); x = nx; h = clamp(h + dy, min, 1 - y);
      } else {
        w = clamp(w + dx, min, 1 - x); h = clamp(h + dy, min, 1 - y);
      }
      setCropBox({ x, y, w, h });
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const addProcessedImage = (croppedUrl: string, originalUrl: string, aspectRatio: number) => {
    if (cropReCropIndex !== null) {
      setImages(prev => prev.map((item, i) => i === cropReCropIndex ? { ...item, cropped: croppedUrl, aspectRatio } : item));
      setCropReCropIndex(null);
      setCropMode(false); setCropOriginalUrl(null);
    } else {
      setImages(prev => [...prev, { original: originalUrl, cropped: croppedUrl, aspectRatio }]);
      if (cropQueue.length > 0) {
        setCropOriginalUrl(cropQueue[0]);
        setCropQueue(q => q.slice(1));
        setCropBox({ x: 0, y: 0, w: 1, h: 1 }); setCropRatio("free"); setCropRotation(0); setImgBounds(null);
      } else {
        setCropMode(false); setCropOriginalUrl(null);
      }
    }
  };

  const applyCrop = () => {
    if (!cropOriginalUrl) return;
    const b = imgBounds ?? computeBounds();
    const url = cropOriginalUrl;
    const img = new Image();
    img.onload = () => {
      // No bounds — use the image at its natural ratio without cropping
      if (!b) {
        addProcessedImage(url, url, img.naturalWidth / img.naturalHeight);
        return;
      }
      const { rw, rh, scale } = b;
      const sx = (cropBox.x * rw) / scale; const sy = (cropBox.y * rh) / scale;
      const sw = (cropBox.w * rw) / scale; const sh = (cropBox.h * rh) / scale;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(sw); canvas.height = Math.round(sh);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (cropRotation === 0) {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      } else {
        // Pre-rotate into a temporary canvas then crop
        const rotated90 = cropRotation === 90 || cropRotation === 270;
        const rotW = rotated90 ? img.naturalHeight : img.naturalWidth;
        const rotH = rotated90 ? img.naturalWidth : img.naturalHeight;
        const tmp = document.createElement("canvas");
        tmp.width = rotW; tmp.height = rotH;
        const tctx = tmp.getContext("2d")!;
        tctx.translate(rotW / 2, rotH / 2);
        tctx.rotate(cropRotation * Math.PI / 180);
        tctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.drawImage(tmp, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      }
      // canvas dimensions are the ground truth for the cropped aspect ratio
      addProcessedImage(canvas.toDataURL("image/jpeg", 0.92), url, canvas.width / canvas.height);
    };
    img.src = url;
  };

  const cancelCrop = () => { setCropMode(false); setCropQueue([]); setCropReCropIndex(null); setCropOriginalUrl(null); };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const slots = 4 - images.length;
    const urls = files.slice(0, slots).map(f => URL.createObjectURL(f));
    if (!urls.length) return;
    setCropOriginalUrl(urls[0]);
    setCropQueue(urls.slice(1));
    setCropBox({ x: 0, y: 0, w: 1, h: 1 }); setCropRatio("free"); setCropRotation(0); setImgBounds(null);
    setCropReCropIndex(null);
    setCropMode(true);
    e.target.value = "";
  };

  useEffect(() => {
    if (!cropMode) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [cropMode]);

  useEffect(() => { textareaRef.current?.focus(); }, []);

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
      className={`fixed inset-0 z-[9999] flex justify-center ${isMobileModal ? "items-stretch" : "items-start"}`}
      style={{ backgroundColor: isMobileModal ? "#ffffff" : "rgba(0,0,0,0.5)" }}
      onClick={cropMode ? undefined : onClose}
    >
      <motion.div
        className={
          isMobileModal
            ? "relative flex w-full flex-col bg-white overflow-hidden pb-[env(safe-area-inset-bottom)]"
            : "relative mt-[60px] w-full max-w-[600px] rounded-2xl bg-white shadow-2xl mx-4 overflow-hidden"
        }
        style={isMobileModal ? { height: "100dvh" } : undefined}
        initial={isMobileModal ? { opacity: 0, y: 24 } : { opacity: 0, scale: 0.95, y: -20 }}
        animate={isMobileModal ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {cropMode ? (
          /* ── CROP MODE ─────────────────────────────────────────────────── */
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-stroke">
              <div className="w-8" />
              <span className="text-[13px] font-semibold text-gray-dark">
                {cropQueue.length > 0 ? `Crop photo (${images.length + 1} of ${images.length + 1 + cropQueue.length})` : "Crop photo"}
              </span>
              <button onClick={cancelCrop} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark transition-colors hover:bg-gray-hover">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Crop area */}
            <div ref={cropContainerRef} className="relative select-none bg-white overflow-hidden" style={{ height: 360 }}>
              {/* Rotate buttons */}
              <div className="absolute top-2 left-2 z-10 flex gap-1">
                {([
                  { delta: -90 as const, title: "Rotate left", d: "M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" },
                  { delta: 90 as const, title: "Rotate right", d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" },
                ]).map(({ delta, title, d }) => (
                  <button
                    key={delta}
                    title={title}
                    onClick={() => setCropRotation(r => (((r + delta) % 360 + 360) % 360) as 0 | 90 | 180 | 270)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d} />
                    </svg>
                  </button>
                ))}
              </div>

              <img
                ref={cropImgRef}
                src={cropOriginalUrl!}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ transform: `rotate(${cropRotation}deg)`, transformOrigin: "center center" }}
                draggable={false}
                onLoad={onCropImgLoad}
              />

              {imgBounds && (() => {
                const { rw, rh, ox, oy } = imgBounds;
                const bx = ox + cropBox.x * rw;
                const by = oy + cropBox.y * rh;
                const bw = cropBox.w * rw;
                const bh = cropBox.h * rh;
                return (
                  <>
                    <div className="absolute bg-black/20 pointer-events-none" style={{ left: 0, right: 0, top: 0, height: by }} />
                    <div className="absolute bg-black/20 pointer-events-none" style={{ left: 0, right: 0, top: by + bh, bottom: 0 }} />
                    <div className="absolute bg-black/20 pointer-events-none" style={{ left: 0, width: bx, top: by, height: bh }} />
                    <div className="absolute bg-black/20 pointer-events-none" style={{ left: bx + bw, right: 0, top: by, height: bh }} />
                    <div className="absolute cursor-move" style={{ left: bx, top: by, width: bw, height: bh }} onMouseDown={e => startCropDrag("move", e)}>
                      <div className="absolute inset-0 border-2 border-white pointer-events-none" />
                      <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                        backgroundSize: "33.333% 33.333%",
                      }} />
                      {([
                        { type: "nw", style: { top: -5, left: -5, cursor: "nw-resize" } },
                        { type: "ne", style: { top: -5, right: -5, cursor: "ne-resize" } },
                        { type: "sw", style: { bottom: -5, left: -5, cursor: "sw-resize" } },
                        { type: "se", style: { bottom: -5, right: -5, cursor: "se-resize" } },
                      ] as { type: string; style: React.CSSProperties }[]).map(({ type, style }) => (
                        <div key={type} className="absolute w-5 h-5 bg-white rounded-sm shadow-md" style={style} onMouseDown={e => startCropDrag(type, e)} />
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Aspect ratio pills + Apply */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                {(["free", "1:1", "4:5", "16:9"] as const).map(r => (
                  <button key={r} onClick={() => applyRatioPreset(r)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-colors ${cropRatio === r ? "bg-gray-200 text-gray-dark" : "text-gray-light hover:bg-gray-hover"}`}>
                    {r === "free" ? "Original" : r}
                  </button>
                ))}
              </div>
              <button onClick={applyCrop} className="rounded-[8px] bg-gray-dark px-4 py-1.5 text-[12px] font-semibold text-white hover:opacity-90 transition-opacity">
                {cropQueue.length > 0 ? "Next →" : "Apply"}
              </button>
            </div>
          </>
        ) : (
          /* ── COMPOSE MODE ──────────────────────────────────────────────── */
          <>
            {/* Mobile top bar: X (left) + audience + Post (right) */}
            {isMobileModal && (
              <div className="flex items-center gap-2 border-b border-gray-stroke px-3 py-2.5">
                <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {!isEditing && (
                  <button
                    onClick={() => setFeedDropdownOpen(o => !o)}
                    className="flex items-center gap-1 rounded-lg border border-gray-stroke bg-[#F5F5F5] pl-3 pr-2 py-1.5 text-[12px] font-medium text-gray-dark transition-colors hover:bg-[#EBEBEB]"
                  >
                    {selectedFeed.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={`shrink-0 transition-transform duration-150 ${feedDropdownOpen ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                )}
                <div className="flex-1" />
                <button
                  onClick={submitPost}
                  disabled={(!text.trim() && images.length === 0) || overLimit || posting}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-dark px-5 py-2 text-[13px] font-semibold text-white transition-opacity disabled:opacity-40 enabled:hover:opacity-90"
                >
                  {posting && (
                    <motion.span
                      className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  {posting ? "Posting…" : isEditing ? "Save" : "Post"}
                </button>
              </div>
            )}

            {/* Desktop-only X in top-right */}
            {!isMobileModal && (
              <button onClick={onClose} className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-[16px] border border-gray-stroke bg-white text-gray-dark transition-colors hover:bg-gray-hover">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            )}

            {/* Mobile audience sheet — portaled to body so it sits above everything */}
            {isMobileModal && feedDropdownOpen && createPortal(
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="fixed inset-0 z-[10000] bg-black/30"
                      onClick={() => setFeedDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={{ top: 0, bottom: 0.6 }}
                      onDragEnd={(_, info) => { if (info.offset.y > 100 || info.velocity.y > 400) setFeedDropdownOpen(false); }}
                      className="fixed inset-x-0 bottom-0 z-[10001] rounded-t-2xl border-t border-gray-stroke bg-white pb-[env(safe-area-inset-bottom)] shadow-lg"
                    >
                      <div className="mx-auto mt-2.5 mb-1 h-1.5 w-12 cursor-grab rounded-full bg-gray-300 active:cursor-grabbing" />
                      <p className="px-5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A0A0A0]">Post Audience</p>
                      <div className="p-2 pt-1">
                        {FEEDS.map(feed => {
                          const isSelected = selectedFeed.id === feed.id;
                          return (
                            <button
                              key={feed.id}
                              onClick={() => selectFeed(feed)}
                              className={`flex w-full items-center justify-between rounded-lg px-4 py-4 text-[15px] font-medium text-gray-dark transition-colors active:bg-[#EBEBEB] ${isSelected ? "bg-[#F5F5F5]" : ""}`}
                            >
                              <span>{feed.label}</span>
                              <span
                                aria-hidden
                                className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isSelected ? "border-gray-dark" : "border-gray-stroke"}`}
                              >
                                <span className={`h-[10px] w-[10px] rounded-full bg-[#FFD96F] transition-transform duration-150 ${isSelected ? "scale-100" : "scale-0"}`} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>,
                  document.body
                )}

            {/* Compose area. In quote mode the composer sizes to its content so
                the quoted preview sits directly under the comment instead of
                being pushed to the bottom of the sheet by a full-height field. */}
            <div className={`${isMobileModal ? (isQuoting ? "flex gap-3 px-4 pt-4" : "flex-1 min-h-0 flex gap-3 px-4 pt-4") : "px-4 pt-4 pb-3 pr-14"}`}>
              {isMobileModal && (
                <img src={profilePhoto} alt="Your profile" className="h-10 w-10 shrink-0 rounded-full object-cover" />
              )}
              {/* Desktop: Avatar + audience row */}
              {!isMobileModal && <div className="flex items-center gap-3 mb-3">
                <img src={profilePhoto} alt="Your profile" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-medium text-gray-dark leading-none">Jamie Allen</span>
                  {!isEditing && <div ref={feedDropdownRef} className="relative">
                    <button
                      onClick={() => setFeedDropdownOpen(o => !o)}
                      className="flex items-center gap-1 rounded-lg border border-gray-stroke bg-[#F5F5F5] pl-2.5 pr-1.5 py-1 text-[11px] font-medium text-gray-dark transition-colors hover:bg-[#EBEBEB]"
                    >
                      {selectedFeed.label}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`shrink-0 transition-transform duration-150 ${feedDropdownOpen ? "rotate-180" : ""}`}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {feedDropdownOpen && !isMobileModal && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                          className="absolute left-0 top-full z-50 mt-1 w-52 rounded-xl border border-gray-stroke bg-white shadow-lg"
                        >
                          <div className="px-3 pb-1.5 pt-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A0A0A0]">Post Audience</p>
                          </div>
                          <div className="p-1.5 pt-0">
                            {FEEDS.map(feed => {
                              const isSelected = selectedFeed.id === feed.id;
                              return (
                                <button
                                  key={feed.id}
                                  onClick={() => selectFeed(feed)}
                                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${
                                    isSelected ? "bg-[#F5F5F5] text-gray-dark" : "text-gray-dark hover:bg-[#F5F5F5]"
                                  }`}
                                >
                                  {feed.label}
                                  {isSelected && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>}
                </div>
              </div>}
              {/* Textarea with cycling placeholder — indented to align with name on desktop, inline with avatar on mobile */}
              <div className={`relative ${isMobileModal ? "flex-1 min-w-0" : "pl-[52px]"}`}>
                {text === "" && (
                  <span
                    className={`pointer-events-none absolute text-[15px] text-gray-light leading-relaxed transition-opacity duration-200 ${isMobileModal ? "left-0" : "left-[52px]"}`}
                    style={{ opacity: placeholderVisible ? 1 : 0, top: 7 }}
                  >
                    {composerPrompts[placeholderIdx]}
                  </span>
                )}
                <textarea ref={textareaRef} autoFocus value={text} onChange={autoGrow} rows={isQuoting ? 3 : 4}
                  className={`w-full resize-none bg-transparent text-[15px] text-gray-dark focus:outline-none leading-relaxed ${isMobileModal && !isQuoting ? "h-full" : ""}`}
                  style={isMobileModal ? { padding: 0, paddingTop: 7, minHeight: 0 } : { minHeight: "180px", padding: 0, paddingTop: 7 }} />
              </div>
            </div>

            {/* Quoted post preview — shown when reposting with thoughts. */}
            {isQuoting && (
              <div className="px-4 pb-3">
                <QuotedPostCard
                  quoted={{
                    id: quotePost.id,
                    author: quotePost.author,
                    avatar: quotePost.avatar,
                    time: quotePost.time,
                    verified: quotePost.verified,
                    body: quotePost.body,
                    image: quotePost.type === "image" ? quotePost.images[0] : undefined,
                  }}
                />
              </div>
            )}

            {/* Image gallery preview */}
            <AnimatePresence>
              {images.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden px-4 pb-3">
                  <PostImageGrid
                    maxHeight={400}
                    images={images.map(img => ({ src: img.cropped, aspectRatio: img.aspectRatio }))}
                    renderOverlay={(idx) => (
                      <>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                        <button
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        <button
                          onClick={() => { setCropOriginalUrl(images[idx].original); setCropBox({ x: 0, y: 0, w: 1, h: 1 }); setCropRatio("free"); setCropRotation(0); setImgBounds(null); setCropReCropIndex(idx); setCropMode(true); }}
                          className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6.13 1L6 16a2 2 0 002 2h15"/><path d="M1 6.13l15-.13a2 2 0 012 2v15"/>
                          </svg>
                          Crop
                        </button>
                      </>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Event picker / attached preview */}
            <AnimatePresence>
              {(selectingEvent || eventAttached) ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden px-4 pb-3">
                  {selectingEvent ? (
                    <div>
                      <p className="mb-2 text-[11px] font-medium text-gray-light">Select a livestream to attach</p>
                      <div className="relative">
                        <div className="overflow-hidden rounded-xl border border-gray-stroke">
                          <img src={UPCOMING_EVENTS[eventIndex].image} alt={UPCOMING_EVENTS[eventIndex].title} className="aspect-[1200/628] w-full object-cover" />
                          <div className="px-4 py-3">
                            <p className="text-[13px] font-semibold text-gray-dark">{UPCOMING_EVENTS[eventIndex].title}</p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-light">
                              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              <span>{UPCOMING_EVENTS[eventIndex].date}</span><span>·</span><span>{UPCOMING_EVENTS[eventIndex].time}</span>
                            </div>
                          </div>
                        </div>
                        {eventIndex > 0 && <button onClick={() => setEventIndex(i => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-stroke text-gray-dark hover:bg-gray-hover transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>}
                        {eventIndex < UPCOMING_EVENTS.length - 1 && <button onClick={() => setEventIndex(i => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-stroke text-gray-dark hover:bg-gray-hover transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>}
                      </div>
                      <div className="mt-2 flex justify-center gap-1.5">
                        {UPCOMING_EVENTS.map((_, i) => <button key={i} onClick={() => setEventIndex(i)} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === eventIndex ? "bg-gray-dark" : "bg-gray-stroke"}`} />)}
                      </div>
                      <div className="mt-3 flex justify-end gap-2">
                        <button onClick={() => setSelectingEvent(false)} className="rounded-lg px-4 py-2 text-[12px] font-medium text-gray-light hover:text-gray-dark transition-colors">Cancel</button>
                        <button onClick={() => { setEventAttached(true); setSelectingEvent(false); }} className="rounded-lg bg-gray-dark px-4 py-2 text-[12px] font-semibold text-white hover:opacity-90 transition-opacity">Attach</button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-xl border border-gray-stroke">
                      <button onClick={() => setEventAttached(false)} className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                      <img src={UPCOMING_EVENTS[eventIndex].image} alt={UPCOMING_EVENTS[eventIndex].title} className="aspect-[1200/628] w-full object-cover" />
                      <div className="px-4 py-3">
                        <p className="text-[13px] font-semibold text-gray-dark">{UPCOMING_EVENTS[eventIndex].title}</p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-light">
                          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          <span>{UPCOMING_EVENTS[eventIndex].date}</span><span>·</span><span>{UPCOMING_EVENTS[eventIndex].time}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Suggestion chips — Experimental only */}
            {!isMVP && (
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                {([
                  { label: "Attach your upcoming livestream", icon: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />, onClick: () => { setSelectingEvent(true); setEventAttached(false); setEventIndex(0); } },
                  { label: "Attach Bootcamp", icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>, onClick: undefined as (() => void) | undefined },
                  { label: "Go Live", icon: <><circle cx="12" cy="12" r="3"/><path d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7"/><path d="M5.5 5.5a9 9 0 000 13M18.5 5.5a9 9 0 010 13"/></>, onClick: onGoLive ? () => { onClose(); onGoLive(); } : undefined },
                  { label: "Celebrate someone", icon: <><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></>, onClick: undefined as (() => void) | undefined },
                  { label: "Available now", icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>, onClick: undefined as (() => void) | undefined },
                ] as { label: string; icon: React.ReactNode; onClick: (() => void) | undefined }[]).map(({ label, icon, onClick }) => (
                  <button key={label} onClick={onClick} className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-dark transition-colors hover:bg-gray-200">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-gray-stroke" />

            {/* Bottom toolbar */}
            {isMobileModal ? (
              <div
                className="fixed inset-x-0 z-[10] flex items-center gap-2 border-t border-gray-stroke bg-white px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]"
                style={{ bottom: keyboardOffset }}
              >
                <button onClick={() => fileInputRef.current?.click()} disabled={images.length >= 4}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover disabled:opacity-30"
                  title={images.length >= 4 ? "Maximum 4 images" : "Add photo"}>
                  <ImageIcon size={24} strokeWidth={1.75} />
                </button>
                {images.length > 0 && (
                  <span className="text-[11px] font-medium text-gray-light">{images.length}/4</span>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                {charCount > 0 && (
                  <div className="ml-auto relative flex items-center justify-center">
                    <svg width="26" height="26" viewBox="0 0 26 26">
                      <circle cx="13" cy="13" r={circleR} fill="none" stroke="#E5E5E5" strokeWidth="2.5" />
                      <circle cx="13" cy="13" r={circleR} fill="none" stroke={overLimit ? "#EF4444" : nearLimit ? "#F59E0B" : "#222222"}
                        strokeWidth="2.5" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
                        transform="rotate(-90 13 13)" style={{ transition: "stroke-dashoffset 0.1s, stroke 0.2s" }} />
                    </svg>
                    {nearLimit && <span className={`absolute text-[10px] font-semibold ${overLimit ? "text-red-500" : "text-amber-500"}`}>{remaining}</span>}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => fileInputRef.current?.click()} disabled={images.length >= 4}
                    className="flex h-9 items-center justify-center gap-1 rounded-full px-2 transition-colors text-gray-light hover:bg-gray-hover disabled:opacity-30"
                    title={images.length >= 4 ? "Maximum 4 images" : "Add photo"}>
                    <ImageIcon size={24} strokeWidth={1.5} />
                    {images.length > 0 && (
                      <span className="text-[11px] font-medium">{images.length}/4</span>
                    )}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                </div>
                <div className="flex items-center gap-3">
                  {charCount > 0 && (
                    <div className="relative flex items-center justify-center">
                      <svg width="26" height="26" viewBox="0 0 26 26">
                        <circle cx="13" cy="13" r={circleR} fill="none" stroke="#E5E5E5" strokeWidth="2.5" />
                        <circle cx="13" cy="13" r={circleR} fill="none" stroke={overLimit ? "#EF4444" : nearLimit ? "#F59E0B" : "#222222"}
                          strokeWidth="2.5" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
                          transform="rotate(-90 13 13)" style={{ transition: "stroke-dashoffset 0.1s, stroke 0.2s" }} />
                      </svg>
                      {nearLimit && <span className={`absolute text-[10px] font-semibold ${overLimit ? "text-red-500" : "text-amber-500"}`}>{remaining}</span>}
                    </div>
                  )}
                  <button onClick={submitPost}
                    disabled={(!text.trim() && images.length === 0) || overLimit || posting}
                    className="flex items-center gap-1.5 rounded-[8px] bg-gray-dark px-6 py-2 text-[13px] font-semibold text-white transition-opacity disabled:opacity-40 enabled:hover:opacity-90">
                    {posting && (
                      <motion.span
                        className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    {posting ? "Posting…" : isEditing ? "Save" : "Post"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>,
    document.body
  );
}

// ─── Go Live Modal ────────────────────────────────────

const LIVE_TOPICS = ["MBA Admissions", "Career Coaching", "Resume Review", "Interview Prep", "Law School", "Med School"];
const MOCK_LIVE_COMMENTS = [
  { user: "sarah_m", text: "So excited for this!", delay: 1.2 },
  { user: "jordan_k", text: "Thanks for doing this 🙏", delay: 3.5 },
  { user: "priya_c", text: "Can you talk about essays?", delay: 5.8 },
  { user: "alex_w", text: "Joining from NYC!", delay: 7.2 },
  { user: "mike_t", text: "This is exactly what I needed", delay: 9.1 },
  { user: "lisa_r", text: "How long will this be?", delay: 11.4 },
  { user: "david_h", text: "👏👏👏", delay: 13.0 },
  { user: "emma_s", text: "Can we get a recording after?", delay: 15.5 },
];

function GoLiveModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<"setup" | "live">("setup");
  const [title, setTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [viewers, setViewers] = useState(1);
  const [visibleComments, setVisibleComments] = useState<typeof MOCK_LIVE_COMMENTS>([]);
  const [elapsed, setElapsed] = useState(0);

  // Tick viewer count up while live
  useEffect(() => {
    if (stage !== "live") return;
    const t = setInterval(() => {
      setViewers(v => v + Math.floor(Math.random() * 3));
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  // Push mock comments while live
  useEffect(() => {
    if (stage !== "live") return;
    const timers = MOCK_LIVE_COMMENTS.map(c =>
      setTimeout(() => setVisibleComments(prev => [...prev.slice(-6), c]), c.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={stage === "setup" ? onClose : undefined}>
      <motion.div
        className="relative w-full max-w-[480px] mx-4 overflow-hidden rounded-2xl bg-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {stage === "setup" ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-stroke">
              <h2 className="text-[15px] font-semibold text-gray-dark">Go Live</h2>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Camera preview */}
            <div className="mx-5 mt-5 aspect-video overflow-hidden rounded-xl bg-[#111] flex flex-col items-center justify-center gap-3">
              <img src={profilePhoto} alt="You" className="h-20 w-20 rounded-full object-cover opacity-60 ring-2 ring-white/20" />
              <p className="text-[11px] text-white/50">Camera preview</p>
            </div>

            {/* Title input */}
            <div className="px-5 mt-4">
              <label className="text-[11px] font-medium text-gray-light">Stream title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What are you talking about today?"
                className="mt-1.5 w-full rounded-lg border border-gray-stroke px-3 py-2.5 text-[13px] text-gray-dark outline-none focus:border-gray-dark transition-colors"
              />
            </div>

            {/* Topic chips */}
            <div className="px-5 mt-4">
              <label className="text-[11px] font-medium text-gray-light">Topic</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {LIVE_TOPICS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTopic(t === selectedTopic ? null : t)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${t === selectedTopic ? "bg-gray-dark text-white" : "bg-gray-100 text-gray-dark hover:bg-gray-200"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Go live button */}
            <div className="px-5 py-5">
              <button
                onClick={() => setStage("live")}
                disabled={!title.trim()}
                className="w-full rounded-lg bg-red-500 py-3 text-[14px] font-semibold text-white transition-opacity disabled:opacity-40 hover:opacity-90"
              >
                <span className="mr-2">●</span> Go Live
              </button>
            </div>
          </>
        ) : (
          /* ── Live stage ── */
          <div className="relative aspect-[9/16] max-h-[75vh] bg-[#0a0a0a] flex flex-col overflow-hidden">
            {/* Video bg — blurred profile photo */}
            <img src={profilePhoto} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl scale-110" />
            <img src={profilePhoto} alt="You" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full object-cover ring-4 ring-white/20 shadow-2xl" />

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-[11px] font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">{formatTime(elapsed)}</span>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {viewers.toLocaleString()}
              </span>
            </div>

            {/* Title */}
            <div className="relative z-10 px-4 mt-3">
              <p className="text-[13px] font-semibold text-white drop-shadow">{title}</p>
              {selectedTopic ? <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">{selectedTopic}</span> : null}
            </div>

            {/* Live comments */}
            <div className="relative z-10 mt-auto px-4 pb-2 flex flex-col gap-1.5">
              <AnimatePresence>
                {visibleComments.map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white font-semibold">{c.user[0].toUpperCase()}</div>
                    <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] text-white backdrop-blur-sm"><span className="font-semibold">{c.user}</span> {c.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 flex items-center justify-between px-4 pb-5 pt-3 bg-gradient-to-t from-black/60 to-transparent">
              <button className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-[12px] font-medium text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Comment
              </button>
              <button onClick={onClose} className="rounded-full bg-red-500/90 px-5 py-2 text-[12px] font-semibold text-white hover:bg-red-600 transition-colors">
                End stream
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}

// ─── Right Sidebar ─────────────────────────────────────


export function CategorySubtitle({ photos, experts }: { photos: string[]; experts: string }) {
  return (
    <span className="inline-flex items-center gap-[6px] align-middle">
      <span className="inline-flex">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="inline-block h-[14px] w-[14px] shrink-0 rounded-full border border-white object-cover"
            style={{ marginLeft: i === 0 ? 0 : "-3px" }}
          />
        ))}
      </span>
      {experts}
    </span>
  );
}

// Popular experts — each row can be dismissed; the whole card hides once empty.
const POPULAR_EXPERTS = [
  { name: "Jasmine Singer", photo: pic1, headline: "Experienced Product Leader at LinkedIn | Ex-..." },
  { name: "Jackson Ringger", photo: pic3, headline: "Ex-McKinsey Consultant | Wharton MBA" },
  { name: "Erika Mah", photo: pic5, headline: "MBA Expert | Stanford GSB | 100+ M7 Admits" },
];

function ExpertRow({ expert, onDismiss }: { expert: (typeof POPULAR_EXPERTS)[number]; onDismiss: () => void }) {
  const [following, setFollowing] = useState(false);
  return (
    <SidebarCard
      variant="coach"
      image={expert.photo}
      title={expert.name}
      subtitle={expert.headline}
      right={
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="secondary" rounded="rounded-full" onClick={() => setFollowing((f) => !f)} className="min-w-[74px] font-semibold">
            {following ? "Following" : "Follow"}
          </Button>
          <button
            onClick={onDismiss}
            aria-label={`Dismiss ${expert.name}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      }
    />
  );
}

function PopularExperts() {
  const [experts, setExperts] = useState(POPULAR_EXPERTS);
  if (experts.length === 0) return null;
  return (
    <SidebarSectionCard title="Popular experts" to="/browse" bleed={false}>
      {experts.map((e) => (
        <ExpertRow key={e.name} expert={e} onDismiss={() => setExperts((prev) => prev.filter((x) => x.name !== e.name))} />
      ))}
    </SidebarSectionCard>
  );
}

export function HomeRightSidebar({ showUpcoming }: { showUpcoming?: boolean } = {}) {
  const { pathname } = useLocation();
  const isAltNav = pathname.startsWith("/alt-nav");
  // Defaults to the alt-nav behavior, but callers (e.g. the dashboard, which
  // already lists upcoming sessions in its main column) can suppress the card.
  const upcoming = showUpcoming ?? isAltNav;
  return (
    <div className="flex flex-col gap-[14px]">
      {/* Upcoming sessions — alt-nav only */}
      {upcoming && (
        <SidebarSectionCard title="Upcoming sessions" to="/alt-nav/calendar" bleed>
          <SessionCard size="small" title="Alex <> Jessica" dateTime="Today, 5:45 PM" duration="30m" day={16} image={pic6} type="coach" status="upcoming" subtitleColorClass="text-gray-dark" />
          <SessionCard size="small" title="Resume Review" dateTime="Tomorrow, 11:00 AM" duration="45m" day={17} image={pic4} type="coach" status="upcoming" subtitleColorClass="text-gray-dark" />
        </SidebarSectionCard>
      )}

      {/* Livestreams */}
      <SidebarSectionCard title="Livestreams" to="/events" bleed={false}>
        <SidebarCard
          variant="event"
          live
          image={eventImg1}
          title="MBA Strategy Live"
          subtitle={<><span className="font-medium text-[#FB5A42]">Live now</span> · 125 registered</>}
          right={<Button size="sm" variant="dark" rounded="rounded-full" className="w-fit">Join</Button>}
        />
        <SidebarCard
          variant="event"
          image={eventImg2}
          title="Tech Consulting Workshop"
          subtitle="Starts 4:30 PM · 89 registered"
        />
        <SidebarCard
          variant="event"
          image={eventImg3}
          title="Interview Prep Session"
          subtitle="Tomorrow, 2:00 PM · 54 registered"
        />
      </SidebarSectionCard>

      {/* Popular categories — hidden in alt-nav */}
      {!isAltNav && (
        <SidebarSectionCard title="Popular categories" bleed={false}>
          <SidebarCard
            variant="category"
            image={categoryInvestmentBanking}
            title="Investment Banking"
            subtitle={<CategorySubtitle photos={[pic1, pic4, pic5]} experts="234 experts" />}
          />
          <SidebarCard
            variant="category"
            image={categoryAI}
            title="AI Automation & Agents"
            subtitle={<CategorySubtitle photos={[pic6, pic7, pic8]} experts="300 experts" />}
          />
          <SidebarCard
            variant="category"
            image={categoryGMAT}
            title="GMAT Tutoring"
            subtitle={<CategorySubtitle photos={[pic2, pic3, pic10]} experts="156 experts" />}
          />
        </SidebarSectionCard>
      )}

      {/* Popular experts */}
      <PopularExperts />

      {/* Footer links — inline directly below the last card */}
      <div className="px-2 pt-1">
        <p className="text-[12px] leading-[1.7] text-gray-extra-light">
          {["About", "Help", "Careers", "Blog", "Coaches", "Privacy", "Terms"].map((l, i) => (
            <span key={l}>
              {i > 0 && <span className="mx-1">·</span>}
              <a href="#" className="transition-opacity hover:opacity-70">{l}</a>
            </span>
          ))}
        </p>
        <p className="mt-3 text-[12px] text-gray-extra-light">© 2026 Leland</p>
      </div>
    </div>
  );
}

// ─── Left Sidebar ──────────────────────────────────────

// Experts the user has purchased time with — shown as a photo grid with the
// remaining time under each.
const MY_EXPERTS = [
  { name: "Jessica", photo: pic6, timeLeft: "45m left" },
  { name: "Marcus", photo: pic1, timeLeft: "Out of time", outOfTime: true },
  { name: "Priya", photo: pic3, timeLeft: "1h 20m left" },
  { name: "David", photo: pic5, timeLeft: "30m left" },
  { name: "Elena", photo: pic7, timeLeft: "3h left" },
  { name: "Sofia", photo: pic8, timeLeft: "1h left" },
];

// A sidebar section rendered as a card: large bold header with a small "See all"
// link in the top-right corner, then the section's content.
function SidebarSectionCard({ title, to, bleed = true, children }: { title: string; to?: string; bleed?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[#222222]/[0.12] bg-white p-4">
      <div className="mb-3 flex items-start justify-between">
        <h2 className="text-[17px] font-bold leading-tight text-gray-dark">{title}</h2>
        {to && (
          <NavLink to={to} className="shrink-0 text-[13px] font-medium leading-none text-gray-extra-light transition-opacity hover:opacity-80">
            See all
          </NavLink>
        )}
      </div>
      <div className={`flex flex-col ${bleed ? "-mx-2" : ""}`}>{children}</div>
    </div>
  );
}

export function HomeSidebar({ onCreatePost }: { onCreatePost: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-[14px]">
      {/* Profile card — the dashboard's profile summary, in its non-expert form */}
      <DashboardProfileCard expert={false} />

      {/* Next session + calendar link */}
      <div className="rounded-[12px] border border-[#222222]/[0.12] bg-white">
        <div className="p-2">
          <SessionCard size="small" title="Alex <> Jessica" dateTime="Today, 5:45 PM" duration="30m" day={16} image={pic6} type="coach" status="upcoming" subtitleColorClass="text-gray-dark" />
        </div>
        <NavLink
          to="/dashboard"
          className="flex items-center justify-center gap-1.5 rounded-b-[12px] border-t border-[#222222]/[0.12] py-[14px] text-[15px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
        >
          View full calendar
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavLink>
      </div>

      {/* My Experts */}
      <SidebarSectionCard title="My experts" to="/dashboard" bleed={false}>
        <div className="grid grid-cols-3 gap-x-3">
          {MY_EXPERTS.slice(0, 3).map((e) => (
            <NavLink key={e.name} to="/coach-profile" className="group flex flex-col items-center text-center transition-opacity hover:opacity-90">
              <img src={e.photo} alt={e.name} className="h-12 w-12 rounded-full object-cover" />
              <p className="mt-2 w-full truncate text-[14px] font-semibold leading-tight text-gray-dark">{e.name}</p>
              <p className={`mt-0.5 text-[12px] font-medium leading-tight ${e.outOfTime ? "text-gray-extra-light" : "text-gray-light"}`}>{e.timeLeft}</p>
            </NavLink>
          ))}
        </div>
      </SidebarSectionCard>

      <Button onClick={() => navigate("/dashboard")} size="md" variant="secondary" rounded="rounded-full" className="self-start font-semibold">
        View dashboard
      </Button>
    </div>
  );
}

// ─── Composer prompts ────────────────────────────────

const composerPrompts = [
  "What's on your mind?",
  "Does anyone have a good GMAT practice test?",
  "Who's the best expert for MBA admissions?",
  "Any tips for Columbia's essays this cycle?",
  "Looking for case prep resource recommendations...",
  "Share a win with the community!",
  "What's your biggest MBA application challenge?",
  "Ask the community anything...",
];

// ─── Page ─────────────────────────────────────────────

export default function Home() {
  useEffect(() => { document.title = "Leland Prototype | Feed"; }, []);
  const { version } = useVersion();
  // In alt-nav the feed card fades in on mount, matching the post detail.
  const { pathname } = useLocation();
  const isAltNav = pathname.startsWith("/alt-nav");
  const [composeOpen, setComposeOpen] = useState(false);
  const [goLiveOpen, setGoLiveOpen] = useState(false);
  // "People to follow → See all" swaps the center feed for the full accounts list.
  const [peopleView, setPeopleView] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const isMobile = useIsMobile();
  // Pull-to-refresh state
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  useSetLeftSidebar(<HomeSidebar onCreatePost={() => setComposeOpen(true)} />);
  useSetRightSidebar(<HomeRightSidebar />);
  // Copy, don't alias: handlePublish mutates `posts` (so /post/:id resolves),
  // which would double-insert if this state shared the same array reference.
  const [feedPosts, setFeedPosts] = useState<Post[]>(() => [...posts]);
  // The post the user is quoting ("repost with your thoughts"); drives the
  // quote composer modal.
  const [quoteTarget, setQuoteTarget] = useState<Post | null>(null);
  // When the full-width save toast is up, lift the FAB above it so the toast's
  // dismiss (X) stays tappable.
  const { active: savedToastActive } = useSavedToast();
  const { dark: darkMode } = useDarkMode();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (y < 80) setNavHidden(false);
      else if (delta > 6) setNavHidden(true);
      else if (delta < -6) setNavHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pull-to-refresh: drag down from the top of the feed to trigger a refresh.
  // Only on mobile, and only when scrollY === 0. Drag is dampened for an
  // elastic feel; release past 70px triggers a ~1.2s spinner before settling.
  useEffect(() => {
    if (!isMobile) return;
    let startY: number | null = null;
    let current = 0;
    const THRESHOLD = 70;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || refreshing) return;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY === null) return;
      if (window.scrollY > 0) { startY = null; current = 0; setPullY(0); return; }
      const dy = e.touches[0].clientY - startY;
      if (dy > 0) {
        // Block iOS Safari's native pull-to-refresh — overscroll-behavior
        // alone isn't reliable for forceful flicks. Requires passive: false.
        if (e.cancelable) e.preventDefault();
        current = Math.min(dy * 0.5, 120);
        setPullY(current);
      }
    };
    const onTouchEnd = () => {
      if (startY === null) return;
      startY = null;
      if (current > THRESHOLD) {
        setRefreshing(true);
        setPullY(56);
        window.setTimeout(() => {
          setFeedPosts(prev => shuffle(prev));
          setRefreshing(false);
          setPullY(0);
          current = 0;
        }, 1200);
      } else {
        setPullY(0);
        current = 0;
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [isMobile, refreshing]);

  const handleEdit = (id: number, text: string, postImages: ImageEntry[]) => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (postImages.length > 0) {
        return { ...p, type: "image" as const, body: text, images: postImages.map(img => img.cropped), imageAspectRatios: postImages.map(img => img.aspectRatio) };
      }
      return { ...p, type: "text" as const, body: text } as Post;
    }));
  };

  // New-composer publishes: prepend to the feed AND register in the global
  // posts array so the post's own page (/post/:id) resolves.
  const [draftToast, setDraftToast] = useState(false);
  const [schedToast, setSchedToast] = useState(false);
  const [composeInDrafts, setComposeInDrafts] = useState(false);
  const [composeDraftsTab, setComposeDraftsTab] = useState<"Drafts" | "Scheduled">("Drafts");
  const handleDraftSaved = () => {
    setDraftToast(true);
    window.setTimeout(() => setDraftToast(false), 2600);
  };
  const handleScheduled = () => {
    setSchedToast(true);
    window.setTimeout(() => setSchedToast(false), 2600);
  };

  const handlePublish = (newPost: Post) => {
    posts.unshift(newPost);
    setFeedPosts(prev => [newPost, ...prev]);
  };

  const handlePost = (text: string, postImages: ImageEntry[]) => {
    const base = {
      id: Date.now(),
      author: "Jamie Allen",
      avatar: profilePhoto,
      time: "just now",
      verified: true,
      headline: "Interactive Lead at Airbnb",
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
    };
    const newPost: Post = postImages.length > 0
      ? {
          ...base,
          type: "image",
          body: text,
          images: postImages.map(img => img.cropped),
          imageAspectRatios: postImages.map(img => img.aspectRatio),
        }
      : {
          ...base,
          type: "text",
          body: text,
        };
    setFeedPosts(prev => [newPost, ...prev]);
  };

  // Simple repost: re-surface the post at the top of the feed, attributed to
  // the current user. No new post is created — it's the original content with
  // a "You reposted" header. The clone uses the negated canonical id so undo
  // can find and remove it, and repost state stays tied to the original.
  const handleRepost = (post: Post) => {
    const canonicalId = post.repostOfId ?? post.id;
    const cloneId = -canonicalId;
    setFeedPosts(prev =>
      prev.some(p => p.id === cloneId)
        ? prev
        : [{ ...post, id: cloneId, repostedBy: "You", repostOfId: canonicalId } as Post, ...prev],
    );
  };

  const handleUndoRepost = (post: Post) => {
    const canonicalId = post.repostOfId ?? post.id;
    setFeedPosts(prev => prev.filter(p => p.id !== -canonicalId));
  };

  // Quote ("repost with your thoughts"): create a new post owned by the current
  // user, carrying their commentary plus an embedded snapshot of the original.
  const handleQuotePost = (text: string) => {
    if (!quoteTarget) return;
    const q = quoteTarget;
    const quote: QuotePost = {
      id: Date.now(),
      type: "quote",
      author: "Jamie Allen",
      avatar: profilePhoto,
      time: "just now",
      verified: true,
      headline: "Interactive Lead at Airbnb",
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
      body: text,
      quoted: {
        id: q.id,
        author: q.author,
        avatar: q.avatar,
        time: q.time,
        verified: q.verified,
        body: q.body,
        image: q.type === "image" ? q.images[0] : undefined,
      },
    };
    setFeedPosts(prev => [quote, ...prev]);
  };

  if (peopleView) {
    return (
      <div className="-mt-3 md:mt-0">
        <PeopleToFollowFull onBack={() => setPeopleView(false)} />
      </div>
    );
  }

  return (
    <div className="-mt-3 md:mt-0">
      {/* Feed card — one bordered container wrapping the composer and the whole
          post list, so the border runs around all edges. Horizontal padding
          lives on the composer and each post row (dividers run full-bleed to
          the border while post content stays inset). */}
      <motion.div
        {...(isAltNav ? { initial: FADE_IN.initial, animate: FADE_IN.animate, transition: FADE_TRANSITION } : {})}
        className="rounded-2xl border border-gray-stroke bg-white"
      >
      {/* Post composer — hidden on mobile (composer lives in the floating
          + button there). A borderless prompt with a Post button; clicking
          anywhere in the row opens the compose modal. */}
      <div
        onClick={() => setComposeOpen(true)}
        className="hidden cursor-pointer md:flex items-center gap-3 border-b border-gray-stroke px-4 py-3 sm:px-6"
      >
        <img
          src={profilePhoto}
          alt="Your profile"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <span className="flex-1 truncate text-left text-[15px] text-gray-light">
          What's on your mind?
        </span>
        <Button
          size="md"
          variant="outline"
          rounded="rounded-[6px]"
          onClick={() => setComposeOpen(true)}
          className="shrink-0 font-semibold shadow-[0_1px_2px_0_rgba(16,24,40,0.06)]"
        >
          Post
        </Button>
      </div>

      {/* Pull-to-refresh slot — sits between the composer and the feed (top
          nav stays sticky), pushing the feed down as the user drags. Mobile
          only. */}
      {isMobile && (
        <div
          className="flex items-end justify-center overflow-hidden"
          style={{
            height: refreshing ? 56 : pullY,
            transition: refreshing || pullY === 0 ? "height 0.22s ease-out" : "none",
          }}
        >
          <div
            className="pb-3"
            style={{
              opacity: Math.min(1, pullY / 50 + (refreshing ? 1 : 0)),
            }}
          >
            <div className={`ios-spinner${refreshing ? " spinning" : ""}`}>
              <i /><i /><i /><i /><i /><i /><i /><i />
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="divide-y divide-gray-stroke">
        {feedPosts.map((post, i) => (
          <Fragment key={post.id}>
            <div className={`px-4 sm:px-6 ${POST_HOVER_SHADOW}`}>
              <FeedPost post={post} onUpdate={handleEdit} onRepost={handleRepost} onUndoRepost={handleUndoRepost} onQuote={setQuoteTarget} />
            </div>
            {/* Rendered as its own feed row (not inside the post's hover div) so
                it doesn't share the post's hover state; divide-y gives its top
                border. */}
            {i === 3 && <PeopleToFollow onSeeAll={() => setPeopleView(true)} />}
          </Fragment>
        ))}
      </div>
      </motion.div>{/* /Feed card */}

      {/* Mobile floating compose button — sits 24px above the bottom nav
          (matching its 24px inset from the right edge), and slides down when
          the nav hides on scroll. */}
      <button
        onClick={() => setComposeOpen(true)}
        aria-label="Create post"
        style={{ transform: `translateY(${savedToastActive ? -122 : navHidden ? 0 : -66}px)` }}
        className={`fixed bottom-[calc(max(env(safe-area-inset-bottom),20px)+16px)] right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-200 ease-out active:scale-95 md:hidden ${darkMode ? "bg-[#FFD96F] text-[#222222]" : "bg-[#222222] text-white"}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {composeOpen ? <Composer onClose={() => { setComposeOpen(false); setComposeInDrafts(false); }} onPublish={handlePublish} onDraftSaved={handleDraftSaved} onScheduled={handleScheduled} openDraftsOnMount={composeInDrafts} draftsTabOnMount={composeDraftsTab} /> : null}
      {/* Draft-saved toast — portaled so the tab bar's stacking context can't cover it */}
      {createPortal(
        <AnimatePresence>
          {draftToast ? (
            <div key="draft" className="pointer-events-none fixed inset-x-0 bottom-[calc(max(env(safe-area-inset-bottom),20px)+76px)] z-[80] flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                onClick={() => { setDraftToast(false); setComposeDraftsTab("Drafts"); setComposeInDrafts(true); setComposeOpen(true); }}
                className="pointer-events-auto flex cursor-pointer items-center gap-2 rounded-full bg-gray-dark px-4 py-2.5"
              >
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
                <span className="whitespace-nowrap text-[14px] font-medium text-white">Draft saved</span>
                <span className="whitespace-nowrap text-[14px] font-semibold text-white/70">· View</span>
              </motion.div>
            </div>
          ) : null}
          {schedToast ? (
            <div key="sched" className="pointer-events-none fixed inset-x-0 bottom-[calc(max(env(safe-area-inset-bottom),20px)+76px)] z-[80] flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                onClick={() => { setSchedToast(false); setComposeDraftsTab("Scheduled"); setComposeInDrafts(true); setComposeOpen(true); }}
                className="pointer-events-auto flex cursor-pointer items-center gap-2 rounded-full bg-gray-dark px-4 py-2.5"
              >
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                <span className="whitespace-nowrap text-[14px] font-medium text-white">Post scheduled</span>
                <span className="whitespace-nowrap text-[14px] font-semibold text-white/70">· View</span>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
      {quoteTarget ? <ComposeModal quotePost={quoteTarget} onClose={() => setQuoteTarget(null)} onPost={handleQuotePost} isMVP={version === "A"} /> : null}
      {goLiveOpen ? <GoLiveModal onClose={() => setGoLiveOpen(false)} /> : null}
    </div>
  );
}
