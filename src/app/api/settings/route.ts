import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";
import { mapSettings, stripSensitiveSettings } from "@/lib/db/mappers";
import { defaultSettings } from "@/data/defaults";
import type { SiteSettings } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const admin = request.nextUrl.searchParams.get("admin") === "true";
    const auth = await requireAuth();
    const includeSensitive = admin && auth.authed;

    if (isSupabaseConfigured()) {
      await seedDatabaseIfEmpty();
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "site")
        .single();

      if (error || !data) return jsonOk(defaultSettings);

      const settings = mapSettings(data);
      return jsonOk(includeSensitive ? settings : stripSensitiveSettings(settings));
    }

    const settings = defaultSettings;
    return jsonOk(includeSensitive ? settings : stripSensitiveSettings(settings));
  } catch {
    return jsonError("Failed to fetch settings", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  try {
    const updates: Partial<SiteSettings> = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const row: Record<string, unknown> = {};
      if (updates.name !== undefined) row.name = updates.name;
      if (updates.title !== undefined) row.title = updates.title;
      if (updates.introduction !== undefined) row.introduction = updates.introduction;
      if (updates.profileImage !== undefined) row.profile_image = updates.profileImage;
      if (updates.resumeUrl !== undefined) row.resume_url = updates.resumeUrl;
      if (updates.accentColor !== undefined) row.accent_color = updates.accentColor;
      if (updates.darkMode !== undefined) row.dark_mode = updates.darkMode;
      if (updates.adminPassword !== undefined) row.admin_password = updates.adminPassword;
      if (updates.adminPhone !== undefined) row.admin_phone = updates.adminPhone;

      const { data, error } = await supabase
        .from("site_settings")
        .update(row)
        .eq("id", "site")
        .select("*")
        .single();

      if (error) throw error;
      return jsonOk(mapSettings(data));
    }

    return jsonError("Database not configured", 503);
  } catch {
    return jsonError("Failed to update settings", 500);
  }
}
