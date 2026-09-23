'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer une description avec tous les produits
      const productDescription = items
        .map(item => `${item.name}${item.color ? ` (${item.color})` : ''}${item.size ? ` - ${item.size}` : ''} x${item.quantity}`)
        .join(', ');

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'cart',
          productName: `Commande boutique: ${productDescription}`,
          price: total,
          quantity: 1,
          shipping: formData,
        }),
      });

      const data = await response.json();

      if (data.url) {
        clearCart();
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">
            Votre panier
          </h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 mb-6">Votre panier est vide</p>
            <Link 
              href="/boutique" 
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">
          Votre panier
        </h1>

        {!showForm ? (
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto">
              <div className="p-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-500">Taille: {item.size}</p>}
                      {item.color && <p className="text-sm text-gray-500">Couleur: {item.color}</p>}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:text-orange-600"
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:text-orange-600"
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="font-semibold text-orange-600 min-w-[80px] text-right">
                        {item.price * item.quantity}€
                      </p>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-orange-600">{total}€</span>
                </div>
                
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Passer la commande
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link 
                href="/boutique" 
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                ← Continuer vos achats
              </Link>
            </div>
          </>
        ) : (
          /* Formulaire de livraison */
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <button
              onClick={() => setShowForm(false)}
              className="text-orange-600 hover:text-orange-700 mb-6 flex items-center"
            >
              ← Retour au panier
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informations de livraison
            </h2>

            <form onSubmit={handleCheckout} className="space-y-4">
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
                <p className="text-sm text-gray-600 mb-2">Récitulatif :</p>
                {items.map((item) => (
                  <p key={item.id} className="text-sm">
                    {item.name} x{item.quantity} = {item.price * item.quantity}€
                  </p>
                ))}
                <p className="text-xl font-bold text-orange-600 mt-2">Total: {total}€</p>
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
      </div>
    </div>
  );
}
