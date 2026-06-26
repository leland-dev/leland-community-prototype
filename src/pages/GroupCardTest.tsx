import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import GroupCard from "../components/GroupCard";
import groupImg1 from "../assets/placeholder images/group images/18603db620e37b489d2d52da4c9c1f86.jpg";
import groupImg2 from "../assets/placeholder images/group images/419a6944d25e95be7012699559c7b0be.jpg";
import groupImg3 from "../assets/placeholder images/group images/6c168007b1aef00bedc192e802c413e5.jpg";

export default function GroupCardTest() {
  useEffect(() => { document.title = "Component: Group Card"; }, []);
  const [sandboxSize, setSandboxSize] = useState<"large" | "small">("large");

  return (
    <PageShell variant="thin">
      {/* Page header */}
      <Link to="/components" className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]">&lt;COMPONENT&gt;</Link>
      <h1 className="mt-1 text-[38px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Group Card</h1>
      <p className="mt-2 text-[16px] text-[#707070]">
        A compact card component for displaying a user's group memberships with name, member count, and recent activity.
      </p>

      {/* Demo container */}
      <div className="mt-10">
        <div className="rounded-[24px] border border-[#E5E5E5] px-3 py-2">
          <div className="flex flex-col gap-1">
            <GroupCard
              name="AI BP April 26"
              image={groupImg1}
              members={18}
              newPosts={3}
              to="/groups/ai-bp-apr-26"
              size={sandboxSize}
            />
            <GroupCard
              name="MBA Admissions 2027"
              image={groupImg2}
              members={142}
              newPosts={12}
              to="/groups/mba-admissions-2027"
              size={sandboxSize}
            />
            <GroupCard
              name="Product Management Career Switchers"
              image={groupImg3}
              members={87}
              newPosts={0}
              to="/groups/pm-career-switchers"
              size={sandboxSize}
            />
          </div>
        </div>
      </div>

      {/* Sandbox controls */}
      <div className="mt-10">
        <h2 className="text-[22px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Sandbox</h2>
        <p className="mt-1 text-[14px] text-[#707070]">Toggle properties to preview different configurations.</p>

        <div className="mt-6 flex flex-col gap-6">
          {/* Size */}
          <div>
            <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#9B9B9B]">Size</label>
            <div className="mt-2 flex gap-2">
              {(["large", "small"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSandboxSize(s)}
                  className={`rounded-lg px-4 py-2 text-[12px] font-medium capitalize transition-colors ${
                    sandboxSize === s
                      ? "bg-gray-dark text-white"
                      : "bg-[#F5F5F5] text-gray-dark hover:bg-[#EBEBEB]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sandbox preview */}
        <div className="mt-8 rounded-[24px] border border-[#E5E5E5] px-3 py-2">
          <GroupCard
            name="AI BP April 26"
            image={groupImg1}
            members={18}
            newPosts={3}
            to="/groups/ai-bp-apr-26"
            size={sandboxSize}
          />
        </div>
      </div>
    </PageShell>
  );
}
