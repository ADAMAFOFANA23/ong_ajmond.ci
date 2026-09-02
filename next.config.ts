import type { NextConfig } from "next";

/** Autorise les images servies par le bucket Supabase Storage du projet. */
function hoteSupabase(): string | null {
  const brut =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  if (!brut) return null;
  try {
    return new URL(brut).hostname;
  } catch {
    return null;
  }
}

const hote = hoteSupabase();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: hote
      ? [{ protocol: "https", hostname: hote, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
