// src/components/AboutSection.jsx
import { useMemo } from 'react';

const allImages = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
});

const academyPhotos = Object.entries(allImages)
  .filter(([path]) => {
    const name = path.split('/').pop().toLowerCase();
    if (name.includes('logo')) return false;
    if (name.includes('vite')) return false;
    if (name.includes('benglo')) return false;
    return true;
  })
  .map(([, src]) => src);

const FALLBACK = allImages['../assets/logo.jpg'] || null;

// Paragraph text — kept in an array so we can stagger the reveal
const PARAGRAPHS = [
  'Clan of David is a distinguished academy dedicated to discovering, developing, and nurturing young talents.',
  'We are widely recognized for our outstanding Early Years programs, which combine musical skills training, art and creativity, a vibrant educational foundation, and strong character formation rooted in godly values.',
  'As an institution that blends academic excellence with skill development in one holistic environment, we are committed to total inclusiveness in skills development at the primary education level, making learning fun, practical, and inspiring.',
];

export default function AboutSection() {
  const photo = useMemo(() => {
    if (!academyPhotos.length) return FALLBACK;
    return academyPhotos[Math.floor(Math.random() * academyPhotos.length)];
  }, []);

  return (
    <section className="bg-cod-bg py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="rounded-3xl bg-cod-blue-deep/70 backdrop-blur-md p-6 md:p-12 grid md:grid-cols-[280px_1fr] gap-8 md:gap-10 items-center">
          {/* ═══════ Image — slides in from left ═══════ */}
          <div
            className="droplet-left flex justify-center"
            style={{ animationDelay: '80ms' }}
          >
            <div className="relative w-full max-w-[280px] aspect-[7/8] rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-cod-blue to-cod-blue-dark">
              {photo ? (
                <img
                  src={photo}
                  alt="Clan of David Academy"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                  <span className="text-lg font-bold">Clan of David</span>
                </div>
              )}
            </div>
          </div>

          {/* ═══════ Text — paragraphs fade in slowly, one after another ═══════ */}
          <div className="text-white space-y-5 text-base md:text-lg leading-relaxed">
            {PARAGRAPHS.map((text, i) => (
              <p
                key={i}
                className="fade-up-slower"
                style={{
                  animationDelay: `${300 + i * 700}ms`,
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}