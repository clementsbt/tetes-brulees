import { NextResponse } from 'next/server';
import { isLicenseValid } from '@/lib/licenses';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // In demo mode, accept test credentials
    if (email === 'clement@test.com' && password === 'test1234') {
      return NextResponse.json({
        user: { email: 'clement@test.com', licenseNumber: '1234567C' }
      });
    }

    return NextResponse.json(
      { error: 'Email ou mot de passe incorrect' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Connexion error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}