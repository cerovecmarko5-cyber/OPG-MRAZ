'use client';

import Link from 'next/link';
import { useState } from 'react';
import { products } from '../../lib/products';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Svi');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const categories = ['Svi', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Svi' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-green-700 font-semibold mb-3">Katalog</p>
          <h1 className="text-4xl font-bold text-slate-900">Svježi proizvodi iz OPG i DESTILERIJA Mraz</h1>
        </div>
        <p className="max-w-xl text-slate-600">
          Izaberi najbolje i dodaj u košaricu. Svaki proizvod dolazi iz domaćeg uzgoja i pažljivo je odabran.
        </p>
      </div>
      <div className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Pretraži proizvode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-green-700 font-semibold">{product.category}</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{product.name}</h2>
              </div>
              <div className="rounded-2xl bg-green-50 px-4 py-2 text-green-700 font-semibold">
                {product.price.toFixed(2)} €/{product.unit || 'kom'}
              </div>
            </div>
            <img
              src={product.image}
              alt={product.name}
              className="h-44 w-full rounded-3xl object-cover mb-6"
            />
            <p className="text-slate-600 leading-7 mb-6">{product.description}</p>
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              Pogledaj detalje
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
