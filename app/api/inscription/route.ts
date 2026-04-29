import { NextResponse } from 'next/server';
import { prisma as getPrisma } from '@/lib/prisma';
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

    const prisma = await getPrisma();
    
    const existingLicense = await prisma.usedLicense.findUnique({
      where: { licenseNumber },
    });

    if (existingLicense) {
      return NextResponse.json(
        { error: 'Ce numéro de licence a déjà été utilisé' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }

    const hashedPassword = hashSync(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ffvlLicense: licenseNumber,
        validated: true,
        role: 'MEMBER',
      },
    });

    await prisma.usedLicense.create({
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