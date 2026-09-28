// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import Stagger from './Stagger';

const columns = [
  {
    title: 'NAVIGATION',
    links: [
      { label: 'HOME', to: '/' },
      { label: 'PROGRAMMES', to: '/programmes' },
      { label: 'ABOUT', to: '/about' },
      { label: 'NEWS', to: '/news' },
      { label: 'CONTACT', to: '/contact' },
    ],
  },
  {
    title: 'SUPPORT',
    links: [
      { label: 'HELP CENTER', to: '/contact' },
      { label: 'FAQS', to: '/contact' },
      { label: 'LIVE CHAT', to: '/contact' },
    ],
  },
  {
    title: 'SOCIALS',
    links: [
      {
        label: 'FACEBOOK',
        href: 'https://www.facebook.com/Clanofdavidmusicschool?mibextid=rS40aB7S9Ucbxw6v',
      },
      {
        label: 'INSTAGRAM',
        href: 'https://www.instagram.com/clanofdavidmusicschool?utm_source=qr&igsi=MXMyYzQ2MTBjZWRveg==',
      },
      {
        label: 'YOUTUBE',
        href: 'https://youtube.com/@clanofdavidmusicschool7247?si=FCqCz4VJa2_u0cig',
      },
    ],
  },
  {
    title: 'TERMS',
    links: [
      { label: 'PRIVACY', to: '/terms' },
      { label: 'TERMS OF SERVICE', to: '/terms' },
      { label: 'REFUND POLICY', to: '/terms' },
      { label: 'DISCLAIMER', to: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-cod-blue-deep text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[240px_1fr] gap-12 mb-12">
          {/* Brand block — slides in from left */}
          <div className="droplet-left flex md:flex-col items-start gap-4">
            <img
              src={logo}
              alt="Clan of David"
              className="w-14 h-14 rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <p className="font-display font-bold text-lg">Clan of David</p>
              <p className="text-cod-pink text-xs font-bold tracking-wider">
                ART &amp; MUSIC ACADEMY
              </p>
              <p className="text-white/70 text-xs mt-2 leading-relaxed">
                Building Talent. Inspiring Excellence.
                <br />
                Nurturing Greatness.
              </p>
            </div>
          </div>

          {/* Link columns — each column staggers its own links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {columns.map((col, colIdx) => (
              <div
                key={col.title}
                className="droplet"
                style={{ animationDelay: `${colIdx * 80}ms` }}
              >
                <div className="inline-block bg-cod-blue rounded-lg px-3 py-1.5 mb-4">
                  <span className="text-xs font-bold tracking-wide">
                    {col.title}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  <Stagger
                    as="div"
                    base={colIdx * 80 + 120}
                    step={60}
                    variant="droplet-drop"
                  >
                    {col.links.map((l) => (
                      <li key={l.label}>
                        {l.href ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-white/85 hover:text-cod-pink transition-colors inline-block"
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            to={l.to}
                            className="text-sm text-white/85 hover:text-cod-pink transition-colors inline-block"
                          >
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </Stagger>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact strip — fades up last */}
        <div
          className="droplet border-t border-white/20 pt-6 flex flex-wrap items-center justify-center md:justify-between gap-4 text-sm text-white/70"
          style={{ animationDelay: '480ms' }}
        >
          <span>
            © {new Date().getFullYear()} Clan of David Academy. All rights
            reserved.
          </span>
          <a
            href="tel:+2348128849345"
            className="hover:text-cod-pink transition-colors"
          >
            📞 +234 812 884 9345
          </a>
        </div>
      </div>
    </footer>
  );
}