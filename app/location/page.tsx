import BackButton from '@/components/BackButton';

export default function LocationPage() {
  const annonce = {
    titre: "Appartement ski Savoie valfrejus",
    lieu: "Modane - Valfréjus (73500)",
    capacidade: "4 à 6 personnes",
    chambres: 2,
    superficie: "37 m²",
    prixNuit: "42 €",
    prixSemaine: "294 €",
    description: "« Le No&My » dans Les chalets d'arrondaz est un appartement de 37 m2 pour 4/6 personnes situé au 3ème et dernier étage avec balcon d'angle de 9m2 exposé sud-ouest et vue imprenable sur la Vanoise. Il est situé à 50 mètres du télésiège et piste du Charmasson et à 500 mètres du centre de la Station de ski familiale de VALFREJUS.",
    equipements: ["Télévision", "Parking gratuit", "Cuisine équipée", "Balcon 9m²", "Vue montagne"],
    distancePistes: "50m du télésiège",
    url: "https://www.leboncoin.fr/ad/locations_saisonnieres/3143971343",
    disponible: "Disponibilités non confirmées",
    arrivee: "15:00",
    depart: "10:00",
    animaux: "Non acceptés",
    fumeur: "Non"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏠 Location à Valfréjus
          </h1>
          <p className="text-lg text-gray-700">
            Appartement au pied des pistes
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Image placeholder */}
            <div className="h-64 md:h-80 bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🏔️</span>
                <p className="text-gray-600 font-medium">Photo à venir</p>
                <p className="text-sm text-gray-500">Valfréjus - Les chalets d'arrondaz</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Title & Price */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {annonce.titre}
                  </h2>
                  <p className="text-gray-600 flex items-center text-lg">
                    📍 {annonce.lieu}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-3xl font-bold text-orange-600">
                    {annonce.prixNuit}
                  </p>
                  <p className="text-gray-500">/ nuit</p>
                  <p className="text-sm text-gray-500 mt-1">
                    dès {annonce.prixSemaine} / semaine
                  </p>
                </div>
              </div>

              {/* Key features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">🛏️</p>
                  <p className="font-semibold text-gray-800">{annonce.capacidade}</p>
                  <p className="text-xs text-gray-500">Capacité</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">📐</p>
                  <p className="font-semibold text-gray-800">{annonce.superficie}</p>
                  <p className="text-xs text-gray-500">Surface</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">🚪</p>
                  <p className="font-semibold text-gray-800">{annonce.chambres} chambres</p>
                  <p className="text-xs text-gray-500"> Chambres</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">⛷️</p>
                  <p className="font-semibold text-gray-800">{annonce.distancePistes}</p>
                  <p className="text-xs text-gray-500">Des pistes</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {annonce.description}
                </p>
              </div>

              {/* Equipements */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Équipements</h3>
                <div className="flex flex-wrap gap-2">
                  {annonce.equipements.map((eq, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info pratiques */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Info pratiques</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Arrivée</p>
                    <p className="font-medium">{annonce.arrivee}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Départ</p>
                    <p className="font-medium">{annonce.depart}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Animaux</p>
                    <p className="font-medium">{annonce.animaux}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fumeur</p>
                    <p className="font-medium">{annonce.fumeur}</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a 
                href={annonce.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-orange-500 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors"
              >
                Voir l'annonce sur Le Bon Coin →
              </a>
              
              <p className="text-center text-gray-500 text-sm mt-3">
                🔗 {annonce.url}
              </p>
            </div>
          </div>

          {/* Other options hint */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              D'autres annonces ?
              <a 
                href="https://www.leboncoin.fr/recherche/?locations_saisonnieres&city=valfrejus" 
                target="_blank"
                className="text-orange-600 hover:underline ml-1"
              >
                Chercher sur Le Bon Coin →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}