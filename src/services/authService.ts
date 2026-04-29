import type { AuthResponse, UserSession } from "@/types";
import { defaultSettings } from "@/data/defaults";
import { getFromStorage, setInStorage } from "@/lib/storage";
import { settingsService } from "./settingsService";

const SESSION_KEY = "portfolio_session" as const;
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function getSession(): UserSession {
  return getFromStorage<UserSession>(SESSION_KEY, {
    isAuthenticated: false,
    token: null,
    expiresAt: null,
  });
}

function saveSession(session: UserSession): void {
  setInStorage(SESSION_KEY, session);
}

export const authService = {
  async login(password: string): Promise<AuthResponse> {
    const settings = await settingsService.getSettings();
    const validPassword = settings.adminPassword || defaultSettings.adminPassword;
    const validPhone = settings.adminPhone || defaultSettings.adminPhone;
    const trimmed = password.trim();

    const isValid =
      trimmed === validPassword ||
      trimmed === validPhone ||
      // legacy default before phone was used as password
      (trimmed === "08029315311" && validPassword === "admin123");

    if (!isValid) {
      return { success: false, message: "Invalid password. Please try again." };
    }

    const token = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    const session: UserSession = {
      isAuthenticated: true,
      token,
      expiresAt,
    };

    saveSession(session);

    return {
      success: true,
      message: "Login successful",
      token,
    };
  },

  async logout(): Promise<AuthResponse> {
    saveSession({
      isAuthenticated: false,
      token: null,
      expiresAt: null,
    });

    return { success: true, message: "Logged out successfully" };
  },

  async forgotPassword(phoneNumber: string): Promise<AuthResponse> {
    const settings = await settingsService.getSettings();
    const validPhone = settings.adminPhone || defaultSettings.adminPhone;

    if (phoneNumber.trim() !== validPhone) {
      return {
        success: false,
        message: "Phone number not recognized.",
      };
    }

    return {
      success: true,
      message: "OTP sent to number",
    };
  },

  async resetPassword(phoneNumber: string, newPassword: string): Promise<AuthResponse> {
    const settings = await settingsService.getSettings();
    const validPhone = settings.adminPhone || defaultSettings.adminPhone;

    if (phoneNumber.trim() !== validPhone) {
      return {
        success: false,
        message: "Phone number not recognized.",
      };
    }

    await settingsService.updateSettings({ adminPassword: newPassword });

    return {
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    };
  },

  getSession(): UserSession {
    const session = getSession();

    if (session.expiresAt && Date.now() > session.expiresAt) {
      saveSession({
        isAuthenticated: false,
        token: null,
        expiresAt: null,
      });
      return {
        isAuthenticated: false,
        token: null,
        expiresAt: null,
      };
    }

    return session;
  },

  isAuthenticated(): boolean {
    return this.getSession().isAuthenticated;
  },
};
