import { Badge, EtatVide } from "@/components/ui/primitives";
import { basculerTraitementMessage } from "@/lib/actions/admin";
import { formaterDateCourte } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { MessageContact } from "@/lib/supabase/types";

export default async function PageAdminMessages() {
  const supabase = await creerClientServeur();
  const { data } = supabase
    ? await supabase.from("messages").select("*").order("cree_le", { ascending: false })
    : { data: null };

  const messages = (data ?? []) as MessageContact[];

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-bleu-900">
        Messages reçus ({messages.length})
      </h2>

      <div className="mt-6">
        {messages.length ? (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li key={message.id} className="rounded-2xl border border-bleu-100 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-semibold text-bleu-900">
                      {message.sujet}
                    </p>
                    <p className="mt-1 text-sm text-bleu-800/70">
                      {message.nom} ·{" "}
                      <a href={`mailto:${message.email}`} className="lien-souligne">
                        {message.email}
                      </a>
                      {message.telephone ? ` · ${message.telephone}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-bleu-800/55">
                      Reçu le {formaterDateCourte(message.cree_le)}
                    </p>
                  </div>
                  <Badge ton={message.traite ? "vert" : "brique"}>
                    {message.traite ? "Traité" : "À traiter"}
                  </Badge>
                </div>

                <p className="mt-4 whitespace-pre-line rounded-xl bg-sable-50 p-4 text-sm leading-relaxed text-bleu-800/80">
                  {message.message}
                </p>

                <form action={basculerTraitementMessage} className="mt-4">
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="traite" value={String(message.traite)} />
                  <button
                    type="submit"
                    className="rounded-full border border-bleu-200 px-4 py-2 text-sm font-semibold text-bleu-700 hover:bg-bleu-50"
                  >
                    {message.traite ? "Marquer comme non traité" : "Marquer comme traité"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <EtatVide
            titre="Aucun message"
            texte="Les messages envoyés depuis la page de contact apparaîtront ici."
          />
        )}
      </div>
    </div>
  );
}
