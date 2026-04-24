import Link from 'next/link';

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-8 inline-block">
          ← Retour
        </Link>
        
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Inscription
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600 mb-4">
              Le formulaire d'inscription sera bientôt disponible !
            </p>
            <p className="text-gray-500 text-sm">
              Vous pourrez créer votre compte en renseignant votre numéro de licence FFVL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
