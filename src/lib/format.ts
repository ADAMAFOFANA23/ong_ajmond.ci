const FUSEAU = "Africa/Abidjan";

export function formaterDate(valeur: string | null | undefined) {
  if (!valeur) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: FUSEAU,
  }).format(new Date(valeur));
}

export function formaterDateCourte(valeur: string | null | undefined) {
  if (!valeur) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: FUSEAU,
  }).format(new Date(valeur));
}

export function formaterHeure(valeur: string | null | undefined) {
  if (!valeur) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUSEAU,
  }).format(new Date(valeur));
}

export function formaterPlage(debut: string, fin?: string | null) {
  const jour = formaterDate(debut);
  const heureDebut = formaterHeure(debut);
  if (!fin) return `${jour} à ${heureDebut}`;
  return `${jour}, ${heureDebut} – ${formaterHeure(fin)}`;
}

export function formaterMontant(montant: number) {
  return `${new Intl.NumberFormat("fr-FR").format(montant)} FCFA`;
}

export function estAVenir(valeur: string) {
  return new Date(valeur).getTime() >= Date.now();
}
