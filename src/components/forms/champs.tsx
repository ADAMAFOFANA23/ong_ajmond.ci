"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { cn } from "@/components/ui/primitives";

const BASE_CHAMP =
  "w-full rounded-xl border border-bleu-200 bg-white px-4 py-3 text-sm text-bleu-900 shadow-sm outline-none transition placeholder:text-bleu-800/35 focus:border-bleu-500 focus:ring-4 focus:ring-bleu-500/12 disabled:bg-bleu-50";

function Etiquette({
  htmlFor,
  children,
  requis,
}: {
  htmlFor: string;
  children: ReactNode;
  requis?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-bleu-900">
      {children}
      {requis && (
        <span aria-hidden className="ml-1 text-brique-500">
          *
        </span>
      )}
    </label>
  );
}

function Erreur({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-brique-600">
      {messages[0]}
    </p>
  );
}

type BaseProps = {
  nom: string;
  label: string;
  erreurs?: Record<string, string[]>;
  aide?: string;
  className?: string;
};

export function Champ({
  nom,
  label,
  erreurs,
  aide,
  className,
  required,
  ...props
}: BaseProps & ComponentProps<"input">) {
  const messages = erreurs?.[nom];
  return (
    <div className={className}>
      <Etiquette htmlFor={nom} requis={required}>
        {label}
      </Etiquette>
      <input
        id={nom}
        name={nom}
        required={required}
        aria-invalid={messages ? true : undefined}
        aria-describedby={messages ? `${nom}-erreur` : aide ? `${nom}-aide` : undefined}
        className={cn(BASE_CHAMP, messages && "border-brique-400 focus:border-brique-500")}
        {...props}
      />
      {aide && !messages && (
        <p id={`${nom}-aide`} className="mt-1.5 text-xs text-bleu-800/60">
          {aide}
        </p>
      )}
      <Erreur id={`${nom}-erreur`} messages={messages} />
    </div>
  );
}

export function Zone({
  nom,
  label,
  erreurs,
  aide,
  className,
  required,
  ...props
}: BaseProps & ComponentProps<"textarea">) {
  const messages = erreurs?.[nom];
  return (
    <div className={className}>
      <Etiquette htmlFor={nom} requis={required}>
        {label}
      </Etiquette>
      <textarea
        id={nom}
        name={nom}
        required={required}
        rows={5}
        aria-invalid={messages ? true : undefined}
        aria-describedby={messages ? `${nom}-erreur` : aide ? `${nom}-aide` : undefined}
        className={cn(BASE_CHAMP, "resize-y", messages && "border-brique-400 focus:border-brique-500")}
        {...props}
      />
      {aide && !messages && (
        <p id={`${nom}-aide`} className="mt-1.5 text-xs text-bleu-800/60">
          {aide}
        </p>
      )}
      <Erreur id={`${nom}-erreur`} messages={messages} />
    </div>
  );
}

export function Selecteur({
  nom,
  label,
  erreurs,
  aide,
  className,
  required,
  options,
  ...props
}: BaseProps & ComponentProps<"select"> & { options: Array<{ valeur: string; libelle: string }> }) {
  const messages = erreurs?.[nom];
  return (
    <div className={className}>
      <Etiquette htmlFor={nom} requis={required}>
        {label}
      </Etiquette>
      <select
        id={nom}
        name={nom}
        required={required}
        aria-invalid={messages ? true : undefined}
        aria-describedby={messages ? `${nom}-erreur` : undefined}
        className={cn(BASE_CHAMP, "appearance-none pr-10", messages && "border-brique-400")}
        {...props}
      >
        {options.map((option) => (
          <option key={option.valeur} value={option.valeur}>
            {option.libelle}
          </option>
        ))}
      </select>
      {aide && !messages && <p className="mt-1.5 text-xs text-bleu-800/60">{aide}</p>}
      <Erreur id={`${nom}-erreur`} messages={messages} />
    </div>
  );
}

export function CaseACocher({
  nom,
  erreurs,
  children,
  ...props
}: {
  nom: string;
  erreurs?: Record<string, string[]>;
  children: ReactNode;
} & ComponentProps<"input">) {
  const messages = erreurs?.[nom];
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={nom}
          name={nom}
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-bleu-300 text-bleu-600 focus:ring-bleu-500"
          {...props}
        />
        <label htmlFor={nom} className="text-sm leading-relaxed text-bleu-800/80">
          {children}
        </label>
      </div>
      <Erreur id={`${nom}-erreur`} messages={messages} />
    </div>
  );
}

export function BoutonEnvoi({
  children,
  className,
  variante = "primaire",
}: {
  children: ReactNode;
  className?: string;
  variante?: "primaire" | "accent";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variante === "accent"
          ? "bg-brique-500 hover:bg-brique-600 focus-visible:outline-brique-500"
          : "bg-bleu-600 hover:bg-bleu-700 focus-visible:outline-bleu-600",
        className,
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {pending ? "Envoi en cours…" : children}
    </button>
  );
}
