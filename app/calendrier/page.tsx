'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

interface PresenceUser {
  email: string;
  name: string;
}

interface Presence {
  date: string;
  users: PresenceUser[];
}

interface User {
  email: string;
  name?: string;
}

export default function CalendrierPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [presences, setPresences] = useState<Presence[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }
      } catch {
        // Not logged in
      }
      setLoading(false);
    };

    const fetchPresences = async () => {
      try {
        const res = await fetch('/api/presence');
        const data = await res.json();
        
        const presenceList: Presence[] = Object.entries(data).map(([date, users]) => ({
          date,
          users: (users as PresenceUser[]) || [],
        }));
        
        setPresences(presenceList.sort((a, b) => a.date.localeCompare(b.date)));
      } catch {
        // Ignore
      }
    };

    checkAuth();
    fetchPresences();
  }, []);

  const togglePresence = async (date: string) => {
    if (!user) return;

    const currentPresence = presences.find(p => p.date === date);
    const isPresent = currentPresence?.users?.some(u => u.email === user.email) || false;
    const newPresent = !isPresent;

    try {
      await fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, present: newPresent }),
      });

      window.location.reload();
    } catch {
      // Ignore
    }
  };

  const days: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const formatDisplay = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  const getUsersForDate = (dateKey: string) => {
    return presences.find(p => p.date === dateKey)?.users || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <BackButton />
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
            <p className="text-gray-600 mb-4">
              Connecte-toi pour voir et ajouter tes disponibilités !
            </p>
            <a 
              href="/connexion" 
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          📅 Calendrier de présence - Valfréjus
        </h1>
        
        <p className="text-gray-600 mb-6">
          Clique sur un jour pour indiquer si tu seras là !
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {days.map((day) => {
            const dateKey = formatDate(day);
            const dayUsers = getUsersForDate(dateKey);
            const isPresent = dayUsers.some(u => u.email === user.email);
            const isPast = day < new Date();

            return (
              <button
                key={dateKey}
                onClick={() => !isPast && togglePresence(dateKey)}
                disabled={isPast}
                className={`
                  p-4 rounded-lg text-left transition-all
                  ${isPast ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:shadow-lg cursor-pointer'}
                  ${isPresent ? 'bg-green-100 border-2 border-green-500' : 'bg-white border border-gray-200'}
                `}
              >
                <div className="font-medium text-gray-900">
                  {formatDisplay(day)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {dayUsers.length} présent(s)
                </div>
                {dayUsers.length > 0 && (
                  <div className="text-xs text-green-600 mt-1 truncate">
                    {dayUsers.map(u => u.name).join(', ')}
                  </div>
                )}
                {isPresent && (
                  <div className="text-xs text-green-600 font-medium mt-1">
                    ✓ Tu es inscrit
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Résumé des présences
          </h2>
          {presences.length === 0 ? (
            <p className="text-gray-500">Aucune présence prévue</p>
          ) : (
            <div className="space-y-3">
              {presences.map((p) => (
                <div key={p.date} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-medium">
                    {new Date(p.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                  <span className="text-gray-600">
                    {p.users.map(u => u.name).join(', ') || 'Personne'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}