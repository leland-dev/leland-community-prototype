import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
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
import Site from "./pages/Site";

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<ScrollToTop />} />
      {/* Pages with their own full-width layout */}
      <Route path="/profile-v2" element={<ProfileV2 />} />
      <Route path="/site" element={<Site />} />

      {/* Settings gets its own layout - full-width sidebar */}
      <Route path="/settings" element={<AccountSettings />} />

      {/* Calendar gets its own layout - wider two-column */}
      <Route path="/calendar" element={<Calendar />} />

      {/* My Courses gets its own layout */}
      <Route path="/my-courses" element={<MyCourses />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/search" element={<Search />} />
        <Route path="/events" element={<Events />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/plus" element={<LelandPlus />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messaging />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
