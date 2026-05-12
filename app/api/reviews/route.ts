import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { auth } from '../../../auth';

export const runtime = 'nodejs';

interface Review {
  id: string;
  name: string;
  rating: number; // 1-5
  text: string;
  product?: string;
  created_at: string;
  approved: boolean;
}

async function getReviews(): Promise<Review[]> {
  try {
    const { blobs } = await list({ prefix: 'reviews/' });
    if (!blobs.length) return [];
    const blob = blobs.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(blob.url);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

async function saveReviews(reviews: Review[]) {
  const { blobs } = await list({ prefix: 'reviews/' });
  for (const b of blobs) await del(b.url);
  await put('reviews/reviews.json', JSON.stringify(reviews), {
    access: 'public',
    contentType: 'application/json',
  });
}

// GET — public: approved reviews; admin: all
export async function GET(req: NextRequest) {
  const session = await auth();
  const isAdmin = !!session;
  const reviews = await getReviews();
  const result = isAdmin ? reviews : reviews.filter(r => r.approved);
  return NextResponse.json(result);
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

  const reviews = await getReviews();
  const newReview: Review = {
    id: Date.now().toString(),
    name: String(name).slice(0, 80),
    rating: Number(rating),
    text: String(text).slice(0, 500),
    product: product ? String(product).slice(0, 80) : undefined,
    created_at: new Date().toISOString(),
    approved: false,
  };
  reviews.unshift(newReview);
  await saveReviews(reviews);
  return NextResponse.json({ success: true });
}

// PATCH — admin: approve a review
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, approved } = await req.json();
  const reviews = await getReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  reviews[idx].approved = approved;
  await saveReviews(reviews);
  return NextResponse.json({ success: true });
}

// DELETE — admin: delete a review
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const reviews = await getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  await saveReviews(filtered);
  return NextResponse.json({ success: true });
}
