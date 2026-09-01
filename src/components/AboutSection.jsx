import aboutImg from '../assets/IMG-20260710-WA0002.jpg'

export default function AboutSection() {
  return (
    <section id="about" className="relative">
      <img
        src={aboutImg}
        alt="Students learning keyboard together at Clan of David Music"
        className="w-full h-[420px] md:h-[480px] object-cover"
      />

      <div className="absolute inset-0 bg-cod-navy/40" />

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-5 md:px-8 w-full flex justify-end">
          <div className="bg-cod-navy/85 backdrop-blur-sm rounded-2xl p-7 md:p-9 max-w-md text-white shadow-xl animate-slideInRight">
            <p className="text-sm md:text-base leading-relaxed animate-fadeIn" style={{ animationDelay: "150ms" }}>
              Clan of David is a distinguished academy dedicated to
              discovering, developing, and nurturing young talents.
            </p>
            <p className="text-sm md:text-base leading-relaxed mt-4 animate-fadeIn" style={{ animationDelay: "250ms" }}>
              We are widely recognized for our outstanding Early Years
              programs, which combine musical skills training, art and
              creativity, a vibrant educational foundation, and strong
              character formation rooted in godly values.
            </p>
            <p className="text-sm md:text-base leading-relaxed mt-4 animate-fadeIn" style={{ animationDelay: "350ms" }}>
              As an institution that blends academic excellence with skill
              development in one holistic environment, we are committed to
              total inclusiveness in skills development at the primary
              education level, making learning fun, practical, and
              inspiring.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
