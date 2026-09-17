// src/components/AboutSection.jsx
export default function AboutSection() {
  return (
    <section className="bg-cod-bg py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="rounded-3xl bg-cod-blue-deep/70 backdrop-blur-md p-8 md:p-12 grid md:grid-cols-[280px_1fr] gap-10 items-center">
          <div className="flex justify-center">
            <img
              src="https://placehold.co/280x320/1A73E8/ffffff?text=Clan+of+David"
              alt="About Clan of David"
              className="w-full max-w-[280px] rounded-2xl shadow-lg object-cover"
            />
          </div>
          <div className="text-white space-y-4 text-base md:text-lg leading-relaxed">
            <p>
              Clan of David is a distinguished academy dedicated to discovering,
              developing, and nurturing young talents.
            </p>
            <p>
              We are widely recognized for our outstanding Early Years programs,
              which combine musical skills training, art and creativity, a
              vibrant educational foundation, and strong character formation
              rooted in godly values.
            </p>
            <p>
              As an institution that blends academic excellence with skill
              development in one holistic environment, we are committed to
              total inclusiveness in skills development at the primary
              education level, making learning fun, practical, and inspiring.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}