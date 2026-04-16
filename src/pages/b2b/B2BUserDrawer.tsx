import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import SidebarCard from "../../components/SidebarCard";

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
      <p ref={ref} onClick={() => overflows && setExpanded((e) => !e)} className={`${className ?? ""} ${expanded ? "" : "line-clamp-2"} ${overflows ? "cursor-pointer" : ""}`}>{text}</p>
      {overflows && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 text-[14px] font-medium text-primary hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export interface CoachingSession {
  coach: string;
  coachImg?: string;
  coachHeadline?: string;
  date: string;
  status?: "scheduled" | "completed";
  summary?: string;
  review?: { rating: number; text: string };
}

export interface LiveCourseEnrollment {
  cohort: string;
  startDate: string;
  endDate: string;
  status: "enrolled" | "invited";
  review?: { rating: number; text: string };
  inviteSent?: string;
}

export interface UserDetail {
  name: string;
  email: string;
  initials: string;
  image?: string;
  coaching?: {
    granted: number;
    used: number;
    sessions: CoachingSession[];
    inviteSent?: string;
  };
  plus?: {
    topCategories: string[];
    recentItems: Array<{ title: string; category: string; type?: "video" | "document"; url?: string }>;
    totalEngaged?: number;
    inviteSent?: string;
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
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < rating ? "#ffcb47" : "#e5e5e5"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}


function formatInviteDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const opts: Intl.DateTimeFormatOptions = date < oneYearAgo
    ? { month: "short", day: "numeric", year: "numeric" }
    : { month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", opts);
}

function InviteBanner({ message, inviteSent, variant = "yellow" }: { message: string; inviteSent?: string; variant?: "yellow" | "red" }) {
  const isRed = variant === "red";
  const styles = isRed ? "border-red/30 bg-red/5" : "border-[#ede9c8] bg-[#fdfbf0]";
  return (
    <div className={`rounded-lg border px-4 py-3 ${styles}`}>
      <div className={`font-medium text-gray-dark ${isRed ? "text-[16px]" : "text-[14px]"}`}>{message}</div>
      {inviteSent && (
        <div className="mt-0.5 text-[13px] text-gray-light">Last invite sent {inviteSent}</div>
      )}
      <button className={`mt-2 flex items-center gap-1 font-medium hover:underline ${isRed ? "text-[16px] text-red" : "text-[13px] text-primary"}`}>
        Resend invite
        {isRed && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>
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
            <div className="flex shrink-0 items-center gap-3 border-b border-gray-stroke px-4 sm:px-6 py-5">
              {user.image ? (
                <img src={user.image} alt={user.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-xlight text-[13px] font-semibold text-dark-green">
                  {user.initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-medium text-gray-dark">{user.name}</div>
                <div className="text-[14px] text-gray-light">{user.email}</div>
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
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 sm:px-6 py-6">

              <div className="text-[30px] font-medium text-gray-dark">User details</div>

              {/* 1:1 Coaching */}
              {user.coaching && (
                <div>

                  {(() => {
                    const scheduled = user.coaching.sessions.filter(s => s.status === "scheduled").length;
                    const completed = user.coaching.sessions.filter(s => s.status !== "scheduled").length;
                    return (
                      <div className="mb-4 rounded-lg border border-gray-stroke bg-white p-5">
                        <div className="mb-2 text-[18px] font-normal text-gray-light">Sessions completed</div>
                        <div className="flex items-baseline gap-[6px]">
                          <span className="text-[24px] font-medium leading-none text-gray-dark">{completed}</span>
                          <span className="text-[18px] font-medium text-gray-dark">of</span>
                          <span className="text-[24px] font-medium leading-none text-gray-dark">{user.coaching.granted}</span>
                        </div>
                        <div className="mt-[6px] text-[14px] text-gray-light">{scheduled} scheduled</div>
                      </div>
                    );
                  })()}

                  {user.coaching.sessions.length > 0 && (() => {
                    const allItems = [] as { key: string; label: string; date: string; isScheduled?: boolean; content: JSX.Element }[];
                    user.coaching.sessions.forEach((s, i) => {
                      allItems.push({
                        key: `session-${i}`,
                        label: s.status === "scheduled" ? "Session Scheduled" : "Session Completed",
                        date: s.date,
                        isScheduled: s.status === "scheduled",
                        content: (
                          <>
                            <SidebarCard variant="coach" image={s.coachImg} title={s.coach} subtitle={s.coachHeadline ?? ""} />
                          </>
                        ),
                      });
                      if (s.review) {
                        allItems.push({
                          key: `review-${i}`,
                          label: "Review",
                          date: s.date,
                          content: (
                            <>
                              <SidebarCard variant="coach" image={s.coachImg} title={s.coach} subtitle={s.coachHeadline ?? ""} />
                              <div className="mt-1 flex flex-col gap-[6px] px-2">
                                <StarRating rating={s.review.rating} />
                                <ExpandableText text={s.review.text} className="text-[16px] italic text-gray-light" />
                              </div>
                            </>
                          ),
                        });
                      }
                    });
                    return (
                      <div className="mt-2 flex flex-col">
                        {allItems.map((item, idx) => (
                          <div key={item.key} className="flex gap-3">
                            <div className="flex flex-col items-center pt-3">
                              <div className={`mt-[5px] h-[9px] w-[9px] shrink-0 rounded-full border ${item.isScheduled ? "border-gray-light bg-white" : "border-gray-light bg-gray-light"}`} />
                              {idx < allItems.length - 1 && <div className="mt-1 w-px flex-1 bg-gray-stroke" />}
                            </div>
                            <div className="min-w-0 flex-1 py-3">
                              <div className="mb-1 flex items-center gap-2 text-[14px]">
                                <span className="text-gray-light">{item.label}</span>
                                <span className="text-gray-xlight">{item.date}</span>
                              </div>
                              {item.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  {user.coaching.used === 0 && (
                    <InviteBanner message="Not scheduled yet" inviteSent={user.coaching.inviteSent} />
                  )}
                </div>
              )}

              {/* Leland+ */}
              {user.plus && (
                <div>
                  {user.plus.inviteSent && !user.plus.recentItems.length ? (
                    <InviteBanner message="Not activated yet" inviteSent={user.plus.inviteSent} />
                  ) : (
                    <>
                      {user.plus.totalEngaged != null && (
                        <div className="mb-4 rounded-lg border border-gray-stroke bg-white p-5">
                          <div className="mb-2 text-[18px] font-normal text-gray-light">Resources viewed</div>
                          <div className="text-[24px] font-medium leading-none text-gray-dark">{user.plus.totalEngaged}</div>
                          <div className="mt-[6px] text-[14px] text-gray-light">Across all categories</div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {user.plus.topCategories.map((cat) => (
                          <span key={cat} className="rounded-full bg-gray-hover px-3 py-1 text-[14px] font-medium text-gray-light">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <div className="mb-3 mt-6 text-[14px] font-medium uppercase tracking-[0.06em] text-gray-light">Recently viewed</div>
                      <div className="flex flex-col">
                        {user.plus.recentItems.map((item, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="mt-[9px] h-[7px] w-[7px] shrink-0 rounded-full border border-gray-light bg-gray-light" />
                              {i < user.plus!.recentItems.length - 1 && <div className="mt-1 w-px flex-1 bg-gray-stroke" />}
                            </div>
                            <a
                              href={item.url ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-w-0 flex-1 pb-2 pt-[5px] hover:opacity-70"
                            >
                              <div className="text-[14px] text-gray-light">{item.category}</div>
                              <div className="text-[16px] text-gray-dark">{item.title}</div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Live Courses */}
              {user.liveCourses && user.liveCourses.length > 0 && (
                <div>
                  {(() => {
                    const enrolled = user.liveCourses!.filter(c => c.status === "enrolled").length;
                    const total = user.liveCourses!.length;
                    return (
                      <div className="mb-4 rounded-lg border border-gray-stroke bg-white p-5">
                        <div className="mb-2 text-[18px] font-normal text-gray-light">Cohorts joined</div>
                        <div className="flex items-baseline gap-[6px]">
                          <span className="text-[24px] font-medium leading-none text-gray-dark">{enrolled}</span>
                          <span className="text-[18px] font-medium text-gray-dark">of</span>
                          <span className="text-[24px] font-medium leading-none text-gray-dark">{total}</span>
                        </div>
                      </div>
                    );
                  })()}
                  {(() => {
                    const allItems = [] as { key: string; label: string; date: string; isPending?: boolean; content: JSX.Element }[];
                    const sortedCourses = [...user.liveCourses!].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                    sortedCourses.forEach((course, i) => {
                      allItems.push({
                        key: `cohort-${i}`,
                        label: course.status === "enrolled" ? "Enrolled" : "Invited",
                        date: course.status === "invited" && course.inviteSent ? formatInviteDate(course.inviteSent) : course.startDate,
                        isPending: course.status === "invited",
                        content: (
                          <>
                            <div className="py-[10px]">
                              <div className="text-[16px] font-medium text-gray-dark">{course.cohort}</div>
                              <div className="mt-[2px] text-[14px] text-gray-xlight">{course.startDate} – {course.endDate}</div>
                            </div>
                            {course.status === "invited" && (
                              <button className="mt-1 rounded-lg bg-gray-hover px-3 py-2 text-[14px] font-medium text-gray-dark hover:bg-gray-stroke">Resend invite</button>
                            )}
                            {course.review && (
                              <div className="mt-1 flex flex-col gap-[6px]">
                                <StarRating rating={course.review.rating} />
                                <ExpandableText text={course.review.text} className="text-[16px] italic text-gray-light" />
                              </div>
                            )}
                          </>
                        ),
                      });
                    });
                    return (
                      <div className="mt-2 flex flex-col">
                        {allItems.map((item, idx) => (
                          <div key={item.key} className="flex gap-3">
                            <div className="flex flex-col items-center pt-3">
                              <div className={`mt-[5px] h-[9px] w-[9px] shrink-0 rounded-full border ${item.isPending ? "border-gray-light bg-white" : "border-gray-light bg-gray-light"}`} />
                              {idx < allItems.length - 1 && <div className="mt-1 w-px flex-1 bg-gray-stroke" />}
                            </div>
                            <div className="min-w-0 flex-1 py-3">
                              <div className="mb-1 flex items-center gap-2 text-[14px]">
                                <span className="text-gray-light">{item.label}</span>
                                <span className="text-gray-xlight">{item.date}</span>
                              </div>
                              {item.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
