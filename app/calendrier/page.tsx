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
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 11, 1)); // December 2026

  const MIN_MONTH = new Date(2026, 11, 1); // December 2026
  const MAX_MONTH = new Date(2027, 3, 1); // April 2027

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
        
        setPresences(presenceList);
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

  const getUsersForDate = (dateKey: string) => {
    return presences.find(p => p.date === dateKey)?.users || [];
  };

  // Generate calendar days
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: (Date | null)[] = [];
  // Fill empty slots before first day
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  // Fill actual days
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const prevMonth = () => {
    const newMonth = new Date(year, month - 1, 1);
    if (newMonth >= MIN_MONTH) {
      setCurrentMonth(newMonth);
    }
  };

  const nextMonth = () => {
    const newMonth = new Date(year, month + 1, 1);
    if (newMonth < MAX_MONTH) {
      setCurrentMonth(newMonth);
    }
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

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
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📅 Calendrier de présence
        </h1>
        <p className="text-gray-600 mb-6">
          Clique sur un jour pour indiquer si tu seras à Valfréjus
        </p>

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
              const dayUsers = getUsersForDate(dateKey);
              const isPresent = dayUsers.some(u => u.email === user.email);
              const isToday = day.toDateString() === new Date().toDateString();
              const isPast = day < new Date();
              const isFuture = day > new Date();

              return (
                <button
                  key={dateKey}
                  onClick={() => !isPast && togglePresence(dateKey)}
                  disabled={isPast}
                  className={`
                    h-28 p-2 rounded text-left transition-all flex flex-col text-xs
                    ${isPast ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}
                    ${isPresent ? 'bg-green-100 border-2 border-green-500' : 'bg-white border border-gray-200'}
                    ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  `}
                >
                  <div className={`font-medium ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  {dayUsers.length > 0 ? (
                    <div className="text-green-600 truncate mt-auto">
                      {dayUsers.slice(0, 2).map(u => u.name?.split(' ')[0]).join(', ')}
                      {dayUsers.length > 2 && ` +${dayUsers.length - 2}`}
                    </div>
                  ) : (
                    <div className="text-gray-400 truncate mt-auto text-xs">
                      -
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span className="text-gray-600">Tu es inscrit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
              <span className="text-gray-600">Non inscrit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}