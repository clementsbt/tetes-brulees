import { NextResponse } from 'next/server';
import { isLicenseValid, markLicenseUsed, addValidLicense } from '@/lib/licenses';
// @ts-ignore - bcryptjs
import { hashSync } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, licenseNumber, password, addLicense } = body;

    // Admin can add new license
    if (addLicense && process.env.ADMIN_SECRET === body.adminSecret) {
      addValidLicense(addLicense);
      return NextResponse.json({ success: true, licenseAdded: addLicense });
    }

    if (!email || !licenseNumber || !password) {
      return NextResponse.json(
        { error: 'Email, numéro de licence et mot de passe requis' },
        { status: 400 }
      );
    }

    // Check if license is valid
    if (!isLicenseValid(licenseNumber)) {
      return NextResponse.json(
        { error: 'Numéro de licence invalide ou déjà utilisé' },
        { status: 400 }
      );
    }

    const hashedPassword = hashSync(password, 12);

    // Return success - actual user creation would need a database
    // For now, just mark license as used
    markLicenseUsed(licenseNumber);
    
    return NextResponse.json({ success: true, message: 'Compte créé avec succès' });
  } catch (error) {
    console.error('Inscription error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}