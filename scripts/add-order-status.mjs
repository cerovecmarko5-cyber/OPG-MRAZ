import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Provjeri postoji li kolona već
const { error: checkError } = await supabase.from('orders').select('status').limit(1);

if (!checkError) {
  console.log('✅ Kolona status već postoji!');
} else {
  // Pokušaj dodati preko REST API-ja
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ sql: "ALTER TABLE orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';" }),
  });
  
  if (res.ok) {
    console.log('✅ Kolona status dodana!');
  } else {
    console.log('⚠️  Dodaj ručno u Supabase SQL Editor:');
    console.log("ALTER TABLE orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';");
  }
}
