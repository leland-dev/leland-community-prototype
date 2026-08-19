// Catalog of a coach's uploaded content resources — shown in the Content
// page table and the per-resource details page. One source of truth so the
// row and the detail view never drift.
import thumbEssay from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import thumbTemplate from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";
import thumbGuide from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";
import thumbEvent1 from "../assets/placeholder images/placeholder-event-01.png";
import thumbEvent2 from "../assets/placeholder images/placeholder-event-02.png";
import thumbEvent3 from "../assets/placeholder images/placeholder-event-03.png";

export type Resource = {
  id: string;
  title: string;
  date: string;
  price: string;
  lelandPlus: boolean;
  // Slugs into the OFFERINGS catalog this resource is bundled into.
  offerings: string[];
  earnings: string;
  likes: number;
  views: number;
  status: "Public" | "Unlisted" | "Private";
  // "Upload new content" modal fields.
  description: string;
  resourceType: string;
  fileName: string;
  fileType: "Video" | "PDF" | "Doc" | "Spreadsheet";
  category: string;
  topics: string[];
  organizations: string[];
  downloadable: boolean;
  attachmentName: string;
  cover: string;
};

export const RESOURCES: Resource[] = [
  {
    id: "hbs-winning-essays",
    title: "Winning Essays from My HBS Admits [7/17/2026] (Recording)",
    date: "Jul 17, 2026", price: "$25", lelandPlus: true, offerings: ["mba-application-package", "essay-review-package"],
    earnings: "$142.80", likes: 24, views: 1420, status: "Public",
    description: "A full recording walking through the essays that got three of my clients into Harvard Business School, with commentary on what admissions committees respond to.",
    resourceType: "Example", fileName: "hbs-winning-essays.mp4", fileType: "Video",
    category: "MBA", topics: ["Essays", "Application Strategy"], organizations: ["Harvard Business School"],
    downloadable: false, attachmentName: "", cover: thumbEssay,
  },
  {
    id: "gsb-winning-essays",
    title: "Winning Essays from My Stanford GSB Admits [7/24/2026] (Recording)",
    date: "Jul 24, 2026", price: "$25", lelandPlus: true, offerings: ["mba-application-package"],
    earnings: "$98.40", likes: 18, views: 1110, status: "Public",
    description: "An annotated walkthrough of admitted Stanford GSB essays, breaking down positioning, structure, and voice.",
    resourceType: "Example", fileName: "gsb-winning-essays.mp4", fileType: "Video",
    category: "MBA", topics: ["Essays"], organizations: ["Stanford GSB"],
    downloadable: false, attachmentName: "", cover: thumbGuide,
  },
  {
    id: "case-coach-throwdown",
    title: "Live Case Coach Throwdown: Bain vs. McKinsey",
    date: "Jul 24, 2026", price: "$0", lelandPlus: true, offerings: [],
    earnings: "$0.13", likes: 2, views: 51, status: "Public",
    description: "A live case-cracking session comparing Bain and McKinsey interview styles, with two coaches working the same case in real time.",
    resourceType: "Example", fileName: "case-throwdown.mp4", fileType: "Video",
    category: "Consulting", topics: ["Interview Prep"], organizations: ["Bain & Company", "McKinsey & Company"],
    downloadable: false, attachmentName: "", cover: thumbEvent1,
  },
  {
    id: "session-3-recording",
    title: "Session 3 Recording",
    date: "Jul 16, 2026", price: "$40", lelandPlus: false, offerings: ["interview-prep-package"],
    earnings: "$0.00", likes: 0, views: 5, status: "Private",
    description: "A private cohort session recording covering behavioral interview prep and story-building using the STAR method.",
    resourceType: "Recording", fileName: "session-3.mp4", fileType: "Video",
    category: "MBA", topics: ["Interview Prep"], organizations: [],
    downloadable: false, attachmentName: "", cover: thumbEvent2,
  },
  {
    id: "trip-itinerary-claude",
    title: "Build a Full Trip Itinerary with Claude (Cowork, Code & Design)",
    date: "Jun 3, 2026", price: "$0", lelandPlus: true, offerings: [],
    earnings: "$0.00", likes: 3, views: 252, status: "Public",
    description: "A hands-on workshop showing how to plan and design a complete trip itinerary end-to-end using Claude.",
    resourceType: "Guide", fileName: "trip-itinerary.mp4", fileType: "Video",
    category: "Product Management", topics: ["Application Strategy"], organizations: [],
    downloadable: false, attachmentName: "", cover: thumbEvent3,
  },
  {
    id: "mba-application-roadmap",
    title: "Your MBA Application Roadmap",
    date: "Jun 1, 2026", price: "$18", lelandPlus: false, offerings: ["mba-application-package", "10-hour-coaching-package", "school-selection-strategy"],
    earnings: "$0.00", likes: 0, views: 13, status: "Public",
    description: "A week-by-week roadmap PDF that takes you from initial research through final submission, with checklists for each milestone.",
    resourceType: "Guide", fileName: "mba-roadmap.pdf", fileType: "PDF",
    category: "MBA", topics: ["Application Strategy", "School Selection"], organizations: [],
    downloadable: true, attachmentName: "roadmap-checklist.xlsx", cover: thumbGuide,
  },
  {
    id: "mba-week-kickoff",
    title: "MBA Application Week Kickoff [6/1/2026] (Recording)",
    date: "Jun 1, 2026", price: "$0", lelandPlus: true, offerings: [],
    earnings: "$0.00", likes: 0, views: 43, status: "Public",
    description: "The kickoff session recording for MBA Application Week, setting the agenda and covering the fundamentals of a standout application.",
    resourceType: "Recording", fileName: "mba-kickoff.mp4", fileType: "Video",
    category: "MBA", topics: ["Application Strategy"], organizations: [],
    downloadable: false, attachmentName: "", cover: thumbEvent1,
  },
  {
    id: "personal-budget-claude",
    title: "Build Your Personal Budget with Claude",
    date: "Jun 1, 2026", price: "$12", lelandPlus: false, offerings: ["10-hour-coaching-package", "5-hour-quick-start-package"],
    earnings: "$0.00", likes: 0, views: 48, status: "Public",
    description: "A downloadable spreadsheet template plus a short walkthrough for building and maintaining a personal budget.",
    resourceType: "Template", fileName: "budget-template.xlsx", fileType: "Spreadsheet",
    category: "Product Management", topics: ["Application Strategy"], organizations: [],
    downloadable: true, attachmentName: "budget-template.xlsx", cover: thumbTemplate,
  },
  {
    id: "pitch-deck-claude",
    title: "Build an Investor-Level Pitch Deck with Claude, Excel & PowerPoint [5/29/2026] (Recording)",
    date: "May 29, 2026", price: "$29", lelandPlus: true, offerings: ["mba-application-package"],
    earnings: "$61.20", likes: 12, views: 340, status: "Public",
    description: "A full recording of building an investor-grade pitch deck from scratch using Claude, Excel, and PowerPoint together.",
    resourceType: "Guide", fileName: "pitch-deck.mp4", fileType: "Video",
    category: "Consulting", topics: ["Application Strategy"], organizations: [],
    downloadable: false, attachmentName: "", cover: thumbEvent2,
  },
];

export function getResourceById(id: string | undefined): Resource | undefined {
  return RESOURCES.find((r) => r.id === id);
}
