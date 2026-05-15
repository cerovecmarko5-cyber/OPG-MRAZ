import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { getSupabase } from '../../../../lib/supabase';
import { products as hardcodedProducts } from '../../../../lib/products';

const SEED_POSTS = [
  {
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
    image_url: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'OPG Mraz u medijima – zagorsko maslinovo ulje privuklo pažnju cijele Hrvatske',
    content: `Priča o prvom zagorskom ekstradjevičanskom maslinovom ulju koju je stvorio Miro Mraz s OPG-a Mraz u Kozjaku Začretskom privukla je veliku medijsku pažnju diljem Hrvatske.

📰 Jutarnji list (1. travnja 2023.) u intervjuu s Mirom Mrazom otkriva kako je sve počelo: "Kao poljoprivredniku kojega zanimaju novi izazovi i za Zagorje netipični nasadi, uvijek mi je bila želja posaditi masline. Nakon što je izašla ta prvoaprilska šala, pomislio sam zašto šalu ne pretvoriti u stvarnost."

📰 Novi list (5. prosinca 2023.) donosi opširan reportažni članak pod naslovom "Čudo u bregima" u kojemu opisuje kako je Miro od 30 stabala dobio 26 kila ploda i iscijedio prve dvije i pol litre povijesnog ulja – sasvim samouko, u vinskoj preši. Degustatori su bili zabezeknuti: "Super je ulje! Super!"

📰 Nacional (srpanj 2025.) u svom gastro prilogu opisuje kušaonicu u okrugloj kamenoj kućici s pogledom na maslinik te planove za proširenje: "Poznavatelji kažu da njegovo ulje ima idealnu gorčinu, jače izraženu pikantnost i predivan okus po plodu masline."

Hvala svima koji su prepoznali jedinstvenost naše priče. OPG Mraz nastavlja s radom i proširenjem – sljedeća sezona donosi još više zagorskog ulja i novih iznenađenja! 🫒`,
    image_url: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const supabase = getSupabase();
  const results: string[] = [];

  // 1. Kreiraj Storage buckete
  for (const bucket of ['post-images', 'product-images']) {
    const { error } = await supabase.storage.createBucket(bucket, { public: true });
    if (!error || error.message?.includes('already exists')) {
      results.push(`✅ Bucket ${bucket} postoji`);
    } else {
      results.push(`⚠️ Bucket ${bucket}: ${error.message}`);
    }
  }

  // 2. Unesi hardcoded produkte (ako tablica prazna)
  const { data: existingProducts, error: productsCountError } = await supabase
    .from('products')
    .select('id')
    .limit(1);

  if (!productsCountError && existingProducts && existingProducts.length === 0) {
    const rows = hardcodedProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      unit: p.unit || 'kom',
      coming_soon: !!(p.comingSoon),
      in_stock: p.inStock !== false,
    }));
    const { error: insertError } = await supabase.from('products').insert(rows);
    if (insertError) {
      results.push(`⚠️ Seed products: ${insertError.message}`);
    } else {
      results.push(`✅ Uneseno ${rows.length} proizvoda`);
    }
  } else if (!productsCountError && existingProducts && existingProducts.length > 0) {
    results.push(`ℹ️ Produkti već postoje u bazi`);
  } else {
    results.push(`⚠️ Tablica products ne postoji: ${productsCountError?.message}`);
  }

  // 3. Unesi objave (ako tablica prazna)
  const { data: existingPosts, error: postsCountError } = await supabase
    .from('posts')
    .select('id')
    .limit(1);

  if (!postsCountError && existingPosts && existingPosts.length === 0) {
    const { error: insertPostsError } = await supabase.from('posts').insert(SEED_POSTS);
    if (insertPostsError) {
      results.push(`⚠️ Seed posts: ${insertPostsError.message}`);
    } else {
      results.push(`✅ Unesene ${SEED_POSTS.length} objave`);
    }
  } else if (!postsCountError && existingPosts && existingPosts.length > 0) {
    results.push(`ℹ️ Objave već postoje u bazi`);
  } else {
    results.push(`⚠️ Tablica posts ne postoji: ${postsCountError?.message}`);
  }

  return NextResponse.json({ results });
}
