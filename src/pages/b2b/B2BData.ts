import browseIcon from "../../assets/icons/nav-icons/browse-inactive.svg";
import calendarIcon from "../../assets/icons/nav-icons/calendar-inactive.svg";
import myCoursesIcon from "../../assets/icons/my-courses.svg";
import coursesIcon from "../../assets/icons/nav-icons/courses-inactive.svg";
import documentIcon from "../../assets/icons/document.svg";
import usersIcon from "../../assets/icons/users.svg";

// ── Types ──

export type B2BView =
  | "overview"
  | "utilization"
  | "live-courses"
  | "self-study"
  | "leland-plus"
  | "users"
  | "settings";

export type ModalId =
  | "invite"
  | "grant"
  | "bulk"
  | "admin"
  | "grant-access"
  | "email"
  | null;

export interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "pending" | "invited";
  offerings: string[];
  coach: string;
  matched: string;
  added: string;
  submittedBy: string;
}

export interface UtilRecord {
  id: number;
  name: string;
  offering: string;
  granted: string;
  coach: string;
  matched: string;
  sessionStatus: string;
  sessions: string;
  rating: number | null;
  lastActive: string;
  summary: string;
  review: string;
}

export interface UserOffering {
  id: number;
  sessions: string;
  liveCourse: string;
  selfStudy: string;
  lelandPlus: boolean;
}

export interface NavItem {
  key: B2BView;
  label: string;
  icon: string;
}

// ── Sidebar nav items ──

export const navItems: NavItem[] = [
  { key: "overview", label: "Overview", icon: browseIcon },
  { key: "utilization", label: "1:1 Sessions", icon: calendarIcon },
  { key: "live-courses", label: "Live Courses", icon: myCoursesIcon },
  { key: "self-study", label: "Self-Study Courses", icon: coursesIcon },
  { key: "leland-plus", label: "Leland+", icon: documentIcon },
  { key: "users", label: "Users", icon: usersIcon },
];

// ── Data ──

export const admins = ["Sarah J.", "Tom R.", "Lisa C."];

