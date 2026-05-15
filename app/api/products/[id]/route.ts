export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { getSupabase } from '../../../../lib/supabase';
import { readProducts } from '../../../../lib/getProducts';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id } = await params;
  const formData = await req.formData();

  const supabase = getSupabase();

  // Provjeri postoji li u Supabase, ako ne — dohvati iz hardcoded i umetni
  let { data: existing } = await supabase.from('products').select('*').eq('id', id).single();

  if (!existing) {
    // Proizvod je hardcoded, moramo ga upisati u Supabase prvi put
    const all = await readProducts();
    const found = (all as { id: string }[]).find(p => p.id === id) as Record<string, unknown> | undefined;
    if (!found) return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 });
    // Upiši u Supabase
    await supabase.from('products').insert({
      id: found.id,
      name: found.name,
      description: found.description,
      price: found.price,
      image: found.image,
      category: found.category,
      unit: found.unit || 'kom',
      coming_soon: !!(found.comingSoon),
      in_stock: found.inStock !== false,
    });
    const { data: freshData } = await supabase.from('products').select('*').eq('id', id).single();
    existing = freshData;
    if (!existing) return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 });
  }

  const name = (formData.get('name') as string) || existing.name;
  const description = (formData.get('description') as string) || existing.description;
  const priceStr = formData.get('price') as string;
  const price = priceStr ? parseFloat(priceStr) : existing.price;
  const category = (formData.get('category') as string) || existing.category;
  const unit = (formData.get('unit') as string) || existing.unit || 'kom';
  const comingSoonStr = formData.get('comingSoon');
  const comingSoon = comingSoonStr !== null ? comingSoonStr === 'true' : !!(existing.coming_soon);
  const inStockStr = formData.get('inStock');
  const inStock = inStockStr !== null ? inStockStr !== 'false' : (existing.in_stock !== false);

  let image = existing.image;

  if (formData.get('image') instanceof File) {
    const imageFile = formData.get('image') as File;
    if (imageFile.size > 0) {
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
  }

  const { data, error } = await supabase
    .from('products')
    .update({ name, description, price, category, unit, coming_soon: comingSoon, in_stock: inStock, image })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, comingSoon: data.coming_soon, inStock: data.in_stock });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabase();

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
