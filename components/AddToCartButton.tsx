'use client';

import { useCart } from '../app/context/CartContext';
import { Product } from '../lib/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { dispatch } = useCart();

  if (product.comingSoon) {
    return (
      <div className="w-full rounded-full bg-slate-200 text-slate-500 py-3.5 font-semibold text-base text-center">
        Uskoro dostupno
      </div>
    );
  }

  if (product.inStock === false) {
    return (
      <div className="w-full rounded-full bg-slate-200 text-slate-500 py-3.5 font-semibold text-base text-center">
        Rasprodano
      </div>
    );
  }

  return (
    <button
      onClick={() => dispatch({ type: 'ADD_ITEM', product })}
      className="w-full rounded-full bg-red-700 text-white py-3.5 font-semibold text-base hover:bg-red-800 transition"
    >
      Dodaj u košaricu
    </button>
  );
}
