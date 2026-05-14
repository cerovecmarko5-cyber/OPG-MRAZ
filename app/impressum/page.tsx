export const metadata = {
  title: 'Impressum | OPG Mraz',
  description: 'Podaci o tvrtki OPG i DESTILERIJA MRAZ.',
};

export default function ImpressumPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Impressum</h1>

      <div className="space-y-6 text-slate-700 leading-7">

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Podaci o poslovnom subjektu</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <tr className="py-2">
                <td className="py-2 pr-4 font-medium text-slate-600 w-40">Naziv</td>
                <td className="py-2">OPG i DESTILERIJA MRAZ</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">OIB</td>
                <td className="py-2">97417010381</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">Adresa</td>
                <td className="py-2">Kozjak Začretski 3F<br />49215 Sveti Križ Začretje<br />Hrvatska</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">Telefon</td>
                <td className="py-2">
                  <a href="tel:+385981886119" className="text-red-600 hover:underline">+385 98 188 6119</a>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">E-pošta</td>
                <td className="py-2">
                  <a href="mailto:opgmiromraz1904@gmail.com" className="text-red-600 hover:underline">opgmiromraz1904@gmail.com</a>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">Web</td>
                <td className="py-2">opg-mrazmiro.com</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">Vlasnik</td>
                <td className="py-2">Miro Mraz</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tehnički podaci</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600 w-40">Hosting</td>
                <td className="py-2">Vercel Inc., San Francisco, SAD</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">Platni procesor</td>
                <td className="py-2">Stripe, Inc. — PCI DSS certificiran</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">Baza podataka</td>
                <td className="py-2">Supabase (EU regija)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-slate-600">Analitika</td>
                <td className="py-2">Google Analytics 4 (uz suglasnost korisnika)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Odricanje od odgovornosti</h2>
          <p className="text-sm text-slate-600">
            Sadržaj ove web stranice izrađen je s dužnom pažnjom. Prodavatelj ne preuzima
            odgovornost za točnost, potpunost ili aktualnost informacija. Slike proizvoda su
            ilustrativne naravi. Cijene i dostupnost proizvoda mogu se mijenjati bez prethodne
            najave.
          </p>
        </div>

        <p className="text-xs text-slate-400 pt-4">
          Stranica izrađena sukladno čl. 4. Zakona o elektroničkoj trgovini (NN 173/03, 67/08, 36/09, 130/11, 30/14, 32/19).
        </p>
      </div>
    </main>
  );
}
