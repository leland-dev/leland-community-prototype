import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { Button } from "../components/Button";
import { useSearchParams, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import PageShell from "../components/PageShell";
import SessionCard from "../components/SessionCard";
import OfferingCard, { type OfferingType } from "../components/OfferingCard";
import SidebarCard, { SidebarGroup } from "../components/SidebarCard";
import topicHash from "../assets/img/topic-hash.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import customerPhoto from "../assets/profile photos/profile photo.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import mailIcon from "../assets/icons/mail.svg";
import shareArrowIcon from "../assets/icons/share-arrow.svg";
import checkIcon from "../assets/icons/check.svg";
import editIcon from "../assets/icons/edit.svg";
import verifiedIcon from "../assets/icons/verified.svg";
import shieldIcon from "../assets/icons/shield-light.svg";
import airplaneIcon from "../assets/icons/airplane.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import bookBookmarkIcon from "../assets/icons/book-bookmark.svg";
import piggyBankIcon from "../assets/icons/Piggy bank, Coin.1.svg";
import stopwatchIcon from "../assets/icons/stopwatch.svg";
import supportivenessIcon from "../assets/icons/supportiveness.svg";
import wreathImg from "../assets/img/Wreath.svg";
import videoThumbnail from "../assets/img/Video-Thumbnail.png";
import starIcon from "../assets/icons/star.svg";
import categoryMBA from "../assets/placeholder images/category images/gmat-tutoring.png";
import categoryConsulting from "../assets/placeholder images/category images/management-consulting.png";
import categoryPM from "../assets/placeholder images/category images/product-management.png";

import coachCoverImage from "../assets/img/cover-2.avif";
import customerCoverImage from "../assets/img/cpver-image 1.jpg";
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
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";
import bootcampImg1 from "../assets/placeholder images/bootcamp-1.webp";
import lelandPlusImg1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import lelandPlusImg2 from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";
import lelandPlusImg3 from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";
import stanford1 from "../assets/placeholder post assets/stanford-post/00c1e12547190979b4db2978dbe211e2.jpg";
import stanford2 from "../assets/placeholder post assets/stanford-post/39a9980b59e79fa3b58e8d7d5145b9a9.jpg";
import stanford3 from "../assets/placeholder post assets/stanford-post/989ac1d56cf981c783808b83154d8a25.jpg";
import stanford4 from "../assets/placeholder post assets/stanford-post/eb80edada3b3db7955379d433ca2861a.jpg";
import { FeedPost, type Post } from "./Home";

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

const upcomingEvents = [
  { title: "1:1 Session with Jessica", dateTime: "Monday, Mar 30 at 2:00 PM", duration: "45m", image: pic6, type: "coach" as const, status: "live" as const },
  { title: "MBA Strategy Live", dateTime: "Monday, Mar 30 at 4:00 PM", duration: "45m", image: eventImg1, type: "event" as const, status: "upcoming" as const, startsIn: "2h" },
  { title: "Intro Call with Samantha", dateTime: "Wednesday, Apr 1 at 11:00 AM", duration: "30m", image: pic8, type: "coach" as const, status: "upcoming" as const, startsIn: "2d" },
  { title: "GMAT Exam Prep Bootcamp", dateTime: "Thursday, Apr 2 at 6:00 PM", duration: "60m", image: eventImg2, type: "event" as const, status: "upcoming" as const, startsIn: "3d" },
  { title: "Case Interview Masterclass", dateTime: "Monday, Apr 6 at 12:00 PM", duration: "90m", image: eventImg3, type: "event" as const, status: "upcoming" as const, startsIn: "7d" },
  { title: "1:1 Session with Marcus", dateTime: "Wednesday, Apr 8 at 3:30 PM", duration: "45m", image: pic9, type: "coach" as const, status: "upcoming" as const, startsIn: "9d" },
  { title: "Resume Review with Priya", dateTime: "Friday, Apr 10 at 10:00 AM", duration: "30m", image: pic2, type: "coach" as const, status: "upcoming" as const, startsIn: "11d" },
];

const pastEvents = [
  { title: "1:1 Session with Marcus", dateTime: "Friday, Mar 28 at 10:00 AM", duration: "45m", image: pic7, type: "coach" as const, hasRecording: false },
  { title: "Resume Review Workshop", dateTime: "Thursday, Mar 27 at 3:00 PM", duration: "60m", image: eventImg3, type: "event" as const, hasRecording: true },
  { title: "1:1 Session with Jessica", dateTime: "Wednesday, Mar 26 at 2:00 PM", duration: "45m", image: pic6, type: "coach" as const, hasRecording: false },
  { title: "MBA Admissions Strategy", dateTime: "Tuesday, Mar 25 at 1:00 PM", duration: "45m", image: eventImg1, type: "event" as const, hasRecording: true },
  { title: "Intro Call with David", dateTime: "Monday, Mar 24 at 11:00 AM", duration: "30m", image: pic9, type: "coach" as const, hasRecording: false },
  { title: "1:1 Session with Rachel", dateTime: "Sunday, Mar 23 at 3:00 PM", duration: "45m", image: pic10, type: "coach" as const, hasRecording: false },
  { title: "Career Pivot Workshop", dateTime: "Saturday, Mar 22 at 10:00 AM", duration: "90m", image: eventImg2, type: "event" as const, hasRecording: true },
  { title: "1:1 Session with Alex", dateTime: "Friday, Mar 21 at 1:00 PM", duration: "45m", image: pic11, type: "coach" as const, hasRecording: false },
  { title: "Networking Strategies Live", dateTime: "Thursday, Mar 20 at 5:00 PM", duration: "60m", image: eventImg3, type: "event" as const, hasRecording: true },
  { title: "1:1 Session with Jessica", dateTime: "Wednesday, Mar 19 at 2:00 PM", duration: "45m", image: pic6, type: "coach" as const, hasRecording: true },
  { title: "Case Interview Practice", dateTime: "Tuesday, Mar 18 at 11:00 AM", duration: "45m", image: eventImg1, type: "event" as const, hasRecording: true },
  { title: "1:1 Session with Priya", dateTime: "Monday, Mar 17 at 4:00 PM", duration: "30m", image: pic2, type: "coach" as const, hasRecording: false },
  { title: "GSB Essay Workshop", dateTime: "Friday, Mar 14 at 1:00 PM", duration: "90m", image: eventImg2, type: "event" as const, hasRecording: true },
  { title: "1:1 Session with Samantha", dateTime: "Thursday, Mar 13 at 10:00 AM", duration: "45m", image: pic8, type: "coach" as const, hasRecording: true },
  { title: "Behavioral Interview Prep", dateTime: "Wednesday, Mar 12 at 3:00 PM", duration: "60m", image: eventImg3, type: "event" as const, hasRecording: true },
];

interface PurchasedOffering {
  type: OfferingType;
  title: string;
  subtitle: ReactNode;
  image: string;
  exhausted?: boolean;
}

const purchasedOfferings: PurchasedOffering[] = [
  {
    type: "hourly",
    title: "1h 20m with Marcus",
    subtitle: "45m available to schedule",
    image: pic9,
  },
  {
    type: "hourly",
    title: "Out of time with Jessica",
    subtitle: "0m available to schedule",
    image: pic6,
    exhausted: true,
  },
  {
    type: "package",
    title: "MBA Application Package",
    subtitle: <>Comprehensive package · <span className="text-[#038561]">Currently active</span></>,
    image: pic7,
  },
  {
    type: "course",
    title: "GMAT Exam Prep Bootcamp",
    subtitle: <>Started June 1 <span className="text-[#9B9B9B]">· Next session tomorrow</span></>,
    image: bootcampImg1,
  },
  {
    type: "content",
    title: "How I Got Into Stanford GSB",
    subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>,
    image: lelandPlusImg1,
  },
];

const coachOfferings: { type: OfferingType; title: string; subtitle: ReactNode; image: string; ctaLabel?: string }[] = [
  { type: "free-intro", title: "Free 15-minute intro call", subtitle: "Get to know Samantha and make a plan", image: "" },
  { type: "hourly-package", title: "10-Hour Coaching Package", subtitle: "10 hours · $1,200", image: eventImg1 },
  { type: "package", title: "MBA Application Package", subtitle: "Comprehensive Package · Starting at $750", image: eventImg2 },
  { type: "package", title: "Interview Prep Package", subtitle: "Comprehensive Package · Starting at $500", image: eventImg3 },
  { type: "hourly", title: "Custom hourly coaching", subtitle: "$150 per hour", image: "" },
  { type: "content", title: "How I Got Into Stanford GSB", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>, image: lelandPlusImg1 },
  { type: "content", title: "GMAT Study Plan: 3 Months to 750+", subtitle: <span className="flex items-center gap-1.5"><img src={pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Samantha Parker <span className="text-[#9B9B9B]">· 184 views</span></span>, image: lelandPlusImg2 },
  { type: "content", title: "My Consulting Recruiting Timeline", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 97 views</span></span>, image: lelandPlusImg3 },
];

const customerPosts: Post[] = [
  {
    id: 201,
    type: "image",
    author: "June Allen",
    avatar: customerPhoto,
    time: "3d",
    body: "Stanford GSB admit weekend in the books. The campus, the people, the energy — surreal. Two years ago I almost convinced myself not to apply. Glad I didn't listen to that voice.",
    images: [stanford1, stanford2, stanford3, stanford4],
    likes: 612,
    comments: 78,
    reposts: 24,
    shares: 11,
  },
  {
    id: 202,
    type: "text",
    author: "June Allen",
    avatar: customerPhoto,
    time: "1w",
    body: "I got in. STANFORD GSB. I literally screamed in my apartment when I saw the email. To everyone who supported me through this brutal process — this is for you. More to come, but for now I'm just letting it sink in.",
    likes: 1487,
    comments: 213,
    reposts: 56,
    shares: 34,
  },
  {
    id: 203,
    type: "text",
    author: "June Allen",
    avatar: customerPhoto,
    time: "3w",
    body: "Interview invite from Stanford. I'm pacing around my living room trying to act normal. Time to lock in for the next two weeks.",
    likes: 423,
    comments: 64,
    reposts: 8,
    shares: 4,
  },
  {
    id: 204,
    type: "text",
    author: "June Allen",
    avatar: customerPhoto,
    time: "1mo",
    body: "Hardest part of the application wasn't the essays — it was being honest with myself about why I actually wanted an MBA. My coach pushed me on this for weeks. Every time I gave a polished answer, she'd ask 'but why really?' Eventually I cracked. Turns out the real reason wasn't the version I'd been telling people.",
    likes: 891,
    comments: 124,
    reposts: 47,
    shares: 22,
  },
  {
    id: 205,
    type: "text",
    author: "June Allen",
    avatar: customerPhoto,
    time: "2mo",
    body: "Submitted Round 1 to Stanford, HBS, and Wharton tonight. 11 months of work compressed into a few clicks. I don't know what's going to happen but I know the application I sent in is the most honest version of myself I could put on paper. That has to count for something.",
    likes: 567,
    comments: 89,
    reposts: 12,
    shares: 6,
  },
  {
    id: 206,
    type: "text",
    author: "June Allen",
    avatar: customerPhoto,
    time: "4mo",
    body: "Took the GMAT today. Walked out feeling like I bombed it. Score came back 30 minutes later — 740. I genuinely don't know how. Lesson: your gut after the test means almost nothing.",
    likes: 342,
    comments: 51,
    reposts: 7,
    shares: 3,
  },
  {
    id: 207,
    type: "text",
    author: "June Allen",
    avatar: customerPhoto,
    time: "6mo",
    body: "Started working with an MBA admissions coach this week. Honestly didn't think I needed one — I'm a strong writer, I have a clear story, how hard could this be? First session: she tore my draft personal narrative apart in the kindest possible way and I realized I had no idea what I was doing. Money well spent already.",
    likes: 278,
    comments: 41,
    reposts: 9,
    shares: 5,
  },
  {
    id: 208,
    type: "text",
    author: "June Allen",
    avatar: customerPhoto,
    time: "9mo",
    body: "Decided I'm going to apply to business school this year. Have been thinking about it for three years and finally pulled the trigger. Target schools: Stanford, HBS, Wharton, Booth, Kellogg. If you've been through this and have advice, I'm all ears.",
    likes: 195,
    comments: 73,
    reposts: 4,
    shares: 2,
  },
];

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

export default function ProfileV2() {
  useEffect(() => { document.title = "Leland Prototype | Profile"; }, []);
  const [isFollowing, setIsFollowing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [stickyNavVisible, setStickyNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("offerings");
  const [adminOpen, setAdminOpen] = useState(false);
  const [showCustomerFavorite, setShowCustomerFavorite] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCoachNote, setShowCoachNote] = useState(false);
  const [coachNoteExpanded, setCoachNoteExpanded] = useState(false);
  const [showCoachVideo, setShowCoachVideo] = useState(true);
  const [showSupercoach, setShowSupercoach] = useState(false);
  const [showCoverImage, setShowCoverImage] = useState(false);
  const [showGrayHeader, setShowGrayHeader] = useState(true);
  const [searchParams] = useSearchParams();
  const [isCustomerProfile, setIsCustomerProfile] = useState(searchParams.get("type") !== "coach");
  const [customerTab, setCustomerTab] = useState<"activity" | "about" | "calendar" | "likes">("activity");
  const [purchasesFilter, setPurchasesFilter] = useState<"All" | "Coaching" | "Courses" | "Content">("All");
  const [purchasesExpanded, setPurchasesExpanded] = useState(false);
  const [pastOpen, setPastOpen] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("All");
  const [offeringsType, setOfferingsType] = useState("All");
  const [viewingOwnProfile, setViewingOwnProfile] = useState(isCustomerProfile);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [eventsCategoryOpen, setEventsCategoryOpen] = useState(false);

  const profilePhoto = isCustomerProfile ? customerPhoto : pic6;
  const profileName = isCustomerProfile ? "June Allen" : "Samantha Parker";

  const categoryRef = useRef<HTMLDivElement>(null);
  const eventsCategoryRef = useRef<HTMLDivElement>(null);
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

  // Observer B: Track active section group via scroll position
  useEffect(() => {
    const handleScroll = () => {
      const offset = 80;
      let active: string | null = null;
      for (const section of PROFILE_SECTIONS) {
        const el = groupRefs.current[section.id];
        if (el && el.getBoundingClientRect().top <= offset) {
          active = section.id;
        }
      }
      if (active) setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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

  useEffect(() => {
    if (!categoryDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [categoryDropdownOpen]);

  useEffect(() => {
    if (!eventsCategoryOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (eventsCategoryRef.current && !eventsCategoryRef.current.contains(e.target as Node)) {
        setEventsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [eventsCategoryOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "c") setIsCustomerProfile(p => !p);
      if (e.key === "v") setShowCoachVideo(p => !p);
      if (e.key === "o") setViewingOwnProfile(p => !p);
      if (e.key === "i") setShowCoverImage(p => !p);
      if (e.key === "n") setShowCoachNote(p => !p);
      if (e.key === "f") setShowCustomerFavorite(p => !p);
      if (e.key === "s") setShowSupercoach(p => !p);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Sticky secondary nav — portaled to body to escape framer-motion layoutId containing blocks */}
      {createPortal(
        <AnimatePresence>
          {stickyNavVisible && !isCustomerProfile && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 right-0 z-30 border-b border-gray-stroke bg-white"
            >
              <div className="mx-auto flex max-w-[1280px] items-stretch gap-4 px-6 py-2 transition-all duration-300 md:py-0">
                {/* Left: photo + name + rate — click to scroll to top */}
                <div
                  className="flex shrink-0 cursor-pointer items-center gap-2.5"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <img
                    src={profilePhoto}
                    alt={profileName}
                    className="h-10 w-10 rounded-[4px] object-cover"
                  />
                  <div className="flex flex-col text-[16px] leading-tight md:text-[16px]">
                    <span className="text-[18px] font-medium text-gray-dark md:text-[16px]">{profileName}</span>
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
                  <div className="flex items-center pl-4 md:hidden">
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
      {!showCoverImage && showGrayHeader && (
        <div className="w-full bg-[#f5f5f5]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="h-[44px]" />
          </div>
          <div className="h-[78px]" />
        </div>
      )}

      {/* Main content area */}
      <PageShell rightSidebar={showSidebar ? (
          isCustomerProfile ? (
            <div className="flex flex-col gap-6 px-1">
              <SidebarGroup label="For you" hideChevron>
                <SidebarCard
                  variant="category"
                  image={categoryMBA}
                  title="MBA Admissions"
                  subtitle={<CategorySubtitle photos={[pic1, pic5, pic8]} experts="312 experts" />}
                />
                <SidebarCard
                  variant="category"
                  image={categoryConsulting}
                  title="Management Consulting"
                  subtitle={<CategorySubtitle photos={[pic3, pic7, pic10]} experts="278 experts" />}
                />
                <SidebarCard
                  variant="category"
                  image={categoryPM}
                  title="Product Management"
                  subtitle={<CategorySubtitle photos={[pic6, pic9, pic11]} experts="195 experts" />}
                />
              </SidebarGroup>

              <SidebarGroup label="Happening now">
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
                <SidebarCard
                  variant="event"
                  image={eventImg3}
                  title="Interview Prep Session"
                  subtitle="Tomorrow, 2:00 PM · 54 registered"
                />
              </SidebarGroup>

              <SidebarGroup label="Find an expert">
                <SidebarCard
                  variant="coach"
                  image={pic1}
                  title="Jasmine Singer"
                  subtitle="Experienced Product Leader at LinkedIn | Ex-..."
                />
                <SidebarCard
                  variant="coach"
                  image={pic3}
                  title="Jackson Ringger"
                  subtitle="Ex-McKinsey Engagement Manager | Wharton MBA..."
                />
                <SidebarCard
                  variant="coach"
                  image={pic5}
                  title="Erika Mah"
                  subtitle="Senior PM at Google | Stanford GSB | Ex-Stripe..."
                />
              </SidebarGroup>
            </div>
          ) : (
            <div className="flex flex-col gap-6 transition-[padding] duration-300" style={{ paddingTop: stickyNavVisible ? 56 : 0 }}>
              {/* Video + Availability + CTA buttons */}
              <div className="flex flex-col" style={{ gap: 14 }}>
                {/* Coach video — desktop sidebar */}
                {showCoachVideo && (
                  <div className="group relative cursor-pointer overflow-hidden rounded-lg">
                    <img
                      src={videoThumbnail}
                      alt="Coach video"
                      className="block w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 transition-colors group-hover:bg-black/10" />
                    <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-2 pb-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/40 backdrop-blur-[6px]">
                        <svg width="11" height="13" viewBox="0 0 18 20" fill="none">
                          <path d="M17 10L1 19V1L17 10Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[16px] font-medium leading-tight text-white">Get to know me</p>
                        <p className="text-[14px] leading-tight text-white/70">1:40</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg border border-[#E5E5E5] bg-white px-5 py-4" style={{ boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[16px] leading-none font-medium text-gray-dark">Available today at 5:30pm</span>
                    <span className="text-[16px] leading-none text-[#707070]">Usually responds within 12 hours</span>
                  </div>
                  <span className="h-[12px] w-[12px] shrink-0 rounded-full bg-[#038561] animate-[pulse-ring_2.4s_ease-out_infinite]" />
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full cursor-pointer rounded-lg bg-[#038561] px-4 py-3 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                    Schedule a free intro call
                  </button>
                  <button className="w-full cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                    Book a session
                  </button>
                </div>
              </div>

              {/* Coach note + Questions + Guarantee */}
              <div className="flex flex-col">
                {/* Coach note */}
                {showCoachNote && (
                  <div
                    className="flex cursor-pointer gap-3 border-t border-b border-[#E5E5E5] py-6"
                    onClick={() => setCoachNoteExpanded(p => !p)}
                  >
                    <img
                      src={profilePhoto}
                      alt={profileName}
                      className="h-9 w-9 shrink-0 rounded-[4px] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-[16px] font-medium text-gray-dark">Note from {profileName.split(" ")[0]}</p>
                      <div className="relative mt-0.5">
                        <motion.div
                          initial={false}
                          animate={{ height: coachNoteExpanded ? "auto" : 66 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-[16px] leading-snug text-[#707070]">
                            If you're looking for AI coaching, from fundamentals to building out more advanced agents and workflows, I'm taking on a few new folks for 1:1 productivity coaching for both your professional and personal life. Keeping up with the pace of development alone requires dedication. But we can bring your information together and rewire how you work. If you're looking for MBA application support, essay-writing, or other coaching, message me directly through Leland and I'll get right back to you.
                          </p>
                        </motion.div>
                        {!coachNoteExpanded && (
                          <span className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-transparent pl-10 text-[16px] leading-snug font-medium text-[#038561]">
                            Read more
                          </span>
                        )}
                        {coachNoteExpanded && (
                          <span className="mt-1 inline-block text-[16px] font-medium text-[#038561]">
                            Read less
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message section */}
                <div className={`flex gap-3 border-b border-[#E5E5E5] py-6 ${!showCoachNote ? "border-t" : ""}`}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#f5f5f5]">
                    <img src={airplaneIcon} alt="" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[16px] font-medium text-gray-dark">Questions?</p>
                    <p className="mt-0.5 text-[16px] leading-snug text-[#707070]">
                      You can start chatting with {profileName.split(" ")[0]} before you get started. <span className="cursor-pointer font-medium text-[#038561]">Send a message</span>
                    </p>
                  </div>
                </div>

                {/* Guarantee — always at bottom */}
                <div className="flex items-center justify-center gap-2 py-3 text-[14px] text-[#9b9b9b]">
                  <img src={shieldIcon} alt="" className="w-[12px]" />
                  <span>Protected by the <span className="cursor-pointer underline decoration-[0.5px] underline-offset-2 transition-colors hover:text-[#707070]">Leland Experience Guarantee</span></span>
                </div>
              </div>

            </div>
          )
        ) : undefined} rightSidebarWidth={isCustomerProfile ? 300 : 340}>
        <div>
          {/* Cover image */}
          {showCoverImage && (
            <img
              src={isCustomerProfile ? customerCoverImage : coachCoverImage}
              alt="Cover"
              className="h-[220px] w-full rounded-[6px] object-cover"
            />
          )}

          {/* Profile photo + CTA buttons */}
          <div className={`${showCoverImage ? "-mt-[80px] pl-4" : showGrayHeader ? "-mt-[100px]" : "mt-0"} mb-4 flex flex-col items-start md:flex-row ${showCoverImage || showGrayHeader ? "md:items-end" : "md:items-start"} md:justify-between`}>
            <div className="group relative z-20 cursor-pointer rounded-lg border-[4px] border-white bg-white" onClick={() => setLightboxOpen(true)}>
              <div className="relative overflow-hidden rounded-[4px]">
                <motion.img
                  layoutId="profile-photo"
                  src={profilePhoto}
                  alt={profileName}
                  className="block h-[132px] w-[132px] object-cover"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>
            </div>
            <div className={`hidden items-center gap-2 ${showCoverImage ? "pb-1" : showGrayHeader ? "pb-[90px]" : "pb-1"} md:flex`}>
              {viewingOwnProfile ? (
                <button className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-[16px] font-medium transition-colors ${
                  showCoverImage || !showGrayHeader
                    ? "bg-[#222222]/5 text-gray-dark hover:bg-[#222222]/[0.08]"
                    : "border border-[#222222]/10 bg-white text-gray-dark hover:border-[#222222]/20"
                }`}>
                  <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
                  Edit profile
                </button>
              ) : (
                <>
                  <button className={`flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg transition-colors ${
                    showCoverImage || !showGrayHeader
                      ? "bg-[#222222]/5 hover:bg-[#222222]/[0.08]"
                      : "border border-[#222222]/10 bg-white hover:border-[#222222]/20"
                  }`}>
                    <img src={shareArrowIcon} alt="Share" className="h-[20px] w-[20px]" />
                  </button>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2.5 text-[16px] font-medium transition-colors ${
                      isCustomerProfile
                        ? "bg-[#038561] text-white hover:bg-[#038561]/90"
                        : showCoverImage || !showGrayHeader
                          ? "bg-[#222222]/5 text-gray-dark hover:bg-[#222222]/[0.08]"
                          : "border border-[#222222]/10 bg-white text-gray-dark hover:border-[#222222]/20"
                    }`}
                  >
                    {isFollowing && <img src={checkIcon} alt="" className={`h-[18px] w-[18px] ${isCustomerProfile ? "brightness-0 invert" : ""}`} />}
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name → stats wrapper (padded when cover image is on) */}
          <div className={showCoverImage ? "pl-4" : ""}>

          {/* Name + Supercoach badge */}
          <div className={`flex items-center ${isCustomerProfile ? "gap-2" : "gap-1 mb-1"}`}>
            <h1 className={`font-medium text-gray-dark ${isCustomerProfile ? "text-[24px]" : "text-[18px]"}`}>{profileName}</h1>
            {!isCustomerProfile && (
              <img src={verifiedIcon} alt="Verified" className="mt-[2px] h-[16px] w-[16px]" />
            )}
            {showSupercoach && !isCustomerProfile && (
              <>
                <span className="ml-1 text-[18px] text-[#999999]">·</span>
                <span className="text-[18px] text-[#707070]"><span className="text-[16px]">🏆</span> Supercoach</span>
              </>
            )}
          </div>

          {/* Headline */}
          <p className={`mb-[6px] leading-[1.3] ${isCustomerProfile ? "text-[18px] font-normal text-[#707070]" : "text-[24px] font-medium text-[#333333]"}`}>
            {isCustomerProfile
              ? "Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB"
              : sectionFilter === "College"
                ? <>College Admissions Expert <span className="font-normal text-[#9B9B9B]">|</span> Yale Grad <span className="font-normal text-[#9B9B9B]">|</span> 50+ Ivy League Admits</>
                : sectionFilter === "MBA"
                  ? <>MBA Coach <span className="font-normal text-[#9B9B9B]">|</span> Stanford GSB <span className="font-normal text-[#9B9B9B]">|</span> 100+ M7 Admits</>
                  : <>Experienced Product Leader at LinkedIn <span className="font-normal text-[#9B9B9B]">|</span> Ex-Meta <span className="font-normal text-[#9B9B9B]">|</span> Stanford GSB</>
            }
          </p>

          {/* Credentials row */}
          {!isCustomerProfile && <div className="mb-1 flex flex-wrap items-center gap-x-[20px] gap-y-[2px] text-[16px] text-[#707070] md:mb-4">
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
            {!isCustomerProfile && <div className="flex items-center gap-[6px]">
              <span>Successful clients at</span>
              <div className="flex items-center -space-x-[2px]">
                <img src={clientLogo1} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo2} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo3} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo4} alt="" className="h-[18px] w-[18px] rounded border border-white" />
              </div>
            </div>}
          </div>}


          {/* Stats row — mobile: v1-style flat inline for both profiles */}
          <div className="mt-3 flex flex-wrap items-center gap-4 md:hidden">
            {!isCustomerProfile && (
              <div
                className="flex cursor-pointer items-baseline gap-1 transition-opacity hover:opacity-70"
                onClick={() => scrollToSection("reviews")}
              >
                <img src={starIcon} alt="" className="mb-[2px] h-[15px] w-[15px]" />
                <span className="text-[18px] font-medium text-gray-dark">5.0</span>
                <span className="text-[16px] text-gray-600">52 reviews</span>
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-medium text-gray-dark">{isCustomerProfile ? "245" : "182"}</span>
              <span className="text-[16px] text-[#707070]">followers</span>
            </div>
            <div
              className={`flex items-baseline gap-1 ${!isCustomerProfile ? "cursor-pointer transition-opacity hover:opacity-70" : ""}`}
              onClick={!isCustomerProfile ? () => scrollToSection("activity") : undefined}
            >
              <span className="text-[18px] font-medium text-gray-dark">8.2K</span>
              <span className="text-[16px] text-[#707070]">impressions</span>
            </div>
          </div>

          {/* Customer Favorite — mobile coach profile */}
          {showCustomerFavorite && !isCustomerProfile && (
            <div className="mt-3 flex items-center gap-4 rounded-lg border border-gray-200 px-4 py-3 md:hidden">
              <div className="flex shrink-0 items-center gap-[2px]">
                <img src={wreathImg} alt="" className="h-[45px] w-[21px]" />
                <span className="text-center text-[18px] font-medium leading-[110%] text-gray-dark">Customer<br/>Favorite</span>
                <img src={wreathImg} alt="" className="h-[45px] w-[21px] scale-x-[-1]" />
              </div>
              <div className="h-[36px] w-px shrink-0 bg-gray-200" />
              <span className="text-[16px] leading-snug text-[#707070]">In the top 10% of experts on Leland, according to customers.</span>
            </div>
          )}

          {/* Desktop stats row — customer profile */}
          {isCustomerProfile && (
            <div className="mt-4 mb-2 hidden items-center gap-6 md:flex">
              <div className="flex flex-col gap-[2px]">
                <span className="text-[20px] font-medium leading-none text-gray-dark">245</span>
                <span className="text-[16px] leading-tight text-[#707070]">Followers</span>
              </div>
              <div className="h-[24px] w-px shrink-0 bg-gray-200" />
              <div className="flex flex-col gap-[2px]">
                <span className="text-[20px] font-medium leading-none text-gray-dark">1.6k</span>
                <span className="text-[16px] leading-tight text-[#707070]">Likes</span>
              </div>
              <div className="h-[24px] w-px shrink-0 bg-gray-200" />
              <div className="flex flex-col gap-[2px]">
                <span className="text-[20px] font-medium leading-none text-gray-dark">8.2k</span>
                <span className="text-[16px] leading-tight text-[#707070]">Impressions</span>
              </div>
            </div>
          )}

          {/* Desktop stats row — coach profile */}
          {!isCustomerProfile && (
            <div className="mb-2 hidden items-center gap-6 md:flex">
              {/* Customer Favorite */}
              {showCustomerFavorite && (
                <>
                  <div className="flex items-center gap-[2px]">
                    <img src={wreathImg} alt="" className="h-[45px] w-[21px]" />
                    <span className="text-center text-[18px] font-medium leading-[110%] text-gray-dark">Customer<br/>Favorite</span>
                    <img src={wreathImg} alt="" className="h-[45px] w-[21px] scale-x-[-1]" />
                  </div>
                  <div className="h-[24px] w-px shrink-0 bg-gray-200" />
                </>
              )}
              {/* Reviews */}
              <div
                className="flex cursor-pointer flex-col gap-[2px] transition-opacity hover:opacity-70"
                onClick={() => scrollToSection("reviews")}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[20px] font-medium leading-none text-gray-dark">4.9</span>
                  <img src={starIcon} alt="" className="h-[16px] w-[16px]" />
                </div>
                <span className="text-[16px] leading-tight text-[#707070]">52 Reviews</span>
              </div>
              <div className="h-[24px] w-px shrink-0 bg-gray-200" />
              {/* Minutes coached */}
              <div className="flex flex-col gap-[2px]">
                <span className="text-[20px] font-medium leading-none text-gray-dark">6.6k</span>
                <span className="text-[16px] leading-tight text-[#707070]">Min coached</span>
              </div>
              <div className="h-[24px] w-px shrink-0 bg-gray-200" />
              {/* Followers */}
              <div className="flex flex-col gap-[2px]">
                <span className="text-[20px] font-medium leading-none text-gray-dark">84</span>
                <span className="text-[16px] leading-tight text-[#707070]">Followers</span>
              </div>
              <div className="h-[24px] w-px shrink-0 bg-gray-200" />
              {/* Likes */}
              <div className="flex flex-col gap-[2px]">
                <span className="text-[20px] font-medium leading-none text-gray-dark">1.6k</span>
                <span className="text-[16px] leading-tight text-[#707070]">Likes</span>
              </div>
              <div className="h-[24px] w-px shrink-0 bg-gray-200" />
              {/* Impressions */}
              <div
                className="flex cursor-pointer flex-col gap-[2px] transition-opacity hover:opacity-70"
                onClick={() => scrollToSection("activity")}
              >
                <span className="text-[20px] font-medium leading-none text-gray-dark">8.5k</span>
                <span className="text-[16px] leading-tight text-[#707070]">Impressions</span>
              </div>
            </div>
          )}

          </div>{/* end name → stats wrapper */}

          {/* Mobile inline CTA + secondary buttons */}
          <div className="mt-3 flex flex-col gap-3 md:hidden">
            {viewingOwnProfile ? (
              <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#222222]/5 px-4 py-3 text-[18px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
                Edit profile
              </button>
            ) : (
              <>
                {!isCustomerProfile && (
                  <button className="w-full cursor-pointer rounded-full bg-[#038561] px-4 py-3 text-[18px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                    Free intro call
                  </button>
                )}
                <div className="flex gap-2">
                  {isCustomerProfile ? (
                    <>
                      <button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#038561] px-6 py-3 text-[18px] font-medium text-white transition-colors hover:bg-[#038561]/90"
                      >
                        {isFollowing && <img src={checkIcon} alt="" className="h-[18px] w-[18px] brightness-0 invert" />}
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                      <button className="flex cursor-pointer items-center justify-center rounded-full bg-[#222222]/5 px-4 py-3 transition-colors hover:bg-[#222222]/[0.08]">
                        <img src={shareArrowIcon} alt="Share" className="h-[20px] w-[20px]" />
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </>
            )}
          </div>


          {/* Coach video — mobile */}
          {showCoachVideo && !isCustomerProfile && (
            <div className="group relative mt-4 cursor-pointer overflow-hidden rounded-lg lg:hidden">
              <img
                src={videoThumbnail}
                alt="Coach video"
                className="block w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 transition-colors group-hover:bg-black/10" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-2 pb-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/40 backdrop-blur-[6px]">
                  <svg width="14" height="16" viewBox="0 0 18 20" fill="none">
                    <path d="M17 10L1 19V1L17 10Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[16px] font-medium text-white">Get to know me</p>
                  <p className="text-[14px] text-white/70">1:40</p>
                </div>
              </div>
            </div>
          )}

          {/* Coach video — desktop horizontal banner (no sidebar) */}
          {showCoachVideo && !isCustomerProfile && !showSidebar && (
            <div className="group mt-4 hidden cursor-pointer items-center gap-4 overflow-hidden rounded-lg bg-[#f5f5f5] p-3 transition-colors hover:bg-[#ebebeb] lg:flex">
              <div className="relative h-[56px] w-[90px] shrink-0 overflow-hidden rounded-md">
                <img
                  src={videoThumbnail}
                  alt="Coach video"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 transition-colors group-hover:bg-black/10" />
                <div className="absolute bottom-1.5 left-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/40 backdrop-blur-[6px]">
                    <svg width="9" height="11" viewBox="0 0 18 20" fill="none">
                      <path d="M17 10L1 19V1L17 10Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[16px] font-medium text-gray-dark">Get to know {profileName.split(" ")[0]}</p>
                <p className="text-[16px] text-[#707070]">1:40</p>
              </div>
            </div>
          )}


          {/* Hero sentinel for sticky nav detection */}
          <div ref={heroSentinelRef} />

          {!isCustomerProfile && (<>
          {/* ── Offerings group: Offerings + Free Events + Resources ── */}
          <div ref={setGroupRef("offerings")} data-group="offerings">
            <div className="my-[36px] border-t border-gray-200" />

            <h2
              ref={setSectionRef("offerings")}
              className="scroll-mt-[60px] mb-4 text-[24px] font-medium text-gray-dark"
            >
              Offerings
            </h2>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-[6px]">
                {["All", "Packages", "Memberships", "Content"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOfferingsType(tab)}
                    className={`cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] ${
                      offeringsType === tab ? "border-[1.5px] border-[#222222]" : "border-[1.5px] border-transparent transition-colors hover:bg-[#ebebeb]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div ref={categoryRef} className="relative">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] transition-colors hover:bg-[#ebebeb]"
                >
                  {sectionFilter === "All" ? "All categories" : sectionFilter}
                  <img src={chevronDownIcon} alt="" className={`h-[14px] w-[14px] transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {categoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
                    >
                      {[{ value: "All", label: "All categories" }, { value: "College", label: "College" }, { value: "MBA", label: "MBA" }, { value: "Product Management", label: "Product Management" }].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => { setSectionFilter(value); setCategoryDropdownOpen(false); }}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover ${sectionFilter === value ? "bg-gray-hover" : ""}`}
                        >
                          {label}
                          {sectionFilter === value && <img src={checkIcon} alt="" className="h-[16px] w-[16px]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Offering cards */}
            {(() => {
              const filteredOfferings = coachOfferings.filter((o) => {
                if (offeringsType === "All") return true;
                if (offeringsType === "Packages") return o.type === "hourly-package" || o.type === "package";
                if (offeringsType === "Memberships") return o.type === "course";
                return o.type === "content";
              });
              return filteredOfferings.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {filteredOfferings.slice(0, 5).map((o) => (
                    <OfferingCard key={o.title} type={o.type} title={o.title} subtitle={o.subtitle} image={o.image} ctaLabel={o.ctaLabel} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D0D0D0] py-10 text-center">
                  <p className="text-[16px] text-[#9B9B9B]">No memberships available yet</p>
                </div>
              );
            })()}

            {/* View more + guarantee */}
            <div className="mt-4 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
              <button className="cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                See all offerings
              </button>
              <div className="flex items-center gap-2 text-[15px] text-[#9b9b9b]">
                <img src={shieldIcon} alt="" className="w-[12px]" />
                <span>Protected by the <span className="cursor-pointer underline decoration-[0.5px] underline-offset-2 transition-colors hover:text-[#707070]">Leland Experience Guarantee</span></span>
              </div>
            </div>

            {/* Events */}
            <div className="my-[36px] border-t border-gray-200" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[24px] font-medium text-gray-dark">Events</h2>
              <div ref={eventsCategoryRef} className="relative">
                <button
                  onClick={() => setEventsCategoryOpen(!eventsCategoryOpen)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] transition-colors hover:bg-[#ebebeb]"
                >
                  {sectionFilter === "All" ? "All categories" : sectionFilter}
                  <img src={chevronDownIcon} alt="" className={`h-[14px] w-[14px] transition-transform ${eventsCategoryOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {eventsCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
                    >
                      {[{ value: "All", label: "All categories" }, { value: "College", label: "College" }, { value: "MBA", label: "MBA" }, { value: "Product Management", label: "Product Management" }].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => { setSectionFilter(value); setEventsCategoryOpen(false); }}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover ${sectionFilter === value ? "bg-gray-hover" : ""}`}
                        >
                          {label}
                          {sectionFilter === value && <img src={checkIcon} alt="" className="h-[16px] w-[16px]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>
            <button className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See 2 more
              <img src={chevronDownIcon} alt="" className="h-[16px] w-[16px]" />
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
            <div className="-mx-4 scrollbar-hide flex gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
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
              <div className="-mx-4 scrollbar-hide col-span-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:contents md:px-0">
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
          </>)}

          {/* Customer profile tabs */}
          {isCustomerProfile && (
            <>
              {viewingOwnProfile ? (
                <div className="sticky top-0 z-10 mt-5 flex gap-5 border-b border-gray-stroke bg-white">
                  {(["activity", "about", "calendar", "likes"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCustomerTab(tab)}
                      className={`relative cursor-pointer px-3 py-3 transition-colors ${
                        customerTab === tab
                          ? "text-gray-dark"
                          : "text-gray-light hover:text-gray-dark"
                      }`}
                    >
                      <span className="text-[18px] font-medium">{tab === "activity" ? "Overview" : tab === "about" ? "Activity" : tab === "calendar" ? "Calendar" : "Likes"}</span>
                      {customerTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#038561]" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-7 border-b border-gray-stroke" />
              )}

              <div className="mt-6">
                {customerTab === "activity" && viewingOwnProfile && (
                  <>
                    {/* Upcoming sessions */}
                    <section>
                      <h2 className="text-[24px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>
                        Upcoming sessions
                      </h2>
                      <div className="mt-3">
                        <div className="flex flex-col gap-1">
                          {upcomingEvents.slice(0, 3).map((event, i) => (
                            <SessionCard key={i} {...event} />
                          ))}
                        </div>

                        <button
                          onClick={() => setCustomerTab("calendar")}
                          className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
                        >
                          See full calendar
                        </button>
                      </div>
                    </section>

                    {/* My Purchases */}
                    <section className="mt-12">
                      <h2 className="text-[24px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>
                        My purchases
                      </h2>
                      <div className="mt-4 flex flex-wrap gap-[6px]">
                        {(["All", "Coaching", "Courses", "Content"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => { setPurchasesFilter(tab); setPurchasesExpanded(false); }}
                            className={`cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] ${
                              purchasesFilter === tab ? "border-[1.5px] border-[#222222]" : "border-[1.5px] border-transparent transition-colors hover:bg-[#ebebeb]"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      {(() => {
                        const filtered = purchasedOfferings.filter((offering) => {
                          if (purchasesFilter === "All") return true;
                          if (purchasesFilter === "Coaching") return offering.type === "hourly" || offering.type === "hourly-package" || offering.type === "package";
                          if (purchasesFilter === "Courses") return offering.type === "course";
                          return offering.type === "content";
                        });
                        const canTruncate = purchasesFilter === "All" && filtered.length > 4;
                        const alwaysVisible = canTruncate ? filtered.slice(0, 4) : filtered;
                        const overflow = canTruncate ? filtered.slice(4) : [];
                        return (
                          <>
                            <div className="mt-4 flex flex-col gap-1">
                              {alwaysVisible.map((offering) => (
                                <OfferingCard
                                  key={offering.title}
                                  type={offering.type}
                                  title={offering.title}
                                  subtitle={offering.subtitle}
                                  image={offering.image}
                                  purchased
                                  exhausted={!!offering.exhausted}
                                />
                              ))}
                              <AnimatePresence initial={false}>
                                {purchasesExpanded && overflow.map((offering, i) => (
                                  <motion.div
                                    key={offering.title}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.03 }}
                                    className="overflow-hidden"
                                  >
                                    <OfferingCard
                                      type={offering.type}
                                      title={offering.title}
                                      subtitle={offering.subtitle}
                                      image={offering.image}
                                      purchased
                                      exhausted={!!offering.exhausted}
                                    />
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                            {canTruncate && (
                              <button
                                onClick={() => setPurchasesExpanded(!purchasesExpanded)}
                                className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
                              >
                                {purchasesExpanded ? "See less" : "See all"}
                                <img src={chevronDownIcon} alt="" className={`h-[16px] w-[16px] transition-transform ${purchasesExpanded ? "rotate-180" : ""}`} />
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </section>

                    {/* My Goals */}
                    <section className="mt-12">
                      <h2 className="text-[24px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>
                        My Goals
                      </h2>
                      <p className="text-[18px] text-[#707070]">Track your progress toward what matters most.</p>
                      <div className="scrollbar-hide -mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
                        {[0, 1].map((i) => (
                          <div key={i} className="h-[100px] w-[200px] shrink-0 snap-start rounded-xl bg-[#F5F5F5]" style={dashedBorderStyle} />
                        ))}
                        <button className="flex h-[100px] w-[200px] shrink-0 cursor-pointer snap-start items-center justify-center rounded-xl border-none bg-[#F5F5F5] transition-colors hover:bg-[#EEEEEE]" style={dashedBorderStyle}>
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M16 8v16M8 16h16" stroke="#9B9B9B" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    </section>
                  </>
                )}

                {(viewingOwnProfile ? customerTab === "about" : true) && (
                  <div className="divide-y divide-gray-stroke/50">
                    {customerPosts.map((post) => (
                      <FeedPost key={post.id} post={post} />
                    ))}
                  </div>
                )}

                {viewingOwnProfile && customerTab === "calendar" && (
                  <section>
                    <h2 className="mb-3 text-[24px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>
                      Upcoming sessions
                    </h2>
                    <div>
                      <div className="flex flex-col gap-1">
                        {upcomingEvents.map((event, i) => (
                          <SessionCard key={i} {...event} />
                        ))}
                      </div>

                      <button
                        onClick={() => setPastOpen(!pastOpen)}
                        className="my-4 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
                      >
                        {pastOpen ? "Hide past sessions" : "View past sessions"}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${pastOpen ? "rotate-180" : ""}`}>
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      <AnimatePresence initial={false}>
                        {pastOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 flex flex-col gap-1">
                              {pastEvents.map((event, i) => (
                                <SessionCard key={i} {...event} status="past" />
                              ))}
                            </div>
                            <button
                              className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
                            >
                              Load more
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </section>
                )}

                {viewingOwnProfile && customerTab === "likes" && (
                  <>
                  <div className="flex flex-col gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full border border-dashed border-[#C5C5C5] bg-[#f5f5f5]" />
                        <div className="h-[120px] min-w-0 flex-1 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                      </div>
                    ))}
                  </div>
                  </>
                )}
              </div>
            </>
          )}
          <div className="h-[120px]" />
        </div>
      </PageShell>

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
              src={profilePhoto}
              alt={profileName}
              className="max-h-[80vh] max-w-[80vw] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin controls */}
      <div ref={adminRef} className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <div className="mb-1.5 px-2 pt-1 text-[14px] font-medium uppercase tracking-wider text-[#9b9b9b]">
                Profile type
              </div>
              <div className="mx-2 mb-2 flex rounded-lg bg-[#f5f5f5] p-[3px]">
                <button
                  onClick={() => {
                    setIsCustomerProfile(false);
                    setShowCoachVideo(true);
                  }}
                  className={`flex-1 cursor-pointer rounded-md py-1.5 text-[14px] font-medium transition-colors ${!isCustomerProfile ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"}`}
                >
                  Coach
                </button>
                <button
                  onClick={() => {
                    setIsCustomerProfile(true);
                    setShowCustomerFavorite(false);
                    setShowCoachNote(false);
                    setShowCoachVideo(false);
                  }}
                  className={`flex-1 cursor-pointer rounded-md py-1.5 text-[14px] font-medium transition-colors ${isCustomerProfile ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"}`}
                >
                  Customer
                </button>
              </div>
              <label className={`flex items-center justify-between rounded-lg px-2 py-2 transition-colors ${isCustomerProfile ? "opacity-40" : "cursor-pointer hover:bg-[#f5f5f5]"}`}>
                <span className="text-[16px] font-medium text-gray-dark">Customer favorite</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showCustomerFavorite}
                    onChange={() => !isCustomerProfile && setShowCustomerFavorite(!showCustomerFavorite)}
                    disabled={isCustomerProfile}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className={`flex items-center justify-between rounded-lg px-2 py-2 transition-colors ${isCustomerProfile ? "opacity-40" : "cursor-pointer hover:bg-[#f5f5f5]"}`}>
                <span className="text-[16px] font-medium text-gray-dark">Coach video</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showCoachVideo}
                    onChange={() => !isCustomerProfile && setShowCoachVideo(!showCoachVideo)}
                    disabled={isCustomerProfile}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className={`flex items-center justify-between rounded-lg px-2 py-2 transition-colors ${showCoverImage ? "opacity-40" : "cursor-pointer hover:bg-[#f5f5f5]"}`}>
                <span className="text-[16px] font-medium text-gray-dark">Gray header</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showGrayHeader}
                    onChange={() => !showCoverImage && setShowGrayHeader(!showGrayHeader)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[16px] font-medium text-gray-dark">Cover image</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showCoverImage}
                    onChange={() => setShowCoverImage(!showCoverImage)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className={`flex items-center justify-between rounded-lg px-2 py-2 transition-colors ${isCustomerProfile ? "opacity-40" : "cursor-pointer hover:bg-[#f5f5f5]"}`}>
                <span className="text-[16px] font-medium text-gray-dark">Coach note</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showCoachNote}
                    onChange={() => !isCustomerProfile && setShowCoachNote(!showCoachNote)}
                    disabled={isCustomerProfile}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className={`flex items-center justify-between rounded-lg px-2 py-2 transition-colors ${isCustomerProfile ? "opacity-40" : "cursor-pointer hover:bg-[#f5f5f5]"}`}>
                <span className="text-[16px] font-medium text-gray-dark">Supercoach</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showSupercoach}
                    onChange={() => !isCustomerProfile && setShowSupercoach(!showSupercoach)}
                    disabled={isCustomerProfile}
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
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[16px] font-medium text-gray-dark">Viewing own profile</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={viewingOwnProfile}
                    onChange={() => setViewingOwnProfile(!viewingOwnProfile)}
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
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white shadow-md border border-gray-200 md:bg-[#222222]/5 md:shadow-none md:border-0 transition-colors hover:bg-gray-50 md:hover:bg-[#222222]/[0.08]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#707070" />
            <circle cx="8" cy="8" r="1.5" fill="#707070" />
            <circle cx="13" cy="8" r="1.5" fill="#707070" />
          </svg>
        </button>
      </div>

    </>
  );
}
