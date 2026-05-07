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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="h-96 w-full object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-green-600 mb-6">{product.price.toFixed(2)} €/{product.unit || 'kom'}</p>
          <button
            onClick={addToCart}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Dodaj u košaricu
          </button>
        </div>
      </div>
    </div>
  );
}