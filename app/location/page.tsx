import BackButton from '@/components/BackButton';

export default function LocationPage() {
  const apartments = [
    {
      id: 1,
      title: "Studio – 2 personnes",
      location: "Pied des pistes, Valfréjus",
      capacity: "2 personnes",
      price: "À partir de 300€/semaine",
      image: "/placeholder-apartment.jpg",
      description: "Studio confortable situé au pied des pistes, idéal pour un couple ou deux amis.",
      amenities: ["Cuisine équipée", "Wifi", "Casiers à skis", "Vue montagne"]
    },
    {
      id: 2,
      title: "Appartement T2 – 4 personnes",
      location: "Centre station, Valfréjus",
      capacity: "4 personnes",
      price: "À partir de 500€/semaine",
      image: "/placeholder-apartment.jpg",
      description: "Appartement spacieux avec balcon vue sur les montagnes, parfait pour une famille ou un groupe d'amis.",
      amenities: ["Balcon vue montagne", "Cuisine équipée", "Wifi", "Parking"]
    },
    {
      id: 3,
      title: "Chalet – 6 à 8 personnes",
      location: "Vallée de la Maurienne",
      capacity: "6 à 8 personnes",
      price: "À partir de 900€/semaine",
      image: "/placeholder-apartment.jpg",
      description: "Grand chalet authentique avec cheminée, terrasse et jardin. Parfait pour des sessions entre amis.",
      amenities: ["Cheminée", "Terrasse", "Jardin", "Parking privé", "BBQ"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏠 Location d'Appartement
          </h1>
          <p className="text-xl text-gray-700">
            Trouvez votre logement à Valfréjus pour vos sessions de speedriding
          </p>
        </div>

        {/* Apartments Grid */}
        <div className="max-w-6xl mx-auto space-y-8">
          {apartments.map((apt) => (
            <div 
              key={apt.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/2 relative h-64 md:h-auto bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    📷 Image à venir
                  </div>
                  {/* Placeholder - remplacer par vraies images plus tard */}
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {apt.title}
                  </h2>
                  
                  <div className="space-y-3 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">📍</span> {apt.location}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">🛏️</span> {apt.capacity}
                    </p>
                    <p className="text-orange-600 font-semibold text-xl">
                      💰 {apt.price}
                    </p>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {apt.description}
                  </p>

                  {/* Amenities */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">✨ Équipements :</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {apt.amenities.map((amenity, idx) => (
                        <li key={idx} className="text-gray-600 text-sm">
                          • {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Button */}
                  <a 
                    href="mailto:contact@tetes-brulees.fr?subject=Location appartement"
                    className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Réserver / Demander infos
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Besoin d'aide ?
            </h3>
            <p className="text-gray-600 mb-6">
              Contactez-nous pour toute question sur les disponibilités, tarifs ou équipements.
            </p>
            <a 
              href="mailto:contact@tetes-brulees.fr" 
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              📧 contact@tetes-brulees.fr
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
