'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

interface User {
  email: string;
  name?: string;
}

interface Evenement {
  id: string;
  nom: string;
  date: string;
  createurEmail: string;
  createurNom: string;
  participants: { email: string; name: string }[];
}

export default function EvenementsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newNom, setNewNom] = useState('');
  const [newDate, setNewDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

    const fetchEvenements = async () => {
      try {
        const res = await fetch('/api/evenements');
        const data = await res.json();
        setEvenements(data);
      } catch {
        // Ignore
      }
    };

    checkAuth();
    fetchEvenements();
  }, []);

  const createEvenement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom || !newDate) return;

    try {
      const res = await fetch('/api/evenements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: newNom, date: newDate }),
      });

      if (res.ok) {
        setNewNom('');
        setNewDate('');
        setShowForm(false);
        // Refresh events
        const res2 = await fetch('/api/evenements');
        const data2 = await res2.json();
        setEvenements(data2);
      }
    } catch {
      // Ignore
    }
  };

  const joinEvenement = async (evenementId: string) => {
    if (!user) return;

    try {
      const res = await fetch('/api/evenements/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evenementId }),
      });

      if (res.ok) {
        // Refresh events
        const res2 = await fetch('/api/evenements');
        const data2 = await res2.json();
        setEvenements(data2);
      }
    } catch {
      // Ignore
    }
  };

  // Generate calendar days for current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const getEvenementsForDate = (dateKey: string) => {
    return evenements.filter(e => e.date === dateKey);
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
              Connecte-toi pour voir et créer des événements !
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
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🎉 Événements
        </h1>
        <p className="text-gray-600 mb-6">
          Crée un événement ou rejoins ceux de ce mois
        </p>

        {/* Create Event Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold mb-6 hover:bg-indigo-700 transition-all"
        >
          {showForm ? '✕ Annuler' : '+ Créer un événement'}
        </button>

        {/* Create Event Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Nouvel événement</h2>
            <form onSubmit={createEvenement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'événement
                </label>
                <input
                  type="text"
                  value={newNom}
                  onChange={(e) => setNewNom(e.target.value)}
                  placeholder="ex: Session skate, barbecue..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Créer
              </button>
            </form>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={prevMonth}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Précédent
            </button>
            <h2 className="text-xl font-bold">
              {monthNames[month]} {year}
            </h2>
            <button 
              onClick={nextMonth}
              className="text-gray-600 hover:text-gray-900"
            >
              Suivant →
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center font-medium text-gray-500 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="h-24"></div>;
              }

              const dateKey = formatDate(day);
              const dayEvenements = getEvenementsForDate(dateKey);
              const isToday = day.toDateString() === new Date().toDateString();
              const isPast = day < new Date() && !isToday;

              return (
                <div
                  key={dateKey}
                  className={`
                    h-28 p-2 rounded text-left flex flex-col text-xs overflow-hidden
                    ${isPast ? 'opacity-40 bg-gray-50' : 'bg-white border border-gray-200'}
                    ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  `}
                >
                  <div className={`font-medium ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  {dayEvenements.length > 0 ? (
                    <div className="mt-auto space-y-1">
                      {dayEvenements.map((e) => (
                        <div key={e.id} className="bg-indigo-100 text-indigo-700 p-1 rounded truncate text-xs">
                          {e.nom}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 truncate mt-auto text-xs">
                      -
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Événements du mois</h2>
          {evenements.length === 0 ? (
            <p className="text-gray-500">Aucun événement ce mois-ci</p>
          ) : (
            <div className="space-y-4">
              {evenements.map((e) => (
                <div key={e.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{e.nom}</h3>
                      <p className="text-gray-600">{new Date(e.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500">Par {e.createurNom}</p>
                    </div>
                    {e.participants.some(p => p.email === user.email) ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Inscrit
                      </span>
                    ) : (
                      <button
                        onClick={() => joinEvenement(e.id)}
                        className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-indigo-700"
                      >
                        Rejoindre
                      </button>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {e.participants.length} participant{e.participants.length > 1 ? 's' : ''}: {' '}
                    {e.participants.map(p => p.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}