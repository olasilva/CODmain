import admissionImg from '../assets/IMG-20260710-WA0004.jpg'

export default function ApplyAdmission() {
  return (
    <section className="bg-cod-blue-deep py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 items-center">
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
          <a
            href="#contact"
            className="mt-7 inline-block bg-cod-pink text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
          >
            Enroll now
          </a>
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
