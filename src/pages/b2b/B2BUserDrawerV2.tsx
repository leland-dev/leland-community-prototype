import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import usersIcon from "../../assets/icons/users-icon.svg";
import starIcon from "../../assets/icons/star-icon.svg";
import videoIcon from "../../assets/icons/video-icon.svg";
import plusIcon from "../../assets/icons/plus-icon.svg";

export interface SessionEntry {
  coach?: string;
  coachImg?: string;
  coachHeadline?: string;
  date: string;
  status: "completed" | "scheduled" | "unbooked";
  review?: { rating: number; text: string };
}

export interface CohortEntry {
  name: string;
  image?: string;
  startDate: string;
  endDate: string;
  status: "completed" | "enrolled" | "invited";
  review?: { rating: number; text: string };
  inviteSent?: string;
}

export interface UserDetailV2 {
  name: string;
  email: string;
  initials: string;
  image?: string;
  dateAdded?: string;
  sessions?: {
    granted: number;
    entries: SessionEntry[];
  };
  cohorts?: CohortEntry[];
  plus?: {
    status: "active" | "expired";
    expiry: string;
    grantedDate?: string;
  };
}

interface Props {
  user: UserDetailV2 | null;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "#ffcb47" : "#e5e5e5"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function StatusDot({ status }: { status: "completed" | "scheduled" | "unbooked" | "enrolled" | "invited" }) {
  const color =
    status === "completed" ? "bg-gray-dark" :
    status === "scheduled" ? "bg-[#4f86f7]" :
    status === "enrolled"  ? "bg-gray-dark" :
    status === "invited"   ? "bg-gray-xlight" :
    "bg-[#d4d4d4]";
  return <span className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${color}`} />;
}

export function Tag({ children, color = "gray" }: { children: React.ReactNode; color?: "gray" | "green" | "orange" | "blue" | "red" }) {
  const cls =
    color === "green"  ? "bg-primary-xlight text-dark-green border border-primary-xlight" :
    color === "orange" ? "bg-orange/10 text-orange border border-orange/10" :
    color === "blue"   ? "bg-blue/10 text-blue border border-blue/10" :
    color === "red"    ? "bg-red/10 text-red border border-red/10" :
    "bg-gray-hover text-gray-light border border-gray-hover";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-sm font-medium ${cls}`}>
      {children}
    </span>
  );
}

function AccordionSection({
  title, subtitle, pill, icon, children,
}: {
  title: string;
  subtitle: string;
  pill?: React.ReactNode;
  icon?: string;
  children: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-gray-stroke">
      <div className="flex items-center justify-between gap-4 border-b border-gray-stroke bg-gray-hover px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="shrink-0 text-[14px] font-medium text-gray-light">{title}</div>
        </div>
        {pill && <div className="shrink-0">{pill}</div>}
      </div>
      <div className="px-4 pb-4 pt-3">{children}</div>
    </div>
  );
}

