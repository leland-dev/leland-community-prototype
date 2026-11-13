import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { QuickPreferencesModal } from "../components/QuickPreferencesModal";
import { SelectCohortModal } from "../components/LiveCourseCard";
import { loadPersonalizationData, type PersonalizationData } from "../components/PersonalizationModal";
import { FontWeight, IconChevronDown, IconCode, IconDotsHorizontal, IconLightBulb, IconPencil, IconSearch, IconSparkle, Modal, ModalContent, ModalSize, SwitchInput, Tag, TagColor, TagSize } from "../components/leland";
import { CategoryPicker } from "../components/CategoryPicker";
import { MultiSelectDropdown } from "../components/MultiSelectDropdown";
import { IconUserProfileGroup } from "../components/icons/IconUserProfileGroup";
import { type BuildCardStyle, setBuildCardStyle, useBuildCardStyle } from "../components/lesson-blocks";
import { useTopNavStyle } from "../contexts/TopNavStyleContext";
import { useSelectedCategory } from "../contexts/SelectedCategoryContext";
import { useDisplayName } from "../contexts/DisplayNameContext";
import { CATEGORIES, CATEGORY_TO_USE_CASES, ROLE_TO_CATEGORY } from "../lib/categories";
import homeIcon from "../assets/img/program-hub/hdr-e8a6d.svg";
import calendarArrowIcon from "../assets/img/program-hub/hdr-03896.svg";
import slackIcon from "../assets/icons/slack-black.svg";
import chevronOverIcon from "../assets/img/program-hub/4e81c.svg";
import chevronOverWhiteIcon from "../assets/img/program-hub/9dd7f.svg";
import playIcon from "../assets/img/program-hub/73875.svg";
import sessionThumb from "../assets/img/program-hub/39f89.png";
import levelOne from "../assets/img/program-hub/1cef3.png";
import levelTwo from "../assets/img/program-hub/8e6c3.png";
import levelThree from "../assets/img/program-hub/fa1b2.png";
import levelFour from "../assets/img/program-hub/a93d8.png";
import imgTriage from "../assets/img/builds/triage-agent.svg";
import imgMetrics from "../assets/img/builds/metrics-digest.svg";
import imgPrompts from "../assets/img/builds/prompt-library.svg";
import imgInvoice from "../assets/img/builds/invoice-reconciliation.svg";
import imgNotes from "../assets/img/builds/meeting-notes.svg";
import imgOnboarding from "../assets/img/builds/onboarding-bot.svg";
import imgCrm from "../assets/img/builds/crm-cleanup.svg";
import imgCallCoach from "../assets/img/builds/sales-call-coach.svg";
import imgLeadBrief from "../assets/img/builds/lead-brief.svg";
import imgColdOutboundEmail from "../assets/img/builds/cold-outbound-email.svg";
import imgPrecallBriefing from "../assets/img/builds/precall-briefing.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic13 from "../assets/profile photos/pic-13.png";
import lelandProfileIcon from "../assets/leland-logos/leland-profile.png";
import imgLeadQualAgent from "../assets/img/program-hub/lead-qualification-agent.png";
import imgMeetingNotesToCrm from "../assets/img/program-hub/meeting-notes-to-crm.png";
import heroPhoto from "../assets/placeholder images/placeholder-event-02.png";
// Real featured images from the live Leland+ library (the only tutorials with
// a distinct thumbnail there — the rest share a generic placeholder).
import imgNewHireWelcomePage from "../assets/img/leland-plus-thumbnails/new-hire-welcome-page.png";
import imgBudgetOnePager from "../assets/img/leland-plus-thumbnails/budget-one-pager.png";
import imgCompanyOnePager from "../assets/img/leland-plus-thumbnails/company-one-pager.png";
import imgFeatureLaunchPage from "../assets/img/leland-plus-thumbnails/feature-launch-page.png";
import imgInteractiveSopChecklist from "../assets/img/leland-plus-thumbnails/interactive-sop-checklist.png";
// Real screenshots from the live community-build submissions (fetched from
// each content entry's public /thumbnail endpoint — a video-frame grab, not
// the gated page content).
// On-brand generated mockups (preview batch) — first pass at unique,
// on-palette Tutorial thumbnails (tan/rust/blue/red/yellow/gray/green/slate
// only, no off-brand orange/purple/teal), with a couple using the "content
// bleeds past the card" treatment for tall documents.
import imgContractReview from "../assets/img/builds-v2/contract-review.svg";
import imgCashFlowForecast from "../assets/img/builds-v2/cash-flow-forecast.svg";
import imgResumeScreening from "../assets/img/builds-v2/resume-screening.svg";
import imgDocsQaBot from "../assets/img/builds-v2/docs-qa-bot.svg";
import imgCitationChecker from "../assets/img/builds-v2/citation-checker.svg";
import imgAbTestReadout from "../assets/img/builds-v2/ab-test-readout.svg";
import imgOnboardingChecklist from "../assets/img/builds-v2/onboarding-checklist.svg";
import imgAuditEvidence from "../assets/img/builds-v2/audit-evidence.svg";
import imgHoaPortal from "../assets/img/community-build-thumbnails/hoa-portal.jpg";
import imgLuxTravel from "../assets/img/community-build-thumbnails/lux-travel.jpg";
import imgSiftCeliac from "../assets/img/community-build-thumbnails/sift-celiac.jpg";
import imgCompetitiveIntelWiki from "../assets/img/community-build-thumbnails/competitive-intel-wiki.jpg";
import imgMemeMonday from "../assets/img/community-build-thumbnails/meme-monday.jpg";
import imgBookClubSite from "../assets/img/community-build-thumbnails/book-club-site.jpg";
import imgMarathonPlan from "../assets/img/community-build-thumbnails/marathon-plan.jpg";

// Program hub: the page between "My content" and a course. It shows where the learner is in the program,
// their live sessions, every level (each links to its course), and the program's resources.
// Layout follows the "Program Hub · New" design in Figma (Courses — Programs).

const COURSE_PATH = "/content-viewer"; // the Level 1 course player

type Level = {
  number: number;
  title: string;
  image: string;
  status: "complete" | "in-progress" | "not-started";
  progressPct?: number;
  to: string;
  liveSessions: string | null;
};

const LEVELS: Level[] = [
  { number: 1, title: "Level 1: Use AI to 10x your impact", image: levelOne, status: "in-progress", progressPct: 50, to: COURSE_PATH, liveSessions: "May 24 cohort · 4 live sessions" },
  { number: 2, title: "Level 2: Build Complex Agentic Workflows", image: levelTwo, status: "not-started", to: "/course/1", liveSessions: "Next cohort starts Jun 21" },
  { number: 3, title: "Level 3: Create Autonomous Agents", image: levelThree, status: "not-started", to: "/course/1", liveSessions: "Next cohort starts Jul 19" },
  { number: 4, title: "Level 4: Build Your Agent Workforce", image: levelFour, status: "not-started", to: "/course/1", liveSessions: null },
];

