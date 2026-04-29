import { NextResponse } from 'next/server';
import { isLicenseValid } from '@/lib/licenses';
import { createUser } from '@/lib/users';

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

    if (!isLicenseValid(licenseNumber)) {
      return NextResponse.json(
        { error: 'Numéro de licence invalide' },
        { status: 400 }
      );
    }

    // Store with both plain and hashed for demo
    createUser(email, password, licenseNumber);
    
    return NextResponse.json({ success: true, message: 'Compte créé' });
  } catch (error) {
    console.error('Inscription error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}