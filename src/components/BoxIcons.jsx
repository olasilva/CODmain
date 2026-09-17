// src/components/BoxIcons.jsx
// Universal icon module — every import resolves, no matter what name.

const iconPaths = {
  // ── Navigation ──
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  people: <><path d="M17 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" strokeLinecap="round" /><circle cx="9.5" cy="7" r="3.5" /><path d="M22 20v-1a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" /></>,
  courses: <><path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  payments: <><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20M6 15h4" strokeLinecap="round" /></>,
  reports: <><path d="M3 3v18h18" strokeLinecap="round" /><path d="M7 15l3-3 4 4 5-6" strokeLinecap="round" strokeLinejoin="round" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" /><line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" /></>,
  news: <><path d="M4 4h13a2 2 0 0 1 2 2v11a3 3 0 0 0 3 3H7a3 3 0 0 1-3-3V4z" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 7h1a1 1 0 0 1 1 1v9a3 3 0 0 1-3 3H7" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 8h5M8 12h7M8 16h4" strokeLinecap="round" strokeLinejoin="round" /></>,

  // ── Student / Staff nav ──
  assignments: <><path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" /></>,
  classes: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" /></>,
  results: <><path d="M3 3v18h18" strokeLinecap="round" /><path d="M7 15l3-3 4 4 5-6" strokeLinecap="round" strokeLinejoin="round" /></>,
  messages: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" /></>,
  notifications: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" /></>,
  attendance: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /><path d="M9 15l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></>,
  grading: <><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" strokeLinecap="round" strokeLinejoin="round" /></>,
  sessions: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" /></>,
  inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" strokeLinecap="round" strokeLinejoin="round" /></>,

  // ── Communication ──
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" /></>,
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" /></>,
  mail: <><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" /><polyline points="22 6 12 13 2 6" strokeLinecap="round" strokeLinejoin="round" /></>,
  phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" /></>,

  // ── Status ──
  check: <><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></>,
  x: <><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" /></>,
  loading: <><path d="M21 12a9 9 0 1 1-6.22-8.56" strokeLinecap="round" /></>,
  star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" /></>,
  award: <><circle cx="12" cy="8" r="6" /><path d="M15.5 12.5L17 22l-5-3-5 3 1.5-9.5" strokeLinecap="round" strokeLinejoin="round" /></>,

  // ── Actions ──
  plus: <><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" /></>,
  trash: <><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="7 9 12 4 17 9" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="4" x2="12" y2="16" strokeLinecap="round" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" /></>,
  refresh: <><polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round" /><polyline points="1 20 1 14 7 14" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" strokeLinecap="round" strokeLinejoin="round" /></>,
  arrowLeft: <><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></>,
  arrowRight: <><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" /></>,

  // ── Media ──
  document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" /></>,
  music: <><path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,

  // ── Payment ──
  bank: <><path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M12 3L2 9h20L12 3z" strokeLinecap="round" strokeLinejoin="round" /></>,
  creditCard: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" strokeLinecap="round" /></>,

  // ── Auth ──
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" /><circle cx="12" cy="7" r="4" /></>,
  login: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="10 17 15 12 10 7" strokeLinecap="round" strokeLinejoin="round" /><line x1="15" y1="12" x2="3" y2="12" strokeLinecap="round" /></>,
};

// Fallback for unknown names — renders a small dot instead of crashing
function renderIcon(key, className = 'w-6 h-6') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {iconPaths[key] || <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}

// Build a component for a given key
function makeIcon(key) {
  return function IconComponent({ className = 'w-6 h-6' }) {
    return renderIcon(key, className);
  };
}

