import { useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";

import { useSetRightSidebar } from "../components/RightSidebarContext";
import { useSetLeftSidebar } from "../components/LeftSidebarContext";
import { useSetNavBackHandler } from "../components/NavThemeContext";
import { FADE_IN, FADE_TRANSITION } from "../lib/pushTransition";
import {
  FeedPost,
  HomeRightSidebar,
  HomeSidebar,
  POST_HOVER_SHADOW,
  type Post,
} from "./Home";
import { QUESTIONS, type FeaturedQuestion } from "../components/FeaturedQuestions";
import { ALL_QUESTIONS } from "./AnswerQuestions";

import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic12 from "../assets/profile photos/pic-12.png";

// ─── Types + seed answers ─────────────────────────────

interface AnswerData {
  id: number;
  author: string;
  avatar: string;
  headline?: string;
  time: string;
  body: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  verified?: boolean;
}

// A pool of expert answers reused across questions — sliced to each question's
// "answered" count so the page reflects the number shown on the card.
const ANSWER_POOL: Omit<AnswerData, "id" | "comments" | "reposts" | "shares">[] = [
  { author: "Priya Patel", avatar: pic3, verified: true, headline: "Admissions Expert · Ex-HBS AdCom", time: "1d", likes: 42, body: "Anchor it in one consistent underlying motivation, then let the pivot be evidence of it — not the story itself. Admissions reward focus of purpose, not a single unbroken job title." },
  { author: "David Kim", avatar: pic4, headline: "MBA Consultant · Ex-Bain", time: "22h", likes: 31, body: "Lead with the throughline. When someone changes lanes, the reader is scanning for \"why should I believe this next step is real?\" — give them a concrete moment that made the shift inevitable." },
  { author: "Emma Rodriguez", avatar: pic5, headline: "Career Coach", time: "18h", likes: 27, body: "One tactical note: don't over-explain the past. Spend ~20% justifying where you've been and ~80% on where you're going and why you're uniquely ready for it." },
  { author: "Alex Thompson", avatar: pic8, verified: true, headline: "Interview Coach · Ex-McKinsey", time: "1d", likes: 19, body: "Rehearse the 30-second version out loud until it's boring to you. If you can say it calmly and specifically, it reads as conviction rather than a pivot you're apologizing for." },
  { author: "Rachel Nguyen", avatar: pic9, headline: "Former Associate Director of Admissions", time: "2d", likes: 16, body: "From the other side of the table: we're not skeptical of pivots, we're skeptical of vagueness. Name the exact role you want and the exact gap the program closes." },
  { author: "Marcus Lee", avatar: pic1, headline: "PM at Stripe", time: "20h", likes: 12, body: "Reframe the \"unfocused\" fear entirely — your range is the asset. Two domains that most people keep separate is a differentiator if you can articulate the connective tissue." },
  { author: "Sofia Martinez", avatar: pic12, headline: "Essay Specialist", time: "1d", likes: 9, body: "Cut every sentence that could appear in someone else's essay. Specificity is the whole game here; a real detail beats a polished generality every time." },
  { author: "Daniel Osei", avatar: pic10, verified: true, headline: "Coach · 200+ admits", time: "2d", likes: 7, body: "Map it backward from the goal, not forward from the résumé. Start with the outcome you want, then show why each prior step was preparation for it." },
];

function findQuestion(id: string | undefined): FeaturedQuestion | undefined {
  if (!id) return undefined;
  return QUESTIONS.find(q => q.id === id) ?? ALL_QUESTIONS.find(q => q.id === id);
}

// Each answer renders as an "answer" feed post — same style as the home feed,
// carrying the answer text plus the question card it's responding to.
function answerToPost(a: AnswerData, question: FeaturedQuestion): Post {
  return {
    id: a.id,
    type: "answer",
    author: a.author,
    avatar: a.avatar,
    headline: a.headline,
    time: a.time,
    verified: a.verified,
    body: a.body,
    likes: a.likes,
    comments: a.comments,
    reposts: a.reposts,
    shares: a.shares,
    question,
  };
}

// ─── Page ─────────────────────────────────────────────

function ThreadHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="mb-3 flex items-center gap-3 px-1">
      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
      >
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
      <p className="min-w-0 text-[18px] font-semibold leading-tight text-gray-dark">Question</p>
    </div>
  );
}

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const question = findQuestion(id);

  // Back always returns to the home feed (respecting the alt-nav context).
  const goHome = () => navigate(pathname.startsWith("/alt-nav") ? "/alt-nav" : "/");

  useSetRightSidebar(<HomeRightSidebar />);
  useSetLeftSidebar(<HomeSidebar onCreatePost={() => {}} />);
  useSetNavBackHandler(goHome);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  // Seed the answer posts from the pool, sized to the question's answered count.
  const answerPosts = useMemo(() => {
    if (!question) return [];
    const count = Math.min(question.answered, ANSWER_POOL.length);
    const offset = (parseInt(id?.replace(/\D/g, "") ?? "1", 10) || 1) - 1;
    return Array.from({ length: count }, (_, i) => {
      const seed = ANSWER_POOL[(offset + i) % ANSWER_POOL.length];
      return answerToPost({ ...seed, id: i + 1, comments: 0, reposts: 0, shares: 0 }, question);
    });
  }, [question, id]);

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-light">
        <p className="text-[15px]">Question not found.</p>
        <button onClick={goHome} className="mt-4 text-gray-dark hover:underline">← Go back</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={FADE_IN.initial}
      animate={FADE_IN.animate}
      transition={FADE_TRANSITION}
      className="min-h-[100dvh] pb-36"
    >
      <ThreadHeader onBack={goHome} />

      {/* A stack of answer posts, formatted exactly like the home feed. */}
      <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white">
        {answerPosts.map((p, i) => (
          <div key={p.id} className={`px-4 sm:px-6 ${i > 0 ? "border-t border-gray-stroke" : ""} ${POST_HOVER_SHADOW}`}>
            <FeedPost post={p} onOpen={() => {}} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
