import Image from "next/image";
import Link from "next/link";

import { ORGANISATION } from "@/content/organisation";

export function Logo({
  compact = false,
  inverse = false,
}: {
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Accueil A.J.MOND-CI">
      <Image
        src="/brand/logo-ajmond-ci.svg"
        alt=""
        width={48}
        height={48}
        priority
        className="h-11 w-11 shrink-0 transition-transform group-hover:-rotate-3"
      />
      {!compact && (
        <span className="leading-tight">
          <span
            className={`block font-display text-base font-bold tracking-tight ${
              inverse ? "text-white" : "text-bleu-900"
            }`}
          >
            {ORGANISATION.sigle}
          </span>
          <span
            className={`block max-w-[15rem] text-[11px] ${
              inverse ? "text-white/70" : "text-bleu-800/60"
            }`}
          >
            {ORGANISATION.nom}
          </span>
        </span>
      )}
    </Link>
  );
}
