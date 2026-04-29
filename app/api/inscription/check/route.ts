import { NextResponse } from 'next/server';
import { isLicenseValid } from '@/lib/licenses';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, licenseNumber } = body;

    if (!email || !licenseNumber) {
      return NextResponse.json(
        { error: 'Email et numéro de licence requis' },
        { status: 400 }
      );
    }

    // Check if license is valid (in VALID_LICENSES env var)
    if (!isLicenseValid(licenseNumber)) {
      return NextResponse.json(
        { error: 'Numéro de licence invalide ou déjà utilisé' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Check license error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}