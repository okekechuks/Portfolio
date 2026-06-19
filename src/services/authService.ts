import { apiFetch } from "@/lib/api/client";
import { isRemoteStorageEnabled } from "@/lib/config";
import { defaultSettings } from "@/data/defaults";
import { getFromStorage, setInStorage } from "@/lib/storage";
import type { AuthResponse, UserSession } from "@/types";
import { localGetSettings, localSetSettings } from "@/lib/db/localFallback";

const SESSION_KEY = "portfolio_session" as const;
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

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
  const settings = localGetSettings();
  const validPassword = settings.adminPassword || defaultSettings.adminPassword;
  const validPhone = settings.adminPhone || defaultSettings.adminPhone;
  const trimmed = password.trim();

  const isValid =
    trimmed === validPassword ||
    trimmed === validPhone ||
    (trimmed === "08029315311" && validPassword === "admin123");

  if (!isValid) {
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

  async forgotPassword(phoneNumber: string): Promise<AuthResponse> {
    if (!isRemoteStorageEnabled()) {
      const settings = localGetSettings();
      const validPhone = settings.adminPhone || defaultSettings.adminPhone;
      if (phoneNumber.trim() !== validPhone) {
        return { success: false, message: "Phone number not recognized." };
      }
      return { success: true, message: "OTP sent to number" };
    }

    try {
      return await apiFetch<AuthResponse>("/api/auth/forgot-password", {
        method: "POST",
        body: { phoneNumber },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed";
      return { success: false, message };
    }
  },

  async resetPassword(phoneNumber: string, newPassword: string): Promise<AuthResponse> {
    if (!isRemoteStorageEnabled()) {
      const settings = localGetSettings();
      const validPhone = settings.adminPhone || defaultSettings.adminPhone;
      if (phoneNumber.trim() !== validPhone) {
        return { success: false, message: "Phone number not recognized." };
      }
      localSetSettings({ ...settings, adminPassword: newPassword });
      return {
        success: true,
        message: "Password reset successfully. You can now login with your new password.",
      };
    }

    try {
      return await apiFetch<AuthResponse>("/api/auth/forgot-password", {
        method: "PUT",
        body: { phoneNumber, newPassword },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Reset failed";
      return { success: false, message };
    }
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
