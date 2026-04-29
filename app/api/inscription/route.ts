import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
    const existingLicense = await prisma.usedLicense.findUnique({
      where: { licenseNumber },
    });

    if (existingLicense) {
      return NextResponse.json(
        { error: 'Ce numéro de licence a déjà été utilisé' },
        { status: 400 }
      );
    }

    // Vérifier que l'email n'est pas déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer le user et marquer la licence comme utilisée en transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          ffvlLicense: licenseNumber,
          validated: true,
          role: 'MEMBER',
        },
      });

      // Marquer la licence comme utilisée
      await tx.usedLicense.create({
        data: {
          licenseNumber,
          usedById: user.id,
        },
      });

      return user;
    });

    return NextResponse.json({ success: true, userId: result.id });
  } catch (error) {
    console.error('Inscription error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}