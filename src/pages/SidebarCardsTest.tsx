import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import SidebarCard, { SidebarGroup } from "../components/SidebarCard";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic8 from "../assets/profile photos/pic-8.png";
import topicHash from "../assets/img/topic-hash.svg";
import bootcamp1 from "../assets/placeholder images/bootcamp-1.webp";
import bootcamp2 from "../assets/placeholder images/bootcamp-2.webp";
import bootcamp3 from "../assets/placeholder images/bootcamp-3.webp";
import videoFilled from "../assets/icons/video-filled.svg";
import selfPaced from "../assets/icons/self-paced.svg";
import categoryInvestmentBanking from "../assets/placeholder images/category images/investment-banking.png";
import categoryAI from "../assets/placeholder images/category images/AI-automation-and-agents.png";
import categoryGMAT from "../assets/placeholder images/category images/gmat-tutoring.png";
import resource1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import resource2 from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";
import resource3 from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";

function CategorySubtitle({ photos, experts }: { photos: string[]; experts: string }) {
  return (
    <span className="inline-flex items-center gap-[6px] align-middle">
      <span className="inline-flex">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="inline-block h-[14px] w-[14px] shrink-0 rounded-full border border-white object-cover"
            style={{ marginLeft: i === 0 ? 0 : "-3px" }}
          />
        ))}
      </span>
      {experts}
    </span>
  );
}

function ResourceSubtitle({ photo, name, views }: { photo: string; name: string; views: number }) {
  return (
    <span className="inline-flex items-center gap-[6px] align-middle">
      <img src={photo} alt="" className="inline-block h-[12px] w-[12px] shrink-0 rounded-full object-cover" />
      <span>
        <span className="hover:underline hover:decoration-[1px] hover:underline-offset-[2px]">{name}</span>
        <span className="text-[#9B9B9B]"> · {views} views</span>
      </span>
    </span>
  );
}

function CourseSubtitle({ kind, detail }: { kind: "live" | "self-paced"; detail: string }) {
  const iconSrc = kind === "live" ? videoFilled : selfPaced;
  const label = kind === "live" ? "Live Cohort" : "Self-paced";
  const iconClass = kind === "live" ? "w-[12px] h-auto" : "w-[12px] h-[12px]";
  return (
    <span className="inline-flex items-center gap-[4px] align-middle">
      <img src={iconSrc} alt="" className={`inline-block shrink-0 ${iconClass}`} />
      {label} · {detail}
    </span>
  );
}

function HashIcon() {
  return <img src={topicHash} alt="" className="h-[20px] w-[20px] shrink-0" />;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[16px] font-normal text-[#707070] align-middle">
      <span className="text-[#707070]">·</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="#FFCB47" className="shrink-0">
        <path d="M7 1l1.8 3.65L13 5.3l-3 2.84.7 4.02L7 10.36 3.3 12.16l.7-4.02-3-2.84 4.2-.65L7 1z" />
      </svg>
      <span>{rating.toFixed(1)}</span>
      <span className="text-[#9B9B9B]">({count})</span>
    </span>
  );
}

