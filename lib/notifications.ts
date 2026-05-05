import { db } from './db';
import { sendNewEventNotification, sendNewParticipantNotification } from './email';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tetes-brulees.fr';

/**
 * Notifie les utilisateurs qui veulent être prévenus d'une nouvelle sortie
 */
export async function notifyNewEvent(eventTitle: string, eventDate: string, eventLocation: string) {
  // Récupère tous les users qui ont coché la case
  const usersToNotify = await db.user.findMany({
    where: {
      notifyOnNewEvent: true,
      validated: true,
    },
    select: { email: true, name: true },
  });

  console.log(`[NOTIF] Nouvelle sortie: ${usersToNotify.length} destinitaires`);

  for (const user of usersToNotify) {
    if (!user.email) continue;
    try {
      await sendNewEventNotification(
        user.email,
        user.name || 'Membre',
        eventTitle,
        eventDate,
        eventLocation,
        `${BASE_URL}/sorties-club`
      );
    } catch (err) {
      console.error(`[NOTIF] Erreur pour ${user.email}:`, err);
    }
  }
}

/**
 * Notifie les utilisateurs qui suivent une sortie qu'un nouveau participant a rejoint
 */
export async function notifyNewParticipant(
  eventTitle: string,
  eventDate: string,
  participantName: string,
  participantEmail: string
) {
  // Trouver lesusers participants à cet event + ceux qui ont coché la notif
  // Pour l'instant on notifie tous ceux qui ont notifyOnNewEvent = true
  // (c'est une simplification - peut etre affiné plus tard)
  const usersToNotify = await db.user.findMany({
    where: {
      notifyOnNewEvent: true,
      validated: true,
      // Exclure celui qui vient de rejoindre
      email: { not: participantEmail },
    },
    select: { email: true, name: true },
  });

  console.log(`[NOTIF] Nouveau participant: ${usersToNotify.length} destinitaires`);

  for (const user of usersToNotify) {
    if (!user.email) continue;
    try {
      await sendNewParticipantNotification(
        user.email,
        user.name || 'Membre',
        participantName,
        eventTitle,
        eventDate
      );
    } catch (err) {
      console.error(`[NOTIF] Erreur pour ${user.email}:`, err);
    }
  }
}