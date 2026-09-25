import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

import { useIsMobile } from "../hooks/useIsMobile";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { QuestionCard, type FeaturedQuestion } from "./FeaturedQuestions";
import { Button } from "./Button";

import profilePhoto from "../assets/profile photos/profile photo.png";
import composerImageIcon from "../assets/icons/image.svg";

/* Answer composer — a reply-style modal for answering a featured question.
   Mirrors the platform's reply composer: the thing being answered (the feed
   question card) sits up top with a thread connector, then the current user's
   avatar + a roomy input below. Submitting adds an "answer" post to the feed. */
export default function AnswerCompose({
  question,
  onClose,
  onPost,
}: {
  question: FeaturedQuestion;
  onClose: () => void;
  onPost: (text: string) => void;
}) {
  const isMobile = useIsMobile();
  useLockBodyScroll(true);

  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const canPost = text.trim().length > 0;

  // Escape closes; autofocus the input on open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => { window.removeEventListener("keydown", onKey); cancelAnimationFrame(id); };
  }, [onClose]);

  const submit = () => {
    if (!canPost || posting) return;
    setPosting(true);
    // Brief "posting" beat before the modal dismisses, matching ComposeModal.
    setTimeout(() => { onPost(text.trim()); onClose(); }, 450);
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex justify-center ${isMobile ? "items-stretch" : "items-start"}`}
      style={{ backgroundColor: isMobile ? "#ffffff" : "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <motion.div
        className={
          isMobile
            ? "relative flex w-full flex-col bg-white overflow-hidden pb-[env(safe-area-inset-bottom)]"
            : "relative mt-[60px] w-full max-w-[600px] rounded-2xl bg-white shadow-2xl mx-4 overflow-hidden"
        }
        style={isMobile ? { height: "100dvh" } : undefined}
        initial={isMobile ? { opacity: 0, y: 24 } : { opacity: 0, scale: 0.95, y: -20 }}
        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar: X (left) · Drafts + Post (right) */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-gray-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" rounded="rounded-full">Drafts</Button>
            <Button
              size="sm"
              variant="dark"
              rounded="rounded-full"
              onClick={submit}
              disabled={!canPost || posting}
              className="min-w-[72px]"
            >
              {posting ? (
                <motion.span
                  className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
              ) : "Post"}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* The question being answered — feed-styled card. */}
          <QuestionCard q={question} onAnswer={() => {}} />

          {/* Thread connector + "Replying to" caption, echoing the reply flow. */}
          <div className="ml-5 h-4 w-px bg-gray-200" />
          <p className="mb-3 text-[13px] text-gray-light">
            Replying to <span className="font-medium text-gray-dark">{question.asker}</span>
          </p>

          {/* Current user + answer input. */}
          <div className="flex items-center gap-3">
            <img src={profilePhoto} alt="You" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            <span className="text-[15px] font-semibold text-gray-dark">Jamie Allen</span>
          </div>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
            placeholder="Post your reply"
            rows={3}
            className="mt-3 min-h-[140px] w-full resize-none bg-transparent text-[17px] leading-[1.45] text-gray-dark outline-none placeholder:text-gray-light"
          />
        </div>

        {/* Bottom media bar — image attach (decorative, matches the reply chrome). */}
        <div className="flex items-center gap-1 border-t border-gray-stroke px-4 py-3">
          <button
            type="button"
            aria-label="Add image"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
          >
            <img src={composerImageIcon} alt="" className="h-[22px] w-[22px]" />
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
