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
