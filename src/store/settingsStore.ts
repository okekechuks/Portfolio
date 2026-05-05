import { create } from "zustand";
import { settingsService } from "@/services/settingsService";
import { subscribeToStorage } from "@/lib/storage";
import type { SiteSettings } from "@/types";

interface SettingsState {
  settings: SiteSettings | null;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  subscribe: () => () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: true,

  fetchSettings: async () => {
    set({ isLoading: true });
    const settings = await settingsService.getSettings();
    set({ settings, isLoading: false });
  },

  updateSettings: async (updates: Partial<SiteSettings>) => {
    const updated = await settingsService.updateSettings(updates);
    set({ settings: updated });
  },

  subscribe: () => {
    return subscribeToStorage<SiteSettings>("portfolio_settings", (settings) => {
      set({ settings });
    });
  },
}));
