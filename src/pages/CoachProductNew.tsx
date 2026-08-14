import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import { Button } from "../components/Button";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import crownIcon from "../assets/icons/crown-membership.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import stackIcon from "../assets/icons/stack.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import lteSignalIcon from "../assets/icons/lte-signal.svg";
import aiIcon from "../assets/icons/ai.svg";
import moneyIcon from "../assets/icons/money.svg";
import browseIcon from "../assets/icons/nav-icons/browse-inactive.svg";
import storeIcon from "../assets/icons/store.svg";
import freeIcon from "../assets/icons/free.svg";
import eyeIcon from "../assets/icons/eye.svg";
import eyeClosedIcon from "../assets/icons/eye-closed.svg";
import coverImage9 from "../assets/img/cover-images/cover-image-9.png";
import libThumb1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import libThumb2 from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";
import libThumb3 from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";
import libThumb4 from "../assets/placeholder images/placeholder-event-01.png";
import libThumb5 from "../assets/placeholder images/placeholder-event-02.png";
import libThumb6 from "../assets/placeholder images/placeholder-event-03.png";
import libThumb7 from "../assets/placeholder images/bootcamp-1.webp";
import libThumb8 from "../assets/placeholder images/bootcamp-2.webp";
import samanthaPhoto from "../assets/profile photos/pic-6.png";
import reviewPhoto1 from "../assets/profile photos/pic-1.png";
import reviewPhoto2 from "../assets/profile photos/pic-2.png";
import reviewPhoto3 from "../assets/profile photos/pic-3.png";
import reviewPhoto4 from "../assets/profile photos/pic-4.png";
import reviewPhoto5 from "../assets/profile photos/pic-7.png";
import labelTagIcon from "../assets/icons/label-tag.svg";
import uploadIcon from "../assets/icons/upload.svg";
import attachIcon from "../assets/icons/attach.svg";
import trashIcon from "../assets/icons/trash.svg";
import editIcon from "../assets/icons/edit.svg";
import editFilledIcon from "../assets/icons/edit-filled.svg";
import infoFilledIcon from "../assets/icons/info-filled.svg";
import dotsVerticalIcon from "../assets/icons/dots-vertical.svg";
import dragDotsIcon from "../assets/icons/drag-dots.svg";
import globeIcon from "../assets/icons/globe.svg";
import textIcon from "../assets/icons/text.svg";
import helpIcon from "../assets/icons/help.svg";
import photoIcon from "../assets/icons/photo.svg";
import starIcon from "../assets/icons/star-icon.svg";
import starFilledIcon from "../assets/icons/star.svg";
import checkmarkBadgeIcon from "../assets/icons/checkmark-badge.svg";
import checkmarkFilledIcon from "../assets/icons/checkmark-filled.svg";
import giftIcon from "../assets/icons/gift.svg";
import lightBulbIcon from "../assets/icons/light-bulb.svg";
import packageBoxOpenIcon from "../assets/icons/package-box-open.svg";

type StepKey = "product" | "offerings" | "page";

// Setup-flow version, toggled from the admin menu. v1: add products, then set a
// price. v2: each product carries its own price and the option shows a roll-up
// (subtotal → discount → total). Provided via context so deeply-nested config
// fields and the roll-up can read it without prop-drilling.
const V2Context = createContext(false);
const useV2 = () => useContext(V2Context);

// Product types that carry a price in v2 (everything with a real config modal;
// placeholder types like Agent / Private group are excluded).
const PRICEABLE = ["coaching-time", "content", "collection", "course", "paid-livestream"];
const isPriceable = (slug: string) => PRICEABLE.includes(slug);

// A single pricing option under "Paid access". Each option bundles its own set
// of products (referenced by OfferingItem id) and its own billing settings.
type PricingOption = {
  id: number;
  name: string;   // shown/edited only when there is more than one option
  description: string;   // optional blurb shown under the option name
  access: "free" | "paid";  // per-option access mode
  billing: "recurring" | "one-time";
  price: string;
  interval: string;   // e.g. "1 month" — only meaningful when billing === "recurring"
  currency: string;   // e.g. "USD"
  freeTrial: boolean;
  trialLength: string;
  acceptLocalCurrency: boolean;
  customizePaymentMethods: boolean;
  productIds: number[];
  // v1: lock the price to the coach's hourly rate (only when the offering is a
  // single hourly coaching-time product).
  syncHourly: boolean;
  // v2 roll-up discount applied to the option's product subtotal.
  discountType: "percent" | "flat";
  discountValue: string;
};

const newPricingOption = (id: number): PricingOption => ({
  id,
  name: "",
  description: "",
  access: "free",
  billing: "one-time",
  price: "0.00",
  interval: "1 month",
  currency: "USD",
  freeTrial: false,
  trialLength: "7",
  acceptLocalCurrency: false,
  customizePaymentMethods: false,
  productIds: [],
  syncHourly: false,
  discountType: "percent",
  discountValue: "",
});

const STEPS: { key: StepKey; label: string; icon: string }[] = [
  { key: "offerings", label: "Products", icon: moneyIcon },
  { key: "product", label: "Details", icon: textIcon },
  { key: "page", label: "Page", icon: storeIcon },
];

// Mask-tinted icon so it follows the surrounding text color (bg-current).
function MaskIcon({ src, className = "h-[18px] w-[18px]" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

// Offering types the coach can bundle into a product. Reuses the existing
// product-type icons.
const offeringTypes = [
  { slug: "coaching-time", label: "Coaching time", blurb: "Book 1:1 sessions with you", icon: hourglassIcon },
  { slug: "content", label: "Content", blurb: "Guides, templates, videos", icon: bookOpenIcon },
  { slug: "collection", label: "Collection", blurb: "Group products into a bundle", icon: stackIcon },
  { slug: "course", label: "Course", blurb: "Structured multi-lesson course", icon: myCoursesIcon },
  { slug: "paid-livestream", label: "Livestream", blurb: "Host a paid live session", icon: lteSignalIcon },
  { slug: "agent", label: "Agent", blurb: "An AI assistant trained on you", icon: aiIcon },
  { slug: "membership", label: "Private group", blurb: "A private community for members", icon: crownIcon },
];
const offeringBySlug = Object.fromEntries(offeringTypes.map((o) => [o.slug, o]));

// Fuller descriptions for the v2 "add a product" list (the initial state).
const offeringAddDescription: Record<string, string> = {
  "coaching-time": "Sell 1:1 time, priced automatically from your hourly rate.",
  content: "Share a guide, template, video, or other resource.",
  collection: "Bundle multiple resources together.",
  course: "Create a structured, multi-lesson course.",
  "paid-livestream": "Host a live, group session.",
  agent: "An AI assistant trained on your expertise.",
  membership: "Give members access to a private community.",
};

// The kinds of section a coach can add to the customer-facing page.
type PageSectionKind = "text" | "faqs" | "checklist" | "media" | "reviews";

// A single Q&A pair inside a FAQs section.
type FaqItem = { id: number; question: string; answer: string };

// A single checkmark line inside a checklist section.
type ChecklistItem = { id: number; text: string };

// A configured page section. Each kind carries its own content shape; the
// discriminant `kind` narrows to the right fields.
type PageSection =
  | { id: number; kind: "text"; heading: string; body: string }
  | { id: number; kind: "faqs"; heading: string; faqs: FaqItem[] }
  | { id: number; kind: "checklist"; heading: string; items: ChecklistItem[] }
  | { id: number; kind: "media"; heading: string; fileName: string }
  | { id: number; kind: "reviews"; heading: string; slots: (number | null)[] };

// Section types a coach can add to the customer-facing page. `kind` maps to the
// PageSection built when the button is clicked.
const pageSectionTypes: { kind: PageSectionKind; label: string; icon: string }[] = [
  { kind: "text", label: "Text", icon: textIcon },
  { kind: "checklist", label: "Checklist", icon: checkmarkBadgeIcon },
  { kind: "media", label: "Media", icon: photoIcon },
  { kind: "reviews", label: "Reviews", icon: starIcon },
  { kind: "faqs", label: "FAQs", icon: helpIcon },
];

// Up to this many checkmark lines per checklist section.
const MAX_CHECKLIST_ITEMS = 10;

// A blank section of the given kind, ready to edit.
function newPageSection(kind: PageSectionKind, id: number): PageSection {
  switch (kind) {
    case "text": return { id, kind, heading: "", body: "" };
    case "faqs": return { id, kind, heading: "", faqs: [{ id: 1, question: "", answer: "" }] };
    case "checklist": return { id, kind, heading: "", items: [{ id: 1, text: "" }] };
    case "media": return { id, kind, heading: "", fileName: "" };
    case "reviews": return { id, kind, heading: "", slots: [] };
  }
}

// The coach's existing reviews, offered up when featuring reviews on the page.
const existingReviews: { id: number; name: string; photo: string; role: string; date: string; rating: number; text: string; accepted?: string }[] = [
  { id: 1, name: "Jordan Reyes", photo: reviewPhoto1, role: "MBA Admissions", date: "May 2026", rating: 5, text: "Samantha completely reshaped my application strategy. She helped me completely restructure my essays and think about my story in a way I never would have on my own. I got into my top-choice program and I genuinely don't think I could have done it without her.", accepted: "Accepted to Stanford University" },
  { id: 2, name: "Priya Natarajan", photo: reviewPhoto2, role: "Interview Prep", date: "Apr 2026", rating: 5, text: "The mock interviews were incredibly realistic. We did multiple rounds and she gave sharp, specific feedback each time. I walked into every real interview feeling calm and prepared.", accepted: "Accepted to Harvard Business School" },
  { id: 3, name: "Marcus Webb", photo: reviewPhoto3, role: "Essay Coaching", date: "Mar 2026", rating: 5, text: "Clear, direct feedback on my essays. She helped me find the story I didn't know I had and pushed me to make every sentence count.", accepted: "Accepted to Wharton" },
  { id: 4, name: "Elena Fischer", photo: reviewPhoto4, role: "MBA Admissions", date: "Feb 2026", rating: 4, text: "Great structure and accountability throughout the process. Highly recommend for anyone applying — she kept me on track the whole way.", accepted: "Accepted to Kellogg" },
  { id: 5, name: "David Okafor", photo: reviewPhoto5, role: "Career Coaching", date: "Jan 2026", rating: 5, text: "Worth every penny — the coaching went far beyond admissions into real career guidance. She connected me with current students so I could ask questions before committing.", accepted: "Accepted to Booth" },
];

// A course section — placeholder builder for now (just a name).
type CourseSection = { id: number; name: string };

// An item inside a list offering. Collections use `config` as content config;
// courses use `config` for a lesson's name/description and `sections` for its
// ordered sections.
type CollectionItem = { id: number; config: Record<string, string>; sections?: CourseSection[] };

// What's selected in the course modal sidebar.
type CourseSelection = { type: "general" } | { type: "lesson"; lessonId: number } | { type: "section"; lessonId: number; sectionId: number };

// A configured offering added to the product. `config` holds the type-specific
// settings (shape owned by each type's fields component); `configured` flips to
// true once setup is saved. `items` is used by collections (resources) and
// courses (lessons).
type OfferingItem = { id: number; slug: string; config: Record<string, string>; configured: boolean; items?: CollectionItem[] };

// Ids are derived from the existing list (max + 1) so they can't collide — even
// if module state resets under HMR.
const newCollectionItem = (existing: CollectionItem[]): CollectionItem => ({
  id: existing.reduce((max, r) => Math.max(max, r.id), 0) + 1,
  config: defaultConfigFor("content"),
});
const newCourseLesson = (existing: CollectionItem[]): CollectionItem => ({
  id: existing.reduce((max, r) => Math.max(max, r.id), 0) + 1,
  config: { title: "", description: "" },
  sections: [],
});
const newCourseSection = (existing: CourseSection[]): CourseSection => ({
  id: existing.reduce((max, s) => Math.max(max, s.id), 0) + 1,
  name: "",
});

// Per-type default config. A slug present here is "configurable": its added row
// gets a CTA that opens the config modal (see OfferingConfigFields). Add an
// entry to give another offering type its own configuration.
const configDefaults: Record<string, Record<string, string>> = {
  "coaching-time": { mode: "set", hours: "", minutes: "", minHours: "", maxHours: "", delivery: "" },
  content: { assetName: "", title: "", description: "", downloadable: "false", attachFile: "false", attachmentName: "", resourceType: "guide", lelandPlus: "false", anonymous: "false" },
  collection: { title: "", description: "" },
  course: { title: "", description: "" },
  "paid-livestream": { name: "", description: "", subcategories: "", lelandPlus: "false", duration: "30", date: "", time: "", coverName: "" },
  // Placeholder offerings — configuration TBD, so their config is empty and
  // they're always "complete" (see isConfigComplete's default).
  agent: {},
  membership: {},
};

// "List" offerings use the sidebar + content-pane modal (a General tab plus an
// ordered list of content items). Each defines its modal heading and the noun
// for its items.
const listOfferingCopy: Record<string, { heading: string; noun: string }> = {
  collection: { heading: "Collection", noun: "resource" },
  course: { heading: "Course", noun: "lesson" },
};
const isListOffering = (slug: string) => slug in listOfferingCopy;
const defaultConfigFor = (slug: string): Record<string, string> => ({ ...(configDefaults[slug] ?? {}) });
const isConfigurable = (slug: string) => slug in configDefaults;

// Subheadline shown under the modal title for each configurable type.
const configPrompts: Record<string, string> = {
  "coaching-time": "How much time do you want to include?",
  content: "Upload your file and add the details.",
  "paid-livestream": "Schedule and set up your livestream.",
};

// Unfinished-state CTA (label + optional icon) shown on the added row. The
// finished state always uses a gray "Edit" button.
const configCTA: Record<string, { label: string; icon?: string }> = {
  "coaching-time": { label: "Configure" },
  content: { label: "Configure" },
  collection: { label: "Configure" },
  course: { label: "Configure" },
  "paid-livestream": { label: "Configure" },
  agent: { label: "Configure" },
  membership: { label: "Configure" },
};

// Unfinished-state subtext for the added row (falls back to a generic nudge).
const configUnfinishedText: Record<string, string> = {
  collection: "Group a bundle of related content",
};

const RESOURCE_TYPES = [
  { value: "guide", label: "Guide" },
  { value: "example", label: "Example" },
  { value: "template", label: "Template" },
  { value: "practice", label: "Practice" },
  { value: "tool", label: "Tool" },
];

// Previously-uploaded content the coach can reuse in a new content/collection
// item (mock library for the prototype).
type LibraryContent = { id: string; name: string; kind: "pdf" | "doc" | "video" | "image"; title: string; description: string; resourceType: string; size: string; date: string; thumb: string; views: number; price: number };
// Bucket a view count, e.g. 4210 → "4.2k", 980 → "980".
const formatViews = (n: number): string => (n < 1000 ? String(n) : `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`);
const CONTENT_LIBRARY: LibraryContent[] = [
  { id: "c1", name: "MBA Essay Framework.pdf", kind: "pdf", title: "MBA Essay Framework", description: "A step-by-step framework for structuring standout MBA essays.", resourceType: "guide", size: "2.4 MB", date: "Mar 12", thumb: libThumb1, views: 4210, price: 18 },
  { id: "c2", name: "Consulting Resume Template.docx", kind: "doc", title: "Consulting Resume Template", description: "The exact resume template I used to land offers at McKinsey and Bain.", resourceType: "template", size: "180 KB", date: "Feb 28", thumb: libThumb2, views: 8940, price: 12 },
  { id: "c3", name: "Mock Interview Walkthrough.mp4", kind: "video", title: "Mock Interview Walkthrough", description: "A full recording of a mock case interview with live feedback.", resourceType: "example", size: "412 MB", date: "Feb 10", thumb: libThumb3, views: 2180, price: 29 },
  { id: "c4", name: "50 Behavioral Questions.pdf", kind: "pdf", title: "50 Behavioral Questions", description: "The most common behavioral questions and how to answer them.", resourceType: "practice", size: "1.1 MB", date: "Jan 22", thumb: libThumb4, views: 12530, price: 9 },
  { id: "c5", name: "School Selection Worksheet.xlsx", kind: "doc", title: "School Selection Worksheet", description: "Compare programs across the factors that actually matter.", resourceType: "tool", size: "96 KB", date: "Jan 8", thumb: libThumb5, views: 1760, price: 7 },
  { id: "c6", name: "Networking Email Scripts.pdf", kind: "pdf", title: "Networking Email Scripts", description: "Copy-paste templates for reaching out to alumni and recruiters.", resourceType: "template", size: "640 KB", date: "Dec 15", thumb: libThumb6, views: 6020, price: 11 },
  { id: "c7", name: "GMAT Study Plan (90 Days).pdf", kind: "pdf", title: "GMAT Study Plan — 90 Days", description: "A week-by-week plan to go from baseline to a 730+ score.", resourceType: "guide", size: "1.8 MB", date: "Dec 2", thumb: libThumb7, views: 9380, price: 22 },
  { id: "c8", name: "Case Interview Frameworks.pdf", kind: "pdf", title: "Case Interview Frameworks", description: "The core frameworks for cracking any consulting case.", resourceType: "guide", size: "3.2 MB", date: "Nov 20", thumb: libThumb8, views: 15110, price: 25 },
  { id: "c9", name: "Sample Stanford Essay.pdf", kind: "pdf", title: "Sample Stanford GSB Essay", description: "An annotated admitted essay with commentary on what worked.", resourceType: "example", size: "820 KB", date: "Nov 8", thumb: libThumb1, views: 3640, price: 15 },
  { id: "c10", name: "Cover Letter Template.docx", kind: "doc", title: "Cover Letter Template", description: "A flexible cover letter template for any role.", resourceType: "template", size: "72 KB", date: "Oct 30", thumb: libThumb2, views: 5290, price: 8 },
  { id: "c11", name: "Company Research Tracker.xlsx", kind: "doc", title: "Company Research Tracker", description: "Track your target firms, contacts, and application status.", resourceType: "tool", size: "110 KB", date: "Oct 18", thumb: libThumb3, views: 980, price: 6 },
  { id: "c12", name: "Behavioral Prep Walkthrough.mp4", kind: "video", title: "Behavioral Prep Walkthrough", description: "How to build a bank of stories using the STAR method.", resourceType: "example", size: "356 MB", date: "Oct 4", thumb: libThumb4, views: 7450, price: 27 },
  { id: "c13", name: "Recommendation Letter Guide.pdf", kind: "pdf", title: "Recommendation Letter Guide", description: "How to brief your recommenders for the strongest letters.", resourceType: "guide", size: "540 KB", date: "Sep 22", thumb: libThumb5, views: 4870, price: 14 },
  { id: "c14", name: "Networking Tracker.xlsx", kind: "doc", title: "Networking Tracker", description: "Stay on top of coffee chats, follow-ups, and referrals.", resourceType: "tool", size: "88 KB", date: "Sep 10", thumb: libThumb6, views: 1320, price: 5 },
  { id: "c15", name: "Practice Case: Market Entry.pdf", kind: "pdf", title: "Practice Case — Market Entry", description: "A full market-entry case with a sample answer key.", resourceType: "practice", size: "1.3 MB", date: "Aug 28", thumb: libThumb7, views: 6610, price: 19 },
  { id: "c16", name: "Wharton Interview Debrief.mp4", kind: "video", title: "Wharton Team-Based Discussion Debrief", description: "A walkthrough of the TBD format and how to stand out.", resourceType: "example", size: "298 MB", date: "Aug 14", thumb: libThumb8, views: 2940, price: 32 },
];
// Effective title of a content item, respecting its mode (uploaded vs reused).
const contentItemTitle = (c: Record<string, string>): string =>
  c.source === "reuse" ? (c.r_title || CONTENT_LIBRARY.find((l) => l.id === c.libraryId)?.title || "") : (c.title || "");

// File-type label + view count for a content item's row detail. Reused library
// items carry both; a fresh upload only has a file name, so we infer the type
// from its extension and have no views to show.
const CONTENT_KIND_LABEL: Record<string, string> = { pdf: "PDF", doc: "Doc", docx: "Doc", xlsx: "Doc", video: "Video", mp4: "Video", mov: "Video", image: "Image", png: "Image", jpg: "Image", jpeg: "Image" };
function contentMeta(c: Record<string, string>): { typeLabel: string | null; views: number | null } {
  const lib = c.libraryId ? CONTENT_LIBRARY.find((l) => l.id === c.libraryId) : null;
  if (lib) return { typeLabel: CONTENT_KIND_LABEL[lib.kind] ?? null, views: lib.views };
  const ext = (c.assetName || "").split(".").pop()?.toLowerCase() ?? "";
  return { typeLabel: CONTENT_KIND_LABEL[ext] ?? (ext ? ext.toUpperCase() : null), views: null };
}

// MBA subcategories a livestream can be tagged with (maps to Leland categories).
const MBA_SUBCATEGORIES = ["Deferred MBA", "Executive MBA", "JD/MBA", "Online MBA", "Part-Time MBA", "Traditional Full-Time MBA"];

const LIVESTREAM_DURATIONS = [
  { value: "30", label: "30 minutes — Most popular" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "75", label: "1 hour 15 minutes" },
  { value: "90", label: "1 hour 30 minutes" },
  { value: "105", label: "1 hour 45 minutes" },
  { value: "120", label: "2 hours" },
];

// How coaching time is delivered. Async carries an explanatory tooltip.
const deliveryFormats: { value: string; label: string; info?: string }[] = [
  { value: "live", label: "Live Sessions" },
  { value: "async", label: "Asynchronous Coaching", info: "Asynchronous coaching is done offline, rather than in live sessions. It can be great for editing, document feedback, or any work that doesn't require live collaboration." },
  { value: "mix", label: "Mix of Live and Asynchronous" },
];
const deliveryLabel = (v: string) => deliveryFormats.find((d) => d.value === v)?.label;

// Whether a configurable offering has enough filled in to be saved as finished.
function isConfigComplete(item: OfferingItem): boolean {
  const c = item.config;
  if (item.slug === "coaching-time") {
    return c.mode === "range" ? Boolean(c.minHours && c.maxHours) : Boolean(c.hours || c.minutes);
  }
  if (item.slug === "content") {
    return c.source === "reuse" ? Boolean(c.libraryId) : Boolean(c.assetName && c.title);
  }
  if (item.slug === "paid-livestream") {
    return Boolean(c.name && c.date && c.time);
  }
  if (isListOffering(item.slug)) {
    return Boolean(c.title) && (item.items?.length ?? 0) > 0;
  }
  return true;
}

// One-line summary of a finished offering's config, shown under its title.
function configSummary(item: OfferingItem): string {
  const c = item.config;
  if (item.slug === "coaching-time") {
    if (c.mode === "range") return `${c.minHours}–${c.maxHours} hours of coaching`;
    const parts: string[] = [];
    if (c.hours) parts.push(`${c.hours} hr`);
    if (c.minutes && c.minutes !== "0") parts.push(`${c.minutes} min`);
    return `${parts.join(" ") || "0 min"} of coaching`;
  }
  if (item.slug === "content") {
    if (c.source === "reuse") return c.r_title || CONTENT_LIBRARY.find((l) => l.id === c.libraryId)?.title || "";
    return c.assetName;
  }
  if (item.slug === "paid-livestream") {
    return c.name;
  }
  if (isListOffering(item.slug)) {
    const n = item.items?.length ?? 0;
    const noun = listOfferingCopy[item.slug].noun;
    return `${n} ${n === 1 ? noun : `${noun}s`}`;
  }
  if (item.slug === "agent" || item.slug === "membership") {
    return offeringBySlug[item.slug].blurb;
  }
  return "";
}

// Optional leading icon shown before a finished offering's summary text.
const configSummaryIcon: Record<string, string> = {
  content: attachIcon,
};

// Subtle fade + slide: up on enter, downward on exit.
const stepMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const },
};

