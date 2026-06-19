import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";
import { mapSkill } from "@/lib/db/mappers";
import { getDefaultSkills } from "@/data/defaults";
import type { Skill } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const auth = await requireAuth();
    const includeAll = all && auth.authed;

    if (isSupabaseConfigured()) {
      await seedDatabaseIfEmpty();
      const supabase = getSupabaseAdmin();
      let query = supabase.from("skills").select("*").order("category").order("name");

      if (!includeAll) {
        query = query.eq("enabled", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return jsonOk((data ?? []).map(mapSkill));
    }

    const skills = getDefaultSkills();
    return jsonOk(includeAll ? skills : skills.filter((s) => s.enabled));
  } catch {
    return jsonError("Failed to fetch skills", 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  try {
    const skills: Skill[] = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      for (const skill of skills) {
        await supabase
          .from("skills")
          .update({
            enabled: skill.enabled,
            learning: skill.learning,
            proficiency: skill.proficiency,
          })
          .eq("id", skill.id);
      }
      return jsonOk(skills);
    }

    return jsonError("Database not configured", 503);
  } catch {
    return jsonError("Failed to update skills", 500);
  }
}
