'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const DELIVERY_OPTIONS = [
  { id: 'gls', name: 'GLS dostava', description: '2-3 radna dana', price: 4.0, icon: '🚚' },
  { id: 'hp', name: 'Hrvatska pošta', description: '3-5 radnih dana', price: 3.5, icon: '📬' },
  { id: 'osobno', name: 'Osobno preuzimanje', description: 'Zagorje – besplatno', price: 0, icon: '🏡' },
];

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [deliveryId, setDeliveryId] = useState('gls');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [ordererName, setOrdererName] = useState('');

  const selectedDelivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId)!;
  const itemsTotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = itemsTotal + selectedDelivery.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      if (paymentMethod === 'card') {
        // Stripe kartično plaćanje
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: state.items,
            deliveryId,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            customerAddress: formData.address,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Greška');
        if (result.url) {
          window.location.href = result.url;
          return;
        }
      } else {
        // Plaćanje pouzećem
        const response = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            items: state.items,
            total,
            delivery: selectedDelivery.name,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Greška');
        setOrdererName(formData.name.split(' ')[0]);
        dispatch({ type: 'CLEAR_CART' });
        setStatus('success');
      }
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
            Miro će Vas uskoro kontaktirati radi dogovora o dostavi i plaćanju pouzećem.
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
    <div className="min-h-screen bg-slate-50">
      {/* Header breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/cart" className="hover:text-red-700 transition">Košarica</Link>
          <span>›</span>
          <span className="text-slate-900 font-medium">Narudžba i plaćanje</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: Form */}
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Korak 1: Podaci */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <span className="w-7 h-7 rounded-full bg-red-700 text-white text-sm font-bold flex items-center justify-center">1</span>
                  <h2 className="font-semibold text-slate-800">Podaci za dostavu</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Ime i prezime *</label>
                      <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                        placeholder="Npr. Ivan Horvat"
                        className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-slate-800 text-sm transition" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Telefon *</label>
                      <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange}
                        placeholder="+385 91 234 5678"
                        className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-slate-800 text-sm transition" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email *</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                      placeholder="vasa@email.com"
                      className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-slate-800 text-sm transition" />
                    <p className="text-xs text-slate-400 mt-1">Potvrda narudžbe šalje se na ovaj email</p>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Adresa dostave *</label>
                    <textarea id="address" name="address" required value={formData.address} onChange={handleChange} rows={2}
                      placeholder="Ulica i kućni broj, Poštanski broj, Grad"
                      className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-slate-800 text-sm transition resize-none" />
                  </div>
                </div>
              </div>

              {/* Korak 2: Dostava */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <span className="w-7 h-7 rounded-full bg-red-700 text-white text-sm font-bold flex items-center justify-center">2</span>
                  <h2 className="font-semibold text-slate-800">Način dostave</h2>
                </div>
                <div className="p-4 space-y-2">
                  {DELIVERY_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        deliveryId === option.id
                          ? 'border-red-600 bg-red-50'
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={deliveryId === option.id}
                          onChange={() => setDeliveryId(option.id)}
                          className="accent-red-700 w-4 h-4"
                        />
                        <span className="text-xl">{option.icon}</span>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{option.name}</p>
                          <p className="text-xs text-slate-500">{option.description}</p>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${option.price === 0 ? 'text-green-600' : 'text-slate-800'}`}>
                        {option.price === 0 ? 'Besplatno' : `${option.price.toFixed(2)} €`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Korak 3: Plaćanje */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <span className="w-7 h-7 rounded-full bg-red-700 text-white text-sm font-bold flex items-center justify-center">3</span>
                  <h2 className="font-semibold text-slate-800">Način plaćanja</h2>
                </div>
                <div className="p-4 space-y-2">
                  {/* Kartica */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-red-600 bg-red-50' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-red-700 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800 text-sm">Plaćanje karticom</p>
                        {/* Visa SVG */}
                        <svg className="h-5" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="16" rx="3" fill="#1A1F71"/>
                          <path d="M19.5 11.5H17.3L18.7 4.5H20.9L19.5 11.5Z" fill="white"/>
                          <path d="M27.2 4.7C26.7 4.5 26 4.3 25.1 4.3C23 4.3 21.5 5.4 21.5 6.9C21.5 8.1 22.6 8.7 23.4 9.1C24.2 9.5 24.5 9.8 24.5 10.1C24.5 10.6 23.9 10.9 23.3 10.9C22.4 10.9 21.9 10.7 21.2 10.4L20.9 10.3L20.6 12C21.2 12.3 22.2 12.5 23.2 12.5C25.5 12.5 26.9 11.4 26.9 9.8C26.9 8.9 26.3 8.2 25 7.7C24.3 7.3 23.9 7.1 23.9 6.7C23.9 6.4 24.2 6.1 24.9 6.1C25.5 6.1 25.9 6.2 26.3 6.4L26.5 6.5L27.2 4.7Z" fill="white"/>
                          <path d="M30.4 9L31.3 6.6C31.3 6.6 31.5 6.1 31.6 5.8L31.8 6.5L32.6 9H30.4ZM34.8 4.5H33.1C32.6 4.5 32.2 4.6 32 5.1L28.9 11.5H31.1L31.6 10.3H34.2L34.5 11.5H36.5L34.8 4.5Z" fill="white"/>
                          <path d="M15.5 4.5L13.4 9.3L13.2 8.4C12.8 7.2 11.6 5.9 10.3 5.2L12.2 11.5H14.5L17.8 4.5H15.5Z" fill="white"/>
                          <path d="M11.5 4.5H8L8 4.6C10.8 5.3 12.7 6.9 13.2 8.4L12.6 5.1C12.4 4.7 12 4.5 11.5 4.5Z" fill="#F2AE14"/>
                        </svg>
                        {/* Mastercard SVG */}
                        <svg className="h-5" viewBox="0 0 48 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="30" rx="4" fill="#252525"/>
                          <circle cx="18" cy="15" r="8" fill="#EB001B"/>
                          <circle cx="30" cy="15" r="8" fill="#F79E1B"/>
                          <path d="M24 8.5C25.8 9.8 27 11.8 27 14C27 16.2 25.8 18.2 24 19.5C22.2 18.2 21 16.2 21 14C21 11.8 22.2 9.8 24 8.5Z" fill="#FF5F00"/>
                        </svg>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Sigurno plaćanje putem Stripe — 256-bit enkripcija</p>
                    </div>
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </label>

                  {/* Pouzeće */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-red-600 bg-red-50' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-red-700 w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 text-sm">Plaćanje pouzećem (gotovina)</p>
                      <p className="text-xs text-slate-500 mt-0.5">Platite kuriru pri preuzimanju paketa</p>
                    </div>
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </label>
                </div>

                {/* Submit gumb */}
                <div className="px-4 pb-4">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full rounded-xl bg-red-700 text-white py-4 font-bold text-base hover:bg-red-800 active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:bg-gray-300 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {status === 'sending' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Obrada...
                      </>
                    ) : paymentMethod === 'card' ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Plati {total.toFixed(2)} € karticom
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Potvrdi narudžbu — {total.toFixed(2)} €
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Došlo je do pogreške. Molimo pokušajte ponovno.
                    </div>
                  )}

                  {/* Trust badges */}
                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      SSL zaštita
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Stripe sigurno plaćanje
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Vaši podaci su zaštićeni
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT: Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="font-semibold text-slate-800">Sažetak narudžbe</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{state.items.reduce((s, i) => s + i.quantity, 0)} {state.items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'artikl' : 'artikla'}</p>
                </div>
                <div className="p-5 space-y-3">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{item.quantity}</span>
                        <span className="text-sm text-slate-700 leading-tight">{item.product.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800 shrink-0">{(item.product.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Međuzbroj</span>
                    <span>{itemsTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Dostava</span>
                    <span className={selectedDelivery.price === 0 ? 'text-green-600 font-medium' : ''}>
                      {selectedDelivery.price === 0 ? 'Besplatno' : `${selectedDelivery.price.toFixed(2)} €`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200 mt-1">
                    <span>Ukupno za platiti</span>
                    <span className="text-red-700">{total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Info box */}
                <div className="px-5 py-4 border-t border-slate-100">
                  <div className="flex gap-2.5 text-xs text-slate-500">
                    <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Potvrda narudžbe bit će poslana na vaš email. Za pitanja: <a href="tel:+385981886119" className="text-red-700 font-medium">+385 98 188 6119</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
