// Skripta za dodavanje objave o novostima na stranici
// Pokretanje: node scripts/add-radovi-post.mjs

import { put, list } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const POSTS_BLOB = 'posts/posts.json';

if (!BLOB_TOKEN) {
  console.error('❌  Nedostaje BLOB_READ_WRITE_TOKEN u .env.local');
  process.exit(1);
}

const novaObjava = {
  id: crypto.randomUUID(),
  title: '🛠️ Novosti na stranici – što je sve novo na opg-mrazmiro.com',
  content: `Dragi posjetitelji,

s ponosom vam predstavljamo novosti i poboljšanja koja smo dodali na našu web stranicu opg-mrazmiro.com!

🛒 Webshop – možete naručiti naše proizvode direktno online: likere, rakije, eko proizvode i poklon pakete uz dostavu na kućnu adresu.

⭐ Recenzije – svaki proizvod sada ima mogućnost ostavljanja ocjene i komentara, kako biste lakše odabrali što vam najviše odgovara.

📱 WhatsApp gumb – za brz kontakt s nama dostupan je gumb direktno na stranici.

🍪 Kolačići i privatnost – dodali smo sukladan banner za prihvaćanje kolačića te stranicu s politikom privatnosti.

🔞 Provjera dobi – zbog alkoholnih pića (likeri, rakija), stranica sada traži potvrdu punoljetnosti pri prvom posjetu.

📄 Impressum i uvjeti – sve pravne informacije dostupne su na posebnim stranicama.

🗺️ Sitemap i SEO – stranica je optimizirana za pretraživače kako bi vas što lakše pronašli.

Hvala vam na povjerenju i pratnji – radimo sve kako bi vaše iskustvo na stranici i s našim proizvodima bilo što bolje! 🫒🌿`,
  image_url: null,
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // tjedan dana unazad
};

async function readPosts() {
  try {
    const { blobs } = await list({ prefix: 'posts/posts.json', token: BLOB_TOKEN });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

async function main() {
  console.log('📥  Dohvaćam postojeće objave...');
  const postojeceObjave = await readPosts();
  console.log(`   Pronađeno objava: ${postojeceObjave.length}`);

  // Dodaj novu objavu na kraj (najstarija po datumu)
  const azuriraneObjave = [...postojeceObjave, novaObjava];

  console.log('📤  Spremam u Vercel Blob...');
  await put(POSTS_BLOB, JSON.stringify(azuriraneObjave), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });

  console.log('✅  Objava uspješno dodana!');
  console.log(`   Naslov: "${novaObjava.title}"`);
  console.log(`   ID: ${novaObjava.id}`);
}

main().catch((err) => {
  console.error('❌  Greška:', err.message);
  process.exit(1);
});
