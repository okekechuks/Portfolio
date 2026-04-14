import { defaultSettings } from "@/data/defaults";
import { getFromStorage, setInStorage } from "@/lib/storage";
import type { SiteSettings } from "@/types";

const STORAGE_KEY = "portfolio_settings" as const;

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const settings = getFromStorage<SiteSettings>(STORAGE_KEY, defaultSettings);

    if (settings.adminPassword === "admin123") {
      const migrated = {
        ...settings,
        adminPassword: defaultSettings.adminPassword,
      };
      setInStorage(STORAGE_KEY, migrated);
      return migrated;
    }

    return settings;
  },

  async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };
    setInStorage(STORAGE_KEY, updated);
    return updated;
  },

  async resetSettings(): Promise<SiteSettings> {
    setInStorage(STORAGE_KEY, defaultSettings);
    return defaultSettings;
  },
};
