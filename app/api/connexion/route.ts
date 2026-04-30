import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tetes-brulees-secret-key-change-in-prod'
);

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

    // Demo credentials (in production, check against database)
    const validUsers: Record<string, { password: string; name: string }> = {
      'clement@test.com': { password: 'test1234', name: 'Clément' },
    };

    const user = validUsers[email.toLowerCase()];
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Create JWT token - expires in 5 minutes
    const token = await new SignJWT({ 
      email, 
      name: user.name 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ 
      success: true,
      user: { email, name: user.name }
    });

    // Set httpOnly cookie - 5 min for inactivity timeout
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Connexion error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
  return response;
}