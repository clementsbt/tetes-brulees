'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Produits - à remplacer par des données réelles
const products = [
  {
    id: '1',
    name: 'T-shirt "Têtes Brûlées"',
    price: 25,
    image: '/images/tee-shirt.jpg',
    description: 'T-shirt confortable avec le logo du club',
  },
  {
    id: '2',
    name: 'Casquette brodée',
    price: 20,
    image: '/images/casquette.jpg',
    description: 'Casquette avec logo brodé',
  },
  {
    id: '3',
    name: 'Polaire club',
    price: 45,
    image: '/images/polaire.jpg',
    description: 'Polaire warm et confortable',
  },
  {
    id: '4',
    name: 'Débardeur para',
    price: 22,
    image: '/images/debardeur.jpg',
    description: 'Débardeur léger pour летнее temps',
  },
  {
    id: '5',
    name: 'Sweat à capuche',
    price: 55,
    image: '/images/sweat.jpg',
    description: 'Sweat chaud avec capuche',
  },
  {
    id: '6',
    name: 'Autocollants club',
    price: 5,
    image: '/images/autocollant.jpg',
    description: 'Pack de 5 autocollants',
  },
];

export default function Boutique() {
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">
          Boutique du club
        </h1>
        
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Découvrez notre sélection de produits officiels du club Têtes Brûlées. 
          Portez les couleurs de notre communauté !
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="relative h-64 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-orange-600">
                    {product.price}€
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/boutique/${product.id}`}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      En savoir plus
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
