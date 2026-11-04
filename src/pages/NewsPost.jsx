// src/pages/NewsPost.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  addNewsComment,
  getNewsEngagement,
  getNewsPost,
  recordNewsShare,
  toggleNewsLike,
} from '../lib/api';

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80';

export default function NewsPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [engagement, setEngagement] = useState(null);
  const [commenterName, setCommenterName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getNewsPost(slug);
        // Handle either a raw post or a wrapped one
        const data = res?.data && !res.id ? res.data : res;
        if (!cancelled) {
          setPost(data || null);
          setEngagement(data ? getNewsEngagement(slug, data) : null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load post');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleLike = () => {
    if (!post) return;
    setEngagement(toggleNewsLike(slug, post));
  };

  const handleComment = (event) => {
    event.preventDefault();
    setCommentError('');
    try {
      const next = addNewsComment(
        slug,
        { name: commenterName, text: commentText },
        post
      );
      setEngagement(next);
      setCommentText('');
    } catch (err) {
      setCommentError(err.message);
    }
  };

  const handleShare = async () => {
    const shareData = { title: post.title, text: post.excerpt || post.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage('Link copied to clipboard.');
      }
      setEngagement(recordNewsShare(slug, post));
    } catch (err) {
      if (err.name !== 'AbortError') setShareMessage('Unable to share this post. Please copy the page URL.');
    }
  };

  return (
    <div className="bg-cod-bg min-h-screen">
      <Navbar />

      <article className="max-w-3xl mx-auto px-5 md:px-8 py-14">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-cod-blue font-semibold text-sm mb-8 hover:gap-3 transition-all"
        >
          ← Back to all news
        </Link>

        {loading && <p className="text-slate-500">Loading post…</p>}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {!loading && !post && !error && (
          <div className="text-center py-16">
            <p className="text-lg font-bold text-black/70 mb-2">Post not found</p>
            <Link to="/news" className="text-cod-blue font-semibold">
              ← Back to all news
            </Link>
          </div>
        )}

        {post && (
          <>
            {post.category && (
              <span className="inline-block mb-4 px-3 py-1 bg-cod-blue/10 text-cod-blue rounded-full text-xs font-bold uppercase tracking-wide">
                {post.category}
              </span>
            )}

            <h1 className="font-display font-bold text-3xl md:text-5xl text-cod-blue-dark leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
              {post.author && <span>By {post.author}</span>}
              {(post.published_at || post.created_at) && (
                <span>
                  {new Date(post.published_at || post.created_at).toLocaleDateString(
                    'en-NG',
                    { day: 'numeric', month: 'long', year: 'numeric' }
                  )}
                </span>
              )}
              {post.read_time && <span>{post.read_time}</span>}
            </div>

            <img
              src={post.cover_image_url || FALLBACK_COVER}
              alt={post.title}
              className="w-full rounded-2xl mb-10 shadow-lg"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_COVER;
              }}
            />

            {post.excerpt && (
              <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6 border-l-4 border-cod-pink pl-5">
                {post.excerpt}
              </p>
            )}

            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {engagement && (
              <section className="mt-12 border-y border-black/10 py-8" aria-label="Post engagement">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleLike}
                    aria-pressed={engagement.liked}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
                      engagement.liked
                        ? 'bg-cod-pink text-white'
                        : 'bg-cod-blue/10 text-cod-blue hover:bg-cod-blue/20'
                    }`}
                  >
                    <i className={`bx ${engagement.liked ? 'bxs-heart' : 'bx-heart'} text-lg`} aria-hidden="true" />
                    {engagement.liked ? 'Liked' : 'Like'} ({engagement.likes})
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-full bg-cod-blue/10 px-5 py-3 text-sm font-bold text-cod-blue transition hover:bg-cod-blue/20"
                  >
                    <i className="bx bx-share-alt text-lg" aria-hidden="true" />
                    Share ({engagement.shares})
                  </button>
                </div>
                {shareMessage && <p className="mt-3 text-sm text-slate-600">{shareMessage}</p>}

                <div className="mt-8">
                  <h2 className="font-display text-2xl font-bold text-cod-blue-dark">
                    Comments ({engagement.comments.length})
                  </h2>
                  <form onSubmit={handleComment} className="mt-4 space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Your name
                      <input
                        value={commenterName}
                        onChange={(event) => setCommenterName(event.target.value)}
                        maxLength={80}
                        required
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-cod-blue"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Comment
                      <textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        maxLength={1000}
                        rows={4}
                        required
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-cod-blue"
                      />
                    </label>
                    {commentError && <p className="text-sm text-red-600">{commentError}</p>}
                    <button type="submit" className="rounded-full bg-cod-blue px-5 py-3 text-sm font-bold text-white hover:brightness-110">
                      Post comment
                    </button>
                  </form>

                  <div className="mt-8 space-y-4">
                    {engagement.comments.length === 0 && (
                      <p className="text-sm text-slate-500">Be the first to comment.</p>
                    )}
                    {engagement.comments.map((comment) => (
                      <article key={comment.id} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-bold text-cod-blue-dark">{comment.name}</p>
                          {comment.created_at && (
                            <time className="text-xs text-slate-500">
                              {new Date(comment.created_at).toLocaleDateString('en-NG')}
                            </time>
                          )}
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{comment.text}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-black/10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {post.link_url && (
              <div className="mt-10 p-5 bg-cod-blue/5 rounded-2xl border border-cod-blue/20">
                <p className="text-sm text-slate-600 mb-3">
                  This story continues on an external site:
                </p>
                <a
                  href={post.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-cod-blue text-white font-bold px-6 py-3 rounded-full hover:brightness-110 transition"
                >
                  Read the full story →
                </a>
              </div>
            )}
          </>
        )}
      </article>

      <Footer />
    </div>
  );
}