"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from "lucide-react";

import { cn } from "@/components/ui/primitives";
import type { ChampContenu, LigneListe } from "@/lib/contenus";

/**
 * Éditeur de liste répétable.
 *
 * L'état vit dans React et n'est sérialisé qu'au moment de l'envoi, dans un
 * champ caché : le formulaire parent n'a rien à savoir de la structure, et
 * l'action côté serveur ne reçoit qu'un JSON à valider.
 *
 * Le bouton « Rétablir » remet les lignes livrées dans le code plutôt que de
 * vider la section — sur des contenus statutaires, une liste effacée par
 * erreur est bien plus coûteuse qu'une liste mal ordonnée.
 */
export function EditeurListe({
  champ,
  lignesInitiales,
}: {
  champ: ChampContenu;
  lignesInitiales: LigneListe[];
}) {
  const colonnes = champ.colonnes ?? [];
  const [lignes, setLignes] = useState<LigneListe[]>(lignesInitiales);
  const identifiant = useId();

  function modifier(index: number, colonne: string, valeur: string) {
    setLignes((actuelles) =>
      actuelles.map((ligne, i) => (i === index ? { ...ligne, [colonne]: valeur } : ligne)),
    );
  }

  function ajouter() {
    setLignes((actuelles) => [
      ...actuelles,
      Object.fromEntries(colonnes.map((colonne) => [colonne.nom, ""])),
    ]);
  }

  function retirer(index: number) {
    setLignes((actuelles) => actuelles.filter((_, i) => i !== index));
  }

  function deplacer(index: number, sens: -1 | 1) {
    const cible = index + sens;
    if (cible < 0 || cible >= lignes.length) return;

    setLignes((actuelles) => {
      const copie = [...actuelles];
      [copie[index], copie[cible]] = [copie[cible], copie[index]];
      return copie;
    });
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-bleu-900">{champ.label}</legend>
      {champ.aide && <p className="mt-1 text-xs text-bleu-800/60">{champ.aide}</p>}

      {/* Le formulaire ne transporte que ce champ ; le reste est interface. */}
      <input type="hidden" name={champ.cle} value={JSON.stringify(lignes)} />

      <ol className="mt-4 space-y-3">
        {lignes.map((ligne, index) => (
          <li
            key={`${identifiant}-${index}`}
            className="rounded-xl border border-craie-300 bg-craie-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="chiffres text-xs font-semibold text-bleu-800/45">
                {index + 1}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => deplacer(index, -1)}
                  disabled={index === 0}
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                    index === 0
                      ? "cursor-not-allowed text-bleu-800/20"
                      : "text-bleu-800/60 hover:bg-white hover:text-bleu-900",
                  )}
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only">Monter la ligne {index + 1}</span>
                </button>

                <button
                  type="button"
                  onClick={() => deplacer(index, 1)}
                  disabled={index === lignes.length - 1}
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                    index === lignes.length - 1
                      ? "cursor-not-allowed text-bleu-800/20"
                      : "text-bleu-800/60 hover:bg-white hover:text-bleu-900",
                  )}
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only">Descendre la ligne {index + 1}</span>
                </button>

                <button
                  type="button"
                  onClick={() => retirer(index)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-brique-600 transition-colors hover:bg-brique-50"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only">Retirer la ligne {index + 1}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {colonnes.map((colonne) => {
                const champId = `${identifiant}-${index}-${colonne.nom}`;
                const commun =
                  "w-full rounded-lg border border-craie-300 bg-white px-3 py-2 text-sm text-bleu-900 outline-none transition focus:border-bleu-500";

                return (
                  <div key={colonne.nom}>
                    <label
                      htmlFor={champId}
                      className="mb-1 block text-xs font-medium text-bleu-800/70"
                    >
                      {colonne.label}
                    </label>

                    {colonne.type === "long" ? (
                      <textarea
                        id={champId}
                        rows={2}
                        value={ligne[colonne.nom] ?? ""}
                        onChange={(evenement) =>
                          modifier(index, colonne.nom, evenement.target.value)
                        }
                        className={commun}
                      />
                    ) : (
                      <input
                        id={champId}
                        type="text"
                        value={ligne[colonne.nom] ?? ""}
                        onChange={(evenement) =>
                          modifier(index, colonne.nom, evenement.target.value)
                        }
                        className={commun}
                      />
                    )}

                    {colonne.aide && (
                      <p className="mt-1 text-xs text-bleu-800/55">{colonne.aide}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {lignes.length === 0 && (
        <p className="mt-3 rounded-xl border border-dashed border-craie-300 bg-craie-50 px-4 py-6 text-center text-sm text-bleu-800/60">
          Liste vide. En l&apos;enregistrant ainsi, le site réaffichera le contenu d&apos;origine.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={ajouter}
          className="inline-flex items-center gap-1.5 rounded-lg border border-craie-300 px-3 py-2 text-xs font-semibold text-bleu-800 transition-colors hover:border-bleu-300"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Ajouter une ligne
        </button>

        <button
          type="button"
          onClick={() => setLignes(champ.lignesParDefaut ?? [])}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-bleu-800/70 transition-colors hover:text-bleu-900"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Rétablir le contenu d&apos;origine
        </button>
      </div>
    </fieldset>
  );
}
