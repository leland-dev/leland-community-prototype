import TopNav from "../components/TopNav";
import MobileTopNav from "../components/MobileTopNav";
import BottomNav from "../components/BottomNav";
import { ExtraLinksProvider } from "../components/ExtraLinksContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";

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
    day: "MON",
    date: 30,
    title: "Intro Call with Samantha",
    dateTime: "March 30 at 4:00 PM",
    duration: "45 minutes",
    image: pic1,
    isNow: false,
  },
  {
    day: "MON",
    date: 30,
    title: "GMAT Exam Prep Bootcamp",
    dateTime: "March 30 at 4:00 PM",
    duration: "45 minutes",
    image: pic4,
    isNow: false,
  },
  {
    day: "MON",
    date: 30,
    title: "MBA Strategy Live",
    dateTime: "March 30 at 4:00 PM",
    duration: "45 minutes",
    image: pic5,
    isNow: false,
  },
  {
    day: "MON",
    date: 30,
    title: "Deferred MBA Application Bootcamp",
    dateTime: "March 30 at 4:00 PM",
    duration: "45 minutes",
    image: pic6,
    isNow: false,
  },
];

const popularEvents = [
  {
    title: "MBA Strategy Live",
    subtitle: "Live now",
    subtitleColor: "text-[#038561]",
    meta: "125 watching",
    image: pic3,
  },
  {
    title: "Tech Consulting Workshop",
    subtitle: "Starts 4:30 PM",
    subtitleColor: "text-gray-light",
    meta: "89 registered",
    image: pic4,
  },
  {
    title: "Interview Prep Session",
    subtitle: "Tomorrow, 2:00 PM",
    subtitleColor: "text-gray-light",
    meta: "54 registered",
    image: pic5,
  },
];

export default function Calendar() {
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

      <div className="mx-auto max-w-[940px] px-4 pt-20 pb-20 md:px-10 md:pt-6 md:pb-0">
        <div className="flex gap-16">
          {/* Left column — main content */}
          <div className="min-w-0 flex-1">
            <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">
              Calendar
            </h1>
            <p className="mt-2 text-[18px] text-gray-light">
              Everything on your schedule, between 1:1 coaching sessions, events, and courses.
            </p>

            <div className="mt-6 border-t border-gray-stroke" />

            {/* Event list */}
            <div className="flex flex-col">
              {upcomingEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-5"
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
                    <p className="mt-0.5 text-[16px] text-[#707070]">
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
            <button className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              View past sessions
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Right column — sidebar */}
          <div className="hidden w-[300px] shrink-0 lg:block">
            <div className="mt-[116px]">
              {/* Popular events */}
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#707070]">
                  Popular events
                </p>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#707070]">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {popularEvents.map((event, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={event.image}
                      alt=""
                      className="h-[44px] w-[44px] shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-gray-dark">{event.title}</p>
                      <p className="truncate text-[13px]">
                        <span className={event.subtitleColor}>{event.subtitle}</span>
                        <span className="text-gray-light"> · {event.meta}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Browse events button */}
              <button className="mt-5 w-full cursor-pointer rounded-lg bg-[#222222]/5 py-2.5 text-center text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                Browse events
              </button>
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