function AllLevelsModal({
  open,
  onOpenChange,
  onOpenLevel,
  onSelectCohort,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenLevel: (level: Level) => void;
  onSelectCohort: () => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        size={ModalSize.MEDIUM}
        header={<h2 className="text-[20px] font-semibold leading-[1.3] text-gray-dark">All levels</h2>}
      >
        <ul className="flex flex-col divide-y divide-gray-stroke px-6 pb-6">
          {LEVELS.map((lvl) => (
            <li key={lvl.number} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={() => onOpenLevel(lvl)}
                className="flex min-w-px flex-1 items-center gap-4 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              >
                <img src={lvl.image} alt="" className="aspect-[115.25/60.5] w-[136px] shrink-0 rounded-lg border border-black/5 object-cover sm:w-[160px]" />
                <div className="flex min-w-px flex-1 flex-col gap-1.5">
                  <p className="text-[14px] font-semibold leading-[1.35] text-gray-dark">{lvl.title}</p>
                  {lvl.status === "not-started" ? (
                    <span className="text-[12px] leading-[1.5] text-gray-extra-light">Not started</span>
                  ) : (
                    <ProgressBar pct={lvl.progressPct ?? 0} label={`${lvl.progressPct}% complete`} className="max-w-[180px]" />
                  )}
                </div>
              </button>
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                <span className="text-[12px] leading-[1.5] text-gray-light sm:text-right">{lvl.liveSessions ?? "Self-paced"}</span>
                {lvl.liveSessions ? (
                  <Button size="sm" variant="outline" onClick={onSelectCohort} className="w-full font-semibold sm:w-auto">
                    Select cohort
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </ModalContent>
    </Modal>
  );
}

type Item = {
  title: string;
  description: string;
  author: string;
  avatar: string;
  image: string;
  // Every category this resource is tagged with (per the tutorials/skills
  // tagging sheet) — a resource shows up under each one in the "Browse all"
  // filters, not just a single primary category.
  categories: string[];
  useCase: string;
  collection: "Community builds" | "Tutorials" | "Skills";
  tool: string;
};

const ITEMS: Item[] = [
  { title: "A resident portal replacing HOA Group Texts", description: "A resident portal that replaces the HOA's group text chain with a shared calendar, maintenance requests, and announcements.", author: "Matthew Watkins", avatar: pic9, image: imgHoaPortal, categories: [], useCase: "App development", collection: "Community builds", tool: "Slack" },
  { title: "Lux: A Multi-Agent Travel Planning Operating System", description: "A multi-agent system that researches destinations, builds itineraries, and tracks bookings for a whole trip.", author: "Matthew Watkins", avatar: pic9, image: imgLuxTravel, categories: [], useCase: "Research & Intelligence", collection: "Community builds", tool: "Google Drive" },
  { title: "SIFT: A Celiac App", description: "An app that scans menus and labels for gluten and flags which items are safe for a celiac diet.", author: "Matthew Watkins", avatar: pic9, image: imgSiftCeliac, categories: [], useCase: "App development", collection: "Community builds", tool: "Wordpress" },
  { title: "A Living Competitive Intelligence Wiki for Healthcare", description: "A wiki that tracks competitors' moves in healthcare and keeps a running brief updated automatically.", author: "Isabella Martinez", avatar: pic1, image: imgCompetitiveIntelWiki, categories: ["Business Analytics & Intelligence"], useCase: "Research & Intelligence", collection: "Community builds", tool: "Notion" },
  { title: "Winning copy analysis", description: "Analyzes your best-performing copy to find the patterns worth reusing in the next campaign.", author: "Leland", avatar: pic11, image: imgPrompts, categories: ["Marketing"], useCase: "Content Creation", collection: "Skills", tool: "Notion" },
  { title: "Trigger recap", description: "Summarizes which customer triggers fired this week and what action followed each one.", author: "Leland", avatar: pic11, image: imgInvoice, categories: ["Sales"], useCase: "Automation & Ops", collection: "Skills", tool: "Hubspot" },
  { title: "Automated Weekly Meme Monday content for LinkedIn", description: "Generates a week's worth of on-brand meme posts for LinkedIn's Meme Monday, ready to schedule.", author: "Lucas Gonzalez", avatar: pic5, image: imgMemeMonday, categories: ["Marketing"], useCase: "Content Creation", collection: "Community builds", tool: "Slack" },
  { title: "Turning Every Customer Call Into a Ready-to-Send Follow-Up Email", description: "Turns a customer call transcript into a ready-to-send follow-up email with next steps.", author: "Ethan Carter", avatar: pic13, image: imgCallCoach, categories: ["Sales"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Hubspot" },
  { title: "Create an agent that helps you think through decisions", description: "A system that interviews you for your own decision criteria and weights, then builds a matrix that pressure-tests your reasoning", author: "Maya Thompson", avatar: pic6, image: imgNotes, categories: ["Executive"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Notion" },
  { title: "Weekly recap", description: "Pull your week together from tasks, messages, and email into a structured Friday summary covering what shipped, decisions made, blockers, and next week priorities", author: "Leland", avatar: pic11, image: imgMetrics, categories: [], useCase: "Productivity & Planning", collection: "Skills", tool: "Asana" },
  { title: "Customer feedback workflow", description: "Routes incoming customer feedback into themes and flags the ones that need a response.", author: "Ava Johnson", avatar: pic3, image: imgCrm, categories: ["Marketing"], useCase: "Reporting & Analytics", collection: "Community builds", tool: "Slack" },
  { title: "Build your job search OS with Claude", description: "Set up a Claude Project as your job-search brain and an Excel tracker as your record, then sweep your inbox, track a role, and auto-fill an application", author: "Maya Thompson", avatar: pic6, image: imgLeadBrief, categories: [], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Notion" },
  { title: "Build a 1:1 prep assistant", description: "A system that pulls prior notes, goals, and open commitments for one person before your 1:1 and hands you a short brief", author: "Maya Thompson", avatar: pic6, image: imgCallCoach, categories: ["Human Resources"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Google Drive" },
  { title: "An interactive book club site with live voting", description: "A book club site where members vote live on the next pick and track what they've read.", author: "Sophia Lee", avatar: pic8, image: imgBookClubSite, categories: [], useCase: "App development", collection: "Community builds", tool: "Wordpress" },
  { title: "18-week marathon plan built from your own Garmin and coaching data", description: "An 18-week marathon plan that adjusts week to week based on your Garmin data and your coach's notes.", author: "Noah Wilson", avatar: pic13, image: imgMarathonPlan, categories: [], useCase: "Reporting & Analytics", collection: "Community builds", tool: "Google Drive" },
  // Curated from the Sales-tagged rows of the tutorials/skills tagging sheet.
  { title: "Web Design Guidelines", description: "Review UI code against the Vercel Web Interface Guidelines, checking accessibility, interaction patterns, and design best practices, then report findings in terminal", author: "Leland Team", avatar: lelandProfileIcon, image: imgTriage, categories: ["Design", "Engineering"], useCase: "Automation & Ops", collection: "Skills", tool: "Notion" },
  { title: "Transcript Analysis", description: "Extract seven layers of insight from a sales call or meeting transcript, including subtext, buying signals, objections, and missed opportunities", author: "Leland Team", avatar: lelandProfileIcon, image: imgMetrics, categories: ["Sales"], useCase: "Automation & Ops", collection: "Skills", tool: "Hubspot" },
  { title: "Winning Copy Extraction", description: "Analyze top-performing emails or messages to identify the reusable patterns, hooks, and structures behind what works, then build a repeatable playbook", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrompts, categories: ["Marketing", "Sales"], useCase: "Content Creation", collection: "Skills", tool: "Google Drive" },
  { title: "Startup Financial Modeling", description: "Build a 3-5 year financial model for an early-stage startup, covering cohort-based revenue, cost structure, cash flow, headcount, scenario analysis", author: "Leland Team", avatar: lelandProfileIcon, image: imgInvoice, categories: ["Finance & Accounting", "Executive"], useCase: "Reporting & Analytics", collection: "Skills", tool: "Asana" },
  { title: "Trigger Mapping", description: "Identify which business or life events apply to a prospect or audience and map each to a recommended outreach action, angle, and timing", author: "Leland Team", avatar: lelandProfileIcon, image: imgNotes, categories: ["Sales", "Marketing"], useCase: "Automation & Ops", collection: "Skills", tool: "Slack" },
  { title: "Systematic Debugging", description: "Find the root cause of any bug, test failure, or unexpected behavior before proposing fixes, using a four-phase investigation process", author: "Leland Team", avatar: lelandProfileIcon, image: imgOnboarding, categories: ["Engineering"], useCase: "Automation & Ops", collection: "Skills", tool: "Wordpress" },
  { title: "Skill Creator", description: "Build, test, evaluate, and iteratively improve agent skills, from capturing intent and writing a draft to running evals and optimizing", author: "Leland Team", avatar: lelandProfileIcon, image: imgCrm, categories: ["Engineering"], useCase: "App development", collection: "Skills", tool: "Notion" },
  { title: "Stack Trace Explainer", description: "Translate a wall of red error text into plain English — what broke, where, the most likely cause, and the single next thing to try", author: "Leland Team", avatar: lelandProfileIcon, image: imgCallCoach, categories: ["Engineering"], useCase: "Automation & Ops", collection: "Skills", tool: "Hubspot" },
  { title: "SOP Creator", description: "Turn a process description into a clean, scannable standard operating procedure with numbered steps, verification criteria, and a troubleshooting table", author: "Leland Team", avatar: lelandProfileIcon, image: imgLeadBrief, categories: ["Operations"], useCase: "Automation & Ops", collection: "Skills", tool: "Google Drive" },
  { title: "Skill Audit", description: "Audit agent skills against a 7-criterion security, compliance, and quality framework refreshed from authoritative sources each run", author: "Leland Team", avatar: lelandProfileIcon, image: imgColdOutboundEmail, categories: ["Engineering"], useCase: "App development", collection: "Skills", tool: "Asana" },
  { title: "Revenue Monitor", description: "Take a weekly snapshot of the sales pipeline, detect meaningful changes from the prior week, and generate a digest of what moved and why it matters", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrecallBriefing, categories: ["Sales"], useCase: "Reporting & Analytics", collection: "Skills", tool: "Slack" },
  { title: "Sequence Architecture", description: "Design a complete multi-touch outreach sequence with timing, channel, purpose, and escalation logic for any audience and goal", author: "Leland Team", avatar: lelandProfileIcon, image: imgTriage, categories: ["Sales"], useCase: "Automation & Ops", collection: "Skills", tool: "Wordpress" },
  { title: "Share Skills", description: "Package installed agent skills into shareable zip files, clean tool-specific and user-specific references, and generate ready-to-paste install commands", author: "Leland Team", avatar: lelandProfileIcon, image: imgMetrics, categories: ["Engineering"], useCase: "App development", collection: "Skills", tool: "Notion" },
  { title: "Rep Coaching Report", description: "Generate a data-driven coaching report for a sales rep covering pipeline health, deal risks, activity patterns, and specific improvement areas", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrompts, categories: ["Sales"], useCase: "Reporting & Analytics", collection: "Skills", tool: "Hubspot" },
  { title: "QBR Generator", description: "Build a structured quarterly business review covering revenue performance, pipeline coverage, forecast confidence, and deal analysis for leadership", author: "Leland Team", avatar: lelandProfileIcon, image: imgInvoice, categories: ["Sales"], useCase: "Reporting & Analytics", collection: "Skills", tool: "Google Drive" },
  { title: "Personalization Engine", description: "Turn a generic email template into personalized variants by mapping recipient signals to message variables, with example fills", author: "Leland Team", avatar: lelandProfileIcon, image: imgNotes, categories: ["Sales", "Marketing"], useCase: "Automation & Ops", collection: "Skills", tool: "Asana" },
  { title: "Data Cleaner", description: "Normalize a messy spreadsheet without writing formulas — dedupe rows, standardize dates and casing, split combined columns, flag what looks wrong", author: "Leland Team", avatar: lelandProfileIcon, image: imgOnboarding, categories: ["Business Analytics & Intelligence"], useCase: "Automation & Ops", collection: "Skills", tool: "Slack" },
  { title: "Marketing Psychology", description: "Apply psychological principles and behavioral science to marketing decisions, copy, pricing, and design to improve conversions", author: "Leland Team", avatar: lelandProfileIcon, image: imgCrm, categories: ["Marketing"], useCase: "Content Creation", collection: "Skills", tool: "Wordpress" },
  { title: "Persona Development", description: "Build a detailed buyer persona with pain hierarchies, motivations, objections, and language patterns to ground all writing and strategy", author: "Leland Team", avatar: lelandProfileIcon, image: imgCallCoach, categories: ["Marketing"], useCase: "Reporting & Analytics", collection: "Skills", tool: "Notion" },
  { title: "Learn", description: "Audit a completed session to extract what went wrong, what worked, and propose documentation updates so future sessions start better", author: "Leland Team", avatar: lelandProfileIcon, image: imgLeadBrief, categories: ["Engineering"], useCase: "Content Creation", collection: "Skills", tool: "Hubspot" },
  { title: "Brainstorming", description: "Turn a rough idea into a fully reviewed design spec before any code is written, using structured dialogue, trade-off analysis, and a hard gate", author: "Leland Team", avatar: lelandProfileIcon, image: imgColdOutboundEmail, categories: ["Engineering", "Product"], useCase: "Content Creation", collection: "Skills", tool: "Google Drive" },
  { title: "Investor Revenue Report", description: "Turn pipeline and revenue data into a board-ready report covering ARR trends, pipeline coverage, and key metrics benchmarked against targets", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrecallBriefing, categories: ["Executive", "Finance & Accounting"], useCase: "Reporting & Analytics", collection: "Skills", tool: "Asana" },
  { title: "Financial Operations Expert", description: "Analyze business finances across revenue streams, calculate true profit, plan for taxes, and build a bookkeeping system", author: "Leland Team", avatar: lelandProfileIcon, image: imgTriage, categories: ["Finance & Accounting", "Executive"], useCase: "Reporting & Analytics", collection: "Skills", tool: "Slack" },
  { title: "Business Case Builder", description: "Build a tight, one-page business case for any initiative, tool, or investment that a manager or stakeholder can read in under two minutes", author: "Leland Team", avatar: lelandProfileIcon, image: imgMetrics, categories: ["Executive"], useCase: "Productivity & Planning", collection: "Skills", tool: "Wordpress" },
  { title: "Frontend Design", description: "Build production-grade web interfaces with a distinctive, intentional aesthetic that avoids generic AI-generated design patterns", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrompts, categories: ["Design", "Engineering"], useCase: "App development", collection: "Skills", tool: "Notion" },
  { title: "LinkedIn Writer", description: "Generate two LinkedIn posts in different proven formats, matched to the user's voice, ready to copy and post immediately", author: "Leland Team", avatar: lelandProfileIcon, image: imgInvoice, categories: ["Marketing"], useCase: "Content Creation", collection: "Skills", tool: "Hubspot" },
  { title: "Build an interactive checklist for a process you run again and again", description: "Turns a process doc, your notes, or a recorded walkthrough into one shareable web page with a checkbox, an owner, and a notes field on every step", author: "Leland Team", avatar: lelandProfileIcon, image: imgInteractiveSopChecklist, categories: ["Operations"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Google Drive" },
  { title: "Build a one-page launch page for a new feature", description: "Builds one shareable web page from your release notes or PRD that says what changed, who it's for, how to use it, and what's next", author: "Leland Team", avatar: lelandProfileIcon, image: imgFeatureLaunchPage, categories: ["Product", "Marketing"], useCase: "Content Creation", collection: "Tutorials", tool: "Asana" },
  { title: "Build a one-page budget summary for your team", description: "Turns a budget export into one shareable web page that shows plan against actual, the five biggest lines, one callout, and what comes next", author: "Leland Team", avatar: lelandProfileIcon, image: imgBudgetOnePager, categories: ["Finance & Accounting"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Slack" },
  { title: "Build a personal welcome page for each new hire", description: "Builds one shareable web page for a new hire with their day-by-day first week, the people to meet and why, the links they need, and a short FAQ", author: "Leland Team", avatar: lelandProfileIcon, image: imgNewHireWelcomePage, categories: ["Human Resources"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Wordpress" },
  { title: "Build a one-page story of your company", description: "Builds a single shareable web page that says who you serve, the problem you solve, what you sell, and the proof that it works", author: "Leland Team", avatar: lelandProfileIcon, image: imgCompanyOnePager, categories: ["Marketing", "Executive"], useCase: "Content Creation", collection: "Tutorials", tool: "Notion" },
  { title: "Build an AI Document Auditor", description: "Automate document review against a known rule set. Drop in a PDF, get back a structured verdict, no manual comparison required", author: "Leland Team", avatar: lelandProfileIcon, image: imgColdOutboundEmail, categories: ["Legal"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Hubspot" },
  { title: "Designing AI Systems That People Actually Trust and Use", description: "Learn how to design AI systems for adoption, trust, and real-world reliability", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrecallBriefing, categories: ["Product", "Design"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Google Drive" },
  { title: "Build an AI personal trainer", description: "Use Claude Cowork to generate a clickable mobile app prototype that adapts your training to your daily vitals", author: "Leland Team", avatar: lelandProfileIcon, image: imgTriage, categories: ["Design", "Product"], useCase: "App development", collection: "Tutorials", tool: "Asana" },
  { title: "Build a financial model and runway tracker", description: "A system that turns your raw revenue and expense numbers into one running cash-flow model showing burn rate and runway", author: "Leland Team", avatar: lelandProfileIcon, image: imgMetrics, categories: ["Finance & Accounting", "Executive"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Slack" },
  { title: "Automate support ticket triage", description: "A system that reads each incoming support ticket, tags its urgency, and drafts a first response for a human to review before it goes out", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrompts, categories: ["Operations"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Wordpress" },
  { title: "Create an agent that helps you think through decisions", description: "A system that interviews you for your own decision criteria and weights, then builds a matrix that pressure-tests your reasoning", author: "Leland Team", avatar: lelandProfileIcon, image: imgInvoice, categories: ["Executive"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Notion" },
  { title: "Build a customer interview analyzer", description: "A system that reads your customer interview notes and keeps a running document of validated pain points, objections, and quotes", author: "Leland Team", avatar: lelandProfileIcon, image: imgNotes, categories: ["Product", "Design"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Hubspot" },
  { title: "Design your AI chief of staff", description: "A system that pulls your calendar, inbox, Slack, and dashboards into one short briefing naming what needs your decision", author: "Leland Team", avatar: lelandProfileIcon, image: imgOnboarding, categories: ["Executive"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Google Drive" },
  { title: "Automate your A/B test readouts", description: "A system that turns your A/B test results into a plain-language readout naming the outcome, the uncertainty behind it, and one recommended next step", author: "Leland Team", avatar: lelandProfileIcon, image: imgAbTestReadout, categories: ["Business Analytics & Intelligence", "Product", "Marketing"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Asana" },
  { title: "Automate your recurring reports", description: "A system that pulls your recurring report's numbers, compares them to last period, and drafts the write-up for you to review and send", author: "Leland Team", avatar: lelandProfileIcon, image: imgCallCoach, categories: ["Business Analytics & Intelligence"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Slack" },
  { title: "Build an agent that finds where work gets stuck", description: "A system that reads your tracker's timestamp data and ranks the process stages costing you the most time", author: "Leland Team", avatar: lelandProfileIcon, image: imgLeadBrief, categories: ["Operations"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Wordpress" },
  { title: "Build a bot to answer common HR questions", description: "A system that answers employee HR questions from your own policy documents and escalates whatever it shouldn't guess at", author: "Leland Team", avatar: lelandProfileIcon, image: imgColdOutboundEmail, categories: ["Human Resources"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Notion" },
  { title: "Build a Q&A bot for your internal docs", description: "A system that answers your team's questions from your own SOPs and process docs, citing which doc it pulled from, instead of guessing", author: "Leland Team", avatar: lelandProfileIcon, image: imgDocsQaBot, categories: ["Operations"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Hubspot" },
  { title: "Build a rolling cash flow forecast", description: "A system that turns your bank, AR, and AP data into a rolling cash forecast every week and flags any shortfall ahead of time", author: "Leland Team", avatar: lelandProfileIcon, image: imgCashFlowForecast, categories: ["Finance & Accounting", "Executive"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Google Drive" },
  { title: "Automate your invoice bookkeeping", description: "A system that reads each vendor invoice as it arrives and drafts a journal entry for you to approve before it posts", author: "Leland Team", avatar: lelandProfileIcon, image: imgMetrics, categories: ["Finance & Accounting"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Asana" },
  { title: "Automate invoice and PO data entry", description: "A system that pulls vendor, amount, line items, and dates off invoices or POs and gets them into your tracker without manual entry", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrompts, categories: ["Finance & Accounting"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Slack" },
  { title: "Automate contract reviews", description: "A system that checks a new contract against your playbook, clause by clause, and flags every deviation by risk before anyone reads it", author: "Leland Team", avatar: lelandProfileIcon, image: imgContractReview, categories: ["Legal"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Wordpress" },
  { title: "Build a contract renewal tracker", description: "A system that scans your contract repository on a schedule and drafts a memo before any renewal or termination deadline slips by", author: "Leland Team", avatar: lelandProfileIcon, image: imgNotes, categories: ["Legal"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Notion" },
  { title: "Build a system that summarizes contract changes", description: "A system that reads a redlined contract and lists what changed, the risk of each change, and the business impact", author: "Leland Team", avatar: lelandProfileIcon, image: imgOnboarding, categories: ["Legal"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Hubspot" },
  { title: "Build an NDA triage system", description: "A system that sorts incoming NDAs into auto-approve, minor edits, or attorney review before anyone reads the whole document", author: "Leland Team", avatar: lelandProfileIcon, image: imgCrm, categories: ["Legal"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Google Drive" },
  { title: "Automate resume screens", description: "A system that scores resumes against your criteria, then reruns blinded to catch bias before anyone acts on the ranking", author: "Leland Team", avatar: lelandProfileIcon, image: imgResumeScreening, categories: ["Human Resources"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Asana" },
  { title: "Build a 1:1 prep assistant", description: "A system that pulls prior notes, goals, and open commitments for one person before your 1:1 and hands you a short brief", author: "Leland Team", avatar: lelandProfileIcon, image: imgLeadBrief, categories: ["Human Resources"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Slack" },
  { title: "Automate interview scheduling", description: "A system that checks interviewer and candidate availability, proposes times across a full panel, and locks a confirmed schedule", author: "Leland Team", avatar: lelandProfileIcon, image: imgColdOutboundEmail, categories: ["Human Resources"], useCase: "Content Creation", collection: "Tutorials", tool: "Wordpress" },
  { title: "Automate interview debrief summaries", description: "A system that turns raw interviewer notes into a structured debrief keyed to your scorecard so every candidate gets compared the same way", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrecallBriefing, categories: ["Human Resources"], useCase: "Content Creation", collection: "Tutorials", tool: "Notion" },
  { title: "Automate the user interview process", description: "A system that reads a batch of interview transcripts and returns recurring pains and contradictions, each tied to a quote", author: "Leland Team", avatar: lelandProfileIcon, image: imgTriage, categories: ["Product", "Design"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Hubspot" },
  { title: "Create interview scorecards for every role", description: "A system that turns a job description into a structured scorecard so every interviewer rates the same things the same way", author: "Leland Team", avatar: lelandProfileIcon, image: imgMetrics, categories: ["Human Resources"], useCase: "Content Creation", collection: "Tutorials", tool: "Google Drive" },
  { title: "Build a feedback theme tracker", description: "A system that pulls in tickets, reviews, and surveys, and returns them clustered into ranked themes backed by quotes", author: "Leland Team", avatar: lelandProfileIcon, image: imgPrompts, categories: ["Product"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Asana" },
  { title: "Build a new hire onboarding assistant", description: "A system that walks new hires through their first-week checklist day by day and tracks what's done", author: "Leland Team", avatar: lelandProfileIcon, image: imgOnboardingChecklist, categories: ["Human Resources"], useCase: "Productivity & Planning", collection: "Tutorials", tool: "Slack" },
  { title: "Build an audit evidence collector", description: "A system that gathers audit evidence from your systems, maps it to the control it satisfies, and keeps a folder ready before your next audit", author: "Leland Team", avatar: lelandProfileIcon, image: imgAuditEvidence, categories: ["Legal", "Finance & Accounting"], useCase: "Automation & Ops", collection: "Tutorials", tool: "Wordpress" },
  { title: "Build a citation checker for legal documents", description: "A system that checks every citation in a draft against a live source before the document goes out", author: "Leland Team", avatar: lelandProfileIcon, image: imgCitationChecker, categories: ["Legal"], useCase: "Reporting & Analytics", collection: "Tutorials", tool: "Notion" },
];

// Each upcoming session's featured/capstone build — shown on the "Upcoming
// builds" card in place of session logistics when that prototype toggle is
// on. Placeholder copy for sessions after the first, until each lesson has
// its own role-based build picker like Session 1's.
const UPCOMING_BUILDS = [
  {
    lessonNumber: 1,
    sessionTitle: "Build a real product with world-class design",
    buildTitle: "Build a one-page account brief for any prospect",
    otherOptionsCount: 6,
    to: `${COURSE_PATH}/lesson-1/featured-build`,
    image: imgLeadBrief,
  },
  {
    lessonNumber: 2,
    sessionTitle: "Automate Communication in Your Voice",
    buildTitle: "Build a scheduled email manager",
    otherOptionsCount: 0,
    to: `${COURSE_PATH}/lesson-2/build-3`,
    image: imgTriage,
  },
  {
    lessonNumber: 3,
    sessionTitle: "Analyze data and design presentations",
    buildTitle: "Build and design a presentation on your own topic",
    otherOptionsCount: 0,
    to: `${COURSE_PATH}/lesson-3/build-4`,
    image: imgMetrics,
  },
];

const PROGRAM_HUB_OPTIONS_KEY = "program-hub-prototype-options";

function useProgramHubOptions() {
  const [showUseCaseSection, setShowUseCaseSectionState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROGRAM_HUB_OPTIONS_KEY) ?? "{}").showUseCaseSection ?? false;
    } catch {
      return false;
    }
  });
  const setShowUseCaseSection = (value: boolean) => {
    setShowUseCaseSectionState(value);
    localStorage.setItem(PROGRAM_HUB_OPTIONS_KEY, JSON.stringify({ showUseCaseSection: value }));
  };
  return { showUseCaseSection, setShowUseCaseSection };
}

// Curated Sales examples — Tutorials and Skills only (no community builds),
// sourced from the Sales-tagged rows of the tutorials/skills tagging sheet.
const SALES_RECOMMENDED_ITEMS: Item[] = [
  {
    title: "Build a one-page account brief for any prospect",
    description: "Builds a single shareable web page for a prospect with a company snapshot, likely pains, three talking points, and the questions you still need to ask",
    author: "Leland Team",
    avatar: lelandProfileIcon,
    image: imgLeadBrief,
    categories: ["Sales"],
    useCase: "Productivity & Planning",
    collection: "Tutorials",
    tool: "Notion",
  },
  {
    title: "Build a Lead Qualification Agent",
    description: "Source verified B2B leads straight from your ICP, score them automatically, and draft personalized outreach, no starting lead list required",
    author: "Leland Team",
    avatar: lelandProfileIcon,
    image: imgLeadQualAgent,
    categories: ["Sales"],
    useCase: "Automation & Ops",
    collection: "Tutorials",
    tool: "Hubspot",
  },
  {
    title: "Cold Outbound Email Agent",
    description: "Build an agent that researches prospects, writes personalized first-touch emails, and queues them for your review. No code required",
    author: "Leland Team",
    avatar: lelandProfileIcon,
    image: imgColdOutboundEmail,
    categories: ["Sales"],
    useCase: "Automation & Ops",
    collection: "Tutorials",
    tool: "Hubspot",
  },
  {
    title: "Build a pre-call research briefing agent",
    description: "A system that checks your calendar before each sales call and hands you a one-page brief on what changed and what to say",
    author: "Leland Team",
    avatar: lelandProfileIcon,
    image: imgPrecallBriefing,
    categories: ["Sales"],
    useCase: "Productivity & Planning",
    collection: "Tutorials",
    tool: "Google Drive",
  },
  {
    title: "Meeting Notes to CRM",
    description: "Turn a raw meeting transcript into clean follow-ups, a short summary, and structured CRM-ready fields you can paste straight into your pipeline",
    author: "Leland Team",
    avatar: lelandProfileIcon,
    image: imgMeetingNotesToCrm,
    categories: ["Sales"],
    useCase: "Automation & Ops",
    collection: "Skills",
    tool: "Hubspot",
  },
  {
    title: "Transcript Analysis",
    description: "Extract seven layers of insight from a sales call or meeting transcript, including subtext, buying signals, objections, and missed opportunities",
    author: "Leland Team",
    avatar: lelandProfileIcon,
    image: imgCallCoach,
    categories: ["Sales"],
    useCase: "Reporting & Analytics",
    collection: "Skills",
    tool: "Notion",
  },
];

const USE_CASES = ["Productivity & Planning", "Content Creation", "Personal website", "Reporting & Analytics", "Automation & Ops", "App development"];
const COLLECTIONS = ["Community builds", "Tutorials", "Skills"];
const TOOLS = ["Notion", "Hubspot", "Google Drive", "Asana", "Slack", "Wordpress"];
const USE_CASE_TILES = ["Productivity & Planning", "Content Creation", "Personal website", "Reporting & Analytics", "App development", "Outreach", "Automation & Ops", "Research & Intelligence"];
// The full universe of use-case tags — a superset of USE_CASES (that list is
// just the default/narrowed one) — so searching the Use Case filter can find
// any tag that exists, not only the ones currently shown by default.
const ALL_USE_CASES = Array.from(new Set([...USE_CASES, ...USE_CASE_TILES]));

// ─── Small pieces ─────────────────────────────────────────────────────────────

function IconImg({ src, size = 20 }: { src: string; size?: number }) {
  return <img src={src} alt="" width={size} height={size} className="shrink-0" style={{ width: size, height: size }} />;
}

function ProgressBar({ pct, label, className = "" }: { pct: number; label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="whitespace-nowrap text-[12px] text-gray-extra-light">{label}</span>}
      <div className="flex h-1 min-w-px flex-1 rounded bg-gray-stroke">
        <div className="h-full rounded bg-gray-dark" style={{ width: `${Math.max(pct, 1)}%` }} />
      </div>
    </div>
  );
}

function RoundArrow({ dir, disabled, onClick, floating }: { dir: "left" | "right"; disabled?: boolean; onClick?: () => void; floating?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className={`flex items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark transition-colors hover:bg-gray-hover disabled:opacity-30 disabled:hover:bg-white ${
        floating ? "p-3 shadow-[0_4px_4px_rgba(16,24,40,0.1)]" : "p-2"
      }`}
    >
      <svg width={floating ? 20 : 18} height={floating ? 20 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dir === "left" ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

// Production's Skill thumbnail: no featured image, just one of three soft
// gradient backgrounds (cycled per item) with a code icon in a white badge —
// matching the real joinleland.com skill cards exactly, rather than reusing
// a generic illustration image like Tutorials get.
const SKILL_GRADIENTS = [
  "bg-gradient-to-tr from-leland-yellow/35 via-leland-tan-light to-leland-slate/20",
  "bg-gradient-to-r from-leland-yellow/35 via-leland-tan-light to-leland-slate/20",
  "bg-gradient-to-tr from-leland-slate/20 via-leland-tan-light to-leland-yellow/35",
];
function skillGradientForTitle(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  return SKILL_GRADIENTS[hash % SKILL_GRADIENTS.length];
}
function SkillThumb({ title }: { title: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center ${skillGradientForTitle(title)}`}>
      <div className="flex size-8 items-center justify-center rounded-full bg-white shadow-md">
        <IconCode className="size-5 shrink-0 text-gray-dark" />
      </div>
    </div>
  );
}

function ContentCard({ item }: { item: Item }) {
  return (
    <div className="group min-w-[200px] cursor-pointer overflow-hidden">
      <div className="aspect-[120/63] w-full overflow-hidden rounded-lg border border-gray-stroke bg-gray-hover">
        {item.collection === "Skills" ? (
          <SkillThumb title={item.title} />
        ) : (
          <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        )}
      </div>
      <div className="flex flex-col gap-1.5 pt-2">
        <p className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-gray-dark">{item.title}</p>
        {item.collection === "Community builds" ? (
          <div className="flex items-center gap-1.5">
            <img src={item.avatar} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />
            <span className="truncate text-[12px] text-gray-light">{item.author}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {item.collection === "Skills" ? (
              <IconCode className="size-3.5 shrink-0 text-gray-light" />
            ) : (
              <IconLightBulb className="size-3.5 shrink-0 text-gray-light" />
            )}
            <span className="truncate text-[12px] text-gray-light">{item.collection === "Skills" ? "Skill" : "Tutorial"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Deterministic per-item view count — stable across renders, just not backed
// by a real analytics source.
function viewsForTitle(title: string): number {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  return 40 + (hash % 460);
}

// The larger "boxed" card used in Browse all — a full bordered card (not
// just the image) with a description and view count, per the Content card
// large component in the design library.
function ContentCardLarge({ item }: { item: Item }) {
  return (
    <div className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-stroke bg-white transition-shadow hover:shadow-[0_2px_8px_rgba(16,24,40,0.08)]">
      <div className="aspect-[120/63] w-full shrink-0 overflow-hidden bg-gray-hover">
        {item.collection === "Skills" ? (
          <SkillThumb title={item.title} />
        ) : (
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <p className="line-clamp-2 text-[16px] font-semibold leading-[1.3] text-gray-dark">{item.title}</p>
          <p className="line-clamp-2 text-[14px] leading-[1.35] text-gray-light">{item.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {item.collection === "Community builds" ? (
            <div className="flex shrink-0 items-center gap-1">
              <img src={item.avatar} alt="" className="h-[17px] w-4 rounded-full object-cover" />
              <span className="truncate text-[12px] text-gray-light">{item.author}</span>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-1">
              {item.collection === "Skills" ? (
                <IconCode className="size-3.5 shrink-0 text-gray-light" />
              ) : (
                <IconLightBulb className="size-3.5 shrink-0 text-gray-light" />
              )}
              <span className="truncate text-[12px] text-gray-light">{item.collection === "Skills" ? "Skill" : "Tutorial"}</span>
            </div>
          )}
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <IconUserProfileGroup className="size-[18px] shrink-0 text-gray-extra-light" />
            <span className="min-w-0 flex-1 truncate text-[12px] text-gray-extra-light">{viewsForTitle(item.title)} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared scroll state for a horizontal card row — the header's nav arrows
// and the row itself both read/drive this, so the arrows can live in the
// card header instead of floating below the row.
function useCardCarousel<T>(items: T[]) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 1;
      setPage(Math.round(el.scrollLeft / w));
      setPages(Math.max(1, Math.ceil(el.scrollWidth / w)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [items]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return { scrollRef, page, pages, scrollByPage };
}

// Cards styled like the build-option cards on the lesson's own build picker
// (plain text, border, no leading icon), in a horizontal scroll-snap row.
// Nav arrows live in the card header (see ProgramHub), driven by the same
// scroll state via `carousel`.
function UpcomingBuildsCarousel({
  builds,
  carousel,
  cardStyle,
}: {
  builds: typeof UPCOMING_BUILDS;
  carousel: ReturnType<typeof useCardCarousel<typeof UPCOMING_BUILDS[number]>>;
  cardStyle: BuildCardStyle;
}) {
  return (
    <div className="relative min-h-0 flex-1">
      <div ref={carousel.scrollRef} className="flex h-full snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {builds.map((b, i) => {
          if (cardStyle !== "dots") {
            return (
              <Link
                key={b.sessionTitle}
                to={b.to}
                className="group flex h-full w-[75%] shrink-0 snap-start flex-col gap-3 rounded-xl border border-gray-stroke bg-white p-4 text-left transition-shadow hover:shadow-[0_2px_8px_rgba(16,24,40,0.08)] sm:w-[calc((100%-1.5rem)/3)]"
              >
                <IconSparkle className="size-4 shrink-0 text-gray-dark" />
                <div className="flex flex-col gap-1">
                  <p className="line-clamp-2 text-[16px] font-semibold leading-[1.3] text-gray-dark">{b.buildTitle}.</p>
                  <p className="line-clamp-2 text-[14px] text-gray-light">Lesson {b.lessonNumber} · {b.sessionTitle}</p>
                </div>
                {b.otherOptionsCount ? (
                  <div className="mt-auto pt-2">
                    <Tag text={`${b.otherOptionsCount} more options`} tagColor={TagColor.WHITE} />
                  </div>
                ) : null}
              </Link>
            );
          }

          // Demo stand-in for real progress data — just shows the first card
          // as "complete" so both states are visible side by side.
          const completed = i === 0;
          return (
            <Link
              key={b.sessionTitle}
              to={b.to}
              className="group flex h-full w-[75%] shrink-0 snap-start flex-col gap-4 rounded-xl border border-gray-stroke bg-white p-4 text-left transition-shadow hover:shadow-[0_2px_8px_rgba(16,24,40,0.08)] sm:w-[calc((100%-1.5rem)/3)]"
            >
              <div className="relative w-full shrink-0 overflow-hidden rounded-md border border-leland-gray-hover">
                <img src={b.image} alt="" className="block h-auto w-full" />
                <span className="absolute left-2 top-2 rounded-[4px] bg-leland-black/[87%] px-1 pt-[3px] pb-[4px] text-[0.75rem] font-semibold leading-none text-leland-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
                  Level 1
                </span>
              </div>
              <div className="flex flex-1 flex-col items-start">
                <p className="line-clamp-2 text-[16px] font-semibold leading-[1.3] text-gray-dark">{b.buildTitle}.</p>
                <p className="mt-0.5 line-clamp-2 text-[14px] text-gray-light">
                  Lesson {b.lessonNumber} · {b.sessionTitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Tag text={completed ? "Complete" : "Not started"} tagColor={completed ? TagColor.BLACK : TagColor.WHITE} size={TagSize.XS} fontWeight={FontWeight.SEMIBOLD} />
                {b.otherOptionsCount ? <span className="text-[12px] font-medium text-gray-light">{b.otherOptionsCount} more options</span> : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const sectionTitle = "font-serif text-[28px] font-medium leading-[1.2] text-gray-dark";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgramHub() {
  const navigate = useNavigate();
  const [aboutMe, setAboutMe] = useState<PersonalizationData | null>(() => loadPersonalizationData());
  const learnerRole = aboutMe?.role ?? null;
  const roleCategory = learnerRole ? ROLE_TO_CATEGORY[learnerRole] : null;
  const { selectedCategory, setSelectedCategory } = useSelectedCategory();
  const { displayName, setDisplayName } = useDisplayName();
  // One-time hydration: if nothing has been explicitly selected yet (on
  // either page — this is shared, localStorage-backed state), default to
  // the learner's own category from onboarding rather than "All".
  useEffect(() => {
    if (selectedCategory === null && roleCategory) setSelectedCategory(roleCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filters, setFilters] = useState<{ useCase: string[]; collection: string[]; tool: string[] }>({ useCase: [], collection: [], tool: [] });
  const [open, setOpen] = useState<Record<string, boolean>>({ category: true, useCase: true, collection: true, tool: false });
  const [query, setQuery] = useState("");
  // Each searchable FilterGroup's own search text — lifted up here rather
  // than kept in local state inside FilterGroup, since that component is
  // redefined on every render (a new function identity each time), which
  // would reset any state defined inside it on every keystroke.
  const [groupSearch, setGroupSearch] = useState<Record<string, string>>({});
  const { showUseCaseSection, setShowUseCaseSection } = useProgramHubOptions();
  const cardStyle = useBuildCardStyle();
  const { hideNavSelections, setHideNavSelections } = useTopNavStyle();
  const [prototypeOptionsOpen, setPrototypeOptionsOpen] = useState(false);
  const [allLevelsOpen, setAllLevelsOpen] = useState(false);
  const [selectCohortOpen, setSelectCohortOpen] = useState(false);
  const upcomingBuildsCarousel = useCardCarousel(UPCOMING_BUILDS);

  const toggleChip = (group: keyof typeof filters, value: string) =>
    setFilters((f) => ({ ...f, [group]: f[group].includes(value) ? f[group].filter((v) => v !== value) : [...f[group], value] }));
  const activeCount = (g: keyof typeof filters) => filters[g].length;
  const anyFilter = !!selectedCategory || Object.values(filters).some((v) => v.length > 0) || query !== "";

  // Recommended for you follows the shared selected category — filtered
  // straight from the main library rather than a hand-curated set, so every
  // category responds the same way — the first 8 matches, with any tagged
  // to a use case the learner has shown interest in (the Use Case filter
  // selections) bubbled to the front of that set. Falls back to the legacy
  // curated Sales set only when no category is selected at all. Computed
  // before `results` so Browse All can demote whatever's shown here (below).
  const recommendedItems = useMemo(() => {
    if (!selectedCategory) return SALES_RECOMMENDED_ITEMS;
    const matches = ITEMS.filter((it) => it.collection !== "Community builds" && it.categories.includes(selectedCategory));
    if (!matches.length) return SALES_RECOMMENDED_ITEMS;
    const interested = filters.useCase;
    const ranked = interested.length
      ? [...matches].sort((a, b) => Number(interested.includes(b.useCase)) - Number(interested.includes(a.useCase)))
      : matches;
    return ranked.slice(0, 8);
  }, [selectedCategory, filters.useCase]);

  const results = useMemo(() => {
    const filtered = ITEMS.filter((it) => {
      // Community builds aren't category-tagged the way tutorials/skills
      // are, so the category filter shouldn't hide them entirely — only
      // apply it to the official library content.
      if (selectedCategory && it.collection !== "Community builds" && !it.categories.includes(selectedCategory)) return false;
      if (filters.useCase.length && !filters.useCase.includes(it.useCase)) return false;
      if (filters.collection.length && !filters.collection.includes(it.collection)) return false;
      if (filters.tool.length && !filters.tool.includes(it.tool)) return false;
      if (query && !`${it.title} ${it.author}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    // Default order: an interleaved mix of Tutorials and Skills — rather than
    // the two grouped into separate blocks — with Community builds pushed to
    // the end instead of leading just because they're first in ITEMS. There's
    // no real "date added" field to sort by, so each collection keeps its
    // existing relative order.
    const tutorials = filtered.filter((it) => it.collection === "Tutorials");
    const skills = filtered.filter((it) => it.collection === "Skills");
    const communityBuilds = filtered.filter((it) => it.collection === "Community builds");
    const mixed: Item[] = [];
    for (let i = 0; i < Math.max(tutorials.length, skills.length); i++) {
      if (skills[i]) mixed.push(skills[i]);
      if (tutorials[i]) mixed.push(tutorials[i]);
    }

    // With no use-case/collection/tool/search filter active (category alone
    // doesn't count — it's the baseline, not an "other" filter), anything
    // already shown in Recommended for you is bumped to the bottom here
    // instead of appearing twice near the top of the page.
    const noOtherFilters = !filters.useCase.length && !filters.collection.length && !filters.tool.length && !query;
    if (noOtherFilters && recommendedItems.length) {
      const recommendedTitles = new Set(recommendedItems.map((it) => it.title));
      const notRecommended = mixed.filter((it) => !recommendedTitles.has(it.title));
      const alreadyRecommended = mixed.filter((it) => recommendedTitles.has(it.title));
      return [...notRecommended, ...alreadyRecommended, ...communityBuilds];
    }

    return [...mixed, ...communityBuilds];
  }, [selectedCategory, filters, query, recommendedItems]);

  const shippedItems = useMemo(() => ITEMS.filter((i) => i.collection === "Community builds").slice(0, 8), []);
  const shippedCarousel = useCardCarousel(shippedItems);

  const [aboutMeModalOpen, setAboutMeModalOpen] = useState(false);
  const recommendedCarousel = useCardCarousel(recommendedItems);
  // Which "Browse by use case" tiles are relevant to the selected category —
  // no point surfacing a use case nothing in that category actually has.
  const useCaseTiles = useMemo(() => {
    if (!selectedCategory) return USE_CASE_TILES;
    const present = new Set(ITEMS.filter((it) => it.categories.includes(selectedCategory)).map((it) => it.useCase));
    const filtered = USE_CASE_TILES.filter((u) => present.has(u));
    return filtered.length ? filtered : USE_CASE_TILES;
  }, [selectedCategory]);
  const FilterGroup = ({
    id,
    title,
    options,
    searchOptions,
    search,
  }: {
    id: keyof typeof filters;
    title: string;
    options: string[];
    // The fuller list to search across, when it differs from the default
    // (narrowed) `options` shown before a search — e.g. Use Case's default
    // is category-scoped, but a search should reach every use case tag.
    searchOptions?: string[];
    search?: boolean;
  }) => {
    const q = (groupSearch[id] ?? "").trim().toLowerCase();
    const visible = q ? (searchOptions ?? options).filter((o) => o.toLowerCase().includes(q)) : options;
    return (
    <div className="border-t border-gray-stroke">
      <button type="button" onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))} className="flex w-full items-center gap-2.5 px-4 py-5 text-left">
        <span className="flex-1 text-[14px] font-semibold text-black">{title}</span>
        {activeCount(id) > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-black pb-0.5 text-[13px] font-semibold leading-none text-white">{activeCount(id)}</span>
        )}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark">
          {open[id] ? <path d="M6 15l6-6 6 6" /> : <path d="M6 9l6 6 6-6" />}
        </svg>
      </button>
      {open[id] && (
        <div className="flex flex-col gap-5 px-4 pb-5">
          {search && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-stroke bg-white px-4 py-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input
                type="text"
                value={groupSearch[id] ?? ""}
                onChange={(e) => setGroupSearch((g) => ({ ...g, [id]: e.target.value }))}
                placeholder="Search"
                aria-label={`Search ${title.toLowerCase()}`}
                className="w-full min-w-0 border-none bg-transparent text-[14px] text-gray-dark outline-none placeholder:text-gray-extra-light"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {visible.length === 0 ? (
              <p className="text-[14px] text-gray-light">No matches for "{groupSearch[id]}"</p>
            ) : (
              visible.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggleChip(id, o)}
                className={`rounded-lg bg-white px-3 py-2 text-[12px] font-semibold leading-[1.5] text-gray-dark ${filters[id].includes(o) ? "border-[1.5px] border-gray-dark" : "border border-gray-stroke"}`}
              >
                {o}
              </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
    );
  };

  // Category is a single-select, searchable dropdown rather than a chip list —
  // there's one category per learner, so chips implying multi-select were
  // misleading. Tied to the shared selectedCategory, not local filter state,
  // so changing it here carries over everywhere else that reads it too.
  const CategoryFilter = () => (
    <div className="flex flex-col gap-3 border-t border-gray-stroke px-4 py-5">
      <span className="text-[14px] font-semibold text-black">Category</span>
      <CategoryPicker
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={CATEGORIES}
        allLabel="All categories"
        trigger={({ onClick, ref }) => (
          <button
            ref={ref}
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-stroke bg-white px-4 py-3 text-left text-[14px] font-medium text-gray-dark hover:bg-gray-hover"
          >
            <span className="truncate">{selectedCategory ?? "All categories"}</span>
            <IconChevronDown className="size-4 shrink-0 text-gray-light" />
          </button>
        )}
      />
    </div>
  );

  // Use Case is a searchable, multi-select dropdown too — a scrollable list
  // instead of a wall of chips, searchable across every tag that exists
  // (not just the ones relevant to the selected category).
  const UseCaseFilter = () => {
    // The role-relevant set shows as quick-pick chips; anything picked via
    // search that isn't in that set (e.g. a use case from a different role)
    // still gets its own chip, so a search pick doesn't just disappear.
    const roleOptions = (selectedCategory && CATEGORY_TO_USE_CASES[selectedCategory]) || USE_CASES;
    const extraSelected = filters.useCase.filter((u) => !roleOptions.includes(u));
    const chips = [...roleOptions, ...extraSelected];
    return (
      <div className="flex flex-col gap-3 border-t border-gray-stroke px-4 py-5">
        <span className="text-[14px] font-semibold text-black">Use Case</span>
        <div className="flex flex-wrap gap-2">
          {chips.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => toggleChip("useCase", o)}
              className={`rounded-lg bg-white px-3 py-2 text-[12px] font-semibold leading-[1.5] text-gray-dark ${filters.useCase.includes(o) ? "border-[1.5px] border-gray-dark" : "border border-gray-stroke"}`}
            >
              {o}
            </button>
          ))}
          <MultiSelectDropdown
            values={filters.useCase}
            onChange={(v) => setFilters((f) => ({ ...f, useCase: v }))}
            options={ALL_USE_CASES}
            searchPlaceholder="Search use case"
            trigger={({ onClick, ref }) => (
              <button
                ref={ref}
                type="button"
                onClick={onClick}
                className="flex items-center gap-1.5 rounded-lg border border-gray-stroke bg-white px-3 py-2 text-[12px] font-semibold leading-[1.5] text-gray-dark hover:bg-gray-hover"
              >
                <IconSearch className="size-3.5 shrink-0" />
                Search
              </button>
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#F9F8F3] pb-24">

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 pt-16">
          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">Welcome, {displayName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="md" variant="secondary" rounded="rounded-full" className="!gap-2 !bg-black/5 font-semibold">
              <IconImg src={calendarArrowIcon} />Office hours
            </Button>
            <Button size="md" variant="secondary" rounded="rounded-full" className="!gap-2 !bg-black/5 font-semibold">
              <IconImg src={slackIcon} />Community
            </Button>
            <Button
              size="md"
              variant="secondary"
              rounded="rounded-full"
              className="!gap-2 !bg-black/5 font-semibold"
              onClick={() => document.getElementById("recommended-for-you")?.scrollIntoView({ behavior: "smooth" })}
            >
              Resource library
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden><path d="M12 5v14M5 12l7 7 7-7" /></svg>
            </Button>
          </div>
        </div>

        {/* Current course + live sessions */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="flex flex-col gap-2.5 rounded-2xl border border-gray-stroke bg-white p-6 shadow-[0_1px_1px_rgba(16,24,40,0.05)] lg:max-w-[400px] lg:flex-1 lg:justify-between">
            <img
              src={levelOne}
              alt="AI Builder Program Level 1"
              className="max-h-[120px] w-auto max-w-full self-start rounded-lg border border-black/5 object-cover lg:h-full lg:max-h-none lg:w-auto lg:flex-1 lg:self-start"
            />
            <div className="flex flex-col gap-2.5 py-2.5">
              <p className="truncate text-[16px] font-semibold leading-[1.3] text-gray-dark">Level 1: Use AI to 10x your impact</p>
              <ProgressBar pct={50} label="50% complete" className="max-w-[300px]" />
              <p className="truncate text-[14px] leading-[1.35] text-gray-light">Lesson 2/3: Automate communication in your voice</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="md" variant="dark" onClick={() => navigate(COURSE_PATH)} className="!gap-2 font-semibold">
                Resume<IconImg src={chevronOverWhiteIcon} />
              </Button>
              <Button size="md" variant="secondary" onClick={() => setAllLevelsOpen(true)} className="!bg-black/5 font-semibold">
                See all levels
              </Button>
            </div>
          </div>

          <div className="flex min-w-[280px] flex-1 flex-col gap-5 rounded-2xl border border-gray-stroke bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex min-w-px flex-1 flex-col gap-2">
                <p className="text-[22px] font-semibold leading-[1.2] text-gray-dark">Up Next</p>
              </div>
              <div className="flex items-center gap-2">
                <RoundArrow dir="left" disabled={upcomingBuildsCarousel.page <= 0} onClick={() => upcomingBuildsCarousel.scrollByPage(-1)} />
                <RoundArrow dir="right" disabled={upcomingBuildsCarousel.page >= upcomingBuildsCarousel.pages - 1} onClick={() => upcomingBuildsCarousel.scrollByPage(1)} />
              </div>
            </div>
            <UpcomingBuildsCarousel builds={UPCOMING_BUILDS} carousel={upcomingBuildsCarousel} cardStyle={cardStyle} />
          </div>
        </div>

        {/* Live sessions */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex min-w-px flex-1 flex-col gap-2">
                <p className={sectionTitle}>Live sessions</p>
                <p className="text-[16px] leading-[1.5] text-gray-light">Level 1: Use AI to 10x your impact</p>
              </div>
              <Button size="sm" variant="secondary" rounded="rounded-full" className="self-start !gap-1.5 !bg-black/5 font-semibold">
                May 24 cohort
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 013-3h15" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 01-3 3H3" /></svg>
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex h-16 items-center gap-3 py-2.5">
                <div className="flex size-11 shrink-0 flex-col overflow-hidden rounded-lg border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)]">
                  <div className="h-3 w-full bg-[#80aced]" />
                  <div className="flex flex-1 items-center justify-center pb-1 pt-0.5 text-[16px] font-semibold leading-[1.3] text-gray-dark">18</div>
                </div>
                <div className="flex min-w-px flex-1 flex-col gap-0.5">
                  <p className="truncate text-[16px] font-semibold leading-[1.3] text-gray-dark">
                    Today at 6:00 PM <span className="text-[14px] font-normal text-gray-extra-light">· 60 min</span>
                  </p>
                  <p className="truncate text-[14px] text-gray-light">Build your Agentic Operating System</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-gray-dark" aria-hidden><circle cx="8" cy="3.5" r="1" /><circle cx="8" cy="8" r="1" /><circle cx="8" cy="12.5" r="1" /></svg>
              </div>
              <div className="flex h-16 items-center gap-3 py-2.5">
                <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-light">
                  <img src={sessionThumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                  <img src={playIcon} alt="" className="relative h-3 w-[11px]" />
                </div>
                <div className="flex min-w-px flex-1 flex-col gap-0.5">
                  <p className="truncate text-[16px] font-semibold leading-[1.3] text-gray-dark">Analyze data and design presentations</p>
                  <p className="truncate text-[14px] text-gray-light">Sept 31, 8am · Session Title Goes Here</p>
                </div>
              </div>
            </div>
            <Button size="md" variant="secondary" className="self-start !bg-black/5 font-semibold">
              See all sessions
            </Button>
          </div>
        </section>

        {/* Program resources */}
        <section className="mt-10 flex flex-col gap-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-stroke bg-white p-6">
            <div className="flex items-center gap-4">
              <p className="flex-1 text-[12px] font-semibold uppercase leading-[1.2] tracking-[1.2px] text-gray-light">Recently viewed</p>
              <div className="flex items-center gap-2">
                <RoundArrow dir="left" disabled />
                <RoundArrow dir="right" disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { img: imgPrompts, title: "Prompt library for the ops team: tested prompts to reuse", meta: "32 assets", stack: true },
                { img: imgTriage, title: "Build a support ticket triage agent, start to finish", meta: "21 views", author: "Jonas C.", avatar: pic5 },
                { img: imgMetrics, title: "Weekly metrics digest: automate your Monday summary", meta: "55 views", author: "Jonas C.", avatar: pic5 },
                { img: "", title: "Prompting patterns that hold up in production", meta: "55 views", author: "Jonas C.", avatar: pic5 },
              ].map((r) => (
                <div key={r.title} className="flex min-w-0 cursor-pointer items-center gap-3">
                  <div className="relative h-14 w-[107px] shrink-0 overflow-hidden rounded-md border border-gray-stroke bg-gray-hover">
                    {r.img && <img src={r.img} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex min-w-px flex-1 flex-col gap-1">
                    <p className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-gray-dark">{r.title}</p>
                    <div className="flex items-center gap-2 text-[12px] leading-[1.35]">
                      {r.author && (
                        <span className="flex items-center gap-1 text-gray-light">
                          <img src={r.avatar} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />
                          {r.author}
                        </span>
                      )}
                      <span className="truncate text-gray-extra-light">{r.meta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended for you */}
          <div id="recommended-for-you" className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex min-w-px flex-1 flex-col gap-2">
                <p className={sectionTitle}>Recommended for you</p>
                <p className="text-[16px] leading-[1.5] text-gray-light">
                  {selectedCategory ? `Builds picked for ${selectedCategory}` : "Builds picked for your role"}
                </p>
              </div>
              <Button
                size="md"
                variant="dark"
                className="self-start font-semibold"
                onClick={() => {
                  document.getElementById("browse-all")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse all
              </Button>
            </div>
            <div className="relative">
              <div ref={recommendedCarousel.scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {recommendedItems.map((it) => (
                  <div key={it.title} className="w-[240px] shrink-0 sm:w-[calc((100%-60px)/4)]">
                    <ContentCard item={it} />
                  </div>
                ))}
              </div>
              {recommendedCarousel.page > 0 ? (
                <div className="absolute left-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
                  <RoundArrow dir="left" floating onClick={() => recommendedCarousel.scrollByPage(-1)} />
                </div>
              ) : null}
              {recommendedCarousel.page < recommendedCarousel.pages - 1 ? (
                <div className="absolute right-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
                  <RoundArrow dir="right" floating onClick={() => recommendedCarousel.scrollByPage(1)} />
                </div>
              ) : null}
            </div>
          </div>

          {/* See what others shipped */}
          <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex min-w-px flex-1 flex-col gap-2">
                <p className={sectionTitle}>See what others shipped</p>
                <p className="text-[16px] leading-[1.5] text-gray-light">Real builds filterable by role, use case and tool</p>
              </div>
              <Button size="md" variant="dark" className="self-start font-semibold">Get inspiration</Button>
            </div>
            <div className="relative">
              <div ref={shippedCarousel.scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {shippedItems.map((it) => (
                  <div key={it.title} className="w-[240px] shrink-0 sm:w-[calc((100%-60px)/4)]">
                    <ContentCard item={it} />
                  </div>
                ))}
              </div>
              {shippedCarousel.page > 0 ? (
                <div className="absolute left-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
                  <RoundArrow dir="left" floating onClick={() => shippedCarousel.scrollByPage(-1)} />
                </div>
              ) : null}
              {shippedCarousel.page < shippedCarousel.pages - 1 ? (
                <div className="absolute right-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
                  <RoundArrow dir="right" floating onClick={() => shippedCarousel.scrollByPage(1)} />
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[pic9, pic1, pic6].map((p, i) => (
                  <img key={i} src={p} alt="" className={`h-5 w-5 rounded-full object-cover ring-2 ring-white ${i > 0 ? "-ml-1.5" : ""}`} />
                ))}
              </div>
              <span className="text-[14px] text-gray-light">331 submissions</span>
            </div>
          </div>

          {/* Browse by use case */}
          {showUseCaseSection ? (
            <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex min-w-px flex-1 flex-col gap-2">
                  <p className={sectionTitle}>Browse by use case</p>
                  <p className="text-[16px] leading-[1.5] text-gray-light">Tutorials, inspo and downloadable skills</p>
                </div>
                <Button size="md" variant="dark" className="self-start font-semibold">See all 137 resources</Button>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="flex min-w-px flex-1 flex-wrap content-start gap-3">
                  {useCaseTiles.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, useCase: [u] }))}
                      className="rounded-lg bg-black/5 px-6 py-4 text-[14px] font-semibold leading-[1.5] text-gray-dark transition-colors hover:bg-black/[0.08]"
                    >
                      {u}
                    </button>
                  ))}
                </div>
                <div className="relative hidden h-[118px] w-[287px] shrink-0 lg:block" aria-hidden>
                  <div className="absolute left-[-10px] top-[28px] h-[80px] w-[151px] -rotate-3 overflow-hidden rounded border border-gray-stroke bg-[#F5C84A] shadow-sm">
                    <img src={levelOne} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute left-[80px] top-0 h-[108px] w-[205px] rotate-3 overflow-hidden rounded border border-gray-stroke shadow-sm">
                    <img src={heroPhoto} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* Browse all */}
        <section id="browse-all" className="mt-16">
          <div className="flex flex-col gap-4 px-0 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div className="flex flex-col gap-2">
              <h2 className={sectionTitle}>Browse all</h2>
              <p className="text-[16px] leading-[1.3] text-gray-extra-light">412 tutorials, demos and downloadable skills</p>
            </div>
            <div className="flex w-full items-center gap-2 rounded-full border border-gray-stroke bg-white px-4 py-3 sm:w-[397px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="min-w-0 flex-1 bg-transparent text-[14px] text-gray-dark outline-none placeholder:text-gray-extra-light" />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row sm:px-6">
            <aside className="h-fit w-full shrink-0 overflow-hidden rounded-2xl border border-gray-stroke bg-white py-4 lg:w-[300px]">
              <div className="flex items-center gap-2.5 px-4 pb-5">
                <p className="flex-1 text-[18px] font-semibold leading-[1.3] text-black">Filter by</p>
                <Button
                  size="sm"
                  variant="outline"
                  rounded="rounded-full"
                  className="font-semibold"
                  disabled={!anyFilter}
                  onClick={() => { setSelectedCategory(null); setFilters({ useCase: [], collection: [], tool: [] }); setQuery(""); }}
                >
                  Clear filters
                </Button>
              </div>
              <CategoryFilter />
              <UseCaseFilter />
              <FilterGroup id="collection" title="Collection" options={COLLECTIONS} />
              <FilterGroup id="tool" title="Tool" options={TOOLS} search />
            </aside>

            <div className="min-w-0 flex-1">
              {results.length === 0 ? (
                <div className="rounded-2xl border border-gray-stroke bg-white px-6 py-16 text-center text-[14px] text-gray-light">No resources match these filters.</div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((it, i) => <ContentCardLarge key={`${it.title}-${i}`} item={it} />)}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <QuickPreferencesModal
        open={aboutMeModalOpen}
        onOpenChange={setAboutMeModalOpen}
        initialData={aboutMe}
        onSave={setAboutMe}
      />
      {/* Floating prototype options button — bottom-left corner */}
      <button
        type="button"
        onClick={() => setPrototypeOptionsOpen(true)}
        aria-label="Prototype options"
        className="fixed bottom-20 left-4 z-50 flex items-center justify-center rounded-full border border-gray-stroke bg-white p-2.5 shadow-sm hover:bg-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary md:bottom-4"
      >
        <IconDotsHorizontal className="size-4 text-gray-light" />
      </button>
      <AllLevelsModal
        open={allLevelsOpen}
        onOpenChange={setAllLevelsOpen}
        onOpenLevel={(lvl) => navigate(lvl.to)}
        onSelectCohort={() => {
          setAllLevelsOpen(false);
          setSelectCohortOpen(true);
        }}
      />
      <SelectCohortModal
        open={selectCohortOpen}
        onClose={() => setSelectCohortOpen(false)}
        onSelect={() => setSelectCohortOpen(false)}
      />
      <Modal open={prototypeOptionsOpen} onOpenChange={setPrototypeOptionsOpen}>
        <ModalContent size={ModalSize.SMALL}>
          <div className="flex flex-col gap-4 p-6">
            <h2 className="text-[18px] font-semibold text-gray-dark">Prototype options</h2>
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium text-gray-dark">First name</span>
              <span className="text-[12px] text-gray-light">Shown in the "Welcome, ___" header — handy for demos, so you can preset the prospect's name.</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Maddy"
                className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[14px] text-gray-dark outline-none placeholder:text-gray-extra-light focus:border-gray-dark"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium text-gray-dark">Selected category</span>
              <span className="text-[12px] text-gray-light">Carries over to the course viewer too — drives Recommended for you, Browse by use case, and the lesson build picker.</span>
              <CategoryPicker
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={CATEGORIES}
                allLabel="None"
                trigger={({ onClick, ref }) => (
                  <button
                    ref={ref}
                    type="button"
                    onClick={onClick}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-stroke bg-white px-4 py-3 text-left text-[14px] font-medium text-gray-dark hover:bg-gray-hover"
                  >
                    <span className="truncate">{selectedCategory ?? "None"}</span>
                    <IconChevronDown className="size-4 shrink-0 text-gray-light" />
                  </button>
                )}
              />
            </div>
            <SwitchInput
              label="Show 'Browse by use case' section"
              isChecked={showUseCaseSection}
              onToggle={setShowUseCaseSection}
            />
            <SwitchInput
              label="Hide top nav selections (keep logo + profile)"
              isChecked={hideNavSelections}
              onToggle={setHideNavSelections}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium text-gray-dark">Build card style</span>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { value: "default", label: "Simple" },
                    { value: "dots", label: "Image + status" },
                  ] as { value: BuildCardStyle; label: string }[]
                ).map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setBuildCardStyle(o.value)}
                    className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
                  >
                    <Tag text={o.label} tagColor={TagColor.GRAY} selected={cardStyle === o.value} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

