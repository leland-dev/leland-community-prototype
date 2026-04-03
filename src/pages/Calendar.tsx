import { useState } from "react";
import { NavLink } from "react-router-dom";
import PageShell from "../components/PageShell";
import profilePhoto from "../assets/profile photos/profile photo.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import arrowRoundIcon from "../assets/icons/arrow-round.svg";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";

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
  {
    day: "SAT",
    date: 4,
    title: "MBA Strategy Live",
    dateTime: "April 4 at 10:00 AM",
    duration: "45 minutes",
    image: pic5,
    isNow: false,
  },
  {
    day: "TUE",
    date: 7,
    title: "Deferred MBA Application Bootcamp",
    dateTime: "April 7 at 3:00 PM",
    duration: "90 minutes",
    image: pic6,
    isNow: false,
  },
];

const popularEvents = [
  {
    title: "MBA Strategy Live",
    subtitle: "Live now",
    subtitleColor: "text-[#D92D20] font-medium",
    meta: "125 watching",
    image: event1,
  },
  {
    title: "Tech Consulting Workshop",
    subtitle: "Starts 4:30 PM",
    subtitleColor: "text-gray-light",
    meta: "89 registered",
    image: event2,
  },
  {
    title: "Interview Prep Session",
    subtitle: "Tomorrow, 2:00 PM",
    subtitleColor: "text-gray-light",
    meta: "54 registered",
    image: event3,
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

export default function Calendar() {
  const [pastOpen, setPastOpen] = useState(false);

  const popularEventsSection = (
    <>
      <NavLink to="/events" className="flex items-center gap-1.5 text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-opacity hover:opacity-80">
        Popular events
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </NavLink>
      <div className="mt-4 flex flex-col gap-4">
        {popularEvents.map((event, i) => (
          <div key={i} className="group flex cursor-pointer items-center gap-3">
            <img
              src={event.image}
              alt=""
              className="h-[36px] w-[55px] shrink-0 rounded-[4px] object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[16px] font-medium text-gray-dark group-hover:opacity-70">{event.title}</p>
              <p className="truncate text-[14px]">
                <span className={event.subtitleColor}>{event.subtitle}</span>
                <span className="text-gray-light"> · {event.meta}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <PageShell rightSidebar={popularEventsSection}>
        {/* Header — spans full width above both columns */}
        <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">
          Calendar
        </h1>
        <p className="mt-2 text-[18px] text-gray-light">
          Everything on your schedule, between 1:1 coaching sessions, events, and courses.
        </p>

        <div className="mt-8 border-t border-gray-stroke">
            {/* Event list */}
            <div className="mt-2 flex flex-col gap-1">
              {upcomingEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-[#F5F5F5]"
                >
                  {/* Profile photo / event thumbnail */}
                  <img
                    src={event.image}
                    alt=""
                    className="h-[44px] w-[44px] shrink-0 rounded-[4px] object-cover"
                  />

                  {/* Event details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[18px] font-medium text-gray-dark">{event.title}</p>
                    <p className="text-[16px] text-[#707070]">
                      {event.dateTime} · <span className="text-[#9B9B9B]">{event.duration}</span>
                    </p>
                  </div>

                  {/* Right side: Join button or calendar icon */}
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

            {/* View past sessions */}
            <button
              onClick={() => setPastOpen(!pastOpen)}
              className="my-4 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
            >
              {pastOpen ? "Hide past sessions" : "View past sessions"}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform ${pastOpen ? "rotate-180" : ""}`}
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Past sessions (collapsible) */}
            {pastOpen && (
              <div className="mt-2 flex flex-col gap-1">
                {pastEvents.map((event, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-[#F5F5F5]"
                  >
                    <img
                      src={event.image}
                      alt=""
                      className="h-[44px] w-[44px] shrink-0 rounded-[4px] object-cover opacity-50 transition-opacity group-hover:opacity-100"
                    />
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
    </PageShell>
  );
}
