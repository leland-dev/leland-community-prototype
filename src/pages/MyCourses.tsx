import { NavLink } from "react-router-dom";
import { useState } from "react";
import TopNav from "../components/TopNav";
import MobileTopNav from "../components/MobileTopNav";
import BottomNav from "../components/BottomNav";
import { ExtraLinksProvider } from "../components/ExtraLinksContext";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";
import eventImage from "../assets/img/EventImage.avif";
import playIcon from "../assets/icons/play.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";

// ─── Data ────────────────────────────────────────────────────────────────────

type LiveCourse = {
  type: "live";
  id: number;
  title: string;
  cohortLabel: string;
  cohortDates: string;
  registrants: string[];
  sessionsTotal: number;
  image: string;
  nextSession: {
    day: string;
    date: number;
    sortDate: Date;
    title: string;
    dateTime: string;
    duration: string;
  } | null;
};

type SelfPacedCourse = {
  type: "selfPaced";
  id: number;
  title: string;
  image: string;
  percentComplete: number;
  totalTime: string;
};

type EnrolledCourse = LiveCourse | SelfPacedCourse;

function sortKey(course: EnrolledCourse): number {
  if (course.type === "live") {
    if (course.nextSession) return course.nextSession.sortDate.getTime();
    return Number.MAX_SAFE_INTEGER; // completed live → bottom
  }
  // self-paced: after active live, completed at bottom
  if (course.percentComplete >= 100) return Number.MAX_SAFE_INTEGER;
  return Number.MAX_SAFE_INTEGER / 2;
}

const enrolledCourses: EnrolledCourse[] = [
  {
    type: "live",
    id: 1,
    title: "MBA Admissions Strategy Bootcamp",
    cohortLabel: "Cohort 3",
    cohortDates: "Mar 12 – Apr 23, 2026",
    registrants: [pic1, pic3, pic4],
    sessionsTotal: 6,
    image: event1,
    nextSession: {
      day: "WED",
      date: 2,
      sortDate: new Date(Date.now() + 15 * 60 * 1000),
      title: "Session 4: Building Your Narrative",
      dateTime: "Today at " + new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      duration: "90 min",
    },
  },
  {
    type: "live",
    id: 2,
    title: "GMAT Exam Prep Bootcamp",
    cohortLabel: "Cohort 1",
    cohortDates: "Apr 7 – May 19, 2026",
    registrants: [pic5, pic6, pic3],
    sessionsTotal: 8,
    image: event2,
    nextSession: {
      day: "MON",
      date: 7,
      sortDate: new Date("2026-04-07T16:00:00"),
      title: "Session 2: Quantitative Reasoning",
      dateTime: "April 7 at 4:00 PM",
      duration: "60 min",
    },
  },
  {
    type: "live",
    id: 5,
    title: "Tech PM Interview Accelerator",
    cohortLabel: "Cohort 2",
    cohortDates: "Jan 6 – Feb 3, 2026",
    registrants: [pic4, pic1, pic6],
    sessionsTotal: 5,
    image: eventImage,
    nextSession: null,
  },
  {
    type: "selfPaced",
    id: 3,
    title: "Nail the Google PM Interview Cycle",
    image: event3,
    percentComplete: 65,
    totalTime: "7 hours",
  },
  {
    type: "selfPaced",
    id: 4,
    title: "Consulting Case Interview Mastery",
    image: eventImage,
    percentComplete: 20,
    totalTime: "6 hours",
  },
  {
    type: "selfPaced",
    id: 6,
    title: "MBA Application Essay Masterclass",
    image: event1,
    percentComplete: 100,
    totalTime: "4 hours",
  },
].sort((a, b) => sortKey(a) - sortKey(b));

