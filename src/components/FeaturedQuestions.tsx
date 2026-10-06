import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic13 from "../assets/profile photos/pic-13.png";

/* Answer a question — a carousel of customer questions Leland thinks this
   expert is a great fit to answer. Each card reads as an answerable prompt.
   Prototype-only: data is hardcoded and the answer field is decorative. */

export type FeaturedQuestion = {
  id: string;
  asker: string;
  avatar: string;
  time: string;
  answered: number;
  question: string;
};

// Shared small facepile for the "other experts have answered" row.
const FACEPILE = [pic1, pic3, pic5];

export const QUESTIONS: FeaturedQuestion[] = [
  {
    id: "q1",
    asker: "Marcus W.",
    avatar: pic2,
    time: "2d",
    answered: 8,
    question: "How do I frame a career pivot from engineering to product in my MBA essays without sounding unfocused?",
  },
  {
    id: "q2",
    asker: "Priya S.",
    avatar: pic4,
    time: "5h",
    answered: 12,
    question: "What's the best way to answer “why this bank” in a superday when I don't have a networking contact there?",
  },
  {
    id: "q3",
    asker: "David C.",
    avatar: pic9,
    time: "1d",
    answered: 5,
    question: "For an APM interview, how much system design should I actually expect versus product sense?",
  },
  {
    id: "q4",
    asker: "Nina K.",
    avatar: pic7,
    time: "3d",
    answered: 9,
    question: "How do I recover mid-case if I realize my framework is wrong halfway through the interview?",
  },
  {
    id: "q5",
    asker: "James P.",
    avatar: pic13,
    time: "6h",
    answered: 3,
    question: "Is it worth keeping a 6-month contract role on my resume if it's not related to the roles I'm targeting?",
  },
  {
    id: "q6",
    asker: "Sofia M.",
    avatar: pic11,
    time: "4h",
    answered: 6,
    question: "Does a strong addendum actually offset one bad semester on my transcript, or should I not draw attention to it?",
  },
];

// Soft slate tint so the cards read as distinct cards rather than one white
// block. (Dark-mode equivalent lives in index.css.)
const QUESTION_TINT = "bg-[#EEF2F4]";

export function QuestionCard({
  q,
  onAnswer,
  onDismiss,
  variant = "carousel",
}: {
  q: FeaturedQuestion;
  onAnswer: () => void;
  onDismiss?: () => void;
  variant?: "carousel" | "grid";
}) {
  const isGrid = variant === "grid";
  return (
    // The whole card opens the answer composer (no explicit button).
    <div
      onClick={onAnswer}
      className={`relative flex h-full w-full cursor-pointer flex-col rounded-2xl ${QUESTION_TINT} p-4 transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]`}
    >
      {/* Carousel: dismiss "X" at the top-right (matches People to follow). */}
      {!isGrid && onDismiss && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          aria-label={`Dismiss question from ${q.asker}`}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}

      {/* The question — Season serif, prominent. */}
      <p className={`line-clamp-4 flex-1 font-serif text-[20px] leading-snug text-gray-dark ${isGrid ? "" : "pr-6"}`}>
        {q.question}
      </p>

      {/* Social proof — facepile of experts who've already answered */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex -space-x-2">
          {FACEPILE.map((src, i) => (
            <img key={i} src={src} alt="" className="h-5 w-5 rounded-full object-cover ring-2 ring-white" />
          ))}
        </div>
        <span className="text-[12px] text-gray-light">{q.answered} other experts have answered</span>
      </div>
    </div>
  );
}

export default function FeaturedQuestions({ onAnswer }: { onAnswer: (q: FeaturedQuestion) => void }) {
  const [questions, setQuestions] = useState(QUESTIONS);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (questions.length === 0) return null;

  const seeAllTo = pathname.startsWith("/alt-nav") ? "/alt-nav/questions" : "/questions";

  return (
    // Its own feed row — the parent divide-y provides the full-width top border,
    // matching the "People to follow" section.
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[19px] font-semibold leading-tight text-gray-dark">Answer a question</p>
        <div className="flex items-center gap-2">
          {/* "See all" is hidden (fades out) while the section is collapsed. */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.button
                key="see-all"
                type="button"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={() => navigate(seeAllTo)}
                className="overflow-hidden whitespace-nowrap text-[14px] font-medium text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px]"
              >
                See all
              </motion.button>
            )}
          </AnimatePresence>
          {/* Chevron toggle collapses/expands the card row. */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand section" : "Collapse section"}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${collapsed ? "" : "rotate-180"}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Full-bleed scroll area: negative margins cancel the section padding so
          cards scroll to the section edges; the matching px keeps the first card
          aligned under the header. The outer motion wrapper is full-bleed +
          overflow-hidden so the height animation clips vertically while the
          inner row still bleeds to the section edges and scrolls horizontally. */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="cards"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="-mx-4 overflow-hidden sm:-mx-6"
          >
            <div className="scrollbar-hide mt-4 flex gap-3 overflow-x-auto px-4 sm:px-6">
              {questions.map((q) => (
                <div key={q.id} className="w-[300px] shrink-0">
                  <QuestionCard
                    q={q}
                    onAnswer={() => onAnswer(q)}
                    onDismiss={() => setQuestions((prev) => prev.filter((x) => x.id !== q.id))}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
