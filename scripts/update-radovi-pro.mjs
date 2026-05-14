// Skripta: ažurira "Novosti na stranici" objavu – profesionalnija verzija
// Pokretanje: node scripts/update-radovi-pro.mjs

import { put, list } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const POSTS_BLOB = 'posts/posts.json';

if (!BLOB_TOKEN) {
  console.error('❌  Nedostaje BLOB_READ_WRITE_TOKEN');
  process.exit(1);
}

async function main() {
  console.log('📥  Dohvaćam objave...');
  const { blobs } = await list({ prefix: 'posts/posts.json', token: BLOB_TOKEN });
  const res = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' });
  const posts = await res.json();
  console.log(`   Pronađeno: ${posts.length} objava`);

  const updated = posts.map(p => {
    if (!p.title.includes('Novosti na stranici')) return p;

    return {
      ...p,
      title: '🚀 Velika nadogradnja stranice – novo poglavlje za OPG Mraz!',
      content: `Poštovani kupci i posjetitelji,

s ponosom vam predstavljamo niz uzbudljivih novina koje smo uveli na opg-mrazmiro.com. Naša stranica upravo je doživjela veliku nadogradnju – i ovo je tek početak!

──────────────────────────

💳 PLAĆANJE – POUZEĆE RADI, KARTICA STIŽE!
Narudžbe trenutno plaćate pouzećem – jednostavno i sigurno pri preuzimanju. Kartično plaćanje (Visa, Mastercard i ostale kartice) uskoro dolazi na stranicu. Pratite nas za službenu objavu!

📦 DOSTAVA – VIŠE OPCIJA, VI BIRATE
Nudimo vam tri načina preuzimanja narudžbe:
  • 🚚 GLS – dostava na kućnu adresu
  • 📮 Hrvatska pošta – dostava na adresu ili poštu po izboru
  • 🏡 Osobno preuzimanje – u Kozjaku Začretskom, po dogovoru

🛒 NOVI IZGLED KOŠARICE
Osvježili smo iskustvo kupnje od početka do kraja. Preglednije, intuitivnije i ljepše – jer vi to zaslužujete.

📍 PRONAĐITE NAS LAKŠE
Dodali smo točnu lokaciju OPG Mraz u Kozjaku Začretskom. Sada nas možete pronaći jednim klikom – bilo da dolazite po narudžbu ili samo u posjet masliniku.

📋 TRANSPARENTNOST NA PRVOM MJESTU
Uveli smo potpune Uvjete korištenja, Politiku privatnosti i Impressum. Kupujete s povjerenjem, a mi poslujemo s odgovornošću.

──────────────────────────

Ovo su samo neka od poboljšanja koja smo pripremili za vas. Pratite nas – dolaze i nove stvari! 🌿🫒

Vaš OPG Mraz`,
    };
  });

  console.log('📤  Spremam...');
  await put(POSTS_BLOB, JSON.stringify(updated), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });

  console.log('✅  Objava ažurirana!');
}

main().catch((err) => {
  console.error('❌  Greška:', err.message);
  process.exit(1);
});
