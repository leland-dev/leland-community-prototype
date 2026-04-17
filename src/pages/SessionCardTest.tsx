import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import SessionCard from "../components/SessionCard";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic6 from "../assets/profile photos/pic-6.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";

export default function SessionCardTest() {
  useEffect(() => { document.title = "Component: Session Card"; }, []);
  const [pastOpen, setPastOpen] = useState(false);
  const [sandboxType, setSandboxType] = useState<"coach" | "event" | "bootcamp">("coach");
  const [sandboxStatus, setSandboxStatus] = useState<"upcoming" | "live" | "past">("upcoming");
  const [sandboxSize, setSandboxSize] = useState<"large" | "small">("large");
  const [sandboxRecording, setSandboxRecording] = useState(true);
  const [sandboxHideImage, setSandboxHideImage] = useState(false);

  return (
    <PageShell variant="thin">
      {/* Page header */}
      <Link to="/components" className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[13px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]">&lt;COMPONENT&gt;</Link>
      <h1 className="mt-1 text-[40px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Session Card</h1>
      <p className="mt-1 text-[18px] text-[#707070]">
        A global component to display a user's upcoming, live, and past sessions across 1:1 coaching, events, and courses.
      </p>

      {/* Demo container */}
      <div className="mt-10">
        <div className="rounded-[24px] border border-[#E5E5E5] px-3 py-2">
          <div className="flex flex-col gap-1">
            <SessionCard
              title="Alex <> Jessica"
              dateTime="Tuesday, Aug 3 at 4:00 PM"
              duration="45m"
              image={pic1}
              type="coach"
              status="live"
            />
            <SessionCard
              title="GMAT Exam Prep Bootcamp"
              dateTime="Tuesday, Aug 3 at 4:00 PM"
              duration="45m"
              image={eventImg1}
              type="event"
              status="upcoming"
              startsIn="2d"
            />
            <SessionCard
              title="1:1 Session with Jessica"
              dateTime="Friday, Aug 6 at 4:00 PM"
              duration="45m"
              image={pic6}
              type="coach"
              status="upcoming"
              startsIn="5d"
            />
          </div>

          <button
            onClick={() => setPastOpen(!pastOpen)}
            className="my-4 ml-2 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
          >
            {pastOpen ? "Hide past sessions" : "View past sessions"}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${pastOpen ? "rotate-180" : ""}`}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <AnimatePresence initial={false}>
            {pastOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-1">
                  <SessionCard
                    title="1:1 Session with Marcus"
                    dateTime="Friday, Mar 28 at 10:00 AM"
                    duration="45m"
                    image={pic3}
                    type="coach"
                    status="past"
                  />
                  <SessionCard
                    title="Resume Review Workshop"
                    dateTime="Thursday, Mar 27 at 3:00 PM"
                    duration="60m"
                    image={pic4}
                    type="coach"
                    status="past"
                    hasRecording
                  />
                  <SessionCard
                    title="MBA Admissions Strategy"
                    dateTime="Tuesday, Mar 25 at 1:00 PM"
                    duration="45m"
                    image={eventImg2}
                    type="event"
                    status="past"
                    hasRecording
                  />
                  <SessionCard
                    title="Intro Webinar: Getting Started"
                    dateTime="Monday, Mar 24 at 11:00 AM"
                    duration="30m"
                    image={eventImg3}
                    type="event"
                    status="past"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Demo */}
      <div className="mt-14 mb-16">
        <h2 className="text-[24px] font-medium text-gray-dark">Demo</h2>
        <p className="mt-1 mb-4 text-[18px] text-[#707070]">Toggle the options below to preview all possible states of the component.</p>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Type toggle */}
          <div className="flex rounded-lg bg-[#f5f5f5] p-[3px]">
            {(["coach", "event", "bootcamp"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSandboxType(t)}
                className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors ${
                  sandboxType === t
                    ? "bg-white text-gray-dark shadow-sm"
                    : "text-[#707070]"
                }`}
              >
                <span className="whitespace-nowrap">{t === "coach" ? "1:1 Session" : t === "event" ? "Event" : "Bootcamp Session"}</span>
              </button>
            ))}
          </div>

          {/* Size toggle */}
          <div className="flex rounded-lg bg-[#f5f5f5] p-[3px]">
            {(["large", "small"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSandboxSize(s)}
                className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors ${
                  sandboxSize === s
                    ? "bg-white text-gray-dark shadow-sm"
                    : "text-[#707070]"
                }`}
              >
                <span className="whitespace-nowrap">{s === "large" ? "Large" : "Small"}</span>
              </button>
            ))}
          </div>

          {/* Status toggle */}
          <div className="flex rounded-lg bg-[#f5f5f5] p-[3px]">
            {(["upcoming", "live", "past"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSandboxStatus(s)}
                className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors ${
                  sandboxStatus === s
                    ? "bg-white text-gray-dark shadow-sm"
                    : "text-[#707070]"
                }`}
              >
                <span className="whitespace-nowrap">{s === "live" ? "Happening now" : s === "upcoming" ? "Upcoming" : "Past"}</span>
              </button>
            ))}
          </div>
        </div>

        {sandboxStatus === "past" && (
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-[16px] font-normal text-[#707070]">
            <span
              className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border border-[#CCCCCC]"
              style={sandboxRecording ? { backgroundColor: "#038561", borderColor: "#038561" } : undefined}
            >
              <input
                type="checkbox"
                checked={sandboxRecording}
                onChange={() => setSandboxRecording(!sandboxRecording)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              {sandboxRecording && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            Session was recorded
          </label>
        )}

        <label className="mt-2 flex cursor-pointer items-center gap-2 text-[16px] font-normal text-[#707070]">
          <span
            className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border border-[#CCCCCC]"
            style={sandboxHideImage ? { backgroundColor: "#038561", borderColor: "#038561" } : undefined}
          >
            <input
              type="checkbox"
              checked={sandboxHideImage}
              onChange={() => setSandboxHideImage(!sandboxHideImage)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {sandboxHideImage && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          Hide image
        </label>

        {/* Outer dashed container */}
        <div
          className="mt-4 flex items-center justify-center rounded-[32px] bg-[#F0F0F0] p-3"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` }}
        >
          {/* Inner white card */}
          <div
            className="flex h-[330px] w-full items-center rounded-[24px] bg-white px-6 [&>*]:w-full"
            style={{ boxShadow: "0 20px 24px -4px rgba(16, 24, 40, 0.08)" }}
          >
            <SessionCard
              title={sandboxType === "coach" ? "1:1 Session with Jessica" : "GMAT Exam Prep Bootcamp"}
              dateTime={sandboxStatus === "live" ? "Tuesday, Aug 3 at 4:00 PM" : sandboxStatus === "upcoming" ? "Friday, Aug 6 at 4:00 PM" : "Thursday, Mar 27 at 3:00 PM"}
              duration={sandboxType === "coach" ? "45m" : "60m"}
              image={sandboxType === "coach" ? pic6 : eventImg1}
              type={sandboxType}
              status={sandboxStatus}
              size={sandboxSize}
              startsIn={sandboxStatus === "upcoming" ? "5d" : undefined}
              hasRecording={sandboxStatus === "past" ? sandboxRecording : undefined}
              hideImage={sandboxHideImage}
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
