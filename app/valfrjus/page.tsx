import BackButton from '@/components/BackButton';

export default function ValfrejusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🏔️ Valfréjus
        </h1>
        
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
            Plus d'infos détaillées à venir !
          </p>
        </div>
      </div>
    </div>
  );
}
