import { apiFetch } from "@/lib/api/client";
import { isRemoteStorageEnabled } from "@/lib/config";
import { defaultAdminSettings } from "@/data/defaults";
import { localGetSettings, localSetSettings } from "@/lib/db/localFallback";
import { stripSensitiveSettings } from "@/lib/db/mappers";
import type { AdminSettings, SiteSettings } from "@/types";

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (!isRemoteStorageEnabled()) {
      return stripSensitiveSettings(localGetSettings());
    }

    return apiFetch<SiteSettings>("/api/settings");
  },

  async getAdminSettings(): Promise<AdminSettings> {
    if (!isRemoteStorageEnabled()) {
      return localGetSettings();
    }

    const settings = await apiFetch<Partial<AdminSettings>>("/api/settings?admin=true", {
      auth: true,
    });

    return {
      ...defaultAdminSettings,
      ...settings,
    };
  },

  async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    if (!isRemoteStorageEnabled()) {
      const current = localGetSettings();
      const updated = { ...current, ...updates };
      localSetSettings(updated);
      return updated;
    }

    return apiFetch<AdminSettings>("/api/settings", {
      method: "PATCH",
      body: updates,
      auth: true,
    });
  },

  async resetSettings(): Promise<AdminSettings> {
    return settingsService.updateSettings(defaultAdminSettings);
  },
};
