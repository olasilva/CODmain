// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';

// ─── Public pages ───
import Home from './pages/Home';
import MusicTrack from './pages/MusicTrack';
import RegularTrack from './pages/RegularTrack';
import MixedTrack from './pages/MixedTrack';
import Enroll from './pages/enroll';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Application from './pages/application';
import CreateAccount from './pages/admission/createAccount';
import CourseSelection from './pages/admission/CourseSelection';
import CompleteApplication from './pages/admission/CompleteApplication';
import ApplicationSubmitted from './pages/admission/ApplicationSubmitted';
import Payment from './pages/payment';
import About from './pages/About';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsPost from './pages/NewsPost';
import Programmes from './pages/Programmes';
import Welcome from './pages/Welcome';
import Placeholder from './pages/Placeholder';

// ─── Student dashboard ───
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentClasses from './pages/student/StudentClasses';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentResults from './pages/student/StudentResults';
import StudentMessages from './pages/student/StudentMessages';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentSettings from './pages/student/StudentSettings';

// ─── Staff dashboard ───
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffCourses from './pages/staff/StaffCourses';
import StaffStudents from './pages/staff/StaffStudents';
import StaffGrading from './pages/staff/StaffGrading';
import StaffAssignments from './pages/staff/StaffAssignments';
import StaffSessions from './pages/staff/StaffSessions';
import StaffAttendance from './pages/staff/StaffAttendance';
import StaffMessages from './pages/staff/StaffMessages';

// ─── Admin pages ───
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminStaff from './pages/admin/AdminStaff';
import AdminCourses from './pages/admin/AdminCourses';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminStudentProfile from './pages/admin/AdminStudentprofile';
import AdminStudentResults from './pages/admin/AdminStudentResults';
import AdminBlog from './pages/admin/AdminBlog';

// ─── Admin shells ───
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminRoute from './routes/AdminRoute';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {isLoading && <Loader />}
      <div className="font-body">
        <Routes>
          {/* ═══════════════ Main Pages ═══════════════ */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsPost />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/admission" element={<Application />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route
            path="/forgot-password"
            element={
              <Placeholder
                title="Forgot password"
                body="Password recovery is coming soon."
              />
            }
          />
          <Route
            path="/terms"
            element={
              <Placeholder
                title="Terms and conditions"
                body="Our terms and conditions are being prepared."
              />
            }
          />

          {/* ═══════════════ Programme Pages ═══════════════ */}
          <Route path="/programmes/music-track" element={<MusicTrack />} />
          <Route path="/programmes/regular-track" element={<RegularTrack />} />
          <Route path="/programmes/mixed-track" element={<MixedTrack />} />

          {/* ═══════════════ Enrollment Flow ═══════════════ */}
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/application" element={<Application />} />
          <Route path="/admission/create-account" element={<CreateAccount />} />
          <Route
            path="/admission/course-selection"
            element={<CourseSelection />}
          />
          <Route
            path="/admission/complete-application"
            element={<CompleteApplication />}
          />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/admission/application-submitted"
            element={<ApplicationSubmitted />}
          />

          {/* ═══════════════ Authentication ═══════════════ */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* ═══════════════ Student Dashboard ═══════════════ */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route
            path="/dashboard/assignments"
            element={<StudentAssignments />}
          />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/messages" element={<StudentMessages />} />
          <Route
            path="/student/notifications"
            element={<StudentNotifications />}
          />
          <Route path="/student/settings" element={<StudentSettings />} />

          {/* ═══════════════ Staff Dashboard ═══════════════ */}
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/courses" element={<StaffCourses />} />
          <Route path="/staff/students" element={<StaffStudents />} />
          <Route
            path="/staff/students/:studentId"
            element={<StaffStudents />}
          />
          <Route path="/staff/grading" element={<StaffGrading />} />
          <Route path="/staff/assignments" element={<StaffAssignments />} />
          <Route path="/staff/sessions" element={<StaffSessions />} />
          <Route path="/staff/attendance" element={<StaffAttendance />} />
          <Route path="/staff/messages" element={<StaffMessages />} />

          {/* ═══════════════ Admin ═══════════════ */}

          {/* Public admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 403 page */}
          <Route
            path="/admin/forbidden"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-slate-800">403</h1>
                  <p className="mt-2 text-slate-500">
                    You don't have admin access.
                  </p>
                </div>
              </div>
            }
          />

          {/* Guarded admin panel — every child route renders inside AdminLayout */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Students */}
            <Route path="students" element={<AdminStudents />} />
            <Route
              path="students/:studentId"
              element={<AdminStudentProfile />}
            />
            <Route
              path="students/:studentId/results"
              element={<AdminStudentResults />}
            />

            {/* Legacy singular aliases */}
            <Route path="student/profile" element={<AdminStudentProfile />} />
            <Route path="student/results" element={<AdminStudentResults />} />

            {/* Staff */}
            <Route path="staff" element={<AdminStaff />} />

            {/* Courses / Programmes */}
            <Route path="courses" element={<AdminCourses />} />
            <Route path="programmes" element={<AdminCourses />} />

            {/* Payments / Reports / Settings */}
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* Blog & News */}
            <Route path="blog" element={<AdminBlog />} />
            <Route path="news" element={<AdminBlog />} />

            {/* 404 fallback within /admin — keep this last */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Global 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}