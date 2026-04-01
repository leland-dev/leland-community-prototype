import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageShell from "../components/PageShell";
import arrowRoundIcon from "../assets/icons/arrow-round.svg";

import profilePhoto from "../assets/profile photos/profile photo.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";

// ─── Data ────────────────────────────────────────────────────────────────────

const upcomingEvents = [
  {
    day: "MON",
    date: 30,
    title: "1:1 Session with Jessica",
    dateTime: "March 30 at 2:00 PM",
    duration: "45 minutes",
    image: profilePhoto,
    isNow: true,
  },
  {
    day: "MON",
    date: 30,
    title: "MBA Strategy Live",
    dateTime: "March 30 at 4:00 PM",
    duration: "45 minutes",
    image: pic3,
    isNow: false,
  },
  {
    day: "WED",
    date: 1,
    title: "Intro Call with Samantha",
    dateTime: "April 1 at 11:00 AM",
    duration: "30 minutes",
    image: pic1,
    isNow: false,
  },
  {
    day: "THU",
    date: 2,
    title: "GMAT Exam Prep Bootcamp",
    dateTime: "April 2 at 6:00 PM",
    duration: "60 minutes",
    image: pic4,
    isNow: false,
  },
];

const pastEvents = [
  {
    title: "1:1 Session with Marcus",
    dateTime: "March 28 at 10:00 AM",
    duration: "45 minutes",
    image: pic3,
    hasRecording: false,
  },
  {
    title: "Resume Review Workshop",
    dateTime: "March 27 at 3:00 PM",
    duration: "60 minutes",
    image: pic4,
    hasRecording: true,
  },
  {
    title: "1:1 Session with Jessica",
    dateTime: "March 26 at 2:00 PM",
    duration: "45 minutes",
    image: profilePhoto,
    hasRecording: false,
  },
  {
    title: "MBA Admissions Strategy",
    dateTime: "March 25 at 1:00 PM",
    duration: "45 minutes",
    image: pic5,
    hasRecording: true,
  },
  {
    title: "Intro Call with David",
    dateTime: "March 24 at 11:00 AM",
    duration: "30 minutes",
    image: pic1,
    hasRecording: false,
  },
  {
    title: "GMAT Prep Live Session",
    dateTime: "March 21 at 4:00 PM",
    duration: "60 minutes",
    image: pic6,
    hasRecording: true,
  },
  {
    title: "Career Pivot Workshop",
    dateTime: "March 19 at 12:00 PM",
    duration: "45 minutes",
    image: pic3,
    hasRecording: false,
  },
  {
    title: "1:1 Session with Jessica",
    dateTime: "March 17 at 2:00 PM",
    duration: "45 minutes",
    image: profilePhoto,
    hasRecording: false,
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [pastOpen, setPastOpen] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState<1 | 2 | 3>(1);
  const [contentFilter, setContentFilter] = useState("All");
  const dashedBorder = { backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` };
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adminOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [adminOpen]);

  // Build right sidebar based on layout version
  let rightSidebarContent: React.ReactNode = undefined;

  if (layoutVersion === 1) {
    rightSidebarContent = (
      <div className="pt-6">
        <a href="#" className="flex items-center gap-1.5 text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-opacity hover:opacity-80">
          My Experts
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <div className="mt-4 flex flex-col gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[60px] rounded-lg bg-[#F5F5F5]" style={dashedBorder} />
          ))}
        </div>
      </div>
    );
  } else if (layoutVersion === 2) {
    rightSidebarContent = (
      <div className="pt-6">
        <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
          Upcoming Sessions
        </h2>
        <div className="mt-3">
          <div className="flex flex-col gap-1">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-[#F5F5F5]">
                <div className="flex w-[48px] flex-col items-center overflow-hidden rounded-[8px] border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
                  <div className="w-full bg-[#F5F5F5] text-center text-[12px] font-medium uppercase tracking-[0.05em] text-[#707070]">
                    {event.day}
                  </div>
                  <div className="w-full pt-0.5 pb-1 text-center text-[19px] font-medium leading-tight text-[#707070]">
                    {event.date}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-medium text-gray-dark">{event.title}</p>
                  <p className="text-[14px] text-[#707070]">
                    {event.dateTime}
                  </p>
                </div>
                {event.isNow && (
                  <button className="cursor-pointer rounded-lg bg-[#038561] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                    Join
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setPastOpen(!pastOpen)}
            className="my-4 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
          >
            {pastOpen ? "Hide past sessions" : "View past sessions"}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${pastOpen ? "rotate-180" : ""}`}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {pastOpen && (
            <div className="mt-2 flex flex-col gap-1">
              {pastEvents.map((event, i) => (
                <div key={i} className="group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-[#F5F5F5]">
                  <div className="flex w-[48px] flex-col items-center overflow-hidden rounded-[8px] border border-[#E5E5E5] bg-white opacity-50 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-opacity group-hover:opacity-100">
                    <div className="w-full bg-[#F5F5F5] text-center text-[12px] font-medium uppercase tracking-[0.05em] text-[#707070]">
                      {event.dateTime.split(" ")[0].toUpperCase().slice(0, 3)}
                    </div>
                    <div className="w-full pt-0.5 pb-1 text-center text-[19px] font-medium leading-tight text-[#707070]">
                      {event.dateTime.match(/\w+ (\d+)/)?.[1]}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-medium text-[#707070]">{event.title}</p>
                    <p className="text-[14px] text-[#707070]">
                      {event.dateTime}
                    </p>
                  </div>
                  {event.hasRecording && (
                    <button className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[#222222]/10 bg-white px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:border-[#222222]/20">
                      <img src={arrowRoundIcon} alt="" className="h-5 w-5" />
                      Rewatch
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    rightSidebarContent = (
      <div className="pt-6">
        <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
          My Content
        </h2>
        <div className="mt-3 flex flex-wrap gap-[6px]">
          {["All", "Courses", "Resources"].map((tab) => (
            <button
              key={tab}
              onClick={() => setContentFilter(tab)}
              className={`cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] ${
                contentFilter === tab ? "border-[1.5px] border-[#222222]" : "border-[1.5px] border-transparent transition-colors hover:bg-[#ebebeb]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-[60px] rounded-lg bg-[#F5F5F5]" style={dashedBorder} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageShell rightSidebar={rightSidebarContent}>
        <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">
          Welcome back, Alex
        </h1>

        {/* My Goals */}
        <section className="mt-8">
          <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
            My Goals
          </h2>
          <div className="scrollbar-hide -mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-[100px] w-[200px] shrink-0 snap-start rounded-xl bg-[#F5F5F5]" style={dashedBorder} />
            ))}
            <button className="flex h-[100px] w-[200px] shrink-0 cursor-pointer snap-start items-center justify-center rounded-xl border-none bg-[#F5F5F5] transition-colors hover:bg-[#EEEEEE]" style={dashedBorder}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 8v16M8 16h16" stroke="#9B9B9B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </section>

        {/* Upcoming Sessions — V1 and V3 show inline */}
        {(layoutVersion === 1 || layoutVersion === 3) && (
          <section className="mt-12">
            <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
              Upcoming Sessions
            </h2>
            <div className="mt-3">
              <div className="flex flex-col gap-1">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-[#F5F5F5]">
                    <img src={event.image} alt="" className="h-[44px] w-[44px] shrink-0 rounded-[4px] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[18px] font-medium text-gray-dark">{event.title}</p>
                      <p className="text-[16px] text-[#707070]">
                        {event.dateTime} · <span className="text-[#9B9B9B]">{event.duration}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center self-stretch">
                      {event.isNow ? (
                        <button className="cursor-pointer rounded-lg bg-[#038561] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                          Join
                        </button>
                      ) : (
                        <div className="flex w-[48px] flex-col items-center overflow-hidden rounded-[8px] border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
                          <div className="w-full bg-[#F5F5F5] text-center text-[12px] font-medium uppercase tracking-[0.05em] text-[#707070]">
                            {event.day}
                          </div>
                          <div className="w-full pt-0.5 pb-1 text-center text-[19px] font-medium leading-tight text-[#707070]">
                            {event.date}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPastOpen(!pastOpen)}
                className="my-4 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
              >
                {pastOpen ? "Hide past sessions" : "View past sessions"}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${pastOpen ? "rotate-180" : ""}`}>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {pastOpen && (
                <div className="mt-2 flex flex-col gap-1">
                  {pastEvents.map((event, i) => (
                    <div key={i} className="group flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-[#F5F5F5]">
                      <img src={event.image} alt="" className="h-[44px] w-[44px] shrink-0 rounded-[4px] object-cover opacity-50 transition-opacity group-hover:opacity-100" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[18px] font-medium text-[#707070]">{event.title}</p>
                        <p className="text-[16px] text-[#707070]">
                          {event.dateTime} · <span className="text-[#9B9B9B]">{event.duration}</span>
                        </p>
                      </div>
                      {event.hasRecording && (
                        <div className="flex shrink-0 items-center self-stretch">
                          <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#222222]/10 bg-white px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:border-[#222222]/20">
                            <img src={arrowRoundIcon} alt="" className="h-5 w-5" />
                            Rewatch
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* My Courses */}
        <section className="mt-12">
          <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
            My Courses
          </h2>
          <div className="mt-3 flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[160px] rounded-xl bg-[#F5F5F5]" style={dashedBorder} />
            ))}
          </div>
        </section>

        {/* My Experts — V2 and V3 show inline */}
        {(layoutVersion === 2 || layoutVersion === 3) && (
          <section className="mt-12">
            <a href="#" className="flex items-center gap-1.5 text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-opacity hover:opacity-80">
              My Experts
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div className="mt-3 flex flex-col gap-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[60px] rounded-lg bg-[#F5F5F5]" style={dashedBorder} />
              ))}
            </div>
          </section>
        )}
      </PageShell>

      {/* ── Admin controls ── */}
      <div ref={adminRef} className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <div className="mb-1.5 px-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-[#9b9b9b]">
                Layout
              </div>
              <div className="mx-2 mb-2 flex rounded-lg bg-[#f5f5f5] p-[3px]">
                <button
                  onClick={() => setLayoutVersion(1)}
                  className={`flex-1 cursor-pointer rounded-md py-1.5 text-[14px] font-medium transition-colors ${layoutVersion === 1 ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"}`}
                >
                  V1
                </button>
                <button
                  onClick={() => setLayoutVersion(2)}
                  className={`flex-1 cursor-pointer rounded-md py-1.5 text-[14px] font-medium transition-colors ${layoutVersion === 2 ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"}`}
                >
                  V2
                </button>
                <button
                  onClick={() => setLayoutVersion(3)}
                  className={`flex-1 cursor-pointer rounded-md py-1.5 text-[14px] font-medium transition-colors ${layoutVersion === 3 ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"}`}
                >
                  V3
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white shadow-md border border-gray-200 md:bg-[#222222]/5 md:shadow-none md:border-0 transition-colors hover:bg-gray-50 md:hover:bg-[#222222]/[0.08]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#707070" />
            <circle cx="8" cy="8" r="1.5" fill="#707070" />
            <circle cx="13" cy="8" r="1.5" fill="#707070" />
          </svg>
        </button>
      </div>
    </>
  );
}
