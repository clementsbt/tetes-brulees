export default function LocationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏠 Location d'Appartement
          </h1>
          <p className="text-xl text-gray-700">
            Trouvez votre logement à Valfréjus pour vos sessions de speedriding
          </p>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Appartements disponibles
            </h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Studio – 2 personnes
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>📍 <strong>Localisation :</strong> Pied des pistes, Valfréjus</li>
                  <li>🛏️ <strong>Capacité :</strong> 2 personnes</li>
                  <li>💰 <strong>Tarif :</strong> À partir de 300€/semaine</li>
                  <li>✨ <strong>Équipements :</strong> Cuisine équipée, wifi, casiers à skis</li>
                </ul>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Appartement T2 – 4 personnes
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>📍 <strong>Localisation :</strong> Centre station, Valfréjus</li>
                  <li>🛏️ <strong>Capacité :</strong> 4 personnes</li>
                  <li>💰 <strong>Tarif :</strong> À partir de 500€/semaine</li>
                  <li>✨ <strong>Équipements :</strong> Balcon vue montagne, cuisine, wifi, parking</li>
                </ul>
              </div>

              <div className="pb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Chalet – 6 à 8 personnes
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>📍 <strong>Localisation :</strong> Vallée de la Maurienne</li>
                  <li>🛏️ <strong>Capacité :</strong> 6 à 8 personnes</li>
                  <li>💰 <strong>Tarif :</strong> À partir de 900€/semaine</li>
                  <li>✨ <strong>Équipements :</strong> Cheminée, terrasse, jardin, parking privé</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-orange-500 text-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Réservez votre appartement
            </h3>
            <p className="mb-6 text-lg">
              Contactez-nous pour plus d'informations et disponibilités
            </p>
            <a 
              href="mailto:contact@tetes-brulees.fr" 
              className="inline-block bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
