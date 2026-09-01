import { Link } from 'react-router-dom'

export default function ProgrammeBreadcrumb({ current }) {
  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 flex items-center gap-2 text-sm">
        <Link
          to="/#programmes"
          className="flex items-center gap-1.5 text-cod-blue font-semibold hover:text-cod-pink transition-colors"
        >
          <span aria-hidden="true">←</span>
          Our Programmes
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-cod-blue-dark">{current}</span>
      </div>
    </div>
  )
}
