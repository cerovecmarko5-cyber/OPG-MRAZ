import Link from 'next/link';
import Image from 'next/image';
import { products } from '../../lib/products';

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Naši Proizvodi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Slika: {product.name}</span>
              {/* Placeholder for image */}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold text-green-600 mb-4">{product.price} €/kg</p>
              <Link
                href={`/products/${product.id}`}
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Pogledaj detalje
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}