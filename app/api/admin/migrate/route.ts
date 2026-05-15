import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { getSupabase } from '../../../../lib/supabase';
import { products as hardcodedProducts } from '../../../../lib/products';

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const supabase = getSupabase();
  const results: string[] = [];

  // 1. Kreiraj tablicu posts
  const createPostsSQL = `
    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // 2. Kreiraj tablicu products
  const createProductsSQL = `
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      image TEXT,
      category TEXT DEFAULT 'Likeri',
      unit TEXT DEFAULT 'kom',
      coming_soon BOOLEAN DEFAULT FALSE,
      in_stock BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Pokušaj kreirati tablice
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  for (const [name, sql] of [['posts', createPostsSQL], ['products', createProductsSQL]]) {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ sql }),
    });
    if (res.ok) {
      results.push(`✅ Tablica ${name} kreirana`);
    } else {
      results.push(`⚠️ Tablica ${name}: ${await res.text()}`);
    }
  }

  // 3. Kreiraj Storage buckete
  for (const bucket of ['post-images', 'product-images']) {
    const { error } = await supabase.storage.createBucket(bucket, { public: true });
    if (!error || error.message?.includes('already exists')) {
      results.push(`✅ Bucket ${bucket} postoji`);
    } else {
      results.push(`⚠️ Bucket ${bucket}: ${error.message}`);
    }
  }

  // 4. Sync hardcoded produkte u bazu (upsert)
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

  // Obriši sve stare i ubaci nove
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '__impossible__');
  if (deleteError) {
    results.push(`⚠️ Brisanje starih produkata: ${deleteError.message}`);
  } else {
    results.push(`✅ Stari produkti obrisani`);
  }

  const { error: insertError } = await supabase.from('products').insert(rows);
  if (insertError) {
    results.push(`⚠️ Seed products: ${insertError.message}`);
  } else {
    results.push(`✅ Uneseno ${rows.length} proizvoda`);
  }

  return NextResponse.json({ results });
}
