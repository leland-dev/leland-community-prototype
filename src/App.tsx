import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { useEffect } from "react";
import { VersionProvider } from "./contexts/VersionContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { BookmarksProvider } from "./contexts/BookmarksContext";
import { SavedToastProvider } from "./contexts/SavedToastContext";
import { ExpertModeProvider } from "./contexts/ExpertModeContext";
import { PageExitProvider } from "./contexts/PageExitContext";
import PageExitOverlay from "./components/PageExitOverlay";
import Layout from "./components/Layout";
import { ContextLayout } from "./components/Layout";

// Remembers each route's scroll position and restores it (smoothly) when the
// user navigates back to it — but only on a "POP" (back/forward or
// navigate(-1)), so forward navigation still lands at the top of the page.
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const saved = sessionStorage.getItem(`scrollY:${pathname}`);
    if (navigationType === "POP" && saved !== null) {
      window.scrollTo({ top: Number(saved), behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  useEffect(() => {
    const onScroll = () => sessionStorage.setItem(`scrollY:${pathname}`, String(window.scrollY));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}

import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messaging from "./pages/Messaging";
import ConversationDetail from "./pages/ConversationDetail";
import ConversationRelationship from "./pages/ConversationRelationship";
import Profile from "./pages/Profile";
import ProfileV2 from "./pages/ProfileV2";
import CoachAgent from "./pages/CoachAgent";
import CoachAgentEdit from "./pages/CoachAgentEdit";
import Group from "./pages/Group";
import GroupCommunity from "./pages/GroupCommunity";
import Events from "./pages/Events";
import Courses from "./pages/Courses";
import LelandPlus from "./pages/LelandPlus";
import Dashboard from "./pages/Dashboard";
import PostDetail from "./pages/PostDetail";
import ReplyCompose from "./pages/ReplyCompose";
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
import CoachOpportunities from "./pages/CoachOpportunities";
import CoachCalendar from "./pages/CoachCalendar";
import CoachEarnings from "./pages/CoachEarnings";
import CoachReviews from "./pages/CoachReviews";
import CoachDiscountCodes from "./pages/CoachDiscountCodes";
import CoachCategoryEdit from "./pages/CoachCategoryEdit";
import LiveSession from "./pages/program/session/LiveSession";
import IncredibleHomePage from "./pages/IncredibleHomePage";
import IncredibleHomePageBU from "./pages/IncredibleHomePageBU";
import IncredibleOnboarding from "./pages/IncredibleOnboarding";

export default function App() {
  return (
    <VersionProvider>
    <DarkModeProvider>
    <ExpertModeProvider>
    <BookmarksProvider>
    <SavedToastProvider>
    <ScrollToTop />
    <PageExitProvider>
    <Routes>
      <Route path="/b2b-dashboard" element={<B2BDashboard />} />
      <Route path="/partner-dashboard" element={<B2BDashboardV2 />} />
      <Route path="/incredible-home-page" element={<IncredibleHomePage />} />
      <Route path="/incredible-home-page-bu" element={<IncredibleHomePageBU />} />
      <Route path="/incredible-onboarding" element={<IncredibleOnboarding />} />
      <Route path="/reply/:postId" element={<ReplyCompose />} />
      <Route path="/messages/:conversationId" element={<ConversationDetail />} />
      <Route path="/messages/:conversationId/relationship" element={<ConversationRelationship />} />
      <Route element={<Layout />}>
        {/* Standalone pages using PageShell directly */}
        <Route path="/profile-v2" element={<ProfileV2 />} />
        <Route path="/coach-profile" element={<ProfileV2 coach coachId="samantha" />} />
        <Route path="/coach-profile-john" element={<ProfileV2 coach coachId="john" />} />
        <Route path="/agent/:agentSlug" element={<CoachAgent />} />
        <Route path="/agent/:agentSlug/edit" element={<CoachAgentEdit />} />
        <Route path="/groups/:groupId" element={<Group />} />
        <Route path="/site" element={<Site />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/my-programs" element={<MyCourses />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/program/session/:urn" element={<LiveSession />} />
        <Route element={<CoachLayout />}>
          <Route path="/coach/home" element={<CoachHome />} />
          <Route path="/coach/inbox" element={<CoachInbox />} />
          <Route path="/coach/manage" element={<CoachManage />} />
          <Route path="/coach/products" element={<CoachProducts />} />
          <Route path="/coach/manage/:category" element={<CoachCategoryEdit />} />
          <Route path="/coach/opportunities" element={<CoachOpportunities />} />
          <Route path="/coach/calendar" element={<CoachCalendar />} />
          <Route path="/coach/earnings" element={<CoachEarnings />} />
          <Route path="/coach/reviews" element={<CoachReviews />} />
          <Route path="/coach/discount-codes" element={<CoachDiscountCodes />} />
        </Route>
        <Route path="/components" element={<Components />} />
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
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/plus" element={<LelandPlus />} />
        </Route>
      </Route>
    </Routes>
    <PageExitOverlay />
    </PageExitProvider>
    </SavedToastProvider>
    </BookmarksProvider>
    </ExpertModeProvider>
    </DarkModeProvider>
    </VersionProvider>
  );
}
