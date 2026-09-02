import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MusicTrack from './pages/MusicTrack'
import RegularTrack from './pages/RegularTrack'
import MixedTrack from './pages/MixedTrack'
import Enroll from './pages/enroll'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Application from './pages/application'
import CreateAccount from './pages/admission/createAccount'
import CourseSelection from './pages/admission/CourseSelection'
import CompleteApplication from './pages/admission/CompleteApplication'
import ApplicationSubmitted from './pages/admission/ApplicationSubmitted'
import Payment from './pages/payment'

// Student Dashboard Imports
import StudentDashboard from './pages/student/StudentDashboard'
import StudentCourses from './pages/student/StudentCourses'
import StudentClasses from './pages/student/StudentClasses'
import StudentAssignments from './pages/student/StudentAssignments'
import StudentResults from './pages/student/StudentResults'
import StudentMessages from './pages/student/StudentMessages'
import StudentNotifications from './pages/student/StudentNotifications'
import StudentSettings from './pages/student/StudentSettings'

// Staff Imports
import StaffSignUp from './pages/staff/StaffSignUp'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffCourses from './pages/staff/StaffCourses'
import StaffStudents from './pages/staff/StaffStudents'
import StaffGrading from './pages/staff/StaffGrading'
import StaffAssignments from './pages/staff/StaffAssignments'
import StaffSessions from './pages/staff/StaffSessions'
import StaffAttendance from './pages/staff/StaffAttendance'

// Admin Imports
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminStaff from './pages/admin/AdminStaff'
import AdminCourses from './pages/admin/AdminCourses'
import AdminPayments from './pages/admin/AdminPayments'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'
import AdminStudentProfile from './pages/admin/AdminStudentprofile'
import AdminStudentResults from './pages/admin/AdminStudentResults'

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-body">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          
          {/* Programme Pages */}
          <Route path="/programmes/music-track" element={<MusicTrack />} />
          <Route path="/programmes/regular-track" element={<RegularTrack />} />
          <Route path="/programmes/mixed-track" element={<MixedTrack />} />
          
          {/* Enrollment Flow */}
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/application" element={<Application />} />
          <Route path="/admission/create-account" element={<CreateAccount />} />
          <Route path="/admission/course-selection" element={<CourseSelection />} />
          <Route path="/admission/complete-application" element={<CompleteApplication />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admission/application-submitted" element={<ApplicationSubmitted />} />
          
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/staff/signup" element={<StaffSignUp />} />
          
          {/* Student Dashboard Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/messages" element={<StudentMessages />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/student/settings" element={<StudentSettings />} />

          {/* Staff Dashboard Routes */}
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/courses" element={<StaffCourses />} />
          <Route path="/staff/students" element={<StaffStudents />} />
          <Route path="/staff/grading" element={<StaffGrading />} />
          <Route path="/staff/assignments" element={<StaffAssignments />} />
          <Route path="/staff/sessions" element={<StaffSessions />} />
          <Route path="/staff/attendance" element={<StaffAttendance />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/student/profile" element={<AdminStudentProfile />} />
          <Route path="/admin/student/results" element={<AdminStudentResults />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}