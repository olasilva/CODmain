// All content shown across the student dashboard. Swap this out for real
// API / Supabase data once the backend is wired up — every dashboard page
// reads from here, nothing is hardcoded in the components.

export const student = {
  name: "Adaeze Okonkwo",
  className: "Primary 5A",
  studentId: "COD/2024/P5/012",
  session: "2025/2026",
  termLabel: "Term 3, Week 8",
};

export const dashboardStats = [
  { icon: "📚", value: "4", label: "Enrolled courses" },
  { icon: "🎓", value: "3", label: "Today's Classes" },
  { icon: "📝", value: "2", label: "Pending Assignments" },
  { icon: "⭐", value: "4.2", label: "Current GPA" },
];

export const todaysSchedule = [
  { time: "10:00", meridiem: "AM", subject: "Guitar Fundamentals", teacher: "Prof. Adebayo", location: "Room 101", status: "Live", accent: "bg-red-500" },
  { time: "1:00", meridiem: "PM", subject: "Mathematics SS1", teacher: "Mr. Okonkwo", location: "Online", status: "Upcoming", accent: "bg-amber-400" },
  { time: "3:00", meridiem: "PM", subject: "Music Theory", teacher: "Prof. Adebayo", location: "Room 205", status: "Upcoming", accent: "bg-emerald-500" },
];

export const dashboardAssignments = [
  { title: "Guitar Practice Log", due: "Due: Tomorrow", status: "Pending" },
  { title: "Mathematics Assignment", due: "Due: In 3 days", status: "Upcoming" },
  { title: "Music Theory Quiz", due: "Due: Submitted", status: "Submitted" },
];

export const courses = [
  { code: "MUS101", name: "Guitar Fundamentals", teacher: "Prof. Adebayo", progress: 75, color: "bg-cod-blue", badge: 3, badgeColor: "bg-cod-blue", nextClass: "Today, 10:00 AM" },
  { code: "MAT201", name: "Mathematics SS1", teacher: "Mr. Okonkwo", progress: 60, color: "bg-emerald-500", badge: 4, badgeColor: "bg-emerald-500", nextClass: "Today, 1:00 PM" },
  { code: "MUS201", name: "Music Theory", teacher: "Prof. Adebayo", progress: 85, color: "bg-amber-400", badge: 3, badgeColor: "bg-amber-400", nextClass: "Today, 3:00 PM" },
  { code: "ENG101", name: "English Language", teacher: "Mrs. Johnson", progress: 50, color: "bg-pink-500", badge: 3, badgeColor: "bg-pink-500", nextClass: "Tomorrow, 9:00 AM" },
];

export const upcomingClasses = [
  { time: "10:00 AM", day: "Today", subject: "Guitar Fundamentals", teacher: "Prof. Adebayo", location: "Room 101", duration: "1 hour", status: "Live", accent: "bg-red-500" },
  { time: "1:00 PM", day: "Today", subject: "Mathematics SS1", teacher: "Mr. Okonkwo", location: "Online", duration: "1.5 hours", status: "Upcoming", accent: "bg-amber-400" },
  { time: "3:00 PM", day: "Today", subject: "Music Theory", teacher: "Prof. Adebayo", location: "Room 205", duration: "1 hour", status: "Upcoming", accent: "bg-emerald-500" },
  { time: "9:00 AM", day: "Tomorrow", subject: "English Language", teacher: "Mrs. Johnson", location: "Room 103", duration: "1 hour", status: "Scheduled", accent: "bg-cod-blue" },
];

export const recentRecordings = [
  { title: "Guitar Fundamentals - Week 7", teacher: "Prof. Adebayo", date: "June 23, 2026", duration: "58:42" },
  { title: "Mathematics SS1 - Algebra Basics", teacher: "Mr. Okonkwo", date: "June 22, 2026", duration: "1:22:15" },
  { title: "Music Theory - Chord Progressions", teacher: "Prof. Adebayo", date: "June 21, 2026", duration: "1:05:30" },
];

export const assignmentStats = [
  { value: 2, label: "Pending", color: "text-red-500" },
  { value: 1, label: "In Progress", color: "text-amber-500" },
  { value: 1, label: "Submitted", color: "text-cod-blue" },
  { value: 1, label: "Graded", color: "text-emerald-500" },
];

