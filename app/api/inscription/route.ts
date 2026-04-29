import { NextResponse } from 'next/server';
import { prisma as getPrisma } from '@/lib/prisma';
import { hashSync, compareSync } from 'bcryptjs';

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

    // Hasher le mot de passe
    const hashedPassword = hashSync(password, 12);

    // Créer l'utilisateur
    const user = await getPrisma().then(p => p.user.create({
      data: {
        email,
        password: hashedPassword,
        ffvlLicense: licenseNumber,
        validated: true,
        role: 'MEMBER',
      },
    });

    // Marquer la licence comme utilisée
    await getPrisma().then(p => p.usedLicense.create({
      data: {
        licenseNumber,
        usedById: user.id,
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('Inscription error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}