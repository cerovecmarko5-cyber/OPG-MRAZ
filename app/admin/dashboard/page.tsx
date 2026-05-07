'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    const res = await fetch('/api/posts', { method: 'POST', body: formData });

    if (res.ok) {
      setTitle('');
      setContent('');
      setImage(null);
      setPreview(null);
      setShowForm(false);
      if (fileRef.current) fileRef.current.value = '';
      fetchPosts();
    }

    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Obrisati ovu objavu?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-red-700 text-white px-4 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">Admin panel — OPG Mraz</h1>
        <button onClick={handleLogout} className="text-sm bg-white/20 px-4 py-1.5 rounded-full hover:bg-white/30 transition">
          Odjava
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Nova objava gumb */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition text-center"
          >
            + Nova objava
          </button>
        )}

        {/* Forma za novu objavu */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 mb-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Nova objava</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Naslov</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="npr. Akcija na šljivovicu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tekst</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Napišite obavijest, akciju ili vijest..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slika (neobavezno)</label>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleImageChange}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-red-50 file:text-red-700 file:font-semibold hover:file:bg-red-100"
              />
              {preview && (
                <img src={preview} alt="Pregled" className="mt-3 rounded-xl max-h-48 object-cover w-full" />
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-red-700 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-60"
              >
                {submitting ? 'Objavljujem...' : 'Objavi'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setPreview(null); }}
                className="flex-1 bg-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Odustani
              </button>
            </div>
          </form>
        )}

        {/* Lista objava */}
        <h2 className="text-base font-semibold text-slate-700 mb-3">Sve objave ({posts.length})</h2>

        {loading ? (
          <p className="text-slate-500 text-center py-8">Učitavam...</p>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400">
            Još nema objava. Dodajte prvu!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{post.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {new Date(post.created_at).toLocaleDateString('hr-HR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{post.content}</p>
                  </div>
                  {post.image_url && (
                    <img src={post.image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Obriši objavu
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
