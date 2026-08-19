// Catalog of customer-facing offerings shown on the profile "Offerings" tab and
// on the standalone offering page (/offering/:slug). One source of truth so the
// grid card and the detail page never drift.
import designMentorshipCover from "../assets/placeholder images/offering-images/6a47dc2bb0982d533096264a.avif";
import landRoleCover from "../assets/placeholder images/offering-images/6a47d9ac398d8afe96319817.avif";
import interviewPrepCover from "../assets/placeholder images/offering-images/6a499011e7b7966f939ef6f6.avif";
import portfolioReviewCover from "../assets/placeholder images/offering-images/6a47db26e7b7966f939eee7a.avif";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";
import bootcampImg1 from "../assets/placeholder images/bootcamp-1.webp";
import lelandPlusImg1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import lelandPlusImg2 from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";
import lelandPlusImg3 from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";

export type Offering = {
  slug: string;
  title: string;
  headline: string;
  price: string;
  startingAt?: boolean;
  origPrice?: string;
  savePct?: number;
  image?: string;
  // Longer body shown on the offering page under the price/author bar.
  description?: string;
};

// Collapsed grid height on the profile — three rows at the widest (3-col) breakpoint.
export const AB_COLLAPSED_COUNT = 9;

export const OFFERINGS: Offering[] = [
  { slug: "10-hour-coaching-package", title: "10-Hour Coaching Package", headline: "Ten one-on-one coaching hours at a bundled rate.", price: "$1,200", origPrice: "$1,500", savePct: 20, image: designMentorshipCover, description: "Work with Samantha across ten focused, one-on-one sessions tailored to wherever you are in the process. Use the hours however you need — application strategy, essay edits, mock interviews, or school selection — and lock in a bundled rate that beats booking hours individually." },
  { slug: "mba-application-package", title: "MBA Application Package", headline: "End-to-end support from strategy through submission.", price: "$750", startingAt: true, origPrice: "$950", savePct: 21, image: landRoleCover, description: "A comprehensive, end-to-end package that carries you from initial strategy all the way through final submission. Samantha helps you shape your narrative, choose the right schools, and polish every essay so your application stands out." },
  { slug: "interview-prep-package", title: "Interview Prep Package", headline: "Mock interviews and personalized feedback.", price: "$500", startingAt: true, origPrice: "$625", savePct: 20, image: interviewPrepCover, description: "Walk into every interview calm and prepared. This package pairs realistic mock interviews with sharp, specific feedback so you can refine your stories, tighten your delivery, and handle any question with confidence." },
  { slug: "gmat-exam-prep-bootcamp", title: "GMAT Exam Prep Bootcamp", headline: "A structured cohort to hit your target score.", price: "$899", origPrice: "$1,150", savePct: 22, image: bootcampImg1, description: "A structured, cohort-based bootcamp designed to get you to your target score. Follow a proven study plan, drill the highest-leverage question types, and stay accountable alongside a group chasing the same goal." },
  { slug: "how-i-got-into-stanford-gsb", title: "How I Got Into Stanford GSB", headline: "A candid breakdown of my winning application.", price: "$29", image: lelandPlusImg1, description: "A candid, behind-the-scenes breakdown of the exact application that got Samantha into Stanford GSB — essays, positioning, and the decisions that made the difference." },
  { slug: "gmat-study-plan", title: "GMAT Study Plan: 3 Months to 750+", headline: "My week-by-week plan to a top score.", price: "$19", image: lelandPlusImg2, description: "The week-by-week study plan Samantha used to reach a 750+. A clear, realistic roadmap you can follow over three months, with the resources and milestones that actually move your score." },
  { slug: "essay-review-package", title: "Essay Review Package", headline: "Polish your essays with detailed, line-by-line edits.", price: "$400", startingAt: true, origPrice: "$500", savePct: 20, image: portfolioReviewCover, description: "Get detailed, line-by-line edits on your essays. Samantha helps you sharpen your story, cut what isn't working, and make sure every essay lands with clarity and impact." },
  { slug: "school-selection-strategy", title: "School Selection Strategy", headline: "Build a smart, balanced list of target schools.", price: "$600", startingAt: true, origPrice: "$750", savePct: 20, image: eventImg2, description: "Build a smart, balanced list of target schools grounded in your profile and goals. Samantha helps you calibrate reach, target, and safety schools so you apply where you have the best shot at getting in." },
  { slug: "resume-cover-letter-package", title: "Resume & Cover Letter Package", headline: "Sharpen your resume and cover letters.", price: "$300", startingAt: true, origPrice: "$380", savePct: 21, image: eventImg3, description: "Turn your experience into a resume and cover letters that get noticed. Samantha helps you frame your accomplishments, tighten your language, and present a polished, cohesive story." },
  { slug: "5-hour-quick-start-package", title: "5-Hour Quick Start Package", headline: "Five focused hours to get your application moving.", price: "$650", origPrice: "$800", savePct: 19, image: bootcampImg1, description: "Five focused hours to get your application off the ground fast. Ideal if you're just getting started and want a strong foundation before diving into the full process." },
  { slug: "consulting-recruiting-timeline", title: "My Consulting Recruiting Timeline", headline: "A week-by-week recruiting roadmap.", price: "$25", image: lelandPlusImg3, description: "A week-by-week roadmap through consulting recruiting — networking, applications, and case prep — so you always know what to do next and when to do it." },
  { slug: "crafting-your-mba-resume", title: "Crafting Your MBA Resume", headline: "Turn your experience into a standout resume.", price: "$19", image: lelandPlusImg2, description: "A practical guide to turning your experience into a standout MBA resume, with the frameworks and examples Samantha uses with her own clients." },
];

export function getOfferingBySlug(slug: string | undefined): Offering | undefined {
  return OFFERINGS.find((o) => o.slug === slug);
}
