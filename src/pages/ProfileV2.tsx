import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { Button, LinkButton } from "../components/Button";
import { Link, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import PageShell from "../components/PageShell";
import SessionCard from "../components/SessionCard";
import OfferingCard, { type OfferingType } from "../components/OfferingCard";
import AllOfferingsModal from "./AllOfferings";
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
import shareArrowFilledIcon from "../assets/icons/share-arrow-filled.svg";
import logoIcon from "../assets/logos/leland-logo-split/Icon.svg";
import logoWordmark from "../assets/logos/leland-logo-split/Wordmark.svg";
import dotsHorizontalIcon from "../assets/icons/dots-horizontal.svg";
import reportFlagIcon from "../assets/icons/report-flag.svg";
import lockIcon from "../assets/icons/lock.svg";
import eyeClosedIcon from "../assets/icons/eye-closed.svg";
import GroupCard from "../components/GroupCard";
import groupImg1 from "../assets/placeholder images/group images/18603db620e37b489d2d52da4c9c1f86.jpg";
import groupImg2 from "../assets/placeholder images/group images/419a6944d25e95be7012699559c7b0be.jpg";
import groupImg3 from "../assets/placeholder images/group images/6c168007b1aef00bedc192e802c413e5.jpg";
import checkIcon from "../assets/icons/check.svg";
import editIcon from "../assets/icons/edit.svg";
import verifiedIcon from "../assets/icons/verified.svg";
import shieldIcon from "../assets/icons/shield-light.svg";
import airplaneIcon from "../assets/icons/airplane.svg";
import calendarIcon from "../assets/icons/calendar.svg";
import calendarPageIcon from "../assets/icons/calendar-page.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import bookBookmarkIcon from "../assets/icons/book-bookmark.svg";
import piggyBankIcon from "../assets/icons/Piggy bank, Coin.1.svg";
import stopwatchIcon from "../assets/icons/stopwatch.svg";
import supportivenessIcon from "../assets/icons/supportiveness.svg";
import wreathImg from "../assets/img/Wreath.svg";
import wreathSmallImg from "../assets/img/wreath-small.svg";
import videoThumbnail from "../assets/img/Video-Thumbnail.png";
import starIcon from "../assets/icons/star.svg";
import categoryMBA from "../assets/placeholder images/category images/gmat-tutoring.png";
import categoryConsulting from "../assets/placeholder images/category images/management-consulting.png";
import categoryPM from "../assets/placeholder images/category images/product-management.png";
import categoryAI from "../assets/placeholder images/category images/AI-automation-and-agents.png";
import categoryFinance from "../assets/placeholder images/category images/investment-banking.png";

import coachCoverImage from "../assets/img/cover-2.avif";
import customerCoverImage from "../assets/img/cover-image-2.png";
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
import aiBuilderCourseImg from "../assets/placeholder images/ai-builder-course.avif";
import lelandPlusImg1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import lelandPlusImg2 from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";
import lelandPlusImg3 from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";
import stanford1 from "../assets/placeholder post assets/stanford-post/00c1e12547190979b4db2978dbe211e2.jpg";
import stanford2 from "../assets/placeholder post assets/stanford-post/39a9980b59e79fa3b58e8d7d5145b9a9.jpg";
import stanford3 from "../assets/placeholder post assets/stanford-post/989ac1d56cf981c783808b83154d8a25.jpg";
import stanford4 from "../assets/placeholder post assets/stanford-post/eb80edada3b3db7955379d433ca2861a.jpg";
import { FeedPost, type Post } from "./Home";
import { useBookmarks } from "../contexts/BookmarksContext";
import { useSetNavTheme, useSetNavRightSlot } from "../components/NavThemeContext";

const CATEGORY_ALIASES: Record<string, string> = {
  MBA: "MBA Admissions",
  College: "College Admissions",
};

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
    subtitle: <>Comprehensive package · <span className="text-gray-dark">Currently active</span></>,
    image: pic7,
  },
  {
    type: "course",
    title: "AI Builder Program Level 1: Use AI to 10x Your Impact",
    subtitle: <>Started May 12 <span className="text-[#9B9B9B]">· Next session tomorrow</span></>,
    image: aiBuilderCourseImg,
  },
  {
    type: "content",
    title: "How I Got Into Stanford GSB",
    subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>,
    image: lelandPlusImg1,
  },
];

export type CoachOffering = { type: OfferingType; title: string; subtitle: ReactNode; image: string; ctaLabel?: string; href?: string };

export type CoachConfig = {
  id: string;
  name: string;
  firstName: string;
  photo: string;
  qualificationsTitle: string;
  offerings: CoachOffering[];
};

