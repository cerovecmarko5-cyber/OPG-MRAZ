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

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Vaša košarica je prazna</h1>
        <Link
          href="/products"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Pogledajte proizvode
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vaša košarica</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {state.items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between border-b border-gray-200 py-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
              <p className="text-gray-600">{item.product.price} €/kg</p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded"
              />
              <span className="text-lg font-medium">{(item.product.price * item.quantity).toFixed(2)} €</span>
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-600 hover:text-red-800"
              >
                Ukloni
              </button>
            </div>
          </div>
        ))}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-xl font-bold">Ukupno: {total.toFixed(2)} €</span>
          <Link
            href="/checkout"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Nastavi na plaćanje
          </Link>
        </div>
      </div>
    </div>
  );
}