import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { getSupabase } from '../../../../lib/supabase';

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const supabase = getSupabase();

  // Provjeri postoji li kolona
  const { error: checkError } = await supabase.from('orders').select('status').limit(1);
  if (!checkError) {
    return NextResponse.json({ ok: true, message: 'Kolona status već postoji' });
  }

  // Dodaj kolonu direktno kroz Supabase Admin API
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ sql: "ALTER TABLE orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';" }),
  });

  if (res.ok) {
    return NextResponse.json({ ok: true, message: 'Kolona status uspješno dodana!' });
  }

  // Ako rpc ne radi, vrati SQL za ručno izvršavanje
  return NextResponse.json({
    ok: false,
    message: 'Pokreni ovo u Supabase SQL Editoru:',
    sql: "ALTER TABLE orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';"
  });
}
