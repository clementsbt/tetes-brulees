'use client';

import BackButton from '@/components/BackButton';

const teamMembers = [
  {
    name: 'Clément Subtil',
    role: 'Secrétaire',
    description: 'Pilote de speedriding, speedflying et parapente depuis 2022. Secrétaire des têtes brûlées',
    image: '/clement-subtil.jpg',
  },
  {
    name: 'Frank Coupat',
    role: 'Moniteur de l\'école Ataka',
    description: 'Co-créateur du Speedriding et moniteur/Directeur de l\'école Ataka depuis 2006',
    image: '/frank-coupat.jpg',
  },
  {
    name: 'Léa Lou Simon',
    role: 'Présidente des Têtes Brûlées',
    description: 'Présidente des têtes brûlées',
    image: '/lea-lou-simon.jpg',
  },
];

export default function MembresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          👥 Notre Équipe
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h2>
                <p className="text-indigo-600 font-medium text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}