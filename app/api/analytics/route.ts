export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { put, list } from '@vercel/blob';

const BLOB_KEY = 'analytics/visits.json';
const MAX_VISITS = 2000;

interface Visit {
  page: string;
  ts: string; // ISO timestamp
  ref?: string;
}

async function readVisits(): Promise<Visit[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

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

    const visits = await readVisits();
    const newVisit: Visit = { page, ts: new Date().toISOString(), ...(ref ? { ref } : {}) };
    const updated = [...visits, newVisit].slice(-MAX_VISITS);

    await put(BLOB_KEY, JSON.stringify(updated), {
      access: 'public',
      allowOverwrite: true,
      contentType: 'application/json',
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
    const visits = await readVisits();
    const now = new Date();

    const today = visits.filter(v => {
      const d = new Date(v.ts);
      return d.toDateString() === now.toDateString();
    }).length;

    const week = visits.filter(v => {
      const d = new Date(v.ts);
      return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    const month = visits.filter(v => {
      const d = new Date(v.ts);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    // Posjeti po stranici
    const byPage: Record<string, number> = {};
    visits.forEach(v => { byPage[v.page] = (byPage[v.page] || 0) + 1; });
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
    visits.forEach(v => {
      const d = new Date(v.ts);
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 14) {
        const key = d.toLocaleDateString('hr-HR', { day: 'numeric', month: 'numeric' });
        if (key in byDay) byDay[key]++;
      }
    });

    return NextResponse.json({
      total: visits.length,
      today,
      week,
      month,
      topPages,
      byDay: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    });
  } catch {
    return NextResponse.json({ total: 0, today: 0, week: 0, month: 0, topPages: [], byDay: [] });
  }
}
