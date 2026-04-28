import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Les Têtes Brûlées
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            Club de vol libre
          </p>
          <p className="text-lg text-gray-600">
            Speedriding • Speedflying • Parapente
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Membres */}
          <Link href="/membres" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Nos Membres
              </h2>
              <p className="text-gray-600">
                Découvrez la communauté des Têtes Brûlées
              </p>
            </div>
          </Link>

          {/* Valfréjus */}
          <Link href="/valfrjus" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏔️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Valfréjus
              </h2>
              <p className="text-gray-600">
                Infos sur notre spot de prédilection
              </p>
            </div>
          </Link>

          {/* Événements */}
          <Link href="/evenements" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Événements
              </h2>
              <p className="text-gray-600">
                Sessions et sorties du club
              </p>
            </div>
          </Link>

          {/* Location */}
          <Link href="/location" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Location
              </h2>
              <p className="text-gray-600">
                Appartements à Valfréjus
              </p>
            </div>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Rejoignez-nous !
            </h3>
            <p className="text-gray-600 mb-6">
              Membre FFVL ? Inscrivez-vous pour accéder au calendrier de présence et organiser vos sessions.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/inscription" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                S'inscrire
              </Link>
              <Link 
                href="/connexion" 
                className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