export const users: User[] = [
  { id: 1, name: "Alex Chen", email: "a-chen@kellogg.edu", status: "active", offerings: ["coaching-ib"], coach: "Sarah M.", matched: "Jan 12", added: "Jan 10", submittedBy: "Sarah J." },
  { id: 2, name: "Maya Rodriguez", email: "m-rodriguez@kellogg.edu", status: "active", offerings: ["coaching-consulting"], coach: "James K.", matched: "Jan 18", added: "Jan 10", submittedBy: "Sarah J." },
  { id: 3, name: "Tyler Johnson", email: "t-johnson@kellogg.edu", status: "active", offerings: ["coaching-pe"], coach: "Lisa P.", matched: "Jan 14", added: "Jan 10", submittedBy: "Tom R." },
  { id: 4, name: "Emma Davis", email: "e-davis@kellogg.edu", status: "active", offerings: ["leland-plus"], coach: "\u2014", matched: "\u2014", added: "Jan 10", submittedBy: "Tom R." },
  { id: 5, name: "Marcus Williams", email: "m-williams@kellogg.edu", status: "pending", offerings: ["coaching-ib"], coach: "Pending", matched: "\u2014", added: "Feb 3", submittedBy: "Lisa C." },
  { id: 6, name: "Priya Patel", email: "p-patel@kellogg.edu", status: "active", offerings: ["bootcamp"], coach: "\u2014", matched: "\u2014", added: "Feb 3", submittedBy: "Lisa C." },
  { id: 7, name: "Jake Thompson", email: "j-thompson@kellogg.edu", status: "active", offerings: ["coaching-consulting"], coach: "Anna W.", matched: "Jan 20", added: "Jan 15", submittedBy: "Sarah J." },
  { id: 8, name: "Sophie Anderson", email: "s-anderson@kellogg.edu", status: "active", offerings: ["coaching-ib"], coach: "Derek H.", matched: "Jan 22", added: "Jan 15", submittedBy: "Sarah J." },
  { id: 9, name: "Ryan Kim", email: "r-kim@kellogg.edu", status: "active", offerings: ["leland-plus"], coach: "\u2014", matched: "\u2014", added: "Jan 20", submittedBy: "Tom R." },
  { id: 10, name: "Natalie Brown", email: "n-brown@kellogg.edu", status: "active", offerings: ["coaching-pe"], coach: "Mike T.", matched: "Feb 1", added: "Jan 20", submittedBy: "Tom R." },
  { id: 11, name: "Chris Lee", email: "c-lee@kellogg.edu", status: "invited", offerings: [], coach: "\u2014", matched: "\u2014", added: "Feb 20", submittedBy: "Lisa C." },
  { id: 12, name: "Aisha Foster", email: "a-foster@kellogg.edu", status: "active", offerings: ["coaching-consulting"], coach: "James K.", matched: "Jan 30", added: "Jan 20", submittedBy: "Sarah J." },
  { id: 13, name: "David Park", email: "d-park@kellogg.edu", status: "active", offerings: ["bootcamp"], coach: "\u2014", matched: "\u2014", added: "Feb 5", submittedBy: "Lisa C." },
  { id: 14, name: "Isabella Martinez", email: "i-martinez@kellogg.edu", status: "pending", offerings: ["leland-plus"], coach: "\u2014", matched: "\u2014", added: "Feb 28", submittedBy: "Tom R." },
  { id: 15, name: "Noah Wilson", email: "n-wilson@kellogg.edu", status: "active", offerings: ["coaching-ib"], coach: "Sarah M.", matched: "Feb 8", added: "Feb 1", submittedBy: "Sarah J." },
  { id: 16, name: "Zoe Taylor", email: "z-taylor@kellogg.edu", status: "pending", offerings: ["coaching-pe"], coach: "Pending", matched: "\u2014", added: "Feb 10", submittedBy: "Tom R." },
  { id: 17, name: "Ethan Harris", email: "e-harris@kellogg.edu", status: "active", offerings: ["coaching-consulting"], coach: "James K.", matched: "Mar 1", added: "Feb 15", submittedBy: "Lisa C." },
  { id: 18, name: "Olivia Moore", email: "o-moore@kellogg.edu", status: "active", offerings: ["leland-plus"], coach: "\u2014", matched: "\u2014", added: "Feb 15", submittedBy: "Lisa C." },
];

export const userOfferings: UserOffering[] = [
  { id: 1, sessions: "2/2", liveCourse: "IB Recruiting", selfStudy: "Financial Modeling", lelandPlus: true },
  { id: 2, sessions: "1/2", liveCourse: "Consulting Recruiting", selfStudy: "\u2014", lelandPlus: true },
  { id: 3, sessions: "2/2", liveCourse: "\u2014", selfStudy: "Case Prep", lelandPlus: false },
  { id: 4, sessions: "0/2", liveCourse: "IB Recruiting", selfStudy: "\u2014", lelandPlus: true },
  { id: 5, sessions: "1/2", liveCourse: "\u2014", selfStudy: "Financial Modeling", lelandPlus: false },
  { id: 6, sessions: "2/2", liveCourse: "Consulting Recruiting", selfStudy: "Case Prep", lelandPlus: true },
  { id: 7, sessions: "0/2", liveCourse: "\u2014", selfStudy: "\u2014", lelandPlus: false },
  { id: 8, sessions: "1/2", liveCourse: "IB Recruiting", selfStudy: "Financial Modeling", lelandPlus: true },
  { id: 9, sessions: "2/2", liveCourse: "\u2014", selfStudy: "Case Prep", lelandPlus: true },
  { id: 10, sessions: "0/2", liveCourse: "Consulting Recruiting", selfStudy: "\u2014", lelandPlus: false },
  { id: 11, sessions: "1/2", liveCourse: "IB Recruiting", selfStudy: "Financial Modeling", lelandPlus: true },
  { id: 12, sessions: "0/2", liveCourse: "\u2014", selfStudy: "\u2014", lelandPlus: false },
  { id: 13, sessions: "2/2", liveCourse: "Consulting Recruiting", selfStudy: "Case Prep", lelandPlus: true },
  { id: 14, sessions: "1/2", liveCourse: "\u2014", selfStudy: "Financial Modeling", lelandPlus: false },
  { id: 15, sessions: "0/2", liveCourse: "IB Recruiting", selfStudy: "\u2014", lelandPlus: true },
  { id: 16, sessions: "2/2", liveCourse: "\u2014", selfStudy: "Case Prep", lelandPlus: true },
  { id: 17, sessions: "1/2", liveCourse: "Consulting Recruiting", selfStudy: "\u2014", lelandPlus: false },
  { id: 18, sessions: "0/2", liveCourse: "\u2014", selfStudy: "Financial Modeling", lelandPlus: true },
];

