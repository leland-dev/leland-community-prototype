import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import OfferingCard, { type OfferingType } from "../components/OfferingCard";
import checkIcon from "../assets/icons/check.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic6 from "../assets/profile photos/pic-6.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import bootcampImg1 from "../assets/placeholder images/bootcamp-1.webp";
import lelandPlusImg1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";

interface DemoConfig {
  type: OfferingType;
  heading: string;
  description: string;
  defaultProps: { title: string; subtitle: ReactNode; image: string };
  purchasedProps: { title: string; subtitle: ReactNode; image: string };
}

const demos: DemoConfig[] = [
  {
    type: "hourly",
    heading: "Hourly Coaching",
    description: "On-demand 1:1 sessions billed per hour.",
    defaultProps: {
      title: "Custom hourly coaching",
      subtitle: "$150 per hour",
      image: pic6,
    },
    purchasedProps: {
      title: "1h 20m with Jessica",
      subtitle: "45m available to schedule",
      image: pic6,
    },
  },
  {
    type: "hourly-package",
    heading: "Hourly Package",
    description: "A bundle of coaching hours sold together at a fixed price.",
    defaultProps: {
      title: "10-Hour Coaching Package",
      subtitle: "10 hours · $1,200",
      image: eventImg1,
    },
    purchasedProps: {
      title: "4h 30m with Jessica",
      subtitle: "45m available to schedule",
      image: pic6,
    },
  },
  {
    type: "package",
    heading: "Comprehensive Package",
    description: "A structured coaching package with a defined scope and deliverables.",
    defaultProps: {
      title: "MBA Application Package",
      subtitle: "Comprehensive Package · Starting at $750",
      image: eventImg2,
    },
    purchasedProps: {
      title: "MBA Application Package",
      subtitle: <>Comprehensive package · <span className="text-[#038561]">Currently active</span></>,
      image: pic1,
    },
  },
  {
    type: "course",
    heading: "Course",
    description: "A self-paced course with video lessons and materials.",
    defaultProps: {
      title: "GMAT Exam Prep Bootcamp",
      subtitle: "Next cohort starts June 1",
      image: bootcampImg1,
    },
    purchasedProps: {
      title: "GMAT Exam Prep Bootcamp",
      subtitle: <>Started June 1 <span className="text-[#9B9B9B]">· Next session tomorrow</span></>,
      image: bootcampImg1,
    },
  },
  {
    type: "content",
    heading: "Content",
    description: "Standalone digital content like articles, guides, or videos.",
    defaultProps: {
      title: "How I Got Into Stanford GSB",
      subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>,
      image: lelandPlusImg1,
    },
    purchasedProps: {
      title: "How I Got Into Stanford GSB",
      subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>,
      image: lelandPlusImg1,
    },
  },
];

/* ── Default (unpurchased) offerings for the live demo ── */
const defaultOfferings: { type: OfferingType; title: string; subtitle: ReactNode; image: string }[] = [
  { type: "hourly", title: "Custom hourly coaching", subtitle: "$150 per hour", image: pic6 },
  { type: "hourly-package", title: "10-Hour Coaching Package", subtitle: "10 hours · $1,200", image: eventImg1 },
  { type: "package", title: "MBA Application Package", subtitle: "Comprehensive Package · Starting at $750", image: eventImg2 },
  { type: "course", title: "GMAT Exam Prep Bootcamp", subtitle: "Next cohort starts June 1", image: bootcampImg1 },
  { type: "content", title: "How I Got Into Stanford GSB", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>, image: lelandPlusImg1 },
];

/* ── Purchased offerings for the live demo ── */
const purchasedOfferingsDemo: { type: OfferingType; title: string; subtitle: ReactNode; image: string }[] = [
  { type: "hourly", title: "1h 20m with Jessica", subtitle: "45m available to schedule", image: pic6 },
  { type: "package", title: "MBA Application Package", subtitle: <>Comprehensive package · <span className="text-[#038561]">Currently active</span></>, image: pic1 },
  { type: "course", title: "GMAT Exam Prep Bootcamp", subtitle: <>Started June 1 <span className="text-[#9B9B9B]">· Next session tomorrow</span></>, image: bootcampImg1 },
  { type: "content", title: "How I Got Into Stanford GSB", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>, image: lelandPlusImg1 },
];

