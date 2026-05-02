import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { evenements } from '../store';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tetes-brulees-secret-key-change-in-prod'
);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { email, name } = payload as { email: string; name: string };

    const body = await request.json();
    const { evenementId } = body;

    if (!evenementId) {
      return NextResponse.json({ error: 'ID événement requis' }, { status: 400 });
    }

    const evenement = evenements.find(e => e.id === evenementId);
    if (!evenement) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 });
    }

    // Check if already joined
    if (!evenement.participants.some(p => p.email === email)) {
      evenement.participants.push({ email, name });
    }

    return NextResponse.json({ success: true, evenement });
  } catch (error) {
    console.error('Join error:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}