// Height/opacity transition for the "Added" list. Rows animate their own
// height, so everything below reflows smoothly in normal document flow.
const offeringTransition = { duration: 0.26, ease: [0.25, 0.1, 0.25, 1] as const };

// Matches the toggle used in the top-nav profile dropdown.
function Toggle({ checked, onChange, size = "md" }: { checked: boolean; onChange: () => void; size?: "sm" | "md" }) {
  const sm = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative shrink-0 rounded-full transition-colors ${sm ? "h-5 w-9" : "h-6 w-11"} ${checked ? "bg-[#222222]" : "bg-[#d9d9d9]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 rounded-full bg-white transition-transform ${sm ? "h-4 w-4" : "h-5 w-5"} ${checked ? (sm ? "translate-x-4" : "translate-x-5") : ""}`} />
    </button>
  );
}

function CharField({
  label,
  required,
  value,
  onChange,
  placeholder,
  max,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  max: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[14px] font-medium text-gray-light">
        {label}
        {required && <span className="text-[#E5484D]"> *</span>}
      </label>
      <input
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
      />
      <p className="mt-1 text-right text-[12px] text-[#999999]">{value.length} / {max}</p>
    </div>
  );
}

// Collapsible settings block used for "Plan settings" / "Product settings".
function Collapsible({ title, subtitle, defaultOpen = false, children }: { title: string; subtitle?: string; defaultOpen?: boolean; children?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={subtitle ? "border-b border-gray-stroke pb-6" : "rounded-xl bg-[#F7F7F7]"}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between ${subtitle ? "" : "px-4 py-3"}`}
      >
        <span className="text-left">
          <span className={`block ${subtitle ? "text-[22px] font-semibold" : "text-[15px] font-medium"} text-gray-dark`}>{title}</span>
          {subtitle && <span className="mt-0.5 block text-[15px] text-gray-light">{subtitle}</span>}
        </span>
        <svg className={`h-5 w-5 shrink-0 text-gray-dark transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
            <div className={subtitle ? "pt-4" : "px-4 pb-4"}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Controlled checkbox.
function CheckBox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-2.5 text-[14px] font-medium text-gray-dark">
      <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${checked ? "border-gray-dark bg-gray-dark" : "border-gray-stroke bg-white"}`}>
        {checked && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        )}
      </span>
      {label}
    </button>
  );
}

// Custom select — a trigger with a chevron and a menu that opens below. Options
// may carry an `info` string, shown as a hoverable "i" tooltip in the menu.
function Select({ value, onChange, options, placeholder, className = "", triggerClassName = "py-2.5 pl-3.5 pr-3 text-[14px]" }: { value: string; onChange: (v: string) => void; options: { value: string; label: string; info?: string }[]; placeholder?: string; className?: string; triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Menu is portaled to the body so it isn't clipped by any overflow-hidden
  // ancestor (e.g. the collapsing "Product settings" panel). Position is
  // measured from the trigger each time the menu opens.
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0 });
  const selected = options.find((o) => o.value === value);
  // Info tooltips escape the menu, so don't clip when any option has one.
  const hasInfo = options.some((o) => o.info);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 6, width: r.width });
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border border-gray-stroke bg-white text-left transition-colors hover:border-[#c9c9c9] ${selected ? "text-gray-dark" : "text-[#B1B1B1]"} ${triggerClassName}`}
      >
        <span className="truncate">{selected?.label ?? placeholder ?? value}</span>
        <svg className={`h-4 w-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && createPortal(
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[100] cursor-default" onClick={() => setOpen(false)} />
          <div
            className={`fixed z-[110] rounded-xl border border-gray-stroke bg-white p-1 shadow-[0_4px_16px_rgba(16,24,40,0.12)] ${hasInfo ? "overflow-visible" : "max-h-[280px] overflow-auto"}`}
            style={{ left: pos.left, top: pos.top, width: pos.width }}
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[14px] transition-colors hover:bg-gray-hover ${active ? "font-semibold text-gray-dark" : "font-medium text-gray-dark"}`}
                >
                  <span className="truncate">{o.label}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    {o.info && (
                      <span className="group/info relative flex" onClick={(e) => e.stopPropagation()}>
                        <svg className="h-4 w-4 text-gray-light transition-colors hover:text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                        <span role="tooltip" className="pointer-events-none absolute bottom-full right-0 z-[120] mb-2 hidden w-max max-w-[280px] rounded-lg bg-gray-dark px-3 py-2 text-[12px] font-medium leading-snug text-white shadow-[0_4px_16px_rgba(16,24,40,0.18)] group-hover/info:block">
                          {o.info}
                        </span>
                      </span>
                    )}
                    {active && <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                  </span>
                </button>
              );
            })}
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}

// Toggle row used in the floating admin tool.
function AdminToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-gray-hover">
      <span className="text-[14px] font-medium text-gray-dark">{label}</span>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
        <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

