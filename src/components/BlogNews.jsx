import concertImg from '../assets/IMG-20260710-WA0006.jpg'
import readingImg from '../assets/IMG-20260709-WA0055.jpg'
import pianoMasterclassImg from '../assets/IMG-20260710-WA0009.jpg'

const posts = [
  {
    date: '15 June, 2026',
    title: 'End-of-Term Concert; A Night of Musical Brilliance',
    image: concertImg,
    alt: 'Students performing guitar at the end-of-term concert',
  },
  {
    date: '10 June, 2026',
    title: 'New Reading Programme Launches for Term 3',
    image: readingImg,
    alt: 'Student practicing reading and handwriting in class',
  },
  {
    date: '2 June, 2026',
    title: 'Enrolment Open for Piano Masterclass Series',
    image: pianoMasterclassImg,
    alt: 'Tutor guiding a student through a piano masterclass',
  },
]

export default function BlogNews() {
  return (
    <section id="news" className="bg-cod-lavender/40 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-cod-blue-dark text-center mb-12 animate-slideDown">
          Latest Blog &amp; News
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <article key={p.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
              <img src={p.image} alt={p.alt} className="w-full h-48 object-cover" />
              <div className="p-6">
                <p className="text-xs font-semibold text-cod-pink mb-2">{p.date}</p>
                <h3 className="font-display font-semibold text-base text-cod-blue-dark leading-snug">
                  {p.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
