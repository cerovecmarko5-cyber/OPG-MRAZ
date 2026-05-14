'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function CheckoutUspjehPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { dispatch } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      dispatch({ type: 'CLEAR_CART' });
      setCleared(true);
    }
  }, [cleared, dispatch]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-10 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Plaćanje uspješno!</h1>
        <p className="text-slate-600 text-lg leading-8">
          Hvala na narudžbi! Vaše plaćanje je potvrđeno.<br />
          Poslat ćemo vam potvrdu na email, a roba će biti isporučena u dogovorenom roku.
        </p>
        {sessionId && (
          <p className="text-xs text-slate-400">Referenca: {sessionId.slice(-8).toUpperCase()}</p>
        )}
        <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-700 w-full">
          📞 Za pitanja: <strong>+385 98 188 6119</strong>
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
