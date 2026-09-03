import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { estGestionnaire } from "@/lib/roles";
import { SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, supabaseConfigure } from "./env";
import type { Profil } from "./types";

/**
 * Client Supabase côté serveur, lié aux cookies de session.
 * Renvoie `null` si le projet n'est pas encore configuré : les pages
 * publiques savent alors afficher un contenu de repli plutôt que planter.
 */
export async function creerClientServeur(): Promise<SupabaseClient | null> {
  if (!supabaseConfigure) return null;

  const magasin = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return magasin.getAll();
      },
      setAll(cookiesAEcrire) {
        try {
          for (const { name, value, options } of cookiesAEcrire) {
            magasin.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component : le proxy rafraîchit la session.
        }
      },
    },
  });
}

/**
 * Client à privilèges élevés (clé service_role), réservé aux traitements
 * serveur qui doivent contourner les politiques RLS.
 */
export function creerClientService(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;

  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

/** Profil du membre connecté, ou `null`. */
export async function profilCourant(): Promise<Profil | null> {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profils").select("*").eq("id", user.id).single();
  return (data as Profil) ?? null;
}

/**
 * Profil administrateur courant. Le proxy protège déjà `/admin` ;
 * ce contrôle sert de seconde barrière côté données.
 */
export async function profilAdmin(): Promise<Profil | null> {
  const profil = await profilCourant();
  return profil?.role === "admin" ? profil : null;
}

/**
 * Profil ayant accès à l'espace de gestion, quel que soit son rôle.
 * Le cloisonnement par section se fait ensuite avec `peutAcceder`.
 */
export async function profilGestionnaire(): Promise<Profil | null> {
  const profil = await profilCourant();
  return profil && estGestionnaire(profil.role) ? profil : null;
}