function LiveDemo() {
  const [purchased, setPurchased] = useState(false);
  const [filter, setFilter] = useState<"All" | "Coaching" | "Courses" | "Content">("All");

  const offerings = purchased ? purchasedOfferingsDemo : defaultOfferings;
  const filtered = offerings.filter((o) => {
    if (filter === "All") return true;
    if (filter === "Coaching") return o.type === "hourly" || o.type === "hourly-package" || o.type === "package";
    if (filter === "Courses") return o.type === "course";
    return o.type === "content";
  });

  return (
    <section className="mt-10">
      {/* Toggle */}
      <div className="flex gap-[6px]">
        <button
          onClick={() => setPurchased(false)}
          className={`cursor-pointer rounded-full px-[14px] py-[6px] text-[14px] font-medium text-[#222222] ${
            !purchased ? "border-[1.5px] border-[#222222] bg-[#f5f5f5]" : "border-[1.5px] border-transparent bg-[#f5f5f5] transition-colors hover:bg-[#ebebeb]"
          }`}
        >
          Default
        </button>
        <button
          onClick={() => setPurchased(true)}
          className={`cursor-pointer rounded-full px-[14px] py-[6px] text-[14px] font-medium text-[#222222] ${
            purchased ? "border-[1.5px] border-[#222222] bg-[#f5f5f5]" : "border-[1.5px] border-transparent bg-[#f5f5f5] transition-colors hover:bg-[#ebebeb]"
          }`}
        >
          Purchased
        </button>
      </div>

      {/* Card container */}
      <div
        className="mt-4 rounded-[32px] bg-[#F0F0F0] p-3"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` }}
      >
        <div className="rounded-[24px] bg-white px-6 py-5" style={{ boxShadow: "0 20px 24px -4px rgba(16, 24, 40, 0.08)" }}>
          {/* Section heading */}
          <h2 className="text-[24px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>
            {purchased ? "My purchases" : "Offerings"}
          </h2>

          {/* Filter tabs */}
          <div className="mt-4 flex flex-wrap gap-[6px]">
            {(["All", "Coaching", "Courses", "Content"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] ${
                  filter === tab ? "border-[1.5px] border-[#222222]" : "border-[1.5px] border-transparent transition-colors hover:bg-[#ebebeb]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-4 flex flex-col gap-1">
            {filtered.map((o) => (
              <OfferingCard
                key={o.title}
                type={o.type}
                title={o.title}
                subtitle={o.subtitle}
                image={o.image}
                purchased={purchased}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <button className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
            {purchased ? "View full order history" : "View all offerings"}
          </button>
        </div>
      </div>
    </section>
  );
}

function DemoSection({ demo }: { demo: DemoConfig }) {
  return (
    <section className="mt-10">
      <h2 className="text-[24px] font-medium text-gray-dark">{demo.heading}</h2>
      <p className="mt-1 text-[18px] text-[#707070]">{demo.description}</p>

      <div
        className="mt-4 rounded-[32px] bg-[#F0F0F0] p-3"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` }}
      >
        <div className="flex flex-col gap-4 rounded-[24px] bg-white px-6 py-5" style={{ boxShadow: "0 20px 24px -4px rgba(16, 24, 40, 0.08)" }}>
          <div>
            <span className="text-[14px] uppercase tracking-[0.05em] text-[#707070]">Default</span>
            <OfferingCard
              type={demo.type}
              title={demo.defaultProps.title}
              subtitle={demo.defaultProps.subtitle}
              image={demo.defaultProps.image}
            />
          </div>
          <div>
            <span className="flex items-center gap-1 text-[14px] uppercase tracking-[0.05em] text-[#707070]"><img src={checkIcon} alt="" className="h-3 w-3 opacity-50" />Purchased</span>
            {demo.type === "hourly-package" ? (
              <div className="mt-1 flex items-center justify-center rounded-[12px] bg-[#F0F0F0] px-4 py-5 text-[16px] text-[#707070]" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` }}>
                Shows Hourly Coaching card once purchased
              </div>
            ) : (
              <OfferingCard
                type={demo.type}
                title={demo.purchasedProps.title}
                subtitle={demo.purchasedProps.subtitle}
                image={demo.purchasedProps.image}
                purchased
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OfferingCardTest() {
  useEffect(() => { document.title = "Component: Offering Card"; }, []);

  return (
    <PageShell variant="thin">
      {/* Page header */}
      <Link to="/components" className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[13px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]">&lt;COMPONENT&gt;</Link>
      <h1 className="mt-1 text-[40px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Offering Card</h1>
      <p className="mt-1 text-[18px] text-[#707070]">
        Displays a coach's available offerings on their profile, and the same offerings in their purchased state on the customer's profile and dashboard.
      </p>

      <LiveDemo />

      {demos.map((demo) => (
        <DemoSection key={demo.type} demo={demo} />
      ))}

      <div className="h-16" />
    </PageShell>
  );
}
