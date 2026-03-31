import TopNav from "../components/TopNav";
import MobileTopNav from "../components/MobileTopNav";
import BottomNav from "../components/BottomNav";
import { ExtraLinksProvider } from "../components/ExtraLinksContext";
import verifiedIcon from "../assets/icons/verified.svg";

import profilePhoto from "../assets/profile photos/profile photo.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic10 from "../assets/profile photos/pic-10.png";

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

const experts = [
  {
    name: "Sarah Chen",
    avatar: pic1,
    rating: 4.99,
    reviews: 47,
    headline: "Former Director of Programs and Admissions at Stanford GSB",
  },
  {
    name: "David Kim",
    avatar: pic4,
    rating: 4.98,
    reviews: 83,
    headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
  },
  {
    name: "Nina Kowalski",
    avatar: pic7,
    rating: 4.97,
    reviews: 62,
    headline: "Partner at McKinsey & Company | Recruiting Lead",
  },
  {
    name: "Alex Thompson",
    avatar: pic8,
    rating: 4.96,
    reviews: 38,
    headline: "Management Consultant | Career Coach for Non-Traditional Backgrounds",
  },
  {
    name: "Michael Chen",
    avatar: pic10,
    rating: 4.95,
    reviews: 91,
    headline: "Ex-BCG Consultant | 500+ Case Interview Hours Coached",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
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

      <div className="mx-auto max-w-[1060px] px-4 pt-20 pb-20 md:px-10 md:pt-6 md:pb-[100px]">
        <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">
          Dashboard
        </h1>
        <p className="mt-2 text-[18px] text-gray-light">
          Your coaching journey at a glance.
        </p>

        <div className="mt-8 space-y-12">
          {/* ── Section 1: Upcoming Sessions ── */}
          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
              Upcoming Sessions
            </h2>
            <div className="mt-3 border-t border-gray-stroke">
              <div className="mt-2 flex flex-col gap-1">
                {upcomingEvents.map((event, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-[#F5F5F5]"
                  >
                    <img
                      src={event.image}
                      alt=""
                      className="h-[44px] w-[44px] shrink-0 rounded-[4px] object-cover"
                    />
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
            </div>
          </section>

          {/* ── Section 2: My Courses (placeholder) ── */}
          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
              My Courses
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {[
                { title: "MBA Admissions Strategy Bootcamp", subtitle: "Session 4 of 6 · Live cohort" },
                { title: "Nail the Google PM Interview Cycle", subtitle: "65% complete · Self-paced" },
                { title: "Consulting Case Interview Mastery", subtitle: "20% complete · Self-paced" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-xl border border-gray-stroke/50 bg-[#FAFAFA] p-4"
                >
                  <div className="h-[100px] rounded-lg bg-[#EEEEEE]" />
                  <div>
                    <p className="text-[16px] font-medium leading-snug text-gray-dark">{card.title}</p>
                    <p className="mt-1 text-[14px] text-[#9B9B9B]">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 3: My Goals (placeholder) ── */}
          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
              My Goals
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {[
                { title: "Complete MBA applications", detail: "3 of 5 schools submitted" },
                { title: "Score 720+ on GMAT", detail: "Practice test avg: 690" },
                { title: "Build consulting network", detail: "8 of 15 coffee chats completed" },
              ].map((goal, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-gray-stroke/50 bg-[#FAFAFA] px-5 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEEEEE]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="#9B9B9B" strokeWidth="1.5" />
                      <circle cx="8" cy="8" r="2.5" fill="#9B9B9B" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-medium text-gray-dark">{goal.title}</p>
                    <p className="text-[14px] text-[#9B9B9B]">{goal.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 4: My Experts (carousel) ── */}
          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">
              My Experts
            </h2>
            <div className="scrollbar-hide -mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
              {experts.map((expert) => (
                <div
                  key={expert.name}
                  className="flex w-[240px] shrink-0 snap-start flex-col items-center rounded-xl border border-gray-stroke/50 bg-white p-5 text-center"
                >
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="h-[64px] w-[64px] rounded-full object-cover"
                  />
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[16px] font-medium text-gray-dark">{expert.name}</span>
                    <img src={verifiedIcon} alt="Verified" className="h-[14px] w-[14px] shrink-0" />
                  </div>
                  <p className="mt-0.5 text-[13px] text-gray-light">
                    ★ {expert.rating} ({expert.reviews} reviews)
                  </p>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-[#707070]">
                    {expert.headline}
                  </p>
                  <button className="mt-4 w-full cursor-pointer rounded-lg border border-gray-stroke px-4 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
                    Book session
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
