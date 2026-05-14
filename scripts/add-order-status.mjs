import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Provjeri postoji li kolona već
const { error: checkError } = await supabase.from('orders').select('status').limit(1);

if (!checkError) {
  console.log('✅ Kolona status već postoji!');
} else {
  // Pokušaj dodati via REST API
  const sql = "ALTER TABLE orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';";
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (res.ok) {
    console.log('✅ Kolona status dodana!');
  } else {
    console.log('⚠️  exec_sql RPC nije dostupan.');
    console.log('Pokreni ovo u Supabase SQL Editoru (https://supabase.com/dashboard):');
    console.log('');
    console.log(sql);
  }
}
