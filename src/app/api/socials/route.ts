import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";
import { mapSocial } from "@/lib/db/mappers";
import { defaultSocials } from "@/data/defaults";
import type { SocialLink } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const auth = await requireAuth();
    const includeAll = all && auth.authed;

    if (isSupabaseConfigured()) {
      await seedDatabaseIfEmpty();
      const supabase = getSupabaseAdmin();
      let query = supabase.from("socials").select("*");

      if (!includeAll) {
        query = query.eq("enabled", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return jsonOk((data ?? []).map(mapSocial));
    }

    const socials = defaultSocials;
    return jsonOk(includeAll ? socials : socials.filter((s) => s.enabled));
  } catch {
    return jsonError("Failed to fetch social links", 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  try {
    const socials: SocialLink[] = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      for (const social of socials) {
        await supabase
          .from("socials")
          .update({ url: social.url, enabled: social.enabled })
          .eq("id", social.id);
      }
      return jsonOk(socials);
    }

    return jsonError("Database not configured", 503);
  } catch {
    return jsonError("Failed to update social links", 500);
  }
}
