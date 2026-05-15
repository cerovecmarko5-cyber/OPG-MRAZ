export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { getSupabase } from '../../../lib/supabase';
import { readProducts } from '../../../lib/getProducts';

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

  const supabase = getSupabase();
  let image = '/products/placeholder.jpeg';

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, { contentType: imageFile.type, upsert: true });
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(uploadData.path);
      image = urlData.publicUrl;
    }
  }

  const { data: maxRow } = await supabase
    .from('products')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
  const maxId = maxRow && maxRow.length > 0 ? (parseInt(maxRow[0].id) || 100) : 100;

  const { data, error } = await supabase.from('products').insert({
    id: String(maxId + 1),
    name, description, price, image, category, unit,
    coming_soon: comingSoon,
    in_stock: inStock,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, comingSoon: data.coming_soon, inStock: data.in_stock }, { status: 201 });
}
