// src/components/StatsBar.jsx
import CountUp from './CountUp';

const stats = [
  { end: 1200, suffix: '+', label: 'Students Enrolled', duration: 3600 },
  { end: 98,   suffix: '%', label: 'Parent Satisfaction', duration: 3000 },
  { end: 7,    suffix: '',  label: 'Years of Excellence', duration: 2400 },
];

export default function StatsBar() {
  return (
    <section className="bg-cod-blue">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-3 gap-4 text-center">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="droplet"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
              <CountUp
                end={s.end}
                suffix={s.suffix}
                duration={s.duration}
                delay={i * 100 + 400}
              />
            </p>
            <p className="text-white/80 text-xs sm:text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}