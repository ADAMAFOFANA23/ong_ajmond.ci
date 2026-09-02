import { raisonSupabaseAbsent } from "@/lib/supabase/env";

export type EtatFormulaire = {
  statut: "attente" | "succes" | "erreur";
  message?: string;
  erreurs?: Record<string, string[]>;
};

export const ETAT_INITIAL: EtatFormulaire = { statut: "attente" };

export const MESSAGE_SUPABASE_ABSENT =
  raisonSupabaseAbsent() ??
  "La base de données n'est pas encore configurée. Renseignez les variables Supabase dans .env.local.";
