import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function ExpandableText({ text, className }: { text: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight + 2);
  }, []);

  return (
    <div>
      <p ref={ref} className={`${className ?? ""} ${expanded ? "" : "line-clamp-2"}`}>{text}</p>
      {overflows && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 flex items-center gap-[2px] text-[13px] text-gray-xlight hover:text-gray-dark"
        >
          {expanded ? "Less" : "More"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {expanded
              ? <polyline points="18 15 12 9 6 15" />
              : <polyline points="6 9 12 15 18 9" />}
          </svg>
        </button>
      )}
    </div>
  );
}

export interface CoachingSession {
  coach: string;
  coachImg?: string;
  date: string;
  summary: string;
  review?: { rating: number; text: string };
}

export interface LiveCourseEnrollment {
  cohort: string;
  startDate: string;
  endDate: string;
  status: "enrolled" | "invited";
  review?: { rating: number; text: string };
}

export interface UserDetail {
  name: string;
  email: string;
  initials: string;
  coaching?: {
    granted: number;
    used: number;
    sessions: CoachingSession[];
  };
  plus?: {
    topCategories: string[];
    recentItems: Array<{ title: string; category: string }>;
  };
  liveCourses?: LiveCourseEnrollment[];
}

interface Props {
  user: UserDetail | null;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < rating ? "#ffcb47" : "#e5e5e5"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-[24px] font-medium text-gray-dark">
      {children}
    </div>
  );
}


function CoachAvatar({ name, img }: { name: string; img?: string }) {
  if (img) {
    return (
      <img src={img} alt={name} className="h-6 w-6 shrink-0 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
    );
  }
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-xlight text-[11px] font-semibold text-dark-green">
      {initials}
    </div>
  );
}

export default function B2BUserDrawer({ user, onClose }: Props) {

  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/25"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-4 border-b border-gray-stroke px-6 py-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-xlight text-[15px] font-semibold text-dark-green">
                {user.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-medium text-gray-dark">{user.name}</div>
                <div className="text-[14px] text-gray-xlight">{user.email}</div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-gray-hover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-6">

              {/* 1:1 Coaching */}
              {user.coaching && (
                <div>
                  <SectionLabel>1:1 Coaching</SectionLabel>

                  <div className="mb-4 inline-flex items-baseline gap-[6px]">
                    <span className="text-[20px] font-medium leading-none text-gray-dark">{user.coaching.used}</span>
                    <span className="text-[16px] text-gray-xlight">/ {user.coaching.granted} sessions redeemed</span>
                  </div>

                  <div className="flex flex-col">
                    {user.coaching.sessions.flatMap((s, i) => {
                      const items = [
                        <div key={`session-${i}`} className="border-b border-gray-stroke py-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <CoachAvatar name={s.coach} img={s.coachImg} />
                              <span className="text-[15px] font-medium text-gray-dark">{s.coach}</span>
                            </div>
                            <span className="shrink-0 text-[14px] text-gray-xlight">{s.date}</span>
                          </div>
                          <ExpandableText text={s.summary} className="mt-1 text-[14px] text-gray-light" />
                        </div>,
                      ];
                      if (s.review) {
                        items.push(
                          <div key={`review-${i}`} className="border-b border-gray-stroke py-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <CoachAvatar name={s.coach} img={s.coachImg} />
                                <span className="text-[15px] font-medium text-gray-dark">{s.coach}</span>
                              </div>
                              <span className="shrink-0 text-[14px] text-gray-xlight">{s.date}</span>
                            </div>
                            <div className="mt-1">
                              <StarRating rating={s.review.rating} />
                              <ExpandableText text={s.review.text} className="mt-1 text-[14px] italic text-gray-light" />
                            </div>
                          </div>
                        );
                      }
                      return items;
                    })}
                  </div>
                </div>
              )}

              {/* Leland+ */}
              {user.plus && (
                <div>
                  <SectionLabel>Leland+</SectionLabel>
                  <div className="mb-2 text-[16px] text-gray-xlight">Recently viewed</div>
                  <div className="flex flex-col">
                    {user.plus.recentItems.map((item, i, arr) => (
                      <div key={i} className={`flex items-center justify-between gap-3 py-2 ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                        <span className="text-[14px] text-primary">{item.title}</span>
                        <span className="shrink-0 text-[14px] text-gray-xlight">{item.category}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mb-2 mt-5 text-[16px] text-gray-xlight">Top categories</div>
                  <div className="flex flex-wrap gap-2">
                    {user.plus.topCategories.map((cat) => (
                      <span key={cat} className="rounded-full border border-gray-stroke bg-white px-3 py-1 text-[14px] font-medium text-gray-dark">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Courses */}
              {user.liveCourses && user.liveCourses.length > 0 && (
                <div>
                  <SectionLabel>Live Courses</SectionLabel>
                  <div className="flex flex-col">
                    {user.liveCourses.map((course, i, arr) => (
                      <div key={i} className={`pb-4 ${i > 0 ? "pt-4" : ""} ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[15px] font-medium text-gray-dark">{course.cohort}</div>
                          <span className="shrink-0 text-[14px] text-gray-xlight">{course.status === "enrolled" ? "Enrolled" : "Invited"}</span>
                        </div>
                        <div className="mt-1 text-[14px] text-gray-xlight">{course.startDate} – {course.endDate}</div>
                        {course.review && (
                          <div className="mt-3">
                            <StarRating rating={course.review.rating} />
                            <ExpandableText text={course.review.text} className="mt-1 text-[14px] italic text-gray-light" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