export const COACH_CONFIGS: Record<string, CoachConfig> = {
  samantha: {
    id: "samantha",
    name: "Samantha Parker",
    firstName: "Samantha",
    photo: pic6,
    qualificationsTitle: "MBA Qualifications",
    offerings: [
      { type: "free-intro", title: "Free 15-minute intro call", subtitle: "Get to know Samantha and make a plan", image: "" },
      { type: "package", title: "Essay Review Package", subtitle: "3 essays · Starting at $400", image: eventImg1 },
      { type: "hourly-package", title: "10-Hour Coaching Package", subtitle: "10 hours · $1,200", image: eventImg1 },
      { type: "package", title: "MBA Application Package", subtitle: "Comprehensive Package · Starting at $750", image: eventImg2 },
      { type: "package", title: "Interview Prep Package", subtitle: "Comprehensive Package · Starting at $500", image: eventImg3 },
      { type: "package", title: "Resume & Cover Letter Package", subtitle: "2 documents · Starting at $300", image: eventImg1 },
      { type: "package", title: "School Selection Strategy", subtitle: "Comprehensive Package · Starting at $600", image: eventImg2 },
      { type: "hourly-package", title: "5-Hour Quick Start Package", subtitle: "5 hours · $650", image: eventImg3 },
      { type: "hourly", title: "Custom hourly coaching", subtitle: "$150 per hour", image: "" },
      { type: "agent", title: "Samantha's MBA Admissions Agent", subtitle: "AI guidance, curated by Samantha · Subscription", image: categoryMBA, href: "/agent/samantha-mba-admissions" },
      { type: "agent", title: "Samantha's GMAT Prep Agent", subtitle: "AI guidance, curated by Samantha · Subscription", image: categoryMBA, href: "/agent/samantha-gmat-prep" },
      { type: "agent", title: "Samantha's Consulting Recruiting Agent", subtitle: "AI guidance, curated by Samantha · Subscription", image: categoryConsulting, href: "/agent/samantha-consulting" },
      { type: "content", title: "How I Got Into Stanford GSB", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>, image: lelandPlusImg1 },
      { type: "content", title: "GMAT Study Plan: 3 Months to 750+", subtitle: <span className="flex items-center gap-1.5"><img src={pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Samantha Parker <span className="text-[#9B9B9B]">· 184 views</span></span>, image: lelandPlusImg2 },
      { type: "content", title: "My Consulting Recruiting Timeline", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 97 views</span></span>, image: lelandPlusImg3 },
      { type: "content", title: "Top 10 MBA Programs for Consulting", subtitle: <span className="flex items-center gap-1.5"><img src={pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Samantha Parker <span className="text-[#9B9B9B]">· 312 views</span></span>, image: lelandPlusImg1 },
      { type: "content", title: "Crafting Your MBA Resume", subtitle: <span className="flex items-center gap-1.5"><img src={pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Samantha Parker <span className="text-[#9B9B9B]">· 428 views</span></span>, image: lelandPlusImg2 },
      { type: "content", title: "How to Write a Standout HBS Essay", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 189 views</span></span>, image: lelandPlusImg3 },
      { type: "content", title: "Networking Tips for MBA Applicants", subtitle: <span className="flex items-center gap-1.5"><img src={pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Samantha Parker <span className="text-[#9B9B9B]">· 276 views</span></span>, image: lelandPlusImg1 },
      { type: "content", title: "GMAT vs. GRE: Which Should You Take?", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 145 views</span></span>, image: lelandPlusImg2 },
      { type: "content", title: "Understanding MBA Scholarships", subtitle: <span className="flex items-center gap-1.5"><img src={pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Samantha Parker <span className="text-[#9B9B9B]">· 203 views</span></span>, image: lelandPlusImg3 },
      { type: "content", title: "What MBA Admissions Committees Look For", subtitle: <span className="flex items-center gap-1.5"><img src={pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Samantha Parker <span className="text-[#9B9B9B]">· 367 views</span></span>, image: lelandPlusImg1 },
      { type: "content", title: "Day in the Life at Wharton", subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 521 views</span></span>, image: lelandPlusImg2 },
    ],
  },
  john: {
    id: "john",
    name: "John Koelliker",
    firstName: "John",
    photo: pic9,
    qualificationsTitle: "Coach Qualifications",
    offerings: [
      { type: "free-intro", title: "Free 15-minute intro call", subtitle: "Get to know John and make a plan", image: "" },
      { type: "package", title: "Deferred MBA Application Package", subtitle: "Comprehensive Package · Starting at $1,200", image: eventImg2 },
      { type: "package", title: "Standard MBA Application Package", subtitle: "Comprehensive Package · Starting at $1,500", image: eventImg3 },
      { type: "package", title: "Pitch Deck Review", subtitle: "Single 60-min session · $500", image: eventImg1 },
      { type: "hourly", title: "Custom hourly coaching", subtitle: "$300 per hour", image: "" },
      { type: "agent", title: "John's MBA Application Strategy Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryMBA, href: "/agent/john-mba-application-strategy" },
      { type: "agent", title: "John's MBA Essays Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryMBA, href: "/agent/john-mba-essays" },
      { type: "agent", title: "John's MBA Interviews Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryMBA, href: "/agent/john-mba-interviews" },
      { type: "agent", title: "John's MBA Recommenders Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryMBA, href: "/agent/john-mba-recommenders" },
      { type: "agent", title: "John's Deferred MBA Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryMBA, href: "/agent/john-deferred-mba" },
      { type: "agent", title: "John's Fundraising Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryFinance, href: "/agent/john-fundraising" },
      { type: "agent", title: "John's Pitch Decks Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryFinance, href: "/agent/john-pitch-decks" },
      { type: "agent", title: "John's Startup Strategy Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryAI, href: "/agent/john-startup" },
      { type: "agent", title: "John's Career Coaching Agent", subtitle: "AI guidance, curated by John · Subscription", image: categoryPM, href: "/agent/john-career" },
      { type: "content", title: "Components of an MBA Application Strategy", subtitle: <span className="flex items-center gap-1.5"><img src={pic9} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />John Koelliker <span className="text-[#9B9B9B]">· 560 views</span></span>, image: lelandPlusImg1 },
      { type: "content", title: "Why Apply to Deferred MBA Programs?", subtitle: <span className="flex items-center gap-1.5"><img src={pic9} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />John Koelliker <span className="text-[#9B9B9B]">· 237 views</span></span>, image: lelandPlusImg2 },
      { type: "content", title: "General Interview Tips", subtitle: <span className="flex items-center gap-1.5"><img src={pic9} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />John Koelliker <span className="text-[#9B9B9B]">· 354 views</span></span>, image: lelandPlusImg3 },
    ],
  },
};

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

export default function ProfileV2({ coach = false, coachId = "samantha", unified = false, name, photo, cover, customerFavorite, coachNote, coachVideo, supercoach, ownProfile, offeringsTab, onBack }: { coach?: boolean; coachId?: string; unified?: boolean; name?: string; photo?: string; cover?: string; customerFavorite?: boolean; coachNote?: boolean; coachVideo?: boolean; supercoach?: boolean; ownProfile?: boolean; offeringsTab?: boolean; onBack?: () => void }) {
  const coachConfig = COACH_CONFIGS[coachId] ?? COACH_CONFIGS.samantha;
  const { dark: darkMode } = useDarkMode();
  useEffect(() => { document.title = "Leland Prototype | Profile"; }, []);
  const [isFollowing, setIsFollowing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [stickyNavVisible, setStickyNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("offerings");
  const [adminOpen, setAdminOpen] = useState(false);
  const [showCustomerFavorite, setShowCustomerFavorite] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCoachNote, setShowCoachNote] = useState(unified ? true : coach);
  const [coachNoteExpanded, setCoachNoteExpanded] = useState(false);
  const [showCoachVideo, setShowCoachVideo] = useState(true);
  const [showSupercoach, setShowSupercoach] = useState(false);
  // In the unified template, coaches use a tabbed layout (About first) instead
  // of the long scroll; this tracks the active tab.
  const [coachTab, setCoachTab] = useState<"about" | "offerings" | "activity" | "saved" | "likes">("about");
  const [showCoverImage, setShowCoverImage] = useState(unified ? true : false);
  const [showGrayHeader, setShowGrayHeader] = useState(false);
  const [searchParams] = useSearchParams();
  const isCustomerProfile = !coach;
  // In the unified template these modular coach sections are driven by the
  // wrapper's admin toggles (all default off); elsewhere they use the local
  // admin-panel state.
  const effCustomerFavorite = unified ? Boolean(customerFavorite) : showCustomerFavorite;
  const effCoachNote = unified ? Boolean(coachNote) : showCoachNote;
  const effCoachVideo = unified ? Boolean(coachVideo) : showCoachVideo;
  const effShowSupercoach = unified ? Boolean(supercoach) : showSupercoach;
  // In the unified template the hero + top nav (cover image, round photo,
  // Follow/Message CTAs, nav theming) use the customer treatment for BOTH
  // coach and customer, so they function identically. Content logic below
  // still keys off isCustomerProfile.
  const heroCustomer = isCustomerProfile || unified;
  const { savedPosts } = useBookmarks();
  const [navScrolled, setNavScrolled] = useState(false);
  // Small-threshold scroll flag that drives the wordmark animating away, like
  // the shared MobileTopNav (independent of the cover-based navScrolled).
  const [navWordmarkHidden, setNavWordmarkHidden] = useState(false);
  useEffect(() => {
    if (!heroCustomer) return;
    const onScroll = () => {
      // Switch to white bg once scrolled past the cover image area
      setNavScrolled(window.scrollY > window.innerHeight * 0.2 - 56);
      setNavWordmarkHidden(window.scrollY > 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [heroCustomer]);
  useSetNavTheme(
    heroCustomer
      ? navScrolled
        ? { bg: "white", light: false, hideWordmark: false }
        : { bg: "#111111", light: true, hideWordmark: false, bgGradient: true, slideIn: !unified }
      : { bg: "white", light: false, hideWordmark: false }
  );
  useSetNavRightSlot(
    heroCustomer
      ? useMemo(() => (
          <button
            type="button"
            aria-label="Share"
            className="flex h-8 w-8 cursor-pointer items-center justify-center"
          >
            <img src={shareArrowFilledIcon} alt="Share" className={`h-[22px] w-[22px] ${navScrolled ? "brightness-0" : "brightness-0 invert"}`} />
          </button>
        ), [navScrolled])
      : null
  );
  const [customerTab, setCustomerTab] = useState<"about" | "likes" | "saved" | "more">(
    (["about", "saved", "likes", "more"] as const).includes(searchParams.get("tab") as any)
      ? (searchParams.get("tab") as "about" | "likes" | "saved" | "more")
      : "about"
  );
  const [purchasesFilter, setPurchasesFilter] = useState<"All" | "Coaching" | "Programs" | "Content">("All");
  const [purchasesExpanded, setPurchasesExpanded] = useState(false);
  const [pastOpen, setPastOpen] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("All");
  const [offeringsType, setOfferingsType] = useState("All");
  const [viewingOwnProfileState, setViewingOwnProfileState] = useState(unified ? false : isCustomerProfile);
  // In the unified template "My profile" is driven by the wrapper's admin toggle.
  const viewingOwnProfile = unified ? Boolean(ownProfile) : viewingOwnProfileState;
  // "Offerings tab" (coach + unified only) promotes Offerings to its own tab.
  const showOfferingsTab = unified && !isCustomerProfile && Boolean(offeringsTab);
  // Where the coach's Offerings section renders vs the rest (Events → Reviews):
  // scroll layout shows both; the template splits Offerings into its own tab
  // when the toggle is on, otherwise Offerings stays at the top of About.
  const showOfferingsSection = !unified || (showOfferingsTab ? coachTab === "offerings" : coachTab === "about");
  const showRestSections = !unified || coachTab === "about";
  // If a coach tab disappears while it's active (Offerings toggled off, or Saved
  // when no longer viewing own profile), fall back to About.
  useEffect(() => {
    if (!showOfferingsTab && coachTab === "offerings") setCoachTab("about");
    if (!viewingOwnProfile && (coachTab === "saved" || coachTab === "likes")) setCoachTab("about");
  }, [showOfferingsTab, viewingOwnProfile, coachTab]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [eventsCategoryOpen, setEventsCategoryOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [inlineCategory, setInlineCategory] = useState(false);
  const [offeringsTypeOpen, setOfferingsTypeOpen] = useState(false);
  const [allOfferingsOpen, setAllOfferingsOpen] = useState(false);
  const offeringsTypeRef = useRef<HTMLDivElement>(null);

  // In the unified template the identity (name + photo) comes from the slug and
  // stays constant across the coach/customer toggle. Elsewhere it keeps the
  // original per-mode defaults.
  const profilePhoto = unified ? (photo ?? coachConfig.photo) : (isCustomerProfile ? customerPhoto : coachConfig.photo);
  const profileName = unified ? (name ?? coachConfig.name) : (isCustomerProfile ? "June Allen" : coachConfig.name);

  const categoryRef = useRef<HTMLDivElement>(null);
  const eventsCategoryRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navScrollRef = useRef<HTMLDivElement>(null);
  const customerTabStripRef = useRef<HTMLDivElement>(null);
  const tabAnchorRef = useRef<HTMLDivElement>(null);
  // On tab switch, scroll so the (sticky) tab strip pins just under the 56px top
  // nav, showing the new tab's content from the top. Measures a NON-sticky
  // anchor placed right above the strip — the strip's own rect is unreliable
  // once it's pinned (its top is always 56, so the target would equal the
  // current scroll = no-op). rAF lets the new tab content commit first.
  const scrollTabsIntoView = () => {
    requestAnimationFrame(() => {
      const el = tabAnchorRef.current;
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    });
  };

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

  // Observer A: Show/hide sticky nav based on hero sentinel visibility.
  // We check boundingClientRect.top so the nav only appears when the
  // sentinel has scrolled ABOVE the viewport — not when it's simply
  // below the fold on small screens (e.g. mobile on initial load).
  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStickyNavVisible(false);
        } else {
          setStickyNavVisible(entry.boundingClientRect.top < 0);
        }
      },
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

  // Bring the selected customer tab into view (e.g. tapping "Saved" when it's
  // clipped at the right edge). Scroll the strip horizontally only, so the
  // sticky tab bar never nudges the page vertically.
  useEffect(() => {
    const strip = customerTabStripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(`[data-tab="${customerTab}"]`);
    if (!active) return;
    const target = active.offsetLeft - (strip.clientWidth - active.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [customerTab]);

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
    if (!moreMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreMenuOpen]);

  useEffect(() => {
    if (!offeringsTypeOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (offeringsTypeRef.current && !offeringsTypeRef.current.contains(e.target as Node)) {
        setOfferingsTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [offeringsTypeOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "o") setViewingOwnProfileState(p => !p);
      if (e.key === "i") setShowCoverImage(p => !p);
      if (e.key === "g") setShowGrayHeader(p => !p);
      if (!isCustomerProfile) {
        if (e.key === "v") setShowCoachVideo(p => !p);
        if (e.key === "n") setShowCoachNote(p => !p);
        if (e.key === "f") setShowCustomerFavorite(p => !p);
        if (e.key === "s") setShowSupercoach(p => !p);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCustomerProfile]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Modular coach sections reused in two places: the hero block (non-unified
  // profiles) and the top of the About tab (unified template).
  const customerFavoriteRow = (
    <div className="flex gap-4 py-4">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center">
        <img src={wreathSmallImg} alt="" className="w-8" />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-gray-dark">Customer Favorite</p>
        <p className="text-[14px] leading-snug text-[#707070]">In the top 10% of MBA experts on Leland</p>
      </div>
    </div>
  );
  const supercoachRow = (
    <div className="flex gap-4 py-4">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center text-[26px] leading-none">
        🏆
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-gray-dark">Super Coach</p>
        <p className="text-[14px] leading-snug text-[#707070]">Recognized for consistently outstanding coaching outcomes.</p>
      </div>
    </div>
  );
  const coachNoteRow = (
    <div
      className="flex cursor-pointer gap-4 py-4"
      onClick={() => setCoachNoteExpanded(p => !p)}
    >
      <img
        src={profilePhoto}
        alt={profileName}
        className="mt-0.5 h-9 w-9 shrink-0 rounded-[4px] object-cover"
      />
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-gray-dark">Note from {profileName.split(" ")[0]}</p>
        <div className="relative">
          <motion.div
            initial={false}
            animate={{ height: coachNoteExpanded ? "auto" : 58 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[14px] leading-snug text-[#707070]">
              If you're looking for AI coaching, from fundamentals to building out more advanced agents and workflows, I'm taking on a few new folks for 1:1 productivity coaching for both your professional and personal life. Keeping up with the pace of development alone requires dedication. But we can bring your information together and rewire how you work. If you're looking for MBA application support, essay-writing, or other coaching, message me directly through Leland and I'll get right back to you.
            </p>
          </motion.div>
          {!coachNoteExpanded && (
            <span className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-transparent pl-10 text-[14px] leading-snug font-medium text-gray-dark">
              Read more
            </span>
          )}
          {coachNoteExpanded && (
            <span className="mt-1 inline-block text-[14px] font-medium text-gray-dark">
              Read less
            </span>
          )}
        </div>
      </div>
    </div>
  );
  const coachVideoRow = (
    <div className="group relative cursor-pointer overflow-hidden py-4">
      <div className="relative overflow-hidden rounded-lg">
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
            <p className="text-[14px] font-medium leading-tight text-white">Get to know me</p>
            <p className="text-[12px] leading-tight text-white/70">1:40</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sticky secondary nav — portaled to body to escape framer-motion layoutId containing blocks */}
      {createPortal(
        <AnimatePresence>
          {stickyNavVisible && !isCustomerProfile && !unified && (
            <motion.div
              key="sticky-coach"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 right-0 z-30 border-b border-gray-stroke bg-white"
            >
              <div className="mx-auto flex max-w-[1280px] items-stretch gap-4 px-6 transition-all duration-300">
                {/* Left: photo + name + rate — click to scroll to top */}
                <div
                  className="flex shrink-0 cursor-pointer items-center gap-2.5 py-3"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <img
                    src={profilePhoto}
                    alt={profileName}
                    className="h-10 w-10 rounded-[4px] object-cover"
                  />
                  <div className="flex flex-col text-[14px] leading-tight md:text-[14px]">
                    <span className="text-[16px] font-medium text-gray-dark md:text-[14px]">{profileName}</span>
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
                        className={`shrink-0 cursor-pointer border-b-2 px-3 py-3 text-[15px] font-medium transition-colors ${
                          activeSection === section.id
                            ? "border-gray-dark text-gray-dark"
                            : "border-transparent text-gray-light hover:text-gray-dark"
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center pl-4 md:hidden">
                    <button className="cursor-pointer rounded-lg bg-[#FFD96F] px-4 py-2.5 text-[14px] font-medium text-[#222222] transition-colors hover:bg-[#FFD96F]/90">
                      Free intro call
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Unified template — same sticky bar for coach & customer (no pivot
              tabs). CTA is "Free intro call" for coaches, "Follow" for customers. */}
          {stickyNavVisible && unified && (
            <motion.div
              key="sticky-unified"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 right-0 z-30 bg-white"
            >
              {/* Clicking anywhere in the bar (except the CTA) scrolls to top */}
              <div
                className="mx-auto flex h-14 max-w-[1280px] cursor-pointer items-center gap-4 px-4"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {/* Left: photo + name (+ rate for coaches) */}
                <div className="flex min-w-0 shrink items-center gap-2.5">
                  <img
                    src={profilePhoto}
                    alt={profileName}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                  <div className="flex min-w-0 flex-col text-[14px] leading-tight">
                    <span className="truncate text-[16px] font-medium text-gray-dark md:text-[14px]">{profileName}</span>
                    {!isCustomerProfile && <span className="truncate text-[#707070]">Available today</span>}
                  </div>
                </div>

                {/* Spacer */}
                <div className="min-w-0 flex-1" />

                {/* Right: CTA — stops propagation so it doesn't scroll to top.
                    Own profile → gray Edit; coach → Free intro call; else Follow. */}
                {viewingOwnProfile ? (
                  <Link
                    to="/settings?tab=account"
                    onClick={(e) => e.stopPropagation()}
                    className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#222222]/5 px-[18px] py-2.5 text-[14px] font-medium text-gray-dark no-underline transition-colors hover:bg-[#222222]/[0.08]"
                  >
                    <img src={editIcon} alt="" className="h-[16px] w-[16px]" />
                    Edit
                  </Link>
                ) : isCustomerProfile ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }}
                    className="shrink-0 cursor-pointer rounded-full bg-[#222222]/5 px-[18px] py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                ) : (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 cursor-pointer rounded-full bg-[#FFD96F] px-[18px] py-2.5 text-[14px] font-medium text-[#222222] transition-colors hover:bg-[#FFD96F]/90"
                  >
                    Free intro call
                  </button>
                )}
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
      <motion.div
        initial={isCustomerProfile && !unified ? { x: "100%" } : false}
        animate={{ x: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
      <PageShell rightSidebar={showSidebar ? (
          isCustomerProfile || unified ? (
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
                  to="/coach-profile"
                />
                <SidebarCard
                  variant="coach"
                  image={pic3}
                  title="Jackson Ringger"
                  subtitle="Ex-McKinsey Engagement Manager | Wharton MBA..."
                  to="/coach-profile"
                />
                <SidebarCard
                  variant="coach"
                  image={pic5}
                  title="Erika Mah"
                  subtitle="Senior PM at Google | Stanford GSB | Ex-Stripe..."
                  to="/coach-profile"
                />
              </SidebarGroup>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
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
                        <p className="text-[14px] font-medium leading-tight text-white">Get to know me</p>
                        <p className="text-[12px] leading-tight text-white/70">1:40</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg border border-[#E5E5E5] bg-white px-5 py-4" style={{ boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[14px] leading-none font-medium text-gray-dark">Available today at 5:30pm</span>
                    <span className="text-[14px] leading-none text-[#707070]">Usually responds within 12 hours</span>
                  </div>
                  <span className="h-[12px] w-[12px] shrink-0 rounded-full bg-[#FFD96F] animate-[pulse-ring_2.4s_ease-out_infinite]" />
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full cursor-pointer rounded-full bg-leland-brand-primary px-4 py-[14px] text-[15px] font-medium text-gray-dark transition-colors hover:bg-leland-brand-primary/90">
                    Schedule a free intro call
                  </button>
                  <button className="w-full cursor-pointer rounded-full bg-[#222222]/5 px-4 py-[14px] text-[15px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
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
                      <p className="text-[14px] font-semibold text-gray-dark">Note from {profileName.split(" ")[0]}</p>
                      <div className="relative mt-0.5">
                        <motion.div
                          initial={false}
                          animate={{ height: coachNoteExpanded ? "auto" : 58 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-[14px] leading-snug text-[#707070]">
                            If you're looking for AI coaching, from fundamentals to building out more advanced agents and workflows, I'm taking on a few new folks for 1:1 productivity coaching for both your professional and personal life. Keeping up with the pace of development alone requires dedication. But we can bring your information together and rewire how you work. If you're looking for MBA application support, essay-writing, or other coaching, message me directly through Leland and I'll get right back to you.
                          </p>
                        </motion.div>
                        {!coachNoteExpanded && (
                          <span className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-transparent pl-10 text-[14px] leading-snug font-medium text-gray-dark">
                            Read more
                          </span>
                        )}
                        {coachNoteExpanded && (
                          <span className="mt-1 inline-block text-[14px] font-medium text-gray-dark">
                            Read less
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message section */}
                <div className={`flex gap-3 border-b border-[#E5E5E5] py-6 ${!showCoachNote ? "border-t" : ""}`}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#f5f5f5] icon-tile">
                    <img src={airplaneIcon} alt="" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-gray-dark">Questions?</p>
                    <p className="mt-0.5 text-[14px] leading-snug text-[#707070]">
                      You can start chatting with {profileName.split(" ")[0]} before you get started. <span className="cursor-pointer font-medium text-gray-dark">Send a message</span>
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )
        ) : undefined} rightSidebarWidth={isCustomerProfile || unified ? 300 : 340} rightSidebarTop={stickyNavVisible ? 76 : 20}>
        <div>
          {/* Unified template — self-rendered mobile top nav that slides in/out
              with the page (the shared fixed nav is hidden on /profile). It
              overlays the cover: transparent + white icons over the cover, solid
              + dark icons once scrolled. */}
          {unified && (
            <div
              className="absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between px-4 pt-[env(safe-area-inset-top,0px)] transition-colors md:hidden"
              style={{ backgroundColor: navScrolled ? (darkMode ? "#111111" : "#ffffff") : "transparent" }}
            >
              <button
                onClick={onBack}
                aria-label="Go back"
                className={`flex h-8 w-8 items-center justify-center ${navScrolled ? "text-gray-dark" : "text-white"}`}
              >
                <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div className="flex items-center gap-[6px]">
                <img src={logoIcon} alt="Leland" className={`h-[23px] w-auto ${!navScrolled || darkMode ? "brightness-0 invert" : ""}`} />
                <motion.img
                  src={logoWordmark}
                  alt=""
                  className={`h-[20px] w-auto ${!navScrolled || darkMode ? "brightness-0 invert" : ""}`}
                  animate={{ opacity: navWordmarkHidden ? 0 : 1, width: navWordmarkHidden ? 0 : "auto", marginLeft: navWordmarkHidden ? 0 : undefined }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
              <button aria-label="Share" className="flex h-8 w-8 items-center justify-center">
                <img src={shareArrowFilledIcon} alt="Share" className={`h-[22px] w-[22px] ${!navScrolled || darkMode ? "brightness-0 invert" : "brightness-0"}`} />
              </button>
            </div>
          )}

          {/* Cover image. In the template the cover pulls up past PageShell's
              top padding so it (and the #111 backing behind the status bar)
              reaches the very top — no white gap above the cover. */}
          {heroCustomer ? (
            <div className={`relative -mx-4 md:mx-0 ${unified ? "-mt-4 bg-[#111111] sm:-mt-10 md:mt-0" : "-mt-[72px] md:mt-0"} ${showCoverImage ? "" : "md:hidden"}`}>
              <img
                src={unified && cover ? cover : customerCoverImage}
                alt="Cover"
                className="h-[20vh] w-full object-cover md:h-[220px] md:rounded-[6px]"
              />
              <div className="absolute inset-0 bg-black/25 md:rounded-[6px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#111111] md:rounded-[6px]" />
            </div>
          ) : (
            showCoverImage && (
              <img
                src={coachCoverImage}
                alt="Cover"
                className="h-[220px] w-full rounded-[6px] object-cover"
              />
            )
          )}

          {/* Profile photo + CTA buttons */}
          <div className={`${heroCustomer ? "-mt-[80px] md:pl-4 items-end" : showCoverImage ? "-mt-[80px] pl-4 items-start" : showGrayHeader ? "-mt-[100px] items-start" : "mt-0 items-start"} mb-4 flex justify-between ${heroCustomer || showCoverImage || showGrayHeader ? "md:items-end" : ""} ${heroCustomer && !showCoverImage ? "md:mt-0 md:pl-0" : ""}`}>
            <div className={`group relative z-20 cursor-pointer border-[4px] md:rounded-lg ${darkMode ? "border-[#131313] bg-[#131313]" : "border-white bg-white"} ${heroCustomer ? "rounded-full" : "rounded-lg"}`} onClick={() => setLightboxOpen(true)}>
              <div className={`relative overflow-hidden md:rounded-[4px] ${heroCustomer ? "rounded-full" : "rounded-[4px]"}`}>
                <motion.img
                  layoutId="profile-photo"
                  src={profilePhoto}
                  alt={profileName}
                  className="block h-[132px] w-[132px] object-cover"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>
            </div>
            <div className={`flex items-center gap-2 ${showCoverImage || heroCustomer ? "pb-1" : showGrayHeader ? "pb-[90px]" : "pb-1"} ${heroCustomer && !showCoverImage ? "md:pb-1" : ""}`}>
              {viewingOwnProfile ? (
                <Link to="/settings?tab=account" className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-[15px] font-semibold text-gray-dark transition-colors hover:bg-[#ebebeb]">
                  <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
                  Edit
                </Link>
              ) : (
                <>
                  {/* Mail button — mobile only for customer treatment */}
                  {heroCustomer && (
                    <button className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-xl bg-[#F5F5F5] transition-colors hover:bg-[#ebebeb] md:hidden">
                      <img src={mailIcon} alt="Mail" className="h-[20px] w-[20px]" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex cursor-pointer items-center gap-1.5 transition-colors ${
                      heroCustomer
                        ? "rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-[15px] font-semibold text-gray-dark hover:bg-[#ebebeb] md:rounded-lg md:bg-[#FFD96F] md:px-4 md:text-[14px] md:text-[#222222] md:hover:bg-[#FFD96F]/90"
                        : showCoverImage || !showGrayHeader
                          ? "rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-semibold text-gray-dark hover:bg-[#222222]/[0.08]"
                          : "rounded-lg border border-[#222222]/10 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-dark hover:border-[#222222]/20"
                    }`}
                  >
                    {isFollowing && <img src={checkIcon} alt="" className={`h-[18px] w-[18px] ${heroCustomer ? "md:brightness-0 md:invert" : ""}`} />}
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <div ref={moreMenuRef} className={`relative ${heroCustomer ? "hidden md:block" : ""}`}>
                    <button
                      onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                      className={`flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg transition-colors ${
                        showCoverImage || !showGrayHeader
                          ? "bg-[#222222]/5 hover:bg-[#222222]/[0.08]"
                          : "border border-[#222222]/10 bg-white hover:border-[#222222]/20"
                      }`}
                    >
                      <img src={dotsHorizontalIcon} alt="More" className="h-[20px] w-[20px]" />
                    </button>
                    <AnimatePresence>
                      {moreMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-stroke bg-white py-2 shadow-lg"
                        >
                          {[
                            { icon: shareArrowIcon, label: "Share" },
                            { icon: airplaneIcon, label: "Message" },
                            { icon: reportFlagIcon, label: "Report" },
                          ].map((item) => (
                            <button
                              key={item.label}
                              onClick={() => setMoreMenuOpen(false)}
                              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-hover ${
                                "text-gray-dark"
                              }`}
                            >
                              <img src={item.icon} alt="" className="h-[20px] w-[20px] shrink-0 brightness-0" />
                              {item.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Name → stats wrapper (padded when cover image is on). In the unified
              template the text is flush-left on mobile (matching the photo, which
              only pads on desktop) — drop the mobile pl-4 there. */}
          <div className={showCoverImage ? (unified ? "md:pl-4" : "pl-4") : ""}>

          {/* Name + Verified badge + Supercoach badge. In the unified template the
              name always keeps the large serif styling (it never shrinks when a
              category is selected). */}
          <div className={`flex items-center ${unified || sectionFilter === "All" ? "gap-2 mb-2" : "gap-1 mb-1"}`}>
            <h1 className={`font-medium text-gray-dark ${unified || sectionFilter === "All" ? "font-serif text-[26px]" : "text-[16px]"}`}>{profileName}</h1>
            <AnimatePresence>
              {!isCustomerProfile && (
                <motion.img
                  key="verified"
                  src={verifiedIcon}
                  alt="Verified"
                  className="mt-[2px] h-[19px] w-[19px]"
                  initial={unified ? { opacity: 0, scale: 0.4 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
            </AnimatePresence>
            {/* Inline badge — non-unified only; the template shows Super Coach as
                a row in the About tab instead. */}
            {effShowSupercoach && !isCustomerProfile && !unified && (
              <>
                <span className="ml-1 text-[16px] text-[#999999]">·</span>
                <span className="text-[16px] text-[#707070]"><span className="text-[14px]">🏆</span> Supercoach</span>
              </>
            )}
          </div>

          {/* Headline — large serif variant. Hidden in the unified template,
              where the headline instead renders in the bio slot below. */}
          <p className={`mb-[6px] font-serif text-[26px] font-medium leading-[1.3] text-[#333333] ${unified || sectionFilter === "All" ? "hidden" : ""}`}>
            {isCustomerProfile
              ? <>Experienced Product Leader at LinkedIn <span className="font-normal text-[#9B9B9B]">|</span> Ex-Meta <span className="font-normal text-[#9B9B9B]">|</span> Stanford GSB</>
              : sectionFilter === "College"
                ? <>College Admissions Expert <span className="font-normal text-[#9B9B9B]">|</span> Yale Grad <span className="font-normal text-[#9B9B9B]">|</span> 50+ Ivy League Admits</>
                : sectionFilter === "MBA"
                  ? <>MBA Coach <span className="font-normal text-[#9B9B9B]">|</span> Stanford GSB <span className="font-normal text-[#9B9B9B]">|</span> 100+ M7 Admits</>
                  : <>Experienced Product Leader at LinkedIn <span className="font-normal text-[#9B9B9B]">|</span> Ex-Meta <span className="font-normal text-[#9B9B9B]">|</span> Stanford GSB</>
            }
          </p>

          {/* Credentials row */}
          <div className="mb-1 flex flex-wrap items-center gap-x-[20px] gap-y-[2px] text-[14px] text-[#707070] md:mb-4">
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
            {!isCustomerProfile && <div className="hidden items-center gap-[6px] md:flex">
              <span>Successful clients at</span>
              <div className="flex items-center -space-x-[2px]">
                <img src={clientLogo1} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo2} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo3} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo4} alt="" className="h-[18px] w-[18px] rounded border border-white" />
              </div>
            </div>}
          </div>

          {/* Bio — customer profile shows a bio here; in the unified template
              coaches show their (category-aware) headline in this same slot and
              body-text style, so the name above stays the large heading. */}
          {(isCustomerProfile || unified) && (
            <p className="mt-1 mb-2 text-[15px] leading-[1.4] text-gray-dark">
              {isCustomerProfile ? (
                "Building products that matter. Passionate about AI, design, and helping others break into tech."
              ) : sectionFilter === "College" ? (
                <>College Admissions Expert <span className="text-[#9B9B9B]">|</span> Yale Grad <span className="text-[#9B9B9B]">|</span> 50+ Ivy League Admits</>
              ) : sectionFilter === "MBA" ? (
                <>MBA Coach <span className="text-[#9B9B9B]">|</span> Stanford GSB <span className="text-[#9B9B9B]">|</span> 100+ M7 Admits</>
              ) : (
                <>Experienced Product Leader at LinkedIn <span className="text-[#9B9B9B]">|</span> Ex-Meta <span className="text-[#9B9B9B]">|</span> Stanford GSB</>
              )}
            </p>
          )}

          {/* Stats row */}
            <div className="mt-4 mb-2 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-0">
              {/* Customer Favorite — desktop only (mobile gets its own banner below) */}
              {effCustomerFavorite && (
                <>
                  <div className="hidden items-center gap-[2px] md:flex">
                    <img src={wreathImg} alt="" className="h-[45px] w-[21px]" />
                    <span className="text-center text-[16px] font-semibold leading-[110%] text-gray-dark">Customer<br/>Favorite</span>
                    <img src={wreathImg} alt="" className="h-[45px] w-[21px] scale-x-[-1]" />
                  </div>
                  <div className="hidden h-[24px] w-px shrink-0 bg-gray-200 md:block" />
                </>
              )}
              {/* Reviews — coach only. popLayout pops it out of flow on exit so
                  the trailing stats (which carry `layout`) glide to fill. */}
              <AnimatePresence mode="popLayout">
              {!isCustomerProfile && (
              <motion.div
                key="reviews"
                layout
                initial={unified ? { opacity: 0, scale: 0.85 } : false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-x-6"
              >
                <div
                  className="flex cursor-pointer flex-col md:gap-[2px] transition-opacity hover:opacity-70"
                  onClick={() => scrollToSection("reviews")}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-semibold leading-none text-gray-dark md:text-[18px]">4.9</span>
                    <img src={starIcon} alt="" className="h-[16px] w-[16px]" />
                  </div>
                  <span className="text-[14px] leading-tight text-[#707070]">52 Reviews</span>
                </div>
                <div className="hidden h-[24px] w-px shrink-0 bg-gray-200 md:block" />
              </motion.div>
              )}
              </AnimatePresence>
              {/* Minutes coached — hidden on the template's customer (Expert off) view */}
              {(!unified || !isCustomerProfile) && (<>
              <motion.div layout className="flex flex-col md:gap-[2px]">
                <span className="text-[16px] font-semibold leading-none text-gray-dark md:text-[18px]">6.6k</span>
                <span className="text-[14px] leading-tight text-[#707070]">{unified && !isCustomerProfile ? "Expert mins" : "Min coached"}</span>
              </motion.div>
              <motion.div layout className="hidden h-[24px] w-px shrink-0 bg-gray-200 md:block" />
              </>)}
              {/* Followers */}
              <motion.div layout className="flex flex-col md:gap-[2px]">
                <span className="text-[16px] font-semibold leading-none text-gray-dark md:text-[18px]">84</span>
                <span className="text-[14px] leading-tight text-[#707070]">Followers</span>
              </motion.div>
              <motion.div layout className="hidden h-[24px] w-px shrink-0 bg-gray-200 md:block" />
              {/* Likes */}
              <motion.div layout className="flex flex-col md:gap-[2px]">
                <span className="text-[16px] font-semibold leading-none text-gray-dark md:text-[18px]">1.6k</span>
                <span className="text-[14px] leading-tight text-[#707070]">Likes</span>
              </motion.div>
              <motion.div layout className="hidden h-[24px] w-px shrink-0 bg-gray-200 md:block" />
              {/* Impressions — desktop only */}
              <motion.div
                layout
                className="hidden cursor-pointer flex-col gap-[2px] transition-opacity hover:opacity-70 md:flex"
                onClick={() => scrollToSection("activity")}
              >
                <span className="text-[18px] font-semibold leading-none text-gray-dark">8.5k</span>
                <span className="text-[14px] leading-tight text-[#707070]">Impressions</span>
              </motion.div>
            </div>

          </div>{/* end name → stats wrapper */}

          {/* Sticky-nav sentinel — unified template triggers the bar once the
              hero (name/stats) scrolls off, so the bar is already showing by the
              time the tab bar pins (no gap, bar stays put on tab switches). */}
          {unified && <div ref={heroSentinelRef} />}

          {/* Customer Favorite — mobile banner (hidden for now) */}

          {/* Mobile inline CTA removed — the top-right header button is the
              only Follow/Edit action on the customer profile. */}

          {/* Mobile sidebar content — coach profile: Availability, CTAs, Customer Favorite, Coach note, Video, Questions.
              In the unified template this block is promoted above the tab bar on
              all widths (the coach CTA sidebar is dropped in favor of it). Height
              animates on the template so everything below slides as it appears. */}
          <AnimatePresence initial={false}>
          {!isCustomerProfile && !viewingOwnProfile && (
            <motion.div
              key="coach-info"
              initial={unified ? { opacity: 0, height: 0 } : false}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
            <div className={`${unified ? "mt-3" : "mt-4"} flex flex-col ${unified ? "" : "md:hidden"}`}>
              {/* CTA buttons */}
              <div className="flex flex-col gap-2">
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-leland-brand-primary px-4 py-[14px] text-[15px] font-medium text-[#111111] transition-colors hover:bg-leland-brand-primary/90">
                  {unified && <img src={calendarPageIcon} alt="" className="h-5 w-5" style={{ filter: "none" }} />}
                  Schedule free intro call
                </button>
                {/* Book a session — hidden in the unified template for now */}
                {!unified && (
                  <button className="w-full cursor-pointer rounded-full bg-[#222222]/5 px-4 py-[14px] text-[15px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                    Book a session
                  </button>
                )}
              </div>

              {/* Customer Favorite, Coach note, Video, Questions. In the unified
                  template Customer Favorite / Coach note / Video move to the top
                  of the About tab, so only Availability (+ Questions on
                  non-unified) stay in the hero. */}
              <div className={`${unified ? "mt-3" : "mt-2"} flex flex-col`}>
                {/* Customer Favorite */}
                {!unified && effCustomerFavorite && customerFavoriteRow}

                {/* Availability — unified template shows a compact, centered line
                    directly under the CTA (no response-time, no icon tile) with a
                    pulsing "live" dot. */}
                {unified ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="relative flex h-[7px] w-[7px] shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#80ACED] opacity-75" />
                      <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[#80ACED]" />
                    </span>
                    <p className="text-[14px] font-medium text-[#4C4C4C]">Available today at 5:30 PM</p>
                  </div>
                ) : (
                  <div className="flex gap-4 py-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#f5f5f5] icon-tile">
                      <img src={calendarIcon} alt="" className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-gray-dark">Available today at 5:30 PM</p>
                      <p className="text-[14px] leading-snug text-[#707070]">Usually responds within 12h</p>
                    </div>
                  </div>
                )}

                {/* Coach note */}
                {!unified && effCoachNote && coachNoteRow}

                {/* Questions — hidden in the unified template hero */}
                {!unified && (
                <div className="flex gap-4 py-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#f5f5f5] icon-tile">
                    <img src={airplaneIcon} alt="" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-gray-dark">Questions?</p>
                    <p className="text-[14px] leading-snug text-[#707070]">
                      You can start chatting with {profileName.split(" ")[0]} before you get started. <span className="cursor-pointer font-medium text-gray-dark">Send a message</span>
                    </p>
                  </div>
                </div>
                )}

                {/* Coach video */}
                {!unified && effCoachVideo && coachVideoRow}
              </div>
            </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Mobile inline CTA — coach viewing own profile. Hidden in the unified
              template, which relies on the header Edit profile button instead. */}
          {!isCustomerProfile && viewingOwnProfile && !unified && (
            <div className="mt-3 md:hidden">
              <Link to="/settings?tab=account" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#222222]/5 px-4 py-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
                Edit profile
              </Link>
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
                <p className="text-[14px] font-medium text-gray-dark">Get to know {profileName.split(" ")[0]}</p>
                <p className="text-[14px] text-[#707070]">1:40</p>
              </div>
            </div>
          )}


          {/* Hero sentinel for sticky nav detection (non-unified position). */}
          {!unified && <div ref={heroSentinelRef} />}

          {/* Unified template — coach tab bar. Offerings sits between About and
              Activity, but only when the "Offerings tab" admin toggle is on. */}
          {!isCustomerProfile && unified && (
            <>
            <div ref={tabAnchorRef} aria-hidden className="mt-3 h-0" />
            <div className="sticky top-14 z-10 -mx-4 flex border-b border-gray-stroke bg-white md:top-0">
              {([
                "about" as const,
                ...(showOfferingsTab ? ["offerings" as const] : []),
                "activity" as const,
                // Saved + Likes appear only when viewing your own profile.
                ...(viewingOwnProfile ? (["saved", "likes"] as const) : []),
              ]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setCoachTab(tab); scrollTabsIntoView(); }}
                  className={`flex-1 cursor-pointer py-3 text-center transition-colors ${
                    coachTab === tab
                      ? `border-b-2 text-gray-dark ${darkMode ? "border-white" : "border-gray-dark"}`
                      : "border-b-2 border-transparent text-gray-light hover:text-gray-dark"
                  }`}
                >
                  <span className="text-[16px] font-medium">
                    {tab === "about" ? "Profile" : tab === "offerings" ? "Offerings" : tab === "activity" ? "Activity" : tab === "saved" ? "Saved" : "Likes"}
                  </span>
                </button>
              ))}
            </div>
            </>
          )}

          {/* Coach detail sections (Offerings → Reviews). In the unified template
              these live inside the "About" tab (Offerings optionally in its own
              tab); otherwise they scroll inline. */}
          {!isCustomerProfile && (showOfferingsSection || showRestSections) && (<>
          {/* Unified template — Customer Favorite / Super Coach / Coach note /
              Video sit at the top of the About tab (moved out of the hero). */}
          {unified && coachTab === "about" && (effCustomerFavorite || effShowSupercoach || effCoachNote || effCoachVideo) && (
            <div className="mt-2 flex flex-col">
              {effCustomerFavorite && customerFavoriteRow}
              {effShowSupercoach && supercoachRow}
              {effCoachNote && coachNoteRow}
              {effCoachVideo && coachVideoRow}
            </div>
          )}
          {/* ── Offerings section (its own tab when "Offerings tab" is on) ── */}
          {showOfferingsSection && (
          <div ref={setGroupRef("offerings")} data-group="offerings">
            {/* In its own tab the leading divider would sit awkwardly under the
                tab bar — use plain top spacing there instead of a border. */}
            {showOfferingsTab && coachTab === "offerings" ? (
              <div className="mt-4" />
            ) : (
              <div className="my-[16px] border-t border-gray-200 md:my-[36px]" />
            )}

                {inlineCategory ? (
                  /* Inline category variant: "Offerings for {category}" */
                  <>
                  <div ref={setSectionRef("offerings")} className="scroll-mt-[60px] mb-4">
                    <h2 className="mb-[18px] flex items-center gap-0 text-[22px] leading-[1.1] font-medium text-gray-dark">
                      Offerings for{" "}
                      <span ref={categoryRef} className="relative ml-[6px]">
                        <button
                          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                          className="group inline-flex cursor-pointer items-center gap-1 text-[22px] font-medium text-[#707070] transition-colors hover:text-[#222222]"
                        >
                          <span className="inline-block pb-[3px] -mb-[3px] bg-[length:4px_4px] bg-[position:0_100%] bg-repeat-x [background-image:radial-gradient(circle,#9B9B9B_1px,transparent_1px)]">
                            {sectionFilter === "All" ? "all categories" : (CATEGORY_ALIASES[sectionFilter] ?? sectionFilter)}
                          </span>
                          <img src={chevronDownIcon} alt="" className={`h-[16px] w-[16px] opacity-50 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {categoryDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="absolute left-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-stroke bg-white py-2 shadow-lg"
                            >
                              {[{ value: "All", label: "All categories" }, { value: "College", label: "College" }, { value: "MBA", label: "MBA" }, { value: "Product Management", label: "Product Management" }].map(({ value, label }) => (
                                <button
                                  key={value}
                                  onClick={() => { setSectionFilter(value); setCategoryDropdownOpen(false); }}
                                  className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover ${sectionFilter === value ? "bg-gray-hover" : ""}`}
                                >
                                  {label}
                                  {sectionFilter === value && <img src={checkIcon} alt="" className="h-[16px] w-[16px]" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </span>
                    </h2>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-[6px]">
                    {["All", "Packages", "Memberships", "Agents", "Content"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setOfferingsType(tab)}
                        className={`cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[12px] font-semibold text-[#222222] ${
                          offeringsType === tab ? "border-[1.5px] border-[#222222]" : "border-[1.5px] border-transparent transition-colors hover:bg-[#ebebeb]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  </>
                ) : (
                  <>
                    <h2
                      ref={setSectionRef("offerings")}
                      className="scroll-mt-[60px] mb-4 text-[22px] font-semibold text-gray-dark"
                    >
                      Offerings
                    </h2>

                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap gap-[6px]">
                        {["All", "Packages", "Memberships", "Agents", "Content"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setOfferingsType(tab)}
                            className={`cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[12px] font-semibold text-[#222222] ${
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
                          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[12px] font-semibold text-[#222222] transition-colors hover:bg-[#ebebeb]"
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
                              className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-stroke bg-white py-2 shadow-lg"
                            >
                              {[{ value: "All", label: "All categories" }, { value: "College", label: "College" }, { value: "MBA", label: "MBA" }, { value: "Product Management", label: "Product Management" }].map(({ value, label }) => (
                                <button
                                  key={value}
                                  onClick={() => { setSectionFilter(value); setCategoryDropdownOpen(false); }}
                                  className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover ${sectionFilter === value ? "bg-gray-hover" : ""}`}
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
                  </>
                )}

                {/* Offering cards */}
                {(() => {
                  const filteredOfferings = coachConfig.offerings.filter((o) => {
                    if (o.type === "free-intro") return false;
                    if (offeringsType === "All") return true;
                    if (offeringsType === "Packages") return o.type === "hourly-package" || o.type === "package";
                    if (offeringsType === "Memberships") return o.type === "course";
                    if (offeringsType === "Agents") return o.type === "agent";
                    return o.type === "content";
                  });
                  const sliceCount = offeringsType === "All" ? 5 : offeringsType === "Agents" ? filteredOfferings.length : 5;
                  const isOwnCoachProfile = !isCustomerProfile && viewingOwnProfile;
                  return filteredOfferings.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {filteredOfferings.slice(0, sliceCount).map((o) => {
                        const isAgent = o.type === "agent";
                        const href = isAgent && isOwnCoachProfile && o.href ? `${o.href}/edit` : o.href;
                        const ctaLabel = isAgent && isOwnCoachProfile ? "Edit context" : o.ctaLabel;
                        return (
                          <OfferingCard
                            key={o.title}
                            type={o.type}
                            title={o.title}
                            subtitle={o.subtitle}
                            image={o.image}
                            ctaLabel={ctaLabel}
                            href={href}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D0D0D0] py-10 text-center">
                      <p className="text-[14px] text-[#9B9B9B]">No memberships available yet</p>
                    </div>
                  );
                })()}

                {/* View more + guarantee */}
                <div className="mt-4 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                  <button
                    onClick={() => setAllOfferingsOpen(true)}
                    className="cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
                  >
                    See all offerings
                  </button>
                  <div className="flex items-center gap-2 text-[13px] text-[#9b9b9b]">
                    <img src={shieldIcon} alt="" className="w-[12px]" />
                    <span>Protected by the <span className="cursor-pointer underline decoration-[0.5px] underline-offset-2 transition-colors hover:text-[#707070]">Leland Experience Guarantee</span></span>
                  </div>
                </div>
          </div>
          )}

          {/* ── Rest of the coach detail (Events → Reviews) — lives in the About tab ── */}
          {showRestSections && (<>
            {/* Events */}
            <div className="my-[36px] border-t border-gray-200" />
            {inlineCategory ? (
              <div className="mb-4">
                <h2 className="mb-[12px] flex items-center gap-0 text-[22px] leading-[1.1] font-medium text-gray-dark">
                  Events for{" "}
                  <span ref={eventsCategoryRef} className="relative ml-[6px]">
                    <button
                      onClick={() => setEventsCategoryOpen(!eventsCategoryOpen)}
                      className="group inline-flex cursor-pointer items-center gap-1 text-[22px] font-medium text-[#707070] transition-colors hover:text-[#222222]"
                    >
                      <span className="inline-block pb-[3px] -mb-[3px] bg-[length:4px_4px] bg-[position:0_100%] bg-repeat-x [background-image:radial-gradient(circle,#9B9B9B_1px,transparent_1px)]">
                        {sectionFilter === "All" ? "all categories" : (CATEGORY_ALIASES[sectionFilter] ?? sectionFilter)}
                      </span>
                      <img src={chevronDownIcon} alt="" className={`h-[16px] w-[16px] opacity-50 transition-transform ${eventsCategoryOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {eventsCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute left-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-stroke bg-white py-2 shadow-lg"
                        >
                          {[{ value: "All", label: "All categories" }, { value: "College", label: "College" }, { value: "MBA", label: "MBA" }, { value: "Product Management", label: "Product Management" }].map(({ value, label }) => (
                            <button
                              key={value}
                              onClick={() => { setSectionFilter(value); setEventsCategoryOpen(false); }}
                              className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover ${sectionFilter === value ? "bg-gray-hover" : ""}`}
                            >
                              {label}
                              {sectionFilter === value && <img src={checkIcon} alt="" className="h-[16px] w-[16px]" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                </h2>
              </div>
            ) : (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[22px] font-semibold text-gray-dark">Events</h2>
                <div ref={eventsCategoryRef} className="relative">
                  <button
                    onClick={() => setEventsCategoryOpen(!eventsCategoryOpen)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[12px] font-semibold text-[#222222] transition-colors hover:bg-[#ebebeb]"
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
                        className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-stroke bg-white py-2 shadow-lg"
                      >
                        {[{ value: "All", label: "All categories" }, { value: "College", label: "College" }, { value: "MBA", label: "MBA" }, { value: "Product Management", label: "Product Management" }].map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => { setSectionFilter(value); setEventsCategoryOpen(false); }}
                            className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover ${sectionFilter === value ? "bg-gray-hover" : ""}`}
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
            )}
            <div className="flex flex-col gap-4">
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>
            <button className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See 2 more
              <img src={chevronDownIcon} alt="" className="h-[16px] w-[16px]" />
            </button>

          {/* ── Activity group — omitted in the unified template's About tab ── */}
          {!unified && (
          <div ref={setGroupRef("activity")} data-group="activity">
            <div className="my-[36px] border-t border-gray-200" />
            <h2
              ref={setSectionRef("activity")}
              className="scroll-mt-[60px] mb-4 text-[22px] font-semibold text-gray-dark"
            >
              Activity
            </h2>
            <div className="-mx-4 scrollbar-hide flex gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
              <div className="h-[220px] w-[80vw] shrink-0 rounded-xl bg-[#f5f5f5] md:w-auto" style={dashedBorderStyle} />
            </div>
            <button className="mt-4 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See all
            </button>
          </div>
          )}

          {/* ── About group: MBA Qualifications + About Samantha + Why do I coach? ── */}
          <div ref={setGroupRef("about-samantha")} data-group="about-samantha">
            <div className="my-[36px] border-t border-gray-200" />
            {sectionFilter !== "All" ? (
              <>
                <h2
                  ref={setSectionRef("about-samantha")}
                  className="scroll-mt-[60px] mb-4 text-[22px] font-semibold text-gray-dark"
                >
                  {sectionFilter} Qualifications
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                  <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                </div>
                <div className="my-[36px] border-t border-gray-200" />
              </>
            ) : (
              <span ref={setSectionRef("about-samantha")} className="scroll-mt-[60px]" />
            )}
            <h2 className="mb-4 text-[22px] font-semibold text-gray-dark">About {coachConfig.firstName}</h2>
            <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />

            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-4 text-[22px] font-semibold text-gray-dark">Why do I coach?</h2>
            <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
          </div>

          {/* ── Experience group: Work Experience + Education ── */}
          <div ref={setGroupRef("work-experience")} data-group="work-experience">
            <div className="my-[36px] border-t border-gray-200" />
            <h2
              ref={setSectionRef("work-experience")}
              className="scroll-mt-[60px] mb-4 text-[22px] font-semibold text-gray-dark"
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
            <h2 className="mb-4 text-[22px] font-semibold text-gray-dark">Education</h2>
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
              <p className="text-[26px] font-semibold text-gray-dark">5.0 average review</p>
              <p className="text-[14px] font-normal text-[#9b9b9b]">52 reviews</p>
            </div>

            <div className="my-5 border-t border-gray-200" />

            {/* Rating breakdown — Airbnb-style columns */}
            <div className="flex flex-col gap-4 md:grid md:grid-cols-5">
              {/* Overall rating distribution */}
              <div className="md:col-span-1">
                <p className="mb-1 text-[14px] font-medium text-gray-dark">Overall rating</p>
                <div className="flex flex-col gap-1">
                  {[
                    { star: 5, count: 48 },
                    { star: 4, count: 3 },
                    { star: 3, count: 1 },
                    { star: 2, count: 0 },
                    { star: 1, count: 0 },
                  ].map((row) => (
                    <div key={row.star} className="flex items-center gap-1.5">
                      <span className="w-[10px] shrink-0 text-[10px] text-[#707070]">{row.star}</span>
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
                    <p className="text-[14px] font-medium text-gray-dark">{item.label}</p>
                    <p className="text-[22px] font-semibold text-gray-dark">{item.score.toFixed(1)}</p>
                  </div>
                  <div className="mt-3 text-gray-dark">{item.icon}</div>
                </div>
              ))}
              </div>
            </div>

            <div className="my-6 border-t border-gray-200" />

            {/* Successful clients at */}
            <div className="mb-6">
              <p className="mb-1.5 text-[14px] font-medium text-gray-dark">Successful clients at</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap items-center gap-[4px]">
                  {[clientLogo1, clientLogo2, clientLogo3, clientLogo4, facebookLogo, googleLogo, instagramLogo, salesforceLogo, coinbaseLogo, mckinseyLogo, bainLogo, lekLogo, nikeLogo, goldmanSachsLogo].map((logo, i) => (
                    <div key={i} className="h-[32px] w-[32px] shrink-0 overflow-hidden rounded-[2px]">
                      <img src={logo} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <span className="flex h-[32px] items-center rounded-[2px] bg-[#f5f5f5] px-2 text-[12px] font-medium text-[#707070]">+12</span>
                </div>
                <div className="hidden flex-1 md:block" />
                <button className="cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
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
            <button className="mt-6 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See all 52 reviews
            </button>
          </div>
          </>)}
          </>)}

          {/* Unified template — coach Activity tab (feed of the coach's posts) */}
          {!isCustomerProfile && unified && coachTab === "activity" && (
            <div className="mt-3 divide-y divide-gray-stroke/50">
              {customerPosts.map((post) => (
                <FeedPost
                  key={post.id}
                  post={{ ...post, author: profileName, avatar: profilePhoto }}
                />
              ))}
            </div>
          )}

          {/* Unified template — coach Saved tab (own profile only; bookmarked posts) */}
          {!isCustomerProfile && unified && coachTab === "saved" && (
            savedPosts.length > 0 ? (
              <div className="mt-3 flex flex-col divide-y divide-gray-stroke/50">
                {savedPosts.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <svg className="h-8 w-8 text-gray-xlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                <p className="text-[15px] font-medium text-gray-dark">Nothing saved yet</p>
                <p className="text-[13px] text-gray-light">Tap the bookmark on a post to save it here.</p>
              </div>
            )
          )}

          {/* Unified template — coach Likes tab (placeholder) */}
          {!isCustomerProfile && unified && coachTab === "likes" && (
            <div className="mt-4 flex flex-col gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full border border-dashed border-[#C5C5C5] bg-[#f5f5f5]" />
                  <div className="h-[120px] min-w-0 flex-1 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                </div>
              ))}
            </div>
          )}

          {/* Customer profile tabs */}
          {isCustomerProfile && (
            <>
                {unified && <div ref={tabAnchorRef} aria-hidden className="mt-2 h-0" />}
                <div ref={customerTabStripRef} className={`sticky top-14 z-10 -mx-4 ${unified ? "" : "mt-2"} flex border-b border-gray-stroke bg-white md:top-0`}>
                  {(viewingOwnProfile ? ["about", "more", "saved", "likes"] as const : unified ? ["about", "more"] as const : ["about", "more", "likes"] as const).map((tab) => (
                    <button
                      key={tab}
                      data-tab={tab}
                      onClick={() => { setCustomerTab(tab); if (unified) scrollTabsIntoView(); }}
                      className={`flex-1 cursor-pointer py-3 text-center transition-colors ${
                        customerTab === tab
                          ? `border-b-2 text-gray-dark ${darkMode ? "border-white" : "border-gray-dark"}`
                          : "border-b-2 border-transparent text-gray-light hover:text-gray-dark"
                      }`}
                    >
                      <span className={`text-[16px] ${customerTab === tab ? (unified ? "font-medium" : "font-semibold") : "font-medium"}`}>{tab === "about" ? "Activity" : tab === "likes" ? "Likes" : tab === "saved" ? "Saved" : unified ? "Profile" : "About"}</span>
                    </button>
                  ))}
                </div>

              <div className="mt-3">
                {(viewingOwnProfile ? customerTab === "about" : true) && (
                  <div className="divide-y divide-gray-stroke/50">
                    {customerPosts.map((post) => (
                      <FeedPost
                        key={post.id}
                        post={unified ? { ...post, author: profileName, avatar: profilePhoto } : post}
                      />
                    ))}
                  </div>
                )}

                {viewingOwnProfile && customerTab === "likes" && (
                  <div className="flex flex-col gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full border border-dashed border-[#C5C5C5] bg-[#f5f5f5]" />
                        <div className="h-[120px] min-w-0 flex-1 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Saved — its own tab. Posts bookmarked from the feed; the
                    yellow bookmark icon on each post is enough to differentiate. */}
                {viewingOwnProfile && customerTab === "saved" && (
                  savedPosts.length > 0 ? (
                    <div className="flex flex-col divide-y divide-gray-stroke/50">
                      {savedPosts.map((post) => (
                        <FeedPost key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-16 text-center">
                      <svg className="h-8 w-8 text-gray-xlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                      <p className="text-[15px] font-medium text-gray-dark">Nothing saved yet</p>
                      <p className="text-[13px] text-gray-light">Tap the bookmark on a post to save it here.</p>
                    </div>
                  )
                )}

                {viewingOwnProfile && customerTab === "more" && (
                  <div className="flex flex-col gap-8">
                    {/* About */}
                    <section>
                      <div className={`text-[16px] ${darkMode ? "text-[#d4d4d4]" : "text-[#444]"}`} style={{ lineHeight: "130%" }}>
                        <p>
                          Product manager at Atlassian with 6+ years of experience building enterprise SaaS tools. Previously led growth initiatives at two early-stage startups, taking one from beta to 50K monthly active users. Yale graduate with a background in computer science and behavioral economics.
                        </p>
                        <p className="mt-4">
                          Outside of work, I'm passionate about mentoring aspiring PMs and helping career switchers break into tech. I also run a small book club focused on product strategy and organizational design.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <LinkButton size="md" variant="secondary" href="/settings?tab=account">
                          <img src={editIcon} alt="" className="h-[16px] w-[16px]" />
                          Edit bio
                        </LinkButton>
                        <div className="flex items-center gap-1.5">
                          <img src={eyeClosedIcon} alt="" className="h-[16px] w-[16px] shrink-0 brightness-0 opacity-45" />
                          <span className="text-[14px] text-gray-light">Visible to experts you work with</span>
                        </div>
                      </div>
                    </section>

                    {/* Groups */}
                    <section>
                      <h2 className="text-[22px] font-semibold text-gray-dark" style={{ fontWeight: 500 }}>Groups</h2>
                      <div className="mt-3 flex flex-col gap-1">
                        <GroupCard
                          name="AI BP April 26"
                          image={groupImg1}
                          members={18}
                          newPosts={3}
                          to="/groups/ai-bp-apr-26"
                        />
                        <GroupCard
                          name="MBA Admissions 2027"
                          image={groupImg2}
                          members={142}
                          newPosts={12}
                          to="/groups/mba-admissions-2027"
                        />
                        <GroupCard
                          name="Product Management Career Switchers"
                          image={groupImg3}
                          members={87}
                          newPosts={0}
                          to="/groups/pm-career-switchers"
                        />
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="h-[120px]" />
        </div>
      </PageShell>
      </motion.div>

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

      {/* Admin controls — hidden in the unified template, which supplies its
          own coach/customer toggle from the wrapping page. */}
      {!unified && (
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
              {!isCustomerProfile && (
                <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                  <span className="text-[14px] font-medium text-gray-dark">Customer favorite</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showCustomerFavorite}
                      onChange={() => setShowCustomerFavorite(!showCustomerFavorite)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
                    <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              )}
              {!isCustomerProfile && (
                <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                  <span className="text-[14px] font-medium text-gray-dark">Coach video</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showCoachVideo}
                      onChange={() => setShowCoachVideo(!showCoachVideo)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
                    <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              )}
              <label className={`flex items-center justify-between rounded-lg px-2 py-2 transition-colors ${showCoverImage ? "opacity-40" : "cursor-pointer hover:bg-[#f5f5f5]"}`}>
                <span className="text-[14px] font-medium text-gray-dark">Gray header</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showGrayHeader}
                    onChange={() => !showCoverImage && setShowGrayHeader(!showGrayHeader)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[14px] font-medium text-gray-dark">Cover image</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showCoverImage}
                    onChange={() => setShowCoverImage(!showCoverImage)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              {!isCustomerProfile && (
                <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                  <span className="text-[14px] font-medium text-gray-dark">Coach note</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showCoachNote}
                      onChange={() => setShowCoachNote(!showCoachNote)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
                    <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              )}
              {!isCustomerProfile && (
                <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                  <span className="text-[14px] font-medium text-gray-dark">Inline category selector</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={inlineCategory}
                      onChange={() => setInlineCategory(!inlineCategory)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
                    <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              )}
              {!isCustomerProfile && (
                <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                  <span className="text-[14px] font-medium text-gray-dark">Supercoach</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showSupercoach}
                      onChange={() => setShowSupercoach(!showSupercoach)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
                    <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              )}
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[14px] font-medium text-gray-dark">Show sidebar</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showSidebar}
                    onChange={() => setShowSidebar(!showSidebar)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[14px] font-medium text-gray-dark">Viewing own profile</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={viewingOwnProfileState}
                    onChange={() => setViewingOwnProfileState(!viewingOwnProfileState)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#FFD96F]" />
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
      )}

      {!isCustomerProfile && (
        <AllOfferingsModal coachId={coachId} open={allOfferingsOpen} onClose={() => setAllOfferingsOpen(false)} />
      )}
    </>
  );
}
