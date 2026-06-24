import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/requireAuth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";
import { mapSettings, stripSensitiveSettings } from "@/lib/db/mappers";
import { defaultAdminSettings, defaultSiteSettings } from "@/data/defaults";
import type { AdminSettings } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

      if (error || !data) {
        return jsonOk(includeSensitive ? defaultAdminSettings : defaultSiteSettings);
      }

      const settings = mapSettings(data);
      return jsonOk(includeSensitive ? settings : stripSensitiveSettings(settings));
    }

    return jsonOk(includeSensitive ? defaultAdminSettings : defaultSiteSettings);
  } catch {
    return jsonError("Failed to fetch settings", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  try {
    const updates: Partial<AdminSettings> = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const { data: current } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "site")
        .maybeSingle();
      const base = current ? mapSettings(current) : defaultAdminSettings;
      const merged = { ...base, ...updates };
      const row: Record<string, unknown> = {
        id: "site",
        name: merged.name,
        title: merged.title,
        introduction: merged.introduction,
        profile_image: merged.profileImage,
        resume_url: merged.resumeUrl,
        accent_color: merged.accentColor,
        dark_mode: merged.darkMode,
        admin_password: merged.adminPassword,
        admin_phone: merged.adminPhone,
      };

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
        .upsert(row, { onConflict: "id" })
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
