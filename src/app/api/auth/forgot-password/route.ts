import { jsonError } from "@/lib/api/response";

const DISABLED_MESSAGE =
  "Self-service password reset is disabled. Rotate the admin password manually.";

export async function POST() {
  return jsonError(DISABLED_MESSAGE, 501);
}

export async function PUT() {
  return jsonError(DISABLED_MESSAGE, 501);
}
