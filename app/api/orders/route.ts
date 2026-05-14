export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { getSupabase } from '../../../lib/supabase';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json([]);
  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'Nedostaju parametri' }, { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Nedostaje ID' }, { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
