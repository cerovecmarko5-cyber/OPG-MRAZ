'use client';

import { useParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { products } from '../../../lib/products';

export default function ProductDetailPage() {
  const params = useParams();
  const { dispatch } = useCart();
  const product = products.find(p => p.id === params.id);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Proizvod nije pronađen.</div>;
  }

  const addToCart = () => {
    dispatch({ type: 'ADD_ITEM', product });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="bg-gray-50 rounded-3xl flex items-center justify-center p-8" style={{minHeight: '420px'}}>
          <img
            src={product.image}
            alt={product.name}
            className="max-h-96 w-full object-contain drop-shadow-xl"
          />
        </div>
        <div className="flex flex-col gap-5">
          <span className="text-xs uppercase tracking-widest text-red-700 font-semibold">{product.category}</span>
          <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-slate-500 leading-7">{product.description}</p>
          <p className="text-3xl font-bold text-red-700">{product.price.toFixed(2)} € <span className="text-base font-normal text-slate-400">/ {product.unit || 'kom'}</span></p>
          <button
            onClick={addToCart}
            className="w-full rounded-full bg-red-700 text-white py-3.5 font-semibold text-base hover:bg-red-800 transition"
          >
            Dodaj u košaricu
          </button>
        </div>
      </div>
    </div>
  );
}