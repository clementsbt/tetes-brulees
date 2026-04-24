import Link from 'next/link';

export default function EvenementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-8 inline-block">
          ← Retour
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          📅 Événements du Club
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-4">
            Le calendrier des événements sera bientôt disponible !
          </p>
          <p className="text-gray-500 text-sm">
            Les membres pourront consulter et s'inscrire aux sessions organisées par le club.
          </p>
        </div>
      </div>
    </div>
  );
}
