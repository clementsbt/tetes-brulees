import BackButton from '@/components/BackButton';

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Connexion
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600 mb-4">
              Le formulaire de connexion sera bientôt disponible !
            </p>
            <p className="text-gray-500 text-sm">
              Les membres validés pourront se connecter pour accéder au calendrier et aux événements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
