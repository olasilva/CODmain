import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { posts, formatDate } from "../data/news";
import { ArrowLeftIcon } from "../components/Icons";

export default function NewsPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/news" replace />;

  return (
    <div className="min-h-screen bg-cod-bg">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
        <Link
          to="/news"
          className="focus-ring inline-flex items-center gap-1.5 text-cod-blue font-semibold text-sm mb-6 hover:text-cod-blue-dark transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to News
        </Link>

        <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-8 animate-fadeUp">
          {post.image ? (
            <img src={post.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-cod-blue via-cyan-500 to-emerald-400" />
          )}
          <span className="absolute top-5 left-5 rounded-full bg-cod-blue-dark/90 text-white text-xs font-semibold px-3 py-1.5">
            {post.category}
          </span>
        </div>

        <p className="text-slate-400 text-sm font-medium mb-2 animate-fadeUp">{formatDate(post.date)}</p>
        <h1 className="text-slate-800 text-2xl md:text-3xl font-bold mb-6 animate-fadeUp">{post.title}</h1>

        {/*
          Full article body goes here. Add a `body` field (array of
          paragraphs, or markdown/HTML string) to the post object in
          src/data/news.js and render it below.
        */}
        <p className="text-slate-600 leading-relaxed animate-fadeUp">{post.excerpt}</p>
      </div>

      <Footer />
    </div>
  );
}
