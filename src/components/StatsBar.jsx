// src/components/StatsBar.jsx
const stats = [
  { value: '1200+', label: 'Students Enrolled' },
  { value: '98%', label: 'Parent Satisfaction' },
  { value: '7', label: 'Years of Excellence' },
]

export default function StatsBar() {
  return (
    <section className="bg-cod-blue">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-3 gap-4 text-center">
        {stats.map((s, i) => (
          <div key={s.label} className="animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
            <p className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
              {s.value}
            </p>
            <p className="text-white/80 text-xs sm:text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}