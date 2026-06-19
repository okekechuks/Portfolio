import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";
import { mapProject } from "@/lib/db/mappers";
import { defaultProjects } from "@/data/defaults";
import { generateId } from "@/utils/generateId";
import type { Project } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const auth = await requireAuth();
    const includeAll = all && auth.authed;

    if (isSupabaseConfigured()) {
      await seedDatabaseIfEmpty();
      const supabase = getSupabaseAdmin();
      let query = supabase.from("projects").select("*").order("sort_order");

      if (!includeAll) {
        query = query.eq("enabled", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return jsonOk((data ?? []).map(mapProject));
    }

    const projects = [...defaultProjects].sort((a, b) => a.order - b.order);
    return jsonOk(includeAll ? projects : projects.filter((p) => p.enabled));
  } catch {
    return jsonError("Failed to fetch projects", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  try {
    const body: Omit<Project, "id"> = await request.json();
    const id = generateId("proj");

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("projects")
        .insert({
          id,
          title: body.title,
          description: body.description,
          image: body.image,
          github_url: body.githubUrl,
          live_url: body.liveUrl,
          tech_stack: body.techStack,
          featured: body.featured,
          enabled: body.enabled,
          sort_order: body.order,
        })
        .select("*")
        .single();

      if (error) throw error;
      return jsonOk(mapProject(data), 201);
    }

    return jsonError("Database not configured", 503);
  } catch {
    return jsonError("Failed to create project", 500);
  }
}
