// Skripta: zamjenjuje staru "radovi" objavu s novom koja ima logo sliku
// Pokretanje: node scripts/update-radovi-post.mjs

import { put, list } from '@vercel/blob';
import { readFileSync } from 'fs';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const POSTS_BLOB = 'posts/posts.json';

if (!BLOB_TOKEN) {
  console.error('❌  Nedostaje BLOB_READ_WRITE_TOKEN');
  process.exit(1);
}

async function main() {
  // 1. Upload logo slike
  console.log('🖼️  Uploading logo...');
  const logoFile = readFileSync('public/logo.jpg');
  const logoBlob = await put('posts/images/logo-novosti.jpg', logoFile, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
  console.log('   Logo URL:', logoBlob.url);

  // 2. Dohvati postojeće objave
  console.log('📥  Dohvaćam objave...');
  const { blobs } = await list({ prefix: 'posts/posts.json', token: BLOB_TOKEN });
  let posts = [];
  if (blobs.length) {
    const res = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' });
    posts = await res.json();
  }
  console.log(`   Pronađeno: ${posts.length} objava`);

  // 3. Ukloni staru "radovi" objavu
  const filtered = posts.filter(p => !p.title.includes('Novosti na stranici'));

  // 4. Nova objava s logom
  const novaObjava = {
    id: crypto.randomUUID(),
    title: 'Novosti na stranici – što je sve novo na opg-mrazmiro.com',
    content: `Dragi posjetitelji i kupci,

stalno radimo na poboljšanjima kako bi vaše iskustvo s OPG Mraz bilo što bolje. Evo što je novo:

💳 Kartično plaćanje – uskoro dostupno! Trenutno smo u procesu autorizacije za online plaćanje karticom. Kad autorizacija bude završena, moći ćete platiti Visa, Mastercard i svim ostalim karticama direktno na stranici.

🛒 Novi izgled košarice – osvježili smo izgled košarice za preglednije i ugodnije kupovanje.

📋 Prava i zakoni – dodali smo sve potrebne stranice: Uvjete korištenja, Politiku privatnosti i Impressum, u skladu s hrvatskim i EU propisima.

📍 Lokacija – na stranici smo dodali našu točnu lokaciju u Kozjaku Začretskom kako bi nas lakše pronašli.

Hvala vam na strpljenju i povjerenju. Trudimo se svaki dan biti bolji za vas! 🫒`,
    image_url: logoBlob.url,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dana unazad
  };

  const azurirane = [novaObjava, ...filtered];

  // 5. Spremi
  console.log('📤  Spremam...');
  await put(POSTS_BLOB, JSON.stringify(azurirane), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });

  console.log('✅  Gotovo! Objave:');
  azurirane.forEach((p, i) =>
    console.log(`   ${i + 1}. [${p.created_at.slice(0, 10)}] ${p.title} ${p.image_url ? '🖼️' : ''}`)
  );
}

main().catch((err) => {
  console.error('❌  Greška:', err.message);
  process.exit(1);
});
