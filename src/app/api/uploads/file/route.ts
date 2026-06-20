import { NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

const BUCKET = "portfolio-files";

function getContentDisposition(name: string): string {
  const safeName = name.replace(/"/g, "");
  return `attachment; filename="${safeName}"`;
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
