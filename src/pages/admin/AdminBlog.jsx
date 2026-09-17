// src/pages/admin/AdminBlog.jsx
import { useState, useRef } from 'react';
import {
  getAdminNews,
  createAdminNews,
  updateAdminNews,
  deleteAdminNews,
  uploadBlogCover,
} from '../../lib/api';
import useFetch from '../../lib/useFetch';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  author: '',
  category: '',
  tags: '',
  read_time: '',
  link_url: '',
  is_published: true,
};

const CATEGORY_OPTIONS = [
  'Academics',
  'Music',
  'Events',
  'Achievements',
  'Announcements',
  'Admissions',
];

export default function AdminBlog() {
  const { data, loading, error, refetch } = useFetch(getAdminNews, [], {
    initialData: { posts: [] },
  });
  const posts = data?.posts || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [coverMode, setCoverMode] = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setCoverMode('upload');
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditing(post);
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image_url: post.cover_image_url || '',
      author: post.author || '',
      category: post.category || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      read_time: post.read_time || '',
      link_url: post.link_url || '',
      is_published: post.is_published !== false,
    });
    setFormError('');
    setCoverMode(post.cover_image_url ? 'url' : 'upload');
    setModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteAdminNews(id);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Cover image must be under 5 MB');
      return;
    }

    setUploading(true);
    setFormError('');
    try {
      const url = await uploadBlogCover(file);
      setForm((f) => ({ ...f, cover_image_url: url }));
    } catch (err) {
      setFormError(err.message || 'Failed to upload cover');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (editing) {
        await updateAdminNews(editing.id, payload);
      } else {
        await createAdminNews(payload);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const update = (field) => (e) => {
    const value = field === 'is_published' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const wordCount = (form.content || '').trim().split(/\s+/).filter(Boolean).length;
  const autoReadTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-black font-ebrima">
            Blog &amp; News
          </h1>
          <p className="text-sm text-black/50 mt-1">
            {posts.length} post{posts.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-3 bg-[#1A73E8] text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Post
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-black/10">
              <tr>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Post</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Category</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Author</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Status</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Published</th>
                <th className="text-right py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-black/50">Loading posts…</td>
                </tr>
              )}
              {!loading && posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-black/50">
                    No posts yet. Click "New Post" to create one.
                  </td>
                </tr>
              )}
              {!loading &&
                posts.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-black/5 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        {p.cover_image_url ? (
                          <img
                            src={p.cover_image_url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#1A73E8] font-bold">
                            📰
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-black text-sm truncate">{p.title}</div>
                          <div className="text-xs text-black/50 line-clamp-1">
                            {p.excerpt || (p.content || '').slice(0, 60)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-sm text-black/70">{p.category || '—'}</td>
                    <td className="py-3 px-5 text-sm text-black/70">{p.author || '—'}</td>
                    <td className="py-3 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.is_published === false
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {p.is_published === false ? 'Draft' : 'Published'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-xs text-black/60">
                      {p.published_at || p.created_at
                        ? new Date(p.published_at || p.created_at).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="px-3 py-1.5 text-xs font-bold text-[#1A73E8] hover:bg-blue-50 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-xl font-bold text-black">
                {editing ? 'Edit Post' : 'New Post'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-black/40 hover:text-black text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cover image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-black/70 uppercase">
                    Cover Image
                  </label>
                  <div className="flex items-center bg-[#F3F4F6] rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setCoverMode('upload')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                        coverMode === 'upload'
                          ? 'bg-white text-[#1A73E8] shadow-sm'
                          : 'text-black/50'
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverMode('url')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                        coverMode === 'url'
                          ? 'bg-white text-[#1A73E8] shadow-sm'
                          : 'text-black/50'
                      }`}
                    >
                      Paste URL
                    </button>
                  </div>
                </div>

                {coverMode === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleCoverUpload}
                      className="hidden"
                      id="blog-cover-upload"
                    />
                    <label
                      htmlFor="blog-cover-upload"
                      className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                        uploading
                          ? 'border-blue-300 bg-blue-50/40'
                          : 'border-black/15 hover:border-[#1A73E8] hover:bg-blue-50/30'
                      }`}
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-black/60">Uploading…</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1A73E8] flex items-center justify-center">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                              <polyline points="7 9 12 4 17 9" strokeLinecap="round" strokeLinejoin="round" />
                              <line x1="12" y1="4" x2="12" y2="16" strokeLinecap="round" />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-black/70">
                            Click to upload cover image
                          </span>
                          <span className="text-xs text-black/40">
                            JPG, PNG, WEBP · max 5 MB
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <input
                    value={form.cover_image_url}
                    onChange={update('cover_image_url')}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                  />
                )}

                {form.cover_image_url && (
                  <div className="mt-3 relative">
                    <img
                      src={form.cover_image_url}
                      alt="Cover preview"
                      className="w-full rounded-xl max-h-52 object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, cover_image_url: '' }))}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white text-sm font-bold hover:bg-black"
                      title="Remove cover"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                  Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={update('title')}
                  placeholder="Give your post a title…"
                  className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                />
              </div>

              {/* Two-column row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={update('category')}
                    className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm bg-white"
                  >
                    <option value="">Select…</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                    Author
                  </label>
                  <input
                    value={form.author}
                    onChange={update('author')}
                    placeholder="e.g. Admin"
                    className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                    Read Time
                  </label>
                  <input
                    value={form.read_time}
                    onChange={update('read_time')}
                    placeholder={`${autoReadTime} min read`}
                    className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                  Tags (comma-separated)
                </label>
                <input
                  value={form.tags}
                  onChange={update('tags')}
                  placeholder="e.g. piano, recital, students"
                  className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                />
                {form.tags && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 bg-blue-50 text-[#1A73E8] rounded-full text-xs font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* External link */}
              <div>
                <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                  External Link (optional)
                </label>
                <input
                  value={form.link_url}
                  onChange={update('link_url')}
                  placeholder="https://example.com/full-story"
                  className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                />
                <p className="text-xs text-black/40 mt-1">
                  If set, "Read more" on the public post will link here instead of the internal page.
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                  Excerpt (short summary)
                </label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={update('excerpt')}
                  placeholder="A one or two sentence summary that appears on the card…"
                  className="w-full px-4 py-3 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-black/70 uppercase">
                    Content
                  </label>
                  <span className="text-xs text-black/40">
                    {wordCount} word{wordCount === 1 ? '' : 's'} · ~{autoReadTime} min read
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={form.content}
                  onChange={update('content')}
                  placeholder="Write your full post here…"
                  className="w-full px-4 py-3 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm font-mono"
                />
              </div>

              {/* Publish toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={update('is_published')}
                  className="h-4 w-4 accent-[#1A73E8]"
                />
                <span className="text-sm font-bold text-black/70">
                  Publish immediately (uncheck to save as draft)
                </span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 h-11 border border-black/15 rounded-xl font-bold text-sm text-black/60 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 h-11 bg-[#1A73E8] text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}