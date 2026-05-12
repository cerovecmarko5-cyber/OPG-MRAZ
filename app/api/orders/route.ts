export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { list } from '@vercel/blob';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  try {
    const { blobs } = await list({ prefix: 'orders/orders.json' });
    if (!blobs.length) return NextResponse.json([]);
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    const orders = await res.json();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([]);
  }
}
