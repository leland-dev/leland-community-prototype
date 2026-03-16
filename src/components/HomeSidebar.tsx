import verifiedIcon from "../assets/icons/verified.svg";

import pic1 from "../assets/profile photos/pic-1.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic10 from "../assets/profile photos/pic-10.png";

// ─── Data ─────────────────────────────────────────────

const events = [
  {
    title: "MBA Strategy Live",
    subtitle: "Live now",
    meta: "125 watching",
    live: true,
  },
  {
    title: "Tech Consulting Workshop",
    subtitle: "Starts 4:30 PM",
    meta: "89 registered",
    live: false,
  },
  {
    title: "Interview Prep Session",
    subtitle: "Tomorrow, 2:00 PM",
    meta: "54 registered",
    live: false,
  },
];

const topics = [
  { name: "MBB Recruitment", posts: 234 },
  { name: "Case Interviews", posts: 189 },
  { name: "MBA Essays", posts: 156 },
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

// ─── Components ───────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[14px] font-medium uppercase tracking-[0.1em] text-gray-light">
        {title}
      </h3>
      <button className="cursor-pointer text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark">
        See all
      </button>
    </div>
  );
}

function HashIcon() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-hover text-[14px] font-semibold text-gray-light">
      #
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────

export default function HomeSidebar() {
  return (
    <div className="px-5 py-6">
      {/* Free Events */}
      <section>
        <SectionHeader title="Happening now" />
        <div className="mt-3 space-y-4">
          {events.map((event) => (
            <a key={event.title} href="#" className="group flex cursor-pointer items-start gap-3">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-hover" />
              <div className="min-w-0">
                <p className="text-[15px] font-medium leading-tight text-gray-dark group-hover:underline">
                  {event.title}
                </p>
                <p className="mt-0.5 text-[14px] text-gray-light">
                  {event.live ? (
                    <>
                      <span className="font-medium text-[#D92D20]">{event.subtitle}</span>
                      {" · "}
                      {event.meta}
                    </>
                  ) : (
                    <>
                      {event.subtitle} · {event.meta}
                    </>
                  )}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Trending Topics */}
      <section className="mt-8">
        <SectionHeader title="Trending topics" />
        <div className="mt-3 space-y-3">
          {topics.map((topic) => (
            <a key={topic.name} href="#" className="group flex cursor-pointer items-center gap-3">
              <HashIcon />
              <div className="min-w-0">
                <p className="text-[15px] font-medium leading-tight text-gray-dark group-hover:underline">
                  {topic.name}
                </p>
                <p className="text-[14px] text-gray-light">
                  {topic.posts} posts today
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Popular Experts */}
      <section className="mt-8">
        <SectionHeader title="Popular coaches" />
        <div className="mt-3 space-y-4">
          {experts.map((expert) => (
            <a key={expert.name} href="#" className="group flex cursor-pointer items-center gap-3">
              <div className="relative h-10 w-10 shrink-0">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="h-10 w-10 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-medium leading-tight text-gray-dark group-hover:underline">
                    {expert.name}
                  </span>
                  <img src={verifiedIcon} alt="Verified" className="h-[13px] w-[13px] shrink-0" />
                  <span className="text-[13px] text-gray-light">
                    · ★ {expert.rating} ({expert.reviews})
                  </span>
                </div>
                <p className="truncate text-[14px] leading-tight text-gray-light">
                  {expert.headline}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
