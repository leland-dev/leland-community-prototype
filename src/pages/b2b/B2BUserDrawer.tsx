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
  // Table-level access summary
  plusAccess?: { status: string; expiry: string | null };
  cohortStatuses?: Partial<Record<string, string>>;
  sessionsGranted?: number;
  sessionsUsed?: number | null;
  dateAdded?: string;
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

  useEffect(() => {
    if (!user) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [user, onClose]);

  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
          <div className="relative flex w-full flex-col overflow-hidden rounded-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[100dvh] sm:max-h-[90dvh] sm:w-[560px] sm:max-w-[95vw] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="relative flex min-h-12 w-full shrink-0 items-center justify-center border-b border-gray-stroke px-12 py-2">
              <span className="text-[18px] font-medium text-gray-dark">User details</span>
              <button
                onClick={onClose}
                className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-hover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="flex flex-col gap-6">

              <div>
                <div className="text-[30px] font-medium text-gray-dark">{user.name}</div>
                <div className="mt-1 text-[14px] text-gray-light">
                  {user.email}{user.dateAdded ? ` · Added ${user.dateAdded}` : ""}
                </div>
              </div>

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


              {/* Sessions fallback — only if no detailed coaching data */}
              {user.sessionsGranted != null && !user.coaching && (
                <div className="rounded-lg border border-gray-stroke bg-white p-5">
                  <div className="mb-2 text-[18px] font-normal text-gray-light">Sessions completed</div>
                  <div className="flex items-baseline gap-[6px]">
                    <span className="text-[24px] font-medium leading-none text-gray-dark">{user.sessionsUsed ?? 0}</span>
                    <span className="text-[18px] font-medium text-gray-dark">of</span>
                    <span className="text-[24px] font-medium leading-none text-gray-dark">{user.sessionsGranted}</span>
                  </div>
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

              {/* Cohorts fallback — only if no detailed live course data */}
              {user.cohortStatuses && Object.keys(user.cohortStatuses).length > 0 && !(user.liveCourses?.length) && (
                <div className="rounded-lg border border-gray-stroke bg-white p-5">
                  <div className="mb-3 text-[18px] font-normal text-gray-light">Live courses</div>
                  <div className="flex flex-col gap-3">
                    {Object.entries(user.cohortStatuses).map(([cohort, status]) => (
                      <div key={cohort} className="flex items-center justify-between gap-4">
                        <span className="text-[16px] text-gray-dark">{cohort}</span>
                        <span className={`shrink-0 text-[14px] ${status === "invited" ? "text-gray-xlight" : "text-gray-dark"}`}>
                          {status === "completed" ? "Completed" : status === "enrolled" ? "Enrolled" : "Invited"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leland+ access */}
              {user.plusAccess && user.plusAccess.status !== "—" && (
                <div className="rounded-lg border border-gray-stroke bg-white p-5">
                  <div className="mb-2 text-[18px] font-normal text-gray-light">Leland+ access</div>
                  {user.plusAccess.status === "Granted" ? (
                    <div>
                      <div className="text-[24px] font-medium leading-none text-gray-dark">Active</div>
                      {user.plusAccess.expiry && (
                        <div className="mt-[6px] text-[14px] text-gray-light">
                          Expires {user.plusAccess.expiry.replace(/,\s*\d{4}$/, "")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[24px] font-medium leading-none text-gray-xlight">Expired</div>
                  )}
                </div>
              )}

            </div>
            </div>
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
