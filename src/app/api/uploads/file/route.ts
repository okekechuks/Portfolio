import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/requireAuth";

const BUCKET = "portfolio-files";
const BUCKET_PUBLIC_MARKER = "/storage/v1/object/public/portfolio-files/";

function getContentDisposition(name: string): string {
  const safeName = name.replace(/"/g, "");
  return `attachment; filename="${safeName}"`;
}

function extractStoragePath(resource: string): string | null {
  if (!resource || resource.startsWith("data:")) return null;

  try {
    const url = new URL(resource, "http://localhost");

    if (url.pathname === "/api/uploads/file") {
      return url.searchParams.get("path");
    }

    const markerIndex = url.pathname.indexOf(BUCKET_PUBLIC_MARKER);
    if (markerIndex >= 0) {
      return decodeURIComponent(
        url.pathname.slice(markerIndex + BUCKET_PUBLIC_MARKER.length)
      );
    }
  } catch {
    return null;
  }

  return null;
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return new Response("File downloads are unavailable.", { status: 503 });
  }

  const path = request.nextUrl.searchParams.get("path");
  const name = request.nextUrl.searchParams.get("name") || "download.pdf";

  if (!path) {
    return new Response("Missing file path.", { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(BUCKET).download(path);

    if (error || !data) {
      return new Response("File not found.", { status: 404 });
    }

    const bytes = await data.arrayBuffer();
    const headers = new Headers();
    headers.set("Content-Type", data.type || "application/octet-stream");
    headers.set("Content-Disposition", getContentDisposition(name));

    return new Response(bytes, { status: 200, headers });
  } catch {
    return new Response("Unable to download file.", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  if (!isSupabaseConfigured()) {
    return jsonOk({ success: true });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const resource = typeof body.url === "string" ? body.url : typeof body.path === "string" ? body.path : "";
    const path = extractStoragePath(resource) ?? (typeof body.path === "string" ? body.path : null);

    if (!path) {
      return jsonError("Missing file path.", 400);
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) {
      throw error;
    }

    return jsonOk({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete file.";
    return jsonError(message, 500);
  }
}
