// src/lib/api.js
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";
const STORAGE_KEY = "cod-academy-store";
const SESSION_KEY = "cod-academy-session";
const TOKEN_KEY = "cod-academy-token";

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
    return { users: [], applications: [], payments: [], messages: [], subscribers: [] };
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ============ TOKEN MANAGEMENT ============

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// ============ API REQUEST HELPER ============

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  console.log(`🔵 API Request: ${options.method || "GET"} ${API_URL}${path}`);

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

  if (data.token) {
    setToken(data.token);
    setSession(data.user);
  }

  return data;
}

export async function googleLogin({ token, role }) {
  const data = await request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ token, role }),
  });

  if (data.token) {
    setToken(data.token);
    setSession(data.user);
  }

  return data;
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
    const session = getSession();
    if (session) {
      setSession({ ...session, ...result.user });
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

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn() {
  return !!getToken() && !!getSession();
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

// ============ STUDENT COURSES ============

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

// ============ PROGRAMMES / COURSES ============

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

// ============ NEWS / BLOG ============

export async function getNews() {
  return request("/news");
}

export async function getNewsPost(slug) {
  return request(`/news/${slug}`);
}

// ============ CONTACT & NEWSLETTER ============

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

// ============ STAFF / ADMIN ============

export async function getStaffStats() {
  return request("/admin/stats");
}

export async function getAdminStats() {
  return request("/admin/stats");
}

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

// Admin — programmes
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

// Admin — staff account creation
export async function createStaffAccount(data) {
  return request("/auth/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Admin — staff list
export async function getAdminStaff(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/admin/staff${qs ? "?" + qs : ""}`);
}

// Admin — payments
export async function getAdminPayments(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/admin/payments${qs ? "?" + qs : ""}`);
}

// Admin — reports
export async function getAdminReports() {
  return request("/admin/reports");
}

// Admin — report cards
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
  isLoggedIn,
  getCurrentUser,
  updateProfile,
  changePassword,

  // Student Profile
  getStudentProfile,
  updateStudentProfile,

  // Student Courses
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

  // News
  getNews,
  getNewsPost,

  // Contact
  submitContactMessage,
  subscribeToNewsletter,

  // Admin/Staff
  getStaffStats,
  getAdminStats,
  getStudents,
  getAdminStudents,
  getStudentById,
  getAdminStudent,
  updateStudent,
  updateAdminStudent,
  deleteStudent,
  deleteAdminStudent,
  getAdminProgrammes,
  createAdminProgramme,
  updateAdminProgramme,
  deleteAdminProgramme,
  createStaffAccount,
  getAdminStaff,
  getAdminPayments,
  getAdminReports,
  getStudentReportCards,
  getReportCard,
  saveReportCard,

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