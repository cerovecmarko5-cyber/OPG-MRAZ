'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../../lib/types';

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="bg-slate-200" style={{ height: '260px' }} />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded-full w-3/4" />
        <div className="h-4 bg-slate-200 rounded-full w-full" />
        <div className="h-4 bg-slate-200 rounded-full w-5/6" />
        <div className="h-10 bg-slate-200 rounded-full mt-2" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Svi');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const { dispatch } = useCart();

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => { setAllProducts(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categories = ['Svi', ...Array.from(new Set(allProducts.map(p => p.category)))];

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Svi' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', product });
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-red-700 font-semibold mb-3">Katalog</p>
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
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
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredProducts.map((product) => (
          <div key={product.id} className={`flex flex-col rounded-3xl border bg-white shadow-sm hover:shadow-xl transition-shadow overflow-hidden ${product.comingSoon ? 'border-amber-200' : 'border-slate-200'}`}>
            <div className="relative bg-gray-50 flex items-center justify-center" style={{height: '260px'}}>
              {product.comingSoon && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <span className="bg-amber-500 text-white text-sm font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-lg rotate-[-8deg]">
                    Uskoro u ponudi
                  </span>
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`h-full w-full object-contain p-4 drop-shadow-lg ${product.comingSoon ? 'grayscale opacity-60' : ''}`}
              />
              <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full z-20">
                {product.category}
              </span>
              {!product.comingSoon && (
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-red-700 text-sm font-bold px-3 py-1 rounded-full shadow">
                  {product.price.toFixed(2)} €
                </span>
              )}
            </div>
            <div className="flex flex-col flex-1 p-5 gap-3">
              <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
              <p className="text-slate-500 text-sm leading-6 flex-1">{product.description}</p>
              {product.inStock === false && !product.comingSoon ? (
                <div className="flex items-center gap-2 pt-2 bg-slate-50 rounded-2xl px-4 py-3">
                  <span className="text-slate-400 text-lg">🚫</span>
                  <p className="text-slate-500 text-sm font-medium">Trenutno rasprodano. Javite se za informacije.</p>
                </div>
              ) : product.comingSoon ? (
                <div className="flex items-center gap-2 pt-2 bg-amber-50 rounded-2xl px-4 py-3">
                  <span className="text-amber-600 text-lg">🕐</span>
                  <p className="text-amber-700 text-sm font-medium">Ovaj proizvod uskoro će biti dostupan za naručivanje.</p>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleAdd(product)}
                    className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                      added[product.id]
                        ? 'bg-green-600 text-white'
                        : 'bg-red-700 text-white hover:bg-red-800'
                    }`}
                  >
                    {added[product.id] ? '✓ Dodano' : 'Dodaj u košaricu'}
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-full border-2 border-red-700 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 transition whitespace-nowrap"
                  >
                    Detalji
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
