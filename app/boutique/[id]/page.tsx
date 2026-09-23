'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Produits - à remplacer par des données réelles
const products = [
  {
    id: '1',
    name: 'T-shirt "Têtes Brûlées"',
    price: 25,
    image: '/images/tee-shirt.jpg',
    description: 'T-shirt confortable avec le logo du club. 100% coton bio, idéal pour les pilotes.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc', 'Noir', 'Orange'],
    images: ['/images/tee-shirt.jpg', '/images/tee-shirt-2.jpg', '/images/tee-shirt-3.jpg'],
  },
  {
    id: '2',
    name: 'Casquette brodée',
    price: 20,
    image: '/images/casquette.jpg',
    description: 'Casquette avec logo brodé. Réglable avec fermeture velcro.',
    sizes: ['Taille unique'],
    colors: ['Blanc', 'Noir', 'Orange'],
    images: ['/images/casquette.jpg'],
  },
  {
    id: '3',
    name: 'Polaire club',
    price: 45,
    image: '/images/polaire.jpg',
    description: 'Polaire chaude et confortable, parfaite pour les soirées d\'hiver après le vol.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gris', 'Noir'],
    images: ['/images/polaire.jpg'],
  },
  {
    id: '4',
    name: 'Débardeur para',
    price: 22,
    image: '/images/debardeur.jpg',
    description: 'Débardeur léger et respirant, idéal pour les journées chaudes.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Noir'],
    images: ['/images/debardeur.jpg'],
  },
  {
    id: '5',
    name: 'Sweat à capuche',
    price: 55,
    image: '/images/sweat.jpg',
    description: 'Sweat à capuche chaud avec logo du club brodé.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gris', 'Noir', 'Orange'],
    images: ['/images/sweat.jpg'],
  },
  {
    id: '6',
    name: 'Autocollants club',
    price: 5,
    image: '/images/autocollant.jpg',
    description: 'Pack de 5 autocollants officiels du club. Résistants aux UV.',
    sizes: ['Taille unique'],
    colors: ['Unique'],
    images: ['/images/autocollant.jpg'],
  },
];

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: Props) {
  const { id } = (params as any).resolved || {};
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'FR',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: `${product.name}${selectedColor ? ` - ${selectedColor}` : ''}${selectedSize ? ` - Taille ${selectedSize}` : ''}`,
          price: product.price,
          quantity: 1,
          shipping: formData,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la création du paiement');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  const canBuy = product.sizes[0] === 'Taille unique' || (selectedSize && selectedColor);

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

        {!showForm ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-4 p-4">
                <div className="relative h-80 md:h-96 bg-gray-200 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto">
                  {product.images?.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                  ))}
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
                {product.sizes[0] !== 'Taille unique' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            selectedSize === size
                              ? 'border-orange-500 bg-orange-50 text-orange-600'
                              : 'border-gray-300 hover:border-orange-500 hover:text-orange-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Couleurs */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          selectedColor === color
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-300 hover:border-orange-500 hover:text-orange-600'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bouton commander */}
                <button
                  onClick={() => setShowForm(true)}
                  disabled={!canBuy}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Commander
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Formulaire de livraison */
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <button
              onClick={() => setShowForm(false)}
              className="text-orange-600 hover:text-orange-700 mb-6 flex items-center"
            >
              ← Retour au produit
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informations de livraison
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Rue, numéro, appartement..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays (code ISO) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="FR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <p className="text-sm text-gray-600 mb-2">Récapitulatif :</p>
                <p className="font-semibold">{product.name}</p>
                {selectedColor && <p className="text-sm text-gray-600">Couleur: {selectedColor}</p>}
                {selectedSize && <p className="text-sm text-gray-600">Taille: {selectedSize}</p>}
                <p className="text-xl font-bold text-orange-600 mt-2">{product.price}€</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Chargement...' : 'Payer maintenant'}
              </button>
            </form>
          </div>
        )}

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
