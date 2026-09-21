// src/pages/News.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getNews } from '../lib/api';

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80';

// Map DB category to display label + color
const CATEGORY_LABEL = {
  announcement: 'Announcement',
  event: 'Event',
  news: 'News',
  blog: 'Blog',
};

const CATEGORY_COLOR = {
  announcement: 'bg-yellow-100 text-yellow-700',
  event: 'bg-pink-100 text-pink-700',
  news: 'bg-blue-100 text-blue-700',
  blog: 'bg-green-100 text-green-700',
};

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getNews();

        // Handle every possible response shape
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.posts)) list = res.posts;

        // Only published (treat null as published)
        const published = list.filter(
          (p) =>
            p.is_published === true ||
            p.is_published === null ||
            p.is_published === undefined
        );

        if (!cancelled) setPosts(published);
      } catch (err) {
        console.error('❌ Failed to load news:', err);
        if (!cancelled) setError(err.message || 'Failed to load news');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = ['all', 'news', 'event', 'announcement', 'blog'];
  const filtered =
    activeCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-cod-bg min-h-screen">
      <Navbar />

      {/* Banner */}
      <section className="relative w-full py-16 md:py-20 bg-cod-blue-deep">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h1 className="font-display font-bold text-white text-3xl md:text-5xl mb-3">
            News &amp; Blog
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            The latest updates, events, and stories from Clan of David Art and Music Academy.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                activeCategory === cat
                  ? 'bg-cod-blue text-white'
                  : 'bg-white border border-cod-blue/20 text-black/60 hover:border-cod-blue'
              }`}
            >
              {cat === 'all' ? 'All Posts' : CATEGORY_LABEL[cat] || cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        {loading && (
          <p className="text-center text-slate-500 py-10">Loading posts…</p>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-bold text-black/70 mb-1">
              {activeCategory === 'all'
                ? 'No posts published yet'
                : `No ${CATEGORY_LABEL[activeCategory] || activeCategory} posts yet`}
            </p>
            <p className="text-sm text-black/50">
              Check back soon for updates from the academy.
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => {
              const cover =
                p.cover_image_url || p.image_url || FALLBACK_COVER;
              const date = p.published_at || p.created_at || p.date;
              const categoryLabel = CATEGORY_LABEL[p.category] || null;
              const categoryColor =
                CATEGORY_COLOR[p.category] || 'bg-slate-100 text-slate-600';

              return (
                <Link
                  key={p.id}
                  to={`/news/${p.slug || p.id}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-cod-blue/10 hover:shadow-xl transition-shadow flex flex-col"
                >
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={cover}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_COVER;
                      }}
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {categoryLabel && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${categoryColor}`}
                        >
                          {categoryLabel}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {date
                          ? new Date(date).toLocaleDateString('en-NG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-lg text-cod-blue-dark leading-snug mb-2 line-clamp-2">
                      {p.title}
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
                      {p.excerpt || (p.content || '').slice(0, 140)}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-cod-blue group-hover:gap-2 transition-all">
                      Read more
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}