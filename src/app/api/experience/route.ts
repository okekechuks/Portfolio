import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";
import { mapExperience } from "@/lib/db/mappers";
import { defaultExperience } from "@/data/defaults";
import { generateId } from "@/utils/generateId";
import type { Experience } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const auth = await requireAuth();
    const includeAll = all && auth.authed;

    if (isSupabaseConfigured()) {
      await seedDatabaseIfEmpty();
      const supabase = getSupabaseAdmin();
      let query = supabase.from("experience").select("*").order("sort_order");

      if (!includeAll) {
        query = query.eq("enabled", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return jsonOk((data ?? []).map(mapExperience));
    }

    const items = [...defaultExperience].sort((a, b) => a.order - b.order);
    return jsonOk(includeAll ? items : items.filter((e) => e.enabled));
  } catch {
    return jsonError("Failed to fetch experience", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  try {
    const body: Omit<Experience, "id"> = await request.json();
    const id = generateId("exp");

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("experience")
        .insert({
          id,
          company: body.company,
          role: body.role,
          duration: body.duration,
          description: body.description,
          technologies: body.technologies,
          enabled: body.enabled,
          sort_order: body.order,
        })
        .select("*")
        .single();

      if (error) throw error;
      return jsonOk(mapExperience(data), 201);
    }

    return jsonError("Database not configured", 503);
  } catch {
    return jsonError("Failed to create experience", 500);
  }
}
