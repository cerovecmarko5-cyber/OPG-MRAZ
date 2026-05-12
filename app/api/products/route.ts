export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { put, list } from '@vercel/blob';
import { products as hardcodedProducts } from '../../../lib/products';
import { readProducts } from '../../../lib/getProducts';

const PRODUCTS_BLOB = 'products/products.json';

async function writeProducts(products: object[]) {
  await put(PRODUCTS_BLOB, JSON.stringify(products), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const formData = await req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const category = (formData.get('category') as string) || 'Likeri';
  const unit = (formData.get('unit') as string) || 'kom';
  const comingSoon = formData.get('comingSoon') === 'true';
  const inStock = formData.get('inStock') !== 'false';
  const imageFile = formData.get('image') as File | null;

  let image = '/products/placeholder.jpeg';

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `products/images/${Date.now()}.${fileExt}`;
    const blob = await put(fileName, imageFile, { access: 'public', allowOverwrite: true });
    image = blob.url;
  }

  const products = await readProducts();
  const maxId = (products as { id: string }[]).reduce((max, p) => {
    const num = parseInt(p.id);
    return isNaN(num) ? max : Math.max(max, num);
  }, 100);

  const newProduct = { id: String(maxId + 1), name, description, price, image, category, unit, comingSoon, inStock };
  (products as object[]).push(newProduct);
  await writeProducts(products as object[]);

  return NextResponse.json(newProduct, { status: 201 });
}
