import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { VersionProvider } from "./contexts/VersionContext";
import VersionToggle from "./components/VersionToggle";
import Layout from "./components/Layout";
import { ContextLayout } from "./components/Layout";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function HomeOnlyVersionToggle() {
  const { pathname } = useLocation();
  return pathname === "/" ? <VersionToggle /> : null;
}

import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import ProfileV2 from "./pages/ProfileV2";
import Events from "./pages/Events";
import Courses from "./pages/Courses";
import LelandPlus from "./pages/LelandPlus";
import PostDetail from "./pages/PostDetail";
import AccountSettings from "./pages/AccountSettings";
import Calendar from "./pages/Calendar";
import MyCourses from "./pages/MyCourses";
import Dashboard from "./pages/Dashboard";
import Site from "./pages/Site";
import B2BDashboard from "./pages/B2BDashboard";
import B2BDashboardV2 from "./pages/B2BDashboardV2";
import SessionCardTest from "./pages/SessionCardTest";
import SidebarCardsTest from "./pages/SidebarCardsTest";
import OfferingCardTest from "./pages/OfferingCardTest";
import Components from "./pages/Components";

export default function App() {
  return (
    <VersionProvider>
    <HomeOnlyVersionToggle />
    <Routes>
      <Route path="*" element={<ScrollToTop />} />
      <Route path="/b2b-dashboard" element={<B2BDashboard />} />
      <Route path="/b2b-dashboard-v2" element={<B2BDashboardV2 />} />
      <Route element={<Layout />}>
        {/* Standalone pages using PageShell directly */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-v2" element={<ProfileV2 />} />
        <Route path="/site" element={<Site />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/session-card" element={<SessionCardTest />} />
        <Route path="/components/sidebar-cards" element={<SidebarCardsTest />} />
        <Route path="/components/offering-card" element={<OfferingCardTest />} />

        {/* Context-driven pages (sidebar/variant via hooks) */}
        <Route element={<ContextLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<Search />} />
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
    </VersionProvider>
  );
}
