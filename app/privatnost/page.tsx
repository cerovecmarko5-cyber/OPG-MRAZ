export const metadata = {
  title: 'Politika privatnosti | OPG Mraz',
  description: 'Politika privatnosti i zaštite osobnih podataka OPG i DESTILERIJA MRAZ.',
};

export default function PrivatnostPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Politika privatnosti</h1>
      <p className="text-slate-500 text-sm mb-8">Zadnje ažuriranje: 14. svibnja 2026.</p>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-7">

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Voditelj obrade podataka</h2>
          <p>
            OPG i DESTILERIJA MRAZ<br />
            Kozjak Začretski 3F, 49215 Sveti Križ Začretje<br />
            OIB: <strong>97417010381</strong><br />
            E-pošta: opgmiromraz1904@gmail.com<br />
            Telefon: +385 98 188 6119
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Koje podatke prikupljamo</h2>
          <p>Prikupljamo sljedeće osobne podatke isključivo u svrhu obrade narudžbi i kontakta:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Ime i prezime</li>
            <li>E-mail adresa</li>
            <li>Adresa za dostavu</li>
            <li>Broj telefona</li>
            <li>Podaci o narudžbi (proizvodi, iznosi, metoda dostave)</li>
            <li>Podaci o plaćanju (obrađuje isključivo Stripe — mi ne pohranjujemo podatke kartice)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Svrha i pravna osnova obrade</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Izvršenje ugovora</strong> (čl. 6 st. 1 b GDPR) — obrada narudžbi i dostava</li>
            <li><strong>Pravna obveza</strong> (čl. 6 st. 1 c GDPR) — porezna i računovodstvena evidencija</li>
            <li><strong>Legitimni interes</strong> (čl. 6 st. 1 f GDPR) — zaštita od prijevare</li>
            <li><strong>Privola</strong> (čl. 6 st. 1 a GDPR) — analitika i kolačići (uz vašu suglasnost)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Rok čuvanja podataka</h2>
          <p>
            Podatke o narudžbama čuvamo 7 godina zbog poreznih obveza. Ostale podatke brišemo
            čim prestane svrha zbog koje su prikupljeni.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Dijeljenje s trećim stranama</h2>
          <p>Vaše podatke dijelimo isključivo s:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Stripe Inc.</strong> — platni procesor (SAD, Privacy Shield/SCCs)</li>
            <li><strong>Supabase Inc.</strong> — pohrana podataka (EU regija)</li>
            <li><strong>GLS / HP (Hrvatska pošta)</strong> — dostavne službe (ime, adresa, telefon)</li>
          </ul>
          <p className="mt-2">Podatke ne prodajemo niti ustupamo trećim stranama u marketinške svrhe.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Vaša prava</h2>
          <p>U skladu s GDPR-om imate pravo na:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Pristup vašim osobnim podacima</li>
            <li>Ispravak netočnih podataka</li>
            <li>Brisanje podataka (&ldquo;pravo na zaborav&rdquo;)</li>
            <li>Ograničenje obrade</li>
            <li>Prenosivost podataka</li>
            <li>Prigovor na obradu</li>
          </ul>
          <p className="mt-3">
            Zahtjeve možete uputiti na: <a href="mailto:opgmiromraz1904@gmail.com" className="text-red-600 underline">opgmiromraz1904@gmail.com</a>
          </p>
          <p className="mt-2">
            Imate pravo podnijeti pritužbu Agenciji za zaštitu osobnih podataka (AZOP):{' '}
            <a href="https://azop.hr" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">azop.hr</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Kolačići (Cookies)</h2>
          <p>
            Koristimo tehničke kolačiće nužne za rad stranice te analitičke kolačiće (Google Analytics)
            isključivo uz vašu suglasnost. Možete upravljati kolačićima putem obavijesti na dnu stranice
            ili u postavkama vašeg preglednika.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Sigurnost podataka</h2>
          <p>
            Stranica koristi SSL/TLS enkripciju (HTTPS). Platni promet obrađuje Stripe koji je PCI DSS
            certificiran. Lozinke i podaci kartice se nikad ne pohranjuju na našim poslužiteljima.
          </p>
        </section>

      </div>
    </main>
  );
}
