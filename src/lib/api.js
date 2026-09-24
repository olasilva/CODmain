// src/lib/api.js
const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

const STORAGE_KEY = "cod-academy-store";

// ============ STORAGE HELPERS ============

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      users: [],
      applications: [],
      payments: [],
      messages: [],
      subscribers: [],
    };
  } catch {
    return {
      users: [],
      applications: [],
      payments: [],
      messages: [],
      subscribers: [],
    };
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ============ ROLE HELPERS ============

const ROLES = ["admin", "staff", "student"];

function inferRoleFromUrl() {
  if (typeof window === "undefined") return "student";
  const path = window.location.pathname;
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/staff")) return "staff";
  if (path.startsWith("/student")) return "student";
  return localStorage.getItem("cod-active-role") || "student";
}

function inferRoleFromPath(path) {
  if (!path) return null;
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/auth/staff")) return "admin";
  if (path.startsWith("/staff")) return "staff";
  if (path.startsWith("/student")) return "student";
  return null;
}

export function getActiveRole() {
  return localStorage.getItem("cod-active-role") || "student";
}

export function setActiveRole(role) {
  if (ROLES.includes(role)) {
    localStorage.setItem("cod-active-role", role);
  }
}

function pickToken(role) {
  if (role) return localStorage.getItem(`cod-${role}-token`);
  const order = [getActiveRole(), ...ROLES];
  for (const r of order) {
    const t = localStorage.getItem(`cod-${r}-token`);
    if (t) return t;
  }
  return null;
}

// ============ TOKEN MANAGEMENT ============

export function getToken(role) {
  const r = role || inferRoleFromUrl();
  return localStorage.getItem(`cod-${r}-token`);
}

export function setToken(token, role) {
  const r = role || inferRoleFromUrl();
  if (token) {
    localStorage.setItem(`cod-${r}-token`, token);
  } else {
    localStorage.removeItem(`cod-${r}-token`);
  }
}

export function getSession(role) {
  const r = role || inferRoleFromUrl();
  try {
    return JSON.parse(localStorage.getItem(`cod-${r}-session`));
  } catch {
    return null;
  }
}

export function setSession(user, role) {
  if (!user) return;
  const r = role || user.role || inferRoleFromUrl();
  localStorage.setItem(`cod-${r}-session`, JSON.stringify(user));
  setActiveRole(r);
}

export function isLoggedIn(role) {
  const r = role || inferRoleFromUrl();
  return (
    !!localStorage.getItem(`cod-${r}-token`) &&
    !!localStorage.getItem(`cod-${r}-session`)
  );
}

export function logoutUser(role) {
  const r = role || inferRoleFromUrl();
  localStorage.removeItem(`cod-${r}-token`);
  localStorage.removeItem(`cod-${r}-session`);

  const anyLoggedIn = ROLES.some((x) =>
    localStorage.getItem(`cod-${x}-token`)
  );
  if (!anyLoggedIn) {
    localStorage.removeItem("cod-active-role");
  }
}

export function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// ============ API REQUEST HELPER ============

async function request(path, options = {}) {
  const role = inferRoleFromPath(path);
  const token = pickToken(role);

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  console.log(
    `🔵 API Request [${role || "any"}]: ${options.method || "GET"} ${API_URL}${path}`
  );

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("❌ API Request failed:", error);
    throw error;
  }
}

// ============ ID GENERATOR ============

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ============ AUTHENTICATION ============

export async function registerUser(user) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function loginUser(credentials) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (data.token && data.user) {
    const role = data.user.role || "student";
    localStorage.setItem(`cod-${role}-token`, data.token);
    localStorage.setItem(`cod-${role}-session`, JSON.stringify(data.user));
    localStorage.setItem("cod-active-role", role);
    console.log(`✅ Logged in as ${role}:`, data.user.email);
  }

  return data;
}

export async function googleLogin({ token, role }) {
  const data = await request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ token, role }),
  });

  if (data.token && data.user) {
    const r = data.user.role || "student";
    localStorage.setItem(`cod-${r}-token`, data.token);
    localStorage.setItem(`cod-${r}-session`, JSON.stringify(data.user));
    localStorage.setItem("cod-active-role", r);
  }

  return data;
}

export function setSessionFromToken(token) {
  const payload = decodeJwt(token);
  if (!payload) return null;
  const role = payload.role || "student";
  localStorage.setItem(`cod-${role}-token`, token);
  localStorage.setItem("cod-active-role", role);
  return payload;
}

export async function getCurrentUser() {
  return request("/auth/profile");
}

