"use client";

import { useEffect, useState } from "react";

export default function AgeVerification() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem("age-verified");
    if (!verified) {
      setShow(true);
    }
  }, []);

  function handleConfirm() {
    sessionStorage.setItem("age-verified", "true");
    setShow(false);
  }

  function handleDeny() {
    window.location.href = "https://www.google.com";
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-amber-700 px-8 py-6 text-center">
          <div className="text-4xl mb-2">🍷</div>
          <h1 className="text-2xl font-bold text-white">OPG i DESTILERIJA Mraz</h1>
          <p className="text-amber-200 text-sm mt-1">Provjera dobi</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">
            Imate li 18 ili više godina?
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Ova stranica prodaje alkoholna pića. Ulaz je dozvoljen samo punoljetnim osobama.
            Konzumiranjem alkohola upravljajte odgovorno.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Da, stariji sam od 18
            </button>
            <button
              onClick={handleDeny}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Ne, nisam punoljetan
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-3 text-center">
          <p className="text-xs text-slate-400">
            Odgovornom konzumacijom alkohola štitite svoje zdravlje i zdravlje drugih.
          </p>
        </div>
      </div>
    </div>
  );
}
