import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userEmail = user.email;

    // Get event with participations
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        participations: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 });
    }

    // Check if user is participant
    const isParticipant = event.participations.some(
      (p: any) => p.user.email === userEmail
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Vous n\'êtes pas inscrit à cet événement' }, { status: 400 });
    }

    // Delete participation
    await db.participation.deleteMany({
      where: { eventId: eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving evenement:', error);
    const message = error instanceof Error ? error.message : 'Inconnue';
    return NextResponse.json({ error: 'Erreur serveur: ' + message }, { status: 500 });
  }
}