export default function B2BUserDrawerV2({ user, onClose }: Props) {
  useEffect(() => {
    if (!user) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [user, onClose]);

  const userFirstName = user?.name.split(" ")[0];
  const reviews = [
    ...(user?.sessions?.entries.filter((s) => s.review).map((s) => ({
      coachImg: s.coachImg,
      coachName: s.coach ? `${s.coach.split(" ")[0]} ${s.coach.split(" ")[1]?.[0] ?? ""}.`.trim() : undefined,
      coachHref: "https://www.joinleland.com/coach/jordan-lee",
      contextPrefix: s.coach ? `${userFirstName} worked with ` : undefined,
      contextSuffix: " 1:1",
      attribution: undefined as string | undefined,
      review: s.review!,
    })) ?? []),
    ...(user?.cohorts?.filter((c) => c.review).map((c) => ({
      coachImg: undefined,
      coachName: undefined,
      coachHref: undefined,
      contextPrefix: undefined,
      contextSuffix: undefined,
      attribution: c.name,
      review: c.review!,
    })) ?? []),
  ];

  const sessionsUsed = user?.sessions?.entries.filter((s) => s.status !== "unbooked").length ?? 0;
  const sessionsCompleted = user?.sessions?.entries.filter((s) => s.status === "completed").length ?? 0;
  const hasInvitePending = user?.cohorts?.some((c) => c.status === "invited");


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
            <div className="relative flex w-full flex-col overflow-hidden rounded-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] h-[100dvh] sm:h-[75dvh] sm:w-[560px] sm:max-w-[95vw] sm:rounded-2xl">

              {/* Header */}
              <div className="relative flex min-h-12 w-full shrink-0 items-center justify-center border-b border-gray-stroke px-12 py-2">
                <span className="text-[18px] font-medium text-gray-dark">{user.name}</span>
                <button
                  onClick={onClose}
                  className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-hover"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-x-hidden overflow-y-auto">

                {/* User summary */}
                <div className="px-4 pb-2 pt-5 sm:px-6">
                  <div className="text-[30px] font-medium text-gray-dark">User details</div>
                  <div className="mt-1 text-[16px] text-gray-light">
                    {user.email}{user.dateAdded ? ` · Added ${user.dateAdded}` : ""}
                  </div>
                </div>

                {/* Accordion sections */}
                <div className="flex flex-col gap-5 px-4 py-4 sm:px-6">

                  {/* 1:1 Sessions */}
                  {user.sessions && (
                    <AccordionSection
                      icon={usersIcon}
                      title="1:1 Sessions"
                      subtitle={(() => {
                        const completed = user.sessions.entries.filter(s => s.status === "completed").length;
                        const scheduled = user.sessions.entries.filter(s => s.status === "scheduled").length;
                        return [
                          completed > 0 && `${completed} completed`,
                          scheduled > 0 && `${scheduled} scheduled`,
                        ].filter(Boolean).join(" · ") || "None yet";
                      })()}
                      pill={sessionsUsed === user.sessions.granted ? <Tag color="green">Complete</Tag> : undefined}
                    >
                      {/* Progress bar */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${(sessionsCompleted / user.sessions.granted) * 100}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[14px] text-gray-light">{sessionsCompleted}/{user.sessions.granted} completed</span>
                      </div>

                      {/* Session rows */}
                      <div className="flex flex-col">
                        {user.sessions.entries.filter(s => s.status !== "unbooked").map((s, i) => (
                          <div key={i} className="flex items-center justify-between gap-4 border-b border-gray-stroke py-3 last:border-0">
                            <div className="flex min-w-0 items-center gap-3">
                              {s.coachImg && (
                                <div className="relative shrink-0">
                                  <img src={s.coachImg} alt={s.coach} className="h-9 w-9 rounded-full object-cover" />
                                  {s.status === "completed" && (
                                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-sm">
                                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="2 6 5 9 10 3" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="min-w-0">
                                {s.coach ? (
                                  <a href="https://www.joinleland.com/coach/jordan-lee" target="_blank" rel="noreferrer" className="truncate text-[16px] font-medium text-gray-dark hover:underline">
                                    {`${s.coach.split(" ")[0]} ${s.coach.split(" ")[1]?.[0] ?? ""}.`}
                                  </a>
                                ) : (
                                  <div className="truncate text-[16px] font-medium text-gray-dark">
                                    {s.status === "scheduled" ? "Coach TBD" : "Session"}
                                  </div>
                                )}
                                {s.coachHeadline && <div className="truncate text-[14px] text-gray-xlight">{s.coachHeadline}</div>}
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className={`text-[16px] ${s.status === "unbooked" ? "text-gray-xlight" : "text-gray-dark"}`}>
                                {s.status === "completed" ? "Completed" : s.status === "scheduled" ? "Scheduled" : "Not scheduled"}
                              </div>
                              {s.date !== "—" && <div className="text-[14px] text-gray-xlight">{s.date}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionSection>
                  )}

                  {/* Live Cohorts */}
                  {user.cohorts && user.cohorts.length > 0 && (
                    <AccordionSection
                      icon={videoIcon}
                      title="Live courses"
                      subtitle={(() => {
                        const enrolled = user.cohorts.filter(c => c.status === "enrolled").length;
                        const invited = user.cohorts.filter(c => c.status === "invited").length;
                        const completed = user.cohorts.filter(c => c.status === "completed").length;
                        return [
                          enrolled > 0 && `${enrolled} enrolled`,
                          invited > 0 && `${invited} invited`,
                          completed > 0 && `${completed} completed`,
                        ].filter(Boolean).join(" · ");
                      })()}
                      pill={undefined}
                    >
                      <div className="flex flex-col">
                        <div>
                        {user.cohorts.map((c, i) => (
                          <div key={i} className="border-b border-gray-stroke py-3 last:border-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex min-w-0 items-start gap-3">
                                {c.image && (
                                  <div className="relative shrink-0">
                                    <img src={c.image} alt={c.name} className="h-[36px] w-[69px] rounded-[6px] object-cover" />
                                    {(c.status === "enrolled" || c.status === "completed") && (
                                      <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-sm">
                                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="2 6 5 9 10 3" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="truncate text-[16px] font-medium text-gray-dark">{c.name}</div>
                                  <div className="text-[14px] text-gray-xlight">{c.startDate} – {c.endDate}</div>
                                </div>
                              </div>
                              <span className={`shrink-0 text-[16px] ${c.status === "invited" ? "text-gray-xlight" : "text-gray-dark"}`}>
                                {c.status === "completed" ? "Completed" : c.status === "invited" ? "Invited" : "Enrolled"}
                              </span>
                            </div>
                          </div>
                        ))}
                        </div>
                        {user.cohorts.some(c => c.status === "invited") && (
                          <button className="mt-3 w-full rounded-lg bg-primary px-4 text-[16px] font-medium text-white hover:bg-primary-dark" style={{ height: 44 }}>
                            Send course invite reminder
                          </button>
                        )}
                      </div>
                    </AccordionSection>
                  )}

                  {/* Reviews */}
                  {reviews.length > 0 && (
                    <AccordionSection
                      icon={starIcon}
                      title="Reviews"
                      subtitle={`${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
                    >
                      <div className="flex flex-col">
                        {reviews.map((r, i) => (
                          <div key={i} className="border-b border-gray-stroke py-4 last:border-0">
                            <StarRating rating={r.review.rating} />
                            <p className="mt-1.5 text-[16px] leading-[1.5] text-gray-dark">"{r.review.text}"</p>
                            <div className="mt-3 flex min-w-0 items-center gap-2">
                              {r.coachImg && <img src={r.coachImg} alt={r.coachName} className="h-5 w-5 shrink-0 rounded-full object-cover" />}
                              <span className="truncate text-[16px] text-gray-light">
                                {r.contextPrefix}{r.coachName && r.coachHref ? (
                                  <a href={r.coachHref} target="_blank" rel="noreferrer" className="hover:underline">{r.coachName}</a>
                                ) : null}{r.contextSuffix ?? r.attribution}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionSection>
                  )}

                  {/* Leland+ */}
                  {user.plus && (
                    <AccordionSection
                      icon={plusIcon}
                      title="Leland+"
                      subtitle={user.plus.status === "active" ? "Active" : "Expired"}
                      pill={user.plus.status === "expired" ? <Tag color="orange">Expired</Tag> : undefined}
                    >
                      <div className="flex flex-col">
                        {user.plus.grantedDate && (
                          <div className="flex items-center justify-between border-b border-gray-stroke py-2.5">
                            <span className="text-[16px] text-gray-light">Access granted</span>
                            <span className="text-[16px] text-gray-dark">{user.plus.grantedDate}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between border-b border-gray-stroke py-2.5">
                          <span className="text-[16px] text-gray-light">Status</span>
                          <span className={`text-[16px] ${user.plus.status === "active" ? "text-gray-dark" : "text-gray-xlight"}`}>
                            {user.plus.status === "active" ? "Active" : "Expired"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2.5">
                          <span className="text-[16px] text-gray-light">{user.plus.status === "active" ? "Expires" : "Expired"}</span>
                          <span className="text-[16px] text-gray-dark">{user.plus.expiry}</span>
                        </div>
                      </div>
                    </AccordionSection>
                  )}

                </div>
              </div>
              {/* Footer */}
              <div className="shrink-0 border-t border-gray-stroke px-4 py-4 sm:px-6">
                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-gray-hover py-4 text-[16px] font-medium text-gray-dark hover:bg-gray-stroke"
                >
                  Back to dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
