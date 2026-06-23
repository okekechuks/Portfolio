import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapSkill } from "@/lib/db/mappers";
import type { Skill } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  const { id } = await params;

  try {
    const updates: Partial<Skill> = await request.json();

    if (!isSupabaseConfigured()) {
      return jsonError("Database not configured", 503);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("skills")
      .upsert({
        id,
        enabled: updates.enabled,
        learning: updates.learning,
        proficiency: updates.proficiency,
      }, { onConflict: "id" })
      .select("*")
      .single();

    if (error || !data) return jsonError("Skill not found", 404);
    return jsonOk(mapSkill(data));
  } catch {
    return jsonError("Failed to update skill", 500);
  }
}
