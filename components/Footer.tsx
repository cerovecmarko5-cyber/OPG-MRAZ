import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-red-700 text-slate-100 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">OPG I DESTILERIJA MRAZ</h2>
          <p className="text-slate-300 leading-7">
            Tradicija uzgoja i svježi proizvodi iz prve ruke. Nudimo voće, rakiju i likere iz našeg
            gospodarstva s pažnjom za kvalitetu i prirodu.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Kontakt</h2>
          <p className="text-slate-300 leading-7">Mail: opgmiromraz1904@gmail.com</p>
          <p className="text-slate-300 leading-7">Telefon: +385 98 188 6119</p>
          <p className="text-slate-300 leading-7">Lokacija: Kozjak Začretski 3F, Sveti Križ Začretje</p>
          <a
            href="https://www.google.com/maps/place/Mraz+OPG/@46.0885495,15.9277869,17z/data=!3m1!4b1!4m6!3m5!1s0x4765e8d620290b6f:0x4f26d3fe16e44e6d!8m2!3d46.0885495!4d15.9277869!16s%2Fg%2F11fp8zbf_s"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 text-amber-300 hover:text-white transition text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Pronađi nas na Google Maps
          </a>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Brza poveznica</h2>
          <ul className="space-y-2 text-slate-300">
            <li><Link href="/" className="hover:text-white transition">Početna</Link></li>
            <li><Link href="/products" className="hover:text-white transition">Proizvodi</Link></li>
            <li><Link href="/cart" className="hover:text-white transition">Košarica</Link></li>
            <li><Link href="/checkout" className="hover:text-white transition">Plaćanje</Link></li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">Pravne informacije</h2>
          <ul className="space-y-2 text-slate-300">
            <li><Link href="/uvjeti" className="hover:text-white transition">Opći uvjeti poslovanja</Link></li>
            <li><Link href="/privatnost" className="hover:text-white transition">Politika privatnosti</Link></li>
            <li><Link href="/impressum" className="hover:text-white transition">Impressum</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-red-600 mt-10 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-3 text-center">
          <p className="text-amber-300 font-semibold text-sm tracking-wide">
            🔞 Alkohol je zabranjen osobama mlađim od 18 godina. Odgovorno konzumirajte.
          </p>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} OPG i DESTILERIJA Mraz. Sva prava pridržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
