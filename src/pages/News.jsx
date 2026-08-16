import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories, posts, formatDate } from "../data/news";

function PostCard({ post, index }) {
  return (
    <article
      style={{ animationDelay: `${index * 80}ms` }}
      className="opacity-0 animate-fadeUp group rounded-2xl bg-white border border-slate-200 overflow-hidden
                 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // Fallback when no photo has been added yet — see src/data/news.js
          <div className="h-full w-full bg-gradient-to-br from-cod-blue via-cyan-500 to-emerald-400" />
        )}
        <span className="absolute top-4 left-4 rounded-full bg-cod-blue-dark/90 text-white text-xs font-semibold px-3 py-1.5">
          {post.category}
        </span>
      </div>

      <div className="p-6">
        <p className="text-slate-400 text-xs font-medium mb-2">{formatDate(post.date)}</p>
        <h3 className="text-slate-800 font-bold text-lg leading-snug mb-3">{post.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
        <Link
          to={`/news/${post.slug}`}
          className="focus-ring inline-flex items-center gap-1.5 text-cod-blue font-semibold text-sm
                     transition-transform duration-200 group-hover:translate-x-0.5"
        >
          Read More
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

export default function News() {
  const [active, setActive] = useState("All");

  const visible = useMemo(
    () => (active === "All" ? posts : posts.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="min-h-screen bg-cod-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-cod-hero bg-gradient-to-r from-cod-blue-dark via-cod-blue to-cod-pink">
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20 text-center">
          <h1 className="animate-fadeUp text-white text-3xl md:text-5xl font-bold">
            Latest Blog &amp; News
          </h1>
          <p className="animate-fadeUp text-blue-100 mt-4 text-base md:text-lg" style={{ animationDelay: "100ms" }}>
            Stay up to date with the latest from Clan of David Academy
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`focus-ring rounded-full px-5 py-2 text-sm font-semibold border transition-all duration-200 ${
                  isActive
                    ? "bg-cod-btn text-white border-transparent shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-cod-blue/40 hover:text-cod-blue"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Post grid */}
        {visible.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">
              No posts in this category yet — add one in{" "}
              <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">src/data/news.js</code>.
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-12 rounded-3xl bg-cod-hero px-8 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-white text-2xl font-bold mb-1">Stay In The Loop</h2>
            <p className="text-blue-100 text-sm">Subscribe to our newsletter for the latest news and updates.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()} // wire this up to your mailing list provider
            className="flex w-full md:w-auto"
          >
            <button
              type="submit"
              className="focus-ring shrink-0 rounded-full bg-cod-btn text-white font-semibold px-8 py-3 shadow-md
                         transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
