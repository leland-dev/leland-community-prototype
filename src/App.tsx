import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Courses from "./pages/Courses";
import LelandPlus from "./pages/LelandPlus";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
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
