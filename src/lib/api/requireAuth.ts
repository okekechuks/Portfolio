import { isAuthenticated } from "@/lib/auth/session";
import { unauthorized } from "@/lib/api/response";

export async function requireAuth() {
  const authed = await isAuthenticated();
  if (!authed) {
    return { authed: false as const, response: unauthorized() };
  }
  return { authed: true as const, response: null };
}
