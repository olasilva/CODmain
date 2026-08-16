import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { MenuIcon, CloseIcon } from "./Icons";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programmes", label: "Programmes" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <Link to="/" className="focus-ring flex items-center gap-3 shrink-0">
          <Logo className="h-11 w-11" />
          <span className="leading-tight">
            <span className="block bg-gradient-to-r from-cod-blue to-cod-pink bg-clip-text text-transparent font-bold text-lg">
              Clan of David
            </span>
            <span className="block text-slate-500 text-[11px] font-semibold tracking-wider">
              ART &amp; MUSIC ACADEMY
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `focus-ring text-sm font-semibold transition-colors ${
                  isActive ? "text-cod-blue" : "text-slate-600 hover:text-cod-blue"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admission"
            className="focus-ring rounded-full bg-cod-btn text-white text-sm font-semibold px-6 py-2.5 shadow-sm
                       transition-all duration-200 hover:shadow-md hover:brightness-105 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </nav>

        <button
          className="focus-ring md:hidden p-2 text-slate-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-4 animate-fadeIn">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-cod-blue" : "text-slate-600"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admission"
            onClick={() => setOpen(false)}
            className="rounded-full bg-cod-btn text-white text-sm font-semibold px-5 py-2.5 text-center shadow-sm"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
