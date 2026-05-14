export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { getSupabase } from '../../../lib/supabase';

// POST — bilježi posjet (javno, bez autentikacije)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page = (body.page || '/').slice(0, 100);
    const ref = (body.ref || '').slice(0, 200);

    // Ignoriraj admin posjete i API pozive
    if (page.startsWith('/admin') || page.startsWith('/api')) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabase();
    await supabase.from('visits').insert({
      page,
      ref: ref || null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

// GET — statistika (samo admin)
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  try {
    const supabase = getSupabase();
    const now = new Date();

    // Ukupno
    const { count: total } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true });

    // Danas
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const { count: today } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('ts', todayStart.toISOString());

    // Ovaj tjedan (7 dana)
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { count: week } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('ts', weekStart.toISOString());

    // Ovaj mjesec
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const { count: month } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('ts', monthStart.toISOString());

    // Top stranice
    const { data: allVisits } = await supabase
      .from('visits')
      .select('page');

    const byPage: Record<string, number> = {};
    (allVisits ?? []).forEach((v: { page: string }) => {
      byPage[v.page] = (byPage[v.page] || 0) + 1;
    });
    const topPages = Object.entries(byPage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([page, count]) => ({ page, count }));

    // Posjeti po danu (zadnjih 14 dana)
    const byDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('hr-HR', { day: 'numeric', month: 'numeric' });
      byDay[key] = 0;
    }
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const { data: recentVisits } = await supabase
      .from('visits')
      .select('ts')
      .gte('ts', fourteenDaysAgo.toISOString());

    (recentVisits ?? []).forEach((v: { ts: string }) => {
      const d = new Date(v.ts);
      const key = d.toLocaleDateString('hr-HR', { day: 'numeric', month: 'numeric' });
      if (key in byDay) byDay[key]++;
    });

    return NextResponse.json({
      total: total ?? 0,
      today: today ?? 0,
      week: week ?? 0,
      month: month ?? 0,
      topPages,
      byDay: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    });
  } catch {
    return NextResponse.json({ total: 0, today: 0, week: 0, month: 0, topPages: [], byDay: [] });
  }
}
