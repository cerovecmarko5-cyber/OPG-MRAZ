// Direktna PostgreSQL veza za kreiranje tablica
import pg from 'pg';
import { readFileSync, existsSync } from 'fs';

const { Client } = pg;

// Supabase direct connection
const connectionString = `postgresql://postgres:76AbXMsagVvhOjUW@db.kmyczvxsvydeedbykodp.supabase.co:5432/postgres`;

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
  console.log('🔌  Spajam se na bazu...');
  await client.connect();
  console.log('✅  Spojeno!');

  // Kreiraj tablice
  console.log('🔧  Kreiram tablicu visits...');
  await client.query(`
    create table if not exists visits (
      id bigint generated always as identity primary key,
      page text not null,
      ts timestamptz not null default now(),
      ref text
    );
  `);
  console.log('✅  visits tablica kreirana!');

  console.log('🔧  Kreiram tablicu reviews...');
  await client.query(`
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
  console.log('✅  reviews tablica kreirana!');

  // Uvoz starih posjeta iz backupa
  const BACKUP_FILE = 'scripts/visits-backup.json';
  if (existsSync(BACKUP_FILE)) {
    const visits = JSON.parse(readFileSync(BACKUP_FILE, 'utf8'));
    console.log(`\n📤  Uvozim ${visits.length} starih posjeta...`);
    
    for (const v of visits) {
      await client.query(
        'INSERT INTO visits (page, ts, ref) VALUES ($1, $2, $3)',
        [v.page, v.ts, v.ref || null]
      );
    }
    console.log('✅  Stari posjeti uvezeni!');
  }

  await client.end();
  console.log('\n🎉  Sve gotovo!');
}

main().catch(async err => {
  console.error('❌  Greška:', err.message);
  await client.end().catch(() => {});
  process.exit(1);
});