export default function SidebarCardsTest() {
  useEffect(() => { document.title = "Component: Sidebar Cards"; }, []);

  return (
    <PageShell variant="thin">
      {/* Page header */}
      <Link to="/components" className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[13px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]">&lt;COMPONENT&gt;</Link>
      <h1 className="mt-1 text-[40px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Sidebar Cards</h1>
      <p className="mt-1 text-[18px] text-[#707070]">
        Reusable card components displayed in the right sidebar across various pages.
      </p>

      {/* Demo */}
      <div
        className="mt-10 mb-[120px] flex items-center justify-center rounded-[32px] bg-[#F0F0F0] px-3 py-6"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")` }}
      >
        <div
          className="flex items-center justify-center rounded-[24px] bg-white px-8 py-10"
          style={{ boxShadow: "0 20px 24px -4px rgba(16, 24, 40, 0.08)" }}
        >
          {/* Sidebar preview container */}
          <div className="w-[300px] flex flex-col gap-6">

          {/* Free events */}
          <SidebarGroup label="Free events">
            <SidebarCard
              variant="event"
              live
              image={eventImg1}
              title="MBA Strategy Live"
              subtitle={<><span className="font-medium text-[#FB5A42]">Live now</span> · 125 registered</>}
              right={
                <button
                  className="cursor-pointer rounded-[8px] bg-[#038561] px-[14px] py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#038561]/90"
                  style={{ lineHeight: 1.2 }}
                >
                  Join
                </button>
              }
            />
            <SidebarCard
              variant="event"
              image={eventImg2}
              title="Tech Consulting Workshop which wraps to two lines"
              subtitle="Starts 4:30 PM · 89 registered"
            />
            <SidebarCard
              variant="event"
              image={eventImg3}
              title="Interview Prep Session"
              subtitle="Tomorrow, 2:00 PM · 54 registered"
            />
          </SidebarGroup>

          {/* Popular Categories */}
          <SidebarGroup label="Popular categories" hideChevron>
            <SidebarCard
              variant="category"
              image={categoryInvestmentBanking}
              title="Investment Banking"
              subtitle={<CategorySubtitle photos={[pic1, pic4, pic5]} experts="234 experts" />}
            />
            <SidebarCard
              variant="category"
              image={categoryAI}
              title="AI Automation & Agents"
              subtitle={<CategorySubtitle photos={[pic6, pic7, pic8]} experts="300 experts" />}
            />
            <SidebarCard
              variant="category"
              image={categoryGMAT}
              title="GMAT Tutoring"
              subtitle={<CategorySubtitle photos={[pic2, pic3, pic10]} experts="156 experts" />}
            />
          </SidebarGroup>

          {/* Popular Courses */}
          <SidebarGroup label="Popular courses">
            <SidebarCard
              variant="course"
              align="top"
              image={bootcamp1}
              title="GMAT Exam Prep Bootcamp"
              subtitle={<CourseSubtitle kind="live" detail="Starts Apr 14" />}
              reviews={{ rating: 4.9, count: 12 }}
            />
            <SidebarCard
              variant="course"
              align="top"
              image={bootcamp2}
              title="AI Builder Program L1: Use AI to 10x Your Impact"
              subtitle={<CourseSubtitle kind="self-paced" detail="7h" />}
              reviews={{ rating: 4.8, count: 12 }}
            />
            <SidebarCard
              variant="course"
              align="top"
              image={bootcamp3}
              title="Big Law Recruiting Bootcamp"
              subtitle={<CourseSubtitle kind="live" detail="Starts Jun 9" />}
              reviews={{ rating: 4.9, count: 8 }}
            />
          </SidebarGroup>

          {/* Popular Coaches */}
          <SidebarGroup label="Popular coaches">
            <SidebarCard
              variant="coach"
              image={pic1}
              title={<>Jasmine Singer <StarRating rating={4.99} count={12} /></>}
              subtitle="Experienced Product Leader at LinkedIn | Ex-..."
            />
            <SidebarCard
              variant="coach"
              image={pic3}
              title={<>Jackson Ringger <StarRating rating={4.99} count={12} /></>}
              subtitle="Experienced Product Leader at LinkedIn | Ex-..."
            />
            <SidebarCard
              variant="coach"
              image={pic5}
              title={<>Erika Mah <StarRating rating={4.99} count={12} /></>}
              subtitle="Experienced Product Leader at LinkedIn | Ex-..."
            />
          </SidebarGroup>

          {/* Trending Topics */}
          <SidebarGroup label="Trending topics">
            <SidebarCard
              variant="topic"
              align="top"
              icon={<HashIcon />}
              title="MBB Recruitment"
              subtitle="234 posts today"
            />
            <SidebarCard
              variant="topic"
              align="top"
              icon={<HashIcon />}
              title="Case Interviews"
              subtitle="189 posts today"
            />
            <SidebarCard
              variant="topic"
              align="top"
              icon={<HashIcon />}
              title="MBA Essays"
              subtitle="156 posts today"
            />
          </SidebarGroup>

          {/* Popular Resources */}
          <SidebarGroup label="Popular resources">
            <SidebarCard
              variant="resource"
              image={resource1}
              title="Stanford GSB: Recommendation for Inclusive Leadership"
              subtitle={<ResourceSubtitle photo={pic2} name="Marcus Thomas" views={12} />}
            />
            <SidebarCard
              variant="resource"
              image={resource2}
              title="The 3-Pillar Strategy to Land a Consulting Offer"
              subtitle={<ResourceSubtitle photo={pic7} name="Sarah Liu" views={48} />}
            />
            <SidebarCard
              variant="resource"
              image={resource3}
              title="Stanford GSB: Recommendation for Inclusive Leadership"
              subtitle={<ResourceSubtitle photo={pic10} name="David Kim" views={27} />}
            />
          </SidebarGroup>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
