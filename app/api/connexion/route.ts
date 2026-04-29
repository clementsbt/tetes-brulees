import { NextResponse } from 'next/server';
import { findUser, validateUser } from '@/lib/users';
import { compareSync } from 'bcryptjs';

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

    const user = findUser(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const isValid = compareSync(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        email: user.email,
        licenseNumber: user.licenseNumber,
      },
    });
  } catch (error) {
    console.error('Connexion error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}