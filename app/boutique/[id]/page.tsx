'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface PrintfulProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  variants: Array<{
    id: number;
    size: string;
    color: string;
    price: string;
  }>;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: Props) {
  const { id } = use(params);
  const { addItem } = useCart();
  const [product, setProduct] = useState<PrintfulProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setProduct(data);
        }
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setError('Erreur lors du chargement du produit');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes.length > 1 && product.sizes[0] !== 'One size' ? selectedSize : undefined,
      color: selectedColor,
      quantity: 1,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const canAddToCart = !product || product.sizes.length === 0 || product.sizes[0] === 'One size' || (selectedSize && selectedColor);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-96 bg-gray-300"></div>
                <div className="p-8">
                  <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-12 bg-gray-300 rounded w-1/4 mb-6"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error || 'Produit non trouvé'}</p>
          <Link href="/boutique" className="text-orange-600 hover:underline mt-4 inline-block">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
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
          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-4 p-4">
              <div className="relative h-80 md:h-96 bg-gray-200 rounded-xl overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <p className="text-4xl font-bold text-orange-600 mb-6">
                {product.price.toFixed(2)}€
              </p>

              <p className="text-gray-600 mb-6">
                {product.description}
              </p>

              {/* Tailles */}
              {product.sizes.length > 0 && product.sizes[0] !== 'One size' && (
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
              {product.colors.length > 0 && (
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
              )}

              {/* Boutons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart || addedToCart}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addedToCart ? 'Ajouté au panier !' : 'Ajouter au panier'}
                </button>
                
                <Link
                  href="/boutique/panier"
                  className="block w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center hover:bg-gray-300 transition-colors"
                >
                  Voir le panier
                </Link>
              </div>
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
