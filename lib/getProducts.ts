import { list } from '@vercel/blob';
import { products as hardcodedProducts } from './products';
import { Product } from './types';

const PRODUCTS_BLOB = 'products/products.json';

export async function readProducts(): Promise<Product[]> {
  try {
    const { blobs } = await list({ prefix: PRODUCTS_BLOB });
    if (!blobs.length) return [...hardcodedProducts];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return [...hardcodedProducts];
  }
}
