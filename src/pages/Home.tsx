import { useRef } from "react";
import { Link } from "react-router-dom";
import profilePhoto from "../assets/profile photos/profile photo.png";
import lelandLogo from "../assets/Logo.svg";

import likesIcon from "../assets/icons/likes.svg";
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
  };
}

type Post = TextPost | ImagePost | LinkPost | EventPost | MilestonePost;

// ─── Sample data ──────────────────────────────────────

const posts: Post[] = [
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
    avatar: lelandLogo,
    time: "1h",
    headline: "Official Leland Events",
    body: "Join us for a live panel with admissions officers from HBS, Wharton, and GSB. Get your questions answered directly — no fluff, no scripts.",
    event: {
      title: "MBA Admissions Live: Ask the Officers Anything",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&h=400&fit=crop",
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
    },
    likes: 431,
    comments: 47,
    reposts: 22,
    shares: 8,
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

function ActionBar({ likes, comments, reposts, shares, verified, isEvent }: { likes: number; comments: number; reposts: number; shares: number; verified?: boolean; isEvent?: boolean }) {
  const actions = [
    { icon: likesIcon, count: likes, label: "Like" },
    { icon: commentsIcon, count: comments, label: "Comment" },
    { icon: repostsIcon, count: reposts, label: "Repost" },
    { icon: sharesIcon, count: shares, label: "Share" },
  ];

  return (
    <div className="mt-1 flex items-center gap-2 pl-[44px]">
      {actions.map(({ icon, count, label }) => (
        <button key={label} className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-gray-light transition-colors hover:bg-gray-hover">
          <img src={icon} alt={label} className="h-[22px] w-[22px] [filter:invert(46%)]" />
          {count > 0 && label !== "Share" && <span className="text-[15px] font-normal">{formatCount(count)}</span>}
        </button>
      ))}
      {isEvent && (
        <button className="ml-auto cursor-pointer rounded-[100px] bg-[#222222]/5 px-[14px] py-1.5 text-[15px] font-medium text-[#424242] transition-colors hover:bg-[#222222]/[0.08]">
          Register for free
        </button>
      )}
      {verified && !isEvent && (
        <button className="ml-auto cursor-pointer rounded-[100px] bg-[#222222]/5 px-[14px] py-1.5 text-[15px] font-medium text-[#424242] transition-colors hover:bg-[#222222]/[0.08]">
          Free intro call
        </button>
      )}
    </div>
  );
}

function PostHeaderRow({ author, time, verified, headline }: { author: string; time: string; verified?: boolean; headline?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link to="/profile" className="cursor-pointer text-[17px] leading-tight font-medium text-gray-dark underline decoration-white decoration-[0.75px] underline-offset-2 transition-[text-decoration-color] duration-200 hover:decoration-gray-light/50">{author}</Link>
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
      className="mt-3 block max-w-[480px] overflow-hidden rounded-xl border border-gray-stroke transition-colors hover:bg-gray-hover"
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
      <img src={event.image} alt={event.title} className="h-[180px] w-full object-cover" />
      <div className="px-4 py-4">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[13px] font-medium text-primary">{event.format}</span>
        <p className="mt-2 text-[17px] font-semibold leading-snug text-gray-dark">{event.title}</p>
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
            <button className="cursor-pointer rounded-[100px] bg-[#222222]/5 px-[14px] py-1.5 text-[15px] font-medium text-[#424242] transition-colors hover:bg-[#222222]/[0.08]">
              Register for free
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MilestoneCard({ milestone }: { milestone: MilestonePost["milestone"] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-stroke">
      <div className="h-1.5 w-full" style={{ backgroundColor: milestone.schoolColor }} />
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="relative shrink-0">
          <img
            src={milestone.clientAvatar}
            alt={milestone.clientName}
            className="h-14 w-14 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
          />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[14px] shadow-sm">
            🎉
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium uppercase tracking-wide text-gray-light">Admitted</p>
          <p className="mt-0.5 text-[17px] font-semibold leading-tight text-gray-dark">{milestone.school}</p>
          <p className="text-[14px] text-gray-light">{milestone.program}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Post component ───────────────────────────────────

function FeedPost({ post }: { post: Post }) {
  return (
    <div className="pt-5 pb-[14px]">
      <div className="flex gap-3">
        {/* Left column: avatar */}
        <div className="group relative h-10 w-10 shrink-0 cursor-pointer">
          <img
            src={post.avatar}
            alt={post.author}
            className="h-10 w-10 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
          />
          <div className="absolute inset-0 rounded-full bg-black/0 transition-colors group-hover:bg-black/10" />
        </div>
        {/* Right column: content */}
        <div className="min-w-0 flex-1">
          <PostHeaderRow author={post.author} time={post.time} verified={post.verified} headline={post.headline} />
          <p className="mt-1 text-[17px] leading-[1.4] text-gray-dark">{post.body}</p>
          {post.type === "image" && <ImageGallery images={post.images} />}
          {post.type === "link" && <LinkCard link={post.link} />}
          {post.type === "event" && <EventCard event={post.event} />}
          {post.type === "milestone" && <MilestoneCard milestone={post.milestone} />}
        </div>
      </div>
      <ActionBar likes={post.likes} comments={post.comments} reposts={post.reposts} shares={post.shares} verified={post.verified} isEvent={post.type === "event"} />
    </div>
  );
}

// ─── Suggested experts ────────────────────────────────

const suggestedExperts = [
  { name: "Sarah Chen", avatar: pic1, headline: "Stanford GSB Admissions" },
  { name: "David Kim", avatar: pic4, headline: "MBA Coach | Ex-Bain" },
  { name: "Nina Kowalski", avatar: pic7, headline: "McKinsey Partner" },
  { name: "Alex Thompson", avatar: pic8, headline: "Career Coach" },
  { name: "Michael Chen", avatar: pic10, headline: "Ex-BCG Consultant" },
  { name: "Lauren Hayes", avatar: pic13, headline: "HBS Admissions Expert" },
  { name: "Jason Park", avatar: pic14, headline: "Deloitte Strategy Lead" },
];

function SuggestedExperts() {
  return (
    <div className="py-5">
      <p className="text-[17px] font-semibold text-gray-dark">Suggested experts</p>
      <div className="scrollbar-hide mt-4 flex gap-3 overflow-x-auto">
        {suggestedExperts.map((expert) => (
          <div
            key={expert.name}
            className="flex w-[160px] shrink-0 flex-col items-center rounded-2xl border border-gray-stroke px-4 pb-5 pt-6"
          >
            <button className="absolute right-0 top-0 hidden" />
            <div className="relative">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="h-[72px] w-[72px] rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
              />
              <img
                src={verifiedIcon}
                alt="Verified"
                className="absolute -bottom-0.5 -right-0.5 h-[20px] w-[20px] rounded-full bg-white"
              />
            </div>
            <p className="mt-3 w-full truncate text-center text-[15px] font-semibold text-gray-dark">
              {expert.name}
            </p>
            <p className="w-full truncate text-center text-[13px] text-gray-light">
              {expert.headline}
            </p>
            <button className="mt-4 w-full cursor-pointer rounded-xl bg-gray-dark px-4 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#222222]">
              Free intro call
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────

export default function Home() {
  return (
    <div>
      {/* Post composer */}
      <div className="flex items-center gap-3 border-b border-gray-stroke pb-5">
        <img
          src={profilePhoto}
          alt="Your profile"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Share an update..."
          className="flex-1 rounded-full bg-gray-hover px-4 py-[10px] text-[16px] text-gray-dark placeholder:text-[16px] placeholder:text-gray-light transition-shadow focus:bg-white focus:shadow-[0_0_0_2px_#222222] focus:outline-none"
        />
      </div>

      {/* Feed */}
      <div className="divide-y divide-gray-stroke">
        {posts.map((post, i) => (
          <div key={post.id}>
            <FeedPost post={post} />
            {i === 3 && <SuggestedExperts />}
          </div>
        ))}
      </div>
    </div>
  );
}
