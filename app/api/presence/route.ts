import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tetes-brulees-secret-key-change-in-prod'
);

// In-memory store (use database in production)
const presences: { [date: string]: { email: string; name: string }[] } = {};

export async function GET() {
  return NextResponse.json(presences);
}

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
    const { date, present } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date requise' }, { status: 400 });
    }

    if (!presences[date]) {
      presences[date] = [];
    }

    if (present) {
      // Add presence if not already added
      if (!presences[date].find(p => p.email === email)) {
        presences[date].push({ email, name });
      }
    } else {
      // Remove presence
      presences[date] = presences[date].filter(p => p.email !== email);
    }

    return NextResponse.json({ success: true, presences });
  } catch (error) {
    console.error('Presence error:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}