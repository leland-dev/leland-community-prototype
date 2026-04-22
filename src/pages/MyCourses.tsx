import { useState } from "react";
import PageShell from "../components/PageShell";
import LiveCourseCard, { LiveCourse, TimeSlot, getSessionState, isLiveCourseCompleted } from "../components/LiveCourseCard";
import { useSessionLayout } from "../components/SessionLayoutContext";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";
import eventImage from "../assets/img/EventImage.avif";
import SidebarCard, { SidebarGroup } from "../components/SidebarCard";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";

// ─── Data ────────────────────────────────────────────────────────────────────

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
    if (course.cohortSelected === false) return Number.NEGATIVE_INFINITY;
    const next = course.sessions.find((s) => {
      const st = getSessionState(s.slots[0]);
      return st === "live" || st === "soon" || st === "future";
    });
    if (next) return next.slots[0].startTime.getTime();
    return Number.MAX_SAFE_INTEGER;
  }
  if (course.percentComplete >= 100) return Number.MAX_SAFE_INTEGER;
  return Number.MAX_SAFE_INTEGER / 2;
}

const liveNow = new Date(Date.now() + 15 * 60 * 1000);
const liveEnd = new Date(Date.now() + 105 * 60 * 1000);
const eveningSoon = new Date(Date.now() + 3 * 60 * 60 * 1000);
const eveningSoonEnd = new Date(Date.now() + 4.5 * 60 * 60 * 1000);