const suggestedCourses = [
  {
    title: "Stanford MBA Application Workshop",
    type: "Live cohort",
    duration: "4 weeks",
    enrolledCount: "24 enrolled",
    image: event1,
  },
  {
    title: "Product Management Fundamentals",
    type: "Self-paced",
    duration: "8h",
    enrolledCount: null,
    image: event2,
  },
  {
    title: "Finance for Non-Finance MBAs",
    type: "Live cohort",
    duration: "3 weeks",
    enrolledCount: "18 enrolled",
    image: event3,
  },
  {
    title: "Leadership & Organizational Behavior",
    type: "Self-paced",
    duration: "6h",
    enrolledCount: null,
    image: eventImage,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NextSessionCard({
  session,
  cohortLabel,
  cohortDates,
  sessionsTotal,
}: {
  session: NonNullable<LiveCourse["nextSession"]>;
  cohortLabel: string;
  cohortDates: string;
  sessionsTotal: number;
}) {
  const now = new Date();
  const minsUntil = (session.sortDate.getTime() - now.getTime()) / 60000;
  const showJoin = minsUntil <= 30 && minsUntil > -120;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-stroke bg-white">
      <div className="border-b border-gray-stroke/50 bg-gray-hover px-4 py-2 text-[13px] text-[#707070]">
        {cohortLabel} · {cohortDates} · {sessionsTotal} sessions
      </div>
      <div className="flex items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-gray-dark leading-snug">
          {session.title}
        </p>
        <p className="mt-0.5 text-[14px] text-[#707070]">
          {session.dateTime}
          <span className="text-[#9B9B9B]"> · {session.duration}</span>
        </p>
      </div>
      {showJoin ? (
        <button className="shrink-0 cursor-pointer rounded-lg bg-[#038561] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#038561]/90">
          Join
        </button>
      ) : (
        <div className="flex w-[42px] shrink-0 flex-col items-center overflow-hidden rounded-[8px] border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
          <div className="w-full bg-[#F5F5F5] text-center text-[11px] font-medium uppercase tracking-[0.05em] text-[#707070]">
            {session.day}
          </div>
          <div className="w-full pt-0.5 pb-1 text-center text-[17px] font-medium leading-tight text-[#707070]">
            {session.date}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function CourseLinks() {
  return (
    <div className="flex gap-2 overflow-x-auto">
      <a href="#" className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-hover bg-gray-hover px-4 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:border-gray-stroke hover:bg-white">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 2h6l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          <path d="M9 2v4h4M5.5 8.5h5M5.5 11h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        Details & syllabus
      </a>
      <a href="#" className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-hover bg-gray-hover px-4 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:border-gray-stroke hover:bg-white">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/>
        </svg>
        Recordings
      </a>
    </div>
  );
}

function LiveCourseCard({ course }: { course: LiveCourse }) {
  const isCompleted = !course.nextSession;
  return (
    <div className="flex flex-col gap-5 border-b border-gray-stroke/50 py-6">
      <div className="flex gap-5">
        <div className="w-1/2 shrink-0 md:w-[220px]">
          <img
            src={course.image}
            alt=""
            className={`aspect-[120/63] w-full rounded-lg object-cover${isCompleted ? " opacity-50" : ""}`}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {course.registrants.slice(0, 3).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-[20px] w-[20px] rounded-full object-cover ring-2 ring-white"
                  style={{ marginLeft: i === 0 ? 0 : -6 }}
                />
              ))}
            </div>
            <span className="text-[14px] text-[#707070]">Live cohort</span>
          </div>
          <h3 className="mt-1.5 text-[18px] font-medium leading-snug text-gray-dark">
            {course.title}
          </h3>
          <div className="mt-3">
            <CourseLinks />
          </div>
        </div>
      </div>
      {course.nextSession && (
        <NextSessionCard
          session={course.nextSession}
          cohortLabel={course.cohortLabel}
          cohortDates={course.cohortDates}
          sessionsTotal={course.sessionsTotal}
        />
      )}
      {isCompleted && (
        <div className="overflow-hidden rounded-lg border border-gray-stroke/50 bg-white">
          <div className="border-b border-gray-stroke/50 bg-gray-hover px-4 py-2 text-[13px] text-[#707070]">
            {course.cohortLabel} · {course.cohortDates} · {course.sessionsTotal} sessions
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <rect x="0.5" y="0.5" width="13" height="13" rx="3.5" stroke="#9B9B9B"/>
                <path d="M3.5 7l2.5 2.5 4.5-4.5" stroke="#9B9B9B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-[#9B9B9B] leading-snug">All sessions completed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SelfPacedCourseCard({ course }: { course: SelfPacedCourse }) {
  const isCompleted = course.percentComplete >= 100;
  const isNotStarted = course.percentComplete === 0;
  return (
    <div className="flex gap-5 border-b border-gray-stroke/50 py-6">
      <div className="w-1/2 shrink-0 md:w-[220px]">
        <img
          src={course.image}
          alt=""
          className={`aspect-[120/63] w-full rounded-lg object-cover${isCompleted ? " opacity-50" : ""}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-2">
          <img src={playIcon} alt="" className="h-[20px] w-[20px] shrink-0" />
          <span className="text-[14px] text-[#707070]">Self-paced</span>
        </div>
        <h3 className="mt-1 text-[18px] font-medium leading-snug text-gray-dark">
          {course.title}
        </h3>
        <div className="mt-3 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[14px] text-[#707070]">{course.percentComplete}% complete</p>
                <p className="text-[14px] text-[#9B9B9B]">{course.totalTime}</p>
              </div>
              <div className="h-[6px] w-full rounded-full bg-[#E5E5E5]">
                <div
                  className="h-full rounded-full bg-[#038561] transition-all"
                  style={{ width: `${course.percentComplete}%` }}
                />
              </div>
            </>
          </div>
          {isCompleted ? (
            <button className="hidden shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-hover bg-gray-hover px-4 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:border-gray-stroke hover:bg-white md:flex">
              View
            </button>
          ) : (
            <button className="hidden shrink-0 cursor-pointer rounded-lg bg-[#038561] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#038561]/90 md:block">
              {isNotStarted ? "Start" : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SuggestedCourseCard({
  course,
}: {
  course: (typeof suggestedCourses)[0];
}) {
  return (
    <div className="group flex cursor-pointer items-center gap-3">
      <div className="w-[108px] shrink-0 overflow-hidden rounded-[6px]">
        <img
          src={course.image}
          alt=""
          className="aspect-[120/63] w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[15px] font-medium leading-snug text-gray-dark transition-opacity group-hover:opacity-70">
          {course.title}
        </p>
        <p className="mt-0.5 text-[13px] text-[#707070]">
          {course.type} · {course.duration}
        </p>
        {course.enrolledCount && (
          <p className="text-[13px] text-[#707070]">{course.enrolledCount}</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Filter = "all" | "live" | "selfPaced";

export default function MyCourses() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleCourses = filter === "all" ? enrolledCourses : enrolledCourses.filter((c) => c.type === (filter === "live" ? "live" : "selfPaced"));

  return (
    <div className="min-h-full bg-white">
      <div className="md:hidden">
        <ExtraLinksProvider>
          <MobileTopNav />
        </ExtraLinksProvider>
      </div>
      <div className="hidden md:block">
        <TopNav />
      </div>

      <div className="mx-auto max-w-[1060px] px-6 pt-20 pb-20 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">
            My Courses
          </h1>
          <div className="flex rounded-lg border border-gray-stroke/50 bg-gray-hover p-0.5 text-[14px] font-medium">
            {(["all", "live", "selfPaced"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${
                  filter === f
                    ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                    : "text-[#707070] hover:text-gray-dark"
                }`}
              >
                {f === "all" ? "All" : f === "live" ? "Live" : "Self-paced"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-10">
          {/* ── Left column ── */}
          <div className="min-w-0 flex-1 border-t border-gray-stroke/50">
            {visibleCourses.map((course) =>
              course.type === "live" ? (
                <LiveCourseCard key={course.id} course={course} />
              ) : (
                <SelfPacedCourseCard key={course.id} course={course} />
              )
            )}
          </div>

          {/* ── Right column ── */}
          <div className="hidden w-[300px] shrink-0 lg:block">
            <NavLink
              to="/browse"
              className="flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-opacity hover:opacity-80"
            >
              Suggested courses
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
            <div className="mt-4 flex flex-col gap-5">
              {suggestedCourses.map((course, i) => (
                <SuggestedCourseCard key={i} course={course} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
