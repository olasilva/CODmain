import admissionImg from '../assets/IMG-20260710-WA0004.jpg'
import admissionBackground from '../assets/IMG-20260710-WA0009.jpg'
import { Link } from 'react-router-dom'

export default function ApplyAdmission() {
  return (
    <section className="relative isolate overflow-hidden py-16 md:py-20">
      <img
        src={admissionBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-cod-blue-deep/90" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-cod-pink font-semibold tracking-wide text-sm mb-3">
            APPLY FOR ADMISSION
          </p>
          <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-md">
            Clan of David Art and Music Academy is a distinguished academy
            located in Abuja, Nigeria. Our school is known for delivering a
            well-rounded education that equips children with essential music
            skills, nurtures creativity, and builds a strong foundation for
            academic excellence.
          </p>
          <Link
            to="/admission/course-selection"
            className="mt-7 inline-block bg-cod-pink text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
          >
            Enroll now
          </Link>
        </div>

        <img
          src={admissionImg}
          alt="Students proudly holding their violins at Clan of David Art & Music Academy"
          className="w-full aspect-[4/3] object-cover rounded-2xl shadow-lg"
        />
      </div>
    </section>
  )
}
