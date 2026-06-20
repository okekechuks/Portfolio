import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/response";
import {
  clearSessionCookie,
  isAuthenticated,
  setSessionCookie,
} from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getAdminPassword } from "@/lib/db/seed";

async function getConfiguredPassword(): Promise<string> {
  if (isSupabaseConfigured()) {
    return await getAdminPassword();
  }

  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

async function validateCredentials(password: string): Promise<boolean> {
  const configuredPassword = await getConfiguredPassword();
  return Boolean(configuredPassword) && password.trim() === configuredPassword;
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password) return jsonError("Password is required", 400);

    const configuredPassword = await getConfiguredPassword();
    if (!configuredPassword) {
      return jsonError("Admin password is not configured.", 503);
    }

    const valid = await validateCredentials(password);
    if (!valid) return jsonError("Invalid password. Please try again.", 401);

    await setSessionCookie();
    return jsonOk({ success: true, message: "Login successful" });
  } catch {
    return jsonError("Login failed", 500);
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return jsonOk({ success: true, message: "Logged out successfully" });
}

export async function GET() {
  const authed = await isAuthenticated();
  return jsonOk({ isAuthenticated: authed });
}
