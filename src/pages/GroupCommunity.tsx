import { useState } from "react";
import { useSetLeftSidebar } from "../components/LeftSidebarContext";
import { useSetRightSidebar } from "../components/RightSidebarContext";
import { FeedPost, ComposeModal, type Post, type ImageEntry } from "./Home";
import SidebarCard, { SidebarGroup } from "../components/SidebarCard";

import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import profilePhoto from "../assets/profile photos/profile photo.png";

// ─── Data ─────────────────────────────────────────────

const GROUP = {
  name: "Law School",
  emoji: "⚖️",
  accentColor: "#1e3a5f",
  tagline: "LSAT prep, applications, and law school life.",
  description:
    "A community for pre-law students and law school applicants — LSAT strategy, school selection, personal statement feedback, and advice from people who've been through it.",
  memberCount: 1240,
  helpfulLinks: [
    { label: "Browse Law Coaches", description: "Find LSAT tutors and admissions advisors" },
    { label: "LSAT Resources", description: "Study plans, drill sets, and prep guides" },
    { label: "School Profiles", description: "Rankings, culture, employment outcomes" },
    { label: "Community Guidelines", description: "How we keep this space helpful and professional" },
  ],
};

const TOP_CONTRIBUTORS = [
  { name: "Rachel Nguyen", avatar: pic9, headline: "1L at Yale Law School | Pre-Law Coach" },
  { name: "Olivia Park", avatar: pic11, headline: "Pre-Law Admissions Coach | Yale JD '21" },
  { name: "Michael Chen", avatar: pic10, headline: "2L at Columbia Law | Former Finance Analyst" },
  { name: "James Allen", avatar: pic1, headline: "Former Director at Stanford GSB" },
];

const LAW_POSTS: Post[] = [
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
  {
    id: 3004,
    type: "text",
    author: "Marcus Williams",
    avatar: pic2,
    time: "3d",
    verified: false,
    headline: "Stanford GSB '26 | Former Pre-Law",
    feed: "Law School",
    body: "Changed my mind from law to MBA halfway through applications. Best decision I ever made — but it took me two years and a lot of wasted LSAT prep to figure out what I actually wanted.\n\nIf you're pre-law and not sure why, talk to a lawyer first. Not a law student, not an admissions coach — an actual practicing attorney. Ask them what their Mondays feel like.",
    likes: 274,
    comments: 53,
    reposts: 22,
    shares: 11,
  },
];

// ─── Sidebars ──────────────────────────────────────────

function GroupCommLeft({ onCreatePost }: { onCreatePost: () => void }) {
  return (
    <div className="flex flex-col gap-5 px-1">
      {/* Group identity — profile card format */}
      <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white">
        {/* Banner */}
        <div className="relative h-[56px]" style={{ backgroundColor: GROUP.accentColor }}>
          <div className="absolute -bottom-6 left-4">
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border-[3px] border-white text-[24px] shadow-sm"
              style={{ backgroundColor: GROUP.accentColor }}
            >
              {GROUP.emoji}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pb-4 pt-10">
          <p className="text-[19px] font-medium leading-tight text-gray-dark">{GROUP.name}</p>
          <p className="mt-0.5 text-[15px] leading-snug text-gray-light">{GROUP.tagline}</p>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-medium text-gray-dark">{GROUP.memberCount.toLocaleString()}</span>
              <span className="text-[13px] text-gray-light">members</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-medium text-gray-dark">4.2K</span>
              <span className="text-[13px] text-gray-light">posts</span>
            </div>
          </div>

          <button
            onClick={onCreatePost}
            className="mt-3 w-full rounded-[10px] bg-gray-dark py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Create post
          </button>
        </div>
      </div>

    </div>
  );
}

function GroupCommRight() {
  return (
    <div className="flex flex-col gap-6 px-1">
      <SidebarGroup label="Top Contributors">
        {TOP_CONTRIBUTORS.map((m) => (
          <SidebarCard key={m.name} variant="coach" image={m.avatar} title={m.name} subtitle={m.headline} />
        ))}
      </SidebarGroup>

      <SidebarGroup label="Helpful Links" hideChevron>
        {GROUP.helpfulLinks.map((link) => (
          <SidebarCard
            key={link.label}
            variant="topic"
            icon={
              <div className="flex h-[44px] w-[80px] items-center justify-center rounded-[4px] bg-[#f5f5f5] text-[#707070]">
                {link.label === "Browse Law Coaches" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <path d="M12 2l.5 1.5H14l-1.2.9.4 1.6L12 5l-1.2 1-.4-1.6L9 3.5h1.5z" />
                  </svg>
                )}
                {link.label === "LSAT Resources" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                )}
                {link.label === "School Profiles" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6" />
                    <path d="M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                )}
                {link.label === "Community Guidelines" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                )}
              </div>
            }
            title={link.label}
            subtitle={link.description}
          />
        ))}
      </SidebarGroup>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────

export default function GroupCommunity() {
  const [composeOpen, setComposeOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(LAW_POSTS);

  useSetLeftSidebar(<GroupCommLeft onCreatePost={() => setComposeOpen(true)} />);
  useSetRightSidebar(<GroupCommRight />);

  const handleEdit = (id: number, text: string, postImages: ImageEntry[]) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (postImages.length > 0) {
        return { ...p, type: "image" as const, body: text, images: postImages.map(img => img.cropped), imageAspectRatios: postImages.map(img => img.aspectRatio) };
      }
      return { ...p, type: "text" as const, body: text } as Post;
    }));
  };

  const handlePost = (text: string, postImages: ImageEntry[]) => {
    const newPost: Post = postImages.length > 0
      ? {
          id: Date.now(), type: "image", author: "Jamie Allen", avatar: profilePhoto,
          time: "just now", verified: true, headline: "Interactive Lead at Airbnb",
          feed: "Law School", body: text,
          images: postImages.map(img => img.cropped),
          imageAspectRatios: postImages.map(img => img.aspectRatio),
          likes: 0, comments: 0, reposts: 0, shares: 0,
        }
      : {
          id: Date.now(), type: "text", author: "Jamie Allen", avatar: profilePhoto,
          time: "just now", verified: true, headline: "Interactive Lead at Airbnb",
          feed: "Law School", body: text,
          likes: 0, comments: 0, reposts: 0, shares: 0,
        };
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div>
      {/* Post composer */}
      <div className="flex items-center gap-3 border-b border-gray-stroke pb-5">
        <img src={profilePhoto} alt="Your profile" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <button
          onClick={() => setComposeOpen(true)}
          className="flex-1 rounded-full bg-gray-hover px-4 py-[10px] text-left text-[16px] text-gray-light transition-shadow hover:shadow-[0_0_0_1.5px_#111111]"
        >
          Create post
        </button>
      </div>

      {/* Feed */}
      <div className="divide-y divide-gray-stroke/50">
        {posts.map(post => (
          <FeedPost key={post.id} post={post} onUpdate={handleEdit} />
        ))}
      </div>

      {composeOpen && (
        <ComposeModal
          onClose={() => setComposeOpen(false)}
          onPost={handlePost}
          isMVP={true}
        />
      )}
    </div>
  );
}
