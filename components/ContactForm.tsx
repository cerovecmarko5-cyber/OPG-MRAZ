'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const body = new URLSearchParams();
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('message', formData.message);
      body.append('_subject', `Upit od ${formData.name}`);
      body.append('_captcha', 'false');

      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent('opgmiromraz1904@gmail.com')}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        }
      );

      if (!response.ok) throw new Error('Greška');
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-white">
          Ime
        </label>
        <input
          id="name"
          type="text"
          required
          placeholder="Ime"
          value={formData.name}
          onChange={handleChange}
          className="mt-3 w-full rounded-3xl border border-red-200 bg-white px-5 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-red-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mt-3 w-full rounded-3xl border border-red-200 bg-white px-5 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-red-500"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-white">
          Poruka
        </label>
        <textarea
          id="message"
          rows={5}
          required
          placeholder="Poruka"
          value={formData.message}
          onChange={handleChange}
          className="mt-3 w-full rounded-3xl border border-red-200 bg-white px-5 py-4 text-slate-800 placeholder-slate-400 outline-none transition focus:border-red-500"
        />
      </div>
      {status === 'success' && (
        <p className="rounded-2xl bg-green-700/40 px-4 py-3 text-sm text-green-300">
          Poruka je uspješno poslana! Kontaktirat ćemo vas uskoro.
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-2xl bg-red-700/40 px-4 py-3 text-sm text-red-300">
          Došlo je do pogreške. Molimo pokušajte ponovno ili nas kontaktirajte direktno.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-amber-400 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition disabled:opacity-60"
      >
        {status === 'sending' ? 'Slanje...' : 'Pošaljite poruku'}
      </button>
    </form>
  );
}
