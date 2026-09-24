// src/pages/admin/components/AdminHeader.jsx
export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-black/5 px-4 sm:px-6 py-3 flex items-center gap-3">
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 text-black/70 transition"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ...rest of your existing header content... */}
    </header>
  );
}