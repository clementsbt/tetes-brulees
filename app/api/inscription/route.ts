import { NextResponse } from 'next/server';
import { isLicenseValid } from '@/lib/licenses';
import { hashSync } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, licenseNumber, password } = body;

    if (!email || !licenseNumber || !password) {
      return NextResponse.json(
        { error: 'Email, numéro de licence et mot de passe requis' },
        { status: 400 }
      );
    }

    // Check if license is valid
    if (!isLicenseValid(licenseNumber)) {
      return NextResponse.json(
        { error: 'Numéro de licence invalide' },
        { status: 400 }
      );
    }

    const hashedPassword = hashSync(password, 12);

    // In production, save to database here
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Compte créé',
      user: { email, licenseNumber }
    });
  } catch (error) {
    console.error('Inscription error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}