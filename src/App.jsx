import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Programmes from "./pages/Programmes";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import News from "./pages/News";
import NewsPost from "./pages/NewsPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CourseSelection from "./pages/admission/CourseSelection";
import CompleteApplication from "./pages/admission/CompleteApplication";
import ApplicationSubmitted from "./pages/admission/ApplicationSubmitted";
import Dashboard from "./pages/dashboard/Dashboard";
import MyCourses from "./pages/dashboard/MyCourses";
import Classes from "./pages/dashboard/Classes";
import Assignments from "./pages/dashboard/Assignments";
import Results from "./pages/dashboard/Results";
import DashboardPlaceholder from "./pages/dashboard/DashboardPlaceholder";
import Placeholder from "./pages/Placeholder";

export default function App() {
  return (
    <Routes>
      {/* Welcome / entry screen matching the original mockup */}
      <Route path="/welcome" element={<Welcome />} />

      {/* Standard site */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/programmes" element={<Programmes />} />
      <Route path="/programmes/:slug" element={<ProgrammeDetail />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<NewsPost />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Admission flow: pick track/course -> fill application -> confirmation */}
      <Route path="/admission" element={<CourseSelection />} />
      <Route path="/admission/apply" element={<CompleteApplication />} />
      <Route path="/admission/submitted" element={<ApplicationSubmitted />} />

      {/* Student dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/courses" element={<MyCourses />} />
      <Route path="/dashboard/classes" element={<Classes />} />
      <Route path="/dashboard/assignments" element={<Assignments />} />
      <Route path="/dashboard/results" element={<Results />} />
      <Route
        path="/dashboard/messages"
        element={<DashboardPlaceholder title="Messages" body="The messaging system goes here — not covered by the provided mockups yet." />}
      />
      <Route
        path="/dashboard/notifications"
        element={<DashboardPlaceholder title="Notifications" body="The notifications feed goes here — not covered by the provided mockups yet." />}
      />
      <Route
        path="/dashboard/settings"
        element={<DashboardPlaceholder title="Settings" body="Account/profile settings go here — not covered by the provided mockups yet." />}
      />

      {/* Stand-in route for links not yet in scope */}
      <Route
        path="/forgot-password"
        element={
          <Placeholder
            title="Forgot Password"
            body="The password reset flow goes here — connect this to your auth provider."
          />
        }
      />
    </Routes>
  );
}
