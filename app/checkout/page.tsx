'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [ordererName, setOrdererName] = useState('');

  const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items: state.items, total }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Greška');
      setOrdererName(formData.name.split(' ')[0]);
      dispatch({ type: 'CLEAR_CART' });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Narudžba primljena!</h1>
          <p className="text-slate-600 text-lg leading-8">
            Hvala, <strong>{ordererName}</strong>! Vaša narudžba je uspješno kreirana.<br />
            Miro će Vas uskoro kontaktirati radi dogovora o dostavi i plaćanju.
          </p>
          <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-700 w-full">
            📞 Ako imate pitanja, možete nas kontaktirati na <strong>+385 98 188 6119</strong>
          </div>
          <Link
            href="/products"
            className="mt-2 rounded-full bg-red-700 text-white px-8 py-3 font-semibold hover:bg-red-800 transition"
          >
            Nastavi kupovinu
          </Link>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Košarica je prazna</h1>
        <Link href="/products" className="text-red-700 font-semibold hover:underline">
          Pogledaj proizvode →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Plaćanje</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Podaci za dostavu</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Ime i prezime</label>
              <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-slate-800" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-slate-800" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
              <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-slate-800" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Adresa</label>
              <textarea id="address" name="address" required value={formData.address} onChange={handleChange} rows={3}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-slate-800" />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-full bg-red-700 text-white py-3 font-semibold hover:bg-red-800 transition disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {status === 'sending' ? 'Slanje...' : 'Pošalji narudžbu'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-700 text-center">Došlo je do pogreške. Molimo pokušajte ponovno.</p>
            )}
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Sažetak narudžbe</h2>
          <div className="bg-gray-50 rounded-2xl p-5 border border-slate-200">
            {state.items.map((item) => (
              <div key={item.product.id} className="flex justify-between py-2 text-slate-700">
                <span>{item.product.name} x {item.quantity}</span>
                <span className="font-medium">{(item.product.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
            <div className="border-t border-slate-300 mt-4 pt-4 flex justify-between font-bold text-slate-900 text-lg">
              <span>Ukupno:</span>
              <span className="text-red-700">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
