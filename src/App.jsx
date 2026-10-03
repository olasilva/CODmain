// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';

// ─── Public pages ───
import Home from './pages/Home';
import MusicTrack from './pages/MusicTrack';
import RegularTrack from './pages/RegularTrack';
import AdultEducation from './pages/AdultEducation';
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
import PaymentCallback from './pages/PaymentCallback';
import About from './pages/About';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsPost from './pages/NewsPost';
import Programmes from './pages/Programmes';
import Welcome from './pages/Welcome';
import Placeholder from './pages/Placeholder';

// ─── Student dashboard ───
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentClasses from './pages/student/StudentClasses';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentResults from './pages/student/StudentResults';
import StudentMessages from './pages/student/StudentMessages';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentSettings from './pages/student/StudentSettings';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentLearnMore from './pages/student/StudentLearnMore';

// ─── Staff dashboard ───
import StaffLayout from './pages/staff/StaffLayout';
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
import AdminMessages from './pages/admin/AdminMessages';

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
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
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
          <Route path="/programmes/adult-education" element={<AdultEducation />} />
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
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route
            path="/admission/application-submitted"
            element={<ApplicationSubmitted />}
          />

          {/* ═══════════════ Authentication ═══════════════ */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* ═══════════════ Student Dashboard ═══════════════ */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="classes" element={<StudentClasses />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="messages" element={<StudentMessages />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="settings" element={<StudentSettings />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="learn-more" element={<StudentLearnMore />} />
          </Route>

          {/* Legacy alias */}
          <Route
            path="/dashboard/assignments"
            element={<Navigate to="/student/assignments" replace />}
          />

          {/* ═══════════════ Staff Dashboard (wrapped in layout) ═══════════════ */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="courses" element={<StaffCourses />} />
            <Route path="students" element={<StaffStudents />} />
            <Route path="students/:studentId" element={<StaffStudents />} />
            <Route path="grading" element={<StaffGrading />} />
            <Route path="assignments" element={<StaffAssignments />} />
            <Route path="sessions" element={<StaffSessions />} />
            <Route path="attendance" element={<StaffAttendance />} />
            <Route path="messages" element={<StaffMessages />} />
          </Route>

          {/* ═══════════════ Admin ═══════════════ */}
          <Route path="/admin/login" element={<AdminLogin />} />

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

            <Route path="students" element={<AdminStudents />} />
            <Route
              path="students/:studentId"
              element={<AdminStudentProfile />}
            />
            <Route
              path="students/:studentId/results"
              element={<AdminStudentResults />}
            />
            <Route path="student/profile" element={<AdminStudentProfile />} />
            <Route path="student/results" element={<AdminStudentResults />} />

            <Route path="staff" element={<AdminStaff />} />

            <Route path="courses" element={<AdminCourses />} />
            <Route path="programmes" element={<AdminCourses />} />

            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />

            <Route path="blog" element={<AdminBlog />} />
            <Route path="news" element={<AdminBlog />} />

            <Route path="messages" element={<AdminMessages />} />

            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}