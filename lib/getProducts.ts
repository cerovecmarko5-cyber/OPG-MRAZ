import { getSupabase } from './supabase';
import { products as hardcodedProducts } from './products';
import { Product } from './types';

export async function readProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error || !data || data.length === 0) {
      return [...hardcodedProducts];
    }

    return data.map((p: Record<string, unknown>) => ({
      id: String(p.id),
      name: p.name as string,
      description: p.description as string,
      price: p.price as number,
      image: p.image as string,
      category: p.category as string,
      unit: (p.unit as string) || 'kom',
      comingSoon: !!(p.coming_soon),
      inStock: p.in_stock !== false,
    }));
  } catch {
    return [...hardcodedProducts];
  }
}
