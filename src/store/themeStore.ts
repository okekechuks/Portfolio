import { create } from "zustand";
import { settingsService } from "@/services/settingsService";
import type { SiteSettings } from "@/types";

interface ThemeState {
  darkMode: boolean;
  accentColor: string;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setDarkMode: (darkMode: boolean) => Promise<void>;
  setAccentColor: (color: string) => Promise<void>;
  applyTheme: (settings: SiteSettings) => void;
}

function applyThemeToDOM(darkMode: boolean, accentColor: string) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", darkMode);
  document.documentElement.style.setProperty("--accent", accentColor);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  darkMode: true,
  accentColor: "#3b82f6",
  isHydrated: false,

  hydrate: async () => {
    const settings = await settingsService.getSettings();
    applyThemeToDOM(settings.darkMode, settings.accentColor);
    set({
      darkMode: settings.darkMode,
      accentColor: settings.accentColor,
      isHydrated: true,
    });
  },

  setDarkMode: async (darkMode: boolean) => {
    await settingsService.updateSettings({ darkMode });
    applyThemeToDOM(darkMode, get().accentColor);
    set({ darkMode });
  },

  setAccentColor: async (accentColor: string) => {
    await settingsService.updateSettings({ accentColor });
    applyThemeToDOM(get().darkMode, accentColor);
    set({ accentColor });
  },

  applyTheme: (settings: SiteSettings) => {
    applyThemeToDOM(settings.darkMode, settings.accentColor);
    set({
      darkMode: settings.darkMode,
      accentColor: settings.accentColor,
    });
  },
}));
