import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpg'

const navLinks = [
  { label: 'Home', to: '/#home' },
  { label: 'About', to: '/#about' },
  { label: 'Programmes', to: '/#programmes' },
  { label: 'News', to: '/#news' },
  { label: 'Contact', to: '/#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const id = location.hash.replace('#', '')
    const target = document.getElementById(id)

    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [location])

  return (
    <header className="relative z-30">
      <div className="bg-cod-blue-dark text-white text-xs md:text-sm tracking-wide text-center py-2 font-medium">
        WELCOME TO
      </div>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
          <Link to="/#home" className="flex items-center gap-3 animate-slideInLeft">
            <img
              src={logo}
              alt="Clan of David Art & Music Academy logo"
              className="w-11 h-11 rounded-full object-contain shrink-0"
            />
            <div className="leading-tight">
              <p className="font-display font-bold text-cod-blue-dark text-base md:text-lg">Clan of David</p>
              <p className="text-[10px] md:text-xs tracking-[0.2em] text-cod-pink font-semibold">ART &amp; MUSIC ACADEMY</p>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-700">
            {navLinks.map((link, i) => (
              <li key={link.label} className="animate-slideDown" style={{ animationDelay: `${i * 50}ms` }}>
                <Link to={link.to} className="hover:text-cod-blue transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="hidden md:inline-block bg-cod-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md hover:opacity-90 transition-opacity animate-slideInRight"
            >
              Get Started
            </button>

            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Menu</span>
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-cod-blue-dark"></span>
                <span className="block w-5 h-0.5 bg-cod-blue-dark"></span>
                <span className="block w-5 h-0.5 bg-cod-blue-dark"></span>
              </div>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <ul className="flex flex-col px-5 py-4 gap-4 font-medium text-sm text-slate-700">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate('/login')
                  }}
                  className="inline-block bg-cod-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-full"
                >
                  Get Started
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
