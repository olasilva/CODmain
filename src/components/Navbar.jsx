// src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'

export default function Navbar() {
  return (
    <>
      {/* Top welcome strip */}
      <div className="w-full h-10 bg-cod-blue flex items-center pl-28">
        <span className="text-white text-lg font-bold tracking-wide font-ebrima">
          WELCOME TO
        </span>
      </div>

      {/* Floating pill navbar */}
      <nav className="sticky top-3 z-40 mx-auto w-[92%] max-w-[1300px] bg-white rounded-full shadow-md">
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="Clan of David"
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="leading-tight">
              <div className="text-cod-blue font-bold text-lg font-ebrima">
                Clan of David
              </div>
              <div className="text-cod-pink font-bold text-[10px] tracking-wider font-ebrima">
                ART &amp; MUSIC ACADEMY
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-cod-blue font-bold font-ebrima hover:opacity-80">
              Home
            </Link>
            <Link to="/about" className="text-black/50 font-bold font-ebrima hover:text-cod-blue transition">
              About
            </Link>
            <Link to="/programmes" className="text-black/50 font-bold font-ebrima hover:text-cod-blue transition">
              Programmes
            </Link>
            <Link to="/news" className="text-black/50 font-bold font-ebrima hover:text-cod-blue transition">
              News
            </Link>
            <Link to="/contact" className="text-black/50 font-bold font-ebrima hover:text-cod-blue transition">
              Contact
            </Link>
          </div>

          <Link
            to="/enroll"
            className="bg-cod-gradient text-white text-sm font-bold px-6 py-2.5 rounded-full shadow hover:shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </>
  )
}