export const assignments = [
  {
    title: "Guitar Practice Log",
    status: "Pending",
    priority: true,
    course: "Guitar Fundamentals",
    description: "Submit your weekly practice log with at least 5 hours of documented practice.",
    due: "June 27, 2026 at 11:59 PM",
    points: 20,
  },
  {
    title: "Mathematics Assignment - Chapter 5",
    status: "In Progress",
    course: "Mathematics SS1",
    description: "Complete exercises 1-15 from the textbook on algebraic expressions.",
    due: "June 29, 2026 at 11:59 PM",
    points: 30,
  },
  {
    title: "Music Theory Quiz",
    status: "Submitted",
    course: "Music Theory",
    description: "Online quiz covering chord progressions and harmonic analysis.",
    due: "June 25, 2026 at 2:00 PM",
    points: 15,
    submittedOn: "June 24, 2026",
  },
  {
    title: "English Essay - Literary Analysis",
    status: "Not Started",
    course: "English Language",
    description: "Write a 500-word essay analyzing the themes in the assigned novel.",
    due: "July 1, 2026 at 11:59 PM",
    points: 40,
  },
  {
    title: "Piano Recital Preparation",
    status: "Graded",
    course: "Guitar Fundamentals",
    description: "Prepare and record two pieces for evaluation.",
    due: "June 26, 2026 at 5:00 PM",
    points: 25,
    submittedOn: "June 20, 2026",
    grade: "23/25",
    feedback: "Excellent performance! Work on tempo consistency in the second piece.",
  },
];

// --- Academic results / report card ------------------------------------

const term1Subjects = [
  { name: "Mathematics", code: "MTH501", ca1: 18, ca2: 17, exam: 52, total: 87, grade: "A", remark: "Distinction", color: "bg-cod-blue" },
  { name: "English Language", code: "ENG501", ca1: 16, ca2: 17, exam: 50, total: 83, grade: "A", remark: "Distinction", color: "bg-emerald-500" },
  { name: "Basic Science & Technology", code: "BST501", ca1: 19, ca2: 18, exam: 56, total: 93, grade: "A", remark: "Distinction", color: "bg-amber-400" },
  { name: "Social Studies", code: "SST501", ca1: 17, ca2: 16, exam: 48, total: 81, grade: "A", remark: "Distinction", color: "bg-red-500" },
  { name: "Civic Education", code: "CVE501", ca1: 18, ca2: 19, exam: 54, total: 91, grade: "A", remark: "Distinction", color: "bg-purple-500" },
  { name: "Christian Religious Studies", code: "CRS501", ca1: 20, ca2: 19, exam: 57, total: 96, grade: "A", remark: "Distinction", color: "bg-teal-500" },
  { name: "Yoruba Language", code: "YOR501", ca1: 15, ca2: 14, exam: 44, total: 73, grade: "B", remark: "Credit", color: "bg-orange-500" },
  { name: "Computer Studies", code: "CMP501", ca1: 19, ca2: 18, exam: 55, total: 92, grade: "A", remark: "Distinction", color: "bg-sky-500" },
  { name: "Physical & Health Education", code: "PHE501", ca1: 17, ca2: 18, exam: 51, total: 86, grade: "A", remark: "Distinction", color: "bg-green-600" },
  { name: "Creative & Cultural Arts", code: "CCA501", ca1: 18, ca2: 19, exam: 53, total: 90, grade: "A", remark: "Distinction", color: "bg-rose-600" },
];

export const resultsByTerm = {
  "Term 1": {
    average: 87,
    grade: "A",
    position: "3rd",
    positionOf: 32,
    subjectsOffered: 10,
    subjects: term1Subjects,
    gradeDistribution: { "Distinction (A)": 9, "Credit (B)": 1, "Pass (C)": 0, "Below Pass": 0 },
    bestSubject: { name: "Christian Religious Studies", score: 96 },
    needsAttention: { name: "Yoruba Language", score: 73 },
    teacherRemark: {
      text: "Adaeze demonstrates excellent academic ability and a strong work ethic. Outstanding performance this term!",
      teacher: "Mrs. Funmilayo Adebayo, Class Teacher, Primary 5A",
    },
    dateIssued: "7 July 2026",
  },
  // Placeholder — replace once Term 2 / Term 3 scores are recorded.
  "Term 2": null,
  "Term 3": null,
};

export const gradingKey = [
  { grade: "A", label: "Distinction", range: "75–100", color: "text-cod-blue" },
  { grade: "B", label: "Credit", range: "65–74", color: "text-emerald-600" },
  { grade: "C", label: "Pass", range: "55–64", color: "text-amber-600" },
  { grade: "D", label: "Below Avg", range: "45–54", color: "text-orange-600" },
  { grade: "F", label: "Fail", range: "0–44", color: "text-red-600" },
];
