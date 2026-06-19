import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapProject } from "@/lib/db/mappers";
import type { Project } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  const { id } = await params;

  try {
    const updates: Partial<Project> = await request.json();

    if (!isSupabaseConfigured()) {
      return jsonError("Database not configured", 503);
    }

    const supabase = getSupabaseAdmin();
    const row: Record<string, unknown> = {};
    if (updates.title !== undefined) row.title = updates.title;
    if (updates.description !== undefined) row.description = updates.description;
    if (updates.image !== undefined) row.image = updates.image;
    if (updates.githubUrl !== undefined) row.github_url = updates.githubUrl;
    if (updates.liveUrl !== undefined) row.live_url = updates.liveUrl;
    if (updates.techStack !== undefined) row.tech_stack = updates.techStack;
    if (updates.featured !== undefined) row.featured = updates.featured;
    if (updates.enabled !== undefined) row.enabled = updates.enabled;
    if (updates.order !== undefined) row.sort_order = updates.order;

    const { data, error } = await supabase
      .from("projects")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) return jsonError("Project not found", 404);
    return jsonOk(mapProject(data));
  } catch {
    return jsonError("Failed to update project", 500);
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
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return jsonError("Project not found", 404);
    return jsonOk({ success: true });
  } catch {
    return jsonError("Failed to delete project", 500);
  }
}
