import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Post, { type PostData } from "../components/Post";

import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import eventImageSrc from "../assets/img/EventImage.avif";
import lelandCompass from "../assets/leland-compass.svg";
import stanford1 from "../assets/placeholder post assets/stanford-post/00c1e12547190979b4db2978dbe211e2.jpg";
import stanford2 from "../assets/placeholder post assets/stanford-post/39a9980b59e79fa3b58e8d7d5145b9a9.jpg";
import stanford3 from "../assets/placeholder post assets/stanford-post/989ac1d56cf981c783808b83154d8a25.jpg";
import stanford4 from "../assets/placeholder post assets/stanford-post/eb80edada3b3db7955379d433ca2861a.jpg";
import orgWharton from "../assets/org-logos/wharton.png";

// ─── Variants ──────────────────────────────────────────

type Variant = "Text" | "Image" | "Link" | "Event" | "Milestone" | "Live";

const variants: Variant[] = ["Text", "Image", "Link", "Event", "Milestone", "Live"];

const posts: Record<Variant, { description: string; post: PostData }> = {
  Text: {
    description: "A plain-text post. Used for opinions, updates, and announcements.",
    post: {
      id: 101,
      type: "text",
      author: "James Allen",
      avatar: pic1,
      time: "2h",
      verified: true,
      headline: "Former Director of Admissions at Stanford GSB",
      body: "Hot take: the GMAT is not the most important part of your MBA application. I've seen 780 scorers get rejected and 680 scorers get into M7. Your story matters more than your score.",
      likes: 521,
      comments: 63,
      reposts: 34,
      shares: 12,
    },
  },
  Image: {
    description: "Post with an attached photo or multi-image gallery (up to 4 images). Supports 1, 2, 3, or 4-image layouts.",
    post: {
      id: 102,
      type: "image",
      author: "Marcus Williams",
      avatar: pic2,
      time: "4h",
      body: "Stanford GSB admit weekend was everything I hoped for and more. The campus, the people, the energy — can't wait to start in the fall.",
      images: [stanford1, stanford2, stanford3, stanford4],
      likes: 384,
      comments: 42,
      reposts: 12,
      shares: 8,
    },
  },
  Link: {
    description: "Post with an external link preview card showing the article image, domain, and headline.",
    post: {
      id: 103,
      type: "link",
      author: "Priya Patel",
      avatar: pic3,
      time: "6h",
      body: "This article perfectly captures why networking in MBA admissions is so misunderstood. It's not about collecting contacts — it's about genuine curiosity.",
      link: {
        url: "https://hbr.org",
        domain: "hbr.org",
        title: "The Art of Networking in Business School Admissions",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=340&fit=crop",
      },
      likes: 89,
      comments: 7,
      reposts: 23,
      shares: 11,
    },
  },
  Event: {
    description: "Post promoting a Leland event. Shows event image, date, time, registration count, and a register CTA.",
    post: {
      id: 104,
      type: "event",
      author: "Leland",
      avatar: lelandCompass,
      time: "1h",
      headline: "Official Leland Events",
      body: "Curious about public policy grad school? Join Sarah Esquivel — Former Associate Director of Admissions at a Top 3 Public Policy School — for a live Ask Me Anything.",
      event: {
        title: "Public Policy Graduate Programs: Ask Me Anything",
        image: eventImageSrc,
        date: "Thursday, April 3, 2026",
        time: "6:00 PM – 7:30 PM PT",
        format: "Online",
        spotsLeft: 38,
        registered: 142,
      },
      likes: 214,
      comments: 29,
      reposts: 61,
      shares: 12,
    },
  },
  Milestone: {
    description: "Coach sharing a client admission win. Features animated confetti, overlapping school + client avatars, and a congratulate CTA.",
    post: {
      id: 105,
      type: "milestone",
      author: "David Kim",
      avatar: pic4,
      time: "2h",
      verified: true,
      headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
      body: "Incredibly proud of my client Jordan. We worked together for 6 months — rebuilding his narrative from scratch, reframing his non-traditional background into his biggest asset. Today he got the call from Wharton. This is why I do this work.",
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
  },
  Live: {
    description: "Coach hosting a live office hours session. Shows the live video embed, viewer count, chat overlay, and a ticketed Join CTA.",
    post: {
      id: 106,
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
  },
};

// ─── Page ──────────────────────────────────────────────

export default function PostTest() {
  useEffect(() => { document.title = "Component: Post"; }, []);
  const [active, setActive] = useState<Variant>("Text");
  const { description, post } = posts[active];

  return (
    <PageShell variant="thin">
      {/* Header */}
      <Link to="/components" className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[13px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]">&lt;COMPONENT&gt;</Link>
      <h1 className="mt-1 text-[40px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Post</h1>
      <p className="mt-1 text-[18px] text-[#707070]">
        The core content unit of the community feed. Supports six content types, each with type-specific attachments, interactive actions, and shared author metadata.
      </p>

      {/* Variant pills */}
      <div className="mt-6 flex flex-wrap gap-[6px]">
        {variants.map((v) => (
          <button
            key={v}
            onClick={() => setActive(v)}
            className={`cursor-pointer rounded-full px-[14px] py-[6px] text-[14px] font-medium text-[#222222] ${
              active === v
                ? "border-[1.5px] border-[#222222] bg-[#f5f5f5]"
                : "border-[1.5px] border-transparent bg-[#f5f5f5] transition-colors hover:bg-[#ebebeb]"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Demo */}
      <section className="mt-6">
        <p className="mb-4 text-[18px] text-[#707070]">{description}</p>
        <div
          className="rounded-[32px] bg-[#F0F0F0] p-3"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` }}
        >
          <div className="rounded-[24px] bg-white px-4" style={{ boxShadow: "0 20px 24px -4px rgba(16, 24, 40, 0.08)" }}>
            <Post post={post} />
          </div>
        </div>
      </section>

      <div className="h-16" />
    </PageShell>
  );
}
