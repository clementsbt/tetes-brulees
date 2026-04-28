import BackButton from '@/components/BackButton';

export default function MembresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          👥 Nos Membres
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-4">
            La galerie des membres sera bientôt disponible !
          </p>
          <p className="text-gray-500 text-sm">
            Nous ajouterons ici les photos et profils de tous les membres du club.
          </p>
        </div>
      </div>
    </div>
  );
}
