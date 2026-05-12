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