export default function CoachProductNew() {
  const { category } = useParams<{ category: string; type?: string }>();
  const navigate = useNavigate();

  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const [step, setStep] = useState<StepKey>("offerings");

  // Shared product-in-progress state, reflected live in the preview.
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  // Always keep at least one pricing option. Each option is a self-contained
  // unit: name + its own products + its own access (free/paid) + price.
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>(() => [newPricingOption(0)]);
  const nextPricingId = useRef(1);
  // v2: whether the offering has multiple pricing options (tabs). Off collapses
  // back to a single option.
  const [multiEnabled, setMultiEnabled] = useState(false);
  const [added, setAdded] = useState<OfferingItem[]>([]);
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Purchase");
  // Thumbnail image (demo-only object URL) — set on the Details step, previewed
  // in the sidebar card and on the Page step.
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const nextOfferingId = useRef(0);
  const nextSectionId = useRef(0);

  // Admin tool — MVP on shows the full feature set; off hides not-yet-built bits.
  const [mvp, setMvp] = useState(true);
  // Setup-flow version: v1 (current) or v2 (per-product prices + roll-up).
  const [version, setVersion] = useState<"v1" | "v2">("v2");
  const v2 = version === "v2";
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adminOpen) return;
    const onDown = (e: MouseEvent) => { if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [adminOpen]);

  useEffect(() => {
    document.title = "Leland Prototype | Add offering";
  }, []);

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const isLast = stepIndex === STEPS.length - 1;

  const close = () => setPendingNav(`/coach/manage/${category}`);
  const next = () => {
    if (isLast) close();
    else setStep(STEPS[stepIndex + 1].key);
  };

  // Whether the preview column is in the DOM — true while a product exists and
  // stays true through the column's exit animation (cleared on exit-complete).
  // The main column keeps its two-column width until the preview is fully gone,
  // so it doesn't thrash against the still-collapsing preview on the way out.
  const [previewMounted, setPreviewMounted] = useState(added.length > 0);
  if (added.length > 0 && !previewMounted) setPreviewMounted(true);

  // Pricing options (step 2). Each is a self-contained option.
  const makePricingOption = () => newPricingOption(nextPricingId.current++);
  const addPricingOption = (): number => {
    // Mirror the primary option's product line-up into the new option, but as
    // fresh, unconfigured instances — same types, empty setup, "Configure" CTA.
    const template = pricingOptions[0];
    const clones = (template?.productIds ?? [])
      .map((id) => added.find((a) => a.id === id))
      .filter((it): it is OfferingItem => Boolean(it))
      .map((it) => makeOffering(it.slug));
    if (clones.length) setAdded((a) => [...a, ...clones]);
    const opt = { ...makePricingOption(), productIds: clones.map((c) => c.id) };
    setPricingOptions((o) => [...o, opt]);
    return opt.id;
  };

  // Turn multiple pricing options on/off. Turning off collapses to the first
  // option, discarding the others (and their products).
  const toggleMulti = () => {
    if (multiEnabled) {
      const dropIds = pricingOptions.slice(1).flatMap((p) => p.productIds);
      if (dropIds.length) setAdded((a) => a.filter((it) => !dropIds.includes(it.id)));
      setPricingOptions((o) => o.slice(0, 1));
      setMultiEnabled(false);
    } else {
      setMultiEnabled(true);
    }
  };
  const removePricingOption = (id: number) => {
    // Drop the deleted option's products from the shared library so they don't
    // linger as orphans (which the preview would keep showing).
    const opt = pricingOptions.find((p) => p.id === id);
    if (opt) setAdded((a) => a.filter((item) => !opt.productIds.includes(item.id)));
    setPricingOptions((o) => o.filter((p) => p.id !== id));
    // Dropping back to a single option turns multiple pricing options off.
    if (pricingOptions.length - 1 <= 1) setMultiEnabled(false);
  };
  const updatePricingOption = (id: number, patch: Partial<PricingOption>) =>
    setPricingOptions((o) => o.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  // Preview reads the headline access + price + products from the first option.
  const primaryPricing = pricingOptions[0];
  // The products shown in the preview are exactly the primary option's current
  // products (resolved from its productIds), never the raw shared library.
  const previewItems = (primaryPricing?.productIds ?? [])
    .map((id) => added.find((a) => a.id === id))
    .filter((it): it is OfferingItem => Boolean(it));
  const previewPaidType: "recurring" | "one-time" = primaryPricing?.billing === "recurring" ? "recurring" : "one-time";
  // v2 derives the price from the option's roll-up total; v1 uses its set price.
  // Free is derived from a $0 price either way.
  const v2Total = optionRollup(previewItems, primaryPricing ?? { discountType: "percent", discountValue: "" }).total;
  const previewPrice = v2 ? v2Total.toFixed(2) : (primaryPricing?.price ?? "");
  const previewMode: "free" | "paid" = Number(previewPrice || 0) === 0 ? "free" : "paid";

  const makeOffering = (slug: string): OfferingItem => ({ id: nextOfferingId.current++, slug, config: defaultConfigFor(slug), configured: false, ...(isListOffering(slug) ? { items: [] } : {}) });
  const addOffering = (slug: string) => setAdded((a) => [...a, makeOffering(slug)]);
  const removeOffering = (id: number) => setAdded((a) => a.filter((item) => item.id !== id));

  // Paid mode: products belong to a specific pricing option. Adding creates a
  // fresh product instance and files it under that option; removing drops it
  // from the option and the shared item library together.
  const addOfferingToOption = (optionId: number, slug: string): number => {
    const item = makeOffering(slug);
    setAdded((a) => [...a, item]);
    setPricingOptions((o) => o.map((p) => (p.id === optionId ? { ...p, productIds: [...p.productIds, item.id] } : p)));
    return item.id;
  };
  const removeOfferingFromOption = (optionId: number, itemId: number) => {
    setPricingOptions((o) => o.map((p) => (p.id === optionId ? { ...p, productIds: p.productIds.filter((x) => x !== itemId) } : p)));
    setAdded((a) => a.filter((item) => item.id !== itemId));
  };

  const updateOfferingConfig = (id: number, patch: Record<string, string>) =>
    setAdded((a) => a.map((item) => (item.id === id ? { ...item, config: { ...item.config, ...patch } } : item)));
  const setOfferingItems = (id: number, items: CollectionItem[]) =>
    setAdded((a) => a.map((item) => (item.id === id ? { ...item, items } : item)));
  const markOfferingConfigured = (id: number) =>
    setAdded((a) => a.map((item) => (item.id === id ? { ...item, configured: true } : item)));

  // Page sections (step 3). New sections append to the end; reorder swaps with a
  // neighbor so "move up/down" stays a single-step nudge.
  const addSection = (kind: PageSectionKind) => setSections((s) => [...s, newPageSection(kind, nextSectionId.current++)]);
  const removeSection = (id: number) => setSections((s) => s.filter((sec) => sec.id !== id));
  const updateSection = (next: PageSection) => setSections((s) => s.map((sec) => (sec.id === next.id ? next : sec)));
  // Drag-and-drop reorder — the Reorder list hands back the new order live.
  const reorderSections = (next: PageSection[]) => setSections(next);

  return (
    <V2Context.Provider value={v2}>
    <div className="min-h-screen bg-white">
      {/* Flow header — close, title, step breadcrumb, next */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-stroke bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Button size="sm" variant="secondary" iconOnly onClick={close} aria-label="Close">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Button>
          <span className="hidden text-[15px] font-semibold text-gray-dark sm:inline">Add offering</span>
        </div>

        {/* Breadcrumb — click a step to jump to it */}
        <nav className="flex items-center gap-1.5">
          {STEPS.map((s, i) => {
            const active = s.key === step;
            // The Details and Page steps are locked until a product exists.
            const locked = added.length === 0 && s.key !== "offerings";
            return (
              <div key={s.key} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg className="h-4 w-4 text-[#CFCFCF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                )}
                <button
                  onClick={() => { if (!locked) setStep(s.key); }}
                  disabled={locked}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[14px] transition-colors ${active ? "font-semibold text-gray-dark" : locked ? "cursor-not-allowed font-medium text-gray-extra-light" : "font-medium text-gray-light hover:text-gray-dark"}`}
                >
                  <MaskIcon src={s.icon} />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              </div>
            );
          })}
        </nav>

        <Button size="sm" variant="dark" rounded="rounded-full" className="text-[14px] font-semibold" onClick={next} disabled={added.length === 0}>
          {isLast ? "Publish" : "Next"}
          {!isLast && (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          )}
        </Button>
      </header>

      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14">
        {/* Step content. Before any product is added there's no preview column,
            so the content is capped and centered rather than stretching full
            width; it slides into place as the preview animates in. */}
        <motion.main
          layout="position"
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className={`min-w-0 pb-[120px] ${previewMounted ? "flex-1" : "w-full lg:mx-auto lg:max-w-[660px]"}`}
        >
          <AnimatePresence mode="wait" onExitComplete={() => pendingNav && navigate(pendingNav)}>
            {!pendingNav && (
              <motion.div key={step} {...stepMotion}>
                {step === "product" && (
                  <ProductStep
                    name={name} setName={setName}
                    headline={headline} setHeadline={setHeadline}
                    thumbnail={thumbnail} setThumbnail={setThumbnail}
                    buttonText={buttonText} setButtonText={setButtonText}
                    mvp={mvp}
                  />
                )}
                {step === "offerings" && (
                  <OfferingsStep
                    added={added} onConfigChange={updateOfferingConfig} onItemsChange={setOfferingItems} onConfigured={markOfferingConfigured}
                    pricingOptions={pricingOptions}
                    onAddPricingOption={addPricingOption}
                    onRemovePricingOption={removePricingOption}
                    onUpdatePricingOption={updatePricingOption}
                    onAddProductToOption={addOfferingToOption}
                    onRemoveProductFromOption={removeOfferingFromOption}
                    multiEnabled={multiEnabled}
                    onToggleMulti={toggleMulti}
                    mvp={mvp}
                  />
                )}
                {step === "page" && (
                  <PageStep
                    name={name}
                    headline={headline}
                    pricingMode={previewMode}
                    paidType={previewPaidType}
                    price={previewPrice}
                    description={description}
                    setDescription={setDescription}
                    sections={sections}
                    onAddSection={addSection}
                    onUpdateSection={updateSection}
                    onRemoveSection={removeSection}
                    onReorderSections={reorderSections}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        {/* Live preview — hidden until the first product is added, then animates
            in; persists across steps thereafter. On the way out, the main column
            waits for this to finish exiting before re-centering. */}
        <AnimatePresence onExitComplete={() => setPreviewMounted(false)}>
          {added.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full lg:sticky lg:top-[88px] lg:h-fit lg:w-[320px] lg:shrink-0"
            >
              <ProductPreview
                name={name}
                headline={headline}
                pricingMode={previewMode}
                paidType={previewPaidType}
                price={previewPrice}
                cover={thumbnail}
                multiOption={pricingOptions.length > 1}
                joinLabel={multiEnabled ? "Select an option" : buttonText}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Admin tool — bottom-right, mirrors the profile template */}
      <div ref={adminRef} className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[200px] rounded-xl border border-gray-stroke bg-white p-2 shadow-[0_4px_16px_rgba(16,24,40,0.12)]"
            >
              <AdminToggle label="MVP" checked={mvp} onChange={() => setMvp((v) => !v)} />
              <div className="mt-1 flex items-center justify-between rounded-lg px-2 py-2">
                <span className="text-[14px] font-medium text-gray-dark">Version</span>
                <div className="flex rounded-lg bg-gray-hover p-0.5">
                  {(["v1", "v2"] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setVersion(val)}
                      className={`rounded-md px-2.5 py-1 text-[13px] font-semibold transition-colors ${version === val ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(16,24,40,0.12)]" : "text-gray-light hover:text-gray-dark"}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen((o) => !o)}
          aria-label="Admin controls"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#B1B1B1]/20 backdrop-blur-[12px] transition-colors hover:bg-[#B1B1B1]/30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#222222" />
            <circle cx="8" cy="8" r="1.5" fill="#222222" />
            <circle cx="13" cy="8" r="1.5" fill="#222222" />
          </svg>
        </button>
      </div>
    </div>
    </V2Context.Provider>
  );
}

/* ---------- Step 1: Product details + pricing ---------- */

function ProductStep({
  name, setName, headline, setHeadline, thumbnail, setThumbnail,
  buttonText, setButtonText, mvp,
}: {
  name: string; setName: (v: string) => void;
  headline: string; setHeadline: (v: string) => void;
  thumbnail: string | null; setThumbnail: (v: string | null) => void;
  buttonText: string; setButtonText: (v: string) => void;
  mvp: boolean;
}) {
  return (
    <div className="flex flex-col gap-12">
      <section>
        <h2 className="text-[22px] font-semibold text-gray-dark">Create your offering</h2>
        <p className="mt-0.5 text-[15px] text-gray-light">Describe your offering.</p>
        <div className="mt-5 flex flex-col gap-5">
          <CharField label="Name" required value={name} onChange={setName} placeholder="My offering name" max={80} />
          <CharField label="Headline" value={headline} onChange={setHeadline} placeholder="A short subheadline for my offering here." max={72} />
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Thumbnail</label>
            <ImageUploadField value={thumbnail} onChange={setThumbnail} label="Add a thumbnail image" hint="Recommended 1200 × 630" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[22px] font-semibold text-gray-dark">Visibility</h2>
        <p className="mt-0.5 text-[15px] text-gray-light">Control who can discover this offering and how it appears on your profile.</p>
        <div className="mt-5">
          <ProductSettings />
        </div>
      </section>

      {!mvp && (
        <AdvancedSection buttonText={buttonText} setButtonText={setButtonText} />
      )}
    </div>
  );
}

/* ---------- Paid pricing (recurring / one-time) ---------- */

// Secondary text beneath the price — a dropdown link toggling one-time / monthly.
// The menu is portaled to the body so an overflow-hidden ancestor (e.g. the
// price block's height-animation wrapper) can't clip it.
function CadenceLink({ recurring, onChange }: { recurring: boolean; onChange: (recurring: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const options = [
    { recurring: false, label: "one-time" },
    { recurring: true, label: "per month" },
  ];

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 6 });
  }, [open]);

  return (
    <div className="relative inline-block">
      <button ref={triggerRef} type="button" onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-[17px] text-gray-light transition-colors hover:text-gray-dark">
        {recurring ? "per month" : "one-time"}
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && createPortal(
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[100] cursor-default" onClick={() => setOpen(false)} />
          <div style={{ position: "fixed", left: pos.left, top: pos.top }} className="z-[101] min-w-[150px] overflow-hidden rounded-xl border border-gray-stroke bg-white p-1 shadow-[0_4px_16px_rgba(16,24,40,0.12)]">
            {options.map((opt) => {
              const active = opt.recurring === recurring;
              return (
                <button key={opt.label} type="button" onClick={() => { onChange(opt.recurring); setOpen(false); }} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[14px] text-gray-dark transition-colors hover:bg-gray-hover ${active ? "font-semibold" : "font-medium"}`}>
                  {opt.label}
                  {active && <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

function PaidPricingCard({ paidType, setPaidType, price, setPrice }: { paidType: "recurring" | "one-time"; setPaidType: (v: "recurring" | "one-time") => void; price: string; setPrice: (v: string) => void }) {
  const recurring = paidType === "recurring";
  const [freeTrial, setFreeTrial] = useState(false);
  const [trialLength, setTrialLength] = useState("7");

  // Size the input to its content (treat "." as narrow) so the cadence link
  // tucks right up against the number.
  const priceDisplay = price || "0";
  const priceWidthCh = [...priceDisplay].reduce((w, c) => w + (c === "." ? 0.45 : 1), 0);
  const formatPrice = () => { if (price !== "" && !Number.isNaN(Number(price))) setPrice(Number(price).toFixed(2)); };

  return (
    <div className="rounded-xl border border-gray-stroke transition-colors focus-within:border-gray-dark">
      {/* Big price field: left-aligned number with the cadence beside it */}
      <div className="flex items-end gap-2 px-5 py-6">
        <div className="flex items-center gap-1">
          <span className="text-[32px] font-medium leading-none text-gray-dark">$</span>
          <input
            inputMode="decimal"
            value={price}
            placeholder="0"
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            onBlur={formatPrice}
            style={{ width: `${priceWidthCh}ch` }}
            className="min-w-0 bg-transparent text-left text-[32px] font-medium leading-none text-gray-dark underline decoration-gray-dark decoration-dotted decoration-2 underline-offset-[6px] outline-none placeholder:text-gray-dark"
          />
        </div>
        <div className="pb-1">
          <CadenceLink recurring={recurring} onChange={(r) => setPaidType(r ? "recurring" : "one-time")} />
        </div>
      </div>

      {recurring && (
        <div className="border-t border-gray-stroke px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-[14px] font-medium text-gray-dark">
              <svg className="h-[18px] w-[18px] text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7ZM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" /></svg>
              Include a free trial
              <span className="rounded bg-[#EEF1FF] px-1.5 py-0.5 text-[12px] font-semibold text-[#4666E5]">Recommended</span>
            </span>
            <Toggle checked={freeTrial} onChange={() => setFreeTrial((v) => !v)} />
          </div>
          {freeTrial && (
            <>
              <Select
                value={trialLength}
                onChange={setTrialLength}
                className="mt-3"
                options={[
                  { value: "3", label: "3 days" },
                  { value: "7", label: "7 days" },
                  { value: "30", label: "30 days" },
                  { value: "custom", label: "After other # of days…" },
                ]}
              />
              {trialLength === "custom" && (
                <div className="mt-2 flex items-center rounded-lg border border-gray-stroke bg-white px-3.5 focus-within:border-gray-dark">
                  <input placeholder="Number of days" className="w-full bg-transparent py-2.5 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1]" />
                  <span className="text-[14px] text-gray-light">days</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Pricing option (products + billing settings) ---------- */

// Radio indicator used by the compact free/paid toggle.
function RadioDot({ active }: { active: boolean }) {
  return (
    <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-colors ${active ? "border-[1.5px] border-gray-dark bg-gray-dark" : "border border-gray-stroke bg-white"}`}>
      {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
    </span>
  );
}

function AddPricingOptionButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="md" variant="secondary" onClick={onClick} style={{ fontWeight: 600 }}>
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      Add pricing option
    </Button>
  );
}

/* ---------- Suggested pricing ---------- */

// The expert's global hourly rate (set on their profile, mocked here). It's the
// basis for price suggestions on any hourly coaching time in the offering.
const EXPERT_HOURLY_RATE = 150;

// Hours represented by a configured coaching-time product. Range mode uses the
// midpoint; set mode adds hours + minutes.
function coachingHours(item: OfferingItem): number {
  const c = item.config;
  if (item.slug !== "coaching-time" || !item.configured) return 0;
  if (c.mode === "range") return (Number(c.minHours || 0) + Number(c.maxHours || 0)) / 2;
  return Number(c.hours || 0) + Number(c.minutes || 0) / 60;
}

// v2 per-product list price, before any per-item "free" override. Coaching time
// is derived from hours × the expert's hourly rate; every other priceable
// product carries a manual price in its config. Non-priceable placeholder
// products contribute nothing.
function productListPrice(item: OfferingItem): number {
  if (item.slug === "coaching-time") return Math.round(coachingHours(item) * EXPERT_HOURLY_RATE);
  if (!isPriceable(item.slug)) return 0;
  return Number(item.config.price || 0);
}

// Effective per-product price — 0 when the coach has marked the product free.
function productPrice(item: OfferingItem): number {
  return item.config.free === "true" ? 0 : productListPrice(item);
}

// v2 roll-up math for a pricing option: the priceable products, their subtotal
// (list prices, before any "free" overrides), the amount waived by free
// products, the resolved discount, and the final total.
function optionRollup(products: OfferingItem[], option: Pick<PricingOption, "discountType" | "discountValue">) {
  const items = products.filter((p) => isPriceable(p.slug));
  const subtotal = items.reduce((s, it) => s + productListPrice(it), 0);
  const freeAmount = items.reduce((s, it) => s + (it.config.free === "true" ? productListPrice(it) : 0), 0);
  const afterFree = Math.max(0, subtotal - freeAmount);
  const raw = Number(option.discountValue || 0);
  const discount = raw <= 0 ? 0 : Math.min(option.discountType === "flat" ? raw : afterFree * (raw / 100), afterFree);
  return { items, subtotal, freeAmount, discount, total: Math.max(0, afterFree - discount) };
}

// Money with thousands separators; 2 decimals only when non-integer.
const formatMoney = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });

// Roughly humanize an hour count, e.g. 2.5 → "2 hr 30 min", 3 → "3 hr".
function formatHours(h: number): string {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  const parts: string[] = [];
  if (whole) parts.push(`${whole} hr`);
  if (mins) parts.push(`${mins} min`);
  return parts.join(" ") || "0 min";
}

// Compact form, e.g. 2.5 → "2h 30m", 3 → "3h".
function compactHours(h: number): string {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  const parts: string[] = [];
  if (whole) parts.push(`${whole}h`);
  if (mins) parts.push(`${mins}m`);
  return parts.join(" ") || "0m";
}

// What we can (and can't) price in a set of products. Only hourly coaching time
// maps cleanly to the expert's rate; everything else is "unpriced" and merely
// acknowledged so the coach knows the number doesn't cover it.
function pricingBasis(products: OfferingItem[]) {
  let hours = 0;
  let hasCoaching = false;
  let unconfiguredCoaching = false;
  let otherCount = 0;
  for (const p of products) {
    if (p.slug === "coaching-time") {
      hasCoaching = true;
      if (p.configured) hours += coachingHours(p);
      else unconfiguredCoaching = true;
    } else {
      otherCount++;
    }
  }
  return { hours, amount: Math.round(hours * EXPERT_HOURLY_RATE), hasCoaching, unconfiguredCoaching, otherCount };
}

// Suggested-price treatment shown beneath a price field. `compact` renders a
// small pill (used in the narrow multi-option Price column); the default renders
// the full green banner framing the hourly coaching value as a plain FYI. When
// there's no hourly basis, the banner shows a soft note and the pill hides.
function SuggestedPrice({ products, compact = false }: { products: OfferingItem[]; compact?: boolean }) {
  const { hours, amount } = pricingBasis(products);
  const hasSuggestion = amount > 0;

  // Nothing to show until there's configured coaching time to price against.
  if (!hasSuggestion) return null;

  const text = `${formatHours(hours)} of coaching at your $${EXPERT_HOURLY_RATE.toLocaleString()}/hr rate is equal to $${amount.toLocaleString()}`;

  // Multi-option cards: a subtle "Suggestion" link that reveals the reasoning on
  // hover (sits on the Price label row, so a full inline line would be too wide).
  if (compact) {
    return (
      <span className="group relative inline-flex items-center">
        <button
          type="button"
          className="text-[13px] font-medium text-gray-light underline decoration-dotted underline-offset-2 transition-colors hover:text-gray-dark"
        >
          Suggestion
        </button>
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 hidden w-max max-w-[240px] rounded-lg bg-gray-dark px-3 py-2 text-[12px] font-medium leading-snug text-white shadow-[0_4px_16px_rgba(16,24,40,0.18)] group-hover:block group-focus-within:block"
        >
          {text}
        </span>
      </span>
    );
  }

  // Plain inline helper line beneath the price field.
  return (
    <div className="mt-2.5 flex items-center gap-2">
      <MaskIcon src={lightBulbIcon} className="h-[18px] w-[18px] shrink-0 text-gray-extra-light" />
      <span className="text-[14px] font-medium text-gray-extra-light">{text}</span>
    </div>
  );
}

// Add thousands separators to a numeric input string, preserving any trailing
// dot / decimals the user is mid-typing. "1700.00" → "1,700.00", "1700." → "1,700."
function withCommas(v: string): string {
  if (v === "") return "";
  const [int, ...rest] = v.split(".");
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length ? `${intFmt}.${rest.join("")}` : intFmt;
}

// Price box: large editable price + cadence. When the price is 0, shows a green
// "Free" tag (setting $0 is how a coach makes an offering free — no toggle).
function PriceFields({ option, products, onChange, mvp }: { option: PricingOption; products: OfferingItem[]; onChange: (patch: Partial<PricingOption>) => void; mvp: boolean }) {
  const recurring = option.billing === "recurring";

  // Sync-to-hourly-rate is only offered when the offering is exactly one hourly
  // coaching-time product — the only thing that maps cleanly to the coach's
  // hourly rate. When synced, the price is derived (hours × rate) and locked.
  const canSyncHourly = products.length === 1 && products[0].slug === "coaching-time";
  const { amount: syncedPrice } = pricingBasis(products);
  const syncOn = canSyncHourly && option.syncHourly;

  // While synced, keep the stored price in lockstep with the derived value so
  // the summary/total downstream reflect it.
  useEffect(() => {
    if (!syncOn) return;
    const v = syncedPrice.toFixed(2);
    if (option.price !== v) onChange({ price: v });
  }, [syncOn, syncedPrice, option.price, onChange]);

  const effectivePrice = syncOn ? syncedPrice : Number(option.price || 0);
  const isFree = effectivePrice === 0;
  const formatPrice = () => {
    if (option.price !== "" && !Number.isNaN(Number(option.price))) onChange({ price: Number(option.price).toFixed(2) });
  };
  // Displayed with commas; the stored value stays raw (onChange strips them).
  const displayValue = withCommas(option.price);
  const priceDisplay = displayValue || "0";
  const priceWidthCh = [...priceDisplay].reduce((w, c) => w + (c === "." || c === "," ? 0.45 : 1), 0);

  return (
    <>
      <div className="rounded-xl bg-white shadow-[inset_0_0_0_1px_rgba(34,34,34,0.1)] transition-shadow focus-within:shadow-[inset_0_0_0_1px_#222222]">
        <div className="flex items-end justify-between gap-2 px-5 py-6">
          <div className="flex items-center gap-1">
            <span className={`text-[32px] font-medium leading-none ${syncOn ? "text-gray-extra-light" : "text-gray-dark"}`}>$</span>
            {syncOn ? (
              // Locked to the synced hourly value — not editable.
              <span className="text-[32px] font-medium leading-none text-gray-extra-light">
                {withCommas(syncedPrice.toFixed(2))}
              </span>
            ) : (
              <input
                inputMode="decimal"
                value={displayValue}
                placeholder="0"
                onFocus={(e) => e.target.select()}
                onChange={(e) => onChange({ price: e.target.value.replace(/[^0-9.]/g, "") })}
                onBlur={formatPrice}
                style={{ width: `${priceWidthCh}ch` }}
                className="min-w-0 bg-transparent text-left text-[32px] font-medium leading-none text-gray-dark underline decoration-gray-dark decoration-dotted decoration-2 underline-offset-[4px] [text-decoration-skip-ink:none] outline-none placeholder:text-gray-dark"
              />
            )}
          </div>
          <div className="pb-1">
            {isFree ? (
              <span className="inline-flex items-center gap-1.5 text-[16px] text-gray-extra-light">
                <MaskIcon src={giftIcon} className="h-[18px] w-[18px] text-gray-extra-light" />
                Free
              </span>
            ) : mvp ? (
              <span className="text-[16px] text-gray-extra-light">One-time purchase</span>
            ) : (
              <CadenceLink recurring={recurring} onChange={(r) => onChange({ billing: r ? "recurring" : "one-time" })} />
            )}
          </div>
        </div>
      </div>

      {/* Sync-to-hourly-rate toggle — locks the price to the coach's rate. Its
          own card, identical to the price card above. */}
      {canSyncHourly && (
        <div
          onClick={() => onChange({ syncHourly: !option.syncHourly })}
          className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-[inset_0_0_0_1px_rgba(34,34,34,0.1)]"
        >
          {/* The toggle stops propagation so a direct click doesn't double-fire
              with the card's own handler. */}
          <span onClick={(e) => e.stopPropagation()}>
            <Toggle checked={option.syncHourly} onChange={() => onChange({ syncHourly: !option.syncHourly })} />
          </span>
          <div>
            <div className="text-[15px] font-semibold text-gray-dark">Sync to my hourly rate</div>
            <div className="text-[14px] text-gray-light">Changing your hourly rate and bulk discounts will update your package price.</div>
          </div>
        </div>
      )}

      {!syncOn && products.length > 1 && <SuggestedPrice products={products} />}

      {recurring && !isFree && (
        <div className="mt-3 flex flex-col gap-4 rounded-xl bg-gray-hover p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-[15px] font-medium text-gray-dark">
              <MaskIcon src={giftIcon} className="h-[18px] w-[18px] text-gray-dark" />
              Include a free trial
              <span className="rounded bg-[#EEF1FF] px-1.5 py-0.5 text-[12px] font-semibold text-[#4666E5]">Recommended</span>
            </span>
            <Toggle checked={option.freeTrial} onChange={() => onChange({ freeTrial: !option.freeTrial })} />
          </div>
          {option.freeTrial && (
            <Select
              value={option.trialLength}
              onChange={(v) => onChange({ trialLength: v })}
              options={[
                { value: "3", label: "3 days" },
                { value: "7", label: "7 days" },
                { value: "14", label: "14 days" },
                { value: "30", label: "30 days" },
              ]}
            />
          )}
        </div>
      )}
    </>
  );
}

// v2 roll-up summary rows — Subtotal, a %/$ discount control, and the final
// Total. The products themselves are already listed above, so this only carries
// the totals; the rows share the product list's rhythm (py-4 + dividers) so they
// read as an extension of it.
function PricingRollup({ products, option, onChange, multiEnabled = false, onToggleMulti }: { products: OfferingItem[]; option: PricingOption; onChange: (patch: Partial<PricingOption>) => void; multiEnabled?: boolean; onToggleMulti?: () => void }) {
  const { items, subtotal, freeAmount, discount, total } = optionRollup(products, option);
  // Discount has three states: idle (an "Add discount" link), editing (the
  // %/$ controls + an "Apply" action), and done (the applied amount, editable,
  // with an "X" to clear). Starts in "done" if a discount is already set.
  const [discountMode, setDiscountMode] = useState<"idle" | "editing" | "done">(() => (Number(option.discountValue || 0) > 0 ? "done" : "idle"));
  const applyDiscount = () => {
    if (Number(option.discountValue || 0) > 0) setDiscountMode("done");
    else { onChange({ discountValue: "" }); setDiscountMode("idle"); }
  };
  const removeDiscount = () => { onChange({ discountValue: "" }); setDiscountMode("idle"); };
  // Remember the last non-zero free amount so the collapsing row keeps its value
  // instead of flashing to $0 during the exit animation.
  const lastFreeRef = useRef(0);
  if (freeAmount > 0) lastFreeRef.current = freeAmount;
  const freeDisplay = freeAmount > 0 ? freeAmount : lastFreeRef.current;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-4 text-[15px]">
        <span className="text-gray-light">Subtotal</span>
        <span className="text-gray-dark">${formatMoney(subtotal)}</span>
      </div>

      {/* Amount waived by products marked free — animates in/out. Uses the last
          non-zero amount so the value doesn't flash to $0 while collapsing. */}
      <AnimatePresence initial={false}>
        {freeAmount > 0 && (
          <motion.div
            key="free-products"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={offeringTransition}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between border-t border-gray-stroke py-4 text-[15px]">
              <span className="text-gray-light">Free products</span>
              <span className="text-gray-dark">−${formatMoney(freeDisplay)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-gray-stroke py-4 text-[15px]">
        <div className="flex items-center justify-between gap-3">
          <span className="text-gray-light">Discount</span>
          <AnimatePresence mode="wait" initial={false}>
            {discountMode === "done" ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountMode("editing")}
                  aria-label="Edit discount"
                  className="flex h-5 w-5 items-center justify-center text-gray-extra-light transition-colors hover:text-gray-light"
                >
                  <MaskIcon src={editFilledIcon} className="h-4 w-4" />
                </button>
                <span>
                  {option.discountType === "percent" && <span className="text-gray-extra-light">{option.discountValue}% </span>}<span className="text-gray-dark">−${formatMoney(discount)}</span>
                </span>
              </motion.div>
            ) : discountMode === "idle" ? (
              <motion.button
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                type="button"
                onClick={() => setDiscountMode("editing")}
                className="font-normal text-gray-light underline decoration-dotted underline-offset-2 transition-colors hover:text-gray-dark"
              >
                Add discount
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false}>
          {discountMode === "editing" && (
            <motion.div
              key="discount-editing"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={offeringTransition}
              className="overflow-hidden"
            >
          <div className="flex items-center gap-3 pt-3">
            <Select
              value={option.discountType}
              onChange={(v) => onChange({ discountType: v as "percent" | "flat" })}
              options={[{ value: "percent", label: "Percentage" }, { value: "flat", label: "Dollar amount" }]}
              className="flex-1"
            />
            <div className="flex flex-1 items-center rounded-lg border border-gray-stroke bg-white px-3 transition-colors focus-within:border-gray-dark">
              {option.discountType === "flat" && <span className="text-[15px] text-gray-light">$</span>}
              <input
                autoFocus
                inputMode="decimal"
                value={option.discountValue}
                onChange={(e) => onChange({ discountValue: e.target.value.replace(/[^0-9.]/g, "") })}
                onKeyDown={(e) => { if (e.key === "Enter") applyDiscount(); }}
                placeholder="0"
                className="w-full min-w-0 bg-transparent py-2 px-1 text-[15px] text-gray-dark outline-none placeholder:text-[#B1B1B1]"
              />
              {option.discountType === "percent" && <span className="text-[15px] text-gray-light">%</span>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="secondary" iconOnly aria-label="Remove discount" onClick={removeDiscount}>
                <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
              </Button>
              <Button size="sm" variant="dark" rounded="rounded-full" onClick={applyDiscount} className="text-[14px]">Apply</Button>
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Multiple pricing options — a line-item above the Total, matching the
          other rows. The whole row toggles; the toggle stops propagation so a
          direct click doesn't double-fire. */}
      {onToggleMulti && (
        <div
          onClick={onToggleMulti}
          className="flex cursor-pointer items-center justify-between gap-3 border-t border-gray-stroke py-4 text-[15px]"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-gray-light">Multiple pricing options</span>
            <span className="group relative flex" onClick={(e) => e.stopPropagation()}>
              <MaskIcon src={infoFilledIcon} className="h-[18px] w-[18px] text-gray-extra-light opacity-50 transition-opacity group-hover:opacity-100" />
              <span role="tooltip" className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-max max-w-[260px] rounded-lg bg-gray-dark px-3 py-2 text-[12px] font-medium leading-snug text-white shadow-[0_4px_16px_rgba(16,24,40,0.18)] group-hover:block">
                Offer varied sets of products at different price points. Buyers pick the one that fits them.
              </span>
            </span>
          </span>
          <span className="flex items-center" onClick={(e) => e.stopPropagation()}>
            <Toggle checked={multiEnabled} onChange={onToggleMulti} size="sm" />
          </span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-stroke py-4">
        <span className="text-[16px] font-semibold text-gray-dark">Total</span>
        <span className="text-[18px] font-semibold text-gray-dark">{total === 0 ? "Free" : `$${formatMoney(total)}`}</span>
      </div>
    </div>
  );
}

// A full pricing option: name + its own products + access (free/paid) + price.
// When `bare` (the single-option default), renders as two flat labeled sections
// ("Add products" and "Pricing"). Otherwise wraps in card chrome with an
// editable option name — used when there are multiple options.
function PricingOptionCard({ option, index, products, available, comingSoon = [], bare, canDelete, mvp, multiEnabled = false, onToggleMulti, onRemove, onChange, onAddProduct, onRemoveProduct, onConfigureProduct, onToggleFreeProduct }: {
  option: PricingOption;
  index: number;
  products: OfferingItem[];
  available: (typeof offeringTypes)[number][];
  comingSoon?: (typeof offeringTypes)[number][];
  bare: boolean;
  canDelete: boolean;
  mvp: boolean;
  multiEnabled?: boolean;
  onToggleMulti?: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<PricingOption>) => void;
  onAddProduct: (slug: string) => void;
  onRemoveProduct: (itemId: number) => void;
  onConfigureProduct: (itemId: number) => void;
  onToggleFreeProduct: (itemId: number) => void;
}) {
  const v2 = useV2();
  // v2 pricing only surfaces once a product has actually been configured (so
  // there's a real price to roll up).
  const anyConfigured = products.some((p) => !isConfigurable(p.slug) || p.configured);
  if (bare) {
    return (
      <div>
        {/* Products. Empty: the descriptive "Add" grid. Populated: grouped into a
            bordered card (matching the multi-option "Included products" card). */}
        {products.length === 0 ? (
          <ProductPicker items={products} available={available} comingSoon={comingSoon} addVariant="grid" onAdd={onAddProduct} onRemove={onRemoveProduct} onConfigure={onConfigureProduct} onToggleFree={onToggleFreeProduct} />
        ) : (
          <div className="overflow-hidden rounded-[20px] border border-gray-stroke bg-white">
            <ProductPicker items={products} available={available} addVariant="menu" boxed hideAdd onAdd={onAddProduct} onRemove={onRemoveProduct} onConfigure={onConfigureProduct} onToggleFree={onToggleFreeProduct} />
            {/* With two or more products, the "Add product" button is integrated
                into the bottom of the card. */}
            {products.length >= 2 && available.length > 0 && (
              <AddProductMenu available={available} onAdd={onAddProduct} trigger="footer" />
            )}
          </div>
        )}

        {/* With exactly one product, add another below the card — v2 nudges to
            make it a bundle; v1 shows a plain "Add product" button. */}
        {products.length === 1 && available.length > 0 && (
          v2 ? (
            <div className="mt-3 flex items-center gap-3 rounded-[20px] border border-gray-stroke bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-light">
                <MaskIcon src={packageBoxOpenIcon} className="h-[26px] w-[26px] text-gray-light" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-gray-dark">Make it a bundle</span>
                <span className="block text-[15px] text-gray-light">Add another product to this offering.</span>
              </span>
              <AddProductMenu available={available} onAdd={onAddProduct} />
            </div>
          ) : (
            <div className="mt-3">
              <AddProductMenu available={available} onAdd={onAddProduct} />
            </div>
          )
        )}

        {v2 ? (
          // v2: a separate "Pricing" section (like v1), surfaced once a product
          // has been configured. The roll-up replaces v1's single price field.
          anyConfigured && (
            <section className="mt-14">
              <h2 className="text-[22px] font-semibold text-gray-dark">Pricing</h2>
              <div className="mt-5 border-t border-gray-stroke">
                <PricingRollup products={products} option={option} onChange={onChange} multiEnabled={multiEnabled} onToggleMulti={onToggleMulti} />
              </div>
            </section>
          )
        ) : (
          products.length > 0 && (
            <section className="mt-14">
              <h2 className="text-[22px] font-semibold text-gray-dark">Pricing</h2>
              <p className="mt-0.5 text-[15px] text-gray-light">Set a price, or enter $0 to offer it for free.</p>
              <div className="mt-5">
                <PriceFields option={option} products={products} onChange={onChange} mvp={mvp} />
              </div>
            </section>
          )
        )}
      </div>
    );
  }

  // Carded (multiple options): each option is a self-contained white card with an
  // "Option N" headline, name + description fields, its products, and its price.
  // Cards sit inside a padded gray container (see OfferingsStep).
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
      {/* Headline + delete */}
      <div className="mb-4 flex items-center gap-3">
        <h3 className="min-w-0 flex-1 text-[22px] font-semibold leading-tight text-gray-dark">Option {index + 1}</h3>
        {canDelete && (
          <Button iconOnly size="sm" variant="secondary" onClick={onRemove} aria-label="Remove pricing option" className="shrink-0">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </Button>
        )}
      </div>

      {/* Name + price + description. In v2 there's no manual price (it's a
          roll-up of the products' own prices), so Name spans full width. */}
      <div className="mb-5 flex flex-col gap-4">
        {v2 ? (
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Name</label>
            <input
              value={option.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Option name"
              className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Name</label>
              <input
                value={option.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Option name"
                className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label className="text-[14px] font-medium text-gray-light">Price</label>
                <SuggestedPrice compact products={products} />
              </div>
              <div className="flex items-center rounded-lg border border-gray-stroke bg-white px-4 transition-colors focus-within:border-gray-dark">
                <span className="text-[15px] text-gray-light">$</span>
                <input
                  inputMode="decimal"
                  value={option.price}
                  onChange={(e) => onChange({ price: e.target.value.replace(/[^0-9.]/g, "") })}
                  onBlur={() => { if (option.price !== "" && !Number.isNaN(Number(option.price))) onChange({ price: Number(option.price).toFixed(2) }); }}
                  placeholder="0.00"
                  className="w-full bg-transparent py-3 pl-1.5 text-[15px] text-gray-dark outline-none placeholder:text-[#B1B1B1]"
                />
              </div>
            </div>
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
          <textarea
            value={option.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="A short description of what's included in this option."
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] leading-snug text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
          />
        </div>
      </div>

      {/* Products — a labeled white card holding the product list (or an empty
          label) with the "Add product" button tucked inside at the bottom. The
          "Included products" label matches the Name/Price/Description labels. */}
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Included products</label>
        <div className="overflow-hidden rounded-xl border border-gray-stroke bg-white">
          {products.length === 0 ? (
            <p className="px-4 py-4 text-[15px] font-medium text-gray-extra-light">No products added</p>
          ) : (
            <ProductPicker items={products} available={available} addVariant="menu" boxed hideAdd onAdd={onAddProduct} onRemove={onRemoveProduct} onConfigure={onConfigureProduct} onToggleFree={onToggleFreeProduct} />
          )}
        </div>
        {available.length > 0 && (
          <div className="mt-3">
            <AddProductMenu available={available} onAdd={onAddProduct} />
          </div>
        )}
      </div>

      {/* v2 roll-up of this option's product prices + discount + total — only
          once at least one product has been configured. */}
      {v2 && anyConfigured && (
        <div className="mt-5 border-t border-gray-stroke">
          <PricingRollup products={products} option={option} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

/* ---------- Visibility (public / private) ---------- */

function ProductSettings() {
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const visibilityOptions = [
    { key: "public" as const, label: "Public", desc: "Visible to everyone", icon: eyeIcon },
    { key: "private" as const, label: "Private", desc: "Only reachable with a direct link", icon: eyeClosedIcon },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {visibilityOptions.map((opt) => {
        const active = visibility === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => setVisibility(opt.key)}
            className={`flex flex-col items-center rounded-xl px-4 py-6 text-center transition-colors ${active ? "border-[1.5px] border-gray-dark" : "border border-gray-stroke hover:border-[#c9c9c9]"}`}
          >
            <MaskIcon src={opt.icon} className={`h-7 w-7 ${active ? "text-gray-dark" : "text-gray-extra-light"}`} />
            <span className="mt-3 text-[16px] font-semibold text-gray-dark">{opt.label}</span>
            <span className="mt-1 text-[14px] leading-snug text-gray-light">{opt.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Advanced (checkout, availability, links) — non-MVP only ---------- */

function AdvancedSection({ buttonText, setButtonText }: { buttonText: string; setButtonText: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [affiliate, setAffiliate] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span>
          <span className="block text-[22px] font-semibold text-gray-dark">Advanced</span>
          <span className="mt-0.5 block text-[15px] text-gray-light">Fine-tune checkout, availability, and links.</span>
        </span>
        <svg className={`h-5 w-5 shrink-0 text-gray-dark transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
            <div className="mt-5 flex flex-col gap-5">
              {/* Purchase button text */}
              <div>
                <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Purchase button text</label>
                <Select
                  value={buttonText}
                  onChange={setButtonText}
                  triggerClassName="px-4 py-3 text-[15px]"
                  options={["Purchase", "Join", "Join now", "Get access", "Subscribe", "Buy now"].map((v) => ({ value: v, label: v }))}
                />
              </div>

              {/* Offering URL */}
              <div>
                <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Offering URL</label>
                <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-stroke bg-white transition-colors focus-within:border-gray-dark">
                  <span className="flex select-none items-center whitespace-nowrap border-r border-gray-stroke bg-[#F5F5F5] px-4 text-[15px] text-gray-light">
                    leland.com/samantha-parker/
                  </span>
                  <input defaultValue="new-offering" className="w-full min-w-0 bg-transparent px-4 py-3 text-[15px] text-gray-dark outline-none placeholder:text-[#B1B1B1]" />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Stock</label>
                <input placeholder="Unlimited" className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark" />
              </div>

              {/* Ask questions before checkout */}
              <AskQuestions />

              {/* Add affiliate rate */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-gray-dark">Add affiliate rate</span>
                  <Toggle checked={affiliate} onChange={() => setAffiliate((v) => !v)} />
                </div>
                {affiliate && (
                  <div className="mt-2 flex items-center rounded-lg border border-gray-stroke bg-white px-3.5 focus-within:border-gray-dark">
                    <input defaultValue="30" className="w-full bg-transparent py-2.5 text-[14px] text-gray-dark outline-none" />
                    <span className="text-[14px] text-gray-light">%</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Ask questions before checkout ---------- */

function AskQuestions() {
  const [enabled, setEnabled] = useState(false);
  const [questions, setQuestions] = useState<{ title: string; placeholder: string; optional: boolean }[]>([
    { title: "", placeholder: "", optional: false },
  ]);

  const update = (i: number, patch: Partial<{ title: string; placeholder: string; optional: boolean }>) =>
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const remove = (i: number) => setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  const add = () => setQuestions((qs) => [...qs, { title: "", placeholder: "", optional: false }]);

  const inputClass = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark";

  return (
    <div>
      <CheckBox checked={enabled} onChange={() => setEnabled((v) => !v)} label="Ask questions before checkout" />
      {enabled && (
        <div className="relative mt-4 flex flex-col gap-6">
          {/* Dashed connector linking the question numbers */}
          <span className="pointer-events-none absolute bottom-[13px] left-[13px] top-[13px] w-px border-l border-dashed border-[#D4D4D4]" />

          {questions.map((q, i) => (
            <div key={i} className="relative pl-10">
              <span className="absolute left-0 top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-gray-stroke bg-white text-[13px] font-medium text-gray-light">{i + 1}</span>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-gray-dark">Question {i + 1}</span>
                <button onClick={() => remove(i)} aria-label="Remove question" className="text-[#E5484D] transition-opacity hover:opacity-70">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" /></svg>
                </button>
              </div>
              <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Question title</label>
              <input value={q.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="What do you want to do?" className={inputClass} />
              <label className="mb-1.5 mt-3 block text-[14px] font-medium text-gray-light">Question placeholder</label>
              <input value={q.placeholder} onChange={(e) => update(i, { placeholder: e.target.value })} placeholder="Stocks, crypto, forex" className={inputClass} />
              <div className="mt-3">
                <CheckBox checked={q.optional} onChange={() => update(i, { optional: !q.optional })} label="Optional" />
              </div>
            </div>
          ))}

          <button onClick={add} className="relative flex items-center pl-10 text-left">
            <span className="absolute left-0 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#EEF1FF] text-[#4666E5]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            <span className="text-[15px] font-semibold text-[#4666E5]">Add another question</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Step 2: Included offerings ---------- */

// Tab bar for multiple pricing options: a tab per option (name or "Option N"),
// an "X" to remove on hover, and a trailing "+" to add another.
function OptionTabs({ options, activeId, onSelect, onAdd, onRemove }: { options: PricingOption[]; activeId: number; onSelect: (id: number) => void; onAdd: () => void; onRemove: (id: number) => void }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-stroke">
      {options.map((opt, i) => {
        const active = opt.id === activeId;
        const label = opt.name || `Option ${i + 1}`;
        return (
          <div key={opt.id} className="group relative flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`flex items-center border-b-2 py-2.5 pl-1 text-[15px] transition-colors ${options.length > 1 ? "pr-7" : "pr-3"} ${active ? "border-gray-dark font-semibold text-gray-dark" : "border-transparent font-medium text-gray-light hover:text-gray-dark"}`}
            >
              <span className="max-w-[160px] truncate">{label}</span>
            </button>
            {options.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(opt.id)}
                aria-label={`Remove ${label}`}
                className="absolute right-1 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-extra-light opacity-0 transition-opacity hover:text-gray-dark group-hover:opacity-100"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={onAdd}
        aria-label="Add pricing option"
        className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
      >
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    </div>
  );
}

// Name + description for a pricing option — shown above the products when the
// offering has multiple options.
function OptionMetaFields({ option, onChange }: { option: PricingOption; onChange: (patch: Partial<PricingOption>) => void }) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Name</label>
        <input
          value={option.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Option name"
          className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
        <textarea
          value={option.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="A short description of what's included in this option."
          rows={2}
          className="w-full resize-none rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] leading-snug text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
        />
      </div>
    </div>
  );
}

function OfferingsStep({ added, onConfigChange, onItemsChange, onConfigured, pricingOptions, onAddPricingOption, onRemovePricingOption, onUpdatePricingOption, onAddProductToOption, onRemoveProductFromOption, multiEnabled, onToggleMulti, mvp }: { added: OfferingItem[]; onConfigChange: (id: number, patch: Record<string, string>) => void; onItemsChange: (id: number, items: CollectionItem[]) => void; onConfigured: (id: number) => void; pricingOptions: PricingOption[]; onAddPricingOption: () => number; onRemovePricingOption: (id: number) => void; onUpdatePricingOption: (id: number, patch: Partial<PricingOption>) => void; onAddProductToOption: (optionId: number, slug: string) => number; onRemoveProductFromOption: (optionId: number, itemId: number) => void; multiEnabled: boolean; onToggleMulti: () => void; mvp: boolean }) {
  // When MVP is on: Agent / Private group are hidden entirely, while Collection,
  // Course, and Livestream are shown as non-clickable "coming soon" options.
  const mvpHidden = ["agent", "membership"];
  const mvpComingSoon = ["collection", "course", "paid-livestream"];
  const [configuringId, setConfiguringId] = useState<number | null>(null);
  const configuring = added.find((item) => item.id === configuringId) ?? null;
  const v2 = useV2();

  // All coaching-time products in an offering must share one mode (a fixed
  // amount vs. a range) — mixing them breaks the pricing math. When configuring
  // a coaching-time, lock its mode to any other coaching-time already added.
  const lockedCoachingMode: "set" | "range" | null = (() => {
    if (!configuring || configuring.slug !== "coaching-time") return null;
    const other = added.find((a) => a.slug === "coaching-time" && a.id !== configuring.id);
    if (!other) return null;
    return other.config.mode === "range" ? "range" : "set";
  })();

  // Products + still-addable types for a given option.
  const optionData = (opt: PricingOption) => {
    const items = opt.productIds
      .map((id) => added.find((a) => a.id === id))
      .filter((it): it is OfferingItem => Boolean(it));
    // Every type stays addable (you can add multiples of a product); MVP hides
    // the not-yet-built types and moves the "coming soon" ones out of `avail`.
    const avail = offeringTypes.filter((o) => !mvp || (!mvpHidden.includes(o.slug) && !mvpComingSoon.includes(o.slug)));
    const comingSoon = mvp ? offeringTypes.filter((o) => mvpComingSoon.includes(o.slug)) : [];
    return { items, avail, comingSoon };
  };
  const multi = pricingOptions.length > 1;

  // Adding a product drops the coach straight into its configure modal (in
  // both v1 and v2). The product's "Configure" CTA still shows afterward if
  // they dismiss the modal without configuring.
  const addProduct = (optionId: number, slug: string) => {
    const id = onAddProductToOption(optionId, slug);
    setConfiguringId(id);
  };

  // Toggle a product's "free" flag (zeroes its price in the roll-up).
  const toggleFree = (id: number) => {
    const it = added.find((a) => a.id === id);
    if (it) onConfigChange(id, { free: it.config.free === "true" ? "" : "true" });
  };

  // Turning multiple options off deletes the extra options, so confirm first
  // (unless there's nothing to lose — a single option).
  const [confirmDisableMulti, setConfirmDisableMulti] = useState(false);
  const handleToggleMulti = () => {
    if (multiEnabled && pricingOptions.length > 1) setConfirmDisableMulti(true);
    else onToggleMulti();
  };

  // v2 multi-option tabs: which option is shown. Falls back to the first option
  // when the selected one no longer exists.
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeOption = pricingOptions.find((o) => o.id === activeId) ?? pricingOptions[0];
  const removeOption = (id: number) => {
    const idx = pricingOptions.findIndex((o) => o.id === id);
    if (id === activeId) {
      const next = pricingOptions[idx + 1] ?? pricingOptions[idx - 1];
      setActiveId(next ? next.id : null);
    }
    onRemovePricingOption(id);
  };

  // A single option's products + pricing (the flat "bare" layout), shared by the
  // single-option view and each multi-option tab.
  const renderOptionCard = (opt: PricingOption) => {
    const { items, avail, comingSoon } = optionData(opt);
    return (
      <PricingOptionCard
        option={opt}
        index={pricingOptions.findIndex((o) => o.id === opt.id)}
        products={items}
        available={avail}
        comingSoon={comingSoon}
        bare
        canDelete={false}
        mvp={mvp}
        multiEnabled={multiEnabled}
        onToggleMulti={handleToggleMulti}
        onRemove={() => onRemovePricingOption(opt.id)}
        onChange={(patch) => onUpdatePricingOption(opt.id, patch)}
        onAddProduct={(slug) => addProduct(opt.id, slug)}
        onRemoveProduct={(itemId) => onRemoveProductFromOption(opt.id, itemId)}
        onConfigureProduct={setConfiguringId}
        onToggleFreeProduct={toggleFree}
      />
    );
  };

  return (
    <div>
      {/* Persistent offering-level header — kept across single and multi. */}
      <h2 className="text-[22px] font-semibold text-gray-dark">Build your offering</h2>
      <p className="mt-0.5 text-[15px] text-gray-light">The products you add will show up as a single offering on your profile.</p>

      {!v2 ? (
        // v1 (legacy): options stack as cards, added via the button below.
        <>
          <div className={`mt-6 flex flex-col ${multi ? "rounded-[28px] bg-gray-hover p-1.5" : "gap-3"}`}>
            <AnimatePresence initial={false}>
              {pricingOptions.map((opt, i) => {
                const { items, avail, comingSoon } = optionData(opt);
                return (
                  <motion.div
                    key={opt.id}
                    initial={multi ? { height: 0, opacity: 0 } : false}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={offeringTransition}
                    className={`overflow-hidden ${multi ? "p-1.5" : ""}`}
                  >
                    <PricingOptionCard
                      option={opt}
                      index={i}
                      products={items}
                      available={avail}
                      comingSoon={comingSoon}
                      bare={!multi}
                      canDelete={multi}
                      mvp={mvp}
                      onRemove={() => onRemovePricingOption(opt.id)}
                      onChange={(patch) => onUpdatePricingOption(opt.id, patch)}
                      onAddProduct={(slug) => addProduct(opt.id, slug)}
                      onRemoveProduct={(itemId) => onRemoveProductFromOption(opt.id, itemId)}
                      onConfigureProduct={setConfiguringId}
                      onToggleFreeProduct={toggleFree}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {added.length > 0 && (
            <div className={`mt-6 flex ${multi ? "justify-center" : "justify-start"}`}>
              <AddPricingOptionButton onClick={onAddPricingOption} />
            </div>
          )}
        </>
      ) : (
        // v2: the products + pricing card stays put; the tabs + name/description
        // block animates in/out above it when multiple options are toggled. The
        // active option is the first when multiple options are off.
        <>
          <AnimatePresence initial={false}>
            {multiEnabled && (
              <motion.div
                key="multi-header"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={offeringTransition}
                className="overflow-hidden"
              >
                <div className="pt-6">
                  <OptionTabs
                    options={pricingOptions}
                    activeId={activeOption.id}
                    onSelect={setActiveId}
                    onAdd={() => setActiveId(onAddPricingOption())}
                    onRemove={removeOption}
                  />
                  <OptionMetaFields option={activeOption} onChange={(patch) => onUpdatePricingOption(activeOption.id, patch)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-6">
            {renderOptionCard(activeOption)}
          </div>
        </>
      )}

      <ConfirmModal
        open={confirmDisableMulti}
        title="Turn off multiple pricing options?"
        body="Your other pricing options and everything in them will be deleted. Only the first option will be kept."
        confirmLabel="Yes, turn off"
        onConfirm={() => { onToggleMulti(); setConfirmDisableMulti(false); }}
        onClose={() => setConfirmDisableMulti(false)}
      />

      <ConfigModal
        item={configuring && !isListOffering(configuring.slug) ? configuring : null}
        lockedCoachingMode={lockedCoachingMode}
        onChange={(patch) => configuring && onConfigChange(configuring.id, patch)}
        onSave={() => { if (configuring) { onConfigured(configuring.id); setConfiguringId(null); } }}
        onClose={() => setConfiguringId(null)}
      />
      <ListConfigModal
        item={configuring && configuring.slug === "collection" ? configuring : null}
        onGeneralChange={(patch) => configuring && onConfigChange(configuring.id, patch)}
        onItemsChange={(items) => configuring && onItemsChange(configuring.id, items)}
        onSave={() => { if (configuring) { onConfigured(configuring.id); setConfiguringId(null); } }}
        onClose={() => setConfiguringId(null)}
      />
      <CourseModal
        item={configuring && configuring.slug === "course" ? configuring : null}
        onGeneralChange={(patch) => configuring && onConfigChange(configuring.id, patch)}
        onItemsChange={(items) => configuring && onItemsChange(configuring.id, items)}
        onSave={() => { if (configuring) { onConfigured(configuring.id); setConfiguringId(null); } }}
        onClose={() => setConfiguringId(null)}
      />
    </div>
  );
}

/* ---------- Product picker (list + add grid) ---------- */

// Compact "Add product" trigger with a portaled dropdown of addable types.
// Portaled so an overflow-hidden ancestor (the option card's height-animation
// wrapper) can't clip it. Used inside multi-option cards to keep them tidy.
function AddProductMenu({ available, onAdd, className = "", label = "Add product", trigger = "button" }: {
  available: (typeof offeringTypes)[number][];
  onAdd: (slug: string) => void;
  className?: string;
  label?: string;
  trigger?: "button" | "footer";
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 6, width: r.width });
  }, [open]);

  if (available.length === 0) return null;

  return (
    <div ref={triggerRef} className={trigger === "footer" ? `block ${className}` : `inline-block ${className}`}>
      {trigger === "footer" ? (
        // Integrated into the bottom of the products card — full-width, divided
        // from the last product row above.
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-gray-stroke py-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          {label}
        </button>
      ) : (
        <Button size="md" variant="secondary" onClick={() => setOpen((o) => !o)} style={{ fontWeight: 600 }}>
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          {label}
        </Button>
      )}
      {createPortal(
        <>
          {open && <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[100] cursor-default" onClick={() => setOpen(false)} />}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ position: "fixed", left: pos.left, top: pos.top, minWidth: trigger === "footer" ? 240 : Math.max(pos.width, 240) }}
                className="z-[101] rounded-2xl border border-gray-stroke bg-white shadow-lg"
              >
                <div className="px-2 py-2">
                  {available.map((o) => (
                    <button
                      key={o.slug}
                      type="button"
                      onClick={() => { onAdd(o.slug); setOpen(false); }}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
                    >
                      <img src={o.icon} alt="" className="h-6 w-6 shrink-0" />
                      {o.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}

// A non-clickable "coming soon" product option (MVP only) — sits in the empty
// product grid alongside the addable options, but muted and without an add CTA.
function ComingSoonProductCard({ o }: { o: (typeof offeringTypes)[number] }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-gray-stroke bg-white px-4 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
        <MaskIcon src={o.icon} className="h-[26px] w-[26px] text-gray-dark" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-gray-dark">{o.label}</span>
        <span className="block text-[15px] text-gray-light">{offeringAddDescription[o.slug] ?? o.blurb}</span>
      </span>
      <span className="shrink-0 rounded-md bg-gray-hover px-2 py-1 text-[10px] font-medium uppercase tracking-[0.05em] text-gray-light">Coming soon</span>
    </div>
  );
}

// Reusable product manager: the list of already-added products (each with a
// configure/remove control) plus the affordance for adding more — a full grid
// of types ("grid") for the flat/single view, or a compact "Add product"
// dropdown ("menu") inside multi-option cards.
function ProductPicker({ items, available, comingSoon = [], addVariant = "grid", boxed = false, hideAdd = false, onAdd, onRemove, onConfigure, onToggleFree }: {
  items: OfferingItem[];
  available: (typeof offeringTypes)[number][];
  comingSoon?: (typeof offeringTypes)[number][];   // non-clickable "coming soon" options, shown in the empty grid
  addVariant?: "grid" | "menu";
  boxed?: boolean;   // pad rows with 16px so they sit inside a card
  hideAdd?: boolean; // omit the add affordance (rendered separately by caller)
  onAdd: (slug: string) => void;
  onRemove: (id: number) => void;
  onConfigure: (id: number) => void;
  onToggleFree: (id: number) => void;
}) {
  const v2 = useV2();

  // v2 flat list: the initial "add a product" rows and the added rows live in a
  // single slug-keyed AnimatePresence, so the chosen product's row persists
  // (morphing Add → its configured state) while the others collapse away.
  if (v2 && addVariant === "grid") {
    return (
      <div className={`flex flex-col ${items.length === 0 ? "gap-3" : ""}`}>
        <AnimatePresence initial={false} mode="popLayout">
          {items.length === 0
            ? [
                ...available.map((o) => (
                  <motion.div key={o.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={offeringTransition} className="overflow-hidden">
                    <div
                      onClick={() => onAdd(o.slug)}
                      className="flex group cursor-pointer items-center gap-3 rounded-[20px] border border-gray-stroke bg-white px-4 py-4 transition-colors hover:border-gray-dark"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                        <img src={o.icon} alt="" className="h-[26px] w-[26px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-gray-dark">{o.label}</span>
                        <span className="block text-[15px] text-gray-light">{offeringAddDescription[o.slug] ?? o.blurb}</span>
                      </span>
                      <Button iconOnly size="md" variant="secondary" aria-label={`Add ${o.label}`} onClick={(e) => { e.stopPropagation(); onAdd(o.slug); }} className="transition-colors !bg-transparent group-hover:!bg-gray-hover">
                        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                      </Button>
                    </div>
                  </motion.div>
                )),
                ...comingSoon.map((o) => (
                  <motion.div key={o.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={offeringTransition} className="overflow-hidden">
                    <ComingSoonProductCard o={o} />
                  </motion.div>
                )),
              ]
            : items.map((item, i) => (
                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={offeringTransition} className="overflow-hidden">
                  <AddedOfferingRow item={item} onRemove={() => onRemove(item.id)} onConfigure={() => onConfigure(item.id)} onToggleFree={() => onToggleFree(item.id)} isLast={i === items.length - 1} />
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={offeringTransition}
              className="overflow-hidden"
            >
              <div className={boxed ? "px-4" : ""}>
                <AddedOfferingRow item={item} onRemove={() => onRemove(item.id)} onConfigure={() => onConfigure(item.id)} onToggleFree={() => onToggleFree(item.id)} isLast={i === items.length - 1} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hideAdd ? null : addVariant === "menu" || items.length > 0 ? (
        // Once a product is added, collapse the full grid into an "Add another
        // product" dropdown (matches the multi-pricing-option cards).
        <AddProductMenu
          available={available}
          onAdd={onAdd}
          className={items.length > 0 ? "mt-3" : ""}
        />
      ) : (
        // Descriptive rows (same as v2's empty state) — icon, label + blurb, and
        // a secondary "+" button. Uses v1's larger card radius and gap.
        <div className="flex flex-col gap-3">
          {/* popLayout pops an added card out of flow so the rest reflow to fill. */}
          <AnimatePresence initial={false} mode="popLayout">
            {[
              ...available.map((o) => (
                <motion.div
                  key={o.slug}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={offeringTransition}
                  className="overflow-hidden"
                >
                  <div
                    onClick={() => onAdd(o.slug)}
                    className="flex group cursor-pointer items-center gap-3 rounded-[20px] border border-gray-stroke bg-white px-4 py-4 transition-colors hover:border-gray-dark"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                      <img src={o.icon} alt="" className="h-[26px] w-[26px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-gray-dark">{o.label}</span>
                      <span className="block text-[15px] text-gray-light">{offeringAddDescription[o.slug] ?? o.blurb}</span>
                    </span>
                    <Button iconOnly size="md" variant="secondary" aria-label={`Add ${o.label}`} onClick={(e) => { e.stopPropagation(); onAdd(o.slug); }} className="transition-colors !bg-transparent group-hover:!bg-gray-hover">
                      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    </Button>
                  </div>
                </motion.div>
              )),
              ...comingSoon.map((o) => (
                <motion.div
                  key={o.slug}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={offeringTransition}
                  className="overflow-hidden"
                >
                  <ComingSoonProductCard o={o} />
                </motion.div>
              )),
            ]}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ---------- Added offering row ---------- */

// A far-right "⋮" menu holding a row's Edit / Remove actions. Anchored to and
// right-aligned under the trigger via a portal (so it escapes the row's clip).
function RowActionsMenu({ onEdit, onToggleFree, onRemove, isFree, label }: { onEdit: () => void; onToggleFree: () => void; onRemove: () => void; isFree: boolean; label: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ right: 0, top: 0 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ right: window.innerWidth - r.right, top: r.bottom + 6 });
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Actions for ${label}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-extra-light transition-colors hover:text-gray-light"
      >
        <MaskIcon src={dotsVerticalIcon} className="h-4 w-4" />
      </button>
      {createPortal(
        <>
          {open && <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[100] cursor-default" onClick={() => setOpen(false)} />}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ position: "fixed", right: pos.right, top: pos.top, minWidth: 160 }}
                className="z-[101] rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => { onEdit(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  <MaskIcon src={editIcon} className="h-[18px] w-[18px]" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => { onToggleFree(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  <MaskIcon src={isFree ? moneyIcon : freeIcon} className="h-[18px] w-[18px]" />
                  {isFree ? "Unmark as free" : "Mark as free"}
                </button>
                <button
                  type="button"
                  onClick={() => { onRemove(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-3 text-[14px] font-semibold text-[#E5484D] transition-colors hover:bg-gray-hover"
                >
                  <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                  Remove
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}

function AddedOfferingRow({ item, onRemove, onConfigure, onToggleFree, isLast = false }: { item: OfferingItem; onRemove: () => void; onConfigure: () => void; onToggleFree: () => void; isLast?: boolean }) {
  const v2 = useV2();
  const o = offeringBySlug[item.slug];
  const configurable = isConfigurable(item.slug);
  const finished = !configurable || item.configured;

  // Subtext: unfinished offerings nudge toward setup; finished ones summarize
  // their config; non-configurable ones just show their blurb.
  const subtext = !configurable
    ? o.blurb
    : finished
      ? configSummary(item)
      : (configUnfinishedText[item.slug] ?? "Needs to be configured");
  const subtextIcon = configurable && finished ? configSummaryIcon[item.slug] : undefined;
  const cta = configCTA[item.slug] ?? { label: "Configure" };

  // v2 finished priceable rows: price moves to the right, and Edit / Remove
  // become inline text links at the end of the secondary line.
  const v2Priced = v2 && finished && isPriceable(item.slug);

  // Headline + secondary detail. Finished coaching-time and content rows lead
  // with product-specific info in both v1 and v2 — the amount of time / content
  // name as the headline, with the rate / file-type · views beneath. Everything
  // else uses the type label + config summary (or setup nudge when unfinished).
  let headline = o.label;
  let detail: ReactNode = (
    <>
      {subtextIcon && <MaskIcon src={subtextIcon} className="h-4 w-4 shrink-0" />}
      <span className="truncate">{subtext}</span>
    </>
  );
  if (finished && item.slug === "coaching-time") {
    headline = item.config.mode === "range"
      ? `${Number(item.config.minHours || 0)}h–${Number(item.config.maxHours || 0)}h of coaching`
      : `${compactHours(coachingHours(item))} of coaching`;
    const delivery = deliveryLabel(item.config.delivery ?? "");
    detail = (
      <span className="truncate">
        ${EXPERT_HOURLY_RATE.toLocaleString()}/hr
        {delivery && <span className="text-gray-extra-light"> · {delivery}</span>}
      </span>
    );
  } else if (finished && item.slug === "content") {
    const { typeLabel, views } = contentMeta(item.config);
    headline = contentItemTitle(item.config) || o.label;
    const meta = [typeLabel, views != null ? `${formatViews(views)} views` : null].filter(Boolean).join(" · ");
    detail = meta ? <span className="truncate">{meta}</span> : null;
  } else if (v2Priced) {
    detail = <span className="truncate">{configSummary(item)}</span>;
  }

  const rowClass = `group flex items-center gap-3 bg-white py-4 ${isLast ? "" : "border-b border-gray-stroke"}`;

  return (
    <div className={rowClass}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
        <img src={o.icon} alt="" className="h-[26px] w-[26px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-gray-dark">{headline}</span>
        {v2Priced ? (
          <span className="flex items-center gap-1.5 text-[15px] text-gray-light">
            {detail}
          </span>
        ) : (
          <span className={`flex items-center gap-1.5 text-[15px] ${finished ? "text-gray-light" : "text-gray-extra-light"}`}>
            {detail}
          </span>
        )}
      </span>

      {v2Priced ? (
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-1.5 text-[15px]">
            <motion.span layout transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }} className={item.config.free === "true" ? "text-gray-extra-light line-through decoration-1 opacity-60" : "text-gray-dark"}>
              ${formatMoney(productListPrice(item))}
            </motion.span>
            <AnimatePresence initial={false}>
              {item.config.free === "true" && (
                <motion.span
                  key="free-zero"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-gray-light"
                >
                  $0
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <RowActionsMenu onEdit={onConfigure} onToggleFree={onToggleFree} onRemove={onRemove} isFree={item.config.free === "true"} label={o.label} />
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-1">
          {configurable && (
            finished ? (
              <button onClick={onConfigure} aria-label={`Edit ${o.label}`} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
                <MaskIcon src={editIcon} className="h-[18px] w-[18px]" />
              </button>
            ) : (
              <Button size="md" variant="dark" onClick={onConfigure} className="mr-1">
                {cta.icon && <MaskIcon src={cta.icon} className="h-[18px] w-[18px]" />}
                {cta.label}
              </Button>
            )
          )}
          <button onClick={onRemove} aria-label={`Remove ${o.label}`} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Configuration modal ---------- */

// Destructive-action confirmation dialog: serif title, muted body, a "Back"
// button and a red confirm button.
function ConfirmModal({ open, title, body, confirmLabel, onConfirm, onClose }: { open: boolean; title: string; body: string; confirmLabel: string; onConfirm: () => void; onClose: () => void }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[620px] rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
            <h2 className="pr-10 font-serif text-[28px] leading-tight text-gray-dark">{title}</h2>
            <p className="mt-2 text-[15px] text-gray-light">{body}</p>
            <div className="mt-6 flex gap-3">
              <Button size="lg" variant="secondary" onClick={onClose}>Never mind</Button>
              <Button size="lg" variant="danger" onClick={onConfirm} className="font-semibold">{confirmLabel}</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ConfigModal({ item, lockedCoachingMode = null, onChange, onSave, onClose }: { item: OfferingItem | null; lockedCoachingMode?: "set" | "range" | null; onChange: (patch: Record<string, string>) => void; onSave: () => void; onClose: () => void }) {
  const o = item ? offeringBySlug[item.slug] : null;
  const complete = item ? isConfigComplete(item) : false;
  const prompt = item ? configPrompts[item.slug] : undefined;

  return createPortal(
    <AnimatePresence>
      {item && o && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            {/* Close — circular gray, top-right */}
            <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-7 pb-1 pt-8">
              {/* Left-aligned header */}
              <h2 className="pr-10 font-serif text-[28px] leading-tight text-gray-dark">Configure {o.label.toLowerCase()}</h2>
              {prompt && <p className="mt-1.5 text-[15px] text-gray-light">{prompt}</p>}

              {/* Fields */}
              <div className="mt-3">
                <OfferingConfigFields slug={item.slug} config={item.config} onChange={onChange} lockedCoachingMode={lockedCoachingMode} />
              </div>
            </div>

            {/* Actions */}
            <div className="px-7 pb-7 pt-1">
              <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={!complete} onClick={onSave}>
                Save product
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// Dispatches to the fields component for the offering type. Add a case here
// alongside a configDefaults entry to configure another type.
function OfferingConfigFields({ slug, config, onChange, lockedCoachingMode = null }: { slug: string; config: Record<string, string>; onChange: (patch: Record<string, string>) => void; lockedCoachingMode?: "set" | "range" | null }) {
  const v2 = useV2();
  if (slug === "coaching-time") return <CoachingTimeFields config={config} onChange={onChange} lockedMode={lockedCoachingMode} />;
  if (slug === "content") return <ContentFields config={config} onChange={onChange} priced={v2} />;
  if (slug === "paid-livestream") return <PaidLivestreamFields config={config} onChange={onChange} />;
  return <PlaceholderFields label={offeringBySlug[slug]?.label ?? "This product"} />;
}

/* ---------- Paid livestream config ---------- */

function PaidLivestreamFields({ config, onChange }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void }) {
  const v2 = useV2();
  const selectedSubs = (config.subcategories ?? "").split(",").filter(Boolean);
  const toggleSub = (s: string) => {
    const set = new Set(selectedSubs);
    if (set.has(s)) set.delete(s); else set.add(s);
    onChange({ subcategories: [...set].join(",") });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Name</label>
        <input value={config.name ?? ""} onChange={(e) => onChange({ name: e.target.value })} placeholder="Name your livestream" autoComplete="off" className={configInputClass} />
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
        <textarea value={config.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder="What will you cover?" autoComplete="off" className={`${configInputClass} resize-none`} />
      </div>

      {v2 && (
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Price</label>
          <PriceField value={config.price ?? ""} onChange={(v) => onChange({ price: v })} />
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Duration</label>
        <Select value={config.duration ?? "30"} onChange={(v) => onChange({ duration: v })} options={LIVESTREAM_DURATIONS} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Date</label>
          <input type="date" value={config.date ?? ""} onChange={(e) => onChange({ date: e.target.value })} className={configInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Time</label>
          <input type="time" value={config.time ?? ""} onChange={(e) => onChange({ time: e.target.value })} className={configInputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Cover photo</label>
        <UploadField value={config.coverName ?? ""} onChange={(name) => onChange({ coverName: name })} hint="Recommended 1200 × 630" />
      </div>

      <div>
        <label className="mb-2 block text-[14px] font-medium text-gray-light">Subcategories</label>
        <div className="flex flex-wrap gap-2">
          {MBA_SUBCATEGORIES.map((s) => {
            const active = selectedSubs.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSub(s)}
                className={`rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-colors ${active ? "border-gray-dark bg-gray-dark text-white" : "border-gray-stroke text-gray-dark hover:border-[#c9c9c9]"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <ToggleRow
        label="Upload recording to Leland+"
        desc="Reach new leads and earn passive income by sharing your recording with Leland+ subscribers. You keep full rights to your content."
        checked={config.lelandPlus === "true"}
        onChange={() => onChange({ lelandPlus: config.lelandPlus === "true" ? "false" : "true" })}
      />
    </div>
  );
}

// Stand-in for offering types whose configuration isn't designed yet.
function PlaceholderFields({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-stroke bg-[#FAFAFA] px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-hover text-gray-extra-light">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07-1.41 1.41M6.34 17.66l-1.41 1.41m12.14 0-1.41-1.41M6.34 6.34 4.93 4.93" /><circle cx="12" cy="12" r="4" /></svg>
      </span>
      <p className="mt-4 text-[16px] font-semibold text-gray-dark">{label} setup is coming soon</p>
      <p className="mt-1.5 text-[14px] leading-snug text-gray-light">We're still designing the configuration for this product. For now you can add it to your offering as a placeholder.</p>
    </div>
  );
}

/* ---------- List-offering modal (sidebar + content pane) ---------- */

// Overall settings shown on the "General" tab of a list offering.
function ListGeneralFields({ config, onChange, heading }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void; heading: string }) {
  const v2 = useV2();
  const lower = heading.toLowerCase();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">{heading} title</label>
        <input value={config.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} placeholder={`Name your ${lower}`} autoComplete="off" className={configInputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
        <textarea value={config.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder={`Describe this ${lower}…`} autoComplete="off" className={`${configInputClass} resize-none`} />
      </div>
      {v2 && (
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Price</label>
          <PriceField value={config.price ?? ""} onChange={(v) => onChange({ price: v })} />
        </div>
      )}
    </div>
  );
}

// Shared by Collection and Course — a sidebar list of content items (with a
// General tab) plus a content-editing pane. Copy (heading, item noun) comes
// from the offering's slug via listOfferingCopy.
function ListConfigModal({ item, onGeneralChange, onItemsChange, onSave, onClose }: { item: OfferingItem | null; onGeneralChange: (patch: Record<string, string>) => void; onItemsChange: (items: CollectionItem[]) => void; onSave: () => void; onClose: () => void }) {
  const [selected, setSelected] = useState<number | "general">("general");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Reset to the General tab each time the modal is opened.
  useEffect(() => { if (item) setSelected("general"); }, [item?.id]);

  const copy = item ? listOfferingCopy[item.slug] : null;
  const items = item?.items ?? [];
  const complete = item ? isConfigComplete(item) : false;
  const selectedItem = typeof selected === "number" ? items.find((r) => r.id === selected) ?? null : null;
  const showGeneral = selected === "general" || !selectedItem;

  const addItem = () => {
    const created = newCollectionItem(items);
    onItemsChange([...items, created]);
    setSelected(created.id);
  };
  const removeItem = (id: number) => {
    onItemsChange(items.filter((r) => r.id !== id));
    if (selected === id) setSelected("general");
  };
  const updateItem = (id: number, patch: Record<string, string>) =>
    onItemsChange(items.map((r) => (r.id === id ? { ...r, config: { ...r.config, ...patch } } : r)));
  const reorder = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onItemsChange(next);
  };

  return createPortal(
    <AnimatePresence>
      {item && copy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[750px] max-h-[85vh] w-full max-w-[860px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            {/* Sidebar */}
            <div className="flex w-[264px] shrink-0 flex-col border-r border-gray-stroke bg-[#FAFAFA]">
              <p className="px-5 pb-3 pt-6 font-serif text-[28px] text-gray-dark">{copy.heading}</p>
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                <button
                  type="button"
                  onClick={() => setSelected("general")}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${showGeneral ? "bg-white font-medium text-gray-dark shadow-[0_1px_2px_rgba(16,24,40,0.08)]" : "text-gray-light hover:bg-black/[0.03]"}`}
                >
                  General
                </button>

                {items.map((r, i) => {
                  const active = selected === r.id;
                  return (
                    <div
                      key={r.id}
                      draggable
                      onDragStart={() => setDragIndex(i)}
                      onDragEnter={() => { if (dragIndex !== null && dragIndex !== i) { reorder(dragIndex, i); setDragIndex(i); } }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={() => setDragIndex(null)}
                      onClick={() => setSelected(r.id)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors ${active ? "bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08)]" : "hover:bg-black/[0.03]"}`}
                    >
                      <span className={`min-w-0 flex-1 truncate text-[14px] ${active ? "font-medium text-gray-dark" : "text-gray-light"}`}>{contentItemTitle(r.config) || `Untitled ${copy.noun}`}</span>
                      <svg className="h-4 w-4 shrink-0 cursor-grab text-[#C4C4C4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9h16M4 15h16" /></svg>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addItem}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-light transition-colors hover:bg-black/[0.03]"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  Add {copy.noun}
                </button>
              </div>
            </div>

            {/* Main pane */}
            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-gray-stroke py-4 pl-7 pr-5">
                <h2 className="min-w-0 truncate font-serif text-[22px] text-gray-dark">
                  {showGeneral ? "General" : (contentItemTitle(selectedItem!.config) || `Untitled ${copy.noun}`)}
                </h2>
                <div className="flex shrink-0 items-center gap-2">
                  {!showGeneral && (
                    <button onClick={() => removeItem(selectedItem!.id)} aria-label={`Remove ${copy.noun}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5484D]/10 text-[#E5484D] transition-colors hover:bg-[#E5484D]/20">
                      <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                    </button>
                  )}
                  <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-7 py-6">
                {showGeneral ? (
                  <ListGeneralFields config={item.config} onChange={onGeneralChange} heading={copy.heading} />
                ) : (
                  <ContentFields key={selectedItem!.id} config={selectedItem!.config} onChange={(patch) => updateItem(selectedItem!.id, patch)} />
                )}
              </div>

              <div className="border-t border-gray-stroke px-7 py-4">
                <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={!complete} onClick={onSave}>
                  Save {copy.heading.toLowerCase()}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------- Course modal (lessons → sections) ---------- */

// A course lesson's own settings (name + description).
function LessonFields({ config, onChange }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Lesson name</label>
        <input value={config.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} placeholder="Name your lesson" autoComplete="off" className={configInputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
        <textarea value={config.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder="Describe this lesson…" autoComplete="off" className={`${configInputClass} resize-none`} />
      </div>
    </div>
  );
}

const courseNavActive = "bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08)]";
const dragHandle = <svg className="h-4 w-4 shrink-0 cursor-grab text-[#C4C4C4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9h16M4 15h16" /></svg>;
const plusIcon = <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>;

function CourseModal({ item, onGeneralChange, onItemsChange, onSave, onClose }: { item: OfferingItem | null; onGeneralChange: (patch: Record<string, string>) => void; onItemsChange: (items: CollectionItem[]) => void; onSave: () => void; onClose: () => void }) {
  const [selected, setSelected] = useState<CourseSelection>({ type: "general" });
  const [dragLesson, setDragLesson] = useState<number | null>(null);
  const [dragSection, setDragSection] = useState<{ lessonId: number; index: number } | null>(null);

  useEffect(() => { if (item) setSelected({ type: "general" }); }, [item?.id]);

  const lessons = item?.items ?? [];
  const complete = item ? isConfigComplete(item) : false;
  const lessonId = selected.type === "general" ? null : selected.lessonId;
  const selLesson = lessonId !== null ? lessons.find((l) => l.id === lessonId) ?? null : null;
  const selSection = selected.type === "section" && selLesson ? (selLesson.sections ?? []).find((s) => s.id === selected.sectionId) ?? null : null;
  const view: "general" | "lesson" | "section" = !selLesson ? "general" : selected.type === "section" && selSection ? "section" : "lesson";

  const addLesson = () => {
    const l = newCourseLesson(lessons);
    onItemsChange([...lessons, l]);
    setSelected({ type: "lesson", lessonId: l.id });
  };
  const removeLesson = (id: number) => {
    onItemsChange(lessons.filter((l) => l.id !== id));
    setSelected({ type: "general" });
  };
  const updateLesson = (id: number, patch: Record<string, string>) =>
    onItemsChange(lessons.map((l) => (l.id === id ? { ...l, config: { ...l.config, ...patch } } : l)));
  const reorderLessons = (from: number, to: number) => {
    const next = [...lessons];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onItemsChange(next);
  };
  const addSection = (lid: number) => {
    const lesson = lessons.find((l) => l.id === lid);
    if (!lesson) return;
    const secs = lesson.sections ?? [];
    const created = newCourseSection(secs);
    onItemsChange(lessons.map((l) => (l.id === lid ? { ...l, sections: [...secs, created] } : l)));
    setSelected({ type: "section", lessonId: lid, sectionId: created.id });
  };
  const removeSection = (lid: number, sid: number) => {
    onItemsChange(lessons.map((l) => (l.id === lid ? { ...l, sections: (l.sections ?? []).filter((s) => s.id !== sid) } : l)));
    setSelected({ type: "lesson", lessonId: lid });
  };
  const updateSection = (lid: number, sid: number, name: string) =>
    onItemsChange(lessons.map((l) => (l.id === lid ? { ...l, sections: (l.sections ?? []).map((s) => (s.id === sid ? { ...s, name } : s)) } : l)));
  const reorderSections = (lid: number, from: number, to: number) =>
    onItemsChange(lessons.map((l) => {
      if (l.id !== lid) return l;
      const secs = [...(l.sections ?? [])];
      const [m] = secs.splice(from, 1);
      secs.splice(to, 0, m);
      return { ...l, sections: secs };
    }));

  const headerTitle = view === "general" ? "General" : view === "lesson" ? (selLesson!.config.title || "Untitled lesson") : (selSection!.name || "Untitled section");

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[750px] max-h-[85vh] w-full max-w-[860px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            {/* Sidebar */}
            <div className="flex w-[264px] shrink-0 flex-col border-r border-gray-stroke bg-[#FAFAFA]">
              <p className="px-5 pb-3 pt-6 font-serif text-[28px] text-gray-dark">Course</p>
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                <button
                  type="button"
                  onClick={() => setSelected({ type: "general" })}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${view === "general" ? `${courseNavActive} font-medium text-gray-dark` : "text-gray-light hover:bg-black/[0.03]"}`}
                >
                  General
                </button>

                {lessons.map((lesson, li) => {
                  const lessonActive = selected.type === "lesson" && selected.lessonId === lesson.id;
                  const secs = lesson.sections ?? [];
                  return (
                    <div key={lesson.id} className="mt-1">
                      <div
                        draggable
                        onDragStart={() => setDragLesson(li)}
                        onDragEnter={() => { if (dragLesson !== null && dragLesson !== li) { reorderLessons(dragLesson, li); setDragLesson(li); } }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={() => setDragLesson(null)}
                        onClick={() => setSelected({ type: "lesson", lessonId: lesson.id })}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors ${lessonActive ? courseNavActive : "hover:bg-black/[0.03]"}`}
                      >
                        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-gray-dark">{lesson.config.title || "Untitled lesson"}</span>
                        {dragHandle}
                      </div>

                      <div className="mt-0.5 flex flex-col gap-0.5">
                        {secs.map((sec, si) => {
                          const secActive = selected.type === "section" && selected.sectionId === sec.id;
                          return (
                            <div
                              key={sec.id}
                              draggable
                              onDragStart={(e) => { e.stopPropagation(); setDragSection({ lessonId: lesson.id, index: si }); }}
                              onDragEnter={() => { if (dragSection && dragSection.lessonId === lesson.id && dragSection.index !== si) { reorderSections(lesson.id, dragSection.index, si); setDragSection({ lessonId: lesson.id, index: si }); } }}
                              onDragOver={(e) => e.preventDefault()}
                              onDragEnd={() => setDragSection(null)}
                              onClick={() => setSelected({ type: "section", lessonId: lesson.id, sectionId: sec.id })}
                              className={`flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pl-6 pr-3 transition-colors ${secActive ? courseNavActive : "hover:bg-black/[0.03]"}`}
                            >
                              <span className={`min-w-0 flex-1 truncate text-[14px] ${secActive ? "font-medium text-gray-dark" : "text-gray-light"}`}>{sec.name || "Untitled section"}</span>
                              {dragHandle}
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => addSection(lesson.id)}
                          className="flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 pr-3 text-left text-[14px] font-medium text-gray-light transition-colors hover:bg-black/[0.03]"
                        >
                          {plusIcon}
                          Add section
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addLesson}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-light transition-colors hover:bg-black/[0.03]"
                >
                  {plusIcon}
                  Add lesson
                </button>
              </div>
            </div>

            {/* Main pane */}
            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-gray-stroke py-4 pl-7 pr-5">
                <h2 className="min-w-0 truncate font-serif text-[22px] text-gray-dark">{headerTitle}</h2>
                <div className="flex shrink-0 items-center gap-2">
                  {view === "lesson" && (
                    <button onClick={() => removeLesson(selLesson!.id)} aria-label="Remove lesson" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5484D]/10 text-[#E5484D] transition-colors hover:bg-[#E5484D]/20">
                      <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                    </button>
                  )}
                  {view === "section" && (
                    <button onClick={() => removeSection(selLesson!.id, selSection!.id)} aria-label="Remove section" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5484D]/10 text-[#E5484D] transition-colors hover:bg-[#E5484D]/20">
                      <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                    </button>
                  )}
                  <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-7 py-6">
                {view === "general" && <ListGeneralFields config={item.config} onChange={onGeneralChange} heading="Course" />}
                {view === "lesson" && selLesson && <LessonFields key={selLesson.id} config={selLesson.config} onChange={(patch) => updateLesson(selLesson.id, patch)} />}
                {view === "section" && selLesson && selSection && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Section name</label>
                      <input value={selSection.name} onChange={(e) => updateSection(selLesson.id, selSection.id, e.target.value)} placeholder="Name this section" autoComplete="off" className={configInputClass} />
                    </div>
                    <PlaceholderFields label="Section builder" />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-stroke px-7 py-4">
                <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={!complete} onClick={onSave}>
                  Save course
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------- Shared config field bits ---------- */

const configInputClass = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark";

// A dollar-prefixed price input used inside v2 product config modals. Stores the
// raw numeric string; formats to two decimals on blur.
function PriceField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-gray-stroke bg-white px-4 transition-colors focus-within:border-gray-dark">
      <span className="text-[15px] text-gray-light">$</span>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        onBlur={() => { if (value !== "" && !Number.isNaN(Number(value))) onChange(Number(value).toFixed(2)); }}
        placeholder="0.00"
        className="w-full bg-transparent py-3 pl-1.5 text-[15px] text-gray-dark outline-none placeholder:text-[#B1B1B1]"
      />
    </div>
  );
}

// A leading checkbox with a label + description — the standard settings row.
function ToggleRow({ label, desc, checked, onChange, className = "" }: { label: string; desc?: string; checked: boolean; onChange: () => void; className?: string }) {
  return (
    <button type="button" onClick={onChange} className={`flex w-full items-start gap-3 text-left ${className}`}>
      <span className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${checked ? "border-gray-dark bg-gray-dark" : "border-gray-stroke bg-white"}`}>
        {checked && <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-gray-dark">{label}</span>
        {desc && <span className="mt-0.5 block text-[14px] leading-snug text-gray-light">{desc}</span>}
      </span>
    </button>
  );
}

// Unified content-setting row: a 24px icon (floating on the left), a
// headline + subheadline, and a checkbox on the right. The divider sits under
// the text (not the icon); expanded `children` sit under the text too.
function SettingRow({ icon, title, desc, checked, onChange, children, divider = true }: {
  icon: ReactNode; title: string; desc: string; checked: boolean; onChange: () => void; children?: ReactNode; divider?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex shrink-0 pt-5 text-gray-dark">{icon}</span>
      <div className={`min-w-0 flex-1 pt-5 pb-5 ${divider ? "border-b border-gray-stroke" : ""}`}>
        <button type="button" onClick={onChange} className="flex w-full items-start justify-between gap-4 text-left">
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold text-gray-dark">{title}</span>
            <span className="mt-0.5 block text-[15px] leading-snug text-gray-light">{desc}</span>
          </span>
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-[1.5px] transition-colors ${checked ? "border-gray-dark bg-gray-dark" : "border-gray-stroke bg-white"}`}>
            {checked && <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
          </span>
        </button>
        {checked && children}
      </div>
    </div>
  );
}

// Metadata field styled like SettingRow (icon + headline + subheadline) but with
// its input control below instead of a right-hand checkbox — so the content
// metadata fields read as the same system as the Leland+ / Advanced rows.
function FieldRow({ icon, title, desc, children, divider = true }: { icon: string; title: string; desc?: string; children: ReactNode; divider?: boolean }) {
  return (
    <div className="flex gap-4">
      <span className="flex shrink-0 pt-5 text-gray-dark"><MaskIcon src={icon} className="h-6 w-6 text-gray-dark" /></span>
      <div className={`min-w-0 flex-1 pt-5 pb-5 ${divider ? "border-b border-gray-stroke" : ""}`}>
        <p className="text-[15px] font-semibold text-gray-dark">{title}</p>
        {desc && <p className="mt-0.5 text-[15px] leading-snug text-gray-light">{desc}</p>}
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

// Click-to-pick file control. No real upload — captures the chosen file's name
// so the prototype can reflect a "finished" state.
// Image upload with a live preview. Demo-only: the picked file becomes an
// in-memory object URL (so it survives navigation between steps but not a page
// refresh) — no upload/persistence.
function ImageUploadField({ value, onChange, label, hint, accept = "image/*" }: { value: string | null; onChange: (url: string | null) => void; label: string; hint: string; accept?: string }) {
  const [isVideo, setIsVideo] = useState(false);
  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setIsVideo(f.type.startsWith("video/")); onChange(URL.createObjectURL(f)); }
    e.target.value = "";   // let the same file be re-selected after removal
  };
  if (value) {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-gray-stroke">
        {isVideo ? (
          <video src={value} muted playsInline className="aspect-[1200/630] w-full object-cover" />
        ) : (
          <img src={value} alt="Upload preview" className="aspect-[1200/630] w-full object-cover" />
        )}
        <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/45 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <label className="cursor-pointer rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-semibold text-gray-dark shadow-sm transition-colors hover:bg-white">
            Replace
            <input type="file" accept={accept} className="hidden" onChange={pick} />
          </label>
          <button type="button" onClick={() => { onChange(null); setIsVideo(false); }} className="rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-semibold text-[#E5484D] shadow-sm transition-colors hover:bg-white">
            Remove
          </button>
        </div>
      </div>
    );
  }
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-gray-hover px-4 py-16 text-center transition-colors hover:bg-[#ececec]">
      <input type="file" accept={accept} className="hidden" onChange={pick} />
      <MaskIcon src={uploadIcon} className="h-8 w-8 text-gray-light" />
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-gray-dark">{label}</span>
        <span className="text-[15px] text-gray-light">{hint}</span>
      </div>
    </label>
  );
}

function UploadField({ value, onChange, hint, label = "Upload a file" }: { value: string; onChange: (name: string) => void; hint: string; label?: string }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-stroke bg-[#FAFAFA] px-4 py-6 text-center transition-colors hover:border-[#c9c9c9]">
      <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f.name); }} />
      <MaskIcon src={uploadIcon} className={`h-6 w-6 ${value ? "text-gray-dark" : "text-gray-light"}`} />
      <span className="text-[15px] font-medium text-gray-dark">{value || label}</span>
      <span className="text-[13px] text-gray-light">{value ? "Click to replace" : hint}</span>
    </label>
  );
}

/* ---------- Content config (upload new / reuse existing) ---------- */

function ContentFields({ config, onChange, priced = false }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void; priced?: boolean }) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  // Leland+ section is an accordion: closed by default, open if already enabled.
  const [lelandOpen, setLelandOpen] = useState(config.lelandPlus === "true" || config.r_lelandPlus === "true");
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");

  // The active mode (persisted in config so parent helpers can read it). The
  // two modes keep independent data so switching tabs never bleeds across.
  const source: "upload" | "reuse" = config.source === "reuse" ? "reuse" : config.source === "upload" ? "upload" : (config.libraryId ? "reuse" : "upload");
  const setSource = (t: "upload" | "reuse") => onChange({ source: t });

  const q = query.trim().toLowerCase();
  const results = q
    ? CONTENT_LIBRARY.filter((c) => c.title.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
    : CONTENT_LIBRARY;
  // Reusing writes only reuse-namespaced ("r_") keys, never the upload fields.
  const selectLibrary = (c: LibraryContent) =>
    onChange({ source: "reuse", libraryId: c.id, r_assetName: c.name, r_title: c.title, r_description: c.description, r_resourceType: c.resourceType, price: c.price.toFixed(2) });
  const selectedLib = config.libraryId ? CONTENT_LIBRARY.find((c) => c.id === config.libraryId) ?? null : null;

  // Edit-screen flow: snapshot the config on open so Cancel can discard changes.
  const snapshotRef = useRef<Record<string, string> | null>(null);
  const openEdit = () => { snapshotRef.current = { ...config }; setEditing(true); };
  const cancelEdit = () => { if (snapshotRef.current) onChange(snapshotRef.current); setEditing(false); };
  const saveEdit = () => setEditing(false);

  // Editable metadata fields bound to a config-key namespace ("" for a freshly
  // uploaded asset, "r_" for a reused library asset).
  const renderMetadata = (p: string) => {
    const g = (f: string) => config[`${p}${f}`] ?? "";
    const set = (f: string, v: string) => onChange({ [`${p}${f}`]: v });
    const isOn = (f: string) => config[`${p}${f}`] === "true";
    const flip = (f: string) => onChange({ [`${p}${f}`]: isOn(f) ? "false" : "true" });
    return (
      <>
        <div>
          <FieldRow icon={labelTagIcon} title="Title" desc="The name people will see for this content.">
            <input value={g("title")} onChange={(e) => set("title", e.target.value)} placeholder="Give your content a title" autoComplete="off" className={configInputClass} />
          </FieldRow>
          <FieldRow icon={textIcon} title="Description" desc="A short summary of what this content is.">
            <textarea value={g("description")} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Describe what this is…" autoComplete="off" className={`${configInputClass} resize-none`} />
          </FieldRow>
          <FieldRow icon={stackIcon} title="Resource type" desc="Choose the category that best fits it." divider={priced}>
            <Select value={g("resourceType") || "guide"} onChange={(v) => set("resourceType", v)} options={RESOURCE_TYPES} />
          </FieldRow>
          {priced && (
            <FieldRow icon={moneyIcon} title="Price" desc="What buyers pay for this content in the offering." divider={false}>
              <PriceField value={config.price ?? ""} onChange={(v) => onChange({ price: v })} />
            </FieldRow>
          )}
        </div>

        {/* Leland+ library — collapsible section (open when already enabled) */}
        <div className="border-t border-gray-stroke">
          <button type="button" onClick={() => setLelandOpen((v) => !v)} className="flex w-full items-center justify-between py-5 text-left">
            <span className="text-[17px] font-semibold text-gray-dark">Leland+ library</span>
            <svg className={`h-5 w-5 shrink-0 text-gray-dark transition-transform ${lelandOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <AnimatePresence initial={false}>
            {lelandOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={offeringTransition} className="overflow-hidden">
          <SettingRow
            icon={<MaskIcon src={bookOpenIcon} className="h-6 w-6 text-gray-dark" />}
            title="Add to the Leland+ library"
            desc="Anyone with a Leland+ subscription can access it. You’ll get paid based on usage."
            checked={isOn("lelandPlus")}
            onChange={() => flip("lelandPlus")}
            divider={isOn("lelandPlus")}
          />

          <AnimatePresence initial={false}>
          {isOn("lelandPlus") && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={offeringTransition} className="overflow-hidden">
              <SettingRow
                icon={<MaskIcon src={eyeClosedIcon} className="h-6 w-6 text-gray-dark" />}
                title="Submit anonymously"
                desc="Your name won’t appear on this resource."
                checked={isOn("anonymous")}
                onChange={() => flip("anonymous")}
              />

              {/* Content visibility — same row layout (icon + content), no checkbox */}
              <div className="flex gap-4">
                <span className="flex shrink-0 pt-5 text-gray-dark"><MaskIcon src={globeIcon} className="h-6 w-6 text-gray-dark" /></span>
                <div className="min-w-0 flex-1 pt-5 pb-5">
                  <p className="text-[15px] font-semibold text-gray-dark">Content visibility</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      { key: "public", label: "Public", desc: "Appears in search results" },
                      { key: "unlisted", label: "Unlisted", desc: "Won't appear in search results" },
                    ].map((opt) => {
                      const active = (g("visibility") || "public") === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => set("visibility", opt.key)}
                          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${active ? "border-[1.5px] border-gray-dark" : "border border-gray-stroke hover:border-[#c9c9c9]"}`}
                        >
                          <span className="min-w-0">
                            <span className="block text-[15px] font-semibold text-gray-dark">{opt.label}</span>
                            <span className="block text-[13px] text-gray-light">{opt.desc}</span>
                          </span>
                          <RadioDot active={active} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Advanced settings — collapsible; shares the unified SettingRow design.
            -mt-5 cancels the parent's gap-5 so the divider sits symmetrically
            between the two accordion headers. */}
        <div className="-mt-5 border-t border-gray-stroke">
          <button type="button" onClick={() => setAdvancedOpen((v) => !v)} className="flex w-full items-center justify-between py-5 text-left">
            <span className="text-[17px] font-semibold text-gray-dark">Advanced settings</span>
            <svg className={`h-5 w-5 shrink-0 text-gray-dark transition-transform ${advancedOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <AnimatePresence initial={false}>
            {advancedOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={offeringTransition} className="overflow-hidden">
                <SettingRow
                  icon={<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v11" /><path d="m7 10 5 5 5-5" /><path d="M5 19h14" /></svg>}
                  title="Allow users to download this file"
                  desc="Not supported for videos"
                  checked={isOn("downloadable")}
                  onChange={() => flip("downloadable")}
                />

                <SettingRow
                  icon={<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>}
                  title="Attach a separate, downloadable file"
                  desc="Add an extra asset, like a spreadsheet or worksheet, for users to download. The file above should explain it."
                  checked={isOn("attachFile")}
                  onChange={() => flip("attachFile")}
                >
                  <div className="mt-3">
                    <UploadField value={g("attachmentName")} onChange={(name) => set("attachmentName", name)} hint="The file members can download" label="Click to upload or drag and drop" />
                  </div>
                </SettingRow>

                <SettingRow
                  icon={<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-4.35-4.35a2 2 0 0 0-2.83 0L4 20" /></svg>}
                  title="Add a custom thumbnail"
                  desc="Upload a custom thumbnail to help this resource stand out. A screenshot or eye-catching mockup works well."
                  checked={isOn("thumbnailEnabled")}
                  onChange={() => flip("thumbnailEnabled")}
                  divider={false}
                >
                  <div className="mt-3">
                    <UploadField value={g("thumbnail")} onChange={(name) => set("thumbnail", name)} hint="PNG, JPG, JPEG, GIF, WEBP, SVG, HEIC" label="Click to upload or drag and drop" />
                  </div>
                </SettingRow>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  };

  // Inline SVGs (shared viewBox + strokeWidth + currentColor) so both icons
  // render at a consistent weight/size and inherit the tab's text color.
  const tabs = [
    {
      key: "upload" as const,
      label: "Upload new",
      icon: (
        <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16M4 12h16" /></svg>
      ),
    },
    {
      key: "reuse" as const,
      label: "Reuse existing",
      icon: (
        <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12l-2 2-2-2" />
          <path d="M6.34 6.34A8 8 0 0 1 20 12c0 .6-.07 1.2-.2 1.77" />
          <path d="M2 12l2-2 2 2" />
          <path d="M17.66 17.66A8 8 0 0 1 4 12c0-.61.07-1.2.2-1.77" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar / pivot — mirrors the profile template tabs. Negative margins
          pull it full-bleed past the modal's px-7 content padding. */}
      <div className="-mx-7 flex border-b border-gray-stroke">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSource(t.key)}
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 transition-colors ${source === t.key ? "border-gray-dark text-gray-dark" : "border-transparent text-gray-light hover:text-gray-dark"}`}
          >
            {t.icon}
            <span className="text-[15px] font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      {source === "upload" ? (
        <>
          <UploadField value={config.assetName ?? ""} onChange={(name) => onChange({ source: "upload", assetName: name })} hint="PDF, video, image, or doc" />
          {renderMetadata("")}
        </>
      ) : (
        <div>
          <div className="relative">
            <svg className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your content…"
              autoComplete="off"
              className="w-full rounded-full border border-transparent bg-gray-hover px-4 py-3 pl-11 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
            />
          </div>

          <div className="mt-3 flex max-h-[440px] flex-col gap-2 overflow-y-auto pb-20">
            {results.map((c) => {
              const selected = config.libraryId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectLibrary(c)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${selected ? "border-gray-dark bg-gray-hover" : "border-gray-stroke hover:border-[#c9c9c9]"}`}
                >
                  <img src={c.thumb} alt="" className="h-11 w-[68px] shrink-0 rounded-[6px] object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-gray-dark">{c.title}</span>
                    <span className="block truncate text-[13px] text-gray-light">Uploaded {c.date} · {formatViews(c.views)} views</span>
                  </span>
                  <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${selected ? "border-gray-dark bg-gray-dark" : "border-gray-stroke bg-white"}`}>
                    {selected && <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                  </span>
                </button>
              );
            })}
            {results.length === 0 && (
              <p className="py-8 text-center text-[14px] text-gray-light">No content matches “{query}”.</p>
            )}
          </div>

          {/* Selected-asset indicator — a sticky bar pinned just above the Save CTA */}
          {selectedLib && (
            <div className="sticky bottom-0 -mx-7 -mb-1 flex items-center justify-between gap-3 border-t border-gray-stroke bg-white px-7 pb-2 pt-3">
              <span className="flex min-w-0 items-center gap-2 text-[15px] text-gray-light">
                <MaskIcon src={attachIcon} className="h-[18px] w-[18px] shrink-0 text-gray-light" />
                <span className="truncate">Selected: {config.r_title || selectedLib.title}</span>
              </span>
              <button type="button" onClick={openEdit} className="flex shrink-0 items-center gap-1.5 text-[15px] text-gray-light transition-colors hover:text-gray-dark">
                <MaskIcon src={editIcon} className="h-4 w-4" />
                <span className="underline underline-offset-2">Edit</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit screen — an in-modal pane that slides in from the right and
          replaces the modal's content (it fills the modal box via absolute
          inset-0, whose containing block is the modal frame). */}
      <AnimatePresence>
        {editing && selectedLib && (
          <motion.div
            key="edit-pane"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 z-30 flex flex-col bg-white"
          >
            <button onClick={cancelEdit} aria-label="Close" className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            <div className="px-7 pt-8">
              <h2 className="pr-10 font-serif text-[28px] leading-tight text-gray-dark">Edit content</h2>
              <p className="mt-1.5 text-[15px] text-gray-light">{selectedLib.title} <span className="text-gray-extra-light">· Uploaded {selectedLib.date}</span></p>
            </div>

            <div className="flex-1 overflow-y-auto px-7 pb-2 pt-6">
              {/* Warning banner above the fields */}
              <div className="mb-3 rounded-md bg-[#FEE6E3] px-4 py-3 text-center text-[14px] font-medium text-[#D92D20]">
                This will affect all iterations of this resource
              </div>
              <div className="flex flex-col gap-5">{renderMetadata("r_")}</div>
            </div>

            <div className="flex gap-3 px-7 pb-7 pt-4">
              <Button size="lg" variant="secondary" rounded="rounded-full" className="flex-1" onClick={cancelEdit}>Cancel</Button>
              <Button size="lg" variant="primary" rounded="rounded-full" className="flex-1" onClick={saveEdit}>Save</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Coaching time config ---------- */

// Large, weighty numeric field: a big centered number with a dotted underline
// over a unit label, inside a tall bordered card.
function TimeField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-2xl border border-gray-stroke px-4 py-7 transition-colors focus-within:border-gray-dark">
      <input
        inputMode="numeric"
        value={value}
        placeholder="0"
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        className="w-full min-w-0 bg-transparent text-center text-[40px] font-medium leading-none text-gray-dark underline decoration-gray-dark decoration-dotted decoration-2 underline-offset-[6px] outline-none placeholder:text-gray-dark"
      />
      <span className="mt-3 text-[17px] text-gray-light">{label}</span>
    </div>
  );
}

function CoachingTimeFields({ config, onChange, lockedMode = null }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void; lockedMode?: "set" | "range" | null }) {
  const v2 = useV2();
  // When another coaching-time in the offering already fixed the mode, this one
  // is locked to match it — keep the stored mode in sync and disable the toggle.
  const mode = lockedMode ?? (config.mode === "range" ? "range" : "set");
  useEffect(() => {
    if (lockedMode && config.mode !== lockedMode) onChange({ mode: lockedMode });
  }, [lockedMode, config.mode, onChange]);
  const modes = [
    { value: "set", label: "Set amount of hours" },
    { value: "range", label: "Range of hours" },
  ];
  // v2: coaching time is auto-priced from hours × the expert's hourly rate.
  const hrs = mode === "range"
    ? (Number(config.minHours || 0) + Number(config.maxHours || 0)) / 2
    : Number(config.hours || 0) + Number(config.minutes || 0) / 60;
  const autoPrice = Math.round(hrs * EXPERT_HOURLY_RATE);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {modes.map((opt) => {
          const active = mode === opt.value;
          const disabled = Boolean(lockedMode) && opt.value !== lockedMode;
          return (
            <div key={opt.value} className="group relative">
              <button
                type="button"
                disabled={disabled}
                onClick={() => { if (!disabled) onChange({ mode: opt.value }); }}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border-[1.5px] bg-white px-4 py-3.5 text-left transition-colors ${active ? "border-gray-dark" : "border-gray-stroke hover:border-[#c9c9c9]"} ${disabled ? "pointer-events-none cursor-not-allowed opacity-40" : ""}`}
              >
                <span className="text-[15px] font-semibold text-gray-dark">{opt.label}</span>
                <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${active ? "border-gray-dark" : "border-[#CFCFCF]"}`}>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-gray-dark" />}
                </span>
              </button>
              {disabled && (
                <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-gray-dark px-3 py-2 text-[12px] font-medium leading-snug text-white shadow-[0_4px_16px_rgba(16,24,40,0.18)] group-hover:block">
                  All coaching time in an offering must use the same format.
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mb-3 mt-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-gray-extra-light">
        {mode === "set" ? "Enter an amount of time" : "Enter a range of time"}
      </p>
      {mode === "set" ? (
        <div className="grid grid-cols-2 gap-4">
          <TimeField value={config.hours ?? ""} onChange={(v) => onChange({ hours: v })} label="hours" />
          <TimeField value={config.minutes ?? ""} onChange={(v) => onChange({ minutes: v })} label="minutes" />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <TimeField value={config.minHours ?? ""} onChange={(v) => onChange({ minHours: v })} label="min hours" />
          <span className="shrink-0 text-[24px] font-medium text-gray-light" aria-hidden="true">–</span>
          <TimeField value={config.maxHours ?? ""} onChange={(v) => onChange({ maxHours: v })} label="max hours" />
        </div>
      )}

      {/* Delivery format — how the coaching time is delivered. */}
      <div className="mt-5">
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Delivery Format</label>
        <Select
          value={config.delivery ?? ""}
          onChange={(v) => onChange({ delivery: v })}
          options={deliveryFormats}
          placeholder="Select an option"
          triggerClassName="py-3 pl-4 pr-3 text-[15px]"
        />
      </div>

      {/* v2: coaching time is auto-priced from the expert's hourly rate. */}
      {v2 && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-gray-hover px-4 py-3.5">
          <span className="flex min-w-0 items-center gap-2.5">
            <MaskIcon src={moneyIcon} className="h-[18px] w-[18px] shrink-0 text-gray-light" />
            <span className="text-[14px] leading-snug text-gray-light">
              {hrs > 0 ? `${formatHours(hrs)} × your $${EXPERT_HOURLY_RATE.toLocaleString()}/hr rate` : "Set the time to price this automatically"}
            </span>
          </span>
          <span className="shrink-0 text-[16px] font-semibold text-gray-dark">${formatMoney(autoPrice)}</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Step 3: Customer-facing page ---------- */

function PageStep({
  name, headline, pricingMode, paidType, price, description, setDescription,
  sections, onAddSection, onUpdateSection, onRemoveSection, onReorderSections,
}: {
  name: string; headline: string; pricingMode: "free" | "paid"; paidType: "recurring" | "one-time"; price: string;
  description: string; setDescription: (v: string) => void;
  sections: PageSection[];
  onAddSection: (kind: PageSectionKind) => void;
  onUpdateSection: (next: PageSection) => void;
  onRemoveSection: (id: number) => void;
  onReorderSections: (next: PageSection[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5 rounded-xl bg-gray-hover px-4 py-3">
        <MaskIcon src={eyeIcon} className="h-[18px] w-[18px] shrink-0 text-gray-light" />
        <span className="text-[15px] font-medium text-gray-light">Configure the public-facing page for this offering.</span>
      </div>

      {/* Name + headline + description */}
      <h3 className="mt-8 font-serif text-[40px] leading-tight text-gray-dark">
        {name || <span className="text-[#B1B1B1]">Your offering name here</span>}
      </h3>
      <p className="mt-2 text-[18px] font-normal leading-tight text-gray-extra-light">
        {headline || <span className="text-[#C4C4C4]">Your headline appears here</span>}
      </p>

      {/* Price + author bar */}
      <div className="mt-4 flex items-center rounded-xl border border-gray-stroke">
        <div className="flex flex-1 items-center justify-center gap-2 py-3 text-[15px] font-medium text-gray-dark">
          <MaskIcon src={labelTagIcon} className="h-4 w-4 text-gray-light" />
          {pricingMode === "free" ? "Free" : `$${price}${paidType === "recurring" ? " / month" : ""}`}
        </div>
        <div className="h-6 w-px bg-gray-stroke" />
        <div className="flex flex-1 items-center justify-center gap-2 py-3 text-[15px] font-medium text-gray-dark">
          <img src={samanthaPhoto} alt="" className="h-5 w-5 rounded-full object-cover" />
          By Samantha Parker
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
        placeholder="Describe what customers get with this offering…"
        className="mt-3 w-full resize-none rounded-xl border border-gray-stroke bg-white px-3.5 py-3 text-[15px] leading-relaxed text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark"
      />
      <button type="button" className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark">
        <MaskIcon src={aiIcon} className="h-4 w-4" />
        Generate a description
      </button>

      {/* Added sections — drag-and-drop reorderable (live), above the picker */}
      {sections.length > 0 && (
        <Reorder.Group axis="y" values={sections} onReorder={onReorderSections} as="div" className="mt-8 flex flex-col">
          {sections.map((sec) => (
            <PageSectionCard
              key={sec.id}
              section={sec}
              onChange={onUpdateSection}
              onRemove={() => onRemoveSection(sec.id)}
            />
          ))}
        </Reorder.Group>
      )}

      {/* Add section — same button style as the "Add product" grid */}
      <div className="mt-8 border-t border-gray-stroke pt-6">
        <p className="mb-2 text-[14px] font-medium text-gray-light">Add section</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {pageSectionTypes.map((s) => (
            <button
              key={s.label}
              onClick={() => onAddSection(s.kind)}
              className="group flex items-center justify-between rounded-xl bg-gray-hover px-3 py-2 text-left transition-colors hover:bg-[#ececec]"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px]">
                  <img src={s.icon} alt="" className="h-5 w-5" />
                </span>
                <span className="text-[15px] font-semibold text-gray-dark">{s.label}</span>
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors group-hover:text-gray-dark">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Page section card + editors ---------- */

const chevronUpIcon = <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>;
const chevronDownIcon = <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>;

// Small round icon button used for the section reorder / remove controls.
function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent ${danger ? "text-gray-light hover:bg-[#E5484D]/10 hover:text-[#E5484D]" : "text-gray-light hover:bg-gray-hover hover:text-gray-dark"}`}
    >
      {children}
    </button>
  );
}

// Five-star rating row.
function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-3.5 w-3.5 ${i < n ? "text-[#F5A623]" : "text-[#E0E0E0]"}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" /></svg>
      ))}
    </span>
  );
}

function PageSectionCard({ section, onChange, onRemove }: {
  section: PageSection;
  onChange: (next: PageSection) => void; onRemove: () => void;
}) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      as="div"
      value={section}
      dragListener={false}
      dragControls={dragControls}
      className="group relative bg-white py-6"
    >
      {/* Drag handle — sits in the left margin, outside the content, on hover.
          Only the handle initiates the drag (dragListener is off). */}
      <span
        onPointerDown={(e) => dragControls.start(e)}
        aria-label="Drag to reorder"
        className="absolute -left-7 top-7 flex h-6 w-5 cursor-grab touch-none items-center justify-center text-gray-extra-light opacity-0 transition-opacity hover:text-gray-light group-hover:opacity-100 active:cursor-grabbing"
      >
        <MaskIcon src={dragDotsIcon} className="h-[18px] w-[18px]" />
      </span>

      {/* Optional headline (every section) + a remove "X" across from it, on hover. */}
      <div className="mb-3 flex items-center gap-3">
        <input
          value={section.heading}
          onChange={(e) => onChange({ ...section, heading: e.target.value })}
          placeholder="Add an optional header..."
          className="min-w-0 flex-1 bg-transparent text-[24px] font-semibold leading-tight text-gray-dark outline-none placeholder:text-[#B1B1B1]"
        />
        <span className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
          <IconBtn label="Remove section" danger onClick={onRemove}>
            <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
          </IconBtn>
        </span>
      </div>

      {section.kind === "text" && <TextSectionEditor section={section} onChange={onChange} />}
      {section.kind === "faqs" && <FaqsSectionEditor section={section} onChange={onChange} />}
      {section.kind === "checklist" && <ChecklistSectionEditor section={section} onChange={onChange} />}
      {section.kind === "media" && <MediaSectionEditor section={section} onChange={onChange} />}
      {section.kind === "reviews" && <ReviewsSectionEditor section={section} onChange={onChange} />}
    </Reorder.Item>
  );
}

function TextSectionEditor({ section, onChange }: { section: Extract<PageSection, { kind: "text" }>; onChange: (next: PageSection) => void }) {
  return (
    <textarea
      value={section.body}
      onChange={(e) => onChange({ ...section, body: e.target.value })}
      rows={4}
      placeholder="Write your text…"
      className="w-full resize-none rounded-xl border border-gray-stroke bg-white px-3.5 py-3 text-[15px] leading-relaxed text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark"
    />
  );
}

function FaqsSectionEditor({ section, onChange }: { section: Extract<PageSection, { kind: "faqs" }>; onChange: (next: PageSection) => void }) {
  const faqs = section.faqs;
  const setFaqs = (next: FaqItem[]) => onChange({ ...section, faqs: next });
  const addFaq = () => setFaqs([...faqs, { id: faqs.reduce((m, f) => Math.max(m, f.id), 0) + 1, question: "", answer: "" }]);
  const updateFaq = (id: number, patch: Partial<FaqItem>) => setFaqs(faqs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const removeFaq = (id: number) => setFaqs(faqs.filter((f) => f.id !== id));
  const moveFaq = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= faqs.length) return;
    const next = [...faqs];
    [next[i], next[j]] = [next[j], next[i]];
    setFaqs(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((f, i) => (
        <div key={f.id} className="rounded-xl border border-gray-stroke p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-light">Question {i + 1}</span>
            <div className="flex items-center gap-0.5">
              <IconBtn label="Move question up" disabled={i === 0} onClick={() => moveFaq(i, -1)}>{chevronUpIcon}</IconBtn>
              <IconBtn label="Move question down" disabled={i === faqs.length - 1} onClick={() => moveFaq(i, 1)}>{chevronDownIcon}</IconBtn>
              <IconBtn label="Remove question" danger onClick={() => removeFaq(f.id)}><MaskIcon src={trashIcon} className="h-4 w-4" /></IconBtn>
            </div>
          </div>
          <input value={f.question} onChange={(e) => updateFaq(f.id, { question: e.target.value })} placeholder="Question" autoComplete="off" className={configInputClass} />
          <textarea value={f.answer} onChange={(e) => updateFaq(f.id, { answer: e.target.value })} rows={2} placeholder="Answer" className={`${configInputClass} mt-2 resize-none`} />
        </div>
      ))}
      <button onClick={addFaq} className="flex items-center gap-1.5 self-start text-[15px] font-medium text-gray-dark transition-colors hover:text-gray-light">
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
        <span className="underline decoration-dotted underline-offset-2">Add question</span>
      </button>
    </div>
  );
}

function ChecklistSectionEditor({ section, onChange }: { section: Extract<PageSection, { kind: "checklist" }>; onChange: (next: PageSection) => void }) {
  const items = section.items;
  const setItems = (next: ChecklistItem[]) => onChange({ ...section, items: next });
  const addItem = () => { if (items.length < MAX_CHECKLIST_ITEMS) setItems([...items, { id: items.reduce((m, it) => Math.max(m, it.id), 0) + 1, text: "" }]); };
  const updateItem = (id: number, text: string) => setItems(items.map((it) => (it.id === id ? { ...it, text } : it)));
  const removeItem = (id: number) => setItems(items.filter((it) => it.id !== id));

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-[20px] border border-gray-stroke bg-white px-3">
        {items.map((it, i) => (
          <div key={it.id} className={`flex items-center ${i > 0 ? "border-t border-gray-stroke" : ""}`}>
            <img src={checkmarkFilledIcon} alt="" className="h-5 w-5 shrink-0" />
            <input value={it.text} onChange={(e) => updateItem(it.id, e.target.value)} placeholder={`Item ${i + 1}`} autoComplete="off" className="min-w-0 flex-1 bg-transparent px-2.5 py-4 text-[15px] text-gray-dark outline-none placeholder:text-[#B1B1B1]" />
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(it.id)} aria-label="Remove item" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-extra-light transition-colors hover:text-gray-light">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        ))}
      </div>
      {items.length < MAX_CHECKLIST_ITEMS && (
        <button onClick={addItem} className="flex items-center gap-1.5 self-start text-[15px] font-medium text-gray-dark transition-colors hover:text-gray-light">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          <span className="underline decoration-dotted underline-offset-2">Add item</span>
        </button>
      )}
    </div>
  );
}

function MediaSectionEditor({ section, onChange }: { section: Extract<PageSection, { kind: "media" }>; onChange: (next: PageSection) => void }) {
  return (
    <ImageUploadField
      value={section.fileName || null}
      onChange={(url) => onChange({ ...section, fileName: url ?? "" })}
      label="Upload media"
      hint="JPG, PNG, GIF, MP4, MOV · Max 100MB"
      accept="image/*,video/*"
    />
  );
}

const MAX_REVIEWS = 3;

function ReviewsSectionEditor({ section, onChange }: { section: Extract<PageSection, { kind: "reviews" }>; onChange: (next: PageSection) => void }) {
  const [picking, setPicking] = useState(false);
  // Chosen review IDs, in order — stored compactly (no empty slots).
  const reviews = section.slots.filter((s): s is number => s !== null);
  const addReview = (id: number) => onChange({ ...section, slots: [...reviews, id] });
  const removeReview = (idx: number) => onChange({ ...section, slots: reviews.filter((_, i) => i !== idx) });

  return (
    <>
      <div className="flex flex-col gap-6">
        {reviews.map((reviewId, i) => {
          const review = existingReviews.find((r) => r.id === reviewId);
          if (!review) return null;
          return (
            <div key={i} className="group/review relative flex flex-col">
              <button
                onClick={() => removeReview(i)}
                aria-label="Remove review"
                className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full text-gray-extra-light opacity-0 transition-opacity hover:text-gray-light group-hover/review:opacity-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>

              {/* Reviewer — avatar + name + role */}
              <div className="flex items-center gap-3">
                <img src={review.photo} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-gray-dark">{review.name}</div>
                  <div className="truncate text-[14px] text-gray-light">{review.role}</div>
                </div>
              </div>

              {/* Rating + date */}
              <div className="mt-3 flex items-center gap-2 text-[14px] text-gray-light">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <MaskIcon key={s} src={starFilledIcon} className={`h-3.5 w-3.5 ${s < review.rating ? "text-gray-dark" : "text-gray-extra-light"}`} />
                  ))}
                </span>
                <span className="text-gray-extra-light">·</span>
                <span>{review.date}</span>
              </div>

              {/* Body */}
              <p className="mt-3 text-[15px] leading-relaxed text-gray-dark">{review.text}</p>

              {/* Outcome */}
              {review.accepted && (
                <div className="mt-4 flex items-center gap-2 text-[15px] text-gray-dark">
                  <span className="text-[16px] leading-none">🎓</span>
                  {review.accepted}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state — a single "Select a review" card until the first is added. */}
        {reviews.length === 0 && (
          <button
            onClick={() => setPicking(true)}
            className="group/review flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-gray-hover px-4 py-16 text-center transition-colors hover:bg-[#ececec]"
          >
            <div className="flex items-center gap-0 text-gray-extra-light opacity-50 transition-opacity group-hover/review:opacity-100">
              {Array.from({ length: 5 }).map((_, s) => (
                <MaskIcon key={s} src={starFilledIcon} className="h-4 w-4" />
              ))}
            </div>
            <span className="text-[15px] font-medium text-gray-light underline decoration-dotted underline-offset-2">Select a review</span>
          </button>
        )}
      </div>

      {/* Add another review — a link + a count, once at least one is added. */}
      {reviews.length > 0 && reviews.length < MAX_REVIEWS && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button onClick={() => setPicking(true)} className="flex items-center gap-1.5 text-[15px] font-medium text-gray-dark transition-colors hover:text-gray-light">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            <span className="underline decoration-dotted underline-offset-2">Add another review</span>
          </button>
          <span className="text-[14px] font-medium text-gray-light">{reviews.length}/{MAX_REVIEWS}</span>
        </div>
      )}

      <ReviewPicker
        open={picking}
        chosen={reviews}
        onSelect={(id) => { addReview(id); setPicking(false); }}
        onClose={() => setPicking(false)}
      />
    </>
  );
}

// Modal for choosing one of the coach's existing reviews to feature.
function ReviewPicker({ open, chosen, onSelect, onClose }: { open: boolean; chosen: number[]; onSelect: (id: number) => void; onClose: () => void }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-gray-stroke px-6 py-5">
              <h2 className="font-serif text-[24px] text-gray-dark">Select a review</h2>
              <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                {existingReviews.map((r) => {
                  const used = chosen.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      disabled={used}
                      onClick={() => onSelect(r.id)}
                      className={`flex flex-col rounded-xl border p-4 text-left transition-colors ${used ? "border-gray-stroke opacity-40" : "border-gray-stroke hover:border-gray-dark"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2.5">
                          <img src={r.photo} alt="" className="h-8 w-8 rounded-full object-cover" />
                          <span className="text-[14px] font-semibold text-gray-dark">{r.name}</span>
                        </span>
                        <Stars n={r.rating} />
                      </div>
                      <p className="mt-2 text-[14px] leading-snug text-gray-light">“{r.text}”</p>
                      {used && <span className="mt-2 text-[12px] font-medium text-gray-extra-light">Already featured</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------- Live preview card ---------- */

function ProductPreview({ name, headline, pricingMode, paidType, price, cover, multiOption, joinLabel }: { name: string; headline: string; pricingMode: "free" | "paid"; paidType: "recurring" | "one-time"; price: string; cover: string | null; multiOption: boolean; joinLabel: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <img src={cover || coverImage9} alt="" className={`aspect-[1200/630] w-full object-cover ${cover ? "" : "opacity-25"}`} />
      <div className="p-4">
        <p className={`text-[17px] font-semibold leading-tight ${name ? "text-gray-dark" : "text-gray-extra-light"}`}>{name || "Your offering name here"}</p>
        {headline ? (
          <p className="mt-1 text-[15px] leading-snug text-gray-light">{headline}</p>
        ) : (
          <p className="mt-1 text-[15px] leading-snug text-[#C4C4C4]">Your headline appears here</p>
        )}

        {pricingMode === "paid" && (
          <p className="mt-3 text-[15px] font-semibold text-gray-dark">
            {multiOption && "Starting at "}
            ${formatMoney(Number(price))} <span className="font-normal text-gray-light">{paidType === "recurring" ? "/ month" : "one-time"}</span>
          </p>
        )}

        <Button size="lg" variant="primary" rounded="rounded-full" className="mt-3 w-full text-[15px]">
          {joinLabel}
        </Button>
      </div>
    </div>
  );
}
