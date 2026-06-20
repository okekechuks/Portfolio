import { apiFetch } from "@/lib/api/client";
import { isRemoteStorageEnabled } from "@/lib/config";
import { getFromStorage, setInStorage } from "@/lib/storage";
import type { AuthResponse, UserSession } from "@/types";
import { localGetSettings } from "@/lib/db/localFallback";

const SESSION_KEY = "portfolio_session" as const;
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const RESET_DISABLED_MESSAGE = "Self-service password reset is disabled.";

function getLocalSession(): UserSession {
  return getFromStorage<UserSession>(SESSION_KEY, {
    isAuthenticated: false,
    token: null,
    expiresAt: null,
  });
}

function saveLocalSession(session: UserSession): void {
  setInStorage(SESSION_KEY, session);
}

async function localLogin(password: string): Promise<AuthResponse> {
  const validPassword = localGetSettings().adminPassword.trim();
  const trimmed = password.trim();

  if (!validPassword) {
    return {
      success: false,
      message: "Admin password is not configured for local mode.",
    };
  }

  if (trimmed !== validPassword) {
    return { success: false, message: "Invalid password. Please try again." };
  }

  saveLocalSession({
    isAuthenticated: true,
    token: `local_${Date.now()}`,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  });

  return { success: true, message: "Login successful" };
}

export const authService = {
  async login(password: string): Promise<AuthResponse> {
    if (!isRemoteStorageEnabled()) {
      return localLogin(password);
    }

    try {
      return await apiFetch<AuthResponse>("/api/auth/session", {
        method: "POST",
        body: { password },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return { success: false, message };
    }
  },

  async logout(): Promise<AuthResponse> {
    if (!isRemoteStorageEnabled()) {
      saveLocalSession({ isAuthenticated: false, token: null, expiresAt: null });
      return { success: true, message: "Logged out successfully" };
    }

    try {
      return await apiFetch<AuthResponse>("/api/auth/session", {
        method: "DELETE",
        auth: true,
      });
    } catch {
      return { success: true, message: "Logged out successfully" };
    }
  },

  async forgotPassword(): Promise<AuthResponse> {
    return {
      success: false,
      message: RESET_DISABLED_MESSAGE,
    };
  },

  async resetPassword(): Promise<AuthResponse> {
    return {
      success: false,
      message: RESET_DISABLED_MESSAGE,
    };
  },

  async checkSession(): Promise<boolean> {
    if (!isRemoteStorageEnabled()) {
      const session = getLocalSession();
      if (session.expiresAt && Date.now() > session.expiresAt) {
        saveLocalSession({ isAuthenticated: false, token: null, expiresAt: null });
        return false;
      }
      return session.isAuthenticated;
    }

    try {
      const data = await apiFetch<{ isAuthenticated: boolean }>("/api/auth/session");
      return data.isAuthenticated;
    } catch {
      return false;
    }
  },
};
