import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { put, list } from '@vercel/blob';

const POSTS_BLOB = 'posts/posts.json';

async function readPosts() {
  try {
    const { blobs } = await list({ prefix: 'posts/posts.json' });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

async function writePosts(posts: object[]) {
  await put(POSTS_BLOB, JSON.stringify(posts), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

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

  const posts = await readPosts();
  const idx = (posts as { id: string }[]).findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 });

  const existing = posts[idx] as Record<string, unknown>;
  let image_url = existing.image_url as string | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `posts/images/${Date.now()}.${fileExt}`;
    const blob = await put(fileName, imageFile, { access: 'public', allowOverwrite: true });
    image_url = blob.url;
  }

  const updated = { ...existing, title: title || existing.title, content: content || existing.content, image_url };
  posts[idx] = updated;
  await writePosts(posts);

  return NextResponse.json(updated);
}

// DELETE - obriši objavu (samo admin)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const { id } = await params;
  const posts = await readPosts();
  const filtered = (posts as { id: string }[]).filter((p) => p.id !== id);
  await writePosts(filtered);

  return NextResponse.json({ success: true });
}
