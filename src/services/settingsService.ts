import { apiFetch } from "@/lib/api/client";
import { isRemoteStorageEnabled } from "@/lib/config";
import { defaultSettings } from "@/data/defaults";
import { localGetSettings, localSetSettings } from "@/lib/db/localFallback";
import type { SiteSettings } from "@/types";

export const settingsService = {
  async getSettings(options?: { admin?: boolean }): Promise<SiteSettings> {
    if (!isRemoteStorageEnabled()) {
      return localGetSettings();
    }

    const admin = options?.admin ?? false;
    const query = admin ? "?admin=true" : "";
    const settings = await apiFetch<
      Omit<SiteSettings, "adminPassword"> & Partial<Pick<SiteSettings, "adminPassword">>
    >(`/api/settings${query}`, admin ? { auth: true } : {});

    return {
      ...defaultSettings,
      ...settings,
      adminPassword: settings.adminPassword ?? defaultSettings.adminPassword,
    };
  },

  async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    if (!isRemoteStorageEnabled()) {
      const current = localGetSettings();
      const updated = { ...current, ...updates };
      localSetSettings(updated);
      return updated;
    }

    return apiFetch<SiteSettings>("/api/settings", {
      method: "PATCH",
      body: updates,
      auth: true,
    });
  },

  async resetSettings(): Promise<SiteSettings> {
    return this.updateSettings(defaultSettings);
  },
};
