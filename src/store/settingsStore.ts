import { create } from "zustand";
import { settingsService } from "@/services/settingsService";
import { subscribeToStorage } from "@/lib/storage";
import type { AdminSettings } from "@/types";

interface SettingsState {
  settings: AdminSettings | null;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<AdminSettings>) => Promise<void>;
  subscribe: () => () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: true,

  fetchSettings: async () => {
    set({ isLoading: true });
    const settings = await settingsService.getAdminSettings();
    set({ settings, isLoading: false });
  },

  updateSettings: async (updates: Partial<AdminSettings>) => {
    const updated = await settingsService.updateSettings(updates);
    set({ settings: updated });
  },

  subscribe: () => {
    return subscribeToStorage<AdminSettings>("portfolio_settings", (settings) => {
      set({ settings });
    });
  },
}));
