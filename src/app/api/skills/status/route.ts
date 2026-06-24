import { jsonError, jsonOk } from "@/lib/api/response";
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

export async function GET() {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  try {
    if (!isSupabaseConfigured()) {
      return jsonOk({
        configured: false,
        total: 0,
        enabled: 0,
        enabledNames: [],
      });
    }

    await seedDatabaseIfEmpty();

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("name");

    if (error) throw error;

    const skills = mergeWithDefaultSkills(data ?? []);
    const enabledSkills = skills.filter((skill) => skill.enabled);

    return jsonOk({
      configured: true,
      total: skills.length,
      enabled: enabledSkills.length,
      enabledNames: enabledSkills.map((skill) => skill.name),
    });
  } catch {
    return jsonError("Unable to read skills status", 500);
  }
}
