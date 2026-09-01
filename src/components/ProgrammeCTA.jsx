// src/components/ProgrammeCTA.jsx
import { useNavigate } from 'react-router-dom'

export default function ProgrammeCTA({ heading, subtext }) {
  const navigate = useNavigate()

  const handleEnrollClick = () => {
    navigate('/enroll')
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cod-blue-deep via-cod-blue to-cod-blue p-10 md:p-12 text-center">
      <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
      <div className="absolute -left-10 -bottom-10 w-56 h-56 rounded-full bg-white/5" />
      
      <div className="relative">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {heading}
        </h3>
        <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
          {subtext}
        </p>
        <button
          onClick={handleEnrollClick}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-cod-blue font-bold rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          <span>Enroll Now</span>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}