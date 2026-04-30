'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

interface MeteoData {
  vent: string;
  neige: string;
  risque: string;
  chargement: boolean;
  erreur: string | null;
}

export default function ValfrejusPage() {
  const [meteo, setMeteo] = useState<MeteoData>({
    vent: '',
    neige: '',
    risque: '',
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
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const texte = doc.body.textContent || '';
        
        // Extract vent (direction et force)
        let vent = 'Non spécifié';
        const ventMatch = texte.match(/(variable|modéré|faible|fort)\s*,?\s*(par endroits)?/i);
        if (ventMatch) {
          vent = ventMatch[1] + (ventMatch[2] ? ' par endroits' : '');
        }
        
        // Extract neige (quantité)
        const neigeMatch = texte.match(/neige\s+(qui tombe|s|\s)+?\s*(au-dessus de\s*\d+\s*m)?/i);
        let neige = 'Non spécifié';
        if (texte.includes('neige qui tombe')) {
          const hauteurMatch = texte.match(/neige qui tombe au-dessus de\s*(\d+)\s*mètres?/i);
          neige = hauteurMatch ? `Au-dessus de ${hauteurMatch[1]}m` : 'Neige prévu';
        } else if (texte.includes('c\'est de la neige')) {
          const hauteurMatch = texte.match(/c\'est de la neige qui tombe au-dessus de\s*(\d+)\s*mètres?/i);
          neige = hauteurMatch ? `Au-dessus de ${hauteurMatch[1]}m` : 'Neige prévu';
        }
        
        // Extract risque avalanche (format /5)
        const risqueMatch = texte.match(/risque\s*(d\'avalanche|\s+)[:\s]*(\d)\/5?/i);
        let risque = 'Non spécifié';
        if (!risqueMatch) {
          // Try to find any number followed by /5
          const simpleMatch = texte.match(/(\d)\/5/);
          risque = simpleMatch ? `${simpleMatch[1]}/5` : 'Non spécifié';
        } else {
          risque = risqueMatch[2] ? `${risqueMatch[2]}/5` : 'Non spécifié';
        }
        
        setMeteo({
          vent,
          neige,
          risque,
          chargement: false,
          erreur: null,
        });
      })
      .catch(() => {
        setMeteo({
          vent: '',
          neige: '',
          risque: '',
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
          🏔️ Punta Bagna - 2737m
        </h1>
        
        {/* Meteo Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Vent */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              💨 Vent
            </h3>
            {meteo.chargement ? (
              <p className="text-gray-500">Chargement...</p>
            ) : (
              <p className="text-gray-700 capitalize">{meteo.vent}</p>
            )}
          </div>
          
          {/* Neige */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ❄️ Neige
            </h3>
            {meteo.chargement ? (
              <p className="text-gray-500">Chargement...</p>
            ) : (
              <p className="text-gray-700">{meteo.neige}</p>
            )}
          </div>
          
          {/* Risque avalanche */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ⚠️ Risque Avalanche
            </h3>
            {meteo.chargement ? (
              <p className="text-gray-500">Chargement...</p>
            ) : (
              <p className={`text-2xl font-bold ${
                parseInt(meteo.risque) >= 4 ? 'text-red-600' :
                parseInt(meteo.risque) >= 2 ? 'text-orange-500' : 'text-green-500'
              }`}>
                {meteo.risque}
              </p>
            )}
          </div>
        </div>
        
        {/* Source */}
        <p className="text-xs text-gray-400 mb-6">
          Source: Lumiplan
        </p>
        
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