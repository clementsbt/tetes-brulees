import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-orange-500 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/logo.jpg" 
              alt="Têtes Brûlées" 
              width={48}
              height={48}
              className="h-12 w-12 object-contain rounded-lg shadow-md"
            />
            <span className="text-white text-2xl font-bold tracking-tight">
              Têtes Brûlées
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Accueil
            </Link>
            <Link href="/evenements" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Événements
            </Link>
            <Link href="/membres" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Membres
            </Link>
            <Link href="/valfrjus" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Valfréjus
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
