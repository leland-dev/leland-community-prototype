import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import LiveCourseCard, { LiveCourse, TimeSlot } from "../components/LiveCourseCard";
import { SessionLayoutProvider } from "../components/SessionLayoutContext";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";

// ─── Sample data ──────────────────────────────────────────────────────────────

const liveNow = new Date(Date.now() + 15 * 60 * 1000);
const liveEnd = new Date(Date.now() + 105 * 60 * 1000);
const eveningSoon = new Date(Date.now() + 3 * 60 * 60 * 1000);
const eveningSoonEnd = new Date(Date.now() + 4.5 * 60 * 60 * 1000);

const activeCourse: LiveCourse = {
  type: "live",
  id: 1,
  title: "MBA Admissions Strategy Bootcamp",
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
    { id: 103, title: "Building Your Narrative", duration: "90 min", slots: [
      { id: 1030, startTime: liveNow, endTime: liveEnd },
      { id: 1031, startTime: eveningSoon, endTime: eveningSoonEnd },
    ] as [TimeSlot, TimeSlot] },
    { id: 104, title: "Essays & Short Answers", duration: "90 min", slots: [
      { id: 1040, startTime: new Date("2026-04-09T09:00:00"), endTime: new Date("2026-04-09T10:30:00") },
      { id: 1041, startTime: new Date("2026-04-09T19:00:00"), endTime: new Date("2026-04-09T20:30:00") },
    ] as [TimeSlot, TimeSlot] },
  ],
};

const noCohortCourse: LiveCourse = {
  type: "live",
  id: 2,
  title: "Law School Admissions Bootcamp",
  cohortDateLabel: "Fall admissions",
  cohortDates: "May 5 – Jun 9, 2026",
  registrants: [pic3, pic5, pic1],
  image: event3,
  cohortSelected: false,
  sessions: [],
};

const completedCourse: LiveCourse = {
  type: "live",
  id: 3,
  title: "Tech PM Interview Accelerator",
  cohortDateLabel: "Winter cohort",
  cohortDates: "Jan 6 – Feb 3, 2026",
  registrants: [pic4, pic1],
  image: event2,
  sessions: [
    { id: 501, title: "PM Fundamentals", duration: "60 min", slots: [
      { id: 5010, startTime: new Date("2026-01-06T09:00:00"), endTime: new Date("2026-01-06T10:00:00"), recordingUrl: "#" },
      { id: 5011, startTime: new Date("2026-01-06T19:00:00"), endTime: new Date("2026-01-06T20:00:00"), recordingUrl: "#" },
    ] as [TimeSlot, TimeSlot] },
    { id: 502, title: "Mock Interviews & Debrief", duration: "90 min", slots: [
      { id: 5020, startTime: new Date("2026-01-13T09:00:00"), endTime: new Date("2026-01-13T10:30:00"), recordingUrl: "#" },
      { id: 5021, startTime: new Date("2026-01-13T19:00:00"), endTime: new Date("2026-01-13T20:30:00"), recordingUrl: "#" },
    ] as [TimeSlot, TimeSlot] },
  ],
};

const courseByState = { active: activeCourse, "no-cohort": noCohortCourse, completed: completedCourse };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseBlockTest() {
  useEffect(() => { document.title = "Component: Course Block"; }, []);

  const [sandboxState, setSandboxState] = useState<"active" | "no-cohort" | "completed">("active");
  const [sandboxBoxed, setSandboxBoxed] = useState(false);

  return (
    <SessionLayoutProvider>
      <PageShell variant="thin">
        {/* Page header */}
        <Link to="/components" className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[13px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]">&lt;COMPONENT&gt;</Link>
        <h1 className="mt-1 text-[40px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Course Block</h1>
        <p className="mt-1 text-[18px] text-[#707070]">
          Displays an enrolled course with its sessions, status, and actions. Supports live cohort and self-paced course types, with default and boxed display variants.
        </p>

        {/* Demo container */}
        <div className="mt-10">
          <div className="rounded-[24px] border border-[#E5E5E5] p-6">
            <div className="flex flex-col gap-10">
              {/* Active */}
              <div>
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#9B9B9B]">Active · Session live now</p>
                <LiveCourseCard course={activeCourse} />
              </div>
              {/* No cohort */}
              <div>
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#9B9B9B]">No cohort selected</p>
                <LiveCourseCard course={noCohortCourse} />
              </div>
              {/* Completed */}
              <div>
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#9B9B9B]">Completed</p>
                <LiveCourseCard course={completedCourse} />
              </div>
              {/* Boxed */}
              <div>
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#9B9B9B]">Boxed variant</p>
                <div className="flex flex-col gap-8">
                  <LiveCourseCard course={activeCourse} boxed />
                  <LiveCourseCard course={noCohortCourse} boxed />
                  <LiveCourseCard course={completedCourse} boxed />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo */}
        <div className="mt-14 mb-16">
          <h2 className="text-[24px] font-medium text-gray-dark">Demo</h2>
          <p className="mt-1 mb-4 text-[18px] text-[#707070]">Toggle the options below to preview all possible states of the component.</p>

          <div className="flex flex-wrap items-center gap-2">
            {/* State toggle */}
            <div className="flex rounded-lg bg-[#f5f5f5] p-[3px]">
              {(["active", "no-cohort", "completed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSandboxState(s)}
                  className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors ${
                    sandboxState === s ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"
                  }`}
                >
                  <span className="whitespace-nowrap capitalize">{s === "no-cohort" ? "No cohort" : s}</span>
                </button>
              ))}
            </div>

            {/* Boxed toggle */}
            <div className="flex rounded-lg bg-[#f5f5f5] p-[3px]">
              {([false, true] as const).map((b) => (
                <button
                  key={String(b)}
                  onClick={() => setSandboxBoxed(b)}
                  className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors ${
                    sandboxBoxed === b ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"
                  }`}
                >
                  <span className="whitespace-nowrap">{b ? "Boxed" : "Default"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox */}
          <div
            className="mt-4 flex items-center justify-center rounded-[32px] bg-[#F0F0F0] p-6"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` }}
          >
            <div className="w-full rounded-[24px] bg-white p-6" style={{ boxShadow: "0 20px 24px -4px rgba(16, 24, 40, 0.08)" }}>
              <LiveCourseCard course={courseByState[sandboxState]} boxed={sandboxBoxed} />
            </div>
          </div>
        </div>
      </PageShell>
    </SessionLayoutProvider>
  );
}
