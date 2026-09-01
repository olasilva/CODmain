import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'NAVIGATION',
    links: [
      { label: 'HOME', to: '/#home' },
      { label: 'PROGRAMMES', to: '/#programmes' },
      { label: 'ABOUT', to: '/#about' },
      { label: 'NEWS', to: '/#news' },
      { label: 'CONTACT', to: '/#contact' },
    ],
  },
  {
    title: 'SUPPORT',
    links: ['HELP CENTER', 'FAQS', 'LIVE CHAT'],
  },
  {
    title: 'SOCIALS',
    links: ['X', 'INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'],
  },
  {
    title: 'TERMS',
    links: ['PRIVACY', 'TERMS OF SERVICE', 'REFUND POLICY', 'DISCLAIMER'],
  },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-cod-navy text-white/80">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col, i) => (
          <div key={col.title} className="animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
            <p className="text-[11px] font-semibold tracking-widest text-white/50 mb-4">
              {col.title}
            </p>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50 animate-fadeIn" style={{ animationDelay: "400ms" }}>
        © 2026 Clan of David Academy. All rights reserved.
      </div>
    </footer>
  )
}
