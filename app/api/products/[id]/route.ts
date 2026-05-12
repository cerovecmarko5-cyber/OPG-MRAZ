export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { put, list } from '@vercel/blob';
import { products as hardcodedProducts } from '../../../../lib/products';

const PRODUCTS_BLOB = 'products/products.json';

async function readProducts() {
  try {
    const { blobs } = await list({ prefix: PRODUCTS_BLOB });
    if (!blobs.length) return [...hardcodedProducts];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return [...hardcodedProducts];
  }
}

async function writeProducts(products: object[]) {
  await put(PRODUCTS_BLOB, JSON.stringify(products), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id } = await params;
  const formData = await req.formData();

  const products = await readProducts();
  const idx = (products as { id: string }[]).findIndex(p => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 });

  const existing = products[idx] as Record<string, unknown>;

  const name = (formData.get('name') as string) || existing.name as string;
  const description = (formData.get('description') as string) || existing.description as string;
  const priceStr = formData.get('price') as string;
  const price = priceStr ? parseFloat(priceStr) : existing.price as number;
  const category = (formData.get('category') as string) || existing.category as string;
  const unit = (formData.get('unit') as string) || (existing.unit as string) || 'kom';
  const comingSoonStr = formData.get('comingSoon');
  const comingSoon = comingSoonStr !== null ? comingSoonStr === 'true' : !!existing.comingSoon;
  const inStockStr = formData.get('inStock');
  const inStock = inStockStr !== null ? inStockStr !== 'false' : ((existing.inStock as boolean) ?? true);

  const imageFile = formData.get('image') as File | null;
  let image = existing.image as string;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `products/images/${Date.now()}.${fileExt}`;
    const blob = await put(fileName, imageFile, { access: 'public', allowOverwrite: true });
    image = blob.url;
  }

  const updated = { ...existing, name, description, price, category, unit, comingSoon, inStock, image };
  products[idx] = updated;
  await writeProducts(products as object[]);

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id } = await params;
  const products = await readProducts();
  const filtered = (products as { id: string }[]).filter(p => p.id !== id);
  await writeProducts(filtered as object[]);

  return NextResponse.json({ success: true });
}
