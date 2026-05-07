# OPG Mraz - Online Trgovina

Web stranica za OPG i DESTILERIJA MRAZ s internetskom trgovinom za prodaju svježih poljoprivrednih proizvoda.
## Tehnički detalji

Ovaj projekt je izgrađen koristeći [Next.js 16](https://nextjs.org) s TypeScript-om, Tailwind CSS-om i App Router-om.

## Pokretanje

Prvo, instalirajte dependencies:

```bash
npm install
```

Zatim, pokrenite development server:

```bash
npm run dev
```

Otvorite [http://localhost:3000](http://localhost:3000) u vašem browseru.

## Funkcionalnosti

- **Početna stranica**: Hero sekcija s opisom OPG-a i istaknutim proizvodima
- **Katalog proizvoda**: Prikaz svih proizvoda s mogućnošću pretrage i filtriranja po kategorijama
- **Detalji proizvoda**: Pojedinačne stranice za svaki proizvod s dodavanjem u košaricu
- **Košarica za kupovinu**: Dodavanje, uklanjanje i ažuriranje količina proizvoda
- **Proces plaćanja**: Obrazac za unos podataka o dostavi i slanje narudžbe putem emaila
- **Responzivni dizajn**: Optimiziran za desktop i mobilne uređaje

## Proizvodi

Trenutno dostupni proizvodi:
- Voće: Jabuke, Kruške
- Povrće: Krumpir, Rajčica, Kupus
- Rakija: Šljivovica, Haskap, Višnjevac

## API

- `POST /api/order`: Slanje narudžbe s podacima kupca i stavkama košarice

Za konfiguraciju email slanja, postavite varijable okoline:
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `ORDER_RECIPIENT_EMAIL`

## Saznajte više

Za više informacija o Next.js, pogledajte:

- [Next.js Dokumentacija](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
