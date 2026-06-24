import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";
import { mapSkill } from "@/lib/db/mappers";
import { getDefaultSkills } from "@/data/defaults";
import type { Skill } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function mergeWithDefaultSkills(rows: Record<string, unknown>[]): Skill[] {
  const savedById = new Map(rows.map((row) => [row.id as string, mapSkill(row)]));

  return getDefaultSkills().map((defaultSkill) => ({
    ...defaultSkill,
    ...savedById.get(defaultSkill.id),
  }));
}

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const includeAll = all;

    if (isSupabaseConfigured()) {
      await seedDatabaseIfEmpty();
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category")
        .order("name");
      if (error) throw error;

      const skills = mergeWithDefaultSkills(data ?? []);
      return jsonOk(includeAll ? skills : skills.filter((skill) => skill.enabled));
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
      const payload = skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        enabled: skill.enabled,
        learning: skill.learning,
        proficiency: skill.proficiency,
      }));

      const { data, error } = await supabase
        .from("skills")
        .upsert(payload, { onConflict: "id" })
        .select("*");

      if (error) throw error;
      return jsonOk(mergeWithDefaultSkills(data ?? []));
    }

    return jsonError("Database not configured", 503);
  } catch {
    return jsonError("Failed to update skills", 500);
  }
}
