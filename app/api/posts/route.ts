import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { getSupabase } from '../../../lib/supabase';

// GET - dohvati sve objave (javno)
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json([]);
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}

// POST - dodaj novu objavu (samo admin)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const formData = await req.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const imageFile = formData.get('image') as File | null;

  const supabase = getSupabase();
  let image_url: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, buffer, { contentType: imageFile.type, upsert: true });
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(uploadData.path);
      image_url = urlData.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, image_url })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
