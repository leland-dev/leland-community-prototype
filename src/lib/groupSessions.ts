// Group sessions — paid, live classes that only exist inside an offering. Each
// one has its own shareable page (/offering/:slug/session/:id), but access comes
// from buying the parent offering, so the session always points back to it.
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic7 from "../assets/profile photos/pic-7.png";

export type GroupSession = {
  id: string;
  offeringSlug: string;
  name: string;
  description: string[];
  image: string;
  // Display-ready schedule (prototype data, not real dates).
  month: string;
  day: string;
  dateLabel: string;
  timeLabel: string;
  durationMin: number;
  enrolled: number;
  // Price when the session is sold on its own (standalone offering).
  price: number;
  agenda: string[];
};

// Other products bundled into an offering alongside its group sessions — the
// same types the coach picks in the offering builder.
export type BundledProduct = {
  kind: "coaching-time" | "content" | "course";
  title: string;
  detail: string;
  price: number;
};

export const GROUP_SESSIONS: GroupSession[] = [
  {
    id: "why-mba-workshop",
    offeringSlug: "mba-application-package",
    name: "Nailing Your “Why MBA” Story",
    description: [
      "Most applicants answer “Why MBA?” with a list of things the degree offers. Admissions committees want something else: a clear line from where you've been to where you're going, and why this program is the missing piece.",
      "In this live group session, Samantha walks through the framework she uses with every client, breaks down real (anonymized) essays that worked, and workshops a few attendee stories live. You'll leave with a draft outline of your own narrative.",
      "Bring a rough idea of your post-MBA goal. Cameras optional, questions encouraged.",
    ],
    image: eventImg1,
    month: "Nov",
    day: "12",
    dateLabel: "Wednesday, Nov 12",
    timeLabel: "6:00 PM – 7:30 PM PT",
    durationMin: 90,
    enrolled: 22,
    price: 149,
    agenda: [
      "The three-part “Why MBA” framework",
      "Teardown of essays that got into H/S/W",
      "Live feedback on attendee stories",
      "Open Q&A",
    ],
  },
  {
    id: "interview-lab",
    offeringSlug: "mba-application-package",
    name: "Interview Lab: Behavioral Questions",
    description: [
      "A hands-on session on the behavioral questions that show up in nearly every MBA interview. Samantha models strong answers, then runs live mock rounds with volunteers so everyone can see feedback in action.",
    ],
    image: eventImg2,
    month: "Dec",
    day: "3",
    dateLabel: "Wednesday, Dec 3",
    timeLabel: "6:00 PM – 7:00 PM PT",
    durationMin: 60,
    enrolled: 14,
    price: 99,
    agenda: ["Structuring STAR answers", "Live mock rounds", "Common pitfalls", "Q&A"],
  },
];

export const BUNDLED_PRODUCTS: Record<string, BundledProduct[]> = {
  "mba-application-package": [
    { kind: "coaching-time", title: "5h of coaching", detail: "$150/hr · Live Sessions", price: 750 },
    { kind: "content", title: "MBA Essay Playbook", detail: "Guide", price: 99 },
    { kind: "course", title: "School Selection Masterclass", detail: "6 lessons", price: 101 },
  ],
};

// Attendee avatars for the "people going" stack.
export const ATTENDEES = [
  { name: "Maya", photo: pic1 },
  { name: "Jordan", photo: pic2 },
  { name: "Alex", photo: pic4 },
  { name: "Priya", photo: pic5 },
  { name: "Sam", photo: pic7 },
];

// Prototype admin flag: preview offerings whose only product is a group
// session. The session page drops the bundle, and the offering page redirects
// straight to the session.
export const STANDALONE_SESSION_KEY = "group-session-standalone";

export function isStandaloneSessionMode(): boolean {
  try { return localStorage.getItem(STANDALONE_SESSION_KEY) === "1"; } catch { return false; }
}

export function getGroupSession(offeringSlug: string | undefined, id: string | undefined) {
  return GROUP_SESSIONS.find((s) => s.offeringSlug === offeringSlug && s.id === id);
}

export function getGroupSessionsForOffering(offeringSlug: string | undefined) {
  return GROUP_SESSIONS.filter((s) => s.offeringSlug === offeringSlug);
}
