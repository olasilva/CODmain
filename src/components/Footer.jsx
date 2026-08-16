import { Link } from "react-router-dom";

const columns = [
  {
    title: "Navigation",
    links: [
      { label: "Home", to: "/" },
      { label: "Programmes", to: "/programmes" },
      { label: "About", to: "/about" },
      { label: "News", to: "/news" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/contact" },
      { label: "FAQs", to: "/contact" },
      { label: "Live Chat", to: "/contact" },
    ],
  },
  {
    title: "Socials",
    // external — update these hrefs to your real profiles
    links: [
      { label: "X", href: "https://x.com" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "TikTok", href: "https://tiktok.com" },
    ],
  },
  {
    title: "Terms",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Refund Policy", to: "/refund-policy" },
      { label: "Disclaimer", to: "/disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-cod-blue-dark text-blue-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <span className="inline-block rounded-lg bg-cod-blue text-white text-xs font-bold tracking-wider uppercase px-4 py-2 mb-5">
              {col.title}
            </span>
            <ul className="space-y-3 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link className="hover:text-white transition-colors uppercase tracking-wide" to={link.to}>
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      className="hover:text-white transition-colors uppercase tracking-wide"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-blue-200">
        © {new Date().getFullYear()} Clan of David Academy. All rights reserved.
      </div>
    </footer>
  );
}
