interface Evenement {
  id: string;
  nom: string;
  date: string;
  createurEmail: string;
  createurNom: string;
  participants: { email: string; name: string }[];
}

export const evenements: Evenement[] = [];