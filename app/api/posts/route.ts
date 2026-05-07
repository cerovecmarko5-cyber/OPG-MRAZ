import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { put, list, head } from '@vercel/blob';

const POSTS_BLOB = 'posts/posts.json';

async function readPosts() {
  try {
    const { blobs } = await list({ prefix: 'posts/posts.json' });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url);
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

// GET - dohvati sve objave (javno)
export async function GET() {
  const posts = await readPosts();
  return NextResponse.json(posts);
}

// POST - dodaj novu objavu (samo admin)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Nije autorizirano' }, { status: 401 });

  const formData = await req.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const imageFile = formData.get('image') as File | null;

  let image_url: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `posts/images/${Date.now()}.${fileExt}`;
    const blob = await put(fileName, imageFile, {
      access: 'public',
      allowOverwrite: true,
    });
    image_url = blob.url;
  }

  const posts = await readPosts();
  const newPost = {
    id: crypto.randomUUID(),
    title,
    content,
    image_url,
    created_at: new Date().toISOString(),
  };
  posts.unshift(newPost);
  await writePosts(posts);

  return NextResponse.json(newPost);
}
