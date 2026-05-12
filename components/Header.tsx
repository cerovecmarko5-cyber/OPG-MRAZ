'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../app/context/CartContext';

const navLinks = [
  { href: '/', label: 'Početna' },
  { href: '/products', label: 'Proizvodi' },
  { href: '/obavijesti', label: 'Obavijesti' },
  { href: '/#o-nama', label: 'O nama' },
  { href: '/#kontakt', label: 'Kontakt' },
];

export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const { state } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-red-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-lg font-bold leading-tight sm:text-2xl">
            OPG I DESTILERIJA MRAZ
          </Link>

          {/* Desktop navigacija */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-red-200 transition">
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/dashboard" className="bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-full text-sm font-semibold">
                ⚙️ Admin
              </Link>
            )}
            <Link href="/cart" className="relative inline-block hover:text-red-200 transition">
              Košarica
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-white text-red-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobitel: košarica + hamburger */}
          <div className="flex items-center gap-5 md:hidden">
            <Link href="/cart" className="relative inline-block hover:text-red-200 transition">
              Košarica
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-white text-red-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1 rounded hover:bg-red-600 transition"
              aria-label="Otvori izbornik"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobitel dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-red-800 px-4 pb-4">
          <nav className="flex flex-col">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 border-b border-red-700 hover:text-red-200 transition"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="py-3 font-semibold text-white/90 hover:text-white transition"
                onClick={() => setMobileOpen(false)}
              >
                ⚙️ Admin panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}