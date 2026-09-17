// src/components/BlogNews.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNews } from '../lib/api'

export default function BlogNews() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getNews()
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res) ? res : res?.posts || res?.news || []
        // Only published posts
        const published = list.filter((p) => p.is_published !== false)
        setPosts(published.slice(0, 3))
      })
      .catch(() => {
        if (!cancelled) setPosts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="bg-cod-bg py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-cod-blue-dark text-center mb-12">
          Latest Blog &amp; News
        </h2>

        {loading && (
          <p className="text-center text-slate-500">Loading posts…</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-center text-slate-500">
            No news yet. Check back soon.
          </p>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((p, i) => {
              const cover =
                p.cover_image_url ||
                p.image_url ||
                `https://placehold.co/330x420/1A73E8/ffffff?text=${encodeURIComponent(
                  (p.title || 'News').slice(0, 12)
                )}`
              const date = p.published_at || p.created_at || p.date

              return (
                <Link
                  key={p.id}
                  to={`/news/${p.slug || p.id}`}
                  className="group rounded-3xl bg-white overflow-hidden border border-cod-blue/10 hover:shadow-lg transition-shadow animate-scaleIn"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[330/420] bg-slate-100 overflow-hidden">
                    <img
                      src={cover}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://placehold.co/330x420/e8f0fb/1A73E8?text=News'
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-slate-500 mb-2">
                      {date
                        ? new Date(date).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : ''}
                    </p>
                    <h3 className="font-display font-semibold text-cod-blue-dark leading-snug line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-cod-blue font-semibold hover:text-cod-pink transition-colors"
            >
              View all news
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}