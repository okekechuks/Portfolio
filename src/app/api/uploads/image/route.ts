import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/requireAuth";

const BUCKET = "portfolio-files";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function ensureBucketExists() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.getBucket(BUCKET);

  if (data) return;

  if (error) {
    const create = await supabase.storage.createBucket(BUCKET, {
      public: true,
    });

    if (create.error) {
      throw create.error;
    }
  }
}

function getFileExtension(file: File): string {
  const parts = file.name.split(".");
  if (parts.length < 2) return ".png";

  const ext = parts.pop()?.toLowerCase() || "png";
  return `.${ext.replace(/[^a-z0-9]/g, "") || "png"}`;
}

function isAllowedUpload(folder: string, file: File): boolean {
  if (["profile", "projects"].includes(folder)) {
    return file.type.startsWith("image/");
  }

  if (folder === "resumes") {
    return file.type === "application/pdf";
  }

  return false;
}

function buildDownloadUrl(path: string, name: string): string {
  const params = new URLSearchParams({
    path,
    name,
  });

  return `/api/uploads/file?${params.toString()}`;
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authed) return auth.response!;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return jsonError("A file is required", 400);
    }

    if (
      typeof folder !== "string" ||
      !["profile", "projects", "resumes"].includes(folder)
    ) {
      return jsonError("Invalid upload folder", 400);
    }

    if (!isAllowedUpload(folder, file)) {
      return folder === "resumes"
        ? jsonError("Only PDF files are allowed for resume uploads", 400)
        : jsonError("Only image files are allowed", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError("File must be 5MB or smaller", 400);
    }

    if (!isSupabaseConfigured()) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const base64 = bytes.toString("base64");
      const mime = file.type || "application/octet-stream";
      return jsonOk({ url: `data:${mime};base64,${base64}` });
    }

    await ensureBucketExists();

    const supabase = getSupabaseAdmin();
    const ext = getFileExtension(file);
    const path = `${folder}/${crypto.randomUUID()}${ext}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      throw error;
    }

    if (folder === "resumes") {
      return jsonOk({ url: buildDownloadUrl(path, file.name || "resume.pdf") });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return jsonOk({ url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "File upload failed";
    return jsonError(message, 500);
  }
}
