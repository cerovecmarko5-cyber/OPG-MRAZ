'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  product?: string;
  created_at: string;
}

function Stars({ rating, interactive = false, onChange }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive && onChange ? () => onChange(i) : undefined}
          onMouseEnter={interactive ? () => setHovered(i) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <svg
            className={`w-5 h-5 ${(hovered || rating) >= i ? 'text-amber-400' : 'text-slate-300'} transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, text: '', product: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.ok ? r.json() : [])
      .then(setReviews);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating < 1) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', rating: 5, text: '', product: '' });
      setTimeout(() => { setShowForm(false); setStatus('idle'); }, 3000);
    } catch {
      setStatus('error');
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recenzije kupaca</h2>
            {avgRating && reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <Stars rating={Math.round(Number(avgRating))} />
                <span className="text-slate-600 text-sm">{avgRating} od 5 ({reviews.length} recenzija)</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowForm(f => !f)}
            className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition"
          >
            {showForm ? 'Zatvori' : '+ Napišite recenziju'}
          </button>
        </div>

        {/* Submit form */}
        {showForm && (
          <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-6 mb-8 space-y-4">
            <h3 className="font-semibold text-slate-900">Vaše iskustvo</h3>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Ocjena *</label>
              <Stars rating={form.rating} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Vaše ime *</label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ime i prezime"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/30"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Proizvod (opcionalno)</label>
                <input
                  type="text"
                  maxLength={80}
                  value={form.product}
                  onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                  placeholder="npr. Višnjevac 0.7L"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/30"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Recenzija *</label>
              <textarea
                required
                maxLength={500}
                rows={3}
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                placeholder="Opišite vaše iskustvo s proizvodom..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/30 resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">{form.text.length}/500</p>
            </div>
            {status === 'success' && (
              <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
                Hvala na recenziji! Bit će objavljena nakon provjere.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">
                Greška pri slanju. Pokušajte ponovno.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full sm:w-auto px-8 py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
            >
              {status === 'sending' ? 'Šalje se...' : 'Pošalji recenziju'}
            </button>
          </form>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-4xl mb-3">⭐</p>
            <p>Budite prvi koji će ostaviti recenziju!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-slate-400">
                    {new Date(r.created_at).toLocaleDateString('hr-HR')}
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{r.name}</p>
                  {r.product && <p className="text-xs text-slate-400">{r.product}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
