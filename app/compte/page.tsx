'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  niveau?: string;
  licenceFFVL?: string;
  dateInscription?: string;
}

export default function ComptePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      // Not logged in - redirect to login
      setLoading(false);
      router.push('/connexion');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false);
    } catch {
      // Invalid stored data - redirect to login
      setLoading(false);
      router.push('/connexion');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Mon Compte
          </h1>
          
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-indigo-600">
                    {user.prenom?.[0]}{user.nom?.[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.prenom} {user.nom}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Membre depuis {user.dateInscription || 'récemment'}
                  </p>
                </div>
              </div>
              <Link 
                href="/membres" 
                className="text-indigo-600 hover:underline text-sm"
              >
                Voir le profil public →
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-900 font-medium">{user.email}</span>
              </div>
              
              {user.telephone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone</span>
                  <span className="text-gray-900 font-medium">{user.telephone}</span>
                </div>
              )}
              
              {user.niveau && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Niveau</span>
                  <span className="text-gray-900 font-medium">{user.niveau}</span>
                </div>
              )}
              
              {user.licenceFFVL && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Licence FFVL</span>
                  <span className="text-gray-900 font-medium">{user.licenceFFVL}</span>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}