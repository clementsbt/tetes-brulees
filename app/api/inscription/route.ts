import { NextResponse } from 'next/server';
import { isLicenseValid } from '@/lib/licenses';
import { registerUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, licenseNumber, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // License validation (optional but recommended)
    if (licenseNumber) {
      const valid = await isLicenseValid(licenseNumber);
      if (!valid) {
        return NextResponse.json(
          { error: 'Numéro de licence invalide' },
          { status: 400 }
        );
      }
    }

    const user = await registerUser(
      email.toLowerCase(),
      password,
      name || email.split('@')[0],
      licenseNumber
    );

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'inscription' },
      { status: 400 }
    );
  }
}