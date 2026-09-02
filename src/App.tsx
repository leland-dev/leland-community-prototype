import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { useEffect } from "react";
import { VersionProvider } from "./contexts/VersionContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { BookmarksProvider } from "./contexts/BookmarksContext";
import { SavedToastProvider } from "./contexts/SavedToastContext";
import { ExpertModeProvider } from "./contexts/ExpertModeContext";
import { TopNavStyleProvider } from "./contexts/TopNavStyleContext";
import { ProfileBarModeProvider } from "./contexts/ProfileBarModeContext";
import { FeedDemoProvider } from "./contexts/FeedDemoContext";
import { PageExitProvider } from "./contexts/PageExitContext";
import { GoalsProvider } from "./contexts/GoalsContext";
import { GoalsProvider as FullGoalsProvider } from "./full/contexts/GoalsContext";
import { GoalsVersionProvider } from "./contexts/GoalsVersionContext";
import PageExitOverlay from "./components/PageExitOverlay";
import Layout from "./components/Layout";
import { ContextLayout } from "./components/Layout";

// Remembers each route's scroll position and restores it (smoothly) when the
// user navigates back to it — but only on a "POP" (back/forward or
// navigate(-1)), so forward navigation still lands at the top of the page.
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  // The app-promo takeover embeds pages in a ?mini=1 iframe, which shares this
  // tab's sessionStorage — skip restore/save there so the demo neither
  // inherits nor pollutes the real tab's scroll positions.
  const isMini = new URLSearchParams(window.location.search).has("mini");

  useEffect(() => {
    if (isMini) {
      // Chrome restores per-URL scroll on iframe reloads; opt out entirely.
      try {
        window.history.scrollRestoration = "manual";
      } catch {
        /* noop */
      }
      window.scrollTo(0, 0);
      return;
    }
    const saved = sessionStorage.getItem(`scrollY:${pathname}`);
    if (navigationType === "POP" && saved !== null) {
      window.scrollTo({ top: Number(saved), behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType, isMini]);

  useEffect(() => {
    if (isMini) return;
    const onScroll = () => sessionStorage.setItem(`scrollY:${pathname}`, String(window.scrollY));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, isMini]);

  // The mini stylesheet (scrollbar hiding, nav head-room, entrance cascade) is
  // injected synchronously by the inline script in index.html so the page never
  // paints un-animated content for a frame.

  return null;
}

import Home from "./pages/Home";
import Topic from "./pages/Topic";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messaging from "./pages/Messaging";
import ConversationDetail from "./pages/ConversationDetail";
import { CaptureDashboard, CaptureInbox, LelandThread } from "./components/promo/AppPromo";
import ConversationRelationship from "./pages/ConversationRelationship";
import Profile from "./pages/Profile";
import ProfileV2 from "./pages/ProfileV2";
import ProfileTemplate from "./pages/ProfileTemplate";
import CoachAgent from "./pages/CoachAgent";
import CoachAgentEdit from "./pages/CoachAgentEdit";
import Group from "./pages/Group";
import GroupCommunity from "./pages/GroupCommunity";
import Events from "./pages/Events";
import Courses from "./pages/Courses";
import LelandPlus from "./pages/LelandPlus";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import { GoalsIndexSwitch, GoalDetailSwitch, GoalNewSwitch } from "./components/GoalsRouteSwitch";
import FullTaskList from "./full/pages/TaskList";
import PostDetail, { CommentDetail } from "./pages/PostDetail";
import ReplyCompose from "./pages/ReplyCompose";
import ReplayViewer from "./pages/ReplayViewer";
import AccountSettings from "./pages/AccountSettings";
import Calendar from "./pages/Calendar";
import MyCourses from "./pages/MyCourses";
import Site from "./pages/Site";
import B2BDashboard from "./pages/B2BDashboard";
import B2BDashboardV2 from "./pages/B2BDashboardV2";
import SessionCardTest from "./pages/SessionCardTest";
import SidebarCardsTest from "./pages/SidebarCardsTest";
import OfferingCardTest from "./pages/OfferingCardTest";
import CourseBlockTest from "./pages/CourseBlockTest";
import PostTest from "./pages/PostTest";
import ProfileCardTest from "./pages/ProfileCardTest";
import GroupCardTest from "./pages/GroupCardTest";
import Components from "./pages/Components";
import CourseDetail from "./pages/CourseDetail";
import CoachLayout from "./components/CoachLayout";
import CoachHome from "./pages/CoachHome";
import CoachProducts from "./pages/CoachProducts";
import CoachInbox from "./pages/CoachInbox";
import CoachManage from "./pages/CoachManage";
import CoachProfileNew from "./pages/CoachProfileNew";
import CoachOpportunities from "./pages/CoachOpportunities";
import CoachLivestreams from "./pages/CoachLivestreams";
import CoachContent from "./pages/CoachContent";
import CoachPricing from "./pages/CoachPricing";
import CoachCalendar from "./pages/CoachCalendar";
import CoachEarnings from "./pages/CoachEarnings";
import CoachReviews from "./pages/CoachReviews";
import CoachDiscountCodes from "./pages/CoachDiscountCodes";
import CoachCategoryEdit from "./pages/CoachCategoryEdit";
import CoachProductNew from "./pages/CoachProductNew";
import OfferingPage from "./pages/OfferingPage";
import LiveSession from "./pages/program/session/LiveSession";
import IncredibleHomePage from "./pages/IncredibleHomePage";
import IncredibleHomePageBU from "./pages/IncredibleHomePageBU";
import IncredibleOnboarding from "./pages/IncredibleOnboarding";
import Onboarding from "./pages/onboarding/Onboarding";
import MinimalOnboarding from "./pages/onboarding/MinimalOnboarding";
import MinimalOnboardingV2 from "./pages/onboarding/MinimalOnboardingV2";
import MinimalOnboardingV4 from "./pages/onboarding/MinimalOnboardingV4";
import ContentViewer from "./pages/ContentViewer";
import LelandKitTest from "./pages/LelandKitTest";
import LessonBlocksGallery from "./pages/LessonBlocksGallery";
import Waitlist from "./pages/waitlist/Waitlist";
import WaitlistOnboarding from "./pages/waitlist/WaitlistOnboarding";
import AltNavExpertPage from "./pages/AltNavExpertPage";
import { FeedAdminProvider } from "./contexts/FeedAdminContext";

export default function App() {
  return (
    <VersionProvider>
    <DarkModeProvider>
    <ExpertModeProvider>
    <TopNavStyleProvider>
    <BookmarksProvider>
    <SavedToastProvider>
    <ProfileBarModeProvider>
    <GoalsVersionProvider>
    <GoalsProvider>
    <FullGoalsProvider>
    <FeedDemoProvider>
    <FeedAdminProvider>
    <ScrollToTop />
    <PageExitProvider>
    <Routes>
      <Route path="/b2b-dashboard" element={<B2BDashboard />} />
      <Route path="/partner-dashboard" element={<B2BDashboardV2 />} />
      <Route path="/incredible-home-page" element={<IncredibleHomePage />} />
      <Route path="/incredible-home-page-bu" element={<IncredibleHomePageBU />} />
      <Route path="/incredible-onboarding" element={<IncredibleOnboarding />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/onboarding-minimal" element={<MinimalOnboarding />} />
      <Route path="/onboarding-minimal-v2" element={<MinimalOnboardingV2 />} />
      <Route path="/onboarding-v4" element={<MinimalOnboardingV4 />} />
      <Route path="/waitlist" element={<Waitlist />} />
      <Route path="/waitlist-onboarding" element={<WaitlistOnboarding />} />
      <Route path="/reply/:postId" element={<ReplyCompose />} />
      <Route path="/replay/:postId" element={<ReplayViewer />} />
      <Route path="/capture/inbox" element={<CaptureInbox />} />
      <Route path="/capture/dashboard" element={<CaptureDashboard />} />
      <Route path="/messages/leland" element={<LelandThread />} />
      <Route path="/messages/:conversationId" element={<ConversationDetail />} />
      <Route path="/messages/:conversationId/relationship" element={<ConversationRelationship />} />
      <Route path="/content-viewer/:lessonId?/:sectionId?" element={<ContentViewer />} />
      {/* Product-creation flow — standalone full-screen surface (no app chrome) */}
      <Route path="/coach/manage/:category/new-product" element={<CoachProductNew />} />
      <Route path="/coach/manage/:category/new-product/:type" element={<CoachProductNew />} />
      <Route element={<Layout />}>
        {/* Standalone pages using PageShell directly */}
        <Route path="/profile-v2" element={<ProfileV2 />} />
        {/* Customer-facing offering page — uses the default customer top nav */}
        <Route path="/offering/:slug" element={<OfferingPage />} />
        <Route path="/profile/:slug" element={<ProfileTemplate />} />
        <Route path="/profile/:slug/:category" element={<ProfileTemplate />} />
        <Route path="/coach-profile" element={<ProfileV2 coach coachId="samantha" />} />
        <Route path="/coach-profile-john" element={<ProfileV2 coach coachId="john" />} />
        <Route path="/agent/:agentSlug" element={<CoachAgent />} />
        <Route path="/agent/:agentSlug/edit" element={<CoachAgentEdit />} />
        <Route path="/groups/:groupId" element={<Group />} />
        <Route path="/site" element={<Site />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/calendar" element={<Calendar />} />
        {/* alt-nav Calendar: self-shells (like /calendar) but with the desktop
            sidebar instead of the top navbar. Kept OUT of ContextLayout to
            avoid a double PageShell. */}
        <Route path="/alt-nav/calendar" element={<Calendar altNav />} />
        <Route path="/my-programs" element={<MyCourses />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/program/session/:urn" element={<LiveSession />} />
        <Route element={<CoachLayout />}>
          <Route path="/coach/home" element={<CoachHome />} />
          <Route path="/coach/inbox" element={<CoachInbox />} />
          <Route path="/coach/manage" element={<CoachManage />} />
          <Route path="/coach/profile-new" element={<CoachProfileNew />} />
          <Route path="/coach/products" element={<CoachProducts />} />
          <Route path="/coach/manage/:category" element={<CoachCategoryEdit />} />
          <Route path="/coach/opportunities" element={<CoachOpportunities />} />
          <Route path="/coach/livestreams" element={<CoachLivestreams />} />
          <Route path="/coach/content" element={<CoachContent />} />
          <Route path="/coach/pricing" element={<CoachPricing />} />
          <Route path="/coach/calendar" element={<CoachCalendar />} />
          <Route path="/coach/earnings" element={<CoachEarnings />} />
          <Route path="/coach/reviews" element={<CoachReviews />} />
          <Route path="/coach/discount-codes" element={<CoachDiscountCodes />} />
        </Route>
        <Route path="/components" element={<Components />} />
        <Route path="/components/leland" element={<LelandKitTest />} />
        <Route path="/components/lesson-blocks" element={<LessonBlocksGallery />} />
        <Route path="/components/session-card" element={<SessionCardTest />} />
        <Route path="/components/sidebar-cards" element={<SidebarCardsTest />} />
        <Route path="/components/offering-card" element={<OfferingCardTest />} />
        <Route path="/components/course-block" element={<CourseBlockTest />} />
        <Route path="/components/post" element={<PostTest />} />
        <Route path="/components/profile-card" element={<ProfileCardTest />} />
        <Route path="/components/group-card" element={<GroupCardTest />} />

        {/* Context-driven pages (sidebar/variant via hooks) */}
        <Route element={<ContextLayout />}>
          <Route path="/groups/law" element={<GroupCommunity />} />
          <Route path="/" element={<Home />} />
          {/* Experimental: home feed with a desktop sidebar instead of the top navbar */}
          <Route path="/alt-nav" element={<Home />} />
          {/* alt-nav sub-pages — the sidebar's destinations recreated inside the
              alt-nav shell (DesktopSidebar left, no top navbar). Reuse the same
              page components; ContextLayout supplies the shell. */}
          <Route path="/alt-nav/dashboard" element={<Dashboard />} />
          <Route path="/alt-nav/discover" element={<Browse />} />
          <Route path="/alt-nav/search" element={<Search />} />
          <Route path="/alt-nav/messages" element={<Messaging />} />
          <Route path="/alt-nav/notifications" element={<Notifications />} />
          <Route path="/alt-nav/events" element={<Events />} />
          <Route path="/alt-nav/courses" element={<Courses />} />
          <Route path="/alt-nav/plus" element={<LelandPlus />} />
          <Route path="/alt-nav/jobs" element={<AltNavExpertPage title="Jobs" eyebrow="Discover" />} />
          {/* Expert tools — POC placeholder pages recreated inside alt-nav
              (the real coach pages live under /coach/*). */}
          <Route path="/alt-nav/offerings" element={<AltNavExpertPage title="Offerings" />} />
          <Route path="/alt-nav/opportunities" element={<AltNavExpertPage title="Opportunities" />} />
          <Route path="/alt-nav/livestreams" element={<AltNavExpertPage title="Livestreams" />} />
          <Route path="/alt-nav/availability" element={<AltNavExpertPage title="Calendar" />} />
          <Route path="/alt-nav/earnings" element={<AltNavExpertPage title="Earnings" />} />
          <Route path="/alt-nav/reviews" element={<AltNavExpertPage title="Reviews" />} />
          <Route path="/alt-nav/discount-codes" element={<AltNavExpertPage title="Discount Codes" />} />
          <Route path="/alt-nav/analytics" element={<AltNavExpertPage title="Analytics" />} />
          {/* Post detail inside the alt-nav shell (sidebars persist, no top nav) */}
          <Route path="/alt-nav/post/:postId" element={<PostDetail />} />
          <Route path="/alt-nav/post/:postId/comment/:commentId" element={<CommentDetail />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/goals" element={<GoalsIndexSwitch />} />
          <Route path="/goals/new" element={<GoalNewSwitch />} />
          <Route path="/goals/:goalId" element={<GoalDetailSwitch />} />
          <Route path="/tasks" element={<FullTaskList />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/post/:postId/comment/:commentId" element={<CommentDetail />} />
          {/* Topic pages — hashtag-like filtered feeds (Trending topics sidebar) */}
          <Route path="/topic/:slug" element={<Topic />} />
          {/* Isolated LinkedIn-nav experience — feed, post detail, and the
              destinations behind the top-nav items. */}
          <Route path="/linkedin-nav" element={<Home />} />
          <Route path="/linkedin-nav/post/:postId" element={<PostDetail />} />
          <Route path="/linkedin-nav/post/:postId/comment/:commentId" element={<CommentDetail />} />
          <Route path="/linkedin-nav/dashboard" element={<Dashboard />} />
          <Route path="/linkedin-nav/jobs" element={<Jobs />} />
          <Route path="/linkedin-nav/plus" element={<LelandPlus />} />
          <Route path="/linkedin-nav/messages" element={<Messaging />} />
          <Route path="/linkedin-nav/notifications" element={<Notifications />} />
          <Route path="/events" element={<Events />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/plus" element={<LelandPlus />} />
          <Route path="/jobs" element={<Jobs />} />
        </Route>
      </Route>
    </Routes>
    <PageExitOverlay />
    </PageExitProvider>
    </FeedAdminProvider>
    </FeedDemoProvider>
    </FullGoalsProvider>
    </GoalsProvider>
    </GoalsVersionProvider>
    </ProfileBarModeProvider>
    </SavedToastProvider>
    </BookmarksProvider>
    </TopNavStyleProvider>
    </ExpertModeProvider>
    </DarkModeProvider>
    </VersionProvider>
  );
}
