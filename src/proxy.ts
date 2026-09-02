import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigure } from "@/lib/supabase/env";

const ROUTES_PROTEGEES = ["/espace-membre", "/admin"];

export async function proxy(requete: NextRequest) {
  let reponse = NextResponse.next({ request: requete });

  if (!supabaseConfigure) return reponse;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return requete.cookies.getAll();
      },
      setAll(cookiesAEcrire) {
        for (const { name, value } of cookiesAEcrire) {
          requete.cookies.set(name, value);
        }
        reponse = NextResponse.next({ request: requete });
        for (const { name, value, options } of cookiesAEcrire) {
          reponse.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const chemin = requete.nextUrl.pathname;
  const protege = ROUTES_PROTEGEES.some((prefixe) => chemin.startsWith(prefixe));

  if (protege && !user) {
    const url = requete.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("suite", chemin);
    return NextResponse.redirect(url);
  }

  if (chemin.startsWith("/admin") && user) {
    const { data: profil } = await supabase
      .from("profils")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profil?.role !== "admin") {
      const url = requete.nextUrl.clone();
      url.pathname = "/espace-membre";
      return NextResponse.redirect(url);
    }
  }

  return reponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)"],
};
