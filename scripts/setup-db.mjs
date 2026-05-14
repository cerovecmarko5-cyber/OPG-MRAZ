// Kreiranje tablica i migracija podataka
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Nedostaju SUPABASE_URL ili SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🔧  Kreiram tablice...');

  // Kreiraj visits tablicu
  const { error: e1 } = await supabase.rpc('exec_sql', {
    sql: `create table if not exists visits (
      id bigint generated always as identity primary key,
      page text not null,
      ts timestamptz not null default now(),
      ref text
    );`
  });

  // Ako rpc ne radi, koristimo direktni insert da provjerimo tablicu
  // Tablice se moraju kreirati kroz SQL Editor ili management API

  // Test - pokušaj inserirati test zapis da vidimo status
  const { error: testError } = await supabase.from('visits').select('id').limit(1);
  
  if (testError && testError.code === '42P01') {
    console.log('❌  Tablica visits ne postoji. Trebaš je kreirati u Supabase SQL Editoru.');
    console.log('\nPokreni ovo u Supabase SQL Editoru:');
    console.log(`
create table if not exists visits (
  id bigint generated always as identity primary key,
  page text not null,
  ts timestamptz not null default now(),
  ref text
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  product text,
  created_at timestamptz not null default now(),
  approved boolean not null default false
);
`);
    process.exit(0);
  } else if (!testError) {
    console.log('✅  Tablica visits postoji!');
  } else {
    console.log('ℹ️  Status:', testError.message);
  }

  // Provjeri reviews
  const { error: testError2 } = await supabase.from('reviews').select('id').limit(1);
  if (!testError2) {
    console.log('✅  Tablica reviews postoji!');
  }

  // Uvoz starih posjeta iz backupa
  const BACKUP_FILE = 'scripts/visits-backup.json';
  if (existsSync(BACKUP_FILE)) {
    const visits = JSON.parse(readFileSync(BACKUP_FILE, 'utf8'));
    console.log(`\n📤  Uvozim ${visits.length} starih posjeta...`);
    
    const { error: insertError } = await supabase.from('visits').insert(
      visits.map(v => ({ page: v.page, ts: v.ts, ref: v.ref || null }))
    );
    
    if (insertError) {
      console.error('❌  Greška pri uvozu:', insertError.message);
    } else {
      console.log('✅  Stari posjeti uvezeni!');
    }
  }
}

main().catch(err => {
  console.error('❌  Greška:', err.message);
  process.exit(1);
});
