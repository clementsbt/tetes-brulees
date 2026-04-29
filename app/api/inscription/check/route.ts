import { NextResponse } from 'next/server';
import { prisma as getPrisma } from '@/lib/prisma';

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

    // Vérifier que le numéro de licence n'est pas déjà utilisé
    const existingLicense = await getPrisma().then(p => p.usedLicense.findUnique({
      where: { licenseNumber },
    });

    if (existingLicense) {
      return NextResponse.json(
        { error: 'Ce numéro de licence a déjà été utilisé' },
        { status: 400 }
      );
    }

    // Vérifier que l'email n'est pas déjà utilisé
    const existingUser = await getPrisma().then(p => p.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
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