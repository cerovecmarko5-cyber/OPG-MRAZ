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
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Brza poveznica</h2>
          <ul className="space-y-2 text-slate-300">
            <li><Link href="/" className="hover:text-white transition">Početna</Link></li>
            <li><Link href="/products" className="hover:text-white transition">Proizvodi</Link></li>
            <li><Link href="/cart" className="hover:text-white transition">Košarica</Link></li>
            <li><Link href="/checkout" className="hover:text-white transition">Plaćanje</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-red-600 mt-10 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} OPG i DESTILERIJA Mraz. Sva prava pridržana.
        </div>
      </div>
    </footer>
  );
}
