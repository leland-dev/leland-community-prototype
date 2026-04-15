import { useState } from "react";
import PageShell from "../components/PageShell";
import LiveCourseCard, { LiveCourse, TimeSlot, getSessionState } from "../components/LiveCourseCard";
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
  { type: "selfPaced" as const, id: 3, title: "Nail the Google PM Interview Cycle", image: event3, percentComplete: 65, totalTime: "7 hours" },
  { type: "selfPaced" as const, id: 4, title: "Consulting Case Interview Mastery: Frameworks, Practice, and Offer Strategy", image: eventImage, percentComplete: 20, totalTime: "6 hours" },
  { type: "selfPaced" as const, id: 6, title: "MBA Application Essay Masterclass", image: event1, percentComplete: 100, totalTime: "4 hours" },
] as EnrolledCourse[]).sort((a, b) => sortKey(a) - sortKey(b));

const suggestedCourses = [
  { title: "Stanford MBA Application Workshop", type: "Live cohort", duration: "4 weeks", image: event1 },
  { title: "Product Management Fundamentals", type: "Self-paced", duration: "8h", image: event2 },
  { title: "Finance for Non-Finance MBAs", type: "Live cohort", duration: "3 weeks", image: event3 },
  { title: "Leadership & Organizational Behavior", type: "Self-paced", duration: "6h", image: eventImage },
];

// ─── Self-paced card ──────────────────────────────────────────────────────────

function SelfPacedCourseCard({ course, boxed }: { course: SelfPacedCourse; boxed?: boolean }) {
  const isCompleted = course.percentComplete >= 100;
  const isNotStarted = course.percentComplete === 0;
  const progressRow = (
    <div className="flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-[16px] text-[#707070]">{course.percentComplete}% complete</p>
          <p className="text-[16px] text-[#9B9B9B]">{course.totalTime}</p>
        </div>
        <div className="h-[6px] w-full rounded-full bg-[#E5E5E5]">
          <div className="h-full rounded-full bg-[#038561] transition-all" style={{ width: `${course.percentComplete}%` }} />
        </div>
      </div>
      {isCompleted ? (
        <button className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-hover bg-gray-hover px-4 py-2.5 text-[16px] font-medium leading-[1.2] text-gray-dark transition-colors hover:border-gray-stroke hover:bg-white">
          View
        </button>
      ) : (
        <button className="shrink-0 cursor-pointer rounded-lg bg-[#038561] px-4 py-2.5 text-[16px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#038561]/90">
          {isNotStarted ? "Start" : "Continue"}
        </button>
      )}
    </div>
  );

  return (
    <div className={boxed ? `overflow-hidden rounded-xl border border-gray-stroke p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-transform hover:translate-x-0.5 md:p-5${isCompleted ? " opacity-75" : ""}` : ""}>
      {/* Image + text */}
      <div className="flex items-center gap-4 md:gap-5">
        <div className="w-1/3 shrink-0 md:w-[220px]">
          <img
            src={course.image}
            alt=""
            className={`aspect-[120/63] w-full rounded-lg object-cover${isCompleted ? " opacity-50" : ""}`}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[14px] font-medium uppercase tracking-[1.4px] text-gray-light">Self-paced</p>
          <h3 className="mt-1 line-clamp-2 text-[20px] font-medium leading-[1.2] text-gray-dark md:line-clamp-1 md:text-[24px]">{course.title}</h3>
          {/* Progress + button: desktop only */}
          <div className="mt-4 hidden md:block">{progressRow}</div>
        </div>
      </div>
      {/* Progress + button: mobile only */}
      <div className="mt-4 md:hidden">{progressRow}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Variant = "simple" | "grouped" | "boxed";

export default function MyCourses() {
  const { setSimpleSessionLayout } = useSessionLayout();
  const [variant, setVariant] = useState<Variant>("simple");

  function applyVariant(v: Variant) {
    setVariant(v);
    setSimpleSessionLayout(v === "grouped");
  }

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
    <PageShell rightSidebar={suggestedCoursesSection}>
      <div className="pb-20 leading-[1.2] [&_button]:leading-[1.2]">
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-medium leading-[1.2] text-gray-dark md:text-[40px]">My Courses</h1>
        <div className="flex rounded-lg border border-gray-stroke/50 bg-gray-hover p-0.5 text-[14px] font-medium">
          {(["simple", "grouped", "boxed"] as Variant[]).map((v) => (
            <button
              key={v}
              onClick={() => applyVariant(v)}
              className={`cursor-pointer rounded-md px-3 py-1.5 capitalize transition-colors ${
                variant === v ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#707070] hover:text-gray-dark"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* All enrolled courses */}
      <div className={`mt-8 flex flex-col ${variant === "boxed" ? "gap-8" : "gap-16"}`}>
        {enrolledCourses.map((course) =>
          course.type === "live"
            ? <LiveCourseCard key={course.id} course={course as LiveCourse} boxed={variant === "boxed"} />
            : <SelfPacedCourseCard key={course.id} course={course as SelfPacedCourse} boxed={variant === "boxed"} />
        )}
      </div>
      </div>
    </PageShell>
  );
}
