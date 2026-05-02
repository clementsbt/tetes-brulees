import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { evenements } from './store';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tetes-brulees-secret-key-change-in-prod'
);

export async function GET() {
  // Filter events from current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const filtered = evenements.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });

  return NextResponse.json(filtered);
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
    const { nom, date } = body;

    if (!nom || !date) {
      return NextResponse.json({ error: 'Nom et date requis' }, { status: 400 });
    }

    const evenement = {
      id: Date.now().toString(),
      nom,
      date,
      createurEmail: email,
      createurNom: name,
      participants: [{ email, name }],
    };

    evenements.push(evenement);

    return NextResponse.json({ success: true, evenement });
  } catch (error) {
    console.error('Evenement error:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}