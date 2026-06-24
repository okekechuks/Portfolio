import { ApiError, apiFetch } from "@/lib/api/client";
import { defaultAdminSettings } from "@/data/defaults";
import { localGetSettings, localSetSettings } from "@/lib/db/localFallback";
import { stripSensitiveSettings } from "@/lib/db/mappers";
import type { AdminSettings, SiteSettings } from "@/types";

function canUseLocalFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    try {
      return await apiFetch<SiteSettings>("/api/settings");
    } catch {
      if (!canUseLocalFallback()) throw new Error("Unable to fetch settings.");
      return stripSensitiveSettings(localGetSettings());
    }
  },

  async getAdminSettings(): Promise<AdminSettings> {
    try {
      const settings = await apiFetch<Partial<AdminSettings>>("/api/settings?admin=true", {
        auth: true,
      });

      return {
        ...defaultAdminSettings,
        ...settings,
      };
    } catch {
      if (!canUseLocalFallback()) throw new Error("Unable to fetch settings.");
      return localGetSettings();
    }
  },

  async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    try {
      return await apiFetch<AdminSettings>("/api/settings", {
        method: "PATCH",
        body: updates,
        auth: true,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status !== 503) {
        throw error;
      }

      if (!canUseLocalFallback()) {
        throw error;
      }

      const current = localGetSettings();
      const updated = { ...current, ...updates };
      localSetSettings(updated);
      return updated;
    }
  },

  async resetSettings(): Promise<AdminSettings> {
    return settingsService.updateSettings(defaultAdminSettings);
  },
};
