'use client';

import { useState } from 'react';

export default function TestShippingPage() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '75001',
    country: 'FR',
  });
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testShipping = async () => {
    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { id: '474537609', name: 'Sweat à Capuche', price: 37.5, quantity: 1 },
          ],
          shippingAddress: formData,
        }),
      });

      const data = await response.json();
      if (data.shippingRates) {
        setRates(data.shippingRates);
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (err) {
      setError('Erreur lors du calcul');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <h1 className="text-3xl font-bold text-orange-600 mb-8 text-center">
          Test Frais de Livraison
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="1 rue de la Paix"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Paris"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="75001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays (code ISO)
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="FR"
                maxLength={2}
              />
            </div>
          </div>

          <button
            onClick={testShipping}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Calcul en cours...' : 'Tester le calcul'}
          </button>

          {error && (
            <p className="text-red-500 mt-4 text-center">{error}</p>
          )}

          {rates.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Résultats:</h3>
              <div className="space-y-2">
                {rates.map((rate) => (
                  <div key={rate.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{rate.name}</p>
                      <p className="text-sm text-gray-500">
                        {rate.estimatedDays ? `~${rate.estimatedDays} jour(s)` : 'Standard'}
                      </p>
                    </div>
                    <p className="font-bold text-orange-600">{rate.price.toFixed(2)}€</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
