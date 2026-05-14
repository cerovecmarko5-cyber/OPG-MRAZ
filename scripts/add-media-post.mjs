// Skripta za dodavanje objave "U medijima" u Vercel Blob
// Pokretanje: node scripts/add-media-post.mjs

import { put, list } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const POSTS_BLOB = 'posts/posts.json';

if (!BLOB_TOKEN) {
  console.error('❌  Nedostaje BLOB_READ_WRITE_TOKEN u .env.local');
  process.exit(1);
}

const novaObjava = {
  id: crypto.randomUUID(),
  title: 'OPG Mraz u medijima – zagorsko maslinovo ulje privuklo pažnju cijele Hrvatske',
  content: `Priča o prvom zagorskom ekstradjevičanskom maslinovom ulju koju je stvorio Miro Mraz s OPG-a Mraz u Kozjaku Začretskom privukla je veliku medijsku pažnju diljem Hrvatske.

📰 Jutarnji list (1. travnja 2023.) u intervjuu s Mirom Mrazom otkriva kako je sve počelo: "Kao poljoprivredniku kojega zanimaju novi izazovi i za Zagorje netipični nasadi, uvijek mi je bila želja posaditi masline. Nakon što je izašla ta prvoaprilska šala, pomislio sam zašto šalu ne pretvoriti u stvarnost."

📰 Novi list (5. prosinca 2023.) donosi opširan reportažni članak pod naslovom "Čudo u bregima" u kojemu opisuje kako je Miro od 30 stabala dobio 26 kila ploda i iscijedio prve dvije i pol litre povijesnog ulja – sasvim samouko, u vinskoj preši. Degustatori su bili zabezeknuti: "Super je ulje! Super!"

📰 Nacional (srpanj 2025.) u svom gastro prilogu opisuje kušaonicu u okrugloj kamenoj kućici s pogledom na maslinik te planove za proširenje: "Poznavatelji kažu da njegovo ulje ima idealnu gorčinu, jače izraženu pikantnost i predivan okus po plodu masline."

Hvala svima koji su prepoznali jedinstvenost naše priče. OPG Mraz nastavlja s radom i proširenjem – sljedeća sezona donosi još više zagorskog ulja i novih iznenađenja! 🫒`,
  image_url: null,
  created_at: new Date().toISOString(),
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

  const azuriraneObjave = [novaObjava, ...postojeceObjave];

  console.log('📤  Spremam novu objavu u Vercel Blob...');
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
