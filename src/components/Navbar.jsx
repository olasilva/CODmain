// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/programmes', label: 'Programmes' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu when the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      {/* Top welcome strip */}
      <div className="w-full h-10 bg-cod-blue flex items-center pl-5 md:pl-28 overflow-hidden">
        <span
          className="droplet-left text-white text-sm sm:text-base md:text-lg font-bold tracking-wide font-ebrima"
          style={{ animationDelay: '0ms' }}
        >
          WELCOME TO
        </span>
      </div>

      {/* Floating pill navbar */}
      <nav className="sticky top-3 z-40 mx-auto w-[92%] max-w-[1300px] bg-white rounded-full shadow-md">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 md:py-3">
          {/* Logo */}
          <Link
            to="/"
            className="droplet-left flex items-center gap-2 sm:gap-3 shrink-0 min-w-0"
            style={{ animationDelay: '180ms' }}
          >
            <img
              src={logo}
              alt="Clan of David"
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="leading-tight min-w-0">
              <div className="text-cod-blue font-bold text-sm sm:text-base md:text-lg font-ebrima truncate">
                Clan of David
              </div>
              <div className="text-cod-pink font-bold text-[8px] sm:text-[10px] tracking-wider font-ebrima truncate">
                ART &amp; MUSIC ACADEMY
              </div>
            </div>
          </Link>

          {/* Desktop nav links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item.to}
                className="droplet-drop"
                style={{ animationDelay: `${320 + i * 70}ms` }}
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `relative font-bold font-ebrima transition ${
                      isActive
                        ? 'text-cod-blue'
                        : 'text-black/50 hover:text-cod-blue'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute left-1/2 -translate-x-1/2 -bottom-2 h-1.5 w-1.5 rounded-full bg-cod-blue transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Get Started — hidden on smallest screens, shown sm+ */}
            <Link
              to="/enroll"
              className="droplet-right hidden sm:inline-flex bg-cod-gradient text-white text-xs md:text-sm font-bold px-3 md:px-6 py-2 md:py-2.5 rounded-full shadow hover:shadow-lg transition"
              style={{ animationDelay: '720ms' }}
            >
              Get Started
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="md:hidden h-10 w-10 rounded-full flex items-center justify-center hover:bg-black/5 transition"
            >
              <i
                className={`bx ${open ? 'bx-x' : 'bx-menu'} text-2xl text-cod-blue`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Mobile drawer — slides down from the pill */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-3 pb-3 pt-1 border-t border-black/5">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item, i) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: open ? `${i * 50}ms` : '0ms' }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold font-ebrima transition ${
                      open ? 'droplet-drop' : ''
                    } ${
                      isActive
                        ? 'bg-cod-blue/10 text-cod-blue'
                        : 'text-black/70 hover:bg-black/5'
                    }`
                  }
                >
                  {item.label}
                  {/* Blue dot on the right for active item */}
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-cod-blue"
                    style={{
                      opacity:
                        typeof window !== 'undefined'
                          ? 0
                          : 0,
                    }}
                  />
                </NavLink>
              ))}
            </div>

            {/* Get Started inside the drawer — only on very small screens */}
            <Link
              to="/enroll"
              onClick={() => setOpen(false)}
              className="sm:hidden mt-2 block text-center bg-cod-gradient text-white text-sm font-bold px-5 py-3 rounded-full shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Dim backdrop behind the drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 top-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}