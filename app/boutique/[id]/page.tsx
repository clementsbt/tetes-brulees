import Link from 'next/link';
import { notFound } from 'next/navigation';

// Produits factices - à remplacer par des données réelles
const products = [
  {
    id: '1',
    name: 'T-shirt "Têtes Brûlées"',
    price: 25,
    image: '/images/tee-shirt.jpg',
    description: 'T-shirt confortable avec le logo du club.100% coton bio, idéal pour les pilotes.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc', 'Noir', 'Orange'],
  },
  {
    id: '2',
    name: 'Casquette brodée',
    price: 20,
    image: '/images/casquette.jpg',
    description: 'Casquette avec logo brodé. Réglable avec fermeture velcro.',
    sizes: ['Taille unique'],
    colors: ['Blanc', 'Noir', 'Orange'],
  },
  {
    id: '3',
    name: 'Polaire club',
    price: 45,
    image: '/images/polaire.jpg',
    description: 'Polaire chaude et confortable, parfaite pour les soirées d\'hiver après le vol.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gris', 'Noir'],
  },
  {
    id: '4',
    name: 'Débardeur para',
    price: 22,
    image: '/images/debardeur.jpg',
    description: 'Débardeur léger et respirant, idéal pour летнее temps.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Noir'],
  },
  {
    id: '5',
    name: 'Sweat à capuche',
    price: 55,
    image: '/images/sweat.jpg',
    description: 'Sweat à capuche chaud avec logo du club brodé.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gris', 'Noir', 'Orange'],
  },
  {
    id: '6',
    name: 'Autocollants club',
    price: 5,
    image: '/images/autocollant.jpg',
    description: 'Pack de 5 autocollants officiels du club. Résistants aux UV.',
    sizes: ['Taille unique'],
    colors: ['Unique'],
  },
];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-orange-600">
                Accueil
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/boutique" className="text-gray-500 hover:text-orange-600">
                Boutique
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative h-96 md:h-auto bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <p className="text-4xl font-bold text-orange-600 mb-6">
                {product.price}€
              </p>

              <p className="text-gray-600 mb-6">
                {product.description}
              </p>

              {/* Tailles */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille(s) disponible(s) :
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Couleurs */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur(s) disponible(s) :
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bouton commander */}
              <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-colors">
                Commander
              </button>
            </div>
          </div>
        </div>

        {/* Retour */}
        <div className="mt-8 text-center">
          <Link 
            href="/boutique" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
