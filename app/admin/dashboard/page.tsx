'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Tab = 'posts' | 'products' | 'orders' | 'stats' | 'reviews';
type FormMode = null | 'create' | 'edit';

interface Post {
  id: string; title: string; content: string;
  image_url: string | null; created_at: string;
}
interface Product {
  id: string; name: string; description: string; price: number;
  image: string; category: string; unit?: string;
  comingSoon?: boolean; inStock?: boolean;
}
interface OrderItem { product: { name: string; price: number }; quantity: number; }
interface Order {
  id: string; name: string; email: string; phone: string;
  address: string; items: OrderItem[]; total: number; created_at: string;
}
interface AnalyticsData {
  total: number; today: number; week: number; month: number;
  topPages: { page: string; count: number }[];
  byDay: { date: string; count: number }[];
}
interface Review {
  id: string; name: string; rating: number; text: string;
  product?: string; created_at: string; approved: boolean;
}

const CATEGORIES = ['Likeri', 'Rakija', 'EKO', 'Poklon paketi'];

function Toggle({ on, onToggle, colorOn = 'bg-green-500' }: { on: boolean; onToggle: () => void; colorOn?: string }) {
  return (
    <button type="button" onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${on ? colorOn : 'bg-slate-300'}`}>
      <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${on ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('posts');

  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState({ posts: true, products: true, orders: true });

  const [postMode, setPostMode] = useState<FormMode>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postPreview, setPostPreview] = useState<string | null>(null);
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postError, setPostError] = useState('');
  const postFileRef = useRef<HTMLInputElement>(null);

  const [productMode, setProductMode] = useState<FormMode>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCat, setProdCat] = useState('Likeri');
  const [prodUnit, setProdUnit] = useState('kom');
  const [prodComingSoon, setProdComingSoon] = useState(false);
  const [prodInStock, setProdInStock] = useState(true);
  const [prodImage, setProdImage] = useState<File | null>(null);
  const [prodPreview, setProdPreview] = useState<string | null>(null);
  const [prodSubmitting, setProdSubmitting] = useState(false);
  const [prodError, setProdError] = useState('');
  const prodFileRef = useRef<HTMLInputElement>(null);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    const res = await fetch('/api/posts');
    if (res.ok) setPosts(await res.json());
    setLoading(l => ({ ...l, posts: false }));
  }, []);

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/products');
    if (res.ok) setProducts(await res.json());
    setLoading(l => ({ ...l, products: false }));
  }, []);

  const fetchOrders = useCallback(async () => {
    const res = await fetch('/api/orders');
    if (res.ok) setOrders(await res.json());
    setLoading(l => ({ ...l, orders: false }));
  }, []);

  const fetchAnalytics = useCallback(async () => {
    const res = await fetch('/api/analytics');
    if (res.ok) setAnalytics(await res.json());
  }, []);

  const fetchReviews = useCallback(async () => {
    const res = await fetch('/api/reviews');
    if (res.ok) setReviews(await res.json());
  }, []);

  useEffect(() => { fetchPosts(); fetchProducts(); fetchOrders(); fetchAnalytics(); fetchReviews(); }, [fetchPosts, fetchProducts, fetchOrders, fetchAnalytics, fetchReviews]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin');
  };

  const openCreatePost = () => {
    setEditPost(null); setPostTitle(''); setPostContent('');
    setPostImage(null); setPostPreview(null); setPostError('');
    setPostMode('create');
  };
  const openEditPost = (p: Post) => {
    setEditPost(p); setPostTitle(p.title); setPostContent(p.content);
    setPostImage(null); setPostPreview(p.image_url); setPostError('');
    setPostMode('edit');
  };
  const cancelPostForm = () => { setPostMode(null); setEditPost(null); setPostPreview(null); };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostSubmitting(true); setPostError('');
    const fd = new FormData();
    fd.append('title', postTitle); fd.append('content', postContent);
    if (postImage) fd.append('image', postImage);
    const url = postMode === 'edit' && editPost ? `/api/posts/${editPost.id}` : '/api/posts';
    const res = await fetch(url, { method: postMode === 'edit' ? 'PUT' : 'POST', body: fd });
    if (res.ok) {
      cancelPostForm();
      if (postFileRef.current) postFileRef.current.value = '';
      fetchPosts();
    } else {
      const d = await res.json().catch(() => ({}));
      setPostError(d.error || 'Greška. Pokušajte ponovo.');
    }
    setPostSubmitting(false);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Obrisati ovu objavu?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const openCreateProduct = () => {
    setEditProduct(null); setProdName(''); setProdDesc(''); setProdPrice('');
    setProdCat('Likeri'); setProdUnit('kom'); setProdComingSoon(false); setProdInStock(true);
    setProdImage(null); setProdPreview(null); setProdError('');
    setProductMode('create');
  };
  const openEditProduct = (p: Product) => {
    setEditProduct(p); setProdName(p.name); setProdDesc(p.description);
    setProdPrice(String(p.price)); setProdCat(p.category); setProdUnit(p.unit || 'kom');
    setProdComingSoon(!!p.comingSoon); setProdInStock(p.inStock !== false);
    setProdImage(null); setProdPreview(p.image); setProdError('');
    setProductMode('edit');
  };
  const cancelProductForm = () => { setProductMode(null); setEditProduct(null); setProdPreview(null); };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdSubmitting(true); setProdError('');
    const fd = new FormData();
    fd.append('name', prodName); fd.append('description', prodDesc);
    fd.append('price', prodPrice); fd.append('category', prodCat);
    fd.append('unit', prodUnit); fd.append('comingSoon', String(prodComingSoon));
    fd.append('inStock', String(prodInStock));
    if (prodImage) fd.append('image', prodImage);
    const url = productMode === 'edit' && editProduct ? `/api/products/${editProduct.id}` : '/api/products';
    const res = await fetch(url, { method: productMode === 'edit' ? 'PUT' : 'POST', body: fd });
    if (res.ok) {
      cancelProductForm();
      if (prodFileRef.current) prodFileRef.current.value = '';
      fetchProducts();
    } else {
      const d = await res.json().catch(() => ({}));
      setProdError(d.error || 'Greška. Pokušajte ponovo.');
    }
    setProdSubmitting(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Obrisati ovaj proizvod?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const toggleInStock = async (p: Product) => {
    const fd = new FormData();
    fd.append('inStock', String(p.inStock === false));
    await fetch(`/api/products/${p.id}`, { method: 'PUT', body: fd });
    fetchProducts();
  };

  const toggleComingSoon = async (p: Product) => {
    const fd = new FormData();
    fd.append('comingSoon', String(!p.comingSoon));
    await fetch(`/api/products/${p.id}`, { method: 'PUT', body: fd });
    fetchProducts();
  };

  const renderPostForm = () => (
    <form onSubmit={handlePostSubmit} className="space-y-4 pb-4">
      <div className="flex items-center gap-3 mb-1">
        <button type="button" onClick={cancelPostForm} className="text-red-700 font-medium text-sm">← Natrag</button>
        <h2 className="font-bold text-slate-900 text-lg">{postMode === 'create' ? 'Nova objava' : 'Uredi objavu'}</h2>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Naslov</label>
        <input type="text" value={postTitle} onChange={e => setPostTitle(e.target.value)} required
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
          placeholder="npr. Akcija na šljivovicu" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tekst</label>
        <textarea value={postContent} onChange={e => setPostContent(e.target.value)} required rows={5}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-base"
          placeholder="Napišite obavijest, akciju ili vijest..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Slika {postMode === 'edit' ? '(ostavi prazno za zadržavanje postojeće)' : '(neobavezno)'}
        </label>
        {postPreview && <img src={postPreview} alt="" className="mb-2 rounded-xl max-h-48 object-cover w-full" />}
        <input type="file" accept="image/*" ref={postFileRef}
          onChange={e => { const f = e.target.files?.[0] || null; setPostImage(f); if (f) setPostPreview(URL.createObjectURL(f)); }}
          className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-red-50 file:text-red-700 file:font-semibold" />
      </div>
      {postError && <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl">{postError}</p>}
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={postSubmitting}
          className="flex-1 bg-red-700 text-white py-3 rounded-xl font-semibold disabled:opacity-60 text-base">
          {postSubmitting ? 'Spremate...' : 'Spremi'}
        </button>
        <button type="button" onClick={cancelPostForm}
          className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold text-base">
          Odustani
        </button>
      </div>
    </form>
  );

  const renderPostsList = () => (
    <>
      <button onClick={openCreatePost} className="w-full mb-5 bg-red-700 text-white py-3.5 rounded-xl font-semibold text-base">
        + Nova objava
      </button>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sve objave ({posts.length})</p>
      {loading.posts ? <p className="text-center text-slate-400 py-8">Učitavam...</p> :
        posts.length === 0 ? <div className="text-center text-slate-400 py-10 bg-white rounded-2xl">Nema objava. Dodajte prvu!</div> :
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex gap-3">
                {p.image_url && <img src={p.image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(p.created_at).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.content}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEditPost(p)} className="flex-1 text-sm bg-slate-100 text-slate-700 py-2.5 rounded-xl font-medium">✏️ Uredi</button>
                <button onClick={() => handleDeletePost(p.id)} className="flex-1 text-sm bg-red-50 text-red-700 py-2.5 rounded-xl font-medium">🗑️ Obriši</button>
              </div>
            </div>
          ))}
        </div>
      }
    </>
  );

  const renderProductForm = () => (
    <form onSubmit={handleProductSubmit} className="space-y-4 pb-4">
      <div className="flex items-center gap-3 mb-1">
        <button type="button" onClick={cancelProductForm} className="text-red-700 font-medium text-sm">← Natrag</button>
        <h2 className="font-bold text-slate-900 text-lg">{productMode === 'create' ? 'Novi proizvod' : 'Uredi proizvod'}</h2>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Naziv</label>
        <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} required
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
          placeholder="npr. Višnjevac 0.7L" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Opis</label>
        <textarea value={prodDesc} onChange={e => setProdDesc(e.target.value)} required rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-base"
          placeholder="Kratki opis proizvoda..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cijena (EUR)</label>
          <input type="number" step="0.50" min="0" value={prodPrice} onChange={e => setProdPrice(e.target.value)} required
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
            placeholder="17.00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Jedinica</label>
          <input type="text" value={prodUnit} onChange={e => setProdUnit(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
            placeholder="kom" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kategorija</label>
        <select value={prodCat} onChange={e => setProdCat(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-base bg-white">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Slika {productMode === 'edit' ? '(ostavi prazno za zadržavanje)' : ''}
        </label>
        {prodPreview && (
          <img src={prodPreview} alt="" className="mb-2 rounded-xl max-h-40 object-contain w-full bg-slate-50" />
        )}
        <input type="file" accept="image/*" ref={prodFileRef}
          onChange={e => { const f = e.target.files?.[0] || null; setProdImage(f); if (f) setProdPreview(URL.createObjectURL(f)); }}
          className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-red-50 file:text-red-700 file:font-semibold" />
      </div>
      <div className="bg-slate-50 rounded-xl p-4 space-y-4">
        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-slate-700">Dostupno za narudžbu</p>
            <p className="text-xs text-slate-400 mt-0.5">Kupci mogu naručiti ovaj proizvod</p>
          </div>
          <Toggle on={prodInStock} onToggle={() => setProdInStock(!prodInStock)} colorOn="bg-green-500" />
        </label>
        <div className="h-px bg-slate-200" />
        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-slate-700">Uskoro u ponudi</p>
            <p className="text-xs text-slate-400 mt-0.5">Prikazuje se s oznakom "Uskoro"</p>
          </div>
          <Toggle on={prodComingSoon} onToggle={() => setProdComingSoon(!prodComingSoon)} colorOn="bg-amber-500" />
        </label>
      </div>
      {prodError && <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl">{prodError}</p>}
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={prodSubmitting}
          className="flex-1 bg-red-700 text-white py-3 rounded-xl font-semibold disabled:opacity-60 text-base">
          {prodSubmitting ? 'Spremate...' : 'Spremi'}
        </button>
        <button type="button" onClick={cancelProductForm}
          className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold text-base">
          Odustani
        </button>
      </div>
    </form>
  );

  const renderProductsList = () => (
    <>
      <button onClick={openCreateProduct} className="w-full mb-5 bg-red-700 text-white py-3.5 rounded-xl font-semibold text-base">
        + Novi proizvod
      </button>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Svi proizvodi ({products.length})</p>
      {loading.products ? <p className="text-center text-slate-400 py-8">Učitavam...</p> :
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex gap-3 items-start mb-3">
                <img src={p.image} alt={p.name}
                  className="w-16 h-16 rounded-xl object-contain bg-slate-50 flex-shrink-0 border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 leading-tight">{p.name}</p>
                  <p className="text-red-700 font-bold text-lg">{p.price.toFixed(2)} €</p>
                  <p className="text-xs text-slate-400">{p.category} · {p.unit || 'kom'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button onClick={() => toggleInStock(p)}
                  className={`text-xs py-2.5 rounded-xl font-semibold transition ${p.inStock !== false ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                  {p.inStock !== false ? '✓ Dostupno' : '✗ Rasprodano'}
                </button>
                <button onClick={() => toggleComingSoon(p)}
                  className={`text-xs py-2.5 rounded-xl font-semibold transition ${p.comingSoon ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'}`}>
                  {p.comingSoon ? '⏳ Uskoro' : '○ Nije uskoro'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => openEditProduct(p)} className="text-sm bg-slate-100 text-slate-700 py-2.5 rounded-xl font-medium">✏️ Uredi</button>
                <button onClick={() => handleDeleteProduct(p.id)} className="text-sm bg-red-50 text-red-700 py-2.5 rounded-xl font-medium">🗑️ Obriši</button>
              </div>
            </div>
          ))}
        </div>
      }
    </>
  );

  const renderOrders = () => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    return (
      <>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Narudžbi ukupno</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Prihod ukupno</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{totalRevenue.toFixed(0)} €</p>
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sve narudžbe</p>
        {loading.orders ? <p className="text-center text-slate-400 py-8">Učitavam...</p> :
          orders.length === 0
            ? <div className="text-center text-slate-400 py-10 bg-white rounded-2xl">Nema narudžbi još.</div>
            : <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button className="w-full p-4 text-left" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{o.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(o.created_at).toLocaleDateString('hr-HR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' · '}
                            {new Date(o.created_at).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {o.items.map(i => `${i.product.name} ×${i.quantity}`).join(', ')}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-bold text-red-700 text-lg">{o.total.toFixed(2)} €</span>
                          <p className="text-xs text-slate-400 mt-0.5">{expandedOrder === o.id ? '▲' : '▼'}</p>
                        </div>
                      </div>
                    </button>
                    {expandedOrder === o.id && (
                      <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-1.5">
                        <p className="text-sm text-slate-600">📧 <a href={`mailto:${o.email}`} className="underline">{o.email}</a></p>
                        <p className="text-sm text-slate-600">📞 <a href={`tel:${o.phone}`} className="underline">{o.phone}</a></p>
                        <p className="text-sm text-slate-600">📍 {o.address}</p>
                        <div className="mt-3 space-y-1 bg-slate-50 rounded-xl p-3">
                          {o.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm text-slate-700">
                              <span className="truncate mr-2">{item.product.name} × {item.quantity}</span>
                              <span className="flex-shrink-0 font-medium">{(item.product.price * item.quantity).toFixed(2)} €</span>
                            </div>
                          ))}
                          <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-900">
                            <span>Ukupno</span>
                            <span>{o.total.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
        }
      </>
    );
  };

  const renderStats = () => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const now = new Date();
    const thisMonth = orders.filter(o => {
      const d = new Date(o.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthRevenue = thisMonth.reduce((sum, o) => sum + o.total, 0);
    const availableProducts = products.filter(p => p.inStock !== false && !p.comingSoon).length;
    const topProducts: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(i => {
      topProducts[i.product.name] = (topProducts[i.product.name] || 0) + i.quantity;
    }));
    const topList = Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxDayCount = analytics ? Math.max(...analytics.byDay.map(d => d.count), 1) : 1;

    return (
      <>
        {/* POSJETI STRANICE */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Posjeti stranice</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Danas', value: analytics ? String(analytics.today) : '…', color: 'text-blue-700' },
            { label: 'Ovaj tjedan', value: analytics ? String(analytics.week) : '…', color: 'text-blue-700' },
            { label: 'Ovaj mjesec', value: analytics ? String(analytics.month) : '…', color: 'text-indigo-700' },
            { label: 'Ukupno posjeta', value: analytics ? String(analytics.total) : '…', color: 'text-slate-900' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-slate-400 leading-tight">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* GRAFIKON - zadnjih 14 dana */}
        {analytics && analytics.byDay.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Posjeti po danu (14 dana)</p>
            <div className="flex items-end gap-1 h-24">
              {analytics.byDay.map(d => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-red-600 rounded-sm transition-all"
                    style={{ height: `${Math.max(4, (d.count / maxDayCount) * 80)}px` }}
                    title={`${d.date}: ${d.count}`}
                  />
                  <span className="text-[8px] text-slate-400 rotate-45 origin-left">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Najpopularnije stranice */}
        {analytics && analytics.topPages.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Najposjecenije stranice</p>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              {analytics.topPages.map((p, i) => (
                <div key={p.page} className={`flex justify-between items-center px-4 py-3 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                  <span className="text-sm text-slate-700 truncate mr-2">{p.page === '/' ? 'Početna' : p.page}</span>
                  <span className="text-sm font-bold text-blue-700 flex-shrink-0">{p.count}×</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* NARUDŽBE */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Pregled narudžbi</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Ukupno narudžbi', value: String(orders.length), color: 'text-slate-900' },
            { label: 'Ukupni prihod', value: `${totalRevenue.toFixed(0)} €`, color: 'text-green-700' },
            { label: 'Narudžbi ovaj mj.', value: String(thisMonth.length), color: 'text-blue-700' },
            { label: 'Prihod ovaj mj.', value: `${thisMonthRevenue.toFixed(0)} €`, color: 'text-blue-700' },
            { label: 'Dostupnih proi.', value: String(availableProducts), color: 'text-slate-900' },
            { label: 'Ukupno objava', value: String(posts.length), color: 'text-slate-900' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-slate-400 leading-tight">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        {topList.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Najprodavaniji proizvodi</p>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {topList.map(([name, qty], i) => (
                <div key={name} className={`flex justify-between items-center px-4 py-3 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                  <span className="text-sm text-slate-700 truncate mr-2">{i + 1}. {name}</span>
                  <span className="text-sm font-bold text-slate-900 flex-shrink-0">{qty} kom</span>
                </div>
              ))}
            </div>
          </>
        )}
        {orders.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-3">Zadnjih 5 narudžbi</p>
            <div className="space-y-2">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{o.name}</p>
                    <p className="text-xs text-slate-400">{new Date(o.created_at).toLocaleDateString('hr-HR')}</p>
                  </div>
                  <span className="font-bold text-red-700 text-sm flex-shrink-0">{o.total.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  const renderReviews = () => {
    const pending = reviews.filter(r => !r.approved);
    const approved = reviews.filter(r => r.approved);

    const toggleApprove = async (id: string, approved: boolean) => {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });
      fetchReviews();
    };

    const deleteReview = async (id: string) => {
      if (!confirm('Obriši recenziju?')) return;
      await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchReviews();
    };

    const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

    const ReviewCard = ({ r }: { r: Review }) => (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-amber-400 text-sm font-bold mr-2">{stars(r.rating)}</span>
            <span className="font-semibold text-slate-900 text-sm">{r.name}</span>
            {r.product && <span className="text-xs text-slate-400 ml-2">— {r.product}</span>}
          </div>
          <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('hr-HR')}</span>
        </div>
        <p className="text-sm text-slate-700 mb-3">{r.text}</p>
        <div className="flex gap-2">
          <button
            onClick={() => toggleApprove(r.id, !r.approved)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${r.approved ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          >
            {r.approved ? 'Ukloni odobrenje' : '✓ Odobri'}
          </button>
          <button
            onClick={() => deleteReview(r.id)}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition"
          >
            Obriši
          </button>
        </div>
      </div>
    );

    return (
      <>
        {pending.length > 0 && (
          <>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">
              Na čekanju ({pending.length})
            </p>
            <div className="space-y-3 mb-6">
              {pending.map(r => <ReviewCard key={r.id} r={r} />)}
            </div>
          </>
        )}
        {approved.length > 0 && (
          <>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3">
              Odobreno ({approved.length})
            </p>
            <div className="space-y-3">
              {approved.map(r => <ReviewCard key={r.id} r={r} />)}
            </div>
          </>
        )}
        {reviews.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">⭐</p>
            <p>Još nema recenzija</p>
          </div>
        )}
      </>
    );
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'posts', label: 'Objave', icon: '📝' },
    { id: 'products', label: 'Proizvodi', icon: '🛒' },
    { id: 'orders', label: 'Narudžbe', icon: '📦' },
    { id: 'reviews', label: 'Recenzije', icon: '⭐' },
    { id: 'stats', label: 'Statistike', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="bg-red-700 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-lg">
        <h1 className="font-bold text-lg">Admin — OPG Mraz</h1>
        <button onClick={handleLogout} className="text-sm bg-white/20 px-4 py-1.5 rounded-full hover:bg-white/30 transition">
          Odjava
        </button>
      </div>
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-28">
        {tab === 'posts' && (postMode !== null ? renderPostForm() : renderPostsList())}
        {tab === 'products' && (productMode !== null ? renderProductForm() : renderProductsList())}
        {tab === 'orders' && renderOrders()}
        {tab === 'reviews' && renderReviews()}
        {tab === 'stats' && renderStats()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-10">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setPostMode(null); setProductMode(null); }}
              className={`flex-1 flex flex-col items-center py-3 transition-colors ${tab === t.id ? 'text-red-700' : 'text-slate-400 hover:text-slate-600'}`}>
              <span className="text-2xl leading-none">{t.icon}</span>
              <span className={`text-[10px] font-semibold mt-1 uppercase tracking-wide ${tab === t.id ? 'text-red-700' : 'text-slate-400'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
