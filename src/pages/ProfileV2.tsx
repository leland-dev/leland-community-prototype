import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import TopNav from "../components/TopNav";
import MobileTopNav from "../components/MobileTopNav";
import BottomNav from "../components/BottomNav";
import { ExtraLinksProvider } from "../components/ExtraLinksContext";
import pic6 from "../assets/profile photos/pic-6.png";
import mailIcon from "../assets/icons/mail.svg";
import checkIcon from "../assets/icons/check.svg";
import shieldIcon from "../assets/icons/shield-light.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import bookBookmarkIcon from "../assets/icons/book-bookmark.svg";
import piggyBankIcon from "../assets/icons/Piggy bank, Coin.1.svg";
import stopwatchIcon from "../assets/icons/stopwatch.svg";
import supportivenessIcon from "../assets/icons/supportiveness.svg";
import wreathSmallImg from "../assets/img/wreath-small.svg";
import questionIcon from "../assets/icons/question-filled.svg";
import starIcon from "../assets/icons/icon/star.svg";
import atlassianLogo from "../assets/logos/atlassian.png";
import yaleLogo from "../assets/logos/yale.png";
import clientLogo1 from "../assets/logos/Rectangle 3012.png";
import clientLogo2 from "../assets/logos/Rectangle 3013.png";
import clientLogo3 from "../assets/logos/Rectangle 3017.png";
import clientLogo4 from "../assets/logos/Rectangle 3018.png";
import facebookLogo from "../assets/logos/facebook.png";
import googleLogo from "../assets/logos/google.png";
import instagramLogo from "../assets/logos/instagram.png";
import salesforceLogo from "../assets/logos/salesforce.png";
import coinbaseLogo from "../assets/logos/coinbase.png";
import mckinseyLogo from "../assets/logos/mckinsey.png";
import bainLogo from "../assets/logos/bain.png";
import lekLogo from "../assets/logos/lek.png";
import nikeLogo from "../assets/logos/nike.png";
import goldmanSachsLogo from "../assets/logos/goldman-sachs.png";

const PROFILE_SECTIONS = [
  { id: "offerings", label: "Offerings" },
  { id: "activity", label: "Activity" },
  { id: "about-samantha", label: "About" },
  { id: "work-experience", label: "Experience" },
  { id: "reviews", label: "Reviews" },
];

const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