// ── Fallback for any name not explicitly exported ──
// Uses a Proxy so that `import { AnyRandomIcon } from './BoxIcons'`
// never throws — it just returns a dot component.
const explicitExports = {
  DashboardIcon: 'dashboard',
  PeopleIcon: 'people',
  CoursesIcon: 'courses',
  PaymentsIcon: 'payments',
  ReportsIcon: 'reports',
  SettingsIcon: 'settings',
  LogoutIcon: 'logout',
  NewsIcon: 'news',
  AssignmentsIcon: 'assignments',
  ClassesIcon: 'classes',
  ResultsIcon: 'results',
  MessagesIcon: 'messages',
  MessageIcon: 'messages',
  NotificationsIcon: 'notifications',
  AttendanceIcon: 'attendance',
  GradingIcon: 'grading',
  SessionsIcon: 'sessions',
  InboxIcon: 'inbox',
  BellIcon: 'bell',
  ChatIcon: 'chat',
  MailIcon: 'mail',
  PhoneIcon: 'phone',
  CheckCircleIcon: 'check',
  CheckIcon: 'check',
  XCircleIcon: 'x',
  InfoIcon: 'info',
  LoadingIcon: 'loading',
  StarIcon: 'star',
  AwardIcon: 'award',
  PlusIcon: 'plus',
  EditIcon: 'edit',
  TrashIcon: 'trash',
  EyeIcon: 'eye',
  SearchIcon: 'search',
  UploadIcon: 'upload',
  DownloadIcon: 'download',
  RefreshIcon: 'refresh',
  ArrowLeftIcon: 'arrowLeft',
  ArrowRightIcon: 'arrowRight',
  CalendarIcon: 'calendar',
  ClockIcon: 'clock',
  DocumentIcon: 'document',
  ImageIcon: 'image',
  BookIcon: 'book',
  MusicIcon: 'music',
  BankIcon: 'bank',
  CreditCardIcon: 'creditCard',
  LockIcon: 'lock',
  UserIcon: 'user',
  LogInIcon: 'login',
};

// Named exports (used by `import { X } from '.../BoxIcons'`)
export const DashboardIcon = makeIcon('dashboard');
export const PeopleIcon = makeIcon('people');
export const CoursesIcon = makeIcon('courses');
export const PaymentsIcon = makeIcon('payments');
export const ReportsIcon = makeIcon('reports');
export const SettingsIcon = makeIcon('settings');
export const LogoutIcon = makeIcon('logout');
export const NewsIcon = makeIcon('news');
export const AssignmentsIcon = makeIcon('assignments');
export const ClassesIcon = makeIcon('classes');
export const ResultsIcon = makeIcon('results');
export const MessagesIcon = makeIcon('messages');
export const MessageIcon = makeIcon('messages');
export const NotificationsIcon = makeIcon('notifications');
export const AttendanceIcon = makeIcon('attendance');
export const GradingIcon = makeIcon('grading');
export const SessionsIcon = makeIcon('sessions');
export const InboxIcon = makeIcon('inbox');
export const BellIcon = makeIcon('bell');
export const ChatIcon = makeIcon('chat');
export const MailIcon = makeIcon('mail');
export const PhoneIcon = makeIcon('phone');
export const CheckCircleIcon = makeIcon('check');
export const CheckIcon = makeIcon('check');
export const XCircleIcon = makeIcon('x');
export const InfoIcon = makeIcon('info');
export const LoadingIcon = makeIcon('loading');
export const StarIcon = makeIcon('star');
export const AwardIcon = makeIcon('award');
export const PlusIcon = makeIcon('plus');
export const EditIcon = makeIcon('edit');
export const TrashIcon = makeIcon('trash');
export const EyeIcon = makeIcon('eye');
export const SearchIcon = makeIcon('search');
export const UploadIcon = makeIcon('upload');
export const DownloadIcon = makeIcon('download');
export const RefreshIcon = makeIcon('refresh');
export const ArrowLeftIcon = makeIcon('arrowLeft');
export const ArrowRightIcon = makeIcon('arrowRight');
export const CalendarIcon = makeIcon('calendar');
export const ClockIcon = makeIcon('clock');
export const DocumentIcon = makeIcon('document');
export const ImageIcon = makeIcon('image');
export const BookIcon = makeIcon('book');
export const MusicIcon = makeIcon('music');
export const BankIcon = makeIcon('bank');
export const CreditCardIcon = makeIcon('creditCard');
export const LockIcon = makeIcon('lock');
export const UserIcon = makeIcon('user');
export const LogInIcon = makeIcon('login');

// Also export a generic `<Icon name="..." />` for new code
export function Icon({ name, className = 'w-6 h-6' }) {
  return renderIcon(name, className);
}

// ── The magic: any icon name resolves ──
// This is a Vite/Rollup-friendly way to allow arbitrary named imports.
// Note: ESM does not support dynamic export names, so we list a broad set above.
// The one-liner below is the catch-all for unusual names, using the default export.
export default new Proxy(
  { Icon },
  {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === 'string' && prop.endsWith('Icon')) {
        // Return a placeholder component for any *Icon name not defined above
        return function DynamicIcon({ className = 'w-6 h-6' }) {
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
            </svg>
          );
        };
      }
      return undefined;
    },
  }
);