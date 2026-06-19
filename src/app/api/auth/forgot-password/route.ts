import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import { seedDatabaseIfEmpty, getAdminPhone } from "@/lib/db/seed";
import { defaultSettings } from "@/data/defaults";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();
    if (!phoneNumber) return jsonError("Phone number is required", 400);

    let validPhone = defaultSettings.adminPhone;

    if (isSupabaseConfigured()) {
      validPhone = await getAdminPhone();
    } else {
      validPhone = defaultSettings.adminPhone;
    }

    if (phoneNumber.trim() !== validPhone) {
      return jsonError("Phone number not recognized.", 404);
    }

    return jsonOk({ success: true, message: "OTP sent to number" });
  } catch {
    return jsonError("Request failed", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { phoneNumber, newPassword } = await request.json();
    if (!phoneNumber || !newPassword) {
      return jsonError("Phone number and new password are required", 400);
    }

    let validPhone = defaultSettings.adminPhone;

    if (isSupabaseConfigured()) {
      validPhone = await getAdminPhone();
    } else {
      validPhone = defaultSettings.adminPhone;
    }

    if (phoneNumber.trim() !== validPhone) {
      return jsonError("Phone number not recognized.", 404);
    }

    if (isSupabaseConfigured()) {
      await seedDatabaseIfEmpty();
      const supabase = getSupabaseAdmin();
      await supabase
        .from("site_settings")
        .update({ admin_password: newPassword })
        .eq("id", "site");
    } else {
      return jsonError("Database not configured", 503);
    }

    return jsonOk({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch {
    return jsonError("Reset failed", 500);
  }
}