export default function ProfileV2() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [stickyNavVisible, setStickyNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("offerings");
  const [adminOpen, setAdminOpen] = useState(false);
  const [showCustomerFavorite, setShowCustomerFavorite] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const adminRef = useRef<HTMLDivElement>(null);
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navScrollRef = useRef<HTMLDivElement>(null);

  const setSectionRef = useCallback(
    (id: string) => (el: HTMLHeadingElement | null) => {
      sectionRefs.current[id] = el;
    },
    [],
  );

  const setGroupRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      groupRefs.current[id] = el;
    },
    [],
  );

  // Observer A: Show/hide sticky nav based on hero sentinel visibility
  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStickyNavVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Observer B: Track active section group
  useEffect(() => {
    const groups = Object.values(groupRefs.current).filter(Boolean) as HTMLDivElement[];
    if (groups.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-group");
            if (id) setActiveSection(id);
          }
        }
      },
      { rootMargin: "-60px 0px -70% 0px" },
    );

    groups.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll active tab into view
  useEffect(() => {
    const container = navScrollRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(`[data-section="${activeSection}"]`) as HTMLElement | null;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeSection]);

  // Close admin dropdown on outside click
  useEffect(() => {
    if (!adminOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [adminOpen]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile top nav — non-fixed on this page */}
      <div className="md:hidden [&_header]:static">
        <ExtraLinksProvider>
          <MobileTopNav />
        </ExtraLinksProvider>
      </div>

      {/* Desktop/Tablet top nav */}
      <div className="hidden md:block">
        <TopNav />
      </div>

      {/* Sticky secondary nav — portaled to body to escape framer-motion layoutId containing blocks */}
      {createPortal(
        <AnimatePresence>
          {stickyNavVisible && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 right-0 z-30 border-b border-gray-stroke bg-white"
            >
              <div className={`mx-auto flex items-stretch gap-4 px-4 py-2 transition-all duration-300 md:py-0 md:px-10 ${showSidebar ? "max-w-[1144px]" : "max-w-[900px]"}`}>
                {/* Left: photo + name + rate — click to scroll to top */}
                <div
                  className="flex shrink-0 cursor-pointer items-center gap-2.5"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <img
                    src={pic6}
                    alt="Samantha Parker"
                    className="h-10 w-10 rounded-[4px] object-cover"
                  />
                  <div className="flex flex-col text-[16px] leading-tight md:text-[16px]">
                    <span className="text-[18px] font-medium text-gray-dark md:text-[16px]">Samantha Parker</span>
                    <span className="text-[#707070]">$150/hr</span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="min-w-0 flex-1" />

                {/* Right: pivot tabs + CTA */}
                <div className="flex shrink-0 items-stretch">
                  <div
                    ref={navScrollRef}
                    className="hidden items-stretch gap-1 overflow-x-auto md:flex md:scrollbar-hide"
                  >
                    {PROFILE_SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        data-section={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`shrink-0 cursor-pointer border-b-2 px-3 pt-4 pb-4 text-[16px] font-medium transition-colors ${
                          activeSection === section.id
                            ? "border-[#038561] text-gray-dark"
                            : "border-transparent text-gray-light hover:text-gray-dark"
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center pl-4">
                    <button className="cursor-pointer rounded-lg bg-[#038561] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                      Free intro call
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Full-bleed header background */}
      <div className="w-full bg-[#f5f5f5]">
        {/* Category bar placeholder */}
        <div className={`mx-auto px-4 transition-all duration-300 md:px-10 ${showSidebar ? "max-w-[1144px]" : "max-w-[900px]"}`}>
          <div className="h-[44px]" />
        </div>

        {/* Remaining header space */}
        <div className="h-[78px]" />
      </div>

      {/* Main content area */}
      <div className={`mx-auto flex gap-16 px-4 pb-[120px] transition-all duration-300 md:px-10 ${showSidebar ? "max-w-[1144px]" : "max-w-[900px]"}`}>
        {/* Left column — fills available width */}
        <div className="min-w-0 flex-1">
          {/* Profile photo + CTA buttons */}
          <div className="-mt-[80px] mb-4 flex flex-col items-center md:flex-row md:items-end md:justify-between">
            <div className="group relative z-20 cursor-pointer rounded-lg border-[4px] border-white bg-white" onClick={() => setLightboxOpen(true)}>
              <div className="relative overflow-hidden rounded-[4px]">
                <motion.img
                  layoutId="profile-photo"
                  src={pic6}
                  alt="Samantha Parker"
                  className="block h-[132px] w-[132px] object-cover"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>
            </div>
            <div className="hidden items-center gap-2 pb-[72px] md:flex">
              <button className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg border border-[#222222]/10 bg-white transition-colors hover:border-[#222222]/20">
                <img src={mailIcon} alt="Message" className="h-[20px] w-[20px]" />
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#222222]/10 bg-white px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:border-[#222222]/20"
              >
                {isFollowing && <img src={checkIcon} alt="" className="h-[18px] w-[18px]" />}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="cursor-pointer rounded-lg bg-[#038561] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                Free intro call
              </button>
            </div>
          </div>

          {/* Name + Supercoach badge */}
          <div className="mb-1 flex items-center justify-center gap-2 md:justify-start">
            <h1 className="text-[18px] font-medium text-gray-dark">Samantha Parker</h1>
            <span className="text-[18px] text-[#999999]">·</span>
            <span className="text-[18px] text-[#707070]"><span className="text-[16px]">🏆</span> Supercoach</span>
          </div>

          {/* Headline */}
          <p className="mb-[6px] text-center text-[24px] font-medium leading-[1.3] text-[#333333] md:text-left">
            Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB
          </p>

          {/* Credentials row */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-[20px] gap-y-[2px] text-[16px] text-[#707070] md:justify-start">
            {/* Atlassian */}
            <div className="flex items-center gap-[6px]">
              <img src={atlassianLogo} alt="Atlassian" className="h-[18px] w-[18px] rounded" />
              <span>Atlassian</span>
            </div>

            {/* Yale University */}
            <div className="flex items-center gap-[6px]">
              <img src={yaleLogo} alt="Yale University" className="h-[18px] w-[18px] rounded" />
              <span>Yale University</span>
            </div>

            {/* Successful clients at */}
            <div className="flex items-center gap-[6px]">
              <span>Successful clients at</span>
              <div className="flex items-center -space-x-[2px]">
                <img src={clientLogo1} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo2} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo3} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo4} alt="" className="h-[18px] w-[18px] rounded border border-white" />
              </div>
            </div>
          </div>


          {/* Alt stats bar + Customer Favorite */}
          <div className="mb-2 flex flex-col rounded-lg border-transparent md:border-gray-200 md:border">
            <div className="flex">
              {/* Reviews (combined) */}
              <div
                className="flex flex-1 cursor-pointer flex-col items-center py-1 transition-opacity hover:opacity-70 md:py-4"
                onClick={() => scrollToSection("reviews")}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[20px] font-medium leading-none text-gray-dark md:text-[22px]">5.0</span>
                  <img src={starIcon} alt="" className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]" />
                </div>
                <span className="text-[14px] leading-tight text-gray-dark md:text-[16px]">52 reviews</span>
              </div>

              <div className="h-[36px] w-px self-center bg-gray-200" />

              {/* Followers */}
              <div className="flex flex-1 flex-col items-center py-1 md:py-4">
                <span className="text-[20px] font-medium leading-none text-gray-dark md:text-[22px]">182</span>
                <span className="text-[14px] leading-tight text-gray-dark md:text-[16px]">Followers</span>
              </div>

              <div className="h-[36px] w-px self-center bg-gray-200" />

              {/* Posts */}
              <div
                className="flex flex-1 cursor-pointer flex-col items-center py-1 transition-opacity hover:opacity-70 md:py-4"
                onClick={() => scrollToSection("activity")}
              >
                <span className="text-[20px] font-medium leading-none text-gray-dark md:text-[22px]">12</span>
                <span className="text-[14px] leading-tight text-gray-dark md:text-[16px]">Posts</span>
              </div>

              <div className="h-[36px] w-px self-center bg-gray-200" />

              {/* Impressions */}
              <div className="flex flex-1 flex-col items-center py-1 md:py-4">
                <span className="text-[20px] font-medium leading-none text-gray-dark md:text-[22px]">8.2k</span>
                <span className="text-[14px] leading-tight text-gray-dark md:text-[16px]">Impressions</span>
              </div>
            </div>

            {/* Customer Favorite */}
            {showCustomerFavorite && (
              <div className="relative flex items-center justify-center border-t border-gray-200 py-2.5">
                <div className="flex items-center gap-[6px]">
                  <img src={wreathSmallImg} alt="" className="h-auto w-[10px]" />
                  <span className="text-[16px] font-medium text-gray-dark">Customer favorite</span>
                  <img src={wreathSmallImg} alt="" className="h-auto w-[10px] scale-x-[-1]" />
                </div>
                <img src={questionIcon} alt="Info" className="absolute right-2 top-1/2 h-[20px] w-[20px] -translate-y-1/2 cursor-pointer opacity-50 transition-opacity hover:opacity-100" />
              </div>
            )}
          </div>

          {/* Mobile inline CTA + secondary buttons */}
          <div className="mt-3 flex flex-col gap-3 md:hidden">
            <button className="w-full cursor-pointer rounded-full bg-[#038561] px-4 py-3 text-[18px] font-medium text-white transition-colors hover:bg-[#038561]/90">
              Free intro call
            </button>
            <div className="flex gap-2">
              <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#222222]/5 px-4 py-3 text-[18px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                <img src={mailIcon} alt="" className="h-[20px] w-[20px]" />
                Message
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#222222]/5 px-4 py-3 text-[18px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
              >
                {isFollowing && <img src={checkIcon} alt="" className="h-[18px] w-[18px]" />}
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          {/* Availability row */}
          <div className="mt-2 flex flex-col items-center text-center text-[16px] md:items-start md:text-left md:mt-0 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#1A73E8]">Available tomorrow</span>
              <span className="text-[#707070]">·</span>
              <span className="text-[#707070]">Responds within 12 hours</span>
            </div>
            <span className="text-[#9b9b9b]">1,240 minutes coached</span>
          </div>

          {/* Hero sentinel for sticky nav detection */}
          <div ref={heroSentinelRef} />

          {/* ── Offerings group: Offerings + Free Events + Resources ── */}
          <div ref={setGroupRef("offerings")} data-group="offerings">
            <div className="my-[36px] border-t border-gray-200" />

            <h2
              ref={setSectionRef("offerings")}
              className="scroll-mt-[60px] mb-4 text-[24px] font-medium text-gray-dark"
            >
              Offerings
            </h2>

            {/* Offering cards grid */}
            <div className="scrollbar-hide flex gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible">
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
            </div>

            {/* Full-width placeholder */}
            <div className="mt-4 h-[88px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />

            {/* View more + guarantee */}
            <div className="mt-4 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
              <button className="cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                See 8 more packages
              </button>
              <div className="flex items-center gap-2 text-[15px] text-[#9b9b9b]">
                <img src={shieldIcon} alt="" className="w-[12px]" />
                <span>Protected by the <span className="cursor-pointer underline decoration-[0.5px] underline-offset-2 transition-colors hover:text-[#707070]">Leland Experience Guarantee</span></span>
              </div>
            </div>

            {/* Free events */}
            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-1 text-[24px] font-medium text-gray-dark">Free events</h2>
            <p className="mb-4 text-[18px] text-[#707070]">Live, interactive sessions you can join for free</p>
            <div className="flex flex-col gap-4">
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>
            <button className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See 2 more
              <img src={chevronDownIcon} alt="" className="h-[16px] w-[16px]" />
            </button>

            {/* Leland+ Resources */}
            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-1 text-[24px] font-medium text-gray-dark">Resources</h2>
            <p className="mb-4 text-[18px] text-[#707070]">Access expert resources from Samantha and hundreds of other coaches on Leland+</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[80px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[80px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[80px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[80px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>
            <button className="mt-4 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See more
            </button>
          </div>

          {/* ── Activity group ── */}
          <div ref={setGroupRef("activity")} data-group="activity">
            <div className="my-[36px] border-t border-gray-200" />
            <h2
              ref={setSectionRef("activity")}
              className="scroll-mt-[60px] mb-4 text-[24px] font-medium text-gray-dark"
            >
              Activity
            </h2>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible">
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
            </div>
            <button className="mt-4 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See all
            </button>
          </div>

          {/* ── About group: MBA Qualifications + About Samantha + Why do I coach? ── */}
          <div ref={setGroupRef("about-samantha")} data-group="about-samantha">
            <div className="my-[36px] border-t border-gray-200" />
            <h2
              ref={setSectionRef("about-samantha")}
              className="scroll-mt-[60px] mb-4 text-[24px] font-medium text-gray-dark"
            >
              MBA Qualifications
            </h2>
            <div className="flex flex-col gap-4">
              <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>

            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-4 text-[24px] font-medium text-gray-dark">About Samantha</h2>
            <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />

            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-4 text-[24px] font-medium text-gray-dark">Why do I coach?</h2>
            <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
          </div>

          {/* ── Experience group: Work Experience + Education ── */}
          <div ref={setGroupRef("work-experience")} data-group="work-experience">
            <div className="my-[36px] border-t border-gray-200" />
            <h2
              ref={setSectionRef("work-experience")}
              className="scroll-mt-[60px] mb-4 text-[24px] font-medium text-gray-dark"
            >
              Work Experience
            </h2>
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-[100px] w-[100px] shrink-0 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                  <div className="h-[100px] min-w-0 flex-1 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                </div>
              ))}
            </div>

            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-4 text-[24px] font-medium text-gray-dark">Education</h2>
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-[100px] w-[100px] shrink-0 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                  <div className="h-[100px] min-w-0 flex-1 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Reviews group ── */}
          <div ref={setGroupRef("reviews")} data-group="reviews">
            <div className="my-[36px] border-t border-gray-200" />
            <div ref={setSectionRef("reviews")} className="scroll-mt-[60px]" />

            {/* Stars + rating */}
            <div className="mb-1 flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#222222">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <div className="flex flex-col items-start justify-between gap-1 md:flex-row md:items-end">
              <p className="text-[28px] font-medium text-gray-dark">5.0 average review</p>
              <p className="text-[16px] font-normal text-[#9b9b9b]">52 reviews</p>
            </div>

            <div className="my-5 border-t border-gray-200" />

            {/* Rating breakdown — Airbnb-style columns */}
            <div className="flex flex-col gap-4 md:grid md:grid-cols-5">
              {/* Overall rating distribution */}
              <div className="md:col-span-1">
                <p className="mb-1 text-[16px] font-medium text-gray-dark">Overall rating</p>
                <div className="flex flex-col gap-1">
                  {[
                    { star: 5, count: 48 },
                    { star: 4, count: 3 },
                    { star: 3, count: 1 },
                    { star: 2, count: 0 },
                    { star: 1, count: 0 },
                  ].map((row) => (
                    <div key={row.star} className="flex items-center gap-1.5">
                      <span className="w-[10px] shrink-0 text-[12px] text-[#707070]">{row.star}</span>
                      <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
                        <div
                          className="h-full rounded-full bg-gray-dark"
                          style={{ width: `${(row.count / 52) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category scores — horizontal scroll on mobile, grid columns on desktop */}
              <div className="scrollbar-hide col-span-4 flex gap-3 overflow-x-auto md:contents">
                {[
                  {
                    label: "Knowledge",
                    score: 5.0,
                    icon: <img src={bookBookmarkIcon} alt="" className="h-[32px] w-[32px]" />,
                  },
                  {
                    label: "Value",
                    score: 4.9,
                    icon: <img src={piggyBankIcon} alt="" className="h-[32px] w-[32px]" />,
                  },
                  {
                    label: "Responsiveness",
                    score: 5.0,
                    icon: <img src={stopwatchIcon} alt="" className="h-[32px] w-[32px]" />,
                  },
                  {
                    label: "Supportiveness",
                    score: 5.0,
                    icon: <img src={supportivenessIcon} alt="" className="h-[32px] w-[32px]" />,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex w-[60vw] shrink-0 flex-col justify-between rounded-lg border border-gray-200 p-4 md:w-auto md:shrink md:rounded-none md:border-0 md:border-l md:p-0 md:pl-4">
                  <div>
                    <p className="text-[16px] font-medium text-gray-dark">{item.label}</p>
                    <p className="text-[24px] font-medium text-gray-dark">{item.score.toFixed(1)}</p>
                  </div>
                  <div className="mt-3 text-gray-dark">{item.icon}</div>
                </div>
              ))}
              </div>
            </div>

            <div className="my-6 border-t border-gray-200" />

            {/* Successful clients at */}
            <div className="mb-6">
              <p className="mb-1.5 text-[16px] font-medium text-gray-dark">Successful clients at</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap items-center gap-[4px]">
                  {[clientLogo1, clientLogo2, clientLogo3, clientLogo4, facebookLogo, googleLogo, instagramLogo, salesforceLogo, coinbaseLogo, mckinseyLogo, bainLogo, lekLogo, nikeLogo, goldmanSachsLogo].map((logo, i) => (
                    <div key={i} className="h-[32px] w-[32px] shrink-0 overflow-hidden rounded-[2px]">
                      <img src={logo} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <span className="flex h-[32px] items-center rounded-[2px] bg-[#f5f5f5] px-2 text-[14px] font-medium text-[#707070]">+12</span>
                </div>
                <div className="hidden flex-1 md:block" />
                <button className="cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                  See all
                </button>
              </div>
            </div>

            <div className="my-6 border-t border-gray-200" />

            {/* Review card placeholders */}
            <div className="flex flex-col gap-4">
              <div className="h-[180px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[180px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[180px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>

            {/* See all reviews */}
            <button className="mt-6 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See all 52 reviews
            </button>
          </div>
        </div>

        {/* Right column — fixed 240px sidebar, hidden on tablet */}
        {showSidebar && (
          <div className="hidden w-[240px] shrink-0 pt-6 lg:block">
            <div className="flex flex-col gap-[14px]">
              <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[280px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[120px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>
          </div>
        )}
      </div>

      {/* Profile photo lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute right-6 top-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>
            <motion.img
              layoutId="profile-photo"
              src={pic6}
              alt="Samantha Parker"
              className="max-h-[80vh] max-w-[80vw] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin controls */}
      <div ref={adminRef} className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <div className="mb-1.5 px-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-[#9b9b9b]">
                Admin controls
              </div>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[16px] font-medium text-gray-dark">Customer favorite</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showCustomerFavorite}
                    onChange={() => setShowCustomerFavorite(!showCustomerFavorite)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[16px] font-medium text-gray-dark">Show sidebar</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showSidebar}
                    onChange={() => setShowSidebar(!showSidebar)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#222222]/5 transition-colors hover:bg-[#222222]/[0.08]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#707070" />
            <circle cx="8" cy="8" r="1.5" fill="#707070" />
            <circle cx="13" cy="8" r="1.5" fill="#707070" />
          </svg>
        </button>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
