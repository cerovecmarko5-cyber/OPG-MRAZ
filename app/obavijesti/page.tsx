export const dynamic = 'force-dynamic';

import { getSupabase } from '../../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export default async function ObavijestPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Novosti</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Obavijesti i akcije</h1>
        <p className="mt-3 text-slate-500">Pratite naše najnovije vijesti, akcije i posebne ponude.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">Trenutno nema objava.</p>
          <p className="text-sm mt-2">Provjerite ponovo uskoro!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-6">
                <p className="text-sm text-slate-400">
                  {new Date(post.created_at).toLocaleDateString('hr-HR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{post.title}</h2>
                <p className="mt-3 text-slate-600 leading-7 whitespace-pre-line">{post.content}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
