'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

interface Bulletin {
  jour: string;
  texte: string;
  lendemain?: string;
}

interface MeteoData {
  bulletin: Bulletin;
  chargement: boolean;
  erreur: string | null;
}

export default function ValfrejusPage() {
  const [meteo, setMeteo] = useState<MeteoData>({
    bulletin: { jour: '', texte: '' },
    chargement: true,
    erreur: null,
  });

  useEffect(() => {
    fetch('/api/meteo')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        
        const html = data.html;
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const texte = doc.body.textContent || '';
        
        // Clean up the text
        const cleanedTexte = texte
          .replace(/Bulletin du jour/g, '')
          .replace(/Bulletin du lendemain/g, '\n\n--- Demain ---\n')
          .replace(/Cette nuit:/g, '\n\nCette nuit:')
          .trim();
        
        setMeteo({
          bulletin: { jour: '', texte: cleanedTexte },
          chargement: false,
          erreur: null,
        });
      })
      .catch(() => {
        setMeteo({
          bulletin: { jour: '', texte: '' },
          chargement: false,
          erreur: 'Impossible de charger la météo',
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🏔️ Valfréjus (2737m)
        </h1>
        
        {/* Weather Bulletin */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ☁️ Bulletin Météo
          </h2>
          
          {meteo.chargement ? (
            <p className="text-gray-500">Chargement...</p>
          ) : meteo.erreur ? (
            <p className="text-red-500">{meteo.erreur}</p>
          ) : (
            <div className="text-gray-700 whitespace-pre-line">
              {meteo.bulletin.texte}
            </div>
          )}
          
          <p className="text-xs text-gray-400 mt-4">
            Source: Lumiplan • Mise à jour: {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        {/* Spot Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Notre Terrain de Jeu</h2>
            <p className="text-gray-600">
              Valfréjus est le spot favorite des Têtes Brûlées pour le speedriding.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Accès</h3>
            <p className="text-gray-600">
              Station de ski familiale située en Savoie, accessible facilement depuis Lyon (2h30) et Chambéry (1h15).
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Conditions</h3>
            <p className="text-gray-600">
              Idéal pour le speedriding avec de nombreuses pistes adaptées et des décollages variés.
            </p>
          </div>
          
          <p className="text-gray-500 text-sm mt-8">
            Plus d'informations détaillées à venir !
          </p>
        </div>
      </div>
    </div>
  );
}