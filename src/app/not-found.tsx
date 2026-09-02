import { Conteneur, LienBouton } from "@/components/ui/primitives";

export default function PageIntrouvable() {
  return (
    <Conteneur className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-bold text-bleu-100">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-bleu-900 sm:text-3xl">
        Cette page n&apos;existe pas
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-bleu-800/70">
        Le lien est peut-être obsolète. Retrouvez nos actions, notre agenda et nos publications depuis
        l&apos;accueil.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LienBouton href="/">Retour à l&apos;accueil</LienBouton>
        <LienBouton href="/contact" variante="secondaire">
          Nous contacter
        </LienBouton>
      </div>
    </Conteneur>
  );
}
