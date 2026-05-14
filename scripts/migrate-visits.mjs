// Skripta za migraciju posjeta iz Vercel Blob u Supabase
// Pokretanje: node scripts/migrate-visits.mjs

import { list, head } from '@vercel/blob';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BACKUP_FILE = 'scripts/visits-backup.json';

if (!BLOB_TOKEN) {
  console.error('❌  Nedostaje BLOB_READ_WRITE_TOKEN');
  process.exit(1);
}

// ── 1. Dohvati posjete iz Vercel Blob ────────────────────────────────────────
async function fetchFromBlob() {
  console.log('📥  Dohvaćam posjete iz Vercel Blob...');
  const { blobs } = await list({ prefix: 'analytics/', token: BLOB_TOKEN });
  console.log(`   Pronađeno bloba: ${blobs.length}`);

  if (!blobs.length) {
    console.log('   Nema podataka u Blob pohrani.');
    return [];
  }

  // Uzmi najnoviji blob
  const blob = blobs.sort((a, b) =>
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )[0];

  console.log(`   Čitam: ${blob.url}`);
  const res = await fetch(blob.url);
  if (!res.ok) {
    console.error(`   Greška pri dohvatu: ${res.status}`);
    return [];
  }

  const visits = await res.json();
  console.log(`✅  Dohvaćeno ${visits.length} posjeta.`);
  return visits;
}

// ── 2. Spremi backup lokalno ─────────────────────────────────────────────────
function saveBackup(visits) {
  writeFileSync(BACKUP_FILE, JSON.stringify(visits, null, 2), 'utf8');
  console.log(`💾  Backup spremljen u: ${BACKUP_FILE}`);
}

// ── 3. Uvezi u Supabase ───────────────────────────────────────────────────────
async function importToSupabase(visits) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('\n⚠️   Supabase kredencijali nisu postavljeni.');
    console.log('    Postavi SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY pa pokreni skriptu ponovo.');
    console.log(`    Podaci su sačuvani lokalno u: ${BACKUP_FILE}`);
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log(`\n📤  Uvozim ${visits.length} posjeta u Supabase...`);

  // Umetni u batch-evima od 500
  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < visits.length; i += BATCH) {
    const chunk = visits.slice(i, i + BATCH).map(v => ({
      page: v.page,
      ts: v.ts,
      ref: v.ref || null,
    }));
    const { error } = await supabase.from('visits').insert(chunk);
    if (error) {
      console.error(`   Greška na batch ${i / BATCH + 1}:`, error.message);
    } else {
      inserted += chunk.length;
      console.log(`   Uvezeno: ${inserted}/${visits.length}`);
    }
  }

  console.log(`\n✅  Migracija završena! Uvezeno ${inserted} posjeta.`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  let visits;

  // Ako postoji lokalni backup, koristi ga
  if (existsSync(BACKUP_FILE) && (!BLOB_TOKEN || process.argv.includes('--from-backup'))) {
    console.log(`📂  Koristim lokalni backup: ${BACKUP_FILE}`);
    visits = JSON.parse(readFileSync(BACKUP_FILE, 'utf8'));
    console.log(`   Učitano ${visits.length} posjeta.`);
  } else {
    visits = await fetchFromBlob();
    if (visits.length > 0) saveBackup(visits);
  }

  if (visits.length > 0) {
    await importToSupabase(visits);
  }
}

main().catch(err => {
  console.error('❌ Greška:', err);
  process.exit(1);
});
