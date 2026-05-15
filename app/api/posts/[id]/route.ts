import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { getSupabase } from '../../../../lib/supabase';

// PUT - uredi objavu (samo admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id } = await params;
  const formData = await req.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const imageFile = formData.get('image') as File | null;

  const supabase = getSupabase();

  const { data: existing } = await supabase.from('posts').select('*').eq('id', id).single();
  if (!existing) return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 });

  let image_url = existing.image_url;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, buffer, { contentType: imageFile.type, upsert: true });
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(uploadData.path);
      image_url = urlData.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from('posts')
    .update({
      title: title || existing.title,
      content: content || existing.content,
      image_url,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - obriši objavu (samo admin)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabase();

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
