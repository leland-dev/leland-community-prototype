import { Button } from "../components/Button";
import SeeWhatOthersShipped from "../components/SeeWhatOthersShipped";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic13 from "../assets/profile photos/pic-13.png";
import imgTriage from "../assets/img/builds/triage-agent.svg";
import imgMetrics from "../assets/img/builds/metrics-digest.svg";
import imgNotes from "../assets/img/builds/meeting-notes.svg";
import imgCrm from "../assets/img/builds/crm-cleanup.svg";
import imgLeadBrief from "../assets/img/builds/lead-brief.svg";

// Community tab — a feed of what others in your organization are building,
// questions they're asking, and wins they're sharing.

type PostType = "build" | "question" | "win";

type Post = {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  type: PostType;
  text: string;
  build?: { title: string; focus: string; image: string };
  likes: number;
  comments: number;
};

const POSTS: Post[] = [
  {
    id: "p1",
    author: "Maya Thompson",
    role: "Marketing Lead",
    avatar: pic6,
    time: "2h ago",
    type: "build",
    text: "Just shipped a weekly marketing metrics digest — it pulls every channel into one Monday summary so I stop living in spreadsheets. Happy to share how I scoped it.",
    build: { title: "Weekly marketing metrics digest", focus: "Marketing · Analytics", image: imgMetrics },
    likes: 18,
    comments: 5,
  },
  {
    id: "p2",
    author: "Ethan Carter",
    role: "Account Executive",
    avatar: pic13,
    time: "4h ago",
    type: "question",
    text: "Has anyone built a reliable meeting-notes-to-CRM flow? Mine keeps hallucinating field values when the transcript is messy. What worked for you?",
    likes: 7,
    comments: 12,
  },
  {
    id: "p3",
    author: "Ava Johnson",
    role: "Customer Success",
    avatar: pic3,
    time: "Yesterday",
    type: "win",
    text: "Our churn-risk health scorer caught two at-risk accounts last week before the QBRs. Both renewed. This program is paying for itself 🎉",
    likes: 41,
    comments: 9,
  },
  {
    id: "p4",
    author: "Lucas Gonzalez",
    role: "Ops Manager",
    avatar: pic5,
    time: "Yesterday",
    type: "build",
    text: "Built an approval routing agent that chases down stragglers automatically. Cut our average approval time from 3 days to under a day.",
    build: { title: "Approval routing agent", focus: "Operations · Automation", image: imgTriage },
    likes: 23,
    comments: 4,
  },
  {
    id: "p5",
    author: "Isabella Martinez",
    role: "Product Manager",
    avatar: pic1,
    time: "2d ago",
    type: "question",
    text: "What are folks using to analyze customer interviews at scale? Trying to keep a running doc of validated pains without re-reading every transcript.",
    likes: 11,
    comments: 15,
  },
  {
    id: "p6",
    author: "Noah Wilson",
    role: "Finance",
    avatar: pic9,
    time: "3d ago",
    type: "build",
    text: "Finally automated our rolling cash flow forecast. It flags shortfalls a few weeks ahead now instead of me finding out the hard way.",
    build: { title: "Rolling cash flow forecast", focus: "Finance · Forecasting", image: imgLeadBrief },
    likes: 29,
    comments: 6,
  },
  {
    id: "p7",
    author: "Sophia Lee",
    role: "People Ops",
    avatar: pic8,
    time: "4d ago",
    type: "question",
    text: "Anyone templatized a 1:1 prep assistant that pulls prior notes + open action items? Would love to compare prompts before I reinvent it.",
    likes: 9,
    comments: 8,
  },
  {
    id: "p8",
    author: "Jonas Clark",
    role: "Sales Ops",
    avatar: pic11,
    time: "5d ago",
    type: "win",
    text: "Our CRM cleanup agent deduped 1,400 stale records overnight. The data team actually said thank you.",
    build: { title: "CRM cleanup agent", focus: "Sales · Deal Management", image: imgCrm },
    likes: 34,
    comments: 7,
  },
];

function Stat({ icon, count }: { icon: React.ReactNode; count: number }) {
  return (
    <button type="button" className="flex items-center gap-1.5 text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark">
      {icon}
      {count}
    </button>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-stroke bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <img src={post.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-[15px] font-semibold leading-[1.3] text-gray-dark">{post.author}</p>
          <p className="truncate text-[13px] text-gray-light">{post.role} · {post.time}</p>
        </div>
      </div>

      <p className="text-[15px] leading-[1.5] text-gray-dark">{post.text}</p>

      {post.build && (
        <div className="flex items-center gap-3 rounded-xl border border-gray-stroke bg-[#F9F8F3]/60 p-3">
          <div className="h-12 w-[76px] shrink-0 overflow-hidden rounded-md border border-gray-stroke bg-gray-hover">
            <img src={post.build.image} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-[14px] font-semibold leading-[1.3] text-gray-dark">{post.build.title}</p>
            <p className="truncate text-[12px] text-gray-light">{post.build.focus}</p>
          </div>
          <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 !bg-black/5 font-semibold">View build</Button>
        </div>
      )}

      <div className="flex items-center gap-5 pt-1">
        <Stat
          count={post.likes}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" /></svg>}
        />
        <Stat
          count={post.comments}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 11.5a8.4 8.4 0 01-9 8.4 9 9 0 01-4-.9L3 21l1.1-4a8.4 8.4 0 01-.9-4 8.5 8.5 0 018.9-8.5A8.5 8.5 0 0121 11.5z" /></svg>}
        />
        <span className="ml-auto text-[14px] font-semibold text-gray-light transition-colors hover:text-gray-dark cursor-pointer">
          {post.type === "question" ? "Answer" : "Reply"}
        </span>
      </div>
    </div>
  );
}

export default function ProgramAltCommunity() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-[980px] flex-col gap-8 px-4 pb-[100px] pt-16 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">Community</h1>
        <p className="text-[16px] leading-[1.5] text-gray-light">See what others at your company are building, and what they're asking.</p>
      </div>

      {/* Composer prompt */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-stroke bg-white p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <img src={pic13} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          <button
            type="button"
            className="flex-1 rounded-full border border-gray-stroke bg-[#F9F8F3]/60 px-4 py-2.5 text-left text-[15px] text-gray-light transition-colors hover:bg-gray-hover"
          >
            Share a build or ask a question…
          </button>
        </div>
        <div className="flex items-center gap-2 pl-[52px]">
          <Button size="sm" variant="secondary" rounded="rounded-full" className="!bg-black/5 font-semibold">Share a build</Button>
          <Button size="sm" variant="secondary" rounded="rounded-full" className="!bg-black/5 font-semibold">Ask a question</Button>
        </div>
      </div>

      {/* See what others shipped */}
      <SeeWhatOthersShipped />

      {/* Feed */}
      <div className="flex flex-col gap-4">
        {POSTS.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
