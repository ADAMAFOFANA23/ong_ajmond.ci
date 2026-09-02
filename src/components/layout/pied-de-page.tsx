import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { NAVIGATION, ORGANISATION } from "@/content/organisation";
import { Logo } from "./logo";

const LIENS_UTILES = [
  { href: "/adhesion", label: "Devenir membre" },
  { href: "/soutenir", label: "Soutenir l'ONG" },
  { href: "/espace-membre", label: "Espace membre" },
  { href: "/mentions-legales", label: "Mentions légales" },
];

export function PiedDePage() {
  return (
    <footer className="mt-auto bg-bleu-950 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white/95 p-3 inline-block">
              <Logo />
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              {ORGANISATION.nature} régie par la loi n° 60-315 du 21 septembre 1960. Apolitique et à
              but non lucratif, elle lutte contre les fléaux sociaux en milieu scolaire et dans les
              zones vulnérables.
            </p>
          </div>

          <nav aria-label="Pages du site">
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white/50">
              Naviguer
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAVIGATION.map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} className="lien-souligne text-white/80 hover:text-white">
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white/50">
              Nous joindre
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brique-400" aria-hidden />
                <span>
                  {ORGANISATION.siege}
                  <br />
                  {ORGANISATION.boitePostale}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brique-400" aria-hidden />
                <span>
                  {ORGANISATION.telephones.map((tel) => (
                    <a key={tel} href={`tel:${tel.replace(/\s/g, "")}`} className="block hover:text-white">
                      {tel}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brique-400" aria-hidden />
                <a href={`mailto:${ORGANISATION.email}`} className="break-all hover:text-white">
                  {ORGANISATION.email}
                </a>
              </li>
            </ul>

            <ul className="mt-6 space-y-2.5 text-sm">
              {LIENS_UTILES.map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} className="lien-souligne text-white/60 hover:text-white">
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {ORGANISATION.sigle} — {ORGANISATION.nom}.
          </p>
          <p>Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
