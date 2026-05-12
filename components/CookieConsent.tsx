'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200">
              <span className="font-semibold text-white">🍪 Kolačići</span> — Koristimo analitičke kolačiće kako bismo poboljšali vaše iskustvo na stranici.
              Vaši podaci se ne dijele s trećim stranama.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 text-sm text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition"
            >
              Odbijam
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 text-sm bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            >
              Prihvaćam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
