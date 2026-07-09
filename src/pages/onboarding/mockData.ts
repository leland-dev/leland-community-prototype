/* ─────────────────────────────────────────────────────────────────────────
 * Onboarding mock data — coach faces (coach-count screen), cohort roster and
 * a pre-seeded feed (cohort-arrival screen).
 * ──────────────────────────────────────────────────────────────────────── */

import pic1 from "../../assets/profile photos/pic-1.png";
import pic3 from "../../assets/profile photos/pic-3.png";
import pic5 from "../../assets/profile photos/pic-5.png";
import pic6 from "../../assets/profile photos/pic-6.png";
import pic7 from "../../assets/profile photos/pic-7.png";
import pic8 from "../../assets/profile photos/pic-8.png";
import pic9 from "../../assets/profile photos/pic-9.png";
import pic10 from "../../assets/profile photos/pic-10.png";
import pic11 from "../../assets/profile photos/pic-11.png";
import pic12 from "../../assets/profile photos/pic-12.png";

export type CoachFace = { photo: string; rating: number; reviews: number };

export const COACH_FACES: CoachFace[] = [
  { photo: pic7, rating: 4.9, reviews: 312 },
  { photo: pic1, rating: 5.0, reviews: 184 },
  { photo: pic3, rating: 4.9, reviews: 240 },
  { photo: pic5, rating: 4.8, reviews: 156 },
  { photo: pic6, rating: 5.0, reviews: 98 },
  { photo: pic8, rating: 4.9, reviews: 271 },
  { photo: pic9, rating: 4.9, reviews: 142 },
];

export const MEMBER_AVATARS: string[] = [pic9, pic10, pic11, pic12, pic6, pic8];

export type FeedPost = {
  id: string;
  author: string;
  avatar: string;
  role: string;
  time: string;
  text: string;
  pinned?: boolean;
  coach?: boolean;
  likes: number;
  replies: number;
};

/** A pre-seeded feed keyed to the user's cohort + target. */
export function seededFeed(cohortName: string, target?: string): FeedPost[] {
  const goal = target ?? "your goal";
  return [
    {
      id: "pinned",
      author: "Leland Team",
      avatar: pic1,
      role: "Start here",
      time: "pinned",
      text: `Welcome to ${cohortName} 👋 Introduce yourself below — say what you're working toward and where you're starting. This is the fastest way to get help.`,
      pinned: true,
      likes: 128,
      replies: 44,
    },
    {
      id: "coach",
      author: "Priya R.",
      avatar: pic7,
      role: "Coach · ex-AdCom",
      time: "2h",
      coach: true,
      text: `The single biggest mistake I see for ${goal}: waiting too long to get feedback. Post an early draft here and I'll react to a few this week.`,
      likes: 96,
      replies: 21,
    },
    {
      id: "m1",
      author: "Maya P.",
      avatar: pic10,
      role: `Targeting ${goal}`,
      time: "5h",
      text: `Started 3 weeks ago and already feel less lost. The people in here are unreasonably helpful. Happy to swap notes with anyone at the same stage!`,
      likes: 64,
      replies: 12,
    },
    {
      id: "m2",
      author: "Andre S.",
      avatar: pic11,
      role: `Targeting ${goal}`,
      time: "yesterday",
      text: `Just booked my first session with a coach from here. Wish I'd done this months ago.`,
      likes: 51,
      replies: 8,
    },
  ];
}

export const COACH_REPLY = {
  author: "John K.",
  avatar: pic3,
  role: "Coach · ex-McKinsey",
  text: "Welcome in! 🎉 Great first post — I dropped a couple of resources in your DMs to get you started. You're in the right place.",
};
