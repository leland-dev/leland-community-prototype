import { useEffect } from "react";
import { Button } from "../components/Button";
import LiveCourseCard, { LiveCourse } from "../components/LiveCourseCard";
import { SessionLayoutProvider } from "../components/SessionLayoutContext";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import SessionCard from "../components/SessionCard";
import SidebarCard from "../components/SidebarCard";
import OfferingCard from "../components/OfferingCard";
import Post, { type PostData } from "../components/Post";
import ProfileCard, { type ProfileCardData } from "../components/ProfileCard";
import pic1 from "../assets/profile photos/pic-1.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic6 from "../assets/profile photos/pic-6.png";
import bainLogo from "../assets/org-logos/bain.png";
import hbsLogo from "../assets/org-logos/hbs.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import orgWharton from "../assets/org-logos/wharton.png";

export default function Components() {
  useEffect(() => { document.title = "Components"; }, []);

  return (
    <PageShell>
      <h1 className="text-[40px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Shared Components</h1>
      <p className="mt-1 text-[18px] text-[#707070]">
        A library of reusable components used across the product.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Link
          to="/components/session-card"
          className="overflow-hidden rounded-[16px] border border-[#E5E5E5] transition-colors hover:border-[#CCCCCC]"
        >
          <div className="flex h-[220px] items-center rounded-[12px] bg-[#F5F5F5] p-10 mx-3 mt-3">
            <div className="w-full rounded-[12px] pointer-events-none" style={{ boxShadow: "0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)" }}>
              <SessionCard
                title="Alex <> Jessica"
                dateTime="Tuesday, Aug 3 at 4:00 PM"
                duration="45m"
                image={pic1}
                type="coach"
                status="live"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[18px] font-medium text-gray-dark">Session Card</span>
            <span className="text-[16px] text-[#707070]">Displays a user's upcoming, live, and past sessions across 1:1 coaching, events, and courses.</span>
          </div>
        </Link>

        <Link
          to="/components/sidebar-cards"
          className="overflow-hidden rounded-[16px] border border-[#E5E5E5] transition-colors hover:border-[#CCCCCC]"
        >
          <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-[12px] bg-[#F5F5F5] p-10 mx-3 mt-3">
            <div className="w-[340px] rounded-[12px] pointer-events-none" style={{ boxShadow: "0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)" }}>
              <div className="rounded-[12px] bg-white px-4 py-3">
                <SidebarCard
                  variant="event"
                  live
                  image={eventImg1}
                  title="MBA Strategy Live"
                  subtitle={<><span className="font-medium text-[#FB5A42]">Live now</span> · 125 registered</>}
                  right={
                    <Button size="sm" variant="primary">
                      Join
                    </Button>
                  }
                />
                <SidebarCard
                  variant="event"
                  image={eventImg2}
                  title="Tech Consulting Workshop"
                  subtitle="Starts 4:30 PM · 89 registered"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[18px] font-medium text-gray-dark">Sidebar Cards</span>
            <span className="text-[16px] text-[#707070]">Reusable card components displayed in the right sidebar across various pages.</span>
          </div>
        </Link>

        <Link
          to="/components/post"
          className="overflow-hidden rounded-[16px] border border-[#E5E5E5] transition-colors hover:border-[#CCCCCC]"
        >
          <div className="flex h-[220px] items-start overflow-hidden rounded-[12px] bg-[#F5F5F5] px-6 pt-5 mx-3 mt-3">
            <div className="w-full pointer-events-none scale-[0.85] origin-top-left" style={{ width: "117%" }}>
              <div className="rounded-[12px] bg-white px-4" style={{ boxShadow: "0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)" }}>
                <Post
                  post={{
                    id: 9901,
                    type: "milestone",
                    author: "David Kim",
                    avatar: pic4,
                    time: "2h",
                    verified: true,
                    headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
                    body: "Incredibly proud of my client Jordan — Wharton MBA, Class of 2028. This is why I do this work. 🎉",
                    milestone: {
                      school: "Wharton School",
                      program: "MBA, Class of 2028",
                      clientName: "Jordan M.",
                      clientAvatar: pic6,
                      schoolColor: "#002f6c",
                      schoolInitial: "W",
                      schoolLogo: orgWharton,
                    },
                    likes: 431,
                    comments: 47,
                    reposts: 22,
                    shares: 8,
                  } as PostData}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[18px] font-medium text-gray-dark">Post</span>
            <span className="text-[16px] text-[#707070]">The core content unit of the community feed — supports text, image, link, event, milestone, and live post types.</span>
          </div>
        </Link>

        <Link
          to="/components/offering-card"
          className="overflow-hidden rounded-[16px] border border-[#E5E5E5] transition-colors hover:border-[#CCCCCC]"
        >
          <div className="flex h-[220px] items-center rounded-[12px] bg-[#F5F5F5] p-10 mx-3 mt-3">
            <div className="w-full rounded-[12px] pointer-events-none" style={{ boxShadow: "0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)" }}>
              <OfferingCard
                type="hourly"
                title="1:1 Coaching with Jessica"
                subtitle="$150/hr · 45m sessions"
                image={pic6}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[18px] font-medium text-gray-dark">Offering Card</span>
            <span className="text-[16px] text-[#707070]">Displays a coach's available offerings, and the same offerings in their purchased state for customers.</span>
          </div>
        </Link>
        <Link
          to="/components/course-block"
          className="overflow-hidden rounded-[16px] border border-[#E5E5E5] transition-colors hover:border-[#CCCCCC]"
        >
          <div className="relative h-[220px] overflow-hidden rounded-[12px] bg-[#F5F5F5] mx-3 mt-3">
            <SessionLayoutProvider>
              <div className="absolute inset-x-0 top-0 pointer-events-none">
                <div
                  className="origin-top-left"
                  style={{ transform: "scale(0.5)", width: "200%", padding: "24px 32px 0" }}
                >
                  <LiveCourseCard
                    course={{
                      type: "live",
                      id: 99,
                      title: "Law School Admissions Bootcamp",
                      cohortDateLabel: "Fall admissions",
                      cohortDates: "May 5 – Jun 9, 2026",
                      registrants: [pic3, pic5],
                      image: eventImg3,
                      cohortSelected: false,
                      sessions: [],
                    } as LiveCourse}
                    boxed
                  />
                </div>
              </div>
            </SessionLayoutProvider>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[18px] font-medium text-gray-dark">Course Block</span>
            <span className="text-[16px] text-[#707070]">Displays an enrolled course — live cohort or self-paced — with sessions, status, and actions.</span>
          </div>
        </Link>

        <Link
          to="/components/profile-card"
          className="overflow-hidden rounded-[16px] border border-[#E5E5E5] transition-colors hover:border-[#CCCCCC]"
        >
          <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-[12px] bg-[#F5F5F5] px-6 pt-5 mx-3 mt-3">
            <div className="w-full pointer-events-none scale-[0.82] origin-top" style={{ width: "122%" }}>
              <ProfileCard card={{
                variant: "coach",
                name: "David Kim",
                avatar: pic4,
                headline: "MBA Admissions Consultant | Ex-Bain, HBS '19",
                credentials: [
                  { logo: bainLogo, label: "Bain & Company" },
                  { logo: hbsLogo, label: "Harvard Business School" },
                ],
                rating: 5.0,
                reviews: 52,
                followers: 1840,
                sessions: 430,
              } as ProfileCardData} />
            </div>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[18px] font-medium text-gray-dark">Profile Card</span>
            <span className="text-[16px] text-[#707070]">Displays a user's identity — avatar, name, headline, and stats. Two variants: client and coach.</span>
          </div>
        </Link>
      </div>
    </PageShell>
  );
}
