'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcul de l'opacité, blur et zoom en fonction du scroll
  const maxScroll = 400; // Distance de scroll avant effet complet
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const overlayOpacity = 0.25 + (0.35 * scrollProgress); // De 0.25 à 0.6 (plus sombre pour les cartes)
  const blurAmount = 2 * (1 - scrollProgress); // De 2px à 0px
  const zoomScale = 1 + (scrollProgress * 0.15); // De 1 à 1.15 (zoom de 15%)

  return (
    <div className="min-h-screen">
      {/* Image de fond fixe pour toute la page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomScale})` }}
        >
          <Image
            src="/hero-mountain.jpg"
            alt="Montagne enneigée"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Overlay dynamique qui diminue avec le scroll */}
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{
            opacity: overlayOpacity,
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        
        {/* Contenu du hero centré */}
        <div className="relative z-10 text-center px-4">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Logo Têtes Brûlées"
              width={180}
              height={180}
              className="drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Les Têtes Brûlées
          </h1>
          <p className="text-3xl md:text-4xl text-white mb-4 drop-shadow-lg">
            Club de vol libre
          </p>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
            Speedriding • Speedflying • Parapente
          </p>
        </div>
      </div>

      {/* Section des cartes */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 py-16">

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Membres */}
          <Link href="/membres" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Nos Membres
              </h2>
              <p className="text-gray-600">
                Découvrez la communauté des Têtes Brûlées
              </p>
            </div>
          </Link>

          {/* Valfréjus */}
          <Link href="/valfrjus" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏔️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Valfréjus
              </h2>
              <p className="text-gray-600">
                Infos sur notre spot de prédilection
              </p>
            </div>
          </Link>

          {/* Événements */}
          <Link href="/evenements" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Événements
              </h2>
              <p className="text-gray-600">
                Sessions et sorties du club
              </p>
            </div>
          </Link>

          {/* Location */}
          <Link href="/location" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Location
              </h2>
              <p className="text-gray-600">
                Appartements à Valfréjus
              </p>
            </div>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Rejoignez-nous !
            </h3>
            <p className="text-gray-600 mb-6">
              Membre FFVL ? Inscrivez-vous pour accéder au calendrier de présence et organiser vos sessions.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/inscription" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                S'inscrire
              </Link>
              <Link 
                href="/connexion" 
                className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
