'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { state, dispatch } = useCart();

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Košarica je prazna</h1>
        <p className="text-slate-500 mb-8">Dodajte proizvode i naručite odmah!</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full bg-red-700 text-white px-8 py-3 font-semibold hover:bg-red-800 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Pogledaj proizvode
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/products" className="hover:text-red-700 transition">Proizvodi</Link>
          <span>›</span>
          <span className="text-slate-900 font-medium">Košarica</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Košarica</h1>
          <span className="text-sm text-slate-500">{totalItems} {totalItems === 1 ? 'artikl' : 'artikla'}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Artikli */}
          <div className="lg:col-span-2 space-y-3">
            {state.items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center gap-4">
                {/* Slika proizvoda */}
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                  {item.product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍶</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{item.product.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{item.product.price.toFixed(2)} € / {item.product.unit || 'kom'}</p>
                </div>

                {/* Količina */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, item.quantity - 1) : removeItem(item.product.id)}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-red-300 hover:text-red-700 transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center font-semibold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-red-300 hover:text-red-700 transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Cijena + ukloni */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-slate-900">{(item.product.price * item.quantity).toFixed(2)} €</p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-xs text-slate-400 hover:text-red-600 transition mt-1"
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            ))}

            {/* Nastavi kupovinu */}
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-700 transition mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Nastavi kupovinu
            </Link>
          </div>

          {/* Sažetak */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-6">
              <h2 className="font-semibold text-slate-800 mb-4">Sažetak narudžbe</h2>

              {state.items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-slate-600 py-1">
                  <span className="truncate mr-2">{item.product.name} ×{item.quantity}</span>
                  <span className="shrink-0 font-medium">{(item.product.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}

              <div className="border-t border-slate-100 mt-4 pt-4">
                <div className="flex justify-between text-sm text-slate-500 mb-1">
                  <span>Dostava</span>
                  <span>od 3.50 €</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base mt-3">
                  <span>Međuzbroj</span>
                  <span className="text-red-700">{total.toFixed(2)} €</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-red-700 text-white py-3.5 font-bold hover:bg-red-800 active:scale-[0.99] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Nastavi na plaćanje
              </Link>

              {/* Trust badges */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Sigurno plaćanje karticom (Stripe)
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Plaćanje pouzećem dostupno
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}