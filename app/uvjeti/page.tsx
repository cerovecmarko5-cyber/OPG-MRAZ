export const metadata = {
  title: 'Opći uvjeti poslovanja | OPG Mraz',
  description: 'Opći uvjeti poslovanja, pravo na povrat i reklamacije OPG i DESTILERIJA MRAZ.',
};

export default function UvjetiPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Opći uvjeti poslovanja</h1>
      <p className="text-slate-500 text-sm mb-8">Zadnje ažuriranje: 14. svibnja 2026.</p>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-7">

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Prodavatelj</h2>
          <p>
            OPG i DESTILERIJA MRAZ<br />
            Kozjak Začretski 3F, 49215 Sveti Križ Začretje, Hrvatska<br />
            OIB: <strong>97417010381</strong><br />
            E-pošta: opgmiromraz1904@gmail.com<br />
            Telefon: +385 98 188 6119<br />
            Web: opg-mrazmiro.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Predmet ugovora</h2>
          <p>
            Ovi opći uvjeti uređuju kupoprodajni odnos između OPG i DESTILERIJA MRAZ (prodavatelj)
            i kupca koji naručuje putem web stranice opg-mrazmiro.com. Narudžbom proizvoda kupac
            potvrđuje da je pročitao i prihvatio ove uvjete.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Dobna ograničenja</h2>
          <p>
            Alkoholna pića je zabranjena prodaja osobama mlađim od 18 godina. Kupac potvrđuje
            da ima navršenih 18 godina pri narudžbi. Prodavatelj zadržava pravo odbiti narudžbu
            ako postoji sumnja u punoljetnost kupca.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Cijena i plaćanje</h2>
          <p>Sve cijene su izražene u eurima (€) i uključuju PDV gdje je primjenjivo.</p>
          <p className="mt-2">Dostupne metode plaćanja:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Kartica (Visa / Mastercard)</strong> — sigurno plaćanje putem Stripe platforme</li>
            <li><strong>Pouzećem</strong> — gotovina pri preuzimanju pošiljke od dostavljača</li>
            <li><strong>Osobno preuzimanje</strong> — gotovina pri preuzimanju na adresi OPG-a</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Dostava</h2>
          <p>Dostava je dostupna na cijelom području Republike Hrvatske.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>GLS kurier</strong> — 4,00 € (2–5 radnih dana)</li>
            <li><strong>Hrvatska pošta</strong> — 3,50 € (2–5 radnih dana)</li>
            <li><strong>Osobno preuzimanje</strong> — besplatno (Kozjak Začretski 3F)</li>
          </ul>
          <p className="mt-2">
            Narudžbe se obrađuju radnim danima. Prodavatelj nije odgovoran za kašnjenja
            nastala uslijed više sile ili krivnjom dostavne službe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Pravo na odustanak (14 dana)</h2>
          <p>
            Sukladno Zakonu o zaštiti potrošača (NN 19/22) i Direktivi EU 2011/83/EU, kupac ima
            pravo odustati od ugovora sklopljenog na daljinu u roku od <strong>14 dana</strong> od
            dana primitka robe, bez navođenja razloga.
          </p>
          <p className="mt-2">
            Za ostvarivanje prava na odustanak kupac mora obavijestiti prodavatelja pisanom
            izjavom na e-mail: <a href="mailto:opgmiromraz1904@gmail.com" className="text-red-600 underline">opgmiromraz1904@gmail.com</a>{' '}
            ili poštom na adresu navedenu u čl. 1.
          </p>
          <p className="mt-2">
            <strong>Iznimke:</strong> Pravo na odustanak ne primjenjuje se na lako kvarljivu robu
            (svježe voće, povrće) te na robu koja je po naravi neodvojiva od ostalih predmeta
            nakon isporuke.
          </p>
          <p className="mt-2">
            Troškove povrata snosi kupac, osim ako je roba dostavljena pogrešno ili je neispravan.
            Povrat novca vrši se u roku 14 dana od primitka obavijesti o odustanku.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Reklamacije i jamstvo</h2>
          <p>
            Kupac ima pravo na reklamaciju sukladno Zakonu o zaštiti potrošača. Reklamacije se
            podnose pisanim putem na:{' '}
            <a href="mailto:opgmiromraz1904@gmail.com" className="text-red-600 underline">opgmiromraz1904@gmail.com</a>
          </p>
          <p className="mt-2">
            Prodavatelj je dužan pisanim putem odgovoriti na reklamaciju u roku <strong>15 dana</strong> od
            primitka. Sukladno čl. 26a Zakona o zaštiti potrošača, rok za rješavanje reklamacije
            je <strong>30 dana</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Izvansudsko rješavanje sporova</h2>
          <p>
            U slučaju spora kupac može pokrenuti postupak izvansudskog rješavanja potrošačkih sporova
            pred Centrom za mirenje pri HGK:{' '}
            <a href="https://www.hgk.hr/centar-za-mirenje" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">hgk.hr/centar-za-mirenje</a>
          </p>
          <p className="mt-2">
            Platforma EU za online rješavanje sporova:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">ec.europa.eu/consumers/odr</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Mjerodavno pravo</h2>
          <p>
            Na ove uvjete primjenjuje se pravo Republike Hrvatske. Za sve sporove nadležan je
            stvarno nadležni sud u Republici Hrvatskoj.
          </p>
        </section>

      </div>
    </main>
  );
}
