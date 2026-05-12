import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readProducts } from '../../../lib/getProducts';
import AddToCartButton from '../../../components/AddToCartButton';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const products = await readProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    return { title: 'Proizvod nije pronađen | OPG Mraz' };
  }

  return {
    title: `${product.name} | OPG Mraz`,
    description: `${product.description} Cijena: ${product.price.toFixed(2)} € / ${product.unit || 'kom'}. Naručite online — OPG Mraz, domaći likeri i rakija iz Zagorja.`,
    openGraph: {
      title: `${product.name} | OPG Mraz`,
      description: product.description,
      images: product.image.startsWith('http') ? [product.image] : [`https://opg-mrazmiro.com${product.image}`],
      url: `https://opg-mrazmiro.com/products/${product.id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const products = await readProducts();
  const product = products.find(p => p.id === id);

  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `https://opg-mrazmiro.com${product.image}`,
    brand: { '@type': 'Brand', name: 'OPG Mraz' },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'EUR',
      availability: product.inStock === false || product.comingSoon
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      url: `https://opg-mrazmiro.com/products/${product.id}`,
      seller: { '@type': 'Organization', name: 'OPG Mraz' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="bg-gray-50 rounded-3xl flex items-center justify-center p-8" style={{ minHeight: '420px' }}>
            <img
              src={product.image}
              alt={product.name}
              className="max-h-96 w-full object-contain drop-shadow-xl"
            />
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-xs uppercase tracking-widest text-red-700 font-semibold">{product.category}</span>
            <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-slate-500 leading-7">{product.description}</p>
            <p className="text-3xl font-bold text-red-700">
              {product.price.toFixed(2)} €{' '}
              <span className="text-base font-normal text-slate-400">/ {product.unit || 'kom'}</span>
            </p>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </>
  );
}