export async function updateProfile(data) {
  const result = await request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (result.user) {
    const role = result.user.role || inferRoleFromUrl();
    const existing = getSession(role);
    if (existing) {
      setSession({ ...existing, ...result.user }, role);
    }
  }

  return result;
}

export async function changePassword(data) {
  return request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ STUDENT PROFILE ============

export async function getStudentProfile() {
  return request("/student/profile");
}

export async function updateStudentProfile(data) {
  return request("/student/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============ STUDENT — MY PROGRAMME & CLASSES ============

export async function getMyProgramme() {
  return request("/student/my-programme");
}

export async function getMyEnrolledClasses() {
  return request("/student/my-classes");
}

// ============ STUDENT COURSES (legacy) ============

export async function getStudentCourses() {
  return request("/student/courses");
}

export async function getCourseDetails(courseId) {
  return request(`/student/courses/${courseId}`);
}

export async function getEnrollments() {
  return request("/student/enrollments");
}

export async function getCourseMaterials(classId) {
  return request(`/materials/${classId}`);
}

export async function getCourseAssignments(courseId) {
  return request(`/student/courses/${courseId}/assignments`);
}

// ============ ADMISSIONS ============

export async function startAdmission(data) {
  return request("/admissions/start", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAdmissionStatus() {
  return request("/admissions/status");
}

export async function submitDocuments(admissionId, documents) {
  return request(`/admissions/${admissionId}/documents`, {
    method: "POST",
    body: JSON.stringify({ documents }),
  });
}

export async function getApplications() {
  return request("/admissions");
}

export async function createApplication(application) {
  return startAdmission(application);
}

// ============ PROGRAMMES ============

export async function getProgrammes() {
  return request("/admissions/programmes");
}

export async function getProgrammeById(programmeId) {
  return request(`/admissions/programmes/${programmeId}`);
}

// ============ PAYMENTS ============

export async function initializePayment(paymentData) {
  return request("/payments/initialize", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}

export async function verifyPayment(reference) {
  return request(`/payments/verify?reference=${reference}`);
}

export async function getPaymentHistory() {
  return request("/payments/history");
}

export async function getInvoices() {
  return request("/payments/invoices");
}

export async function recordPayment(payment) {
  return initializePayment(payment);
}

// ============ NEWS / BLOG (public) ============

export async function getNews() {
  return request("/news");
}

export async function getNewsPost(slug) {
  return request(`/news/${slug}`);
}

// ============ CONTACT & NEWSLETTER (public) ============

export async function submitContactMessage(message) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(message),
  });
}

export async function subscribeToNewsletter(email) {
  return request("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// ============ ADMIN — CONTACT INBOX ============

export async function getContactMessages(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/admin/contact-messages${qs ? "?" + qs : ""}`);
}

export async function markContactMessageRead(id) {
  return request(`/admin/contact-messages/${id}/read`, {
    method: "PUT",
  });
}

export async function replyToContactMessage(id, replyText) {
  return request(`/admin/contact-messages/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ replyText }),
  });
}

export async function deleteContactMessage(id) {
  return request(`/admin/contact-messages/${id}`, {
    method: "DELETE",
  });
}

// ============ ADMIN — DASHBOARD ============

export async function getAdminStats() {
  return request("/admin/stats");
}

// ============ ADMIN — STUDENTS ============

export async function getStudents(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/students${query ? `?${query}` : ""}`);
}

export async function getAdminStudents(params = {}) {
  return getStudents(params);
}

export async function getStudentById(studentId) {
  return request(`/admin/students/${studentId}`);
}

export async function getAdminStudent(studentId) {
  return getStudentById(studentId);
}

export async function updateStudent(studentId, data) {
  return request(`/admin/students/${studentId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateAdminStudent(studentId, data) {
  return updateStudent(studentId, data);
}

export async function deleteStudent(studentId) {
  return request(`/admin/students/${studentId}`, {
    method: "DELETE",
  });
}

export async function deleteAdminStudent(studentId) {
  return deleteStudent(studentId);
}

// ============ ADMIN — PROGRAMMES ============

export async function getAdminProgrammes() {
  return request("/admin/programmes");
}

export async function createAdminProgramme(data) {
  return request("/admin/programmes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminProgramme(id, data) {
  return request(`/admin/programmes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminProgramme(id) {
  return request(`/admin/programmes/${id}`, {
    method: "DELETE",
  });
}

// ============ ADMIN — CLASSES & TRACKS ============

export async function getAdminClasses() {
  return request("/admin/classes");
}

export async function getAdminTracks() {
  return request("/admin/tracks");
}

// ============ ADMIN — STAFF ============

export async function createStaffAccount(data) {
  return request("/auth/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAdminStaff(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/admin/staff${qs ? "?" + qs : ""}`);
}

export async function getStaffClasses(staffId) {
  return request(`/admin/staff/${staffId}/classes`);
}

export async function assignStaffToClasses(staffId, classIds) {
  return request(`/admin/staff/${staffId}/assign`, {
    method: "POST",
    body: JSON.stringify({ classIds }),
  });
}

// ============ ADMIN — STAFF DETAILS ============

export async function getStaffDetails(staffId) {
  return request(`/admin/staff/${staffId}`);
}

export async function updateStaffAccount(staffId, data) {
  return request(`/admin/staff/${staffId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStaffAccount(staffId) {
  return request(`/admin/staff/${staffId}`, {
    method: "DELETE",
  });
}

export async function getStaffPassword(staffId) {
  return request(`/admin/staff/${staffId}/password`);
}

export async function resetStaffPassword(staffId, options = {}) {
  return request(`/admin/staff/${staffId}/reset-password`, {
    method: "POST",
    body: JSON.stringify(options),
  });
}

// ============ ADMIN — PAYMENTS & REPORTS ============

export async function getAdminPayments(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/admin/payments${qs ? "?" + qs : ""}`);
}

export async function getAdminReports() {
  return request("/admin/reports");
}

// ============ ADMIN — REPORT CARDS ============

export async function getStudentReportCards(studentId) {
  return request(`/admin/students/${studentId}/report-cards`);
}

export async function getReportCard(studentId, session, term) {
  return request(
    `/admin/students/${studentId}/report-cards/${encodeURIComponent(session)}/${encodeURIComponent(term)}`
  );
}

export async function saveReportCard(studentId, data) {
  return request(`/admin/students/${studentId}/report-cards`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ ADMIN — NEWS / BLOG ============

export async function getAdminNews() {
  return request("/admin/news");
}

export async function createAdminNews(data) {
  return request("/admin/news", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminNews(id, data) {
  return request(`/admin/news/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminNews(id) {
  return request(`/admin/news/${id}`, {
    method: "DELETE",
  });
}

export async function uploadBlogCover(file) {
  const token = localStorage.getItem("cod-admin-token");
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_URL}/upload/blog-cover`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: fd,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || data.details || "Upload failed");
  }
  return data.url;
}

// ============ STAFF DASHBOARD ============

export async function getStaffMe() {
  return request("/staff/me");
}

export async function getStaffDashboardStats() {
  return request("/staff/stats");
}

export async function getStaffStudents(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/staff/students${qs ? "?" + qs : ""}`);
}

export async function getStaffStudentDetails(id) {
  return request(`/staff/students/${id}`);
}

export async function submitStudentScores(studentId, data) {
  return request(`/staff/students/${studentId}/scores`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitStudentResults(studentId, data) {
  return request(`/staff/students/${studentId}/submit-results`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getStaffAssignments() {
  return request("/staff/assignments");
}

export async function createStaffAssignment(data) {
  return request("/staff/assignments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getStaffSubmissions(assignmentId) {
  return request(`/staff/submissions/${assignmentId}`);
}

export async function getStaffInbox() {
  return request("/staff/inbox");
}

export async function getStaffConversation(studentId) {
  return request(`/staff/messages/${studentId}`);
}

export async function sendStaffMessage(data) {
  return request("/staff/messages", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ ONLINE SESSIONS (STAFF) ============

export async function createOnlineSession(data) {
  return request("/staff/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getStaffOnlineSessions() {
  return request("/staff/sessions");
}

export async function updateOnlineSession(id, data) {
  return request(`/staff/sessions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteOnlineSession(id) {
  return request(`/staff/sessions/${id}`, {
    method: "DELETE",
  });
}

// ============ ONLINE SESSIONS (STUDENT) ============

export async function getStudentOnlineSessions() {
  return request("/student/sessions");
}

// ============ NOTIFICATIONS ============

export async function getNotifications() {
  return request("/student/notifications");
}

export async function markNotificationRead(notificationId) {
  return request(`/student/notifications/${notificationId}/read`, {
    method: "PUT",
  });
}

export async function markAllNotificationsRead() {
  return request("/student/notifications/read-all", {
    method: "PUT",
  });
}

// ============ ASSIGNMENTS ============

export async function getAssignments() {
  return request("/student/assignments");
}

export async function getAssignmentDetails(assignmentId) {
  return request(`/student/assignments/${assignmentId}`);
}

export async function submitAssignment(assignmentId, data) {
  return request(`/student/assignments/${assignmentId}/submit`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ CLASSES ============

export async function getClasses() {
  return request("/student/classes");
}

export async function getClassDetails(classId) {
  return request(`/student/classes/${classId}`);
}

// ============ RESULTS ============

export async function getResults() {
  return request("/student/results");
}

export async function getResultDetails(resultId) {
  return request(`/student/results/${resultId}`);
}

// ============ SETTINGS ============

export async function getSettings() {
  return request("/student/settings");
}

export async function updateSettings(data) {
  return request("/student/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============ COURSE MATERIALS ============

export async function getMaterials(classId) {
  return request(`/materials/${classId}`);
}

export async function getMaterial(classId, materialId) {
  return request(`/materials/${classId}/${materialId}`);
}

// ============ MESSAGES ============

export async function getMessages() {
  return request("/student/messages");
}

export async function sendMessage(data) {
  return request("/student/messages", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function markMessageRead(messageId) {
  return request(`/student/messages/${messageId}/read`, {
    method: "PUT",
  });
}

export async function getUnreadMessageCount() {
  return request("/student/messages/unread-count");
}

// ============ EXPORT DEFAULTS ============

export default {
  // Auth
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  getSession,
  getToken,
  setToken,
  setSession,
  setSessionFromToken,
  getActiveRole,
  setActiveRole,
  decodeJwt,
  isLoggedIn,
  getCurrentUser,
  updateProfile,
  changePassword,

  // Student Profile
  getStudentProfile,
  updateStudentProfile,

  // Student — my programme & classes
  getMyProgramme,
  getMyEnrolledClasses,

  // Student Courses (legacy)
  getStudentCourses,
  getCourseDetails,
  getEnrollments,
  getCourseMaterials,
  getCourseAssignments,

  // Admissions
  startAdmission,
  getAdmissionStatus,
  submitDocuments,
  getApplications,
  createApplication,

  // Programmes
  getProgrammes,
  getProgrammeById,

  // Payments
  initializePayment,
  verifyPayment,
  getPaymentHistory,
  getInvoices,
  recordPayment,

  // News (public)
  getNews,
  getNewsPost,

  // Contact & Newsletter (public)
  submitContactMessage,
  subscribeToNewsletter,

  // Admin — contact inbox
  getContactMessages,
  markContactMessageRead,
  replyToContactMessage,
  deleteContactMessage,

  // Admin — dashboard
  getAdminStats,

  // Admin — students
  getStudents,
  getAdminStudents,
  getStudentById,
  getAdminStudent,
  updateStudent,
  updateAdminStudent,
  deleteStudent,
  deleteAdminStudent,

  // Admin — programmes
  getAdminProgrammes,
  createAdminProgramme,
  updateAdminProgramme,
  deleteAdminProgramme,

  // Admin — classes & tracks
  getAdminClasses,
  getAdminTracks,

  // Admin — staff
  createStaffAccount,
  getAdminStaff,
  getStaffClasses,
  assignStaffToClasses,

  // Admin — staff details
  getStaffDetails,
  updateStaffAccount,
  deleteStaffAccount,
  getStaffPassword,
  resetStaffPassword,

  // Admin — payments & reports
  getAdminPayments,
  getAdminReports,

  // Admin — report cards
  getStudentReportCards,
  getReportCard,
  saveReportCard,

  // Admin — news / blog
  getAdminNews,
  createAdminNews,
  updateAdminNews,
  deleteAdminNews,
  uploadBlogCover,

  // Staff Dashboard
  getStaffMe,
  getStaffDashboardStats,
  getStaffStudents,
  getStaffStudentDetails,
  submitStudentScores,
  submitStudentResults,
  getStaffAssignments,
  createStaffAssignment,
  getStaffSubmissions,
  getStaffInbox,
  getStaffConversation,
  sendStaffMessage,

  // Online Sessions (Staff)
  createOnlineSession,
  getStaffOnlineSessions,
  updateOnlineSession,
  deleteOnlineSession,

  // Online Sessions (Student)
  getStudentOnlineSessions,

  // Notifications
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,

  // Assignments
  getAssignments,
  getAssignmentDetails,
  submitAssignment,

  // Classes
  getClasses,
  getClassDetails,

  // Results
  getResults,
  getResultDetails,

  // Settings
  getSettings,
  updateSettings,

  // Materials
  getMaterials,
  getMaterial,

  // Messages
  getMessages,
  sendMessage,
  markMessageRead,
  getUnreadMessageCount,
};