import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dobrodošli u OPG Mraz
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Svježi poljoprivredni proizvodi izravno od našeg gospodarstva.
        </p>
        <Link
          href="/products"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Pogledajte naše proizvode
        </Link>
      </div>
    </div>
  );
}
