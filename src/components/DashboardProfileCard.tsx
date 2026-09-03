import { LinkButton } from "./Button";
import profilePhoto from "../assets/profile photos/profile photo.png";
import starIcon from "../assets/icons/star.svg";
import editIcon from "../assets/icons/edit.svg";

// The profile summary card shown on the dashboard ("My Leland") and, in its
// non-expert form, at the top of the home feed's right sidebar. Experts get an
// extra rating row + "Expert mins" stat; everyone shows Followers / Following
// and an "Edit profile" button.
export default function DashboardProfileCard({ expert, compact = false }: { expert: boolean; compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "rounded-[12px] border border-[#222222]/[0.12] bg-white p-4"
          : "rounded-2xl border border-[#222222]/10 bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)]"
      }
    >
      <img src={profilePhoto} alt="Alex Rivera" className="h-[72px] w-[72px] rounded-full object-cover" />
      <h2 className="mt-4 font-serif text-[26px] font-medium leading-tight text-gray-dark">Alex Rivera</h2>

      {/* Reviews — experts only */}
      {expert && (
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex items-center gap-[1px]">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={starIcon} alt="" className="h-[15px] w-[15px]" />
            ))}
          </div>
          <span className="text-[14px] font-semibold leading-none text-gray-dark">4.9</span>
          <span className="text-[14px] leading-none text-[#707070]">52 Reviews</span>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
        {expert && (
          <div className="flex flex-col gap-[2px]">
            <span className="text-[16px] font-semibold leading-none text-gray-dark">6.6k</span>
            <span className="text-[13px] leading-tight text-[#707070]">Expert mins</span>
          </div>
        )}
        <div className="flex flex-col gap-[2px]">
          <span className="text-[16px] font-semibold leading-none text-gray-dark">84</span>
          <span className="text-[13px] leading-tight text-[#707070]">Followers</span>
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[16px] font-semibold leading-none text-gray-dark">112</span>
          <span className="text-[13px] leading-tight text-[#707070]">Following</span>
        </div>
      </div>

      <LinkButton
        href="/coach-profile"
        size="sm"
        variant="secondary"
        className="mt-5 w-full text-[15px] font-semibold"
      >
        <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
        Edit profile
      </LinkButton>
    </div>
  );
}
