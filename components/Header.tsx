'use client';

import Link from 'next/link';
import { useCart } from '../app/context/CartContext';

export default function Header() {
  const { state } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            OPG Mraz
          </Link>
          <nav className="flex space-x-6">
            <Link href="/" className="hover:text-green-200">
              Početna
            </Link>
            <Link href="/products" className="hover:text-green-200">
              Proizvodi
            </Link>
            <Link href="/cart" className="hover:text-green-200 relative">
              Košarica
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}