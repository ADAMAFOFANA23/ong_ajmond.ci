import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import {
  Chapo,
  Conteneur,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { FormulaireContact } from "@/components/forms/formulaire-contact";
import { ORGANISATION } from "@/content/organisation";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter l'ONG A.J.MOND-CI : accueillir une intervention, proposer un partenariat ou demander des informations.",
};

export default function PageContact() {
  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-16 lg:py-20">
          <Surtitre>Contact</Surtitre>
          <TitreSection niveau={1} className="max-w-3xl">
            Parlons de votre établissement ou de votre projet
          </TitreSection>
          <Chapo>
            Direction d&apos;établissement, parent d&apos;élève, partenaire institutionnel ou
            bénévole : écrivez-nous, nous répondons à chaque message.
          </Chapo>
        </Conteneur>
      </section>

      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-xl font-semibold text-bleu-900">Nos coordonnées</h2>

            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bleu-50 text-bleu-600">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-bleu-800/80">
                  <strong className="block font-semibold text-bleu-900">Siège social</strong>
                  {ORGANISATION.siege}
                  <br />
                  {ORGANISATION.boitePostale}
                </span>
              </li>

              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bleu-50 text-bleu-600">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-bleu-800/80">
                  <strong className="block font-semibold text-bleu-900">Téléphone</strong>
                  {ORGANISATION.telephones.map((tel) => (
                    <a
                      key={tel}
                      href={`tel:${tel.replace(/\s/g, "")}`}
                      className="block hover:text-bleu-700"
                    >
                      {tel}
                    </a>
                  ))}
                </span>
              </li>

              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bleu-50 text-bleu-600">
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-bleu-800/80">
                  <strong className="block font-semibold text-bleu-900">E-mail</strong>
                  <a
                    href={`mailto:${ORGANISATION.email}`}
                    className="break-all hover:text-bleu-700"
                  >
                    {ORGANISATION.email}
                  </a>
                </span>
              </li>
            </ul>

            <div className="mt-10 rounded-2xl border border-bleu-100 bg-sable-50/70 p-6">
              <h3 className="font-display text-base font-semibold text-bleu-900">
                Accueillir une intervention
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bleu-800/70">
                Les forums et conférences sont organisés en accord avec la direction de
                l&apos;établissement et la DREN. Indiquez-nous le nom de l&apos;établissement, le
                nombre d&apos;élèves concernés et vos périodes possibles.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-bleu-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-xl font-semibold text-bleu-900">
                Nous écrire
              </h2>
              <p className="mt-1.5 text-sm text-bleu-800/70">
                Les champs marqués d&apos;un astérisque sont obligatoires.
              </p>
              <div className="mt-6">
                <FormulaireContact />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
