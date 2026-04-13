import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import SessionCard from "../components/SessionCard";
import SidebarCard, { SidebarGroup } from "../components/SidebarCard";
import pic1 from "../assets/profile photos/pic-1.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";

export default function Components() {
  useEffect(() => { document.title = "Components"; }, []);

  return (
    <PageShell variant="thin">
      <h1 className="text-[40px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Shared Components</h1>
      <p className="mt-1 text-[18px] text-[#707070]">
        A library of reusable components used across the product.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <Link
          to="/components/session-card"
          className="overflow-hidden rounded-[16px] border border-[#E5E5E5] transition-colors hover:border-[#CCCCCC]"
        >
          <div className="flex h-[220px] items-center rounded-[12px] bg-[#F5F5F5] p-10 m-3">
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
          <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-[12px] bg-[#F5F5F5] p-10 m-3">
            <div className="w-[340px] rounded-[12px] pointer-events-none" style={{ boxShadow: "0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)" }}>
              <div className="rounded-[12px] bg-white px-4 py-3">
                <SidebarGroup label="Free events">
                  <SidebarCard
                    variant="event"
                    live
                    image={eventImg1}
                    title="MBA Strategy Live"
                    subtitle={<><span className="font-medium text-[#FB5A42]">Live now</span> · 125 registered</>}
                    right={
                      <div
                        className="rounded-[8px] bg-[#038561] px-[14px] py-2 text-[14px] font-medium text-white"
                        style={{ lineHeight: 1.2 }}
                      >
                        Join
                      </div>
                    }
                  />
                  <SidebarCard
                    variant="event"
                    image={eventImg2}
                    title="Tech Consulting Workshop"
                    subtitle="Starts 4:30 PM · 89 registered"
                  />
                </SidebarGroup>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[18px] font-medium text-gray-dark">Sidebar Cards</span>
            <span className="text-[16px] text-[#707070]">Reusable card components displayed in the right sidebar across various pages.</span>
          </div>
        </Link>
      </div>
    </PageShell>
  );
}
