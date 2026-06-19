import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapExperience } from "@/lib/db/mappers";
import type { Experience } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  const { id } = await params;

  try {
    const updates: Partial<Experience> = await request.json();

    if (!isSupabaseConfigured()) {
      return jsonError("Database not configured", 503);
    }

    const supabase = getSupabaseAdmin();
    const row: Record<string, unknown> = {};
    if (updates.company !== undefined) row.company = updates.company;
    if (updates.role !== undefined) row.role = updates.role;
    if (updates.duration !== undefined) row.duration = updates.duration;
    if (updates.description !== undefined) row.description = updates.description;
    if (updates.technologies !== undefined) row.technologies = updates.technologies;
    if (updates.enabled !== undefined) row.enabled = updates.enabled;
    if (updates.order !== undefined) row.sort_order = updates.order;

    const { data, error } = await supabase
      .from("experience")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) return jsonError("Experience not found", 404);
    return jsonOk(mapExperience(data));
  } catch {
    return jsonError("Failed to update experience", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  const { id } = await params;

  try {
    if (!isSupabaseConfigured()) {
      return jsonError("Database not configured", 503);
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) return jsonError("Experience not found", 404);
    return jsonOk({ success: true });
  } catch {
    return jsonError("Failed to delete experience", 500);
  }
}
