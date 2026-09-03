/**
 * Redirections par rôle du proxy (src/proxy.ts).
 *
 * Trois états de session, trois destinations pour la même route `/admin` :
 * un visiteur anonyme va vers `/connexion`, un membre authentifié mais sans
 * le rôle va vers `/espace-membre`, un administrateur obtient la page. Ces
 * trois cas se ressemblent assez pour qu'une régression sur l'un passe
 * inaperçue, d'où ce test.
 *
 * Les sessions sont fabriquées par lien magique via l'API admin de Supabase :
 * aucun mot de passe n'est nécessaire, et chacune est révoquée à la fin.
 *
 * Prérequis : le serveur de développement doit tourner, et `.env.local` doit
 * pointer sur la base de dev (le test refuse de s'exécuter sur la production).
 *
 *   pnpm dev
 *   pnpm test
 */
import test, { after, before } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.URL_TEST ?? "http://localhost:3210";
const COMPTE_ADMIN = process.env.TEST_EMAIL_ADMIN ?? "fofanaadama1202@gmail.com";
const COMPTE_MEMBRE = process.env.TEST_EMAIL_MEMBRE ?? "dev.test.fof@gmail.com";

/**
 * Référence du projet de production. Le test crée des sessions et ne doit
 * jamais viser autre chose qu'une base de développement.
 */
const REF_PRODUCTION = "ljhswydcuonwuqazaxrh";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
const CLE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const CLE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SUPABASE_URL || !CLE_ANON || !CLE_SERVICE) {
  throw new Error(
    "Variables Supabase absentes. Lancez le test via `pnpm test`, qui charge .env.local.",
  );
}

if (SUPABASE_URL.includes(REF_PRODUCTION)) {
  throw new Error(
    `Refus d'exécuter le test sur la production (${REF_PRODUCTION}). ` +
      "Faites pointer .env.local sur la base de développement.",
  );
}

/** Sessions ouvertes par le test, révoquées dans le `after`. */
const sessions = [];

async function poster(chemin, charge, cle) {
  const reponse = await fetch(SUPABASE_URL + chemin, {
    method: "POST",
    headers: {
      apikey: cle,
      Authorization: `Bearer ${cle}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(charge),
  });

  const corps = await reponse.json().catch(() => ({}));
  if (!reponse.ok) {
    throw new Error(`${chemin} → HTTP ${reponse.status} : ${JSON.stringify(corps).slice(0, 200)}`);
  }
  return corps;
}

/** Ouvre une session pour une adresse, sans mot de passe. */
async function ouvrirSession(email) {
  const lien = await poster(
    "/auth/v1/admin/generate_link",
    { type: "magiclink", email },
    CLE_SERVICE,
  );

  const jeton = lien.hashed_token ?? lien.properties?.hashed_token;
  assert.ok(jeton, `aucun jeton renvoyé pour ${email} — le compte existe-t-il sur cette base ?`);

  const session = await poster(
    "/auth/v1/verify",
    { type: "magiclink", token_hash: jeton },
    CLE_ANON,
  );
  assert.ok(session.access_token, `échange de jeton impossible pour ${email}`);

  sessions.push(session);
  return session;
}

/**
 * Cookie de session au format attendu par `@supabase/ssr` : le JSON encodé en
 * base64url, préfixé de « base64- », découpé au-delà de 3180 caractères.
 */
function cookiePour(session) {
  const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
  const nom = `sb-${ref}-auth-token`;
  const valeur =
    "base64-" + Buffer.from(JSON.stringify(session)).toString("base64url");

  if (valeur.length <= 3180) return `${nom}=${valeur}`;

  const morceaux = valeur.match(/.{1,3180}/g) ?? [];
  return morceaux.map((morceau, i) => `${nom}.${i}=${morceau}`).join("; ");
}

/** Interroge une route sans suivre les redirections. */
async function sonder(chemin, cookie) {
  const reponse = await fetch(BASE + chemin, {
    redirect: "manual",
    headers: cookie ? { Cookie: cookie } : {},
  });
  return { statut: reponse.status, destination: reponse.headers.get("location") };
}

before(async () => {
  // Première requête volontairement hors assertion : elle absorbe la
  // compilation à la demande du serveur de développement.
  try {
    await fetch(BASE, { redirect: "manual" });
  } catch (cause) {
    throw new Error(`Serveur injoignable sur ${BASE}. Lancez « pnpm dev ».`, { cause });
  }
});

after(async () => {
  await Promise.all(
    sessions.map((session) =>
      fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: CLE_ANON,
          Authorization: `Bearer ${session.access_token}`,
        },
      }).catch(() => {}),
    ),
  );
});

test("un visiteur anonyme est renvoyé vers la connexion, destination conservée", async () => {
  const { statut, destination } = await sonder("/admin");

  assert.equal(statut, 307);
  assert.match(destination ?? "", /\/connexion\?suite=%2Fadmin$/);
});

test("un membre sans le rôle admin est renvoyé vers son espace", async () => {
  const session = await ouvrirSession(COMPTE_MEMBRE);
  const cookie = cookiePour(session);

  for (const chemin of ["/admin", "/admin/membres"]) {
    const { statut, destination } = await sonder(chemin, cookie);

    assert.equal(statut, 307, `${chemin} aurait dû rediriger`);
    assert.match(
      destination ?? "",
      /\/espace-membre$/,
      `${chemin} doit mener à l'espace membre, pas à la page de connexion`,
    );
  }
});

test("un membre accède à son propre espace", async () => {
  const session = await ouvrirSession(COMPTE_MEMBRE);
  const { statut } = await sonder("/espace-membre", cookiePour(session));

  assert.equal(statut, 200);
});

test("un membre ne peut pas se promouvoir administrateur", async () => {
  const session = await ouvrirSession(COMPTE_MEMBRE);

  const tentative = await fetch(
    `${SUPABASE_URL}/rest/v1/profils?id=eq.${session.user.id}`,
    {
      method: "PATCH",
      headers: {
        apikey: CLE_ANON,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "admin" }),
    },
  );

  assert.equal(tentative.status, 403, "l'API a accepté une auto-promotion");

  const apres = await fetch(
    `${SUPABASE_URL}/rest/v1/profils?id=eq.${session.user.id}&select=role`,
    { headers: { apikey: CLE_ANON, Authorization: `Bearer ${session.access_token}` } },
  );
  const [profil] = await apres.json();

  assert.equal(profil.role, "membre", "le rôle a changé malgré le refus");
});

test("un administrateur accède à l'espace d'administration", async () => {
  const session = await ouvrirSession(COMPTE_ADMIN);
  const cookie = cookiePour(session);

  for (const chemin of ["/admin", "/admin/membres"]) {
    const { statut } = await sonder(chemin, cookie);
    assert.equal(statut, 200, `${chemin} devait être servie à un administrateur`);
  }
});
