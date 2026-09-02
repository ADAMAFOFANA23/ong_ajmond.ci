"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/** Client Supabase utilisable dans les composants clients. */
export function creerClientNavigateur() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
