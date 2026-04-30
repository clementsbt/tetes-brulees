'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

interface MeteoData {
  vent: string;
  direction: string;
  neige: string;
  prevision: string;
  risque: string;
  chargement: boolean;
  erreur: string | null;
}

export default function ValfrejusPage() {
  const [meteo, setMeteo] = useState<MeteoData>({
    vent: '',
    direction: '',
    neige: '',
    prevision: '',
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
        
        // Extract Punta Bagna data from the HTML structure
        // Look for the card with "Punta Bagna" - 2737m
        const puntaBagnaMatch = html.match(/Punta Bagna[\s\S]*?2737[\s\S]*?<div class="meteo">([\s\S]*?)<div class="avalanche">/);
        
        if (!puntaBagnaMatch) {
          throw new Error('Données non trouvées');
        }
        
        const puntaBagnaHtml = puntaBagnaMatch[1];
        
        // Extract vent speed
        const ventMatch = puntaBagnaHtml.match(/<img[^>]*wind\.svg[^>]*>[\s\S]*?<span class="subtext">(\d+km\/h)<\/span>/);
        const vent = ventMatch ? ventMatch[1] : 'Non spécifié';
        
        // Extract wind direction
        const dirMatch = puntaBagnaHtml.match(/<img[^>]*windDirection\/SE[^>]*>[\s\S]*?<span class="subtext">(Sud[\s-]*Est)<\/span>/);
        const direction = dirMatch ? dirMatch[1] : 'Non spécifié';
        
        // Extract snow amount
        const neigeMatch = puntaBagnaHtml.match(/<img[^>]*image_neige\.svg[^>]*>[\s\S]*?<span class="text">(\d+[\s]*cm)<\/span>/);
        const neige = neigeMatch ? neigeMatch[1].trim() : 'Non spécifié';
        
        // Extract snow forecast
        const previsionMatch = puntaBagnaHtml.match(/<img[^>]*calendrier_neige\.svg[^>]*>[\s\S]*?<span class="text">(\d+[\s]*cm)<\/span>[\s\S]*?<span class="text_italic">/);
        const prevision = previsionMatch ? previsionMatch[1].trim() : 'Non spécifié';
        
        // Extract avalanche risk - look for the risk in Punta Bagna section
        const risqueMatch = html.match(/<div class="avalanche_score"><span class="bold">(\d)<\/span>\/5<\/div>[\s\S]*?<img class="avalanche_image" src="image\/avalanche_risk\/R(\d)\.svg"/);
        const risque = risqueMatch ? `${risqueMatch[1]}/5` : 'Non spécifié';
        
        setMeteo({
          vent,
          direction,
          neige,
          prevision,
          risque,
          chargement: false,
          erreur: null,
        });
      })
      .catch(() => {
        setMeteo({
          vent: '',
          direction: '',
          neige: '',
          prevision: '',
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
              <p className="text-gray-700">
                {meteo.vent} {meteo.direction && `(${meteo.direction})`}
              </p>
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