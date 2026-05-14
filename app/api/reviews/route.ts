import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '../../../lib/supabase';
import { auth } from '../../../auth';

export const runtime = 'nodejs';

// GET — public: approved reviews; admin: all
export async function GET() {
  const session = await auth();
  const isAdmin = !!session;
  const supabase = getSupabase();

  let query = supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    query = query.eq('approved', true);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? []);
}

// POST — submit a new review (public, no auth needed)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, rating, text, product } = body;

  if (!name || !rating || !text) {
    return NextResponse.json({ error: 'Nedostaju podaci' }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Ocjena mora biti 1-5' }, { status: 400 });
  }
  if (text.length > 500) {
    return NextResponse.json({ error: 'Tekst predugačak' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase.from('reviews').insert({
    name: String(name).slice(0, 80),
    rating: Number(rating),
    text: String(text).slice(0, 500),
    product: product ? String(product).slice(0, 80) : null,
    approved: false,
  });

  if (error) return NextResponse.json({ error: 'Greška pri slanju' }, { status: 500 });
  return NextResponse.json({ success: true });
}

// PATCH — admin: approve a review
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, approved } = await req.json();
  const supabase = getSupabase();
  const { error } = await supabase
    .from('reviews')
    .update({ approved })
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Greška pri ažuriranju' }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — admin: delete a review
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const supabase = getSupabase();
  const { error } = await supabase.from('reviews').delete().eq('id', id);

  if (error) return NextResponse.json({ error: 'Greška pri brisanju' }, { status: 500 });
  return NextResponse.json({ success: true });
}
