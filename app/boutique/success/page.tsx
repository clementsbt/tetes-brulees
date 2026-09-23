import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Paiement réussi !
          </h1>
          
          <p className="text-gray-600 mb-8">
            Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
          </p>
          
          <Link
            href="/boutique"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
