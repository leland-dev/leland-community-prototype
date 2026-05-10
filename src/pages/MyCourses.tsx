import { useState } from "react";
import PageShell from "../components/PageShell";
import { LinkButton } from "../components/Button";
import OfferingCard from "../components/OfferingCard";
import { LiveCourse, isLiveCourseCompleted } from "../components/LiveCourseCard";
import SidebarCard, { SidebarGroup } from "../components/SidebarCard";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";
import eventImage from "../assets/img/EventImage.avif";
import aiBuilderL1 from "../assets/img/ai-builder-l3.avif";
import aiBuilderL2 from "../assets/img/ai-builder-l1.avif";
import aiBuilderL3 from "../assets/img/ai-builder-l2.avif";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import arrowRightSmIcon from "../assets/icons/arrow-right.svg";

// ─── Data ────────────────────────────────────────────────────────────────────

type TimeSlot = { id: number; startTime: Date; endTime: Date; recordingUrl?: string };

type SelfPacedCourse = {
  type: "selfPaced";
  id: number;
  title: string;
  image: string;
  percentComplete: number;
  totalTime: string;
};

type EnrolledCourse = LiveCourse | SelfPacedCourse;

const enrolledCourses: EnrolledCourse[] = [
  {
    type: "live" as const,
    id: 1,
    title: "AI Builder Program: Level 1 — Use AI to 10x Your Impact",
    cohortDateLabel: "Cohort 4",
    cohortDates: "May 12–29, 2026",
    registrants: [pic1, pic3, pic4],
    image: aiBuilderL1,
    sessions: [
      { id: 101, title: "AI Foundations & Mindset Shift", duration: "90 min", slots: [
        { id: 1010, startTime: new Date("2026-05-12T09:00:00"), endTime: new Date("2026-05-12T10:30:00") },
        { id: 1011, startTime: new Date("2026-05-12T19:00:00"), endTime: new Date("2026-05-12T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 102, title: "Prompting for Real Work", duration: "90 min", slots: [
        { id: 1020, startTime: new Date("2026-05-16T09:00:00"), endTime: new Date("2026-05-16T10:30:00") },
        { id: 1021, startTime: new Date("2026-05-16T19:00:00"), endTime: new Date("2026-05-16T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 103, title: "AI for Research & Analysis", duration: "90 min", slots: [
        { id: 1030, startTime: new Date("2026-05-20T09:00:00"), endTime: new Date("2026-05-20T10:30:00") },
        { id: 1031, startTime: new Date("2026-05-20T19:00:00"), endTime: new Date("2026-05-20T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 104, title: "Automation & Workflow Design", duration: "90 min", slots: [
        { id: 1040, startTime: new Date("2026-05-23T09:00:00"), endTime: new Date("2026-05-23T10:30:00") },
        { id: 1041, startTime: new Date("2026-05-23T19:00:00"), endTime: new Date("2026-05-23T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 105, title: "Build Session & Wrap-Up", duration: "90 min", slots: [
        { id: 1050, startTime: new Date("2026-05-29T09:00:00"), endTime: new Date("2026-05-29T10:30:00") },
        { id: 1051, startTime: new Date("2026-05-29T19:00:00"), endTime: new Date("2026-05-29T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  {
    type: "live" as const,
    id: 2,
    title: "AI Builder Program: Level 2 — Build Complex Agentic Workflows",
    cohortDateLabel: "Cohort 2",
    cohortDates: "May 26 – Jun 13, 2026",
    registrants: [pic3, pic5, pic4],
    image: aiBuilderL2,
    sessions: [
      { id: 201, title: "Product Thinking with AI", duration: "90 min", slots: [
        { id: 2010, startTime: new Date("2026-05-26T09:00:00"), endTime: new Date("2026-05-26T10:30:00") },
        { id: 2011, startTime: new Date("2026-05-26T19:00:00"), endTime: new Date("2026-05-26T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 202, title: "Prototyping with AI Tools", duration: "90 min", slots: [
        { id: 2020, startTime: new Date("2026-05-30T09:00:00"), endTime: new Date("2026-05-30T10:30:00") },
        { id: 2021, startTime: new Date("2026-05-30T19:00:00"), endTime: new Date("2026-05-30T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 203, title: "Evals & Iteration", duration: "90 min", slots: [
        { id: 2030, startTime: new Date("2026-06-03T09:00:00"), endTime: new Date("2026-06-03T10:30:00") },
        { id: 2031, startTime: new Date("2026-06-03T19:00:00"), endTime: new Date("2026-06-03T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 204, title: "Shipping & Feedback Loops", duration: "90 min", slots: [
        { id: 2040, startTime: new Date("2026-06-07T09:00:00"), endTime: new Date("2026-06-07T10:30:00") },
        { id: 2041, startTime: new Date("2026-06-07T19:00:00"), endTime: new Date("2026-06-07T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 205, title: "Demo Day & Next Steps", duration: "90 min", slots: [
        { id: 2050, startTime: new Date("2026-06-13T09:00:00"), endTime: new Date("2026-06-13T10:30:00") },
        { id: 2051, startTime: new Date("2026-06-13T19:00:00"), endTime: new Date("2026-06-13T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  {
    type: "live" as const,
    id: 3,
    title: "AI Builder Program: Level 3 — Create Autonomous Agents",
    cohortDateLabel: "Cohort 1",
    cohortDates: "Jun 9–27, 2026",
    registrants: [pic1, pic4, pic6],
    image: aiBuilderL3,
    sessions: [
      { id: 301, title: "Agent Architecture Overview", duration: "90 min", slots: [
        { id: 3010, startTime: new Date("2026-06-09T09:00:00"), endTime: new Date("2026-06-09T10:30:00") },
        { id: 3011, startTime: new Date("2026-06-09T19:00:00"), endTime: new Date("2026-06-09T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 302, title: "Tool Use & Memory", duration: "90 min", slots: [
        { id: 3020, startTime: new Date("2026-06-13T09:00:00"), endTime: new Date("2026-06-13T10:30:00") },
        { id: 3021, startTime: new Date("2026-06-13T19:00:00"), endTime: new Date("2026-06-13T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 303, title: "Building Your Agent", duration: "90 min", slots: [
        { id: 3030, startTime: new Date("2026-06-18T09:00:00"), endTime: new Date("2026-06-18T10:30:00") },
        { id: 3031, startTime: new Date("2026-06-18T19:00:00"), endTime: new Date("2026-06-18T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 304, title: "Testing & Deployment", duration: "90 min", slots: [
        { id: 3040, startTime: new Date("2026-06-23T09:00:00"), endTime: new Date("2026-06-23T10:30:00") },
        { id: 3041, startTime: new Date("2026-06-23T19:00:00"), endTime: new Date("2026-06-23T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 305, title: "Agent Demo & Graduation", duration: "90 min", slots: [
        { id: 3050, startTime: new Date("2026-06-27T09:00:00"), endTime: new Date("2026-06-27T10:30:00") },
        { id: 3051, startTime: new Date("2026-06-27T19:00:00"), endTime: new Date("2026-06-27T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
    ],
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
];

const suggestedCourses = [
  { title: "AI for Business Leaders", type: "Live cohort", duration: "3 weeks", image: event1 },
  { title: "Prompt Engineering Fundamentals", type: "Self study", duration: "5h", image: event2 },
  { title: "Building with the Claude API", type: "Live cohort", duration: "4 weeks", image: event3 },
  { title: "AI Product Strategy", type: "Self study", duration: "6h", image: eventImage },
];

function courseSubtitle(course: EnrolledCourse): string {
  if (course.type === "selfPaced") return `Self study · ${course.totalTime}`;
  return `${course.cohortDateLabel} · ${course.cohortDates}`;
}

function isCourseDone(course: EnrolledCourse): boolean {
  if (course.type === "selfPaced") return course.percentComplete >= 100;
  return isLiveCourseCompleted(course as LiveCourse);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Variant = "default" | "single" | "past" | "empty";

export default function MyCourses() {
  const [variant, setVariant] = useState<Variant>("default");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const allActive = enrolledCourses.filter((c) => !isCourseDone(c));
  const allCompleted = enrolledCourses.filter(isCourseDone);
  const activeCourses = variant === "empty" || variant === "past" ? [] : variant === "single" ? allActive.slice(0, 1) : allActive;
  const completedCourses = variant === "empty" || variant === "single" ? [] : allCompleted;

  const noInProgressPlaceholder = (
    <div className="flex flex-col items-center justify-center gap-5 rounded-xl bg-[#F5F5F5] py-16 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-medium text-gray-dark">Nothing in progress</h2>
        <p className="max-w-xs text-[16px] text-[#707070]">Programs you enroll in will appear here.</p>
      </div>
      <LinkButton href="/courses" size="lg" variant="primary">Browse courses</LinkButton>
    </div>
  );

  const suggestedCoursesSection = (
    <SidebarGroup label="Suggested programs" href="/browse">
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
    <PageShell variant={showSidebar ? "standard" : "thin"} rightSidebar={showSidebar ? suggestedCoursesSection : undefined}>
      <div className="pb-20 leading-[1.2]">
        <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">My Programs</h1>

        <div className="mt-8">
          {activeCourses.length === 0 ? (
            noInProgressPlaceholder
          ) : (
            <div className="flex flex-col gap-1">
              {activeCourses.map((course) => (
                <OfferingCard
                  key={course.id}
                  type="course"
                  title={course.title}
                  subtitle={courseSubtitle(course)}
                  image={course.image}
                  purchased
                  cohortSelected={course.type === "live" ? course.cohortSelected !== false : true}
                  showImage
                />
              ))}
            </div>
          )}
        </div>

        {completedCourses.length > 0 && (
          <div className="mt-10">
            <h2 className="text-[24px] font-medium leading-[1.2] text-gray-dark">Past programs</h2>
            <div className="mt-4 flex flex-col gap-1">
              {completedCourses.map((course) => (
                <OfferingCard
                  key={course.id}
                  type="course"
                  title={course.title}
                  subtitle={courseSubtitle(course)}
                  image={course.image}
                  purchased
                  cohortSelected
                  showImage
                />
              ))}
            </div>
          </div>
        )}

        {!showSidebar && activeCourses.length + completedCourses.length <= 1 && (
          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[24px] font-medium leading-[1.2] text-gray-dark">Explore programs</h2>
              <a href="/browse" className="flex items-center gap-1 text-[15px] font-medium text-[#038561] hover:opacity-80">
                See all
                <img src={arrowRightSmIcon} alt="" className="h-4 w-4 opacity-70" />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              {suggestedCourses.map((course, i) => (
                <OfferingCard
                  key={i}
                  type="course"
                  title={course.title}
                  subtitle={`${course.type} · ${course.duration}`}
                  image={course.image}
                  showImage
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        {optionsOpen && (
          <div className="mb-2 w-[240px] rounded-xl border border-gray-stroke bg-white px-4 py-3 shadow-lg">
            <p className="mb-2.5 text-[14px] font-medium uppercase tracking-[0.5px] text-gray-light">Page variant</p>
            <div className="flex flex-col gap-2">
              {([
                { value: "default", label: "Default" },
                { value: "single", label: "Single program" },
                { value: "past", label: "Past programs only" },
                { value: "empty", label: "Empty" },
              ] as { value: Variant; label: string }[]).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setVariant(value)}
                  className="flex cursor-pointer items-center gap-2.5 text-[16px] leading-[1.2]"
                >
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${variant === value ? "border-[#038561] bg-[#038561]" : "border-gray-300"}`}>
                    {variant === value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className={variant === value ? "font-medium text-gray-dark" : "text-gray-light"}>{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">Suggested programs sidebar</p>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${showSidebar ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${showSidebar ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setOptionsOpen(!optionsOpen)}
          className={`ml-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-stroke bg-white shadow-lg transition-colors hover:bg-gray-hover ${optionsOpen ? "bg-gray-hover" : ""}`}
        >
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
            <circle cx="8" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
            <circle cx="14" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
          </svg>
        </button>
      </div>
    </PageShell>
  );
}