const enrolledCourses: EnrolledCourse[] = ([
  {
    type: "live" as const,
    id: 1,
    title: "MBA Admissions Strategy Bootcamp: From Application to Acceptance Letter",
    cohortDateLabel: "Spring admissions",
    cohortDates: "Mar 12 – Apr 23, 2026",
    registrants: [pic1, pic3, pic4],
    image: event1,
    sessions: [
      { id: 101, title: "Introduction & Goal Setting", duration: "90 min", slots: [
        { id: 1010, startTime: new Date("2026-03-12T09:00:00"), endTime: new Date("2026-03-12T10:30:00"), recordingUrl: "#" },
        { id: 1011, startTime: new Date("2026-03-12T19:00:00"), endTime: new Date("2026-03-12T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 102, title: "School Selection Strategy", duration: "90 min", slots: [
        { id: 1020, startTime: new Date("2026-03-19T09:00:00"), endTime: new Date("2026-03-19T10:30:00"), recordingUrl: "#" },
        { id: 1021, startTime: new Date("2026-03-19T19:00:00"), endTime: new Date("2026-03-19T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 103, title: "Crafting Your Story", duration: "90 min", slots: [
        { id: 1030, startTime: new Date("2026-03-26T09:00:00"), endTime: new Date("2026-03-26T10:30:00"), recordingUrl: "#" },
        { id: 1031, startTime: new Date("2026-03-26T19:00:00"), endTime: new Date("2026-03-26T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 104, title: "Building Your Narrative", duration: "90 min", slots: [
        { id: 1040, startTime: liveNow, endTime: liveEnd },
        { id: 1041, startTime: eveningSoon, endTime: eveningSoonEnd },
      ] as [TimeSlot, TimeSlot] },
      { id: 105, title: "Essays & Short Answers", duration: "90 min", slots: [
        { id: 1050, startTime: new Date("2026-04-09T09:00:00"), endTime: new Date("2026-04-09T10:30:00") },
        { id: 1051, startTime: new Date("2026-04-09T19:00:00"), endTime: new Date("2026-04-09T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 106, title: "Final Q&A & Wrap-Up", duration: "60 min", slots: [
        { id: 1060, startTime: new Date("2026-04-23T09:00:00"), endTime: new Date("2026-04-23T10:00:00") },
        { id: 1061, startTime: new Date("2026-04-23T19:00:00"), endTime: new Date("2026-04-23T20:00:00") },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  {
    type: "live" as const,
    id: 7,
    title: "Law School Admissions Bootcamp",
    cohortDateLabel: "Fall admissions",
    cohortDates: "May 5 – Jun 9, 2026",
    registrants: [pic3, pic5, pic1],
    image: event3,
    cohortSelected: false,
    sessions: [],
  },
  {
    type: "live" as const,
    id: 5,
    title: "Tech PM Interview Accelerator",
    cohortDateLabel: "Winter cohort",
    cohortDates: "Jan 6 – Feb 3, 2026",
    registrants: [pic4, pic1, pic6],
    image: eventImage,
    sessions: [
      { id: 501, title: "PM Fundamentals", duration: "60 min", slots: [
        { id: 5010, startTime: new Date("2026-01-06T09:00:00"), endTime: new Date("2026-01-06T10:00:00"), recordingUrl: "#" },
        { id: 5011, startTime: new Date("2026-01-06T19:00:00"), endTime: new Date("2026-01-06T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 502, title: "Product Sense & Design", duration: "60 min", slots: [
        { id: 5020, startTime: new Date("2026-01-13T09:00:00"), endTime: new Date("2026-01-13T10:00:00"), recordingUrl: "#" },
        { id: 5021, startTime: new Date("2026-01-13T19:00:00"), endTime: new Date("2026-01-13T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 503, title: "Metrics & Analytical Questions", duration: "60 min", slots: [
        { id: 5030, startTime: new Date("2026-01-20T09:00:00"), endTime: new Date("2026-01-20T10:00:00"), recordingUrl: "#" },
        { id: 5031, startTime: new Date("2026-01-20T19:00:00"), endTime: new Date("2026-01-20T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 504, title: "Behavioral & Leadership", duration: "60 min", slots: [
        { id: 5040, startTime: new Date("2026-01-27T09:00:00"), endTime: new Date("2026-01-27T10:00:00"), recordingUrl: "#" },
        { id: 5041, startTime: new Date("2026-01-27T19:00:00"), endTime: new Date("2026-01-27T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 505, title: "Mock Interviews & Debrief", duration: "90 min", slots: [
        { id: 5050, startTime: new Date("2026-02-03T09:00:00"), endTime: new Date("2026-02-03T10:30:00"), recordingUrl: "#" },
        { id: 5051, startTime: new Date("2026-02-03T19:00:00"), endTime: new Date("2026-02-03T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  {
    type: "live" as const,
    id: 8,
    title: "Data Analytics for Product Managers",
    cohortDateLabel: "Summer cohort",
    cohortDates: "Jun 2 – Jun 30, 2026",
    registrants: [pic3, pic4, pic1],
    image: event2,
    sessions: [
      { id: 801, title: "Intro to Analytics", duration: "60 min", slots: [
        { id: 8010, startTime: new Date("2026-06-02T09:00:00"), endTime: new Date("2026-06-02T10:00:00") },
        { id: 8011, startTime: new Date("2026-06-02T19:00:00"), endTime: new Date("2026-06-02T20:00:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 802, title: "Metrics & KPIs", duration: "60 min", slots: [
        { id: 8020, startTime: new Date("2026-06-09T09:00:00"), endTime: new Date("2026-06-09T10:00:00") },
        { id: 8021, startTime: new Date("2026-06-09T19:00:00"), endTime: new Date("2026-06-09T20:00:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 803, title: "A/B Testing", duration: "60 min", slots: [
        { id: 8030, startTime: new Date("2026-06-16T09:00:00"), endTime: new Date("2026-06-16T10:00:00") },
        { id: 8031, startTime: new Date("2026-06-16T19:00:00"), endTime: new Date("2026-06-16T20:00:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 804, title: "Dashboards & Reporting", duration: "60 min", slots: [
        { id: 8040, startTime: new Date("2026-06-23T09:00:00"), endTime: new Date("2026-06-23T10:00:00") },
        { id: 8041, startTime: new Date("2026-06-23T19:00:00"), endTime: new Date("2026-06-23T20:00:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 805, title: "Capstone & Q&A", duration: "90 min", slots: [
        { id: 8050, startTime: new Date("2026-06-30T09:00:00"), endTime: new Date("2026-06-30T10:30:00") },
        { id: 8051, startTime: new Date("2026-06-30T19:00:00"), endTime: new Date("2026-06-30T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  { type: "selfPaced" as const, id: 3, title: "Nail the Google PM Interview Cycle", image: event3, percentComplete: 65, totalTime: "7 hours" },
  { type: "selfPaced" as const, id: 4, title: "Consulting Case Interview Mastery: Frameworks, Practice, and Offer Strategy", image: eventImage, percentComplete: 20, totalTime: "6 hours" },
  { type: "selfPaced" as const, id: 6, title: "MBA Application Essay Masterclass", image: event1, percentComplete: 100, totalTime: "4 hours" },
] as EnrolledCourse[]).sort((a, b) => sortKey(a) - sortKey(b));

const suggestedCourses = [
  { title: "Stanford MBA Application Workshop", type: "Live cohort", duration: "4 weeks", image: event1 },
  { title: "Product Management Fundamentals", type: "Self study", duration: "8h", image: event2 },
  { title: "Finance for Non-Finance MBAs", type: "Live cohort", duration: "3 weeks", image: event3 },
  { title: "Leadership & Organizational Behavior", type: "Self study", duration: "6h", image: eventImage },
];

// ─── Self-paced card ──────────────────────────────────────────────────────────

function SelfPacedCourseCard({ course, boxed }: { course: SelfPacedCourse; boxed?: boolean }) {
  const isCompleted = course.percentComplete >= 100;
  const isNotStarted = course.percentComplete === 0;
  const progressRow = (
    <div className="min-w-0 flex-1">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[14px] text-[#707070]">{course.percentComplete}% complete</p>
        <p className="text-[14px] text-[#9B9B9B]">{course.totalTime}</p>
      </div>
      <div className="h-[6px] w-full rounded-full bg-[#E5E5E5]">
        <div className="h-full rounded-full bg-[#038561] transition-all" style={{ width: `${course.percentComplete}%` }} />
      </div>
    </div>
  );

  return (
    <a href="#" className={`block cursor-pointer no-underline${boxed ? " overflow-hidden rounded-xl border border-gray-stroke p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-transform hover:translate-x-0.5 md:p-5" : ""}`}>
      {/* Image + text */}
      <div className="flex items-center gap-4 md:gap-5">
        <div className="relative w-1/3 shrink-0 md:w-[220px]">
          <img
            src={course.image}
            alt=""
            className={`aspect-[120/63] w-full rounded-lg object-cover${isCompleted ? " opacity-50" : ""}`}
          />
          {isCompleted && (
            <span className="absolute bottom-2 left-2 rounded-md bg-white px-2 py-1 text-[14px] font-medium text-gray-dark shadow-sm">
              Complete
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-4">
          <div>
            <p className="text-[14px] font-medium uppercase tracking-[1.4px] text-gray-light">Self study</p>
            <h3 className="mt-1 line-clamp-2 text-[20px] font-medium leading-[1.2] text-gray-dark md:line-clamp-1 md:text-[24px]">{course.title}</h3>
          </div>
          {/* Progress + chevron: desktop only */}
          <div className="hidden items-center gap-5 md:flex">
            {progressRow}
            <svg className="shrink-0 text-[#9B9B9B]" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {/* Chevron: mobile only */}
        <svg className="shrink-0 self-center text-[#9B9B9B] md:hidden" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Progress: mobile only */}
      <div className="mt-4 md:hidden">{progressRow}</div>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const completedOnlyCourses: EnrolledCourse[] = [
  {
    type: "live" as const,
    id: 20,
    title: "Tech PM Interview Accelerator",
    cohortDateLabel: "Winter cohort",
    cohortDates: "Jan 6 – Feb 3, 2026",
    registrants: [pic4, pic1, pic6],
    image: eventImage,
    sessions: [
      { id: 2001, title: "PM Fundamentals", duration: "60 min", slots: [
        { id: 20010, startTime: new Date("2026-01-06T09:00:00"), endTime: new Date("2026-01-06T10:00:00"), recordingUrl: "#" },
        { id: 20011, startTime: new Date("2026-01-06T19:00:00"), endTime: new Date("2026-01-06T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 2002, title: "Product Sense & Design", duration: "60 min", slots: [
        { id: 20020, startTime: new Date("2026-01-13T09:00:00"), endTime: new Date("2026-01-13T10:00:00"), recordingUrl: "#" },
        { id: 20021, startTime: new Date("2026-01-13T19:00:00"), endTime: new Date("2026-01-13T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 2003, title: "Metrics & Analytical Questions", duration: "60 min", slots: [
        { id: 20030, startTime: new Date("2026-01-20T09:00:00"), endTime: new Date("2026-01-20T10:00:00"), recordingUrl: "#" },
        { id: 20031, startTime: new Date("2026-01-20T19:00:00"), endTime: new Date("2026-01-20T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 2004, title: "Behavioral & Leadership", duration: "60 min", slots: [
        { id: 20040, startTime: new Date("2026-01-27T09:00:00"), endTime: new Date("2026-01-27T10:00:00"), recordingUrl: "#" },
        { id: 20041, startTime: new Date("2026-01-27T19:00:00"), endTime: new Date("2026-01-27T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 2005, title: "Mock Interviews & Debrief", duration: "90 min", slots: [
        { id: 20050, startTime: new Date("2026-02-03T09:00:00"), endTime: new Date("2026-02-03T10:30:00"), recordingUrl: "#" },
        { id: 20051, startTime: new Date("2026-02-03T19:00:00"), endTime: new Date("2026-02-03T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  { type: "selfPaced" as const, id: 11, title: "Nail the Google PM Interview Cycle", image: event3, percentComplete: 100, totalTime: "7 hours" },
  { type: "selfPaced" as const, id: 12, title: "Consulting Case Interview Mastery: Frameworks, Practice, and Offer Strategy", image: eventImage, percentComplete: 100, totalTime: "6 hours" },
];

type Variant = "default" | "grouped" | "empty" | "completedOnly" | "simple";

export default function MyCourses() {
  const { setSimpleSessionLayout } = useSessionLayout();
  const [variant, setVariant] = useState<Variant>("default");

  function applyVariant(v: Variant) {
    setVariant(v);
    setSimpleSessionLayout(v === "grouped");
  }

  const isCourseDone = (c: EnrolledCourse) =>
    c.type === "selfPaced" ? c.percentComplete >= 100 : isLiveCourseCompleted(c as LiveCourse);
  const courseList = variant === "completedOnly" ? completedOnlyCourses : enrolledCourses;
  const activeCourses = courseList.filter((c) => !isCourseDone(c));
  const completedCourses = courseList.filter(isCourseDone);

  const renderCard = (course: EnrolledCourse) =>
    course.type === "live"
      ? <LiveCourseCard key={course.id} course={course as LiveCourse} boxed={variant !== "simple"} />
      : <SelfPacedCourseCard key={course.id} course={course as SelfPacedCourse} boxed={variant !== "simple"} />;

  const suggestedCoursesSection = (
    <SidebarGroup label="Suggested courses" href="/browse">
      {suggestedCourses.map((course, i) => (
        <SidebarCard
          key={i}
          variant="course"
          image={course.image}
          title={course.title}
          subtitle={`${course.type} · ${course.duration}`}
        />
      ))}
    </SidebarGroup>
  );

  return (
    <PageShell contentMaxWidth={600}>
      <div className="pb-20 leading-[1.2] [&_button]:leading-[1.2]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">My Courses</h1>
        <div className="flex rounded-lg border border-gray-stroke/50 bg-gray-hover p-0.5 text-[14px] font-medium">
          {(["default", "grouped", "completedOnly", "empty"] as Variant[]).map((v) => (
            <button
              key={v}
              onClick={() => applyVariant(v)}
              className={`cursor-pointer rounded-md px-3 py-1.5 capitalize transition-colors ${
                variant === v ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#707070] hover:text-gray-dark"
              }`}
            >
              {v === "completedOnly" ? "Complete" : v}
            </button>
          ))}
        </div>
      </div>

      {/* All enrolled courses */}
      {variant === "empty" ? (
        <div className="mt-8 flex h-[75vh] min-h-fit min-w-fit flex-col items-center justify-center gap-5 rounded-xl bg-[#F5F5F5] py-10 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[24px] font-medium text-gray-dark">No purchased courses</h2>
            <p className="max-w-xs text-[16px] text-[#707070]">Courses you enroll in will appear here.</p>
          </div>
          <a
            href="/courses"
            className="mt-1 flex h-[44px] items-center rounded-lg bg-[#038561] px-4 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90"
          >
            Browse courses
          </a>
        </div>
      ) : (
        <div className={`mt-8 flex flex-col ${variant === "simple" ? "gap-16" : "gap-6"}`}>
          {activeCourses.length === 0 && completedCourses.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-5 rounded-xl bg-[#F5F5F5] py-10 text-center">
              <div className="flex flex-col gap-2">
                <h2 className="text-[24px] font-medium text-gray-dark">No in-progress courses</h2>
                <p className="max-w-xs text-[16px] text-[#707070]">Courses you enroll in will appear here.</p>
              </div>
              <a
                href="/courses"
                className="mt-1 flex h-[44px] items-center rounded-lg bg-[#038561] px-4 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90"
              >
                Browse courses
              </a>
            </div>
          )}
          {activeCourses.map(renderCard)}
          {completedCourses.length > 0 && (
            <>
              <div className="mt-4">
                <h2 className="text-[24px] font-medium leading-[1.2] text-gray-dark">Past courses</h2>
                <div className="mt-3 border-t border-gray-stroke" />
              </div>
              {completedCourses.map(renderCard)}
            </>
          )}
        </div>
      )}
      </div>
    </PageShell>
  );
}
