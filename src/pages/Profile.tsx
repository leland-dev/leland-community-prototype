import { useState } from "react";
import verifiedIcon from "../assets/icons/verified.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import likesIcon from "../assets/icons/likes.svg";
import commentsIcon from "../assets/icons/comments.svg";
import repostsIcon from "../assets/icons/reposts.svg";
import sharesIcon from "../assets/icons/shares.svg";
import mailIcon from "../assets/icons/mail.svg";
import wreathImg from "../assets/img/wreath.png";
import starIcon from "../assets/icons/icon/star.svg";
import atlassianLogo from "../assets/logos/atlassian.png";
import gsbLogo from "../assets/logos/gsb.png";
import yaleLogo from "../assets/logos/yale.png";
import clientLogo1 from "../assets/logos/Rectangle 3012.png";
import clientLogo2 from "../assets/logos/Rectangle 3013.png";
import clientLogo3 from "../assets/logos/Rectangle 3017.png";
import clientLogo4 from "../assets/logos/Rectangle 3018.png";
import coverImage from "../assets/img/cpver-image 1.jpg";
import workTogetherImg from "../assets/img/work-together.png";

// Sample post images
const postImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop",
];

// Helper function
function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toString();
}

// Post component
function FeedPost({ body, image, time, likes, comments, reposts }: {
  body: string;
  image?: string;
  time: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
}) {
  return (
    <div className="border-b border-gray-stroke pt-5 pb-[14px]">
      <div className="flex gap-3">
        {/* Left column: avatar */}
        <div className="group relative h-10 w-10 shrink-0 cursor-pointer">
          <img
            src={pic1}
            alt="Alex Ward"
            className="h-10 w-10 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
          />
          <div className="absolute inset-0 rounded-full bg-black/0 transition-colors group-hover:bg-black/10" />
        </div>
        {/* Right column: content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="cursor-pointer text-[17px] leading-tight font-medium text-gray-dark">Alex Ward</span>
                <img src={verifiedIcon} alt="Verified" className="h-[15px] w-[15px] shrink-0" />
                <span className="shrink-0 text-[17px] leading-tight text-gray-xlight">{time}</span>
              </div>
              <p className="truncate text-[15px] leading-tight text-[#707070]">Former Director of Programs and Admissions at Stanford GSB</p>
            </div>
            <button className="cursor-pointer pl-2 text-[#424242] opacity-40 transition-opacity hover:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="19" cy="12" r="1.5" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-[17px] leading-[1.4] text-gray-dark">{body}</p>
          {image && (
            <div className="mt-3 overflow-hidden rounded-xl">
              <img
                src={image}
                alt=""
                className="w-full object-cover"
                style={{ maxHeight: 400 }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-1 flex items-center gap-2 pl-[44px]">
        <button className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-[#424242] transition-colors hover:bg-gray-hover">
          <img src={likesIcon} alt="Like" className="h-[22px] w-[22px]" />
          {likes > 0 && <span className="text-[15px] font-normal">{formatCount(likes)}</span>}
        </button>
        <button className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-[#424242] transition-colors hover:bg-gray-hover">
          <img src={commentsIcon} alt="Comment" className="h-[22px] w-[22px]" />
          {comments > 0 && <span className="text-[15px] font-normal">{formatCount(comments)}</span>}
        </button>
        <button className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-[#424242] transition-colors hover:bg-gray-hover">
          <img src={repostsIcon} alt="Repost" className="h-[22px] w-[22px]" />
          {reposts > 0 && <span className="text-[15px] font-normal">{formatCount(reposts)}</span>}
        </button>
        <button className="flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1.5 text-[#424242] transition-colors hover:bg-gray-hover">
          <img src={sharesIcon} alt="Share" className="h-[22px] w-[22px]" />
        </button>
        <button className="ml-auto cursor-pointer rounded-[100px] bg-[#222222]/5 px-[14px] py-1.5 text-[15px] font-medium text-[#424242] transition-colors hover:bg-[#222222]/[0.08]">
          Free intro call
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"activity" | "offerings" | "reviews" | "about">("activity");
  const [isVerifiedExpert, setIsVerifiedExpert] = useState(true);
  const [largeBadges, setLargeBadges] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-3xl">
      {/* Cover Image */}
      <div className="px-4 lg:px-0">
        <div className="-mx-3">
          <img
            src={coverImage}
            alt="Cover"
            className="h-[200px] w-full rounded-[6px] object-cover"
          />
        </div>
      </div>

      {/* Header Section */}
      <div className="px-4 lg:px-0">
        <div className="-mt-[88px] flex items-end justify-between">
          {/* Profile Picture */}
          <img
            src={pic1}
            alt="Alex Ward"
            className="h-[140px] w-[140px] rounded-full border-[5px] border-white object-cover"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isVerifiedExpert && (
              <button className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-[10px] bg-gray-hover transition-colors hover:bg-gray-stroke">
                <img src={mailIcon} alt="Message" className="h-[20px] w-[20px]" />
              </button>
            )}
            <button className="cursor-pointer rounded-[10px] bg-gray-hover px-5 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-stroke">
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 lg:px-0">
        {/* Name with verified badge */}
        <div className="flex items-center gap-2">
          <h1 className="text-[26px] font-bold text-gray-dark">Alex Ward</h1>
          {isVerifiedExpert && (
            <img src={verifiedIcon} alt="Verified" className="mt-[2px] h-[19px] w-[19px]" />
          )}
        </div>

        {/* Headline - gray text */}
        <h2 className="mt-1 text-[18px] leading-tight text-gray-600">
          Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB AdComm
        </h2>

        {/* Compact Inline Badges (when large badges are off) */}
        {!largeBadges && (
          <div className="mt-3 flex flex-wrap items-center gap-[20px] text-[16px]">
            {/* Atlassian */}
            <div className="flex items-center gap-[6px]">
              <img src={atlassianLogo} alt="Atlassian" className="h-[18px] w-[18px] rounded" />
              <span className="text-gray-dark">Atlassian</span>
            </div>

            {/* Yale University */}
            <div className="flex items-center gap-[6px]">
              <img src={yaleLogo} alt="Yale University" className="h-[18px] w-[18px] rounded" />
              <span className="text-gray-dark">Yale University</span>
            </div>

            {/* Successful clients at */}
            <div className="flex items-center gap-[6px]">
              <span className="text-gray-600">Successful clients at</span>
              <div className="flex items-center -space-x-[2px]">
                <img src={clientLogo1} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo2} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo3} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo4} alt="" className="h-[18px] w-[18px] rounded border border-white" />
              </div>
            </div>
          </div>
        )}

        {/* Stats row with reviews */}
        <div className="mt-3 flex items-center gap-4">
          {isVerifiedExpert && (
            <div
              className="flex cursor-pointer items-baseline gap-1 transition-opacity hover:opacity-70"
              onClick={() => setActiveTab("reviews")}
            >
              <img src={starIcon} alt="Star" className="mb-[2px] h-[15px] w-[15px]" />
              <span className="text-[18px] font-medium text-gray-dark">4.99</span>
              <span className="text-[16px] text-gray-600">24 reviews</span>
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-medium text-gray-dark">12</span>
            <span className="text-[16px] text-gray-600">posts</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-medium text-gray-dark">245</span>
            <span className="text-[16px] text-gray-600">followers</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-medium text-gray-dark">8.2K</span>
            <span className="text-[16px] text-gray-600">impressions</span>
          </div>
        </div>

        {/* Large Badges - horizontal scroll (only when large badges are on) */}
        {largeBadges && (
          <div className="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex h-[88px] gap-[8px]">
              {/* Customer Favorite badge */}
              {isVerifiedExpert && (
                <div className="flex h-full shrink-0 flex-col overflow-hidden rounded-lg border border-gray-stroke bg-white">
                  <div className="flex flex-1 items-center justify-center px-3">
                    <div className="flex items-center gap-[6px]">
                      <img src={wreathImg} alt="Wreath Left" className="h-auto w-[21px]" />
                      <div className="text-center">
                        <p className="text-[17px] font-medium leading-[100%] text-gray-dark">Customer</p>
                        <p className="text-[17px] font-medium leading-[100%] text-gray-dark">Favorite</p>
                      </div>
                      <img src={wreathImg} alt="Wreath Right" className="h-auto w-[21px] scale-x-[-1]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Atlassian badge */}
              <div className="flex h-full shrink-0 flex-col overflow-hidden rounded-lg border border-gray-stroke bg-white">
                <div className="w-full bg-[#F5F5F5] px-2 pb-1 pt-[2px] text-center">
                  <span className="text-[13px] font-medium tracking-[0.05em] text-gray-500">WORKS AT</span>
                </div>
                <div className="flex flex-1 items-center justify-center px-3">
                  <div className="flex items-center gap-[6px]">
                    <img src={atlassianLogo} alt="Atlassian" className="h-[16px] w-[16px] rounded" />
                    <span className="text-[17px] font-medium leading-[100%] text-gray-dark">Atlassian</span>
                  </div>
                </div>
              </div>

              {/* Stanford GSB badge */}
              <div className="flex h-full shrink-0 flex-col overflow-hidden rounded-lg border border-gray-stroke bg-white">
                <div className="w-full bg-[#F5F5F5] px-2 pb-1 pt-[2px] text-center">
                  <span className="text-[13px] font-medium tracking-[0.05em] text-gray-500">STUDIED AT</span>
                </div>
                <div className="flex flex-1 items-center justify-center px-3">
                  <div className="flex items-center gap-[6px]">
                    <img src={gsbLogo} alt="Stanford GSB" className="h-[16px] w-[16px] rounded" />
                    <span className="text-[17px] font-medium leading-[100%] text-gray-dark">Stanford GSB</span>
                  </div>
                </div>
              </div>

              {/* Placeholder badge 1 */}
              <div className="h-full w-[140px] shrink-0 rounded-lg border border-dashed border-[#C5C5C5] bg-[#F5F5F5]"></div>

              {/* Placeholder badge 2 */}
              <div className="h-full w-[140px] shrink-0 rounded-lg border border-dashed border-[#C5C5C5] bg-[#F5F5F5]"></div>

              {/* Placeholder badge 3 */}
              <div className="h-full w-[140px] shrink-0 rounded-lg border border-dashed border-[#C5C5C5] bg-[#F5F5F5]"></div>

              {/* Placeholder badge 4 */}
              <div className="h-full w-[140px] shrink-0 rounded-lg border border-dashed border-[#C5C5C5] bg-[#F5F5F5]"></div>
            </div>
          </div>
        )}

        {/* Offerings Banner */}
        {isVerifiedExpert && (
          <div
            className="mt-5 flex cursor-pointer items-center justify-between rounded-lg bg-[#F5F5F5] px-4 py-3 transition-all hover:bg-[#EBEBEB]"
            onClick={() => setActiveTab("offerings")}
          >
            <div className="flex items-center gap-3">
              <img src={workTogetherImg} alt="Work together" className="h-12 w-auto object-contain" />
              <div className="flex flex-col gap-[2px]">
                <p className="text-[18px] font-medium leading-tight text-gray-dark">Work with Alex</p>
                <p className="text-[16px] leading-tight">
                  <span className="text-[#038561]">Available today</span>
                  <span className="text-gray-600"> · Responds within 3h</span>
                </p>
              </div>
            </div>
            <button className="shrink-0 rounded-[10px] bg-[#038561] px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-[#038561]/90">
              Free intro call
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="sticky top-14 z-10 mt-6 flex border-b border-gray-stroke bg-white md:top-0">
          {(isVerifiedExpert
            ? (["activity", "offerings", "reviews", "about"] as const)
            : (["activity", "about"] as const)
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`relative flex-1 py-3 text-[17px] font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "text-gray-dark"
                  : "text-gray-light hover:text-gray-dark"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-dark" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "activity" && (
            <div className="divide-y divide-gray-stroke">
              <FeedPost
                body="Just wrapped up my first week at McKinsey. The learning curve is steep but the people are incredible. Grateful for the Leland community that helped me prep for case interviews — couldn't have done it without you all."
                time="2h"
                likes={142}
                comments={18}
                reposts={5}
                shares={3}
              />
              <FeedPost
                body="Stanford GSB admit weekend was everything I hoped for and more. The campus, the people, the energy — can't wait to start in the fall. Here are some highlights:"
                image={postImages[0]}
                time="4h"
                likes={384}
                comments={42}
                reposts={12}
                shares={8}
              />
              <FeedPost
                body="Hot take: the GMAT is not the most important part of your MBA application. I've seen 780 scorers get rejected and 680 scorers get into M7. Your story matters more than your score."
                time="8h"
                likes={521}
                comments={63}
                reposts={34}
                shares={2}
              />
              <FeedPost
                body='Coaching session with an incredible candidate today. Went from a shaky "tell me about yourself" to a compelling 2-minute narrative. Love this work.'
                image={postImages[1]}
                time="10h"
                likes={67}
                comments={4}
                reposts={1}
                shares={0}
              />
              <FeedPost
                body="After 6 months of prep, 4 applications, and 2 interviews — I just got the call. Bain offered me a position in their SF office. I'm literally shaking right now. Thank you to everyone who believed in me when I didn't believe in myself."
                time="12h"
                likes={892}
                comments={97}
                reposts={41}
                shares={15}
              />
              <FeedPost
                body="Unpopular opinion: you don't need an MBA to break into consulting. I did it with a non-target undergrad and 3 years at a startup. AMA."
                time="16h"
                likes={234}
                comments={89}
                reposts={15}
                shares={4}
              />
              <FeedPost
                body="Tip for MBB interviews: the frameworks are just training wheels. The best candidates drop the framework mid-case when they spot something interesting. Interviewers want to see how you think, not how well you memorized Victor Cheng."
                time="1d"
                likes={312}
                comments={44}
                reposts={27}
                shares={9}
              />
            </div>
          )}
          {activeTab === "offerings" && (
            <div className="space-y-4">
              {/* Main Offerings Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Free Intro Call */}
                <div className="flex flex-col items-center rounded-xl border border-gray-stroke bg-[#F5F5F5] px-8 py-10 text-center">
                  <h3 className="text-[20px] font-semibold text-gray-dark">Free 15-minute intro call</h3>
                  <p className="mt-3 text-[16px] text-gray-600">
                    Get to know Alex and make a plan for working together.
                  </p>
                  <button className="mt-6 rounded-[10px] bg-[#038561] px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                    Schedule free intro call
                  </button>
                </div>

                {/* Custom Hourly */}
                <div className="flex flex-col items-center rounded-xl border border-gray-stroke bg-[#F5F5F5] px-8 py-10 text-center">
                  <h3 className="text-[20px] font-semibold text-gray-dark">Custom hourly coaching</h3>
                  <p className="mt-3 text-[16px] text-gray-600">
                    Get help with Editing, School Selection, and more.
                  </p>
                  <button className="mt-6 rounded-[10px] border border-gray-stroke bg-white px-6 py-3 text-[15px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
                    Get started for $259/hr
                  </button>
                </div>
              </div>

              {/* Coaching Packages Placeholders */}
              <div className="space-y-4">
                <div className="h-[120px] w-full rounded-xl border border-dashed border-[#C5C5C5] bg-[#F5F5F5]"></div>
                <div className="h-[120px] w-full rounded-xl border border-dashed border-[#C5C5C5] bg-[#F5F5F5]"></div>
                <div className="h-[120px] w-full rounded-xl border border-dashed border-[#C5C5C5] bg-[#F5F5F5]"></div>
              </div>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="text-center py-12 text-gray-light">
              <p>Reviews coming soon</p>
            </div>
          )}
          {activeTab === "about" && (
            <div className="space-y-8">
              {/* About Section */}
              <div>
                <h3 className="mb-3 text-[20px] font-bold text-gray-dark">About</h3>
                <p className="text-[17px] leading-relaxed text-gray-dark">
                  Product Manager at Stripe with a background in consulting and engineering. Currently pursuing my MBA at HBS while preparing for a career pivot into VC. Passionate about fintech, developer tools, and building products that scale.
                </p>
              </div>

              {/* Experience Section */}
              <div>
                <h3 className="mb-4 text-[20px] font-bold text-gray-dark">Experience</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <span className="text-[20px] font-semibold text-gray-dark">💳</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[18px] font-semibold text-gray-dark">Product Manager</h4>
                      <p className="text-[16px] text-gray-light">Stripe</p>
                      <p className="mt-1 text-[15px] text-gray-light">2022 – Present</p>
                      <p className="mt-3 text-[16px] leading-relaxed text-gray-dark">
                        Led payments SDK developer experience, driving 40% reduction in integration time across 1,200+ partners.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <span className="text-[20px] font-semibold text-gray-dark">📦</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[18px] font-semibold text-gray-dark">Associate Product Manager</h4>
                      <p className="text-[16px] text-gray-light">Dropbox</p>
                      <p className="mt-1 text-[15px] text-gray-light">2020 – 2022</p>
                      <p className="mt-3 text-[16px] leading-relaxed text-gray-dark">
                        Worked on Paper collaboration product, shipped 3 major features used by 2M+ teams.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <span className="text-[20px] font-semibold text-gray-dark">🏢</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[18px] font-semibold text-gray-dark">Business Analyst</h4>
                      <p className="text-[16px] text-gray-light">Accenture</p>
                      <p className="mt-1 text-[15px] text-gray-light">2018 – 2020</p>
                      <p className="mt-3 text-[16px] leading-relaxed text-gray-dark">
                        Strategy consulting across fintech and retail clients.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div>
                <h3 className="mb-4 text-[20px] font-bold text-gray-dark">Education</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <span className="text-[20px] font-semibold text-gray-dark">🎓</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[18px] font-semibold text-gray-dark">Harvard Business School</h4>
                      <p className="text-[16px] text-gray-light">MBA</p>
                      <p className="mt-1 text-[15px] text-gray-light">2024 – 2026</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <span className="text-[20px] font-semibold text-gray-dark">🎓</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[18px] font-semibold text-gray-dark">MIT</h4>
                      <p className="text-[16px] text-gray-light">B.S. in Computer Science and Engineering</p>
                      <p className="mt-1 text-[15px] text-gray-light">2014 – 2018</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Floating Toggle Controls */}
    <div className="fixed bottom-6 left-6 z-50 rounded-xl border border-gray-stroke bg-white px-4 py-3 shadow-lg">
      <div className="flex flex-col gap-3">
        {/* Verified Expert Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-gray-dark">Verified Expert</span>
          <button
            onClick={() => setIsVerifiedExpert(!isVerifiedExpert)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              isVerifiedExpert ? "bg-[#038561]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                isVerifiedExpert ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Large Badges Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-gray-dark">Large Badges</span>
          <button
            onClick={() => setLargeBadges(!largeBadges)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              largeBadges ? "bg-[#038561]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                largeBadges ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  </>
  );
}
