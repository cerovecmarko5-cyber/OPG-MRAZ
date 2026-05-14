import Link from 'next/link';
import { products } from '../lib/products';
import ContactForm from '../components/ContactForm';
import ReviewsSection from '../components/ReviewsSection';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="overflow-hidden">
        {/* Mobile: slika gore, tekst ispod */}
        <div className="md:hidden">
          <div
            className="w-full h-[72vw] min-h-[250px] max-h-[380px]"
            style={{
              backgroundImage: "url('/WhatsApp Image 2026-04-10 at 15.52.58.jpeg')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundColor: '#fff',
            }}
          />
          <div className="bg-red-700 px-6 py-8 text-white">
            <div className="space-y-4">
              <h1 className="text-3xl font-black tracking-tight">Rakija, Likeri i Voće s dušom naše obitelji</h1>
              <p className="text-base leading-7 text-white/80">
                Dobrodošli u OPG i DESTILERIJU MRAZ, gdje tradicija susreće prirodnu kvalitetu. S našim proizvodima
                donosimo autentičan okus domaće zagorske prirode izravno na vaš stol.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition"
              >
                Pogledajte proizvode
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white hover:bg-white/20 transition"
              >
                Naručite sada
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop: originalni overlay layout */}
        <div className="hidden md:block relative text-white">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/WhatsApp Image 2026-04-10 at 15.52.58.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.0) 100%)' }} />
          <div className="relative px-12 lg:px-16 py-28 min-h-[70vh] flex items-end">
            <div className="w-full max-w-lg pb-6">
              <div className="space-y-5">
                <h1 className="text-4xl font-black tracking-tight lg:text-5xl" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>Rakija, Likeri i Voće s dušom naše obitelji</h1>
                <p className="max-w-2xl text-base leading-7 text-white/90 lg:text-lg lg:leading-8" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
                  Dobrodošli u OPG i DESTILERIJU MRAZ, gdje tradicija susreće prirodnu kvalitetu. S našim proizvodima
                  donosimo autentičan okus domaće zagorske prirode izravno na vaš stol.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition"
                >
                  Pogledajte proizvode
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition"
                >
                  Naručite sada
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar — dostava i plaćanje */}
      <section className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">

            {/* Kartično plaćanje */}
            <div className="flex items-center gap-3 py-5 px-4 sm:px-6">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">Plaćanje karticom</p>
                <p className="text-xs text-slate-400 mt-0.5">Visa &amp; Mastercard</p>
              </div>
            </div>

            {/* Brza dostava */}
            <div className="flex items-center gap-3 py-5 px-4 sm:px-6">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">GLS &amp; HP dostava</p>
                <p className="text-xs text-slate-400 mt-0.5">2–5 radnih dana</p>
              </div>
            </div>

            {/* Besplatno preuzimanje */}
            <div className="flex items-center gap-3 py-5 px-4 sm:px-6">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">Osobno preuzimanje</p>
                <p className="text-xs text-slate-400 mt-0.5">Zagorje — besplatno</p>
              </div>
            </div>

            {/* Sigurnost */}
            <div className="flex items-center gap-3 py-5 px-4 sm:px-6">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">Sigurna narudžba</p>
                <p className="text-xs text-slate-400 mt-0.5">SSL + Stripe zaštita</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="o-nama" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">O nama</p>
              <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                Obiteljska destilerija i OPG s pričom
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                U OPG i DESTILERIJA Mraz njegujemo dugogodišnju tradiciju uzgoja i destilacije. Svaki proizvod je rezultat
                rada naše obitelji i prirodnog procesa u kojem je kvaliteta najvažnija.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Autentični okusi</h3>
                  <p className="mt-3 text-slate-600 leading-7">Rakije, likeri i voće su lokalni i bez kompromisa na kvaliteti.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Roditeljski pristup</h3>
                  <p className="mt-3 text-slate-600 leading-7">Svaka boca nosi našu obiteljsku pažnju i tradiciju.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-xl">
              <div className="p-10 sm:p-14">
                <p className="text-sm uppercase tracking-[0.3em] text-red-600 font-semibold">Naša misija</p>
                <h3 className="mt-6 text-3xl font-bold text-slate-900">Stvarati proizvode koji hrane dušu i tijelo</h3>
                <p className="mt-5 text-slate-600 leading-8">
                  Tradicija, kvaliteta i briga za prirodu su temelj našeg rada. Želimo da svakim gutljajem i zalogajem
                  dobijete istinski domaći doživljaj.
                </p>
                <div className="mt-10 space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-600">Adresa</p>
                    <p className="mt-3 text-slate-800">OPG i DESTILERIJA MRAZ</p>
                    <p className="text-slate-600">Kozjak Začretski 3F</p>
                    <p className="text-slate-600">Sveti Križ Začretje</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-600">Kontakt</p>
                    <p className="mt-3 text-slate-800">Tel: +385 98 188 6119</p>
                    <p className="text-slate-600">Email: opgmiromraz1904@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kontakt" className="bg-red-700 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-400 font-semibold">Kontakt</p>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Javite nam se za Vašu narudžbu</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Pošaljite nam poruku i dogovorite dostavu svježih proizvoda. Rado ćemo odgovoriti na sva pitanja.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-red-700 font-semibold">Email</p>
                  <p className="mt-3 text-slate-800">opgmiromraz1904@gmail.com</p>
                </div>
                <div className="rounded-3xl bg-white p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-red-700 font-semibold">Telefon</p>
                  <p className="mt-3 text-slate-800">+385 98 188 6119</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white/10 p-10 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />
    </div>
  );
}