export const offeringLabels: Record<string, { label: string; track: string; dotClass: string; pillClass: string }> = {
  "coaching-ib": { label: "1:1 Coaching", track: "Investment Banking", dotClass: "bg-primary", pillClass: "green" },
  "coaching-pe": { label: "1:1 Coaching", track: "Private Equity", dotClass: "bg-blue", pillClass: "blue" },
  "coaching-consulting": { label: "1:1 Coaching", track: "Consulting", dotClass: "bg-[#2d25a6]", pillClass: "purple" },
  "leland-plus": { label: "Leland+", track: "Annual", dotClass: "bg-orange", pillClass: "orange" },
  bootcamp: { label: "IB Bootcamp", track: "8-week program", dotClass: "", pillClass: "dark" },
};

export const sessionStatusPills: Record<string, string> = {
  "Submitted form": "gray",
  "Created Leland account": "blue",
  "Matched with coach": "orange",
  "Scheduled session": "purple",
  "Completed session": "green",
};

export const statusLabels: Record<string, { label: string; pillVariant: string }> = {
  active: { label: "Active", pillVariant: "green" },
  pending: { label: "Pending match", pillVariant: "orange" },
  invited: { label: "Invite sent", pillVariant: "gray" },
};

export const utilData: UtilRecord[] = [
  { id: 1, name: "Alex Chen", offering: "coaching-ib", granted: "Jan 10", coach: "Sarah M.", matched: "Jan 12", sessionStatus: "Completed session", sessions: "1/1", rating: 5.0, lastActive: "Today", summary: "Worked on LBO modeling fundamentals, pitch deck storytelling, and technical interview prep. Strong candidate for BB positions.", review: "" },
  { id: 2, name: "Maya Rodriguez", offering: "coaching-consulting", granted: "Jan 10", coach: "James K.", matched: "Jan 18", sessionStatus: "Scheduled session", sessions: "1/1", rating: null, lastActive: "Mar 1", summary: "Session in progress. Focused on market sizing and structuring frameworks.", review: "" },
  { id: 3, name: "Tyler Johnson", offering: "coaching-pe", granted: "Jan 10", coach: "Lisa P.", matched: "Jan 14", sessionStatus: "Completed session", sessions: "1/1", rating: 5.0, lastActive: "Feb 22", summary: "Covered deal sourcing, fund strategy, and portco modeling. Candidate is well-prepared for on-cycle process.", review: "" },
  { id: 4, name: "Emma Davis", offering: "leland-plus", granted: "Jan 10", coach: "\u2014", matched: "\u2014", sessionStatus: "Completed session", sessions: "\u2014", rating: null, lastActive: "Today", summary: "22 resources accessed across Finance and PE categories. High engagement with interview guides.", review: "" },
  { id: 5, name: "Marcus Williams", offering: "coaching-ib", granted: "Feb 3", coach: "Pending", matched: "\u2014", sessionStatus: "Submitted form", sessions: "0/1", rating: null, lastActive: "\u2014", summary: "Pending coach match. No session scheduled yet.", review: "" },
  { id: 6, name: "Priya Patel", offering: "bootcamp", granted: "Feb 3", coach: "\u2014", matched: "\u2014", sessionStatus: "Scheduled session", sessions: "3/8 wk", rating: null, lastActive: "Today", summary: "Week 3 of 8-week IB Bootcamp. Completed modules: Accounting, Valuation basics, DCF. Upcoming: LBO.", review: "" },
  { id: 7, name: "Jake Thompson", offering: "coaching-consulting", granted: "Jan 15", coach: "Anna W.", matched: "Jan 20", sessionStatus: "Completed session", sessions: "1/1", rating: 4.5, lastActive: "Feb 18", summary: "Worked on consulting frameworks, behavioral stories, and firm fit questions. Ready for MBB first rounds.", review: "" },
  { id: 8, name: "Sophie Anderson", offering: "coaching-ib", granted: "Jan 15", coach: "Derek H.", matched: "Jan 22", sessionStatus: "Completed session", sessions: "1/1", rating: 4.7, lastActive: "Feb 14", summary: "Focused on networking strategy, story crafting, and technicals. Coach recommends follow-up session before super day.", review: "" },
  { id: 9, name: "Ryan Kim", offering: "leland-plus", granted: "Jan 20", coach: "\u2014", matched: "\u2014", sessionStatus: "Completed session", sessions: "\u2014", rating: null, lastActive: "Mar 1", summary: "8 resources accessed. Primarily using case interview guides and consulting resume templates.", review: "" },
  { id: 10, name: "Natalie Brown", offering: "coaching-pe", granted: "Jan 20", coach: "Mike T.", matched: "Feb 1", sessionStatus: "Scheduled session", sessions: "1/1", rating: null, lastActive: "Mar 1", summary: "Session in progress. Covering on-cycle PE recruiting timeline and fund strategy.", review: "" },
  { id: 11, name: "Chris Lee", offering: "\u2014", granted: "\u2014", coach: "\u2014", matched: "\u2014", sessionStatus: "Submitted form", sessions: "\u2014", rating: null, lastActive: "\u2014", summary: "Invite pending. User has not yet created a Leland account.", review: "" },
  { id: 12, name: "Aisha Foster", offering: "coaching-consulting", granted: "Jan 20", coach: "James K.", matched: "Jan 30", sessionStatus: "Completed session", sessions: "1/1", rating: 5.0, lastActive: "Feb 24", summary: "Exceptional session. Worked through 3 full cases with expert feedback. Strong recommendation for MBB internships.", review: "" },
  { id: 13, name: "David Park", offering: "bootcamp", granted: "Feb 5", coach: "\u2014", matched: "\u2014", sessionStatus: "Scheduled session", sessions: "1/8 wk", rating: null, lastActive: "Feb 26", summary: "Week 1 of 8-week IB Bootcamp. Completed orientation and accounting module.", review: "" },
  { id: 14, name: "Isabella Martinez", offering: "leland-plus", granted: "Feb 28", coach: "\u2014", matched: "\u2014", sessionStatus: "Created Leland account", sessions: "\u2014", rating: null, lastActive: "\u2014", summary: "Leland+ granted Feb 28. Account not yet activated.", review: "" },
  { id: 15, name: "Noah Wilson", offering: "coaching-ib", granted: "Feb 1", coach: "Sarah M.", matched: "Feb 8", sessionStatus: "Completed session", sessions: "1/1", rating: 4.3, lastActive: "Feb 20", summary: "Covered resume gaps and IB deal flow discussion. Coach suggested additional prep on technical questions.", review: "" },
  { id: 16, name: "Zoe Taylor", offering: "coaching-pe", granted: "Feb 10", coach: "Pending", matched: "\u2014", sessionStatus: "Matched with coach", sessions: "0/1", rating: null, lastActive: "\u2014", summary: "Pending coach match. Granted Feb 10.", review: "" },
  { id: 17, name: "Ethan Harris", offering: "coaching-consulting", granted: "Feb 15", coach: "James K.", matched: "Mar 1", sessionStatus: "Scheduled session", sessions: "1/1", rating: null, lastActive: "Mar 1", summary: "Session scheduled for today at 3 PM. First session \u2014 case prep focus.", review: "" },
  { id: 18, name: "Olivia Moore", offering: "leland-plus", granted: "Feb 15", coach: "\u2014", matched: "\u2014", sessionStatus: "Completed session", sessions: "\u2014", rating: null, lastActive: "Mar 1", summary: "22 resources accessed. Most engaged user on Leland+. Favorite categories: PE deal analysis, valuation comps.", review: "" },
];
